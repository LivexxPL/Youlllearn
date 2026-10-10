/**
 * Colour themes ("palettes"). The classic palette is defined in src/styles/tokens.css and is
 * repeated here only for the theme picker and the contrast tests; every other palette
 * overrides the colour tokens at runtime (src/services/appearance.ts), in a light and a dark
 * version. src/config/palettes.test.ts checks the text contrast of every palette (WCAG AA).
 */

export type PaletteId = 'classic' | 'strawberry' | 'mint' | 'lavender' | 'peach' | 'lemon' | 'sky' | 'candy';

/** Small shapes repeated in the page background of a palette. */
export type Motif = 'none' | 'hearts' | 'leaves' | 'sparkles' | 'bubbles' | 'dots' | 'clouds' | 'confetti';

/** Colours of one palette in one mode (all opaque #rrggbb). */
export interface PaletteColors {
  bg: string;
  bgElevated: string;
  surface: string;
  surface2: string;
  surface3: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  /** 3D edge under primary buttons. */
  primaryEdge: string;
  onPrimary: string;
  /** Accent used as text (on surfaces). */
  accent: string;
  /** Accent backgrounds: the main "continue" button, rewards, level badge. */
  accentBright: string;
  accentSoft: string;
  accentDeep: string;
  accentEdge: string;
  onAccent: string;
  /** Hero card gradient and the text on it. */
  heroFrom: string;
  heroTo: string;
  onHero: string;
  onHeroMuted: string;
  heroPressedFg: string;
  chartBar: string;
  /** Colour of the background motif. */
  ink: string;
}

export interface Palette {
  id: PaletteId;
  emoji: string;
  motif: Motif;
  light: PaletteColors;
  dark: PaletteColors;
}

export const PALETTES: readonly Palette[] = [
  {
    id: 'classic',
    emoji: '🌊',
    motif: 'none',
    light: {
      bg: '#fbf8f3',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#f4efe7',
      surface3: '#ebe4d8',
      text: '#17202b',
      textMuted: '#4f5b69',
      textSubtle: '#6b7684',
      border: '#e4dccf',
      borderStrong: '#cfc4b3',
      primary: '#0f766e',
      primaryStrong: '#0b5e57',
      primarySoft: '#d5f5ef',
      primaryEdge: '#0b5e57',
      onPrimary: '#ffffff',
      accent: '#a84c07',
      accentBright: '#f59e0b',
      accentSoft: '#fdf0d5',
      accentDeep: '#d97706',
      accentEdge: '#b45309',
      onAccent: '#2b1a00',
      heroFrom: '#0f766e',
      heroTo: '#0e5f73',
      onHero: '#ffffff',
      onHeroMuted: '#ecf4f3',
      heroPressedFg: '#0b4f49',
      chartBar: '#0d9488',
      ink: '#0f766e',
    },
    dark: {
      bg: '#0f141a',
      bgElevated: '#161d26',
      surface: '#161d26',
      surface2: '#1d2631',
      surface3: '#263241',
      text: '#e8edf2',
      textMuted: '#a9b4c0',
      textSubtle: '#8a96a3',
      border: '#2a3543',
      borderStrong: '#3a4757',
      primary: '#2dd4bf',
      primaryStrong: '#5eead4',
      primarySoft: '#113a37',
      primaryEdge: '#0d7d70',
      onPrimary: '#04211f',
      accent: '#fbbf24',
      accentBright: '#fbbf24',
      accentSoft: '#3a2d0c',
      accentDeep: '#d97706',
      accentEdge: '#b45309',
      onAccent: '#2b1a00',
      heroFrom: '#134e4a',
      heroTo: '#13394a',
      onHero: '#ffffff',
      onHeroMuted: '#ecf1f0',
      heroPressedFg: '#0b4f49',
      chartBar: '#0fa595',
      ink: '#2dd4bf',
    },
  },
  {
    id: 'strawberry',
    emoji: '🍓',
    motif: 'hearts',
    light: {
      bg: '#fff4f7',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#ffe8ef',
      surface3: '#ffd5e2',
      text: '#2d1621',
      textMuted: '#683f53',
      textSubtle: '#80566a',
      border: '#f6d6e1',
      borderStrong: '#eab5c7',
      primary: '#bd2459',
      primaryStrong: '#9b1747',
      primarySoft: '#ffdbe7',
      primaryEdge: '#8c1440',
      onPrimary: '#ffffff',
      accent: '#8a5a00',
      accentBright: '#ffe08a',
      accentSoft: '#fff4cc',
      accentDeep: '#ffc94d',
      accentEdge: '#d9a21b',
      onAccent: '#3d2c00',
      heroFrom: '#ffc4d8',
      heroTo: '#ffd9c4',
      onHero: '#3d1028',
      onHeroMuted: '#6a3a51',
      heroPressedFg: '#9b1747',
      chartBar: '#e0558a',
      ink: '#e0558a',
    },
    dark: {
      bg: '#1c1217',
      bgElevated: '#261820',
      surface: '#261820',
      surface2: '#301e29',
      surface3: '#3d2734',
      text: '#fbe9f0',
      textMuted: '#d8b6c5',
      textSubtle: '#bb94a5',
      border: '#432b39',
      borderStrong: '#57384a',
      primary: '#ff93bb',
      primaryStrong: '#ffb6d1',
      primarySoft: '#4a1f33',
      primaryEdge: '#c25a85',
      onPrimary: '#3d0c22',
      accent: '#ffd770',
      accentBright: '#ffd770',
      accentSoft: '#3a2f10',
      accentDeep: '#f0b93a',
      accentEdge: '#b8860b',
      onAccent: '#2b1a00',
      heroFrom: '#5a2140',
      heroTo: '#4a2a3f',
      onHero: '#ffffff',
      onHeroMuted: '#ead3de',
      heroPressedFg: '#8c1440',
      chartBar: '#e56a9a',
      ink: '#ff93bb',
    },
  },
  {
    id: 'mint',
    emoji: '🍃',
    motif: 'leaves',
    light: {
      bg: '#f1fbf6',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#e2f6eb',
      surface3: '#cbeddb',
      text: '#10261b',
      textMuted: '#3d5a4b',
      textSubtle: '#567262',
      border: '#d0eadb',
      borderStrong: '#a9d8be',
      primary: '#11745a',
      primaryStrong: '#0d5c47',
      primarySoft: '#cff3e2',
      primaryEdge: '#0b4e3c',
      onPrimary: '#ffffff',
      accent: '#a14a14',
      accentBright: '#ffc8ab',
      accentSoft: '#ffece1',
      accentDeep: '#ffa87c',
      accentEdge: '#d9784a',
      onAccent: '#4a1d05',
      heroFrom: '#c2f0da',
      heroTo: '#cbe9ff',
      onHero: '#0f2e22',
      onHeroMuted: '#365a4b',
      heroPressedFg: '#0d5c47',
      chartBar: '#23946a',
      ink: '#2f9e72',
    },
    dark: {
      bg: '#0f1914',
      bgElevated: '#15221b',
      surface: '#15221b',
      surface2: '#1b2b23',
      surface3: '#24382e',
      text: '#e6f6ee',
      textMuted: '#a9cbb9',
      textSubtle: '#8db19f',
      border: '#26392f',
      borderStrong: '#345243',
      primary: '#7ee2b8',
      primaryStrong: '#a6f0cf',
      primarySoft: '#173a2c',
      primaryEdge: '#3fa57c',
      onPrimary: '#062418',
      accent: '#ffb48f',
      accentBright: '#ffb48f',
      accentSoft: '#3a2216',
      accentDeep: '#f08a5d',
      accentEdge: '#b85c33',
      onAccent: '#3a1500',
      heroFrom: '#1d4a3a',
      heroTo: '#1b3a4a',
      onHero: '#ffffff',
      onHeroMuted: '#d2e4dc',
      heroPressedFg: '#0b4e3c',
      chartBar: '#4cc996',
      ink: '#7ee2b8',
    },
  },
  {
    id: 'lavender',
    emoji: '💜',
    motif: 'sparkles',
    light: {
      bg: '#f7f4ff',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#eee8ff',
      surface3: '#dfd5ff',
      text: '#1e1838',
      textMuted: '#4b436e',
      textSubtle: '#655c88',
      border: '#e3dcf7',
      borderStrong: '#c8bcef',
      primary: '#6a45c0',
      primaryStrong: '#553399',
      primarySoft: '#e6ddff',
      primaryEdge: '#482b85',
      onPrimary: '#ffffff',
      accent: '#ad2a6d',
      accentBright: '#ffc6e4',
      accentSoft: '#ffe7f3',
      accentDeep: '#ffa1d0',
      accentEdge: '#d46a9f',
      onAccent: '#4a0f30',
      heroFrom: '#ddd0ff',
      heroTo: '#ffd3eb',
      onHero: '#2a1650',
      onHeroMuted: '#53407a',
      heroPressedFg: '#553399',
      chartBar: '#8b6be0',
      ink: '#8b6be0',
    },
    dark: {
      bg: '#14111f',
      bgElevated: '#1c1830',
      surface: '#1c1830',
      surface2: '#251f3d',
      surface3: '#30294f',
      text: '#eeeaff',
      textMuted: '#bdb3e6',
      textSubtle: '#a197cd',
      border: '#2f2849',
      borderStrong: '#41385f',
      primary: '#b9a2ff',
      primaryStrong: '#d2c4ff',
      primarySoft: '#2e2453',
      primaryEdge: '#7a5fd1',
      onPrimary: '#1b0f3d',
      accent: '#ff9fcf',
      accentBright: '#ff9fcf',
      accentSoft: '#3d1a2e',
      accentDeep: '#f07ab5',
      accentEdge: '#b84d82',
      onAccent: '#3d0a26',
      heroFrom: '#3a2a6b',
      heroTo: '#4a2550',
      onHero: '#ffffff',
      onHeroMuted: '#ddd5ee',
      heroPressedFg: '#482b85',
      chartBar: '#9d85f0',
      ink: '#b9a2ff',
    },
  },
  {
    id: 'peach',
    emoji: '🍑',
    motif: 'bubbles',
    light: {
      bg: '#fff6f0',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#ffebdf',
      surface3: '#ffdac6',
      text: '#2e1a10',
      textMuted: '#664736',
      textSubtle: '#7f5c49',
      border: '#f5ddcd',
      borderStrong: '#e8c0a5',
      primary: '#ad3a09',
      primaryStrong: '#8b2e05',
      primarySoft: '#ffe1d0',
      primaryEdge: '#782704',
      onPrimary: '#ffffff',
      accent: '#0e716a',
      accentBright: '#a9e9e2',
      accentSoft: '#dcf6f3',
      accentDeep: '#6fd3c8',
      accentEdge: '#2f9c90',
      onAccent: '#053b36',
      heroFrom: '#ffd5bb',
      heroTo: '#ffe5ab',
      onHero: '#3d1c08',
      onHeroMuted: '#6b4128',
      heroPressedFg: '#8b2e05',
      chartBar: '#d9692a',
      ink: '#f08a4b',
    },
    dark: {
      bg: '#1a130f',
      bgElevated: '#241a14',
      surface: '#241a14',
      surface2: '#2e221a',
      surface3: '#3b2c22',
      text: '#fbeee6',
      textMuted: '#dcbfae',
      textSubtle: '#c09f8c',
      border: '#3f2f25',
      borderStrong: '#574134',
      primary: '#ffb38a',
      primaryStrong: '#ffcdb0',
      primarySoft: '#45281a',
      primaryEdge: '#c2794f',
      onPrimary: '#3a1503',
      accent: '#7fe0d4',
      accentBright: '#7fe0d4',
      accentSoft: '#143532',
      accentDeep: '#4fc9bb',
      accentEdge: '#2a8f84',
      onAccent: '#04302b',
      heroFrom: '#5a3320',
      heroTo: '#4d3a1f',
      onHero: '#ffffff',
      onHeroMuted: '#ecdcd0',
      heroPressedFg: '#782704',
      chartBar: '#f59c69',
      ink: '#ffb38a',
    },
  },
  {
    id: 'lemon',
    emoji: '🍋',
    motif: 'dots',
    light: {
      bg: '#fffbea',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#fff4c9',
      surface3: '#ffea9a',
      text: '#272108',
      textMuted: '#585024',
      textSubtle: '#716739',
      border: '#f2e7b6',
      borderStrong: '#e3d081',
      primary: '#536a00',
      primaryStrong: '#415300',
      primarySoft: '#edf5c6',
      primaryEdge: '#374700',
      onPrimary: '#ffffff',
      accent: '#2d58b2',
      accentBright: '#bfd9ff',
      accentSoft: '#e4eeff',
      accentDeep: '#8fb8ff',
      accentEdge: '#4f7fd1',
      onAccent: '#0d2a5c',
      heroFrom: '#fff1a6',
      heroTo: '#e2f6b2',
      onHero: '#2e2600',
      onHeroMuted: '#585024',
      heroPressedFg: '#415300',
      chartBar: '#7a9000',
      ink: '#c9a800',
    },
    dark: {
      bg: '#17150a',
      bgElevated: '#211e10',
      surface: '#211e10',
      surface2: '#2a2614',
      surface3: '#36311b',
      text: '#fbf7e2',
      textMuted: '#d8cfa2',
      textSubtle: '#bdb385',
      border: '#39341d',
      borderStrong: '#514a29',
      primary: '#f2e27a',
      primaryStrong: '#f8ec9f',
      primarySoft: '#3a3410',
      primaryEdge: '#b8a63a',
      onPrimary: '#2a2400',
      accent: '#a9c8ff',
      accentBright: '#a9c8ff',
      accentSoft: '#1b2740',
      accentDeep: '#7fa8f0',
      accentEdge: '#4a72b8',
      onAccent: '#0b2250',
      heroFrom: '#4a4416',
      heroTo: '#3a4a1c',
      onHero: '#ffffff',
      onHeroMuted: '#e6e3cc',
      heroPressedFg: '#374700',
      chartBar: '#d9cc4f',
      ink: '#f2e27a',
    },
  },
  {
    id: 'sky',
    emoji: '☁️',
    motif: 'clouds',
    light: {
      bg: '#f2f8ff',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#e3f0ff',
      surface3: '#cce2ff',
      text: '#10213a',
      textMuted: '#3d5375',
      textSubtle: '#576c8c',
      border: '#d6e5f7',
      borderStrong: '#b0caea',
      primary: '#1e5fbf',
      primaryStrong: '#174c99',
      primarySoft: '#d8e8ff',
      primaryEdge: '#123e7d',
      onPrimary: '#ffffff',
      accent: '#8a5a00',
      accentBright: '#ffe27a',
      accentSoft: '#fff4cc',
      accentDeep: '#ffd03d',
      accentEdge: '#c99a12',
      onAccent: '#3d2e00',
      heroFrom: '#d0e7ff',
      heroTo: '#e8ddff',
      onHero: '#13284d',
      onHeroMuted: '#3d5375',
      heroPressedFg: '#174c99',
      chartBar: '#4a8fe8',
      ink: '#4a8fe8',
    },
    dark: {
      bg: '#0e1522',
      bgElevated: '#141e30',
      surface: '#141e30',
      surface2: '#1a273d',
      surface3: '#23334f',
      text: '#e8f1ff',
      textMuted: '#aac0e0',
      textSubtle: '#8ea6c9',
      border: '#243450',
      borderStrong: '#34496b',
      primary: '#8fc2ff',
      primaryStrong: '#b5d6ff',
      primarySoft: '#1a3356',
      primaryEdge: '#4f86cc',
      onPrimary: '#08203f',
      accent: '#ffd970',
      accentBright: '#ffd970',
      accentSoft: '#3a3010',
      accentDeep: '#f2c13e',
      accentEdge: '#b88d16',
      onAccent: '#2b1f00',
      heroFrom: '#1d3a66',
      heroTo: '#2c2a5e',
      onHero: '#ffffff',
      onHeroMuted: '#d6dff0',
      heroPressedFg: '#123e7d',
      chartBar: '#5aa0f0',
      ink: '#8fc2ff',
    },
  },
  {
    id: 'candy',
    emoji: '🍭',
    motif: 'confetti',
    light: {
      bg: '#fdf5ff',
      bgElevated: '#ffffff',
      surface: '#ffffff',
      surface2: '#f7e9ff',
      surface3: '#ecd6fb',
      text: '#2a1636',
      textMuted: '#58406e',
      textSubtle: '#725a88',
      border: '#efdef7',
      borderStrong: '#dabfeb',
      primary: '#ac2899',
      primaryStrong: '#8c1e7c',
      primarySoft: '#fadcf4',
      primaryEdge: '#76196a',
      onPrimary: '#ffffff',
      accent: '#1a66a3',
      accentBright: '#bae4ff',
      accentSoft: '#e2f3ff',
      accentDeep: '#8acfff',
      accentEdge: '#4a9bd1',
      onAccent: '#0a3050',
      heroFrom: '#ffcaed',
      heroTo: '#c9e7ff',
      onHero: '#3a1240',
      onHeroMuted: '#5f3966',
      heroPressedFg: '#8c1e7c',
      chartBar: '#d65cc3',
      ink: '#d65cc3',
    },
    dark: {
      bg: '#170f1c',
      bgElevated: '#211628',
      surface: '#211628',
      surface2: '#2a1c33',
      surface3: '#372542',
      text: '#fbeaff',
      textMuted: '#d8b8e6',
      textSubtle: '#bc9bcc',
      border: '#3a2846',
      borderStrong: '#533a63',
      primary: '#f5a0e6',
      primaryStrong: '#fbc2f0',
      primarySoft: '#48204a',
      primaryEdge: '#b95ea8',
      onPrimary: '#3a0a33',
      accent: '#9fd6ff',
      accentBright: '#9fd6ff',
      accentSoft: '#13283a',
      accentDeep: '#6fbdf2',
      accentEdge: '#3a86bd',
      onAccent: '#06263f',
      heroFrom: '#5a2257',
      heroTo: '#23406b',
      onHero: '#ffffff',
      onHeroMuted: '#e4d6ea',
      heroPressedFg: '#76196a',
      chartBar: '#e07ad0',
      ink: '#f5a0e6',
    },
  },
];

export const PALETTE_IDS: readonly PaletteId[] = PALETTES.map((p) => p.id);

export function getPalette(id: string | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

/** True when the hero card is light (pastel) and carries dark text. */
export function heroIsLight(c: PaletteColors): boolean {
  return relativeLuminance(c.onHero) < 0.2;
}

// ---------------------------------------------------------------------------
// Colour maths (WCAG 2.x)

export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Not a #rrggbb colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// Background motifs: one 72×72 tile, drawn in the palette's ink colour at low opacity.

const MOTIFS: Record<Exclude<Motif, 'none'>, (ink: string, ink2: string) => string> = {
  hearts: (ink) =>
    `<g fill="${ink}"><path transform="translate(12 12) rotate(-14 7 6)" d="M7 12.5S0 8 0 3.9C0 1.7 1.7 0 3.9 0 5.3 0 6.4.8 7 1.9 7.6.8 8.7 0 10.1 0 12.3 0 14 1.7 14 3.9 14 8 7 12.5 7 12.5Z"/><path transform="translate(46 44) rotate(12 5 4.5) scale(.72)" d="M7 12.5S0 8 0 3.9C0 1.7 1.7 0 3.9 0 5.3 0 6.4.8 7 1.9 7.6.8 8.7 0 10.1 0 12.3 0 14 1.7 14 3.9 14 8 7 12.5 7 12.5Z"/></g>`,
  leaves: (ink) =>
    `<g fill="${ink}"><path transform="translate(10 14) rotate(-30 8 5)" d="M0 5C3 -1 13 -1 16 5 13 11 3 11 0 5Z"/><path transform="translate(46 46) rotate(35 6 4) scale(.7)" d="M0 5C3 -1 13 -1 16 5 13 11 3 11 0 5Z"/></g>`,
  sparkles: (ink) =>
    `<g fill="${ink}"><path transform="translate(12 10)" d="M7 0 8.6 5.4 14 7 8.6 8.6 7 14 5.4 8.6 0 7 5.4 5.4Z"/><path transform="translate(48 46) scale(.6)" d="M7 0 8.6 5.4 14 7 8.6 8.6 7 14 5.4 8.6 0 7 5.4 5.4Z"/><circle cx="54" cy="18" r="1.6"/><circle cx="20" cy="54" r="1.2"/></g>`,
  bubbles: (ink) =>
    `<g fill="none" stroke="${ink}" stroke-width="1.6"><circle cx="18" cy="18" r="7"/><circle cx="52" cy="50" r="4"/><circle cx="58" cy="22" r="2.2"/></g>`,
  dots: (ink) =>
    `<g fill="${ink}"><ellipse cx="18" cy="18" rx="2.2" ry="3.4" transform="rotate(25 18 18)"/><ellipse cx="54" cy="54" rx="2.2" ry="3.4" transform="rotate(-20 54 54)"/><ellipse cx="54" cy="16" rx="1.6" ry="2.4" transform="rotate(60 54 16)"/></g>`,
  clouds: (ink) =>
    `<g fill="${ink}"><path transform="translate(8 14)" d="M5 11h13a4.5 4.5 0 0 0 .4-9 6 6 0 0 0-11.3 1.3A4 4 0 0 0 5 11Z"/><path transform="translate(42 46) scale(.7)" d="M5 11h13a4.5 4.5 0 0 0 .4-9 6 6 0 0 0-11.3 1.3A4 4 0 0 0 5 11Z"/></g>`,
  confetti: (ink, ink2) =>
    `<rect x="10" y="12" width="9" height="3.4" rx="1.7" fill="${ink}" transform="rotate(-30 14 14)"/><rect x="46" y="16" width="8" height="3.2" rx="1.6" fill="${ink2}" transform="rotate(40 50 18)"/><rect x="20" y="48" width="8" height="3.2" rx="1.6" fill="${ink2}" transform="rotate(15 24 50)"/><rect x="50" y="52" width="9" height="3.4" rx="1.7" fill="${ink}" transform="rotate(-55 54 54)"/><circle cx="34" cy="32" r="1.8" fill="${ink}"/>`,
};

/** CSS `background-image` value for a palette's motif, or `none`. */
export function motifImage(palette: Palette, mode: 'light' | 'dark'): string {
  if (palette.motif === 'none') return 'none';
  const c = palette[mode];
  const opacity = mode === 'dark' ? 0.09 : 0.13;
  const shapes = MOTIFS[palette.motif](c.ink, c.accentDeep);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g opacity="${opacity}">${shapes}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * CSS custom properties for a palette. The classic palette returns {} (tokens.css applies),
 * so switching back to it simply removes the overrides.
 */
export function paletteVars(palette: Palette, mode: 'light' | 'dark', pattern: boolean): Record<string, string> {
  if (palette.id === 'classic') return {};
  const c = palette[mode];
  const lightHero = heroIsLight(c);
  const [r, g, b] = hexToRgb(c.onHero);
  return {
    '--bg': c.bg,
    '--bg-elevated': c.bgElevated,
    '--surface': c.surface,
    '--surface-2': c.surface2,
    '--surface-3': c.surface3,
    '--text': c.text,
    '--text-muted': c.textMuted,
    '--text-subtle': c.textSubtle,
    '--border': c.border,
    '--border-strong': c.borderStrong,
    '--primary': c.primary,
    '--primary-strong': c.primaryStrong,
    '--primary-soft': c.primarySoft,
    '--primary-edge': c.primaryEdge,
    '--on-primary': c.onPrimary,
    '--accent': c.accent,
    '--accent-bright': c.accentBright,
    '--accent-soft': c.accentSoft,
    '--accent-deep': c.accentDeep,
    '--accent-edge': c.accentEdge,
    '--on-accent': c.onAccent,
    '--hero-bg': `linear-gradient(145deg, ${c.heroFrom} 0%, ${c.heroTo} 100%)`,
    '--on-hero': c.onHero,
    '--on-hero-muted': c.onHeroMuted,
    '--hero-overlay': lightHero ? 'rgb(255 255 255 / 0.55)' : 'rgb(255 255 255 / 0.16)',
    '--hero-overlay-strong': lightHero ? `rgb(${r} ${g} ${b} / 0.2)` : 'rgb(255 255 255 / 0.28)',
    '--hero-pressed-fg': c.heroPressedFg,
    '--hero-outline': lightHero ? `rgb(${r} ${g} ${b} / 0.45)` : 'rgb(255 255 255 / 0.6)',
    '--chart-bar': c.chartBar,
    '--bg-pattern': pattern ? motifImage(palette, mode) : 'none',
  };
}

/** Every custom property a palette may set (to clear them when switching palettes). */
export const PALETTE_VAR_NAMES: readonly string[] = Object.keys(paletteVars(PALETTES[1], 'light', true));
