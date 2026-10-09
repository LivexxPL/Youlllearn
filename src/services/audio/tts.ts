/**
 * Text-to-speech engines.
 *
 * - Web: Web Speech API (`speechSynthesis`). Voices come from the browser /
 *   operating system; some are local (work offline), some are network voices.
 * - Native (Android): @capacitor-community/text-to-speech, which uses the
 *   Android TextToSpeech service. Android System WebView does not implement
 *   `speechSynthesis`, so the native plugin is required there.
 *
 * Both engines resolve `speak()` when the utterance has finished, which lets
 * the Audio Quest player sequence phrases, pauses and translations.
 */
import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';
import { isNative } from '../platform';

export interface VoiceInfo {
  id: string;
  name: string;
  lang: string;
  local: boolean;
  isDefault: boolean;
}

export interface SpeakOptions {
  lang: string;
  rate: number;
  pitch?: number;
  voiceId?: string;
}

export interface TtsEngine {
  readonly kind: 'web' | 'native' | 'none';
  init(): Promise<void>;
  voices(): VoiceInfo[];
  speak(text: string, opts: SpeakOptions): Promise<void>;
  stop(): void;
  openInstall?(): Promise<void>;
  onVoicesChanged(cb: () => void): () => void;
}

export function normLang(lang: string): string {
  return lang.replace('_', '-').toLowerCase();
}

export function langBase(lang: string): string {
  return normLang(lang).split('-')[0];
}

/** Ranks voices for a language tag: exact region, then same language; local and higher quality first. */
export function rankVoices(voices: VoiceInfo[], lang: string): VoiceInfo[] {
  const want = normLang(lang);
  const base = langBase(lang);
  const score = (v: VoiceInfo) => {
    const l = normLang(v.lang);
    let s = 0;
    if (l === want) s += 100;
    else if (langBase(l) === base) s += 50;
    else return -1;
    if (/natural|neural|premium|enhanced|wavenet|google/i.test(v.name)) s += 10;
    if (v.local) s += 5;
    if (v.isDefault) s += 2;
    return s;
  };
  return voices
    .map((v) => ({ v, s: score(v) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.v);
}

// ---------------------------------------------------------------------------

class WebSpeechEngine implements TtsEngine {
  readonly kind = 'web' as const;
  private list: VoiceInfo[] = [];
  private raw: SpeechSynthesisVoice[] = [];
  private listeners = new Set<() => void>();
  private current: { resolve: () => void } | null = null;

  async init() {
    const synth = window.speechSynthesis;
    const load = () => {
      this.raw = synth.getVoices();
      this.list = this.raw.map((v) => ({ id: v.voiceURI, name: v.name, lang: v.lang, local: v.localService, isDefault: v.default }));
      this.listeners.forEach((l) => l());
    };
    load();
    synth.addEventListener?.('voiceschanged', load);
    if (this.list.length === 0) {
      // Some browsers populate voices asynchronously without firing the event reliably.
      await new Promise((r) => setTimeout(r, 400));
      load();
    }
  }

  voices() {
    return this.list;
  }

  onVoicesChanged(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  speak(text: string, opts: SpeakOptions): Promise<void> {
    const synth = window.speechSynthesis;
    this.stop();
    return new Promise<void>((resolve, reject) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts.lang;
      u.rate = opts.rate;
      u.pitch = opts.pitch ?? 1;
      const voice = this.raw.find((v) => v.voiceURI === opts.voiceId);
      if (voice) u.voice = voice;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(watchdog);
        this.current = null;
        resolve();
      };
      // Watchdog: some engines never fire `end` (e.g. after the tab was backgrounded).
      const watchdog = setTimeout(finish, 1500 + (text.length * 160) / Math.max(0.4, opts.rate));
      u.onend = finish;
      u.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') finish();
        else {
          done = true;
          clearTimeout(watchdog);
          reject(new Error(e.error));
        }
      };
      this.current = { resolve: finish };
      synth.speak(u);
    });
  }

  stop() {
    const cur = this.current;
    this.current = null;
    window.speechSynthesis.cancel();
    cur?.resolve();
  }
}

class NativeTtsEngine implements TtsEngine {
  readonly kind = 'native' as const;
  private list: VoiceInfo[] = [];
  private listeners = new Set<() => void>();

  async init() {
    try {
      const { voices } = await TextToSpeech.getSupportedVoices();
      this.list = voices.map((v, i) => ({
        // The plugin selects voices by index on Android.
        id: String(i),
        name: v.name,
        lang: v.lang,
        local: v.localService,
        isDefault: v.default,
      }));
    } catch {
      this.list = [];
    }
    if (this.list.length === 0) {
      try {
        const { languages } = await TextToSpeech.getSupportedLanguages();
        this.list = languages.map((lang) => ({ id: `lang:${lang}`, name: lang, lang, local: true, isDefault: false }));
      } catch {
        /* no engine */
      }
    }
    this.listeners.forEach((l) => l());
  }

  voices() {
    return this.list;
  }

  onVoicesChanged(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async speak(text: string, opts: SpeakOptions) {
    const index = opts.voiceId && !opts.voiceId.startsWith('lang:') ? Number(opts.voiceId) : undefined;
    await TextToSpeech.speak({
      text,
      lang: opts.lang,
      rate: opts.rate,
      pitch: opts.pitch ?? 1,
      volume: 1,
      voice: Number.isFinite(index) ? index : undefined,
      category: 'playback',
      queueStrategy: QueueStrategy.Flush,
    });
  }

  stop() {
    TextToSpeech.stop().catch(() => {});
  }

  async openInstall() {
    await TextToSpeech.openInstall();
  }
}

class NoTtsEngine implements TtsEngine {
  readonly kind = 'none' as const;
  async init() {}
  voices() {
    return [];
  }
  async speak() {
    throw new Error('tts-unavailable');
  }
  stop() {}
  onVoicesChanged() {
    return () => {};
  }
}

export function createTtsEngine(): TtsEngine {
  if (isNative()) return new NativeTtsEngine();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) return new WebSpeechEngine();
  return new NoTtsEngine();
}
