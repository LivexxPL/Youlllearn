import { describe, expect, it } from 'vitest';
import { createDb, type PolyglotDB } from './db';
import {
  addSample,
  addWordToReviews,
  cachedAnalysis,
  createPlaylist,
  createSong,
  deleteSong,
  listSongs,
  musicStats,
  recordMusicSession,
  saveAnalysis,
  setWordMeaning,
  setWordStatus,
  songMastered,
  toggleInPlaylist,
  updateSong,
} from './music';
import { aggregateStats, refreshAchievements, type SessionOutcomes } from './progress';
import { getWallet } from './economy';
import { readAll, exportData, importData, validateBackup, BackupError, resetAll } from './backup';
import { mergeData } from './cloud/merge';
import { parseLyrics } from '../music/lyrics';
import { lineRef, wordCardId, type Song } from '../music/types';
import { songWordItems, withSongWords } from '../music/reviewItems';
import { buildReviewSession } from '../engine/reviewSession';
import { getCourse } from '../content/registry';
import { DAY, type Outcome } from '../engine/srs';
import { REWARDS, practiceCoins } from '../config/economy';

const newDb = () => createDb(`test-music-${Math.random()}`);
const NOON = new Date('2026-10-13T12:00:00').getTime();

function session(refs: [string, boolean][], extra: Partial<SessionOutcomes> = {}): SessionOutcomes {
  const byRef = new Map<string, Outcome[]>(refs.map(([r, ok]) => [r, [{ correct: ok, skill: 'recall' }]]));
  const correct = refs.filter(([, ok]) => ok).length;
  return { byRef, graded: refs.length, correct, xp: correct * 10, bestRun: correct, speaking: 0, writing: 0, ...extra };
}

async function spanishSong(d: PolyglotDB, now = NOON): Promise<Song> {
  return createSong(
    {
      lang: 'es',
      title: '  Prueba  ',
      artist: 'Yo',
      videoId: 'dQw4w9WgXcQ',
      lyrics: parseLyrics('[00:01.00]Los pollitos dicen\n[00:04.00]pío, pío, pío\n[00:07.00]cuando tienen hambre\n[00:10.00]cuando tienen frío'),
      translation: 'Kurczaczki mówią\npi, pi, pi',
    },
    d,
    now,
  );
}

const mark = (songId: string, key: string, lineId = 'l1') => ({ lang: 'es' as const, word: { key, lemma: key, surface: key }, songId, lineId });

describe('songs', () => {
  it('stores the learner lyrics with timing and the pasted translation', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    expect(song.title).toBe('Prueba');
    expect(song.format).toBe('lrc');
    expect(song.lines).toHaveLength(4);
    expect(song.lines[0]).toMatchObject({ id: 'l1', start: 1, end: 4, pl: 'Kurczaczki mówią', plBy: 'user' });
    expect(song.lines[2].pl).toBeUndefined();
    expect((await listSongs(d)).map((s) => s.id)).toEqual([song.id]);
  });

  it('adds a public-domain sample once', async () => {
    const d = newDb();
    const a = await addSample('donguri', d);
    const b = await addSample('donguri', d);
    expect(a.id).toBe('sample-donguri');
    expect(b.createdAt).toBe(a.createdAt);
    expect(a.readings?.l3).toEqual({ '7:今日': 'こんにち' });
    expect(a.lines.every((l) => l.pl)).toBe(true);
    await expect(addSample('nope', d)).rejects.toThrow();
  });

  it('deletes a song as an empty record that wins over older synchronised copies', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    const pl = await createPlaylist('Ulubione', [song.id], d);
    await saveAnalysis(song, song.lines.map(() => []), d);
    const before = await readAll(d);
    await deleteSong(song.id, d, NOON + 1000);
    expect(await listSongs(d)).toEqual([]);
    const tomb = await d.songs.get(song.id);
    expect(tomb).toMatchObject({ deletedAt: NOON + 1000, lines: [], title: '' });
    expect((await d.playlists.get(pl.id))?.songIds).toEqual([]);
    expect(await d.songCache.get(song.id)).toBeUndefined();
    // The cloud copy still has the song: the deletion is newer and wins.
    const merged = mergeData(await readAll(d), before);
    expect((merged.songs as Song[]).find((s) => s.id === song.id)?.deletedAt).toBe(NOON + 1000);
  });

  it('merges practice results of two devices and keeps the newer text', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    const a: Song = { ...song, updatedAt: NOON + 10, title: 'A', progress: { lines: { l1: { seen: 3, correct: 1, last: 5 } }, sessions: 2 } };
    const b: Song = { ...song, updatedAt: NOON + 20, title: 'B', progress: { lines: { l1: { seen: 1, correct: 1, last: 9 }, l2: { seen: 1, correct: 0, last: 9 } }, sessions: 1 } };
    const local = { ...(await readAll(d)), songs: [a] };
    const merged = mergeData(local, { songs: [b] }).songs as Song[];
    expect(merged[0].title).toBe('B');
    expect(merged[0].progress).toEqual({ lines: { l1: { seen: 3, correct: 1, last: 9 }, l2: { seen: 1, correct: 0, last: 9 } }, sessions: 2 });
  });

  it('keeps the analysis cache only for the current lyrics', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await saveAnalysis(song, song.lines.map(() => []), d);
    expect(await cachedAnalysis(song, d)).not.toBeNull();
    const edited = { ...song, lines: [...song.lines, { id: 'l5', text: 'nuevo' }] };
    expect(await cachedAnalysis(edited, d)).toBeNull();
  });

  it('toggles songs in playlists', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    const p = await createPlaylist('  ', [], d);
    expect(p.name).toBe('Playlista');
    expect(await toggleInPlaylist(p.id, song.id, d)).toBe(true);
    expect((await d.playlists.get(p.id))?.songIds).toEqual([song.id]);
    expect(await toggleInPlaylist(p.id, song.id, d)).toBe(false);
  });
});

describe('words from songs in the regular reviews', () => {
  it('creates a review card for an own word and shares the card of a course word', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await expect(addWordToReviews(mark(song.id, 'pollitos'), undefined, d)).rejects.toThrow(/meaning/);
    const own = await addWordToReviews(mark(song.id, 'pollitos'), 'kurczaczki', d, NOON);
    expect(own.created).toBe(true);
    expect(own.entry).toMatchObject({ id: 'es:pollitos', status: 'learning', pl: 'kurczaczki', contexts: [{ songId: song.id, lineId: 'l1' }] });
    const card = await d.cards.get('w:es:pollitos');
    expect(card).toMatchObject({ courseId: 'es', kind: 'item' });
    expect(card!.due - NOON).toBeLessThanOrEqual(DAY);

    // "dos" is taught by the course: the course item's card is used, no own card.
    const course = await addWordToReviews(mark(song.id, 'dos', 'l3'), undefined, d, NOON);
    expect(course.entry.courseItemId).toBe('es.dos');
    expect(wordCardId(course.entry)).toBe('es.dos');
    expect(await d.cards.get('es.dos')).toBeTruthy();
    expect((await addWordToReviews(mark(song.id, 'dos', 'l4'), undefined, d, NOON)).created).toBe(false);
    expect((await d.words.get('es:dos'))?.contexts).toHaveLength(2);
    // The relative "cuando" is not the course's question word "¿cuándo?".
    await expect(addWordToReviews(mark(song.id, 'cuando', 'l3'), undefined, d, NOON)).rejects.toThrow(/meaning/);
  });

  it('feeds own words into review sessions', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await addWordToReviews(mark(song.id, 'pollitos'), 'kurczaczki', d, NOON);
    const words = await d.words.toArray();
    const items = songWordItems(words, await d.songs.toArray());
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 'w:es:pollitos', text: 'pollitos', pl: 'kurczaczki', example: { text: 'Los pollitos dicen', pl: 'Kurczaczki mówią' } });
    const course = withSongWords(getCourse('es'), items);
    const steps = buildReviewSession({ course, cards: await d.cards.toArray(), now: NOON + 2 * DAY, mode: 'standard', seed: 1, showRomaji: false });
    expect(steps.some((s) => s.refs.includes('w:es:pollitos'))).toBe(true);
  });

  it('records meanings, known marks and clears a meaning', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await setWordMeaning(mark(song.id, 'hambre', 'l3'), ' głód ', 'user', d);
    expect(await d.words.get('es:hambre')).toMatchObject({ pl: 'głód', plBy: 'user', status: 'new' });
    await setWordStatus(mark(song.id, 'hambre', 'l3'), 'known', d);
    expect((await d.words.get('es:hambre'))?.status).toBe('known');
    await setWordMeaning(mark(song.id, 'hambre', 'l3'), '', 'user', d);
    const w = await d.words.get('es:hambre');
    expect(w?.pl).toBeUndefined();
    expect(w?.plBy).toBeUndefined();
  });

  it('does not count added words for the vocabulary badges until they are practised', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    for (let i = 0; i < 60; i++) await addWordToReviews(mark(song.id, `palabra${i}`), `słowo ${i}`, d, NOON);
    const stats = await aggregateStats(NOON, d);
    expect(stats.itemsStarted).toBe(0);
    expect(stats.music.words).toBe(0);
    expect((await refreshAchievements(d)).map((a) => a.id)).not.toContain('words-50');
  });
});

describe('practice sessions', () => {
  it('records cards, line progress, statistics and coins in one go', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await setWordMeaning(mark(song.id, 'pollitos'), 'kurczaczki', 'user', d);
    const refs: [string, boolean][] = [
      ['w:es:pollitos', true],
      ...song.lines.map((l, i): [string, boolean] => [lineRef(song.id, l.id), i !== 3]),
      ['w:es:unknown-word', true], // no entry with a meaning: no card
    ];
    const res = await recordMusicSession(song, session(refs), 's1', d, NOON);
    expect(res.newWords).toBe(1);
    expect(res.linesCorrect).toBe(3);
    expect(await d.cards.get('w:es:pollitos')).toBeTruthy();
    expect(await d.cards.get('w:es:unknown-word')).toBeUndefined();
    expect((await d.words.get('es:pollitos'))?.status).toBe('learning');
    const stored = (await d.songs.get(song.id))!;
    expect(stored.progress.sessions).toBe(1);
    expect(stored.progress.lines.l1).toEqual({ seen: 1, correct: 1, last: NOON });
    expect(stored.progress.lines.l4).toEqual({ seen: 1, correct: 0, last: NOON });
    const day = await d.dailyStats.get('2026-10-13');
    expect(day).toMatchObject({ exercises: 6, correct: 5, newItems: 1, xp: 50 });
    // Five correct answers (one word, three lines… and the word without entry still counts as
    // a correct answer) → the smallest practice tier.
    expect(res.coins.map((e) => e.amount)).toEqual([practiceCoins(5)]);
    expect(res.coins[0]).toMatchObject({ family: 'music', type: 'practice' });
  });

  it('pays once per word or line per day, however often the song is practised', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    const refs = song.lines.map((l): [string, boolean] => [lineRef(song.id, l.id), true]);
    const words = ['a', 'b', 'c'].map((k): [string, boolean] => [`es.fake-${k}`, true]);
    const first = await recordMusicSession(song, session([...refs, ...words]), 's1', d, NOON);
    expect(first.coins).toHaveLength(1);
    // Same report twice (double callback) and a second session the same day: no more coins.
    expect((await recordMusicSession(song, session([...refs, ...words]), 's1', d, NOON + 1)).coins).toEqual([]);
    expect((await recordMusicSession(song, session([...refs, ...words]), 's2', d, NOON + 2)).coins).toEqual([]);
    // The next day the same lines teach again and pay again.
    expect((await recordMusicSession(song, session([...refs, ...words]), 's3', d, NOON + DAY)).coins).toHaveLength(1);
    // Wrong answers never pay.
    const wrong = song.lines.map((l): [string, boolean] => [lineRef(song.id, l.id), false]);
    expect((await recordMusicSession(song, session(wrong), 's4', d, NOON + 2 * DAY)).coins).toEqual([]);
    const wallet = await getWallet(d);
    expect(wallet.balance).toBe(2 * practiceCoins(7));
  });

  it('needs a few answers before a session counts for the song', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await recordMusicSession(song, session([[lineRef(song.id, 'l1'), true]]), 's1', d, NOON);
    expect((await d.songs.get(song.id))?.progress.sessions).toBe(0);
  });

  it('unlocks music badges from practice, and mastery needs every line', async () => {
    const d = newDb();
    const song = await addSample('pollitos', d);
    const all = song.lines.map((l): [string, boolean] => [lineRef(song.id, l.id), true]);
    await recordMusicSession(song, session(all.slice(0, 6)), 's1', d, NOON);
    let ids = (await refreshAchievements(d)).map((a) => a.id);
    expect(ids).toContain('music-first');
    expect(ids).not.toContain('music-mastered');
    await recordMusicSession((await d.songs.get(song.id))!, session(all.slice(6)), 's2', d, NOON + 10);
    expect(songMastered((await d.songs.get(song.id))!)).toBe(true);
    ids = (await refreshAchievements(d)).map((a) => a.id);
    expect(ids).toContain('music-mastered');
    expect(musicStats(await d.songs.toArray(), []).lines).toBe(song.lines.length);
  });

  it('ignores a session for a song deleted meanwhile', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await deleteSong(song.id, d);
    const res = await recordMusicSession(song, session([[lineRef(song.id, 'l1'), true]]), 's1', d, NOON);
    expect(res.linesCorrect).toBe(0);
    expect((await d.songs.get(song.id))?.deletedAt).toBeTruthy();
  });
});

describe('backups and reset', () => {
  it('round-trips Music Lab data; device-only tables stay out', async () => {
    const d = newDb();
    const song = await spanishSong(d);
    await updateSong(song.id, { favorite: true }, d);
    await addWordToReviews(mark(song.id, 'pollitos'), 'kurczaczki', d);
    await saveAnalysis(song, [], d);
    await d.songState.put({ id: song.id, position: 42, lastOpenedAt: NOON });
    const file = await exportData(d);
    expect(file.format).toBe(3);
    expect(Object.keys(file.data)).not.toContain('songCache');
    expect(Object.keys(file.data)).not.toContain('songState');

    const other = newDb();
    await other.songState.put({ id: 'x', position: 1, lastOpenedAt: 1 });
    await importData(validateBackup(JSON.parse(JSON.stringify(file))), other);
    expect((await other.songs.get(song.id))?.favorite).toBe(true);
    expect(await other.words.get('es:pollitos')).toBeTruthy();
    expect(await other.songState.count()).toBe(0);

    await resetAll(other);
    expect(await other.songs.count()).toBe(0);
    expect(await other.songCache.count()).toBe(0);
  });

  it('rejects damaged Music Lab tables', () => {
    const base = { app: 'polyglot-quest', format: 3, exportedAt: '', appVersion: '', data: {} };
    expect(() => validateBackup({ ...base, data: { songs: [{ id: 's', lang: 'es', lines: 'x', updatedAt: 1 }] } })).toThrow(BackupError);
    expect(() => validateBackup({ ...base, data: { words: [{ id: 'w', lang: 'es', status: 'maybe' }] } })).toThrow(BackupError);
    expect(() => validateBackup({ ...base, data: { playlists: [{ id: 'p' }] } })).toThrow(BackupError);
    expect(validateBackup({ ...base, format: 2, data: {} }).format).toBe(2);
  });
});

it('keeps the reward rule documented in the config', () => {
  expect(REWARDS.practice.tiers.at(-1)?.[0]).toBe(5);
});
