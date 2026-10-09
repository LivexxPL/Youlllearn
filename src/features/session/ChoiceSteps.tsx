import { useCallback, useEffect, useState } from 'react';
import { Eye, Headphones, RotateCcw } from 'lucide-react';
import type { StepProps, ExerciseOf } from './types';
import { ActionBar } from './ActionBar';
import { t } from '../../i18n';
import { TargetText } from '../../components/TargetText';
import { AudioButton, useSpeaker } from '../../components/AudioButton';
import { useSettings } from '../../state/settings';
import { useAudioStatus } from '../../state/hooks';
import { getCourse } from '../../content/registry';
import type { ChoiceOption } from '../../engine/exercises';
import type { CourseId } from '../../content/types';
import { activity } from '../../services/activity';
import { useDialoguePlayer } from './CardSteps';
import { hasJapanese } from '../../engine/kana';

function promptKey(mode: ExerciseOf<'choice'>['mode']) {
  switch (mode) {
    case 'meaning':
      return 'ex.chooseMeaning' as const;
    case 'target':
      return 'ex.chooseTarget' as const;
    case 'listen':
      return 'ex.listenChoose' as const;
    case 'listen-target':
      return 'ex.listenChooseTarget' as const;
    case 'kana-sound':
      return 'ex.kanaSound' as const;
    case 'kana-listen':
      return 'ex.kanaListen' as const;
    case 'kana-from-romaji':
      return 'ex.chooseTarget' as const;
    case 'read-sentence':
      return 'ex.readSentence' as const;
    case 'listen-sentence':
      return 'ex.listenPhrase' as const;
  }
}

/** Option tiles with keyboard shortcuts 1–9 and two-step select → check. */
export function OptionList({
  options,
  courseId,
  selected,
  onSelect,
  locked,
  correct,
  big,
}: {
  options: ChoiceOption[];
  courseId: CourseId;
  selected: number | null;
  onSelect: (i: number) => void;
  locked: boolean;
  correct?: number;
  big?: boolean;
}) {
  const speak = useSpeaker(courseId);
  useEffect(() => {
    if (locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) {
        e.preventDefault();
        onSelect(n - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options.length, onSelect, locked]);

  return (
    <div className={`options${big ? ' options--big' : ''}`} role="radiogroup">
      {options.map((o, i) => {
        const state = locked && correct !== undefined ? (i === correct ? 'correct' : i === selected ? 'wrong' : '') : i === selected ? 'selected' : '';
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i === selected}
            className={`tile${state ? ` tile--${state}` : ''}`}
            disabled={locked}
            onClick={() => {
              activity.ping();
              onSelect(i);
              if (o.speak && o.lang !== 'pl') speak(o.speak);
            }}
            data-testid={`option-${i}`}
          >
            <span className="tile__key" aria-hidden="true">
              {i + 1}
            </span>
            <span className="tile__label">{o.lang === 'pl' ? o.label : <TargetText text={o.label} courseId={o.lang} />}</span>
          </button>
        );
      })}
    </div>
  );
}

function CheckBar({ disabled, onCheck, locked, extra }: { disabled: boolean; onCheck: () => void; locked: boolean; extra?: React.ReactNode }) {
  useEffect(() => {
    if (locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        onCheck();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [disabled, onCheck, locked]);
  return (
    <ActionBar hidden={locked}>
      {extra}
      <button type="button" className="btn btn--primary btn--lg btn--block" disabled={disabled} onClick={onCheck} data-testid="check">
        {t('common.check')}
      </button>
    </ActionBar>
  );
}

export function ChoiceStep({ ex, courseId, locked, showRomaji, onResult }: StepProps<ExerciseOf<'choice'>>) {
  const { settings } = useSettings();
  const [selected, setSelected] = useState<number | null>(null);
  const [hintRomaji, setHintRomaji] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const status = useAudioStatus(getCourse(courseId).speechLang);
  const audioOk = status !== 'unsupported' && status !== 'missing';
  const listening = ex.prompt.hideText;
  // Without a voice, listening prompts fall back to showing the text.
  const showText = !listening || !audioOk;
  const item = ex.item;
  const canHint = ex.hints && courseId === 'ja' && Boolean(ex.prompt.romaji) && !showRomaji && ex.mode !== 'kana-sound';

  const check = useCallback(() => {
    if (selected === null) return;
    const correct = selected === ex.correct;
    const right = ex.options[ex.correct];
    onResult({
      correct,
      usedHint,
      expected: right.lang === 'pl' ? right.label : <TargetText text={right.label} courseId={right.lang} />,
      expectedSpeak: item?.text ?? ex.sentence?.text,
      explanation: correct ? undefined : (ex.explanation ?? (item?.tip ? item.tip : undefined)),
    });
  }, [selected, ex, onResult, usedHint, item]);

  return (
    <div className="step">
      <p className="step__instruction">
        {ex.mode === 'kana-from-romaji' ? t('ex.kanaFromRomaji', { romaji: ex.prompt.text ?? '' }) : t(promptKey(ex.mode))}
        {!ex.hints && <span className="chip chip--info step__nohints">{t('ex.noHints')}</span>}
      </p>
      <div className="prompt">
        {ex.prompt.audio && (
          <AudioButton
            courseId={courseId}
            content={item ?? { text: ex.prompt.audio }}
            autoPlay={listening || settings.autoplayAudio}
            size={listening ? 'l' : 'm'}
            label={t('common.play')}
          />
        )}
        {listening && !audioOk && <p className="subtle">{t('ex.audioUnavailable')}</p>}
        {showText && ex.prompt.text && ex.mode !== 'kana-from-romaji' && (
          <div className={`prompt__text${ex.mode === 'kana-sound' || item?.kind === 'kanji' ? ' prompt__text--char' : ''}${ex.prompt.lang === 'pl' ? ' prompt__text--pl' : ''}`}>
            {ex.prompt.lang && ex.prompt.lang !== 'pl' ? (
              <TargetText text={ex.prompt.text} courseId={ex.prompt.lang} romaji={ex.prompt.romaji} showRomaji={showRomaji || hintRomaji} reading={item?.reading} />
            ) : (
              ex.prompt.text
            )}
          </div>
        )}
        {ex.mode === 'kana-from-romaji' && <div className="prompt__text prompt__text--romaji">{ex.prompt.text}</div>}
        {canHint && showText && (
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => {
              setHintRomaji((v) => !v);
              setUsedHint(true);
            }}
            title={t('ex.romajiHintCost')}
          >
            <Eye size={16} /> {hintRomaji ? t('ex.hideRomaji') : t('ex.showRomaji')}
          </button>
        )}
      </div>
      <OptionList options={ex.options} courseId={courseId} selected={selected} onSelect={setSelected} locked={locked} correct={ex.correct} big={ex.mode === 'kana-listen' || ex.mode === 'kana-from-romaji'} />
      <CheckBar disabled={selected === null} onCheck={check} locked={locked} />
    </div>
  );
}

function optionLang(a: ExerciseOf<'authored'>['exercise'], option: string, courseId: CourseId): CourseId | 'pl' {
  if (a.type === 'gap') return courseId;
  if (a.optionsLang) return a.optionsLang === 'pl' ? 'pl' : courseId;
  if (courseId === 'ja') return hasJapanese(option) ? 'ja' : 'pl';
  return courseId;
}

export function AuthoredStep({ ex, courseId, locked, onResult }: StepProps<ExerciseOf<'authored'>>) {
  const a = ex.exercise;
  const [selected, setSelected] = useState<number | null>(null);
  const options: ChoiceOption[] = a.options.map((o) => ({ label: o, lang: optionLang(a, o, courseId) }));
  const correctIndex = a.type === 'gap' ? a.options.indexOf(a.answer) : a.answer;

  const check = useCallback(() => {
    if (selected === null) return;
    const correct = selected === correctIndex;
    const filled = a.type === 'gap' ? a.sentence.replace('___', a.answer) : a.options[a.answer];
    onResult({
      correct,
      expected: a.type === 'gap' ? <TargetText text={filled} courseId={courseId} /> : options[correctIndex].lang === 'pl' ? filled : <TargetText text={filled} courseId={courseId} />,
      expectedSpeak: a.type === 'gap' ? filled : a.target,
      explanation: a.explanation,
    });
  }, [selected, correctIndex, a, courseId, onResult, options]);

  const parts = a.type === 'gap' ? a.sentence.split('___') : [];
  const chosen = selected !== null ? a.options[selected] : null;
  return (
    <div className="step">
      <p className="step__instruction">{a.type === 'gap' ? t('ex.gap') : t('ex.grammarChoice')}</p>
      {a.type === 'gap' ? (
        <div className="prompt">
          <div className="prompt__text gap-sentence">
            <TargetText text={parts[0]} courseId={courseId} />
            <span className={`gap-slot${chosen ? ' is-filled' : ''}`}>{chosen ? <TargetText text={chosen} courseId={courseId} /> : '    '}</span>
            <TargetText text={parts[1] ?? ''} courseId={courseId} />
          </div>
          <p className="muted">{a.pl}</p>
        </div>
      ) : (
        <div className="prompt">
          <div className="prompt__text prompt__text--pl">{a.prompt}</div>
          {a.target && <AudioButton courseId={courseId} content={a.target} size="m" />}
        </div>
      )}
      <OptionList options={options} courseId={courseId} selected={selected} onSelect={setSelected} locked={locked} correct={correctIndex} />
      <CheckBar disabled={selected === null} onCheck={check} locked={locked} />
    </div>
  );
}

export function QuestionStep({ ex, courseId, locked, onResult }: StepProps<ExerciseOf<'question'>>) {
  const q = ex.question;
  const [selected, setSelected] = useState<number | null>(null);
  const source = ex.dialogue ?? ex.story;
  const player = useDialoguePlayer(courseId, source ? { lines: source.lines, speakers: ex.dialogue?.speakers } : { lines: [] });
  const check = useCallback(() => {
    if (selected === null) return;
    onResult({ correct: selected === q.answer, expected: q.options[q.answer], explanation: q.explanation });
  }, [selected, q, onResult]);
  return (
    <div className="step">
      <p className="step__instruction">
        <Headphones size={18} style={{ verticalAlign: '-3px' }} /> {t('ex.dialogueQuestion')}
      </p>
      <div className="prompt">
        <div className="prompt__text prompt__text--pl">{q.prompt}</div>
        {source && (
          <button type="button" className="btn btn--sm btn--outline" onClick={() => (player.current >= 0 ? player.stop() : player.playFrom(0))}>
            <RotateCcw size={16} /> {t('aq.listenAgain')}
          </button>
        )}
      </div>
      <OptionList options={q.options.map((o) => ({ label: o, lang: 'pl' as const }))} courseId={courseId} selected={selected} onSelect={setSelected} locked={locked} correct={q.answer} />
      <CheckBar disabled={selected === null} onCheck={check} locked={locked} />
    </div>
  );
}

export { CheckBar };
