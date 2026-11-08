/**
 * Loads YouTube's official IFrame Player API (https://www.youtube.com/iframe_api) once, when a
 * song with a video is opened. Only the documented player methods are used.
 */

/** The part of the IFrame Player API that Music Lab uses. */
export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];
  destroy(): void;
}

export interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number; target: YTPlayer }) => void;
    onError?: (e: { data: number }) => void;
    onPlaybackRateChange?: (e: { data: number }) => void;
  };
}

export interface YTNamespace {
  Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YT_STATE = { unstarted: -1, ended: 0, playing: 1, paused: 2, buffering: 3, cued: 5 } as const;

export const IFRAME_API_URL = 'https://www.youtube.com/iframe_api';
const LOAD_TIMEOUT_MS = 15_000;

let loading: Promise<YTNamespace> | null = null;

export class YouTubeLoadError extends Error {
  constructor(public reason: 'offline' | 'blocked') {
    super(`YouTube player could not load (${reason})`);
  }
}

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.reject(new YouTubeLoadError('offline'));
  loading = new Promise<YTNamespace>((resolve, reject) => {
    const timer = setTimeout(() => fail('blocked'), LOAD_TIMEOUT_MS);
    const previous = window.onYouTubeIframeAPIReady;
    function fail(reason: 'offline' | 'blocked') {
      clearTimeout(timer);
      loading = null;
      reject(new YouTubeLoadError(navigator.onLine === false ? 'offline' : reason));
    }
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else fail('blocked');
    };
    const script = document.createElement('script');
    script.src = IFRAME_API_URL;
    script.async = true;
    script.onerror = () => {
      script.remove();
      fail('blocked');
    };
    document.head.appendChild(script);
  });
  return loading;
}
