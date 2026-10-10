/**
 * Local persistence (IndexedDB via Dexie). Everything stays on the device;
 * there is no account and no server. See docs/ARCHITECTURE.md.
 */
import Dexie, { type EntityTable } from 'dexie';
import type { CourseId } from '../content/types';
import type { Card } from '../engine/srs';

export type ThemePref = 'system' | 'light' | 'dark';
export type MotionPref = 'system' | 'reduce' | 'full';
export type RomajiMode = 'auto' | 'always' | 'never';
export type DailyGoal = 5 | 10 | 20 | 30;
export type UiLang = 'pl';

export interface ReminderSettings {
  enabled: boolean;
  /** Local time HH:MM. */
  time: string;
  /** Days of week, 0 = Sunday … 6 = Saturday. */
  days: number[];
}

export interface Settings {
  id: 'app';
  schema: number;
  uiLang: UiLang;
  onboarded: boolean;
  activeCourse: CourseId;
  courses: CourseId[];
  dailyGoalMin: DailyGoal;
  theme: ThemePref;
  textScale: number;
  motion: MotionPref;
  sounds: boolean;
  haptics: boolean;
  autoplayAudio: boolean;
  /** User multiplier on top of the stage speed (1 = default). */
  speechRate: number;
  /** Speak the Polish meaning after target audio in Audio Quest. */
  narrateTranslations: boolean;
  /** speechLang -> preferred voice id (voiceURI on web, index/name on Android). */
  voices: Record<string, string>;
  speechRecognition: boolean;
  romaji: RomajiMode;
  furigana: boolean;
  jaSpacing: boolean;
  stylusMode: boolean;
  penOnly: boolean;
  leftHanded: boolean;
  brushSize: number;
  reminders: ReminderSettings;
  /** Seed for deterministic but per-user daily quests. */
  profileSeed: string;
  createdAt: number;
}

export interface DailyStats {
  date: string;
  /** Seconds of active learning (interaction or audio playback in a learning activity). */
  activeSec: number;
  listeningSec: number;
  /** Seconds the app was visible, active or not — shown for transparency. */
  openSec: number;
  exercises: number;
  correct: number;
  newItems: number;
  reviews: number;
  lessons: number;
  speaking: number;
  writing: number;
  audioSessions: number;
  xp: number;
  bestRun: number;
  courses: CourseId[];
}

export interface LessonProgress {
  id: string;
  courseId: CourseId;
  completedAt: number;
  lastCompletedAt: number;
  completions: number;
  bestAccuracy: number;
  lastAccuracy: number;
}

export interface AchievementRecord {
  id: string;
  unlockedAt: number;
}

/** XP awarded once for a quest/challenge (id = `${period}:${questId}`). */
export interface RewardRecord {
  id: string;
  xp: number;
  at: number;
  date: string;
}

export type StrokePoint = [x: number, y: number, pressure: number];

export interface Stroke {
  points: StrokePoint[];
  /** Brush size relative to canvas width (0..1). */
  size: number;
  pointerType: string;
}

export interface Drawing {
  /** e.g. `kana:あ`, `note:es.l1` */
  id: string;
  kind: 'practice' | 'note';
  strokes: Stroke[];
  updatedAt: number;
  /** Optional free-text title for notes. */
  title?: string;
  /** Practice only: last self-assessment (the pad is cleared after rating). */
  practisedAt?: number;
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

export type PolyglotDB = Dexie & {
  settings: EntityTable<Settings, 'id'>;
  cards: EntityTable<Card, 'id'>;
  lessonProgress: EntityTable<LessonProgress, 'id'>;
  dailyStats: EntityTable<DailyStats, 'date'>;
  achievements: EntityTable<AchievementRecord, 'id'>;
  rewards: EntityTable<RewardRecord, 'id'>;
  drawings: EntityTable<Drawing, 'id'>;
  meta: EntityTable<MetaRecord, 'key'>;
};

export const DB_NAME = 'polyglot-quest';

export function createDb(name = DB_NAME): PolyglotDB {
  const db = new Dexie(name) as PolyglotDB;
  db.version(1).stores({
    settings: 'id',
    cards: 'id, courseId, due, kind',
    lessonProgress: 'id, courseId',
    dailyStats: 'date',
    achievements: 'id',
    rewards: 'id, date',
    drawings: 'id, kind, updatedAt',
    meta: 'key',
  });
  return db;
}

export const db = createDb();

export const TABLES = [
  'settings',
  'cards',
  'lessonProgress',
  'dailyStats',
  'achievements',
  'rewards',
  'drawings',
  'meta',
] as const;
export type TableName = (typeof TABLES)[number];

export function emptyDailyStats(date: string): DailyStats {
  return {
    date,
    activeSec: 0,
    listeningSec: 0,
    openSec: 0,
    exercises: 0,
    correct: 0,
    newItems: 0,
    reviews: 0,
    lessons: 0,
    speaking: 0,
    writing: 0,
    audioSessions: 0,
    xp: 0,
    bestRun: 0,
    courses: [],
  };
}

export async function getMeta<T>(key: string, fallback: T, database: PolyglotDB = db): Promise<T> {
  const rec = await database.meta.get(key);
  return rec ? (rec.value as T) : fallback;
}

export async function setMeta(key: string, value: unknown, database: PolyglotDB = db): Promise<void> {
  await database.meta.put({ key, value });
}
