import type { Example, Item } from '../types';

/**
 * Kanji item. `reading` lists the most useful readings separated by ・ —
 * the first one is used for text-to-speech of the bare character.
 */
export function kanji(
  id: string,
  char: string,
  pl: string,
  reading: string,
  on: string[],
  kun: string[],
  words: Example[],
  extra: Partial<Item> = {},
): Item {
  return {
    id: `ja.kj.${id}`,
    kind: 'kanji',
    text: char,
    reading,
    pl,
    on,
    kun,
    words,
    writeChars: char,
    ...extra,
  };
}
