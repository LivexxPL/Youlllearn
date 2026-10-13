/**
 * Google account and cloud copy (Google Drive). See docs/CLOUD_SYNC.md.
 *
 * The OAuth client ID identifies the app to Google and is public by design (it is visible in
 * every web page that uses Google sign-in). It is read from the VITE_GOOGLE_CLIENT_ID build
 * variable; CI passes the GOOGLE_CLIENT_ID repository variable. Without it the account
 * features are hidden and the app works exactly as before.
 */
const BUILD_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

/** The OAuth client id. End-to-end tests provide one at runtime (window.__pqGoogleClientId). */
export function googleClientId(): string {
  const override = typeof window === 'undefined' ? undefined : (window as { __pqGoogleClientId?: unknown }).__pqGoogleClientId;
  return typeof override === 'string' ? override : BUILD_CLIENT_ID;
}

/** Only this app's hidden folder on the user's Drive — no access to their other files. */
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
export const GOOGLE_SCOPES = ['openid', 'email', 'profile', DRIVE_SCOPE];

export const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

/** Name of the synchronised copy in the Drive application data folder. */
export const SYNC_FILE_NAME = 'polyglot-quest-sync.json';

/** meta key holding this device's account and sync state (never synchronised itself). */
export const CLOUD_META_KEY = 'cloud';

export function cloudConfigured(): boolean {
  return googleClientId().length > 0;
}
