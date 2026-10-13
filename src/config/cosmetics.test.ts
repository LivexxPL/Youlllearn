import { describe, expect, it } from 'vitest';
import { BUNDLES, COSMETICS, bundlePrice, getItem, rewardItemsOf, themeItemFor } from './cosmetics';
import { PALETTE_IDS } from './palettes';
import { ACHIEVEMENTS } from '../engine/gamification';
import { pl } from '../i18n/pl';

const catalog = pl as Record<string, unknown>;

describe('cosmetics catalogue', () => {
  it('has unique ids, whole-number prices and valid slots', () => {
    expect(new Set(COSMETICS.map((c) => c.id)).size).toBe(COSMETICS.length);
    for (const c of COSMETICS) {
      expect(['theme', 'frame', 'banner', 'badge', 'title', 'bar', 'fx']).toContain(c.slot);
      if (c.price !== null) expect(Number.isInteger(c.price) && c.price >= 100 && c.price <= 1500, c.id).toBe(true);
      else expect(c.free || c.rewardOf, `${c.id} must be free or a reward`).toBeTruthy();
    }
  });

  it('names every item, bundle, slot, tab and collection in Polish', () => {
    for (const c of COSMETICS) {
      const key = c.slot === 'theme' ? `palette.${c.palette}` : `cos.${c.id}`;
      expect(catalog[key], key).toBeTruthy();
    }
    for (const b of BUNDLES) expect(catalog[`bundle.${b.id}`], b.id).toBeTruthy();
    for (const k of ['theme', 'frame', 'banner', 'badge', 'title', 'bar', 'fx']) expect(catalog[`shop.slot.${k}`]).toBeTruthy();
    for (const k of ['themes', 'profile', 'interface', 'collections']) expect(catalog[`shop.tab.${k}`]).toBeTruthy();
    for (const k of ['ja', 'de', 'es', 'multi']) expect(catalog[`shop.collection.${k}`]).toBeTruthy();
  });

  it('has a theme item for every colour palette, and the original palettes stay free', () => {
    for (const id of PALETTE_IDS) expect(themeItemFor(id), id).toBeTruthy();
    for (const c of COSMETICS.filter((x) => x.slot === 'theme')) expect(PALETTE_IDS, c.id).toContain(c.palette);
    expect(COSMETICS.filter((c) => c.free).map((c) => c.palette)).toEqual(['classic', 'strawberry', 'mint', 'lavender', 'peach', 'lemon', 'sky', 'candy']);
  });

  it('rewards only real achievements, and the requested milestones give items', () => {
    const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
    for (const c of COSMETICS.filter((x) => x.rewardOf)) expect(ids, c.id).toContain(c.rewardOf);
    for (const a of ['first-lesson', 'coins-100', 'streak-7', 'reviews-100', 'marathon', 'beginner-course', 'polyglot']) {
      expect(rewardItemsOf(a).length, a).toBeGreaterThan(0);
    }
  });

  it('prices bundles at 1000–1500 coins, below their items bought one by one', () => {
    for (const b of BUNDLES) {
      const items = b.items.map((id) => getItem(id));
      expect(items.every((i) => i && i.price !== null && i.collection === b.collection), b.id).toBe(true);
      const sum = items.reduce((n, i) => n + i!.price!, 0);
      expect(b.price).toBeLessThan(sum);
      expect(b.price).toBeGreaterThanOrEqual(1000);
      expect(b.price).toBeLessThanOrEqual(1500);
      expect(bundlePrice(b, new Set())).toBe(b.price);
      expect(bundlePrice(b, new Set(b.items))).toBe(0);
    }
  });
});
