/**
 * The current principal: who is signed in on this device and which role that gives.
 *
 * The identity is the Google account recorded by a sign-in on this device (meta `cloud`,
 * device-only: never synchronised, exported or imported). The role follows from that
 * account's id and the build configuration (roles.ts) — nothing the app stores says "admin"
 * or "developer", so editing stored data cannot grant a role. Signing out, or signing in with
 * another account, recomputes the role at once.
 */
import { useSyncExternalStore } from 'react';
import { db, getMeta, sandboxActive, type PolyglotDB } from '../services/db';
import { CLOUD_META_KEY } from '../config/cloud';
import { cloud } from '../services/cloud';
import { ANONYMOUS, can, type Permission, type Principal } from './permissions';
import { roleFor, roleIdFor, type RoleAssignments, BUILD_ROLES } from './roles';

export interface AuthSnapshot {
  principal: Principal;
  /** The stored sign-in has been read (until then everyone is a plain user). */
  ready: boolean;
  /** Running on the sandbox database (test data). */
  sandbox: boolean;
}

type ChangeListener = (prev: Principal, next: Principal) => void;

export class AuthStore {
  private snap: AuthSnapshot;
  private readonly listeners = new Set<() => void>();
  private readonly changeListeners = new Set<ChangeListener>();
  private sub: string | null | undefined = undefined;
  private seq = 0;

  constructor(
    private readonly assignments: RoleAssignments = BUILD_ROLES,
    sandbox = sandboxActive(),
  ) {
    this.snap = { principal: ANONYMOUS, ready: false, sandbox };
  }

  readonly getSnapshot = (): AuthSnapshot => this.snap;

  readonly subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  /** Called when the principal changes (e.g. to drop privileged looks after signing out). */
  onChange(cb: ChangeListener): () => void {
    this.changeListeners.add(cb);
    return () => this.changeListeners.delete(cb);
  }

  async start(database: PolyglotDB = db): Promise<void> {
    const meta = await getMeta<{ account?: { sub?: unknown } | null }>(CLOUD_META_KEY, {}, database);
    const sub = meta.account && typeof meta.account.sub === 'string' ? meta.account.sub : null;
    await this.setAccount(sub);
    // Sign-in and sign-out happen through the cloud account; the sandbox keeps its copy.
    if (!this.snap.sandbox) cloud.subscribe(() => void this.setAccount(cloud.getSnapshot().account?.sub ?? null));
  }

  /** Recomputes the principal for a verified Google account id (null = signed out). */
  async setAccount(sub: string | null): Promise<Principal> {
    if (sub === this.sub && this.snap.ready) return this.snap.principal;
    this.sub = sub;
    const seq = ++this.seq;
    const roleId = sub ? await roleIdFor(sub) : null;
    if (seq !== this.seq) return this.snap.principal;
    const next: Principal = sub ? { role: roleFor(roleId, this.assignments), roleId, verified: true } : ANONYMOUS;
    const prev = this.snap.principal;
    this.snap = { ...this.snap, principal: next, ready: true };
    for (const l of this.listeners) l();
    if (prev.role !== next.role || prev.roleId !== next.roleId) for (const l of this.changeListeners) l(prev, next);
    return next;
  }
}

export const auth = new AuthStore();

export function useAuth() {
  const snap = useSyncExternalStore(auth.subscribe, auth.getSnapshot);
  return { ...snap, can: (permission: Permission) => can(snap.principal, permission) };
}
