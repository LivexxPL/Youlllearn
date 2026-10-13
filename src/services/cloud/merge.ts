/**
 * Combines the learner data of this device with the copy in the cloud, so that learning done
 * on any device survives a synchronisation. Pure functions, no I/O.
 *
 * Records are matched by primary key and the merge never deletes anything. Per table:
 * - cards: the version reviewed more recently (then: more repetitions).
 * - lessonProgress: the latest completion, with the first completion date, the highest
 *   completion count and the best accuracy of both.
 * - dailyStats: per day, the larger value of each counter. The same day is never counted
 *   twice; practice on two devices on the same day can be undercounted, never doubled.
 * - achievements: union, earliest unlock date.
 * - rewards: union (ids name the quest/challenge and its period, so a reward stays single).
 * - drawings: the more recently updated drawing.
 * - settings: this device's settings with the courses of both; the cloud copy when this
 *   device has not been set up yet (restoring onto a new phone).
 * - meta: streak and flags combined (see mergeMeta), other keys by their own rule.
 *   Device-only keys (isDeviceMeta) never come from the cloud.
 */
import { isDeviceMeta, type AchievementRecord, type DailyStats, type Drawing, type LessonProgress, type MetaRecord, type Settings, type TableName } from '../db';
import type { BackupData } from '../backup';
import type { Card } from '../../engine/srs';
import type { StreakState } from '../../engine/gamification';

type Picker<T> = (local: T, remote: T) => T;

/** Union of two record lists by key; `pick` decides when both sides have a record. */
function mergeBy<T>(local: unknown[] = [], remote: unknown[] = [], key: (r: T) => string, pick: Picker<T>): T[] {
  const out = new Map<string, T>();
  for (const r of local as T[]) out.set(key(r), r);
  for (const r of remote as T[]) {
    const k = key(r);
    const l = out.get(k);
    out.set(k, l === undefined ? r : pick(l, r));
  }
  // Primary-key order, as IndexedDB returns it (keeps fingerprints stable).
  return [...out.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([, v]) => v);
}

const keepLocal = <T>(l: T): T => l;

const newerCard: Picker<Card> = (l, r) => (r.lastReviewed > l.lastReviewed || (r.lastReviewed === l.lastReviewed && r.reps > l.reps) ? r : l);

const mergeLesson: Picker<LessonProgress> = (l, r) => {
  const latest = r.lastCompletedAt > l.lastCompletedAt ? r : l;
  return {
    ...latest,
    completedAt: Math.min(l.completedAt, r.completedAt),
    completions: Math.max(l.completions, r.completions),
    bestAccuracy: Math.max(l.bestAccuracy, r.bestAccuracy),
  };
};

const mergeDay: Picker<DailyStats> = (l, r) => {
  const out: Record<string, unknown> = { ...l };
  for (const [k, v] of Object.entries(r)) {
    if (typeof v === 'number') out[k] = Math.max(Number((l as unknown as Record<string, unknown>)[k] ?? 0), v);
  }
  out.courses = [...new Set([...(l.courses ?? []), ...(r.courses ?? [])])];
  return out as unknown as DailyStats;
};

const earlierUnlock: Picker<AchievementRecord> = (l, r) => (r.unlockedAt < l.unlockedAt ? r : l);

const newerDrawing: Picker<Drawing> = (l, r) => (r.updatedAt > l.updatedAt ? r : l);

export function mergeSettings(local: Settings | undefined, remote: Settings | undefined): Settings | undefined {
  if (!remote) return local;
  if (!local || (!local.onboarded && remote.onboarded)) return remote;
  if (!remote.onboarded) return local;
  const courses = [...local.courses, ...(remote.courses ?? []).filter((c) => !local.courses.includes(c))];
  return courses.length === local.courses.length ? local : { ...local, courses };
}

export function mergeStreak(l: StreakState, r: StreakState): StreakState {
  // The state evaluated up to the later day carries the shield count; days bridged by a
  // shield on either device stay bridged.
  const later = (r.lastEvaluated ?? '') > (l.lastEvaluated ?? '') ? r : l;
  return {
    ...later,
    protectedDays: [...new Set([...l.protectedDays, ...r.protectedDays])].sort(),
    best: Math.max(l.best, r.best),
  };
}

function mergeMetaValue(key: string, l: unknown, r: unknown): unknown {
  if (key === 'streak') return mergeStreak(l as StreakState, r as StreakState);
  if (key === 'flags') {
    const out: Record<string, boolean> = { ...(l as Record<string, boolean>) };
    for (const [k, v] of Object.entries(r as Record<string, boolean>)) out[k] = Boolean(out[k] || v);
    return out;
  }
  if (key.startsWith('story:')) return ((r as { at?: number }).at ?? 0) > ((l as { at?: number }).at ?? 0) ? r : l;
  return l;
}

export function mergeMeta(local: unknown[] = [], remote: unknown[] = []): MetaRecord[] {
  const fromCloud = (remote as MetaRecord[]).filter((m) => !isDeviceMeta(m.key));
  return mergeBy<MetaRecord>(local, fromCloud, (m) => m.key, (l, r) => ({ key: l.key, value: mergeMetaValue(l.key, l.value, r.value) }));
}

/** This device's data combined with another copy of the same learner's data. */
export function mergeData(local: BackupData, remote: Partial<BackupData>): BackupData {
  const settings = mergeSettings((local.settings as Settings[] | undefined)?.[0], (remote.settings as Settings[] | undefined)?.[0]);
  // Typed as a full record: a new table cannot be added without a merge rule here.
  return {
    settings: settings ? [settings] : [],
    cards: mergeBy<Card>(local.cards, remote.cards, (c) => c.id, newerCard),
    lessonProgress: mergeBy<LessonProgress>(local.lessonProgress, remote.lessonProgress, (p) => p.id, mergeLesson),
    dailyStats: mergeBy<DailyStats>(local.dailyStats, remote.dailyStats, (d) => d.date, mergeDay),
    achievements: mergeBy<AchievementRecord>(local.achievements, remote.achievements, (a) => a.id, earlierUnlock),
    rewards: mergeBy<{ id: string }>(local.rewards, remote.rewards, (r) => r.id, keepLocal),
    drawings: mergeBy<Drawing>(local.drawings, remote.drawings, (d) => d.id, newerDrawing),
    meta: mergeMeta(local.meta, remote.meta),
  } satisfies Record<TableName, unknown[]>;
}

/** JSON with object keys sorted, so equal data always gives the same text. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_k, v: unknown) =>
    v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) : v,
  );
}

/** Short hash of the data (cyrb53): tells whether anything changed since the last sync. */
export function fingerprint(value: unknown): string {
  const text = canonicalJson(value);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36) + ':' + text.length.toString(36);
}
