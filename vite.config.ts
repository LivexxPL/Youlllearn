/// <reference types="vitest/config" />
import { createReadStream, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { brand } from './src/config/brand.ts';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

/**
 * The Japanese dictionary of kuromoji (IPADIC, ~17 MB compressed) for Music Lab's analysis.
 * Served in development and copied into web builds as kuromoji/*.dic; it is not precached by the
 * service worker — the analysis worker downloads it on first use and keeps it in the Cache API.
 * The Android build leaves it out and downloads it from the published web app instead.
 */
function kuromojiDictionary(emit: boolean): Plugin {
  const dir = fileURLToPath(new URL('./node_modules/kuromoji/dict/', import.meta.url));
  return {
    name: 'polyglot-kuromoji-dictionary',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = /\/kuromoji\/([a-z_]+)\.dic(?:\?.*)?$/.exec(req.url ?? '');
        if (!m) return next();
        res.setHeader('Content-Type', 'application/octet-stream');
        createReadStream(join(dir, `${m[1]}.dat.gz`))
          .on('error', () => {
            res.statusCode = 404;
            res.end();
          })
          .pipe(res);
      });
    },
    generateBundle() {
      if (!emit) return;
      for (const name of readdirSync(dir).filter((n) => n.endsWith('.dat.gz'))) {
        // Served as .dic (see src/music/japanese/dictionary.ts): still gzip data inside.
        this.emitFile({ type: 'asset', fileName: `kuromoji/${name.replace(/\.dat\.gz$/, '.dic')}`, source: readFileSync(join(dir, name)) });
      }
    },
  };
}

// `vite build --mode native` produces the bundle packaged by Capacitor.
// The native app ships every file inside the APK, so it does not need a service
// worker: the PWA plugin is disabled there (it still provides no-op virtual modules).
export default defineConfig(({ mode }) => {
  const isNative = mode === 'native';
  const plugins: PluginOption[] = [
    react(),
    kuromojiDictionary(!isNative),
    VitePWA({
      disable: isNative,
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
        // The optional AI assistant's SDK is only loaded online (it calls the Anthropic API).
        globIgnores: ['**/assets/sdk-*.js', '**/assets/json-schema-*.js'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ];

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
    worker: {
      format: 'es',
    },
    server: {
      host: true,
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
      setupFiles: ['src/test/setup.ts'],
      // tokens.css is read as text by src/config/palettes.test.ts (other CSS stays stubbed).
      css: { include: [/tokens\.css/] },
    },
  };
});
