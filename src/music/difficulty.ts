/**
 * How hard a song is, measured — not guessed:
 * - coverage: which share of the song's words the course teaches, and up to which level;
 * - the learner's share: words the learner already knows (review cards or marked as known);
 * - length and, for Japanese, the number of different kanji.
 *
 * The estimated level is the first course level whose vocabulary covers at least 60% of the
 * words. It is an orientation based on this course's vocabulary, not an official CEFR or JLPT
 * classification (JLPT labels come from the course units' references).
 */
import type { Course, CourseId } from '../content/types';
import { isKanji } from '../engine/kana';
import type { Card } from '../engine/srs';
import type { SongWord, CourseDictionary } from './vocab';
import { wordEntryId } from './vocab';
import type { WordEntry } from './types';
import { wordCardId } from './types';

export const COVERAGE_TARGET = 0.6;
/** Fewer words than this give no estimate. */
export const MIN_WORDS = 8;

export interface LevelShare {
  level: string;
  /** Share of the song's words taught up to and including this level (cumulative). */
  cumulative: number;
}

export interface SongDifficulty {
  words: number;
  unique: number;
  levels: LevelShare[];
  /** Share of words the course does not teach. */
  outside: number;
  /** Course level label, 'beyond' (mostly words outside the course) or null (too short). */
  estimate: string | null;
  /** Share of the song's different words the learner knows. */
  known: number;
  /** Japanese: different kanji in the lyrics. */
  kanji?: number;
  lines: number;
}

export function songDifficulty(opts: {
  lang: CourseId;
  course: Course;
  dict: CourseDictionary;
  words: readonly SongWord[];
  lineTexts: readonly string[];
  entries: ReadonlyMap<string, WordEntry>;
  cards: ReadonlyMap<string, Card>;
}): SongDifficulty {
  const { lang, dict, words, entries, cards } = opts;
  const levelIndex = new Map(dict.levels.map((l, i) => [l, i]));
  const counts = new Array(dict.levels.length).fill(0) as number[];
  let outside = 0;
  for (const w of words) {
    const m = dict.lookup(w);
    const i = m ? levelIndex.get(m.level) : undefined;
    if (i === undefined) outside += 1;
    else counts[i] += 1;
  }
  const total = words.length;
  let running = 0;
  const levels = dict.levels.map((level, i) => {
    running += counts[i];
    return { level, cumulative: total ? running / total : 0 };
  });
  let estimate: string | null = null;
  if (total >= MIN_WORDS) estimate = levels.find((l) => l.cumulative >= COVERAGE_TARGET)?.level ?? 'beyond';

  const unique = new Map<string, SongWord>();
  for (const w of words) if (!unique.has(w.key)) unique.set(w.key, w);
  let known = 0;
  for (const w of unique.values()) {
    const entry = entries.get(wordEntryId(lang, w.key));
    if (entry?.status === 'known') {
      known += 1;
      continue;
    }
    const match = dict.lookup(w);
    const cardId = entry ? wordCardId(entry) : match && !match.guess ? match.item.id : null;
    const card = cardId ? cards.get(cardId) : undefined;
    if (card && card.correct > 1) known += 1;
  }

  const kanji = lang === 'ja' ? new Set([...opts.lineTexts.join('')].filter(isKanji)).size : undefined;
  return {
    words: total,
    unique: unique.size,
    levels,
    outside: total ? outside / total : 0,
    estimate,
    known: unique.size ? known / unique.size : 0,
    ...(kanji !== undefined ? { kanji } : {}),
    lines: opts.lineTexts.length,
  };
}

/** Short label of a course level: "N5" for "A1 (JF) / N5", the CEFR label otherwise. */
export function shortLevel(level: string): string {
  const jlpt = /N[1-5]/.exec(level);
  if (jlpt) return jlpt[0];
  return level.replace(/\s*\(.*?\)\s*/g, '').trim() || level;
}
