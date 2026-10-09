import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { findLesson } from '../../content/registry';
import { useSettings } from '../../state/settings';
import { useCards, useShowRomaji } from '../../state/hooks';
import { buildLessonSession } from '../../engine/lessonSession';
import type { Exercise } from '../../engine/exercises';
import { SessionPlayer } from '../session/SessionPlayer';
import type { SummaryData } from '../session/SummaryStep';
import { db, getMeta, setMeta } from '../../services/db';
import { claimRewards, recordLessonCompletion, refreshAchievements, setFlag, totalXp, type SessionOutcomes } from '../../services/progress';
import { levelForXp } from '../../engine/gamification';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { PageHeader, Sheet } from '../../components/ui';
import { strokeCharSet } from '../writing/strokes';

interface ResumeState {
  lessonId: string;
  index: number;
  total: number;
  seed: number;
}

export default function LessonScreen({ lessonId }: { lessonId?: string }) {
  const found = lessonId ? findLesson(lessonId) : null;
  const { settings } = useSettings();
  const cards = useCards(found?.course.id);
  const showRomaji = useShowRomaji(lessonId);
  const resumeKey = found ? `resume:${found.course.id}` : '';
  const resume = useLiveQuery(async () => (resumeKey ? ((await getMeta<ResumeState | null>(resumeKey, null)) ?? null) : null), [resumeKey]);
  const [choice, setChoice] = useState<{ seed: number; index: number } | null>(null);
  const [steps, setSteps] = useState<Exercise[] | null>(null);
  const xpBefore = useRef<number | null>(null);

  useEffect(() => {
    totalXp().then((x) => (xpBefore.current = x));
  }, []);

  // Decide between resuming and starting fresh.
  const pendingResume = resume && found && resume.lessonId === found.lesson.id && resume.index > 1 && !choice ? resume : null;
  useEffect(() => {
    if (resume === undefined || choice || !found) return;
    if (!(resume && resume.lessonId === found.lesson.id && resume.index > 1)) setChoice({ seed: Date.now(), index: 0 });
  }, [resume, choice, found]);

  // Build the session once (cards must be loaded for the warm-up selection).
  useEffect(() => {
    if (!found || !choice || !cards || steps) return;
    setSteps(
      buildLessonSession({
        course: found.course,
        lesson: found.lesson,
        lessonIndex: found.index,
        cards,
        now: Date.now(),
        seed: choice.seed,
        showRomaji,
        strokeChars: strokeCharSet,
      }),
    );
  }, [found, choice, cards, steps, showRomaji]);

  const nextLessonId = useMemo(() => (found ? found.course.lessons[found.index + 1]?.id : undefined), [found]);

  const onProgress = useCallback(
    (index: number, total: number) => {
      if (!found || !choice) return;
      if (index >= total - 1) db.meta.delete(resumeKey);
      else setMeta(resumeKey, { lessonId: found.lesson.id, index, total, seed: choice.seed } satisfies ResumeState);
    },
    [found, choice, resumeKey],
  );

  const onFinish = useCallback(
    async (outcomes: SessionOutcomes, seconds: number): Promise<SummaryData> => {
      if (!found) throw new Error('no lesson');
      await db.meta.delete(resumeKey);
      const res = await recordLessonCompletion({ course: found.course, lessonId: found.lesson.id, outcomes });
      if (res.perfect) await setFlag('perfect');
      const rewards = await claimRewards(settings);
      const achievements = await refreshAchievements();
      const after = await totalXp();
      const before = levelForXp(xpBefore.current ?? after - res.xp);
      const now = levelForXp(after);
      return {
        accuracy: res.accuracy,
        xp: res.xp + rewards.reduce((n, r) => n + r.xp, 0),
        newItems: res.newItems,
        seconds,
        rewards,
        achievements,
        levelUp: now.level > before.level ? { level: now.level, titleIndex: now.titleIndex } : undefined,
      };
    },
    [found, resumeKey, settings],
  );

  if (!found) {
    return (
      <div className="page">
        <PageHeader title={t('common.lesson')} back fallback="/learn" />
        <p className="muted">{t('lesson.notFound')}</p>
      </div>
    );
  }

  if (pendingResume) {
    return (
      <div className="page">
        <Sheet open onClose={() => setChoice({ seed: Date.now(), index: 0 })} title={t('lesson.resumeTitle')}>
          <p className="muted">{t('lesson.resumeBody', { title: found.lesson.title, step: pendingResume.index + 1, total: pendingResume.total })}</p>
          <div className="stack" style={{ marginTop: 'var(--sp-5)' }}>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => setChoice({ seed: pendingResume.seed, index: pendingResume.index })} data-testid="resume">
              {t('lesson.resume')}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setChoice({ seed: Date.now(), index: 0 })}>
              {t('lesson.restart')}
            </button>
          </div>
        </Sheet>
      </div>
    );
  }

  if (!steps || !choice) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;

  return (
    <SessionPlayer
      key={choice.seed}
      courseId={found.course.id}
      steps={steps}
      mode="lesson"
      lesson={found.lesson}
      showRomaji={showRomaji}
      startIndex={choice.index}
      nextLessonId={nextLessonId}
      onFinish={onFinish}
      onExit={() => navigate('/', { replace: true })}
      onProgress={onProgress}
    />
  );
}
