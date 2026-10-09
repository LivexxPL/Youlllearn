import { useState } from 'react';
import { BookOpen, Check, Clock, Grid3x3, NotebookPen, PenLine, Play, Star } from 'lucide-react';
import { useSettings } from '../../state/settings';
import { getCourse } from '../../content/registry';
import { useCompletedSet, useLessonProgress, useShowRomaji } from '../../state/hooks';
import { navigate } from '../../app/router';
import { t, formatPercent } from '../../i18n';
import { Banner, PageHeader, Sheet } from '../../components/ui';
import { CourseSwitcher } from '../home/HomeScreen';
import type { Lesson } from '../../content/types';
import { TargetText } from '../../components/TargetText';
import { SpeakIcon } from '../../components/AudioButton';
import { gloss, itemRomaji } from '../../content/text';
import { nextLesson } from '../../engine/recommend';

function LessonPreview({ lesson, onClose, ahead }: { lesson: Lesson; onClose: () => void; ahead: boolean }) {
  const { settings } = useSettings();
  const progress = useLessonProgress();
  const showRomaji = useShowRomaji(lesson.id);
  const done = progress?.get(lesson.id);
  const courseId = settings.activeCourse;
  return (
    <Sheet open onClose={onClose} title={lesson.title}>
      <div className="stack">
        {lesson.subtitle && (
          <p className="target-text" style={{ fontSize: 'var(--fs-xl)' }}>
            <TargetText text={lesson.subtitle} courseId={courseId} />
          </p>
        )}
        <div>
          <p className="eyebrow">{t('learn.objective')}</p>
          <p>{lesson.objective}</p>
        </div>
        <div className="row row--wrap">
          <span className="chip">
            <Clock size={14} /> {t('common.minutesApprox', { count: lesson.minutes })}
          </span>
          <span className="chip">{lesson.level}</span>
          {done && <span className="chip chip--success">{t('learn.bestScore', { pct: formatPercent(done.bestAccuracy) })}</span>}
        </div>
        {ahead && <Banner variant="warn">{t('learn.lessonAhead')}</Banner>}
        <details className="details">
          <summary>{t('learn.items')} ({lesson.items.length})</summary>
          <ul className="list" style={{ marginTop: 'var(--sp-2)' }}>
            {lesson.items.map((it) => (
              <li key={it.id} className="list-row">
                <div className="list-row__body">
                  <div className="list-row__title">
                    <TargetText text={it.text} courseId={courseId} romaji={itemRomaji(it)} showRomaji={showRomaji && courseId === 'ja'} />
                  </div>
                  <div className="list-row__desc">{gloss(it)}</div>
                </div>
                <SpeakIcon courseId={courseId} content={it} />
              </li>
            ))}
          </ul>
        </details>
        <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => navigate(`/lesson/${lesson.id}`)} data-testid="start-lesson">
          <Play size={20} /> {done ? t('learn.repeat') : t('learn.start')}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => navigate(`/notes/${lesson.id}`)}>
          <NotebookPen size={18} /> {t('learn.notes')}
        </button>
      </div>
    </Sheet>
  );
}

export function LearnScreen() {
  const { settings } = useSettings();
  const course = getCourse(settings.activeCourse);
  const completed = useCompletedSet(course.id);
  const progress = useLessonProgress();
  const [preview, setPreview] = useState<Lesson | null>(null);
  const next = nextLesson(course, completed);
  const nextIndex = next ? course.lessonIndex.get(next.id)! : course.lessons.length;

  return (
    <div className="page">
      <PageHeader title={t('learn.title')} action={<CourseSwitcher />} />
      <p className="muted">
        {course.description} <span className="subtle">{t('learn.framework', { framework: course.framework })}</span>
      </p>

      {course.id === 'ja' && (
        <div className="grid-2">
          <button type="button" className="card quick-card" onClick={() => navigate('/kana')}>
            <Grid3x3 size={22} />
            <span className="card__title">{t('learn.kanaChart')}</span>
          </button>
          <button type="button" className="card quick-card" onClick={() => navigate('/write')}>
            <PenLine size={22} />
            <span className="card__title">{t('learn.writing')}</span>
          </button>
        </div>
      )}

      {course.units.map((unit) => (
        <section key={unit.id} className="unit" aria-labelledby={`${unit.id}-title`}>
          <div className="unit__header">
            <h2 id={`${unit.id}-title`}>{unit.title}</h2>
            <p className="subtle">{unit.description}</p>
          </div>
          <ol className="trail">
            {unit.lessons.map((lesson) => {
              const idx = course.lessonIndex.get(lesson.id)!;
              const done = completed.has(lesson.id);
              const isNext = next?.id === lesson.id;
              const p = progress?.get(lesson.id);
              return (
                <li key={lesson.id} className={`trail__item${done ? ' is-done' : ''}${isNext ? ' is-next' : ''}`}>
                  <button type="button" className="trail__btn" onClick={() => setPreview(lesson)} data-testid={`lesson-${lesson.id}`}>
                    <span className="trail__node" aria-hidden="true">
                      {done ? <Check size={22} /> : isNext ? <Play size={20} /> : <BookOpen size={18} />}
                    </span>
                    <span className="trail__body">
                      <span className="trail__title">
                        {idx + 1}. {lesson.title}
                      </span>
                      <span className="trail__meta">
                        {lesson.subtitle && (
                          <span className="trail__subtitle">
                            <TargetText text={lesson.subtitle} courseId={course.id} />
                          </span>
                        )}
                        <span className="trail__min">
                          <Clock size={12} /> {t('common.minutesApprox', { count: lesson.minutes })}
                        </span>
                        {p && (
                          <span className="trail__score">
                            <Star size={12} /> {formatPercent(p.bestAccuracy)}
                          </span>
                        )}
                      </span>
                      <span className="visually-hidden">{done ? t('learn.lessonDone') : isNext ? t('learn.lessonNext') : ''}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      {preview && <LessonPreview lesson={preview} onClose={() => setPreview(null)} ahead={(course.lessonIndex.get(preview.id) ?? 0) > nextIndex} />}
    </div>
  );
}
