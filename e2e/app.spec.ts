import { expect, test, type Page } from '@playwright/test';
import { drawStroke, onboard, playSession, playStep } from './helpers';

/** The home screen's "lessons done" tile, e.g. 1/23 (independent of the course length). */
const lessonsDone = (page: Page, done: number) => page.locator('.stat__value').filter({ hasText: new RegExp(`^${done}/\\d+$`) });

test.describe('first run', () => {
  test('onboarding sets up the course and the home screen answers "what now?"', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveURL(/#\/onboarding/);
    await onboard(page, { courses: ['de'], goal: 20 });
    // Home: one primary action, today's goal and the active course.
    await expect(page.getByRole('heading', { name: 'Powitania' })).toBeVisible();
    await expect(page.getByText('/ 20 min')).toBeVisible();
    await expect(page.getByRole('button', { name: /Niemiecki/ }).first()).toBeVisible();

    // Every main section is reachable from the navigation.
    for (const [name, heading] of [
      ['Nauka', /Ścieżka nauki/],
      ['Powtórki', /Powtórki/],
      ['Postępy', /Postępy/],
      ['Ustawienia', /Ustawienia/],
    ] as const) {
      await page.getByRole('navigation').getByRole('link', { name }).click();
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    }
    await page.getByRole('navigation').getByRole('link', { name: /Audio/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Audio Quest' })).toBeVisible();

    // Settings survive a reload (IndexedDB).
    await page.reload();
    await page.getByRole('navigation').getByRole('link', { name: 'Start' }).click();
    await expect(page.getByText('/ 20 min')).toBeVisible();
  });
});

test.describe('learning loop', () => {
  test('a full Spanish lesson records progress and fills the review queue', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/#\/lesson\/es\.l01/);
    const kinds = await playSession(page);
    // The lesson mixes several exercise types (not only multiple choice).
    const types = new Set(kinds.filter((k) => !['continue', 'feedback', 'summary', 'unknown'].includes(k)));
    expect(types.size).toBeGreaterThanOrEqual(3);
    await expect(page.getByText('Lekcja ukończona!')).toBeVisible();
    await page.getByTestId('summary-home').click();

    await expect(lessonsDone(page, 1)).toBeVisible();
    await page.getByRole('navigation').getByRole('link', { name: 'Powtórki' }).click();
    await expect(page.getByRole('heading', { name: 'Wszystkie elementy' })).toBeVisible();
    // Right after the lesson nothing is due yet; the empty state offers extra practice,
    // which must start a session (only the query changes, so the screen has to restart).
    await page.goto('./#/review/session?mode=standard');
    await page.getByRole('button', { name: 'Dodatkowa praktyka' }).click();
    await expect(page.locator('.session')).toBeVisible();
    await playSession(page);
    await expect(page.getByText('Powtórka zakończona')).toBeVisible();
  });

  test('a learner who knows A1 can start at A2 and keeps going from there', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.getByRole('navigation').getByRole('link', { name: 'Nauka' }).click();
    await expect(page.locator('.unit__level', { hasText: 'A2' }).first()).toBeVisible();
    await page.getByTestId('level-jump-A2').click();
    // The preview says earlier lessons are assumed; the first A2 lesson starts anyway.
    await expect(page.getByText('Ta lekcja zakłada znajomość poprzednich')).toBeVisible();
    await page.getByTestId('start-lesson').click();
    await expect(page).toHaveURL(/#\/lesson\/es\.l15/);
    await playSession(page);
    await expect(page.getByText('Lekcja ukończona!')).toBeVisible();
    await page.getByTestId('summary-home').click();
    // "Continue" now points at the next A2 lesson, not back at lesson 1.
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/#\/lesson\/es\.l16/);
  });

  test('an interrupted lesson can be resumed', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.goto('./#/lesson/es.l01');
    await expect(page.locator('.session')).toBeVisible();
    for (let done = 0, guard = 0; done < 6 && guard < 50; guard++) {
      if ((await playStep(page)) !== 'unknown') done++;
    }
    // Leaving mid-lesson returns home; the home screen offers to resume.
    if (await page.getByTestId('feedback-continue').isVisible()) await page.getByTestId('feedback-continue').click();
    await page.getByTestId('session-close').click();
    await page.getByTestId('quit-confirm').click();
    await expect(page.getByTestId('continue')).toBeVisible();
    await page.getByRole('button', { name: 'Wróć do przerwanej lekcji' }).click();
    await expect(page.getByTestId('resume')).toBeVisible();
    await page.getByTestId('resume').click();
    await expect(page.locator('.session')).toBeVisible();
  });
});

test.describe('Audio Quest', () => {
  test('audio flashcards and the hands-free player work without voices installed', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.goto('./#/lesson/es.l01');
    await playSession(page);
    await page.getByTestId('summary-home').click();

    await page.goto('./#/audio/flashcards');
    for (let i = 0; i < 20; i++) {
      if (await page.getByTestId('flashcards-done').isVisible()) break;
      await page.getByTestId('fc-reveal').click();
      await page.getByTestId('rate-good').click();
    }
    await expect(page.getByTestId('flashcards-done')).toBeVisible();

    await page.goto('./#/audio');
    await page.getByTestId('handsfree-start').click();
    await expect(page.getByTestId('hf-toggle')).toBeVisible();
    await page.getByTestId('hf-next').click();
    await expect(page.getByText(/^2 z \d+$/).first()).toBeVisible();
    await page.getByRole('button', { name: 'Tryb kieszonkowy' }).click();
    await expect(page.getByTestId('pocket')).toBeVisible();
    await page.getByTestId('pocket').press('Escape');
    await expect(page.getByTestId('pocket')).toBeHidden();
  });
});

test.describe('Japanese writing', () => {
  test('kana chart, stroke-order practice and saved drawings', async ({ page }) => {
    await onboard(page, { courses: ['ja'] });
    await page.goto('./#/kana');
    await expect(page.getByRole('group', { name: 'Podstawowe' }).getByRole('button')).toHaveCount(46);

    await page.goto('./#/write');
    await page.getByTestId('write-あ').click();
    await expect(page.locator('.stroke-guide')).toBeVisible();
    await drawStroke(page);
    await page.getByTestId('write-compare').click();
    await expect(page.getByText('Narysowano 1 kreskę, wzór ma 3 kreski.')).toBeVisible();
    await page.waitForTimeout(800); // autosave debounce

    await page.goto('./#/write');
    await expect(page.getByText(/Ćwiczone znaki: 1 z/)).toBeVisible();
  });

  test('handwritten lesson notes are kept after a reload', async ({ page }) => {
    await onboard(page, { courses: ['ja'] });
    await page.goto('./#/notes/ja.l01');
    await drawStroke(page);
    await expect(page.getByText('Zapisano')).toBeVisible();
    await page.reload();
    await page.goto('./#/write');
    await expect(page.locator('ul.list').getByRole('button', { name: /Hiragana: あ–こ/ })).toBeVisible();
  });
});

test.describe('data safety', () => {
  test('export, reset and import restore progress', async ({ page }) => {
    await onboard(page, { courses: ['es'] });
    await page.goto('./#/lesson/es.l01');
    await playSession(page);
    await page.getByTestId('summary-home').click();
    await expect(lessonsDone(page, 1)).toBeVisible();

    await page.goto('./#/settings');
    const download = page.waitForEvent('download');
    await page.getByTestId('export').click();
    const file = await download;
    const path = await file.path();
    expect(file.suggestedFilename()).toMatch(/\.json$/);

    await page.getByRole('button', { name: 'Usuń wszystkie postępy' }).click();
    // Typed key by key: the field must keep focus while the screen re-renders.
    await page.locator('#reset-confirm').click();
    await page.keyboard.type('USUŃ', { delay: 30 });
    await expect(page.locator('#reset-confirm')).toHaveValue('USUŃ');
    await page.getByRole('dialog').getByRole('button', { name: 'Usuń wszystkie postępy' }).click();
    await expect(page).toHaveURL(/#\/onboarding/);

    await onboard(page, { courses: ['es'] });
    await expect(lessonsDone(page, 0)).toBeVisible();
    await page.goto('./#/settings');
    page.once('dialog', (d) => d.accept());
    await page.getByTestId('import-input').setInputFiles(path);
    await expect(page.getByText('Import zakończony.')).toBeVisible();
    await page.getByRole('navigation').getByRole('link', { name: 'Start' }).click();
    await expect(lessonsDone(page, 1)).toBeVisible();
  });
});
