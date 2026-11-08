/**
 * Music Lab: a song from a YouTube link with the learner's own timed lyrics, the lyrics
 * following the video, words going into the regular reviews, a practice session that plays
 * lines from the video, Japanese analysis in the browser, and clear errors for links and videos
 * that cannot be used. YouTube is replaced by a fake IFrame API (e2e/youtube.ts).
 */
import { expect, test, type Page } from '@playwright/test';
import { onboard, playSession } from './helpers';
import { fakeYouTube, setVideoTime, videoTime } from './youtube';

const LRC = [
  '[ti:Los pollitos dicen]',
  '[00:02.00]Los pollitos dicen',
  '[00:05.00]pío, pío, pío,',
  '[00:08.00]cuando tienen hambre,',
  '[00:11.00]cuando tienen frío.',
  '',
  '[00:15.00]La gallina busca',
  '[00:18.00]el maíz y el trigo,',
  '[00:21.00]les da la comida',
  '[00:24.00]y les presta abrigo.',
].join('\n');

const TRANSLATION = [
  'Kurczaczki mówią',
  'pi, pi, pi,',
  'kiedy są głodne,',
  'kiedy jest im zimno.',
  'Kura szuka',
  'kukurydzy i pszenicy,',
  'daje im jedzenie',
  'i ogrzewa je.',
].join('\n');

async function addSong(page: Page, link = 'https://youtu.be/dQw4w9WgXcQ') {
  await page.goto('./#/music');
  await page.getByTestId('music-add').click();
  await page.getByTestId('music-link').fill(link);
  await page.getByTestId('music-lyrics').fill(LRC);
  await expect(page.getByTestId('music-parse-summary')).toContainText('LRC');
  // The LRC file's [ti:] tag fills the title.
  await expect(page.getByTestId('music-title')).toHaveValue('Los pollitos dicen');
  await page.getByTestId('music-artist').fill('Tradycyjna');
  await page.getByTestId('music-translation').fill(TRANSLATION);
  await page.getByTestId('music-save').click();
  await expect(page.getByTestId('song-screen')).toBeVisible();
}

/** Raw IndexedDB read, to check what was stored. */
async function idb<T>(page: Page, body: string): Promise<T> {
  return page.evaluate(
    (fn) =>
      new Promise<unknown>((resolve, reject) => {
        const req = indexedDB.open('polyglot-quest');
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const run = new Function('db', 'resolve', 'reject', fn) as (db: IDBDatabase, res: (v: unknown) => void, rej: (e: unknown) => void) => void;
          run(req.result, resolve, reject);
        };
      }),
    body,
  ) as Promise<T>;
}

const allSongs = (page: Page) =>
  idb<{ id: string; progress: { sessions: number; lines: Record<string, { seen: number }> } }[]>(
    page,
    `const r = db.transaction('songs').objectStore('songs').getAll(); r.onsuccess = () => { resolve(r.result); db.close(); }; r.onerror = () => reject(r.error);`,
  );

test.describe('Music Lab', () => {
  test.beforeEach(async ({ context }) => {
    await fakeYouTube(context);
  });

  test('lyrics follow the YouTube video; a line can be played, looped and sung karaoke-style', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await addSong(page);
    await expect(page.locator('.fake-yt')).toBeVisible();

    await page.getByTestId('player-toggle').click();
    await setVideoTime(page, 5.5);
    await expect(page.getByTestId('lyric-l2')).toHaveAttribute('aria-current', 'true');
    await expect(page.getByTestId('lyric-l2')).toContainText('pi, pi, pi');
    await setVideoTime(page, 9);
    await expect(page.getByTestId('lyric-l3')).toHaveAttribute('aria-current', 'true');
    await expect(page.getByTestId('lyric-l2')).not.toHaveAttribute('aria-current', 'true');

    // The time of a line plays the video from that line.
    await page.getByTestId('lyric-l5').getByRole('button', { name: /Odtwórz od/ }).click();
    await expect(page.getByTestId('lyric-l5')).toHaveAttribute('aria-current', 'true');
    expect(await videoTime(page)).toBeGreaterThanOrEqual(15);

    // Looping the line: past its end the video jumps back to its start.
    await page.getByTestId('loop-toggle').click();
    await setVideoTime(page, 17.97);
    await expect.poll(() => videoTime(page)).toBeLessThan(17.5);
    await page.getByTestId('loop-toggle').click();

    // Slower playback for listening.
    await page.getByRole('button', { name: '0.75×' }).click();
    await expect(page.getByRole('button', { name: '0.75×' })).toHaveAttribute('aria-pressed', 'true');

    // Karaoke: the line being sung, big, with the translation.
    await page.getByRole('switch', { name: 'Karaoke' }).click();
    await setVideoTime(page, 21.5);
    await expect(page.getByTestId('karaoke')).toContainText('les da la comida');
    await expect(page.getByTestId('karaoke')).toContainText('daje im jedzenie');
  });

  test('a word from a song goes into the regular reviews', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await addSong(page);
    await page.getByTestId('lyric-l1').getByRole('button', { name: 'pollitos' }).click();
    await expect(page.getByTestId('word-sheet')).toBeVisible();
    await expect(page.getByTestId('word-meaning')).toContainText('nie ma w słowniku kursu');
    await page.getByTestId('word-meaning-input').fill('kurczaczki');
    await page.getByTestId('word-add').click();
    await expect(page.getByTestId('word-in-reviews')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('lyric-l1').locator('.lw--learning')).toHaveText('pollitos');

    await page.getByRole('button', { name: 'Słówka' }).click();
    await expect(page.getByTestId('words-tab')).toContainText('kurczaczki');

    const card = await idb<{ courseId: string } | undefined>(
      page,
      `const r = db.transaction('cards').objectStore('cards').get('w:es:pollitos'); r.onsuccess = () => { resolve(r.result); db.close(); };`,
    );
    expect(card?.courseId).toBe('es');
    // The review list of the course shows the word with its meaning.
    await page.goto('./#/review');
    await expect(page.getByText('kurczaczki')).toBeVisible();
  });

  test('practice plays lines from the visible video and records the song progress', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await addSong(page);
    await page.getByTestId('song-practice').click();
    // The video stays visible above the exercises.
    await expect(page.locator('.session__stage .fake-yt')).toBeVisible();
    const steps = await playSession(page);
    expect(steps).toContain('summary');
    await expect(page.getByRole('heading', { name: 'Piosenka przećwiczona!' })).toBeVisible();
    // Listening and dictation jumped to the start of a sung line instead of using a synthetic voice.
    const seeks = await page.evaluate(() => (window as unknown as { __ytSeeks?: number[] }).__ytSeeks ?? []);
    expect(seeks.some((s) => [2, 5, 8, 11, 15, 18, 21, 24].includes(s))).toBe(true);
    await page.getByTestId('summary-home').click();
    await expect(page.getByTestId('song-screen')).toBeVisible();
    const [song] = await allSongs(page);
    expect(song.progress.sessions).toBe(1);
    expect(Object.keys(song.progress.lines).length).toBeGreaterThan(0);
  });

  test('explains links and videos that cannot be used', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.goto('./#/music/new');
    await page.getByTestId('music-link').fill('https://vimeo.com/12345');
    await expect(page.getByTestId('music-link-error')).toHaveText('To nie jest link do YouTube.');
    await page.getByTestId('music-link').fill('https://www.youtube.com/playlist?list=PL0123456');
    await expect(page.getByTestId('music-link-error')).toContainText('playlisty');
    // The owner of this (fake) video does not allow embedding: the app says so and links to YouTube.
    await page.getByTestId('music-link').fill('https://youtu.be/errEmbed123');
    await expect(page.getByTestId('music-link-error')).toHaveCount(0);
    await page.getByTestId('music-title').fill('Nie do osadzenia');
    await page.getByTestId('music-lyrics').fill('uno\ndos\ntres');
    await page.getByTestId('music-save').click();
    await expect(page.getByTestId('video-problem')).toHaveAttribute('data-kind', 'notEmbeddable');
    await expect(page.getByRole('link', { name: 'Otwórz w YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=errEmbed123');
    // Lyrics without times: no highlighting, an offer to synchronise them.
    await expect(page.getByText('Tekst nie ma czasów')).toBeVisible();
  });

  test('tap-sync sets the start of each line from the video', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.goto('./#/music/new');
    await page.getByTestId('music-link').fill('dQw4w9WgXcQ');
    await page.getByTestId('music-title').fill('Do synchronizacji');
    await page.getByTestId('music-lyrics').fill('uno\ndos\ntres');
    await page.getByTestId('music-save').click();
    await page.getByRole('button', { name: 'Synchronizuj tekst' }).first().click();
    await expect(page.getByTestId('sync-editor')).toBeVisible();
    await expect(page.getByTestId('sync-tap')).toBeEnabled();
    for (const [i, t] of [3, 6.5, 10].entries()) {
      await setVideoTime(page, t);
      await page.getByTestId('sync-tap').click();
      await expect(page.getByTestId(`sync-line-l${i + 1}`)).toContainText(String(Math.floor(t)));
    }
    await page.getByTestId('sync-save').click();
    await expect(page.getByTestId('song-screen')).toBeVisible();
    await page.getByTestId('player-toggle').click();
    await setVideoTime(page, 7);
    await expect(page.getByTestId('lyric-l2')).toHaveAttribute('aria-current', 'true');
  });

  test('Japanese: the analysis runs in the browser — furigana, kana, romaji and course meanings', async ({ page }) => {
    await onboard(page, { courses: ['ja'] });
    await page.goto('./#/music');
    await page.getByTestId('sample-donguri').click();
    // First use downloads the dictionary (served by the app) and analyses the lyrics.
    await expect(page.locator('[data-testid="lyric-l2"] ruby').first()).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('lyric-l2')).toContainText('oike ni hamatte sā taihen');
    await page.getByRole('switch', { name: 'Hiragana' }).click();
    // 今日は is read as the greeting こんにちは (a reading correction that comes with the sample).
    await expect(page.getByTestId('lyric-l3')).toContainText('どじょうがでてきて こんにちは');
    // 遊ぶ: the course teaches あそぶ, so its meaning comes from the course.
    await page.getByTestId('lyric-l4').getByRole('button', { name: /遊/ }).click();
    await expect(page.getByTestId('word-meaning')).toContainText('bawić się');
    await page.keyboard.press('Escape');
    // The analysis is cached on the device: no new download after a reload.
    let downloads = 0;
    page.on('request', (r) => {
      if (r.url().includes('/kuromoji/')) downloads += 1;
    });
    await page.reload();
    await expect(page.locator('[data-testid="lyric-l2"] ruby').first()).toBeVisible();
    expect(downloads).toBe(0);
  });

  test('the AI assistant stays optional; its key is kept on the device', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.goto('./#/music/ai');
    await expect(page.getByTestId('ai-settings')).toContainText('4 $ / 20 $');
    await page.getByTestId('ai-key').fill('not-a-key');
    await page.getByTestId('ai-save').click();
    await expect(page.getByText('To nie wygląda na klucz API Anthropic')).toBeVisible();
    await page.getByTestId('ai-model-claude-haiku-5-5').click();
    await page.getByTestId('ai-key').fill('sk-ant-api03-test-key-0123456789abcdef');
    await page.getByTestId('ai-save').click();
    await expect(page.getByText('Zapisany klucz: sk-ant-…cdef')).toBeVisible();
    const ai = await idb<{ value: { model: string } } | undefined>(page, `const r = db.transaction('meta').objectStore('meta').get('ai'); r.onsuccess = () => { resolve(r.result); db.close(); };`);
    expect(ai?.value.model).toBe('claude-haiku-5-5');
    await page.getByTestId('ai-remove').click();
    await expect(page.getByText('Zapisany klucz')).toHaveCount(0);
  });
});
