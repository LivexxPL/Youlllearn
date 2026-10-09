import { BookOpen, ChartColumn, Headphones, House, RotateCcw, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { navigate, useRoute } from './router';
import { t, type MessageKey } from '../i18n';
import { brand } from '../config/brand';

interface NavItem {
  path: string;
  labelKey: MessageKey;
  /** Shorter label for the phone bottom bar, where six items share the width. */
  shortKey?: MessageKey;
  icon: ReactNode;
  match: (seg0: string | undefined) => boolean;
}

const ITEMS: NavItem[] = [
  { path: '/', labelKey: 'nav.home', icon: <House size={22} />, match: (s) => !s },
  { path: '/learn', labelKey: 'nav.learn', icon: <BookOpen size={22} />, match: (s) => s === 'learn' || s === 'write' || s === 'kana' },
  { path: '/audio', labelKey: 'nav.audio', shortKey: 'nav.audioShort', icon: <Headphones size={22} />, match: (s) => s === 'audio' },
  { path: '/review', labelKey: 'nav.review', icon: <RotateCcw size={22} />, match: (s) => s === 'review' },
  { path: '/progress', labelKey: 'nav.progress', icon: <ChartColumn size={22} />, match: (s) => s === 'progress' },
  { path: '/settings', labelKey: 'nav.settings', icon: <Settings size={22} />, match: (s) => s === 'settings' || s === 'about' },
];

export function Nav({ reviewBadge }: { reviewBadge?: number }) {
  const route = useRoute();
  const seg0 = route.segments[0];
  return (
    <nav className="nav" aria-label={t('nav.main')}>
      <div className="nav__brand" aria-hidden="true">
        <LogoMark size={36} />
        <span className="nav__brand-name">{brand.shortName}</span>
      </div>
      {ITEMS.map((item) => {
        const current = item.match(seg0);
        return (
          <a
            key={item.path}
            href={`#${item.path}`}
            className="nav__item"
            aria-current={current ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
          >
            <span className="nav__icon">{item.icon}</span>
            {item.shortKey ? (
              <span className="nav__label">
                <span className="nav__label-full">{t(item.labelKey)}</span>
                <span className="nav__label-short" aria-hidden="true">
                  {t(item.shortKey)}
                </span>
              </span>
            ) : (
              <span className="nav__label">{t(item.labelKey)}</span>
            )}
            {item.path === '/review' && reviewBadge ? <span className="nav__badge">{reviewBadge > 99 ? '99+' : reviewBadge}</span> : null}
          </a>
        );
      })}
    </nav>
  );
}

/** Compass-like logo mark (also used for the app icon). */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--primary)" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#fff" strokeWidth="3.5" opacity="0.9" />
      <path d="M32 15 L38 32 L32 49 L26 32 Z" fill="#fff" />
      <path d="M32 15 L38 32 L26 32 Z" fill="#f59e0b" />
      <circle cx="32" cy="32" r="3.2" fill="var(--primary)" />
    </svg>
  );
}
