/**
 * Local audit log of privileged actions (developer tools). Kept in the real database, also
 * when acting in the sandbox, so resetting test data does not erase it. Device-only: never
 * synchronised or exported. There is no server, so this is a record for the developer, not a
 * tamper-proof trail (docs/DEVELOPER_ACCESS.md).
 */
import { createDb, db, DB_NAME, getMeta, sandboxActive, setMeta, type PolyglotDB } from './db';
import type { Principal, Role } from '../auth/permissions';
import { redact } from './diagnostics';

export const AUDIT_KEY = 'devAudit';
const MAX_ENTRIES = 200;

export interface AuditEntry {
  at: number;
  action: string;
  detail?: string;
  role: Role;
  sandbox: boolean;
}

let mainDb: PolyglotDB | null = null;
/** The learner's real database, even while the app runs on the sandbox. */
export function realDb(): PolyglotDB {
  if (!sandboxActive()) return db;
  mainDb ??= createDb(DB_NAME);
  return mainDb;
}

export async function audit(principal: Principal, action: string, detail?: string, database: PolyglotDB = realDb(), sandbox = sandboxActive()): Promise<void> {
  const log = await getMeta<AuditEntry[]>(AUDIT_KEY, [], database);
  const entry: AuditEntry = { at: Date.now(), action, role: principal.role, sandbox, ...(detail ? { detail: redact(detail) } : {}) };
  await setMeta(AUDIT_KEY, [entry, ...log].slice(0, MAX_ENTRIES), database);
}

export async function auditLog(database: PolyglotDB = realDb()): Promise<AuditEntry[]> {
  return getMeta<AuditEntry[]>(AUDIT_KEY, [], database);
}
