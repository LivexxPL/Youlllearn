/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { brand } from './src/config/brand.ts';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

// `vite build --mode native` produces the bundle packaged by Capacitor.
// The native app ships every file inside the APK, so it does not need a service worker.
export default defineConfig(({ mode }) => {
  const isNative = mode === 'native';
  const plugins: PluginOption[] = [react()];

  if (!isNative) {
    plugins.push(
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
        manifest: {
          name: brand.appName,
          short_name: brand.shortName,
          description: brand.description,
          lang: 'pl',
          dir: 'ltr',
          start_url: './',
          scope: './',
          display: 'standalone',
          orientation: 'any',
          theme_color: brand.themeColor,
          background_color: brand.backgroundColor,
          categories: ['education'],
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2,json,webmanifest}'],
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          navigateFallback: 'index.html',
          cleanupOutdatedCaches: true,
        },
      }),
    );
  }

  return {
    base: './',
    plugins,
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TARGET__: JSON.stringify(isNative ? 'native' : 'web'),
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1200,
    },
    server: {
      host: true,
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
      setupFiles: ['src/test/setup.ts'],
    },
  };
});
