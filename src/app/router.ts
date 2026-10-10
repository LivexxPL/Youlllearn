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

/** A malformed escape (e.g. a truncated %E3) must not stop the app from starting. */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function parse(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return {
    path,
    segments: path.split('/').filter(Boolean).map(decodeSegment),
    query: new URLSearchParams(queryPart),
  };
}

/**
 * Number of in-app navigations that history.back() can undo. It is stored in each history
 * entry's state, so it stays right after going back, forward or reloading. (Counting
 * popstate events does not work: assigning location.hash fires popstate too.)
 */
function entryDepth(): number {
  const state = window.history.state as { pqDepth?: unknown } | null;
  return typeof state?.pqDepth === 'number' ? state.pqDepth : 0;
}

let currentHash = typeof window !== 'undefined' ? window.location.hash : '';
let currentRoute = parse(currentHash);
let depth = typeof window !== 'undefined' ? entryDepth() : 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

/** Reads the route and depth from the current history entry. */
function sync() {
  depth = entryDepth();
  if (window.location.hash === currentHash) return;
  currentHash = window.location.hash;
  currentRoute = parse(currentHash);
  emit();
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', sync);
  window.addEventListener('popstate', sync);
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
  // pushState/replaceState fire neither hashchange nor popstate, so sync() is called directly.
  if (opts.replace) window.history.replaceState({ pqDepth: depth }, '', hash);
  else window.history.pushState({ pqDepth: depth + 1 }, '', hash);
  sync();
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
