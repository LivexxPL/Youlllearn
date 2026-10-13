/**
 * Developer tools. Everything that changes data runs only in the sandbox — a separate
 * database with test data — and only for a principal with the `sandbox.use` permission,
 * checked here (not only by hiding buttons). The learner's real progress, coins and
 * achievements are never touched; test coins are labelled as such in the sandbox ledger.
 */
import Dexie from 'dexie';
import { createDb, db, DB_NAME, SANDBOX_DB_NAME, SANDBOX_FLAG, sandboxActive, type PolyglotDB } from './db';
import { CLOUD_META_KEY } from '../config/cloud';
import { assertCan, type Principal } from '../auth/permissions';
import { exportData, importData } from './backup';
import { entry, grant } from './economy';
import { addStats, recordLessonCompletion, refreshAchievements, updateStreak, type SessionOutcomes } from './progress';
import { getCourse } from '../content/registry';
import type { CourseId } from '../content/types';
import { dayKey } from '../engine/dates';
import type { Outcome } from '../engine/srs';
import { audit } from './audit';

const DAY = 86_400_000;

export class SandboxOnlyError extends Error {
  constructor() {
    super('Simulations run only in the sandbox');
    this.name = 'SandboxOnlyError';
  }
}

interface Ctx {
  database?: PolyglotDB;
  /** Whether the app runs on the sandbox (tests pass it explicitly). */
  inSandbox?: boolean;
  now?: number;
}

function assertSandbox(principal: Principal, ctx: Ctx) {
  assertCan(principal, 'sandbox.use');
  if (!(ctx.inSandbox ?? sandboxActive())) throw new SandboxOnlyError();
}

/**
 * Prepares the sandbox and switches the app to it (reloads). With `copyRealData` the sandbox
 * starts as a copy of the real progress; otherwise it keeps its previous test data (or is
 * empty, which starts with onboarding). The sign-in is copied so the role stays available.
 */
export async function enterSandbox(principal: Principal, copyRealData: boolean, ctx: { real?: PolyglotDB; sandbox?: PolyglotDB; reload?: boolean } = {}): Promise<void> {
  assertCan(principal, 'sandbox.use');
  const real = ctx.real ?? (sandboxActive() ? createDb(DB_NAME) : db);
  const sandbox = ctx.sandbox ?? createDb(SANDBOX_DB_NAME);
  if (copyRealData) await importData(await exportData(real), sandbox);
  const account = await real.meta.get(CLOUD_META_KEY);
  if (account) await sandbox.meta.put(account);
  await audit(principal, 'sandbox.enter', copyRealData ? 'copy of real data' : undefined, real, false);
  if (ctx.reload === false) return;
  sandbox.close();
  sessionStorage.setItem(SANDBOX_FLAG, '1');
  location.reload();
}

/** Back to the real data (always allowed: leaving never needs a permission). */
export function exitSandbox(): void {
  sessionStorage.removeItem(SANDBOX_FLAG);
  location.reload();
}

/** Deletes all test data; inside the sandbox it starts again empty (the sign-in is kept). */
export async function resetSandbox(principal: Principal): Promise<void> {
  assertCan(principal, 'sandbox.use');
  const inside = sandboxActive();
  const account = inside ? await db.meta.get(CLOUD_META_KEY) : undefined;
  if (inside) db.close();
  await Dexie.delete(SANDBOX_DB_NAME);
  await audit(principal, 'sandbox.reset');
  if (!inside) return;
  if (account) {
    const fresh = createDb(SANDBOX_DB_NAME);
    await fresh.meta.put(account);
    fresh.close();
  }
  location.reload();
}

/** Test coins, labelled as an adjustment made for testing. */
export async function simulateCoins(principal: Principal, amount: number, ctx: Ctx = {}) {
  assertSandbox(principal, ctx);
  const now = ctx.now ?? Date.now();
  const added = await grant([entry('adjustment', `test:coins:${now}:${Math.random().toString(36).slice(2, 8)}`, Math.trunc(amount), now, { ref: 'developer-test' })], ctx.database ?? db);
  await audit(principal, 'simulate.coins', String(amount));
  return added;
}

export async function simulateXp(principal: Principal, amount: number, ctx: Ctx = {}) {
  assertSandbox(principal, ctx);
  await addStats({ xp: Math.trunc(amount) }, undefined, dayKey(ctx.now ?? Date.now()), ctx.database ?? db);
  await audit(principal, 'simulate.xp', String(amount));
}

/** Active days (15 minutes each) for the last `days` days, ending today. */
export async function simulateStreak(principal: Principal, days: number, courseId: CourseId, ctx: Ctx = {}) {
  assertSandbox(principal, ctx);
  const now = ctx.now ?? Date.now();
  const database = ctx.database ?? db;
  for (let i = 0; i < days; i++) await addStats({ activeSec: 15 * 60, exercises: 20, correct: 18 }, courseId, dayKey(now - i * DAY), database);
  await updateStreak(dayKey(now), database);
  await audit(principal, 'simulate.streak', `${days} days`);
}

/** Completes the next `count` unfinished lessons of a course (or all of them). */
export async function simulateLessons(principal: Principal, courseId: CourseId, count: number | 'all', ctx: Ctx = {}) {
  assertSandbox(principal, ctx);
  const database = ctx.database ?? db;
  const course = getCourse(courseId);
  const done = new Set((await database.lessonProgress.where('courseId').equals(courseId).toArray()).map((p) => p.id));
  const todo = course.lessons.filter((l) => !done.has(l.id));
  const lessons = count === 'all' ? todo : todo.slice(0, count);
  let now = ctx.now ?? Date.now();
  for (const lesson of lessons) {
    const refs = [...lesson.items.map((i) => i.id), ...lesson.sentences.map((s) => s.id)];
    const outcomes: SessionOutcomes = {
      byRef: new Map(refs.map((r) => [r, [{ correct: true, skill: 'recognition' } satisfies Outcome]])),
      graded: Math.max(10, refs.length),
      correct: Math.max(10, refs.length),
      xp: 100,
      bestRun: 10,
      speaking: 0,
      writing: 0,
    };
    await recordLessonCompletion({ course, lessonId: lesson.id, outcomes, now }, database);
    now += 1000;
  }
  await audit(principal, 'simulate.lessons', `${courseId}: ${lessons.length}`);
  return lessons.length;
}

export async function simulateAchievements(principal: Principal, ctx: Ctx = {}) {
  assertSandbox(principal, ctx);
  const fresh = await refreshAchievements(ctx.database ?? db);
  await audit(principal, 'simulate.achievements', fresh.map((a) => a.id).join(', '));
  return fresh;
}

/** Shows onboarding again (the app reloads its settings afterwards). */
export async function simulateOnboarding(principal: Principal, ctx: Ctx = {}) {
  assertSandbox(principal, ctx);
  await (ctx.database ?? db).settings.update('app', { onboarded: false });
  await audit(principal, 'simulate.onboarding');
}
