/**
 * Optional AI assistant for Music Lab: natural and literal Polish translations of lyric lines,
 * short notes on idioms and grammar, and meanings of the song's words — from Claude through
 * Anthropic's official SDK, with the learner's own API key ("bring your own key").
 *
 * - Costs are paid by the key's owner (prices per million tokens below); the app shows an
 *   estimate before every request and the real usage afterwards.
 * - The key is stored on this device only (device-only meta, never synchronised or exported)
 *   and sent only to api.anthropic.com. The browser call is made with the SDK's
 *   `dangerouslyAllowBrowser` option, which is meant for exactly this case: the user's own key
 *   in the user's own browser.
 * - Everything the model returns is labelled "AI" in the app and can be edited; the model is
 *   told to translate only the given lines and never to add or complete lyrics.
 * - Without a key Music Lab works fully: course dictionary, rule-based grammar, own translations.
 */
import type { CourseId } from '../content/types';
import type { LyricLine, Song } from './types';

export const AI_MODELS = [
  { id: 'claude-opus-5-5', name: 'Claude Opus 5.5', inputPerM: 4, outputPerM: 20, fallback: true },
  { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', inputPerM: 2, outputPerM: 10, fallback: true },
  { id: 'claude-haiku-5-5', name: 'Claude Haiku 5.5', inputPerM: 0.1, outputPerM: 0.5, fallback: false },
] as const;

export type AiModelId = (typeof AI_MODELS)[number]['id'];
export const DEFAULT_AI_MODEL: AiModelId = 'claude-opus-5-5';

/** Device-only meta key (see isDeviceMeta in services/db.ts). */
export const AI_META_KEY = 'ai';

export interface AiConfig {
  apiKey: string;
  model: AiModelId;
}

export function modelInfo(id: string) {
  return AI_MODELS.find((m) => m.id === id) ?? AI_MODELS[0];
}

/** Anthropic API keys start with "sk-ant-"; a quick check against pasting the wrong thing. */
export function looksLikeApiKey(key: string): boolean {
  return /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(key.trim());
}

export function maskKey(key: string): string {
  const k = key.trim();
  return k.length > 12 ? `${k.slice(0, 7)}…${k.slice(-4)}` : '…';
}

/** Lines and words sent in one request (keeps the answer within one response). */
export const AI_LIMITS = { lines: 120, words: 150, maxTokens: 20_000 } as const;

const LANG_NAMES: Record<CourseId, string> = { es: 'Spanish', de: 'German', ja: 'Japanese' };

export interface AiWord {
  key: string;
  lemma: string;
  reading?: string;
}

export interface AiLine {
  id: string;
  translation: string;
  literal: string;
  note: string;
  uncertain: boolean;
}

export interface AiOutput {
  lines: AiLine[];
  words: { key: string; meaning: string }[];
}

export const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    lines: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          translation: { type: 'string' },
          literal: { type: 'string' },
          note: { type: 'string' },
          uncertain: { type: 'boolean' },
        },
        required: ['id', 'translation', 'literal', 'note', 'uncertain'],
        additionalProperties: false,
      },
    },
    words: {
      type: 'array',
      items: {
        type: 'object',
        properties: { key: { type: 'string' }, meaning: { type: 'string' } },
        required: ['key', 'meaning'],
        additionalProperties: false,
      },
    },
  },
  required: ['lines', 'words'],
  additionalProperties: false,
} as const;

export function systemPrompt(lang: CourseId): string {
  return [
    `You help a Polish speaker learn ${LANG_NAMES[lang]} from song lyrics that the learner provided.`,
    'For every lyric line (identified by its id) return:',
    '- translation: a natural Polish translation of the line, as it is meant in this song;',
    '- literal: a word-for-word Polish rendering that shows how the original is built;',
    '- note: one or two short Polish sentences about idioms, slang, wordplay, grammar, cultural references or poetic forms in the line, or an empty string when there is nothing notable;',
    '- uncertain: true when the line is ambiguous, unclear, wordplay, or the lyrics may be misheard, so the learner treats the translation with caution.',
    'Then, for every listed word (dictionary form), give a short Polish meaning of one to four words, as the word is used in this song.',
    'Rules: translate only the lines given, in the same order; never add, complete or correct lyrics; never quote lyrics that were not given; write everything in Polish; keep notes brief and factual.',
    lang === 'ja' ? 'Japanese lines may use classical or poetic forms; mention them in the note.' : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function userMessage(song: Pick<Song, 'title' | 'artist' | 'lang'>, lines: readonly LyricLine[], words: readonly AiWord[]): string {
  const out = [`Song: ${song.title}${song.artist ? ` — ${song.artist}` : ''}`, `Language: ${LANG_NAMES[song.lang]}`, '', 'Lines:'];
  for (const l of lines) out.push(`${l.id}: ${l.text}`);
  out.push('', 'Words:');
  for (const w of words) out.push(`${w.key}${w.reading && w.reading !== w.key ? ` (${w.reading})` : ''}`);
  return out.join('\n');
}

/** Rough token counts for the cost estimate (Japanese ≈ 1 token per character). */
export function estimateTokens(lang: CourseId, lines: readonly LyricLine[], words: readonly AiWord[]): { input: number; output: number } {
  const chars = lines.reduce((n, l) => n + l.text.length + l.id.length + 2, 0) + words.reduce((n, w) => n + w.key.length + (w.reading?.length ?? 0) + 3, 0);
  const perChar = lang === 'ja' ? 1.1 : 0.32;
  const input = 650 + Math.ceil(chars * perChar);
  // Per line: translation, literal rendering, note and JSON; per word a short meaning;
  // plus reasoning tokens (billed as output) at medium effort.
  const output = Math.ceil((lines.length * 110 + words.length * 18) * 1.4) + 300;
  return { input, output };
}

export function estimateCost(model: AiModelId, tokens: { input: number; output: number }): number {
  const m = modelInfo(model);
  return (tokens.input * m.inputPerM + tokens.output * m.outputPerM) / 1_000_000;
}

export function formatUsd(amount: number): string {
  if (amount < 0.01) return '< 0,01 USD';
  return `${amount.toFixed(2).replace('.', ',')} USD`;
}

export type AiErrorCode = 'auth' | 'permission' | 'rate' | 'overloaded' | 'network' | 'refused' | 'truncated' | 'invalid' | 'server';

export class AiError extends Error {
  constructor(
    public code: AiErrorCode,
    message: string = code,
  ) {
    super(message);
  }
}

const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.trim().slice(0, n) : '');

/** Keeps only answers for lines and words that were asked about, with sane lengths. */
export function validateOutput(raw: unknown, lineIds: readonly string[], wordKeys: readonly string[]): AiOutput {
  if (!raw || typeof raw !== 'object') throw new AiError('invalid');
  const r = raw as { lines?: unknown; words?: unknown };
  if (!Array.isArray(r.lines) || !Array.isArray(r.words)) throw new AiError('invalid');
  const ids = new Set(lineIds);
  const keys = new Set(wordKeys);
  const seen = new Set<string>();
  const lines: AiLine[] = [];
  for (const l of r.lines as Record<string, unknown>[]) {
    const id = clip(l?.id, 20);
    if (!ids.has(id) || seen.has(id)) continue;
    const translation = clip(l.translation, 400);
    if (!translation) continue;
    seen.add(id);
    lines.push({ id, translation, literal: clip(l.literal, 400), note: clip(l.note, 500), uncertain: l.uncertain === true });
  }
  const words: { key: string; meaning: string }[] = [];
  for (const w of r.words as Record<string, unknown>[]) {
    const key = clip(w?.key, 60);
    const meaning = clip(w?.meaning, 80);
    if (keys.has(key) && meaning) words.push({ key, meaning });
  }
  if (!lines.length && !words.length) throw new AiError('invalid');
  return { lines, words };
}

/**
 * Puts the answers into the song: AI translations fill lines without the learner's own
 * translation (an earlier AI translation is replaced); literal renderings and notes are added
 * as AI notes; word meanings become the song's glosses.
 */
export function applyOutput(song: Song, out: AiOutput): Pick<Song, 'lines' | 'glosses'> {
  const byId = new Map(out.lines.map((l) => [l.id, l]));
  const lines = song.lines.map((line) => {
    const ai = byId.get(line.id);
    if (!ai) return line;
    const next: LyricLine = { ...line };
    const own = line.pl && line.plBy !== 'ai';
    if (!own) {
      next.pl = ai.translation;
      next.plBy = 'ai';
    }
    if (ai.literal) next.literal = ai.literal;
    else delete next.literal;
    if (ai.note) next.aiNote = ai.note;
    else delete next.aiNote;
    if (ai.uncertain) next.uncertain = true;
    else delete next.uncertain;
    return next;
  });
  const glosses = { ...(song.glosses ?? {}) };
  for (const w of out.words) glosses[w.key] = w.meaning;
  return { lines, glosses };
}

export interface AiRunResult {
  output: AiOutput;
  usage: { input: number; output: number };
  model: string;
}

/** What the SDK client must provide (a fake in tests). */
export interface AiClient {
  beta: {
    messages: {
      parse(params: Record<string, unknown>): Promise<{
        parsed_output?: unknown;
        stop_reason?: string | null;
        model: string;
        usage: { input_tokens: number; output_tokens: number };
      }>;
    };
  };
}

export function requestParams(config: AiConfig, song: Song, lines: readonly LyricLine[], words: readonly AiWord[], format: unknown): Record<string, unknown> {
  const info = modelInfo(config.model);
  const params: Record<string, unknown> = {
    model: info.id,
    max_tokens: AI_LIMITS.maxTokens,
    system: systemPrompt(song.lang),
    messages: [{ role: 'user', content: userMessage(song, lines, words) }],
    output_config: { effort: 'medium', format },
  };
  // A safety classifier can decline a benign request; the server then retries on the model
  // Anthropic recommends. Not available for Haiku.
  if (info.fallback) {
    params.fallbacks = 'default';
    params.betas = ['server-side-fallback-2026-07-01'];
  }
  return params;
}

function classify(e: unknown, sdk: typeof import('@anthropic-ai/sdk')): AiError {
  const A = sdk.default;
  if (e instanceof AiError) return e;
  if (e instanceof A.AuthenticationError) return new AiError('auth');
  if (e instanceof A.PermissionDeniedError) return new AiError('permission');
  if (e instanceof A.RateLimitError) return new AiError('rate');
  if (e instanceof A.APIConnectionError) return new AiError('network');
  if (e instanceof A.InternalServerError) {
    const code: AiErrorCode = (e as { status?: number }).status === 529 ? 'overloaded' : 'server';
    return new AiError(code);
  }
  if (e instanceof A.APIError) return new AiError('server', e.message);
  return new AiError('server', String(e));
}

/** Runs the request. The SDK is loaded only now, so the app does not carry it otherwise. */
export async function translateWithAi(config: AiConfig, song: Song, words: readonly AiWord[], client?: AiClient): Promise<AiRunResult> {
  const lines = song.lines.slice(0, AI_LIMITS.lines);
  const asked = words.slice(0, AI_LIMITS.words);
  const sdk = await import('@anthropic-ai/sdk');
  const { jsonSchemaOutputFormat } = await import('@anthropic-ai/sdk/helpers/json-schema');
  const api: AiClient = client ?? (new sdk.default({ apiKey: config.apiKey.trim(), dangerouslyAllowBrowser: true, maxRetries: 1 }) as unknown as AiClient);
  try {
    const res = await api.beta.messages.parse(requestParams(config, song, lines, asked, jsonSchemaOutputFormat(OUTPUT_SCHEMA)));
    if (res.stop_reason === 'refusal') throw new AiError('refused');
    if (res.stop_reason === 'max_tokens') throw new AiError('truncated');
    const output = validateOutput(
      res.parsed_output,
      lines.map((l) => l.id),
      asked.map((w) => w.key),
    );
    return { output, usage: { input: res.usage.input_tokens, output: res.usage.output_tokens }, model: res.model };
  } catch (e) {
    throw classify(e, sdk);
  }
}
