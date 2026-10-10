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
  /**
   * Where people get the app. CI publishes the web app to GitHub Pages and the newest Android
   * APK to the rolling GitHub release "android-latest" (see .github/workflows).
   */
  links: {
    web: 'https://livexxpl.github.io/Youlllearn/',
    androidApk: 'https://github.com/LivexxPL/Youlllearn/releases/download/android-latest/polyglot-quest.apk',
    androidRelease: 'https://github.com/LivexxPL/Youlllearn/releases/tag/android-latest',
  },
} as const;

export type Brand = typeof brand;
