import type { CapacitorConfig } from '@capacitor/cli';

// Keep appId/appName/colours in sync with src/config/brand.ts
// (src/config/brand.test.ts fails if they drift apart). The Capacitor CLI
// evaluates this file on its own, so it deliberately has no local imports.
const config: CapacitorConfig = {
  appId: 'com.polyglotquest.app',
  appName: 'Polyglot Quest',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    // Keeps WebView debugging available in debug builds only.
    webContentsDebuggingEnabled: undefined,
  },
  plugins: {
    SystemBars: {
      // Injects --safe-area-inset-* CSS variables (Capacitor 8 default) so the
      // edge-to-edge layout on Android 15+ keeps content clear of system bars.
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    SplashScreen: {
      launchShowDuration: 600,
      launchAutoHide: true,
      backgroundColor: '#fbf8f3',
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_polyglot',
      iconColor: '#0f766e',
    },
  },
};

export default config;
