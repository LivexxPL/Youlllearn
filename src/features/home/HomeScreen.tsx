import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronDown, Clock, Flame, Headphones, Play, RotateCcw, Shield, Sparkles, Timer, Trophy, Zap } from 'lucide-react';
import { useSettings } from '../../state/settings';
import { getCourse, allCourses } from '../../content/registry';
import { useAllStats, useCards, useCompletedSet, useDayKey, useToday } from '../../state/hooks';
import { recommend, reviewMinutes } from '../../engine/recommend';
import { countDue } from '../../engine/srs';
import { evaluateStreak, initialStreak, isActiveDay, type StreakState } from '../../engine/gamification';
import { getMeta } from '../../services/db';
import { db } from '../../services/db';
import { navigate } from '../../app/router';
import { t, weekdayShort, formatNumber } from '../../i18n';
import { LangBadge, ProgressBar, ProgressRing, Sheet } from '../../components/ui';
import { weekDays } from '../../engine/dates';
import { questStatuses, challengeStatus, type QuestStatus, type ChallengeStatus } from '../../services/progress';
import { isUpdateReady, onUpdateReady, applyUpdate } from '../../services/pwa';
import type { CourseId } from '../../content/types';

function greetingKey(): 'home.greetingMorning' | 'home.greetingDay' | 'home.greetingEvening' {
  const h = new Date().getHours();
  if (h < 11) return 'home.greetingMorning';
  if (h < 18) return 'home.greetingDay';
  return 'home.greetingEvening';
}

export function CourseSwitcher() {
  const { settings, update } = useSettings();
  const [open, setOpen] = useState(false);
  const course = getCourse(settings.activeCourse);
  const pick = (id: CourseId) => {
    update({ activeCourse: id, courses: settings.courses.includes(id) ? settings.courses : [...settings.courses, id] });
    setOpen(false);
  };
  return (
    <>
      <button type="button" className="course-chip" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <LangBadge courseId={course.id} size={32} />
        <span>{course.name}</span>
        <ChevronDown size={18} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={t('course.choose')}>
        <div className="stack stack--s">
          {allCourses().map((c) => (
            <button
              key={c.id}
              type="button"
              className={`card course-option${c.id === settings.activeCourse ? ' is-active' : ''}`}
              onClick={() => pick(c.id)}
              aria-pressed={c.id === settings.activeCourse}
            >
              <div className="row">
                <LangBadge courseId={c.id} />
                <div className="grow">
                  <div className="card__title">
                    {c.name} <span className="muted" lang={c.speechLang}>· {c.nativeName}</span>
                  </div>
                  <div className="subtle">{c.framework}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Sheet>
    </>
  );
}

function WeekDots({ stats, today }: { stats: Map<string, { active: boolean }>; today: string }) {
  const days = weekDays(today);
  return (
    <div className="week-dots" aria-label={t('home.weekConsistency', { count: days.filter((d) => stats.get(d)?.active).length })}>
      {days.map((d) => {
        const active = stats.get(d)?.active;
        const isToday = d === today;
        const dow = new Date(d + 'T12:00:00').getDay();
        return (
          <div key={d} className={`week-dot${active ? ' is-active' : ''}${isToday ? ' is-today' : ''}`}>
            <span className="week-dot__circle">{active ? <Flame size={14} /> : null}</span>
            <span className="week-dot__label">{weekdayShort(dow).slice(0, 2)}</span>
          </div>
        );
      })}
    </div>
  );
}

function QuestList({ quests, allClaimed }: { quests: QuestStatus[]; allClaimed: boolean }) {
  return (
    <section className="card" aria-labelledby="quests-title">
      <div className="card__header">
        <h2 id="quests-title" className="card__title">
          <Sparkles size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6, color: 'var(--accent)' }} />
          {t('home.questsTitle')}
        </h2>
        <span className="chip chip--accent">{allClaimed ? t('quest.done') : t('quest.reward', { xp: 30 })}</span>
      </div>
      <ul className="quest-list">
        {quests.map((q) => (
          <li key={q.quest.id} className={`quest${q.done ? ' is-done' : ''}`}>
            <div className="row row--between">
              <span className="quest__title">{t(q.quest.titleKey as never, { count: q.quest.target })}</span>
              <span className={`chip ${q.done ? 'chip--success' : 'chip--accent'}`}>{q.done ? t('quest.done') : t('quest.reward', { xp: q.quest.xp })}</span>
            </div>
            <ProgressBar value={Math.min(q.value, q.quest.target)} max={q.quest.target} variant={q.done ? 'success' : 'accent'} thin label={t(q.quest.titleKey as never, { count: q.quest.target })} />
            <span className="subtle">
              {formatNumber(Math.min(q.value, q.quest.target))} / {formatNumber(q.quest.target)}
            </span>
          </li>
        ))}
      </ul>
      <p className="subtle" style={{ marginTop: 'var(--sp-3)' }}>
        {t('quest.allDoneHint', { xp: 30 })} · {t('quest.fixedRewards')}
      </p>
    </section>
  );
}

export function HomeScreen() {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const completed = useCompletedSet(course.id);
  const cards = useCards(course.id);
  const today = useToday();
  const allStats = useAllStats();
  const dayKey = useDayKey();
  const streakState = useLiveQuery(() => getMeta<StreakState>('streak', initialStreak), []);
  const resume = useLiveQuery(() => db.meta.get(`resume:${course.id}`), [course.id]);
  const [quests, setQuests] = useState<{ quests: QuestStatus[]; allClaimed: boolean } | null>(null);
  const [challenge, setChallenge] = useState<ChallengeStatus | null>(null);
  const [updateReady, setUpdateReady] = useState(isUpdateReady());

  useEffect(() => onUpdateReady(() => setUpdateReady(true)), []);

  useEffect(() => {
    questStatuses(settings, dayKey).then(setQuests);
    challengeStatus(settings, dayKey).then(setChallenge);
  }, [settings, dayKey, today?.exercises, today?.reviews, today?.listeningSec, today?.lessons, today?.speaking, today?.writing]);

  const now = Date.now();
  const due = cards ? countDue(cards, now) : 0;
  const activeMin = Math.floor((today?.activeSec ?? 0) / 60);
  const goalMet = activeMin >= settings.dailyGoalMin;
  const rec = recommend({ course, completed, dueCount: due, goalMet });

  const activeMap = useMemo(() => new Map((allStats ?? []).map((d) => [d.date, { active: isActiveDay(d) }])), [allStats]);
  const streak = useMemo(() => {
    const active = new Set([...activeMap.entries()].filter(([, v]) => v.active).map(([k]) => k));
    return evaluateStreak(streakState ?? initialStreak, active, dayKey);
  }, [activeMap, streakState, dayKey]);
  const weekActive = weekDays(dayKey).filter((d) => activeMap.get(d)?.active).length;
  const resumeValue = resume?.value as { lessonId: string; index: number; total: number } | undefined;

  const startRecommended = () => {
    if (rec.kind === 'lesson' && rec.lesson) navigate(`/lesson/${rec.lesson.id}`);
    else if (rec.kind === 'review') navigate('/review/session?mode=standard');
    else if (rec.kind === 'audio') navigate('/audio');
    else navigate('/learn');
  };

  const quick = () => {
    if (cards && cards.length) navigate('/review/session?mode=quick');
    else if (rec.lesson) navigate(`/lesson/${rec.lesson.id}`);
  };

  const recTitle = rec.kind === 'lesson' ? t('rec.lesson') : rec.kind === 'review' ? t('rec.review') : rec.kind === 'audio' ? t('rec.audio') : t('rec.repeatLesson');
  const recDesc =
    rec.kind === 'lesson' && rec.lesson
      ? t('rec.lessonDesc', { title: rec.lesson.title })
      : rec.kind === 'review'
        ? t('rec.reviewDesc', { cards: t('unit.cards', { count: Math.min(due, 15) }) })
        : rec.kind === 'audio'
          ? t('rec.audioDesc')
          : t('rec.repeatLessonDesc');

  return (
    <div className="page page--wide">
      <header className="home-header">
        <div>
          <p className="eyebrow">{t('home.todayTitle')}</p>
          <h1>{t(greetingKey())}</h1>
        </div>
        <CourseSwitcher />
      </header>

      {updateReady && (
        <div className="banner" role="status">
          <span className="grow">{t('home.updateReady')}</span>
          <button type="button" className="btn btn--sm btn--primary" onClick={applyUpdate}>
            {t('home.updateReload')}
          </button>
        </div>
      )}

      <div className="dash">
        <div className="stack stack--l">
          <section className="card card--hero hero" aria-labelledby="rec-title">
            <div className="hero__meta">
              <span className="chip hero__chip">
                <Clock size={14} /> {t('common.minutesApprox', { count: rec.minutes })}
              </span>
              <LangBadge courseId={course.id} size={36} />
            </div>
            <p className="eyebrow hero__eyebrow">{recTitle}</p>
            <h2 id="rec-title" className="hero__title">
              {recDesc}
            </h2>
            <p className="muted hero__why">{t(rec.reasonKey)}</p>
            <button type="button" className="btn btn--lg btn--accent btn--block" onClick={startRecommended} data-testid="continue">
              <Play size={20} /> {t('home.continue')}
            </button>
            {resumeValue && (
              <button type="button" className="btn btn--ghost hero__resume" onClick={() => navigate(`/lesson/${resumeValue.lessonId}`)}>
                {t('home.resumeLesson')}
              </button>
            )}
          </section>

          <div className="grid-2">
            <button type="button" className="card quick-card" onClick={quick}>
              <Timer size={22} />
              <span className="card__title">{t('home.shortSession')}</span>
              <span className="subtle">{t('home.shortSessionDesc')}</span>
            </button>
            <button type="button" className="card quick-card" onClick={() => navigate('/audio')}>
              <Headphones size={22} />
              <span className="card__title">{t('nav.audio')}</span>
              <span className="subtle">{t('aq.subtitle')}</span>
            </button>
          </div>

          {quests && <QuestList quests={quests.quests} allClaimed={quests.allClaimed} />}
        </div>

        <div className="stack stack--l">
          <section className="card goal-card" aria-labelledby="goal-title">
            <h2 id="goal-title" className="visually-hidden">
              {t('set.goal')}
            </h2>
            <div className="row" style={{ gap: 'var(--sp-5)' }}>
              <ProgressRing value={activeMin / settings.dailyGoalMin} size={104} label={t('home.goalProgress', { done: activeMin, goal: settings.dailyGoalMin })}>
                <div>
                  <div className="ring-number">{activeMin}</div>
                  <div className="subtle">/ {settings.dailyGoalMin} min</div>
                </div>
              </ProgressRing>
              <div className="stack stack--s grow">
                <div className="streak-line">
                  <Flame size={22} className={streak.todayActive ? 'flame is-lit' : 'flame'} />
                  <strong>{t('home.streakDays', { count: streak.current })}</strong>
                </div>
                <div className="subtle">{streak.todayActive ? t('streak.today') : t('streak.todayPending')}</div>
                {streak.state.shields > 0 && (
                  <div className="chip chip--info" title={t('progress.shieldsHelp')}>
                    <Shield size={14} /> {t('unit.shields', { count: streak.state.shields })}
                  </div>
                )}
              </div>
            </div>
            {goalMet && (
              <div className="banner banner--success" style={{ marginTop: 'var(--sp-4)' }}>
                <Trophy size={18} />
                <div>
                  <strong>{t('home.goalMet')}</strong>
                  <div>{t('home.goalMetBody')}</div>
                </div>
              </div>
            )}
            <WeekDots stats={activeMap} today={dayKey} />
            <p className="subtle center">{t('home.weekConsistency', { count: weekActive })}</p>
          </section>

          <section className="card" aria-labelledby="queue-title">
            <div className="card__header">
              <h2 id="queue-title" className="card__title">
                <RotateCcw size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />
                {t('home.reviewQueue')}
              </h2>
              {due > 0 && <span className="chip chip--accent">{t('common.minutesApprox', { count: reviewMinutes(Math.min(due, 15)) })}</span>}
            </div>
            {due > 0 ? (
              <>
                <p>{t('home.reviewDue', { count: due })}</p>
                <button type="button" className="btn btn--outline btn--block" style={{ marginTop: 'var(--sp-3)' }} onClick={() => navigate('/review/session?mode=standard')}>
                  {t('review.start')}
                </button>
              </>
            ) : (
              <p className="muted">{cards?.length ? t('home.reviewQueueEmpty') : t('review.nothingYet')}</p>
            )}
          </section>

          {challenge && (
            <section className="card" aria-labelledby="weekly-title">
              <div className="card__header">
                <h2 id="weekly-title" className="card__title">
                  <Zap size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6, color: 'var(--accent)' }} />
                  {t('progress.weekly')}
                </h2>
                <span className={`chip ${challenge.done ? 'chip--success' : 'chip--accent'}`}>{challenge.done ? t('quest.done') : t('quest.reward', { xp: challenge.challenge.xp })}</span>
              </div>
              <p>{t(challenge.challenge.titleKey as never, { count: challenge.challenge.target })}</p>
              <ProgressBar value={Math.min(challenge.value, challenge.challenge.target)} max={challenge.challenge.target} variant={challenge.done ? 'success' : 'accent'} />
              <p className="subtle" style={{ marginTop: 6 }}>
                {formatNumber(Math.min(challenge.value, challenge.challenge.target))} / {formatNumber(challenge.challenge.target)}
              </p>
            </section>
          )}

          <div className="grid-2">
            <div className="stat">
              <div className="stat__value">{cards?.filter((c) => c.kind === 'item').length ?? 0}</div>
              <div className="stat__label">{t('home.words')}</div>
            </div>
            <div className="stat">
              <div className="stat__value">
                {completed.size}/{course.lessons.length}
              </div>
              <div className="stat__label">{t('home.lessonsDone')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
