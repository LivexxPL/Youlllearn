/**
 * Coins and cosmetics, end to end: a real lesson earns coins, the shop sells and equips items,
 * everything survives a reload and works offline.
 */
import { expect, test, type Page } from '@playwright/test';
import { onboard, playSession } from './helpers';

/**
 * Adds coins with an administrative ledger entry (test fixture), then reloads the app. From
 * 100 coins on, the "first purse" badge adds its own reward, as it would after real learning.
 */
async function addCoins(page: Page, amount: number) {
  await page.evaluate(
    (n) =>
      new Promise<void>((resolve, reject) => {
        const req = indexedDB.open('polyglot-quest');
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const tx = req.result.transaction('ledger', 'readwrite');
          tx.objectStore('ledger').put({ id: `adjustment:e2e-${Date.now()}`, type: 'adjustment', amount: n, currency: 'coins', at: Date.now(), date: '2026-10-13' });
          tx.oncomplete = () => {
            req.result.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
    amount,
  );
  await page.reload();
}

async function balance(page: Page): Promise<number> {
  const chip = page.getByTestId('coin-chip');
  await expect(chip).not.toHaveText('…');
  return Number((await chip.innerText()).replace(/\D/g, ''));
}

async function buy(page: Page, id: string) {
  await page.getByTestId(`item-${id}`).click();
  await page.getByTestId('item-buy').click();
  await page.getByTestId('item-confirm').click();
  await expect(page.getByTestId('item-sheet').getByText(/Kupione/)).toBeVisible();
}

test.describe('coins and the cosmetics shop', () => {
  test('a finished lesson earns coins that show on the summary and on Home', async ({ page }) => {
    await onboard(page, { courses: ['de'] });
    await expect(page.getByTestId('coin-chip')).toHaveAccessibleName(/0 monet/);
    await page.getByTestId('continue').click();
    await playSession(page);
    const card = page.getByTestId('coin-card');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Nowa lekcja ukończona');
    await expect(card).toContainText('Odznaka: Pierwszy krok');
    await page.getByTestId('summary-home').click();
    // At least the lesson (15) and the first-lesson badge (25).
    expect(await balance(page)).toBeGreaterThanOrEqual(40);
    await page.getByTestId('coin-chip').click();
    await page.getByRole('button', { name: /Historia monet/ }).click();
    await expect(page.getByText(/Nowa lekcja ukończona/)).toBeVisible();
  });

  test('buys an item at the exact price, equips it and keeps it after a reload', async ({ page }) => {
    await onboard(page);
    // 175 + 25 for the "first purse" badge = exactly the price of the frame.
    await addCoins(page, 175);
    expect(await balance(page)).toBe(200);
    await page.getByTestId('coin-chip').click();
    await page.getByText('Profil', { exact: true }).first().click();
    await buy(page, 'frame-gold');
    await page.getByTestId('item-equip-now').click();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('item-frame-gold')).toContainText('Założone');

    await page.reload();
    await page.goto('./#/');
    expect(await balance(page)).toBe(0);
    await expect(page.getByTestId('profile-button').locator('.avatar-frame[data-frame="gold"]')).toBeVisible();
    await page.getByTestId('profile-button').click();
    await expect(page.getByTestId('profile-card').locator('.avatar-frame[data-frame="gold"]')).toBeVisible();

    // Buying again is not possible; the sheet offers to remove it instead.
    await page.goto('./#/shop?tab=profile');
    await page.getByTestId('item-frame-gold').click();
    await expect(page.getByTestId('item-buy')).toHaveCount(0);
    await page.getByTestId('item-unequip').click();
    await expect(page.getByTestId('item-equip')).toBeVisible();
  });

  test('explains a short balance instead of selling', async ({ page }) => {
    await onboard(page);
    await addCoins(page, 60);
    await page.goto('./#/shop?tab=profile');
    await page.getByTestId('item-banner-aurora').click();
    await expect(page.getByTestId('item-buy')).toBeDisabled();
    await expect(page.getByTestId('item-missing')).toContainText('Brakuje 240 monet');
    await page.keyboard.press('Escape');
    await page.goto('./#/');
    expect(await balance(page)).toBe(60);
  });

  test('a purchase can be undone right away', async ({ page }) => {
    await onboard(page);
    await addCoins(page, 275);
    await page.goto('./#/shop?tab=interface');
    await buy(page, 'bar-stripes');
    await page.getByTestId('item-equip-now').click();
    await expect(page.locator('html')).toHaveAttribute('data-bar', 'stripes');
    await page.getByTestId('item-undo').click();
    await expect(page.getByText('Zakup cofnięty')).toBeVisible();
    await expect(page.locator('html')).not.toHaveAttribute('data-bar', 'stripes');
    await page.goto('./#/');
    expect(await balance(page)).toBe(300);
  });

  test('works offline: buying and equipping need no connection', async ({ page, context }) => {
    await onboard(page);
    await addCoins(page, 500);
    // The installed app runs from the service worker's cache, so it starts without a network.
    expect(await page.evaluate(async () => Boolean((await navigator.serviceWorker.ready).active))).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await page.goto('./#/shop?tab=profile');
    await buy(page, 'title-explorer');
    await page.getByTestId('item-equip-now').click();
    await page.keyboard.press('Escape');
    await page.goto('./#/profile');
    await expect(page.getByTestId('profile-card')).toContainText('Odkrywca słów');
    await context.setOffline(false);
  });

  test('a bought theme applies at once, is switched to again for free and the default look returns', async ({ page }) => {
    await onboard(page);
    await addCoins(page, 325);
    await page.goto('./#/shop?tab=themes');
    await buy(page, 'theme-forest');
    await page.getByTestId('item-equip-now').click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
    await page.keyboard.press('Escape');

    await page.goto('./#/settings');
    await page.getByTestId('palette-mint').click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'mint');
    await page.getByTestId('palette-forest').click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
    await page.getByTestId('reset-look').click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'classic');
    // Still owned: it stays in the picker.
    await expect(page.getByTestId('palette-forest')).toBeVisible();
    await page.goto('./#/');
    expect(await balance(page)).toBe(0);
  });

  test('reward-only items show how to earn them in the collection', async ({ page }) => {
    await onboard(page);
    await page.goto('./#/collection');
    await expect(page.getByTestId('locked-frame-week')).toContainText('Ucz się 7 dni z rzędu');
    await expect(page.getByTestId('locked-badge-starter')).toContainText('Ukończ pierwszą lekcję');
  });
});
