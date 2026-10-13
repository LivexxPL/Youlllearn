import { describe, expect, it } from 'vitest';
import { ANONYMOUS, PERMISSIONS, POLICY, assertCan, can, contentAccess, permissionsOf, PermissionError, type Principal } from './permissions';
import { parseRoleIds, roleFor, roleIdFor, type RoleAssignments } from './roles';
import { AuthStore } from './session';
import { mayUseCosmetic, releaseUnusable } from './entitlements';
import { createDb, setMeta } from '../services/db';
import { defaultSettings, NO_COSMETICS } from '../state/settings';
import { CLOUD_META_KEY } from '../config/cloud';

const principal = (role: Principal['role'], verified = true): Principal => ({ role, roleId: 'x'.repeat(64), verified });

async function assignments(dev: string[], admin: string[] = []): Promise<RoleAssignments> {
  return { developer: new Set(await Promise.all(dev.map(roleIdFor))), admin: new Set(await Promise.all(admin.map(roleIdFor))) };
}

describe('permission policy', () => {
  it('gives users nothing extra, admins read-only insight and developers everything', () => {
    expect(permissionsOf(principal('user'))).toEqual([]);
    expect(permissionsOf(principal('admin'))).toEqual(['devtools.dashboard', 'devtools.diagnostics', 'devtools.catalog']);
    expect(permissionsOf(principal('developer'))).toEqual([...PERMISSIONS]);
    expect(POLICY.developer).toBe('all');
  });

  it('denies by default: no principal, unverified identity or an unknown role', () => {
    for (const p of PERMISSIONS) {
      expect(can(null, p)).toBe(false);
      expect(can(ANONYMOUS, p)).toBe(false);
      expect(can(principal('developer', false), p)).toBe(false);
      expect(can({ role: 'root' as never, roleId: null, verified: true }, p)).toBe(false);
    }
  });

  it('lets services refuse without the permission', () => {
    expect(() => assertCan(principal('admin'), 'sandbox.use')).toThrow(PermissionError);
    expect(() => assertCan(principal('developer'), 'sandbox.use')).not.toThrow();
  });

  it('opens locked content only as a marked preview for developers', () => {
    expect(contentAccess(principal('user'), true)).toBe('open');
    expect(contentAccess(principal('user'), false)).toBe('locked');
    expect(contentAccess(principal('admin'), false)).toBe('locked');
    expect(contentAccess(principal('developer'), false)).toBe('preview');
  });
});

describe('role ids and assignments', () => {
  it('derive a salted, stable id from the Google account id', async () => {
    const a = await roleIdFor('109876543210987654321');
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await roleIdFor('109876543210987654321')).toBe(a);
    expect(await roleIdFor('109876543210987654322')).not.toBe(a);
    // Not the plain hash of the id (a prefix is mixed in).
    const plain = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('109876543210987654321')))].map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(a).not.toBe(plain);
  });

  it('read only well-formed ids from the configuration', () => {
    const id = 'A'.repeat(64);
    expect([...parseRoleIds(` ${id}, nonsense;  ${'b'.repeat(64)}\n`)]).toEqual(['a'.repeat(64), 'b'.repeat(64)]);
    expect(parseRoleIds(undefined).size).toBe(0);
    expect(parseRoleIds('admin@example.com,developer').size).toBe(0);
  });

  it('give developer precedence and make everyone else a user', async () => {
    const roles = await assignments(['dev'], ['adm', 'dev']);
    expect(roleFor(await roleIdFor('dev'), roles)).toBe('developer');
    expect(roleFor(await roleIdFor('adm'), roles)).toBe('admin');
    expect(roleFor(await roleIdFor('someone'), roles)).toBe('user');
    expect(roleFor(null, roles)).toBe('user');
  });
});

describe('session', () => {
  it('recognises the developer account after sign-in and drops the role on sign-out or another account', async () => {
    const store = new AuthStore(await assignments(['dev-sub'], ['admin-sub']), false);
    const changes: string[] = [];
    store.onChange((prev, next) => changes.push(`${prev.role}->${next.role}`));
    expect((await store.setAccount('dev-sub')).role).toBe('developer');
    expect(can(store.getSnapshot().principal, 'cosmetics.useAll')).toBe(true);
    expect((await store.setAccount(null)).role).toBe('user');
    expect(store.getSnapshot().principal).toEqual(ANONYMOUS);
    expect((await store.setAccount('someone-else')).role).toBe('user');
    expect((await store.setAccount('admin-sub')).role).toBe('admin');
    // Every change of account is reported, also between two plain users.
    expect(changes).toEqual(['user->developer', 'developer->user', 'user->user', 'user->admin']);
  });

  it('lets the latest of two quick account changes win', async () => {
    const store = new AuthStore(await assignments(['dev-sub']), false);
    const [, last] = await Promise.all([store.setAccount('dev-sub'), store.setAccount('other')]);
    expect(last.role).toBe('user');
    expect(store.getSnapshot().principal.role).toBe('user');
  });

  it('cannot be promoted by editing stored data: only the account id counts', async () => {
    const roles = await assignments(['dev-sub']);
    const d = createDb(`test-auth-${Math.random()}`);
    // Everything a curious user might try in IndexedDB.
    await d.settings.put({ ...defaultSettings(), onboarded: true, ...({ role: 'developer', isAdmin: true } as object) });
    await setMeta('role', 'developer', d);
    await setMeta('permissions', ['sandbox.use'], d);
    await setMeta(CLOUD_META_KEY, { account: { sub: 'my-own-id', name: 'Developer', email: 'developer@polyglot.quest', role: 'developer' } }, d);
    const store = new AuthStore(roles, false);
    await store.start(d);
    expect(store.getSnapshot().principal.role).toBe('user');
    expect(PERMISSIONS.some((p) => can(store.getSnapshot().principal, p))).toBe(false);

    // A real developer sign-in on the device is recognised automatically on start.
    await setMeta(CLOUD_META_KEY, { account: { sub: 'dev-sub', name: 'Anyone', email: 'x@example.com' } }, d);
    const again = new AuthStore(roles, false);
    await again.start(d);
    expect(again.getSnapshot().principal.role).toBe('developer');
  });
});

describe('developer entitlements', () => {
  it('let a developer use every cosmetic without owning it, and nobody else', () => {
    const owned = new Set(['theme-classic']);
    expect(mayUseCosmetic(owned, principal('developer'), 'theme-galaxy')).toBe(true);
    expect(mayUseCosmetic(owned, principal('admin'), 'theme-galaxy')).toBe(false);
    expect(mayUseCosmetic(owned, principal('user'), 'theme-galaxy')).toBe(false);
    expect(mayUseCosmetic(owned, ANONYMOUS, 'theme-classic')).toBe(true);
  });

  it('take off what may no longer be used once the role is gone', () => {
    const settings = { palette: 'galaxy' as const, cosmetics: { ...NO_COSMETICS, frame: 'frame-gold', badge: 'badge-star' } };
    const owned = new Set(['theme-classic', 'badge-star']);
    expect(releaseUnusable(settings, owned, principal('developer'))).toEqual({});
    expect(releaseUnusable(settings, owned, ANONYMOUS)).toEqual({ palette: 'classic', cosmetics: { ...NO_COSMETICS, badge: 'badge-star' } });
  });
});
