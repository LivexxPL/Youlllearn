/**
 * Branding lives in one place so the product name, colours and identifiers
 * are easy to change. `capacitor.config.ts`, the PWA manifest (vite.config.ts)
 * and the UI all read from here.
 */
export const brand = {
  appName: 'Polyglot Quest',
  shortName: 'Polyglot',
  /** Android application id / iOS bundle id. Change before publishing. */
  appId: 'com.polyglotquest.app',
  tagline: 'Nauka języków krok po kroku: słuchaj, mów, pisz.',
  description:
    'Nauka hiszpańskiego, niemieckiego i japońskiego od zera: krótkie lekcje, nauka ze słuchu, powtórki z odstępami i pisanie rysikiem.',
  themeColor: '#0f766e',
  backgroundColor: '#fbf8f3',
  darkBackgroundColor: '#0f141a',
} as const;

export type Brand = typeof brand;
