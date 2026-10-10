import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { CourseId } from '../content/types';
import { db, type DailyStats, type LessonProgress } from '../services/db';
import { dayKey } from '../engine/dates';
import type { Card } from '../engine/srs';
import { useSettings } from './settings';
import { HIRAGANA_LESSONS } from '../content/ja';
import { audio, type ListeningStage } from '../services/audio';
import { getCourse } from '../content/registry';
import { coveredLessons } from '../engine/levels';

export function useLessonProgress(): Map<string, LessonProgress> | undefined {
  const list = useLiveQuery(() => db.lessonProgress.toArray(), []);
  return useMemo(() => (list ? new Map(list.map((p) => [p.id, p])) : undefined), [list]);
}

/** Completed lesson ids (of one course, or all); `undefined` while the database is loading. */
export function useCompleted(courseId?: CourseId): ReadonlySet<string> | undefined {
  const progress = useLessonProgress();
  return useMemo(() => {
    if (!progress) return undefined;
    const ids = [...progress.values()].filter((p) => !courseId || p.courseId === courseId).map((p) => p.id);
    return new Set(ids);
  }, [progress, courseId]);
}

const NONE: ReadonlySet<string> = new Set();

/** Like useCompleted, but empty while loading (for screens where that cannot mislead). */
export function useCompletedSet(courseId?: CourseId): ReadonlySet<string> {
  return useCompleted(courseId) ?? NONE;
}

export function useCards(courseId?: CourseId): Card[] | undefined {
  return useLiveQuery(() => (courseId ? db.cards.where('courseId').equals(courseId).toArray() : db.cards.toArray()), [courseId]);
}

/** Today's stats, re-evaluated when the date changes while the app is open. */
export function useToday(): DailyStats | undefined {
  const today = useDayKey();
  return useLiveQuery(() => db.dailyStats.get(today), [today]);
}

export function useAllStats(): DailyStats[] | undefined {
  return useLiveQuery(() => db.dailyStats.toArray(), []);
}

export function useDayKey(): string {
  const [key, setKey] = useState(dayKey());
  useEffect(() => {
    const id = setInterval(() => {
      const k = dayKey();
      setKey((prev) => (prev === k ? prev : k));
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return key;
}

/** Whether romaji should be shown automatically for Japanese text. */
export function useShowRomaji(lessonId?: string): boolean {
  const { settings } = useSettings();
  const completed = useCompletedSet('ja');
  if (settings.romaji === 'always') return true;
  if (settings.romaji === 'never') return false;
  // auto: during the kana unit and until all hiragana lessons are finished.
  const inKanaUnit = lessonId ? HIRAGANA_LESSONS.includes(lessonId) : false;
  return inKanaUnit || !HIRAGANA_LESSONS.every((l) => completed.has(l));
}

/** Listening stage grows with progress: clear and slow → normal → closer to natural speech. */
export function stageForProgress(completedCount: number, totalLessons: number): ListeningStage {
  const share = totalLessons ? completedCount / totalLessons : 0;
  if (share < 0.3) return 1;
  if (share < 0.65) return 2;
  return 3;
}

export function useListeningStage(courseId: CourseId): ListeningStage {
  const completed = useCompletedSet(courseId);
  const course = getCourse(courseId);
  // A learner who started at A2 gets A2-appropriate speed, not the beginner default.
  return stageForProgress(coveredLessons(course, completed), course.lessons.length);
}

/** Re-renders when voices change; returns the TTS status for a language tag. */
export function useAudioStatus(lang: string) {
  const version = useSyncExternalStore(
    (cb) => audio.subscribe(cb),
    () => audio.version,
  );
  return useMemo(() => audio.status(lang), [lang, version]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useAudioPlaying(): boolean {
  return useSyncExternalStore(
    (cb) => audio.subscribe(cb),
    () => audio.isPlaying,
  );
}
