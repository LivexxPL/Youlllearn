/**
 * Everything collected, per slot, with what is equipped; rewards not earned yet are shown
 * with their real requirement (an achievement), so the next goal is always visible.
 */
import { useState } from 'react';
import { Lock, RotateCcw, Store } from 'lucide-react';
import { COSMETICS, type Slot } from '../../config/cosmetics';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { PageHeader, ProgressBar } from '../../components/ui';
import { useSettings } from '../../state/settings';
import { useWallet } from './wallet';
import { useEquip, type CosmeticSlot } from './equip';
import { itemName, slotName } from './labels';
import { ItemCard } from './ShopScreen';
import { ItemSheet } from './ItemSheet';
import { ItemPreview } from './ItemPreview';

const SLOTS: Slot[] = ['theme', 'frame', 'banner', 'badge', 'title', 'bar', 'fx'];

export default function CollectionScreen() {
  const wallet = useWallet();
  const { settings } = useSettings();
  const { unequip } = useEquip();
  const [open, setOpen] = useState<string | null>(null);
  if (!wallet) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;

  const collectible = COSMETICS.filter((c) => !c.free);
  const ownedCount = collectible.filter((c) => wallet.owned.has(c.id)).length;

  return (
    <div className="page page--wide">
      <PageHeader title={t('collection.title')} back fallback="/shop" />
      <section className="card stack stack--s">
        <p className="card__title">{t('collection.progress', { owned: ownedCount, total: collectible.length })}</p>
        <ProgressBar value={ownedCount} max={collectible.length} label={t('collection.progress', { owned: ownedCount, total: collectible.length })} />
      </section>

      {SLOTS.map((slot) => {
        const owned = COSMETICS.filter((c) => c.slot === slot && wallet.owned.has(c.id));
        const toEarn = COSMETICS.filter((c) => c.slot === slot && c.rewardOf && !wallet.owned.has(c.id));
        const inShop = COSMETICS.filter((c) => c.slot === slot && c.price !== null && !wallet.owned.has(c.id)).length;
        const equippedNone = slot === 'theme' ? settings.palette === 'classic' : !settings.cosmetics[slot as CosmeticSlot];
        return (
          <section key={slot} className="stack stack--s" aria-labelledby={`coll-${slot}`}>
            <h2 id={`coll-${slot}`} className="section-title">
              {slotName(slot)}
            </h2>
            <div className="item-grid">
              {slot !== 'theme' && (
                <button
                  type="button"
                  className={`item-card${equippedNone ? ' is-equipped' : ''}`}
                  onClick={() => {
                    const current = COSMETICS.find((c) => c.id === settings.cosmetics[slot as CosmeticSlot]);
                    if (current) unequip(current);
                  }}
                  aria-pressed={equippedNone}
                >
                  <span className="item-preview item-preview--default" aria-hidden="true">
                    <RotateCcw size={24} />
                  </span>
                  <span className="item-card__name">{t('collection.default')}</span>
                </button>
              )}
              {owned.map((c) => (
                <ItemCard key={c.id} item={c} wallet={wallet} onOpen={setOpen} />
              ))}
              {toEarn.map((c) => (
                <div key={c.id} className="item-card item-card--locked" data-testid={`locked-${c.id}`}>
                  <ItemPreview item={c} />
                  <span className="item-card__name">
                    <Lock size={14} aria-hidden="true" /> {itemName(c.id)}
                  </span>
                  <span className="subtle">{t('collection.requirement', { desc: t(`ach.${c.rewardOf}.desc` as never) })}</span>
                </div>
              ))}
            </div>
            {inShop > 0 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate(`/shop?tab=${slot === 'theme' ? 'themes' : slot === 'bar' || slot === 'fx' ? 'interface' : 'profile'}`)}>
                <Store size={18} /> {t('collection.inShop')}: {inShop}
              </button>
            )}
          </section>
        );
      })}
      <ItemSheet id={open} onClose={() => setOpen(null)} />
    </div>
  );
}
