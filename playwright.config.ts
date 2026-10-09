import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// In some sandboxes Chromium is pre-installed outside the Playwright cache.
// PW_CHROMIUM_PATH (or the default sandbox path) lets the tests use it
// instead of downloading a browser.
const sandboxChromium = process.env.PW_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const executablePath = existsSync(sandboxChromium) ? sandboxChromium : undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    locale: 'pl-PL',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'], launchOptions: executablePath ? { executablePath } : {} } },
    {
      name: 'tablet',
      use: {
        viewport: { width: 1180, height: 820 },
        hasTouch: true,
        isMobile: false,
        launchOptions: executablePath ? { executablePath } : {},
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
