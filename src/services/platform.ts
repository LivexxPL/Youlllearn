import { Capacitor } from '@capacitor/core';

export const isNative = (): boolean => Capacitor.isNativePlatform();
export const platform = (): 'android' | 'ios' | 'web' => Capacitor.getPlatform() as 'android' | 'ios' | 'web';
export const isAndroid = (): boolean => platform() === 'android';

export const appVersion: string = __APP_VERSION__;
export const buildTarget: 'native' | 'web' = __BUILD_TARGET__;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

/** True on devices whose primary pointer is coarse (touch). */
export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
}
