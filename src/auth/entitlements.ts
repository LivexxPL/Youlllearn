/**
 * What the current account may use, on top of what it owns. A developer may equip every
 * cosmetic; this is an override computed from the role, never stored as ownership, so the
 * coin ledger stays exactly what the learner earned and bought.
 */
import { can, type Principal } from './permissions';
import { getItem, themeItemFor } from '../config/cosmetics';
import type { EquippedCosmetics, Settings } from '../services/db';
import type { PaletteId } from '../config/palettes';

export function mayUseCosmetic(owned: ReadonlySet<string>, principal: Principal | null | undefined, itemId: string): boolean {
  return owned.has(itemId) || can(principal, 'cosmetics.useAll');
}

/**
 * Settings changes that take off whatever the account may no longer use (after signing out
 * of a developer account or undoing a purchase); empty when nothing has to change.
 */
export function releaseUnusable(settings: Pick<Settings, 'palette' | 'cosmetics'>, owned: ReadonlySet<string>, principal: Principal | null | undefined): Partial<Pick<Settings, 'palette' | 'cosmetics'>> {
  const patch: Partial<Pick<Settings, 'palette' | 'cosmetics'>> = {};
  const theme = themeItemFor(settings.palette);
  if (theme && !mayUseCosmetic(owned, principal, theme.id)) patch.palette = 'classic' as PaletteId;
  const cosmetics: EquippedCosmetics = { ...settings.cosmetics };
  let changed = false;
  for (const slot of Object.keys(cosmetics) as (keyof EquippedCosmetics)[]) {
    const id = cosmetics[slot];
    if (id && (!getItem(id) || !mayUseCosmetic(owned, principal, id))) {
      cosmetics[slot] = null;
      changed = true;
    }
  }
  if (changed) patch.cosmetics = cosmetics;
  return patch;
}
