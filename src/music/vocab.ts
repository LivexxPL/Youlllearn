/**
 * Words of a song: splitting lines into words (Spanish, German) or taking the content words of
 * the Japanese analysis, and looking them up in the course vocabulary. A course match gives
 * a Polish meaning written for the course and the level where the course teaches the word.
 * Words outside the course get a meaning only from the learner or the optional AI assistant.
 */
import type { Course, CourseId, Item } from '../content/types';
import { stripRuby } from '../engine/kana';
import { normalize } from '../engine/answer';
import { baseReading, chunkTokens, isContentToken, posLabel, type JaToken } from './japanese/tokens';
import type { WordEntry } from './types';

export interface SongWord {
  /** Key shared by every occurrence: Japanese dictionary form, or the lower-cased word. */
  key: string;
  /** As written in this line. */
  surface: string;
  /** Japanese: dictionary form and its reading (hiragana). */
  lemma: string;
  reading?: string;
  pos?: string;
  lineId: string;
  /** Japanese: chunk position in the line; other languages: character offset. */
  at: number;
}

const ARTICLES: Partial<Record<CourseId, RegExp>> = {
  es: /^(el|la|los|las|un|una|unos|unas)\s+/,
  de: /^(der|die|das|ein|eine|einen)\s+/,
};

/** Word characters: letters, combining marks, inner apostrophes and hyphens. */
const WORD_RE = /\p{L}[\p{L}\p{M}]*(?:['’-]\p{L}[\p{L}\p{M}]*)*['’]?/gu;

/** Spanish and German words of a line, with their positions. */
export function splitWords(text: string): { word: string; at: number }[] {
  return [...text.matchAll(WORD_RE)].map((m) => ({ word: m[0], at: m.index ?? 0 }));
}

export function wordKey(lang: CourseId, word: string): string {
  if (lang === 'ja') return word;
  return word.toLocaleLowerCase(lang).replace(/['’]$/, '');
}

export function wordEntryId(lang: CourseId, key: string): string {
  return `${lang}:${key}`;
}

/** Words worth learning in a line (Japanese needs the analysis of that line). */
export function lineWords(lang: CourseId, lineId: string, text: string, tokens?: readonly JaToken[]): SongWord[] {
  if (lang === 'ja') {
    if (!tokens) return [];
    return chunkTokens(tokens)
      .filter((c) => isContentToken(tokens[c.head]))
      .map((c) => {
        const head = tokens[c.head];
        return {
          key: head.base,
          surface: tokens.slice(c.from, c.to).map((t) => t.s).join(''),
          lemma: head.base,
          reading: baseReading(head) || undefined,
          pos: posLabel(head) || undefined,
          lineId,
          at: c.from,
        };
      });
  }
  return splitWords(text).map(({ word, at }) => ({ key: wordKey(lang, word), surface: word, lemma: wordKey(lang, word), lineId, at }));
}

// ---------------------------------------------------------------------------
// Course dictionary

export interface CourseMatch {
  item: Item;
  /** Level label of the unit that teaches the item. */
  level: string;
  /** Found by a simple ending rule (plural etc.), not an exact match. */
  guess?: boolean;
}

export interface CourseDictionary {
  lookup(word: Pick<SongWord, 'key' | 'surface' | 'reading'>): CourseMatch | null;
  /** Level labels in course order (for difficulty). */
  levels: string[];
}

const dictionaries = new Map<CourseId, CourseDictionary>();

function textForms(lang: CourseId, item: Item): string[] {
  const out: string[] = [];
  for (const variant of [item.text, ...(item.alts ?? [])]) {
    for (const part of stripRuby(variant).split(/\s+\/\s+/)) {
      let p = part.trim();
      if (lang !== 'ja') p = p.toLocaleLowerCase(lang).replace(ARTICLES[lang] ?? /^$/, '').replace(/[¡!¿?.,;:]/g, '').trim();
      if (p) out.push(p);
    }
  }
  return out;
}

export function courseDictionary(course: Course): CourseDictionary {
  const cached = dictionaries.get(course.id);
  if (cached) return cached;
  const byText = new Map<string, CourseMatch>();
  const byReading = new Map<string, CourseMatch>();
  const levels: string[] = [];
  for (const unit of course.units) {
    const level = unit.level ?? '';
    if (level && !levels.includes(level)) levels.push(level);
    for (const lesson of unit.lessons) {
      for (const item of lesson.items) {
        if (item.kind === 'kana' || item.kind === 'kanji') continue;
        const match: CourseMatch = { item, level };
        // The first (earliest) lesson that teaches a word wins.
        for (const form of textForms(course.id, item)) if (!byText.has(form)) byText.set(form, match);
        if (course.id === 'ja' && item.reading && !byReading.has(item.reading)) byReading.set(item.reading, match);
      }
    }
  }
  const dict: CourseDictionary = {
    levels,
    lookup(word) {
      if (course.id === 'ja') {
        const hit = byText.get(word.key);
        if (hit) return hit;
        // Kana-only spelling of a word the course writes with kanji (e.g. わたし / 私).
        const kanaOnly = /^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u.test(word.key);
        if (kanaOnly) return byReading.get(word.key) ?? null;
        return null;
      }
      const key = word.key;
      const exact = byText.get(key);
      if (exact) return exact;
      for (const stem of endingVariants(course.id, key)) {
        const hit = byText.get(stem);
        if (hit) return { ...hit, guess: true };
      }
      return null;
    },
  };
  dictionaries.set(course.id, dict);
  return dict;
}

/** Candidate base forms by common endings (plural, diminutive); results are marked as guesses. */
function endingVariants(lang: CourseId, w: string): string[] {
  const out: string[] = [];
  if (lang === 'es') {
    if (w.endsWith('es')) out.push(w.slice(0, -2));
    if (w.endsWith('s')) out.push(w.slice(0, -1));
    const dim = /^(.+?)(?:c?it)(o|a)s?$/.exec(w);
    if (dim) out.push(dim[1] + dim[2]);
  } else if (lang === 'de') {
    for (const end of ['en', 'er', 'e', 'n', 's']) if (w.endsWith(end) && w.length - end.length >= 3) out.push(w.slice(0, -end.length));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Meanings shown for a word

export interface WordInfo {
  word: SongWord;
  /** The learner's own entry (known / learning, own meaning). */
  entry?: WordEntry;
  course?: CourseMatch | null;
  /** Meaning to show and where it comes from. */
  meaning?: string;
  meaningBy?: 'user' | 'ai' | 'course';
}

export function wordInfo(word: SongWord, dict: CourseDictionary, entries: ReadonlyMap<string, WordEntry>, lang: CourseId): WordInfo {
  const entry = entries.get(wordEntryId(lang, word.key));
  const course = dict.lookup(word);
  if (entry?.pl) return { word, entry, course, meaning: entry.pl, meaningBy: entry.plBy ?? 'user' };
  if (course && !course.guess) return { word, entry, course, meaning: course.item.pl, meaningBy: 'course' };
  return { word, entry, course };
}

/** Compares answers like the rest of the app (case, accents, punctuation). */
export function sameWord(lang: CourseId, a: string, b: string): boolean {
  return normalize(a, lang) === normalize(b, lang);
}
