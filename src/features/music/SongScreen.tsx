/**
 * One song: the YouTube player, interactive lyrics in sync with it, words, grammar and
 * difficulty. Playing the video earns nothing by itself; learning happens through the words,
 * notes and the practice session (MusicPracticeScreen).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  BookOpen,
  Dumbbell,
  Edit3,
  Heart,
  ListMusic,
  MicVocal,
  Pause,
  Play,
  Repeat,
  Timer,
  Trash2,
  Video,
} from 'lucide-react';
import { db } from '../../services/db';
import { deleteSong, saveSongPosition, updateSong } from '../../services/music';
import { activeLineIndex, activeWordIndex, lineEnd, timingKind } from '../../music/lyrics';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState, PageHeader, Sheet, Segmented, Switch, ProgressBar } from '../../components/ui';
import { activity } from '../../services/activity';
import { useSettings } from '../../state/settings';
import { useAudioStatus } from '../../state/hooks';
import { getCourse } from '../../content/registry';
import { audio } from '../../services/audio';
import { useYouTubePlayer, VideoFrame, type PlayerController } from './VideoPlayer';
import { KaraokeView, LyricsList, type LyricsDisplay, type WordTap } from './LyricsView';
import { LineSheet, WordSheet } from './SongSheets';
import { useSongData } from './useSongData';
import { WordsTab, GrammarTab, AboutTab } from './SongTabs';
import { PlaylistPicker } from './PlaylistPicker';
import { wordEntryId } from '../../music/vocab';
import type { WordStatus } from '../../music/types';

type Tab = 'lyrics' | 'words' | 'grammar' | 'about';
const VIEW_KEY = 'pq.music.view';

function loadView(defaults: LyricsDisplay & { karaoke: boolean }) {
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<typeof defaults>) } : defaults;
  } catch {
    return defaults;
  }
}

export default function SongScreen({ id }: { id: string }) {
  const data = useSongData(id);
  const { song } = data;
  if (song === undefined) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (song === null) {
    return (
      <div className="page">
        <PageHeader title={t('music.title')} back fallback="/music" />
        <EmptyState icon={<ListMusic size={40} />} title={t('music.song.missing')} action={<button type="button" className="btn btn--primary" onClick={() => navigate('/music', { replace: true })}>{t('music.library')}</button>} />
      </div>
    );
  }
  return <SongView data={data} />;
}

function SongView({ data }: { data: ReturnType<typeof useSongData> }) {
  const song = data.song!;
  const { settings } = useSettings();
  const [tab, setTab] = useState<Tab>('lyrics');
  const [view, setView] = useState(() => loadView({ furigana: settings.furigana, reading: false, romaji: settings.romaji !== 'never', translation: true, karaoke: false }));
  const [active, setActive] = useState(-1);
  const [wordIdx, setWordIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [loopLine, setLoopLine] = useState<string | null>(null);
  const [wordTap, setWordTap] = useState<WordTap | null>(null);
  const [lineSheet, setLineSheet] = useState<string | null>(null);
  const [menu, setMenu] = useState<'playlists' | 'delete' | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);
  const timed = timingKind(song.lines) !== 'none';
  const ttsStatus = useAudioStatus(getCourse(song.lang).speechLang);
  const songRef = useRef(song);
  useEffect(() => {
    songRef.current = song;
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, JSON.stringify(view));
    } catch {
      // Private mode: the display choice is not remembered.
    }
  }, [view]);

  // Resume where the learner stopped on this device; mark the song as opened.
  useEffect(() => {
    let cancelled = false;
    db.songState.get(song.id).then((s) => {
      if (cancelled) return;
      const position = s?.position ?? 0;
      setStartAt(position);
      saveSongPosition(song.id, position).catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [song.id]);

  useEffect(() => {
    activity.start('music', song.lang);
    return () => activity.stop();
  }, [song.lang]);

  const loopRef = useRef<string | null>(null);
  const viewRef = useRef(view);
  const playerRef = useRef<PlayerController | null>(null);
  useEffect(() => {
    loopRef.current = loopLine;
    viewRef.current = view;
  });

  /** Last time reported by the player: the player is already gone when the screen unmounts. */
  const lastTime = useRef<number | null>(null);
  const onTime = useCallback((videoTime: number) => {
    lastTime.current = videoTime;
    const s = songRef.current;
    const time = videoTime - s.delay;
    const idx = activeLineIndex(s.lines, time);
    setActive(idx);
    const line = s.lines[idx];
    setWordIdx(line?.words ? activeWordIndex(line, time) : -1);
    if (viewRef.current.karaoke && line?.start !== undefined) {
      const end = lineEnd(s.lines, idx) ?? line.start + 4;
      setProgress((time - line.start) / Math.max(0.5, end - line.start));
    }
    const loopId = loopRef.current;
    if (loopId) {
      const li = s.lines.findIndex((l) => l.id === loopId);
      const start = s.lines[li]?.start;
      const end = lineEnd(s.lines, li);
      if (start !== undefined && end !== undefined && time >= end - 0.05) playerRef.current?.seek(start + s.delay, true);
    }
  }, []);

  const { hostRef, controller, problem, retry } = useYouTubePlayer(startAt !== null ? song.videoId : null, { start: startAt ?? 0, onTime });
  useEffect(() => {
    playerRef.current = controller;
  });
  const canPlayVideo = Boolean(song.videoId) && controller.ready && !problem;

  // Remember the position while playing and when leaving.
  useEffect(() => {
    if (!controller.playing) return;
    const id = setInterval(() => {
      if (lastTime.current !== null) saveSongPosition(song.id, lastTime.current).catch(() => {});
    }, 10_000);
    return () => clearInterval(id);
  }, [controller.playing, song.id]);
  useEffect(() => {
    const save = () => {
      if (lastTime.current !== null) saveSongPosition(song.id, lastTime.current).catch(() => {});
    };
    window.addEventListener('pagehide', save);
    return () => {
      window.removeEventListener('pagehide', save);
      save();
    };
  }, [song.id]);

  const statusOf = useCallback((key: string): WordStatus | undefined => data.entries.get(wordEntryId(songRef.current.lang, key))?.status, [data.entries]);
  const onWord = useCallback((tap: WordTap) => {
    activity.ping();
    setWordTap(tap);
  }, []);
  const onLine = useCallback((lineId: string) => {
    activity.ping();
    setLineSheet(lineId);
  }, []);
  const playLine = useCallback((lineId: string) => {
    activity.ping();
    const s = songRef.current;
    const line = s.lines.find((l) => l.id === lineId);
    if (!line) return;
    if (s.videoId && playerRef.current?.ready && line.start !== undefined) playerRef.current.seek(line.start + s.delay, true);
    else audio.say(s.lang, line.text).catch(() => {});
  }, []);
  const onSeek = useCallback(
    (index: number) => {
      const line = songRef.current.lines[index];
      if (line) playLine(line.id);
    },
    [playLine],
  );
  const toggleLoop = useCallback((lineId: string) => {
    activity.ping();
    setLoopLine((cur) => (cur === lineId ? null : lineId));
  }, []);

  const display = useMemo<LyricsDisplay>(() => ({ furigana: view.furigana, reading: view.reading, romaji: view.romaji, translation: view.translation }), [view.furigana, view.reading, view.romaji, view.translation]);
  const setOption = (k: keyof typeof view, v: boolean) => {
    activity.ping();
    setView((cur) => ({ ...cur, [k]: v }));
  };
  const playlists = useLiveQuery(() => db.playlists.toArray(), []);
  const inPlaylists = (playlists ?? []).filter((p) => !p.deletedAt && p.songIds.includes(song.id)).length;
  const learnedLines = song.lines.filter((l) => (song.progress.lines[l.id]?.correct ?? 0) > 0).length;

  return (
    <div className="page music-song" data-testid="song-screen">
      <PageHeader
        title={song.title}
        back
        fallback="/music"
        action={
          <button type="button" className="icon-btn" aria-pressed={song.favorite} aria-label={t('music.song.favorite')} onClick={() => updateSong(song.id, { favorite: !song.favorite })} data-testid="song-favorite">
            <Heart size={22} fill={song.favorite ? 'currentColor' : 'none'} />
          </button>
        }
      />
      <p className="muted music-song__artist">
        {song.artist || t('music.song.unknownArtist')} · {getCourse(song.lang).name}
        {song.sample && <span className="chip chip--success music-song__pd">{t('music.sample.chip')}</span>}
      </p>

      <div className="music-song__layout">
        <div className="music-song__media">
          {song.videoId ? (
            <VideoFrame videoId={song.videoId} hostRef={hostRef} problem={problem} onRetry={retry} />
          ) : (
            <div className="card card--tint music-song__novideo">
              <Video size={22} aria-hidden="true" />
              <p>{t('music.song.noVideo')}</p>
              <button type="button" className="btn btn--sm btn--outline" onClick={() => navigate(`/music/song/${song.id}/edit`)}>
                {t('music.song.addVideo')}
              </button>
            </div>
          )}
          {song.videoId && (
            <div className="music-controls" role="group" aria-label={t('music.controls.label')}>
              <button type="button" className="btn btn--primary btn--sm" disabled={!canPlayVideo} onClick={() => (controller.playing ? controller.pause() : controller.play())} data-testid="player-toggle">
                {controller.playing ? <Pause size={18} /> : <Play size={18} />} {controller.playing ? t('music.controls.pause') : t('music.controls.play')}
              </button>
              <Segmented
                label={t('music.controls.speed')}
                value={controller.rate}
                onChange={(r) => controller.setRate(r)}
                options={[0.5, 0.75, 1].filter((r) => controller.rates.includes(r)).map((r) => ({ value: r, label: `${r}×` }))}
              />
              {timed && (
                <button
                  type="button"
                  className={`btn btn--sm ${loopLine ? 'btn--accent' : 'btn--outline'}`}
                  aria-pressed={Boolean(loopLine)}
                  disabled={!canPlayVideo || (!loopLine && active < 0)}
                  onClick={() => toggleLoop(loopLine ?? song.lines[active].id)}
                  data-testid="loop-toggle"
                >
                  <Repeat size={16} /> {t('music.controls.loop')}
                </button>
              )}
              {!timed && (
                <button type="button" className="btn btn--sm btn--outline" onClick={() => navigate(`/music/song/${song.id}/sync`)}>
                  <Timer size={16} /> {t('music.controls.sync')}
                </button>
              )}
            </div>
          )}
          {!timed && song.videoId && <p className="subtle">{t('music.song.notTimed')}</p>}
        </div>

        <div className="music-song__main">
          <div className="music-song__progress">
            <ProgressBar value={learnedLines} max={song.lines.length || 1} thin label={t('music.song.progress', { done: learnedLines, total: song.lines.length })} />
            <span className="subtle">{t('music.song.progress', { done: learnedLines, total: song.lines.length })}</span>
          </div>
          <div className="row row--wrap music-song__actions">
            <button type="button" className="btn btn--accent" onClick={() => navigate(`/music/song/${song.id}/practice`)} data-testid="song-practice" disabled={song.lang === 'ja' && data.analysis.status !== 'ready'}>
              <Dumbbell size={18} /> {t('music.song.practice')}
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setMenu('playlists')}>
              <ListMusic size={16} /> {inPlaylists ? t('music.song.inPlaylists', { count: inPlaylists }) : t('music.song.toPlaylist')}
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate(`/music/song/${song.id}/edit`)}>
              <Edit3 size={16} /> {t('music.song.edit')}
            </button>
          </div>

          <Segmented<Tab>
            label={t('music.song.sections')}
            value={tab}
            onChange={setTab}
            options={(['lyrics', 'words', 'grammar', 'about'] as Tab[]).map((k) => ({ value: k, label: t(`music.tab.${k}`) }))}
          />

          {song.lang === 'ja' && <AnalysisBanner state={data.analysis} onRetry={data.retryAnalysis} />}

          {tab === 'lyrics' && (
            <>
              <div className="music-view" role="group" aria-label={t('music.view.label')}>
                {song.lang === 'ja' && (
                  <>
                    <label className="toggle-chip">
                      <Switch checked={view.furigana} onChange={(v) => setOption('furigana', v)} label={t('music.view.furigana')} />
                      <span>{t('music.view.furigana')}</span>
                    </label>
                    <label className="toggle-chip">
                      <Switch checked={view.reading} onChange={(v) => setOption('reading', v)} label={t('music.view.reading')} />
                      <span>{t('music.view.reading')}</span>
                    </label>
                    <label className="toggle-chip">
                      <Switch checked={view.romaji} onChange={(v) => setOption('romaji', v)} label={t('music.view.romaji')} />
                      <span>{t('music.view.romaji')}</span>
                    </label>
                  </>
                )}
                <label className="toggle-chip">
                  <Switch checked={view.translation} onChange={(v) => setOption('translation', v)} label={t('music.view.translation')} />
                  <span>{t('music.view.translation')}</span>
                </label>
                {timed && song.videoId && (
                  <label className="toggle-chip">
                    <Switch checked={view.karaoke} onChange={(v) => setOption('karaoke', v)} label={t('music.view.karaoke')} />
                    <span>
                      <MicVocal size={14} /> {t('music.view.karaoke')}
                    </span>
                  </label>
                )}
              </div>
              {view.karaoke && timed && song.videoId ? (
                <KaraokeView song={song} active={active} wordIndex={wordIdx} progress={progress} tokens={data.tokens} display={display} />
              ) : (
                <LyricsList song={song} lang={song.lang} active={active} tokens={data.tokens} display={display} timed={timed && Boolean(song.videoId)} statusOf={statusOf} onWord={onWord} onLine={onLine} onSeek={onSeek} />
              )}
              {timingKind(song.lines) === 'word' && <p className="subtle">{t('music.song.wordTiming')}</p>}
              {song.sample && <p className="subtle">{song.sample.source}</p>}
            </>
          )}
          {tab === 'words' && <WordsTab song={song} words={data.words} entries={data.entries} analysis={data.analysis.status} onOpen={onWord} />}
          {tab === 'grammar' && <GrammarTab song={song} tokens={data.tokens} learnerRank={data.learnerRank} onLine={onLine} />}
          {tab === 'about' && <AboutTab song={song} words={data.words} tokens={data.tokens} entries={data.entries} ttsOk={ttsStatus !== 'unsupported'} onDelete={() => setMenu('delete')} />}
        </div>
      </div>

      <WordSheet song={song} tap={wordTap} tokens={data.tokens} entries={data.entries} onClose={() => setWordTap(null)} />
      <LineSheet
        song={song}
        lineId={lineSheet}
        tokens={data.tokens}
        learnerRank={data.learnerRank}
        canPlay={canPlayVideo && timed}
        looping={Boolean(lineSheet && loopLine === lineSheet)}
        onPlay={playLine}
        onLoop={toggleLoop}
        onClose={() => setLineSheet(null)}
      />
      <Sheet open={menu === 'playlists'} onClose={() => setMenu(null)} title={t('music.playlist.addTitle')}>
        <PlaylistPicker songId={song.id} />
      </Sheet>
      <Sheet open={menu === 'delete'} onClose={() => setMenu(null)} title={t('music.song.deleteTitle')}>
        <p className="muted">{t('music.song.deleteBody')}</p>
        <div className="stack" style={{ marginTop: 'var(--sp-4)' }}>
          <button
            type="button"
            className="btn btn--danger"
            onClick={async () => {
              await deleteSong(song.id);
              navigate('/music', { replace: true });
            }}
            data-testid="song-delete-confirm"
          >
            <Trash2 size={18} /> {t('music.song.delete')}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => setMenu(null)}>
            {t('common.cancel')}
          </button>
        </div>
      </Sheet>
      <p className="subtle music-song__footer">
        <BookOpen size={14} /> {t('music.song.footer')}
      </p>
    </div>
  );
}

function AnalysisBanner({ state, onRetry }: { state: ReturnType<typeof useSongData>['analysis']; onRetry: () => void }) {
  if (state.status === 'ready' || state.status === 'none') return null;
  if (state.status === 'loading') {
    return (
      <div className="banner" role="status" data-testid="analysis-loading">
        <div className="grow">
          <p>{t('music.analysis.loading')}</p>
          <ProgressBar value={state.progress} max={1} thin label={t('music.analysis.loading')} />
          <p className="subtle">{t('music.analysis.size')}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="banner banner--warn" role="alert" data-testid="analysis-error">
      <div className="grow">
        <p>{t(`music.analysis.error.${state.code}`)}</p>
        {state.code !== 'unsupported' && (
          <button type="button" className="btn btn--sm btn--outline" onClick={onRetry}>
            {t('common.retry')}
          </button>
        )}
      </div>
    </div>
  );
}
