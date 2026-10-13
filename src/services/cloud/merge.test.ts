import { describe, expect, it } from 'vitest';
import { canonicalJson, fingerprint, mergeData, mergeSettings, mergeStreak } from './merge';
import { emptyDailyStats, type LessonProgress, type MetaRecord, type Settings } from '../db';
import type { BackupData } from '../backup';
import { introduceCard, reviewCard } from '../../engine/srs';
import { defaultSettings } from '../../state/settings';

function data(patch: Partial<BackupData> = {}): BackupData {
  return { settings: [], cards: [], lessonProgress: [], dailyStats: [], achievements: [], rewards: [], drawings: [], meta: [], ledger: [], ...patch } as BackupData;
}

const lesson = (id: string, p: Partial<LessonProgress> = {}): LessonProgress => ({
  id,
  courseId: 'es',
  completedAt: 100,
  lastCompletedAt: 100,
  completions: 1,
  bestAccuracy: 0.8,
  lastAccuracy: 0.8,
  ...p,
});

describe('merging learner data from two devices', () => {
  it('keeps the more recently reviewed version of a card and cards from both sides', () => {
    const fresh = introduceCard('es.hola', 'es', 'item', [{ correct: true, skill: 'recognition' }], 1000);
    const reviewed = reviewCard(fresh, { correct: true, skill: 'recall' }, 5000);
    const other = introduceCard('es.adios', 'es', 'item', [{ correct: true, skill: 'recognition' }], 2000);
    const merged = mergeData(data({ cards: [fresh] }), data({ cards: [reviewed, other] }));
    expect(merged.cards).toEqual([other, reviewed]);
    expect(mergeData(data({ cards: [reviewed] }), data({ cards: [fresh] })).cards).toEqual([reviewed]);
  });

  it('combines lesson progress without losing the best result or the first completion', () => {
    const local = lesson('es.l01', { completedAt: 100, lastCompletedAt: 500, completions: 3, bestAccuracy: 0.7, lastAccuracy: 0.7 });
    const remote = lesson('es.l01', { completedAt: 50, lastCompletedAt: 300, completions: 2, bestAccuracy: 0.95, lastAccuracy: 0.95 });
    const [m] = mergeData(data({ lessonProgress: [local] }), data({ lessonProgress: [remote, lesson('es.l02')] })).lessonProgress as LessonProgress[];
    expect(m).toEqual({ ...local, completedAt: 50, completions: 3, bestAccuracy: 0.95 });
  });

  it('takes the larger value of each daily counter instead of adding them up', () => {
    const local = { ...emptyDailyStats('2026-10-10'), activeSec: 600, lessons: 2, xp: 120, courses: ['es' as const] };
    const remote = { ...emptyDailyStats('2026-10-10'), activeSec: 300, lessons: 3, xp: 80, courses: ['ja' as const] };
    const merged = mergeData(data({ dailyStats: [local] }), data({ dailyStats: [remote] }));
    expect(merged.dailyStats).toEqual([{ ...local, activeSec: 600, lessons: 3, xp: 120, courses: ['es', 'ja'] }]);
    // Merging the same copy again changes nothing (synchronising twice never double counts).
    expect(mergeData(merged, data({ dailyStats: [remote] }))).toEqual(merged);
  });

  it('keeps every achievement with its first unlock date, and rewards once', () => {
    const merged = mergeData(
      data({ achievements: [{ id: 'first-lesson', unlockedAt: 900 }], rewards: [{ id: '2026-10-10:q1', xp: 20, at: 1, date: '2026-10-10' }] }),
      data({
        achievements: [
          { id: 'first-lesson', unlockedAt: 500 },
          { id: 'streak-3', unlockedAt: 700 },
        ],
        rewards: [
          { id: '2026-10-10:q1', xp: 20, at: 2, date: '2026-10-10' },
          { id: '2026-W41:c1', xp: 50, at: 3, date: '2026-10-10' },
        ],
      }),
    );
    expect(merged.achievements).toEqual([
      { id: 'first-lesson', unlockedAt: 500 },
      { id: 'streak-3', unlockedAt: 700 },
    ]);
    expect(merged.rewards).toHaveLength(2);
  });

  it('keeps the newer version of a drawing', () => {
    const older = { id: 'note:es.l01', kind: 'note' as const, strokes: [], updatedAt: 10 };
    const newer = { ...older, title: 'Nowa', updatedAt: 20 };
    expect(mergeData(data({ drawings: [newer] }), data({ drawings: [older] })).drawings).toEqual([newer]);
    expect(mergeData(data({ drawings: [older] }), data({ drawings: [newer] })).drawings).toEqual([newer]);
  });

  it("keeps this device's settings but adds courses started elsewhere", () => {
    const local: Settings = { ...defaultSettings(), onboarded: true, courses: ['es'], palette: 'mint' };
    const remote: Settings = { ...defaultSettings(), onboarded: true, courses: ['ja', 'es'], palette: 'candy' };
    expect(mergeSettings(local, remote)).toEqual({ ...local, courses: ['es', 'ja'] });
    expect(mergeSettings(local, { ...remote, courses: ['es'] })).toBe(local);
  });

  it('restores the cloud settings onto a device that has not been set up yet', () => {
    const fresh: Settings = { ...defaultSettings(), onboarded: false };
    const remote: Settings = { ...defaultSettings(), onboarded: true, courses: ['de'], activeCourse: 'de' };
    expect(mergeSettings(fresh, remote)).toBe(remote);
    expect(mergeSettings(undefined, remote)).toBe(remote);
    expect(mergeSettings(remote, { ...fresh })).toBe(remote);
  });

  it('combines streak bookkeeping and flags, and never takes device-only records from the cloud', () => {
    const local: MetaRecord[] = [
      { key: 'flags', value: { perfect: true } },
      { key: 'resume:es', value: { lessonId: 'es.l02', index: 3, total: 9, seed: 1 } },
      { key: 'streak', value: { shields: 1, protectedDays: ['2026-10-01'], lastEvaluated: '2026-10-09', activeCount: 9, best: 5 } },
    ];
    const remote: MetaRecord[] = [
      { key: 'cloud', value: { account: { sub: 'other' } } },
      { key: 'flags', value: { comeback: true, perfect: false } },
      { key: 'resume:de', value: { lessonId: 'de.l04', index: 1, total: 9, seed: 2 } },
      { key: 'story:es.s1', value: { correct: 4, total: 5, at: 10 } },
      { key: 'streak', value: { shields: 2, protectedDays: ['2026-09-20'], lastEvaluated: '2026-10-08', activeCount: 12, best: 8 } },
    ];
    const merged = mergeData(data({ meta: local }), data({ meta: remote })).meta as MetaRecord[];
    expect(merged.map((m) => m.key)).toEqual(['flags', 'resume:es', 'story:es.s1', 'streak']);
    expect(merged[0].value).toEqual({ perfect: true, comeback: true });
    expect(merged[3].value).toEqual({ shields: 1, protectedDays: ['2026-09-20', '2026-10-01'], lastEvaluated: '2026-10-09', activeCount: 9, best: 8 });
  });

  it('prefers the streak state evaluated up to the later day', () => {
    const a = { shields: 0, protectedDays: [], lastEvaluated: '2026-10-01', activeCount: 3, best: 3 };
    const b = { shields: 2, protectedDays: [], lastEvaluated: '2026-10-05', activeCount: 14, best: 2 };
    expect(mergeStreak(a, b)).toEqual({ ...b, best: 3 });
  });

  it('joins coin histories by event, so a reward or purchase made on both devices counts once', () => {
    const tx = (id: string, amount: number, at: number) => ({ id, type: 'lesson', amount, currency: 'coins', at, date: '2026-10-13' });
    const merged = mergeData(
      data({ ledger: [tx('lesson:es.l01:first', 15, 1), tx('purchase:frame-gold:0', -200, 5)] }),
      data({ ledger: [tx('lesson:es.l01:first', 15, 2), tx('lesson:es.l02:first', 15, 3), tx('purchase:frame-gold:0', -200, 6)] }),
    );
    expect((merged.ledger as { id: string }[]).map((e) => e.id)).toEqual(['lesson:es.l01:first', 'lesson:es.l02:first', 'purchase:frame-gold:0']);
    expect((merged.ledger as { amount: number }[]).reduce((n, e) => n + e.amount, 0)).toBe(-170);
  });

  it('accepts copies from older versions that lack tables', () => {
    const local = data({ cards: [introduceCard('es.hola', 'es', 'item', [{ correct: true, skill: 'recognition' }], 1)] });
    expect(mergeData(local, { cards: undefined } as unknown as BackupData).cards).toEqual(local.cards);
  });
});

describe('fingerprints', () => {
  it('ignore the order of object keys but not the data', () => {
    expect(canonicalJson({ b: 1, a: { d: 2, c: [3, { f: 1, e: 0 }] } })).toBe('{"a":{"c":[3,{"e":0,"f":1}],"d":2},"b":1}');
    expect(fingerprint({ a: 1, b: 2 })).toBe(fingerprint({ b: 2, a: 1 }));
    expect(fingerprint({ a: 1, b: 2 })).not.toBe(fingerprint({ a: 1, b: 3 }));
  });
});
