/**
 * Charts (palettes validated with the dataviz validator — see docs/ARCHITECTURE.md):
 *  - MinutesChart: single series, columns in one hue, solid goal reference line,
 *    per-bar tooltip on hover/focus, selective label (today), table view.
 *  - MemoryBar: part-to-whole stacked bar with 2px surface gaps; the empty
 *    track is "not started"; legend with counts doubles as the table view.
 */
import { useId, useState } from 'react';
import { t } from '../i18n';

export interface DayValue {
  date: string;
  label: string;
  minutes: number;
  isToday?: boolean;
}

function niceMax(v: number): number {
  if (v <= 10) return 10;
  if (v <= 20) return 20;
  if (v <= 30) return 30;
  if (v <= 60) return 60;
  return Math.ceil(v / 30) * 30;
}

export function MinutesChart({ days, goal, title }: { days: DayValue[]; goal: number; title: string }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(goal, ...days.map((d) => d.minutes)));
  const W = 320;
  const H = 150;
  const padL = 28;
  const padB = 22;
  const padT = 14;
  const plotW = W - padL - 4;
  const plotH = H - padB - padT;
  const band = plotW / days.length;
  const barW = Math.min(24, band * 0.62);
  const y = (v: number) => padT + plotH - (v / max) * plotH;
  const ticks = [0, max / 2, max];
  const todayIdx = days.findIndex((d) => d.isToday);

  return (
    <figure className="chart" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`} className="chart__title">
        {title}
      </figcaption>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={title} className="chart__svg">
          {ticks.map((tk) => (
            <g key={tk}>
              <line x1={padL} x2={W - 2} y1={y(tk)} y2={y(tk)} className="chart__grid" />
              <text x={padL - 6} y={y(tk) + 3.5} textAnchor="end" className="chart__tick">
                {tk}
              </text>
            </g>
          ))}
          {days.map((d, i) => {
            const x = padL + i * band + (band - barW) / 2;
            const h = Math.max(0, (d.minutes / max) * plotH);
            const r = Math.min(4, h / 2, barW / 2);
            const top = padT + plotH - h;
            // Rounded data-end (top), square at the baseline.
            const path =
              h > 0
                ? `M${x},${padT + plotH} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${padT + plotH} Z`
                : '';
            return (
              <g
                key={d.date}
                tabIndex={0}
                role="img"
                aria-label={`${d.label}: ${t('unit.minShort', { count: d.minutes })}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={`chart__col${hover === i ? ' is-hover' : ''}`}
              >
                <rect x={padL + i * band} y={padT} width={band} height={plotH + padB} fill="transparent" />
                {path && <path d={path} className="chart__bar" />}
                <text x={padL + i * band + band / 2} y={H - 6} textAnchor="middle" className={`chart__tick${d.isToday ? ' is-today' : ''}`}>
                  {d.label}
                </text>
              </g>
            );
          })}
          {/* Goal reference line (solid hairline) with its label at the right end. */}
          <line x1={padL} x2={W - 2} y1={y(goal)} y2={y(goal)} className="chart__goal" />
          <text x={W - 4} y={y(goal) - 4} textAnchor="end" className="chart__goal-label">
            {t('set.goal')}: {goal}
          </text>
          {todayIdx >= 0 && days[todayIdx].minutes > 0 && hover === null && (
            <text x={padL + todayIdx * band + band / 2} y={y(days[todayIdx].minutes) - 5} textAnchor="middle" className="chart__value">
              {days[todayIdx].minutes}
            </text>
          )}
        </svg>
        {hover !== null && (
          <div className="chart__tooltip" style={{ left: `${((padL + hover * band + band / 2) / W) * 100}%` }} role="status">
            <strong>{t('unit.minShort', { count: days[hover].minutes })}</strong>
            <span>{days[hover].label}</span>
          </div>
        )}
      </div>
      <details className="chart__table">
        <summary>{t('progress.tableView')}</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">{t('progress.day')}</th>
              <th scope="col">{t('progress.minutes')}</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <td>{d.date}</td>
                <td>{d.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export type MemoryState = 'established' | 'learning' | 'due' | 'struggling' | 'new';

const ORDER: Exclude<MemoryState, 'new'>[] = ['established', 'learning', 'due', 'struggling'];

export function MemoryBar({ counts, title }: { counts: Record<MemoryState, number>; title: string }) {
  const id = useId();
  const total = ORDER.reduce((n, k) => n + counts[k], 0) + counts.new;
  const [hover, setHover] = useState<MemoryState | null>(null);
  return (
    <figure className="chart" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`} className="chart__title">
        {title}
      </figcaption>
      <div className="memory-bar" role="img" aria-label={ORDER.map((k) => `${t(`review.status.${k}` as never)}: ${counts[k]}`).join(', ')}>
        {total > 0 &&
          ORDER.filter((k) => counts[k] > 0).map((k) => (
            <span
              key={k}
              className={`memory-bar__seg memory-bar__seg--${k}${hover === k ? ' is-hover' : ''}`}
              style={{ flexGrow: counts[k] }}
              onPointerEnter={() => setHover(k)}
              onPointerLeave={() => setHover(null)}
              title={`${t(`review.status.${k}` as never)}: ${counts[k]}`}
            />
          ))}
        {counts.new > 0 && <span className="memory-bar__rest" style={{ flexGrow: counts.new }} />}
      </div>
      <ul className="legend">
        {(['established', 'learning', 'due', 'struggling', 'new'] as MemoryState[]).map((k) => (
          <li key={k} className={`legend__item${hover === k ? ' is-hover' : ''}`}>
            <span className={`legend__swatch legend__swatch--${k}`} aria-hidden="true" />
            <span className="legend__label">{t(`review.status.${k}` as never)}</span>
            <span className="legend__value">{counts[k]}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
