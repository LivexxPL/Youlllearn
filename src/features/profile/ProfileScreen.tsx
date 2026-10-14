/**
 * The learner's profile: name, avatar with the equipped frame, background, badge and title,
 * coins (shop, collection, history) and the optional Google account that keeps a copy of the
 * progress on Google Drive. Everything here works without an account.
 */
import { Cloud, Copy, History, Library, Store } from 'lucide-react';
import { useSettings, DISPLAY_NAME_MAX } from '../../state/settings';
import { useCloud } from '../../state/cloud';
import { t } from '../../i18n';
import { navigate } from '../../app/router';
import { PageHeader } from '../../components/ui';
import { Avatar } from '../../components/Avatar';
import { CURRENCY } from '../../config/economy';
import { CloudCard } from './CloudCard';
import { CoinAmount } from '../economy/Coin';
import { useWallet } from '../economy/wallet';
import { equippedItem } from '../economy/equip';
import { itemName } from '../economy/labels';
import { useAuth } from '../../auth/session';
import { useToast } from '../../components/Toasts';

export default function ProfileScreen() {
  const { settings, update } = useSettings();
  const cloud = useCloud();
  const wallet = useWallet();
  const auth = useAuth();
  const toast = useToast();
  const copyRoleId = (id: string) => {
    const selectIt = () => {
      // No clipboard access: select the text so it can be copied by hand.
      const el = document.getElementById('role-id');
      if (el) window.getSelection()?.selectAllChildren(el);
      toast(t('dev.selected'));
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(id).then(() => toast(t('dev.copied')), selectIt);
    else selectIt();
  };
  const name = settings.displayName || cloud.account?.name || '';
  const banner = equippedItem(settings.cosmetics, 'banner');
  const badge = equippedItem(settings.cosmetics, 'badge');
  const title = equippedItem(settings.cosmetics, 'title');

  return (
    <div className="page">
      <PageHeader title={t('profile.title')} back />

      <section className="card profile-card" aria-label={t('profile.local')} data-testid="profile-card">
        <div className="profile-banner" data-banner={banner ? banner.id.replace(/^banner-/, '') : 'default'} aria-hidden="true" />
        <div className="profile-card__who">
          <Avatar name={name} picture={cloud.account?.picture} size={84} frame={settings.cosmetics.frame} />
          <div className="profile-card__name">
            <span className="profile-name">{name || t('profile.local')}</span>
            {badge && (
              <span className="profile-badge" role="img" aria-label={itemName(badge.id)} title={itemName(badge.id)}>
                {badge.icon}
              </span>
            )}
          </div>
          {title && <span className="profile-title">{itemName(title.id)}</span>}
        </div>
        <div className="stack stack--s profile-card__form">
          <label className="list-row__title" htmlFor="display-name">
            {t('profile.name')}
          </label>
          <input
            id="display-name"
            className="input"
            value={settings.displayName}
            maxLength={DISPLAY_NAME_MAX}
            placeholder={t('profile.namePlaceholder')}
            autoComplete="nickname"
            onChange={(e) => update({ displayName: e.target.value })}
            data-testid="display-name"
          />
          <p className="subtle">{t('profile.nameHelp')}</p>
        </div>
      </section>

      <section className="card wallet-card" aria-label={t('coins.balance')}>
        <div className="wallet-card__balance">
          <span className="subtle">{CURRENCY.name}</span>
          {wallet ? <CoinAmount amount={wallet.balance} size={28} className="coin-amount--large" /> : '…'}
        </div>
        <div className="row row--wrap">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => navigate('/shop')} data-testid="profile-shop">
            <Store size={18} /> {t('shop.title')}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/collection')}>
            <Library size={18} /> {t('shop.myCollection')}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/coins')}>
            <History size={18} /> {t('shop.history')}
          </button>
        </div>
      </section>

      {auth.principal.roleId && (
        <details className="card dev-details" data-testid="profile-tech">
          <summary>{t('profile.tech')}</summary>
          <p>
            {t('dev.role')}: <strong>{t(`dev.role.${auth.principal.role}` as never)}</strong>
          </p>
          <p className="subtle">{t('dev.roleId')}</p>
          <code className="dev-code" id="role-id">
            {auth.principal.roleId}
          </code>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => copyRoleId(auth.principal.roleId!)} data-testid="copy-role-id">
            <Copy size={16} /> {t('dev.copy')}
          </button>
          <p className="subtle">{t('dev.roleIdHelp')}</p>
        </details>
      )}

      <section className="stack stack--s" aria-labelledby="cloud-title">
        <h2 id="cloud-title" className="section-title">
          <span className="row" style={{ gap: 'var(--sp-2)' }}>
            <Cloud size={20} /> {t('cloud.title')}
          </span>
        </h2>
        <div className="card">
          <CloudCard />
        </div>
      </section>
    </div>
  );
}
