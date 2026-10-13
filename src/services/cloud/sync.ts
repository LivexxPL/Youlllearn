/**
 * Keeps this device's data and the copy on the user's Google Drive in step.
 *
 * - Signing in (a click) gives an access token for about an hour. While it is valid, changes
 *   are synchronised automatically a few seconds after they happen and when the app goes to
 *   the background. Once it has expired, the app shows that changes wait for the cloud and
 *   one tap renews access and synchronises.
 * - A synchronisation downloads the cloud copy, merges it into the local database in one
 *   transaction (merge.ts: nothing learnt on either device is lost) and uploads the result
 *   when it differs from the cloud copy.
 * - The device stays the source of truth: everything works offline and without an account.
 */
import Dexie from 'dexie';
import { CLOUD_META_KEY, cloudConfigured } from '../../config/cloud';
import { db, getMeta, sandboxActive, setMeta, TABLES, type PolyglotDB, type TableName } from '../db';
import { BackupError, backupFile, readAll, validateBackup, type BackupData } from '../backup';
import { isNative } from '../platform';
import { canonicalJson, fingerprint, mergeData } from './merge';
import { CloudError, fetchAccount, loadGoogle, requestAccessToken, revokeAccess, type AccessToken, type CloudAccount, type CloudErrorCode } from './google';
import { createFile, deleteFile, downloadFile, listSyncFiles, updateFile } from './drive';

export type SyncState = 'idle' | 'connecting' | 'syncing' | 'synced' | 'offline' | 'error';

/** Stored in meta (device-only, never synchronised itself). */
export interface CloudMeta {
  account: CloudAccount | null;
  /** Synchronise by itself while access is valid. */
  autoSync: boolean;
  lastSyncAt: number | null;
  /** Fingerprint of the data as last synchronised; local changes are detected against it. */
  syncedPrint: string | null;
  /** Drive's modification time of the cloud copy after the last sync: unchanged = no download. */
  remoteModified: string | null;
}

export interface CloudSnapshot extends CloudMeta {
  /** Built with a Google client id and running where Google allows its sign-in (not the APK). */
  available: boolean;
  state: SyncState;
  /** An access token is valid now. */
  connected: boolean;
  /** This device has changes that are not in the cloud copy yet. */
  dirty: boolean;
  error: CloudErrorCode | null;
}

export const defaultCloudMeta: CloudMeta = { account: null, autoSync: true, lastSyncAt: null, syncedPrint: null, remoteModified: null };

const TOKEN_KEY = 'pq.cloud.token';
/** Quiet time after the last change before synchronising. */
const DEBOUNCE_MS = 10_000;
/** Longest delay while changes keep coming (time statistics are saved every few seconds). */
const MAX_WAIT_MS = 5 * 60_000;
/** On returning to the app, fetch other devices' changes if the last sync is older than this. */
const PULL_AFTER_MS = 5 * 60_000;
/** A token is treated as expired a minute early. */
const TOKEN_MARGIN_MS = 60_000;

function readStoredToken(): AccessToken | null {
  try {
    const t = JSON.parse(sessionStorage.getItem(TOKEN_KEY) ?? 'null') as AccessToken | null;
    return t && typeof t.token === 'string' && typeof t.expiresAt === 'number' ? t : null;
  } catch {
    return null;
  }
}

function storeToken(t: AccessToken | null) {
  try {
    if (t) sessionStorage.setItem(TOKEN_KEY, JSON.stringify(t));
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // No session storage: the token lives in memory only.
  }
}

function parseRemote(raw: unknown): BackupData {
  try {
    return validateBackup(raw).data;
  } catch (e) {
    throw new CloudError('format', e instanceof BackupError ? e.message : String(e));
  }
}

export class CloudSync {
  private snap: CloudSnapshot;
  private readonly listeners = new Set<() => void>();
  private readonly settingsListeners = new Set<() => void>();
  private token: AccessToken | null = null;
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;
  private quietTimer: ReturnType<typeof setTimeout> | null = null;
  private firstChangeAt = 0;
  private running: Promise<void> | null = null;
  private queued = false;
  private started = false;

  constructor(
    private readonly database: PolyglotDB = db,
    // Never in the developer sandbox: test data must not reach the real cloud copy.
    available = cloudConfigured() && !isNative() && !sandboxActive(),
  ) {
    this.snap = { ...defaultCloudMeta, available, state: 'idle', connected: false, dirty: false, error: null };
  }

  readonly getSnapshot = (): CloudSnapshot => this.snap;

  readonly subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  /** Called when a synchronisation changed the settings record (the app then reloads them). */
  onSettingsChanged(cb: () => void): () => void {
    this.settingsListeners.add(cb);
    return () => this.settingsListeners.delete(cb);
  }

  private set(patch: Partial<CloudSnapshot>) {
    this.snap = { ...this.snap, ...patch };
    for (const l of this.listeners) l();
  }

  /** Loads the account state and starts watching for changes. Safe to call more than once. */
  async start(): Promise<void> {
    if (this.started || !this.snap.available) return;
    this.started = true;
    const meta = await getMeta<CloudMeta>(CLOUD_META_KEY, defaultCloudMeta, this.database);
    this.set({ ...defaultCloudMeta, ...meta });
    const stored = readStoredToken();
    if (stored && meta.account) this.setAccessToken(stored);

    const prefix = `idb://${this.database.name}/`;
    Dexie.on('storagemutated', (parts) => {
      const tables = new Set(
        Object.keys(parts)
          .filter((k) => k.startsWith(prefix))
          .map((k) => k.slice(prefix.length).split('/')[0]),
      );
      if (!tables.size) return;
      // Time statistics are saved every few seconds while the app is open: on their own they
      // are uploaded at most every few minutes, and they never postpone other changes.
      if (tables.size === 1 && tables.has('dailyStats')) this.scheduleSync(MAX_WAIT_MS, false);
      else this.scheduleSync();
    });
    window.addEventListener('online', () => this.scheduleSync(0));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
      else this.pullIfStale();
    });

    if (!meta.account) return;
    // Ready for a one-tap reconnect (the pop-up must open straight from the click).
    loadGoogle().catch(() => {});
    if (await this.checkDirty()) this.scheduleSync(0);
    else this.pullIfStale();
  }

  /** Uses an access token (from the sign-in pop-up; tests set one directly). */
  setAccessToken(t: AccessToken | null) {
    this.token = t;
    storeToken(t);
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    const valid = this.validToken() !== null;
    if (t && valid) {
      this.expiryTimer = setTimeout(() => this.set({ connected: false }), Math.min(t.expiresAt - TOKEN_MARGIN_MS - Date.now(), 2 ** 31 - 1));
    }
    this.set({ connected: valid });
  }

  private validToken(): string | null {
    return this.token && this.token.expiresAt - TOKEN_MARGIN_MS > Date.now() ? this.token.token : null;
  }

  /** Re-checks whether local data differs from what was last synchronised. */
  async checkDirty(): Promise<boolean> {
    if (!this.snap.account) return false;
    const dirty = fingerprint(await readAll(this.database)) !== this.snap.syncedPrint;
    if (dirty !== this.snap.dirty) this.set({ dirty });
    return dirty;
  }

  /**
   * Debounced: synchronises once changes have settled (if signed in and access is valid).
   * With `extend` false a pending synchronisation is left as it is.
   */
  scheduleSync(delay = DEBOUNCE_MS, extend = true) {
    if (!this.snap.account || (this.quietTimer && !extend)) return;
    const now = Date.now();
    if (this.quietTimer) clearTimeout(this.quietTimer);
    else this.firstChangeAt = now;
    const wait = Math.max(0, Math.min(delay, this.firstChangeAt + MAX_WAIT_MS - now));
    this.quietTimer = setTimeout(() => {
      this.quietTimer = null;
      this.onQuiet().catch((e) => console.warn('Cloud sync check failed', e));
    }, wait);
  }

  private async onQuiet() {
    const dirty = await this.checkDirty();
    if (dirty && this.snap.autoSync && this.validToken()) await this.sync();
  }

  /** The app goes to the background: synchronise pending changes now. */
  private flush() {
    if (!this.quietTimer) return;
    clearTimeout(this.quietTimer);
    this.quietTimer = null;
    this.onQuiet().catch(() => {});
  }

  private pullIfStale() {
    const { account, autoSync, lastSyncAt } = this.snap;
    if (this.validToken() === null) {
      if (this.snap.connected) this.set({ connected: false });
      return;
    }
    if (account && autoSync && (!lastSyncAt || Date.now() - lastSyncAt > PULL_AFTER_MS)) this.sync().catch(() => {});
  }

  /** Synchronises now when access is valid; otherwise only reports that it is not. */
  sync(): Promise<void> {
    // Unavailable (no client id, the APK, the developer sandbox): never touch the cloud copy.
    if (!this.snap.available) return Promise.resolve();
    if (this.running) {
      this.queued = true;
      return this.running;
    }
    this.running = this.runSync().finally(() => {
      this.running = null;
      if (this.queued) {
        this.queued = false;
        this.sync().catch(() => {});
      }
    });
    return this.running;
  }

  private async runSync(): Promise<void> {
    if (!this.snap.account) return;
    const token = this.validToken();
    if (!token) {
      this.set({ connected: false });
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.set({ state: 'offline' });
      return;
    }
    this.set({ state: 'syncing', error: null });
    try {
      const files = await listSyncFiles(token);
      const [primary, ...extra] = files;
      // The copy this device uploaded last is still there untouched: no need to download it.
      const untouched = Boolean(primary && !extra.length && primary.modifiedTime && primary.modifiedTime === this.snap.remoteModified && this.snap.syncedPrint);
      let remotePrint = untouched ? this.snap.syncedPrint : null;
      let changed = new Set<TableName>();
      if (!untouched) {
        const remotes: BackupData[] = [];
        for (const f of files) remotes.push(parseRemote(await downloadFile(token, f.id)));
        changed = await this.mergeIntoLocal(remotes);
        remotePrint = remotes.length ? fingerprint(remotes[0]) : null;
      }
      const data = await readAll(this.database);
      const print = fingerprint(data);
      let remoteModified = primary?.modifiedTime ?? null;
      if (!primary) remoteModified = (await createFile(token, JSON.stringify(backupFile(data)))).modifiedTime ?? null;
      else if (extra.length || remotePrint !== print) remoteModified = (await updateFile(token, primary.id, JSON.stringify(backupFile(data)))).modifiedTime ?? null;
      for (const f of extra) await deleteFile(token, f.id);
      await this.saveMeta({ lastSyncAt: Date.now(), syncedPrint: print, remoteModified });
      this.set({ state: 'synced', dirty: false });
      if (changed.has('settings')) for (const l of this.settingsListeners) l();
    } catch (e) {
      this.fail(e);
    }
  }

  /** Merges the cloud copies into the local database in one transaction; returns changed tables. */
  private async mergeIntoLocal(remotes: BackupData[]): Promise<Set<TableName>> {
    const changed = new Set<TableName>();
    if (!remotes.length) return changed;
    const d = this.database;
    await d.transaction('rw', TABLES.map((t) => d.table(t)), async () => {
      const local = await readAll(d);
      const merged = remotes.reduce<BackupData>((acc, r) => mergeData(acc, r), local);
      for (const t of TABLES) {
        if (canonicalJson(merged[t]) === canonicalJson(local[t])) continue;
        changed.add(t);
        // The merge never removes records, so writing them all is enough.
        await d.table(t).bulkPut(merged[t]);
      }
    });
    return changed;
  }

  private fail(e: unknown) {
    const code: CloudErrorCode = e instanceof CloudError ? e.code : 'server';
    if (code === 'auth') {
      this.setAccessToken(null);
      this.set({ state: 'idle', error: null });
    } else if (code === 'network') {
      this.set({ state: 'offline', error: null });
    } else if (code === 'cancelled') {
      this.set({ state: 'idle', error: null });
    } else {
      console.warn('Cloud sync failed', e);
      this.set({ state: 'error', error: code });
    }
  }

  private async saveMeta(patch: Partial<CloudMeta>) {
    const { account, autoSync, lastSyncAt, syncedPrint, remoteModified } = this.snap;
    const next: CloudMeta = { account, autoSync, lastSyncAt, syncedPrint, remoteModified, ...patch };
    this.set(next);
    await setMeta(CLOUD_META_KEY, next, this.database);
  }

  /** Gets a fresh token through Google's pop-up. Must be started by a click. */
  private async authorize(): Promise<AccessToken> {
    const account = this.snap.account;
    const t = await requestAccessToken(account ? { prompt: '', hint: account.sub } : { prompt: 'select_account' });
    this.setAccessToken(t);
    return t;
  }

  /**
   * Signs in with Google (or renews access) and synchronises. Call it from a click handler.
   * Resolves to the result state so the caller can show a message.
   */
  async connect(): Promise<SyncState> {
    if (!this.snap.available) return this.snap.state;
    this.set({ state: 'connecting', error: null });
    try {
      const t = await this.authorize();
      const who = await fetchAccount(t.token);
      const prev = this.snap.account;
      const newAccount = !prev || prev.sub !== who.sub;
      // Another account's copy has never been merged with this device.
      await this.saveMeta(newAccount ? { account: who, lastSyncAt: null, syncedPrint: null, remoteModified: null } : { account: who });
      this.set({ state: 'idle' });
      await this.sync();
      if (newAccount && who.givenName) await this.suggestName(who.givenName);
    } catch (e) {
      this.fail(e);
    }
    return this.snap.state;
  }

  /** Uses the account's first name for the greeting unless the learner already chose a name. */
  private async suggestName(name: string) {
    const s = await this.database.settings.get('app');
    if (!s || s.displayName) return;
    await this.database.settings.update('app', { displayName: name.slice(0, 30) });
    for (const l of this.settingsListeners) l();
  }

  async setAutoSync(autoSync: boolean): Promise<void> {
    await this.saveMeta({ autoSync });
    if (autoSync) this.scheduleSync(0);
  }

  /** Signs out on this device and withdraws the app's access; data stays here and on Drive. */
  async signOut(): Promise<void> {
    const token = this.token?.token;
    if (this.quietTimer) clearTimeout(this.quietTimer);
    this.quietTimer = null;
    this.setAccessToken(null);
    await this.saveMeta({ ...defaultCloudMeta });
    this.set({ state: 'idle', dirty: false, error: null });
    if (token) await revokeAccess(token).catch(() => {});
  }

  /** Deletes the copy on Drive, then signs out. Call it from a click handler. */
  async deleteCloudCopyAndSignOut(): Promise<boolean> {
    if (!this.snap.available) return false;
    this.set({ state: 'connecting', error: null });
    try {
      const token = this.validToken() ?? (await this.authorize()).token;
      for (const f of await listSyncFiles(token)) await deleteFile(token, f.id);
      await this.signOut();
      return true;
    } catch (e) {
      this.fail(e);
      return false;
    }
  }
}
