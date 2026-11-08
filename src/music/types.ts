/**
 * Music Lab data model. Songs, playlists and the learner's words are learner data: stored in
 * IndexedDB, included in backups and in the optional Google Drive copy (the learner's own
 * storage). Lyrics are always supplied by the learner; the app ships none except a few
 * public-domain samples (src/music/samples.ts). See docs/MUSIC_LAB.md.
 */
import type { CourseId } from '../content/types';

/**
 * Timing of one word or syllable, exactly as given by the imported file (enhanced LRC or
 * WebVTT karaoke timestamps). Word timing is never estimated.
 */
export interface WordTime {
  text: string;
  start: number;
}

export interface LyricLine {
  /** Stable id within the song (`l1`, `l2`…); kept when the text is edited. */
  id: string;
  text: string;
  /** Seconds from the start of the recording (imported file or tap-sync). */
  start?: number;
  /** End of the line, when the file gives it (SRT/VTT) or the next line starts (LRC). */
  end?: number;
  words?: WordTime[];
  /** First line of a new stanza (a blank line before it in the source). */
  stanza?: boolean;
  /** Polish translation of the line. */
  pl?: string;
  /** Who wrote the translation: the learner, or the optional AI assistant (labelled). */
  plBy?: 'user' | 'ai';
  /** AI only: a word-for-word rendering and a short note on the meaning. */
  literal?: string;
  aiNote?: string;
  /** AI only: the model was unsure about this line (slang, wordplay, unclear lyrics). */
  uncertain?: boolean;
}

export type LyricsFormat = 'plain' | 'lrc' | 'srt' | 'vtt';
export type TimingKind = 'none' | 'line' | 'word';

export interface LineStats {
  seen: number;
  correct: number;
  last: number;
}

export interface SongProgress {
  /** Practice results per line id. */
  lines: Record<string, LineStats>;
  /** Practice sessions finished with this song. */
  sessions: number;
  lastPracticedAt?: number;
}

export interface Song {
  /** `song-<random>`, or `sample-<id>` for the public-domain samples. */
  id: string;
  lang: CourseId;
  title: string;
  artist: string;
  /** YouTube video id; null = lyrics only (no video). */
  videoId: string | null;
  lines: LyricLine[];
  /** Format the lyrics were imported from (informational). */
  format: LyricsFormat;
  /** Seconds added to every line time (lyrics shown later when positive). */
  delay: number;
  favorite: boolean;
  /**
   * Japanese reading corrections by the learner, per line id: `${tokenIndex}:${surface}` →
   * hiragana (e.g. 今日 read こんにち when it is the greeting).
   */
  readings?: Record<string, Record<string, string>>;
  /**
   * Short Polish meanings of the song's words from the optional AI assistant (word key →
   * meaning), shown labelled as AI. Saved to a word's own entry when the learner practises it.
   */
  glosses?: Record<string, string>;
  /** Public-domain sample: where the text comes from. */
  sample?: { id: string; source: string };
  progress: SongProgress;
  /** Last playback position, to resume. */
  position?: number;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt?: number;
  /** Deleted songs stay as an empty record so a synchronised copy does not bring them back. */
  deletedAt?: number;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

/** new: only a saved meaning; known: marked as known; learning: in the reviews. */
export type WordStatus = 'new' | 'known' | 'learning';

/**
 * A word the learner met in a song and saved: with an own meaning, marked as known, or to
 * learn (then it has a review card, shared with the course item when the course teaches it).
 */
export interface WordEntry {
  /** `${lang}:${lemma}` (lemma lower-cased for Spanish and German). */
  id: string;
  lang: CourseId;
  /** Dictionary form as written (Japanese: base form from the morphological analysis). */
  lemma: string;
  /** Japanese: reading of the dictionary form in hiragana. */
  reading?: string;
  /** Polish meaning. */
  pl?: string;
  plBy?: 'user' | 'ai' | 'course';
  /** Short Polish part-of-speech label. */
  pos?: string;
  status: WordStatus;
  /** Course item with the same word: its review card is used instead of a new one. */
  courseItemId?: string;
  /** Lines where the learner met the word (song and line ids). */
  contexts: { songId: string; lineId: string }[];
  createdAt: number;
  updatedAt: number;
}

/** Review card id of a learner's own word (course words use the course item id). */
export function wordCardId(entry: Pick<WordEntry, 'id' | 'courseItemId'>): string {
  return entry.courseItemId ?? `w:${entry.id}`;
}

export function isWordCardId(id: string): boolean {
  return id.startsWith('w:');
}

/** SRS ref of a lyric line in a practice session (line results go to the song's progress). */
export function lineRef(songId: string, lineId: string): string {
  return `line:${songId}:${lineId}`;
}

export function parseLineRef(ref: string): { songId: string; lineId: string } | null {
  const m = /^line:(.+):([^:]+)$/.exec(ref);
  return m ? { songId: m[1], lineId: m[2] } : null;
}
