import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StepProps, ExerciseOf } from './types';
import { ActionBar } from './ActionBar';
import { CheckBar } from './ChoiceSteps';
import { t } from '../../i18n';
import { TargetText } from '../../components/TargetText';
import { AudioButton, useSpeaker } from '../../components/AudioButton';
import { checkAnswer, buildLexicon, normalize } from '../../engine/answer';
import { looksLikeRomaji, toHiragana } from '../../engine/kana';
import { getCourse } from '../../content/registry';
import type { CourseId } from '../../content/types';
import { activity } from '../../services/activity';
import { shuffle, createRng } from '../../engine/random';
import { plainTarget } from '../../content/text';

const SPECIAL: Partial<Record<CourseId, string[]>> = {
  es: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
  de: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
};

const lexiconCache = new Map<CourseId, Set<string>>();
function lexiconFor(courseId: CourseId): Set<string> {
  let lex = lexiconCache.get(courseId);
  if (!lex) {
    const c = getCourse(courseId);
    lex = buildLexicon([...c.items.values()].flatMap((i) => [i.text, ...(i.alts ?? [])]), courseId);
    lexiconCache.set(courseId, lex);
  }
  return lex;
}

export function TypeStep({ ex, courseId, locked, onResult }: StepProps<ExerciseOf<'type'>>) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isJa = courseId === 'ja';
  const preview = isJa && value && looksLikeRomaji(value) ? toHiragana(value) : null;
  const course = getCourse(courseId);

  useEffect(() => {
    // Focus without scrolling the prompt away on small screens.
    const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), ex.mode === 'dictation' ? 600 : 150);
    return () => clearTimeout(id);
  }, [ex.key, ex.mode]);

  const result = useCallback(
    (given: string) => {
      const r = checkAnswer(given, ex.accepted, { lang: courseId, lexicon: lexiconFor(courseId) });
      onResult({
        correct: r.verdict !== 'wrong',
        almost: r.verdict === 'almost',
        issues: r.issues.filter((i) => i !== 'empty'),
        expected: <TargetText text={ex.display} courseId={courseId} romaji={ex.romaji} showRomaji={isJa} reading={ex.item?.reading} />,
        expectedSpeak: plainTarget(ex.display),
        explanation: r.verdict === 'correct' ? undefined : ex.item?.note ?? ex.sentence?.note,
      });
    },
    [ex, courseId, isJa, onResult],
  );

  const insert = (ch: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + ch + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  return (
    <div className="step">
      <p className="step__instruction">
        {ex.mode === 'dictation' ? t('ex.dictation') : isJa ? t('ex.typeTargetJa') : t('ex.typeTarget')}
        {!ex.hints && <span className="chip chip--info step__nohints">{t('ex.noHints')}</span>}
      </p>
      <div className="prompt">
        {ex.mode === 'dictation' ? (
          <AudioButton courseId={courseId} content={ex.item ?? { text: ex.prompt.audio ?? ex.display }} autoPlay size="l" />
        ) : (
          <div className="prompt__text prompt__text--pl">{ex.prompt.text}</div>
        )}
      </div>
      <form
        className="answer-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!locked && value.trim()) result(value);
        }}
      >
        <label className="visually-hidden" htmlFor={`answer-${ex.key}`}>
          {t('ex.yourAnswer')}
        </label>
        <input
          id={`answer-${ex.key}`}
          ref={inputRef}
          className="input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            activity.ping();
          }}
          onKeyDown={(e) => {
            // Japanese IMEs use Enter to confirm a conversion — never submit while composing.
            if (e.key === 'Enter' && e.nativeEvent.isComposing) e.stopPropagation();
          }}
          placeholder={isJa ? t('ex.placeholderJa') : t('ex.placeholder')}
          lang={course.speechLang}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          disabled={locked}
          data-testid="answer-input"
        />
        {preview && (
          <p className="kana-preview" lang="ja">
            → {preview}
          </p>
        )}
        {isJa && <p className="subtle">{t('ex.typeKanaTip')}</p>}
        {SPECIAL[courseId] && !locked && (
          <div className="special-chars" aria-label="Znaki specjalne">
            {SPECIAL[courseId]!.map((ch) => (
              <button key={ch} type="button" className="chip" onClick={() => insert(ch)}>
                {ch}
              </button>
            ))}
          </div>
        )}
      </form>
      <ActionBar hidden={locked}>
        <div className="row">
          <button type="button" className="btn btn--outline" onClick={() => result('')} data-testid="dont-know">
            {t('ex.dontKnow')}
          </button>
          <button type="button" className="btn btn--primary btn--lg grow" disabled={!value.trim()} onClick={() => result(value)} data-testid="check">
            {t('common.check')}
          </button>
        </div>
      </ActionBar>
    </div>
  );
}

export function OrderStep({ ex, courseId, locked, onResult }: StepProps<ExerciseOf<'order'>>) {
  const [picked, setPicked] = useState<number[]>([]);
  const speak = useSpeaker(courseId);
  const isJa = courseId === 'ja';
  const s = ex.sentence;

  const check = useCallback(() => {
    const words = picked.map((i) => ex.tiles[i]);
    const joined = isJa ? words.join('') : words.join(' ');
    const candidates = [s.text, ...(s.alts ?? [])].map((x) => normalize(x, courseId));
    const correct = candidates.includes(normalize(joined, courseId));
    onResult({
      correct,
      expected: <TargetText text={s.text} courseId={courseId} romaji={s.romaji} showRomaji={isJa} />,
      expectedSpeak: plainTarget(s.text),
      explanation: correct ? undefined : s.note,
    });
    speak({ text: s.text, tts: s.tts });
  }, [picked, ex.tiles, isJa, s, courseId, onResult, speak]);

  return (
    <div className="step">
      <p className="step__instruction">
        {t('ex.order')}
        {!ex.hints && <span className="chip chip--info step__nohints">{t('ex.noHints')}</span>}
      </p>
      <div className="prompt">
        <div className="prompt__text prompt__text--pl">{s.pl}</div>
      </div>
      <div className="order-answer" aria-live="polite" data-testid="order-answer">
        {picked.length === 0 && <span className="subtle">{t('ex.orderHint')}</span>}
        {picked.map((i, pos) => (
          <button key={`${i}-${pos}`} type="button" className="word-tile is-placed" disabled={locked} onClick={() => setPicked((p) => p.filter((_, k) => k !== pos))}>
            <TargetText text={ex.tiles[i]} courseId={courseId} />
          </button>
        ))}
      </div>
      <div className="order-bank">
        {ex.tiles.map((tile, i) => (
          <button
            key={i}
            type="button"
            className={`word-tile${picked.includes(i) ? ' is-used' : ''}`}
            disabled={locked || picked.includes(i)}
            onClick={() => {
              activity.ping();
              setPicked((p) => [...p, i]);
            }}
            data-testid={`tile-${i}`}
          >
            <TargetText text={tile} courseId={courseId} />
          </button>
        ))}
      </div>
      <CheckBar disabled={picked.length === 0} onCheck={check} locked={locked} />
    </div>
  );
}

export function MatchStep({ ex, courseId, locked, onResult }: StepProps<ExerciseOf<'match'>>) {
  const speak = useSpeaker(courseId);
  const rng = useMemo(() => createRng(ex.key), [ex.key]);
  const left = useMemo(() => shuffle(ex.pairs, rng), [ex.pairs, rng]);
  const right = useMemo(() => shuffle(ex.pairs, rng), [ex.pairs, rng]);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (!selL || !selR) return;
    if (selL === selR) {
      const pair = ex.pairs.find((p) => p.id === selL)!;
      speak(pair.left);
      const next = new Set(matched).add(selL);
      setMatched(next);
      setSelL(null);
      setSelR(null);
      if (next.size === ex.pairs.length) {
        setTimeout(() => onResult({ correct: true, almost: mistakes > 0, mistakes, expected: t('ex.matchDone') }), 350);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrong(`${selL}|${selR}`);
      setTimeout(() => {
        setWrong(null);
        setSelL(null);
        setSelR(null);
      }, 500);
    }
  }, [selL, selR]); // eslint-disable-line react-hooks/exhaustive-deps

  const cls = (side: 'l' | 'r', id: string) => {
    if (matched.has(id)) return 'match-tile is-matched';
    const sel = side === 'l' ? selL === id : selR === id;
    const isWrong = wrong && (side === 'l' ? wrong.startsWith(`${id}|`) : wrong.endsWith(`|${id}`));
    return `match-tile${sel ? ' is-selected' : ''}${isWrong ? ' is-wrong' : ''}`;
  };

  return (
    <div className="step">
      <p className="step__instruction">{t('ex.match')}</p>
      <div className="match-grid">
        <div className="match-col">
          {left.map((p) => (
            <button key={p.id} type="button" className={cls('l', p.id)} disabled={locked || matched.has(p.id)} onClick={() => setSelL(p.id)} data-testid={`match-l-${p.id}`}>
              <TargetText text={p.left} courseId={courseId} />
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((p) => (
            <button key={p.id} type="button" className={cls('r', p.id)} disabled={locked || matched.has(p.id)} onClick={() => setSelR(p.id)} data-testid={`match-r-${p.id}`}>
              {p.right}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
