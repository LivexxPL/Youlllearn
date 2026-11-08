import { describe, expect, it } from 'vitest';
import {
  AI_LIMITS,
  AiError,
  applyOutput,
  estimateCost,
  estimateTokens,
  formatUsd,
  looksLikeApiKey,
  maskKey,
  requestParams,
  systemPrompt,
  translateWithAi,
  userMessage,
  validateOutput,
  type AiClient,
} from './ai';
import type { Song } from './types';
import { isDeviceMeta } from '../services/db';

const song: Song = {
  id: 'song-1',
  lang: 'es',
  title: 'Los pollitos dicen',
  artist: 'Tradycyjna',
  videoId: null,
  lines: [
    { id: 'l1', text: 'Los pollitos dicen', pl: 'Kurczaczki mówią', plBy: 'user' },
    { id: 'l2', text: 'pío, pío, pío' },
    { id: 'l3', text: 'cuando tienen hambre', pl: 'stare AI', plBy: 'ai', literal: 'old' },
  ],
  format: 'plain',
  delay: 0,
  favorite: false,
  progress: { lines: {}, sessions: 0 },
  createdAt: 0,
  updatedAt: 0,
};
const words = [{ key: 'pollitos', lemma: 'pollitos' }, { key: 'hambre', lemma: 'hambre' }];
const config = { apiKey: 'sk-ant-api03-abcdefghijklmnopqrstuvwxyz', model: 'claude-opus-5-5' as const };

describe('AI assistant (bring your own key)', () => {
  it('recognises and masks keys', () => {
    expect(looksLikeApiKey(config.apiKey)).toBe(true);
    expect(looksLikeApiKey('hello')).toBe(false);
    expect(maskKey(config.apiKey)).toBe('sk-ant-…wxyz');
  });

  it('keeps the key on this device only', () => {
    expect(isDeviceMeta('ai')).toBe(true);
  });

  it('asks only for the given lines and words, in Polish, without adding lyrics', () => {
    const sys = systemPrompt('es');
    expect(sys).toMatch(/never add, complete or correct lyrics/);
    expect(sys).toMatch(/Polish/);
    const msg = userMessage(song, song.lines, words);
    expect(msg).toContain('l2: pío, pío, pío');
    expect(msg).toContain('pollitos');
  });

  it('uses server-side fallbacks for Opus and Sonnet, not for Haiku', () => {
    const opus = requestParams(config, song, song.lines, words, 'FORMAT');
    expect(opus).toMatchObject({ model: 'claude-opus-5-5', fallbacks: 'default', betas: ['server-side-fallback-2026-07-01'], output_config: { effort: 'medium', format: 'FORMAT' } });
    expect(opus.max_tokens).toBe(AI_LIMITS.maxTokens);
    expect(opus).not.toHaveProperty('thinking');
    const haiku = requestParams({ ...config, model: 'claude-haiku-5-5' }, song, song.lines, words, 'FORMAT');
    expect(haiku).not.toHaveProperty('fallbacks');
    expect(haiku).not.toHaveProperty('betas');
  });

  it('estimates cost from the published prices', () => {
    const tokens = estimateTokens('es', song.lines, words);
    expect(tokens.input).toBeGreaterThan(600);
    expect(estimateCost('claude-opus-5-5', { input: 1_000_000, output: 1_000_000 })).toBe(24);
    expect(estimateCost('claude-sonnet-5-5', { input: 1_000_000, output: 1_000_000 })).toBe(12);
    expect(estimateCost('claude-haiku-5-5', { input: 1_000_000, output: 1_000_000 })).toBeCloseTo(0.6);
    expect(formatUsd(0.004)).toBe('< 0,01 USD');
    expect(formatUsd(0.123)).toBe('0,12 USD');
  });

  it('keeps only answers about what was asked', () => {
    const out = validateOutput(
      {
        lines: [
          { id: 'l2', translation: ' pi, pi, pi ', literal: 'pi pi pi', note: '', uncertain: false },
          { id: 'l9', translation: 'invented line', literal: '', note: '', uncertain: false },
          { id: 'l2', translation: 'duplicate', literal: '', note: '', uncertain: false },
        ],
        words: [
          { key: 'pollitos', meaning: 'kurczaczki' },
          { key: 'gato', meaning: 'kot' },
        ],
      },
      ['l1', 'l2', 'l3'],
      ['pollitos', 'hambre'],
    );
    expect(out.lines).toEqual([{ id: 'l2', translation: 'pi, pi, pi', literal: 'pi pi pi', note: '', uncertain: false }]);
    expect(out.words).toEqual([{ key: 'pollitos', meaning: 'kurczaczki' }]);
    expect(() => validateOutput({ lines: [], words: [] }, ['l1'], [])).toThrow(AiError);
    expect(() => validateOutput(null, ['l1'], [])).toThrow(AiError);
  });

  it('never overwrites the learner translation and labels AI translations', () => {
    const next = applyOutput(song, {
      lines: [
        { id: 'l1', translation: 'AI tłumaczenie', literal: 'Te kurczaczki mówią', note: 'pollito = kurczątko', uncertain: false },
        { id: 'l2', translation: 'pi, pi, pi', literal: '', note: '', uncertain: true },
        { id: 'l3', translation: 'kiedy są głodne', literal: '', note: '', uncertain: false },
      ],
      words: [{ key: 'hambre', meaning: 'głód' }],
    });
    expect(next.lines[0]).toMatchObject({ pl: 'Kurczaczki mówią', plBy: 'user', literal: 'Te kurczaczki mówią', aiNote: 'pollito = kurczątko' });
    expect(next.lines[1]).toMatchObject({ pl: 'pi, pi, pi', plBy: 'ai', uncertain: true });
    expect(next.lines[2]).toMatchObject({ pl: 'kiedy są głodne', plBy: 'ai' });
    expect(next.lines[2].literal).toBeUndefined();
    expect(next.glosses).toEqual({ hambre: 'głód' });
  });

  it('runs a request through the SDK client and reports refusals and truncation', async () => {
    const calls: Record<string, unknown>[] = [];
    const client = (reply: object): AiClient => ({
      beta: {
        messages: {
          parse: async (params) => {
            calls.push(params);
            return { model: 'claude-opus-5-5', usage: { input_tokens: 900, output_tokens: 400 }, stop_reason: 'end_turn', ...reply };
          },
        },
      },
    });
    const ok = await translateWithAi(config, song, words, client({ parsed_output: { lines: [{ id: 'l2', translation: 'pi', literal: '', note: '', uncertain: false }], words: [] } }));
    expect(ok.output.lines).toHaveLength(1);
    expect(ok.usage).toEqual({ input: 900, output: 400 });
    expect(calls[0]).toMatchObject({ model: 'claude-opus-5-5', fallbacks: 'default' });
    expect((calls[0].output_config as { format: unknown }).format).toBeTruthy();
    await expect(translateWithAi(config, song, words, client({ stop_reason: 'refusal' }))).rejects.toMatchObject({ code: 'refused' });
    await expect(translateWithAi(config, song, words, client({ stop_reason: 'max_tokens' }))).rejects.toMatchObject({ code: 'truncated' });
    await expect(translateWithAi(config, song, words, client({ parsed_output: null }))).rejects.toMatchObject({ code: 'invalid' });
  });
});
