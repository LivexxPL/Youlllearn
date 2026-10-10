import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronRight, Grid3x3, NotebookPen, Settings2 } from 'lucide-react';
import { useSettings } from '../../state/settings';
import { useCompletedSet } from '../../state/hooks';
import { getCourse, findLesson } from '../../content/registry';
import { nextLesson } from '../../engine/recommend';
import { db } from '../../services/db';
import { navigate } from '../../app/router';
import { formatDate, t } from '../../i18n';
import { Banner, PageHeader, Segmented } from '../../components/ui';
import { charsFor, practiceId, WRITE_SETS, type WriteSet } from './sets';
import { WritingSettingsSheet } from './WritingSettingsSheet';

export default function WritingHub() {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const completed = useCompletedSet(course.id);
  const [set, setSet] = useState<WriteSet>('hiragana');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const practice = useLiveQuery(() => db.drawings.where('kind').equals('practice').toArray(), []);
  const notes = useLiveQuery(() => db.drawings.where('kind').equals('note').toArray(), []);
  // Practised = self-assessed at least once, or something is drawn (an emptied pad does not count).
  const done = new Set((practice ?? []).filter((d) => d.practisedAt || d.strokes.length > 0).map((d) => d.id));
  const chars = charsFor(set);
  const current = nextLesson(course, completed) ?? course.lessons.at(-1)!;
  const sortedNotes = [...(notes ?? [])].filter((n) => n.strokes.length > 0).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="page">
      <PageHeader
        title={t('write.title')}
        back
        fallback="/learn"
        action={
          <button type="button" className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label={t('write.settings')}>
            <Settings2 size={22} />
          </button>
        }
      />
      <p className="muted">{t('write.hubSubtitle')}</p>

      {course.id === 'ja' ? (
        <section className="stack stack--s" aria-labelledby="chars-title">
          <h2 id="chars-title" className="section-title">
            {t('write.chooseChar')}
          </h2>
          <Segmented value={set} onChange={setSet} label={t('write.chooseChar')} options={WRITE_SETS.map((s) => ({ value: s, label: t(`write.${s}`) }))} />
          <p className="subtle">{t('write.practised', { done: chars.filter((c) => done.has(practiceId(c.char))).length, total: chars.length })}</p>
          <ul className={`char-grid${set === 'kanji' ? ' char-grid--kanji' : ''}`}>
            {chars.map((c) => (
              <li key={c.char}>
                <button
                  type="button"
                  className={`char-cell${done.has(practiceId(c.char)) ? ' is-done' : ''}`}
                  onClick={() => navigate(`/write/${set}/${encodeURIComponent(c.char)}`)}
                  aria-label={`${c.char} — ${c.meaning ?? c.romaji}`}
                  data-testid={`write-${c.char}`}
                >
                  <span className="char-cell__char" lang="ja">
                    {c.char}
                  </span>
                  <span className="char-cell__romaji">{set === 'kanji' ? c.meaning?.split(';')[0] : c.romaji}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="list-row list-row--link" onClick={() => navigate('/kana')}>
            <Grid3x3 size={20} />
            <div className="list-row__body">
              <div className="list-row__title">{t('kana.title')}</div>
              <div className="list-row__desc">{t('kana.tapToHear')}</div>
            </div>
            <ChevronRight size={20} />
          </button>
        </section>
      ) : (
        <Banner>{t('write.jaOnly')}</Banner>
      )}

      <section className="stack stack--s" aria-labelledby="notes-title">
        <h2 id="notes-title" className="section-title">
          {t('write.notesList')}
        </h2>
        <button type="button" className="btn btn--outline btn--block" onClick={() => navigate(`/notes/${current.id}`)}>
          <NotebookPen size={18} /> {t('write.notesCurrent')}: {current.title}
        </button>
        {sortedNotes.length === 0 ? (
          <p className="subtle">{t('write.notesEmpty')}</p>
        ) : (
          <ul className="list">
            {sortedNotes.map((n) => {
              const lessonId = n.id.slice('note:'.length);
              const found = findLesson(lessonId);
              return (
                <li key={n.id}>
                  <button type="button" className="list-row" onClick={() => navigate(`/notes/${lessonId}`)}>
                    <NotebookPen size={20} />
                    <div className="list-row__body">
                      <div className="list-row__title">{n.title || found?.lesson.title || lessonId}</div>
                      <div className="list-row__desc">
                        {found ? `${getCourse(found.course.id).name} · ` : ''}
                        {t('write.edited', { date: formatDate(n.updatedAt) })}
                      </div>
                    </div>
                    <ChevronRight size={20} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <WritingSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
