/**
 * YouTube links and player errors (Music Lab).
 *
 * Videos are played only through YouTube's official IFrame Player API
 * (https://developers.google.com/youtube/iframe_api_reference). Nothing here reads YouTube
 * pages, captions or other undocumented endpoints: the app only needs the video id.
 */

/** Video ids are 11 characters of the URL-safe base64 alphabet. */
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

export type ParsedVideo =
  | { ok: true; videoId: string; /** Start time from `t=` / `start=`, in seconds. */ start?: number }
  | { ok: false; reason: 'empty' | 'notYoutube' | 'playlist' | 'channel' | 'noVideo' };

export function isVideoId(s: string): boolean {
  return VIDEO_ID.test(s);
}

/** `90`, `90s`, `1m30s`, `1h2m3s` → seconds. */
export function parseStartParam(raw: string | null): number | undefined {
  if (!raw) return undefined;
  if (/^\d+$/.test(raw)) return Number(raw);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(raw);
  if (!m || (!m[1] && !m[2] && !m[3])) return undefined;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/**
 * Accepts the link forms people copy (watch, youtu.be, shorts, embed, live, music.youtube.com,
 * mobile) or a bare video id.
 */
export function parseYouTubeUrl(input: string): ParsedVideo {
  const raw = input.trim();
  if (!raw) return { ok: false, reason: 'empty' };
  if (isVideoId(raw)) return { ok: true, videoId: raw };

  let url: URL;
  try {
    url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: 'notYoutube' };
  }
  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return { ok: false, reason: 'notYoutube' };

  const start = parseStartParam(url.searchParams.get('t') ?? url.searchParams.get('start'));
  const found = (id: string | undefined | null): ParsedVideo | null =>
    id && isVideoId(id) ? { ok: true, videoId: id, ...(start !== undefined ? { start } : {}) } : null;

  const parts = url.pathname.split('/').filter(Boolean);
  if (host.endsWith('youtu.be')) return found(parts[0]) ?? { ok: false, reason: 'noVideo' };

  const v = found(url.searchParams.get('v'));
  if (v) return v;
  if (['shorts', 'embed', 'live', 'v', 'e'].includes(parts[0] ?? '')) return found(parts[1]) ?? { ok: false, reason: 'noVideo' };
  if (url.searchParams.has('list')) return { ok: false, reason: 'playlist' };
  if (parts[0]?.startsWith('@') || ['channel', 'c', 'user'].includes(parts[0] ?? '')) return { ok: false, reason: 'channel' };
  return { ok: false, reason: 'noVideo' };
}

export function watchUrl(videoId: string, start?: number): string {
  return `https://www.youtube.com/watch?v=${videoId}${start ? `&t=${Math.floor(start)}s` : ''}`;
}

/** YouTube's own search page (opened in a new tab; nothing is read from it). */
export function searchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/**
 * Error codes of the IFrame Player API's onError event. 101 and 150 are the same error
 * ("the owner does not allow embedding"); YouTube also uses them for some region and age
 * restrictions. 153: the embed request carried no referrer (seen in some app web views).
 */
export type PlayerErrorKind = 'badRequest' | 'html5' | 'notFound' | 'notEmbeddable' | 'noReferrer' | 'unknown';

export function playerErrorKind(code: number): PlayerErrorKind {
  switch (code) {
    case 2:
      return 'badRequest';
    case 5:
      return 'html5';
    case 100:
      return 'notFound';
    case 101:
    case 150:
      return 'notEmbeddable';
    case 153:
      return 'noReferrer';
    default:
      return 'unknown';
  }
}
