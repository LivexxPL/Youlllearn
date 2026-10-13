/**
 * A fake Google for end-to-end tests: the sign-in pop-up (Google Identity Services) and the
 * userinfo / Drive endpoints. The e2e build (.env.e2e) recognises the account ids
 * "e2e-developer" and "e2e-admin"; any other id is a plain user.
 */
import type { BrowserContext, Route } from '@playwright/test';

export interface FakeAccount {
  sub: string;
  name?: string;
  email?: string;
}

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE' };

export async function fakeGoogle(context: BrowserContext, account: FakeAccount) {
  await context.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    let requests = 0;
    w.google = {
      accounts: {
        oauth2: {
          initTokenClient(config: { scope: string; callback: (r: object) => void }) {
            return {
              requestAccessToken() {
                requests += 1;
                setTimeout(() => config.callback({ access_token: `e2e-token-${requests}`, expires_in: 3599, scope: config.scope }), 30);
              },
            };
          },
          hasGrantedAllScopes: () => true,
          revoke: (_token: string, done?: () => void) => done?.(),
        },
      },
    };
  });
  await context.route('https://accounts.google.com/**', (route) => route.abort());
  // A Drive without files that accepts uploads (enough for the account flow).
  await context.route('https://www.googleapis.com/**', async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const json = (body: unknown) => route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (url.pathname === '/oauth2/v3/userinfo') return json({ sub: account.sub, name: account.name ?? 'Test', given_name: account.name ?? 'Test', email: account.email ?? `${account.sub}@example.com` });
    if (req.method() === 'GET' && url.pathname === '/drive/v3/files') return json({ files: [] });
    return json({ id: 'file1', modifiedTime: new Date().toISOString() });
  });
}
