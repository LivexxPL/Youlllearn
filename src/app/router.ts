/**
 * Minimal hash router. Hash URLs work identically in the browser, as an
 * installed PWA, on static hosting and inside the Capacitor WebView, without
 * server rewrites.
 */
import { useEffect, useSyncExternalStore } from 'react';

export interface Route {
  path: string;
  segments: string[];
  query: URLSearchParams;
}

function parse(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return {
    path,
    segments: path.split('/').filter(Boolean).map(decodeURIComponent),
    query: new URLSearchParams(queryPart),
  };
}

let currentHash = typeof window !== 'undefined' ? window.location.hash : '';
let currentRoute = parse(currentHash);
/** Number of in-app navigations that can be undone with history.back(). */
let depth = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    currentHash = window.location.hash;
    currentRoute = parse(currentHash);
    emit();
  });
  window.addEventListener('popstate', () => {
    depth = Math.max(0, depth - 1);
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, () => currentRoute);
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const hash = `#${to}`;
  if (hash === window.location.hash) return;
  if (opts.replace) {
    window.location.replace(hash);
  } else {
    depth += 1;
    window.location.hash = to;
  }
  window.scrollTo({ top: 0 });
}

export function canGoBack(): boolean {
  return depth > 0;
}

export function goBack(fallback = '/') {
  if (depth > 0) {
    window.history.back();
  } else {
    navigate(fallback, { replace: true });
  }
}

// ---------------------------------------------------------------------------
// Back handlers (Android back button / Escape): the most recently registered
// active handler runs first, e.g. closing a sheet before leaving a screen.

type BackHandler = () => boolean;
const backHandlers: BackHandler[] = [];

export function useBackHandler(handler: BackHandler, active = true) {
  useEffect(() => {
    if (!active) return;
    backHandlers.push(handler);
    return () => {
      const i = backHandlers.lastIndexOf(handler);
      if (i >= 0) backHandlers.splice(i, 1);
    };
  }, [handler, active]);
}

/** Returns true when a registered handler consumed the event. */
export function runBackHandlers(): boolean {
  for (let i = backHandlers.length - 1; i >= 0; i--) {
    if (backHandlers[i]()) return true;
  }
  return false;
}

export function currentPath(): string {
  return currentRoute.path;
}
