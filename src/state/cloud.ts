import { useSyncExternalStore } from 'react';
import { cloud, type CloudSnapshot } from '../services/cloud';

/** Google account and synchronisation state (re-renders on every change). */
export function useCloud(): CloudSnapshot {
  return useSyncExternalStore(cloud.subscribe, cloud.getSnapshot);
}
