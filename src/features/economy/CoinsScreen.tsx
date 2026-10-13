/** Coin balance, the full transaction history and how coins are earned. */
import { Store } from 'lucide-react';
import { CURRENCY, ACHIEVEMENT_COINS, REWARDS } from '../../config/economy';
import { navigate } from '../../app/router';
import { formatDate, formatNumber, t } from '../../i18n';
import { PageHeader, StatTile } from '../../components/ui';
import { parseDayKey } from '../../engine/dates';
import { useLedger } from './wallet';
import { walletOf } from '../../services/economy';
import { entryReason } from './labels';
import { CoinAmount } from './Coin';

export default function CoinsScreen() {
  const ledger = useLedger();
  if (!ledger) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  const wallet = walletOf(ledger);
  const days = [...new Set(ledger.map((e) => e.date))];
  const coins = (n: number) => t('coins.amount', { count: n });
  const tiers = REWARDS.practice.tiers;

  return (
    <div className="page">
      <PageHeader title={t('history.title')} back fallback="/shop" />
      <section className="card wallet-card" aria-label={t('coins.balance')}>
        <div className="wallet-card__balance">
          <span className="subtle">{CURRENCY.name}</span>
          <CoinAmount amount={wallet.balance} size={28} className="coin-amount--large" />
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => navigate('/shop')}>
          <Store size={18} /> {t('shop.title')}
        </button>
      </section>
      {wallet.balance < 0 && <p className="banner banner--warn">{t('coins.negative')}</p>}
      <div className="grid-2">
        <StatTile value={formatNumber(wallet.earned)} label={t('coins.earned')} />
        <StatTile value={formatNumber(wallet.spent)} label={t('history.spent')} />
      </div>

      <section className="card stack stack--s" aria-labelledby="how-title">
        <h2 id="how-title" className="card__title">
          {t('history.howTitle')}
        </h2>
        <ul className="cloud-points">
          <li>{t('history.how.lesson', { short: REWARDS.lesson.firstShort, long: REWARDS.lesson.firstLong, repeat: REWARDS.lesson.repeat })}</li>
          <li>{t('history.how.practice', { min: tiers[tiers.length - 1][1], max: tiers[0][1] })}</li>
          <li>{t('history.how.quests', { quest: REWARDS.quest, all: REWARDS.allQuests, challenge: REWARDS.weeklyChallenge })}</li>
          <li>
            {t('history.how.more', {
              small: ACHIEVEMENT_COINS.small,
              large: ACHIEVEMENT_COINS.large,
              days: REWARDS.consistency.everyActiveDays,
              consistency: REWARDS.consistency.coins,
            })}
          </li>
          <li>{t('history.how.fair')}</li>
        </ul>
      </section>

      {ledger.length === 0 ? (
        <p className="muted">{t('history.empty')}</p>
      ) : (
        days.map((day) => (
          <section key={day} className="stack stack--s" aria-label={formatDate(parseDayKey(day))}>
            <h2 className="section-title">{formatDate(parseDayKey(day), { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            <ul className="list history-list">
              {ledger
                .filter((e) => e.date === day)
                .map((e) => (
                  <li key={e.id} className="list-row">
                    <span className="list-row__body">{entryReason(e)}</span>
                    <span className={e.amount < 0 ? 'history-list__minus' : 'history-list__plus'} aria-label={`${e.amount < 0 ? '−' : '+'}${coins(Math.abs(e.amount))}`}>
                      {e.amount < 0 ? '−' : '+'}
                      {formatNumber(Math.abs(e.amount))}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
