import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  dailyQuests,
  evaluateStreak,
  initialStreak,
  isActiveDay,
  levelForXp,
  levelThreshold,
  longestStreak,
  newlyUnlocked,
  questValue,
  weeklyChallenge,
  weeklyValue,
  type AggregateStats,
} from './gamification';
import { emptyDailyStats } from '../services/db';
import { addDays } from './dates';

describe('levels', () => {
  it('grows thresholds and reports progress', () => {
    expect(levelThreshold(1)).toBe(0);
    expect(levelThreshold(2)).toBe(150);
    expect(levelForXp(0).level).toBe(1);
    expect(levelForXp(149).level).toBe(1);
    expect(levelForXp(150).level).toBe(2);
    const l = levelForXp(300);
    expect(l.level).toBe(2);
    expect(l.progress).toBeCloseTo(150 / 300);
    expect(levelForXp(100000).titleIndex).toBe(9);
  });
});

describe('active days', () => {
  it('counts a minute of learning or one activity', () => {
    expect(isActiveDay(undefined)).toBe(false);
    expect(isActiveDay({ ...emptyDailyStats('2026-01-01'), activeSec: 59 })).toBe(false);
    expect(isActiveDay({ ...emptyDailyStats('2026-01-01'), activeSec: 60 })).toBe(true);
    expect(isActiveDay({ ...emptyDailyStats('2026-01-01'), audioSessions: 1 })).toBe(true);
  });
});

describe('forgiving streak', () => {
  const today = '2026-03-20';
  const days = (from: string, n: number) => Array.from({ length: n }, (_, i) => addDays(from, i));

  it('counts consecutive active days', () => {
    const active = new Set(days('2026-03-16', 5)); // 16..20
    const r = evaluateStreak(initialStreak, active, today);
    expect(r.current).toBe(5);
    expect(r.todayActive).toBe(true);
  });

  it('keeps the streak alive until today is over', () => {
    const active = new Set(days('2026-03-15', 5)); // 15..19, today not yet
    const r = evaluateStreak(initialStreak, active, today);
    expect(r.current).toBe(5);
    expect(r.todayActive).toBe(false);
  });

  it('earns a shield every 5 active days and uses it for a missed day', () => {
    // Active 1..10, missed 11, active 12..
    const active = new Set([...days('2026-03-01', 10), ...days('2026-03-12', 9)]);
    const r = evaluateStreak(initialStreak, active, today);
    expect(r.usedShields).toEqual(['2026-03-11']);
    expect(r.current).toBe(19);
    expect(r.state.shields).toBeGreaterThanOrEqual(1);
  });

  it('resets the streak (but nothing else) when no shield is left', () => {
    const active = new Set([...days('2026-03-10', 2), ...days('2026-03-15', 6)]);
    const r = evaluateStreak(initialStreak, active, today);
    expect(r.current).toBe(6);
    expect(r.broken).toBe(true);
    expect(r.state.best).toBe(6);
  });

  it('is incremental and does not spend shields twice', () => {
    const active = new Set([...days('2026-03-01', 10), ...days('2026-03-12', 9)]);
    const first = evaluateStreak(initialStreak, active, today);
    const second = evaluateStreak(first.state, active, today);
    expect(second.usedShields).toEqual([]);
    expect(second.state.shields).toBe(first.state.shields);
    expect(second.current).toBe(first.current);
  });

  it('computes the longest streak from history', () => {
    const active = new Set([...days('2026-01-01', 4), ...days('2026-02-01', 7)]);
    expect(longestStreak(active)).toBe(7);
  });
});

describe('quests and challenges', () => {
  it('are deterministic, balanced and fair', () => {
    const a = dailyQuests('2026-03-20', 'seed', 10, ['es']);
    const b = dailyQuests('2026-03-20', 'seed', 10, ['es']);
    expect(a).toEqual(b);
    expect(a).toHaveLength(3);
    expect(new Set(a.map((q) => q.id)).size).toBe(3);
    expect(a.every((q) => q.xp > 0 && q.target > 0)).toBe(true);
    // Writing quests are only offered to Japanese learners.
    for (let i = 0; i < 30; i++) {
      expect(dailyQuests(addDays('2026-01-01', i), 'x', 10, ['es']).some((q) => q.id === 'write')).toBe(false);
    }
  });

  it('measures quest progress from daily stats', () => {
    const s = { ...emptyDailyStats('2026-03-20'), listeningSec: 185, reviews: 7 };
    expect(questValue(s, 'listenMin')).toBe(3);
    expect(questValue(s, 'reviews')).toBe(7);
    expect(questValue(undefined, 'lessons')).toBe(0);
  });

  it('measures weekly challenges across the week', () => {
    const stats = new Map(
      ['2026-03-16', '2026-03-17', '2026-03-19'].map((d) => [d, { ...emptyDailyStats(d), activeSec: 600, lessons: 1 }]),
    );
    expect(weeklyValue(stats, '2026-03-20', 'activeDays')).toBe(3);
    expect(weeklyValue(stats, '2026-03-20', 'lessons')).toBe(3);
    expect(weeklyValue(stats, '2026-03-20', 'activeMin')).toBe(30);
    expect(weeklyChallenge('2026-W12', 'seed', 10).xp).toBe(100);
  });
});

describe('achievements', () => {
  const base: AggregateStats = {
    lessonsCompleted: 0,
    levelA2Lessons: 0,
    completedLessonIds: new Set(),
    lessonsPerCourse: { es: 0, de: 0, ja: 0 },
    courseLessonTotals: { es: 14, de: 15, ja: 18 },
    itemsStarted: 0,
    established: 0,
    streakBest: 0,
    activeDays: 0,
    listeningMin: 0,
    reviews: 0,
    speaking: 0,
    writing: 0,
    perfectLesson: false,
    comeback: false,
  };

  it('unlock when conditions are met and only once', () => {
    const stats = { ...base, lessonsCompleted: 1, lessonsPerCourse: { es: 1, de: 0, ja: 0 }, streakBest: 3 };
    const ids = newlyUnlocked(stats, new Set()).map((a) => a.id);
    expect(ids).toContain('first-lesson');
    expect(ids).toContain('streak-3');
    expect(newlyUnlocked(stats, new Set(ids))).toEqual([]);
  });

  it('reward long journeys and the step to A2', () => {
    const ids = newlyUnlocked({ ...base, lessonsCompleted: 50, levelA2Lessons: 1 }, new Set()).map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(['lessons-25', 'lessons-50', 'level-a2']));
    expect(newlyUnlocked({ ...base, lessonsCompleted: 49 }, new Set()).map((a) => a.id)).not.toContain('lessons-50');
  });

  it('have unique ids and an i18n entry', async () => {
    const { pl } = await import('../i18n/pl');
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
    for (const a of ACHIEVEMENTS) {
      expect((pl as Record<string, unknown>)[`ach.${a.id}`], a.id).toBeTruthy();
      expect((pl as Record<string, unknown>)[`ach.${a.id}.desc`], a.id).toBeTruthy();
    }
  });
});
