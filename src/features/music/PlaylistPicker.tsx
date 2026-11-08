import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check, Plus } from 'lucide-react';
import { db } from '../../services/db';
import { createPlaylist, LIMITS, toggleInPlaylist } from '../../services/music';
import { t } from '../../i18n';

/** Adds a song to playlists (or creates one with it). */
export function PlaylistPicker({ songId }: { songId: string }) {
  const playlists = useLiveQuery(() => db.playlists.toArray(), []);
  const [name, setName] = useState('');
  const live = (playlists ?? []).filter((p) => !p.deletedAt).sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  return (
    <div className="stack" data-testid="playlist-picker">
      {live.length === 0 && <p className="subtle">{t('music.playlist.none')}</p>}
      <ul className="list">
        {live.map((p) => {
          const has = p.songIds.includes(songId);
          return (
            <li key={p.id}>
              <button type="button" className="list-row" aria-pressed={has} onClick={() => toggleInPlaylist(p.id, songId)}>
                <div className="list-row__body">
                  <div className="list-row__title">{p.name}</div>
                  <div className="list-row__desc">{t('music.playlist.count', { count: p.songIds.length })}</div>
                </div>
                {has && <Check size={20} aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return;
          await createPlaylist(name, [songId]);
          setName('');
        }}
      >
        <input className="input grow" value={name} maxLength={LIMITS.playlistName} onChange={(e) => setName(e.target.value)} placeholder={t('music.playlist.newName')} aria-label={t('music.playlist.newName')} />
        <button type="submit" className="btn btn--outline" disabled={!name.trim()}>
          <Plus size={18} /> {t('music.playlist.create')}
        </button>
      </form>
    </div>
  );
}
