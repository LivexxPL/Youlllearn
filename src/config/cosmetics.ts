/**
 * Catalogue of cosmetic items: everything the shop sells, the free basics and the rewards
 * for achievements. Prices are in coins (src/config/economy.ts); names are i18n keys
 * `cos.<id>` (and `bundle.<id>`). Items only change how the app looks — never what or how
 * fast anyone learns. See ECONOMY_DESIGN.md for the price balance.
 */

/** Where an item goes when equipped. A theme is a colour palette (src/config/palettes.ts). */
export type Slot = 'theme' | 'frame' | 'banner' | 'badge' | 'title' | 'bar' | 'fx';

/** Optional collections inspired by the courses (cosmetic only), and the multilingual one. */
export type Collection = 'ja' | 'de' | 'es' | 'multi';

/** Shop tabs. */
export type Shelf = 'themes' | 'profile' | 'interface' | 'collections';

export interface CosmeticItem {
  id: string;
  slot: Slot;
  /** Coins; null = not sold (free for everyone, or earned with an achievement). */
  price: number | null;
  /** Owned by everyone from the start. */
  free?: boolean;
  /** The achievement whose unlock grants the item (reward-only items). */
  rewardOf?: string;
  collection?: Collection;
  /** Theme items: the palette they switch to. */
  palette?: string;
  /** Badge and title items: the symbol shown with them. */
  icon?: string;
}

export interface Bundle {
  id: string;
  collection: Collection;
  items: string[];
  /** Price of the whole bundle (less than the items bought one by one). */
  price: number;
}

const FREE_THEMES = ['classic', 'strawberry', 'mint', 'lavender', 'peach', 'lemon', 'sky', 'candy'];

export const COSMETICS: readonly CosmeticItem[] = [
  // Themes — free (the palettes everyone already had), basic, advanced, collections, reward.
  ...FREE_THEMES.map((p): CosmeticItem => ({ id: `theme-${p}`, slot: 'theme', price: null, free: true, palette: p })),
  { id: 'theme-mono', slot: 'theme', price: 300, palette: 'mono' },
  { id: 'theme-forest', slot: 'theme', price: 350, palette: 'forest' },
  { id: 'theme-ocean', slot: 'theme', price: 350, palette: 'ocean' },
  { id: 'theme-sakura', slot: 'theme', price: 450, palette: 'sakura' },
  { id: 'theme-academia', slot: 'theme', price: 600, palette: 'academia' },
  { id: 'theme-galaxy', slot: 'theme', price: 750, palette: 'galaxy' },
  { id: 'theme-neon', slot: 'theme', price: 800, palette: 'neon' },
  { id: 'theme-arcade', slot: 'theme', price: 900, palette: 'arcade' },
  { id: 'theme-momiji', slot: 'theme', price: 500, palette: 'momiji', collection: 'ja' },
  { id: 'theme-bauhaus', slot: 'theme', price: 500, palette: 'bauhaus', collection: 'de' },
  { id: 'theme-mediterraneo', slot: 'theme', price: 500, palette: 'mediterraneo', collection: 'es' },
  { id: 'theme-laurel', slot: 'theme', price: null, palette: 'laurel', rewardOf: 'beginner-course' },

  // Avatar frames.
  { id: 'frame-double', slot: 'frame', price: 150 },
  { id: 'frame-gold', slot: 'frame', price: 200 },
  { id: 'frame-stars', slot: 'frame', price: 250 },
  { id: 'frame-rainbow', slot: 'frame', price: 350 },
  { id: 'frame-washi', slot: 'frame', price: 250, collection: 'ja' },
  { id: 'frame-bauhaus', slot: 'frame', price: 250, collection: 'de' },
  { id: 'frame-azulejo', slot: 'frame', price: 250, collection: 'es' },
  { id: 'frame-week', slot: 'frame', price: null, rewardOf: 'streak-7' },
  { id: 'frame-soundwave', slot: 'frame', price: null, rewardOf: 'marathon' },
  { id: 'frame-tricolor', slot: 'frame', price: null, rewardOf: 'polyglot', collection: 'multi' },

  // Profile backgrounds.
  { id: 'banner-sunset', slot: 'banner', price: 200 },
  { id: 'banner-waves', slot: 'banner', price: 250 },
  { id: 'banner-aurora', slot: 'banner', price: 300 },
  { id: 'banner-stars', slot: 'banner', price: 300 },
  { id: 'banner-momiji', slot: 'banner', price: 300, collection: 'ja' },
  { id: 'banner-geometry', slot: 'banner', price: 300, collection: 'de' },
  { id: 'banner-tiles', slot: 'banner', price: 300, collection: 'es' },

  // Badges shown next to the name.
  { id: 'badge-star', slot: 'badge', price: 150, icon: '⭐' },
  { id: 'badge-heart', slot: 'badge', price: 150, icon: '💜' },
  { id: 'badge-rocket', slot: 'badge', price: 250, icon: '🚀' },
  { id: 'badge-crown', slot: 'badge', price: 350, icon: '👑' },
  { id: 'badge-ink', slot: 'badge', price: 150, icon: '🖌️', collection: 'ja' },
  { id: 'badge-geo', slot: 'badge', price: 150, icon: '🔺', collection: 'de' },
  { id: 'badge-sun', slot: 'badge', price: 150, icon: '☀️', collection: 'es' },
  { id: 'badge-starter', slot: 'badge', price: null, icon: '👣', rewardOf: 'first-lesson' },
  { id: 'badge-purse', slot: 'badge', price: null, icon: '👛', rewardOf: 'coins-100' },
  { id: 'badge-reviewer', slot: 'badge', price: null, icon: '🧠', rewardOf: 'reviews-100' },

  // Titles under the name.
  { id: 'title-explorer', slot: 'title', price: 100 },
  { id: 'title-early-bird', slot: 'title', price: 150 },
  { id: 'title-night-owl', slot: 'title', price: 150 },
  { id: 'title-listener', slot: 'title', price: 150 },
  { id: 'title-wordsmith', slot: 'title', price: 200 },
  { id: 'title-polyglot', slot: 'title', price: null, rewardOf: 'polyglot', collection: 'multi' },
  { id: 'title-graduate', slot: 'title', price: null, rewardOf: 'beginner-course' },

  // Progress bar styles.
  { id: 'bar-stripes', slot: 'bar', price: 150 },
  { id: 'bar-gold', slot: 'bar', price: 150 },
  { id: 'bar-candy', slot: 'bar', price: 200 },
  { id: 'bar-pixel', slot: 'bar', price: 200 },
  { id: 'bar-gradient', slot: 'bar', price: 250 },

  // Celebrations when a lesson or session is finished (static with reduced motion).
  { id: 'fx-confetti', slot: 'fx', price: 250 },
  { id: 'fx-stars', slot: 'fx', price: 300 },
  { id: 'fx-fireworks', slot: 'fx', price: 450 },
  { id: 'fx-petals', slot: 'fx', price: 350, collection: 'ja' },
];

export const BUNDLES: readonly Bundle[] = [
  { id: 'bundle-ja', collection: 'ja', items: ['theme-momiji', 'frame-washi', 'banner-momiji', 'badge-ink', 'fx-petals'], price: 1250 },
  { id: 'bundle-de', collection: 'de', items: ['theme-bauhaus', 'frame-bauhaus', 'banner-geometry', 'badge-geo'], price: 1000 },
  { id: 'bundle-es', collection: 'es', items: ['theme-mediterraneo', 'frame-azulejo', 'banner-tiles', 'badge-sun'], price: 1000 },
];

const BY_ID = new Map(COSMETICS.map((c) => [c.id, c]));

export function getItem(id: string | null | undefined): CosmeticItem | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function getBundle(id: string): Bundle | undefined {
  return BUNDLES.find((b) => b.id === id);
}

export function themeItemFor(palette: string): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.slot === 'theme' && c.palette === palette);
}

/** Items an achievement unlocks. */
export function rewardItemsOf(achievementId: string): CosmeticItem[] {
  return COSMETICS.filter((c) => c.rewardOf === achievementId);
}

/**
 * What a bundle costs now: its price reduced in proportion to the items already owned, rounded
 * to 10 coins. 0 when everything in it is owned.
 */
export function bundlePrice(bundle: Bundle, owned: ReadonlySet<string>): number {
  const items = bundle.items.map((id) => BY_ID.get(id)!);
  const full = items.reduce((n, i) => n + (i.price ?? 0), 0);
  const missing = items.filter((i) => !owned.has(i.id)).reduce((n, i) => n + (i.price ?? 0), 0);
  if (!missing) return 0;
  return Math.max(10, Math.round((bundle.price * missing) / full / 10) * 10);
}
