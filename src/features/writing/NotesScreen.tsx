/**
 * Handwritten notes for a lesson (any course). Autosaved to IndexedDB.
 */
import { useEffect, useRef, useState } from 'react';
import { ListChecks, Settings2, X } from 'lucide-react';
import { findLesson } from '../../content/registry';
import { gloss, itemRomaji } from '../../content/text';
import { useSettings } from '../../state/settings';
import { useShowRomaji } from '../../state/hooks';
import { db, type Drawing, type Stroke } from '../../services/db';
import { activity } from '../../services/activity';
import { goBack } from '../../app/router';
import { t } from '../../i18n';
import { EmptyState } from '../../components/ui';
import { TargetText } from '../../components/TargetText';
import { SpeakIcon } from '../../components/AudioButton';
import { WritingPad } from './WritingPad';
import { noteId } from './sets';
import { WritingSettingsSheet } from './WritingSettingsSheet';

export default function NotesScreen({ lessonId }: { lessonId?: string }) {
  const found = lessonId ? findLesson(lessonId) : null;
  const [note, setNote] = useState<Drawing | null | undefined>(undefined);

  useEffect(() => {
    if (!lessonId) return;
    let alive = true;
    db.drawings.get(noteId(lessonId)).then((d) => alive && setNote(d ?? null));
    return () => {
      alive = false;
    };
  }, [lessonId]);

  if (!found || !lessonId) {
    return (
      <div className="page">
        <EmptyState
          icon={<ListChecks size={40} />}
          title={t('write.notes')}
          action={
            <button type="button" className="btn btn--primary" onClick={() => goBack('/learn')}>
              {t('common.back')}
            </button>
          }
        />
      </div>
    );
  }
  if (note === undefined) return <div className="page"><p className="muted">{t('common.loading')}</p></div>;
  return <NotesEditor lessonId={lessonId} initial={note} />;
}

function NotesEditor({ lessonId, initial }: { lessonId: string; initial: Drawing | null }) {
  const { settings, update } = useSettings();
  const { course, lesson } = findLesson(lessonId)!;
  const showRomaji = useShowRomaji(lessonId);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [grid, setGrid] = useState(false);
  const [saved, setSaved] = useState(true);
  const [showWords, setShowWords] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const strokesRef = useRef<Stroke[]>(initial?.strokes ?? []);
  const titleRef = useRef(title);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Landscape screens (tablets, desktop) get a wide sheet; phones a tall one.
  const [aspect] = useState(() => (window.innerWidth > window.innerHeight ? 0.62 : 1.3));

  const save = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      db.drawings
        .put({ id: noteId(lessonId), kind: 'note', strokes: strokesRef.current, updatedAt: Date.now(), title: titleRef.current.trim() || undefined })
        .then(() => setSaved(true))
        .catch(() => setSaved(false));
    }, 500);
    setSaved(false);
  };

  useEffect(() => {
    activity.start('writing', course.id);
    return () => {
      activity.stop();
      // Flush a pending save when leaving the screen.
      if (timer.current) {
        clearTimeout(timer.current);
        db.drawings.put({ id: noteId(lessonId), kind: 'note', strokes: strokesRef.current, updatedAt: Date.now(), title: titleRef.current.trim() || undefined }).catch(() => {});
      }
    };
  }, [course.id, lessonId]);

  return (
    <div className={`page notes${settings.stylusMode ? ' notes--stylus' : ''}`}>
      <header className="notes__bar">
        <button type="button" className="icon-btn" onClick={() => goBack('/learn')} aria-label={t('common.close')} data-testid="notes-close">
          <X size={24} />
        </button>
        <div className="grow">
          <p className="eyebrow">{t('write.notesFor', { lesson: lesson.title })}</p>
          <input
            className="notes__title"
            value={title}
            placeholder={t('write.noteTitle')}
            aria-label={t('write.noteTitle')}
            onChange={(e) => {
              setTitle(e.target.value);
              titleRef.current = e.target.value;
              save();
            }}
          />
        </div>
        <span className="subtle notes__status" aria-live="polite">
          {saved ? t('write.saved') : t('write.saving')}
        </span>
        <button type="button" className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label={t('write.settings')}>
          <Settings2 size={22} />
        </button>
      </header>
      <p className="subtle">{t('write.notesHint')}</p>

      <WritingPad
        initial={initial?.strokes}
        onChange={(s) => {
          strokesRef.current = s;
          save();
        }}
        penOnly={settings.penOnly}
        brushSize={settings.brushSize}
        onBrushSize={(s) => update({ brushSize: s })}
        leftHanded={settings.leftHanded}
        stylusMode={settings.stylusMode}
        showGridToggle
        grid={grid}
        onGrid={setGrid}
        aspect={aspect}
        label={t('write.notesFor', { lesson: lesson.title })}
      />

      <button type="button" className="btn btn--ghost" aria-expanded={showWords} onClick={() => setShowWords((v) => !v)}>
        <ListChecks size={18} /> {t('learn.items')} ({lesson.items.length})
      </button>
      {showWords && (
        <ul className="list">
          {lesson.items.map((it) => (
            <li key={it.id} className="list-row">
              <div className="list-row__body">
                <div className="list-row__title">
                  <TargetText text={it.text} courseId={course.id} romaji={itemRomaji(it)} showRomaji={showRomaji && course.id === 'ja'} reading={it.reading} />
                </div>
                <div className="list-row__desc">{gloss(it)}</div>
              </div>
              <SpeakIcon courseId={course.id} content={it} />
            </li>
          ))}
        </ul>
      )}
      <WritingSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
