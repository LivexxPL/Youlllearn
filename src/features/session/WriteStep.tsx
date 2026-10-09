import { useEffect, useRef, useState } from 'react';
import { Eye, Play } from 'lucide-react';
import type { StepProps, ExerciseOf } from './types';
import { ActionBar } from './ActionBar';
import { t } from '../../i18n';
import { useSettings } from '../../state/settings';
import { WritingPad, type WritingPadHandle } from '../writing/WritingPad';
import { StrokeGuide } from '../writing/StrokeGuide';
import { compareStrokes, getStrokes, type StrokeHint } from '../writing/strokes';
import type { Stroke } from '../../services/db';
import type { SelfRating } from '../../engine/srs';
import { useSpeaker } from '../../components/AudioButton';

export function hintText(h: StrokeHint): string {
  if (h.kind === 'count') return t('write.strokeCountDiff', { drawn: t('write.strokes', { count: h.drawn ?? 0 }), expected: t('write.strokes', { count: h.expected ?? 0 }) });
  if (h.kind === 'start') return t('write.strokeStartFar', { n: h.stroke ?? 0 });
  return t('write.strokeDirection', { n: h.stroke ?? 0 });
}

export function WriteStep({ ex, courseId, locked, onResult }: StepProps<ExerciseOf<'write'>>) {
  const { settings, update } = useSettings();
  const pad = useRef<WritingPadHandle>(null);
  const speak = useSpeaker(courseId);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [replay, setReplay] = useState(0);
  const [showOrder, setShowOrder] = useState(ex.mode === 'trace');
  const [compared, setCompared] = useState<{ hints: StrokeHint[]; countOk: boolean; expected: number } | null>(null);
  const [grid, setGrid] = useState(true);

  useEffect(() => {
    speak(ex.item ?? ex.char);
  }, [ex.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const compare = async () => {
    const model = await getStrokes(ex.char);
    if (!model) return;
    const r = compareStrokes(strokes, model);
    setCompared({ ...r, expected: model.length });
  };

  const rate = (selfRating: SelfRating) => onResult({ correct: selfRating !== 'again', selfRating, silent: true });

  return (
    <div className="step step--write">
      <p className="step__instruction">{ex.mode === 'trace' ? t('ex.write') : t('ex.writeRecall')}</p>
      <div className="prompt">
        <div className="prompt__text prompt__text--romaji">
          {ex.romaji}
          {ex.meaning && ex.meaning !== ex.romaji ? <span className="muted"> · {ex.meaning}</span> : null}
        </div>
      </div>
      <WritingPad
        ref={pad}
        penOnly={settings.penOnly}
        brushSize={settings.brushSize}
        onBrushSize={(s) => update({ brushSize: s })}
        leftHanded={settings.leftHanded}
        stylusMode={settings.stylusMode}
        onChange={setStrokes}
        showGridToggle
        grid={grid}
        onGrid={setGrid}
        underlay={showOrder || compared ? <StrokeGuide char={ex.char} mode={compared ? 'numbers' : ex.mode === 'trace' ? 'faint' : 'animate'} replayKey={replay} /> : undefined}
        overlay={compared ? <StrokeGuide char={ex.char} mode="solid" /> : undefined}
      />
      <div className="row row--wrap" style={{ justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn--sm btn--outline"
          onClick={() => {
            setShowOrder(true);
            setReplay((r) => r + 1);
          }}
        >
          <Play size={16} /> {t('write.animate')}
        </button>
        {ex.mode === 'recall' && (
          <button type="button" className="btn btn--sm btn--outline" aria-pressed={showOrder} onClick={() => setShowOrder((v) => !v)}>
            <Eye size={16} /> {t('write.showOrder')}
          </button>
        )}
      </div>
      {compared && (
        <div className="card card--tint stack stack--s" aria-live="polite">
          {compared.countOk && <p>{t('write.strokeCountOk', { count: compared.expected })}</p>}
          {compared.hints.map((h, i) => (
            <p key={i}>{hintText(h)}</p>
          ))}
          <p className="subtle">{t('write.heuristicNote')}</p>
        </div>
      )}
      <ActionBar hidden={locked}>
        {!compared ? (
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={compare} disabled={!strokes.length} data-testid="write-compare">
            {t('write.check')}
          </button>
        ) : (
          <>
            <p className="action-bar__label">{t('write.selfAssess')}</p>
            <div className="row">
              <button type="button" className="btn btn--outline grow" onClick={() => rate('again')}>
                {t('write.selfAgain')}
              </button>
              <button type="button" className="btn btn--outline grow" onClick={() => rate('hard')}>
                {t('write.selfOk')}
              </button>
              <button type="button" className="btn btn--primary grow" onClick={() => rate('good')} data-testid="write-good">
                {t('write.selfGood')}
              </button>
            </div>
          </>
        )}
      </ActionBar>
    </div>
  );
}
