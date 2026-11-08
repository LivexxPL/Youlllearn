/** One playlist: its songs in order, renaming, reordering and deleting. */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowDown, ArrowUp, ListMusic, Pencil, Trash2, X } from 'lucide-react';
import { db } from '../../services/db';
import { deletePlaylist, LIMITS, updatePlaylist } from '../../services/music';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState, LangBadge, PageHeader, Sheet } from '../../components/ui';

export default function PlaylistScreen({ id }: { id: string }) {
  const playlist = useLiveQuery(async () => (await db.playlists.get(id)) ?? null, [id]);
  const songs = useLiveQuery(() => db.songs.toArray(), []);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  if (playlist === undefined || !songs) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  if (!playlist || playlist.deletedAt) {
    return (
      <div className="page">
        <PageHeader title={t('music.playlist.title')} back fallback="/music" />
        <EmptyState icon={<ListMusic size={40} />} title={t('music.playlist.missing')} />
      </div>
    );
  }
  const byId = new Map(songs.filter((s) => !s.deletedAt).map((s) => [s.id, s]));
  const list = playlist.songIds.map((sid) => byId.get(sid)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const move = (from: number, to: number) => {
    const ids = list.map((s) => s.id);
    const [x] = ids.splice(from, 1);
    ids.splice(to, 0, x);
    updatePlaylist(playlist.id, { songIds: ids });
  };
  return (
    <div className="page" data-testid="playlist-screen">
      <PageHeader
        title={playlist.name}
        back
        fallback="/music"
        action={
          <button type="button" className="icon-btn" onClick={() => setRenaming(playlist.name)} aria-label={t('music.playlist.rename')}>
            <Pencil size={20} />
          </button>
        }
      />
      {list.length === 0 ? (
        <EmptyState icon={<ListMusic size={40} />} title={t('music.playlist.empty')} body={t('music.playlist.emptyBody')} />
      ) : (
        <ol className="list music-playlist">
          {list.map((s, i) => (
            <li key={s.id} className="list-row">
              <LangBadge courseId={s.lang} size={30} />
              <button type="button" className="list-row__body music-playlist__open" onClick={() => navigate(`/music/song/${s.id}`)}>
                <span className="list-row__title">{s.title}</span>
                <span className="list-row__desc">{s.artist}</span>
              </button>
              <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={t('music.playlist.up')}>
                <ArrowUp size={18} />
              </button>
              <button type="button" className="icon-btn" disabled={i === list.length - 1} onClick={() => move(i, i + 1)} aria-label={t('music.playlist.down')}>
                <ArrowDown size={18} />
              </button>
              <button type="button" className="icon-btn" onClick={() => updatePlaylist(playlist.id, { songIds: list.filter((x) => x.id !== s.id).map((x) => x.id) })} aria-label={t('music.playlist.remove')}>
                <X size={18} />
              </button>
            </li>
          ))}
        </ol>
      )}
      <button type="button" className="btn btn--ghost" onClick={() => setConfirm(true)}>
        <Trash2 size={18} /> {t('music.playlist.delete')}
      </button>

      <Sheet open={renaming !== null} onClose={() => setRenaming(null)} title={t('music.playlist.rename')}>
        <form
          className="stack"
          onSubmit={async (e) => {
            e.preventDefault();
            await updatePlaylist(playlist.id, { name: renaming ?? '' });
            setRenaming(null);
          }}
        >
          <input className="input" value={renaming ?? ''} maxLength={LIMITS.playlistName} onChange={(e) => setRenaming(e.target.value)} aria-label={t('music.playlist.newName')} />
          <button type="submit" className="btn btn--primary">
            {t('common.save')}
          </button>
        </form>
      </Sheet>
      <Sheet open={confirm} onClose={() => setConfirm(false)} title={t('music.playlist.deleteTitle')}>
        <p className="muted">{t('music.playlist.deleteBody')}</p>
        <div className="stack" style={{ marginTop: 'var(--sp-4)' }}>
          <button
            type="button"
            className="btn btn--danger"
            onClick={async () => {
              await deletePlaylist(playlist.id);
              navigate('/music', { replace: true });
            }}
          >
            {t('music.playlist.delete')}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => setConfirm(false)}>
            {t('common.cancel')}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
