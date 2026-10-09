import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Anchor,
  Award,
  Brain,
  Brush,
  Calendar,
  Crown,
  Flame,
  Footprints,
  Gem,
  Globe,
  Headphones,
  Info,
  Lock,
  Map as MapIcon,
  Medal,
  Mic,
  Mountain,
  PenLine,
  Repeat,
  Shield,
  Star,
  Sunrise,
  Trophy,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { db, getMeta } from '../../services/db';
import { useAllStats, useCards, useDayKey, useLessonProgress } from '../../state/hooks';
import { useSettings } from '../../state/settings';
import { allCourses, getCourse } from '../../content/registry';
import { ACHIEVEMENTS, evaluateStreak, initialStreak, isActiveDay, levelForXp, personalBests, type StreakState } from '../../engine/gamification';
import { estimatedRetention } from '../../engine/srs';
import { lastNDays, parseDayKey } from '../../engine/dates';
import { t, formatDate, formatDuration, formatNumber, formatPercent, weekdayShort } from '../../i18n';
import { LangBadge, PageHeader, ProgressBar, Segmented, StatTile } from '../../components/ui';
import { MemoryBar, MinutesChart, type DayValue } from '../../components/charts';
import { memoryCounts } from '../review/ReviewScreen';

const ICONS: Record<string, ReactNode> = {
  footprints: <Footprints size={22} />,
  map: <MapIcon size={22} />,
  mountain: <Mountain size={22} />,
  gem: <Gem size={22} />,
  treasure: <Crown size={22} />,
  anchor: <Anchor size={22} />,
  flame: <Flame size={22} />,
  trophy: <Trophy size={22} />,
  calendar: <Calendar size={22} />,
  headphones: <Headphones size={22} />,
  repeat: <Repeat size={22} />,
  brain: <Brain size={22} />,
  mic: <Mic size={22} />,
  pen: <PenLine size={22} />,
  brush: <Brush size={22} />,
  globe: <Globe size={22} />,
  sunrise: <Sunrise size={22} />,
  star: <Star size={22} />,
  medal: <Medal size={22} />,
};

export default function ProgressScreen() {
  const { settings } = useSettings();
  const stats = useAllStats();
  const today = useDayKey();
  const progress = useLessonProgress();
  const cards = useCards();
  const unlocked = useLiveQuery(() => db.achievements.toArray(), []);
  const streakState = useLiveQuery(() => getMeta<StreakState>('streak', initialStreak), []);
  const rewards = useLiveQuery(() => db.rewards.toArray(), []);
  const [range, setRange] = useState<7 | 28>(7);
  const course = getCourse(settings.activeCourse);

  const byDate = useMemo(() => new Map((stats ?? []).map((d) => [d.date, d])), [stats]);
  const totalXpValue = (stats ?? []).reduce((n, d) => n + d.xp, 0);
  const level = levelForXp(totalXpValue);
  const streak = useMemo(() => {
    const active = new Set((stats ?? []).filter(isActiveDay).map((d) => d.date));
    return evaluateStreak(streakState ?? initialStreak, active, today);
  }, [stats, streakState, today]);
  const bests = personalBests(stats ?? [], streak.state.best);

  const chartDays: DayValue[] = useMemo(() => {
    if (range === 7) {
      return lastNDays(today, 7).map((d) => ({
        date: d,
        label: weekdayShort(parseDayKey(d).getDay()).slice(0, 2),
        minutes: Math.round((byDate.get(d)?.activeSec ?? 0) / 60),
        isToday: d === today,
      }));
    }
    // Four weeks, one bar per day; label every 7th day with its date.
    return lastNDays(today, 28).map((d, i) => ({
      date: d,
      label: i % 7 === 6 ? String(parseDayKey(d).getDate()) : '',
      minutes: Math.round((byDate.get(d)?.activeSec ?? 0) / 60),
      isToday: d === today,
    }));
  }, [range, today, byDate]);

  const rangeDays = lastNDays(today, range).map((d) => byDate.get(d));
  const activeSec = rangeDays.reduce((n, d) => n + (d?.activeSec ?? 0), 0);
  const openSec = rangeDays.reduce((n, d) => n + (d?.openSec ?? 0), 0);
  const all = stats ?? [];
  const sum = (k: 'activeSec' | 'listeningSec' | 'exercises' | 'reviews' | 'newItems' | 'lessons' | 'correct') => all.reduce((n, d) => n + d[k], 0);
  const last30 = lastNDays(today, 30).map((d) => byDate.get(d));
  const ex30 = last30.reduce((n, d) => n + (d?.exercises ?? 0), 0);
  const ok30 = last30.reduce((n, d) => n + (d?.correct ?? 0), 0);
  const retention = cards ? estimatedRetention(cards.filter((c) => c.kind === 'item'), Date.now()) : null;
  const courseCards = (cards ?? []).filter((c) => c.courseId === course.id);
  const counts = memoryCounts(courseCards, course.items.size, Date.now());
  const unlockedMap = new Map((unlocked ?? []).map((a) => [a.id, a]));
  const questXp = (rewards ?? []).reduce((n, r) => n + r.xp, 0);

  if (!stats) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;

  return (
    <div className="page page--wide">
      <PageHeader title={t('progress.title')} />
      <div className="dash">
        <div className="stack stack--l">
          <section className="card level-card" aria-labelledby="level-title">
            <div className="row">
              <div className="level-badge" aria-hidden="true">
                {level.level}
              </div>
              <div className="grow stack stack--s">
                <h2 id="level-title" className="card__title">
                  {t('progress.level', { level: level.level })} · {t(`level.title.${level.titleIndex}` as never)}
                </h2>
                <ProgressBar value={level.xpIntoLevel} max={level.xpForLevel} variant="accent" label={t('progress.xpToNext', { xp: level.xpForLevel - level.xpIntoLevel })} />
                <span className="subtle">
                  {t('progress.xpToNext', { xp: formatNumber(level.xpForLevel - level.xpIntoLevel) })} · {formatNumber(totalXpValue)} XP
                  {questXp > 0 ? ` (${t('home.questsTitle').toLowerCase()}: ${formatNumber(questXp)} XP)` : ''}
                </span>
              </div>
            </div>
            <details className="details">
              <summary>{t('progress.howXp')}</summary>
              <p>{t('progress.howXpBody')}</p>
            </details>
          </section>

          <section className="card" aria-labelledby="minutes-title">
            <div className="card__header">
              <h2 id="minutes-title" className="card__title">
                {t('progress.minutesChart')}
              </h2>
              <Segmented
                value={range}
                onChange={setRange}
                label={t('progress.minutesChart')}
                options={[
                  { value: 7, label: t('progress.week') },
                  { value: 28, label: t('progress.month') },
                ]}
              />
            </div>
            <MinutesChart days={chartDays} goal={settings.dailyGoalMin} title={range === 7 ? t('progress.week') : t('progress.month')} />
            <p className="subtle">
              {t('progress.activeVsOpen', { active: formatDuration(activeSec), open: formatDuration(openSec) })}
            </p>
            <p className="subtle">
              <Info size={14} style={{ verticalAlign: '-2px' }} /> {t('progress.activeHelp')}
            </p>
          </section>

          <section aria-labelledby="totals-title" className="stack stack--s">
            <h2 id="totals-title" className="section-title">
              {t('progress.totals')}
            </h2>
            <div className="grid-auto">
              <StatTile value={formatDuration(sum('activeSec'))} label={t('progress.totalMinutes')} />
              <StatTile value={formatDuration(sum('listeningSec'))} label={t('progress.listening')} />
              <StatTile value={formatNumber(sum('exercises'))} label={t('progress.exercises')} />
              <StatTile value={formatNumber(sum('reviews'))} label={t('progress.reviews')} />
              <StatTile value={formatNumber(sum('newItems'))} label={t('progress.newWords')} />
              <StatTile value={formatNumber(sum('lessons'))} label={t('progress.lessons')} />
            </div>
          </section>

          <section className="grid-2" aria-label={t('progress.retention')}>
            <StatTile
              value={retention === null ? '—' : `≈ ${formatPercent(retention)}`}
              label={t('progress.retention')}
              note={`${t('common.estimate')}. ${t('progress.retentionHelp')}`}
            />
            <StatTile value={ex30 ? formatPercent(ok30 / ex30) : '—'} label={t('progress.accuracy')} note={t('progress.accuracyHelp')} />
          </section>

          <section className="card">
            <MemoryBar counts={counts} title={`${t('progress.memory')} — ${course.name}`} />
          </section>
        </div>

        <div className="stack stack--l">
          <section className="card stack" aria-labelledby="streak-title">
            <h2 id="streak-title" className="card__title">
              {t('streak.title')}
            </h2>
            <div className="grid-2">
              <StatTile icon={<Flame size={20} />} value={t('home.streakDays', { count: streak.current })} label={t('progress.streakCurrent')} />
              <StatTile icon={<Trophy size={20} />} value={t('home.streakDays', { count: Math.max(streak.state.best, streak.current) })} label={t('progress.streakBest')} />
            </div>
            <div className="row">
              <Shield size={20} style={{ color: 'var(--info)' }} />
              <strong>
                {t('progress.shields')}: {streak.state.shields}/3
              </strong>
            </div>
            <p className="subtle">{t('progress.shieldsHelp')}</p>
          </section>

          <section className="card stack" aria-labelledby="courses-title">
            <h2 id="courses-title" className="card__title">
              {t('progress.perCourse')}
            </h2>
            {allCourses().map((c) => {
              const done = [...(progress?.values() ?? [])].filter((p) => p.courseId === c.id).length;
              return (
                <div key={c.id} className="row">
                  <LangBadge courseId={c.id} size={36} />
                  <div className="grow stack stack--s">
                    <div className="row row--between">
                      <span className="card__title" style={{ fontSize: 'var(--fs-m)' }}>
                        {c.name}
                      </span>
                      <span className="subtle">{t('course.lessonsDone', { done, total: c.lessons.length })}</span>
                    </div>
                    <ProgressBar value={done} max={c.lessons.length} thin label={c.name} />
                  </div>
                </div>
              );
            })}
          </section>

          <section className="card stack" aria-labelledby="bests-title">
            <h2 id="bests-title" className="card__title">
              {t('progress.bests')}
            </h2>
            <div className="grid-2">
              <StatTile value={t('home.streakDays', { count: Math.max(bests.streak, streak.current) })} label={t('progress.best.streak')} />
              <StatTile value={formatNumber(bests.dayXp)} label={t('progress.best.dayXp')} />
              <StatTile value={t('unit.minShort', { count: bests.dayMinutes })} label={t('progress.best.dayMinutes')} />
              <StatTile value={formatNumber(bests.run)} label={t('progress.best.run')} />
            </div>
          </section>

          <section className="stack stack--s" aria-labelledby="ach-title">
            <h2 id="ach-title" className="section-title">
              <span>
                <Award size={20} style={{ verticalAlign: '-4px', marginRight: 6 }} />
                {t('progress.achievements')}
              </span>
              <span className="chip">
                {unlockedMap.size}/{ACHIEVEMENTS.length}
              </span>
            </h2>
            <ul className="badges">
              {ACHIEVEMENTS.map((a) => {
                const rec = unlockedMap.get(a.id);
                return (
                  <li key={a.id} className={`badge${rec ? ' is-unlocked' : ''}`}>
                    <span className="badge__icon" aria-hidden="true">
                      {rec ? ICONS[a.icon] : <Lock size={20} />}
                    </span>
                    <span className="badge__name">{t(`ach.${a.id}` as never)}</span>
                    <span className="badge__desc">{t(`ach.${a.id}.desc` as never)}</span>
                    <span className="badge__date">{rec ? formatDate(rec.unlockedAt) : t('ach.locked')}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
      {all.length === 0 && <p className="muted center">{t('progress.noData')}</p>}
    </div>
  );
}
