import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import type { CourseId } from '../content/types';
import { getCourse } from '../content/registry';
import { goBack, useBackHandler } from '../app/router';
import { t } from '../i18n';

export function ProgressBar({ value, max = 1, variant, label, thin }: { value: number; max?: number; variant?: 'accent' | 'success'; label?: string; thin?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div
      className={`progress${variant ? ` progress--${variant}` : ''}${thin ? ' progress--thin' : ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <div className="progress__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 96, stroke = 10, children, label }: { value: number; size?: number; stroke?: number; children?: ReactNode; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }} role="img" aria-label={label}>
      <svg width={size} height={size} className={`ring${v >= 1 ? ' ring--done' : ''}`} aria-hidden="true">
        <circle className="ring__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  );
}

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return <button id={id} type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

export function SettingRow({ title, desc, control, htmlFor }: { title: ReactNode; desc?: ReactNode; control: ReactNode; htmlFor?: string }) {
  return (
    <div className="list-row">
      <div className="list-row__body">
        {htmlFor ? (
          <label className="list-row__title" htmlFor={htmlFor}>
            {title}
          </label>
        ) : (
          <div className="list-row__title">{title}</div>
        )}
        {desc && <div className="list-row__desc">{desc}</div>}
      </div>
      {control}
    </div>
  );
}

export function Segmented<T extends string | number>({ value, options, onChange, label }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function LangBadge({ courseId, size }: { courseId: CourseId; size?: number }) {
  const c = getCourse(courseId);
  return (
    <span className={`lang-badge lang-badge--${courseId}`} style={size ? { width: size, height: size, fontSize: size * 0.4 } : undefined} aria-hidden="true">
      {c.emblem}
    </span>
  );
}

export function PageHeader({ title, back, action, fallback = '/' }: { title: ReactNode; back?: boolean; action?: ReactNode; fallback?: string }) {
  return (
    <header className="page-header">
      {back && (
        <button type="button" className="icon-btn" onClick={() => goBack(fallback)} aria-label={t('common.back')}>
          <ChevronLeft size={26} />
        </button>
      )}
      <h1>{title}</h1>
      {action}
    </header>
  );
}

export function StatTile({ value, label, note, icon }: { value: ReactNode; label: ReactNode; note?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="stat">
      {icon && <div style={{ color: 'var(--primary)', marginBottom: 4 }}>{icon}</div>}
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
      {note && <div className="stat__note">{note}</div>}
    </div>
  );
}

/** Bottom sheet / dialog. Closes on Escape, Android back and backdrop click. */
export function Sheet({ open, onClose, title, children, labelledBy }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; labelledBy?: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const handler = useCallback(() => {
    onClose();
    return true;
  }, [onClose]);
  useBackHandler(handler, open);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    el?.querySelector<HTMLElement>('button, [href], input, select, textarea')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && el) {
        const focusables = el.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div
        ref={ref}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? (title ? id : undefined)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="row row--between" style={{ marginBottom: 'var(--sp-4)' }}>
            <h2 id={id}>{title}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label={t('common.close')}>
              <X size={22} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function Banner({ children, variant, icon }: { children: ReactNode; variant?: 'warn' | 'success'; icon?: ReactNode }) {
  return (
    <div className={`banner${variant ? ` banner--${variant}` : ''}`} role="note">
      {icon}
      <div>{children}</div>
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card card--tint stack center" style={{ alignItems: 'center', padding: 'var(--sp-8) var(--sp-5)' }}>
      <div style={{ color: 'var(--primary)' }}>{icon}</div>
      <h2 style={{ fontSize: 'var(--fs-l)' }}>{title}</h2>
      {body && <p className="muted">{body}</p>}
      {action}
    </div>
  );
}
