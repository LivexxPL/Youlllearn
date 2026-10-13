/**
 * The copy of the learner's data in Google Drive's application data folder: a hidden folder
 * that only this app can see (scope drive.appdata). It counts towards the user's Google
 * storage; the file is small (typically well under 1 MB).
 */
import { SYNC_FILE_NAME } from '../../config/cloud';
import { CloudError } from './google';

const API = 'https://www.googleapis.com/drive/v3';
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3';

export interface RemoteFile {
  id: string;
  modifiedTime?: string;
}

async function call(token: string, url: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${token}` } });
  } catch {
    throw new CloudError('network');
  }
  if (res.ok) return res;
  if (res.status === 401) throw new CloudError('auth');
  if (res.status === 404) throw new CloudError('notFound');
  const body = await res.text().catch(() => '');
  if (/storageQuotaExceeded|quotaExceeded/.test(body)) throw new CloudError('quota');
  if (res.status === 403 && /insufficient(Permissions|Scopes)|ACCESS_TOKEN_SCOPE_INSUFFICIENT/i.test(body)) throw new CloudError('scope');
  throw new CloudError('server', `HTTP ${res.status}`);
}

/** The app's copies, newest first (normally one; two devices syncing at once can make two). */
export async function listSyncFiles(token: string): Promise<RemoteFile[]> {
  const q = encodeURIComponent(`name='${SYNC_FILE_NAME}' and trashed=false`);
  const res = await call(token, `${API}/files?spaces=appDataFolder&q=${q}&orderBy=modifiedTime%20desc&pageSize=10&fields=files(id,modifiedTime)`);
  const j = (await res.json()) as { files?: RemoteFile[] };
  return j.files ?? [];
}

export async function downloadFile(token: string, id: string): Promise<unknown> {
  const res = await call(token, `${API}/files/${encodeURIComponent(id)}?alt=media`);
  try {
    return await res.json();
  } catch {
    throw new CloudError('format');
  }
}

export async function createFile(token: string, body: string): Promise<RemoteFile> {
  const boundary = `pq-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  const meta = { name: SYNC_FILE_NAME, parents: ['appDataFolder'], mimeType: 'application/json' };
  const multipart =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${body}\r\n--${boundary}--`;
  const res = await call(token, `${UPLOAD}/files?uploadType=multipart&fields=id,modifiedTime`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body: multipart,
  });
  return (await res.json()) as RemoteFile;
}

export async function updateFile(token: string, id: string, body: string): Promise<RemoteFile> {
  const res = await call(token, `${UPLOAD}/files/${encodeURIComponent(id)}?uploadType=media&fields=id,modifiedTime`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body,
  });
  return (await res.json()) as RemoteFile;
}

export async function deleteFile(token: string, id: string): Promise<void> {
  try {
    await call(token, `${API}/files/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    if (!(e instanceof CloudError && e.code === 'notFound')) throw e;
  }
}
