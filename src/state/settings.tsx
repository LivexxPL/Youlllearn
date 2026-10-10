import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { SystemBars, SystemBarsStyle } from '@capacitor/core';
import { db, type Settings } from '../services/db';
import { isNative, prefersDark, prefersReducedMotion } from '../services/platform';
import { applyAppearance, type Appearance } from '../services/appearance';
import { PALETTE_IDS } from '../config/palettes';
import { setUiLang } from '../i18n';
import { COURSE_IDS } from '../content/types';

export const TEXT_SCALES = [0.9, 1, 1.15, 1.3] as const;
export const SETTINGS_SCHEMA = 1;

export function defaultSettings(now = Date.now()): Settings {
  return {
    id: 'app',
    schema: SETTINGS_SCHEMA,
    uiLang: 'pl',
    onboarded: false,
    activeCourse: 'es',
    courses: ['es'],
    dailyGoalMin: 10,
    theme: 'system',
    palette: 'classic',
    bgPattern: true,
    textScale: 1,
    motion: 'system',
    sounds: true,
    haptics: true,
    autoplayAudio: true,
    speechRate: 1,
    narrateTranslations: true,
    voices: {},
    // Off by default: browser speech recognition usually sends audio to a cloud service.
    speechRecognition: false,
    romaji: 'auto',
    furigana: true,
    jaSpacing: true,
    stylusMode: false,
    penOnly: false,
    leftHanded: false,
    brushSize: 0.04,
    reminders: { enabled: false, time: '19:00', days: [1, 2, 3, 4, 5, 6, 0] },
    profileSeed: Math.random().toString(36).slice(2, 10),
    createdAt: now,
  };
}

/** Merges stored settings with defaults so new fields get sensible values after updates. */
export function migrateSettings(stored: Partial<Settings> | undefined): Settings {
  const base = defaultSettings();
  if (!stored) return base;
  const merged: Settings = { ...base, ...stored, reminders: { ...base.reminders, ...stored.reminders }, voices: { ...stored.voices } };
  if (!COURSE_IDS.includes(merged.activeCourse)) merged.activeCourse = 'es';
  merged.courses = (merged.courses ?? []).filter((c) => COURSE_IDS.includes(c));
  if (merged.courses.length === 0) merged.courses = [merged.activeCourse];
  // A backup from a newer version may name a palette this version does not have.
  if (!PALETTE_IDS.includes(merged.palette)) merged.palette = 'classic';
  merged.schema = SETTINGS_SCHEMA;
  return merged;
}

/** What the display looks like for these settings and the system preferences. */
export function appearanceFor(s: Settings, systemDark = prefersDark(), systemReduce = prefersReducedMotion()): Appearance {
  return {
    theme: s.theme === 'system' ? (systemDark ? 'dark' : 'light') : s.theme,
    motion: s.motion === 'system' ? (systemReduce ? 'reduce' : 'full') : s.motion,
    textScale: s.textScale,
    palette: s.palette,
    pattern: s.bgPattern,
  };
}

export async function loadSettings(): Promise<Settings> {
  const stored = await db.settings.get('app');
  const s = migrateSettings(stored);
  if (!stored) await db.settings.put(s);
  return s;
}

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  /** Replaces settings entirely (used after data import/reset). */
  replace: (s: Settings) => void;
  resolvedTheme: 'light' | 'dark';
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ initial, children }: { initial: Settings; children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(initial);
  const [systemDark, setSystemDark] = useState(prefersDark());
  const [systemReduce, setSystemReduce] = useState(prefersReducedMotion());

  useEffect(() => {
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)');
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onDark = () => setSystemDark(dark.matches);
    const onMotion = () => setSystemReduce(motion.matches);
    dark?.addEventListener('change', onDark);
    motion?.addEventListener('change', onMotion);
    return () => {
      dark?.removeEventListener('change', onDark);
      motion?.removeEventListener('change', onMotion);
    };
  }, []);

  const appearance = appearanceFor(settings, systemDark, systemReduce);
  const resolvedTheme = appearance.theme;
  const { motion, textScale, palette, pattern } = appearance;

  // Before paint, so that switching palettes never shows a frame in the old colours.
  useLayoutEffect(() => {
    applyAppearance({ theme: resolvedTheme, motion, textScale, palette, pattern });
    if (isNative()) {
      SystemBars.setStyle({ style: resolvedTheme === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
    }
  }, [resolvedTheme, motion, textScale, palette, pattern]);

  useEffect(() => {
    setUiLang(settings.uiLang);
  }, [settings.uiLang]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      db.settings.put(next).catch((e) => console.error('Saving settings failed', e));
      return next;
    });
  }, []);

  const replace = useCallback((s: Settings) => {
    setSettings(s);
  }, []);

  const value = useMemo(() => ({ settings, update, replace, resolvedTheme }), [settings, update, replace, resolvedTheme]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings outside SettingsProvider');
  return ctx;
}
