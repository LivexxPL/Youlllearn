/**
 * Exercise model and generators. Exercises are generated from authored
 * content (items, sentences, grammar exercises, dialogues): the *format* is
 * generated, the language data and explanations are always authored.
 */
import type { AuthoredExercise, Course, CourseId, Dialogue, GrammarNote, Item, Lesson, Sentence, Story } from '../content/types';
import { acceptedMeanings, acceptedTargets, gloss, plainTarget, sentenceTokens, unique } from '../content/text';
import { normalize } from './answer';
import type { Skill } from './srs';
import { pick, sample, shuffle, type Rng } from './random';

export interface ChoiceOption {
  /** Display text (may contain furigana markup for Japanese). */
  label: string;
  /** Language of the label: target language or Polish. */
  lang: CourseId | 'pl';
  /** Speak this option when focused/tapped (listening exercises in target language). */
  speak?: string;
}

interface BaseExercise {
  /** Unique within a session. */
  key: string;
  /** SRS card ids affected by the result (empty for ungraded steps). */
  refs: string[];
  skill?: Skill;
  /** Hints (romaji, slow replay counts as replay not hint) allowed. */
  hints: boolean;
}

export type Exercise =
  | (BaseExercise & { kind: 'info'; variant: 'objective' | 'warmup' | 'retrieval' | 'retry' | 'intro'; title: string; body: string[]; lesson?: Lesson })
  | (BaseExercise & { kind: 'intro'; item: Item })
  | (BaseExercise & { kind: 'grammar'; note: GrammarNote })
  | (BaseExercise & { kind: 'examples'; sentences: Sentence[] })
  | (BaseExercise & {
      kind: 'choice';
      mode: 'meaning' | 'target' | 'listen' | 'listen-target' | 'kana-sound' | 'kana-listen' | 'kana-from-romaji' | 'read-sentence' | 'listen-sentence';
      prompt: { text?: string; lang?: CourseId | 'pl'; audio?: string; hideText?: boolean; romaji?: string };
      options: ChoiceOption[];
      correct: number;
      explanation?: string;
      item?: Item;
      sentence?: Sentence;
    })
  | (BaseExercise & {
      kind: 'type';
      mode: 'production' | 'dictation';
      prompt: { text?: string; audio?: string };
      accepted: string[];
      display: string;
      romaji?: string;
      item?: Item;
      sentence?: Sentence;
    })
  | (BaseExercise & { kind: 'order'; sentence: Sentence; tiles: string[]; answer: string[] })
  | (BaseExercise & { kind: 'match'; pairs: { id: string; left: string; right: string }[] })
  | (BaseExercise & { kind: 'authored'; exercise: AuthoredExercise })
  | (BaseExercise & { kind: 'dialogue'; dialogue: Dialogue })
  | (BaseExercise & { kind: 'question'; question: Dialogue['questions'][number]; dialogue?: Dialogue; story?: Story })
  | (BaseExercise & { kind: 'speak'; mode: 'repeat' | 'shadow'; text: string; translation: string; romaji?: string; item?: Item; sentence?: Sentence })
  | (BaseExercise & { kind: 'write'; mode: 'trace' | 'recall'; char: string; romaji: string; meaning: string; item?: Item })
  | (BaseExercise & { kind: 'summary' });

export type ExerciseKind = Exercise['kind'];

export function isGraded(ex: Exercise): boolean {
  return ex.refs.length > 0 || ex.kind === 'authored' || ex.kind === 'question' || ex.kind === 'match';
}

let keyCounter = 0;
function key(prefix: string): string {
  keyCounter += 1;
  return `${prefix}-${keyCounter}`;
}

// ---------------------------------------------------------------------------
// Distractors

function meaningKey(s: string): string {
  return normalize(s, 'pl');
}

/** Picks up to n distractor items with different meanings and different text. */
export function distractorItems(target: Item, pool: Item[], n: number, rng: Rng): Item[] {
  const tMeaning = meaningKey(gloss(target));
  const tAlts = new Set(acceptedMeanings(target).map(meaningKey));
  const tText = plainTarget(target.text);
  const candidates = pool.filter((i) => {
    if (i.id === target.id) return false;
    if (plainTarget(i.text) === tText) return false;
    const m = meaningKey(gloss(i));
    if (m === tMeaning || tAlts.has(m)) return false;
    // Avoid distractors sharing an accepted meaning (e.g. two words for "proszę").
    return !acceptedMeanings(i).some((a) => tAlts.has(meaningKey(a)));
  });
  // Prefer same kind (kana with kana, kanji with kanji, words with words).
  const sameKind = candidates.filter((i) => i.kind === target.kind || (i.kind !== 'kana' && target.kind !== 'kana' && i.kind !== 'kanji' && target.kind !== 'kanji'));
  const base = sameKind.length >= n ? sameKind : candidates;
  // Deduplicate by meaning so options are unambiguous.
  const seen = new Set<string>();
  const out: Item[] = [];
  for (const i of shuffle(base, rng)) {
    const m = meaningKey(gloss(i));
    const t = plainTarget(i.text);
    if (seen.has(m) || seen.has(`t:${t}`)) continue;
    seen.add(m);
    seen.add(`t:${t}`);
    out.push(i);
    if (out.length >= n) break;
  }
  return out;
}

function distractorSentences(target: Sentence, pool: Sentence[], n: number, rng: Rng): Sentence[] {
  const t = meaningKey(target.pl);
  const seen = new Set<string>([t]);
  const out: Sentence[] = [];
  for (const s of shuffle(pool, rng)) {
    if (s.id === target.id) continue;
    const m = meaningKey(s.pl);
    if (seen.has(m) || plainTarget(s.text) === plainTarget(target.text)) continue;
    seen.add(m);
    out.push(s);
    if (out.length >= n) break;
  }
  return out;
}

function withCorrect<T>(correct: T, distractors: T[], rng: Rng): { options: T[]; correct: number } {
  const options = shuffle([correct, ...distractors], rng);
  return { options, correct: options.indexOf(correct) };
}

// ---------------------------------------------------------------------------
// Item exercises

export interface GenContext {
  course: Course;
  rng: Rng;
  /** Items available as distractors (current + earlier lessons). */
  pool: Item[];
  sentencePool: Sentence[];
  /** Romaji shown with Japanese text in this context. */
  showRomaji: boolean;
  /** Hints allowed (false in retrieval tests). */
  hints?: boolean;
}

const itemRomaji = (item: Item): string | undefined => item.romaji ?? undefined;

export function introExercise(item: Item): Exercise {
  return { kind: 'intro', key: key('intro'), item, refs: [], hints: true };
}

export function recognitionExercise(item: Item, ctx: GenContext): Exercise | null {
  const ds = distractorItems(item, ctx.pool, 3, ctx.rng);
  if (ds.length < 2) return null;
  const kana = item.kind === 'kana';
  const { options, correct } = withCorrect(item, ds, ctx.rng);
  return {
    kind: 'choice',
    key: key('rec'),
    mode: kana ? 'kana-sound' : item.kind === 'kanji' ? 'meaning' : 'meaning',
    prompt: { text: item.text, lang: ctx.course.id, audio: kana ? undefined : item.text, romaji: kana ? undefined : itemRomaji(item) },
    options: options.map((o) => ({ label: gloss(o), lang: 'pl' as const })),
    correct,
    refs: [item.id],
    skill: 'recognition',
    hints: ctx.hints ?? true,
    item,
    explanation: item.note,
  };
}

export function recallExercise(item: Item, ctx: GenContext): Exercise | null {
  const ds = distractorItems(item, ctx.pool, 3, ctx.rng);
  if (ds.length < 2) return null;
  const kana = item.kind === 'kana';
  const { options, correct } = withCorrect(item, ds, ctx.rng);
  return {
    kind: 'choice',
    key: key('recall'),
    mode: kana ? 'kana-from-romaji' : 'target',
    prompt: { text: gloss(item), lang: 'pl' },
    options: options.map((o) => ({ label: o.text, lang: ctx.course.id, speak: o.text })),
    correct,
    refs: [item.id],
    skill: 'recall',
    hints: ctx.hints ?? true,
    item,
    explanation: item.note,
  };
}

export function listeningExercise(item: Item, ctx: GenContext): Exercise | null {
  const ds = distractorItems(item, ctx.pool, 3, ctx.rng);
  if (ds.length < 2) return null;
  const kana = item.kind === 'kana';
  const { options, correct } = withCorrect(item, ds, ctx.rng);
  return {
    kind: 'choice',
    key: key('listen'),
    mode: kana ? 'kana-listen' : 'listen',
    prompt: { audio: item.text, hideText: true },
    // For kana we choose the character heard; for words the meaning.
    options: options.map((o) => (kana ? { label: o.text, lang: ctx.course.id } : { label: gloss(o), lang: 'pl' as const })),
    correct,
    refs: [item.id],
    skill: 'listening',
    hints: ctx.hints ?? true,
    item,
    explanation: item.note,
  };
}

export function productionExercise(item: Item, ctx: GenContext): Exercise {
  return {
    kind: 'type',
    key: key('prod'),
    mode: 'production',
    prompt: { text: gloss(item) },
    accepted: acceptedTargets(ctx.course.id, item),
    display: item.text,
    romaji: itemRomaji(item),
    refs: [item.id],
    skill: 'production',
    hints: ctx.hints ?? true,
    item,
  };
}

export function dictationItemExercise(item: Item, ctx: GenContext): Exercise {
  return {
    kind: 'type',
    key: key('dict'),
    mode: 'dictation',
    prompt: { audio: item.text },
    accepted: acceptedTargets(ctx.course.id, item),
    display: item.text,
    romaji: itemRomaji(item),
    refs: [item.id],
    skill: 'dictation',
    hints: ctx.hints ?? true,
    item,
  };
}

export function speakItemExercise(item: Item, ctx: GenContext): Exercise {
  return {
    kind: 'speak',
    key: key('speak'),
    mode: 'repeat',
    text: item.text,
    translation: gloss(item),
    romaji: itemRomaji(item),
    refs: [item.id],
    skill: 'speaking',
    hints: ctx.hints ?? true,
    item,
  };
}

export function writeExercise(char: string, item: Item | undefined, mode: 'trace' | 'recall', ctx: GenContext): Exercise {
  return {
    kind: 'write',
    key: key('write'),
    mode,
    char,
    romaji: item?.romaji ?? item?.reading ?? '',
    meaning: item ? gloss(item) : '',
    refs: item ? [item.id] : [],
    skill: 'writing',
    hints: ctx.hints ?? true,
    item,
  };
}

// ---------------------------------------------------------------------------
// Sentence exercises

export function orderExercise(sentence: Sentence, ctx: GenContext, withDistractor = false): Exercise | null {
  const answer = sentenceTokens(sentence);
  if (answer.length < 3) return null;
  let tiles = [...answer];
  if (withDistractor) {
    const other = pick(ctx.sentencePool.filter((s) => s.id !== sentence.id), ctx.rng);
    const extra = other ? sentenceTokens(other).filter((t) => !answer.includes(t)) : [];
    if (extra.length) tiles.push(pick(extra, ctx.rng));
  }
  // Make sure the shuffle actually changes the order.
  for (let i = 0; i < 5; i++) {
    tiles = shuffle(tiles, ctx.rng);
    if (tiles.join('|') !== answer.join('|')) break;
  }
  return { kind: 'order', key: key('order'), sentence, tiles, answer, refs: [sentence.id], skill: 'production', hints: ctx.hints ?? true };
}

export function sentenceListeningExercise(sentence: Sentence, ctx: GenContext, showText = false): Exercise | null {
  const ds = distractorSentences(sentence, ctx.sentencePool, 2, ctx.rng);
  if (ds.length < 2) return null;
  const { options, correct } = withCorrect(sentence, ds, ctx.rng);
  return {
    kind: 'choice',
    key: key('lsent'),
    mode: showText ? 'read-sentence' : 'listen-sentence',
    prompt: { text: showText ? sentence.text : undefined, lang: ctx.course.id, audio: sentence.tts ?? sentence.text, hideText: !showText, romaji: sentence.romaji },
    options: options.map((o) => ({ label: o.pl, lang: 'pl' as const })),
    correct,
    refs: [sentence.id],
    skill: showText ? 'recognition' : 'listening',
    hints: ctx.hints ?? true,
    sentence,
    explanation: sentence.note,
  };
}

export function sentenceDictationExercise(sentence: Sentence, ctx: GenContext): Exercise {
  return {
    kind: 'type',
    key: key('sdict'),
    mode: 'dictation',
    prompt: { audio: sentence.tts ?? sentence.text },
    accepted: acceptedTargets(ctx.course.id, sentence),
    display: sentence.text,
    romaji: sentence.romaji,
    refs: [sentence.id],
    skill: 'dictation',
    hints: ctx.hints ?? true,
    sentence,
  };
}

export function sentenceProductionExercise(sentence: Sentence, ctx: GenContext): Exercise {
  return {
    kind: 'type',
    key: key('sprod'),
    mode: 'production',
    prompt: { text: sentence.pl },
    accepted: acceptedTargets(ctx.course.id, sentence),
    display: sentence.text,
    romaji: sentence.romaji,
    refs: [sentence.id],
    skill: 'production',
    hints: ctx.hints ?? true,
    sentence,
  };
}

export function speakSentenceExercise(sentence: Sentence, ctx: GenContext, mode: 'repeat' | 'shadow' = 'repeat'): Exercise {
  return {
    kind: 'speak',
    key: key('ssp'),
    mode,
    text: sentence.text,
    translation: sentence.pl,
    romaji: sentence.romaji,
    refs: [sentence.id],
    skill: 'speaking',
    hints: ctx.hints ?? true,
    sentence,
  };
}

export function matchExercise(items: Item[], ctx: GenContext): Exercise | null {
  // Unique meanings and texts so pairs are unambiguous.
  const seen = new Set<string>();
  const chosen: Item[] = [];
  for (const it of shuffle(items, ctx.rng)) {
    const m = meaningKey(gloss(it));
    const t = plainTarget(it.text);
    if (seen.has(m) || seen.has(`t:${t}`)) continue;
    seen.add(m);
    seen.add(`t:${t}`);
    chosen.push(it);
    if (chosen.length >= 5) break;
  }
  if (chosen.length < 3) return null;
  return {
    kind: 'match',
    key: key('match'),
    pairs: chosen.map((it) => ({ id: it.id, left: it.text, right: gloss(it) })),
    refs: chosen.map((it) => it.id),
    skill: 'recognition',
    hints: ctx.hints ?? true,
  };
}

export function authoredExercise(ex: AuthoredExercise, ctx: GenContext): Exercise {
  return { kind: 'authored', key: key('auth'), exercise: ex, refs: ex.concept ? [ex.concept] : [], skill: 'grammar', hints: ctx.hints ?? true };
}

/** Picks the generators that make sense for an item and skill. */
export function exerciseForSkill(item: Item, skill: Skill, ctx: GenContext): Exercise | null {
  switch (skill) {
    case 'recognition':
      return recognitionExercise(item, ctx);
    case 'recall':
      return recallExercise(item, ctx);
    case 'listening':
      return listeningExercise(item, ctx);
    case 'production':
      return item.kind === 'kana' ? recallExercise(item, ctx) : productionExercise(item, ctx);
    case 'dictation':
      return item.kind === 'kana' ? listeningExercise(item, ctx) : dictationItemExercise(item, ctx);
    case 'speaking':
      return speakItemExercise(item, ctx);
    case 'writing':
      return writeExercise(item.writeChars ?? item.text, item, 'recall', ctx);
    default:
      return recognitionExercise(item, ctx);
  }
}

export function itemPoolFor(course: Course, lessonIndex: number): Item[] {
  return unique(course.lessons.slice(0, lessonIndex + 1).flatMap((l) => l.items));
}

export function sentencePoolFor(course: Course, lessonIndex: number): Sentence[] {
  return course.lessons.slice(0, lessonIndex + 1).flatMap((l) => l.sentences);
}

export { sample };
