/**
 * Google account and Drive copy, end to end. Google is replaced by fakes: an init script
 * stands in for Google Identity Services (the sign-in pop-up) and page.route answers the
 * userinfo and Drive endpoints from an in-memory "Drive" shared by the browser contexts of
 * a test (each context is one device).
 */
import { expect, test, type BrowserContext, type Page, type Route } from '@playwright/test';
import { onboard } from './helpers';

interface DriveFile {
  id: string;
  body: string;
  modifiedTime: string;
}

class FakeDrive {
  files = new Map<string, DriveFile>();
  private clock = 0;

  private stamp() {
    return new Date(Date.UTC(2026, 9, 10) + ++this.clock * 1000).toISOString();
  }

  only(): { data: Record<string, { key?: string; displayName?: string; onboarded?: boolean; id?: string }[]> } {
    expect(this.files.size).toBe(1);
    return JSON.parse([...this.files.values()][0].body);
  }

  async handle(route: Route) {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE' };
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (!(req.headers()['authorization'] ?? '').startsWith('Bearer e2e-token-')) return route.fulfill({ status: 401, headers: cors, body: '' });
    const json = (body: unknown) => route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const id = url.pathname.split('/').pop()!;

    if (url.pathname === '/oauth2/v3/userinfo') return json({ sub: '42', name: 'Ola Testowa', given_name: 'Ola', email: 'ola@example.com' });
    if (method === 'GET' && url.pathname === '/drive/v3/files') {
      return json({ files: [...this.files.values()].map(({ id: fid, modifiedTime }) => ({ id: fid, modifiedTime })) });
    }
    if (method === 'GET' && url.searchParams.get('alt') === 'media') {
      const f = this.files.get(id);
      return f ? route.fulfill({ status: 200, headers: cors, body: f.body }) : route.fulfill({ status: 404, headers: cors, body: '' });
    }
    if (method === 'POST' && url.pathname === '/upload/drive/v3/files') {
      const boundary = /boundary=(.+)$/.exec(req.headers()['content-type'])![1];
      const [metaPart, bodyPart] = (req.postData() ?? '').split(`--${boundary}`).slice(1, 3);
      expect(JSON.parse(metaPart.split('\r\n\r\n')[1]).parents).toEqual(['appDataFolder']);
      const f = { id: `file${this.files.size + 1}`, body: bodyPart.split('\r\n\r\n')[1].replace(/\r\n$/, ''), modifiedTime: this.stamp() };
      this.files.set(f.id, f);
      return json({ id: f.id, modifiedTime: f.modifiedTime });
    }
    if (method === 'PATCH' && this.files.has(id)) {
      const f = { id, body: req.postData() ?? '', modifiedTime: this.stamp() };
      this.files.set(id, f);
      return json({ id, modifiedTime: f.modifiedTime });
    }
    if (method === 'DELETE') {
      this.files.delete(id);
      return route.fulfill({ status: 204, headers: cors });
    }
    return route.fulfill({ status: 400, headers: cors, body: '' });
  }
}

/** A device: a browser context with fake Google sign-in, talking to the shared fake Drive. */
async function device(context: BrowserContext, drive: FakeDrive): Promise<Page> {
  await context.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    const fake = { expiresIn: 3599, requests: 0, revoked: 0 };
    w.__fakeGoogle = fake;
    w.google = {
      accounts: {
        oauth2: {
          initTokenClient(config: { scope: string; callback: (r: object) => void }) {
            return {
              requestAccessToken() {
                fake.requests += 1;
                setTimeout(() => config.callback({ access_token: `e2e-token-${fake.requests}`, expires_in: fake.expiresIn, scope: config.scope }), 50);
              },
            };
          },
          hasGrantedAllScopes: () => true,
          revoke(_token: string, done?: () => void) {
            fake.revoked += 1;
            done?.();
          },
        },
      },
    };
  });
  // The real Google sign-in script must never be needed.
  await context.route('https://accounts.google.com/**', (route) => route.abort());
  await context.route('https://www.googleapis.com/**', (route) => drive.handle(route));
  return context.newPage();
}

test.describe('Google account and Drive copy', () => {
  test('signs in from the profile, saves the progress to Drive and greets by name', async ({ browser }) => {
    const drive = new FakeDrive();
    const context = await browser.newContext();
    const page = await device(context, drive);
    await onboard(page, { courses: ['de'] });

    await page.getByTestId('profile-button').click();
    await expect(page.getByRole('heading', { name: 'Profil' })).toBeVisible();
    await page.getByTestId('cloud-signin').click();
    await expect(page.getByTestId('cloud-status')).toContainText('Zsynchronizowano');
    await expect(page.getByText('ola@example.com')).toBeVisible();

    // The copy holds the learner's data and nothing that belongs to this device only.
    const copy = drive.only();
    expect(copy.data.settings[0].onboarded).toBe(true);
    expect(copy.data.meta.map((m) => m.key)).not.toContain('cloud');
    // The first name became the greeting name.
    await expect(page.getByTestId('display-name')).toHaveValue('Ola');
    await page.goto('./#/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ola');

    // Changes are uploaded by themselves while access is valid.
    await page.getByTestId('profile-button').click();
    await page.getByTestId('display-name').fill('Ola K.');
    await expect.poll(() => drive.only().data.settings[0].displayName, { timeout: 30_000 }).toBe('Ola K.');

    await page.getByTestId('cloud-signout').click();
    await expect(page.getByTestId('cloud-signin')).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __fakeGoogle: { revoked: number } }).__fakeGoogle.revoked)).toBe(1);
    expect(drive.files.size).toBe(1);
    await context.close();
  });

  test('restores the progress on a new device from the welcome screen', async ({ browser }) => {
    const drive = new FakeDrive();
    const first = await browser.newContext();
    const a = await device(first, drive);
    await onboard(a, { courses: ['ja'] });
    await a.getByTestId('profile-button').click();
    await a.getByTestId('cloud-signin').click();
    await expect(a.getByTestId('cloud-status')).toContainText('Zsynchronizowano');
    await first.close();

    const second = await browser.newContext();
    const b = await device(second, drive);
    await b.goto('./');
    await b.getByTestId('onb-restore').click();
    await expect(b.getByTestId('continue')).toBeVisible();
    await expect(b.locator('.course-chip')).toContainText('Japoński');
    await expect(b.getByRole('heading', { level: 1 })).toContainText('Ola');
    await second.close();
  });

  test('asks for one tap when access has expired and changes are waiting', async ({ browser }) => {
    const drive = new FakeDrive();
    const context = await browser.newContext();
    const page = await device(context, drive);
    await onboard(page);
    // Access that runs out a couple of seconds after signing in.
    await page.evaluate(() => ((window as unknown as { __fakeGoogle: { expiresIn: number } }).__fakeGoogle.expiresIn = 62));
    await page.getByTestId('profile-button').click();
    await page.getByTestId('cloud-signin').click();
    await expect(page.getByTestId('cloud-status')).toContainText('Zsynchronizowano');

    await page.waitForTimeout(2_500);
    await page.getByTestId('display-name').fill('Kuba');
    await page.goto('./#/');
    const pending = page.getByTestId('cloud-pending');
    await expect(pending).toBeVisible({ timeout: 30_000 });
    expect(drive.only().data.settings[0].displayName).not.toBe('Kuba');

    await page.evaluate(() => ((window as unknown as { __fakeGoogle: { expiresIn: number } }).__fakeGoogle.expiresIn = 3599));
    await pending.getByRole('button').click();
    await expect(pending).toBeHidden();
    expect(drive.only().data.settings[0].displayName).toBe('Kuba');
    await context.close();
  });
});
