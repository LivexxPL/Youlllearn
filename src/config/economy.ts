/**
 * The coin economy in one place: currency name, every reward amount and the anti-farming
 * rules. Prices of cosmetic items live in src/config/cosmetics.ts. See ECONOMY_DESIGN.md.
 *
 * All amounts are integers (whole coins).
 */

/** Display name of the currency; change it here (and nowhere else). */
export const CURRENCY = {
  id: 'coins',
  name: 'Lingo Coins',
} as const;

export type CurrencyId = typeof CURRENCY.id;

export const REWARDS = {
  lesson: {
    /** First completion of a lesson. */
    firstShort: 15,
    firstLong: 25,
    /** A lesson with at least this many answered exercises counts as long. */
    longFrom: 24,
    /** Completing an already finished lesson again: once per lesson per day… */
    repeat: 5,
    /** …if at least this many exercises were answered. */
    repeatMinAnswered: 5,
  },
  /**
   * Review sessions, audio drills, audio flashcards and Endless practice: coins by the number
   * of different cards practised that have not earned coins in the same kind of practice
   * today. Practising the same cards again the same day still teaches (and earns XP) but
   * earns no further coins — the anti-farming rule that keeps Endless practice unlimited.
   */
  practice: {
    /** [minimum fresh cards, coins], highest first. Fewer than the last row earns nothing. */
    tiers: [
      [30, 15],
      [20, 12],
      [15, 10],
      [10, 8],
      [5, 5],
    ] as const,
  },
  /** Dialogues and stories: once per story per day, with at least two questions answered. */
  story: { base: 5, perCorrect: 1, max: 12, minAnswered: 2 },
  /** A listening-only ("audio marathon") session played to the end: once per day. */
  marathon: 5,
  /** Handwriting practice: per character practised, once per character per day. */
  writingPerChar: 1,
  /** Each daily quest, and the bonus for finishing all three. */
  quest: 10,
  allQuests: 20,
  weeklyChallenge: 75,
  /** Every 7 days with real learning (not necessarily in a row). */
  consistency: { everyActiveDays: 7, coins: 30 },
  /**
   * One-time grant for learners who used the app before coins existed: per lesson finished
   * without a coin reward, up to a cap.
   */
  migration: { perLesson: 10, cap: 500 },
} as const;

/** Coins for an achievement, by how hard it is. */
export const ACHIEVEMENT_COINS = { small: 25, medium: 50, large: 100 } as const;

export type AchievementTier = keyof typeof ACHIEVEMENT_COINS;

/** Size of each achievement's coin reward (default: small). */
export const ACHIEVEMENT_TIERS: Record<string, AchievementTier> = {
  'lessons-10': 'medium',
  'lessons-25': 'medium',
  'lessons-50': 'large',
  'level-a2': 'medium',
  'level-b1': 'large',
  'words-150': 'medium',
  'established-25': 'medium',
  'streak-7': 'medium',
  'streak-30': 'large',
  'days-20': 'medium',
  'listen-120': 'medium',
  'reviews-500': 'large',
  hiragana: 'medium',
  katakana: 'medium',
  'writer-50': 'medium',
  polyglot: 'medium',
  'beginner-course': 'large',
  'course-es': 'large',
  'course-de': 'large',
  'course-ja': 'large',
};

export function practiceCoins(freshCards: number): number {
  for (const [min, coins] of REWARDS.practice.tiers) if (freshCards >= min) return coins;
  return 0;
}

export function storyCoins(correct: number, answered: number): number {
  if (answered < REWARDS.story.minAnswered) return 0;
  return Math.min(REWARDS.story.max, REWARDS.story.base + correct * REWARDS.story.perCorrect);
}

export function lessonFirstCoins(answered: number): number {
  return answered >= REWARDS.lesson.longFrom ? REWARDS.lesson.firstLong : REWARDS.lesson.firstShort;
}

export function achievementCoins(id: string): number {
  return ACHIEVEMENT_COINS[ACHIEVEMENT_TIERS[id] ?? 'small'];
}
