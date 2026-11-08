/**
 * Tap-sync: the learner plays the video and taps when each line starts. Only line starts are
 * set this way; the app never guesses the timing of single words.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Minus, Play, Plus, Undo2 } from 'lucide-react';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { PageHeader, EmptyState } from '../../components/ui';
import { useToast } from '../../components/Toasts';
import { updateSong } from '../../services/music';
import { formatTime } from '../../music/lyrics';
import type { LyricLine } from '../../music/types';
import { useSongData } from './useSongData';
import { useYouTubePlayer, VideoFrame } from './VideoPlayer';
import { Timer } from 'lucide-react';
import { modalOpen } from '../../app/keys';

export default function SyncEditor({ id }: { id: string }) {
  const { song } = useSongData(id);
  const toast = useToast();
  const [times, setTimes] = useState<(number | undefined)[] | null>(null);
  const [cursor, setCursor] = useState(0);
  const { hostRef, controller, problem, retry } = useYouTubePlayer(song?.videoId ?? null);

  useEffect(() => {
    if (!song || times) return;
    // Existing times are kept in video time (with the song's delay applied).
    const initial = song.lines.map((l) => (l.start !== undefined ? Math.round((l.start + song.delay) * 100) / 100 : undefined));
    setTimes(initial);
    const first = initial.findIndex((x) => x === undefined);
    setCursor(first < 0 ? 0 : first);
  }, [song, times]);

  const tap = useCallback(() => {
    if (!times || !controller.ready) return;
    const now = Math.round(controller.time() * 100) / 100;
    setTimes((cur) => {
      const next = [...(cur ?? [])];
      next[cursor] = now;
      return next;
    });
    setCursor((c) => Math.min(c + 1, (times?.length ?? 1) - 1));
  }, [times, controller, cursor]);

  // Space or Enter marks the current line (when no field or dialog has the focus).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLButtonElement) && !modalOpen()) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tap]);

  const dirty = useMemo(() => song && times && song.lines.some((l, i) => (l.start !== undefined ? Math.round((l.start + song.delay) * 100) / 100 : undefined) !== times[i]), [song, times]);

  if (!song || !times) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (!song.videoId) {
    return (
      <div className="page">
        <PageHeader title={t('music.sync.title')} back fallback={`/music/song/${id}`} />
        <EmptyState icon={<Timer size={40} />} title={t('music.sync.noVideo')} />
      </div>
    );
  }

  const nudge = (i: number, delta: number) =>
    setTimes((cur) => {
      const next = [...(cur ?? [])];
      if (next[i] !== undefined) next[i] = Math.max(0, Math.round((next[i]! + delta) * 100) / 100);
      return next;
    });
  const undo = () => {
    const prev = Math.max(0, cursor - (times[cursor] === undefined ? 1 : 0));
    setTimes((cur) => {
      const next = [...(cur ?? [])];
      next[prev] = undefined;
      return next;
    });
    setCursor(prev);
  };
  const save = async () => {
    // Times must grow line by line; an earlier time than the line before is a mistake.
    const lines: LyricLine[] = song.lines.map((l, i) => {
      const start = times[i];
      const next: LyricLine = { ...l };
      delete next.end;
      if (start === undefined) delete next.start;
      else next.start = start;
      const moved = l.start === undefined || Math.abs(l.start + song.delay - (start ?? -1)) > 0.05;
      if (moved) delete next.words;
      return next;
    });
    const order = lines.filter((l) => l.start !== undefined).map((l) => l.start!);
    if (order.some((s, i) => i > 0 && s < order[i - 1])) {
      toast(t('music.sync.order'));
      return;
    }
    await updateSong(song.id, { lines, delay: 0 });
    toast(t('music.sync.saved'), 'success');
    navigate(`/music/song/${song.id}`, { replace: true });
  };

  return (
    <div className="page music-sync" data-testid="sync-editor">
      <PageHeader title={t('music.sync.title')} back fallback={`/music/song/${id}`} />
      <p className="muted">{t('music.sync.help')}</p>
      <div className="music-sync__video">
        <VideoFrame videoId={song.videoId} hostRef={hostRef} problem={problem} onRetry={retry} compact />
      </div>
      <div className="music-sync__bar">
        <button type="button" className="btn btn--accent btn--lg grow" onClick={tap} disabled={!controller.ready} data-testid="sync-tap">
          {t('music.sync.tap', { n: cursor + 1 })}
        </button>
        <button type="button" className="btn btn--outline" onClick={undo} aria-label={t('music.sync.undo')}>
          <Undo2 size={18} />
        </button>
      </div>
      <ol className="music-sync__lines">
        {song.lines.map((l, i) => (
          <li key={l.id} className={`music-sync__line${i === cursor ? ' is-current' : ''}`} data-testid={`sync-line-${l.id}`}>
            <button type="button" className="music-sync__pick" onClick={() => setCursor(i)} aria-current={i === cursor ? 'step' : undefined}>
              <span className="music-sync__time">{times[i] !== undefined ? formatTime(times[i]!) : '—'}</span>
              <span lang={song.lang}>{l.text}</span>
            </button>
            {times[i] !== undefined && (
              <span className="music-sync__tools">
                <button type="button" className="icon-btn" aria-label={t('music.sync.earlier')} onClick={() => nudge(i, -0.1)}>
                  <Minus size={16} />
                </button>
                <button type="button" className="icon-btn" aria-label={t('music.sync.later')} onClick={() => nudge(i, 0.1)}>
                  <Plus size={16} />
                </button>
                <button type="button" className="icon-btn" aria-label={t('music.sync.playFrom')} onClick={() => controller.seek(Math.max(0, times[i]! - 1), true)}>
                  <Play size={16} />
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="row row--wrap">
        <button type="button" className="btn btn--primary btn--lg grow" onClick={save} disabled={!dirty} data-testid="sync-save">
          <Check size={18} /> {t('common.save')}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setTimes(song.lines.map(() => undefined));
            setCursor(0);
          }}
        >
          {t('music.sync.clear')}
        </button>
      </div>
      <p className="subtle">{t('music.sync.note')}</p>
    </div>
  );
}
