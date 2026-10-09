import { describe, expect, it } from 'vitest';
import { compareStrokes, getStrokes, pathEndpoints, strokeCharSet, STROKE_BOX } from './strokes';
import type { Stroke } from '../../services/db';
import { allCourses } from '../../content/registry';

describe('stroke data', () => {
  it('covers all kana and kanji used in Japanese lessons', () => {
    const ja = allCourses().find((c) => c.id === 'ja')!;
    for (const lesson of ja.lessons) {
      for (const ch of lesson.writing ?? []) expect(strokeCharSet.has(ch), ch).toBe(true);
      for (const it of lesson.items) if (it.kind === 'kanji' || it.kind === 'kana') {
        for (const ch of it.text) expect(strokeCharSet.has(ch), ch).toBe(true);
      }
    }
  });

  it('loads paths in stroke order', async () => {
    const a = await getStrokes('あ');
    expect(a).toHaveLength(3);
    expect((await getStrokes('一'))!.length).toBe(1);
    expect((await getStrokes('木'))!.length).toBe(4);
  });
});

describe('path endpoints', () => {
  it('handles absolute and relative commands', () => {
    expect(pathEndpoints('M10,20L30,40')).toEqual({ start: { x: 10, y: 20 }, end: { x: 30, y: 40 } });
    const r = pathEndpoints('M10,20c1,1,2,2,5,5s1,1,5,5');
    expect(r.start).toEqual({ x: 10, y: 20 });
    expect(r.end.x).toBeCloseTo(20);
    expect(r.end.y).toBeCloseTo(30);
  });
});

function stroke(x0: number, y0: number, x1: number, y1: number): Stroke {
  return { points: [[x0, y0, 0.5], [(x0 + x1) / 2, (y0 + y1) / 2, 0.5], [x1, y1, 0.5]], size: 0.04, pointerType: 'pen' };
}

describe('stroke comparison hints', () => {
  it('accepts a drawing that follows the model', async () => {
    const model = (await getStrokes('一'))!;
    const { start, end } = pathEndpoints(model[0]);
    const drawn = [stroke(start.x / STROKE_BOX, start.y / STROKE_BOX, end.x / STROKE_BOX, end.y / STROKE_BOX)];
    expect(compareStrokes(drawn, model)).toEqual({ hints: [], countOk: true });
  });

  it('reports count, start and direction differences', async () => {
    const model = (await getStrokes('一'))!;
    const { start, end } = pathEndpoints(model[0]);
    const reversed = [stroke(end.x / STROKE_BOX, end.y / STROKE_BOX, start.x / STROKE_BOX, start.y / STROKE_BOX)];
    const r = compareStrokes(reversed, model);
    expect(r.hints.some((h) => h.kind === 'direction')).toBe(true);
    const two = compareStrokes([...reversed, stroke(0.1, 0.1, 0.2, 0.2)], model);
    expect(two.countOk).toBe(false);
    expect(two.hints[0]).toMatchObject({ kind: 'count', drawn: 2, expected: 1 });
  });
});
