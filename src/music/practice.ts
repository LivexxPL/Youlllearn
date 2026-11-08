/**
 * Words of a song prepared for display and practice: each word with its meaning (course,
 * the learner's own or AI), its review card and whether the learner knows it.
 */
import type { Course } from '../content/types';
import type { JaToken } from './japanese/tokens';
import { withReadings } from './japanese/tokens';
import type { PracticeWord } from './exercises';
import { wordCardId, type Song, type WordEntry } from './types';
import { courseDictionary, lineWords, wordInfo, type SongWord, type WordInfo } from './vocab';

/** Japanese tokens per line id with the learner's reading corrections applied. */
export function songTokens(song: Song, cached: Readonly<Record<string, JaToken[]>> | undefined): Record<string, JaToken[]> | undefined {
  if (song.lang !== 'ja' || !cached) return undefined;
  return Object.fromEntries(song.lines.map((l) => [l.id, withReadings(cached[l.id] ?? [], song.readings?.[l.id])]));
}

export function songWords(song: Song, tokens: Readonly<Record<string, readonly JaToken[]>> | undefined): SongWord[] {
  return song.lines.flatMap((l) => lineWords(song.lang, l.id, l.text, tokens?.[l.id]));
}

/** Card a word's answers go to: the learner's entry, else the course item with the same word. */
export function wordRef(info: WordInfo): string | undefined {
  if (info.entry && (info.entry.pl || info.entry.courseItemId)) return wordCardId(info.entry);
  if (info.course && !info.course.guess) return info.course.item.id;
  return undefined;
}

export function practiceWords(song: Song, course: Course, tokens: Readonly<Record<string, readonly JaToken[]>> | undefined, entries: ReadonlyMap<string, WordEntry>): PracticeWord[] {
  const dict = courseDictionary(course);
  return songWords(song, tokens).map((w) => {
    const info = wordInfo(w, dict, entries, song.lang);
    const ref = info.meaning ? wordRef(info) : undefined;
    return { word: w, meaning: info.meaning, ref, known: info.entry?.status === 'known' };
  });
}
