/**
 * Role-based access control: the only place that decides what a role may do.
 *
 * - `user`: the normal app (default for everyone, also when signed out).
 * - `admin`: read-only insight — the dashboard, diagnostics and catalogues.
 * - `developer`: every permission, including ones added later.
 *
 * Features ask `can(principal, permission)`; nothing else in the app checks role names.
 * Unknown roles, missing principals and unverified identities get nothing beyond `user`.
 * See docs/DEVELOPER_ACCESS.md (including the limits of a client-only app).
 */

export const ROLES = ['user', 'admin', 'developer'] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  /** Open the developer/admin dashboard. */
  'devtools.dashboard',
  /** Technical diagnostics, recent errors and the local audit log. */
  'devtools.diagnostics',
  /** Browse every lesson, story and cosmetic with its state. */
  'devtools.catalog',
  /** Use features that are not released yet (src/config/features.ts). */
  'features.preview',
  /** Open content that is normally locked (e.g. stories before their lesson). */
  'content.unlockAll',
  /** Equip any cosmetic without owning it. Writes nothing to the coin ledger. */
  'cosmetics.useAll',
  /** Separate test data: simulate coins, XP, streaks, progress and onboarding. */
  'sandbox.use',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ALL = 'all' as const;

/** The policy. A developer gets everything, so new permissions apply to developers at once. */
export const POLICY: Readonly<Record<Role, typeof ALL | readonly Permission[]>> = {
  user: [],
  admin: ['devtools.dashboard', 'devtools.diagnostics', 'devtools.catalog'],
  developer: ALL,
};

export interface Principal {
  role: Role;
  /** Role id of the signed-in account (salted SHA-256 of its Google account id), or null. */
  roleId: string | null;
  /** The identity comes from a Google sign-in completed on this device. */
  verified: boolean;
}

export const ANONYMOUS: Principal = { role: 'user', roleId: null, verified: false };

export function can(principal: Principal | null | undefined, permission: Permission): boolean {
  if (!principal || !principal.verified) return false;
  const granted = (POLICY as Record<string, typeof ALL | readonly Permission[] | undefined>)[principal.role];
  if (!granted) return false;
  return granted === ALL || granted.includes(permission);
}

export function permissionsOf(principal: Principal | null | undefined): Permission[] {
  return PERMISSIONS.filter((p) => can(principal, p));
}

export class PermissionError extends Error {
  constructor(readonly permission: Permission) {
    super(`Missing permission: ${permission}`);
    this.name = 'PermissionError';
  }
}

/** For services: refuses to act without the permission (hiding a button is not enough). */
export function assertCan(principal: Principal | null | undefined, permission: Permission): void {
  if (!can(principal, permission)) throw new PermissionError(permission);
}

/**
 * Access to a piece of content: open for everyone, opened only by a privilege ("preview",
 * shown as such), or locked. New content gates should use this so developers see everything.
 */
export function contentAccess(principal: Principal | null | undefined, normallyOpen: boolean): 'open' | 'preview' | 'locked' {
  if (normallyOpen) return 'open';
  return can(principal, 'content.unlockAll') ? 'preview' : 'locked';
}
