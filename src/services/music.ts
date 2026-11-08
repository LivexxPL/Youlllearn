/**
 * Music Lab storage: songs, playlists and words met in songs (learner data, synchronised like
 * the rest), the device-only analysis cache and playback positions, and the results of song
 * practice sessions — review cards, line progress, statistics and coins.
 *
 * Rewards follow the app's rules: coins only for correct answers in exercises, at most once
 * per word or line per day (the 'music' practice family); playing a video earns nothing.
 */
import type { CourseId } from '../content/types';
import { getCourse } from '../content/registry';
import { db, type LedgerEntry, type PolyglotDB, type SongCacheRecord } from './db';
import { addStats, type SessionOutcomes } from './progress';
import { grant, practiceEntry } from './economy';
import { introduceCard, reviewCard, type Card, type Outcome } from '../engine/srs';
import { dayKey } from '../engine/dates';
import { fingerprint } from './cloud/merge';
import type { ParsedLyrics } from '../music/lyrics';
import { applyTranslation } from '../music/lyrics';
import { isWordCardId, parseLineRef, wordCardId, type LyricLine, type Playlist, type Song, type WordEntry, type WordStatus } from '../music/types';
import { SAMPLES, sampleLines, sampleReadings } from '../music/samples';
import { courseDictionary, wordEntryId, type SongWord } from '../music/vocab';
import type { JaToken } from '../music/japanese/tokens';

const randomId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const LIMITS = {
  title: 120,
  artist: 120,
  /** Lines per song: enough for long songs, keeps a pasted book out of the sync copy. */
  lines: 400,
  lineLength: 300,
  playlistName: 60,
  meaning: 200,
} as const;

export function emptyProgress(): Song['progress'] {
  return { lines: {}, sessions: 0 };
}

/** Visible songs (deleted ones stay as empty records for synchronisation). */
export async function listSongs(database: PolyglotDB = db): Promise<Song[]> {
  return (await database.songs.toArray()).filter((s) => !s.deletedAt);
}

export interface NewSong {
  lang: CourseId;
  title: string;
  artist: string;
  videoId: string | null;
  lyrics: ParsedLyrics;
  /** Optional translation pasted by the learner, one line per lyric line. */
  translation?: string;
}

export function cleanLines(lines: readonly LyricLine[]): LyricLine[] {
  return lines.slice(0, LIMITS.lines).map((l) => ({ ...l, text: l.text.slice(0, LIMITS.lineLength) }));
}

export async function createSong(input: NewSong, database: PolyglotDB = db, now = Date.now()): Promise<Song> {
  let lines = cleanLines(input.lyrics.lines);
  if (input.translation?.trim()) lines = applyTranslation(lines, input.translation).lines;
  const song: Song = {
    id: randomId('song'),
    lang: input.lang,
    title: input.title.trim().slice(0, LIMITS.title) || 'Bez tytułu',
    artist: input.artist.trim().slice(0, LIMITS.artist),
    videoId: input.videoId,
    lines,
    format: input.lyrics.format,
    delay: 0,
    favorite: false,
    progress: emptyProgress(),
    createdAt: now,
    updatedAt: now,
  };
  await database.songs.add(song);
  return song;
}

/** Adds a public-domain sample (once; a deleted sample comes back fresh). */
export async function addSample(sampleId: string, database: PolyglotDB = db, now = Date.now()): Promise<Song> {
  const sample = SAMPLES.find((s) => s.id === sampleId);
  if (!sample) throw new Error(`Unknown sample ${sampleId}`);
  const id = `sample-${sample.id}`;
  const existing = await database.songs.get(id);
  if (existing && !existing.deletedAt) return existing;
  const song: Song = {
    id,
    lang: sample.lang,
    title: sample.title,
    artist: sample.artist,
    videoId: null,
    lines: sampleLines(sample),
    format: 'plain',
    delay: 0,
    favorite: false,
    sample: { id: sample.id, source: sample.source },
    progress: emptyProgress(),
    createdAt: now,
    updatedAt: now,
  };
  const readings = sampleReadings(sample);
  if (readings) song.readings = readings;
  await database.songs.put(song);
  return song;
}

export async function updateSong(id: string, patch: Partial<Omit<Song, 'id' | 'createdAt'>>, database: PolyglotDB = db, now = Date.now()): Promise<void> {
  await database.songs.update(id, { ...patch, updatedAt: now });
}

/** Deletes a song: an empty record remains, so a synchronised copy does not restore it. */
export async function deleteSong(id: string, database: PolyglotDB = db, now = Date.now()): Promise<void> {
  await database.transaction('rw', [database.songs, database.playlists, database.songCache, database.songState], async () => {
    const song = await database.songs.get(id);
    if (!song) return;
    await database.songs.put({
      id,
      lang: song.lang,
      title: '',
      artist: '',
      videoId: null,
      lines: [],
      format: 'plain',
      delay: 0,
      favorite: false,
      progress: emptyProgress(),
      createdAt: song.createdAt,
      updatedAt: now,
      deletedAt: now,
    });
    for (const p of await database.playlists.toArray()) {
      if (p.songIds.includes(id)) await database.playlists.put({ ...p, songIds: p.songIds.filter((s) => s !== id), updatedAt: now });
    }
    await database.songCache.delete(id);
    await database.songState.delete(id);
  });
}

// ---------------------------------------------------------------------------
// Playlists

export async function createPlaylist(name: string, songIds: string[] = [], database: PolyglotDB = db, now = Date.now()): Promise<Playlist> {
  const p: Playlist = { id: randomId('pl'), name: name.trim().slice(0, LIMITS.playlistName) || 'Playlista', songIds: [...new Set(songIds)], createdAt: now, updatedAt: now };
  await database.playlists.add(p);
  return p;
}

export async function updatePlaylist(id: string, patch: Partial<Pick<Playlist, 'name' | 'songIds'>>, database: PolyglotDB = db, now = Date.now()) {
  const clean: Partial<Playlist> = { ...patch, updatedAt: now };
  if (patch.name !== undefined) clean.name = patch.name.trim().slice(0, LIMITS.playlistName) || 'Playlista';
  if (patch.songIds) clean.songIds = [...new Set(patch.songIds)];
  await database.playlists.update(id, clean);
}

export async function toggleInPlaylist(playlistId: string, songId: string, database: PolyglotDB = db, now = Date.now()): Promise<boolean> {
  return database.transaction('rw', database.playlists, async () => {
    const p = await database.playlists.get(playlistId);
    if (!p || p.deletedAt) return false;
    const has = p.songIds.includes(songId);
    await database.playlists.put({ ...p, songIds: has ? p.songIds.filter((s) => s !== songId) : [...p.songIds, songId], updatedAt: now });
    return !has;
  });
}

export async function deletePlaylist(id: string, database: PolyglotDB = db, now = Date.now()) {
  const p = await database.playlists.get(id);
  if (p) await database.playlists.put({ ...p, name: '', songIds: [], updatedAt: now, deletedAt: now });
}

// ---------------------------------------------------------------------------
// Device-only state

export async function saveSongPosition(id: string, position: number, database: PolyglotDB = db, now = Date.now()) {
  await database.songState.put({ id, position: Math.max(0, Math.round(position * 10) / 10), lastOpenedAt: now });
}

export const ANALYSIS_VERSION = 1;

export function linesHash(lines: readonly LyricLine[]): string {
  return fingerprint(lines.map((l) => l.text));
}

/** Cached analysis of the song's current lines, if any. */
export async function cachedAnalysis(song: Song, database: PolyglotDB = db): Promise<SongCacheRecord | null> {
  const rec = await database.songCache.get(song.id);
  return rec && rec.hash === linesHash(song.lines) && rec.v === ANALYSIS_VERSION ? rec : null;
}

export async function saveAnalysis(song: Song, tokens: JaToken[][], database: PolyglotDB = db): Promise<SongCacheRecord> {
  const rec: SongCacheRecord = {
    id: song.id,
    hash: linesHash(song.lines),
    v: ANALYSIS_VERSION,
    lines: Object.fromEntries(song.lines.map((l, i) => [l.id, tokens[i] ?? []])),
  };
  await database.songCache.put(rec);
  return rec;
}

// ---------------------------------------------------------------------------
// Words

export interface WordMark {
  lang: CourseId;
  word: Pick<SongWord, 'key' | 'lemma' | 'reading' | 'pos' | 'surface'>;
  songId: string;
  lineId: string;
}

/** Course item the word matches exactly (its card is shared), if any. */
function courseItemFor(lang: CourseId, word: WordMark['word']): string | undefined {
  const m = courseDictionary(getCourse(lang)).lookup({ key: word.key, surface: word.surface, reading: word.reading });
  return m && !m.guess ? m.item.id : undefined;
}

async function upsertWord(mark: WordMark, patch: Partial<WordEntry>, database: PolyglotDB, now: number): Promise<WordEntry> {
  const id = wordEntryId(mark.lang, mark.word.key);
  const prev = await database.words.get(id);
  const base: WordEntry = prev ?? { id, lang: mark.lang, lemma: mark.word.lemma, status: 'new', contexts: [], createdAt: now, updatedAt: now };
  const ctx = { songId: mark.songId, lineId: mark.lineId };
  const known = base.contexts.some((c) => c.songId === ctx.songId && c.lineId === ctx.lineId);
  const entry: WordEntry = { ...base, ...patch, contexts: known ? base.contexts : [...base.contexts, ctx].slice(-20), updatedAt: now };
  if (!entry.reading && mark.word.reading) entry.reading = mark.word.reading;
  if (!entry.pos && mark.word.pos) entry.pos = mark.word.pos;
  const courseItemId = entry.courseItemId ?? courseItemFor(mark.lang, mark.word);
  if (courseItemId) entry.courseItemId = courseItemId;
  if (!entry.pl) {
    delete entry.pl;
    delete entry.plBy;
  }
  await database.words.put(entry);
  return entry;
}

export async function setWordMeaning(mark: WordMark, pl: string, by: 'user' | 'ai' = 'user', database: PolyglotDB = db, now = Date.now()) {
  const text = pl.trim().slice(0, LIMITS.meaning);
  return upsertWord(mark, text ? { pl: text, plBy: by } : { pl: undefined, plBy: undefined }, database, now);
}

export async function setWordStatus(mark: WordMark, status: WordStatus, database: PolyglotDB = db, now = Date.now()) {
  return upsertWord(mark, { status }, database, now);
}

/**
 * Puts a word into the reviews: marks it as learning and creates its review card (the course
 * item's card when the course teaches the word). A word needs a meaning to be reviewed.
 */
export async function addWordToReviews(mark: WordMark, meaning: string | undefined, database: PolyglotDB = db, now = Date.now()): Promise<{ entry: WordEntry; created: boolean }> {
  return database.transaction('rw', [database.words, database.cards], async () => {
    const entry = await upsertWord(mark, { status: 'learning', ...(meaning ? { pl: meaning.trim().slice(0, LIMITS.meaning), plBy: 'user' as const } : {}) }, database, now);
    const cardId = wordCardId(entry);
    if (!entry.courseItemId && !entry.pl) throw new Error('A word needs a meaning before it can be reviewed');
    if (await database.cards.get(cardId)) return { entry, created: false };
    // Seen once, like an item introduced in a lesson: first review in a few minutes.
    await database.cards.put(introduceCard(cardId, mark.lang, 'item', [{ correct: true, skill: 'recognition', usedHint: true }], now));
    return { entry, created: true };
  });
}

// ---------------------------------------------------------------------------
// Practice sessions

export interface MusicSessionResult {
  /** Review cards created by this session (words met for the first time). */
  newWords: number;
  /** Existing cards updated. */
  reviewed: number;
  /** Lines answered correctly in this session. */
  linesCorrect: number;
  coins: LedgerEntry[];
  xp: number;
}

/** A session counts for the song's progress from this many graded answers. */
export const MIN_SESSION_ANSWERS = 4;

/**
 * Records a song practice session in one transaction: review cards for the words practised
 * (new cards like after a lesson, earlier cards reviewed), the result of each line, the
 * session count, statistics and coins. Coins are paid for words and lines answered
 * correctly that have not earned music coins today; the session id keeps a repeated report
 * from paying twice.
 */
export async function recordMusicSession(
  song: Song,
  outcomes: SessionOutcomes,
  sessionId: string,
  database: PolyglotDB = db,
  now = Date.now(),
): Promise<MusicSessionResult> {
  let newWords = 0;
  let reviewed = 0;
  let linesCorrect = 0;
  let coins: LedgerEntry[] = [];
  const tables = [database.cards, database.words, database.songs, database.ledger];
  await database.transaction('rw', tables, async () => {
    const itemRefs: [string, Outcome[]][] = [];
    const lineRefs: [string, Outcome[]][] = [];
    for (const entry of outcomes.byRef) (parseLineRef(entry[0]) ? lineRefs : itemRefs).push(entry);

    // Words: own words need their entry (with a meaning); course words are course items.
    const existing = new Map((await database.cards.bulkGet(itemRefs.map(([id]) => id))).filter((c): c is Card => Boolean(c)).map((c) => [c.id, c]));
    const writes: Card[] = [];
    for (const [id, outs] of itemRefs) {
      const prev = existing.get(id);
      if (prev) {
        writes.push(reviewCard(prev, outs[0], now));
        reviewed += 1;
        continue;
      }
      if (isWordCardId(id)) {
        const entry = await database.words.get(id.slice(2));
        if (!entry || entry.status === 'known' || !entry.pl) continue;
        if (entry.status !== 'learning') await database.words.put({ ...entry, status: 'learning', updatedAt: now });
      }
      writes.push(introduceCard(id, song.lang, 'item', outs, now));
      newWords += 1;
    }
    if (writes.length) await database.cards.bulkPut(writes);

    // Lines: practice results of the song.
    const current = await database.songs.get(song.id);
    if (current && !current.deletedAt) {
      const lines = { ...current.progress.lines };
      for (const [ref, outs] of lineRefs) {
        const { lineId } = parseLineRef(ref)!;
        const prev = lines[lineId] ?? { seen: 0, correct: 0, last: 0 };
        const ok = outs.some((o) => o.correct);
        if (ok) linesCorrect += 1;
        lines[lineId] = { seen: prev.seen + 1, correct: prev.correct + (ok ? 1 : 0), last: now };
      }
      const counts = outcomes.graded >= MIN_SESSION_ANSWERS;
      await database.songs.put({
        ...current,
        progress: {
          lines,
          sessions: current.progress.sessions + (counts ? 1 : 0),
          ...(counts ? { lastPracticedAt: now } : current.progress.lastPracticedAt ? { lastPracticedAt: current.progress.lastPracticedAt } : {}),
        },
        updatedAt: now,
      });
    }

    const correctRefs = [...outcomes.byRef].filter(([, outs]) => outs.some((o) => o.correct)).map(([ref]) => ref);
    const e = await practiceEntry('music', sessionId, correctRefs, now, database);
    if (e) coins = await grant([e], database);
  });

  await addStats(
    {
      exercises: outcomes.graded,
      correct: outcomes.correct,
      newItems: newWords,
      reviews: reviewed,
      xp: outcomes.xp,
      bestRun: outcomes.bestRun,
      speaking: outcomes.speaking,
    },
    song.lang,
    dayKey(now),
    database,
  );
  return { newWords, reviewed, linesCorrect, coins, xp: outcomes.xp };
}

// ---------------------------------------------------------------------------
// Statistics for achievements

export interface MusicStats {
  /** Practice sessions finished (with enough answers). */
  sessions: number;
  /** Different songs practised. */
  songs: number;
  /** Different lines answered correctly at least once. */
  lines: number;
  /** Own words from songs answered correctly in reviews or practice (beyond adding them). */
  words: number;
  /** A song of at least 8 lines with every line answered correctly at least once. */
  mastered: boolean;
}

export const MASTERED_MIN_LINES = 8;

export function songMastered(song: Song): boolean {
  return !song.deletedAt && song.lines.length >= MASTERED_MIN_LINES && song.lines.every((l) => (song.progress.lines[l.id]?.correct ?? 0) > 0);
}

export function musicStats(songs: readonly Song[], cards: readonly Card[]): MusicStats {
  const live = songs.filter((s) => !s.deletedAt);
  return {
    sessions: live.reduce((n, s) => n + s.progress.sessions, 0),
    songs: live.filter((s) => s.progress.sessions > 0).length,
    lines: live.reduce((n, s) => n + Object.values(s.progress.lines).filter((l) => l.correct > 0).length, 0),
    // The card's first answer is the "seen" mark of adding the word; later ones are real.
    words: cards.filter((c) => isWordCardId(c.id) && c.correct >= 2).length,
    mastered: live.some(songMastered),
  };
}

/** Music practice coins already earned today (for the "earned today" hint). */
export async function musicRefsRewardedToday(database: PolyglotDB = db, at = Date.now()): Promise<number> {
  const today = await database.ledger.where('date').equals(dayKey(at)).toArray();
  return today.filter((e) => e.type === 'practice' && e.family === 'music').reduce((n, e) => n + (e.cards?.length ?? 0), 0);
}
