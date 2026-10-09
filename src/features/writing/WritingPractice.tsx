/**
 * Free character practice (outside lessons): trace, write from memory or
 * write freely, compare with the KanjiVG model, self-assess. The drawing is
 * saved so practice can be resumed later.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, Play, Settings2, SkipForward, Volume2 } from 'lucide-react';
import { useSettings } from '../../state/settings';
import { db, type Stroke } from '../../services/db';
import { activity } from '../../services/activity';
import { addStats, applyOutcome } from '../../services/progress';
import { audio } from '../../services/audio';
import { XP } from '../../engine/gamification';
import type { SelfRating } from '../../engine/srs';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState, PageHeader, Segmented } from '../../components/ui';
import { useToast } from '../../components/Toasts';
import { WritingPad, type WritingPadHandle } from './WritingPad';
import { StrokeGuide } from './StrokeGuide';
import { compareStrokes, getStrokes, type StrokeHint } from './strokes';
import { findChar, isWriteSet, nextChar, practiceId } from './sets';
import { hintText } from '../session/WriteStep';
import { WritingSettingsSheet } from './WritingSettingsSheet';

type Mode = 'trace' | 'recall' | 'free';

export default function WritingPractice({ set, char }: { set: string; char: string }) {
  const info = isWriteSet(set) ? findChar(set, char) : undefined;
  const [initial, setInitial] = useState<Stroke[] | null>(null);

  useEffect(() => {
    let alive = true;
    setInitial(null);
    db.drawings.get(practiceId(char)).then((d) => alive && setInitial(d?.strokes ?? []));
    return () => {
      alive = false;
    };
  }, [char]);

  if (!info || !isWriteSet(set)) {
    return (
      <div className="page">
        <PageHeader title={t('write.title')} back fallback="/write" />
        <EmptyState icon={<span className="ja" style={{ fontSize: 40 }}>{char}</span>} title={t('write.noStrokeData')} />
      </div>
    );
  }
  if (!initial) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  // Re-mount the pad per character so its undo history starts fresh.
  return <Practice key={char} set={set} char={char} initial={initial} />;
}

function Practice({ set, char, initial }: { set: 'hiragana' | 'katakana' | 'kanji'; char: string; initial: Stroke[] }) {
  const { settings, update } = useSettings();
  const toast = useToast();
  const info = findChar(set, char)!;
  const pad = useRef<WritingPadHandle>(null);
  const [mode, setMode] = useState<Mode>('trace');
  const [strokes, setStrokes] = useState<Stroke[]>(initial);
  const [replay, setReplay] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [grid, setGrid] = useState(true);
  const [compared, setCompared] = useState<{ hints: StrokeHint[]; countOk: boolean; expected: number } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback(() => {
    activity.ping();
    const it = info.item;
    audio.say('ja', it ? { text: it.text, reading: it.reading?.split('・')[0], kind: it.kind } : char).catch(() => {});
  }, [info, char]);

  useEffect(() => {
    activity.start('writing', 'ja');
    const id = setTimeout(say, 300);
    return () => {
      clearTimeout(id);
      activity.stop();
      audio.stop();
    };
  }, [say]);

  // Autosave (debounced) so practice can be resumed.
  const onChange = (next: Stroke[]) => {
    setStrokes(next);
    setCompared(null);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      db.drawings.put({ id: practiceId(char), kind: 'practice', strokes: next, updatedAt: Date.now(), title: char }).catch(() => toast(t('error.storage')));
    }, 600);
  };
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  const compare = async () => {
    const model = await getStrokes(char);
    if (!model) return;
    setCompared({ ...compareStrokes(strokes, model), expected: model.length });
  };

  const rate = async (r: SelfRating) => {
    await addStats({ writing: 1, exercises: 1, correct: r === 'again' ? 0 : 1, xp: r === 'again' ? 0 : XP.correctRetry }, 'ja');
    if (info.item) await applyOutcome('ja', info.item.id, { correct: r !== 'again', skill: 'writing', selfRating: r });
    toast(r === 'again' ? t('write.ratedAgain') : t('write.rated'), r === 'again' ? 'default' : 'success');
    pad.current?.clear();
    setCompared(null);
  };

  const guideMode = compared ? 'numbers' : mode === 'trace' ? 'faint' : 'animate';
  const showUnderlay = compared !== null || mode === 'trace' || showOrder;

  return (
    <div className={`page write-practice${settings.stylusMode ? ' write-practice--stylus' : ''}`}>
      <PageHeader
        title={t(`write.${set}`)}
        back
        fallback="/write"
        action={
          <button type="button" className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label={t('write.settings')}>
            <Settings2 size={22} />
          </button>
        }
      />
      <div className="write-practice__head">
        <span className="write-practice__char" lang="ja" aria-hidden={mode !== 'trace'}>
          {mode === 'trace' ? char : '？'}
        </span>
        <div className="stack stack--xs">
          <span className="write-practice__romaji">{info.romaji}</span>
          {info.meaning && <span className="muted">{info.meaning}</span>}
          {info.item?.on?.length ? <span className="subtle" lang="ja">{t('write.onReading', { on: info.item.on.join('、') })}</span> : null}
          {info.item?.kun?.length ? <span className="subtle" lang="ja">{t('write.kunReading', { kun: info.item.kun.join('、') })}</span> : null}
        </div>
        <button type="button" className="icon-btn" onClick={say} aria-label={t('common.play')}>
          <Volume2 size={22} />
        </button>
      </div>

      <Segmented<Mode>
        value={mode}
        onChange={(m) => {
          setMode(m);
          setShowOrder(false);
          setCompared(null);
        }}
        label={t('write.modeLabel')}
        options={[
          { value: 'trace', label: t('write.trace') },
          { value: 'recall', label: t('write.recall') },
          { value: 'free', label: t('write.free') },
        ]}
      />
      {mode === 'free' && <p className="subtle">{t('write.freeHint')}</p>}

      <WritingPad
        ref={pad}
        initial={initial}
        onChange={onChange}
        penOnly={settings.penOnly}
        brushSize={settings.brushSize}
        onBrushSize={(s) => update({ brushSize: s })}
        leftHanded={settings.leftHanded}
        stylusMode={settings.stylusMode}
        showGridToggle
        grid={grid}
        onGrid={setGrid}
        underlay={showUnderlay ? <StrokeGuide char={char} mode={guideMode} replayKey={replay} /> : undefined}
        overlay={compared ? <StrokeGuide char={char} mode="solid" /> : undefined}
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
        {mode !== 'trace' && (
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
        </div>
      )}

      <div className="stack stack--s">
        {!compared && (
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={compare} disabled={!strokes.length} data-testid="write-compare">
            {t('write.check')}
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--block" onClick={() => navigate(`/write/${set}/${encodeURIComponent(nextChar(set, char))}`, { replace: true })} data-testid="write-next">
          <SkipForward size={18} /> {t('write.next')}
        </button>
      </div>

      <WritingSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
