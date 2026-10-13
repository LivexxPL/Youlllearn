import { Award, Clock, Headphones, Home, PartyPopper, RotateCcw, SkipForward, Sparkles, Target, Zap } from 'lucide-react';
import type { CourseId, Lesson } from '../../content/types';
import type { AchievementDef } from '../../engine/gamification';
import type { ClaimedReward } from '../../services/progress';
import { t, formatPercent, formatDuration } from '../../i18n';
import { navigate } from '../../app/router';
import { StatTile } from '../../components/ui';
import { useSettings } from '../../state/settings';
import { CoinRewardCard } from '../economy/CoinRewardCard';
import { Celebration } from '../economy/Celebration';
import type { CoinLine } from '../economy/labels';

export interface SummaryData {
  accuracy: number;
  xp: number;
  newItems: number;
  seconds: number;
  rewards: ClaimedReward[];
  achievements: AchievementDef[];
  levelUp?: { level: number; titleIndex: number };
  reviewed?: number;
  /** Coins earned, with their reasons (services/economy.ts). */
  coins?: CoinLine[];
  /** Shown when practice earned no coins (cards already rewarded today). */
  coinNote?: string;
}

export function SummaryStep({
  mode,
  lesson,
  summary,
  nextLessonId,
  onExit,
}: {
  mode: 'lesson' | 'review';
  lesson?: Lesson;
  courseId: CourseId;
  summary: SummaryData | null;
  nextLessonId?: string;
  onExit: () => void;
}) {
  const { settings } = useSettings();
  return (
    <div className="step summary">
      <Celebration fx={settings.cosmetics.fx} />
      <div className="summary__hero">
        <PartyPopper size={48} />
        <h1>{mode === 'lesson' ? t('lesson.summaryTitle') : t('review.sessionDone')}</h1>
        {lesson && <p className="muted">{lesson.title}</p>}
      </div>

      {summary ? (
        <>
          <div className="grid-2">
            <StatTile icon={<Target size={20} />} value={formatPercent(summary.accuracy)} label={t('lesson.summaryAccuracy')} />
            <StatTile icon={<Zap size={20} />} value={`+${summary.xp}`} label={t('lesson.summaryXp')} />
            {mode === 'lesson' ? (
              <StatTile icon={<Sparkles size={20} />} value={summary.newItems} label={t('lesson.summaryNew')} />
            ) : (
              <StatTile icon={<RotateCcw size={20} />} value={summary.reviewed ?? 0} label={t('progress.reviews')} />
            )}
            <StatTile icon={<Clock size={20} />} value={formatDuration(summary.seconds)} label={t('lesson.summaryTime')} />
          </div>

          {summary.levelUp && (
            <div className="banner banner--success">
              <Award size={20} />
              <strong>{t('level.up', { level: summary.levelUp.level, title: t(`level.title.${summary.levelUp.titleIndex}` as never) })}</strong>
            </div>
          )}
          {summary.rewards.map((r, i) => (
            <div key={i} className="banner banner--warn">
              <Sparkles size={18} />
              <span>
                {r.kind === 'all-quests' ? t('quest.allDone', { xp: r.xp }) : `${t(r.titleKey as never, { count: r.target ?? 0 })} — ${t('quest.reward', { xp: r.xp })}`}
              </span>
            </div>
          ))}
          {summary.achievements.map((a) => (
            <div key={a.id} className="banner banner--success">
              <Award size={18} />
              <span>{t('ach.unlocked', { name: t(`ach.${a.id}` as never) })}</span>
            </div>
          ))}
          <CoinRewardCard lines={summary.coins ?? []} note={summary.coinNote} />
        </>
      ) : (
        <p className="muted">{t('common.loading')}</p>
      )}

      {lesson && (
        <section className="card">
          <h2 className="card__title">{t('lesson.summaryLearned')}</h2>
          <ul className="summary-list">
            {lesson.summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {mode === 'lesson' && lesson && (
        <section className="card card--tint stack stack--s">
          <h2 className="card__title">{t('lesson.followUpTitle')}</h2>
          <p>{lesson.followUp ?? t('lesson.followUpDefault')}</p>
          <button type="button" className="btn btn--outline" onClick={() => navigate(`/audio/handsfree?lesson=${lesson.id}&min=5`, { replace: true })}>
            <Headphones size={18} /> {t('lesson.followUpAudio')}
          </button>
        </section>
      )}

      <div className="stack">
        {nextLessonId && (
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => navigate(`/lesson/${nextLessonId}`, { replace: true })} data-testid="next-lesson">
            <SkipForward size={20} /> {t('lesson.nextLesson')}
          </button>
        )}
        <button type="button" className={`btn btn--lg btn--block ${nextLessonId ? 'btn--outline' : 'btn--primary'}`} onClick={onExit} data-testid="summary-home">
          <Home size={20} /> {t('lesson.backHome')}
        </button>
      </div>
    </div>
  );
}
