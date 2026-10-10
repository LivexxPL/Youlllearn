import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as CapApp } from '@capacitor/app';
import '@fontsource-variable/plus-jakarta-sans';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/features.css';
import { App } from './app/App';
import { SettingsProvider, defaultSettings, loadSettings } from './state/settings';
import { setUiLang } from './i18n';
import { audio } from './services/audio';
import { activity } from './services/activity';
import { isNative } from './services/platform';
import { canGoBack, currentPath, goBack, navigate, runBackHandlers } from './app/router';
import { captureInstallPrompt, registerServiceWorker } from './services/pwa';
import type { Settings } from './services/db';

function installViewportHeight() {
  // Keeps layouts above the on-screen keyboard (visualViewport shrinks when it opens).
  const vv = window.visualViewport;
  const update = () => document.documentElement.style.setProperty('--app-height', `${Math.round(vv?.height ?? window.innerHeight)}px`);
  update();
  vv?.addEventListener('resize', update);
  window.addEventListener('resize', update);
}

function installNativeHandlers() {
  if (!isNative()) return;
  CapApp.addListener('backButton', () => {
    if (runBackHandlers()) return;
    if (currentPath() !== '/') {
      if (canGoBack()) goBack();
      else navigate('/', { replace: true });
      return;
    }
    CapApp.minimizeApp().catch(() => CapApp.exitApp());
  });
  CapApp.addListener('pause', () => {
    // Stop speech when the app is backgrounded, except in hands-free listening mode.
    if (!document.body.dataset.backgroundAudio) audio.stop();
    activity.flush();
  });
}

async function bootstrap() {
  let settings: Settings;
  let storageError = false;
  try {
    settings = await loadSettings();
  } catch (e) {
    console.error('IndexedDB unavailable', e);
    settings = defaultSettings();
    storageError = true;
  }
  setUiLang(settings.uiLang);
  installViewportHeight();
  installNativeHandlers();
  activity.install();
  audio.configure({ voices: settings.voices, speechRate: settings.speechRate });
  audio.init();
  document.addEventListener('keydown', (e) => {
    // Escape while an input method is composing (e.g. Japanese kana → kanji) belongs to the IME.
    if (e.key === 'Escape' && !e.isComposing && runBackHandlers()) e.preventDefault();
  });
  if (storageError) document.body.dataset.storageError = '1';

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SettingsProvider initial={settings}>
        <App />
      </SettingsProvider>
    </StrictMode>,
  );
  registerServiceWorker();
}

// Before anything async: the browser may offer installation right after loading.
captureInstallPrompt();
bootstrap();
