/**
 * Keeps the screen on during hands-free listening ("pocket mode"), so the
 * text-to-speech playback is not interrupted by the device sleeping.
 */
import { KeepAwake } from '@capacitor-community/keep-awake';
import { isNative } from './platform';

let sentinel: { release(): Promise<void> } | null = null;
let wanted = false;

async function requestWeb() {
  const wl = (navigator as Navigator & { wakeLock?: { request(type: 'screen'): Promise<{ release(): Promise<void> }> } }).wakeLock;
  if (!wl) return false;
  try {
    sentinel = await wl.request('screen');
    return true;
  } catch {
    return false;
  }
}

function onVisibility() {
  if (wanted && document.visibilityState === 'visible' && !isNative()) requestWeb();
}

export async function keepScreenOn(): Promise<boolean> {
  wanted = true;
  if (isNative()) {
    try {
      await KeepAwake.keepAwake();
      return true;
    } catch {
      return false;
    }
  }
  document.addEventListener('visibilitychange', onVisibility);
  return requestWeb();
}

export async function allowScreenOff() {
  wanted = false;
  if (isNative()) {
    await KeepAwake.allowSleep().catch(() => {});
    return;
  }
  document.removeEventListener('visibilitychange', onVisibility);
  await sentinel?.release().catch(() => {});
  sentinel = null;
}
