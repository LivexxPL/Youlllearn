import { useEffect, useRef, useState } from 'react';
import { BookOpen, Brain, Eye, EyeOff, Flag, Lightbulb, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import type { StepProps, ExerciseOf } from './types';
import { ActionBar } from './ActionBar';
import { t } from '../../i18n';
import { TargetText, RichText } from '../../components/TargetText';
import { AudioButton, SpeakIcon, useSpeaker } from '../../components/AudioButton';
import { useSettings } from '../../state/settings';
import { gloss, itemRomaji } from '../../content/text';
import { getCourse } from '../../content/registry';
import type { CourseId, Dialogue, GrammarTable } from '../../content/types';
import { audio } from '../../services/audio';
import { activity } from '../../services/activity';
import { useAudioPlaying } from '../../state/hooks';

function ContinueBar({ onContinue, label, locked }: { onContinue: () => void; label?: string; locked: boolean }) {
  return (
    <ActionBar hidden={locked}>
      <button type="button" className="btn btn--primary btn--lg btn--block" onClick={onContinue} data-testid="step-continue">
        {label ?? t('common.continue')}
      </button>
    </ActionBar>
  );
}

const INFO_ICONS = {
  objective: <Flag size={28} />,
  warmup: <Sparkles size={28} />,
  retrieval: <Brain size={28} />,
  retry: <RotateCcw size={28} />,
  intro: <Lightbulb size={28} />,
};

export function InfoStep({ ex, courseId, locked, onContinue }: StepProps<ExerciseOf<'info'>>) {
  const lesson = ex.lesson;
  return (
    <div className="step step--center">
      <div className={`info-icon info-icon--${ex.variant}`}>{INFO_ICONS[ex.variant]}</div>
      {ex.variant === 'objective' && <p className="eyebrow">{t('lesson.objectiveTitle')}</p>}
      <h1 className="step__title">{ex.title}</h1>
      {lesson?.subtitle && ex.variant === 'objective' && (
        <p className="target-text">
          <TargetText text={lesson.subtitle} courseId={courseId} />
        </p>
      )}
      <div className="stack stack--s step__body">
        {ex.body.map((p, i) => (
          <p key={i} className={ex.variant === 'objective' ? 'step__lead' : undefined}>
            <RichText text={p} courseId={courseId} />
          </p>
        ))}
      </div>
      {lesson && ex.variant === 'objective' && (
        <p className="subtle">{t('lesson.objectiveMeta', { items: t('unit.items', { count: lesson.items.length }), min: lesson.minutes })}</p>
      )}
      <ContinueBar onContinue={onContinue} locked={locked} label={ex.variant === 'objective' ? t('common.start') : undefined} />
    </div>
  );
}

function GenderTag({ courseId, gender }: { courseId: CourseId; gender?: string }) {
  if (!gender) return null;
  const labels: Record<string, string> = { m: 'rodzaj męski', f: 'rodzaj żeński', n: 'rodzaj nijaki', pl: 'liczba mnoga' };
  return <span className={`gender gender--${courseId}-${gender}`}>{labels[gender]}</span>;
}

export function IntroStep({ ex, courseId, locked, showRomaji, onContinue }: StepProps<ExerciseOf<'intro'>>) {
  const { settings } = useSettings();
  const it = ex.item;
  const isKana = it.kind === 'kana';
  return (
    <div className="step step--center">
      <span className="chip chip--accent">{t('lesson.newItem')}</span>
      <div className={`intro-target${isKana || it.kind === 'kanji' ? ' intro-target--char' : ''}`}>
        <TargetText text={it.text} courseId={courseId} romaji={itemRomaji(it)} showRomaji={!isKana && showRomaji} reading={it.reading} />
      </div>
      {isKana && <div className="intro-romaji">{it.romaji}</div>}
      <AudioButton courseId={courseId} content={it} autoPlay={settings.autoplayAudio} size="l" />
      {!isKana && <p className="intro-meaning">{gloss(it)}</p>}
      <div className="row row--wrap" style={{ justifyContent: 'center' }}>
        <GenderTag courseId={courseId} gender={it.gender} />
        {it.plural && <span className="chip">l. mn.: {it.plural}</span>}
      </div>
      {it.kind === 'kanji' && (
        <div className="kanji-info">
          {it.on?.length ? (
            <div>
              <span className="eyebrow">on</span> <span lang="ja">{it.on.join('、')}</span>
            </div>
          ) : null}
          {it.kun?.length ? (
            <div>
              <span className="eyebrow">kun</span> <span lang="ja">{it.kun.join('、')}</span>
            </div>
          ) : null}
          <ul className="kanji-words">
            {it.words?.map((w) => (
              <li key={w.text}>
                <TargetText text={w.text} courseId={courseId} /> — {w.pl}
                <SpeakIcon courseId={courseId} content={w.text} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {it.note && <p className="note">{it.note}</p>}
      {it.tip && (
        <p className="note note--tip">
          <Lightbulb size={16} /> {it.tip}
        </p>
      )}
      <p className="subtle">{t('lesson.listenAndRepeat')}</p>
      <ContinueBar onContinue={onContinue} locked={locked} />
    </div>
  );
}

function Table({ table, courseId }: { table: GrammarTable; courseId: CourseId }) {
  const lang = getCourse(courseId).speechLang;
  const wrap = useRef<HTMLDivElement>(null);
  // On phones wide tables scroll sideways; say so, or the last columns look missing.
  const [overflow, setOverflow] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 1);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [table]);
  return (
    <div className="table-block">
      <div
        ref={wrap}
        className={`table-wrap${overflow ? ' is-scrollable' : ''}`}
        tabIndex={overflow ? 0 : undefined}
        role={overflow ? 'region' : undefined}
        aria-label={overflow ? t('lesson.tableScrollLabel') : undefined}
      >
        <table className="grammar-table">
          {table.caption && <caption>{table.caption}</caption>}
          <thead>
            <tr>
              {table.head.map((h, i) => (
                <th key={i} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} lang={c > 0 ? lang : undefined} className={courseId === 'ja' ? 'ja' : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {overflow && <p className="subtle table-hint">{t('lesson.tableScrollHint')}</p>}
    </div>
  );
}

export function GrammarStep({ ex, courseId, locked, showRomaji, onContinue }: StepProps<ExerciseOf<'grammar'>>) {
  const n = ex.note;
  return (
    <div className="step">
      <div className="row">
        <BookOpen size={22} style={{ color: 'var(--primary)' }} />
        <p className="eyebrow">{t('lesson.grammarTitle')}</p>
      </div>
      <h1 className="step__title">{n.title}</h1>
      <div className="stack stack--s">
        {n.body.map((p, i) => (
          <p key={i}>
            <RichText text={p} courseId={courseId} />
          </p>
        ))}
      </div>
      {n.table && <Table table={n.table} courseId={courseId} />}
      {n.examples?.length ? (
        <ul className="list">
          {n.examples.map((s) => (
            <li key={s.id} className="list-row">
              <div className="list-row__body">
                <div className="list-row__title">
                  <TargetText text={s.text} courseId={courseId} romaji={s.romaji} showRomaji={showRomaji} />
                </div>
                <div className="list-row__desc">
                  {s.pl}
                  {s.note ? ` · ${s.note}` : ''}
                </div>
              </div>
              <SpeakIcon courseId={courseId} content={{ text: s.text, tts: s.tts }} />
            </li>
          ))}
        </ul>
      ) : null}
      {n.contrast && (
        <aside className="contrast">
          <strong>{t('lesson.polishContrast')}</strong>
          <p>{n.contrast}</p>
        </aside>
      )}
      <ContinueBar onContinue={onContinue} locked={locked} />
    </div>
  );
}

export function ExamplesStep({ ex, courseId, locked, showRomaji, onContinue }: StepProps<ExerciseOf<'examples'>>) {
  const speak = useSpeaker(courseId);
  return (
    <div className="step">
      <p className="eyebrow">{t('lesson.examplesTitle')}</p>
      <h1 className="step__title">{t('lesson.examplesTitle')}</h1>
      <p className="subtle">{t('lesson.examplesHint')}</p>
      <ul className="example-list">
        {ex.sentences.map((s) => (
          <li key={s.id}>
            <button type="button" className="example" onClick={() => speak({ text: s.text, tts: s.tts }, 'normal', { accent: s.accent })}>
              <span className="example__text">
                <TargetText text={s.text} courseId={courseId} romaji={s.romaji} showRomaji={showRomaji} />
              </span>
              <span className="example__pl">{s.pl}</span>
              {s.note && <span className="example__note">{s.note}</span>}
            </button>
          </li>
        ))}
      </ul>
      <ContinueBar onContinue={onContinue} locked={locked} />
    </div>
  );
}

/** Plays dialogue lines in sequence with per-speaker voices; returns controls. */
export function useDialoguePlayer(courseId: CourseId, dialogue: { lines: { speaker?: string; text: string }[]; speakers?: Dialogue['speakers'] }, stage?: 1 | 2 | 3) {
  const speak = useSpeaker(courseId);
  const [current, setCurrent] = useState(-1);
  /** Id of the current playback run: starting a new one (tapping a line) ends the old loop. */
  const run = useRef(0);
  const playing = useAudioPlaying();

  const playFrom = async (start = 0) => {
    const id = ++run.current;
    audio.stop();
    activity.setListening(true);
    for (let i = start; i < dialogue.lines.length; i++) {
      setCurrent(i);
      const line = dialogue.lines[i];
      const sp = line.speaker ? dialogue.speakers?.[line.speaker] : undefined;
      await speak(line.text, 'normal', { slot: sp?.voice ?? (i % 2 === 0 ? 'a' : 'b'), accent: sp?.accent, stage });
      if (run.current !== id) return;
      await new Promise((r) => setTimeout(r, 450));
      if (run.current !== id) return;
    }
    activity.setListening(false);
    setCurrent(-1);
  };

  const stop = () => {
    run.current += 1;
    audio.stop();
    activity.setListening(false);
    setCurrent(-1);
  };

  useEffect(() => () => stop(), []);

  return { current, playFrom, stop, playing };
}

export function AccentLabel({ courseId, accent }: { courseId: CourseId; accent?: string }) {
  const course = getCourse(courseId);
  if (!accent || course.accents.length < 2) return null;
  const info = course.accents.find((a) => a.id === accent);
  const resolved = audio.resolve(accent, 'a', true);
  return (
    <span className="accent-label">
      {t('audio.accent', { accent: `${info?.label ?? accent} (${accent})` })}
      {resolved.voice && !resolved.exact && <span className="subtle"> — {t('audio.accentFallback', { voice: resolved.voice.name })}</span>}
    </span>
  );
}

export function DialogueStep({ ex, courseId, locked, showRomaji, onContinue }: StepProps<ExerciseOf<'dialogue'>>) {
  const d = ex.dialogue;
  const [showText, setShowText] = useState(false);
  const player = useDialoguePlayer(courseId, d);
  const isPlaying = player.current >= 0;
  return (
    <div className="step">
      <p className="eyebrow">{t('lesson.dialogueTitle')}</p>
      <h1 className="step__title">{d.title}</h1>
      <p className="muted">{d.context}</p>
      <p className="subtle">{t('lesson.dialogueHint')}</p>
      <div className="row row--wrap">
        <button type="button" className="btn btn--primary" onClick={() => (isPlaying ? player.stop() : player.playFrom(0))} data-testid="dialogue-play">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />} {isPlaying ? t('common.pause') : t('lesson.dialoguePlayAll')}
        </button>
        <button type="button" className="btn btn--outline" onClick={() => setShowText((v) => !v)} aria-pressed={showText}>
          {showText ? <EyeOff size={18} /> : <Eye size={18} />} {showText ? t('common.hideTranscript') : t('common.showTranscript')}
        </button>
      </div>
      <ul className="dialogue">
        {d.lines.map((line, i) => {
          const sp = d.speakers[line.speaker];
          return (
            <li key={i} className={`dialogue__line dialogue__line--${sp.voice}${player.current === i ? ' is-current' : ''}`}>
              <div className="dialogue__speaker">
                {sp.name} <AccentLabel courseId={courseId} accent={sp.accent} />
              </div>
              {showText ? (
                <button type="button" className="dialogue__bubble" onClick={() => player.playFrom(i)}>
                  <TargetText text={line.text} courseId={courseId} romaji={line.romaji} showRomaji={showRomaji} />
                  <span className="dialogue__pl">{line.pl}</span>
                </button>
              ) : (
                <button type="button" className="dialogue__bubble dialogue__bubble--hidden" onClick={() => player.playFrom(i)} aria-label={`${sp.name}: ${t('common.play')}`}>
                  <span className="dialogue__wave" aria-hidden="true">
                    ▮▮▮▮▮▮
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <ContinueBar
        onContinue={() => {
          player.stop();
          onContinue();
        }}
        locked={locked}
      />
    </div>
  );
}
