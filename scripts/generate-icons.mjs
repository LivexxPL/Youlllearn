#!/usr/bin/env node
/**
 * Generates every app icon from one SVG source, using the brand colours in
 * src/config/brand.ts:
 *
 *   public/favicon.svg
 *   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png
 *   android/… (only when the android/ project exists):
 *     ic_launcher.png, ic_launcher_round.png, ic_launcher_foreground.png in each mipmap density
 *     splash.png in drawable and the drawable-port/-land densities (template sizes)
 *     drawable/ic_stat_polyglot.xml (notification icon), drawable/ic_launcher_monochrome.xml
 *     values/ic_launcher_background.xml, values(-night)/brand_colors.xml
 *
 * PNGs are rendered with Playwright's Chromium (the same browser the E2E
 * tests use). Run: npm run icons
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brandSrc = readFileSync(join(root, 'src/config/brand.ts'), 'utf8');
const color = (key) => {
  const m = brandSrc.match(new RegExp(`${key}:\\s*'(#[0-9a-fA-F]{6})'`));
  if (!m) throw new Error(`brand.${key} not found in src/config/brand.ts`);
  return m[1];
};
const THEME = color('themeColor');
const BG = color('backgroundColor');
const BG_DARK = color('darkBackgroundColor');
const ACCENT = '#f59e0b';

// Compass glyph in a 64×64 box: ring, needle (accent half points north), hub.
const glyph = (hub = THEME) => `
  <circle cx="32" cy="32" r="19" fill="none" stroke="#fff" stroke-width="3.5" opacity="0.92"/>
  <path d="M32 15 L38 32 L32 49 L26 32 Z" fill="#fff"/>
  <path d="M32 15 L38 32 L26 32 Z" fill="${ACCENT}"/>
  <circle cx="32" cy="32" r="3.2" fill="${hub}"/>`;

const scaled = (s, inner) => `<g transform="translate(32 32) scale(${s}) translate(-32 -32)">${inner}</g>`;
const svg = (body, size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">${body}</svg>`;

const ART = {
  /** Rounded square — favicon and "any" purpose PWA icons. */
  rounded: (size) => svg(`<rect width="64" height="64" rx="14" fill="${THEME}"/>${glyph()}`, size),
  /** Full-bleed square, glyph inside the maskable safe zone (radius 40%). */
  fullBleed: (size) => svg(`<rect width="64" height="64" fill="${THEME}"/>${scaled(0.95, glyph())}`, size),
  /** Legacy Android launcher (pre-API 26): rounded square with a small margin. */
  legacy: (size) => svg(`<rect x="2" y="2" width="60" height="60" rx="12" fill="${THEME}"/>${scaled(0.92, glyph())}`, size),
  round: (size) => svg(`<circle cx="32" cy="32" r="31" fill="${THEME}"/>${scaled(0.9, glyph())}`, size),
  /** Adaptive icon foreground (108dp canvas, 66dp safe zone): glyph only. */
  foreground: (size) => svg(scaled(0.85, glyph()), size),
};

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  console.log('wrote', path.replace(root + '/', ''));
}

const sandboxChromium = process.env.PW_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const browser = await chromium.launch(existsSync(sandboxChromium) ? { executablePath: sandboxChromium } : {});
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function png(path, width, height, inner, background = 'transparent') {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;width:${width}px;height:${height}px;display:grid;place-items:center;background:${background}">${inner}</body></html>`,
  );
  mkdirSync(dirname(path), { recursive: true });
  await page.screenshot({ path, omitBackground: background === 'transparent', clip: { x: 0, y: 0, width, height } });
  console.log('wrote', path.replace(root + '/', ''), `${width}×${height}`);
}

// --- Web / PWA -------------------------------------------------------------
writeText(join(root, 'public/favicon.svg'), ART.rounded(64).replace(' width="64" height="64"', '') + '\n');
await png(join(root, 'public/icons/icon-192.png'), 192, 192, ART.rounded(192));
await png(join(root, 'public/icons/icon-512.png'), 512, 512, ART.rounded(512));
await png(join(root, 'public/icons/icon-maskable-512.png'), 512, 512, ART.fullBleed(512));
await png(join(root, 'public/icons/apple-touch-icon.png'), 180, 180, ART.fullBleed(180));

// --- Android -----------------------------------------------------------------
const res = join(root, 'android/app/src/main/res');
if (existsSync(res)) {
  const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [d, k] of Object.entries(densities)) {
    await png(join(res, `mipmap-${d}/ic_launcher.png`), 48 * k, 48 * k, ART.legacy(48 * k));
    await png(join(res, `mipmap-${d}/ic_launcher_round.png`), 48 * k, 48 * k, ART.round(48 * k));
    await png(join(res, `mipmap-${d}/ic_launcher_foreground.png`), 108 * k, 108 * k, ART.foreground(108 * k));
  }

  // Splash backgrounds (pre-Android 12; Android 12+ uses the icon on the splash colour).
  const splashSizes = {
    drawable: [480, 320],
    'drawable-port-mdpi': [320, 480],
    'drawable-port-hdpi': [480, 800],
    'drawable-port-xhdpi': [720, 1280],
    'drawable-port-xxhdpi': [960, 1600],
    'drawable-port-xxxhdpi': [1280, 1920],
    'drawable-land-mdpi': [480, 320],
    'drawable-land-hdpi': [800, 480],
    'drawable-land-xhdpi': [1280, 720],
    'drawable-land-xxhdpi': [1600, 960],
    'drawable-land-xxxhdpi': [1920, 1280],
  };
  for (const [dir, [w, h]] of Object.entries(splashSizes)) {
    const logo = Math.round(Math.min(w, h) * 0.3);
    await png(join(res, `${dir}/splash.png`), w, h, ART.rounded(logo), BG);
  }

  // Notification icon: white silhouette (Android tints it). Ring as an even-odd
  // annulus plus the needle.
  const ring =
    'M11.25,32 a20.75,20.75 0 1,0 41.5,0 a20.75,20.75 0 1,0 -41.5,0 Z M14.75,32 a17.25,17.25 0 1,0 34.5,0 a17.25,17.25 0 1,0 -34.5,0 Z';
  const needle = 'M32,15 L38,32 L32,49 L26,32 Z';
  writeText(
    join(res, 'drawable/ic_stat_polyglot.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by scripts/generate-icons.mjs -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="64"
    android:viewportHeight="64">
    <path android:fillColor="#FFFFFFFF" android:fillType="evenOdd" android:pathData="${ring}" />
    <path android:fillColor="#FFFFFFFF" android:pathData="${needle}" />
</vector>
`,
  );
  // Themed (monochrome) launcher icon for Android 13+, sized like the foreground layer.
  writeText(
    join(res, 'drawable/ic_launcher_monochrome.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by scripts/generate-icons.mjs -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="64"
    android:viewportHeight="64">
    <group android:pivotX="32" android:pivotY="32" android:scaleX="0.85" android:scaleY="0.85">
        <path android:fillColor="#FFFFFFFF" android:fillType="evenOdd" android:pathData="${ring}" />
        <path android:fillColor="#FFFFFFFF" android:pathData="${needle}" />
    </group>
</vector>
`,
  );
  for (const name of ['ic_launcher', 'ic_launcher_round']) {
    writeText(
      join(res, `mipmap-anydpi-v26/${name}.xml`),
      `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@drawable/ic_launcher_monochrome"/>
</adaptive-icon>
`,
    );
  }
  writeText(
    join(res, 'values/ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${THEME.toUpperCase()}</color>
</resources>
`,
  );
  writeText(
    join(res, 'values/brand_colors.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by scripts/generate-icons.mjs from src/config/brand.ts -->
<resources>
    <color name="splash_background">${BG.toUpperCase()}</color>
</resources>
`,
  );
  writeText(
    join(res, 'values-night/brand_colors.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by scripts/generate-icons.mjs from src/config/brand.ts -->
<resources>
    <color name="splash_background">${BG_DARK.toUpperCase()}</color>
</resources>
`,
  );
} else {
  console.log('android/ not found — skipped Android resources (run `npx cap add android` first).');
}

await browser.close();
