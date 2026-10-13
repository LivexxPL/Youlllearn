import { useCallback } from 'react';
import { useSettings, NO_COSMETICS } from '../../state/settings';
import { getItem, type CosmeticItem } from '../../config/cosmetics';
import type { PaletteId } from '../../config/palettes';
import type { EquippedCosmetics } from '../../services/db';

export type CosmeticSlot = keyof EquippedCosmetics;

/** Equipping and removing cosmetics; a theme is the colour palette setting. */
export function useEquip() {
  const { settings, update } = useSettings();

  const isEquipped = useCallback(
    (item: CosmeticItem) => (item.slot === 'theme' ? settings.palette === item.palette : settings.cosmetics[item.slot as CosmeticSlot] === item.id),
    [settings.palette, settings.cosmetics],
  );

  const equip = useCallback(
    (item: CosmeticItem) => {
      if (item.slot === 'theme') update({ palette: item.palette as PaletteId });
      else update({ cosmetics: { ...settings.cosmetics, [item.slot]: item.id } });
    },
    [settings.cosmetics, update],
  );

  const unequip = useCallback(
    (item: CosmeticItem) => {
      if (item.slot === 'theme') update({ palette: 'classic' });
      else update({ cosmetics: { ...settings.cosmetics, [item.slot]: null } });
    },
    [settings.cosmetics, update],
  );

  const resetLook = useCallback(() => update({ palette: 'classic', cosmetics: { ...NO_COSMETICS } }), [update]);

  return { isEquipped, equip, unequip, resetLook };
}

/** The equipped item of a slot, if it still exists in the catalogue. */
export function equippedItem(cosmetics: EquippedCosmetics, slot: CosmeticSlot): CosmeticItem | undefined {
  return getItem(cosmetics[slot]);
}
