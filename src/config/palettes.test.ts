import { describe, expect, it } from 'vitest';
import tokensCss from '../styles/tokens.css?raw';
import { PALETTES, PALETTE_VAR_NAMES, contrastRatio, getPalette, heroIsLight, motifImage, paletteVars, type PaletteColors } from './palettes';

/** Custom properties of one rule block in tokens.css, e.g. `[data-theme='dark'] {`. */
function cssBlock(css: string, opening: string): Record<string, string> {
  const start = css.indexOf(opening);
  if (start < 0) throw new Error(`Block not found: ${opening}`);
  const body = css.slice(start + opening.length, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

const cssModes = {
  light: cssBlock(tokensCss, ":root,\n[data-theme='light'] {"),
  dark: cssBlock(tokensCss, "[data-theme='dark'] {"),
};

/** tokens.css name -> PaletteColors key, for the tokens both define. */
const SHARED: [string, keyof PaletteColors][] = [
  ['bg', 'bg'],
  ['bg-elevated', 'bgElevated'],
  ['surface', 'surface'],
  ['surface-2', 'surface2'],
  ['surface-3', 'surface3'],
  ['text', 'text'],
  ['text-muted', 'textMuted'],
  ['text-subtle', 'textSubtle'],
  ['border', 'border'],
  ['border-strong', 'borderStrong'],
  ['primary', 'primary'],
  ['primary-strong', 'primaryStrong'],
  ['primary-soft', 'primarySoft'],
  ['primary-edge', 'primaryEdge'],
  ['on-primary', 'onPrimary'],
  ['accent', 'accent'],
  ['accent-bright', 'accentBright'],
  ['accent-soft', 'accentSoft'],
  ['accent-deep', 'accentDeep'],
  ['accent-edge', 'accentEdge'],
  ['on-accent', 'onAccent'],
  ['on-hero', 'onHero'],
  ['hero-pressed-fg', 'heroPressedFg'],
];

describe('colour palettes', () => {
  it('describe the classic palette exactly as tokens.css does', () => {
    const classic = getPalette('classic');
    for (const mode of ['light', 'dark'] as const) {
      for (const [css, key] of SHARED) {
        expect(classic[mode][key], `${mode} --${css}`).toBe(cssModes[mode][css]);
      }
    }
  });

  describe.each(PALETTES.flatMap((p) => (['light', 'dark'] as const).map((mode) => [`${p.id} ${mode}`, p[mode], mode] as const)))(
    '%s',
    (_name, c, mode) => {
      const semantic = cssModes[mode];
      const check = (fg: string, bg: string, min: number, what: string) =>
        expect(contrastRatio(fg, bg), `${what}: ${fg} on ${bg}`).toBeGreaterThanOrEqual(min);

      it('keeps body text readable everywhere (AAA)', () => {
        for (const bg of [c.bg, c.surface, c.surface2, c.surface3]) check(c.text, bg, 7, 'text');
      });

      it('meets WCAG AA for secondary text, links and buttons', () => {
        for (const bg of [c.bg, c.surface, c.surface2]) check(c.textMuted, bg, 4.5, 'muted text');
        check(c.textSubtle, c.surface, 4.5, 'subtle text');
        for (const bg of [c.bg, c.surface, c.surface2, c.primarySoft]) check(c.primary, bg, 4.5, 'primary text');
        check(c.onPrimary, c.primary, 4.5, 'primary button');
        for (const bg of [c.bg, c.surface, c.accentSoft]) check(c.accent, bg, 4.5, 'accent text');
        for (const bg of [c.accentBright, c.accentDeep]) check(c.onAccent, bg, 4.5, 'accent button / badge');
        check(c.heroPressedFg, '#ffffff', 4.5, 'selected option on the hero card');
      });

      it('keeps the hero card readable', () => {
        for (const bg of [c.heroFrom, c.heroTo]) {
          check(c.onHero, bg, 4.5, 'hero text');
          check(c.onHeroMuted, bg, 4.5, 'hero secondary text');
        }
      });

      it('keeps status colours readable on cards', () => {
        for (const name of ['success', 'danger', 'info']) check(semantic[name], c.surface, 4.5, name);
      });

      it('draws chart bars that stand out from the card (non-text contrast)', () => {
        check(c.chartBar, c.surface, 3, 'chart bars');
      });

      it('matches the mode', () => {
        const darkBg = contrastRatio(c.bg, '#000000') < contrastRatio(c.bg, '#ffffff');
        expect(darkBg).toBe(mode === 'dark');
      });
    },
  );

  it('overrides nothing for the classic palette and everything else for the others', () => {
    expect(paletteVars(getPalette('classic'), 'light', true)).toEqual({});
    for (const p of PALETTES.filter((x) => x.id !== 'classic')) {
      expect(Object.keys(paletteVars(p, 'dark', true)).sort()).toEqual([...PALETTE_VAR_NAMES].sort());
    }
  });

  it('uses the primary colour for the main button on pastel hero cards', () => {
    // Light heroes carry dark text; the stylesheet then switches the hero button to the primary colour.
    expect(heroIsLight(getPalette('strawberry').light)).toBe(true);
    expect(heroIsLight(getPalette('strawberry').dark)).toBe(false);
    expect(heroIsLight(getPalette('classic').light)).toBe(false);
  });

  it('draws a background motif only when asked to', () => {
    const candy = getPalette('candy');
    expect(motifImage(candy, 'light')).toMatch(/^url\("data:image\/svg\+xml,/);
    expect(paletteVars(candy, 'light', false)['--bg-pattern']).toBe('none');
    expect(motifImage(getPalette('classic'), 'light')).toBe('none');
  });

  it('falls back to the classic palette for unknown ids', () => {
    expect(getPalette('neon').id).toBe('classic');
    expect(getPalette(undefined).id).toBe('classic');
  });
});
