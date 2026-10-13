import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Bell, BookOpen, ChevronRight, Download, Info, Keyboard, Mic, Palette, PenLine, Upload, Trash2, Volume2, Database, Target, Languages, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSettings, TEXT_SCALES, loadSettings } from '../../state/settings';
import { allCourses, getCourse } from '../../content/registry';
import type { CourseId } from '../../content/types';
import type { DailyGoal, RomajiMode, ThemePref, MotionPref } from '../../services/db';
import { t, weekdayShort } from '../../i18n';
import { Banner, LangBadge, PageHeader, Segmented, SettingRow, Sheet, Switch } from '../../components/ui';
import { audio } from '../../services/audio';
import { isNative, appVersion } from '../../services/platform';
import { useToast } from '../../components/Toasts';
import { reminderPermission, requestReminderPermission, sendTestReminder, type ReminderPermission } from '../../services/notifications';
import { BackupError, importData, readBackupFile, resetAll, saveBackup } from '../../services/backup';
import { navigate } from '../../app/router';
import { recognitionAvailable } from '../../services/audio/speech';
import { brand } from '../../config/brand';
import { InstallSection } from './InstallCard';
import { PalettePicker } from './PalettePicker';
import { cloud } from '../../services/cloud';
import { useCloud } from '../../state/cloud';
import { storagePersisted } from '../../services/storage';
import { Avatar } from '../../components/Avatar';

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="stack stack--s settings-section" aria-label={title}>
      <h2 className="section-title">
        <span className="row" style={{ gap: 'var(--sp-2)' }}>
          {icon}
          {title}
        </span>
      </h2>
      <div className="list">{children}</div>
    </section>
  );
}

function VoicePicker({ lang, label, sample, courseId }: { lang: string; label: string; sample: string; courseId?: CourseId }) {
  const { settings, update } = useSettings();
  const version = useSyncExternalStore(
    (cb) => audio.subscribe(cb),
    () => audio.version,
  );
  const voices = useMemo(() => audio.voicesFor(lang), [lang, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const key = lang.split('-')[0];
  const selected = settings.voices[key] ?? '';
  const status = audio.status(lang);
  return (
    <div className="list-row" style={{ flexWrap: 'wrap' }}>
      <div className="list-row__body">
        <label className="list-row__title" htmlFor={`voice-${key}`}>
          {label}
        </label>
        {status === 'missing' && <div className="list-row__desc">{t('audio.noVoice', { lang: label })}</div>}
        {status === 'unsupported' && <div className="list-row__desc">{t('audio.unsupported')}</div>}
      </div>
      <select
        id={`voice-${key}`}
        className="select"
        value={selected}
        onChange={(e) => update({ voices: { ...settings.voices, [key]: e.target.value } })}
        disabled={!voices.length}
      >
        <option value="">{t('audio.voiceDefault')}</option>
        {voices.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name} ({v.lang}) · {v.local ? t('audio.voiceLocal') : t('audio.voiceNetwork')}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="icon-btn icon-btn--filled"
        aria-label={`${t('audio.testVoice')}: ${label}`}
        onClick={() => (courseId ? audio.say(courseId, sample) : audio.sayPolish(sample)).catch(() => {})}
      >
        <Volume2 size={20} />
      </button>
    </div>
  );
}

export default function SettingsScreen() {
  const { settings, update, replace } = useSettings();
  const toast = useToast();
  const [perm, setPerm] = useState<ReminderPermission>('prompt');
  const [srAvailable, setSrAvailable] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetText, setResetText] = useState('');
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const account = useCloud().account;

  useEffect(() => {
    reminderPermission().then(setPerm).catch(() => setPerm('unsupported'));
    recognitionAvailable().then(setSrAvailable);
    storagePersisted().then(setPersisted);
  }, []);

  const toggleCourse = (id: CourseId) => {
    const on = settings.courses.includes(id);
    if (on && settings.courses.length === 1) return;
    const courses = on ? settings.courses.filter((c) => c !== id) : [...settings.courses, id];
    update({ courses, activeCourse: courses.includes(settings.activeCourse) ? settings.activeCourse : courses[0] });
  };

  const setReminders = async (enabled: boolean) => {
    if (enabled && perm !== 'granted') {
      const p = await requestReminderPermission().catch(() => 'denied' as const);
      setPerm(p);
      if (p !== 'granted') {
        toast(t('set.remindersDenied'));
        return;
      }
    }
    update({ reminders: { ...settings.reminders, enabled } });
  };

  const toggleDay = (d: number) => {
    const days = settings.reminders.days.includes(d) ? settings.reminders.days.filter((x) => x !== d) : [...settings.reminders.days, d];
    update({ reminders: { ...settings.reminders, days } });
  };

  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      const backup = await readBackupFile(f);
      if (!window.confirm(t('set.importConfirm'))) return;
      await importData(backup);
      replace(await loadSettings());
      toast(t('set.importDone'), 'success');
    } catch (e) {
      toast(t('set.importError', { error: e instanceof BackupError ? e.message : String(e) }));
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const doReset = async () => {
    // A reset starts from scratch on this device; the copy on Drive stays (Profile can delete it).
    await cloud.signOut();
    await resetAll();
    replace(await loadSettings());
    setResetOpen(false);
    setResetText('');
    toast(t('set.resetDone'));
    navigate('/onboarding', { replace: true });
  };

  const hasJa = settings.courses.includes('ja');
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="page">
      <PageHeader title={t('set.title')} />

      <div className="list">
        <button type="button" className="list-row" onClick={() => navigate('/profile')} data-testid="settings-profile">
          <Avatar name={settings.displayName || account?.name || ''} picture={account?.picture} size={40} />
          <div className="list-row__body">
            <div className="list-row__title">{t('set.profileRow')}</div>
            <div className="list-row__desc">{account ? account.email : t('set.profileRowDesc')}</div>
          </div>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <Section icon={<BookOpen size={20} />} title={t('set.courses')}>
        {allCourses().map((c) => (
          <SettingRow
            key={c.id}
            title={
              <span className="row" style={{ gap: 'var(--sp-2)' }}>
                <LangBadge courseId={c.id} size={32} /> {c.name}
                {settings.activeCourse === c.id && <span className="chip chip--active">{t('course.active')}</span>}
              </span>
            }
            control={<Switch checked={settings.courses.includes(c.id)} onChange={() => toggleCourse(c.id)} label={c.name} />}
          />
        ))}
        <div className="list-row">
          <div className="list-row__body">
            <div className="list-row__title">{t('course.active')}</div>
          </div>
          <Segmented
            value={settings.activeCourse}
            onChange={(id) => update({ activeCourse: id })}
            label={t('course.active')}
            options={settings.courses.map((c) => ({ value: c, label: getCourse(c).name }))}
          />
        </div>
      </Section>

      <Section icon={<Target size={20} />} title={t('set.goal')}>
        <div className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <Segmented<DailyGoal>
            value={settings.dailyGoalMin}
            onChange={(v) => update({ dailyGoalMin: v })}
            label={t('set.goal')}
            options={([5, 10, 20, 30] as DailyGoal[]).map((g) => ({ value: g, label: `${g} min` }))}
          />
          <p className="subtle">{t(`goal.${settings.dailyGoalMin}.desc` as never)}</p>
        </div>
      </Section>

      <Section icon={<Palette size={20} />} title={t('set.appearance')}>
        <PalettePicker />
        <div className="list-row" style={{ flexWrap: 'wrap' }}>
          <div className="list-row__body list-row__title">{t('set.theme')}</div>
          <Segmented<ThemePref>
            value={settings.theme}
            onChange={(v) => update({ theme: v })}
            label={t('set.theme')}
            options={[
              { value: 'system', label: t('set.theme.system') },
              { value: 'light', label: t('set.theme.light') },
              { value: 'dark', label: t('set.theme.dark') },
            ]}
          />
        </div>
        <div className="list-row" style={{ flexWrap: 'wrap' }}>
          <div className="list-row__body list-row__title">{t('set.textSize')}</div>
          <Segmented<number>
            value={settings.textScale}
            onChange={(v) => update({ textScale: v })}
            label={t('set.textSize')}
            options={TEXT_SCALES.map((s, i) => ({ value: s, label: t((['set.textSize.s', 'set.textSize.m', 'set.textSize.l', 'set.textSize.xl'] as const)[i]) }))}
          />
        </div>
        <div className="list-row" style={{ flexWrap: 'wrap' }}>
          <div className="list-row__body list-row__title">{t('set.motion')}</div>
          <Segmented<MotionPref>
            value={settings.motion}
            onChange={(v) => update({ motion: v })}
            label={t('set.motion')}
            options={[
              { value: 'system', label: t('set.motion.system') },
              { value: 'reduce', label: t('set.motion.reduce') },
              { value: 'full', label: t('set.motion.full') },
            ]}
          />
        </div>
        <SettingRow title={t('set.sounds')} control={<Switch checked={settings.sounds} onChange={(v) => update({ sounds: v })} label={t('set.sounds')} />} />
        <SettingRow title={t('set.haptics')} control={<Switch checked={settings.haptics} onChange={(v) => update({ haptics: v })} label={t('set.haptics')} />} />
      </Section>

      <Section icon={<Volume2 size={20} />} title={t('set.audio')}>
        <SettingRow title={t('set.autoplay')} control={<Switch checked={settings.autoplayAudio} onChange={(v) => update({ autoplayAudio: v })} label={t('set.autoplay')} />} />
        <div className="list-row" style={{ flexWrap: 'wrap' }}>
          <label className="list-row__body list-row__title" htmlFor="speech-rate">
            {t('set.speechRate')} ({Math.round(settings.speechRate * 100)}%)
          </label>
          <input id="speech-rate" type="range" min={0.7} max={1.3} step={0.05} value={settings.speechRate} onChange={(e) => update({ speechRate: Number(e.target.value) })} className="range" />
        </div>
        <SettingRow title={t('set.narrate')} control={<Switch checked={settings.narrateTranslations} onChange={(v) => update({ narrateTranslations: v })} label={t('set.narrate')} />} />
        <SettingRow
          title={
            <span className="row" style={{ gap: 6 }}>
              <Mic size={16} /> {t('set.speechRecognition')}
            </span>
          }
          desc={srAvailable ? t('set.speechRecognitionHelp') : t('speak.recognitionUnavailable')}
          control={<Switch checked={settings.speechRecognition} onChange={(v) => update({ speechRecognition: v })} label={t('set.speechRecognition')} />}
        />
        {settings.courses.map((c) => (
          <VoicePicker key={c} lang={getCourse(c).speechLang} label={getCourse(c).name} sample={{ es: '¡Hola! ¿Qué tal?', de: "Hallo! Wie geht's?", ja: 'こんにちは。' }[c]} courseId={c} />
        ))}
        <VoicePicker lang="pl-PL" label="Polski (lektor)" sample="Dzień dobry! Tak brzmi lektor tłumaczeń." />
        {isNative() && (
          <div className="list-row">
            <button type="button" className="btn btn--outline" onClick={() => audio.openInstall()}>
              <Download size={18} /> {t('audio.installVoices')}
            </button>
          </div>
        )}
      </Section>

      {hasJa && (
        <Section icon={<Languages size={20} />} title={t('set.japanese')}>
          <div className="list-row" style={{ flexWrap: 'wrap' }}>
            <div className="list-row__body">
              <div className="list-row__title">{t('set.romaji')}</div>
              <div className="list-row__desc">{t('set.romajiHelp')}</div>
            </div>
            <Segmented<RomajiMode>
              value={settings.romaji}
              onChange={(v) => update({ romaji: v })}
              label={t('set.romaji')}
              options={[
                { value: 'auto', label: t('set.romaji.auto') },
                { value: 'always', label: t('set.romaji.always') },
                { value: 'never', label: t('set.romaji.never') },
              ]}
            />
          </div>
          <SettingRow title={t('set.furigana')} control={<Switch checked={settings.furigana} onChange={(v) => update({ furigana: v })} label={t('set.furigana')} />} />
          <SettingRow title={t('set.jaSpacing')} control={<Switch checked={settings.jaSpacing} onChange={(v) => update({ jaSpacing: v })} label={t('set.jaSpacing')} />} />
        </Section>
      )}

      <Section icon={<PenLine size={20} />} title={t('set.stylus')}>
        <SettingRow title={t('set.stylusMode')} desc={t('set.stylusModeHelp')} control={<Switch checked={settings.stylusMode} onChange={(v) => update({ stylusMode: v })} label={t('set.stylusMode')} />} />
        <SettingRow title={t('set.penOnly')} desc={t('set.penOnlyHelp')} control={<Switch checked={settings.penOnly} onChange={(v) => update({ penOnly: v })} label={t('set.penOnly')} />} />
        <SettingRow title={t('set.leftHanded')} control={<Switch checked={settings.leftHanded} onChange={(v) => update({ leftHanded: v })} label={t('set.leftHanded')} />} />
      </Section>

      <Section icon={<Bell size={20} />} title={t('set.reminders')}>
        <SettingRow
          title={t('set.remindersEnable')}
          desc={perm === 'unsupported' ? t('set.remindersUnsupported') : isNative() ? t('set.remindersNative') : t('set.remindersWeb')}
          control={<Switch checked={settings.reminders.enabled} onChange={setReminders} label={t('set.remindersEnable')} />}
        />
        {settings.reminders.enabled && (
          <>
            <div className="list-row">
              <label className="list-row__body list-row__title" htmlFor="rem-time">
                {t('set.remindersTime')}
              </label>
              <input id="rem-time" type="time" className="select" value={settings.reminders.time} onChange={(e) => update({ reminders: { ...settings.reminders, time: e.target.value } })} />
            </div>
            <div className="list-row" style={{ flexWrap: 'wrap' }}>
              <div className="list-row__body list-row__title">{t('set.remindersDays')}</div>
              <div className="row row--wrap" role="group" aria-label={t('set.remindersDays')}>
                {order.map((d) => (
                  <button key={d} type="button" className="chip" aria-pressed={settings.reminders.days.includes(d)} onClick={() => toggleDay(d)}>
                    {weekdayShort(d)}
                  </button>
                ))}
              </div>
            </div>
            <div className="list-row">
              <button type="button" className="btn btn--outline" onClick={() => sendTestReminder().catch(() => toast(t('set.remindersDenied')))}>
                {t('set.remindersTest')}
              </button>
            </div>
          </>
        )}
        {perm === 'denied' && (
          <div className="list-row">
            <Banner variant="warn">{t('set.remindersDenied')}</Banner>
          </div>
        )}
      </Section>

      <Section icon={<Smartphone size={20} />} title={t('install.title')}>
        <InstallSection />
      </Section>

      <Section icon={<Database size={20} />} title={t('set.data')}>
        <div className="list-row" style={{ flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() =>
              saveBackup()
                .then(() => toast(t('set.exportDone'), 'success'))
                .catch((e) => toast(String(e)))
            }
            data-testid="export"
          >
            <Download size={18} /> {t('set.export')}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => fileRef.current?.click()}>
            <Upload size={18} /> {t('set.import')}
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onImport(e.target.files?.[0])} data-testid="import-input" />
        </div>
        <div className="list-row">
          <button type="button" className="btn btn--ghost" style={{ color: 'var(--danger)' }} onClick={() => setResetOpen(true)}>
            <Trash2 size={18} /> {t('set.reset')}
          </button>
        </div>
        <div className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--sp-2)' }}>
          <p className="subtle">{t('set.storage')}</p>
          {persisted !== null && <p className="subtle">{persisted ? t('set.persisted') : t('set.notPersisted')}</p>}
        </div>
      </Section>

      <Section icon={<Info size={20} />} title={t('set.about')}>
        <button type="button" className="list-row" onClick={() => navigate('/about')}>
          <div className="list-row__body">
            <div className="list-row__title">
              {t('set.sources')} · {t('set.methodology')}
            </div>
            <div className="list-row__desc">
              {brand.appName} · {t('set.version', { version: appVersion })}
            </div>
          </div>
        </button>
        <div className="list-row">
          <Keyboard size={20} />
          <div className="list-row__body">
            <div className="list-row__title">{t('set.shortcuts')}</div>
            <div className="list-row__desc">{t('set.shortcutsBody')}</div>
          </div>
        </div>
      </Section>

      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} title={t('set.reset')}>
        <div className="stack">
          <p>{t('set.resetConfirm')}</p>
          <label className="visually-hidden" htmlFor="reset-confirm">
            {t('set.resetWord')}
          </label>
          <input id="reset-confirm" className="input" value={resetText} onChange={(e) => setResetText(e.target.value)} autoComplete="off" />
          <button type="button" className="btn btn--danger btn--lg" disabled={resetText.trim().toUpperCase() !== t('set.resetWord')} onClick={doReset}>
            {t('set.reset')}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
