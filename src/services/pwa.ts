/**
 * Service worker registration for the web build (offline support).
 * The native build does not register a service worker: all files are inside the APK.
 */
import { buildTarget } from './platform';

type Listener = () => void;
let updateReady = false;
let doUpdate: ((reload?: boolean) => Promise<void>) | null = null;
const listeners = new Set<Listener>();

export function registerServiceWorker() {
  if (buildTarget !== 'web' || !('serviceWorker' in navigator) || import.meta.env.DEV) return;
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      doUpdate = registerSW({
        immediate: true,
        onNeedRefresh() {
          updateReady = true;
          listeners.forEach((l) => l());
        },
      });
    })
    .catch((e) => console.warn('SW registration failed', e));
}

export function isUpdateReady() {
  return updateReady;
}

export function onUpdateReady(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function applyUpdate() {
  doUpdate?.(true);
}

// ---------------------------------------------------------------------------
// Installing the web app ("Add to Home screen")

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let installEvent: BeforeInstallPromptEvent | null = null;
let installedHere = false;
const installListeners = new Set<Listener>();

/**
 * Keeps the browser's install prompt (Chrome, Edge, Samsung Internet) so the app can offer its
 * own "Install" button. Call early: the event may fire right after the page loads.
 */
export function captureInstallPrompt() {
  if (buildTarget !== 'web' || typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e as BeforeInstallPromptEvent;
    installListeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    installedHere = true;
    installListeners.forEach((l) => l());
  });
}

export function canPromptInstall(): boolean {
  return installEvent !== null;
}

/** Shows the browser's install dialog; resolves to true when the app was installed. */
export async function promptInstall(): Promise<boolean> {
  const e = installEvent;
  if (!e) return false;
  installEvent = null;
  // prompt() rejects when the browser refuses to show the dialog (e.g. it was already used).
  const choice = await e
    .prompt()
    .then(() => e.userChoice)
    .catch(() => ({ outcome: 'dismissed' as const }));
  installListeners.forEach((l) => l());
  return choice.outcome === 'accepted';
}

export function onInstallChange(l: Listener): () => void {
  installListeners.add(l);
  return () => {
    installListeners.delete(l);
  };
}

/** True when the web app runs installed (from the home screen) or was just installed from this tab. */
export function isStandalone(): boolean {
  if (installedHere) return true;
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Device family for install instructions (iPhone/iPad have no install prompt, only "Add to Home Screen"). */
export function installPlatform(userAgent: string, maxTouchPoints = 0): 'ios' | 'android' | 'other' {
  if (/iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return 'other';
}
