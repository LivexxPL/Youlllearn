import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';
import { createDb, emptyDailyStats, setMeta, type LedgerEntry, type PolyglotDB } from './db';
import {
  REFUND_WINDOW_MS,
  awardMarathon,
  awardPractice,
  awardStory,
  awardWriting,
  entry,
  getWallet,
  grant,
  priceOf,
  purchase,
  reconcileRewards,
  refundPurchase,
  walletOf,
} from './economy';
import { addStats, claimRewards, recordLessonCompletion, recordReviewSession, refreshAchievements, setFlag, type SessionOutcomes } from './progress';
import { BackupError, exportData, importData, validateBackup } from './backup';
import { ACHIEVEMENT_COINS, REWARDS, achievementCoins, lessonFirstCoins, practiceCoins, storyCoins } from '../config/economy';
import { BUNDLES, COSMETICS, bundlePrice, getItem } from '../config/cosmetics';
import { getCourse } from '../content/registry';
import { defaultSettings } from '../state/settings';
import { introduceCard, type Outcome } from '../engine/srs';
import { dayKey } from '../engine/dates';

const es = getCourse('es');
const newDb = () => createDb(`test-econ-${Math.random()}`);
const NOON = new Date('2026-10-13T12:00:00').getTime();
const DAY = 86_400_000;

function outcomes(answered: number, refs: string[] = []): SessionOutcomes {
  const byRef = new Map<string, Outcome[]>(refs.map((r) => [r, [{ correct: true, skill: 'recall' }]]));
  return { byRef, graded: answered, correct: answered, xp: answered * 10, bestRun: answered, speaking: 0, writing: 0 };
}

/** Puts coins on the account the way a test fixture may (an administrative adjustment). */
async function fund(d: PolyglotDB, amount: number, id = `adjustment:test-${Math.random()}`) {
  await grant([entry('adjustment', id, amount, NOON)], d);
}

async function cards(d: PolyglotDB, ids: string[]) {
  await d.cards.bulkPut(ids.map((id) => introduceCard(id, 'es', 'item', [{ correct: true, skill: 'recognition' }], NOON - 10 * DAY)));
}

const cardIds = (n: number, from = 0) => Array.from({ length: n }, (_, i) => `es.c${i + from}`);

describe('reward amounts', () => {
  it('follow the central configuration', () => {
    expect(lessonFirstCoins(10)).toBe(REWARDS.lesson.firstShort);
    expect(lessonFirstCoins(REWARDS.lesson.longFrom)).toBe(REWARDS.lesson.firstLong);
    expect([4, 5, 9, 10, 15, 20, 29, 30, 100].map(practiceCoins)).toEqual([0, 5, 5, 8, 10, 12, 12, 15, 15]);
    expect(storyCoins(0, 1)).toBe(0);
    expect(storyCoins(3, 4)).toBe(8);
    expect(storyCoins(20, 20)).toBe(REWARDS.story.max);
    expect(achievementCoins('first-lesson')).toBe(ACHIEVEMENT_COINS.small);
    expect(achievementCoins('lessons-50')).toBe(ACHIEVEMENT_COINS.large);
  });

  it('are whole numbers everywhere, and entries refuse anything else', () => {
    const all = [REWARDS.lesson.firstShort, REWARDS.lesson.firstLong, REWARDS.lesson.repeat, REWARDS.quest, REWARDS.allQuests, REWARDS.weeklyChallenge, REWARDS.marathon, ...Object.values(ACHIEVEMENT_COINS)];
    for (const n of all) expect(Number.isInteger(n)).toBe(true);
    for (const c of COSMETICS) if (c.price !== null) expect(Number.isInteger(c.price) && c.price > 0).toBe(true);
    expect(() => entry('adjustment', 'x', 1.5, NOON)).toThrow(/whole/);
  });
});

describe('lesson rewards', () => {
  it('pay the first completion once, then a smaller repeat once per lesson per day', async () => {
    const d = newDb();
    const first = await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON }, d);
    expect(first.coins.map((c) => [c.id, c.amount])).toEqual([['lesson:es.l01:first', REWARDS.lesson.firstShort]]);
    const again = await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON + 60_000 }, d);
    expect(again.coins.map((c) => c.amount)).toEqual([REWARDS.lesson.repeat]);
    // The same callback firing twice, or a third run the same day: nothing more.
    const twice = await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON + 120_000 }, d);
    expect(twice.coins).toEqual([]);
    const nextDay = await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON + DAY }, d);
    expect(nextDay.coins.map((c) => c.amount)).toEqual([REWARDS.lesson.repeat]);
    expect((await getWallet(d)).balance).toBe(REWARDS.lesson.firstShort + 2 * REWARDS.lesson.repeat);
  });

  it('pay more for long lessons and nothing for a repeat with almost no answers', async () => {
    const d = newDb();
    const long = await recordLessonCompletion({ course: es, lessonId: 'es.l02', outcomes: outcomes(30), now: NOON }, d);
    expect(long.coins[0].amount).toBe(REWARDS.lesson.firstLong);
    const skimmed = await recordLessonCompletion({ course: es, lessonId: 'es.l02', outcomes: outcomes(2), now: NOON + DAY }, d);
    expect(skimmed.coins).toEqual([]);
  });

  it('stay single after a restart (a new connection to the same database)', async () => {
    const name = `test-econ-restart-${Math.random()}`;
    const a = createDb(name);
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON }, a);
    a.close();
    const b = createDb(name);
    // Replaying the same completion (e.g. a resumed session reporting again) adds no first reward.
    const replay = await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON + 1000 }, b);
    expect(replay.coins.every((c) => c.id !== 'lesson:es.l01:first')).toBe(true);
    expect((await b.ledger.where('type').equals('lesson').toArray()).filter((e) => e.id.endsWith(':first'))).toHaveLength(1);
  });

  it('are saved together with the progress (an interrupted save keeps neither)', async () => {
    const d = newDb();
    await expect(
      d.transaction('rw', [d.lessonProgress, d.ledger, d.cards, d.dailyStats], async () => {
        await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON }, d);
        throw new Error('app closed mid-save');
      }),
    ).rejects.toThrow('app closed');
    expect(await d.lessonProgress.count()).toBe(0);
    expect(await d.ledger.count()).toBe(0);
  });
});

describe('practice rewards and Endless practice', () => {
  it('pay by fresh cards and never twice for the same cards on the same day', async () => {
    const d = newDb();
    const ids = cardIds(12);
    await cards(d, ids);
    const first = await recordReviewSession(es, outcomes(12, ids), NOON, d, { family: 'review', sessionId: 's1' });
    expect(first.coins.map((c) => c.amount)).toEqual([practiceCoins(12)]);
    // Endless practice: set after set with the same cards keeps teaching but earns no more coins.
    for (let i = 2; i <= 6; i++) {
      const again = await recordReviewSession(es, outcomes(12, ids), NOON + i * 60_000, d, { family: 'review', sessionId: `s${i}` });
      expect(again.coins).toEqual([]);
    }
    // New cards keep earning, without any limit on how long one practises.
    const more = cardIds(10, 100);
    await cards(d, more);
    const fresh = await recordReviewSession(es, outcomes(10, more), NOON + DAY / 4, d, { family: 'review', sessionId: 's7' });
    expect(fresh.coins.map((c) => c.amount)).toEqual([practiceCoins(10)]);
    // The next day the same cards count again.
    const tomorrow = await recordReviewSession(es, outcomes(12, ids), NOON + DAY, d, { family: 'review', sessionId: 's8' });
    expect(tomorrow.coins.map((c) => c.amount)).toEqual([practiceCoins(12)]);
  });

  it('ignore a session reported twice', async () => {
    const d = newDb();
    const ids = cardIds(15);
    await cards(d, ids);
    await recordReviewSession(es, outcomes(15, ids), NOON, d, { family: 'review', sessionId: 'same' });
    const dup = await recordReviewSession(es, outcomes(15, ids), NOON, d, { family: 'review', sessionId: 'same' });
    expect(dup.coins).toEqual([]);
    expect((await getWallet(d)).balance).toBe(practiceCoins(15));
  });

  it('pay nothing for tiny sessions but keep those cards available for later', async () => {
    const d = newDb();
    const ids = cardIds(8);
    await cards(d, ids);
    expect((await recordReviewSession(es, outcomes(4, ids.slice(0, 4)), NOON, d, { family: 'review', sessionId: 'a' })).coins).toEqual([]);
    expect((await recordReviewSession(es, outcomes(8, ids), NOON + 1, d, { family: 'review', sessionId: 'b' })).coins[0].amount).toBe(practiceCoins(8));
  });
});

describe('audio rewards (no microphone needed)', () => {
  it('pay self-assessed shadowing and repeat drills like any practice', async () => {
    const d = newDb();
    const ids = cardIds(10);
    await cards(d, ids);
    const selfRated: SessionOutcomes = {
      ...outcomes(10),
      byRef: new Map(ids.map((id) => [id, [{ correct: true, skill: 'speaking', selfRating: 'good' } satisfies Outcome]])),
    };
    const res = await recordReviewSession(es, selfRated, NOON, d, { family: 'audio', sessionId: 'shadow-1' });
    expect(res.coins.map((c) => c.amount)).toEqual([practiceCoins(10)]);
    // Audio practice is counted apart from reviews: the same cards still earn in a review.
    const review = await recordReviewSession(es, outcomes(10, ids), NOON + 1000, d, { family: 'review', sessionId: 'r-1' });
    expect(review.coins).toHaveLength(1);
    // Flashcards rated by the learner.
    expect(await awardPractice('audio', 'cards-1', ids, NOON + 2000, d)).toEqual([]);
  });

  it('pay a finished listening marathon once a day, not by playing time', async () => {
    const d = newDb();
    expect((await awardMarathon(NOON, d)).map((e) => e.amount)).toEqual([REWARDS.marathon]);
    expect(await awardMarathon(NOON + 3 * 3_600_000, d)).toEqual([]);
    expect(await awardMarathon(NOON + DAY, d)).toHaveLength(1);
  });

  it('pay stories once per story per day and characters once per day', async () => {
    const d = newDb();
    expect((await awardStory('es.s1', 3, 4, NOON, d))[0].amount).toBe(storyCoins(3, 4));
    expect(await awardStory('es.s1', 4, 4, NOON + 1000, d)).toEqual([]);
    expect(await awardStory('es.s2', 0, 1, NOON, d)).toEqual([]);
    expect(await awardWriting('あ', NOON, d)).toHaveLength(1);
    expect(await awardWriting('あ', NOON + 1000, d)).toEqual([]);
    expect(await awardWriting('い', NOON + 1000, d)).toHaveLength(1);
  });
});

describe('quests, challenges and achievements', () => {
  it('pay quest coins together with their XP, once', async () => {
    const d = newDb();
    const settings = { ...defaultSettings(), profileSeed: 'fixed' };
    const date = '2026-10-09';
    await addStats({ lessons: 3, reviews: 50, exercises: 80, newItems: 20, listeningSec: 900, speaking: 10, writing: 10, bestRun: 20, audioSessions: 2, activeSec: 3000 }, 'es', date, d);
    const first = await claimRewards(settings, date, d);
    expect(first.filter((r) => r.kind === 'quest').every((r) => r.coins === REWARDS.quest)).toBe(true);
    const coins = first.reduce((n, r) => n + r.coins, 0);
    expect(coins).toBe(3 * REWARDS.quest + REWARDS.allQuests);
    expect((await getWallet(d)).balance).toBe(coins);
    await claimRewards(settings, date, d);
    expect((await getWallet(d)).balance).toBe(coins);
  });

  it('grant achievement coins and items once, including achievements unlocked before coins existed', async () => {
    const d = newDb();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes(12), now: NOON }, d);
    const unlocked = await refreshAchievements(d);
    expect(unlocked.map((a) => a.id)).toContain('first-lesson');
    expect(await refreshAchievements(d)).toEqual([]);
    const wallet = await getWallet(d);
    expect(wallet.owned.has('badge-starter')).toBe(true);
    expect((await d.ledger.get('achievement:first-lesson'))?.amount).toBe(achievementCoins('first-lesson'));

    // An older install: the achievement is there, its reward is not.
    const old = newDb();
    await old.achievements.put({ id: 'streak-7', unlockedAt: NOON - 30 * DAY });
    const granted = await reconcileRewards(old, NOON);
    expect(granted.map((e) => e.id)).toContain('achievement:streak-7');
    expect((await getWallet(old)).owned.has('frame-week')).toBe(true);
    expect(await reconcileRewards(old, NOON)).toEqual([]);
  });

  it('unlock the first purse, the marathon and their cosmetics from real events', async () => {
    const d = newDb();
    await fund(d, 100);
    await setFlag('marathon', d);
    const ids = (await refreshAchievements(d)).map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(['coins-100', 'marathon']));
    const owned = (await getWallet(d)).owned;
    expect(owned.has('badge-purse') && owned.has('frame-soundwave')).toBe(true);
  });

  it('reward every seven active days once', async () => {
    const d = newDb();
    for (let i = 0; i < 15; i++) await addStats({ activeSec: 600 }, 'es', dayKey(NOON - i * DAY), d);
    const granted = await reconcileRewards(d, NOON);
    expect(granted.filter((e) => e.type === 'milestone').map((e) => e.id)).toEqual(['milestone:days-7', 'milestone:days-14']);
    expect((await reconcileRewards(d, NOON)).length).toBe(0);
  });
});

describe('purchases', () => {
  it('cost the exact price, may leave a zero balance and cannot be repeated', async () => {
    const d = newDb();
    const item = getItem('frame-gold')!;
    await fund(d, item.price!);
    const res = await purchase('frame-gold', d, NOON);
    expect(res.ok).toBe(true);
    const wallet = await getWallet(d);
    expect(wallet.balance).toBe(0);
    expect(wallet.owned.has('frame-gold')).toBe(true);
    expect(await purchase('frame-gold', d, NOON)).toEqual({ ok: false, reason: 'owned' });
  });

  it('refuse with the missing amount when coins are short, and at zero balance', async () => {
    const d = newDb();
    expect(await purchase('theme-galaxy', d, NOON)).toEqual({ ok: false, reason: 'insufficient', missing: getItem('theme-galaxy')!.price });
    await fund(d, 100);
    expect(await purchase('theme-galaxy', d, NOON)).toEqual({ ok: false, reason: 'insufficient', missing: getItem('theme-galaxy')!.price! - 100 });
    expect((await getWallet(d)).balance).toBe(100);
  });

  it('never sell rewards, free items or unknown ids', async () => {
    const d = newDb();
    await fund(d, 10_000);
    expect(await purchase('frame-week', d)).toEqual({ ok: false, reason: 'notForSale' });
    expect(await purchase('theme-classic', d)).toEqual({ ok: false, reason: 'owned' });
    expect(await purchase('nope', d)).toEqual({ ok: false, reason: 'unknown' });
    expect((await getWallet(d)).balance).toBe(10_000);
  });

  it('are atomic: two purchases racing for the same coins cannot both succeed', async () => {
    const d = newDb();
    await fund(d, 300);
    const results = await Promise.all([purchase('frame-gold', d, NOON), purchase('banner-sunset', d, NOON), purchase('title-explorer', d, NOON)]);
    const wallet = await getWallet(d);
    expect(wallet.balance).toBeGreaterThanOrEqual(0);
    const spent = results.filter((r) => r.ok).length;
    expect(spent).toBeGreaterThanOrEqual(1);
    expect(wallet.balance).toBe(300 - [200, 200, 100].slice(0, 3).filter((_, i) => results[i].ok).reduce((n, p) => n + p, 0));
  });

  it('price bundles below their items and less for items already owned', async () => {
    const d = newDb();
    const bundle = BUNDLES.find((b) => b.id === 'bundle-de')!;
    const sum = bundle.items.reduce((n, id) => n + getItem(id)!.price!, 0);
    expect(bundle.price).toBeLessThan(sum);
    await fund(d, 5000);
    await purchase('theme-bauhaus', d, NOON);
    const owned = (await getWallet(d)).owned;
    const reduced = bundlePrice(bundle, owned);
    expect(reduced).toBeLessThan(bundle.price);
    expect(priceOf('bundle-de', await getWallet(d))).toBe(reduced);
    const res = await purchase('bundle-de', d, NOON);
    expect(res.ok && res.entry.amount).toBe(-reduced);
    expect(res.ok && res.entry.items).not.toContain('theme-bauhaus');
    for (const id of bundle.items) expect((await getWallet(d)).owned.has(id)).toBe(true);
    expect(await purchase('bundle-de', d, NOON)).toEqual({ ok: false, reason: 'owned' });
  });

  it('can be undone right after buying, and the item bought again later', async () => {
    const d = newDb();
    await fund(d, 400);
    const res = await purchase('frame-stars', d, NOON);
    if (!res.ok) throw new Error('purchase failed');
    expect(await refundPurchase(res.entry.id, d, NOON + REFUND_WINDOW_MS + 1)).toBe(false);
    expect(await refundPurchase(res.entry.id, d, NOON + 1000)).toBe(true);
    expect(await refundPurchase(res.entry.id, d, NOON + 2000)).toBe(false);
    let wallet = await getWallet(d);
    expect(wallet.balance).toBe(400);
    expect(wallet.owned.has('frame-stars')).toBe(false);
    const again = await purchase('frame-stars', d, NOON + 5000);
    expect(again.ok && again.entry.id).toBe('purchase:frame-stars:1');
    wallet = await getWallet(d);
    expect(wallet.owned.has('frame-stars')).toBe(true);
    expect(wallet.spent).toBe(getItem('frame-stars')!.price);
  });

  it('work offline and persist across restarts', async () => {
    const name = `test-econ-persist-${Math.random()}`;
    const a = createDb(name);
    await fund(a, 500);
    await purchase('theme-forest', a, NOON);
    a.close();
    const b = createDb(name);
    const wallet = await getWallet(b);
    expect(wallet.owned.has('theme-forest')).toBe(true);
    expect(wallet.balance).toBe(500 - getItem('theme-forest')!.price!);
  });
});

describe('ledger consistency', () => {
  it('keeps the balance equal to the sum of the history in any sequence of events', async () => {
    const d = newDb();
    let expected = 0;
    const rnd = (() => {
      let x = 42;
      return () => ((x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    })();
    const buyable = COSMETICS.filter((c) => c.price !== null);
    for (let i = 0; i < 60; i++) {
      if (rnd() < 0.6) {
        const amount = 1 + Math.floor(rnd() * 120);
        await fund(d, amount, `adjustment:${i}`);
        expected += amount;
      } else {
        const item = buyable[Math.floor(rnd() * buyable.length)];
        const res = await purchase(item.id, d, NOON + i);
        if (res.ok) expected += res.entry.amount;
      }
      const entries = await d.ledger.toArray();
      const wallet = walletOf(entries);
      expect(wallet.balance).toBe(expected);
      expect(wallet.balance).toBe(entries.reduce((n, e) => n + e.amount, 0));
      expect(wallet.balance).toBeGreaterThanOrEqual(0);
      expect(wallet.earned - wallet.spent).toBe(wallet.balance);
    }
  });

  it('merges purchases made on two devices without paying twice', async () => {
    const p: LedgerEntry = entry('purchase', 'purchase:frame-gold:0', -200, NOON, { ref: 'frame-gold', items: ['frame-gold'] });
    const fundEntry = entry('adjustment', 'adjustment:start', 300, NOON - 1);
    const merged = walletOf([fundEntry, p, { ...p, at: NOON + 5 }].filter((e, i, all) => all.findIndex((x) => x.id === e.id) === i));
    expect(merged.balance).toBe(100);
  });
});

describe('migration and imports', () => {
  it('upgrades a version 1 database without losing progress and pays once for earlier lessons', async () => {
    const name = `test-econ-v1-${Math.random()}`;
    const v1 = new Dexie(name);
    v1.version(1).stores({ settings: 'id', cards: 'id, courseId, due, kind', lessonProgress: 'id, courseId', dailyStats: 'date', achievements: 'id', rewards: 'id, date', drawings: 'id, kind, updatedAt', meta: 'key' });
    await v1.table('lessonProgress').bulkPut(
      ['es.l01', 'es.l02', 'es.l03'].map((id) => ({ id, courseId: 'es', completedAt: 1, lastCompletedAt: 1, completions: 1, bestAccuracy: 1, lastAccuracy: 1 })),
    );
    await v1.table('dailyStats').put({ ...emptyDailyStats('2026-10-01'), activeSec: 900, xp: 300 });
    await v1.table('achievements').put({ id: 'first-lesson', unlockedAt: 1 });
    v1.close();

    const d = createDb(name);
    expect(d.verno).toBe(2);
    expect(await d.lessonProgress.count()).toBe(3);
    expect((await d.dailyStats.get('2026-10-01'))?.xp).toBe(300);
    const granted = await reconcileRewards(d, NOON);
    expect(granted.find((e) => e.id === 'migration:v1')?.amount).toBe(3 * REWARDS.migration.perLesson);
    expect(granted.find((e) => e.id === 'achievement:first-lesson')).toBeTruthy();
    expect(await reconcileRewards(d, NOON + 1000)).toEqual([]);
    // Lessons rewarded normally later do not reopen the one-time grant.
    await recordLessonCompletion({ course: es, lessonId: 'es.l04', outcomes: outcomes(12), now: NOON + 2000 }, d);
    expect(await reconcileRewards(d, NOON + 3000)).toEqual([]);
  });

  it('caps the one-time grant', async () => {
    const d = newDb();
    await d.lessonProgress.bulkPut(
      Array.from({ length: 80 }, (_, i) => ({ id: `es.x${i}`, courseId: 'es' as const, completedAt: 1, lastCompletedAt: 1, completions: 1, bestAccuracy: 1, lastAccuracy: 1 })),
    );
    const granted = await reconcileRewards(d, NOON);
    expect(granted.find((e) => e.id === 'migration:v1')?.amount).toBe(REWARDS.migration.cap);
  });

  it('round-trips coins and purchases through a backup file, and rejects a damaged history', async () => {
    const a = newDb();
    await fund(a, 400);
    await purchase('frame-gold', a, NOON);
    await setMeta('flags', { perfect: true }, a);
    const file = JSON.parse(JSON.stringify(await exportData(a)));
    const b = newDb();
    await importData(validateBackup(file), b);
    const wallet = await getWallet(b);
    expect(wallet.balance).toBe(200);
    expect(wallet.owned.has('frame-gold')).toBe(true);

    const damaged = (patch: object) => ({ ...file, data: { ...file.data, ledger: [{ ...file.data.ledger[0], ...patch }] } });
    expect(() => validateBackup(damaged({ amount: 1.5 }))).toThrow(BackupError);
    expect(() => validateBackup(damaged({ amount: '100' }))).toThrow(/monet/);
    expect(() => validateBackup(damaged({ id: 7 }))).toThrow(BackupError);
    // Files from before coins existed still import.
    const old = { ...file, format: 1, data: { ...file.data } };
    delete old.data.ledger;
    expect(() => validateBackup(old)).not.toThrow();
  });
});
