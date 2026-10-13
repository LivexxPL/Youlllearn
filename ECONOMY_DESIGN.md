# Economy design: Lingo Coins, rewards and cosmetics

Polyglot Quest has one virtual currency, **Lingo Coins** (the name lives in
`src/config/economy.ts` → `CURRENCY.name`). Coins are earned by learning and spent on
**cosmetic items only**: colour themes, avatar frames, profile backgrounds, badges, titles,
progress bar styles and completion effects. The shop is optional: every lesson, review,
audio mode and setting works the same for someone who never opens it.

There is no real money, no premium currency, no loot boxes or random rewards, no
time-limited offers and no energy or limits on learning. Everything works offline and
without an account.

## Where things are

| Piece | File |
| --- | --- |
| Currency name, every reward amount, anti-farming rules | `src/config/economy.ts` |
| Item catalogue, prices, bundles, achievement rewards | `src/config/cosmetics.ts` |
| Ledger, rewards, purchases, refunds, reconciliation | `src/services/economy.ts` |
| Rewards written together with learning data | `src/services/progress.ts` |
| Ledger table and entry type | `src/services/db.ts` (Dexie version 2) |
| Shop, item sheet, collection, coin history, coin card, effects | `src/features/economy/*` |
| Profile (frame, background, badge, title, balance) | `src/features/profile/ProfileScreen.tsx` |
| Styles of frames, backgrounds, bars and effects | `src/styles/features.css` (section "Coins, shop…") |

## Currency rules

1. Amounts are whole numbers (`Number.isSafeInteger` is enforced on every entry).
2. Coins never expire and are never taken away — not for wrong answers, hints, easier
   exercises, missed days or a broken streak.
3. Coins are only spent by the learner, on cosmetics, after a confirmation.
4. The balance is never pushed below zero by a purchase. (Only merging purchases made on
   two offline devices could, in theory, leave a negative balance; the history screen then
   explains it, and later rewards even it out. Nothing is confiscated.)
5. Nothing that affects learning can be bought: no easier questions, hints, streak shields,
   extra lessons or XP.

## Reward amounts

All values are in `REWARDS` / `ACHIEVEMENT_COINS` (`src/config/economy.ts`).

| Event | Coins | Rule (anti-farming) |
| --- | --- | --- |
| New lesson completed | 15, or 25 for a long lesson (≥ 24 answered exercises) | once per lesson (`lesson:<id>:first`) |
| Finished lesson repeated | 5 | once per lesson per day, ≥ 5 answers |
| Review / Endless practice / audio drill / audio flashcards | 5 · 8 · 10 · 12 · 15 for 5 · 10 · 15 · 20 · 30 fresh cards | a card earns once per day per kind of practice (reviews vs audio) |
| Dialogue or story with questions | 5 + 1 per correct answer, max 12 | once per story per day, ≥ 2 answers |
| Listening-only session played to the end ("audio marathon") | 5 | once per day; never per minute of playback |
| Handwriting practice | 1 per character | once per character per day |
| Daily quest | 10 each, +20 for all three | once per quest per day |
| Weekly challenge | 75 | once per week |
| Achievement | 25 / 50 / 100 by difficulty (some also give an item) | once per achievement |
| Consistency | 30 for every 7 days with real learning (not necessarily in a row) | once per milestone |
| Earlier learning (existing users) | 10 per lesson finished before coins existed, max 500 | once (`migration:v1`) |

### Why practice is paid by "fresh cards"

Practice — reviews, the "keep practising" Endless sets, audio drills and flashcards — has
no limit. Coins follow **retrieval of different material**: a session earns coins for the
cards that have not earned coins in that kind of practice today. A learner who keeps going
through their deck keeps earning; repeating the same dozen cards set after set still trains
memory (and earns XP) but earns no further coins that day. The summary says so plainly
("Te karty przyniosły już dziś monety…"). Answers do not have to be correct: being wrong or
using a hint never lowers a reward. Self-assessed exercises (speaking, shadowing, repeating,
flashcards) count exactly like the others, so no microphone or speech recognition is needed.

## Cosmetic catalogue

46 items for sale (14 050 coins in total), 9 reward-only items and the 8 colour themes that
everyone already had (free).

| Slot | Items | Prices | Notes |
| --- | --- | --- | --- |
| Themes | 11 | 300–900 | basic: Minimalizm 300, Leśny odkrywca 350, Morska bryza 350, Ogród sakury 450; advanced: Ciepła akademia 600, Galaktyka 750, Cyber neon 800, Retro arcade 900; collections 500 each. Reward: Laur absolwenta |
| Avatar frames | 7 | 150–350 | rewards: tydzień nawyku (7-day streak), fale dźwięku (listening marathon), trzy ścieżki (all three courses) |
| Profile backgrounds | 7 | 200–300 | gradients and original SVG patterns |
| Badges | 7 | 150–350 | rewards: pierwsze kroki (first lesson), sakiewka (first 100 coins), mistrz powtórek (100 reviews) |
| Titles | 5 | 100–200 | rewards: Poliglota (all three courses), Absolwent podstaw (beginner course) |
| Progress bar styles | 5 | 150–250 | texture over the theme's own bar colours, so bar contrast is unchanged; "done" bars stay plain |
| Completion effects | 4 | 250–450 | confetti, stars, fireworks, maple petals; never shown with reduced motion |

**Collections** inspired by the courses are cosmetic only and optional: *Japońska jesień*
(washi paper, maple leaves, ink brush), *Bauhaus* (primary-colour geometry) and
*Śródziemnomorska* (whitewash, cobalt tiles, citrus). They use original CSS/SVG artwork,
nature, stationery and geometric motifs — no flags, people, religious or political symbols,
franchise characters or third-party artwork. Each has a **bundle** (1 000–1 250 coins,
about 20 % below the separate prices); a bundle's price drops in proportion to the items
already owned. The multilingual rewards (*trzy ścieżki*) are an optional bonus: nothing
requires studying more than one language.

## Price balance

A learner with a 10-minute goal who does one new lesson, one review session and the daily
quests earns roughly **75–85 coins a day** (15–25 lesson, 5–10 review, 30 quests, 20 bonus),
plus 75 for the weekly challenge, 30 per 7 active days and achievement rewards.

| Goal | Typical time |
| --- | --- |
| First item (100–150) | day 1–2 (the first lesson alone gives 15 + 25 for the "first step" badge) |
| Basic theme (300–450) | 4–6 days |
| Advanced theme (600–900) | 1–1.5 weeks |
| Collection bundle (1 000–1 250) | about 2 weeks |
| Everything in the shop (14 050) | several months of regular learning |

The shop always shows the price, ownership, whether an item is equipped and, when coins are
short, how many coins are missing and roughly how many new lessons that is.

## Transaction model

Table `ledger` (Dexie version 2, primary key `id`, indexes `date`, `type`):

```ts
interface LedgerEntry {
  id: string;        // the event, e.g. lesson:es.l01:first, quest:2026-10-13:reviews, purchase:frame-gold:0
  type: 'lesson' | 'practice' | 'story' | 'marathon' | 'writing' | 'quest' | 'challenge'
      | 'achievement' | 'milestone' | 'purchase' | 'refund' | 'migration' | 'adjustment';
  amount: number;    // integer: + earned, − spent, 0 = item reward only
  currency: 'coins'; // ready for more currencies; only one exists
  at: number; date: string;
  ref?: string;      // lesson, quest, achievement or item id
  items?: string[];  // items granted or bought
  refundOf?: string; // a refund's purchase
  cards?: string[]; family?: 'review' | 'audio'; // practice rewards (anti-farming)
}
```

- **The ledger is the only record.** The balance is the sum of `amount`; owned items are the
  free items, item rewards and purchases that were not refunded (`walletOf`). There is no
  separate balance or inventory that could drift from the history.
- **Idempotent rewards.** An entry's id names the event; adding an id that exists does
  nothing (`grant`). A reward is granted once whether a completion callback fires twice, the
  app reloads on the summary, restarts after a lesson, a resumed lesson finishes, or the
  same reward arrives from another device through the cloud copy.
- **Atomic writes.** Lesson, practice, quest and achievement rewards are written in the same
  Dexie transaction as the learning data they reward; an interrupted save keeps neither.
- **Purchases** run in one read-write transaction: balance and ownership are checked against
  the ledger inside it, then the purchase entry is added. Concurrent attempts are serialised,
  so the same coins cannot be spent twice. The n-th purchase of an item has the id
  `purchase:<item>:<n>`, so the same offline purchase made on two devices stays one purchase
  after synchronising.
- **Refunds.** A purchase can be undone for two minutes after buying (a mistaken tap): a
  `refund` entry returns the coins and the item is no longer owned (and is unequipped).
- **Equipped items** are settings (`palette` for the theme, `cosmetics` for the other slots),
  so they follow the existing appearance system and backup.
- **Reconciliation** (`reconcileRewards`, on every start): grants missing achievement
  rewards (achievements unlocked before coins existed or on another device), consistency
  milestones and the one-time grant for earlier lessons. It only adds entries with
  deterministic ids, so running it repeatedly changes nothing.

## Persistence and migrations

- Dexie **version 2** adds the `ledger` table; existing tables and data are untouched
  (tested by opening a version 1 database). Coins for earlier learning are granted once by
  reconciliation, shown in a welcome message.
- Backups use **format 2** (with the ledger). Format 1 files still import (without coins);
  ledger rows are validated on import (integer amounts, string ids and types), so a damaged
  history is rejected before anything is replaced.
- The cloud copy (docs/CLOUD_SYNC.md) merges the ledger as a union by id.
- Settings get `cosmetics`, `coinFx` and `coinSounds` with defaults for existing users.

## Accessibility decisions

- Amounts always come as text: the coin symbol is decorative; screen readers hear e.g.
  "Saldo: 120 monet" (Polish plural forms), the summary announces the total and reasons.
- Coin animation: *Pełna* (count-up and a small burst), *Delikatna* (fade) or *Bez animacji*
  (Settings → Monety i wygląd); reduced motion always shows them without animation.
  Completion effects end invisible, so with reduced motion they never appear.
- Coin sounds can be switched off separately (and follow the general sound switch).
- New themes pass the same WCAG tests as all palettes (`palettes.test.ts`: body text 7:1,
  secondary text, links, buttons and status colours 4.5:1, chart bars 3:1, in light and dark
  mode). Frames, backgrounds and effects are decorative and never carry text; profile
  text sits on the card surface, not on the background art.
- Coins are mentioned only where they matter: Home (balance chip), summaries, the profile,
  the shop. No pop-ups after individual answers.

## Test coverage

`src/services/economy.test.ts` (unit, with an in-memory IndexedDB):

| Requirement | Test |
| --- | --- |
| Reward amounts | "reward amounts follow the central configuration", "are whole numbers everywhere" |
| Lesson rewards | "pay the first completion once, then a smaller repeat…", "pay more for long lessons…" |
| Duplicate events | "…once per lesson per day", "ignore a session reported twice", "pay quest coins … once" |
| Idempotency after refresh/restart | "stay single after a restart", "work offline and persist across restarts" |
| Interrupted transactions | "are saved together with the progress (an interrupted save keeps neither)" |
| Atomic purchases | "two purchases racing for the same coins cannot both succeed" |
| Insufficient balance, zero balance, exact price, repeated purchase | "refuse with the missing amount…", "cost the exact price, may leave a zero balance and cannot be repeated" |
| Not for sale, unknown ids | "never sell rewards, free items or unknown ids" |
| Inventory persistence, bundles, refunds | "work offline and persist across restarts", "price bundles…", "can be undone right after buying…" |
| Achievements once, with items | "grant achievement coins and items once…", "unlock the first purse, the marathon…" |
| Endless farming | "pay by fresh cards and never twice for the same cards on the same day" |
| Audio without a microphone | "pay self-assessed shadowing and repeat drills…", "pay a finished listening marathon once a day…" |
| Schema migration | "upgrades a version 1 database without losing progress and pays once for earlier lessons" |
| Ledger ↔ balance consistency | "keeps the balance equal to the sum of the history in any sequence of events" |
| Corrupted import | "round-trips coins and purchases through a backup file, and rejects a damaged history" |
| Cross-device purchases | "merges purchases made on two devices without paying twice" |

`src/engine/gamification.test.ts` covers the new achievements; `src/config/palettes.test.ts`
the contrast of every theme.

`e2e/economy.spec.ts` (browser): a real lesson earns coins shown on the summary, Home and in
the history; buying at the exact price, equipping and keeping it after a reload; a short
balance explained; undoing a purchase; buying and equipping offline (service worker, no
network); locked rewards with their requirements; buying a theme, switching to it without
paying again and returning to the default look.

## Not included (possible later)

- Card appearance variants, session ambience and quest-screen variations were left out to
  avoid clutter.
- Coin earnings are not shown in the weekly chart.
