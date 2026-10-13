/**
 * Which accounts have which role. The source of truth is the build configuration — set by the
 * repository owner, never by the app or its stored data:
 *
 *   VITE_DEVELOPER_ACCOUNTS / VITE_ADMIN_ACCOUNTS = comma-separated role ids
 *
 * A role id is SHA-256 of a fixed prefix and the Google account id (`sub`) returned by Google
 * at sign-in. It is not a secret and does not reveal the account id; the account id itself is
 * never in the build. Display names and e-mail addresses play no part. CI passes the
 * repository variables DEVELOPER_ACCOUNT_IDS / ADMIN_ACCOUNT_IDS (docs/DEVELOPER_ACCESS.md).
 */
import type { Role } from './permissions';

const ROLE_ID_PREFIX = 'polyglot-quest/role-id/v1:';
const ROLE_ID = /^[0-9a-f]{64}$/;

export function parseRoleIds(value: string | undefined): ReadonlySet<string> {
  return new Set(
    (value ?? '')
      .split(/[\s,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => ROLE_ID.test(s)),
  );
}

export interface RoleAssignments {
  developer: ReadonlySet<string>;
  admin: ReadonlySet<string>;
}

/** Assignments compiled into this build. */
export const BUILD_ROLES: RoleAssignments = {
  developer: parseRoleIds(import.meta.env.VITE_DEVELOPER_ACCOUNTS),
  admin: parseRoleIds(import.meta.env.VITE_ADMIN_ACCOUNTS),
};

export async function roleIdFor(sub: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ROLE_ID_PREFIX + sub));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Developer before admin; everyone else (and every unknown id) is a user. */
export function roleFor(roleId: string | null, assignments: RoleAssignments = BUILD_ROLES): Role {
  if (!roleId) return 'user';
  if (assignments.developer.has(roleId)) return 'developer';
  if (assignments.admin.has(roleId)) return 'admin';
  return 'user';
}
