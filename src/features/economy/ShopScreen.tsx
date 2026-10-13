/**
 * Cosmetics shop: themes, profile items, interface items and the course-inspired collections.
 * Every item shows its preview, price and whether it is owned or equipped.
 */
import { useState } from 'react';
import { Check, History, Library } from 'lucide-react';
import { BUNDLES, COSMETICS, bundlePrice, getItem, type Collection, type CosmeticItem, type Shelf, type Slot } from '../../config/cosmetics';
import { CURRENCY } from '../../config/economy';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { PageHeader, Segmented } from '../../components/ui';
import { useWallet } from './wallet';
import { useEquip } from './equip';
import { itemName, slotName } from './labels';
import { ItemPreview } from './ItemPreview';
import { ItemSheet } from './ItemSheet';
import { CoinAmount } from './Coin';
import type { Wallet } from '../../services/economy';

const SHELVES: Shelf[] = ['themes', 'profile', 'interface', 'collections'];
/** Slots on each tab; collection items also appear on the tab of their slot. */
const SHELF_SLOTS: Record<Exclude<Shelf, 'collections'>, Slot[]> = {
  themes: ['theme'],
  profile: ['frame', 'banner', 'badge', 'title'],
  interface: ['bar', 'fx'],
};
const COLLECTIONS: Collection[] = ['ja', 'de', 'es'];

export function ItemCard({ item, wallet, onOpen }: { item: CosmeticItem; wallet: Wallet; onOpen: (id: string) => void }) {
  const { isEquipped } = useEquip();
  const owned = wallet.owned.has(item.id);
  const equipped = owned && isEquipped(item);
  return (
    <button type="button" className={`item-card${equipped ? ' is-equipped' : ''}`} onClick={() => onOpen(item.id)} data-testid={`item-${item.id}`}>
      <ItemPreview item={item} />
      <span className="item-card__name">{itemName(item.id)}</span>
      <span className="item-card__state">
        {equipped ? (
          <span className="chip chip--success">
            <Check size={14} /> {t('shop.equipped')}
          </span>
        ) : owned ? (
          <span className="chip">{t('shop.owned')}</span>
        ) : item.price !== null ? (
          <CoinAmount amount={item.price} />
        ) : null}
      </span>
    </button>
  );
}

function BundleCard({ id, wallet, onOpen }: { id: string; wallet: Wallet; onOpen: (id: string) => void }) {
  const bundle = BUNDLES.find((b) => b.id === id)!;
  const owned = bundle.items.every((i) => wallet.owned.has(i));
  return (
    <button type="button" className="item-card item-card--bundle" onClick={() => onOpen(id)} data-testid={`item-${id}`}>
      <span className="bundle-previews">
        {bundle.items.slice(0, 4).map((i) => (
          <ItemPreview key={i} item={getItem(i)!} />
        ))}
      </span>
      <span className="item-card__name">{itemName(id)}</span>
      <span className="item-card__state">{owned ? <span className="chip">{t('shop.owned')}</span> : <CoinAmount amount={bundlePrice(bundle, wallet.owned)} />}</span>
    </button>
  );
}

export default function ShopScreen({ query }: { query: URLSearchParams }) {
  const initial = query.get('tab') as Shelf | null;
  const [shelf, setShelf] = useState<Shelf>(initial && SHELVES.includes(initial) ? initial : 'themes');
  const [open, setOpen] = useState<string | null>(query.get('item'));
  const wallet = useWallet();
  const forSale = (filter: (c: CosmeticItem) => boolean) => COSMETICS.filter((c) => c.price !== null && filter(c));

  return (
    <div className="page page--wide shop">
      <PageHeader title={t('shop.title')} back />
      <section className="card wallet-card" aria-label={t('coins.balance')}>
        <div className="wallet-card__balance">
          <span className="subtle">{CURRENCY.name}</span>
          {wallet ? <CoinAmount amount={wallet.balance} size={28} className="coin-amount--large" /> : '…'}
        </div>
        <div className="row row--wrap">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/collection')}>
            <Library size={18} /> {t('shop.myCollection')}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/coins')}>
            <History size={18} /> {t('shop.history')}
          </button>
        </div>
      </section>
      <p className="muted">{t('shop.subtitle')}</p>

      <Segmented<Shelf> value={shelf} onChange={setShelf} label={t('shop.title')} options={SHELVES.map((s) => ({ value: s, label: t(`shop.tab.${s}` as never) }))} />

      {wallet &&
        (shelf === 'collections' ? (
          <div className="stack stack--l">
            <p className="subtle">{t('shop.collectionsHint')}</p>
            {COLLECTIONS.map((col) => (
              <section key={col} className="stack stack--s" aria-labelledby={`col-${col}`}>
                <h2 id={`col-${col}`} className="section-title">
                  {t(`shop.collection.${col}` as never)}
                </h2>
                <div className="item-grid">
                  {BUNDLES.filter((b) => b.collection === col).map((b) => (
                    <BundleCard key={b.id} id={b.id} wallet={wallet} onOpen={setOpen} />
                  ))}
                  {forSale((c) => c.collection === col).map((c) => (
                    <ItemCard key={c.id} item={c} wallet={wallet} onOpen={setOpen} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="stack stack--l">
            {SHELF_SLOTS[shelf].map((slot) => {
              const items = forSale((c) => c.slot === slot);
              if (!items.length) return null;
              return (
                <section key={slot} className="stack stack--s" aria-labelledby={`slot-${slot}`}>
                  <h2 id={`slot-${slot}`} className="section-title">
                    {slotName(slot)}
                  </h2>
                  <div className="item-grid">
                    {items.map((c) => (
                      <ItemCard key={c.id} item={c} wallet={wallet} onOpen={setOpen} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ))}

      <ItemSheet id={open} onClose={() => setOpen(null)} />
    </div>
  );
}
