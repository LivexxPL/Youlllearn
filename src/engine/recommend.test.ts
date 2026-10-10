import { describe, expect, it } from 'vitest';
import { getCourse } from '../content/registry';
import { nextLesson, recommend, reviewMinutes } from './recommend';

const es = getCourse('es');

describe('recommendation', () => {
  it('starts with the first lesson', () => {
    const r = recommend({ course: es, completed: new Set(), dueCount: 0, goalMet: false });
    expect(r.kind).toBe('lesson');
    expect(r.lesson?.id).toBe('es.l01');
    expect(r.minutes).toBeGreaterThan(0);
  });

  it('prefers reviews when many cards are due', () => {
    const r = recommend({ course: es, completed: new Set(['es.l01']), dueCount: 20, goalMet: false });
    expect(r.kind).toBe('review');
    expect(r.minutes).toBe(reviewMinutes(15));
  });

  it('suggests light listening after the goal is met', () => {
    const r = recommend({ course: es, completed: new Set(['es.l01']), dueCount: 0, goalMet: true });
    expect(r.kind).toBe('audio');
  });

  it('continues after the furthest completed lesson', () => {
    const [l1, l2, l3, l4, l5] = es.lessons;
    // Sequential progress: the next lesson in order.
    expect(nextLesson(es, new Set([l1.id, l2.id]))?.id).toBe(l3.id);
    // A learner who started further on is not sent back to lesson 1.
    expect(nextLesson(es, new Set([l4.id]))?.id).toBe(l5.id);
    // Only gaps are left after the last lesson: go back to the first gap.
    const allButSecond = new Set(es.lessons.filter((l) => l.id !== l2.id).map((l) => l.id));
    expect(nextLesson(es, allButSecond)?.id).toBe(l2.id);
  });

  it('handles a finished course', () => {
    const all = new Set(es.lessons.map((l) => l.id));
    expect(nextLesson(es, all)).toBeUndefined();
    expect(recommend({ course: es, completed: all, dueCount: 0, goalMet: false }).kind).toBe('repeat');
    expect(recommend({ course: es, completed: all, dueCount: 3, goalMet: false }).kind).toBe('review');
  });
});
