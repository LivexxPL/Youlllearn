/**
 * Exercises built from a song: the learner's lyrics, translations and words, in the app's
 * existing exercise formats (so the session player, answer checking and SRS work unchanged).
 *
 * Eight kinds: fill in the missing word, listening (which line was sung), matching words to
 * meanings, choosing the translation, putting a line in order, reading kanji (Japanese),
 * spotting a grammar construction, and dictation. Nothing is invented: every prompt is a line
 * of the song or a word of it; generated wrong answers are other lines and words of the same
 * song (or course words), never made-up lyrics.
 *
 * Results: lines report to the song's progress (`line:` refs), words with a meaning to their
 * review card (course item or the learner's own word).
 */
import type { AuthoredExercise, Course, Sentence } from '../content/types';
import { sentenceTokens, unique } from '../content/text';
import type { ChoiceOption, Exercise } from '../engine/exercises';
import { createRng, shuffle, type Rng } from '../engine/random';
import { interleave } from '../engine/reviewSession';
import { hasKanji } from '../engine/kana';
import { normalize } from '../engine/answer';
import { allNotes, japaneseNotes, levelRank, patternNotes, type FoundNote } from './grammar';
import { chunkTokens, isPunct, isSpace, readingLine, romajiLine, rubySegments, type JaToken } from './japanese/tokens';
import { lineRef, type LyricLine, type Song } from './types';
import type { SongWord } from './vocab';

export interface PracticeWord {
  word: SongWord;
  /** Meaning shown and checked (course, the learner's own, or AI — labelled in the UI). */
  meaning?: string;
  /** Review card the answer goes to, when the word has a meaning. */
  ref?: string;
  /** The learner marked it as known: left out of practice. */
  known: boolean;
}

export type LineAudio = 'video' | 'tts' | 'none';

export interface SongPracticeOptions {
  song: Song;
  course: Course;
  words: readonly PracticeWord[];
  /** Japanese analysis per line id (reading corrections applied). */
  tokens?: Readonly<Record<string, readonly JaToken[]>>;
  /** How lines can be heard: the video's segment (timed lyrics), speech synthesis, or not at all. */
  audio: LineAudio;
  seed: number | string;
  /** Learner level rank (1 beginner … 3) for choosing grammar questions. */
  learnerRank: number;
  /** Practise only these lines (e.g. one stanza). */
  lineIds?: readonly string[];
  /** Number of exercises (approximate). */
  size?: number;
}

let counter = 0;
const key = (p: string) => `music-${p}-${++counter}`;

/** Line with furigana markup for display (Japanese), or the text as written. */
export function displayLine(line: LyricLine, tokens?: readonly JaToken[]): string {
  if (!tokens?.length) return line.text;
  return tokens
    .map((t) =>
      rubySegments(t)
        .map((s) => (s.ruby ? `{${s.base}|${s.ruby}}` : s.base))
        .join(''),
    )
    .join('');
}

function withCorrect<T>(correct: T, others: T[], rng: Rng): { options: T[]; correct: number } {
  const options = shuffle([correct, ...others], rng);
  return { options, correct: options.indexOf(correct) };
}

function distinctBy<T>(list: T[], keyOf: (x: T) => string): T[] {
  const seen = new Set<string>();
  return list.filter((x) => {
    const k = keyOf(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

interface Ctx extends SongPracticeOptions {
  rng: Rng;
  lang: Course['id'];
  lines: LyricLine[];
  usable: PracticeWord[];
}

function lineTokens(ctx: Ctx, line: LyricLine): readonly JaToken[] | undefined {
  return ctx.tokens?.[line.id];
}

// ---------------------------------------------------------------------------
// A. Fill in the missing word

function gapExercise(ctx: Ctx, line: LyricLine): Exercise | null {
  const inLine = ctx.usable.filter((w) => w.word.lineId === line.id && w.word.surface.length >= (ctx.lang === 'ja' ? 1 : 3));
  if (!inLine.length) return null;
  const target = [...inLine].sort((a, b) => Number(Boolean(b.meaning)) - Number(Boolean(a.meaning)) || ctx.rng() - 0.5)[0];
  const answer = target.word.surface;
  let sentence: string;
  const tokens = lineTokens(ctx, line);
  if (ctx.lang === 'ja' && tokens) {
    const chunk = chunkTokens(tokens).find((c) => c.from === target.word.at);
    if (!chunk) return null;
    const before = displayLine(line, tokens.slice(0, chunk.from));
    const after = displayLine(line, tokens.slice(chunk.to));
    sentence = `${before}___${after}`;
  } else {
    const at = target.word.at;
    if (line.text.slice(at, at + answer.length) !== answer) return null;
    sentence = `${line.text.slice(0, at)}___${line.text.slice(at + answer.length)}`;
  }
  const others = distinctBy(
    ctx.words.filter((w) => w.word.key !== target.word.key && normalize(w.word.surface, ctx.lang) !== normalize(answer, ctx.lang)),
    (w) => normalize(w.word.surface, ctx.lang),
  );
  // Similar length first, so the answer does not stand out.
  const ranked = shuffle(others, ctx.rng).sort((a, b) => Math.abs(a.word.surface.length - answer.length) - Math.abs(b.word.surface.length - answer.length));
  const distractors = ranked.slice(0, 3).map((w) => w.word.surface);
  if (distractors.length < 2) return null;
  const ex: AuthoredExercise = {
    type: 'gap',
    id: key('gap'),
    sentence,
    pl: line.pl ?? '',
    options: shuffle([answer, ...distractors], ctx.rng),
    answer,
    explanation: target.meaning ? `${target.word.lemma}${target.word.reading && target.word.reading !== target.word.lemma ? ` (${target.word.reading})` : ''} — ${target.meaning}` : '',
  };
  return { kind: 'authored', key: ex.id, exercise: ex, refs: unique([lineRef(ctx.song.id, line.id), ...(target.ref ? [target.ref] : [])]), skill: 'recall', hints: true };
}

// ---------------------------------------------------------------------------
// B. Listening: which line was sung?

function listeningExercise(ctx: Ctx, line: LyricLine): Exercise | null {
  if (ctx.audio === 'none') return null;
  const others = distinctBy(
    ctx.song.lines.filter((l) => normalize(l.text, ctx.lang) !== normalize(line.text, ctx.lang)),
    (l) => normalize(l.text, ctx.lang),
  );
  if (others.length < 2) return null;
  const picked = shuffle(others, ctx.rng).slice(0, 3);
  const { options, correct } = withCorrect(line, picked, ctx.rng);
  return {
    kind: 'choice',
    key: key('listen'),
    mode: 'listen-target',
    prompt: { audio: line.text, hideText: true },
    options: options.map((l): ChoiceOption => ({ label: displayLine(l, lineTokens(ctx, l)), lang: ctx.lang })),
    correct,
    explanation: line.pl,
    refs: [lineRef(ctx.song.id, line.id)],
    skill: 'listening',
    hints: true,
  };
}

// ---------------------------------------------------------------------------
// C. Matching words with meanings

function matchExercise(ctx: Ctx): Exercise | null {
  const withMeaning = distinctBy(
    shuffle(
      ctx.usable.filter((w) => w.meaning && w.ref),
      ctx.rng,
    ),
    (w) => w.ref!,
  );
  const chosen = distinctBy(distinctBy(withMeaning, (w) => normalize(w.meaning!, 'pl')), (w) => w.word.lemma).slice(0, 5);
  if (chosen.length < 3) return null;
  const display = (w: PracticeWord) => (ctx.lang === 'ja' && w.word.reading && hasKanji(w.word.lemma) ? rubyWord(w.word.lemma, w.word.reading) : w.word.lemma);
  return {
    kind: 'match',
    key: key('match'),
    pairs: chosen.map((w) => ({ id: w.ref!, left: display(w), right: w.meaning! })),
    refs: chosen.map((w) => w.ref!),
    skill: 'recognition',
    hints: true,
  };
}

function rubyWord(lemma: string, reading: string): string {
  const seg = rubySegments({ s: lemma, base: lemma, r: reading, pr: '', pos: '', pos1: '', pos2: '', ct: '', cf: '' });
  return seg.map((s) => (s.ruby ? `{${s.base}|${s.ruby}}` : s.base)).join('');
}

// ---------------------------------------------------------------------------
// D. Translation: what does the line mean?

function translationExercise(ctx: Ctx, line: LyricLine): Exercise | null {
  if (!line.pl) return null;
  const others = distinctBy(
    ctx.song.lines.filter((l) => l.pl && normalize(l.pl, 'pl') !== normalize(line.pl!, 'pl') && normalize(l.text, ctx.lang) !== normalize(line.text, ctx.lang)),
    (l) => normalize(l.pl!, 'pl'),
  );
  if (others.length < 2) return null;
  const picked = shuffle(others, ctx.rng).slice(0, 3);
  const { options, correct } = withCorrect(line, picked, ctx.rng);
  const tokens = lineTokens(ctx, line);
  return {
    kind: 'choice',
    key: key('tr'),
    mode: 'read-sentence',
    prompt: { text: displayLine(line, tokens), lang: ctx.lang, audio: ctx.audio === 'none' ? undefined : line.text, romaji: tokens ? romajiLine(tokens) : undefined },
    options: options.map((l): ChoiceOption => ({ label: l.pl!, lang: 'pl' })),
    correct,
    explanation: line.literal ? `Dosłownie: ${line.literal}` : undefined,
    refs: [lineRef(ctx.song.id, line.id)],
    skill: 'recognition',
    hints: true,
  };
}

// ---------------------------------------------------------------------------
// E. Put the line in order

function orderExercise(ctx: Ctx, line: LyricLine): Exercise | null {
  const tokens = lineTokens(ctx, line);
  let tiles: string[];
  if (ctx.lang === 'ja') {
    if (!tokens) return null;
    tiles = chunkTokens(tokens)
      .filter((c) => !isSpace(tokens[c.from]) && !isPunct(tokens[c.from]))
      .map((c) => displayLine(line, tokens.slice(c.from, c.to)));
  } else {
    tiles = sentenceTokens({ id: '', text: line.text, pl: '' });
  }
  if (tiles.length < 3 || tiles.length > 9 || new Set(tiles).size < 3) return null;
  const sentence: Sentence = { id: lineRef(ctx.song.id, line.id), text: line.text, pl: line.pl ?? '', tokens: tiles };
  if (tokens) sentence.romaji = romajiLine(tokens);
  let shuffled = [...tiles];
  for (let i = 0; i < 5 && shuffled.join('|') === tiles.join('|'); i++) shuffled = shuffle(tiles, ctx.rng);
  if (!line.pl) sentence.pl = 'Ułóż wers piosenki';
  return { kind: 'order', key: key('order'), sentence, tiles: shuffled, answer: tiles, refs: [sentence.id], skill: 'production', hints: true };
}

// ---------------------------------------------------------------------------
// F. Reading (Japanese): how is this word read?

function readingExercise(ctx: Ctx, word: PracticeWord): Exercise | null {
  const { lemma, reading } = word.word;
  if (ctx.lang !== 'ja' || !reading || !hasKanji(lemma)) return null;
  const others = distinctBy(
    ctx.words.filter((w) => w.word.reading && w.word.reading !== reading && w.word.key !== word.word.key),
    (w) => w.word.reading!,
  );
  const fromCourse = [...ctx.course.items.values()].filter((i) => i.reading && i.kind === 'word' && i.reading !== reading).map((i) => i.reading!.split('・')[0]);
  const pool = unique([...shuffle(others, ctx.rng).map((w) => w.word.reading!), ...shuffle(fromCourse, ctx.rng)]).filter((r) => r !== reading);
  // Similar length readings are better distractors.
  const distractors = pool.sort((a, b) => Math.abs(a.length - reading.length) - Math.abs(b.length - reading.length)).slice(0, 3);
  if (distractors.length < 2) return null;
  const { options, correct } = withCorrect(reading, distractors, ctx.rng);
  return {
    kind: 'choice',
    key: key('reading'),
    mode: 'reading',
    prompt: { text: lemma, lang: 'ja' },
    options: options.map((r): ChoiceOption => ({ label: r, lang: 'ja' })),
    correct,
    explanation: word.meaning ? `${lemma} (${reading}) — ${word.meaning}` : undefined,
    refs: [word.ref ?? lineRef(ctx.song.id, word.word.lineId)],
    skill: 'recognition',
    hints: true,
  };
}

// ---------------------------------------------------------------------------
// G. Grammar: which construction is this?

export function lineNotes(lang: Course['id'], line: LyricLine, tokens?: readonly JaToken[]): FoundNote[] {
  if (lang === 'ja') return tokens ? japaneseNotes(tokens) : [];
  return patternNotes(lang, line.text);
}

function grammarExercise(ctx: Ctx, line: LyricLine): Exercise | null {
  const tokens = lineTokens(ctx, line);
  const found = lineNotes(ctx.lang, line, tokens);
  if (!found.length) return null;
  // Constructions at the learner's level first.
  const ranked = shuffle(found, ctx.rng).sort((a, b) => Number(levelRank(a.note.level) > ctx.learnerRank) - Number(levelRank(b.note.level) > ctx.learnerRank));
  const pick = ranked[0];
  const present = new Set(found.map((f) => f.note.title));
  const wrong = shuffle(
    allNotes(ctx.lang).filter((n) => !present.has(n.title)),
    ctx.rng,
  )
    .slice(0, 3)
    .map((n) => n.title);
  if (wrong.length < 2) return null;
  const options = shuffle([pick.note.title, ...wrong], ctx.rng);
  const what = ctx.lang === 'ja' && tokens && pick.tokens?.length ? tokens[pick.tokens[0]].s : pick.match;
  const ex: AuthoredExercise = {
    type: 'choice',
    id: key('grammar'),
    prompt: what ? `Co wyraża „${what}” w tym wersie?` : 'Jaka konstrukcja występuje w tym wersie?',
    target: displayLine(line, tokens),
    showTarget: true,
    optionsLang: 'pl',
    options,
    answer: options.indexOf(pick.note.title),
    explanation: pick.note.body,
  };
  return { kind: 'authored', key: ex.id, exercise: ex, refs: [lineRef(ctx.song.id, line.id)], skill: 'grammar', hints: true };
}

// ---------------------------------------------------------------------------
// H. Dictation

const DICTATION_MAX = { ja: 18, es: 45, de: 45 } as const;

function dictationExercise(ctx: Ctx, line: LyricLine): Exercise | null {
  if (ctx.audio === 'none') return null;
  const length = line.text.replace(/\s/g, '').length;
  if (length > DICTATION_MAX[ctx.lang] || length < 3) return null;
  const tokens = lineTokens(ctx, line);
  const accepted = unique([line.text, ...(tokens ? [readingLine(tokens)] : [])]);
  return {
    kind: 'type',
    key: key('dict'),
    mode: 'dictation',
    prompt: { audio: line.text },
    accepted,
    display: displayLine(line, tokens),
    romaji: tokens ? romajiLine(tokens) : undefined,
    refs: [lineRef(ctx.song.id, line.id)],
    skill: 'dictation',
    hints: true,
  };
}

// ---------------------------------------------------------------------------
// The session

/** Lines that need practice most: never answered correctly first, then the weakest. */
function practiceOrder(song: Song, lines: LyricLine[], rng: Rng): LyricLine[] {
  const score = (l: LyricLine) => {
    const p = song.progress.lines[l.id];
    if (!p) return 0;
    return (p.correct ? 10 : 2) + p.correct * 3 - (p.seen - p.correct) * 2;
  };
  return shuffle(lines, rng).sort((a, b) => score(a) - score(b));
}

export type MusicExerciseKind = 'gap' | 'listening' | 'match' | 'translation' | 'order' | 'reading' | 'grammar' | 'dictation';

export function buildSongPractice(opts: SongPracticeOptions): Exercise[] {
  const rng = createRng(opts.seed);
  const lang = opts.course.id;
  const lines = opts.song.lines.filter((l) => !opts.lineIds || opts.lineIds.includes(l.id));
  const usable = opts.words.filter((w) => !w.known);
  const ctx: Ctx = { ...opts, rng, lang, lines, usable };
  const size = opts.size ?? 12;

  const ordered = distinctBy(practiceOrder(opts.song, lines, rng), (l) => normalize(l.text, lang));
  const lineKinds: ((l: LyricLine) => Exercise | null)[] = [
    (l) => gapExercise(ctx, l),
    (l) => listeningExercise(ctx, l),
    (l) => translationExercise(ctx, l),
    (l) => orderExercise(ctx, l),
    (l) => grammarExercise(ctx, l),
    (l) => dictationExercise(ctx, l),
  ];
  const out: Exercise[] = [];
  const match = matchExercise(ctx);
  if (match) out.push(match);
  if (lang === 'ja') {
    const readingWords = distinctBy(
      shuffle(
        usable.filter((w) => w.word.reading && hasKanji(w.word.lemma)),
        rng,
      ),
      (w) => w.word.key,
    );
    for (const w of readingWords.slice(0, 2)) {
      const ex = readingExercise(ctx, w);
      if (ex) out.push(ex);
    }
  }
  // Each line gets a different kind of exercise, rotating through all of them.
  let kindIndex = Math.floor(rng() * lineKinds.length);
  for (const line of ordered) {
    if (out.length >= size) break;
    for (let tries = 0; tries < lineKinds.length; tries++) {
      const ex = lineKinds[kindIndex % lineKinds.length](line);
      kindIndex += 1;
      if (ex) {
        out.push(ex);
        break;
      }
    }
  }
  // Short songs: a second pass with other kinds for the same lines.
  for (const line of ordered) {
    if (out.length >= Math.min(size, ordered.length * 2 + 3)) break;
    const ex = lineKinds[kindIndex % lineKinds.length](line);
    kindIndex += 1;
    if (ex) out.push(ex);
  }
  if (!out.length) return [];
  const mixed = interleave(out, rng);
  mixed.push({ kind: 'summary', key: key('summary'), refs: [], hints: true });
  return mixed;
}

/** The kind of a generated music exercise (for tests and the session summary). */
export function musicKind(ex: Exercise): MusicExerciseKind | null {
  if (ex.kind === 'authored') return ex.exercise.type === 'gap' ? 'gap' : 'grammar';
  if (ex.kind === 'match') return 'match';
  if (ex.kind === 'order') return 'order';
  if (ex.kind === 'type') return 'dictation';
  if (ex.kind === 'choice') return ex.mode === 'listen-target' ? 'listening' : ex.mode === 'reading' ? 'reading' : 'translation';
  return null;
}

