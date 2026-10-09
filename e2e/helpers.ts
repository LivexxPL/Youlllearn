import { expect, type Page } from '@playwright/test';

export type CourseId = 'es' | 'de' | 'ja';

/** Completes onboarding (fresh browser context = empty IndexedDB). */
export async function onboard(page: Page, opts: { courses?: CourseId[]; goal?: 5 | 10 | 20 | 30; startLesson?: boolean } = {}) {
  const courses = opts.courses ?? ['es'];
  await page.goto('./');
  await expect(page.getByTestId('onb-start')).toBeVisible();
  await page.getByTestId('onb-start').click();
  for (const c of courses) await page.getByTestId(`onb-lang-${c}`).click();
  await page.getByTestId('onb-next').click();
  await page.getByTestId(`onb-goal-${opts.goal ?? 10}`).click();
  await page.getByTestId('onb-next').click();
  // Audio check step (no voices in headless Chromium — the app explains this).
  await page.getByTestId('onb-next').click();
  if (opts.startLesson) {
    await page.getByTestId('onb-finish').click();
  } else {
    await page.getByRole('button', { name: 'Najpierw rozejrzę się po aplikacji' }).click();
    await expect(page.getByTestId('continue')).toBeVisible();
  }
}

/** Draws a simple stroke on the first handwriting canvas. */
export async function drawStroke(page: Page, from: [number, number] = [0.3, 0.3], to: [number, number] = [0.7, 0.6]) {
  const canvas = page.locator('canvas.pad-canvas').first();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('canvas not visible');
  const x = (f: number) => box.x + box.width * f;
  const y = (f: number) => box.y + box.height * f;
  await page.mouse.move(x(from[0]), y(from[1]));
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(x(from[0] + ((to[0] - from[0]) * i) / 8), y(from[1] + ((to[1] - from[1]) * i) / 8));
  await page.mouse.up();
}

const enabled = (page: Page, testId: string) => page.locator(`[data-testid="${testId}"]:enabled`).first();

/**
 * Plays one step of the session player with a generic strategy (first option,
 * "I don't know", tiles in bank order, all pairs, self-assessment "good").
 * Every action waits for its transition (feedback panel shown, or the step
 * container replaced) so the next call never sees a half-rendered state.
 * Returns the kind of step handled, or 'summary' when the session ended.
 */
export async function playStep(page: Page): Promise<string> {
  if (await page.getByTestId('summary-home').isVisible()) return 'summary';
  const feedback = page.getByTestId('feedback-continue');
  if (await feedback.isVisible()) {
    await feedback.click();
    await feedback.waitFor({ state: 'hidden' });
    return 'feedback';
  }
  // Each step renders in a container keyed by the exercise, so it is replaced on advance.
  const body = await page.$('.session__body');
  const stepReplaced = async () => {
    if (body) await body.waitForElementState('hidden');
  };
  const feedbackShown = () => feedback.waitFor({ state: 'visible' });

  if (await enabled(page, 'step-continue').isVisible()) {
    await page.getByTestId('step-continue').click();
    await stepReplaced();
    return 'continue';
  }
  if (await enabled(page, 'option-0').isVisible()) {
    await page.getByTestId('option-0').click();
    await page.getByTestId('check').click();
    await feedbackShown();
    return 'choice';
  }
  if (await enabled(page, 'answer-input').isVisible()) {
    await page.getByTestId('dont-know').click();
    await feedbackShown();
    return 'type';
  }
  if (await enabled(page, 'tile-0').isVisible()) {
    const n = await page.locator('[data-testid^="tile-"]').count();
    for (let i = 0; i < n; i++) await page.getByTestId(`tile-${i}`).click();
    await page.getByTestId('check').click();
    await feedbackShown();
    return 'order';
  }
  const left = page.locator('[data-testid^="match-l-"]:enabled');
  if (await left.first().isVisible()) {
    const ids = await left.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')!.slice('match-l-'.length)));
    for (const id of ids) {
      await page.getByTestId(`match-l-${id}`).click();
      await page.getByTestId(`match-r-${id}`).click();
    }
    await feedbackShown();
    return 'match';
  }
  if (await enabled(page, 'speak-good').isVisible()) {
    await page.getByTestId('speak-good').click();
    await stepReplaced();
    return 'speak';
  }
  if (await page.getByTestId('write-compare').isVisible()) {
    await drawStroke(page);
    await page.getByTestId('write-compare').click();
    await page.getByTestId('write-good').click();
    await stepReplaced();
    return 'write';
  }
  return 'unknown';
}

/** Plays a whole session until the summary screen; returns the step kinds seen. */
export async function playSession(page: Page, maxSteps = 160): Promise<string[]> {
  const seen: string[] = [];
  let unknown = 0;
  for (let i = 0; i < maxSteps; i++) {
    const kind = await playStep(page);
    seen.push(kind);
    if (kind === 'summary') return seen;
    if (kind === 'unknown') {
      unknown += 1;
      if (unknown > 20) throw new Error(`Stuck in session after: ${seen.slice(-10).join(', ')}`);
      await page.waitForTimeout(150);
    } else {
      unknown = 0;
    }
  }
  throw new Error(`Session did not finish within ${maxSteps} steps: ${seen.slice(-10).join(', ')}`);
}
