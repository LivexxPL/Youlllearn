/**
 * Helpers that turn content records into display text, accepted answers,
 * speech text and word-order tiles.
 */
import type { CourseId, Item, Sentence } from './types';
import { hasKanji, rubyToKana, stripRuby, romajiFor } from '../engine/kana';

/** Meaning in the interface language (falls back to Polish). */
export function gloss(x: { pl: string }): string {
  return x.pl;
}

export function acceptedMeanings(x: { pl: string; plAlts?: string[] }): string[] {
  const base = x.pl.split(/\s*[;/]\s*/).map((s) => s.replace(/\s*\(.*?\)\s*/g, ' ').trim());
  return unique([x.pl, ...base, ...(x.plAlts ?? [])].filter(Boolean));
}

/** Target text without furigana markup. */
export function plainTarget(text: string): string {
  return stripRuby(text);
}

/** Japanese: hide the beginner spacing between chunks when the setting is off. */
export function jaDisplay(text: string, spacing: boolean): string {
  return spacing ? text : text.replace(/ (?=[^\s])/g, '');
}

/** Accepted target-language answers for typing/dictation. */
export function acceptedTargets(courseId: CourseId, x: Item | Sentence): string[] {
  const out = [x.text, ...(x.alts ?? [])];
  if (courseId === 'ja') {
    for (const t of [...out]) out.push(rubyToKana(t));
    const reading = 'reading' in x ? x.reading : undefined;
    if (reading) out.push(reading);
  }
  if ('kind' in x && x.text.includes(' / ')) out.push(...x.text.split(' / '));
  return unique(out.map((s) => s.trim()).filter(Boolean));
}

/**
 * Text sent to text-to-speech.
 * - Explicit `tts` wins.
 * - Japanese: single kanji and kanji items are read from their kana reading
 *   (a lone 日 is ambiguous for a speech engine); other text keeps its kanji,
 *   which gives engines word boundaries for natural pitch.
 * - "a / b" alternatives are read as a short list.
 */
export function speechText(courseId: CourseId, x: Pick<Item, 'text' | 'tts' | 'reading'> & { kind?: string }): string {
  if (x.tts) return x.tts;
  if (courseId === 'ja') {
    if (x.kind === 'kanji' && x.reading) return x.reading.split(/[・、,]/)[0];
    const plain = stripRuby(x.text);
    if ([...plain].length === 1 && hasKanji(plain) && x.reading) return x.reading;
    return plain.replace(/\s+/g, '');
  }
  return x.text.replace(/\s+\/\s+/g, ', ').replace(/…/g, '');
}

export function itemRomaji(item: Item): string {
  return romajiFor(item.text, item.reading, item.romaji);
}

const EDGE_PUNCT = /^[¿¡"„«(]+|[.,!?;:"”»)…。、！？]+$/g;

/** Tiles for word-order exercises. Japanese splits on authored spaces. */
export function sentenceTokens(s: Sentence): string[] {
  if (s.tokens) return s.tokens;
  return s.text
    .split(/\s+/)
    .map((tok) => tok.replace(EDGE_PUNCT, ''))
    .filter(Boolean);
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/** Splits text with `[[target]]` and `**bold**` markup into segments for rendering. */
export type RichSegment = { kind: 'text' | 'target' | 'bold'; text: string };

export function parseRich(text: string): RichSegment[] {
  const out: RichSegment[] = [];
  const re = /\[\[(.+?)\]\]|\*\*(.+?)\*\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ kind: 'text', text: text.slice(last, idx) });
    if (m[1] !== undefined) out.push({ kind: 'target', text: m[1] });
    else out.push({ kind: 'bold', text: m[2] });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}
