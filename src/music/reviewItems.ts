/**
 * Words from songs in the regular reviews. A learner's own word (not taught by the course)
 * becomes an Item for the review session, Audio Quest and the word list, so the existing SRS
 * engine and exercises are used unchanged. Course words already have their item.
 */
import type { Course, Item } from '../content/types';
import { rubyMarkup } from './japanese/tokens';
import { wordCardId, type Song, type WordEntry } from './types';

export function songWordItem(entry: WordEntry, songs: ReadonlyMap<string, Song>): Item | null {
  if (entry.courseItemId || !entry.pl) return null;
  const ctx = entry.contexts.map((c) => ({ song: songs.get(c.songId), lineId: c.lineId })).find((c) => c.song && !c.song.deletedAt);
  const line = ctx?.song?.lines.find((l) => l.id === ctx.lineId);
  const item: Item = {
    id: wordCardId(entry),
    kind: 'word',
    text: entry.lang === 'ja' ? rubyMarkup(entry.lemma, entry.reading) : entry.lemma,
    pl: entry.pl,
    note: ctx?.song ? `Z piosenki „${ctx.song.title}”${entry.plBy === 'ai' ? ' (znaczenie od asystenta AI)' : ''}.` : undefined,
  };
  if (entry.reading) item.reading = entry.reading;
  if (line) item.example = { text: line.text, pl: line.pl ?? '' };
  return item;
}

export function songWordItems(entries: readonly WordEntry[], songs: readonly Song[]): Item[] {
  const byId = new Map(songs.map((s) => [s.id, s]));
  return entries.map((e) => songWordItem(e, byId)).filter((x): x is Item => Boolean(x));
}

/** The course with the learner's song words added to its item lookup (shared by reviews). */
export function withSongWords(course: Course, items: readonly Item[]): Course {
  if (!items.length) return course;
  const map = new Map(course.items);
  for (const i of items) if (!map.has(i.id)) map.set(i.id, i);
  return { ...course, items: map };
}

/** Items that are not part of any lesson (song words in an augmented course). */
export function extraItems(course: Course): Item[] {
  return [...course.items.values()].filter((i) => !course.lessonOf.has(i.id));
}
