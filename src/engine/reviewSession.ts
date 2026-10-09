/**
 * Review sessions: due cards (or weak cards) turned into varied exercises.
 * The exercise type for each card rotates across skills so recall is
 * practised in different ways (recognition, listening, recall, spelling,
 * dictation, sentence production, speaking, writing).
 */
import type { Course, Item, Sentence } from '../content/types';
import { selectQueue, type Card, type Skill } from './srs';
import {
  authoredExercise,
  exerciseForSkill,
  orderExercise,
  sentenceDictationExercise,
  sentenceListeningExercise,
  sentenceProductionExercise,
  speakSentenceExercise,
  type Exercise,
  type GenContext,
} from './exercises';
import { createRng, shuffle, type Rng } from './random';

export type ReviewMode = 'standard' | 'quick' | 'weak' | 'extra' | 'lesson';

export interface ReviewOptions {
  course: Course;
  cards: Card[];
  now: number;
  mode: ReviewMode;
  limit?: number;
  lessonId?: string;
  seed: string | number;
  showRomaji: boolean;
  strokeChars?: ReadonlySet<string>;
  /** Allow speaking steps (self-assessed) in reviews. */
  speaking?: boolean;
}

export const REVIEW_LIMITS: Record<ReviewMode, number> = { standard: 15, quick: 5, weak: 12, extra: 12, lesson: 12 };

function skillCandidates(item: Item, hasStrokes: boolean, speaking: boolean): Skill[] {
  if (item.kind === 'kana') return hasStrokes ? ['recognition', 'listening', 'recall', 'writing'] : ['recognition', 'listening', 'recall'];
  if (item.kind === 'kanji') return hasStrokes ? ['recognition', 'recall', 'writing'] : ['recognition', 'recall'];
  const base: Skill[] = ['recognition', 'listening', 'recall', 'production', 'dictation'];
  if (speaking) base.push('speaking');
  return base;
}

/**
 * Chooses the next skill for a card. Production-type practice is favoured
 * (not forced) once an item is recognised but has never been produced;
 * otherwise the least recently practised and weakest skill wins. Skills
 * already used often in this session are penalised to keep sessions varied.
 */
export function chooseSkill(card: Card, candidates: Skill[], rng: Rng, used?: Map<Skill, number>): Skill {
  const usedCount = (s: Skill) => used?.get(s) ?? 0;
  const production = candidates.filter((s) => s === 'production' || s === 'dictation' || s === 'writing');
  if (card.productionOk === 0 && card.recognitionOk >= 1 && production.length && rng() < 0.6) {
    return [...production].sort((a, b) => usedCount(a) - usedCount(b) || rng() - 0.5)[0];
  }
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const s of candidates) {
    const st = card.skills[s];
    // Never practised → high score; weak (fails) → higher; long ago → higher.
    const age = st ? Math.min(1000, (card.lastReviewed - st.last) / 3_600_000) : 1000;
    const weakness = st ? st.fail * 2 - st.ok * 0.5 : 0;
    const score = age + weakness * 24 + rng() * 6 - usedCount(s) * 150;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

function sentenceExercise(s: Sentence, card: Card, ctx: GenContext, rng: Rng, speaking: boolean): Exercise | null {
  const options: (() => Exercise | null)[] = [
    () => sentenceListeningExercise(s, ctx, false),
    () => orderExercise(s, ctx, card.reps >= 2),
    () => sentenceDictationExercise(s, ctx),
    () => sentenceListeningExercise(s, ctx, true),
  ];
  if (card.productionOk >= 2 && s.text.length <= 40) options.push(() => sentenceProductionExercise(s, ctx));
  if (speaking) options.push(() => speakSentenceExercise(s, ctx, card.reps >= 2 ? 'shadow' : 'repeat'));
  const start = (card.reviews + Math.floor(rng() * options.length)) % options.length;
  for (let i = 0; i < options.length; i++) {
    const ex = options[(start + i) % options.length]();
    if (ex) return ex;
  }
  return null;
}

export function buildReviewSession(o: ReviewOptions): Exercise[] {
  const { course } = o;
  const rng = createRng(o.seed);
  const limit = o.limit ?? REVIEW_LIMITS[o.mode];
  const courseCards = o.cards.filter((c) => c.courseId === course.id);
  const focusIds = o.lessonId
    ? new Set(courseCards.filter((c) => course.lessonOf.get(c.id) === o.lessonId).map((c) => c.id))
    : undefined;

  let queue: Card[];
  if (o.mode === 'weak') queue = selectQueue(courseCards, o.now, { limit, onlyStruggling: true });
  else if (o.mode === 'lesson' && focusIds) queue = selectQueue(courseCards.filter((c) => focusIds.has(c.id)), o.now, { limit, fillWithUpcoming: true });
  else queue = selectQueue(courseCards, o.now, { limit, focusIds, fillWithUpcoming: o.mode === 'extra' });

  // Distractors come from lessons the learner has reached.
  const maxLesson = Math.max(0, ...courseCards.map((c) => course.lessonIndex.get(course.lessonOf.get(c.id) ?? '') ?? 0));
  const pool = course.lessons.slice(0, maxLesson + 1).flatMap((l) => l.items);
  const sentencePool = course.lessons.slice(0, maxLesson + 1).flatMap((l) => l.sentences);
  const ctx: GenContext = { course, rng, pool, sentencePool, showRomaji: o.showRomaji };

  const exercises: Exercise[] = [];
  const used = new Map<Skill, number>();
  for (const card of queue) {
    let ex: Exercise | null = null;
    if (card.kind === 'item') {
      const item = course.items.get(card.id);
      if (!item) continue;
      const hasStrokes = Boolean(o.strokeChars?.has(item.writeChars ?? item.text));
      const skill = chooseSkill(card, skillCandidates(item, hasStrokes, Boolean(o.speaking)), rng, used);
      used.set(skill, (used.get(skill) ?? 0) + 1);
      ex = exerciseForSkill(item, skill, ctx) ?? exerciseForSkill(item, 'recognition', ctx);
    } else if (card.kind === 'sentence') {
      const s = course.sentences.get(card.id);
      if (s) ex = sentenceExercise(s, card, ctx, rng, Boolean(o.speaking));
    } else if (card.kind === 'grammar') {
      const list = course.conceptExercises.get(card.id);
      if (list?.length) ex = authoredExercise(list[card.reviews % list.length], ctx);
    }
    if (ex) exercises.push(ex);
  }

  const mixed = interleave(exercises, rng);
  if (mixed.length) mixed.push({ kind: 'summary', key: 'summary', refs: [], hints: true });
  return mixed;
}

/** Shuffles while avoiding two consecutive exercises of the same kind where possible. */
export function interleave(list: Exercise[], rng: Rng): Exercise[] {
  const pool = shuffle(list, rng);
  const out: Exercise[] = [];
  while (pool.length) {
    const prev = out.at(-1);
    const idx = pool.findIndex((e) => !prev || signature(e) !== signature(prev));
    out.push(pool.splice(idx >= 0 ? idx : 0, 1)[0]);
  }
  return out;
}

export function signature(e: Exercise): string {
  if (e.kind === 'choice') return `choice:${e.mode}`;
  if (e.kind === 'type') return `type:${e.mode}`;
  return e.kind;
}
