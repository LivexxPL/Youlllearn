/**
 * Daily recommendation: answers "what should I do now, and how long will it take?".
 */
import type { Course, Lesson } from '../content/types';

export type RecommendationKind = 'lesson' | 'review' | 'audio' | 'repeat';

export interface Recommendation {
  kind: RecommendationKind;
  minutes: number;
  lesson?: Lesson;
  dueCount: number;
  reasonKey: 'rec.lessonWhy' | 'rec.reviewWhy' | 'rec.audioWhy' | 'rec.repeatLessonDesc';
}

/** Seconds per review card on average (used for time estimates). */
export const SECONDS_PER_REVIEW = 18;

export function reviewMinutes(count: number): number {
  return Math.max(1, Math.round((count * SECONDS_PER_REVIEW) / 60));
}

export function nextLesson(course: Course, completed: ReadonlySet<string>): Lesson | undefined {
  return course.lessons.find((l) => !completed.has(l.id));
}

export function recommend(input: { course: Course; completed: ReadonlySet<string>; dueCount: number; goalMet: boolean }): Recommendation {
  const { course, completed, dueCount, goalMet } = input;
  const next = nextLesson(course, completed);
  const reviewBatch = Math.min(dueCount, 15);

  // Many due cards: refresh memory before adding new material.
  if (dueCount >= 15 || (dueCount >= 8 && goalMet)) {
    return { kind: 'review', minutes: reviewMinutes(reviewBatch), dueCount, reasonKey: 'rec.reviewWhy' };
  }
  if (goalMet && completed.size > 0) {
    if (dueCount > 0) return { kind: 'review', minutes: reviewMinutes(reviewBatch), dueCount, reasonKey: 'rec.reviewWhy' };
    return { kind: 'audio', minutes: 5, dueCount, reasonKey: 'rec.audioWhy' };
  }
  if (next) return { kind: 'lesson', minutes: next.minutes, lesson: next, dueCount, reasonKey: 'rec.lessonWhy' };
  if (dueCount > 0) return { kind: 'review', minutes: reviewMinutes(reviewBatch), dueCount, reasonKey: 'rec.reviewWhy' };
  return { kind: 'repeat', minutes: 5, dueCount, reasonKey: 'rec.repeatLessonDesc' };
}
