/**
 * Course levels: lessons grouped by the level label of their unit
 * ("Kana", "A1", "A2", …), for progress per level and level shortcuts.
 */
import type { Course, Lesson } from '../content/types';

export interface LevelProgress {
  level: string;
  done: number;
  total: number;
  /** First lesson of the level, in course order. */
  first: Lesson;
}

/** Consecutive units with the same level label form one level. Units without a label are grouped under "". */
export function levelProgress(course: Course, completed: ReadonlySet<string>): LevelProgress[] {
  const out: LevelProgress[] = [];
  for (const unit of course.units) {
    if (!unit.lessons.length) continue;
    const level = unit.level ?? '';
    let entry = out.at(-1);
    if (!entry || entry.level !== level) {
      entry = { level, done: 0, total: 0, first: unit.lessons[0] };
      out.push(entry);
    }
    entry.total += unit.lessons.length;
    entry.done += unit.lessons.filter((l) => completed.has(l.id)).length;
  }
  return out;
}

/**
 * Levels the learner could jump to: not the first level, not started yet,
 * and further along than the lesson they would continue with.
 */
export function jumpTargets(course: Course, completed: ReadonlySet<string>, nextIndex: number): LevelProgress[] {
  return levelProgress(course, completed).filter((lv, i) => {
    if (i === 0 || !lv.level || lv.done > 0) return false;
    return (course.lessonIndex.get(lv.first.id) ?? 0) > nextIndex;
  });
}
