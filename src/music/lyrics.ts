/**
 * Lyrics import: plain text, LRC (with enhanced word tags), SubRip (SRT) and WebVTT.
 *
 * Times come only from the file (or later from the learner's tap-sync): plain text has no
 * timing, LRC gives line starts (a line ends where the next one starts), SRT/VTT give starts
 * and ends, and word or syllable times exist only when the file has them (enhanced LRC
 * `<mm:ss.xx>` tags, WebVTT inline timestamps). Nothing is estimated.
 */
import type { LyricLine, LyricsFormat, TimingKind, WordTime } from './types';

export interface ParsedLyrics {
  format: LyricsFormat;
  lines: LyricLine[];
  meta: { title?: string; artist?: string };
  /** Polish messages about what was skipped or could not be read. */
  warnings: string[];
}

const LRC_TIME = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
const LRC_LINE = /^\s*(?:\[\d{1,3}:\d{1,2}(?:[.:]\d{1,3})?\]\s*)+/;
const LRC_META = /^\s*\[(ti|ar|al|by|au|length|offset|re|ve|#):\s*(.*?)\]\s*$/i;
const CUE_TIME = /^\s*((?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3})\s*-->\s*((?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3})/;

export function detectFormat(text: string): LyricsFormat {
  const head = text.replace(/^\uFEFF/, '').trimStart();
  if (/^WEBVTT/.test(head)) return 'vtt';
  const lines = head.split(/\r?\n/).slice(0, 40);
  if (lines.some((l) => CUE_TIME.test(l))) return /\d{2},\d{3}\s*-->/.test(head) ? 'srt' : 'vtt';
  if (lines.filter((l) => LRC_LINE.test(l) || LRC_META.test(l)).length >= 2) return 'lrc';
  return 'plain';
}

export function parseLyrics(text: string, format: LyricsFormat = detectFormat(text)): ParsedLyrics {
  const clean = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  switch (format) {
    case 'lrc':
      return parseLrc(clean);
    case 'srt':
      return parseCues(clean, 'srt');
    case 'vtt':
      return parseCues(clean, 'vtt');
    default:
      return parsePlain(clean);
  }
}

function numberLines(lines: Omit<LyricLine, 'id'>[]): LyricLine[] {
  return lines.map((l, i) => ({ id: `l${i + 1}`, ...l }));
}

/** Collapses runs of whitespace (including the ideographic space) into one space. */
export function tidyLine(s: string): string {
  return s.replace(/[\s\u3000]+/g, ' ').trim();
}

/** `[Chorus]`, `[Verse 2]`, `[Refren]`… — section labels copied with lyrics, not lyrics. */
function isSectionLabel(s: string): boolean {
  return /^\[[^\]]{1,40}\]$/.test(s);
}

export function parsePlain(text: string): ParsedLyrics {
  const out: Omit<LyricLine, 'id'>[] = [];
  let breakBefore = false;
  let labels = 0;
  for (const raw of text.split('\n')) {
    const line = tidyLine(raw);
    if (!line || isSectionLabel(line)) {
      if (isSectionLabel(line)) labels += 1;
      breakBefore = out.length > 0;
      continue;
    }
    out.push({ text: line, ...(breakBefore ? { stanza: true } : {}) });
    breakBefore = false;
  }
  const warnings = labels ? [`Pominięto oznaczenia części utworu (${labels}), np. [Refren].`] : [];
  return { format: 'plain', lines: numberLines(out), meta: {}, warnings };
}

/** `mm:ss.xx` / `hh:mm:ss.mmm` / `mm:ss,mmm` → seconds. */
export function parseTimestamp(s: string): number | null {
  const m = /^(?:(\d+):)?(\d{1,3}):(\d{1,2})(?:[.,:](\d{1,3}))?$/.exec(s.trim());
  if (!m) return null;
  const frac = m[4] ? Number(m[4]) / 10 ** m[4].length : 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]) + frac;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

export function parseLrc(text: string): ParsedLyrics {
  const meta: ParsedLyrics['meta'] = {};
  const warnings: string[] = [];
  let offset = 0;
  type Timed = { start: number; text: string; words?: WordTime[]; order: number; breakBefore: boolean };
  const timed: Timed[] = [];
  /** Times of empty timed lines: an instrumental break ends the line before it. */
  const stops: number[] = [];
  let untimed = 0;
  let blank = false;
  let order = 0;

  for (const raw of text.split('\n')) {
    const metaMatch = LRC_META.exec(raw);
    if (metaMatch) {
      const [, tag, value] = metaMatch;
      const key = tag.toLowerCase();
      if (key === 'ti') meta.title = value.trim() || undefined;
      if (key === 'ar') meta.artist = value.trim() || undefined;
      if (key === 'offset') offset = Number(value) / 1000 || 0;
      continue;
    }
    const prefix = LRC_LINE.exec(raw);
    if (!prefix) {
      if (raw.trim()) untimed += 1;
      else blank = true;
      continue;
    }
    const times = [...prefix[0].matchAll(LRC_TIME)].map((m) => Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number(m[3]) / 10 ** m[3].length : 0));
    const body = raw.slice(prefix[0].length);
    const { text: lineText, words } = parseWordTags(body);
    for (const t of times) {
      if (!lineText) stops.push(t);
      else timed.push({ start: t, text: lineText, words, order: order++, breakBefore: blank });
    }
    blank = false;
  }
  if (untimed) warnings.push(`Pominięto wiersze bez znacznika czasu (${untimed}).`);
  if (!timed.length) return { ...parsePlain(text.replace(/\[[^\]]*\]/g, '')), meta, warnings: [...warnings, 'Nie znaleziono znaczników czasu — tekst zaimportowano bez synchronizacji.'] };

  // Repeated choruses are written once with several times; play order is by time.
  timed.sort((a, b) => a.start - b.start || a.order - b.order);
  const shift = (t: number) => round(Math.max(0, t - offset));
  const lines = timed.map((l, i) => {
    const nextStart = timed[i + 1]?.start;
    const stop = stops.filter((s) => s > l.start && (nextStart === undefined || s < nextStart)).sort((a, b) => a - b)[0];
    const end = stop ?? nextStart;
    const line: Omit<LyricLine, 'id'> = { text: l.text, start: shift(l.start) };
    if (end !== undefined && end > l.start) line.end = shift(end);
    if (l.words?.length) line.words = l.words.map((w) => ({ text: w.text, start: shift(w.start) }));
    // A stanza starts after a blank line or an instrumental break.
    const prev = timed[i - 1];
    if (i > 0 && (l.breakBefore || stops.some((s) => prev && s > prev.start && s <= l.start))) line.stanza = true;
    return line;
  });
  return { format: 'lrc', lines: numberLines(lines), meta, warnings };
}

/** Enhanced LRC: `<00:12.30>Hola <00:12.80>mundo` → text and word times. */
function parseWordTags(body: string): { text: string; words?: WordTime[] } {
  const tag = /<(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?>/g;
  if (!tag.test(body)) return { text: tidyLine(body) };
  tag.lastIndex = 0;
  const words: WordTime[] = [];
  let lastTime: number | null = null;
  let lastIndex = 0;
  let lead = '';
  for (const m of body.matchAll(tag)) {
    const idx = m.index ?? 0;
    const chunk = body.slice(lastIndex, idx);
    if (lastTime === null) lead += chunk;
    else if (chunk.trim()) words.push({ text: chunk.trim(), start: lastTime });
    lastTime = Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number(m[3]) / 10 ** m[3].length : 0);
    lastIndex = idx + m[0].length;
  }
  const tail = body.slice(lastIndex);
  if (lastTime !== null && tail.trim()) words.push({ text: tail.trim(), start: lastTime });
  const text = tidyLine(body.replace(tag, ''));
  // Text before the first tag has no time of its own: keep the line, drop the word timing.
  if (lead.trim() || !words.length) return { text };
  return { text, words };
}

/** SRT and WebVTT cues. Each cue becomes a line; YouTube-style rolling cues are de-duplicated. */
function parseCues(text: string, format: 'srt' | 'vtt'): ParsedLyrics {
  const warnings: string[] = [];
  const blocks = text.split(/\n{2,}/);
  const out: Omit<LyricLine, 'id'>[] = [];
  let skipped = 0;
  for (const block of blocks) {
    const rows = block.split('\n').filter((r) => r.trim() !== '');
    if (!rows.length) continue;
    if (format === 'vtt' && /^(WEBVTT|NOTE|STYLE|REGION)\b/.test(rows[0])) continue;
    const timeRow = rows.findIndex((r) => CUE_TIME.test(r));
    if (timeRow < 0) {
      skipped += 1;
      continue;
    }
    const m = CUE_TIME.exec(rows[timeRow])!;
    const start = parseTimestamp(m[1]);
    const end = parseTimestamp(m[2]);
    if (start === null || end === null) {
      skipped += 1;
      continue;
    }
    for (const row of rows.slice(timeRow + 1)) {
      const { text: lineText, words } = cueText(row, start);
      if (!lineText) continue;
      const prev = out.at(-1);
      // Rolling captions repeat the previous line before adding a new one.
      if (prev && prev.text === lineText) {
        prev.end = Math.max(prev.end ?? end, end);
        continue;
      }
      out.push({ text: lineText, start: round(start), end: round(end), ...(words ? { words } : {}) });
    }
  }
  if (skipped) warnings.push(`Pominięto nieczytelne bloki (${skipped}).`);
  out.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
  return { format, lines: numberLines(out), meta: {}, warnings };
}

/** Strips cue markup; WebVTT inline timestamps (`<00:00:12.500>`) become word times. */
function cueText(row: string, cueStart: number): { text: string; words?: WordTime[] } {
  const withoutStyling = row.replace(/\{\\[^}]*\}/g, '').replace(/<\/?(?:c|i|b|u|v|lang|ruby|rt)(?:[.\s][^>]*)?>/g, '');
  const stamp = /<((?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3})>/g;
  if (!stamp.test(withoutStyling)) return { text: tidyLine(decodeEntities(withoutStyling.replace(/<[^>]*>/g, ''))) };
  stamp.lastIndex = 0;
  const words: WordTime[] = [];
  let lastIndex = 0;
  let current = cueStart;
  for (const m of withoutStyling.matchAll(stamp)) {
    const chunk = decodeEntities(withoutStyling.slice(lastIndex, m.index ?? 0)).trim();
    if (chunk) words.push({ text: chunk, start: round(current) });
    current = parseTimestamp(m[1]) ?? current;
    lastIndex = (m.index ?? 0) + m[0].length;
  }
  const tail = decodeEntities(withoutStyling.slice(lastIndex)).trim();
  if (tail) words.push({ text: tail, start: round(current) });
  const text = tidyLine(words.map((w) => w.text).join(' '));
  return { text, words: words.length > 1 ? words : undefined };
}

function decodeEntities(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
}

// ---------------------------------------------------------------------------
// Using the timing

export function timingKind(lines: readonly LyricLine[]): TimingKind {
  const timed = lines.filter((l) => l.start !== undefined);
  if (!timed.length) return 'none';
  return timed.some((l) => l.words?.length) ? 'word' : 'line';
}

/**
 * Index of the line being sung at `time` (lyrics time, i.e. video time minus the song's
 * delay), or -1. A line stays active until its end, or until the next line starts.
 */
export function activeLineIndex(lines: readonly LyricLine[], time: number): number {
  let lo = 0;
  let hi = lines.length - 1;
  let found = -1;
  // Lines are sorted by start; untimed lines are skipped by the search below.
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = startOf(lines, mid);
    if (start === undefined) {
      // Fall back to a linear scan when timing is partial (tap-sync in progress).
      return linearActive(lines, time);
    }
    if (start <= time) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (found < 0) return -1;
  const end = lines[found].end;
  return end !== undefined && time >= end ? -1 : found;
}

function startOf(lines: readonly LyricLine[], i: number): number | undefined {
  return lines[i]?.start;
}

function linearActive(lines: readonly LyricLine[], time: number): number {
  let found = -1;
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].start;
    if (s !== undefined && s <= time && (found < 0 || s >= (lines[found].start ?? 0))) found = i;
  }
  if (found < 0) return -1;
  const end = lines[found].end ?? nextStart(lines, found);
  return end !== undefined && time >= end ? -1 : found;
}

function nextStart(lines: readonly LyricLine[], i: number): number | undefined {
  for (let j = i + 1; j < lines.length; j++) if (lines[j].start !== undefined) return lines[j].start;
  return undefined;
}

/** End of a line for looping and segment playback: its own end, or the next line's start. */
export function lineEnd(lines: readonly LyricLine[], i: number): number | undefined {
  return lines[i]?.end ?? nextStart(lines, i);
}

/** Index of the word or syllable sung at `time` within a line with word timing, or -1. */
export function activeWordIndex(line: LyricLine, time: number): number {
  const words = line.words ?? [];
  let found = -1;
  for (let i = 0; i < words.length; i++) if (words[i].start <= time) found = i;
  return found;
}

export function formatTime(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const rest = s - m * 60;
  return `${m}:${rest.toFixed(2).padStart(5, '0')}`;
}

/** Back to LRC (export, and the editor's text form of a timed song). */
export function toLrc(lines: readonly LyricLine[], meta: { title?: string; artist?: string } = {}): string {
  const out: string[] = [];
  if (meta.title) out.push(`[ti:${meta.title}]`);
  if (meta.artist) out.push(`[ar:${meta.artist}]`);
  for (const l of lines) {
    if (l.stanza && out.length) out.push('');
    const stamp = l.start !== undefined ? `[${formatTime(l.start)}]` : '';
    out.push(`${stamp}${l.text}`);
  }
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// Editing

/**
 * Keeps line ids (and with them practice results and translations) for lines whose text did
 * not change; new lines get fresh ids.
 */
export function reconcileLines(previous: readonly LyricLine[], next: readonly LyricLine[]): LyricLine[] {
  const pool = new Map<string, LyricLine[]>();
  for (const l of previous) pool.set(l.text, [...(pool.get(l.text) ?? []), l]);
  let maxId = Math.max(0, ...previous.map((l) => Number(l.id.slice(1)) || 0));
  return next.map((l) => {
    const old = pool.get(l.text)?.shift();
    if (old) {
      const keep: LyricLine = { ...l, id: old.id };
      if (old.pl !== undefined && keep.pl === undefined) {
        keep.pl = old.pl;
        if (old.plBy) keep.plBy = old.plBy;
        if (old.literal) keep.literal = old.literal;
        if (old.aiNote) keep.aiNote = old.aiNote;
        if (old.uncertain) keep.uncertain = old.uncertain;
      }
      return keep;
    }
    maxId += 1;
    return { ...l, id: `l${maxId}` };
  });
}

/**
 * Line-by-line translation pasted by the learner: the n-th non-empty line translates the n-th
 * lyric line. Returns the updated lines and how many lines did not get a translation.
 */
export function applyTranslation(lines: readonly LyricLine[], text: string): { lines: LyricLine[]; missing: number; extra: number } {
  const rows = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(tidyLine)
    .filter((r) => r && !isSectionLabel(r));
  const out = lines.map((l, i) => {
    const pl = rows[i];
    if (pl === undefined) return l;
    const next: LyricLine = { ...l, pl, plBy: 'user' };
    delete next.literal;
    delete next.aiNote;
    delete next.uncertain;
    return next;
  });
  return { lines: out, missing: Math.max(0, lines.length - rows.length), extra: Math.max(0, rows.length - lines.length) };
}
