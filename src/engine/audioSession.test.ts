import { describe, expect, it } from 'vitest';
import { getCourse } from '../content/registry';
import { audioPool, buildDictationSteps, buildListeningSteps, buildPlaylist, buildSpeakingSteps, ENTRY_SECONDS } from './audioSession';
import { introduceCard, newCard } from './srs';
import { createRng } from './random';

const es = getCourse('es');
const NOW = new Date(2026, 9, 9, 12).getTime();
const cards = es.lessons.slice(0, 3).flatMap((l) => [
  ...l.items.map((i) => ({ ...introduceCard(i.id, 'es', 'item', [{ correct: true, skill: 'recognition' }], NOW - 86_400_000) })),
  ...l.sentences.map((s) => ({ ...newCard(s.id, 'es', 'sentence', NOW - 86_400_000) })),
]);

describe('audio pool', () => {
  it('uses a lesson when requested', () => {
    const pool = audioPool(es, [], NOW, 'es.l02');
    expect(pool.items.map((i) => i.id)).toEqual(es.lessons[1].items.map((i) => i.id));
  });
  it('uses the learner cards otherwise', () => {
    const pool = audioPool(es, cards, NOW);
    expect(pool.items.length).toBeGreaterThan(5);
    expect(pool.sentences.length).toBeGreaterThan(0);
  });
});

describe('hands-free playlist', () => {
  it('fits the requested duration and avoids immediate repeats', () => {
    const pool = audioPool(es, [], NOW, 'es.l01');
    for (const [min, stage] of [[5, 1], [10, 2], [15, 3]] as const) {
      const list = buildPlaylist(pool, min, stage, createRng(1));
      expect(list.length).toBe(Math.round((min * 60) / ENTRY_SECONDS[stage]));
      for (let i = 1; i < list.length; i++) expect(list[i].refId).not.toBe(list[i - 1].refId);
      expect(new Set(list.map((e) => e.key)).size).toBe(list.length);
      expect(list.some((e) => e.kind === 'sentence')).toBe(true);
      expect(list.every((e) => e.pl.length > 0)).toBe(true);
    }
  });
  it('is empty without material', () => {
    expect(buildPlaylist({ items: [], sentences: [] }, 5, 1, createRng(1))).toEqual([]);
  });
});

describe('audio exercise sets', () => {
  it('builds listening, speaking and dictation sessions', () => {
    const l = buildListeningSteps(es, cards, NOW, 1);
    expect(l.at(-1)!.kind).toBe('summary');
    expect(l.filter((s) => s.kind === 'choice').length).toBeGreaterThan(5);
    expect(l.every((s) => s.kind === 'summary' || (s.kind === 'choice' && s.prompt.hideText))).toBe(true);
    const sp = buildSpeakingSteps(es, cards, NOW, 2, 'shadow');
    expect(sp.filter((s) => s.kind === 'speak' && s.mode === 'shadow').length).toBeGreaterThan(0);
    const d = buildDictationSteps(es, cards, NOW, 3);
    expect(d.filter((s) => s.kind === 'type' && s.mode === 'dictation').length).toBeGreaterThan(3);
    expect(buildListeningSteps(es, [], NOW, 1)).toEqual([]);
  });
});
