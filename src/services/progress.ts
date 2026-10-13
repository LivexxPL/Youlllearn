/**
 * Writes learning results to IndexedDB: SRS cards, lesson progress, daily
 * statistics, XP, quests/challenges, achievements and the streak.
 */
import type { CourseId, Course } from '../content/types';
import { allCourses, COURSE_ORDER } from '../content/registry';
import { db, emptyDailyStats, getMeta, setMeta, type DailyStats, type LedgerEntry, type PolyglotDB, type Settings } from './db';
import { achievementEntry, entry, grant, lessonEntry, practiceEntry, walletOf, type PracticeFamily } from './economy';
import { REWARDS } from '../config/economy';
import { dayKey, weekKey, daysBetween } from '../engine/dates';
import { introduceCard, reviewCard, cardStatus, type Card, type CardKind, type Outcome } from '../engine/srs';
import {
  XP,
  dailyQuests,
  evaluateStreak,
  initialStreak,
  isActiveDay,
  newlyUnlocked,
  questValue,
  weeklyChallenge,
  weeklyValue,
  type AchievementDef,
  type AggregateStats,
  type Quest,
  type StreakResult,
  type StreakState,
  type WeeklyChallenge,
} from '../engine/gamification';

export type NumericStat = Exclude<keyof DailyStats, 'date' | 'courses'>;

/** Adds to today's statistics (bestRun is maxed, not summed). */
export async function addStats(patch: Partial<Record<NumericStat, number>>, courseId?: CourseId, date = dayKey(), database: PolyglotDB = db): Promise<void> {
  await database.transaction('rw', database.dailyStats, async () => {
    const cur = (await database.dailyStats.get(date)) ?? emptyDailyStats(date);
    const next: DailyStats = { ...cur };
    for (const [k, v] of Object.entries(patch) as [NumericStat, number][]) {
      if (!v) continue;
      next[k] = k === 'bestRun' ? Math.max(cur.bestRun, v) : cur[k] + v;
    }
    if (courseId && !next.courses.includes(courseId)) next.courses = [...next.courses, courseId];
    await database.dailyStats.put(next);
  });
}

export function cardKindOf(course: Course, id: string): CardKind | null {
  if (course.items.has(id)) return 'item';
  if (course.sentences.has(id)) return 'sentence';
  if (course.grammar.has(id)) return 'grammar';
  return null;
}

export interface SessionOutcomes {
  /** Outcomes per SRS ref in the order they happened. */
  byRef: Map<string, Outcome[]>;
  graded: number;
  correct: number;
  xp: number;
  bestRun: number;
  speaking: number;
  writing: number;
}

export interface LessonCompletion {
  course: Course;
  lessonId: string;
  outcomes: SessionOutcomes;
  now?: number;
}

export interface LessonCompletionResult {
  newItems: number;
  accuracy: number;
  xp: number;
  perfect: boolean;
  /** Coin entries granted for this completion (none when already rewarded). */
  coins: LedgerEntry[];
}

export async function recordLessonCompletion(input: LessonCompletion, database: PolyglotDB = db): Promise<LessonCompletionResult> {
  const now = input.now ?? Date.now();
  const { course, lessonId, outcomes } = input;
  const lesson = course.lessons[course.lessonIndex.get(lessonId) ?? -1];
  if (!lesson) throw new Error(`Unknown lesson ${lessonId}`);
  const accuracy = outcomes.graded ? outcomes.correct / outcomes.graded : 1;
  const xp = outcomes.xp + XP.lessonComplete;

  // Cards for everything introduced by the lesson.
  const ids = [
    ...lesson.items.map((i) => i.id),
    ...lesson.sentences.map((s) => s.id),
    ...(lesson.grammar ?? []).filter((g) => course.conceptExercises.has(g.id)).map((g) => g.id),
  ];
  let newItems = 0;
  let coins: LedgerEntry[] = [];
  await database.transaction('rw', database.cards, database.lessonProgress, database.ledger, async () => {
    const existing = new Map((await database.cards.bulkGet(ids)).filter((c): c is Card => Boolean(c)).map((c) => [c.id, c]));
    const writes: Card[] = [];
    for (const id of ids) {
      const kind = cardKindOf(course, id);
      if (!kind) continue;
      const outs = outcomes.byRef.get(id) ?? [];
      const prev = existing.get(id);
      if (!prev) {
        // Items count as "seen" in the lesson even without a graded exercise.
        const seed: Outcome[] = outs.length ? outs : [{ correct: true, skill: 'recognition', usedHint: true }];
        writes.push(introduceCard(id, course.id, kind, seed, now));
        if (kind === 'item') newItems += 1;
      } else if (outs.length && cardStatus(prev, now) !== 'learning' && prev.due <= now) {
        writes.push(reviewCard(prev, outs[0], now));
      }
    }
    if (writes.length) await database.cards.bulkPut(writes);
    const lp = await database.lessonProgress.get(lessonId);
    await database.lessonProgress.put({
      id: lessonId,
      courseId: course.id,
      completedAt: lp?.completedAt ?? now,
      lastCompletedAt: now,
      completions: (lp?.completions ?? 0) + 1,
      bestAccuracy: Math.max(lp?.bestAccuracy ?? 0, accuracy),
      lastAccuracy: accuracy,
    });
    // Saved with the progress: a completion is rewarded once, whatever happens next.
    const reward = lessonEntry(lessonId, !lp, outcomes.graded, now);
    if (reward) coins = await grant([reward], database);
  });

  await addStats(
    {
      exercises: outcomes.graded,
      correct: outcomes.correct,
      newItems,
      lessons: 1,
      xp,
      bestRun: outcomes.bestRun,
      speaking: outcomes.speaking,
      writing: outcomes.writing,
    },
    course.id,
    dayKey(now),
    database,
  );
  return { newItems, accuracy, xp, perfect: outcomes.graded > 0 && outcomes.correct === outcomes.graded, coins };
}

/** Identifies one practice session for its coin reward (see services/economy.ts). */
export interface PracticeReward {
  family: PracticeFamily;
  sessionId: string;
}

export async function recordReviewSession(
  course: Course,
  outcomes: SessionOutcomes,
  now = Date.now(),
  database: PolyglotDB = db,
  reward?: PracticeReward,
): Promise<{ reviewed: number; xp: number; coins: LedgerEntry[] }> {
  let reviewed = 0;
  let coins: LedgerEntry[] = [];
  await database.transaction('rw', database.cards, database.ledger, async () => {
    const ids = [...outcomes.byRef.keys()];
    const cards = (await database.cards.bulkGet(ids)).filter((c): c is Card => Boolean(c));
    const writes = cards.map((c) => reviewCard(c, outcomes.byRef.get(c.id)![0], now));
    reviewed = writes.length;
    if (writes.length) await database.cards.bulkPut(writes);
    if (reward) {
      const e = await practiceEntry(reward.family, reward.sessionId, cards.map((c) => c.id), now, database);
      if (e) coins = await grant([e], database);
    }
  });
  await addStats(
    {
      exercises: outcomes.graded,
      correct: outcomes.correct,
      reviews: reviewed,
      xp: outcomes.xp,
      bestRun: outcomes.bestRun,
      speaking: outcomes.speaking,
      writing: outcomes.writing,
    },
    course.id,
    dayKey(now),
    database,
  );
  return { reviewed, xp: outcomes.xp, coins };
}

/** Self-rated flashcards / audio reviews update cards individually. */
export async function applyOutcome(courseId: CourseId, id: string, outcome: Outcome, now = Date.now(), database: PolyglotDB = db) {
  const card = await database.cards.get(id);
  if (!card || card.courseId !== courseId) return;
  await database.cards.put(reviewCard(card, outcome, now));
}

/** Marks an item as needing extra practice (from Audio Quest "difficult" button). */
export async function markDifficult(id: string, now = Date.now(), database: PolyglotDB = db) {
  const card = await database.cards.get(id);
  if (!card) return;
  await database.cards.put({ ...card, recent: [...card.recent, false, false].slice(-8), due: Math.min(card.due, now) });
}

// ---------------------------------------------------------------------------
// Quests, challenges, rewards

export interface QuestStatus {
  quest: Quest;
  value: number;
  done: boolean;
  claimed: boolean;
}

export async function questStatuses(settings: Settings, date = dayKey(), database: PolyglotDB = db): Promise<{ quests: QuestStatus[]; allClaimed: boolean }> {
  const stats = await database.dailyStats.get(date);
  const quests = dailyQuests(date, settings.profileSeed, settings.dailyGoalMin, settings.courses);
  const rewards = new Set((await database.rewards.where('date').equals(date).toArray()).map((r) => r.id));
  const list = quests.map((q) => {
    const value = questValue(stats, q.metric);
    return { quest: q, value, done: value >= q.target, claimed: rewards.has(`${date}:${q.id}`) };
  });
  return { quests: list, allClaimed: rewards.has(`${date}:all`) };
}

export interface ChallengeStatus {
  challenge: WeeklyChallenge;
  value: number;
  done: boolean;
  claimed: boolean;
}

export async function challengeStatus(settings: Settings, date = dayKey(), database: PolyglotDB = db): Promise<ChallengeStatus> {
  const week = weekKey(new Date(date + 'T12:00:00'));
  const challenge = weeklyChallenge(week, settings.profileSeed, settings.dailyGoalMin);
  const all = await database.dailyStats.toArray();
  const map = new Map(all.map((d) => [d.date, d]));
  const value = weeklyValue(map, date, challenge.metric);
  const claimed = Boolean(await database.rewards.get(`${week}:${challenge.id}`));
  return { challenge, value, done: value >= challenge.target, claimed };
}

export interface ClaimedReward {
  kind: 'quest' | 'all-quests' | 'challenge';
  titleKey: string;
  target?: number;
  xp: number;
  coins: number;
}

/**
 * Awards XP and coins for newly completed quests/challenge, in one transaction. Each reward is
 * granted once (the reward record and the coin entry share the quest's day or week).
 */
export async function claimRewards(settings: Settings, date = dayKey(), database: PolyglotDB = db): Promise<ClaimedReward[]> {
  return database.transaction('rw', [database.rewards, database.ledger, database.dailyStats], async () => {
    const claimed: ClaimedReward[] = [];
    const coinEntries: LedgerEntry[] = [];
    const { quests, allClaimed } = await questStatuses(settings, date, database);
    const at = Date.now();
    for (const q of quests) {
      if (q.done && !q.claimed) {
        await database.rewards.put({ id: `${date}:${q.quest.id}`, xp: q.quest.xp, at, date });
        coinEntries.push(entry('quest', `quest:${date}:${q.quest.id}`, REWARDS.quest, at, { ref: q.quest.id }));
        claimed.push({ kind: 'quest', titleKey: q.quest.titleKey, target: q.quest.target, xp: q.quest.xp, coins: REWARDS.quest });
      }
    }
    if (!allClaimed && quests.length && quests.every((q) => q.done)) {
      await database.rewards.put({ id: `${date}:all`, xp: XP.allQuestsBonus, at, date });
      coinEntries.push(entry('quest', `quest:${date}:all`, REWARDS.allQuests, at, { ref: 'all' }));
      claimed.push({ kind: 'all-quests', titleKey: 'quest.allDone', xp: XP.allQuestsBonus, coins: REWARDS.allQuests });
    }
    const ch = await challengeStatus(settings, date, database);
    if (ch.done && !ch.claimed) {
      const week = weekKey(new Date(date + 'T12:00:00'));
      await database.rewards.put({ id: `${week}:${ch.challenge.id}`, xp: ch.challenge.xp, at, date });
      coinEntries.push(entry('challenge', `challenge:${week}:${ch.challenge.id}`, REWARDS.weeklyChallenge, at, { ref: ch.challenge.id }));
      claimed.push({ kind: 'challenge', titleKey: ch.challenge.titleKey, target: ch.challenge.target, xp: ch.challenge.xp, coins: REWARDS.weeklyChallenge });
    }
    await grant(coinEntries, database);
    const bonus = claimed.reduce((n, c) => n + c.xp, 0);
    if (bonus) await addStats({ xp: bonus }, undefined, date, database);
    return claimed;
  });
}

export async function totalXp(database: PolyglotDB = db): Promise<number> {
  const all = await database.dailyStats.toArray();
  return all.reduce((n, d) => n + d.xp, 0);
}

// ---------------------------------------------------------------------------
// Streak

const STREAK_KEY = 'streak';

export async function updateStreak(today = dayKey(), database: PolyglotDB = db): Promise<StreakResult> {
  const prev = await getMeta<StreakState>(STREAK_KEY, initialStreak, database);
  const all = await database.dailyStats.toArray();
  const active = new Set(all.filter(isActiveDay).map((d) => d.date));
  const result = evaluateStreak(prev, active, today);
  await setMeta(STREAK_KEY, result.state, database);
  return result;
}

// ---------------------------------------------------------------------------
// Achievements

export async function aggregateStats(now = Date.now(), database: PolyglotDB = db): Promise<AggregateStats> {
  const [progress, cards, days, streak, meta, ledger] = await Promise.all([
    database.lessonProgress.toArray(),
    database.cards.toArray(),
    database.dailyStats.toArray(),
    getMeta<StreakState>(STREAK_KEY, initialStreak, database),
    getMeta<{ comeback?: boolean; perfect?: boolean; marathon?: boolean }>('flags', {}, database),
    database.ledger.toArray(),
  ]);
  const totals = Object.fromEntries(allCourses().map((c) => [c.id, c.lessons.length])) as Record<CourseId, number>;
  const lessonsOfLevel = (match: (level: string) => boolean) =>
    new Set(allCourses().flatMap((c) => c.units.filter((u) => u.level && match(u.level)).flatMap((u) => u.lessons.map((l) => l.id))));
  const a2 = lessonsOfLevel((level) => level.startsWith('A2'));
  const b1 = lessonsOfLevel((level) => level === 'B1');
  const perCourse = Object.fromEntries(COURSE_ORDER.map((c) => [c, 0])) as Record<CourseId, number>;
  for (const p of progress) perCourse[p.courseId] += 1;
  const done = new Set(progress.map((p) => p.id));
  // The beginner part of a course: its kana and A1 units.
  const beginnerCourseDone = allCourses().some((c) => {
    const beginner = c.units.filter((u) => u.level && (u.level.startsWith('A1') || u.level === 'Kana')).flatMap((u) => u.lessons.map((l) => l.id));
    return beginner.length > 0 && beginner.every((id) => done.has(id));
  });
  return {
    lessonsCompleted: progress.length,
    levelA2Lessons: progress.filter((p) => a2.has(p.id)).length,
    levelB1Lessons: progress.filter((p) => b1.has(p.id)).length,
    completedLessonIds: new Set(progress.map((p) => p.id)),
    lessonsPerCourse: perCourse,
    courseLessonTotals: totals,
    itemsStarted: cards.filter((c) => c.kind === 'item').length,
    established: cards.filter((c) => cardStatus(c, now) === 'established').length,
    streakBest: streak.best,
    activeDays: days.filter(isActiveDay).length,
    listeningMin: Math.floor(days.reduce((n, d) => n + d.listeningSec, 0) / 60),
    reviews: days.reduce((n, d) => n + d.reviews, 0),
    speaking: days.reduce((n, d) => n + d.speaking, 0),
    writing: days.reduce((n, d) => n + d.writing, 0),
    perfectLesson: Boolean(meta.perfect),
    comeback: Boolean(meta.comeback),
    marathon: Boolean(meta.marathon),
    beginnerCourseDone,
    coinsEarned: walletOf(ledger).earned,
  };
}

export async function setFlag(flag: 'comeback' | 'perfect' | 'marathon', database: PolyglotDB = db) {
  const flags = await getMeta<Record<string, boolean>>('flags', {}, database);
  if (!flags[flag]) await setMeta('flags', { ...flags, [flag]: true }, database);
}

/** Unlocks achievements that are now earned, with their coins and items, in one transaction. */
export async function refreshAchievements(database: PolyglotDB = db): Promise<AchievementDef[]> {
  const tables = [database.achievements, database.ledger, database.lessonProgress, database.cards, database.dailyStats, database.meta];
  return database.transaction('rw', tables, async () => {
    const all: AchievementDef[] = [];
    // A second pass catches achievements that the first pass's coins unlock (e.g. "100 coins").
    for (let pass = 0; pass < 2; pass++) {
      const now = Date.now();
      const stats = await aggregateStats(now, database);
      const unlocked = new Set((await database.achievements.toArray()).map((a) => a.id));
      const fresh = newlyUnlocked(stats, unlocked);
      if (!fresh.length) break;
      await database.achievements.bulkPut(fresh.map((a) => ({ id: a.id, unlockedAt: now })));
      await grant(fresh.map((a) => achievementEntry(a.id, now)), database);
      all.push(...fresh);
    }
    return all;
  });
}

/** Called once per app start/day: detects a return after a break (for a positive "welcome back"). */
export async function detectComeback(today = dayKey(), database: PolyglotDB = db): Promise<boolean> {
  const all = (await database.dailyStats.toArray()).filter(isActiveDay).map((d) => d.date).sort();
  const lastBeforeToday = all.filter((d) => d < today).at(-1);
  return Boolean(lastBeforeToday && daysBetween(lastBeforeToday, today) > 3);
}
