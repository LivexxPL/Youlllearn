/**
 * Screenshot tour for visual QA (phone, tablet and desktop, light and dark).
 * Not part of the regular run: SCREENSHOTS=1 npm run test:e2e -- visual
 * Images are written to test-results/screens/<project>/.
 */
import { test, type Page } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { onboard, playStep } from './helpers';

test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 to capture the screenshot tour.');
test.setTimeout(240_000);

function shooter(page: Page, project: string) {
  const dir = `test-results/screens/${project}`;
  mkdirSync(dir, { recursive: true });
  return async (name: string) => {
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  };
}

async function nav(page: Page, hash: string) {
  await page.evaluate((h) => (window.location.hash = h), hash);
  await page.waitForTimeout(400);
}

test('screenshot tour', async ({ page }, info) => {
  const shot = shooter(page, info.project.name);
  const scheme = info.project.name.includes('dark') ? 'dark' : 'light';
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });

  await page.goto('./');
  await shot('01-onboarding-welcome');
  await onboard(page, { courses: ['es', 'ja'] });
  await shot('02-home-new');
  await nav(page, '#/learn');
  await shot('03-learn');

  // A full lesson, saving the first occurrence of each step kind.
  await nav(page, '#/lesson/es.l01');
  const seen = new Set<string>();
  for (let i = 0; i < 160; i++) {
    const before = await page.screenshot({ fullPage: false });
    const kind = await playStep(page);
    if (!seen.has(kind) && kind !== 'unknown') {
      seen.add(kind);
      writeFileSync(`test-results/screens/${info.project.name}/lesson-${String(seen.size).padStart(2, '0')}-${kind}.png`, before);
    }
    if (kind === 'summary') break;
    if (kind === 'unknown') await page.waitForTimeout(150);
  }
  await shot('04-lesson-summary');
  await page.getByTestId('summary-home').click();
  await shot('05-home-after-lesson');

  await nav(page, '#/review');
  await shot('06-review');
  await nav(page, '#/progress');
  await shot('07-progress');
  await nav(page, '#/audio');
  await shot('08-audio-quest');
  await page.getByTestId('handsfree-start').click();
  await page.waitForTimeout(1500);
  await shot('09-handsfree');
  await page.getByTestId('session-close').click();
  await page.getByTestId('mode-flashcards').click();
  await page.getByTestId('fc-reveal').click();
  await shot('10-flashcards-reveal');
  await nav(page, '#/settings');
  await shot('11-settings');

  // Japanese: kana chart and handwriting.
  await nav(page, '#/kana');
  await shot('12-kana-chart');
  await nav(page, '#/write');
  await shot('13-writing-hub');
  await nav(page, '#/write/hiragana/%E3%81%82');
  await page.waitForTimeout(600);
  await shot('14-writing-practice');
  await nav(page, '#/notes/es.l01');
  await shot('15-notes');
});
