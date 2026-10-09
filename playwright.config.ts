import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// In some sandboxes Chromium is pre-installed outside the Playwright cache.
// PW_CHROMIUM_PATH (or the default sandbox path) lets the tests use it
// instead of downloading a browser.
const sandboxChromium = process.env.PW_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const launchOptions = existsSync(sandboxChromium) ? { executablePath: sandboxChromium } : {};

export default defineConfig({
  testDir: './e2e',
  // Whole lessons are ~50 exercises; reduced motion (honoured by the app) keeps them fast.
  timeout: 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173/',
    trace: 'retain-on-failure',
    locale: 'pl-PL',
    contextOptions: { reducedMotion: 'reduce' },
    launchOptions,
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'], launchOptions } },
    {
      name: 'tablet',
      testIgnore: /visual\.spec/,
      use: { viewport: { width: 1180, height: 820 }, hasTouch: true, isMobile: false, launchOptions },
    },
    // Screenshot-only projects (visual.spec.ts runs only with SCREENSHOTS=1).
    { name: 'tablet-shots', testMatch: /visual\.spec/, use: { viewport: { width: 1180, height: 820 }, hasTouch: true, launchOptions } },
    { name: 'desktop-shots', testMatch: /visual\.spec/, use: { viewport: { width: 1440, height: 900 }, launchOptions } },
    { name: 'phone-dark-shots', testMatch: /visual\.spec/, use: { ...devices['Pixel 7'], launchOptions } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
