import { test, devices } from '@playwright/test';
import { onboard, playStep } from './helpers';

test.skip(!process.env.README_SHOTS, 'README screenshots only on demand.');
test.use({ ...devices['Pixel 7'], deviceScaleFactor: 1.5 });

test('readme screenshots', async ({ page }) => {
  test.setTimeout(180_000);
  const shot = (name: string) => page.screenshot({ path: `docs/screenshots/${name}.jpg`, type: 'jpeg', quality: 82 });
  await onboard(page, { courses: ['es', 'ja'] });
  await page.goto('./#/lesson/es.l01');
  // Play until the first choice exercise and its feedback.
  for (let i = 0; i < 60; i++) {
    if (await page.locator('[data-testid="option-0"]:enabled').isVisible()) {
      await page.waitForTimeout(300);
      await shot('lesson-choice');
      break;
    }
    await playStep(page);
  }
  for (let i = 0; i < 200; i++) if ((await playStep(page)) === 'summary') break;
  await page.getByTestId('summary-home').click();
  await page.waitForTimeout(500);
  await shot('home');
  await page.goto('./#/audio/handsfree?min=10&stage=1');
  await page.waitForTimeout(1800);
  await shot('audio-handsfree');
  await page.goto('./#/write/hiragana/%E3%81%82');
  await page.waitForTimeout(900);
  await shot('writing');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./#/audio');
  await page.waitForTimeout(600);
  await shot('audio-quest-dark');
});
