/**
 * Main-thread side of the Japanese analysis: one worker at a time, stopped after a while
 * without requests to give its memory back (the dictionary takes about 100 MB).
 */
import { brand } from '../../config/brand';
import { buildTarget } from '../../services/platform';
import type { AnalysisErrorCode, AnalysisRequest, AnalysisResponse } from './analysis.worker';
import type { JaToken } from './tokens';

export class AnalysisError extends Error {
  constructor(
    public code: AnalysisErrorCode,
    message: string,
  ) {
    super(message);
  }
}

const IDLE_MS = 90_000;

let worker: Worker | null = null;
let idle: ReturnType<typeof setTimeout> | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (t: JaToken[][]) => void; reject: (e: Error) => void; onProgress?: (loaded: number, total: number) => void }>();

/**
 * Where the dictionary files are. The web app serves them next to itself; the Android app does
 * not ship them (17 MB) and downloads them once from the web app, then keeps them offline.
 */
export function dictionaryUrl(): string {
  if (buildTarget === 'native') return new URL('kuromoji/', brand.links.web).href;
  return new URL('kuromoji/', document.baseURI).href;
}

function stopWorker() {
  worker?.terminate();
  worker = null;
  for (const p of pending.values()) p.reject(new AnalysisError('failed', 'stopped'));
  pending.clear();
}

function getWorker(): Worker {
  if (worker) return worker;
  const w = new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' });
  w.onmessage = (e: MessageEvent<AnalysisResponse>) => {
    const msg = e.data;
    const p = pending.get(msg.id);
    if (!p) return;
    if (msg.type === 'progress') {
      p.onProgress?.(msg.loaded, msg.total);
      return;
    }
    pending.delete(msg.id);
    if (msg.type === 'result') p.resolve(msg.tokens);
    else p.reject(new AnalysisError(msg.code, msg.message));
    scheduleIdle();
  };
  w.onerror = (e) => {
    e.preventDefault();
    const err = new AnalysisError('failed', e.message || 'worker error');
    for (const p of pending.values()) p.reject(err);
    pending.clear();
    worker?.terminate();
    worker = null;
  };
  worker = w;
  return w;
}

function scheduleIdle() {
  if (idle) clearTimeout(idle);
  idle = setTimeout(() => {
    if (!pending.size) stopWorker();
  }, IDLE_MS);
}

export function analysisSupported(): boolean {
  return typeof Worker !== 'undefined' && typeof DecompressionStream !== 'undefined';
}

/** Tokens for each line. Rejects with AnalysisError (network, unsupported, failed). */
export function analyzeJapanese(lines: string[], onProgress?: (loaded: number, total: number) => void): Promise<JaToken[][]> {
  if (!analysisSupported()) return Promise.reject(new AnalysisError('unsupported', 'Worker or DecompressionStream missing'));
  if (idle) clearTimeout(idle);
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    getWorker().postMessage({ id, lines, dictUrl: dictionaryUrl() } satisfies AnalysisRequest);
  });
}
