/**
 * KanjiVG stroke data (CC BY-SA 3.0, see src/content/ja/STROKES_LICENSE.md).
 * Paths use a 109×109 coordinate box and are listed in stroke order.
 */
import { STROKE_CHARS } from '../../content/ja/strokes-index';
import type { Stroke } from '../../services/db';

export const STROKE_BOX = 109;
export const strokeCharSet: ReadonlySet<string> = new Set([...STROKE_CHARS]);

let cache: Record<string, string[]> | null = null;

export async function loadStrokeData(): Promise<Record<string, string[]>> {
  if (!cache) cache = (await import('../../content/ja/strokes.json')).default as Record<string, string[]>;
  return cache;
}

export async function getStrokes(ch: string): Promise<string[] | null> {
  if (!strokeCharSet.has(ch)) return null;
  const data = await loadStrokeData();
  return data[ch] ?? null;
}

// ---------------------------------------------------------------------------
// Minimal SVG path parsing (M/m, L/l, H/h, V/v, C/c, S/s, Q/q, T/t, Z) to find
// stroke start and end points.

export interface Pt {
  x: number;
  y: number;
}

export function pathEndpoints(d: string): { start: Pt; end: Pt } {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  let i = 0;
  let cmd = '';
  let cur: Pt = { x: 0, y: 0 };
  let start: Pt | null = null;
  let subStart: Pt = { x: 0, y: 0 };
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const base = rel ? cur : { x: 0, y: 0 };
    switch (cmd.toLowerCase()) {
      case 'm': {
        const p = { x: base.x + num(), y: base.y + num() };
        cur = p;
        subStart = p;
        start ??= p;
        cmd = rel ? 'l' : 'L';
        break;
      }
      case 'l':
      case 't': {
        cur = { x: base.x + num(), y: base.y + num() };
        break;
      }
      case 'h':
        cur = { x: (rel ? cur.x : 0) + num(), y: cur.y };
        break;
      case 'v':
        cur = { x: cur.x, y: (rel ? cur.y : 0) + num() };
        break;
      case 'c': {
        num();
        num();
        num();
        num();
        cur = { x: base.x + num(), y: base.y + num() };
        break;
      }
      case 's':
      case 'q': {
        num();
        num();
        cur = { x: base.x + num(), y: base.y + num() };
        break;
      }
      case 'z':
        cur = subStart;
        break;
      default:
        i++;
    }
  }
  return { start: start ?? { x: 0, y: 0 }, end: cur };
}

// ---------------------------------------------------------------------------
// Rule-based comparison of a drawing with the model. These are *hints*, not
// handwriting recognition: stroke count, rough start position and direction.

export interface StrokeHint {
  kind: 'count' | 'start' | 'direction';
  stroke?: number;
  drawn?: number;
  expected?: number;
}

export function compareStrokes(drawn: Stroke[], model: string[]): { hints: StrokeHint[]; countOk: boolean } {
  const hints: StrokeHint[] = [];
  const countOk = drawn.length === model.length;
  if (!countOk) hints.push({ kind: 'count', drawn: drawn.length, expected: model.length });
  const n = Math.min(drawn.length, model.length);
  for (let i = 0; i < n; i++) {
    const pts = drawn[i].points;
    if (pts.length === 0) continue;
    const ds: Pt = { x: pts[0][0] * STROKE_BOX, y: pts[0][1] * STROKE_BOX };
    const de: Pt = { x: pts[pts.length - 1][0] * STROKE_BOX, y: pts[pts.length - 1][1] * STROKE_BOX };
    const { start, end } = pathEndpoints(model[i]);
    if (Math.hypot(ds.x - start.x, ds.y - start.y) > STROKE_BOX * 0.28) hints.push({ kind: 'start', stroke: i + 1 });
    const mv = { x: end.x - start.x, y: end.y - start.y };
    const dv = { x: de.x - ds.x, y: de.y - ds.y };
    const lenM = Math.hypot(mv.x, mv.y);
    const lenD = Math.hypot(dv.x, dv.y);
    if (lenM > STROKE_BOX * 0.12 && lenD > STROKE_BOX * 0.12) {
      const cos = (mv.x * dv.x + mv.y * dv.y) / (lenM * lenD);
      if (cos < -0.4) hints.push({ kind: 'direction', stroke: i + 1 });
    }
  }
  return { hints, countOk };
}
