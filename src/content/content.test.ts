import { describe, expect, it } from 'vitest';
import { allCourses, buildCourse, findLesson } from './registry';
import type { ChoiceQuestion, Course } from './types';
import { stripRuby, hasJapanese, toRomaji, isKana } from '../engine/kana';
import { sentenceTokens } from './text';
import { normalize } from '../engine/answer';

const courses = allCourses();
// Case-sensitive on purpose: Spanish „todo” (everything) is real content.
const CODE_MARKER = /\b(TODO|FIXME|TBD|XXX)\b/;
const FILLER = /lorem ipsum|placeholder/i;

function checkQuestion(q: ChoiceQuestion, where: string) {
  expect(q.options.length, `${where} options`).toBeGreaterThanOrEqual(2);
  expect(new Set(q.options).size, `${where} unique options`).toBe(q.options.length);
  expect(q.answer, `${where} answer index`).toBeGreaterThanOrEqual(0);
  expect(q.answer, `${where} answer index`).toBeLessThan(q.options.length);
  expect(q.explanation.trim().length, `${where} explanation`).toBeGreaterThan(5);
  expect(q.prompt.trim().length, `${where} prompt`).toBeGreaterThan(2);
}

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

describe.each(courses.map((c) => [c.id, c] as [string, Course]))('course %s', (_id, course) => {
  it('builds without duplicate ids', () => {
    expect(() => buildCourse({ ...course })).not.toThrow();
    expect(course.lessons.length).toBeGreaterThanOrEqual(12);
  });

  it('has complete lesson structure', () => {
    for (const lesson of course.lessons) {
      expect(lesson.id.startsWith(`${course.id}.`), lesson.id).toBe(true);
      expect(lesson.objective.length, `${lesson.id} objective`).toBeGreaterThan(20);
      expect(lesson.items.length, `${lesson.id} items`).toBeGreaterThanOrEqual(4);
      expect(lesson.summary.length, `${lesson.id} summary`).toBeGreaterThanOrEqual(2);
      expect(lesson.minutes).toBeGreaterThan(0);
      for (const item of lesson.items) {
        expect(item.id.startsWith(`${course.id}.`), item.id).toBe(true);
        expect(item.text.trim(), item.id).toBe(item.text);
        expect(item.text.length, item.id).toBeGreaterThan(0);
        expect(item.pl.trim().length, `${item.id} pl`).toBeGreaterThan(0);
      }
      for (const s of lesson.sentences) {
        expect(s.pl.trim().length, `${s.id} pl`).toBeGreaterThan(0);
      }
    }
  });

  it('has valid authored exercises', () => {
    for (const lesson of course.lessons) {
      for (const ex of lesson.exercises ?? []) {
        if (ex.type === 'gap') {
          expect(ex.sentence, ex.id).toContain('___');
          expect(ex.options, ex.id).toContain(ex.answer);
          expect(new Set(ex.options).size, ex.id).toBe(ex.options.length);
          expect(ex.explanation.length, ex.id).toBeGreaterThan(5);
        } else {
          checkQuestion({ id: ex.id, prompt: ex.prompt, options: ex.options, answer: ex.answer, explanation: ex.explanation }, ex.id);
        }
        if (ex.concept) expect(course.grammar.has(ex.concept), `${ex.id} concept ${ex.concept}`).toBe(true);
      }
    }
  });

  it('has valid dialogues', () => {
    for (const lesson of course.lessons) {
      const d = lesson.dialogue;
      if (!d) continue;
      expect(d.lines.length, d.id).toBeGreaterThanOrEqual(3);
      for (const line of d.lines) {
        expect(d.speakers[line.speaker], `${d.id} speaker ${line.speaker}`).toBeDefined();
        expect(line.pl.length).toBeGreaterThan(0);
      }
      d.questions.forEach((q) => checkQuestion(q, q.id));
    }
  });

  it('has valid stories', () => {
    expect(course.stories.length).toBeGreaterThanOrEqual(4);
    for (const st of course.stories) {
      expect(findLesson(st.afterLesson), `${st.id} afterLesson`).not.toBeNull();
      expect(st.lines.length).toBeGreaterThanOrEqual(4);
      st.questions.forEach((q) => checkQuestion(q, q.id));
    }
  });

  it('word-order tiles rebuild the sentence', () => {
    const lang = course.id;
    for (const s of course.sentences.values()) {
      const tokens = sentenceTokens(s);
      const joined = lang === 'ja' ? tokens.join('') : tokens.join(' ');
      expect(normalize(joined, lang), s.id).toBe(normalize(s.text, lang));
    }
  });

  it('contains no placeholder text', () => {
    for (const str of allStrings(course.units)) {
      expect(CODE_MARKER.test(str) || FILLER.test(str), str).toBe(false);
    }
  });
});

describe('Japanese specifics', () => {
  const ja = courses.find((c) => c.id === 'ja')!;

  it('authors romaji for every sentence and dialogue line', () => {
    for (const s of ja.sentences.values()) {
      expect(s.romaji, `${s.id} romaji`).toBeTruthy();
    }
    for (const lesson of ja.lessons) {
      for (const line of lesson.dialogue?.lines ?? []) expect(line.romaji, line.text).toBeTruthy();
    }
    for (const st of ja.stories) for (const line of st.lines) expect(line.romaji, line.text).toBeTruthy();
  });

  it('gives every word a kana reading consistent with its text', () => {
    for (const item of ja.items.values()) {
      if (item.kind === 'kana') {
        expect(item.romaji, item.id).toBeTruthy();
        continue;
      }
      expect(item.reading, `${item.id} reading`).toBeTruthy();
      expect(hasJapanese(stripRuby(item.text)), item.id).toBe(true);
      if (item.kind !== 'kanji') {
        // Reading must be kana only.
        const reading = (item.reading ?? '').replace(/[\s、。・?!〜]/g, '');
        expect([...reading].every(isKana), `${item.id} reading is kana`).toBe(true);
        expect(toRomaji(reading).length).toBeGreaterThan(0);
      }
    }
  });

  it('kanji items list readings and example words', () => {
    const kanjiItems = [...ja.items.values()].filter((i) => i.kind === 'kanji');
    expect(kanjiItems.length).toBeGreaterThanOrEqual(25);
    for (const k of kanjiItems) {
      expect([...k.text].length, k.id).toBe(1);
      expect((k.on?.length ?? 0) + (k.kun?.length ?? 0), k.id).toBeGreaterThan(0);
      expect(k.words?.length, k.id).toBeGreaterThan(0);
    }
  });

  it('covers the full basic hiragana and katakana', () => {
    const kana = new Set([...ja.items.values()].filter((i) => i.kind === 'kana').map((i) => i.text));
    for (const ch of 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん') {
      expect(kana.has(ch), ch).toBe(true);
    }
    for (const ch of 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン') {
      expect(kana.has(ch), ch).toBe(true);
    }
  });
});
