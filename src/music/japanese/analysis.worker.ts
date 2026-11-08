/// <reference lib="webworker" />
/**
 * Japanese morphological analysis off the main thread. The dictionary is downloaded once and
 * kept in the Cache API (works offline afterwards, in the browser and in the Android app);
 * the worker is stopped when idle so its ~100 MB are released (./analyzer.ts).
 */
import { buildTokenizer, DICT_TOTAL_BYTES, isGzip, type JapaneseTokenizer } from './dictionary';
import { fromIpadic, type JaToken } from './tokens';

export interface AnalysisRequest {
  id: number;
  lines: string[];
  dictUrl: string;
}

export type AnalysisErrorCode = 'network' | 'unsupported' | 'failed';

export type AnalysisResponse =
  | { id: number; type: 'progress'; loaded: number; total: number }
  | { id: number; type: 'result'; tokens: JaToken[][] }
  | { id: number; type: 'error'; code: AnalysisErrorCode; message: string };

const CACHE_NAME = 'pq-ja-dictionary-v1';
const scope = self as unknown as DedicatedWorkerGlobalScope;

let tokenizer: Promise<JapaneseTokenizer> | null = null;
let loaded = 0;
const listeners = new Set<number>();

class CodedError extends Error {
  constructor(
    public code: AnalysisErrorCode,
    message: string,
  ) {
    super(message);
  }
}

function report(bytes: number) {
  loaded = Math.min(DICT_TOTAL_BYTES, loaded + bytes);
  for (const id of listeners) scope.postMessage({ id, type: 'progress', loaded, total: DICT_TOTAL_BYTES } satisfies AnalysisResponse);
}

async function openCache(): Promise<Cache | null> {
  try {
    return typeof caches === 'undefined' ? null : await caches.open(CACHE_NAME);
  } catch {
    return null;
  }
}

async function readBody(res: Response): Promise<ArrayBuffer> {
  if (!res.body) {
    const buf = await res.arrayBuffer();
    report(buf.byteLength);
    return buf;
  }
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    size += value.byteLength;
    report(value.byteLength);
  }
  const out = new Uint8Array(size);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.byteLength;
  }
  return out.buffer;
}

async function gunzip(buf: ArrayBuffer): Promise<ArrayBuffer> {
  if (!isGzip(buf)) return buf;
  if (typeof DecompressionStream === 'undefined') throw new CodedError('unsupported', 'DecompressionStream is not available');
  const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).arrayBuffer();
}

async function loadFile(dictUrl: string, name: string): Promise<ArrayBuffer> {
  const url = new URL(name, dictUrl).href;
  const cache = await openCache();
  let res = await cache?.match(url);
  if (!res) {
    try {
      res = await fetch(url);
    } catch (e) {
      throw new CodedError('network', `Could not download ${name}: ${String(e)}`);
    }
    if (!res.ok) throw new CodedError('network', `Could not download ${name}: HTTP ${res.status}`);
    await cache?.put(url, res.clone()).catch(() => {});
  }
  return gunzip(await readBody(res));
}

scope.onmessage = async (e: MessageEvent<AnalysisRequest>) => {
  const { id, lines, dictUrl } = e.data;
  listeners.add(id);
  try {
    tokenizer ??= buildTokenizer((name) => loadFile(dictUrl, name));
    const tk = await tokenizer;
    const tokens = lines.map((line) => tk.tokenize(line).map(fromIpadic));
    scope.postMessage({ id, type: 'result', tokens } satisfies AnalysisResponse);
  } catch (err) {
    tokenizer = null;
    loaded = 0;
    const code = err instanceof CodedError ? err.code : 'failed';
    scope.postMessage({ id, type: 'error', code, message: String((err as Error)?.message ?? err) } satisfies AnalysisResponse);
  } finally {
    listeners.delete(id);
  }
};
