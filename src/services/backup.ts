/**
 * Export / import of all local data as a JSON file, and full reset.
 * Import validates the file before replacing anything (single transaction).
 * The same format is used for the copy on Google Drive (services/cloud).
 */
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { db, isDeviceMeta, TABLES, type MetaRecord, type PolyglotDB, type TableName } from './db';
import { appVersion, isNative } from './platform';
import { dayKey } from '../engine/dates';

export const BACKUP_FORMAT = 1;

export type BackupData = Record<TableName, unknown[]>;

export interface BackupFile {
  app: 'polyglot-quest';
  format: number;
  exportedAt: string;
  appVersion: string;
  data: BackupData;
}

/**
 * All learner data in one consistent read, without this device's own meta records
 * (isDeviceMeta). Can run inside a wider read-write transaction.
 */
export async function readAll(database: PolyglotDB = db): Promise<BackupData> {
  const data = {} as BackupData;
  await database.transaction('r', TABLES.map((t) => database.table(t)), async () => {
    for (const t of TABLES) data[t] = await database.table(t).toArray();
  });
  data.meta = (data.meta as MetaRecord[]).filter((m) => !isDeviceMeta(m.key));
  return data;
}

export function backupFile(data: BackupData): BackupFile {
  return { app: 'polyglot-quest', format: BACKUP_FORMAT, exportedAt: new Date().toISOString(), appVersion, data };
}

export async function exportData(database: PolyglotDB = db): Promise<BackupFile> {
  return backupFile(await readAll(database));
}

export class BackupError extends Error {}

/** Throws BackupError with a user-facing (Polish) reason if the file is not a valid backup. */
export function validateBackup(raw: unknown): BackupFile {
  if (!raw || typeof raw !== 'object') throw new BackupError('to nie jest plik JSON z kopią zapasową');
  const f = raw as Partial<BackupFile>;
  if (f.app !== 'polyglot-quest') throw new BackupError('plik nie pochodzi z Polyglot Quest');
  if (typeof f.format !== 'number' || f.format > BACKUP_FORMAT) throw new BackupError('nieobsługiwana wersja pliku — zaktualizuj aplikację');
  if (!f.data || typeof f.data !== 'object') throw new BackupError('brak danych w pliku');
  for (const t of TABLES) {
    const rows = (f.data as Record<string, unknown>)[t];
    if (rows !== undefined && !Array.isArray(rows)) throw new BackupError(`uszkodzona tabela „${t}”`);
  }
  const cards = (f.data.cards ?? []) as { id?: unknown; courseId?: unknown; due?: unknown }[];
  if (cards.some((c) => typeof c.id !== 'string' || typeof c.due !== 'number')) throw new BackupError('uszkodzone karty powtórek');
  return f as BackupFile;
}

/** Replaces all learner data with the file's; this device's own meta records are kept. */
export async function importData(file: BackupFile, database: PolyglotDB = db): Promise<void> {
  await database.transaction('rw', TABLES.map((t) => database.table(t)), async () => {
    const deviceMeta = (await database.meta.toArray()).filter((m) => isDeviceMeta(m.key));
    for (const t of TABLES) {
      await database.table(t).clear();
      let rows = file.data[t] ?? [];
      if (t === 'meta') rows = [...(rows as MetaRecord[]).filter((m) => !isDeviceMeta(m.key)), ...deviceMeta];
      if (rows.length) await database.table(t).bulkPut(rows);
    }
  });
}

export async function resetAll(database: PolyglotDB = db): Promise<void> {
  await database.transaction('rw', TABLES.map((t) => database.table(t)), async () => {
    for (const t of TABLES) await database.table(t).clear();
  });
}

export function backupFileName(): string {
  return `polyglot-quest-${dayKey()}.json`;
}

/** Saves the backup: browser download on the web, share sheet on Android. */
export async function saveBackup(): Promise<void> {
  const file = await exportData();
  const json = JSON.stringify(file);
  const name = backupFileName();
  if (isNative()) {
    const res = await Filesystem.writeFile({ path: name, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: name, files: [res.uri] });
    return;
  }
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function readBackupFile(f: File): Promise<BackupFile> {
  const text = await f.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new BackupError('plik nie jest poprawnym JSON-em');
  }
  return validateBackup(parsed);
}
