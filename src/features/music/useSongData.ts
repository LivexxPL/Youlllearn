import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db';
import { cachedAnalysis, linesHash, saveAnalysis } from '../../services/music';
import { analyzeJapanese, AnalysisError } from '../../music/japanese/analyzer';
import type { JaToken } from '../../music/japanese/tokens';
import { practiceWords, songTokens } from '../../music/practice';
import type { PracticeWord } from '../../music/exercises';
import type { Song, WordEntry } from '../../music/types';
import { getCourse } from '../../content/registry';
import { useCompletedSet } from '../../state/hooks';
import { coveredLessons } from '../../engine/levels';
import { levelRank } from '../../music/grammar';
import { wordEntryId } from '../../music/vocab';
import type { CourseId } from '../../content/types';

export type AnalysisState =
  | { status: 'none' }
  | { status: 'loading'; progress: number }
  | { status: 'ready'; raw: Record<string, JaToken[]> }
  | { status: 'error'; code: 'network' | 'unsupported' | 'failed' };

/** Japanese analysis of a song: from the device cache, or computed (and cached) in a worker. */
export function useJapaneseAnalysis(song: Song | undefined): { state: AnalysisState; retry: () => void } {
  const [state, setState] = useState<AnalysisState>({ status: 'none' });
  const [attempt, setAttempt] = useState(0);
  const hash = song ? linesHash(song.lines) : '';
  const id = song?.id;
  const isJa = song?.lang === 'ja' && song.lines.length > 0;

  useEffect(() => {
    if (!song || !isJa) {
      setState({ status: 'none' });
      return;
    }
    let cancelled = false;
    (async () => {
      const cached = await cachedAnalysis(song);
      if (cancelled) return;
      if (cached) {
        setState({ status: 'ready', raw: cached.lines });
        return;
      }
      setState({ status: 'loading', progress: 0 });
      try {
        const tokens = await analyzeJapanese(
          song.lines.map((l) => l.text),
          (loaded, total) => !cancelled && setState({ status: 'loading', progress: total ? loaded / total : 0 }),
        );
        const rec = await saveAnalysis(song, tokens);
        if (!cancelled) setState({ status: 'ready', raw: rec.lines });
      } catch (e) {
        if (!cancelled) setState({ status: 'error', code: e instanceof AnalysisError ? e.code : 'failed' });
      }
    })();
    return () => {
      cancelled = true;
    };
    // The analysis depends on the line texts only (hash), not on other edits of the song.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hash, isJa, attempt]);

  return { state, retry: () => setAttempt((n) => n + 1) };
}

/** 1 = beginner (A1 / N5) … 3, from how far the learner is in the course of that language. */
export function useLearnerRank(lang: CourseId): number {
  const completed = useCompletedSet(lang);
  return useMemo(() => {
    const course = getCourse(lang);
    const covered = coveredLessons(course, completed);
    if (covered === 0) return 1;
    const lesson = course.lessons[Math.min(covered, course.lessons.length - 1)];
    const unit = course.units.find((u) => u.lessons.some((l) => l.id === lesson.id));
    return unit?.level && unit.level !== 'Kana' ? levelRank(unit.level) : 1;
  }, [lang, completed]);
}

export interface SongData {
  song: Song | undefined | null;
  entries: Map<string, WordEntry>;
  analysis: AnalysisState;
  retryAnalysis: () => void;
  /** Japanese tokens per line with reading corrections (undefined for other languages or while analysing). */
  tokens: Record<string, JaToken[]> | undefined;
  words: PracticeWord[];
  learnerRank: number;
}

export function useSongData(id: string): SongData {
  const song = useLiveQuery(async () => (await db.songs.get(id)) ?? null, [id]);
  const live = song && !song.deletedAt ? song : song === undefined ? undefined : null;
  const lang = live?.lang ?? 'es';
  const list = useLiveQuery(() => db.words.where('lang').equals(lang).toArray(), [lang]);
  const entries = useMemo(() => new Map((list ?? []).map((e) => [e.id, e])), [list]);
  const { state: analysis, retry } = useJapaneseAnalysis(live ?? undefined);
  const raw = analysis.status === 'ready' ? analysis.raw : undefined;
  const tokens = useMemo(() => (live ? songTokens(live, raw) : undefined), [live, raw]);
  const words = useMemo(() => {
    if (!live) return [];
    if (live.lang === 'ja' && !tokens) return [];
    // Words without another meaning can use the AI assistant's gloss (labelled in the UI).
    return practiceWords(live, getCourse(live.lang), tokens, entries).map((w) => {
      const gloss = live.glosses?.[w.word.key];
      if (w.meaning || !gloss) return w;
      return { ...w, meaning: gloss, ref: w.ref ?? `w:${wordEntryId(live.lang, w.word.key)}` };
    });
  }, [live, tokens, entries]);
  const learnerRank = useLearnerRank(lang);
  return { song: live, entries, analysis, retryAnalysis: retry, tokens, words, learnerRank };
}
