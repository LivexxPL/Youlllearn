import { lazy, Suspense, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Nav } from './Nav';
import { navigate, useRoute } from './router';
import { useSettings } from '../state/settings';
import { ToastProvider, useToast } from '../components/Toasts';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { db } from '../services/db';
import { isDue } from '../engine/srs';
import { audio } from '../services/audio';
import { configureFeedback } from '../services/feedback';
import { t } from '../i18n';
import { detectComeback, refreshAchievements, setFlag, updateStreak } from '../services/progress';
import { HomeScreen } from '../features/home/HomeScreen';
import { LearnScreen } from '../features/learn/LearnScreen';
import { OnboardingScreen } from '../features/onboarding/OnboardingScreen';
import { useDayKey } from '../state/hooks';
import { rescheduleReminders } from '../services/notifications';
import { formatDate } from '../i18n';
import { parseDayKey } from '../engine/dates';
import { Shield, Sunrise } from 'lucide-react';

const LessonScreen = lazy(() => import('../features/lesson/LessonScreen'));
const ReviewScreen = lazy(() => import('../features/review/ReviewScreen'));
const ReviewSessionScreen = lazy(() => import('../features/review/ReviewSessionScreen'));
const AudioQuestScreen = lazy(() => import('../features/audio/AudioQuestScreen'));
const AudioSessionScreen = lazy(() => import('../features/audio/AudioSessionScreen'));
const ProgressScreen = lazy(() => import('../features/progress/ProgressScreen'));
const SettingsScreen = lazy(() => import('../features/settings/SettingsScreen'));
const AboutScreen = lazy(() => import('../features/settings/AboutScreen'));
const WritingHub = lazy(() => import('../features/writing/WritingHub'));
const WritingPractice = lazy(() => import('../features/writing/WritingPractice'));
const KanaChart = lazy(() => import('../features/writing/KanaChart'));
const NotesScreen = lazy(() => import('../features/writing/NotesScreen'));

const IMMERSIVE = new Set(['lesson', 'onboarding', 'notes']);

function isImmersive(segments: string[]): boolean {
  const [a, b] = segments;
  if (IMMERSIVE.has(a)) return true;
  if (a === 'review' && b === 'session') return true;
  if (a === 'audio' && b) return true;
  if (a === 'write' && segments.length >= 3) return true;
  return false;
}

function Screen() {
  const route = useRoute();
  const [a, b, c] = route.segments;
  switch (a) {
    case undefined:
      return <HomeScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'learn':
      return <LearnScreen />;
    case 'lesson':
      return <LessonScreen lessonId={b} />;
    case 'review':
      return b === 'session' ? <ReviewSessionScreen query={route.query} /> : <ReviewScreen />;
    case 'audio':
      return b ? <AudioSessionScreen mode={b} query={route.query} /> : <AudioQuestScreen />;
    case 'progress':
      return <ProgressScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'about':
      return <AboutScreen />;
    case 'write':
      return b && c ? <WritingPractice set={b} char={c} /> : <WritingHub />;
    case 'kana':
      return <KanaChart />;
    case 'notes':
      return <NotesScreen lessonId={b} />;
    default:
      return <HomeScreen />;
  }
}

function useBackgroundTasks() {
  const { settings } = useSettings();
  const toast = useToast();
  const today = useDayKey();

  useEffect(() => {
    audio.configure({ voices: settings.voices, speechRate: settings.speechRate });
  }, [settings.voices, settings.speechRate]);

  useEffect(() => {
    configureFeedback({ sounds: settings.sounds, haptics: settings.haptics });
  }, [settings.sounds, settings.haptics]);

  useEffect(() => {
    rescheduleReminders(settings).catch(() => {});
  }, [settings.reminders, settings]);

  // Streak bookkeeping once per day (and on start).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const comeback = await detectComeback(today);
      const r = await updateStreak(today);
      if (cancelled) return;
      for (const d of r.usedShields) toast(t('streak.shieldUsed', { date: formatDate(parseDayKey(d)) }), 'default', <Shield size={18} />);
      if (comeback) {
        await setFlag('comeback');
        toast(t('home.comeback'), 'success', <Sunrise size={18} />);
      }
      const fresh = await refreshAchievements();
      for (const a of fresh) toast(t('ach.unlocked', { name: t(`ach.${a.id}` as never) }), 'reward');
    })().catch((e) => console.warn(e));
    return () => {
      cancelled = true;
    };
  }, [today, toast]);
}

function Shell() {
  const route = useRoute();
  const { settings } = useSettings();
  const immersive = isImmersive(route.segments);
  const cards = useLiveQuery(() => db.cards.where('courseId').equals(settings.activeCourse).toArray(), [settings.activeCourse]);
  const due = useMemo(() => (cards ? cards.filter((c) => isDue(c, Date.now())).length : 0), [cards]);
  useBackgroundTasks();

  useEffect(() => {
    if (!settings.onboarded && route.segments[0] !== 'onboarding') navigate('/onboarding', { replace: true });
  }, [settings.onboarded, route.segments]);

  return (
    <div className={`app${immersive ? ' app--immersive' : ''}`}>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        {t('nav.skipToContent')}
      </a>
      {!immersive && <Nav reviewBadge={due} />}
      <main id="main" className="app__main" tabIndex={-1}>
        <ErrorBoundary key={route.path}>
          <Suspense fallback={<div className="page"><p className="muted">{t('common.loading')}</p></div>}>
            <Screen />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
