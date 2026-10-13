/**
 * Browser storage persistence. Without it a browser may clear a site's data when the device
 * runs low on space; Chromium grants it silently to installed or frequently used apps.
 */
import { isNative } from './platform';

const supported = () => !isNative() && typeof navigator !== 'undefined' && Boolean(navigator.storage?.persist);

/** Whether the data is protected from automatic clean-up (null: not applicable or unknown). */
export async function storagePersisted(): Promise<boolean | null> {
  if (!supported()) return null;
  try {
    return await navigator.storage.persisted();
  } catch {
    return null;
  }
}

/** Asks once per start; browsers decide by their own rules (Firefox may ask the user). */
export async function requestPersistentStorage(): Promise<boolean | null> {
  if (!supported()) return null;
  try {
    return (await navigator.storage.persisted()) || (await navigator.storage.persist());
  } catch {
    return null;
  }
}
