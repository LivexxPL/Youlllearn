import { useEffect, useMemo, useRef } from 'react';
import { CheckCircle2, Lightbulb, RotateCcw, TriangleAlert } from 'lucide-react';
import type { CourseId } from '../../content/types';
import type { ExerciseResult } from './types';
import { t, type MessageKey } from '../../i18n';
import { AudioButton } from '../../components/AudioButton';

const CORRECT: MessageKey[] = ['fb.correct.1', 'fb.correct.2', 'fb.correct.3', 'fb.correct.4', 'fb.correct.5'];
const WRONG: MessageKey[] = ['fb.wrong.1', 'fb.wrong.2', 'fb.wrong.3', 'fb.wrong.4'];

const ISSUE_KEYS: Record<string, MessageKey> = {
  accent: 'fb.issue.accent',
  typo: 'fb.issue.typo',
  variant: 'fb.issue.variant',
  romaji: 'fb.issue.romaji',
  script: 'fb.issue.script',
  'other-word': 'fb.issue.otherWord',
};

export function FeedbackPanel({
  result,
  courseId,
  run,
  retryScheduled,
  onContinue,
}: {
  result: ExerciseResult;
  courseId: CourseId;
  run: number;
  retryScheduled: boolean;
  onContinue: () => void;
}) {
  const btn = useRef<HTMLButtonElement>(null);
  const message = useMemo(() => {
    const list = result.correct ? CORRECT : WRONG;
    return t(list[Math.floor(Math.random() * list.length)]);
  }, [result]);

  useEffect(() => {
    btn.current?.focus({ preventScroll: true });
  }, []);

  const tone = result.correct ? (result.almost ? 'almost' : 'correct') : 'wrong';
  return (
    <div className={`feedback feedback--${tone}`} role="alert" aria-live="assertive">
      <div className="feedback__inner">
        <div className="feedback__head">
          {result.correct ? <CheckCircle2 size={28} /> : <TriangleAlert size={26} />}
          <strong className="feedback__title">{result.correct && result.almost ? t('fb.almost') : message}</strong>
        </div>
        {result.correct && !result.almost && run >= 5 && run % 5 === 0 && <p className="feedback__run">{t('fb.streakRun', { count: run })}</p>}
        {(result.issues ?? []).filter((i) => ISSUE_KEYS[i]).map((i) => (
          <p key={i} className="feedback__note">
            {t(ISSUE_KEYS[i])}
          </p>
        ))}
        {result.expected && (!result.correct || result.almost || result.issues?.includes('variant')) && (
          <div className="feedback__answer">
            <span className="eyebrow">{t('ex.correctAnswer')}</span>
            <div className="row">
              <div className="grow feedback__expected">{result.expected}</div>
              {result.expectedSpeak && <AudioButton courseId={courseId} content={result.expectedSpeak} size="s" withSlow={false} />}
            </div>
          </div>
        )}
        {result.explanation && (
          <p className="feedback__explanation">
            <Lightbulb size={16} /> {result.explanation}
          </p>
        )}
        {!result.correct && retryScheduled && (
          <p className="feedback__note">
            <RotateCcw size={14} /> {t('fb.retryLater')}
          </p>
        )}
        <button ref={btn} type="button" className={`btn btn--lg btn--block ${result.correct ? 'btn--success' : 'btn--danger'}`} onClick={onContinue} data-testid="feedback-continue">
          {t('common.continue')}
        </button>
      </div>
    </div>
  );
}
