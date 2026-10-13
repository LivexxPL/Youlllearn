/**
 * Audio Quest sessions:
 * - handsfree  — timed listening playlist with Polish narration and pauses to repeat
 * - flashcards — hear, recall the meaning, reveal, rate yourself (updates SRS)
 * - story      — listening story with optional transcript/translation and questions
 * - listen / repeat / shadowing / dictation — exercise sessions in the shared player
 */
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { screenShortcutAllowed } from '../../app/keys';
import {
  BookHeadphones,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Flag,
  Headphones,
  Languages,
  Lock,
  MoonStar,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Turtle,
  Volume2,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import type { Course, CourseId, DialogueSpeaker, Story } from '../../content/types';
import { getCourse, allCourses } from '../../content/registry';
import { useSettings } from '../../state/settings';
import { useAudioStatus, useCards, useLessonProgress, useListeningStage, useShowRomaji } from '../../state/hooks';
import { audioPool, buildDictationSteps, buildListeningSteps, buildPlaylist, buildSpeakingSteps, poolEntries, type ListeningStage, type PlaylistEntry } from '../../engine/audioSession';
import { createRng, shuffle } from '../../engine/random';
import { XP, levelForXp } from '../../engine/gamification';
import type { Exercise } from '../../engine/exercises';
import type { SelfRating } from '../../engine/srs';
import { audio, wait, type Speed } from '../../services/audio';
import { activity } from '../../services/activity';
import { allowScreenOff, keepScreenOn } from '../../services/keepAwake';
import { addStats, applyOutcome, claimRewards, markDifficult, recordReviewSession, refreshAchievements, setFlag, totalXp, type ClaimedReward, type SessionOutcomes } from '../../services/progress';
import { db, setMeta, type LedgerEntry } from '../../services/db';
import { awardMarathon, awardPractice, awardStory } from '../../services/economy';
import { sessionCoinLines, type CoinLine } from '../economy/labels';
import { CoinRewardCard } from '../economy/CoinRewardCard';
import { newSessionId } from '../economy/session';
import { cue } from '../../services/feedback';
import { navigate, useBackHandler } from '../../app/router';
import { formatDuration, t } from '../../i18n';
import { brand } from '../../config/brand';
import { Banner, EmptyState, PageHeader, ProgressBar, StatTile } from '../../components/ui';
import { TargetText } from '../../components/TargetText';
import { SessionPlayer } from '../session/SessionPlayer';
import type { SummaryData } from '../session/SummaryStep';
import { useDialoguePlayer } from '../session/CardSteps';
import { OptionList } from '../session/ChoiceSteps';

type DrillMode = 'listen' | 'repeat' | 'shadowing' | 'dictation';
const DRILLS: DrillMode[] = ['listen', 'repeat', 'shadowing', 'dictation'];

export default function AudioSessionScreen({ mode, query }: { mode: string; query: URLSearchParams }) {
  if (mode === 'handsfree') return <HandsFree query={query} />;
  if (mode === 'flashcards') return <AudioFlashcards />;
  if (mode === 'story') return <StoryPlayer id={query.get('id') ?? ''} />;
  if ((DRILLS as string[]).includes(mode)) return <AudioDrill mode={mode as DrillMode} />;
  return (
    <div className="page">
      <PageHeader title={t('aq.title')} back fallback="/audio" />
      <EmptyState icon={<Headphones size={40} />} title={t('aq.title')} action={<BackToHub primary />} />
    </div>
  );
}

function BackToHub({ primary }: { primary?: boolean }) {
  return (
    <button type="button" className={`btn btn--lg btn--block ${primary ? 'btn--primary' : 'btn--outline'}`} onClick={() => navigate('/audio', { replace: true })} data-testid="aq-back">
      <Headphones size={20} /> {t('aq.backToHub')}
    </button>
  );
}

function NoMaterial({ courseId }: { courseId: CourseId }) {
  const course = getCourse(courseId);
  return (
    <div className="page">
      <PageHeader title={t('aq.title')} back fallback="/audio" />
      <EmptyState
        icon={<Headphones size={40} />}
        title={t('aq.title')}
        body={t('aq.noMaterial')}
        action={
          <button type="button" className="btn btn--primary" onClick={() => navigate(`/lesson/${course.lessons[0].id}`, { replace: true })}>
            {t('learn.start')}
          </button>
        }
      />
    </div>
  );
}

/** Awards rewards/achievements after an audio activity and reports a level-up and the coins. */
async function finishActivity(settings: Parameters<typeof claimRewards>[0], xpBefore: number, coinEntries: LedgerEntry[] = []) {
  const rewards = await claimRewards(settings);
  const achievements = await refreshAchievements();
  const after = await totalXp();
  const before = levelForXp(xpBefore);
  const now = levelForXp(after);
  return {
    rewards,
    achievements,
    coins: sessionCoinLines(coinEntries, rewards, achievements),
    levelUp: now.level > before.level ? { level: now.level, titleIndex: now.titleIndex } : undefined,
  };
}

function useXpBefore() {
  const ref = useRef<number | null>(null);
  useEffect(() => {
    totalXp().then((x) => (ref.current = x));
  }, []);
  return ref;
}

function RewardBanners({ rewards }: { rewards: ClaimedReward[] }) {
  return (
    <>
      {rewards.map((r, i) => (
        <div key={i} className="banner banner--warn">
          <Sparkles size={18} />
          <span>{r.kind === 'all-quests' ? t('quest.allDone', { xp: r.xp }) : `${t(r.titleKey as never, { count: r.target ?? 0 })} — ${t('quest.reward', { xp: r.xp })}`}</span>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Hands-free listening

type Phase = 'listen' | 'think' | 'meaning' | 'repeat';

interface MediaSessionLike {
  metadata: unknown;
  setActionHandler(action: string, handler: (() => void) | null): void;
}

function mediaSession(): MediaSessionLike | null {
  return typeof navigator !== 'undefined' && 'mediaSession' in navigator ? (navigator as unknown as { mediaSession: MediaSessionLike }).mediaSession : null;
}

/** Pause long enough to say the phrase aloud: ~0.9 s per word/kana chunk, 2–6 s. */
function repeatPauseMs(e: PlaylistEntry, courseId: CourseId): number {
  const units = courseId === 'ja' ? Math.ceil((e.reading ?? e.text).replace(/\s/g, '').length / 2.5) : e.text.split(/\s+/).length;
  return Math.max(2000, Math.min(6000, 1400 + units * 900));
}

function HandsFree({ query }: { query: URLSearchParams }) {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useCards(course.id);
  const autoStage = useListeningStage(course.id);
  const showRomaji = useShowRomaji();
  const plStatus = useAudioStatus('pl-PL');
  const targetStatus = useAudioStatus(course.speechLang);
  const minutes = Math.max(3, Math.min(30, Number(query.get('min')) || 10));
  const requestedStage = Number(query.get('stage'));
  const stage: ListeningStage = requestedStage === 1 || requestedStage === 2 || requestedStage === 3 ? requestedStage : autoStage;
  const lessonId = query.get('lesson') ?? undefined;
  const [pocket, setPocket] = useState(query.get('pocket') === '1');
  const [list, setList] = useState<PlaylistEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{ xp: number; seconds: number; rewards: ClaimedReward[]; coins: CoinLine[] } | null>(null);
  const [screenLock, setScreenLock] = useState<boolean | null>(null);
  const ctrl = useRef<AbortController | null>(null);
  const indexRef = useRef(0);
  const xpBefore = useXpBefore();
  const recorded = useRef(false);
  const narrate = settings.narrateTranslations && plStatus !== 'missing' && plStatus !== 'unsupported';
  const narrateRef = useRef(narrate);
  narrateRef.current = narrate;

  // Build the playlist once, when the learner's cards are available.
  useEffect(() => {
    if (list || !cards) return;
    const pool = audioPool(course, cards, Date.now(), lessonId);
    setList(buildPlaylist(pool, minutes, stage, createRng(Date.now())));
  }, [cards, list, course, lessonId, minutes, stage]);

  const stopLoop = useCallback(() => {
    ctrl.current?.abort();
    ctrl.current = null;
    audio.stop();
  }, []);

  const playEntry = useCallback(
    async (e: PlaylistEntry, signal: AbortSignal) => {
      const say = (speed: Speed) =>
        signal.aborted ? Promise.resolve() : audio.say(course.id, { text: e.text, tts: e.tts, reading: e.reading, kind: e.itemKind }, { speed, stage, accent: e.accent }).catch(() => wait(1200, signal));
      setPhase('listen');
      if (stage === 1) {
        await say('slow');
        await wait(700, signal);
        await say('normal');
      } else {
        await say(stage === 3 ? 'natural' : 'normal');
      }
      if (signal.aborted) return;
      setPhase('think');
      await wait(stage === 3 ? 1800 : 1300, signal);
      if (signal.aborted) return;
      setPhase('meaning');
      if (narrateRef.current) await audio.sayPolish(e.pl).catch(() => wait(1500, signal));
      else await wait(1800, signal);
      await wait(500, signal);
      if (signal.aborted) return;
      if (stage >= 2) {
        setPhase('listen');
        await say(stage === 3 ? 'natural' : 'normal');
      }
      if (signal.aborted) return;
      setPhase('repeat');
      await wait(repeatPauseMs(e, course.id), signal);
    },
    [course.id, stage],
  );

  const start = useCallback(
    async (from: number, times = 1) => {
      if (!list?.length) return;
      stopLoop();
      const c = new AbortController();
      ctrl.current = c;
      setRunning(true);
      activity.setListening(true);
      for (let i = from; i < list.length; i++) {
        indexRef.current = i;
        setIndex(i);
        const reps = i === from ? times : 1;
        for (let r = 0; r < reps; r++) {
          if (c.signal.aborted) return;
          setRound(reps > 1 ? r + 1 : 0);
          await playEntry(list[i], c.signal);
        }
        if (c.signal.aborted) return;
      }
      ctrl.current = null;
      setRunning(false);
      setRound(0);
      activity.setListening(false);
      setFinished(true);
    },
    [list, playEntry, stopLoop],
  );

  const pause = useCallback(() => {
    stopLoop();
    setRunning(false);
    setRound(0);
    activity.setListening(false);
  }, [stopLoop]);

  const toggle = useCallback(() => {
    if (running) pause();
    else start(indexRef.current);
  }, [running, pause, start]);

  const jump = useCallback(
    (delta: number) => {
      if (!list?.length) return;
      const next = Math.max(0, Math.min(list.length - 1, indexRef.current + delta));
      start(next);
    },
    [list, start],
  );

  const repeatHard = useCallback(() => {
    const e = list?.[indexRef.current];
    if (!e) return;
    markDifficult(e.refId).catch(() => {});
    setMarked((m) => new Set(m).add(e.refId));
    start(indexRef.current, 3);
  }, [list, start]);

  // Session lifetime: activity tracking, screen wake lock, background flag.
  useEffect(() => {
    activity.start('audio', course.id);
    document.body.dataset.backgroundAudio = '1';
    keepScreenOn().then(setScreenLock);
    return () => {
      ctrl.current?.abort();
      audio.stop();
      activity.stop();
      delete document.body.dataset.backgroundAudio;
      allowScreenOff();
    };
  }, [course.id]);

  // Auto-start once the playlist is ready.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!list?.length || autoStarted.current) return;
    // Marked when it fires: if `start` changes meanwhile, the re-run schedules it again.
    const id = setTimeout(() => {
      autoStarted.current = true;
      start(0);
    }, 400);
    return () => clearTimeout(id);
  }, [list, start]);

  // Media Session (lock-screen / headset controls) where the platform exposes it.
  const current = list?.[index];
  useEffect(() => {
    const ms = mediaSession();
    if (!ms) return;
    const MM = (window as unknown as { MediaMetadata?: new (init: { title: string; artist: string; album: string }) => unknown }).MediaMetadata;
    if (MM && current) ms.metadata = new MM({ title: current.text, artist: brand.appName, album: t('aq.handsFree') });
    const handlers: [string, () => void][] = [
      ['play', () => start(indexRef.current)],
      ['pause', pause],
      ['nexttrack', () => jump(1)],
      ['previoustrack', () => jump(-1)],
    ];
    for (const [a, h] of handlers) {
      try {
        ms.setActionHandler(a, h);
      } catch {
        /* unsupported action */
      }
    }
    return () => {
      for (const [a] of handlers) {
        try {
          ms.setActionHandler(a, null);
        } catch {
          /* ignore */
        }
      }
    };
  }, [current, start, pause, jump]);

  // Keyboard: Space pause/resume, arrows previous/next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished || !screenShortcutAllowed(e)) return;
      if (e.key === ' ') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowRight') jump(1);
      else if (e.key === 'ArrowLeft') jump(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, jump, finished]);

  // Record the session when the playlist ends.
  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    cue('complete');
    const seconds = activity.currentSessionSeconds;
    const xp = Math.floor(seconds / 60) * XP.listeningMinute;
    (async () => {
      await addStats({ audioSessions: 1, xp }, course.id);
      // Listening to the end earns a fixed daily reward, never coins per minute played.
      const coins = await awardMarathon();
      await setFlag('marathon');
      const extra = await finishActivity(settings, xpBefore.current ?? 0, coins);
      setResult({ xp: xp + extra.rewards.reduce((n, r) => n + r.xp, 0), seconds, rewards: extra.rewards, coins: extra.coins });
    })().catch((e) => {
      console.warn(e);
      setResult({ xp, seconds, rewards: [], coins: [] });
    });
  }, [finished, course.id, settings, xpBefore]);

  // Minutes listened before leaving early still earn listening XP.
  useEffect(
    () => () => {
      if (recorded.current) return;
      const xp = Math.floor(activity.currentSessionSeconds / 60) * XP.listeningMinute;
      if (xp > 0) addStats({ xp }, course.id).catch(() => {});
    },
    [course.id],
  );

  const backHandler = useCallback(() => {
    if (pocket) {
      setPocket(false);
      return true;
    }
    return false;
  }, [pocket]);
  useBackHandler(backHandler, pocket);

  const exit = () => {
    pause();
    navigate('/audio', { replace: true });
  };

  if (!list) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (list.length === 0) return <NoMaterial courseId={course.id} />;

  if (finished) {
    const unique = new Set(list.map((e) => e.refId)).size;
    return (
      <div className="page summary" data-testid="handsfree-done">
        <div className="summary__hero">
          <Headphones size={48} />
          <h1>{t('aq.sessionDone')}</h1>
          <p className="muted">{t('aq.handsFree')}</p>
        </div>
        <div className="grid-2">
          <StatTile icon={<Clock size={20} />} value={formatDuration(result?.seconds ?? activity.currentSessionSeconds)} label={t('aq.listenTime')} />
          <StatTile icon={<Volume2 size={20} />} value={unique} label={t('aq.itemsHeard')} />
          <StatTile icon={<Zap size={20} />} value={`+${result?.xp ?? 0}`} label={t('lesson.summaryXp')} />
          <StatTile icon={<Flag size={20} />} value={marked.size} label={t('aq.markedCount')} />
        </div>
        {result && <RewardBanners rewards={result.rewards} />}
        {result && <CoinRewardCard lines={result.coins} />}
        <div className="stack">
          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={() => {
              recorded.current = false;
              autoStarted.current = false;
              setFinished(false);
              setResult(null);
              setIndex(0);
              indexRef.current = 0;
              setMarked(new Set());
              activity.start('audio', course.id);
              setList(null);
            }}
          >
            <RotateCcw size={20} /> {t('aq.oneMore')}
          </button>
          <BackToHub />
        </div>
      </div>
    );
  }

  const e = list[index];
  const revealed = phase === 'meaning' || phase === 'repeat';
  const remaining = Math.max(0, Math.round(((list.length - index) * minutes * 60) / list.length));
  const phaseLabel = !running ? t('aq.paused') : phase === 'listen' ? t('aq.phaseListen') : phase === 'think' ? t('aq.think') : phase === 'meaning' ? t('aq.phaseMeaning') : t('aq.youRepeat');

  return (
    <div className="session hf" onPointerDown={() => activity.ping()}>
      <header className="session__bar">
        <button type="button" className="icon-btn" onClick={exit} aria-label={t('common.close')} data-testid="session-close">
          <X size={24} />
        </button>
        <div className="grow">
          <ProgressBar value={index} max={list.length} label={t('aq.position', { n: index + 1, total: list.length })} />
        </div>
        <span className="chip">{formatDuration(remaining)}</span>
      </header>

      <div className="page hf__body">
        <div className="row row--wrap hf__meta">
          <span className="chip chip--accent">{t(`aq.stage${stage}` as never)}</span>
          <span className="subtle">{t('aq.position', { n: index + 1, total: list.length })}</span>
          {round > 0 && <span className="chip">{t('aq.repeatRound', { n: round })}</span>}
        </div>

        {(targetStatus === 'missing' || targetStatus === 'unsupported') && (
          <Banner variant="warn">
            <strong>{t('audio.noVoice', { lang: course.name })}</strong> {t('audio.noVoiceHelp')}
          </Banner>
        )}

        <section className={`hf__card phase-${running ? phase : 'paused'}`} aria-live="polite">
          <p className="hf__phase">{phaseLabel}</p>
          <div className="hf__target">
            <TargetText text={e.text} courseId={course.id} romaji={e.romaji} showRomaji={showRomaji} reading={e.reading} />
          </div>
          <p className={`hf__meaning${revealed ? ' is-revealed' : ''}`} aria-hidden={!revealed}>
            {revealed ? e.pl : '···'}
          </p>
          {marked.has(e.refId) && <span className="chip chip--info">{t('aq.markedHard')}</span>}
        </section>

        {!narrate && <p className="subtle center">{t('aq.narrationOff')}</p>}

        <div className="hf__controls" role="group" aria-label={t('aq.handsFree')}>
          <button type="button" className="icon-btn icon-btn--lg" onClick={() => jump(-1)} disabled={index === 0} aria-label={t('common.previous')}>
            <SkipBack size={28} />
          </button>
          <button type="button" className="hf__play" onClick={toggle} aria-label={running ? t('common.pause') : t('aq.resume')} data-testid="hf-toggle">
            {running ? <Pause size={40} /> : <Play size={40} />}
          </button>
          <button type="button" className="icon-btn icon-btn--lg" onClick={() => jump(1)} aria-label={t('common.next')} data-testid="hf-next">
            <SkipForward size={28} />
          </button>
        </div>

        <div className="stack stack--s">
          <button type="button" className="btn btn--outline btn--block" onClick={repeatHard} data-testid="hf-hard">
            <Flag size={18} /> {t('aq.repeatHard')}
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setPocket(true)}>
            <MoonStar size={18} /> {t('aq.enterPocket')}
          </button>
        </div>

        {screenLock !== null && <p className="subtle center">{screenLock ? t('aq.screenOn') : t('aq.noWakeLock')}</p>}
      </div>

      {pocket && <PocketOverlay running={running} onToggle={toggle} onExit={() => setPocket(false)} />}
    </div>
  );
}

/** Black screen with one huge tap target: tap = pause/resume, long-press = leave pocket mode. */
function PocketOverlay({ running, onToggle, onExit }: { running: boolean; onToggle: () => void; onExit: () => void }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const down = (ev: ReactPointerEvent) => {
    ev.preventDefault();
    longPressed.current = false;
    timer.current = setTimeout(() => {
      longPressed.current = true;
      onExit();
    }, 800);
  };
  const up = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (!longPressed.current) onToggle();
  };
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => () => cancel(), []);
  return (
    <div
      className="pocket"
      role="button"
      tabIndex={0}
      aria-label={`${running ? t('common.pause') : t('aq.resume')}. ${t('aq.pocketExit')}`}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        } else if (e.key === 'Escape') onExit();
      }}
      data-testid="pocket"
    >
      <div className="pocket__icon">{running ? <Pause size={56} /> : <Play size={56} />}</div>
      <p>{t('aq.pocketTap')}</p>
      <p className="pocket__hint">{t('aq.pocketExit')}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audio flashcards (self-rated recall)

interface FlashCard {
  refId: string;
  entry: PlaylistEntry;
}

function AudioFlashcards() {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useCards(course.id);
  const showRomaji = useShowRomaji();
  const stage = useListeningStage(course.id);
  const [deck, setDeck] = useState<FlashCard[] | null>(null);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<SelfRating[]>([]);
  const [sessionId] = useState(newSessionId);
  const [result, setResult] = useState<{ xp: number; rewards: ClaimedReward[]; coins: CoinLine[] } | null>(null);
  const xpBefore = useXpBefore();
  const done = deck !== null && i >= deck.length && deck.length > 0;

  useEffect(() => {
    if (deck || !cards) return;
    // Due and weakest cards first (audioPool), then shuffled so items and sentences mix.
    const pool = audioPool(course, cards, Date.now(), undefined, 12);
    setDeck(shuffle(poolEntries(pool), createRng(Date.now())).map((entry) => ({ refId: entry.refId, entry })));
  }, [cards, deck, course]);

  useEffect(() => {
    activity.start('audio', course.id);
    return () => {
      activity.stop();
      audio.stop();
    };
  }, [course.id]);

  const card = deck?.[i];
  const play = useCallback(
    (speed: Speed = 'normal') => {
      if (!card) return;
      activity.ping();
      const e = card.entry;
      audio.say(course.id, { text: e.text, tts: e.tts, reading: e.reading, kind: e.itemKind }, { speed, stage, accent: e.accent }).catch(() => {});
    },
    [card, course.id, stage],
  );

  // Auto-play each new card.
  useEffect(() => {
    if (!card) return;
    const id = setTimeout(() => play('normal'), 300);
    return () => clearTimeout(id);
  }, [card, play]);

  const reveal = useCallback(() => {
    if (!card) return;
    activity.ping();
    setRevealed(true);
    if (settings.narrateTranslations) audio.sayPolish(card.entry.pl).catch(() => {});
  }, [card, settings.narrateTranslations]);

  const rate = useCallback(
    (r: SelfRating) => {
      if (!card) return;
      activity.ping();
      audio.stop();
      applyOutcome(course.id, card.refId, { correct: r !== 'again', skill: 'listening', selfRating: r }).catch(() => {});
      setRatings((list) => [...list, r]);
      setRevealed(false);
      setI((n) => n + 1);
    },
    [card, course.id],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card || !screenShortcutAllowed(e)) return;
      if (e.key === ' ') {
        e.preventDefault();
        play();
      } else if (e.key === 'Enter' && !revealed) reveal();
      else if (revealed && ['1', '2', '3', '4'].includes(e.key)) rate((['again', 'hard', 'good', 'easy'] as const)[Number(e.key) - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, revealed, play, reveal, rate]);

  // Record once the deck is finished.
  const recorded = useRef(false);
  useEffect(() => {
    if (!done || recorded.current) return;
    recorded.current = true;
    cue('complete');
    const good = ratings.filter((r) => r !== 'again').length;
    const xp = good * XP.correctRetry;
    (async () => {
      await addStats({ reviews: ratings.length, exercises: ratings.length, correct: good, audioSessions: 1, xp }, course.id);
      const coins = await awardPractice('audio', sessionId, (deck ?? []).slice(0, ratings.length).map((c) => c.refId));
      const extra = await finishActivity(settings, xpBefore.current ?? 0, coins);
      setResult({ xp: xp + extra.rewards.reduce((n, r) => n + r.xp, 0), rewards: extra.rewards, coins: extra.coins });
    })().catch(() => setResult({ xp, rewards: [], coins: [] }));
  }, [done, ratings, course.id, settings, xpBefore, deck, sessionId]);

  if (!deck) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (deck.length === 0) return <NoMaterial courseId={course.id} />;

  if (done) {
    const good = ratings.filter((r) => r !== 'again').length;
    return (
      <div className="page summary" data-testid="flashcards-done">
        <div className="summary__hero">
          <CheckCircle2 size={48} />
          <h1>{t('aq.sessionDone')}</h1>
          <p className="muted">{t('aq.flashcardsSummary', { good, total: ratings.length })}</p>
        </div>
        <div className="grid-2">
          <StatTile icon={<RotateCcw size={20} />} value={ratings.length} label={t('progress.reviews')} />
          <StatTile icon={<Zap size={20} />} value={`+${result?.xp ?? 0}`} label={t('lesson.summaryXp')} />
        </div>
        {result && <RewardBanners rewards={result.rewards} />}
        {result && <CoinRewardCard lines={result.coins} />}
        <BackToHub primary />
      </div>
    );
  }

  const e = card!.entry;
  return (
    <div className="session" onPointerDown={() => activity.ping()}>
      <header className="session__bar">
        <button type="button" className="icon-btn" onClick={() => navigate('/audio', { replace: true })} aria-label={t('common.close')} data-testid="session-close">
          <X size={24} />
        </button>
        <div className="grow">
          <ProgressBar value={i} max={deck.length} label={t('aq.position', { n: i + 1, total: deck.length })} />
        </div>
      </header>
      <div className="page session__body">
        <div className="step step--center">
          <p className="step__instruction">{revealed ? t('aq.rateRecall') : t('aq.think')}</p>
          <div className="audio-btns">
            <button type="button" className="audio-btn audio-btn--l" style={{ width: 96, height: 96 }} onClick={() => play('normal')} aria-label={t('common.play')} data-testid="fc-play">
              <Volume2 size={44} />
            </button>
            <button type="button" className="audio-btn audio-btn--slow" onClick={() => play('slow')} aria-label={t('common.slow')}>
              <Turtle size={22} />
            </button>
          </div>
          {revealed ? (
            <div className="flash-reveal">
              <div className="hf__target">
                <TargetText text={e.text} courseId={course.id} romaji={e.romaji} showRomaji={showRomaji} reading={e.reading} />
              </div>
              <p className="hf__meaning is-revealed">{e.pl}</p>
            </div>
          ) : (
            <p className="subtle">{t('ex.tapToHear')}</p>
          )}
        </div>
      </div>
      <div className="action-bar">
        <div className="action-bar__inner">
          {revealed ? (
            <div className="rating-grid" role="group" aria-label={t('aq.rateRecall')}>
              {(
                [
                  ['again', t('aq.rateAgain')],
                  ['hard', t('aq.rateHard')],
                  ['good', t('aq.rateGood')],
                  ['easy', t('aq.rateEasy')],
                ] as [SelfRating, string][]
              ).map(([r, label], k) => (
                <button key={r} type="button" className={`btn rating rating--${r}`} onClick={() => rate(r)} data-testid={`rate-${r}`}>
                  <span className="tile__key" aria-hidden="true">
                    {k + 1}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <button type="button" className="btn btn--primary btn--lg btn--block" onClick={reveal} data-testid="fc-reveal">
              <Eye size={20} /> {t('aq.reveal')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories

function findStory(id: string): { course: Course; story: Story } | null {
  for (const course of allCourses()) {
    const story = course.stories.find((s) => s.id === id);
    if (story) return { course, story };
  }
  return null;
}

function StoryPlayer({ id }: { id: string }) {
  const found = useMemo(() => findStory(id), [id]);
  if (!found) {
    return (
      <div className="page">
        <PageHeader title={t('aq.dialogues')} back fallback="/audio" />
        <EmptyState icon={<BookHeadphones size={40} />} title={t('aq.storyNotFound')} action={<BackToHub primary />} />
      </div>
    );
  }
  return <StoryView course={found.course} story={found.story} />;
}

function StoryView({ course, story }: { course: Course; story: Story }) {
  const { settings } = useSettings();
  const progress = useLessonProgress();
  const showRomaji = useShowRomaji();
  const [phase, setPhase] = useState<'listen' | 'questions' | 'done'>('listen');
  const [showText, setShowText] = useState(false);
  const [showPl, setShowPl] = useState(false);
  const [q, setQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<{ xp: number; rewards: ClaimedReward[]; coins: CoinLine[] } | null>(null);
  const xpBefore = useXpBefore();

  // Narration lines use voice A; named speakers alternate B/A so dialogue turns sound distinct.
  const { lines, speakers } = useMemo(() => {
    const names = [...new Set(story.lines.map((l) => l.speaker).filter((s): s is string => Boolean(s)))];
    const sp: Record<string, DialogueSpeaker> = { _n: { name: t('aq.narrator'), voice: 'a' } };
    names.forEach((n, k) => (sp[n] = { name: n, voice: k % 2 === 0 ? 'b' : 'a' }));
    return { lines: story.lines.map((l) => ({ ...l, speaker: l.speaker ?? '_n' })), speakers: sp };
  }, [story]);
  const player = useDialoguePlayer(course.id, { lines, speakers }, story.stage);
  const isPlaying = player.current >= 0;

  useEffect(() => {
    activity.start('audio', course.id);
    return () => activity.stop();
  }, [course.id]);

  const recorded = useRef(false);
  useEffect(() => {
    if (phase !== 'done' || recorded.current) return;
    recorded.current = true;
    cue('complete');
    const total = story.questions.length;
    const xp = correct * XP.correctFirstTry;
    (async () => {
      await addStats({ exercises: total, correct, audioSessions: 1, xp }, course.id);
      await setMeta(`story:${story.id}`, { correct, total, at: Date.now() });
      const coins = await awardStory(story.id, correct, total);
      const extra = await finishActivity(settings, xpBefore.current ?? 0, coins);
      setResult({ xp: xp + extra.rewards.reduce((n, r) => n + r.xp, 0), rewards: extra.rewards, coins: extra.coins });
    })().catch(() => setResult({ xp, rewards: [], coins: [] }));
  }, [phase, correct, story, course.id, settings, xpBefore]);

  if (!progress) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (!progress.has(story.afterLesson)) {
    const lesson = course.lessons[course.lessonIndex.get(story.afterLesson) ?? 0];
    return (
      <div className="page">
        <PageHeader title={story.title} back fallback="/audio" />
        <EmptyState icon={<Lock size={40} />} title={story.title} body={t('aq.locked', { lesson: lesson.title })} action={<BackToHub primary />} />
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="page summary" data-testid="story-done">
        <div className="summary__hero">
          <BookHeadphones size={48} />
          <h1>{story.title}</h1>
          <p className="muted">{t('aq.storyScore', { correct, total: story.questions.length })}</p>
        </div>
        <div className="grid-2">
          <StatTile icon={<CheckCircle2 size={20} />} value={`${correct}/${story.questions.length}`} label={t('aq.storyQuestions')} />
          <StatTile icon={<Zap size={20} />} value={`+${result?.xp ?? 0}`} label={t('lesson.summaryXp')} />
        </div>
        {result && <RewardBanners rewards={result.rewards} />}
        {result && <CoinRewardCard lines={result.coins} />}
        <BackToHub primary />
      </div>
    );
  }

  if (phase === 'questions') {
    const question = story.questions[q];
    const isRight = selected === question.answer;
    return (
      <div className="session">
        <header className="session__bar">
          <button type="button" className="icon-btn" onClick={() => navigate('/audio', { replace: true })} aria-label={t('common.close')}>
            <X size={24} />
          </button>
          <div className="grow">
            <ProgressBar value={q} max={story.questions.length} label={t('aq.storyQuestions')} />
          </div>
        </header>
        <div className="page session__body">
          <div className="step">
            <p className="step__instruction">
              <Headphones size={18} style={{ verticalAlign: '-3px' }} /> {t('aq.storyQuestions')} · {t('aq.position', { n: q + 1, total: story.questions.length })}
            </p>
            <div className="prompt">
              <div className="prompt__text prompt__text--pl">{question.prompt}</div>
              <button type="button" className="btn btn--sm btn--outline" onClick={() => (isPlaying ? player.stop() : player.playFrom(0))}>
                {isPlaying ? <Pause size={16} /> : <RotateCcw size={16} />} {isPlaying ? t('common.pause') : t('aq.listenAgain')}
              </button>
            </div>
            <OptionList
              options={question.options.map((o) => ({ label: o, lang: 'pl' as const }))}
              courseId={course.id}
              selected={selected}
              onSelect={setSelected}
              locked={checked}
              correct={question.answer}
            />
            {checked && (
              <div className={`banner ${isRight ? 'banner--success' : 'banner--warn'}`} role="status">
                {isRight ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <div>
                  <strong>{isRight ? t('aq.correct') : t('aq.incorrect')}</strong>
                  <p>{question.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="action-bar">
          <div className="action-bar__inner">
            {checked ? (
              <button
                type="button"
                className="btn btn--primary btn--lg btn--block"
                onClick={() => {
                  setChecked(false);
                  setSelected(null);
                  if (q + 1 >= story.questions.length) setPhase('done');
                  else setQ(q + 1);
                }}
                data-testid="story-next"
              >
                {t('common.continue')}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--primary btn--lg btn--block"
                disabled={selected === null}
                onClick={() => {
                  player.stop();
                  setChecked(true);
                  const ok = selected === question.answer;
                  if (ok) setCorrect((n) => n + 1);
                  cue(ok ? 'correct' : 'wrong');
                }}
                data-testid="check"
              >
                {t('common.check')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session">
      <header className="session__bar">
        <button type="button" className="icon-btn" onClick={() => navigate('/audio', { replace: true })} aria-label={t('common.close')} data-testid="session-close">
          <X size={24} />
        </button>
        <div className="grow">
          <p className="session__title">{story.title}</p>
        </div>
        <span className="chip">{t(`aq.stage${story.stage}` as never)}</span>
      </header>
      <div className="page session__body">
        <div className="step">
          <p className="muted">{story.context}</p>
          <p className="subtle">{t('aq.storyListenFirst')}</p>
          <div className="row row--wrap">
            <button type="button" className="btn btn--primary" onClick={() => (isPlaying ? player.stop() : player.playFrom(0))} data-testid="story-play">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />} {isPlaying ? t('common.pause') : t('lesson.dialoguePlayAll')}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setShowText((v) => !v)} aria-pressed={showText}>
              {showText ? <EyeOff size={18} /> : <Eye size={18} />} {showText ? t('common.hideTranscript') : t('common.showTranscript')}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setShowPl((v) => !v)} aria-pressed={showPl}>
              <Languages size={18} /> {showPl ? t('aq.hideTranslation') : t('aq.showTranslation')}
            </button>
          </div>
          <ul className="dialogue">
            {lines.map((line, k) => {
              const sp = speakers[line.speaker];
              const narration = line.speaker === '_n';
              return (
                <li key={k} className={`dialogue__line dialogue__line--${sp.voice}${narration ? ' dialogue__line--narration' : ''}${player.current === k ? ' is-current' : ''}`}>
                  {!narration && <div className="dialogue__speaker">{sp.name}</div>}
                  <button type="button" className={`dialogue__bubble${showText || showPl ? '' : ' dialogue__bubble--hidden'}`} onClick={() => player.playFrom(k)} aria-label={showText ? undefined : `${sp.name}: ${t('common.play')}`}>
                    {showText && <TargetText text={line.text} courseId={course.id} romaji={line.romaji} showRomaji={showRomaji} />}
                    {showPl && <span className="dialogue__pl">{line.pl}</span>}
                    {!showText && !showPl && (
                      <span className="dialogue__wave" aria-hidden="true">
                        ▮▮▮▮▮▮
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="action-bar">
        <div className="action-bar__inner">
          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={() => {
              player.stop();
              setPhase(story.questions.length ? 'questions' : 'done');
            }}
            data-testid="story-questions"
          >
            {t('aq.storyToQuestions')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise-based audio drills (shared session player)

function AudioDrill({ mode }: { mode: DrillMode }) {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useCards(course.id);
  const showRomaji = useShowRomaji();
  const [steps, setSteps] = useState<Exercise[] | null>(null);
  const xpBefore = useXpBefore();

  useEffect(() => {
    if (!cards || steps) return;
    const now = Date.now();
    const seed = now;
    const built =
      mode === 'listen'
        ? buildListeningSteps(course, cards, now, seed)
        : mode === 'dictation'
          ? buildDictationSteps(course, cards, now, seed)
          : buildSpeakingSteps(course, cards, now, seed, mode === 'shadowing' ? 'shadow' : 'repeat');
    setSteps(built);
  }, [cards, steps, course, mode]);

  const [sessionId] = useState(newSessionId);
  const onFinish = useCallback(
    async (outcomes: SessionOutcomes, seconds: number): Promise<SummaryData> => {
      const res = await recordReviewSession(course, outcomes, Date.now(), db, { family: 'audio', sessionId });
      await addStats({ audioSessions: 1 }, course.id);
      const extra = await finishActivity(settings, xpBefore.current ?? 0, res.coins);
      return {
        accuracy: outcomes.graded ? outcomes.correct / outcomes.graded : 1,
        xp: res.xp + extra.rewards.reduce((n, r) => n + r.xp, 0),
        newItems: 0,
        reviewed: res.reviewed,
        seconds,
        rewards: extra.rewards,
        achievements: extra.achievements,
        levelUp: extra.levelUp,
        coins: extra.coins,
        coinNote: !res.coins.length && res.reviewed >= 5 ? t('coins.noFresh') : undefined,
      };
    },
    [course, settings, xpBefore, sessionId],
  );

  if (!steps) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (steps.length === 0) return <NoMaterial courseId={course.id} />;

  return <SessionPlayer courseId={course.id} steps={steps} mode="review" showRomaji={showRomaji} onFinish={onFinish} onExit={() => navigate('/audio', { replace: true })} />;
}
