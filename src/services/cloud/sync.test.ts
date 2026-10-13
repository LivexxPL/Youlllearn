import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CloudSync } from './sync';
import { createDb, getMeta, setMeta, type PolyglotDB, type Settings } from '../db';
import { addStats, recordLessonCompletion, type SessionOutcomes } from '../progress';
import { exportData, importData } from '../backup';
import { getCourse } from '../../content/registry';
import { defaultSettings } from '../../state/settings';
import { CLOUD_META_KEY } from '../../config/cloud';

/** In-memory stand-in for the Drive endpoints the app uses. */
class FakeDrive {
  files = new Map<string, { body: string; modifiedTime: string }>();
  calls: string[] = [];
  private clock = 0;
  token = 'good';

  private stamp() {
    return new Date(Date.UTC(2026, 9, 10) + ++this.clock * 1000).toISOString();
  }

  put(body: unknown, id = `f${this.files.size + 1}`) {
    this.files.set(id, { body: JSON.stringify(body), modifiedTime: this.stamp() });
    return id;
  }

  json(id: string) {
    return JSON.parse(this.files.get(id)!.body) as { data: Record<string, unknown[]> };
  }

  fetch = async (input: string | URL, init: RequestInit = {}): Promise<Response> => {
    const url = new URL(String(input));
    const method = init.method ?? 'GET';
    this.calls.push(`${method} ${url.pathname}`);
    const headers = init.headers as Record<string, string>;
    if (headers.Authorization !== `Bearer ${this.token}`) return new Response('{"error":"invalid_token"}', { status: 401 });
    const id = url.pathname.split('/').pop()!;
    if (method === 'GET' && url.pathname === '/drive/v3/files') {
      expect(url.searchParams.get('spaces')).toBe('appDataFolder');
      const files = [...this.files.entries()].map(([fid, f]) => ({ id: fid, modifiedTime: f.modifiedTime })).sort((a, b) => b.modifiedTime.localeCompare(a.modifiedTime));
      return Response.json({ files });
    }
    if (method === 'GET' && url.searchParams.get('alt') === 'media') {
      const f = this.files.get(id);
      return f ? new Response(f.body) : new Response('', { status: 404 });
    }
    if (method === 'POST' && url.pathname === '/upload/drive/v3/files') {
      const boundary = /boundary=(.+)$/.exec(headers['Content-Type'])![1];
      const [metaPart, bodyPart] = String(init.body).split(`--${boundary}`).slice(1, 3);
      const meta = JSON.parse(metaPart.split('\r\n\r\n')[1]) as { parents: string[] };
      expect(meta.parents).toEqual(['appDataFolder']);
      const newId = `f${this.files.size + 1}`;
      this.files.set(newId, { body: bodyPart.split('\r\n\r\n')[1].replace(/\r\n$/, ''), modifiedTime: this.stamp() });
      return Response.json({ id: newId, modifiedTime: this.files.get(newId)!.modifiedTime });
    }
    if (method === 'PATCH') {
      if (!this.files.has(id)) return new Response('', { status: 404 });
      this.files.set(id, { body: String(init.body), modifiedTime: this.stamp() });
      return Response.json({ id, modifiedTime: this.files.get(id)!.modifiedTime });
    }
    if (method === 'DELETE') {
      this.files.delete(id);
      return new Response(null, { status: 204 });
    }
    return new Response('', { status: 400 });
  };
}

const es = getCourse('es');
const outcomes = (): SessionOutcomes => ({ byRef: new Map(), graded: 8, correct: 7, xp: 70, bestRun: 5, speaking: 0, writing: 0 });
const account = { sub: '123', email: 'learner@example.com', name: 'Ola Nowak', givenName: 'Ola' };

/** A device signed in to the fake Drive account. */
async function device(onboarded = true): Promise<{ d: PolyglotDB; sync: CloudSync }> {
  const d = createDb(`test-cloud-${Math.random()}`);
  await d.settings.put({ ...defaultSettings(), onboarded, courses: ['es'] } satisfies Settings);
  await setMeta(CLOUD_META_KEY, { account, autoSync: true, lastSyncAt: null, syncedPrint: null, remoteModified: null }, d);
  const sync = new CloudSync(d, true);
  // What start() does, without the browser event listeners.
  (sync as unknown as { set(p: object): void }).set({ account });
  sync.setAccessToken({ token: 'good', expiresAt: Date.now() + 3_600_000 });
  return { d, sync };
}

let drive: FakeDrive;
beforeEach(() => {
  drive = new FakeDrive();
  vi.stubGlobal('fetch', drive.fetch);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('cloud synchronisation', () => {
  it('uploads the first copy, then stays quiet until something changes', async () => {
    const { d, sync } = await device();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, d);
    expect(await sync.checkDirty()).toBe(true);
    await sync.sync();
    expect(sync.getSnapshot()).toMatchObject({ state: 'synced', dirty: false });
    expect(drive.files.size).toBe(1);
    expect(drive.json('f1').data.lessonProgress).toHaveLength(1);

    drive.calls = [];
    await sync.sync();
    // Nothing changed here or in the cloud: one listing, no download, no upload.
    expect(drive.calls).toEqual(['GET /drive/v3/files']);
    expect(await sync.checkDirty()).toBe(false);

    await addStats({ activeSec: 60 }, 'es', '2026-10-10', d);
    expect(await sync.checkDirty()).toBe(true);
    drive.calls = [];
    await sync.sync();
    expect(drive.calls).toEqual(['GET /drive/v3/files', 'PATCH /upload/drive/v3/files/f1']);
  });

  it('restores everything onto a new device and reports the new settings', async () => {
    const a = await device();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, a.d);
    await a.sync.sync();

    const b = await device(false);
    const settingsChanged = vi.fn();
    b.sync.onSettingsChanged(settingsChanged);
    await b.sync.sync();
    expect(settingsChanged).toHaveBeenCalledOnce();
    expect((await b.d.settings.get('app'))?.onboarded).toBe(true);
    expect(await b.d.lessonProgress.count()).toBe(1);
    expect(await b.d.cards.count()).toBe(await a.d.cards.count());
  });

  it('combines learning done on two devices', async () => {
    const a = await device();
    const b = await device();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, a.d);
    await recordLessonCompletion({ course: es, lessonId: 'es.l02', outcomes: outcomes() }, b.d);
    await a.sync.sync();
    await b.sync.sync();
    await a.sync.sync();
    for (const d of [a.d, b.d]) expect((await d.lessonProgress.toArray()).map((p) => p.id)).toEqual(['es.l01', 'es.l02']);
    expect(drive.json('f1').data.lessonProgress).toHaveLength(2);
    expect(drive.files.size).toBe(1);
  });

  it('asks for a new sign-in when access has expired, without touching the data', async () => {
    const { d, sync } = await device();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, d);
    drive.token = 'rotated';
    await sync.sync();
    expect(sync.getSnapshot()).toMatchObject({ connected: false, state: 'idle', error: null });
    expect(drive.files.size).toBe(0);
    expect(await d.lessonProgress.count()).toBe(1);

    sync.setAccessToken({ token: 'old', expiresAt: Date.now() + 30_000 });
    // A token about to expire is not used at all.
    drive.calls = [];
    await sync.sync();
    expect(drive.calls).toEqual([]);
  });

  it('never overwrites a cloud copy it cannot read', async () => {
    drive.put({ app: 'polyglot-quest', format: 99, data: {} });
    const { sync } = await device();
    await sync.sync();
    expect(sync.getSnapshot()).toMatchObject({ state: 'error', error: 'format' });
    expect(JSON.parse(drive.files.get('f1')!.body).format).toBe(99);
  });

  it('folds duplicate cloud copies (two devices creating one at once) into one', async () => {
    const a = await device();
    const b = await device();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, a.d);
    await recordLessonCompletion({ course: es, lessonId: 'es.l03', outcomes: outcomes() }, b.d);
    drive.put(await exportData(a.d));
    drive.put(await exportData(b.d));
    const c = await device();
    await c.sync.sync();
    expect(drive.files.size).toBe(1);
    expect((await c.d.lessonProgress.toArray()).map((p) => p.id)).toEqual(['es.l01', 'es.l03']);
    const [only] = [...drive.files.keys()];
    expect(drive.json(only).data.lessonProgress).toHaveLength(2);
  });

  it("keeps device-only records out of the cloud and out of imports", async () => {
    const { d, sync } = await device();
    await setMeta('resume:es', { lessonId: 'es.l02', index: 2, total: 9, seed: 1 }, d);
    await sync.sync();
    const keys = (drive.json('f1').data.meta as { key: string }[]).map((m) => m.key);
    expect(keys).not.toContain('resume:es');
    expect(keys).not.toContain(CLOUD_META_KEY);

    // Backup files leave the sign-in out, and importing one (even an old file that has it) keeps this device's.
    const other = createDb(`test-cloud-other-${Math.random()}`);
    await setMeta(CLOUD_META_KEY, { account: { sub: 'someone-else' } }, other);
    const file = await exportData(other);
    expect(file.data.meta).toEqual([]);
    file.data.meta.push({ key: CLOUD_META_KEY, value: { account: { sub: 'someone-else' } } });
    await importData(file, d);
    expect((await getMeta<{ account: { sub: string } }>(CLOUD_META_KEY, { account: { sub: '' } }, d)).account.sub).toBe('123');
  });

  it('does nothing where synchronisation is unavailable (e.g. the developer sandbox)', async () => {
    const d = createDb(`test-cloud-off-${Math.random()}`);
    await setMeta(CLOUD_META_KEY, { account, autoSync: true, lastSyncAt: null, syncedPrint: null, remoteModified: null }, d);
    const off = new CloudSync(d, false);
    (off as unknown as { set(p: object): void }).set({ account });
    off.setAccessToken({ token: 'good', expiresAt: Date.now() + 3_600_000 });
    await off.sync();
    expect(await off.connect()).toBe('idle');
    expect(await off.deleteCloudCopyAndSignOut()).toBe(false);
    expect(drive.calls).toEqual([]);
  });

  it('signs out without deleting anything', async () => {
    const { d, sync } = await device();
    await recordLessonCompletion({ course: es, lessonId: 'es.l01', outcomes: outcomes() }, d);
    await sync.sync();
    await sync.signOut();
    expect(sync.getSnapshot()).toMatchObject({ account: null, connected: false });
    expect(await d.lessonProgress.count()).toBe(1);
    expect(drive.files.size).toBe(1);
  });
});
