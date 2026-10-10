/**
 * Applies the display settings (light/dark, colour palette, motion, text size) to <html>.
 *
 * The result is also cached in localStorage so that index.html can paint the right colours
 * before the app and its database have loaded (no flash of the default theme on start).
 */
import { PALETTE_VAR_NAMES, getPalette, heroIsLight, paletteVars, type PaletteId } from '../config/palettes';

export interface Appearance {
  theme: 'light' | 'dark';
  motion: 'reduce' | 'full';
  textScale: number;
  palette: PaletteId;
  /** Background motif of pastel palettes. */
  pattern: boolean;
}

/** Read by the inline script in index.html; keep both in sync. */
export const APPEARANCE_CACHE_KEY = 'pq.appearance';

/** Applies the appearance and returns the colour used for the browser / system bars. */
export function applyAppearance(a: Appearance, root: HTMLElement = document.documentElement): string {
  const palette = getPalette(a.palette);
  const vars = paletteVars(palette, a.theme, a.pattern);
  const hero = heroIsLight(palette[a.theme]) ? 'light' : 'dark';
  root.dataset.theme = a.theme;
  root.dataset.motion = a.motion;
  root.dataset.palette = palette.id;
  root.dataset.hero = hero;
  root.style.setProperty('--text-scale', String(a.textScale));
  for (const name of PALETTE_VAR_NAMES) if (!(name in vars)) root.style.removeProperty(name);
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);

  const barColor = palette[a.theme].bg;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', barColor));
  try {
    localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify({ theme: a.theme, palette: palette.id, hero, vars }));
  } catch {
    // Storage unavailable: the next start paints the default colours until settings load.
  }
  return barColor;
}
