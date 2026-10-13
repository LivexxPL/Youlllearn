/**
 * Roles: the developer account gets full access right after signing in; admins see the
 * dashboard read-only; ordinary accounts cannot promote themselves; sandbox tests never touch
 * the real progress. Runs on the e2e build (.env.e2e defines the test role ids).
 */
import { expect, test, type Page } from '@playwright/test';
import { onboard } from './helpers';
import { fakeGoogle, type FakeAccount } from './google';

async function signIn(page: Page) {
  await page.getByTestId('profile-button').click();
  await page.getByTestId('cloud-signin').click();
  await expect(page.getByTestId('cloud-status')).toContainText('Zsynchronizowano');
}

/** Raw IndexedDB access, as a curious user with developer tools could do. */
async function idb<T>(page: Page, fn: string): Promise<T> {
  const result = await page.evaluate(
    (body) =>
      new Promise<unknown>((resolve, reject) => {
        const req = indexedDB.open('polyglot-quest');
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const run = new Function('db', 'resolve', 'reject', body) as (db: IDBDatabase, res: (v: unknown) => void, rej: (e: unknown) => void) => void;
          run(req.result, resolve, reject);
        };
      }),
    fn,
  );
  return result as T;
}

async function ledgerTypes(page: Page): Promise<string[]> {
  return idb<string[]>(page, `const r = db.transaction('ledger').objectStore('ledger').getAll(); r.onsuccess = () => { resolve(r.result.map((e) => e.type)); db.close(); }; r.onerror = () => reject(r.error);`);
}

async function start(page: Page, account: FakeAccount) {
  await fakeGoogle(page.context(), account);
  await onboard(page, { courses: ['es'] });
  await signIn(page);
}

test.describe('roles and developer access', () => {
  test('the developer account gets full access automatically, and loses it on sign-out', async ({ page }) => {
    await start(page, { sub: 'e2e-developer', name: 'Dev' });
    await page.goto('./#/');
    await expect(page.locator('.home-header .chip--dev')).toBeVisible();

    // Dashboard: recognised as developer with every permission.
    await page.goto('./#/settings');
    await page.getByTestId('settings-dev').click();
    await expect(page.getByTestId('dev-role')).toHaveText('Deweloper');
    await expect(page.getByTestId('dev-status').locator('li.is-granted')).toHaveCount(7);
    await expect(page.getByTestId('dev-srs')).toBeVisible();

    // Every cosmetic without spending anything: equip a premium theme directly.
    await page.goto('./#/shop?tab=themes');
    await expect(page.getByTestId('shop-dev-access')).toBeVisible();
    await page.getByTestId('item-theme-galaxy').click();
    await expect(page.getByTestId('item-buy')).toHaveCount(0);
    await page.getByTestId('item-equip').click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'galaxy');
    await page.keyboard.press('Escape');
    expect(await ledgerTypes(page)).not.toContain('purchase');

    // Locked stories open as a marked preview.
    await page.goto('./#/audio');
    await expect(page.locator('[data-testid^="story-"] .chip--dev').first()).toBeVisible();
    await expect(page.locator('[data-testid^="story-"]').last()).toBeEnabled();

    // Still a developer after a restart, without doing anything.
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'galaxy');
    await page.goto('./#/dev');
    await expect(page.getByTestId('dev-role')).toHaveText('Deweloper');

    // Signing out ends the access and takes off what was only usable thanks to it.
    await page.goto('./#/profile');
    await page.getByTestId('cloud-signout').click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'classic');
    await page.goto('./#/dev');
    await expect(page.getByRole('heading', { name: 'Brak dostępu' }).first()).toBeVisible();
    await page.goto('./#/settings');
    await expect(page.getByTestId('settings-dev')).toHaveCount(0);
  });

  test('an ordinary account cannot promote itself by editing stored data', async ({ page }) => {
    await start(page, { sub: '109876543210987654321', name: 'Developer', email: 'developer@example.com' });
    // Everything stored on the device that a user could change.
    await idb(
      page,
      `const tx = db.transaction(['settings', 'meta'], 'readwrite');
       const st = tx.objectStore('settings'); const g = st.get('app');
       g.onsuccess = () => st.put({ ...g.result, role: 'developer', isAdmin: true });
       const meta = tx.objectStore('meta');
       meta.put({ key: 'role', value: 'developer' });
       meta.put({ key: 'permissions', value: ['sandbox.use', 'cosmetics.useAll'] });
       const c = meta.get('cloud');
       c.onsuccess = () => meta.put({ key: 'cloud', value: { ...c.result.value, account: { ...c.result.value.account, role: 'developer', name: 'Developer', email: 'dev@polyglot.quest' } } });
       tx.oncomplete = () => { db.close(); resolve(true); }; tx.onerror = () => reject(tx.error);`,
    );
    await page.evaluate(() => {
      localStorage.setItem('pq.role', 'developer');
      localStorage.setItem('role', 'admin');
    });
    await page.reload();
    await page.goto('./#/settings');
    await expect(page.getByTestId('settings-profile')).toBeVisible();
    await expect(page.getByTestId('settings-dev')).toHaveCount(0);
    await page.goto('./#/dev');
    await expect(page.getByRole('heading', { name: 'Brak dostępu' }).first()).toBeVisible();
    await page.goto('./#/shop?tab=themes');
    await expect(page.getByTestId('shop-dev-access')).toHaveCount(0);
    await page.getByTestId('item-theme-galaxy').click();
    await expect(page.getByTestId('item-buy')).toBeDisabled();
  });

  test('the sandbox flag alone grants nothing', async ({ page }) => {
    await start(page, { sub: 'e2e-someone' });
    await page.evaluate(() => sessionStorage.setItem('pq.sandbox', '1'));
    await page.goto('./#/dev');
    await page.reload();
    // The app switched to the (empty) test database, says so, and offers the way back…
    await expect(page.getByTestId('sandbox-banner')).toBeVisible();
    // …but no tools: there is no account here, so no role (the empty test data starts with
    // the welcome screen, and the dashboard never appears).
    await page.goto('./#/dev');
    await expect(page.getByTestId('onb-start')).toBeVisible();
    await expect(page.getByTestId('dev-screen')).toHaveCount(0);
    await page.getByTestId('sandbox-banner').getByRole('button').click();
    await expect(page.getByTestId('sandbox-banner')).toHaveCount(0);
  });

  test('an admin sees the dashboard read-only, without overrides or the sandbox', async ({ page }) => {
    await start(page, { sub: 'e2e-admin' });
    await page.goto('./#/dev');
    await expect(page.getByTestId('dev-role')).toHaveText('Administrator');
    await expect(page.getByTestId('dev-diagnostics')).toBeVisible();
    await expect(page.getByTestId('dev-sandbox')).toHaveCount(0);
    await expect(page.getByTestId('dev-srs')).toHaveCount(0);
    await page.goto('./#/shop?tab=themes');
    await expect(page.getByTestId('shop-dev-access')).toHaveCount(0);
    await page.getByTestId('item-theme-galaxy').click();
    await expect(page.getByTestId('item-buy')).toBeDisabled();
  });

  test('the developer tests in the sandbox without touching the real progress', async ({ page }) => {
    await start(page, { sub: 'e2e-developer' });
    await page.goto('./#/dev');
    await page.getByRole('button', { name: 'Wejdź z kopią moich postępów' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Wejdź z kopią moich postępów' }).click();
    await expect(page.getByTestId('sandbox-banner')).toBeVisible();

    // Still recognised as developer on the test data.
    await page.goto('./#/dev');
    await expect(page.getByTestId('dev-role')).toHaveText('Deweloper');
    await page.getByTestId('sim-coins-1000').click();
    await page.getByRole('button', { name: 'Ukończ następną lekcję' }).click();
    await expect(page.getByText(/Gotowe: Ukończ następną lekcję/)).toBeVisible();
    await page.goto('./#/');
    await expect(page.getByTestId('coin-chip')).toHaveAccessibleName(/saldo: 1\s?\d{3} monet/);

    // Back to the real data: no test coins, no simulated lesson, no test entries.
    await page.getByTestId('sandbox-banner').getByRole('button').click();
    await expect(page.getByTestId('sandbox-banner')).toHaveCount(0);
    await expect(page.getByTestId('coin-chip')).toHaveAccessibleName(/saldo: 0 monet/);
    expect(await ledgerTypes(page)).not.toContain('adjustment');
    const lessons = await idb<number>(page, `const r = db.transaction('lessonProgress').objectStore('lessonProgress').count(); r.onsuccess = () => { resolve(r.result); db.close(); };`);
    expect(lessons).toBe(0);
    // The real database keeps a record of what was done.
    await page.goto('./#/dev');
    await expect(page.getByTestId('dev-audit')).toContainText('simulate.coins');
  });
});
