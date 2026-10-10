import { describe, expect, it } from 'vitest';
import {
  DAY,
  MINUTE,
  cardStatus,
  estimatedRetention,
  gradeFromOutcome,
  introduceCard,
  isDue,
  nextEase,
  retrievability,
  reviewCard,
  selectQueue,
  type Card,
  type Outcome,
} from './srs';

const T0 = new Date(2026, 0, 5, 12, 0, 0).getTime();
const good = (skill: Outcome['skill'] = 'recognition'): Outcome => ({ correct: true, skill });
const bad = (skill: Outcome['skill'] = 'recognition'): Outcome => ({ correct: false, skill });

function graduate(card: Card, now: number, skill: Outcome['skill'] = 'production'): Card {
  let c = card;
  let t = now;
  while (c.phase !== 'review') {
    t = Math.max(t, c.due);
    c = reviewCard(c, good(skill), t);
  }
  return c;
}

describe('grades', () => {
  it('maps outcomes to SM-2 quality', () => {
    expect(gradeFromOutcome(bad())).toBe(1);
    expect(gradeFromOutcome({ correct: true, almost: true, skill: 'production' })).toBe(3);
    expect(gradeFromOutcome(good('recognition'))).toBe(4);
    expect(gradeFromOutcome(good('production'))).toBe(5);
    expect(gradeFromOutcome({ correct: true, skill: 'speaking', selfRating: 'hard' })).toBe(3);
  });

  it('updates ease like SM-2 and clamps it', () => {
    expect(nextEase(2.5, 4)).toBeCloseTo(2.5);
    expect(nextEase(2.5, 5)).toBeCloseTo(2.6);
    expect(nextEase(2.5, 3)).toBeCloseTo(2.36);
    expect(nextEase(1.3, 0)).toBe(1.3);
    expect(nextEase(2.8, 5)).toBe(2.8);
  });
});

describe('introduction from a lesson', () => {
  it('keeps the 10-minute step after mistakes', () => {
    const c = introduceCard('es.hola', 'es', 'item', [bad(), good()], T0);
    expect(c.phase).toBe('learning');
    expect(c.due).toBe(T0 + 10 * MINUTE);
    expect(c.incorrect).toBe(1);
  });
  it('skips to the 1-day step after a flawless lesson', () => {
    const c = introduceCard('es.hola', 'es', 'item', [good(), good('production')], T0);
    expect(c.due).toBe(T0 + DAY);
    expect(c.productionOk).toBe(1);
  });
});

describe('review scheduling', () => {
  it('graduates and then grows intervals', () => {
    let c = introduceCard('x', 'es', 'item', [good()], T0);
    c = reviewCard(c, good('production'), c.due);
    expect(c.phase).toBe('review');
    expect(c.interval).toBe(1);
    const t1 = c.due;
    c = reviewCard(c, good('production'), t1);
    expect(c.interval).toBe(4);
    const t2 = c.due;
    c = reviewCard(c, good('production'), t2);
    expect(c.interval).toBeGreaterThan(9);
    expect(c.interval).toBeLessThan(14);
  });

  it('grows more slowly after recognition-only successes', () => {
    let a = graduate(introduceCard('a', 'es', 'item', [good('production')], T0), T0, 'production');
    let b = graduate(introduceCard('b', 'es', 'item', [good('production')], T0), T0, 'production');
    for (let i = 0; i < 4; i++) {
      a = reviewCard(a, good('production'), a.due);
      b = reviewCard(b, good('recognition'), b.due);
    }
    expect(a.interval).toBeGreaterThan(b.interval);
  });

  it('caps intervals at 14 days until the item has been produced', () => {
    let c = introduceCard('c', 'es', 'item', [good('recognition')], T0);
    c = graduate(c, T0, 'recognition');
    for (let i = 0; i < 8; i++) c = reviewCard(c, { correct: true, skill: 'recognition', selfRating: 'easy' }, c.due);
    expect(c.productionOk).toBe(0);
    expect(c.interval).toBeLessThanOrEqual(14);
    expect(cardStatus(c, c.lastReviewed)).not.toBe('established');
  });

  it('does not grow intervals from practice before the due date', () => {
    // A new word practised correctly every 10 minutes (extra practice, audio flashcards…).
    let card = introduceCard('es.hola', 'es', 'item', [good()], T0);
    let t = T0;
    for (let i = 0; i < 12; i++) {
      t += 10 * MINUTE;
      card = reviewCard(card, good('production'), t);
    }
    expect(card.interval).toBeLessThanOrEqual(2);
    expect(card.due - t).toBeLessThanOrEqual(2 * DAY);
    expect(cardStatus(card, t)).not.toBe('established');
  });

  it('credits the time that actually passed when a review comes a little early', () => {
    let card = graduate(introduceCard('es.hola', 'es', 'item', [good()], T0), T0);
    for (let i = 0; i < 3; i++) card = reviewCard(card, good('production'), card.due);
    const interval = card.interval;
    const early = card.lastReviewed! + Math.round(interval * 0.7) * DAY;
    const after = reviewCard(card, good('production'), early);
    expect(after.interval).toBeGreaterThan(interval);
    expect(after.due).toBeGreaterThan(card.due);
    expect(after.reps).toBe(card.reps);
    // A mistake made early still counts as a lapse.
    expect(reviewCard(card, bad('production'), early).phase).toBe('relearning');
  });

  it('handles lapses with relearning and reduced ease', () => {
    let c = graduate(introduceCard('d', 'es', 'item', [good('production')], T0), T0);
    for (let i = 0; i < 3; i++) c = reviewCard(c, good('production'), c.due);
    const before = c.interval;
    const ease = c.ease;
    c = reviewCard(c, bad('production'), c.due);
    expect(c.phase).toBe('relearning');
    expect(c.lapses).toBe(1);
    expect(c.ease).toBeCloseTo(ease - 0.2);
    expect(c.due - c.lastReviewed).toBe(10 * MINUTE);
    c = reviewCard(c, good('production'), c.due);
    c = c.phase === 'review' ? c : reviewCard(c, good('production'), c.due);
    expect(c.phase).toBe('review');
    expect(c.interval).toBeLessThan(before);
  });

  it('does not mutate its input', () => {
    const c = introduceCard('e', 'es', 'item', [good()], T0);
    const copy = structuredClone(c);
    reviewCard(c, bad(), T0 + DAY);
    expect(c).toEqual(copy);
  });
});

describe('status and queue', () => {
  it('reports statuses', () => {
    expect(cardStatus(undefined, T0)).toBe('new');
    let c = introduceCard('f', 'es', 'item', [good()], T0);
    expect(cardStatus(c, T0)).toBe('learning');
    expect(cardStatus(c, T0 + 2 * DAY)).toBe('due');
    c = { ...c, recent: [true, false, false, true], lapses: 0 };
    expect(cardStatus(c, T0)).toBe('struggling');
  });

  it('marks long-interval produced cards as established', () => {
    let c = graduate(introduceCard('g', 'es', 'item', [good('production')], T0), T0);
    while (c.interval < 21) c = reviewCard(c, good('production'), c.due);
    expect(cardStatus(c, c.lastReviewed + DAY)).toBe('established');
  });

  it('counts review cards due later today as due', () => {
    const c = graduate(introduceCard('h', 'es', 'item', [good('production')], T0), T0);
    const morning = new Date(c.due);
    morning.setHours(6, 0, 0, 0);
    expect(isDue(c, morning.getTime())).toBe(true);
  });

  it('orders the queue by priority and fills with upcoming cards', () => {
    const due = introduceCard('due', 'es', 'item', [bad(), good()], T0);
    const weak = { ...introduceCard('weak', 'es', 'item', [bad(), bad(), good()], T0), recent: [false, false, true] };
    const later = graduate(introduceCard('later', 'es', 'item', [good('production')], T0), T0);
    const now = T0 + 20 * MINUTE;
    const q = selectQueue([later, due, weak], now, { limit: 2 });
    expect(q.map((c) => c.id)).toEqual(['weak', 'due']);
    const filled = selectQueue([later, due, weak], now, { limit: 3, fillWithUpcoming: true });
    expect(filled.map((c) => c.id)).toContain('later');
  });

  it('estimates retention between 0 and 1', () => {
    const c = graduate(introduceCard('i', 'es', 'item', [good('production')], T0), T0);
    const r0 = retrievability(c, c.lastReviewed);
    const r1 = retrievability(c, c.lastReviewed + c.interval * DAY);
    expect(r0).toBeCloseTo(1);
    expect(r1).toBeCloseTo(0.9);
    expect(estimatedRetention([], T0)).toBeNull();
    expect(estimatedRetention([c], c.lastReviewed)).toBeGreaterThan(0.9);
  });
});
