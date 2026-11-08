/**
 * The embedded YouTube player and a small controller for it (seek, speed, playing one lyric
 * line). The player stays visible whenever it plays, as YouTube's terms require; listening
 * exercises play the line in this visible player, never in a hidden one.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, RotateCcw, WifiOff } from 'lucide-react';
import { loadYouTubeApi, YouTubeLoadError, YT_STATE, type YTPlayer } from './youtubeApi';
import { playerErrorKind, watchUrl, type PlayerErrorKind } from '../../music/youtube';
import { t, type MessageKey } from '../../i18n';

export type PlayerProblem = PlayerErrorKind | 'offline' | 'blocked';

export interface PlayerController {
  ready: boolean;
  playing: boolean;
  rate: number;
  rates: number[];
  time(): number;
  play(): void;
  pause(): void;
  seek(seconds: number, play?: boolean): void;
  setRate(rate: number): void;
  /** Plays from `from` until `to` (or until paused), then resolves. */
  playSegment(from: number, to?: number, rate?: number): Promise<void>;
}

const PROBLEM_KEYS: Record<PlayerProblem, MessageKey> = {
  offline: 'music.player.offline',
  blocked: 'music.player.blocked',
  badRequest: 'music.player.badRequest',
  html5: 'music.player.html5',
  notFound: 'music.player.notFound',
  notEmbeddable: 'music.player.notEmbeddable',
  noReferrer: 'music.player.noReferrer',
  unknown: 'music.player.unknown',
};

export function useYouTubePlayer(videoId: string | null, opts: { start?: number; onTime?: (seconds: number) => void } = {}) {
  // A callback ref: the container may appear after the hook (e.g. once a session is built).
  const [host, hostRef] = useState<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [problem, setProblem] = useState<{ kind: PlayerProblem; code?: number } | null>(null);
  const [rate, setRateState] = useState(1);
  const [rates, setRates] = useState<number[]>([1]);
  const [attempt, setAttempt] = useState(0);
  const onTime = useRef(opts.onTime);
  const start = useRef(opts.start ?? 0);
  const segment = useRef<{ end?: number; resolve: () => void; restoreRate?: number } | null>(null);
  useEffect(() => {
    onTime.current = opts.onTime;
  });

  const finishSegment = useCallback(() => {
    const seg = segment.current;
    if (!seg) return;
    segment.current = null;
    if (seg.restoreRate !== undefined) playerRef.current?.setPlaybackRate(seg.restoreRate);
    seg.resolve();
  }, []);

  useEffect(() => {
    if (!videoId || !host) return;
    let cancelled = false;
    let player: YTPlayer | null = null;
    setReady(false);
    setProblem(null);
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        const el = document.createElement('div');
        host.replaceChildren(el);
        const playerVars: Record<string, string | number> = { playsinline: 1, rel: 0, start: Math.floor(start.current) };
        // Recommended with the JavaScript API: only this origin may control the player.
        if (/^https?:/.test(window.location.origin)) playerVars.origin = window.location.origin;
        player = new YT.Player(el, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars,
          events: {
            onReady: () => {
              if (cancelled || !player) return;
              playerRef.current = player;
              setReady(true);
              const available = player.getAvailablePlaybackRates?.() ?? [1];
              setRates(available.length ? available : [1]);
            },
            onStateChange: (e) => {
              if (cancelled) return;
              setPlaying(e.data === YT_STATE.playing || e.data === YT_STATE.buffering);
              if (e.data === YT_STATE.paused || e.data === YT_STATE.ended) finishSegment();
            },
            onError: (e) => {
              if (cancelled) return;
              setProblem({ kind: playerErrorKind(e.data), code: e.data });
              finishSegment();
            },
            onPlaybackRateChange: (e) => setRateState(e.data),
          },
        });
      })
      .catch((e: unknown) => {
        if (!cancelled) setProblem({ kind: e instanceof YouTubeLoadError ? e.reason : 'blocked' });
      });
    return () => {
      cancelled = true;
      finishSegment();
      playerRef.current = null;
      try {
        player?.destroy();
      } catch {
        // The iframe may already be gone.
      }
      setReady(false);
      setPlaying(false);
    };
  }, [videoId, host, attempt, finishSegment]);

  // Time while playing (about 10 times a second), for the active line, loops and segments.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const now = p.getCurrentTime();
      onTime.current?.(now);
      const seg = segment.current;
      if (seg?.end !== undefined && now >= seg.end) {
        p.pauseVideo();
        finishSegment();
      }
    }, 100);
    return () => clearInterval(id);
  }, [playing, finishSegment]);

  const controller = useMemo<PlayerController>(
    () => ({
      ready,
      playing,
      rate,
      rates,
      time: () => playerRef.current?.getCurrentTime() ?? 0,
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      seek: (seconds, play) => {
        const p = playerRef.current;
        if (!p) return;
        p.seekTo(Math.max(0, seconds), true);
        onTime.current?.(Math.max(0, seconds));
        if (play) p.playVideo();
      },
      setRate: (r) => {
        playerRef.current?.setPlaybackRate(r);
        setRateState(r);
      },
      playSegment: (from, to, r) => {
        const p = playerRef.current;
        if (!p) return Promise.resolve();
        finishSegment();
        return new Promise<void>((resolve) => {
          const current = p.getPlaybackRate?.() ?? 1;
          segment.current = { end: to, resolve, restoreRate: r && r !== current ? current : undefined };
          if (r && r !== current) p.setPlaybackRate(r);
          p.seekTo(Math.max(0, from), true);
          p.playVideo();
        });
      },
    }),
    [ready, playing, rate, rates, finishSegment],
  );

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { hostRef, controller, problem, retry };
}

export function VideoFrame({
  videoId,
  hostRef,
  problem,
  onRetry,
  compact,
}: {
  videoId: string;
  hostRef: (el: HTMLDivElement | null) => void;
  problem: { kind: PlayerProblem; code?: number } | null;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`yt${compact ? ' yt--compact' : ''}`} data-testid="video-frame">
      <div className="yt__host" ref={hostRef} />
      {problem && (
        <div className="yt__problem" role="alert" data-testid="video-problem" data-kind={problem.kind}>
          {problem.kind === 'offline' && <WifiOff size={22} aria-hidden="true" />}
          <p>{t(PROBLEM_KEYS[problem.kind], { code: problem.code ?? '' })}</p>
          <div className="row row--wrap" style={{ justifyContent: 'center' }}>
            <a className="btn btn--sm btn--outline" href={watchUrl(videoId)} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} /> {t('music.player.openYouTube')}
            </a>
            {(problem.kind === 'offline' || problem.kind === 'blocked') && (
              <button type="button" className="btn btn--sm btn--ghost" onClick={onRetry}>
                <RotateCcw size={16} /> {t('common.retry')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
