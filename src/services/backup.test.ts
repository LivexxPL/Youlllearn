import { describe, expect, it } from 'vitest';
import { createDb, emptyDailyStats } from './db';
import { BackupError, exportData, importData, resetAll, validateBackup } from './backup';
import { introduceCard } from '../engine/srs';
import { addStats, recordLessonCompletion, claimRewards, updateStreak, type SessionOutcomes } from './progress';
import { getCourse } from '../content/registry';
import { defaultSettings } from '../state/settings';

describe('backup', () => {
  it('round-trips all tables', async () => {
    const a = createDb(`test-a-${Math.random()}`);
    await a.settings.put(defaultSettings());
    await a.cards.put(introduceCard('es.hola', 'es', 'item', [{ correct: true, skill: 'recognition' }], Date.now()));
    await a.dailyStats.put({ ...emptyDailyStats('2026-10-01'), activeSec: 300, xp: 50 });
    await a.drawings.put({ id: 'kana:あ', kind: 'practice', strokes: [{ points: [[0.1, 0.2, 0.5]], size: 0.04, pointerType: 'pen' }], updatedAt: 1 });
    const file = await exportData(a);
    const b = createDb(`test-b-${Math.random()}`);
    await importData(validateBackup(JSON.parse(JSON.stringify(file))), b);
    expect(await b.cards.count()).toBe(1);
    expect((await b.dailyStats.get('2026-10-01'))?.xp).toBe(50);
    expect((await b.drawings.get('kana:あ'))?.strokes[0].points[0]).toEqual([0.1, 0.2, 0.5]);
    await resetAll(b);
    expect(await b.cards.count()).toBe(0);
  });

  it('rejects invalid files with a reason', () => {
    expect(() => validateBackup(null)).toThrow(BackupError);
    expect(() => validateBackup({ app: 'other' })).toThrow(/Polyglot Quest/);
    expect(() => validateBackup({ app: 'polyglot-quest', format: 99, data: {} })).toThrow(/wersja/);
    expect(() => validateBackup({ app: 'polyglot-quest', format: 1, data: { cards: 'x' } })).toThrow(/cards/);
    expect(() => validateBackup({ app: 'polyglot-quest', format: 1, data: { cards: [{ id: 1 }] } })).toThrow(/karty/);
  });
});

describe('progress service', () => {
  const es = getCourse('es');
  const outcomes = (): SessionOutcomes => ({
    byRef: new Map([[es.lessons[0].items[0].id, [{ correct: true, skill: 'recognition' }]]]),
    graded: 10,
    correct: 9,
    xp: 90,
    bestRun: 6,
    speaking: 1,
    writing: 0,
  });

  it('records a lesson: cards, progress and stats', async () => {
    const d = createDb(`test-p-${Math.random()}`);
    const res = await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, d);
    expect(res.newItems).toBe(es.lessons[0].items.length);
    expect(res.accuracy).toBeCloseTo(0.9);
    expect(res.xp).toBe(110);
    const cards = await d.cards.toArray();
    // Items, sentences and grammar concepts with exercises get cards.
    expect(cards.filter((c) => c.kind === 'item').length).toBe(es.lessons[0].items.length);
    expect(cards.some((c) => c.kind === 'sentence')).toBe(true);
    expect(cards.some((c) => c.kind === 'grammar')).toBe(true);
    const lp = await d.lessonProgress.get('es.l01');
    expect(lp?.completions).toBe(1);
    const all = await d.dailyStats.toArray();
    expect(all[0].lessons).toBe(1);
    expect(all[0].xp).toBe(110);
    expect(all[0].courses).toEqual(['es']);
    // Repeating the lesson does not duplicate cards.
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, d);
    expect(await d.cards.count()).toBe(cards.length);
    expect((await d.lessonProgress.get('es.l01'))?.completions).toBe(2);
  });

  it('awards quest rewards once', async () => {
    const d = createDb(`test-q-${Math.random()}`);
    const settings = { ...defaultSettings(), profileSeed: 'fixed' };
    await addStats({ lessons: 3, reviews: 50, exercises: 80, newItems: 20, listeningSec: 900, speaking: 10, writing: 10, bestRun: 20, audioSessions: 2, activeSec: 3000 }, 'es', '2026-10-09', d);
    const first = await claimRewards(settings, '2026-10-09', d);
    expect(first.filter((r) => r.kind === 'quest')).toHaveLength(3);
    expect(first.some((r) => r.kind === 'all-quests')).toBe(true);
    expect(await claimRewards(settings, '2026-10-09', d)).toEqual([]);
    const day = await d.dailyStats.get('2026-10-09');
    expect(day!.xp).toBe(first.reduce((n, r) => n + r.xp, 0));
  });

  it('keeps streak state in the database', async () => {
    const d = createDb(`test-s-${Math.random()}`);
    await addStats({ activeSec: 120 }, 'es', '2026-10-08', d);
    await addStats({ activeSec: 120 }, 'es', '2026-10-09', d);
    const r = await updateStreak('2026-10-09', d);
    expect(r.current).toBe(2);
  });
});
