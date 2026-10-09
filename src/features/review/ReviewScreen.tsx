import { useMemo, useState } from 'react';
import { Brain, Dumbbell, Info, Play, Search, Timer } from 'lucide-react';
import { useSettings } from '../../state/settings';
import { getCourse } from '../../content/registry';
import { useCards, useCompletedSet } from '../../state/hooks';
import { cardStatus, countDue, isStruggling, type Card, type CardStatus } from '../../engine/srs';
import { reviewMinutes } from '../../engine/recommend';
import { navigate } from '../../app/router';
import { t, formatDate } from '../../i18n';
import { PageHeader } from '../../components/ui';
import { CourseSwitcher } from '../home/HomeScreen';
import { MemoryBar, type MemoryState } from '../../components/charts';
import { TargetText } from '../../components/TargetText';
import { gloss } from '../../content/text';
import { normalize } from '../../engine/answer';

export function memoryCounts(cards: Card[], totalItems: number, now: number): Record<MemoryState, number> {
  const counts: Record<MemoryState, number> = { established: 0, learning: 0, due: 0, struggling: 0, new: 0 };
  const items = cards.filter((c) => c.kind === 'item');
  for (const c of items) counts[cardStatus(c, now) as Exclude<CardStatus, 'new'>] += 1;
  counts.new = Math.max(0, totalItems - items.length);
  return counts;
}

export default function ReviewScreen() {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useCards(course.id);
  const completed = useCompletedSet(course.id);
  const [query, setQuery] = useState('');
  const now = Date.now();
  const due = cards ? countDue(cards, now) : 0;
  const weak = cards ? cards.filter(isStruggling).length : 0;
  const counts = useMemo(() => memoryCounts(cards ?? [], course.items.size, now), [cards, course.items.size, now]);
  const nextDue = useMemo(() => {
    const future = (cards ?? []).filter((c) => c.due > now).sort((a, b) => a.due - b.due)[0];
    return future ? new Date(future.due) : null;
  }, [cards, now]);

  const list = useMemo(() => {
    const q = normalize(query, 'pl');
    return (cards ?? [])
      .filter((c) => c.kind === 'item')
      .map((c) => ({ card: c, item: course.items.get(c.id)! }))
      .filter((x) => x.item)
      .filter((x) => !q || normalize(x.item.text, course.id).includes(q) || normalize(x.item.pl, 'pl').includes(q))
      .sort((a, b) => a.card.due - b.card.due)
      .slice(0, 200);
  }, [cards, query, course]);

  return (
    <div className="page">
      <PageHeader title={t('review.title')} action={<CourseSwitcher />} />
      <p className="muted">{t('review.subtitle')}</p>

      <section className="card card--hero hero" aria-labelledby="due-title">
        <p className="eyebrow hero__eyebrow">{t('review.dueNow')}</p>
        <h2 id="due-title" className="hero__title">
          {due > 0 ? t('home.reviewDue', { count: due }) : cards?.length ? t('review.nothing', { when: nextDue ? formatDate(nextDue, { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : '—' }) : t('review.nothingYet')}
        </h2>
        {due > 0 && <p className="muted">{t('common.minutesApprox', { count: reviewMinutes(Math.min(due, 15)) })}</p>}
        {due > 30 && <p className="muted">{t('review.backlog')}</p>}
        {due > 0 ? (
          <button type="button" className="btn btn--lg btn--accent btn--block" onClick={() => navigate('/review/session?mode=standard')} data-testid="review-start">
            <Play size={20} /> {t('review.start')}
          </button>
        ) : completed.size > 0 ? (
          <button type="button" className="btn btn--lg btn--accent btn--block" onClick={() => navigate('/review/session?mode=extra')}>
            <Dumbbell size={20} /> {t('review.extra')}
          </button>
        ) : (
          <button type="button" className="btn btn--lg btn--accent btn--block" onClick={() => navigate('/learn')}>
            {t('nav.learn')}
          </button>
        )}
      </section>

      <div className="grid-2">
        <button type="button" className="card quick-card" disabled={!cards?.length} onClick={() => navigate('/review/session?mode=quick')}>
          <Timer size={22} />
          <span className="card__title">{t('review.quick')}</span>
          <span className="subtle">{t('home.shortSessionDesc')}</span>
        </button>
        <button type="button" className="card quick-card" disabled={weak === 0} onClick={() => navigate('/review/session?mode=weak')}>
          <Brain size={22} />
          <span className="card__title">
            {t('review.weak')} {weak > 0 && <span className="chip chip--accent">{weak}</span>}
          </span>
          <span className="subtle">{t('review.weakDesc')}</span>
        </button>
      </div>

      <section className="card">
        <MemoryBar counts={counts} title={t('review.statusTitle')} />
      </section>

      <details className="card details">
        <summary>
          <Info size={18} style={{ marginRight: 8 }} />
          {t('review.howItWorks')}
        </summary>
        <p style={{ marginTop: 'var(--sp-2)' }}>{t('review.howItWorksBody')}</p>
        <p className="subtle" style={{ marginTop: 'var(--sp-2)' }}>
          <a href="#/about">{t('set.methodology')}</a>
        </p>
      </details>

      {cards && cards.length > 0 && (
        <section className="stack stack--s" aria-labelledby="all-items">
          <h2 id="all-items" className="section-title">
            {t('review.allItems')}
          </h2>
          <label className="search">
            <Search size={18} aria-hidden="true" />
            <span className="visually-hidden">{t('review.search')}</span>
            <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('review.search')} type="search" />
          </label>
          <ul className="list">
            {list.map(({ card, item }) => {
              const st = cardStatus(card, now);
              return (
                <li key={card.id} className="list-row">
                  <div className="list-row__body">
                    <div className="list-row__title">
                      <TargetText text={item.text} courseId={course.id} />
                    </div>
                    <div className="list-row__desc">
                      {gloss(item)} · {card.phase === 'review' ? t('review.intervalDays', { days: Math.round(card.interval) }) : t('review.status.learning')}
                    </div>
                  </div>
                  <span className={`status-pill status-pill--${st}`}>
                    {t(`review.status.${st}` as never)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
