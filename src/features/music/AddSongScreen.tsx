/**
 * Adding or editing a song: a YouTube link (optional), the lyrics the learner provides
 * (pasted or from an .lrc/.srt/.vtt/.txt file), an optional line-by-line translation.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, FileUp, Info, Link2, Search, ShieldCheck, Video } from 'lucide-react';
import { db } from '../../services/db';
import { createSong, updateSong, cleanLines, LIMITS } from '../../services/music';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { Banner, PageHeader, Segmented } from '../../components/ui';
import { useToast } from '../../components/Toasts';
import { useSettings } from '../../state/settings';
import { getCourse } from '../../content/registry';
import { applyTranslation, detectFormat, parseLyrics, reconcileLines, timingKind, toLrc } from '../../music/lyrics';
import { parseYouTubeUrl, searchUrl, watchUrl } from '../../music/youtube';
import { hasJapanese } from '../../engine/kana';
import type { CourseId } from '../../content/types';
import type { Song } from '../../music/types';
import { useYouTubePlayer, VideoFrame } from './VideoPlayer';

const FILE_MAX = 512 * 1024;

function lyricsText(song: Song): string {
  if (timingKind(song.lines) !== 'none') return toLrc(song.lines);
  return song.lines.map((l, i) => `${l.stanza && i > 0 ? '\n' : ''}${l.text}`).join('\n');
}

/** YouTube's oEmbed endpoint gives the title and channel; it may be blocked, then the learner types them. */
async function fetchVideoInfo(videoId: string): Promise<{ title: string; author: string } | null> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl(videoId))}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: unknown; author_name?: unknown };
    return { title: typeof data.title === 'string' ? data.title : '', author: typeof data.author_name === 'string' ? data.author_name : '' };
  } catch {
    return null;
  }
}

function Preview({ videoId }: { videoId: string }) {
  const { hostRef, problem, retry } = useYouTubePlayer(videoId);
  return <VideoFrame videoId={videoId} hostRef={hostRef} problem={problem} onRetry={retry} />;
}

export default function AddSongScreen({ editId }: { editId?: string }) {
  const { settings } = useSettings();
  const toast = useToast();
  const [existing, setExisting] = useState<Song | null | undefined>(editId ? undefined : null);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lang, setLang] = useState<CourseId>(settings.activeCourse);
  const [langTouched, setLangTouched] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [translation, setTranslation] = useState('');
  const [preview, setPreview] = useState(false);
  const [lookup, setLookup] = useState<'idle' | 'busy' | 'failed'>('idle');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const originalTranslation = useRef('');

  useEffect(() => {
    if (!editId) return;
    db.songs.get(editId).then((s) => {
      if (!s || s.deletedAt) {
        setExisting(null);
        return;
      }
      setExisting(s);
      setLink(s.videoId ? watchUrl(s.videoId) : '');
      setTitle(s.title);
      setArtist(s.artist);
      setLang(s.lang);
      setLangTouched(true);
      setLyrics(lyricsText(s));
      const tr = s.lines.map((l) => l.pl ?? '').join('\n').replace(/\n+$/, '');
      setTranslation(tr);
      originalTranslation.current = tr;
    });
  }, [editId]);

  const video = useMemo(() => (link.trim() ? parseYouTubeUrl(link) : null), [link]);
  const parsed = useMemo(() => (lyrics.trim() ? parseLyrics(lyrics) : null), [lyrics]);
  const lineCount = parsed?.lines.length ?? 0;
  const translationRows = translation.split('\n').filter((r) => r.trim()).length;

  // Japanese lyrics are recognised by their script (the learner can still change the language).
  useEffect(() => {
    if (!langTouched && lyrics && hasJapanese(lyrics)) setLang('ja');
  }, [lyrics, langTouched]);

  // An LRC file may carry the title and artist.
  useEffect(() => {
    if (!parsed?.meta) return;
    if (parsed.meta.title && !title) setTitle(parsed.meta.title);
    if (parsed.meta.artist && !artist) setArtist(parsed.meta.artist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed?.meta.title, parsed?.meta.artist]);

  const readFile = async (file: File) => {
    if (file.size > FILE_MAX) {
      toast(t('music.add.fileTooBig'));
      return;
    }
    const text = await file.text();
    setLyrics(text);
    toast(t('music.add.fileRead', { format: t(`music.format.${detectFormat(text)}`) }), 'success');
  };

  const getInfo = async () => {
    if (!video?.ok) return;
    setLookup('busy');
    const info = await fetchVideoInfo(video.videoId);
    if (!info) {
      setLookup('failed');
      return;
    }
    setLookup('idle');
    if (info.title) setTitle(info.title.slice(0, LIMITS.title));
    if (info.author && !artist) setArtist(info.author.slice(0, LIMITS.artist));
  };

  const videoError = video && !video.ok ? t(`music.link.${video.reason}`) : null;
  const canSave = Boolean(parsed && lineCount > 0 && !videoError && title.trim() && !saving);

  const save = async () => {
    if (!parsed || !canSave) return;
    setSaving(true);
    try {
      const videoId = video?.ok ? video.videoId : null;
      if (existing) {
        let lines = reconcileLines(existing.lines, cleanLines(parsed.lines));
        // Translations are rewritten from the text box only when it was changed.
        if (translation !== originalTranslation.current) lines = applyTranslation(lines, translation).lines;
        const timingChanged = timingKind(parsed.lines) !== timingKind(existing.lines);
        await updateSong(existing.id, {
          title: title.trim().slice(0, LIMITS.title),
          artist: artist.trim().slice(0, LIMITS.artist),
          lang,
          videoId,
          lines,
          format: parsed.format,
          ...(timingChanged ? { delay: 0 } : {}),
        });
        navigate(`/music/song/${existing.id}`, { replace: true });
      } else {
        const song = await createSong({ lang, title, artist, videoId, lyrics: parsed, translation });
        navigate(`/music/song/${song.id}`, { replace: true });
      }
    } finally {
      setSaving(false);
    }
  };

  if (existing === undefined) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;

  return (
    <div className="page music-add" data-testid="music-add-screen">
      <PageHeader title={existing ? t('music.add.editTitle') : t('music.add.title')} back fallback={existing ? `/music/song/${existing.id}` : '/music'} />

      <section className="card stack">
        <h2 className="section-title">
          <Video size={18} /> {t('music.add.video')}
        </h2>
        <label className="field">
          <span className="field__label">{t('music.add.link')}</span>
          <input
            className="input"
            inputMode="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setPreview(false);
            }}
            placeholder="https://www.youtube.com/watch?v=…"
            data-testid="music-link"
          />
        </label>
        {videoError && (
          <p className="field__error" role="alert" data-testid="music-link-error">
            {videoError}
          </p>
        )}
        {video?.ok && (
          <div className="row row--wrap">
            <span className="chip chip--success">
              <CheckCircle2 size={14} /> {t('music.link.ok', { id: video.videoId })}
            </span>
            <button type="button" className="btn btn--sm btn--outline" onClick={() => setPreview(true)}>
              <Link2 size={16} /> {t('music.add.preview')}
            </button>
            <button type="button" className="btn btn--sm btn--ghost" onClick={getInfo} disabled={lookup === 'busy'}>
              {t('music.add.fetchTitle')}
            </button>
          </div>
        )}
        {lookup === 'failed' && <p className="subtle">{t('music.add.fetchFailed')}</p>}
        {preview && video?.ok && <Preview videoId={video.videoId} />}
        <p className="subtle">{t('music.add.videoOptional')}</p>
        {(title || artist) && !video?.ok && (
          <a className="btn btn--sm btn--ghost" href={searchUrl(`${artist} ${title}`.trim())} target="_blank" rel="noopener noreferrer">
            <Search size={16} /> {t('music.add.search')}
          </a>
        )}
      </section>

      <section className="card stack">
        <label className="field">
          <span className="field__label">{t('music.add.songTitle')}</span>
          <input className="input" value={title} maxLength={LIMITS.title} onChange={(e) => setTitle(e.target.value)} data-testid="music-title" />
        </label>
        <label className="field">
          <span className="field__label">{t('music.add.artist')}</span>
          <input className="input" value={artist} maxLength={LIMITS.artist} onChange={(e) => setArtist(e.target.value)} data-testid="music-artist" />
        </label>
        <div className="field">
          <span className="field__label">{t('music.add.lang')}</span>
          <Segmented<CourseId>
            label={t('music.add.lang')}
            value={lang}
            onChange={(v) => {
              setLang(v);
              setLangTouched(true);
            }}
            options={(['es', 'de', 'ja'] as CourseId[]).map((c) => ({ value: c, label: getCourse(c).name }))}
          />
        </div>
      </section>

      <section className="card stack">
        <h2 className="section-title">{t('music.add.lyrics')}</h2>
        <p className="subtle">{t('music.add.lyricsHelp')}</p>
        <textarea className="input music-add__lyrics" rows={10} value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder={t('music.add.lyricsPlaceholder')} lang={lang} data-testid="music-lyrics" />
        <div className="row row--wrap">
          <button type="button" className="btn btn--sm btn--outline" onClick={() => fileRef.current?.click()}>
            <FileUp size={16} /> {t('music.add.file')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".lrc,.srt,.vtt,.txt,text/plain,text/vtt"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFile(f);
              e.target.value = '';
            }}
            data-testid="music-file"
          />
        </div>
        {parsed && (
          <div className="banner" role="status" data-testid="music-parse-summary">
            <Info size={18} />
            <div>
              <p>
                {t('music.add.parsed', {
                  format: t(`music.format.${parsed.format}`),
                  count: lineCount,
                  timing: t(`music.about.timing.${timingKind(parsed.lines)}`),
                })}
              </p>
              {lineCount > LIMITS.lines && <p>{t('music.add.tooManyLines', { max: LIMITS.lines })}</p>}
              {parsed.warnings.map((w) => (
                <p key={w} className="subtle">
                  {w}
                </p>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="card stack">
        <h2 className="section-title">{t('music.add.translation')}</h2>
        <p className="subtle">{t('music.add.translationHelp')}</p>
        <textarea className="input" rows={6} value={translation} onChange={(e) => setTranslation(e.target.value)} placeholder={t('music.add.translationPlaceholder')} data-testid="music-translation" />
        {translation.trim() && lineCount > 0 && translationRows !== lineCount && (
          <p className="subtle" role="status">
            {t('music.add.translationCount', { rows: translationRows, lines: lineCount })}
          </p>
        )}
      </section>

      <Banner icon={<ShieldCheck size={20} />}>{t('music.add.rights')}</Banner>

      <button type="button" className="btn btn--primary btn--lg btn--block" disabled={!canSave} onClick={save} data-testid="music-save">
        {existing ? t('common.save') : t('music.add.save')}
      </button>
      {!title.trim() && lineCount > 0 && <p className="subtle">{t('music.add.needTitle')}</p>}
    </div>
  );
}
