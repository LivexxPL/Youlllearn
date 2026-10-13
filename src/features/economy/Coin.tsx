import { CURRENCY } from '../../config/economy';
import { formatNumber, t } from '../../i18n';
import { navigate } from '../../app/router';
import { useWallet } from './wallet';

/** The coin symbol (decorative: amounts always come with text). */
export function CoinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg className="coin-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10.6" fill="#f6b80c" stroke="#875400" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="7.4" fill="#ffd34d" stroke="#c98a00" strokeWidth="1" />
      <path d="M10.2 8.2v7.4h4.4" fill="none" stroke="#7a4a00" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** An amount with the coin symbol; screen readers hear e.g. "120 monet". */
export function CoinAmount({ amount, signed, size, className }: { amount: number; signed?: boolean; size?: number; className?: string }) {
  const sign = signed && amount > 0 ? '+' : '';
  return (
    <span className={`coin-amount${className ? ` ${className}` : ''}`}>
      <CoinIcon size={size} />
      <span aria-hidden="true">
        {sign}
        {formatNumber(amount)}
      </span>
      <span className="visually-hidden">
        {sign}
        {t('coins.amount', { count: amount })}
      </span>
    </span>
  );
}

/** Small balance pill that opens the shop (Home header, Profile). */
export function CoinChip() {
  const wallet = useWallet();
  const balance = wallet?.balance ?? 0;
  return (
    <button
      type="button"
      className="coin-chip"
      onClick={() => navigate('/shop')}
      aria-label={t('coins.openShop', { amount: t('coins.amount', { count: balance }) })}
      title={CURRENCY.name}
      data-testid="coin-chip"
    >
      <CoinIcon size={20} />
      <span aria-hidden="true">{wallet ? formatNumber(balance) : '…'}</span>
    </button>
  );
}
