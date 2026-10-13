import { useState } from 'react';
import { Check, CloudDownload, Download, Lock, Volume2 } from 'lucide-react';
import { loadSettings, useSettings } from '../../state/settings';
import { allCourses, getCourse } from '../../content/registry';
import { navigate } from '../../app/router';
import { t } from '../../i18n';
import { LangBadge, ProgressBar, Banner } from '../../components/ui';
import { LogoMark } from '../../app/Nav';
import type { CourseId } from '../../content/types';
import type { DailyGoal } from '../../services/db';
import { audio } from '../../services/audio';
import { useAudioStatus } from '../../state/hooks';
import { isNative } from '../../services/platform';
import { cloud } from '../../services/cloud';
import { useCloud } from '../../state/cloud';
import { useToast } from '../../components/Toasts';
import { cloudErrorText } from '../profile/cloudText';

const SAMPLES: Record<CourseId, string> = {
  es: '¡Hola! Buenos días.',
  de: 'Hallo! Guten Tag.',
  ja: 'こんにちは。はじめまして。',
};

const GOALS: DailyGoal[] = [5, 10, 20, 30];

/** "Already learning? Restore from Google Drive" on the welcome screen. */
function RestoreFromCloud() {
  const c = useCloud();
  const { replace } = useSettings();
  const toast = useToast();
  if (!c.available) return null;
  const busy = c.state === 'connecting' || c.state === 'syncing';
  const restore = async () => {
    const state = await cloud.connect();
    if (state !== 'synced') {
      const err = cloud.getSnapshot().error;
      if (err) toast(cloudErrorText(err));
      return;
    }
    const s = await loadSettings();
    if (!s.onboarded) {
      toast(t('cloud.restoreEmpty'));
      return;
    }
    replace(s);
    toast(t('cloud.restoreDone'), 'success');
    navigate('/', { replace: true });
  };
  return (
    <button type="button" className="btn btn--ghost btn--block" onClick={restore} disabled={busy} data-testid="onb-restore">
      <CloudDownload size={18} /> {busy ? t('cloud.state.connecting') : t('cloud.restore')}
    </button>
  );
}

export function OnboardingScreen() {
  const { settings, update } = useSettings();
  const [step, setStep] = useState(0);
  // First run starts with nothing selected; re-running onboarding keeps the current choice.
  const [picked, setPicked] = useState<CourseId[]>(settings.onboarded ? settings.courses : []);
  const [goal, setGoal] = useState<DailyGoal>(settings.dailyGoalMin);
  const first = picked[0] ?? 'es';
  const status = useAudioStatus(getCourse(first).speechLang);
  const [played, setPlayed] = useState(false);
  const total = 4;

  const toggle = (id: CourseId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const finish = (startLesson: boolean) => {
    update({ onboarded: true, courses: picked, activeCourse: first, dailyGoalMin: goal });
    const firstLesson = getCourse(first).lessons[0];
    navigate(startLesson ? `/lesson/${firstLesson.id}` : '/', { replace: true });
  };

  return (
    <div className="page onboarding">
      {step > 0 && (
        <div className="stack stack--s">
          <ProgressBar value={step} max={total} label={t('onb.step', { n: step, total })} />
          <span className="subtle">{t('onb.step', { n: step, total })}</span>
        </div>
      )}

      {step === 0 && (
        <section className="onb-step center stack stack--l">
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <LogoMark size={96} />
          </div>
          <h1>{t('onb.welcomeTitle')}</h1>
          <p className="muted">{t('onb.welcomeBody')}</p>
          <Banner icon={<Lock size={18} />}>{t('onb.privacy')}</Banner>
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => setStep(1)} data-testid="onb-start">
            {t('onb.welcomeCta')}
          </button>
          <RestoreFromCloud />
        </section>
      )}

      {step === 1 && (
        <section className="onb-step stack stack--l">
          <h1>{t('onb.pickLangTitle')}</h1>
          <p className="muted">{t('onb.pickLangHint')}</p>
          <div className="stack">
            {allCourses().map((c) => {
              const on = picked.includes(c.id);
              return (
                <button key={c.id} type="button" className={`card choice-card${on ? ' is-selected' : ''}`} aria-pressed={on} onClick={() => toggle(c.id)} data-testid={`onb-lang-${c.id}`}>
                  <div className="row">
                    <LangBadge courseId={c.id} />
                    <div className="grow">
                      <div className="card__title">
                        {c.name} <span className="muted" lang={c.speechLang}>· {c.nativeName}</span>
                      </div>
                      <div className="subtle">{c.description}</div>
                    </div>
                    <span className="choice-card__check" aria-hidden="true">
                      {on && <Check size={18} />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <button type="button" className="btn btn--primary btn--lg btn--block" disabled={picked.length === 0} onClick={() => setStep(2)} data-testid="onb-next">
            {t('common.continue')}
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="onb-step stack stack--l">
          <h1>{t('onb.goalTitle')}</h1>
          <p className="muted">{t('onb.goalHint')}</p>
          <div className="stack">
            {GOALS.map((g) => (
              <button key={g} type="button" className={`card choice-card${goal === g ? ' is-selected' : ''}`} aria-pressed={goal === g} onClick={() => setGoal(g)} data-testid={`onb-goal-${g}`}>
                <div className="row">
                  <div className="goal-badge">{g}′</div>
                  <div className="grow">
                    <div className="card__title">{t(`goal.${g}` as never)}</div>
                    <div className="subtle">
                      {t('unit.min', { count: g })} · {t(`goal.${g}.desc` as never)}
                    </div>
                  </div>
                  <span className="choice-card__check" aria-hidden="true">
                    {goal === g && <Check size={18} />}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => setStep(3)} data-testid="onb-next">
            {t('common.continue')}
          </button>
        </section>
      )}

      {step === 3 && (
        <section className="onb-step stack stack--l">
          <h1>{t('onb.audioTitle')}</h1>
          <p className="muted">{t('onb.audioBody')}</p>
          <div className="stack">
            {picked.map((id) => (
              <div key={id} className="card row">
                <LangBadge courseId={id} />
                <div className="grow">
                  <div className="card__title" lang={getCourse(id).speechLang}>
                    {SAMPLES[id]}
                  </div>
                  <div className="subtle">{getCourse(id).name}</div>
                </div>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={async () => {
                    await audio.say(id, SAMPLES[id]).catch(() => {});
                    setPlayed(true);
                  }}
                >
                  <Volume2 size={18} /> {t('onb.audioTest')}
                </button>
              </div>
            ))}
          </div>
          {(status === 'missing' || status === 'unsupported') && (
            <Banner variant="warn">
              <strong>{t('onb.audioMissing')}</strong>
              <div>{t('onb.audioMissingHelp')}</div>
              {isNative() && (
                <button type="button" className="btn btn--sm btn--outline" style={{ marginTop: 8 }} onClick={() => audio.openInstall()}>
                  <Download size={16} /> {t('audio.installVoices')}
                </button>
              )}
            </Banner>
          )}
          {played && status === 'ok' && <Banner variant="success">{t('onb.audioOk')}</Banner>}
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => setStep(4)} data-testid="onb-next">
            {t('common.continue')}
          </button>
        </section>
      )}

      {step === 4 && (
        <section className="onb-step center stack stack--l">
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <LangBadge courseId={first} size={72} />
          </div>
          <h1>{t('onb.finishTitle')}</h1>
          <p className="muted">{t('onb.finishBody')}</p>
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => finish(true)} data-testid="onb-finish">
            {t('onb.startFirst')}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => finish(false)}>
            {t('onb.later')}
          </button>
        </section>
      )}
    </div>
  );
}
