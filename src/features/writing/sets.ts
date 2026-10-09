/**
 * Character sets offered for handwriting practice: kana from the gojūon and
 * dakuten tables, and the kanji taught in the Japanese course. Only
 * characters with bundled stroke-order data are listed.
 */
import { DAKUTEN, GOJUON, type KanaCell } from '../../engine/kana';
import { getCourse } from '../../content/registry';
import { itemRomaji } from '../../content/text';
import type { Item } from '../../content/types';
import { strokeCharSet } from './strokes';

export type WriteSet = 'hiragana' | 'katakana' | 'kanji';
export const WRITE_SETS: readonly WriteSet[] = ['hiragana', 'katakana', 'kanji'];

export interface WriteChar {
  char: string;
  romaji: string;
  /** Polish meaning (kanji). */
  meaning?: string;
  /** Course item for this character, if the course teaches it (SRS card id). */
  item?: Item;
}

export function isWriteSet(s: string | undefined): s is WriteSet {
  return (WRITE_SETS as readonly string[]).includes(s ?? '');
}

function itemsByText(kind: Item['kind']): Map<string, Item> {
  const map = new Map<string, Item>();
  for (const it of getCourse('ja').items.values()) if (it.kind === kind && !map.has(it.text)) map.set(it.text, it);
  return map;
}

const cache = new Map<WriteSet, WriteChar[]>();

export function charsFor(set: WriteSet): WriteChar[] {
  const hit = cache.get(set);
  if (hit) return hit;
  let list: WriteChar[];
  if (set === 'kanji') {
    list = [...itemsByText('kanji').values()].filter((it) => strokeCharSet.has(it.text)).map((it) => ({ char: it.text, romaji: itemRomaji(it), meaning: it.pl, item: it }));
  } else {
    const key: keyof KanaCell = set === 'hiragana' ? 'hira' : 'kata';
    const items = itemsByText('kana');
    list = [...GOJUON, ...DAKUTEN]
      .flat()
      .filter((c): c is KanaCell => c !== null)
      .filter((c) => strokeCharSet.has(c[key]))
      .map((c) => ({ char: c[key], romaji: c.romaji, item: items.get(c[key]) }));
  }
  cache.set(set, list);
  return list;
}

export function findChar(set: WriteSet, char: string): WriteChar | undefined {
  return charsFor(set).find((c) => c.char === char);
}

/** Next character in the set (wraps around). */
export function nextChar(set: WriteSet, char: string): string {
  const list = charsFor(set);
  const i = list.findIndex((c) => c.char === char);
  return list[(i + 1) % list.length].char;
}

export const practiceId = (char: string) => `practice:${char}`;
export const noteId = (lessonId: string) => `note:${lessonId}`;
