/**
 * Google account and the synchronised copy on Google Drive: sign in, status, "sync now",
 * automatic sync switch, sign out and deleting the cloud copy.
 */
import { useEffect, useState } from 'react';
import { CloudCheck, CloudOff, ExternalLink, LogIn, LogOut, RefreshCw, Trash2, TriangleAlert } from 'lucide-react';
import { useCloud } from '../../state/cloud';
import { cloud } from '../../services/cloud';
import { loadGoogle } from '../../services/cloud/google';
import { cloudConfigured } from '../../config/cloud';
import { isNative } from '../../services/platform';
import { brand } from '../../config/brand';
import { t } from '../../i18n';
import { useToast } from '../../components/Toasts';
import { Avatar } from '../../components/Avatar';
import { Banner, SettingRow, Sheet, Switch } from '../../components/ui';
import { cloudErrorText, cloudStatus } from './cloudText';

const TONE_ICON = { ok: CloudCheck, warn: TriangleAlert, busy: RefreshCw, muted: CloudOff } as const;

export function CloudCard() {
  const c = useCloud();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const busy = c.state === 'connecting' || c.state === 'syncing';

  // Google's pop-up has to open straight from the click, so its script is loaded in advance.
  useEffect(() => {
    if (c.available) loadGoogle().catch(() => {});
  }, [c.available]);

  if (isNative()) {
    return (
      <div className="stack stack--s">
        <p>{t('cloud.native')}</p>
        <a className="btn btn--outline" href={brand.links.web} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={18} /> {t('cloud.openWeb')}
        </a>
      </div>
    );
  }

  if (!cloudConfigured()) return <p className="subtle">{t('cloud.notConfigured')}</p>;

  const report = (state: string) => {
    const snap = cloud.getSnapshot();
    if (state === 'synced') toast(t('cloud.synced'), 'success');
    else if (snap.error) toast(cloudErrorText(snap.error));
  };

  const syncNow = async () => report(c.connected ? (await cloud.sync(), cloud.getSnapshot().state) : await cloud.connect());

  if (!c.account) {
    return (
      <div className="stack">
        <p>{t('cloud.intro')}</p>
        <ul className="cloud-points">
          <li>{t('cloud.privacy')}</li>
          <li>{t('cloud.optional')}</li>
        </ul>
        {c.state === 'error' && c.error && <Banner variant="warn">{cloudErrorText(c.error)}</Banner>}
        <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => cloud.connect().then(report)} disabled={busy} data-testid="cloud-signin">
          <LogIn size={20} /> {busy ? t('cloud.state.connecting') : t('cloud.signIn')}
        </button>
      </div>
    );
  }

  const status = cloudStatus(c);
  const Icon = TONE_ICON[status.tone];

  return (
    <div className="stack">
      <div className="cloud-account">
        <Avatar name={c.account.name} picture={c.account.picture} size={48} />
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="subtle">{t('cloud.signedInAs')}</div>
          <div className="list-row__title">{c.account.name}</div>
          <div className="subtle cloud-account__email">{c.account.email}</div>
        </div>
      </div>
      <p className={`cloud-status cloud-status--${status.tone}`} role="status" data-testid="cloud-status">
        <Icon size={18} className={status.tone === 'busy' ? 'spin' : undefined} aria-hidden="true" /> {status.text}
      </p>
      <button type="button" className="btn btn--primary btn--block" onClick={syncNow} disabled={busy} data-testid="cloud-sync">
        <RefreshCw size={18} /> {t('cloud.syncNow')}
      </button>
      <div className="list">
        <SettingRow title={t('cloud.autoSync')} desc={t('cloud.autoSyncHelp')} control={<Switch checked={c.autoSync} onChange={(v) => cloud.setAutoSync(v)} label={t('cloud.autoSync')} />} />
      </div>
      <div className="row row--wrap">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => cloud.signOut().then(() => toast(t('cloud.signOutDone')))}
          disabled={busy}
          data-testid="cloud-signout"
        >
          <LogOut size={18} /> {t('cloud.signOut')}
        </button>
        <button type="button" className="btn btn--ghost" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDelete(true)} disabled={busy}>
          <Trash2 size={18} /> {t('cloud.delete')}
        </button>
      </div>
      <Sheet open={confirmDelete} onClose={() => setConfirmDelete(false)} title={t('cloud.delete')}>
        <div className="stack">
          <p>{t('cloud.deleteConfirm')}</p>
          <button
            type="button"
            className="btn btn--danger btn--lg"
            onClick={async () => {
              setConfirmDelete(false);
              if (await cloud.deleteCloudCopyAndSignOut()) toast(t('cloud.deleteDone'));
              else report('error');
            }}
          >
            <Trash2 size={18} /> {t('cloud.delete')}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
