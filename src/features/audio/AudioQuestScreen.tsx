import { useState } from 'react';
import { BookHeadphones, CheckCircle2, Ear, Headphones, Layers, Lock, Mic, MoonStar, PenLine, Play, Repeat2, Waves } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db';
import { useSettings } from '../../state/settings';
import { getCourse } from '../../content/registry';
import { useAudioStatus, useCards, useCompletedSet, useListeningStage } from '../../state/hooks';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { Banner, EmptyState, PageHeader, Segmented, Switch } from '../../components/ui';
import { CourseSwitcher } from '../home/HomeScreen';
import { isNative } from '../../services/platform';
import { audio } from '../../services/audio';

type StageChoice = 'auto' | 1 | 2 | 3;

function ModeCard({ icon, title, desc, onClick, disabled, testId }: { icon: ReactNode; title: string; desc: string; onClick: () => void; disabled?: boolean; testId?: string }) {
  return (
    <button type="button" className="card mode-card" onClick={onClick} disabled={disabled} data-testid={testId}>
      <span className="mode-card__icon">{icon}</span>
      <span className="card__title">{title}</span>
      <span className="subtle">{desc}</span>
    </button>
  );
}

export default function AudioQuestScreen() {
  const { settings, update } = useSettings();
  const course = getCourse(settings.activeCourse);
  const cards = useCards(course.id);
  const completed = useCompletedSet(course.id);
  const autoStage = useListeningStage(course.id);
  const status = useAudioStatus(course.speechLang);
  const [minutes, setMinutes] = useState(10);
  const [stage, setStage] = useState<StageChoice>('auto');
  const [pocket, setPocket] = useState(false);
  const storyResults = useLiveQuery(() => db.meta.where('key').startsWith('story:').toArray(), []);
  const storyDone = new Map((storyResults ?? []).map((r) => [r.key.slice(6), r.value as { correct: number; total: number }]));
  const hasMaterial = Boolean(cards?.length);
  const effectiveStage = stage === 'auto' ? autoStage : stage;

  const startHandsFree = () => {
    navigate(`/audio/handsfree?min=${minutes}&stage=${effectiveStage}${pocket ? '&pocket=1' : ''}`);
  };

  return (
    <div className="page">
      <PageHeader title={t('aq.title')} action={<CourseSwitcher />} />
      <p className="muted">{t('aq.subtitle')}</p>

      {(status === 'missing' || status === 'unsupported') && (
        <Banner variant="warn">
          <strong>{t('audio.noVoice', { lang: course.name })}</strong> {t('audio.noVoiceHelp')}
          {isNative() && (
            <button type="button" className="btn btn--sm btn--outline" style={{ marginTop: 8 }} onClick={() => audio.openInstall()}>
              {t('audio.installVoices')}
            </button>
          )}
        </Banner>
      )}

      {!hasMaterial ? (
        <EmptyState
          icon={<Headphones size={40} />}
          title={t('aq.title')}
          body={t('aq.empty')}
          action={
            <button type="button" className="btn btn--primary" onClick={() => navigate(`/lesson/${course.lessons[0].id}`)}>
              {t('learn.start')}
            </button>
          }
        />
      ) : (
        <>
          <section className="card card--hero hero stack" aria-labelledby="hf-title">
            <div className="row">
              <Waves size={26} />
              <h2 id="hf-title" className="hero__title" style={{ margin: 0 }}>
                {t('aq.handsFree')}
              </h2>
            </div>
            <p className="muted">{t('aq.handsFreeDesc')}</p>
            <div className="stack stack--s">
              <span className="eyebrow hero__eyebrow">{t('aq.duration')}</span>
              <Segmented value={minutes} onChange={setMinutes} label={t('aq.duration')} options={[5, 10, 15].map((m) => ({ value: m, label: `${m} min` }))} />
            </div>
            <div className="stack stack--s">
              <span className="eyebrow hero__eyebrow">{t('aq.stage')}</span>
              <Segmented<StageChoice>
                value={stage}
                onChange={setStage}
                label={t('aq.stage')}
                options={[
                  { value: 'auto', label: `Auto (${autoStage})` },
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                ]}
              />
              <span className="subtle hero__muted">
                {t(`aq.stage${effectiveStage}` as never)} · {t('aq.stageAuto')}
              </span>
            </div>
            <div className="row row--between">
              <span>{t('set.narrate')}</span>
              <Switch checked={settings.narrateTranslations} onChange={(v) => update({ narrateTranslations: v })} label={t('set.narrate')} />
            </div>
            <div className="row row--between">
              <span className="row" style={{ gap: 6 }}>
                <MoonStar size={18} /> {t('aq.pocketMode')}
              </span>
              <Switch checked={pocket} onChange={setPocket} label={t('aq.pocketMode')} />
            </div>
            <p className="subtle hero__muted">{t('aq.pocketModeDesc')}</p>
            <button type="button" className="btn btn--accent btn--lg btn--block" onClick={startHandsFree} data-testid="handsfree-start">
              <Play size={20} /> {t('aq.startSession')}
            </button>
            <p className="subtle hero__muted">{t('aq.backgroundNote')}</p>
          </section>

          <section aria-labelledby="modes-title" className="stack stack--s">
            <h2 id="modes-title" className="section-title">
              {t('aq.modes')}
            </h2>
            <div className="mode-grid">
              <ModeCard icon={<Ear size={24} />} title={t('aq.listenWords')} desc={t('aq.listenWordsDesc')} onClick={() => navigate('/audio/listen')} testId="mode-listen" />
              <ModeCard icon={<Layers size={24} />} title={t('aq.flashcards')} desc={t('aq.flashcardsDesc')} onClick={() => navigate('/audio/flashcards')} testId="mode-flashcards" />
              <ModeCard icon={<Repeat2 size={24} />} title={t('aq.repeat')} desc={t('aq.repeatDesc')} onClick={() => navigate('/audio/repeat')} />
              <ModeCard icon={<Mic size={24} />} title={t('aq.shadowing')} desc={t('aq.shadowingDesc')} onClick={() => navigate('/audio/shadowing')} />
              <ModeCard icon={<PenLine size={24} />} title={t('aq.dictation')} desc={t('aq.dictationDesc')} onClick={() => navigate('/audio/dictation')} />
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="stories-title" className="stack stack--s">
        <h2 id="stories-title" className="section-title">
          <span className="row" style={{ gap: 8 }}>
            <BookHeadphones size={20} /> {t('aq.dialogues')}
          </span>
        </h2>
        <p className="subtle">{t('aq.dialoguesDesc')}</p>
        <ul className="list">
          {course.stories.map((st) => {
            const unlocked = completed.has(st.afterLesson);
            const lesson = course.lessons[course.lessonIndex.get(st.afterLesson) ?? 0];
            const done = storyDone.get(st.id);
            return (
              <li key={st.id}>
                <button type="button" className="list-row" disabled={!unlocked} onClick={() => navigate(`/audio/story?id=${st.id}`)} data-testid={`story-${st.id}`}>
                  <span className={`story-icon${unlocked ? '' : ' is-locked'}`}>{unlocked ? <Play size={18} /> : <Lock size={18} />}</span>
                  <div className="list-row__body">
                    <div className="list-row__title">{st.title}</div>
                    <div className="list-row__desc">{unlocked ? `${st.context} · ${t(`aq.stage${st.stage}` as never)}` : t('aq.locked', { lesson: lesson.title })}</div>
                    {done && (
                      <div className="list-row__meta">
                        <CheckCircle2 size={14} /> {t('aq.storyDone', { correct: done.correct, total: done.total })}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
