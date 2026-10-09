/**
 * Motivation system (see docs/MOTIVATION.md).
 *
 * Principles: transparent fixed rewards, no randomness in rewards (only in
 * which challenges are offered), no punishment, and a streak that forgives
 * missed days. Breaking a streak never removes XP, words or progress.
 */
import type { CourseId } from '../content/types';
import type { DailyStats } from '../services/db';
import { addDays, weekDays } from './dates';
import { createRng, shuffle } from './random';

// ---------------------------------------------------------------------------
// XP

export const XP = {
  correctFirstTry: 10,
  correctRetry: 5,
  lessonComplete: 20,
  listeningMinute: 2,
  quest: 20,
  allQuestsBonus: 30,
  weeklyChallenge: 100,
} as const;

export function levelThreshold(level: number): number {
  return 75 * level * (level - 1);
}

export interface LevelInfo {
  level: number;
  titleIndex: number;
  xpIntoLevel: number;
  xpForLevel: number;
  progress: number;
  totalXp: number;
}

export function levelForXp(totalXp: number): LevelInfo {
  let level = 1;
  while (totalXp >= levelThreshold(level + 1)) level += 1;
  const start = levelThreshold(level);
  const next = levelThreshold(level + 1);
  return {
    level,
    titleIndex: Math.min(level, 9),
    xpIntoLevel: totalXp - start,
    xpForLevel: next - start,
    progress: (totalXp - start) / (next - start),
    totalXp,
  };
}

// ---------------------------------------------------------------------------
// Active days and streak

/** A day counts when there was at least a minute of learning or one finished activity. */
export function isActiveDay(d: DailyStats | undefined): boolean {
  if (!d) return false;
  return d.activeSec >= 60 || d.exercises >= 5 || d.lessons >= 1 || d.audioSessions >= 1;
}

export const MAX_SHIELDS = 3;
export const SHIELD_EVERY_ACTIVE_DAYS = 5;

export interface StreakState {
  shields: number;
  /** Missed days bridged by a shield. */
  protectedDays: string[];
  /** Last day already evaluated (normally yesterday). */
  lastEvaluated: string | null;
  /** Active days counted towards earning shields. */
  activeCount: number;
  best: number;
}

export const initialStreak: StreakState = { shields: 0, protectedDays: [], lastEvaluated: null, activeCount: 0, best: 0 };

export interface StreakResult {
  state: StreakState;
  current: number;
  todayActive: boolean;
  usedShields: string[];
  earnedShields: number;
  /** The chain was broken since the last evaluation (used for a gentle "welcome back"). */
  broken: boolean;
}

export function evaluateStreak(prev: StreakState, active: ReadonlySet<string>, today: string): StreakResult {
  const s: StreakState = { ...prev, protectedDays: [...prev.protectedDays] };
  const yesterday = addDays(today, -1);
  const usedShields: string[] = [];
  let earnedShields = 0;
  let broken = false;

  const sortedActive = [...active].sort();
  let d = s.lastEvaluated ? addDays(s.lastEvaluated, 1) : (sortedActive[0] ?? today);
  while (d <= yesterday) {
    if (active.has(d)) {
      s.activeCount += 1;
      if (s.activeCount % SHIELD_EVERY_ACTIVE_DAYS === 0 && s.shields < MAX_SHIELDS) {
        s.shields += 1;
        earnedShields += 1;
      }
    } else {
      const before = addDays(d, -1);
      const alive = active.has(before) || s.protectedDays.includes(before);
      if (alive) {
        if (s.shields > 0) {
          s.shields -= 1;
          s.protectedDays.push(d);
          usedShields.push(d);
        } else {
          broken = true;
        }
      }
    }
    d = addDays(d, 1);
  }
  if (!s.lastEvaluated || s.lastEvaluated < yesterday) s.lastEvaluated = yesterday;
  s.protectedDays = s.protectedDays.filter((x) => x >= addDays(today, -120));

  const todayActive = active.has(today);
  let current = 0;
  let cursor = todayActive ? today : yesterday;
  while (active.has(cursor) || s.protectedDays.includes(cursor)) {
    if (active.has(cursor)) current += 1;
    cursor = addDays(cursor, -1);
  }
  s.best = Math.max(s.best, current);
  return { state: s, current, todayActive, usedShields, earnedShields, broken };
}

/** Longest run of active days (shield-protected days bridge gaps) in a history. */
export function longestStreak(active: ReadonlySet<string>, protectedDays: ReadonlySet<string> = new Set()): number {
  const days = [...active].sort();
  let best = 0;
  for (const start of days) {
    if (active.has(addDays(start, -1)) || protectedDays.has(addDays(start, -1))) continue;
    let run = 0;
    let d = start;
    while (active.has(d) || protectedDays.has(d)) {
      if (active.has(d)) run += 1;
      d = addDays(d, 1);
    }
    best = Math.max(best, run);
  }
  return best;
}

// ---------------------------------------------------------------------------
// Daily quests

export type QuestMetric = 'lessons' | 'reviews' | 'listenMin' | 'exercises' | 'speaking' | 'writing' | 'newItems' | 'bestRun' | 'audioSessions';

export interface Quest {
  id: string;
  metric: QuestMetric;
  target: number;
  xp: number;
  /** i18n key of the title. */
  titleKey: string;
}

interface QuestTemplate {
  id: string;
  metric: QuestMetric;
  titleKey: string;
  target: (goalMin: number) => number;
  /** Category used to keep the daily selection balanced. */
  category: 'core' | 'audio' | 'skill';
  needs?: 'ja';
}

const QUEST_POOL: QuestTemplate[] = [
  { id: 'lesson', metric: 'lessons', titleKey: 'quest.lesson', target: () => 1, category: 'core' },
  { id: 'reviews', metric: 'reviews', titleKey: 'quest.reviews', target: (g) => (g <= 10 ? 10 : 20), category: 'core' },
  { id: 'exercises', metric: 'exercises', titleKey: 'quest.exercises', target: (g) => Math.max(10, g * 2), category: 'core' },
  { id: 'newWords', metric: 'newItems', titleKey: 'quest.newWords', target: (g) => (g <= 10 ? 5 : 8), category: 'core' },
  { id: 'listen', metric: 'listenMin', titleKey: 'quest.listen', target: (g) => (g <= 10 ? 3 : 5), category: 'audio' },
  { id: 'audioSession', metric: 'audioSessions', titleKey: 'quest.audioSession', target: () => 1, category: 'audio' },
  { id: 'speak', metric: 'speaking', titleKey: 'quest.speak', target: () => 3, category: 'skill' },
  { id: 'write', metric: 'writing', titleKey: 'quest.write', target: () => 5, category: 'skill', needs: 'ja' },
  { id: 'run', metric: 'bestRun', titleKey: 'quest.run', target: (g) => (g <= 10 ? 5 : 8), category: 'skill' },
];

/** Three quests per day: deterministic per day and learner, one from each category. */
export function dailyQuests(date: string, seed: string, goalMin: number, courses: CourseId[]): Quest[] {
  const rng = createRng(`${seed}:${date}`);
  const available = QUEST_POOL.filter((q) => !q.needs || courses.includes(q.needs));
  const pickFrom = (cat: QuestTemplate['category']) => shuffle(available.filter((q) => q.category === cat), rng)[0];
  const chosen = [pickFrom('core'), pickFrom('audio'), pickFrom('skill')].filter(Boolean) as QuestTemplate[];
  return chosen.map((q) => ({ id: q.id, metric: q.metric, target: q.target(goalMin), xp: XP.quest, titleKey: q.titleKey }));
}

export function questValue(stats: DailyStats | undefined, metric: QuestMetric): number {
  if (!stats) return 0;
  switch (metric) {
    case 'lessons':
      return stats.lessons;
    case 'reviews':
      return stats.reviews;
    case 'listenMin':
      return Math.floor(stats.listeningSec / 60);
    case 'exercises':
      return stats.exercises;
    case 'speaking':
      return stats.speaking;
    case 'writing':
      return stats.writing;
    case 'newItems':
      return stats.newItems;
    case 'bestRun':
      return stats.bestRun;
    case 'audioSessions':
      return stats.audioSessions;
  }
}

// ---------------------------------------------------------------------------
// Weekly challenge

export type WeeklyMetric = 'activeDays' | 'lessons' | 'listenMin' | 'reviews' | 'speaking' | 'activeMin';

export interface WeeklyChallenge {
  id: string;
  metric: WeeklyMetric;
  target: number;
  xp: number;
  titleKey: string;
}

const WEEKLY_POOL: { id: string; metric: WeeklyMetric; titleKey: string; target: (g: number) => number }[] = [
  { id: 'days', metric: 'activeDays', titleKey: 'challenge.days', target: () => 5 },
  { id: 'lessons', metric: 'lessons', titleKey: 'challenge.lessons', target: (g) => (g <= 10 ? 3 : 5) },
  { id: 'listen', metric: 'listenMin', titleKey: 'challenge.listen', target: (g) => (g <= 10 ? 20 : 40) },
  { id: 'reviews', metric: 'reviews', titleKey: 'challenge.reviews', target: (g) => (g <= 10 ? 60 : 120) },
  { id: 'speak', metric: 'speaking', titleKey: 'challenge.speak', target: () => 15 },
  { id: 'minutes', metric: 'activeMin', titleKey: 'challenge.minutes', target: (g) => g * 5 },
];

export function weeklyChallenge(weekId: string, seed: string, goalMin: number): WeeklyChallenge {
  const rng = createRng(`${seed}:${weekId}`);
  const t = WEEKLY_POOL[Math.floor(rng() * WEEKLY_POOL.length)];
  return { id: t.id, metric: t.metric, target: t.target(goalMin), xp: XP.weeklyChallenge, titleKey: t.titleKey };
}

export function weeklyValue(stats: Map<string, DailyStats>, anyDayOfWeek: string, metric: WeeklyMetric): number {
  const days = weekDays(anyDayOfWeek).map((d) => stats.get(d));
  switch (metric) {
    case 'activeDays':
      return days.filter(isActiveDay).length;
    case 'lessons':
      return days.reduce((n, d) => n + (d?.lessons ?? 0), 0);
    case 'listenMin':
      return Math.floor(days.reduce((n, d) => n + (d?.listeningSec ?? 0), 0) / 60);
    case 'reviews':
      return days.reduce((n, d) => n + (d?.reviews ?? 0), 0);
    case 'speaking':
      return days.reduce((n, d) => n + (d?.speaking ?? 0), 0);
    case 'activeMin':
      return Math.floor(days.reduce((n, d) => n + (d?.activeSec ?? 0), 0) / 60);
  }
}

// ---------------------------------------------------------------------------
// Achievements

export interface AggregateStats {
  lessonsCompleted: number;
  completedLessonIds: ReadonlySet<string>;
  lessonsPerCourse: Record<CourseId, number>;
  courseLessonTotals: Record<CourseId, number>;
  itemsStarted: number;
  established: number;
  streakBest: number;
  activeDays: number;
  listeningMin: number;
  reviews: number;
  speaking: number;
  writing: number;
  perfectLesson: boolean;
  comeback: boolean;
}

export interface AchievementDef {
  id: string;
  icon: string;
  check: (s: AggregateStats) => boolean;
}

const HIRAGANA = ['ja.l01', 'ja.l02', 'ja.l03', 'ja.l04', 'ja.l05', 'ja.l06', 'ja.l07'];
const KATAKANA = ['ja.l08', 'ja.l09', 'ja.l10'];

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-lesson', icon: 'footprints', check: (s) => s.lessonsCompleted >= 1 },
  { id: 'lessons-10', icon: 'map', check: (s) => s.lessonsCompleted >= 10 },
  { id: 'lessons-25', icon: 'mountain', check: (s) => s.lessonsCompleted >= 25 },
  { id: 'words-50', icon: 'gem', check: (s) => s.itemsStarted >= 50 },
  { id: 'words-150', icon: 'treasure', check: (s) => s.itemsStarted >= 150 },
  { id: 'established-25', icon: 'anchor', check: (s) => s.established >= 25 },
  { id: 'streak-3', icon: 'flame', check: (s) => s.streakBest >= 3 },
  { id: 'streak-7', icon: 'flame', check: (s) => s.streakBest >= 7 },
  { id: 'streak-30', icon: 'trophy', check: (s) => s.streakBest >= 30 },
  { id: 'days-20', icon: 'calendar', check: (s) => s.activeDays >= 20 },
  { id: 'listen-30', icon: 'headphones', check: (s) => s.listeningMin >= 30 },
  { id: 'listen-120', icon: 'headphones', check: (s) => s.listeningMin >= 120 },
  { id: 'reviews-100', icon: 'repeat', check: (s) => s.reviews >= 100 },
  { id: 'reviews-500', icon: 'brain', check: (s) => s.reviews >= 500 },
  { id: 'speak-25', icon: 'mic', check: (s) => s.speaking >= 25 },
  { id: 'hiragana', icon: 'pen', check: (s) => HIRAGANA.every((l) => s.completedLessonIds.has(l)) },
  { id: 'katakana', icon: 'pen', check: (s) => KATAKANA.every((l) => s.completedLessonIds.has(l)) },
  { id: 'writer-50', icon: 'brush', check: (s) => s.writing >= 50 },
  { id: 'polyglot', icon: 'globe', check: (s) => (['es', 'de', 'ja'] as CourseId[]).every((c) => s.lessonsPerCourse[c] > 0) },
  { id: 'comeback', icon: 'sunrise', check: (s) => s.comeback },
  { id: 'perfect', icon: 'star', check: (s) => s.perfectLesson },
  { id: 'course-es', icon: 'medal', check: (s) => s.lessonsPerCourse.es >= s.courseLessonTotals.es && s.courseLessonTotals.es > 0 },
  { id: 'course-de', icon: 'medal', check: (s) => s.lessonsPerCourse.de >= s.courseLessonTotals.de && s.courseLessonTotals.de > 0 },
  { id: 'course-ja', icon: 'medal', check: (s) => s.lessonsPerCourse.ja >= s.courseLessonTotals.ja && s.courseLessonTotals.ja > 0 },
];

export function newlyUnlocked(stats: AggregateStats, unlocked: ReadonlySet<string>): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => !unlocked.has(a.id) && a.check(stats));
}

// ---------------------------------------------------------------------------
// Personal bests

export interface PersonalBests {
  streak: number;
  dayXp: number;
  dayMinutes: number;
  run: number;
}

export function personalBests(history: DailyStats[], streakBest: number): PersonalBests {
  return {
    streak: streakBest,
    dayXp: Math.max(0, ...history.map((d) => d.xp)),
    dayMinutes: Math.max(0, ...history.map((d) => Math.floor(d.activeSec / 60))),
    run: Math.max(0, ...history.map((d) => d.bestRun)),
  };
}
