import { describe, expect, it } from 'vitest';
import { buildCourse } from '../content/registry';
import type { CourseDefinition, Lesson, Unit } from '../content/types';
import { coveredLessons, jumpTargets, levelProgress } from './levels';

function lesson(id: string): Lesson {
  return { id, title: id, objective: 'objective of the lesson', level: 'A1', minutes: 5, items: [], sentences: [], summary: [] };
}

function unit(id: string, level: string | undefined, lessonIds: string[]): Unit {
  return { id, title: id, description: '', level, lessons: lessonIds.map(lesson) };
}

const course = buildCourse({
  id: 'es',
  name: 'Test',
  nativeName: 'Test',
  speechLang: 'es-ES',
  accents: [],
  color: '',
  emblem: '',
  description: '',
  framework: '',
  stories: [],
  units: [unit('u1', 'A1', ['es.l1', 'es.l2']), unit('u2', 'A1', ['es.l3']), unit('u3', 'A2', ['es.l4', 'es.l5']), unit('u4', 'B1', [])],
} satisfies CourseDefinition);

describe('levels', () => {
  it('groups consecutive units by level and counts completed lessons', () => {
    const levels = levelProgress(course, new Set(['es.l1', 'es.l4']));
    expect(levels.map((l) => [l.level, l.done, l.total, l.first.id])).toEqual([
      ['A1', 1, 3, 'es.l1'],
      ['A2', 1, 2, 'es.l4'],
    ]);
  });

  it('measures progress by the furthest completed lesson', () => {
    expect(coveredLessons(course, new Set())).toBe(0);
    expect(coveredLessons(course, new Set(['es.l1', 'es.l2']))).toBe(2);
    // Started at A2 (lesson 4 of 5).
    expect(coveredLessons(course, new Set(['es.l4']))).toBe(4);
  });

  it('offers a jump only to later levels that were not started', () => {
    expect(jumpTargets(course, new Set(), 0).map((l) => l.level)).toEqual(['A2']);
    // Already started A2: no shortcut.
    expect(jumpTargets(course, new Set(['es.l4']), 0)).toEqual([]);
    // Next lesson is already in A2: nothing to jump to.
    expect(jumpTargets(course, new Set(['es.l1', 'es.l2', 'es.l3']), 3)).toEqual([]);
  });
});
