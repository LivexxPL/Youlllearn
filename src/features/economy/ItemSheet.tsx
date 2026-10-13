/**
 * Details of a shop item or bundle: large preview, price and state, then buy (with a
 * confirmation step), equip / remove, or how to earn it. A purchase can be undone for a
 * couple of minutes.
 */
import { useEffect, useState } from 'react';
import { Check, Lock, Undo2 } from 'lucide-react';
import { Sheet } from '../../components/ui';
import { useToast } from '../../components/Toasts';
import { getBundle, getItem, type CosmeticItem } from '../../config/cosmetics';
import { REWARDS } from '../../config/economy';
import { purchase, priceOf, refundPurchase } from '../../services/economy';
import { cue } from '../../services/feedback';
import { t } from '../../i18n';
import { useWallet } from './wallet';
import { useEquip } from './equip';
import { itemName, slotName } from './labels';
import { ItemPreview } from './ItemPreview';
import { CoinAmount } from './Coin';

type Stage = 'view' | 'confirm' | 'done';

export function ItemSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const wallet = useWallet();
  const toast = useToast();
  const { isEquipped, equip, unequip } = useEquip();
  const [stage, setStage] = useState<Stage>('view');
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStage('view');
    setPurchaseId(null);
  }, [id]);

  const bundle = id ? getBundle(id) : undefined;
  const item = id ? getItem(id) : undefined;
  if (!id || !wallet || (!bundle && !item)) return <Sheet open={false} onClose={onClose}>{null}</Sheet>;

  const name = itemName(id);
  const owned = bundle ? bundle.items.every((i) => wallet.owned.has(i)) : wallet.owned.has(id);
  const price = priceOf(id, wallet);
  const missing = price !== null ? Math.max(0, price - wallet.balance) : 0;

  const buy = async () => {
    setBusy(true);
    try {
      const res = await purchase(id);
      if (res.ok) {
        cue('purchase');
        setPurchaseId(res.entry.id);
        setStage('done');
        toast(t('shop.bought', { name }), 'success');
      } else {
        setStage('view');
      }
    } catch (e) {
      console.warn('Purchase failed', e);
      toast(t('shop.error'));
    } finally {
      setBusy(false);
    }
  };

  const undo = async () => {
    if (!purchaseId) return;
    setBusy(true);
    const items = bundle ? bundle.items : [id];
    if (await refundPurchase(purchaseId)) {
      for (const i of items) {
        const it = getItem(i);
        if (it && isEquipped(it)) unequip(it);
      }
      toast(t('shop.undone'));
      onClose();
    }
    setBusy(false);
  };

  const equipButtons = (it: CosmeticItem) =>
    isEquipped(it) ? (
      it.slot === 'theme' && it.palette === 'classic' ? (
        <p className="chip chip--success">
          <Check size={14} /> {t('shop.equipped')}
        </p>
      ) : (
        <button type="button" className="btn btn--outline btn--block" onClick={() => unequip(it)} data-testid="item-unequip">
          {t('shop.unequip')}
        </button>
      )
    ) : (
      <button type="button" className="btn btn--primary btn--block" onClick={() => equip(it)} data-testid="item-equip">
        {t('shop.equip')}
      </button>
    );

  const reward = item?.rewardOf;

  return (
    <Sheet open onClose={onClose} title={name}>
      <div className="stack item-sheet" data-testid="item-sheet">
        <div className="item-sheet__preview">
          {bundle ? (
            <div className="bundle-previews">
              {bundle.items.map((i) => (
                <ItemPreview key={i} item={getItem(i)!} />
              ))}
            </div>
          ) : (
            <ItemPreview item={item!} large />
          )}
        </div>
        <div className="row row--between row--wrap">
          <span className="subtle">{bundle ? t('shop.bundle') : slotName(item!.slot)}</span>
          {owned ? (
            <span className="chip chip--success">
              <Check size={14} /> {item && isEquipped(item) ? t('shop.equipped') : t('shop.owned')}
            </span>
          ) : price !== null ? (
            <span className="chip chip--accent">
              <CoinAmount amount={price} />
            </span>
          ) : (
            <span className="chip">
              <Lock size={14} /> {t('collection.toEarn')}
            </span>
          )}
        </div>

        {bundle && (
          <>
            <p>{t('shop.bundleItems', { items: bundle.items.map(itemName).join(', ') })}</p>
            {!owned && price !== null && (
              <p className="subtle">
                {t('shop.bundleSave', {
                  amount: t('coins.amount', {
                    count: bundle.items.filter((i) => !wallet.owned.has(i)).reduce((n, i) => n + (getItem(i)?.price ?? 0), 0) - price,
                  }),
                })}{' '}
                {bundle.items.some((i) => wallet.owned.has(i)) ? t('shop.bundleOwnedPart') : ''}
              </p>
            )}
          </>
        )}

        {!owned && reward && (
          <p className="banner">
            <Lock size={18} /> {t('shop.rewardOnly', { name: t(`ach.${reward}` as never), desc: t(`ach.${reward}.desc` as never) })}
          </p>
        )}

        {stage === 'done' ? (
          <div className="stack stack--s">
            <p className="banner banner--success" role="status">
              <Check size={18} /> {t('shop.bought', { name })}
            </p>
            {item && !isEquipped(item) && (
              <button type="button" className="btn btn--primary btn--block" onClick={() => equip(item)} data-testid="item-equip-now">
                {t('shop.equipNow')}
              </button>
            )}
            <button type="button" className="btn btn--ghost btn--block" onClick={undo} disabled={busy} data-testid="item-undo">
              <Undo2 size={18} /> {t('shop.undo')}
            </button>
          </div>
        ) : owned ? (
          item ? (
            equipButtons(item)
          ) : null
        ) : price !== null ? (
          stage === 'confirm' ? (
            <div className="stack stack--s">
              <p>{t('shop.buyConfirm', { name, amount: t('coins.amount', { count: price }), left: t('coins.amount', { count: wallet.balance - price }) })}</p>
              <button type="button" className="btn btn--primary btn--lg btn--block" onClick={buy} disabled={busy} data-testid="item-confirm">
                {t('shop.confirm')}
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => setStage('view')} disabled={busy}>
                {t('shop.cancel')}
              </button>
            </div>
          ) : (
            <div className="stack stack--s">
              <button type="button" className="btn btn--accent btn--lg btn--block" onClick={() => setStage('confirm')} disabled={missing > 0} data-testid="item-buy">
                {t('shop.buy', { amount: t('coins.amount', { count: price }) })}
              </button>
              {missing > 0 && (
                <p className="subtle" role="status" data-testid="item-missing">
                  {t('shop.missing', {
                    amount: t('coins.amount', { count: missing }),
                    lessons: t('shop.lessonsApprox', { count: Math.ceil(missing / REWARDS.lesson.firstShort) }),
                  })}
                </p>
              )}
            </div>
          )
        ) : null}
      </div>
    </Sheet>
  );
}
