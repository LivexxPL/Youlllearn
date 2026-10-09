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
