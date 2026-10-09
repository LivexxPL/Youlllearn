import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Zap } from 'lucide-react';
import type { CourseId, Lesson } from '../../content/types';
import type { Exercise } from '../../engine/exercises';
import type { Outcome } from '../../engine/srs';
import { XP } from '../../engine/gamification';
import type { SessionOutcomes } from '../../services/progress';
import { t } from '../../i18n';
import { ProgressBar, Sheet } from '../../components/ui';
import { useBackHandler } from '../../app/router';
import { activity } from '../../services/activity';
import { audio } from '../../services/audio';
import { cue } from '../../services/feedback';
import type { ExerciseResult, StepProps } from './types';
import { FeedbackPanel } from './FeedbackPanel';
import { DialogueStep, ExamplesStep, GrammarStep, InfoStep, IntroStep } from './CardSteps';
import { AuthoredStep, ChoiceStep, QuestionStep } from './ChoiceSteps';
import { MatchStep, OrderStep, TypeStep } from './ProductionSteps';
import { SpeakStep } from './SpeakStep';
import { WriteStep } from './WriteStep';
import { SummaryStep, type SummaryData } from './SummaryStep';

export interface SessionPlayerProps {
  courseId: CourseId;
  steps: Exercise[];
  mode: 'lesson' | 'review';
  lesson?: Lesson;
  showRomaji: boolean;
  startIndex?: number;
  nextLessonId?: string;
  onFinish: (outcomes: SessionOutcomes, seconds: number) => Promise<SummaryData>;
  onExit: () => void;
  onProgress?: (index: number, total: number) => void;
}

function isGraded(ex: Exercise): boolean {
  return ex.refs.length > 0 || ex.kind === 'authored' || ex.kind === 'question' || ex.kind === 'match';
}

function StepView(props: StepProps & { ex: Exercise }) {
  const { ex } = props;
  switch (ex.kind) {
    case 'info':
      return <InfoStep {...props} ex={ex} />;
    case 'intro':
      return <IntroStep {...props} ex={ex} />;
    case 'grammar':
      return <GrammarStep {...props} ex={ex} />;
    case 'examples':
      return <ExamplesStep {...props} ex={ex} />;
    case 'dialogue':
      return <DialogueStep {...props} ex={ex} />;
    case 'choice':
      return <ChoiceStep {...props} ex={ex} />;
    case 'type':
      return <TypeStep {...props} ex={ex} />;
    case 'order':
      return <OrderStep {...props} ex={ex} />;
    case 'match':
      return <MatchStep {...props} ex={ex} />;
    case 'authored':
      return <AuthoredStep {...props} ex={ex} />;
    case 'question':
      return <QuestionStep {...props} ex={ex} />;
    case 'speak':
      return <SpeakStep {...props} ex={ex} />;
    case 'write':
      return <WriteStep {...props} ex={ex} />;
    case 'summary':
      return null;
  }
}

export function SessionPlayer({ courseId, steps, mode, lesson, showRomaji, startIndex = 0, nextLessonId, onFinish, onExit, onProgress }: SessionPlayerProps) {
  const [queue, setQueue] = useState<Exercise[]>(steps);
  const [index, setIndex] = useState(Math.min(startIndex, steps.length - 1));
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [retryScheduled, setRetryScheduled] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [quitOpen, setQuitOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const [run, setRun] = useState(0);
  const outcomes = useRef<SessionOutcomes>({ byRef: new Map(), graded: 0, correct: 0, xp: 0, bestRun: 0, speaking: 0, writing: 0 });
  const runRef = useRef(0);
  const startedAt = useRef(Date.now());
  const finalized = useRef(false);
  const retryHeader = useRef(false);
  const ex = queue[index];

  useEffect(() => {
    activity.start(mode, courseId);
    return () => {
      activity.stop();
      audio.stop();
    };
  }, [mode, courseId]);

  const backHandler = useCallback(() => {
    if (ex?.kind === 'summary') return false;
    setQuitOpen(true);
    return true;
  }, [ex]);
  useBackHandler(backHandler, !quitOpen);

  const push = (ref: string, o: Outcome) => {
    const list = outcomes.current.byRef.get(ref) ?? [];
    list.push(o);
    outcomes.current.byRef.set(ref, list);
  };

  const onResult = useCallback(
    (r: ExerciseResult) => {
      if (!ex) return;
      const isRetry = ex.key.endsWith('~r');
      const graded = isGraded(ex);
      const o = outcomes.current;
      if (graded) {
        if (!isRetry) {
          o.graded += 1;
          if (r.correct) o.correct += 1;
        }
        const gain = r.correct ? (isRetry ? XP.correctRetry : XP.correctFirstTry) : 0;
        o.xp += gain;
        setXp(o.xp);
        runRef.current = r.correct ? runRef.current + 1 : 0;
        o.bestRun = Math.max(o.bestRun, runRef.current);
        setRun(runRef.current);
        if (ex.kind === 'speak') o.speaking += 1;
        if (ex.kind === 'write') o.writing += 1;
        const outcome: Outcome = { correct: r.correct, almost: r.almost, usedHint: r.usedHint, skill: ex.skill ?? 'recognition', selfRating: r.selfRating };
        if (ex.kind === 'match') {
          for (const p of ex.pairs) push(p.id, { correct: true, almost: (r.mistakes ?? 0) > 0, skill: 'recognition' });
        } else {
          for (const ref of ex.refs) push(ref, outcome);
        }
      }
      let scheduled = false;
      if (graded && !r.correct && !isRetry && ex.kind !== 'speak' && ex.kind !== 'write') {
        scheduled = true;
        const clone = { ...ex, key: `${ex.key}~r` } as Exercise;
        setQueue((q) => {
          const summaryIdx = q.findIndex((s) => s.kind === 'summary');
          const end = summaryIdx >= 0 ? summaryIdx : q.length;
          if (mode === 'lesson') {
            const header: Exercise[] = retryHeader.current
              ? []
              : [{ kind: 'info', key: 'retry-header', variant: 'retry', title: t('lesson.retryTitle'), body: [t('lesson.retryBody')], refs: [], hints: true }];
            retryHeader.current = true;
            return [...q.slice(0, end), ...header, clone, ...q.slice(end)];
          }
          const at = Math.min(end, index + 3);
          return [...q.slice(0, at), clone, ...q.slice(at)];
        });
      }
      setRetryScheduled(scheduled);
      if (graded) cue(r.correct ? (r.almost ? 'almost' : 'correct') : 'wrong');
      if (r.silent) advance();
      else setResult(r);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ex, index, mode],
  );

  const advance = useCallback(() => {
    audio.stop();
    setResult(null);
    const next = Math.min(index + 1, queue.length - 1);
    setIndex(next);
    onProgress?.(next, queue.length);
    window.scrollTo({ top: 0 });
  }, [index, queue.length, onProgress]);

  // Finalise when the summary step is reached.
  useEffect(() => {
    if (ex?.kind !== 'summary' || finalized.current) return;
    finalized.current = true;
    cue('complete');
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    onFinish(outcomes.current, seconds)
      .then(setSummary)
      .catch((e) => {
        console.error(e);
        setSummary({ accuracy: outcomes.current.graded ? outcomes.current.correct / outcomes.current.graded : 1, xp: outcomes.current.xp, newItems: 0, seconds, rewards: [], achievements: [] });
      });
  }, [ex, onFinish]);

  if (!ex) return null;
  const total = queue.length - 1;
  const locked = result !== null;

  return (
    <div className="session" onPointerDown={() => activity.ping()} onKeyDown={() => activity.ping()}>
      <header className="session__bar">
        <button type="button" className="icon-btn" onClick={() => (ex.kind === 'summary' ? onExit() : setQuitOpen(true))} aria-label={t('common.close')} data-testid="session-close">
          <X size={24} />
        </button>
        <div className="grow">
          <ProgressBar value={Math.min(index, total)} max={total} label={t('lesson.progress')} />
        </div>
        <span className="chip chip--accent session__xp" aria-label={t('unit.xp', { count: xp })}>
          <Zap size={14} /> {xp}
        </span>
      </header>

      <div className="session__body page" key={ex.key}>
        {ex.kind === 'summary' ? (
          <SummaryStep mode={mode} lesson={lesson} courseId={courseId} summary={summary} nextLessonId={nextLessonId} onExit={onExit} />
        ) : (
          <StepView ex={ex} courseId={courseId} locked={locked} showRomaji={showRomaji} onResult={onResult} onContinue={advance} />
        )}
      </div>

      {result && <FeedbackPanel result={result} courseId={courseId} run={run} retryScheduled={retryScheduled} onContinue={advance} />}

      <Sheet open={quitOpen} onClose={() => setQuitOpen(false)} title={t('lesson.quitTitle')}>
        <p className="muted">{t('lesson.quitBody')}</p>
        <div className="stack" style={{ marginTop: 'var(--sp-5)' }}>
          <button type="button" className="btn btn--primary btn--lg" onClick={() => setQuitOpen(false)}>
            {t('lesson.quitCancel')}
          </button>
          <button type="button" className="btn btn--outline" onClick={onExit} data-testid="quit-confirm">
            {t('lesson.quitConfirm')}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
