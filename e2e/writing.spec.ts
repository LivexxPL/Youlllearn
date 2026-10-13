import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test.describe('stroke order', () => {
  // The tests run with reduced motion: the stroke-order animation is content and still plays.
  test('"Animuj" plays the stroke order over the tracing template, then the template returns', async ({ page }) => {
    await onboard(page, { courses: ['ja'] });
    await page.goto(`./#/write/hiragana/${encodeURIComponent('あ')}`);
    const guide = page.getByTestId('stroke-guide');
    await expect(guide).toHaveClass(/stroke-guide--faint/);

    await page.getByTestId('write-animate').click();
    await expect(guide).toHaveClass(/stroke-guide--animate/);
    const timing = await guide.locator('path').evaluateAll((paths) =>
      paths.map((p) => {
        const cs = getComputedStyle(p);
        return { name: cs.animationName, duration: parseFloat(cs.animationDuration), delay: parseFloat(cs.animationDelay) };
      }),
    );
    expect(timing.length).toBe(3);
    for (const [i, s] of timing.entries()) {
      expect(s.name).toBe('draw-stroke');
      expect(s.duration).toBeGreaterThan(0.3);
      expect(s.delay).toBeCloseTo(i * 0.75, 2);
    }
    // When the last stroke is drawn, tracing mode shows the template again.
    await expect(guide).toHaveClass(/stroke-guide--faint/, { timeout: 6_000 });
  });
});
