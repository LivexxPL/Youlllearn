/**
 * Spaced-repetition scheduler — a simplified, documented variant of SM-2
 * (Woźniak, 1990) with Anki-style learning steps. Full description and
 * rationale: docs/SRS_ALGORITHM.md.
 *
 * Key adaptations for language learning:
 *  - Grades come from exercise outcomes, not only self-ratings.
 *  - Recognition successes (multiple choice, listening choice) grow the
 *    interval more slowly than production successes (typing, dictation,
 *    speaking, writing), so one lucky multiple-choice answer cannot push an
 *    item far into the future.
 *  - "Established" requires a long interval *and* at least one successful
 *    production — recognising a word is not the same as being able to use it.
 *  - Repeated failures mark the card as "needs extra practice" so review
 *    sessions prioritise it.
 */
import type { CourseId } from '../content/types';
import { hashString } from './random';

export const MINUTE = 60_000;
export const DAY = 24 * 60 * MINUTE;

/** Learning steps for new and lapsed cards. */
export const LEARNING_STEPS = [10 * MINUTE, DAY];
export const START_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_EASE = 2.8;
/** Interval (days) from which a card counts as established. */
export const ESTABLISHED_DAYS = 21;
export const MAX_INTERVAL_DAYS = 365;

export type CardKind = 'item' | 'sentence' | 'grammar';

export type Skill =
  | 'recognition' // read target -> choose meaning
  | 'recall' // read meaning -> choose target
  | 'listening' // hear target -> choose meaning
  | 'production' // type target from meaning
  | 'dictation' // hear target -> type it
  | 'speaking' // repeat aloud / shadow (self-assessed or speech recognition)
  | 'writing' // handwriting (self-assessed)
  | 'grammar'; // grammar gap / choice exercise

export const PRODUCTION_SKILLS: readonly Skill[] = ['production', 'dictation', 'speaking', 'writing', 'grammar'];

export function isProductionSkill(skill: Skill): boolean {
  return PRODUCTION_SKILLS.includes(skill);
}

/** SM-2 quality scale: 0–2 failed recall, 3 hard, 4 good, 5 easy. */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;
export type SelfRating = 'again' | 'hard' | 'good' | 'easy';

export type CardPhase = 'learning' | 'review' | 'relearning';

export interface ReviewEvent {
  t: number;
  skill: Skill;
  grade: Grade;
}

export interface Card {
  id: string;
  courseId: CourseId;
  kind: CardKind;
  phase: CardPhase;
  step: number;
  ease: number;
  /** Current interval in days (0 while in short learning steps). */
  interval: number;
  /** Interval to resume with after relearning. */
  lapseInterval?: number;
  due: number;
  reps: number;
  lapses: number;
  reviews: number;
  correct: number;
  incorrect: number;
  lastReviewed: number;
  introducedAt: number;
  /** Last self-assessed confidence (1 again … 4 easy). */
  confidence?: 1 | 2 | 3 | 4;
  lastSkill?: Skill;
  productionOk: number;
  recognitionOk: number;
  /** Per-skill success counters used to rotate exercise types. */
  skills: Partial<Record<Skill, { ok: number; fail: number; last: number }>>;
  /** Last results, newest last (max 8). */
  recent: boolean[];
  history: ReviewEvent[];
}

export type CardStatus = 'new' | 'learning' | 'due' | 'established' | 'struggling';

export interface Outcome {
  correct: boolean;
  /** Accepted with a small issue (accent, typo) or after a hint. */
  almost?: boolean;
  usedHint?: boolean;
  skill: Skill;
  selfRating?: SelfRating;
}

export function gradeFromOutcome(o: Outcome): Grade {
  if (o.selfRating) return { again: 1, hard: 3, good: 4, easy: 5 }[o.selfRating] as Grade;
  if (!o.correct) return 1;
  if (o.almost || o.usedHint) return 3;
  return isProductionSkill(o.skill) ? 5 : 4;
}

export function newCard(id: string, courseId: CourseId, kind: CardKind, now: number): Card {
  return {
    id,
    courseId,
    kind,
    phase: 'learning',
    step: 0,
    ease: START_EASE,
    interval: 0,
    due: now,
    reps: 0,
    lapses: 0,
    reviews: 0,
    correct: 0,
    incorrect: 0,
    lastReviewed: 0,
    introducedAt: now,
    productionOk: 0,
    recognitionOk: 0,
    skills: {},
    recent: [],
    history: [],
  };
}

/**
 * Creates the card for an item met in a lesson. `outcomes` are all graded
 * events for the item during the lesson. A flawless lesson performance skips
 * the 10-minute step; any mistake keeps it so a short follow-up review helps.
 */
export function introduceCard(
  id: string,
  courseId: CourseId,
  kind: CardKind,
  outcomes: Outcome[],
  now: number,
): Card {
  const card = newCard(id, courseId, kind, now);
  for (const o of outcomes) recordStats(card, o, gradeFromOutcome(o), now);
  const flawless = outcomes.length > 0 && outcomes.every((o) => o.correct && !o.almost && !o.usedHint);
  card.step = flawless ? 1 : 0;
  card.due = now + LEARNING_STEPS[card.step];
  card.lastReviewed = now;
  return card;
}

function recordStats(card: Card, o: Outcome, grade: Grade, now: number) {
  const ok = grade >= 3;
  card.reviews += 1;
  if (ok) card.correct += 1;
  else card.incorrect += 1;
  card.lastSkill = o.skill;
  if (o.selfRating) card.confidence = ({ again: 1, hard: 2, good: 3, easy: 4 } as const)[o.selfRating];
  if (ok && isProductionSkill(o.skill)) card.productionOk += 1;
  if (ok && !isProductionSkill(o.skill)) card.recognitionOk += 1;
  const s = card.skills[o.skill] ?? { ok: 0, fail: 0, last: 0 };
  if (ok) s.ok += 1;
  else s.fail += 1;
  s.last = now;
  card.skills[o.skill] = s;
  card.recent = [...card.recent, ok].slice(-8);
  card.history = [...card.history, { t: now, skill: o.skill, grade }].slice(-30);
}

/** Small deterministic jitter (±5%) so reviews of items learnt together spread out. */
function fuzz(card: Card, days: number): number {
  if (days < 3) return days;
  const h = hashString(`${card.id}:${card.reviews}`) / 0xffffffff; // 0..1
  return days * (0.95 + h * 0.1);
}

export function nextEase(ease: number, grade: Grade): number {
  // Original SM-2 easiness update.
  const q = grade;
  const updated = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return Math.min(MAX_EASE, Math.max(MIN_EASE, updated));
}

/** Applies one graded review and returns the updated card (input is not mutated). */
export function reviewCard(input: Card, outcome: Outcome, now: number): Card {
  const card: Card = structuredClone(input);
  const grade = gradeFromOutcome(outcome);
  const ok = grade >= 3;
  recordStats(card, outcome, grade, now);
  const elapsedDays = card.lastReviewed ? Math.max(0, (now - card.lastReviewed) / DAY) : 0;
  card.lastReviewed = now;

  if (card.phase === 'learning' || card.phase === 'relearning') {
    if (!ok) {
      card.step = 0;
      card.due = now + LEARNING_STEPS[0];
      return card;
    }
    const lastStep = card.step >= LEARNING_STEPS.length - 1;
    if (grade === 5 || lastStep) {
      // Graduate.
      const resume = card.phase === 'relearning' ? Math.max(1, card.lapseInterval ?? 1) : grade === 5 && card.step === 0 ? 2 : 1;
      card.phase = 'review';
      card.step = 0;
      card.interval = resume;
      card.reps = Math.max(card.reps, 1);
      card.due = now + resume * DAY;
      return card;
    }
    card.step += 1;
    card.due = now + LEARNING_STEPS[card.step];
    return card;
  }

  // Review phase.
  if (!ok) {
    card.lapses += 1;
    card.reps = 0;
    card.ease = Math.max(MIN_EASE, card.ease - 0.2);
    card.lapseInterval = Math.max(1, Math.round(card.interval * 0.3));
    card.phase = 'relearning';
    card.step = 0;
    card.interval = 0;
    card.due = now + LEARNING_STEPS[0];
    return card;
  }

  // Reviewed before it was due (extra practice, audio flashcards, writing practice): a success
  // only proves recall after the time that actually passed. The interval may grow from that,
  // never from the scheduled interval, otherwise practising a word every few minutes would
  // push it out for months. Ease and the repetition count stay unchanged.
  if (input.due > endOfDay(now)) {
    const factor = isProductionSkill(outcome.skill) ? card.ease : Math.min(card.ease, 1.6);
    let next = Math.max(card.interval, elapsedDays * factor);
    if (card.productionOk === 0) next = Math.min(next, Math.max(card.interval, 14));
    next = Math.min(MAX_INTERVAL_DAYS, next);
    card.interval = Math.round(next * 10) / 10;
    card.due = Math.max(input.due, now + card.interval * DAY);
    return card;
  }

  card.ease = nextEase(card.ease, grade);
  card.reps += 1;
  const overdue = Math.max(0, elapsedDays - card.interval);
  const base = card.interval + overdue / 2;
  let next: number;
  if (grade === 3) {
    next = Math.max(card.interval + 1, base * 1.2);
  } else if (card.reps <= 2) {
    // Second successful review: SM-2 jumps to ~6 days; a gentler 3–4 suits beginners.
    next = isProductionSkill(outcome.skill) ? 4 : 3;
  } else {
    const factor = isProductionSkill(outcome.skill) ? card.ease : Math.min(card.ease, 1.6);
    next = base * factor * (grade === 5 ? 1.15 : 1);
  }
  next = Math.max(card.interval + 1, fuzz(card, next));
  // Without any production success yet, keep reviews coming at least every 2 weeks.
  if (card.productionOk === 0) next = Math.min(next, 14);
  next = Math.min(MAX_INTERVAL_DAYS, next);
  card.interval = Math.round(next * 10) / 10;
  card.due = now + card.interval * DAY;
  return card;
}

export function isStruggling(card: Card): boolean {
  const recent = card.recent.slice(-4);
  const fails = recent.filter((r) => !r).length;
  return card.lapses >= 3 || (recent.length >= 3 && fails >= 2);
}

export function endOfDay(now: number): number {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/** A card is due if it is scheduled for any time today (or earlier). */
export function isDue(card: Card, now: number): boolean {
  if (card.phase !== 'review') return card.due <= now;
  return card.due <= endOfDay(now);
}

export function cardStatus(card: Card | undefined, now: number): CardStatus {
  if (!card) return 'new';
  if (isStruggling(card)) return 'struggling';
  if (isDue(card, now)) return 'due';
  if (card.phase === 'review' && card.interval >= ESTABLISHED_DAYS && card.productionOk > 0) return 'established';
  return 'learning';
}

/**
 * Estimated probability of recalling the card now. Assumes the schedule aims
 * for ~90% recall at the due date and recall decays exponentially between
 * reviews. This is a model estimate, not a measurement.
 */
export function retrievability(card: Card, now: number): number {
  if (card.reviews === 0) return 0;
  if (card.phase !== 'review') {
    const acc = card.recent.length ? card.recent.filter(Boolean).length / card.recent.length : 0.5;
    return Math.min(0.9, 0.4 + acc * 0.4);
  }
  const elapsed = Math.max(0, (now - card.lastReviewed) / DAY);
  return Math.pow(0.9, elapsed / Math.max(card.interval, 0.5));
}

export function estimatedRetention(cards: Card[], now: number): number | null {
  const reviewed = cards.filter((c) => c.reviews > 0);
  if (reviewed.length === 0) return null;
  return reviewed.reduce((sum, c) => sum + retrievability(c, now), 0) / reviewed.length;
}

export interface QueueOptions {
  limit: number;
  /** Cards from this lesson get a bonus (e.g. "review this lesson"). */
  focusIds?: ReadonlySet<string>;
  /** Fill up with not-yet-due cards (weakest first) when few are due. */
  fillWithUpcoming?: boolean;
  onlyStruggling?: boolean;
}

export function cardPriority(card: Card, now: number, focusIds?: ReadonlySet<string>): number {
  let p = 0;
  if (isDue(card, now)) p += 100;
  if (card.phase === 'review' && card.interval > 0) {
    const overdueDays = (now - card.due) / DAY;
    if (overdueDays > 0) p += Math.min(40, (overdueDays / card.interval) * 20);
  }
  if (card.phase !== 'review') p += 10;
  if (isStruggling(card)) p += 30;
  p += card.recent.slice(-4).filter((r) => !r).length * 5;
  if (focusIds?.has(card.id)) p += 15;
  if (card.kind === 'sentence') p -= 5;
  return p;
}

export function selectQueue(cards: Card[], now: number, opts: QueueOptions): Card[] {
  let pool = cards;
  if (opts.onlyStruggling) pool = pool.filter(isStruggling);
  const due = pool.filter((c) => isDue(c, now) || opts.onlyStruggling);
  const sorted = [...due].sort((a, b) => cardPriority(b, now, opts.focusIds) - cardPriority(a, now, opts.focusIds));
  const out = sorted.slice(0, opts.limit);
  if (opts.fillWithUpcoming && out.length < opts.limit) {
    const taken = new Set(out.map((c) => c.id));
    const upcoming = pool
      .filter((c) => !taken.has(c.id))
      .sort((a, b) => {
        // Weakest (lowest retrievability) first.
        return retrievability(a, now) - retrievability(b, now);
      });
    out.push(...upcoming.slice(0, opts.limit - out.length));
  }
  return out;
}

export function countDue(cards: Card[], now: number): number {
  return cards.filter((c) => isDue(c, now)).length;
}
