/**
 * Coins: rewards for learning and purchases of cosmetic items, recorded in the `ledger` table.
 *
 * - The ledger is the single source of truth: the balance is the sum of the entries, the
 *   items owned follow from purchases (minus refunds) and item rewards. Nothing else stores
 *   coins, so the displayed balance cannot drift from the history.
 * - Every entry's id names the event it rewards (`lesson:es.l01:first`,
 *   `quest:2026-10-13:reviews`, `purchase:theme-galaxy:0`…). Writing an id that exists is a
 *   no-op, so a reward is granted once however often a completion is reported (double
 *   callbacks, reloads, restarts, synchronised copies from other devices).
 * - Writes happen inside Dexie transactions together with the learning data they reward, so
 *   an interrupted save leaves neither the reward without the progress nor the reverse.
 * - Amounts are whole numbers. Coins are never taken away for mistakes or missed days.
 *
 * Rules and amounts: src/config/economy.ts; items and prices: src/config/cosmetics.ts;
 * reasoning: ECONOMY_DESIGN.md.
 */
import { db, type LedgerEntry, type PolyglotDB, type TxType } from './db';
import { dayKey } from '../engine/dates';
import { isActiveDay } from '../engine/gamification';
import { CURRENCY, REWARDS, achievementCoins, lessonFirstCoins, practiceCoins, storyCoins } from '../config/economy';
import { COSMETICS, bundlePrice, getBundle, getItem, rewardItemsOf } from '../config/cosmetics';

export type PracticeFamily = 'review' | 'audio';

/** A purchase can be undone for this long (a mistaken tap). */
export const REFUND_WINDOW_MS = 2 * 60_000;

export function entry(type: TxType, id: string, amount: number, at: number, extra: Partial<LedgerEntry> = {}): LedgerEntry {
  if (!Number.isSafeInteger(amount)) throw new Error(`Coin amounts are whole numbers: ${amount}`);
  return { id, type, amount, currency: CURRENCY.id, at, date: dayKey(at), ...extra };
}

// ---------------------------------------------------------------------------
// Wallet (pure)

export interface Wallet {
  balance: number;
  /** Everything ever earned (rewards and grants). */
  earned: number;
  /** Spent on purchases, net of refunds. */
  spent: number;
  /** Item ids owned: free items, item rewards and purchases that were not refunded. */
  owned: Set<string>;
}

export function walletOf(entries: readonly LedgerEntry[]): Wallet {
  const refunded = new Set(entries.filter((e) => e.type === 'refund' && e.refundOf).map((e) => e.refundOf!));
  const owned = new Set(COSMETICS.filter((c) => c.free).map((c) => c.id));
  let balance = 0;
  let earned = 0;
  let spent = 0;
  for (const e of entries) {
    balance += e.amount;
    if (e.type === 'purchase') spent -= e.amount;
    else if (e.type === 'refund') spent -= e.amount;
    else if (e.amount > 0) earned += e.amount;
    if (e.items && e.type !== 'refund' && !(e.type === 'purchase' && refunded.has(e.id))) for (const id of e.items) owned.add(id);
  }
  return { balance, earned, spent, owned };
}

export async function getWallet(database: PolyglotDB = db): Promise<Wallet> {
  return walletOf(await database.ledger.toArray());
}

/**
 * Adds the entries whose ids are not in the ledger yet and returns them. Joins the caller's
 * transaction when there is one (which must include the ledger table).
 */
export async function grant(entries: LedgerEntry[], database: PolyglotDB = db): Promise<LedgerEntry[]> {
  const unique = [...new Map(entries.map((e) => [e.id, e])).values()];
  if (!unique.length) return [];
  return database.transaction('rw', database.ledger, async () => {
    const existing = await database.ledger.bulkGet(unique.map((e) => e.id));
    const fresh = unique.filter((_, i) => !existing[i]);
    if (fresh.length) await database.ledger.bulkAdd(fresh);
    return fresh;
  });
}

// ---------------------------------------------------------------------------
// Rewards for learning

/** Entry for finishing a lesson: the first completion, or a repeat once per lesson per day. */
export function lessonEntry(lessonId: string, firstCompletion: boolean, answered: number, at: number): LedgerEntry | null {
  if (firstCompletion) return entry('lesson', `lesson:${lessonId}:first`, lessonFirstCoins(answered), at, { ref: lessonId });
  if (answered < REWARDS.lesson.repeatMinAnswered) return null;
  return entry('lesson', `lesson:${lessonId}:repeat:${dayKey(at)}`, REWARDS.lesson.repeat, at, { ref: lessonId });
}

/**
 * Entry for a practice session (reviews, Endless practice, audio drills and flashcards):
 * coins by the cards practised that have not earned coins in the same kind of practice
 * today. Must run inside a transaction that includes the ledger.
 */
export async function practiceEntry(
  family: PracticeFamily,
  sessionId: string,
  cardIds: Iterable<string>,
  at: number,
  database: PolyglotDB = db,
): Promise<LedgerEntry | null> {
  const today = await database.ledger.where('date').equals(dayKey(at)).toArray();
  const used = new Set(today.filter((e) => e.type === 'practice' && e.family === family).flatMap((e) => e.cards ?? []));
  const fresh = [...new Set(cardIds)].filter((c) => !used.has(c));
  const amount = practiceCoins(fresh.length);
  return amount ? entry('practice', `practice:${family}:${sessionId}`, amount, at, { family, cards: fresh }) : null;
}

/** Practice session finished outside recordReviewSession (e.g. audio flashcards). */
export async function awardPractice(family: PracticeFamily, sessionId: string, cardIds: Iterable<string>, at = Date.now(), database: PolyglotDB = db): Promise<LedgerEntry[]> {
  return database.transaction('rw', database.ledger, async () => {
    const e = await practiceEntry(family, sessionId, cardIds, at, database);
    return e ? grant([e], database) : [];
  });
}

export async function awardStory(storyId: string, correct: number, answered: number, at = Date.now(), database: PolyglotDB = db): Promise<LedgerEntry[]> {
  const amount = storyCoins(correct, answered);
  return amount ? grant([entry('story', `story:${storyId}:${dayKey(at)}`, amount, at, { ref: storyId })], database) : [];
}

/** A listening-only session played to the end (the reward is once per day, not per minute). */
export async function awardMarathon(at = Date.now(), database: PolyglotDB = db): Promise<LedgerEntry[]> {
  return grant([entry('marathon', `marathon:${dayKey(at)}`, REWARDS.marathon, at)], database);
}

/** One handwriting character practised and self-assessed (each character once per day). */
export async function awardWriting(char: string, at = Date.now(), database: PolyglotDB = db): Promise<LedgerEntry[]> {
  return grant([entry('writing', `writing:${dayKey(at)}:${char}`, REWARDS.writingPerChar, at, { ref: char })], database);
}

export function achievementEntry(achievementId: string, at: number): LedgerEntry {
  const items = rewardItemsOf(achievementId).map((i) => i.id);
  return entry('achievement', `achievement:${achievementId}`, achievementCoins(achievementId), at, { ref: achievementId, ...(items.length ? { items } : {}) });
}

/**
 * Grants what the ledger is missing for learning that is already recorded: achievement
 * rewards (unlocked before coins existed or on another device), consistency milestones and,
 * once, coins for lessons finished before the economy existed. Idempotent; returns the new
 * entries.
 */
export async function reconcileRewards(database: PolyglotDB = db, now = Date.now()): Promise<LedgerEntry[]> {
  return database.transaction('rw', [database.ledger, database.achievements, database.lessonProgress, database.dailyStats], async () => {
    const entries = await database.ledger.toArray();
    const ids = new Set(entries.map((e) => e.id));
    const add: LedgerEntry[] = [];

    for (const a of await database.achievements.toArray()) {
      if (!ids.has(`achievement:${a.id}`)) add.push(achievementEntry(a.id, now));
    }

    const { everyActiveDays, coins } = REWARDS.consistency;
    const activeDays = (await database.dailyStats.toArray()).filter(isActiveDay).length;
    for (let n = everyActiveDays; n <= activeDays; n += everyActiveDays) {
      if (!ids.has(`milestone:days-${n}`)) add.push(entry('milestone', `milestone:days-${n}`, coins, now, { ref: `days-${n}` }));
    }

    if (!ids.has('migration:v1')) {
      const rewarded = new Set(entries.filter((e) => e.type === 'lesson').map((e) => e.ref));
      const earlier = (await database.lessonProgress.toArray()).filter((p) => !rewarded.has(p.id)).length;
      const { perLesson, cap } = REWARDS.migration;
      if (earlier) add.push(entry('migration', 'migration:v1', Math.min(cap, perLesson * earlier), now, { ref: `lessons-${earlier}` }));
    }
    return grant(add, database);
  });
}

// ---------------------------------------------------------------------------
// Shop

export type PurchaseResult =
  | { ok: true; entry: LedgerEntry }
  | { ok: false; reason: 'owned' | 'notForSale' | 'unknown' }
  | { ok: false; reason: 'insufficient'; missing: number };

/** Current price of an item or bundle for this wallet (null: not sold). */
export function priceOf(id: string, wallet: Wallet): number | null {
  const bundle = getBundle(id);
  if (bundle) return bundlePrice(bundle, wallet.owned);
  return getItem(id)?.price ?? null;
}

/**
 * Buys an item or bundle in one transaction: checks ownership and balance against the ledger
 * as it is inside the transaction, then records the purchase. Two purchases can never spend
 * the same coins, and the balance never goes below zero through a purchase.
 */
export async function purchase(id: string, database: PolyglotDB = db, now = Date.now()): Promise<PurchaseResult> {
  return database.transaction('rw', database.ledger, async () => {
    const entries = await database.ledger.toArray();
    const wallet = walletOf(entries);
    const bundle = getBundle(id);
    const item = getItem(id);
    if (!bundle && !item) return { ok: false, reason: 'unknown' } as const;
    const items = bundle ? bundle.items.filter((i) => !wallet.owned.has(i)) : [id];
    if (!items.length || (item && wallet.owned.has(id))) return { ok: false, reason: 'owned' } as const;
    const price = priceOf(id, wallet);
    if (price === null) return { ok: false, reason: 'notForSale' } as const;
    if (wallet.balance < price) return { ok: false, reason: 'insufficient', missing: price - wallet.balance } as const;
    // The n-th purchase of the same thing (after refunds) has its own id; the same first
    // purchase made on two devices offline stays one purchase after synchronising.
    const n = entries.filter((e) => e.type === 'purchase' && e.ref === id).length;
    const e = entry('purchase', `purchase:${id}:${n}`, -price, now, { ref: id, items });
    await database.ledger.add(e);
    return { ok: true, entry: e } as const;
  });
}

/** Undoes a purchase made in the last couple of minutes. Returns false when it cannot. */
export async function refundPurchase(purchaseId: string, database: PolyglotDB = db, now = Date.now()): Promise<boolean> {
  return database.transaction('rw', database.ledger, async () => {
    const p = await database.ledger.get(purchaseId);
    if (!p || p.type !== 'purchase' || now - p.at > REFUND_WINDOW_MS) return false;
    const added = await grant([entry('refund', `refund:${purchaseId}`, -p.amount, now, { ref: p.ref, refundOf: purchaseId })], database);
    return added.length > 0;
  });
}

// ---------------------------------------------------------------------------
// Presentation helpers

/** Today's practice coins so far, for the "already earned today" hint. */
export async function practiceCardsRewardedToday(family: PracticeFamily, database: PolyglotDB = db, at = Date.now()): Promise<number> {
  const today = await database.ledger.where('date').equals(dayKey(at)).toArray();
  return today.filter((e) => e.type === 'practice' && e.family === family).reduce((n, e) => n + (e.cards?.length ?? 0), 0);
}
