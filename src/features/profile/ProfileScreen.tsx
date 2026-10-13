/**
 * The learner's profile: name for the greeting and the optional Google account that keeps a
 * copy of the progress on Google Drive.
 */
import { Cloud } from 'lucide-react';
import { useSettings, DISPLAY_NAME_MAX } from '../../state/settings';
import { useCloud } from '../../state/cloud';
import { t } from '../../i18n';
import { PageHeader } from '../../components/ui';
import { Avatar } from '../../components/Avatar';
import { CloudCard } from './CloudCard';

export default function ProfileScreen() {
  const { settings, update } = useSettings();
  const cloud = useCloud();
  const name = settings.displayName || cloud.account?.name || '';

  return (
    <div className="page">
      <PageHeader title={t('profile.title')} back />

      <section className="card profile-card" aria-label={t('profile.local')}>
        <Avatar name={name} picture={cloud.account?.picture} size={72} />
        <div className="grow stack stack--s" style={{ minWidth: 0 }}>
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
