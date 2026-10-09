import { describe, expect, it } from 'vitest';
import { allCourses } from '../content/registry';
import { buildLessonSession, gradedKinds } from './lessonSession';
import { buildReviewSession, chooseSkill, interleave, signature } from './reviewSession';
import { introduceCard, newCard, type Card } from './srs';
import { normalize } from './answer';
import { createRng } from './random';
import type { Exercise } from './exercises';

const NOW = new Date(2026, 9, 9, 18, 0, 0).getTime();

function checkChoice(ex: Exercise, where: string) {
  if (ex.kind !== 'choice') return;
  expect(ex.options.length, where).toBeGreaterThanOrEqual(3);
  const labels = ex.options.map((o) => normalize(o.label, o.lang === 'pl' ? 'pl' : o.lang));
  expect(new Set(labels).size, `${where} unique options ${labels.join(' | ')}`).toBe(labels.length);
  expect(ex.correct).toBeGreaterThanOrEqual(0);
  expect(ex.correct).toBeLessThan(ex.options.length);
}

describe('lesson sessions', () => {
  for (const course of allCourses()) {
    course.lessons.forEach((lesson, index) => {
      it(`${lesson.id} builds a complete session`, () => {
        const steps = buildLessonSession({ course, lesson, lessonIndex: index, cards: [], now: NOW, seed: lesson.id, showRomaji: true });
        expect(steps[0].kind).toBe('info');
        expect(steps.at(-1)!.kind).toBe('summary');
        expect(gradedKinds(steps).size, `${lesson.id} kinds: ${[...gradedKinds(steps)].join(',')}`).toBeGreaterThanOrEqual(3);
        const retrievalIdx = steps.findIndex((s) => s.kind === 'info' && s.variant === 'retrieval');
        expect(retrievalIdx, `${lesson.id} retrieval`).toBeGreaterThan(0);
        for (const s of steps.slice(retrievalIdx + 1, -1)) expect(s.hints, `${lesson.id} no hints in retrieval`).toBe(false);
        if (index > 0) expect(steps.some((s) => s.kind === 'info' && s.variant === 'warmup'), `${lesson.id} warm-up`).toBe(true);
        // Every new item is introduced before it is practised.
        for (const item of lesson.items) expect(steps.some((s) => s.kind === 'intro' && s.item.id === item.id)).toBe(true);
        steps.forEach((s, i) => checkChoice(s, `${lesson.id}#${i}`));
        // Keys are unique.
        expect(new Set(steps.map((s) => s.key)).size).toBe(steps.length);
        // Reasonable length for a 5–15 minute lesson.
        expect(steps.length).toBeGreaterThan(15);
        expect(steps.length).toBeLessThan(90);
      });
    });
  }

  it('is deterministic for a seed', () => {
    const course = allCourses()[0];
    const a = buildLessonSession({ course, lesson: course.lessons[3], lessonIndex: 3, cards: [], now: NOW, seed: 's', showRomaji: false });
    const b = buildLessonSession({ course, lesson: course.lessons[3], lessonIndex: 3, cards: [], now: NOW, seed: 's', showRomaji: false });
    expect(a.map((s) => s.kind)).toEqual(b.map((s) => s.kind));
  });
});

describe('review sessions', () => {
  const course = allCourses().find((c) => c.id === 'es')!;
  const items = course.lessons.slice(0, 4).flatMap((l) => l.items);

  function dueCards(): Card[] {
    return items.map((it) => {
      const c = introduceCard(it.id, 'es', 'item', [{ correct: true, skill: 'recognition' }], NOW - 3 * 86_400_000);
      return { ...c, due: NOW - 1000 };
    });
  }

  it('turns due cards into varied exercises', () => {
    const steps = buildReviewSession({ course, cards: dueCards(), now: NOW, mode: 'standard', seed: 1, showRomaji: false });
    expect(steps.at(-1)!.kind).toBe('summary');
    const graded = steps.filter((s) => s.kind !== 'summary');
    expect(graded.length).toBe(15);
    expect(new Set(graded.map(signature)).size).toBeGreaterThanOrEqual(3);
    graded.forEach((s, i) => checkChoice(s, `review#${i}`));
  });

  it('includes sentence and grammar cards', () => {
    const sentence = course.lessons[0].sentences[0];
    const cards = [
      { ...newCard(sentence.id, 'es', 'sentence', NOW - 86_400_000), due: NOW - 1 },
      { ...newCard('es.g.greetings', 'es', 'grammar', NOW - 86_400_000), due: NOW - 1 },
    ];
    const steps = buildReviewSession({ course, cards, now: NOW, mode: 'standard', seed: 2, showRomaji: false });
    expect(steps.filter((s) => s.kind !== 'summary').length).toBe(2);
    expect(steps.some((s) => s.kind === 'authored')).toBe(true);
  });

  it('returns nothing when nothing is due', () => {
    const cards = dueCards().map((c) => ({ ...c, due: NOW + 5 * 86_400_000, phase: 'review' as const }));
    expect(buildReviewSession({ course, cards, now: NOW, mode: 'standard', seed: 3, showRomaji: false })).toEqual([]);
    expect(buildReviewSession({ course, cards, now: NOW, mode: 'extra', seed: 3, showRomaji: false }).length).toBeGreaterThan(0);
  });

  it('favours production once an item is recognised but never produced', () => {
    const card = { ...introduceCard('es.hola', 'es', 'item', [{ correct: true, skill: 'recognition' }], NOW), recognitionOk: 2, productionOk: 0 };
    const picks = Array.from({ length: 40 }, (_, i) => chooseSkill(card, ['recognition', 'listening', 'recall', 'production', 'dictation'], createRng(i)));
    const productionShare = picks.filter((s) => s === 'production' || s === 'dictation').length / picks.length;
    expect(productionShare).toBeGreaterThan(0.5);
    expect(new Set(picks).size).toBeGreaterThan(2);
  });

  it('interleaves exercise kinds', () => {
    const base = buildReviewSession({ course, cards: dueCards(), now: NOW, mode: 'standard', seed: 9, showRomaji: false }).filter((s) => s.kind !== 'summary');
    const mixed = interleave(base, createRng(1));
    let repeats = 0;
    for (let i = 1; i < mixed.length; i++) {
      if (signature(mixed[i - 1]) === signature(mixed[i])) repeats += 1;
    }
    expect(repeats).toBeLessThanOrEqual(3);
  });
});
