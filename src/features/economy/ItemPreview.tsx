/** Visual preview of a cosmetic item (shop cards, item sheet, collection). */
import { Sparkles, Star } from 'lucide-react';
import type { CosmeticItem } from '../../config/cosmetics';
import { getPalette } from '../../config/palettes';
import { useSettings } from '../../state/settings';
import { useCloud } from '../../state/cloud';
import { Preview } from '../settings/PalettePicker';
import { Avatar } from '../../components/Avatar';
import { ProgressBar } from '../../components/ui';
import { itemName } from './labels';

function short(id: string) {
  return id.replace(/^[a-z]+-/, '');
}

export function ItemPreview({ item, large }: { item: CosmeticItem; large?: boolean }) {
  const { settings, resolvedTheme } = useSettings();
  const cloud = useCloud();
  const name = settings.displayName || cloud.account?.name || '';
  switch (item.slot) {
    case 'theme':
      return (
        <span className={`item-preview item-preview--theme${large ? ' item-preview--large' : ''}`}>
          <Preview palette={getPalette(item.palette)} mode={resolvedTheme} />
        </span>
      );
    case 'frame':
      return (
        <span className="item-preview">
          <Avatar name={name} picture={cloud.account?.picture} size={large ? 88 : 56} frame={item.id} />
        </span>
      );
    case 'banner':
      return <span className={`item-preview profile-banner${large ? ' item-preview--large' : ''}`} data-banner={short(item.id)} />;
    case 'badge':
      return (
        <span className="item-preview">
          <span className={`profile-badge${large ? ' profile-badge--large' : ''}`} aria-hidden="true">
            {item.icon}
          </span>
        </span>
      );
    case 'title':
      return (
        <span className="item-preview item-preview--title">
          <span className="profile-title">{itemName(item.id)}</span>
        </span>
      );
    case 'bar':
      return (
        <span className="item-preview item-preview--bar" data-bar={short(item.id)}>
          <ProgressBar value={0.68} />
          <ProgressBar value={0.4} variant="accent" thin />
        </span>
      );
    case 'fx':
      return (
        <span className={`item-preview item-preview--fx item-preview--fx-${short(item.id)}`} aria-hidden="true">
          <Sparkles size={large ? 40 : 28} />
          <Star size={large ? 22 : 16} />
        </span>
      );
  }
}
