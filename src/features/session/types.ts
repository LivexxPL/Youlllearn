import type { ReactNode } from 'react';
import type { CourseId } from '../../content/types';
import type { AnswerIssue } from '../../engine/answer';
import type { SelfRating } from '../../engine/srs';
import type { Exercise } from '../../engine/exercises';

export interface ExerciseResult {
  correct: boolean;
  almost?: boolean;
  usedHint?: boolean;
  selfRating?: SelfRating;
  /** Correct answer to display in the feedback panel. */
  expected?: ReactNode;
  /** Target-language text to play from the feedback panel. */
  expectedSpeak?: string;
  issues?: AnswerIssue[];
  explanation?: string;
  /** Number of wrong attempts (match exercise). */
  mistakes?: number;
  /** Skip the feedback panel (self-assessed steps). */
  silent?: boolean;
}

export interface StepProps<E extends Exercise = Exercise> {
  ex: E;
  courseId: CourseId;
  /** True while the feedback panel is shown — inputs are frozen. */
  locked: boolean;
  showRomaji: boolean;
  onResult: (r: ExerciseResult) => void;
  onContinue: () => void;
}

export type ExerciseOf<K extends Exercise['kind']> = Extract<Exercise, { kind: K }>;
