/**
 * Diagnostics for the developer dashboard: recent errors (kept in memory, secrets redacted)
 * and a snapshot of the app's environment and data. Never includes access tokens.
 */
import { appVersion, buildTarget, platform } from './platform';
import { TABLES, type PolyglotDB } from './db';
import { storagePersisted } from './storage';

/** Removes anything that looks like a credential before a message is kept or shown. */
export function redact(text: string): string {
  return text
    .replace(/ya29\.[\w.-]+/g, 'ya29.[redacted]')
    .replace(/(Bearer\s+)[\w.~+/-]+=*/gi, '$1[redacted]')
    .replace(/((?:access_token|id_token|refresh_token|token)["']?\s*[=:]\s*["']?)[\w.~+/-]+/gi, '$1[redacted]');
}

export interface LogEvent {
  at: number;
  level: 'error' | 'warn';
  message: string;
}

const MAX_EVENTS = 100;
const events: LogEvent[] = [];
let installed = false;

function push(level: LogEvent['level'], parts: unknown[]) {
  const message = redact(parts.map((p) => (p instanceof Error ? `${p.name}: ${p.message}` : typeof p === 'string' ? p : safeJson(p))).join(' ')).slice(0, 500);
  events.unshift({ at: Date.now(), level, message });
  events.length = Math.min(events.length, MAX_EVENTS);
}

function safeJson(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/** Keeps the last errors and warnings for the dashboard (console output is unchanged). */
export function installErrorLog() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('error', (e) => push('error', [e.error ?? e.message]));
  window.addEventListener('unhandledrejection', (e) => push('error', ['Unhandled rejection:', e.reason]));
  for (const level of ['error', 'warn'] as const) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      push(level, args);
      original(...args);
    };
  }
}

export function recentEvents(): LogEvent[] {
  return [...events];
}

export interface Diagnostics {
  version: string;
  build: string;
  platform: string;
  userAgent: string;
  online: boolean;
  serviceWorker: 'active' | 'none' | 'unsupported';
  storage: { usage?: number; quota?: number; persisted: boolean | null };
  database: { name: string; version: number; rows: Record<string, number> };
}

export async function collectDiagnostics(database: PolyglotDB): Promise<Diagnostics> {
  const rows: Record<string, number> = {};
  for (const t of TABLES) rows[t] = await database.table(t).count();
  let estimate: StorageEstimate = {};
  try {
    estimate = (await navigator.storage?.estimate?.()) ?? {};
  } catch {
    // Not available.
  }
  return {
    version: appVersion,
    build: buildTarget,
    platform: platform(),
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    serviceWorker: !('serviceWorker' in navigator) ? 'unsupported' : navigator.serviceWorker.controller ? 'active' : 'none',
    storage: { usage: estimate.usage, quota: estimate.quota, persisted: await storagePersisted() },
    database: { name: database.name, version: database.verno, rows },
  };
}
