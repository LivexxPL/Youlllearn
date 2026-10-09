/**
 * Audio Quest session builders (audio-first learning).
 */
import type { Course, Item, Sentence } from '../content/types';
import { gloss } from '../content/text';
import { cardPriority, retrievability, type Card } from './srs';
import {
  dictationItemExercise,
  listeningExercise,
  sentenceDictationExercise,
  sentenceListeningExercise,
  speakItemExercise,
  speakSentenceExercise,
  type Exercise,
  type GenContext,
} from './exercises';
import { createRng, shuffle, type Rng } from './random';

export type ListeningStage = 1 | 2 | 3;

export interface PlaylistEntry {
  key: string;
  refId: string;
  kind: 'item' | 'sentence';
  text: string;
  pl: string;
  tts?: string;
  reading?: string;
  romaji?: string;
  itemKind?: Item['kind'];
  accent?: string;
}

export interface AudioPool {
  items: Item[];
  sentences: Sentence[];
}

/** Seconds one playlist entry takes on average at each stage (target ×2, translation, pause to repeat). */
export const ENTRY_SECONDS: Record<ListeningStage, number> = { 1: 13, 2: 10, 3: 8 };

/** Material for audio sessions: a lesson, or the learner's cards (due and weakest first). */
export function audioPool(course: Course, cards: Card[], now: number, lessonId?: string, limit = 40): AudioPool {
  if (lessonId) {
    const lesson = course.lessons[course.lessonIndex.get(lessonId) ?? -1];
    if (lesson) return { items: lesson.items, sentences: lesson.sentences };
  }
  const own = cards
    .filter((c) => c.courseId === course.id)
    .sort((a, b) => cardPriority(b, now) - cardPriority(a, now) || retrievability(a, now) - retrievability(b, now))
    .slice(0, limit);
  return {
    items: own.map((c) => course.items.get(c.id)).filter((x): x is Item => Boolean(x)),
    sentences: own.map((c) => course.sentences.get(c.id)).filter((x): x is Sentence => Boolean(x)),
  };
}

function entryOf(x: Item | Sentence, kind: 'item' | 'sentence', i: number): PlaylistEntry {
  const isItem = kind === 'item';
  const item = isItem ? (x as Item) : undefined;
  const sent = !isItem ? (x as Sentence) : undefined;
  return {
    key: `${x.id}#${i}`,
    refId: x.id,
    kind,
    text: x.text,
    pl: isItem ? gloss(x as Item) : (x as Sentence).pl,
    tts: x.tts,
    reading: item?.reading,
    romaji: item?.romaji ?? sent?.romaji,
    itemKind: item?.kind,
    accent: sent?.accent,
  };
}

/** Every pool element once (items and sentences), e.g. for audio flashcards. */
export function poolEntries(pool: AudioPool): PlaylistEntry[] {
  return [...pool.items.map((x, i) => entryOf(x, 'item', i)), ...pool.sentences.map((x, i) => entryOf(x, 'sentence', i))];
}

/**
 * Hands-free playlist sized to the requested minutes. Sentences are mixed in
 * between words; the pool is cycled (re-shuffled) when it is shorter than
 * the session, because hearing material again is the point.
 */
export function buildPlaylist(pool: AudioPool, minutes: number, stage: ListeningStage, rng: Rng): PlaylistEntry[] {
  const base: PlaylistEntry[] = [];
  const items = shuffle(pool.items, rng);
  const sentences = shuffle(pool.sentences, rng);
  // Interleave roughly 2 words : 1 sentence.
  let i = 0;
  let s = 0;
  while (i < items.length || s < sentences.length) {
    for (let k = 0; k < 2 && i < items.length; k++) base.push(entryOf(items[i++], 'item', 0));
    if (s < sentences.length) base.push(entryOf(sentences[s++], 'sentence', 0));
  }
  if (base.length === 0) return [];
  const target = Math.max(1, Math.round((minutes * 60) / ENTRY_SECONDS[stage]));
  const out: PlaylistEntry[] = [];
  let cycle = 0;
  while (out.length < target) {
    const round = cycle === 0 ? base : shuffle(base, rng);
    for (const e of round) {
      if (out.length >= target) break;
      if (out.at(-1)?.refId === e.refId) continue;
      out.push({ ...e, key: `${e.refId}#${out.length}` });
    }
    cycle += 1;
    if (cycle > 50) break;
  }
  return out;
}

function ctxFor(course: Course, pool: AudioPool, seed: string | number, cards: Card[]): GenContext {
  const maxLesson = Math.max(0, ...cards.filter((c) => c.courseId === course.id).map((c) => course.lessonIndex.get(course.lessonOf.get(c.id) ?? '') ?? 0));
  return {
    course,
    rng: createRng(seed),
    pool: [...new Set([...pool.items, ...course.lessons.slice(0, maxLesson + 1).flatMap((l) => l.items)])],
    sentencePool: [...new Set([...pool.sentences, ...course.lessons.slice(0, maxLesson + 1).flatMap((l) => l.sentences)])],
    showRomaji: false,
  };
}

const summary = (): Exercise => ({ kind: 'summary', key: 'summary', refs: [], hints: true });

/** Listen-first review: hear a word or phrase, choose its meaning. */
export function buildListeningSteps(course: Course, cards: Card[], now: number, seed: string | number, limit = 12): Exercise[] {
  const pool = audioPool(course, cards, now);
  const ctx = ctxFor(course, pool, seed, cards);
  const steps: Exercise[] = [];
  for (const it of pool.items.slice(0, Math.ceil(limit * 0.7))) {
    const ex = listeningExercise(it, ctx);
    if (ex) steps.push(ex);
  }
  for (const s of pool.sentences.slice(0, Math.floor(limit * 0.3))) {
    const ex = sentenceListeningExercise(s, ctx, false);
    if (ex) steps.push(ex);
  }
  const out = shuffle(steps, ctx.rng).slice(0, limit);
  return out.length ? [...out, summary()] : [];
}

export function buildSpeakingSteps(course: Course, cards: Card[], now: number, seed: string | number, mode: 'repeat' | 'shadow', limit = 8): Exercise[] {
  const pool = audioPool(course, cards, now);
  const ctx = ctxFor(course, pool, seed, cards);
  const steps: Exercise[] =
    mode === 'shadow'
      ? pool.sentences.slice(0, limit).map((s) => speakSentenceExercise(s, ctx, 'shadow'))
      : [
          ...pool.sentences.slice(0, Math.ceil(limit / 2)).map((s) => speakSentenceExercise(s, ctx, 'repeat')),
          ...pool.items.filter((i) => i.kind !== 'kana').slice(0, Math.floor(limit / 2)).map((i) => speakItemExercise(i, ctx)),
        ];
  const out = shuffle(steps, ctx.rng).slice(0, limit);
  return out.length ? [...out, summary()] : [];
}

export function buildDictationSteps(course: Course, cards: Card[], now: number, seed: string | number, limit = 10): Exercise[] {
  const pool = audioPool(course, cards, now);
  const ctx = ctxFor(course, pool, seed, cards);
  const steps: Exercise[] = [
    ...pool.items.filter((i) => i.kind !== 'kana' && !i.text.includes('…') && !i.text.includes('〜')).slice(0, Math.ceil(limit * 0.6)).map((i) => dictationItemExercise(i, ctx)),
    ...pool.sentences.filter((s) => s.text.length <= 45).slice(0, Math.floor(limit * 0.4)).map((s) => sentenceDictationExercise(s, ctx)),
  ];
  const out = shuffle(steps, ctx.rng).slice(0, limit);
  return out.length ? [...out, summary()] : [];
}
