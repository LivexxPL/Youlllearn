/** Compact constructors used by the course content files. */
import type { CourseId, Item, Sentence, PartOfSpeech, Gender } from './types';

type ItemExtra = Partial<Omit<Item, 'id' | 'text' | 'pl'>>;
type SentenceExtra = Partial<Omit<Sentence, 'id' | 'text' | 'pl'>>;

export function contentHelpers(course: CourseId) {
  const item =
    (kind: Item['kind'], pos?: PartOfSpeech) =>
    (id: string, text: string, pl: string, extra: ItemExtra = {}): Item => ({
      id: `${course}.${id}`,
      kind,
      text,
      pl,
      ...(pos ? { pos } : {}),
      ...extra,
    });

  return {
    word: item('word'),
    noun: (id: string, text: string, pl: string, gender: Gender, extra: ItemExtra = {}): Item => ({
      id: `${course}.${id}`,
      kind: 'word',
      pos: 'noun',
      gender,
      text,
      pl,
      ...extra,
    }),
    verb: item('word', 'verb'),
    phrase: item('phrase', 'expr'),
    sentence: (id: string, text: string, pl: string, extra: SentenceExtra = {}): Sentence => ({
      id: `${course}.s.${id}`,
      text,
      pl,
      ...extra,
    }),
  };
}
