import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getCourse } from '../../content/registry';
import { useSettings } from '../../state/settings';
import { useCards, useShowRomaji } from '../../state/hooks';
import { buildReviewSession, type ReviewMode } from '../../engine/reviewSession';
import type { Exercise } from '../../engine/exercises';
import { SessionPlayer } from '../session/SessionPlayer';
import type { SummaryData } from '../session/SummaryStep';
import { claimRewards, recordReviewSession, refreshAchievements, totalXp, type SessionOutcomes } from '../../services/progress';
import { db } from '../../services/db';
import { sessionCoinLines } from '../economy/labels';
import { newSessionId } from '../economy/session';
import { levelForXp } from '../../engine/gamification';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState, PageHeader } from '../../components/ui';
import { strokeCharSet } from '../writing/strokes';

const MODES: ReviewMode[] = ['standard', 'quick', 'weak', 'extra', 'lesson'];

export default function ReviewSessionScreen({ query }: { query: URLSearchParams }) {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useCards(course.id);
  const showRomaji = useShowRomaji();
  const requested = query.get('mode') as ReviewMode | null;
  const mode: ReviewMode = requested && MODES.includes(requested) ? requested : 'standard';
  const lessonId = query.get('lesson') ?? undefined;
  const [steps, setSteps] = useState<Exercise[] | null>(null);
  const xpBefore = useRef<number | null>(null);
  const [sessionId] = useState(newSessionId);

  useEffect(() => {
    totalXp().then((x) => (xpBefore.current = x));
  }, []);

  useEffect(() => {
    if (!cards || steps) return;
    setSteps(
      buildReviewSession({
        course,
        cards,
        now: Date.now(),
        mode,
        lessonId,
        seed: Date.now(),
        showRomaji,
        strokeChars: strokeCharSet,
        speaking: true,
      }),
    );
  }, [cards, steps, course, mode, lessonId, showRomaji]);

  const onFinish = useCallback(
    async (outcomes: SessionOutcomes, seconds: number): Promise<SummaryData> => {
      // Every session (Endless practice included) earns coins for cards that have not earned
      // any in reviews today; the session id keeps a repeated report from paying twice.
      const res = await recordReviewSession(course, outcomes, Date.now(), db, { family: 'review', sessionId });
      const rewards = await claimRewards(settings);
      const achievements = await refreshAchievements();
      const after = await totalXp();
      const before = levelForXp(xpBefore.current ?? after - res.xp);
      const now = levelForXp(after);
      return {
        accuracy: outcomes.graded ? outcomes.correct / outcomes.graded : 1,
        xp: res.xp + rewards.reduce((n, r) => n + r.xp, 0),
        newItems: 0,
        reviewed: res.reviewed,
        seconds,
        rewards,
        achievements,
        levelUp: now.level > before.level ? { level: now.level, titleIndex: now.titleIndex } : undefined,
        coins: sessionCoinLines(res.coins, rewards, achievements),
        coinNote: !res.coins.length && res.reviewed >= 5 ? t('coins.noFresh') : undefined,
      };
    },
    [course, settings, sessionId],
  );

  if (!steps) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;

  if (steps.length === 0) {
    return (
      <div className="page">
        <PageHeader title={t('review.title')} back fallback="/review" />
        <EmptyState
          icon={<CheckCircle2 size={40} />}
          title={t('review.sessionDone')}
          body={cards?.length ? t('home.reviewQueueEmpty') : t('review.nothingYet')}
          action={
            cards?.length ? (
              <button type="button" className="btn btn--primary" onClick={() => navigate('/review/session?mode=extra', { replace: true })}>
                {t('review.extra')}
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={() => navigate('/learn', { replace: true })}>
                {t('nav.learn')}
              </button>
            )
          }
        />
      </div>
    );
  }

  return (
    <SessionPlayer
      courseId={course.id}
      steps={steps}
      mode="review"
      showRomaji={showRomaji}
      onFinish={onFinish}
      onExit={() => navigate('/', { replace: true })}
    />
  );
}
