import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Course, CourseId } from '../../content/types';
import { getCourse } from '../../content/registry';
import { db } from '../../services/db';
import { songWordItems, withSongWords } from '../../music/reviewItems';

/**
 * The course as reviews see it: course items plus the learner's own words from songs.
 * `undefined` while the words load (a session built earlier would miss them).
 */
export function useStudyCourse(courseId: CourseId): Course | undefined {
  const words = useLiveQuery(() => db.words.where('lang').equals(courseId).toArray(), [courseId]);
  const songs = useLiveQuery(() => db.songs.where('lang').equals(courseId).toArray(), [courseId]);
  return useMemo(() => {
    if (!words || !songs) return undefined;
    return withSongWords(getCourse(courseId), songWordItems(words, songs));
  }, [courseId, words, songs]);
}
