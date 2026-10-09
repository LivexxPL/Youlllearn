/**
 * Builds the step sequence of a lesson (the shared lesson format):
 *  1. objective              6. examples in context (+ word order, listening)
 *  2. warm-up recall         7. dialogue + comprehension questions
 *  3. new items in chunks,   8. matching pairs, speaking, writing
 *     each followed by       9. retrieval test without hints
 *     immediate practice    10. summary + follow-up
 *  4. grammar notes
 *  5. authored grammar exercises (with explanations)
 * Mistakes are re-queued by the lesson player.
 */
import type { Course, Item, Lesson } from '../content/types';
import type { Card } from './srs';
import { isStruggling, isDue } from './srs';
import {
  authoredExercise,
  dictationItemExercise,
  introExercise,
  itemPoolFor,
  listeningExercise,
  matchExercise,
  orderExercise,
  productionExercise,
  recallExercise,
  recognitionExercise,
  sentenceDictationExercise,
  sentenceListeningExercise,
  sentencePoolFor,
  speakItemExercise,
  speakSentenceExercise,
  writeExercise,
  type Exercise,
  type GenContext,
} from './exercises';
import { chunk, createRng, sample, shuffle } from './random';
import { t } from '../i18n';

export interface LessonSessionOptions {
  course: Course;
  lesson: Lesson;
  lessonIndex: number;
  /** Existing SRS cards of this course (used to pick warm-up items). */
  cards: Card[];
  now: number;
  seed: string | number;
  showRomaji: boolean;
  /** Characters for which stroke data exists (handwriting steps are only added for those). */
  strokeChars?: ReadonlySet<string>;
}

function push<T>(arr: T[], x: T | null | undefined) {
  if (x) arr.push(x);
}

export function buildLessonSession(o: LessonSessionOptions): Exercise[] {
  const { course, lesson, lessonIndex } = o;
  const rng = createRng(o.seed);
  const pool = itemPoolFor(course, lessonIndex);
  const sentencePool = sentencePoolFor(course, lessonIndex);
  const ctx: GenContext = { course, rng, pool, sentencePool, showRomaji: o.showRomaji };
  const strict: GenContext = { ...ctx, hints: false };
  const steps: Exercise[] = [];
  const isKanaLesson = lesson.items.some((i) => i.kind === 'kana');

  // 1. Objective
  steps.push({
    kind: 'info',
    key: 'objective',
    variant: 'objective',
    title: lesson.title,
    body: [lesson.objective],
    lesson,
    refs: [],
    hints: true,
  });

  // 2. Warm-up: recall from earlier lessons (weak and due items first).
  if (lessonIndex > 0) {
    const earlier = course.lessons.slice(0, lessonIndex).flatMap((l) => l.items);
    const earlierIds = new Set(earlier.map((i) => i.id));
    const cardMap = new Map(o.cards.map((c) => [c.id, c]));
    const weak = o.cards
      .filter((c) => earlierIds.has(c.id) && (isStruggling(c) || isDue(c, o.now)))
      .map((c) => course.items.get(c.id))
      .filter((i): i is Item => Boolean(i));
    const recent = course.lessons[lessonIndex - 1]?.items ?? [];
    const candidates = [...shuffle(weak, rng), ...shuffle(recent, rng), ...shuffle(earlier, rng)];
    const picked: Item[] = [];
    for (const it of candidates) {
      if (picked.some((p) => p.id === it.id)) continue;
      // Skip items never seen at all when we can (warm-up is about recall).
      if (!cardMap.has(it.id) && picked.length < 3 && candidates.length > 6 && weak.length > 0) continue;
      picked.push(it);
      if (picked.length >= 3) break;
    }
    if (picked.length) {
      steps.push({ kind: 'info', key: 'warmup', variant: 'warmup', title: t('lesson.warmupTitle'), body: [t('lesson.warmupBody')], refs: [], hints: true });
      picked.forEach((it, i) => push(steps, i % 2 === 0 ? listeningExercise(it, ctx) : recognitionExercise(it, ctx)));
    }
  }
  if (lesson.intro?.length) {
    steps.push({
      kind: 'info',
      key: 'intro',
      variant: 'intro',
      title: lessonIndex === 0 ? t('lesson.firstWarmupTitle') : lesson.subtitle ?? lesson.title,
      body: lesson.intro,
      refs: [],
      hints: true,
    });
  }

  // 3. New items in small chunks with immediate practice and interleaving.
  const chunkSize = isKanaLesson ? 5 : 3;
  const chunks = chunk(lesson.items, chunkSize);
  chunks.forEach((group, gi) => {
    for (const it of group) steps.push(introExercise(it));
    const practice: Exercise[] = [];
    group.forEach((it, i) => {
      if (it.kind === 'kana') {
        push(practice, recognitionExercise(it, ctx));
        if (i % 2 === 1) push(practice, listeningExercise(it, ctx));
      } else {
        push(practice, i % 2 === 0 ? recognitionExercise(it, ctx) : listeningExercise(it, ctx));
      }
    });
    if (gi > 0) {
      const prev = chunks[gi - 1];
      push(practice, recallExercise(prev[Math.floor(rng() * prev.length)], ctx));
    }
    steps.push(...shuffle(practice, rng));
  });

  // 4–5. Grammar notes, each followed by its authored exercises.
  const authored = lesson.exercises ?? [];
  const used = new Set<string>();
  for (const note of lesson.grammar ?? []) {
    steps.push({ kind: 'grammar', key: `grammar-${note.id}`, note, refs: [], hints: true });
    for (const ex of authored.filter((e) => e.concept === note.id)) {
      steps.push(authoredExercise(ex, ctx));
      used.add(ex.id);
    }
  }
  for (const ex of authored.filter((e) => !used.has(e.id))) steps.push(authoredExercise(ex, ctx));

  // 6. Examples in context + sentence exercises.
  const sentences = lesson.sentences;
  if (sentences.length) {
    steps.push({ kind: 'examples', key: 'examples', sentences: sentences.slice(0, 7), refs: [], hints: true });
    const orderable = shuffle(sentences, rng).filter((s) => orderExercise(s, ctx) !== null);
    for (const s of orderable.slice(0, 2)) push(steps, orderExercise(s, ctx));
    const rest = shuffle(sentences.filter((s) => !orderable.slice(0, 2).includes(s)), rng);
    for (const s of rest.slice(0, 2)) push(steps, sentenceListeningExercise(s, ctx, false));
  }

  // 7. Dialogue with comprehension questions.
  if (lesson.dialogue) {
    steps.push({ kind: 'dialogue', key: 'dialogue', dialogue: lesson.dialogue, refs: [], hints: true });
    for (const q of lesson.dialogue.questions) {
      steps.push({ kind: 'question', key: `q-${q.id}`, question: q, dialogue: lesson.dialogue, refs: [], skill: 'listening', hints: true });
    }
  }

  // 8. Matching, speaking and writing practice.
  push(steps, matchExercise(lesson.items, ctx));

  const speakable = lesson.items.filter((i) => i.kind === 'phrase' || i.kind === 'word');
  if (sentences.length) steps.push(speakSentenceExercise(sample(sentences, 1, rng)[0], ctx));
  else if (speakable.length) steps.push(speakItemExercise(sample(speakable, 1, rng)[0], ctx));

  if (course.id === 'ja') {
    const writable = (lesson.writing ?? lesson.items.filter((i) => i.kind === 'kanji').map((i) => i.text)).filter(
      (ch) => !o.strokeChars || o.strokeChars.has(ch),
    );
    for (const ch of sample(writable, Math.min(3, writable.length), rng)) {
      const item = lesson.items.find((i) => i.text === ch || i.writeChars === ch);
      steps.push(writeExercise(ch, item, 'trace', ctx));
    }
  }

  // 9. Retrieval test without hints.
  const retrieval: Exercise[] = [];
  if (isKanaLesson) {
    const kana = lesson.items.filter((i) => i.kind === 'kana');
    for (const it of sample(kana, 3, rng)) push(retrieval, recallExercise(it, strict));
    for (const it of sample(kana, 2, rng)) push(retrieval, listeningExercise(it, strict));
    const words = lesson.items.filter((i) => i.kind === 'word');
    for (const it of sample(words, 2, rng)) retrieval.push(dictationItemExercise(it, strict));
  } else {
    const typeable = lesson.items.filter((i) => !i.text.includes('…') && !i.text.includes('〜'));
    for (const it of sample(typeable, 3, rng)) retrieval.push(productionExercise(it, strict));
    for (const it of sample(lesson.items, 1, rng)) push(retrieval, listeningExercise(it, strict));
    const dictable = sentences.filter((s) => s.text.length <= 40);
    if (dictable.length) retrieval.push(sentenceDictationExercise(sample(dictable, 1, rng)[0], strict));
    const orderable = sentences.filter((s) => orderExercise(s, strict) !== null);
    if (orderable.length) push(retrieval, orderExercise(sample(orderable, 1, rng)[0], strict, true));
  }
  if (retrieval.length) {
    steps.push({ kind: 'info', key: 'retrieval', variant: 'retrieval', title: t('lesson.retrievalTitle'), body: [t('lesson.retrievalBody')], refs: [], hints: false });
    steps.push(...shuffle(retrieval, rng));
  }

  // 10. Summary
  steps.push({ kind: 'summary', key: 'summary', refs: [], hints: true });
  return steps;
}

/** Distinct graded exercise types in a session (the lesson format requires at least three). */
export function gradedKinds(steps: Exercise[]): Set<string> {
  const kinds = new Set<string>();
  for (const s of steps) {
    if (['info', 'intro', 'grammar', 'examples', 'dialogue', 'summary'].includes(s.kind)) continue;
    kinds.add(s.kind === 'choice' ? `choice:${s.mode}` : s.kind);
  }
  return kinds;
}
