/**
 * "Coins earned" card on the summary of a lesson or session: the total (counted up when
 * animations are on), the reason for each part, and a note when practice earned nothing new.
 */
import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../state/settings';
import { cue } from '../../services/feedback';
import { formatNumber, t } from '../../i18n';
import { CURRENCY } from '../../config/economy';
import { CoinIcon } from './Coin';
import type { CoinLine } from './labels';

function motionReduced(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduce';
}

export function CoinRewardCard({ lines, note }: { lines: CoinLine[]; note?: string }) {
  const { settings } = useSettings();
  const total = lines.reduce((n, l) => n + l.amount, 0);
  const mode = motionReduced() ? 'off' : settings.coinFx;
  const [shown, setShown] = useState(mode === 'full' ? 0 : total);
  const played = useRef(false);

  useEffect(() => {
    let timer = 0;
    if (total > 0 && !played.current) {
      played.current = true;
      // After the "lesson complete" fanfare rather than on top of it.
      timer = window.setTimeout(() => cue('coin'), 450);
    }
    if (mode !== 'full') {
      setShown(total);
      return () => window.clearTimeout(timer);
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 700);
      setShown(Math.round(total * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [total, mode]);

  if (!total && !note) return null;
  const reasons = lines.map((l) => `${l.label}: ${formatNumber(l.amount)}`).join('; ');

  return (
    <section className={`card coin-card coin-card--${mode}`} aria-labelledby="coin-card-title" data-testid="coin-card">
      <h2 id="coin-card-title" className="visually-hidden">
        {t('coins.earned')}
      </h2>
      {total > 0 && (
        <div className="coin-card__head">
          <span className="coin-card__icon">
            <CoinIcon size={36} />
            {mode === 'full' && (
              <span className="coin-burst" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} style={{ ['--i' as string]: i }} />
                ))}
              </span>
            )}
          </span>
          <span className="coin-card__total" aria-hidden="true">
            +{formatNumber(shown)}
          </span>
          <span className="coin-card__currency" aria-hidden="true">
            {CURRENCY.name}
          </span>
          <span className="visually-hidden" role="status">
            {t('coins.summaryAria', { amount: t('coins.amount', { count: total }), reasons })}
          </span>
        </div>
      )}
      {lines.length > 0 && (
        <ul className="coin-card__list" aria-hidden="true">
          {lines.map((l) => (
            <li key={l.key}>
              <span>{l.label}</span>
              <span className="coin-card__plus">+{formatNumber(l.amount)}</span>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="subtle">{note}</p>}
    </section>
  );
}
