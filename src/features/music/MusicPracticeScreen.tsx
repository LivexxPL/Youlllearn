/**
 * Practice with a song: exercises built from its lines and words (src/music/exercises.ts) in
 * the regular session player. Lines are heard from the song itself (the visible video jumps to
 * the line) when the lyrics are timed; otherwise from speech synthesis, which says so.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListMusic } from 'lucide-react';
import { getCourse } from '../../content/registry';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState, PageHeader } from '../../components/ui';
import { SpeechOverrideContext, type SpeechOverride } from '../../components/AudioButton';
import { SessionPlayer } from '../session/SessionPlayer';
import type { SummaryData } from '../session/SummaryStep';
import { claimRewards, refreshAchievements, totalXp, type SessionOutcomes } from '../../services/progress';
import { recordMusicSession } from '../../services/music';
import { levelForXp } from '../../engine/gamification';
import { sessionCoinLines } from '../economy/labels';
import { newSessionId } from '../economy/session';
import { useSettings } from '../../state/settings';
import { useAudioStatus, useShowRomaji } from '../../state/hooks';
import { buildSongPractice, type LineAudio } from '../../music/exercises';
import { lineEnd, timingKind } from '../../music/lyrics';
import { stripRuby } from '../../engine/kana';
import type { Exercise } from '../../engine/exercises';
import { useSongData } from './useSongData';
import { useYouTubePlayer, VideoFrame } from './VideoPlayer';

const norm = (s: string) => stripRuby(s).replace(/\s+/g, ' ').trim();

export default function MusicPracticeScreen({ id, query }: { id: string; query: URLSearchParams }) {
  const data = useSongData(id);
  const { song } = data;
  const { settings } = useSettings();
  const showRomaji = useShowRomaji();
  const tts = useAudioStatus(getCourse(song?.lang ?? 'es').speechLang);
  const [steps, setSteps] = useState<Exercise[] | null>(null);
  const [sessionId] = useState(newSessionId);
  const xpBefore = useRef<number | null>(null);
  const timed = song ? timingKind(song.lines) !== 'none' : false;
  const audioMode: LineAudio = song?.videoId && timed ? 'video' : tts !== 'unsupported' && tts !== 'missing' ? 'tts' : 'none';
  const lineIds = query.get('lines')?.split(',').filter(Boolean);

  useEffect(() => {
    totalXp().then((x) => (xpBefore.current = x));
  }, []);

  const ready = song && (song.lang !== 'ja' || data.analysis.status === 'ready');
  useEffect(() => {
    if (!song || !ready || steps) return;
    setSteps(
      buildSongPractice({
        song,
        course: getCourse(song.lang),
        words: data.words,
        tokens: data.tokens,
        audio: audioMode,
        seed: Date.now(),
        learnerRank: data.learnerRank,
        lineIds,
      }),
    );
  }, [song, ready, steps, data.words, data.tokens, data.learnerRank, audioMode, lineIds]);

  const { hostRef, controller, problem, retry } = useYouTubePlayer(audioMode === 'video' && song ? song.videoId : null);
  const controllerRef = useRef(controller);
  useEffect(() => {
    controllerRef.current = controller;
  });

  // Exercises "speak" a lyric line: play that line in the video instead of a synthetic voice.
  const override = useMemo<SpeechOverride | null>(() => {
    if (!song || audioMode !== 'video') return null;
    const byText = new Map(song.lines.map((l, i) => [norm(l.text), i]));
    return {
      handles: (text) => {
        const i = byText.get(norm(text));
        return i !== undefined && song.lines[i].start !== undefined && controllerRef.current.ready && !problem;
      },
      play: (text, speed) => {
        const i = byText.get(norm(text))!;
        const line = song.lines[i];
        const end = lineEnd(song.lines, i);
        return controllerRef.current.playSegment(line.start! + song.delay, end !== undefined ? end + song.delay + 0.15 : undefined, speed === 'slow' ? 0.75 : undefined);
      },
    };
  }, [song, audioMode, problem]);

  const onFinish = useCallback(
    async (outcomes: SessionOutcomes, seconds: number): Promise<SummaryData> => {
      if (!song) throw new Error('song missing');
      const res = await recordMusicSession(song, outcomes, sessionId);
      const rewards = await claimRewards(settings);
      const achievements = await refreshAchievements();
      const after = await totalXp();
      const before = levelForXp(xpBefore.current ?? after - res.xp);
      const now = levelForXp(after);
      return {
        accuracy: outcomes.graded ? outcomes.correct / outcomes.graded : 1,
        xp: res.xp + rewards.reduce((n, r) => n + r.xp, 0),
        newItems: res.newWords,
        reviewed: res.reviewed,
        seconds,
        rewards,
        achievements,
        levelUp: now.level > before.level ? { level: now.level, titleIndex: now.titleIndex } : undefined,
        coins: sessionCoinLines(res.coins, rewards, achievements),
        coinNote: !res.coins.length && outcomes.correct >= 5 ? t('music.practice.noFreshCoins') : undefined,
        title: t('music.practice.done'),
        newLabel: t('music.practice.newWords'),
        exitLabel: t('music.practice.backToSong'),
      };
    },
    [song, sessionId, settings],
  );

  if (song === undefined || (song && !steps)) {
    return (
      <div className="page">
        <p className="muted">{song?.lang === 'ja' && data.analysis.status === 'loading' ? t('music.analysis.loading') : t('common.loading')}</p>
        {song?.lang === 'ja' && data.analysis.status === 'error' && <p className="banner banner--warn">{t(`music.analysis.error.${data.analysis.code}`)}</p>}
      </div>
    );
  }
  if (!song || !steps?.length) {
    return (
      <div className="page">
        <PageHeader title={t('music.practice.title')} back fallback={song ? `/music/song/${song.id}` : '/music'} />
        <EmptyState
          icon={<ListMusic size={40} />}
          title={t('music.practice.empty')}
          body={t('music.practice.emptyBody')}
          action={
            <button type="button" className="btn btn--primary" onClick={() => navigate(song ? `/music/song/${song.id}` : '/music', { replace: true })}>
              {t('music.practice.backToSong')}
            </button>
          }
        />
      </div>
    );
  }

  const stage =
    audioMode === 'video' && song.videoId ? (
      <div className="music-practice__video">
        <VideoFrame videoId={song.videoId} hostRef={hostRef} problem={problem} onRetry={retry} compact />
        <p className="subtle">{t('music.practice.videoNote')}</p>
      </div>
    ) : audioMode === 'tts' ? (
      <p className="subtle music-practice__tts">{t('music.practice.ttsNote')}</p>
    ) : undefined;

  return (
    <SpeechOverrideContext.Provider value={override}>
      <SessionPlayer
        courseId={song.lang}
        steps={steps}
        mode="review"
        showRomaji={showRomaji}
        stage={stage}
        onFinish={onFinish}
        onExit={() => navigate(`/music/song/${song.id}`, { replace: true })}
      />
    </SpeechOverrideContext.Provider>
  );
}
