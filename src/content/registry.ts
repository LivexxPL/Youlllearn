import type { AuthoredExercise, Course, CourseDefinition, CourseId, GrammarNote, Item, Lesson, Sentence } from './types';
import { spanish } from './es';
import { german } from './de';
import { japanese } from './ja';

const DEFINITIONS: Record<CourseId, CourseDefinition> = { es: spanish, de: german, ja: japanese };

export const COURSE_ORDER: CourseId[] = ['es', 'de', 'ja'];

/** Builds lookup tables. Throws on duplicate ids so content mistakes fail fast (and in tests). */
export function buildCourse(def: CourseDefinition): Course {
  const lessons: Lesson[] = def.units.flatMap((u) => u.lessons);
  const lessonIndex = new Map<string, number>();
  const items = new Map<string, Item>();
  const sentences = new Map<string, Sentence>();
  const grammar = new Map<string, GrammarNote>();
  const lessonOf = new Map<string, string>();
  const conceptExercises = new Map<string, AuthoredExercise[]>();
  const seen = new Set<string>();

  const claim = (id: string, lessonId: string) => {
    if (seen.has(id)) throw new Error(`Duplicate content id: ${id}`);
    seen.add(id);
    lessonOf.set(id, lessonId);
  };

  lessons.forEach((lesson, idx) => {
    if (lessonIndex.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`);
    lessonIndex.set(lesson.id, idx);
    for (const it of lesson.items) {
      claim(it.id, lesson.id);
      items.set(it.id, it);
    }
    for (const s of lesson.sentences) {
      claim(s.id, lesson.id);
      sentences.set(s.id, s);
    }
    for (const g of lesson.grammar ?? []) {
      claim(g.id, lesson.id);
      grammar.set(g.id, g);
      for (const ex of g.examples ?? []) {
        claim(ex.id, lesson.id);
        sentences.set(ex.id, ex);
      }
    }
    for (const ex of lesson.exercises ?? []) {
      claim(ex.id, lesson.id);
      if (ex.concept) {
        const list = conceptExercises.get(ex.concept) ?? [];
        list.push(ex);
        conceptExercises.set(ex.concept, list);
      }
    }
    if (lesson.dialogue) claim(lesson.dialogue.id, lesson.id);
  });

  return { ...def, lessons, lessonIndex, items, sentences, grammar, lessonOf, conceptExercises };
}

const cache = new Map<CourseId, Course>();

export function getCourse(id: CourseId): Course {
  let c = cache.get(id);
  if (!c) {
    c = buildCourse(DEFINITIONS[id]);
    cache.set(id, c);
  }
  return c;
}

export function allCourses(): Course[] {
  return COURSE_ORDER.map(getCourse);
}

export function findLesson(lessonId: string): { course: Course; lesson: Lesson; index: number } | null {
  const courseId = lessonId.split('.')[0] as CourseId;
  if (!COURSE_ORDER.includes(courseId)) return null;
  const course = getCourse(courseId);
  const index = course.lessonIndex.get(lessonId);
  if (index === undefined) return null;
  return { course, lesson: course.lessons[index], index };
}

/** Items introduced in lessons before `lessonIndex` (for warm-ups and distractors). */
export function itemsBefore(course: Course, lessonIndex: number): Item[] {
  return course.lessons.slice(0, lessonIndex).flatMap((l) => l.items);
}
