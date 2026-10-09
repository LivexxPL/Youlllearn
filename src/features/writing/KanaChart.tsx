import { useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { DAKUTEN, GOJUON, YOON, type KanaCell } from '../../engine/kana';
import { getCourse } from '../../content/registry';
import { cardStatus, type Card } from '../../engine/srs';
import { useCards } from '../../state/hooks';
import { audio } from '../../services/audio';
import { activity } from '../../services/activity';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { PageHeader, Segmented } from '../../components/ui';
import { strokeCharSet } from './strokes';

type Script = 'hira' | 'kata';
type TapAction = 'listen' | 'write';

function KanaGrid({
  rows,
  script,
  cols,
  stateOf,
  onTap,
  onLongPress,
  label,
}: {
  rows: (KanaCell | null)[][];
  script: Script;
  cols: number;
  stateOf: (ch: string) => 'learning' | 'established' | null;
  onTap: (ch: string) => void;
  onLongPress: (ch: string) => void;
  label: string;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const long = useRef(false);
  return (
    <div className="kana-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="group" aria-label={label}>
      {rows.flat().map((cell, i) => {
        if (!cell) return <span key={i} className="kana-cell kana-cell--empty" aria-hidden="true" />;
        const ch = cell[script];
        const state = stateOf(ch);
        return (
          <button
            key={i}
            type="button"
            className={`kana-cell${state ? ` is-${state}` : ''}`}
            aria-label={`${ch} ${cell.romaji}${state ? `, ${t(state === 'learning' ? 'kana.stateLearning' : 'kana.stateEstablished')}` : ''}`}
            onPointerDown={() => {
              long.current = false;
              timer.current = setTimeout(() => {
                long.current = true;
                onLongPress(ch);
              }, 600);
            }}
            onPointerUp={() => timer.current && clearTimeout(timer.current)}
            onPointerLeave={() => timer.current && clearTimeout(timer.current)}
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => {
              if (!long.current) onTap(ch);
            }}
          >
            <span className="kana-cell__char" lang="ja">
              {ch}
            </span>
            <span className="kana-cell__romaji">{cell.romaji}</span>
            {state === 'learning' && <span className="kana-cell__dot" aria-hidden="true" />}
            {state === 'established' && <Check className="kana-cell__check" size={12} aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

export default function KanaChart() {
  const [script, setScript] = useState<Script>('hira');
  const [action, setAction] = useState<TapAction>('listen');
  const cards = useCards('ja');
  const byText = useMemo(() => {
    const map = new Map<string, string>();
    for (const it of getCourse('ja').items.values()) if (it.kind === 'kana') map.set(it.text, it.id);
    return map;
  }, []);
  const cardMap = useMemo(() => new Map<string, Card>((cards ?? []).map((c) => [c.id, c])), [cards]);
  const now = Date.now();

  const stateOf = (ch: string) => {
    const id = byText.get(ch);
    const card = id ? cardMap.get(id) : undefined;
    if (!card) return null;
    return cardStatus(card, now) === 'established' ? 'established' : 'learning';
  };

  const write = (ch: string) => {
    // Yōon (two characters) are practised through their first character.
    const first = [...ch][0];
    if (strokeCharSet.has(first)) navigate(`/write/${script === 'hira' ? 'hiragana' : 'katakana'}/${encodeURIComponent(first)}`);
  };
  const listen = (ch: string) => {
    activity.ping();
    audio.say('ja', { text: ch, kind: 'kana' }).catch(() => {});
  };
  const tap = (ch: string) => (action === 'listen' ? listen(ch) : write(ch));

  return (
    <div className="page">
      <PageHeader title={t('kana.title')} back fallback="/learn" />
      <p className="muted">{t('kana.tapToHear')}</p>
      <div className="row row--wrap row--between">
        <Segmented<Script>
          value={script}
          onChange={setScript}
          label={t('kana.title')}
          options={[
            { value: 'hira', label: t('write.hiragana') },
            { value: 'kata', label: t('write.katakana') },
          ]}
        />
        <Segmented<TapAction>
          value={action}
          onChange={setAction}
          label={t('kana.tapAction')}
          options={[
            { value: 'listen', label: t('kana.actionListen') },
            { value: 'write', label: t('kana.actionWrite') },
          ]}
        />
      </div>
      <p className="subtle">{t('kana.legend')}</p>
      <section className="stack stack--s" aria-labelledby="kana-basic">
        <h2 id="kana-basic" className="section-title">
          {t('kana.basic')}
        </h2>
        <KanaGrid rows={GOJUON} script={script} cols={5} stateOf={stateOf} onTap={tap} onLongPress={write} label={t('kana.basic')} />
      </section>
      <section className="stack stack--s" aria-labelledby="kana-dakuten">
        <h2 id="kana-dakuten" className="section-title">
          {t('kana.dakuten')}
        </h2>
        <KanaGrid rows={DAKUTEN} script={script} cols={5} stateOf={stateOf} onTap={tap} onLongPress={write} label={t('kana.dakuten')} />
      </section>
      <section className="stack stack--s" aria-labelledby="kana-yoon">
        <h2 id="kana-yoon" className="section-title">
          {t('kana.yoon')}
        </h2>
        <KanaGrid rows={YOON} script={script} cols={3} stateOf={stateOf} onTap={tap} onLongPress={write} label={t('kana.yoon')} />
      </section>
    </div>
  );
}
