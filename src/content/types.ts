/**
 * Content model shared by all courses.
 *
 * Every id is globally unique and prefixed with the course id
 * (e.g. `es.hola`, `de.s.hallo-1`, `ja.g.wa`) so that spaced-repetition
 * cards can use content ids directly.
 *
 * Polish glosses live in `pl` fields. Additional interface languages can add
 * sibling fields (e.g. `en`) later; `gloss()` in ./text.ts falls back to `pl`.
 */

export type CourseId = 'es' | 'de' | 'ja';
export const COURSE_IDS: readonly CourseId[] = ['es', 'de', 'ja'];

export type ItemKind = 'word' | 'phrase' | 'kana' | 'kanji';
export type Gender = 'm' | 'f' | 'n' | 'pl';
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adj'
  | 'adv'
  | 'pron'
  | 'num'
  | 'prep'
  | 'conj'
  | 'particle'
  | 'expr'
  | 'q'
  | 'art';

export interface Example {
  text: string;
  pl: string;
  romaji?: string;
}

/** A vocabulary item, phrase, kana or kanji introduced by a lesson. */
export interface Item {
  id: string;
  kind: ItemKind;
  /** Target-language text. Japanese may contain furigana markup: {漢字|かんじ}. */
  text: string;
  /** Japanese: plain kana reading of the whole item. */
  reading?: string;
  /** Explicit romaji (otherwise derived from `reading`/`text`). */
  romaji?: string;
  /** Primary Polish meaning shown to the learner. */
  pl: string;
  /** Other accepted Polish answers. */
  plAlts?: string[];
  /** Other accepted target-language answers (e.g. a variant spelling). */
  alts?: string[];
  gender?: Gender;
  pos?: PartOfSpeech;
  /** German plural / Spanish irregular plural etc. */
  plural?: string;
  /** Short Polish note displayed on the intro card and after mistakes. */
  note?: string;
  /** Memory tip (original text written for this project). */
  tip?: string;
  /** Text to send to text-to-speech when it differs from `text`. */
  tts?: string;
  example?: Example;
  /** Kanji only. */
  on?: string[];
  kun?: string[];
  /** Kanji/kana words to show as examples. */
  words?: Example[];
  /** Characters to practise writing (Japanese). Defaults to `text` for kana/kanji items. */
  writeChars?: string;
}

export type AccentId = 'es-ES' | 'es-MX' | 'de-DE' | 'de-AT' | 'ja-JP';

export interface Sentence {
  id: string;
  /** Target text. In Japanese, spaces separate chunks (bunsetsu) and may be hidden in the UI. */
  text: string;
  pl: string;
  plAlts?: string[];
  /** Alternative correct target sentences (other word orders etc.). */
  alts?: string[];
  romaji?: string;
  tts?: string;
  /** Explicit tiles for word-order exercises. Default: `text` split on spaces. */
  tokens?: string[];
  note?: string;
  accent?: AccentId;
}

export interface GrammarTable {
  caption?: string;
  head: string[];
  rows: string[][];
}

export interface GrammarNote {
  id: string;
  title: string;
  /** Paragraphs in Polish. `**bold**` and `[[target text]]` markup are supported. */
  body: string[];
  table?: GrammarTable;
  examples?: Sentence[];
  /** Polish-specific contrast ("Po polsku…"). */
  contrast?: string;
}

export interface ChoiceQuestion {
  id: string;
  prompt: string;
  /** Optional target-language line shown/played with the question. */
  target?: string;
  options: string[];
  answer: number;
  explanation: string;
}

/** Hand-written grammar/usage exercise. */
export type AuthoredExercise =
  | {
      type: 'gap';
      id: string;
      /** Grammar note this exercise practises (enables SRS review of the concept). */
      concept?: string;
      /** Sentence with `___` marking the gap. */
      sentence: string;
      pl: string;
      options: string[];
      answer: string;
      explanation: string;
    }
  | {
      type: 'choice';
      id: string;
      concept?: string;
      prompt: string;
      target?: string;
      /** Language of the options; default: target language (Japanese: detected from kana). */
      optionsLang?: 'pl' | 'target';
      options: string[];
      answer: number;
      explanation: string;
    };

export interface DialogueSpeaker {
  name: string;
  /** Voice slot: the audio engine maps a/b to different voices or pitches. */
  voice: 'a' | 'b';
  accent?: AccentId;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  pl: string;
  romaji?: string;
}

export interface Dialogue {
  id: string;
  title: string;
  /** Polish scene description. */
  context: string;
  speakers: Record<string, DialogueSpeaker>;
  lines: DialogueLine[];
  questions: ChoiceQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  /** Target-language subtitle, e.g. "¡Hola!" */
  subtitle?: string;
  objective: string;
  /** CEFR level, JLPT reference or "Kana". */
  level: string;
  minutes: number;
  /** Optional pronunciation primer / warm introduction (Polish paragraphs). */
  intro?: string[];
  items: Item[];
  sentences: Sentence[];
  grammar?: GrammarNote[];
  exercises?: AuthoredExercise[];
  dialogue?: Dialogue;
  summary: string[];
  followUp?: string;
  /** Japanese kana lessons: characters offered for handwriting practice. */
  writing?: string[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  /** Level label shown on the learning path (e.g. "A1", "A2", "Kana"). */
  level?: string;
  lessons: Lesson[];
}

export interface StoryLine {
  speaker?: string;
  text: string;
  pl: string;
  romaji?: string;
}

/** Short listening story built from vocabulary of earlier lessons. */
export interface Story {
  id: string;
  title: string;
  /** Unlocked once this lesson is completed. */
  afterLesson: string;
  /** 1 = slow & clear, 2 = normal, 3 = closer to natural speed. */
  stage: 1 | 2 | 3;
  context: string;
  lines: StoryLine[];
  questions: ChoiceQuestion[];
}

export interface CourseDefinition {
  id: CourseId;
  name: string;
  nativeName: string;
  /** BCP-47 tag used for text-to-speech / speech recognition. */
  speechLang: string;
  /** Accent variants used in listening exercises. */
  accents: { id: AccentId; label: string; speechLang: string }[];
  color: string;
  emblem: string;
  description: string;
  framework: string;
  units: Unit[];
  stories: Story[];
}

/** A course with derived lookup tables (see buildCourse in ./registry.ts). */
export interface Course extends CourseDefinition {
  lessons: Lesson[];
  lessonIndex: Map<string, number>;
  items: Map<string, Item>;
  sentences: Map<string, Sentence>;
  grammar: Map<string, GrammarNote>;
  /** item/sentence/grammar id -> lesson id */
  lessonOf: Map<string, string>;
  /** Authored exercises grouped by concept (grammar id). */
  conceptExercises: Map<string, AuthoredExercise[]>;
}
