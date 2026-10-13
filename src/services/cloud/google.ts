/**
 * Google sign-in with Google Identity Services (token model): Google's own pop-up asks the
 * user to choose an account and allow access; the app receives a short-lived access token
 * (about an hour) and never sees the password. There is no refresh token without a server,
 * so a new token needs a click (the pop-up usually closes by itself once access is granted).
 */
import { DRIVE_SCOPE, GIS_SCRIPT_URL, GOOGLE_SCOPES, googleClientId } from '../../config/cloud';

export type CloudErrorCode =
  /** The token is missing, expired or revoked: sign in again. */
  | 'auth'
  /** No connection (or Google could not be reached). */
  | 'network'
  /** The user closed the pop-up or chose not to continue. */
  | 'cancelled'
  /** The browser blocked the pop-up. */
  | 'popup'
  /** Sign-in worked but access to the app's Drive folder was not granted. */
  | 'scope'
  /** The user's Google storage is full. */
  | 'quota'
  /** The copy in the cloud cannot be read (damaged or from a newer app version). */
  | 'format'
  | 'notFound'
  | 'server';

export class CloudError extends Error {
  constructor(
    readonly code: CloudErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'CloudError';
  }
}

export interface CloudAccount {
  /** Stable Google account id. */
  sub: string;
  email: string;
  name: string;
  givenName?: string;
  picture?: string;
}

export interface AccessToken {
  token: string;
  /** ms since epoch. */
  expiresAt: number;
}

// Minimal typing of the parts of Google Identity Services used here.
interface TokenResponse {
  access_token?: string;
  expires_in?: number | string;
  scope?: string;
  error?: string;
  error_description?: string;
}
interface TokenClient {
  requestAccessToken(override?: { prompt?: string; login_hint?: string }): void;
}
export interface GoogleOAuth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (r: TokenResponse) => void;
    error_callback?: (e: { type?: string; message?: string }) => void;
  }): TokenClient;
  hasGrantedAllScopes(r: TokenResponse, ...scopes: string[]): boolean;
  revoke(token: string, done?: () => void): void;
}
declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

const oauth2 = (): GoogleOAuth2 | undefined => (typeof window === 'undefined' ? undefined : window.google?.accounts?.oauth2);

let loading: Promise<GoogleOAuth2> | null = null;

/** Loads Google's sign-in script once (only when the account features are used). */
export function loadGoogle(): Promise<GoogleOAuth2> {
  const ready = oauth2();
  if (ready) return Promise.resolve(ready);
  loading ??= new Promise<GoogleOAuth2>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      const api = oauth2();
      if (api) resolve(api);
      else reject(new CloudError('network'));
    };
    script.onerror = () => {
      script.remove();
      reject(new CloudError('network'));
    };
    document.head.appendChild(script);
  }).catch((e: unknown) => {
    loading = null;
    throw e;
  });
  return loading;
}

let client: TokenClient | null = null;
let pending: { resolve: (t: AccessToken) => void; reject: (e: CloudError) => void } | null = null;

function settle(outcome: AccessToken | CloudError) {
  const p = pending;
  pending = null;
  if (!p) return;
  if (outcome instanceof CloudError) p.reject(outcome);
  else p.resolve(outcome);
}

function tokenClient(api: GoogleOAuth2): TokenClient {
  client ??= api.initTokenClient({
    client_id: googleClientId(),
    scope: GOOGLE_SCOPES.join(' '),
    callback: (r) => {
      if (r.error || !r.access_token) settle(new CloudError(r.error === 'access_denied' ? 'cancelled' : 'auth', r.error_description ?? r.error));
      else if (!api.hasGrantedAllScopes(r, DRIVE_SCOPE)) settle(new CloudError('scope'));
      else settle({ token: r.access_token, expiresAt: Date.now() + Number(r.expires_in ?? 3600) * 1000 });
    },
    error_callback: (e) => settle(new CloudError(e.type === 'popup_failed_to_open' ? 'popup' : 'cancelled', e.message)),
  });
  return client;
}

/**
 * Opens Google's pop-up and resolves with an access token. Call it directly from a click
 * handler: browsers block pop-ups that do not follow a user action.
 * `hint` (the account id) skips the account chooser when renewing access.
 */
export async function requestAccessToken(opts: { prompt: '' | 'select_account' | 'consent'; hint?: string }): Promise<AccessToken> {
  const api = oauth2() ?? (await loadGoogle());
  settle(new CloudError('cancelled'));
  return new Promise<AccessToken>((resolve, reject) => {
    pending = { resolve, reject };
    tokenClient(api).requestAccessToken({ prompt: opts.prompt, ...(opts.hint ? { login_hint: opts.hint } : {}) });
  });
}

/** Name, e-mail and picture of the signed-in Google account. */
export async function fetchAccount(token: string): Promise<CloudAccount> {
  let res: Response;
  try {
    res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${token}` } });
  } catch {
    throw new CloudError('network');
  }
  if (res.status === 401) throw new CloudError('auth');
  if (!res.ok) throw new CloudError('server', `HTTP ${res.status}`);
  const j = (await res.json()) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
  const email = str(j.email) ?? '';
  return { sub: String(j.sub ?? ''), email, name: str(j.name) ?? email, givenName: str(j.given_name), picture: str(j.picture) };
}

/** Withdraws the app's access to the Google account (signing out). */
export async function revokeAccess(token: string): Promise<void> {
  const api = oauth2();
  if (api) {
    await new Promise<void>((resolve) => api.revoke(token, () => resolve()));
    return;
  }
  await fetch('https://oauth2.googleapis.com/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `token=${encodeURIComponent(token)}`,
  }).catch(() => undefined);
}
