/**
 * Music Lab home: the learner's songs (filters, search, progress, level), playlists, the song
 * to continue, and public-domain samples to try the mode without pasting anything.
 */
import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Heart, ListMusic, Music4, Play, Plus, Search, Sparkles } from 'lucide-react';
import { db } from '../../services/db';
import { addSample, createPlaylist, LIMITS, songMastered } from '../../services/music';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState, LangBadge, PageHeader, ProgressBar, Segmented } from '../../components/ui';
import { SAMPLES } from '../../music/samples';
import { getCourse } from '../../content/registry';
import { courseDictionary } from '../../music/vocab';
import { songDifficulty, shortLevel } from '../../music/difficulty';
import { songWords, songTokens } from '../../music/practice';
import type { CourseId } from '../../content/types';
import type { Song } from '../../music/types';
import type { SongCacheRecord } from '../../services/db';

type LangFilter = 'all' | CourseId;
type StatusFilter = 'all' | 'new' | 'started' | 'mastered';
type Sort = 'recent' | 'title' | 'progress';

function songStatus(song: Song): Exclude<StatusFilter, 'all'> {
  if (songMastered(song)) return 'mastered';
  return song.progress.sessions > 0 || Object.keys(song.progress.lines).length ? 'started' : 'new';
}

function learnedShare(song: Song): number {
  if (!song.lines.length) return 0;
  return song.lines.filter((l) => (song.progress.lines[l.id]?.correct ?? 0) > 0).length / song.lines.length;
}

/** Level label for the list (Japanese songs need their cached analysis). */
function levelLabel(song: Song, cache: SongCacheRecord | undefined): string | null {
  if (song.lang === 'ja' && !cache) return null;
  const course = getCourse(song.lang);
  const d = songDifficulty({
    lang: song.lang,
    course,
    dict: courseDictionary(course),
    words: songWords(song, songTokens(song, cache?.lines)),
    lineTexts: song.lines.map((l) => l.text),
    entries: new Map(),
    cards: new Map(),
  });
  if (!d.estimate) return null;
  return d.estimate === 'beyond' ? t('music.level.beyondShort') : `≈ ${shortLevel(d.estimate)}`;
}

export default function MusicHome() {
  const songs = useLiveQuery(() => db.songs.toArray(), []);
  const states = useLiveQuery(() => db.songState.toArray(), []);
  const caches = useLiveQuery(() => db.songCache.toArray(), []);
  const playlists = useLiveQuery(() => db.playlists.toArray(), []);
  const [tab, setTab] = useState<'songs' | 'playlists'>('songs');
  const [lang, setLang] = useState<LangFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [favorites, setFavorites] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recent');
  const [newName, setNewName] = useState('');

  const live = useMemo(() => (songs ?? []).filter((s) => !s.deletedAt), [songs]);
  const opened = useMemo(() => new Map((states ?? []).map((s) => [s.id, s])), [states]);
  const cacheOf = useMemo(() => new Map((caches ?? []).map((c) => [c.id, c])), [caches]);
  const levels = useMemo(() => new Map(live.map((s) => [s.id, levelLabel(s, cacheOf.get(s.id))])), [live, cacheOf]);
  const continueSong = useMemo(
    () => [...live].filter((s) => opened.has(s.id)).sort((a, b) => (opened.get(b.id)?.lastOpenedAt ?? 0) - (opened.get(a.id)?.lastOpenedAt ?? 0))[0],
    [live, opened],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('pl');
    const list = live.filter(
      (s) =>
        (lang === 'all' || s.lang === lang) &&
        (status === 'all' || songStatus(s) === status) &&
        (!favorites || s.favorite) &&
        (!q || s.title.toLocaleLowerCase('pl').includes(q) || s.artist.toLocaleLowerCase('pl').includes(q)),
    );
    return list.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title, 'pl');
      if (sort === 'progress') return learnedShare(b) - learnedShare(a);
      const ta = Math.max(opened.get(a.id)?.lastOpenedAt ?? 0, a.updatedAt);
      const tb = Math.max(opened.get(b.id)?.lastOpenedAt ?? 0, b.updatedAt);
      return tb - ta;
    });
  }, [live, lang, status, favorites, query, sort, opened]);

  const livePlaylists = (playlists ?? []).filter((p) => !p.deletedAt).sort((a, b) => b.updatedAt - a.updatedAt);
  const missingSamples = SAMPLES.filter((s) => !live.some((song) => song.sample?.id === s.id));

  return (
    <div className="page music-home" data-testid="music-home">
      <PageHeader
        title={t('music.title')}
        back
        fallback="/audio"
        action={
          <button type="button" className="icon-btn" onClick={() => navigate('/music/ai')} aria-label={t('music.ai.title')}>
            <Sparkles size={22} />
          </button>
        }
      />
      <p className="muted">{t('music.intro')}</p>
      <div className="row row--wrap">
        <button type="button" className="btn btn--primary" onClick={() => navigate('/music/new')} data-testid="music-add">
          <Plus size={18} /> {t('music.add')}
        </button>
      </div>

      {continueSong && (
        <button type="button" className="card card--tint music-continue" onClick={() => navigate(`/music/song/${continueSong.id}`)} data-testid="music-continue">
          <Play size={22} aria-hidden="true" />
          <span className="grow">
            <span className="eyebrow">{t('music.continue')}</span>
            <strong>{continueSong.title}</strong>
          </span>
          <LangBadge courseId={continueSong.lang} size={30} />
        </button>
      )}

      <Segmented
        label={t('music.title')}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'songs', label: t('music.tab.songs', { count: live.length }) },
          { value: 'playlists', label: t('music.tab.playlists', { count: livePlaylists.length }) },
        ]}
      />

      {tab === 'songs' && (
        <>
          {live.length > 0 && (
            <div className="stack music-filters">
              <label className="search">
                <Search size={18} aria-hidden="true" />
                <input className="input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('music.search')} aria-label={t('music.search')} />
              </label>
              <Segmented<LangFilter>
                label={t('music.filter.lang')}
                value={lang}
                onChange={setLang}
                options={[{ value: 'all', label: t('music.filter.all') }, ...(['es', 'de', 'ja'] as CourseId[]).map((c) => ({ value: c, label: getCourse(c).name }))]}
              />
              <div className="row row--wrap">
                <Segmented<StatusFilter>
                  label={t('music.filter.status')}
                  value={status}
                  onChange={setStatus}
                  options={(['all', 'new', 'started', 'mastered'] as StatusFilter[]).map((s) => ({ value: s, label: t(`music.filter.${s}`) }))}
                />
                <button type="button" className={`chip${favorites ? ' chip--active' : ''}`} aria-pressed={favorites} onClick={() => setFavorites((v) => !v)}>
                  <Heart size={14} /> {t('music.filter.favorites')}
                </button>
                <label className="music-sort">
                  <span className="subtle">{t('music.sort.label')}</span>
                  <select className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                    <option value="recent">{t('music.sort.recent')}</option>
                    <option value="title">{t('music.sort.title')}</option>
                    <option value="progress">{t('music.sort.progress')}</option>
                  </select>
                </label>
              </div>
            </div>
          )}
          {live.length === 0 ? (
            <EmptyState icon={<Music4 size={40} />} title={t('music.empty.title')} body={t('music.empty.body')} />
          ) : (
            <ul className="music-list" data-testid="music-list">
              {shown.map((s) => (
                <li key={s.id}>
                  <SongCard song={s} level={levels.get(s.id) ?? null} />
                </li>
              ))}
              {!shown.length && <p className="subtle">{t('music.filter.none')}</p>}
            </ul>
          )}
        </>
      )}

      {tab === 'playlists' && (
        <div className="stack">
          <ul className="list">
            {livePlaylists.map((p) => (
              <li key={p.id}>
                <button type="button" className="list-row" onClick={() => navigate(`/music/playlist/${p.id}`)}>
                  <ListMusic size={22} aria-hidden="true" />
                  <div className="list-row__body">
                    <div className="list-row__title">{p.name}</div>
                    <div className="list-row__desc">{t('music.playlist.count', { count: p.songIds.filter((id) => live.some((s) => s.id === id)).length })}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {!livePlaylists.length && <p className="subtle">{t('music.playlist.none')}</p>}
          <form
            className="row"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newName.trim()) return;
              const p = await createPlaylist(newName);
              setNewName('');
              navigate(`/music/playlist/${p.id}`);
            }}
          >
            <input className="input grow" value={newName} maxLength={LIMITS.playlistName} onChange={(e) => setNewName(e.target.value)} placeholder={t('music.playlist.newName')} aria-label={t('music.playlist.newName')} />
            <button type="submit" className="btn btn--outline" disabled={!newName.trim()}>
              <Plus size={18} /> {t('music.playlist.create')}
            </button>
          </form>
        </div>
      )}

      {missingSamples.length > 0 && (
        <section className="card stack music-samples" data-testid="music-samples">
          <h2 className="section-title">{t('music.sample.title')}</h2>
          <p className="muted">{t('music.sample.body')}</p>
          <div className="row row--wrap">
            {missingSamples.map((s) => (
              <button
                key={s.id}
                type="button"
                className="btn btn--outline btn--sm"
                onClick={async () => {
                  const song = await addSample(s.id);
                  navigate(`/music/song/${song.id}`);
                }}
                data-testid={`sample-${s.id}`}
              >
                <LangBadge courseId={s.lang} size={22} /> {s.title}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="card card--flat stack">
        <h2 className="section-title">{t('music.how.title')}</h2>
        <ul className="music-facts">
          <li>{t('music.how.lyrics')}</li>
          <li>{t('music.how.video')}</li>
          <li>{t('music.how.rewards')}</li>
          <li>{t('music.how.offline')}</li>
        </ul>
      </section>
    </div>
  );
}

function SongCard({ song, level }: { song: Song; level: string | null }) {
  const share = learnedShare(song);
  return (
    <button type="button" className="card music-card" onClick={() => navigate(`/music/song/${song.id}`)} data-testid={`song-card-${song.id}`}>
      <LangBadge courseId={song.lang} size={36} />
      <span className="music-card__body">
        <span className="music-card__title" lang={song.lang}>
          {song.title}
          {song.favorite && <Heart size={14} fill="currentColor" aria-label={t('music.song.favorite')} />}
        </span>
        <span className="music-card__meta">
          {song.artist || t('music.song.unknownArtist')}
          {level && <span className="chip">{level}</span>}
          {!song.videoId && <span className="chip">{t('music.song.textOnly')}</span>}
        </span>
        <ProgressBar value={share} max={1} thin label={t('music.song.learned', { share: Math.round(share * 100) })} />
      </span>
    </button>
  );
}
