/**
 * Audio facade used by the UI: picks voices, applies speed stages, plays
 * recorded audio when available, narrates Polish translations and reports
 * honestly when a voice is missing.
 */
import type { CourseId } from '../../content/types';
import { getCourse } from '../../content/registry';
import { speechText } from '../../content/text';
import { createTtsEngine, langBase, normLang, rankVoices, type TtsEngine, type VoiceInfo } from './tts';
import { recordedAudioUrl } from './recorded';

export type Speed = 'slow' | 'normal' | 'natural';
export type ListeningStage = 1 | 2 | 3;
export type VoiceSlot = 'a' | 'b';

export interface PlayOptions {
  speed?: Speed;
  /** Listening stage (gradual move from clear to natural speech). */
  stage?: ListeningStage;
  slot?: VoiceSlot;
  /** BCP-47 accent tag, e.g. es-MX. */
  accent?: string;
  /** Kind of content, used for Japanese reading choices. */
  kind?: string;
  reading?: string;
  tts?: string;
}

export interface ResolvedVoice {
  voice: VoiceInfo | null;
  /** True when the voice matches the requested region exactly. */
  exact: boolean;
  lang: string;
}

type Listener = () => void;

/**
 * Base rates per stage and speed. Values were chosen to stay intelligible on common engines.
 * Slow is always about two thirds of the normal rate of the same stage, so the slow button is
 * clearly audible as slower (a fixed slow rate was barely slower than stage-1 normal speech).
 */
export function rateFor(speed: Speed, stage: ListeningStage, userMultiplier = 1): number {
  const normal = stage === 1 ? 0.82 : stage === 2 ? 0.92 : 1;
  const base: Record<Speed, number> = {
    slow: Math.max(0.5, normal * 0.66),
    normal,
    natural: 1.05,
  };
  return Math.max(0.4, Math.min(1.6, base[speed] * userMultiplier));
}

class AudioService {
  private engine: TtsEngine = createTtsEngine();
  private ready: Promise<void> | null = null;
  private listeners = new Set<Listener>();
  private preferred: Record<string, string> = {};
  private userRate = 1;
  private playing = 0;
  private recordedEl: HTMLAudioElement | null = null;
  /** Resolvers of in-flight utterances; stop() settles them even if an engine never reports the end. */
  private pending = new Set<() => void>();
  private v = 0;

  /** Increments whenever voices or playback state change (stable snapshot for React). */
  get version() {
    return this.v;
  }

  get kind() {
    return this.engine.kind;
  }

  init(): Promise<void> {
    if (!this.ready) {
      this.ready = this.engine.init().catch((e) => console.warn('TTS init failed', e));
      this.engine.onVoicesChanged(() => this.emit());
    }
    return this.ready;
  }

  configure(opts: { voices: Record<string, string>; speechRate: number }) {
    this.preferred = opts.voices;
    this.userRate = opts.speechRate;
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }

  private emit() {
    this.v += 1;
    this.listeners.forEach((l) => l());
  }

  get isPlaying() {
    return this.playing > 0;
  }

  voicesFor(lang: string): VoiceInfo[] {
    return rankVoices(this.engine.voices(), lang);
  }

  /** Voice for a language tag, honouring the user's choice per language. */
  resolve(lang: string, slot: VoiceSlot = 'a'): ResolvedVoice {
    const ranked = this.voicesFor(lang);
    const exactRegion = ranked.filter((v) => normLang(v.lang) === normLang(lang));
    const userId = this.preferred[langBase(lang)] ?? this.preferred[lang];
    let voice: VoiceInfo | null = null;
    if (userId && exactRegion.length === 0) voice = ranked.find((v) => v.id === userId) ?? null;
    if (userId && !voice) voice = exactRegion.find((v) => v.id === userId) ?? null;
    if (!voice) {
      const list = exactRegion.length ? exactRegion : ranked;
      voice = slot === 'b' && list.length > 1 ? list[1] : (list[0] ?? null);
    }
    return { voice, exact: Boolean(voice && normLang(voice.lang) === normLang(lang)), lang };
  }

  /** 'ok' | 'missing' (engine present, no voice for the language) | 'unsupported' (no TTS at all). */
  status(lang: string): 'ok' | 'missing' | 'unsupported' | 'unknown' {
    if (this.engine.kind === 'none') return 'unsupported';
    const all = this.engine.voices();
    if (all.length === 0) return 'unknown';
    return this.voicesFor(lang).length ? 'ok' : 'missing';
  }

  /** Speaks target-language text for a course. Resolves when finished. */
  async say(courseId: CourseId, x: string | { text: string; tts?: string; reading?: string; kind?: string }, opts: PlayOptions = {}): Promise<void> {
    const course = getCourse(courseId);
    const content = typeof x === 'string' ? { text: x } : x;
    const text = speechText(courseId, { text: content.text, tts: content.tts, reading: content.reading, kind: content.kind });
    const lang = opts.accent ?? course.speechLang;
    const rate = rateFor(opts.speed ?? 'normal', opts.stage ?? 1, this.userRate);
    const url = recordedAudioUrl(courseId, text);
    if (url) return this.playUrl(url, rate);
    return this.speakRaw(text, lang, rate, opts.slot ?? 'a');
  }

  /** Speaks Polish (translations / narration in Audio Quest). */
  sayPolish(text: string): Promise<void> {
    return this.speakRaw(text.replace(/[;/]/g, ', '), 'pl-PL', rateFor('normal', 3, this.userRate), 'a');
  }

  async speakRaw(text: string, lang: string, rate: number, slot: VoiceSlot) {
    await this.init();
    // The new utterance replaces any that is still playing (engines flush their queue). Settle
    // the old ones so their callers continue and the playing counter cannot get stuck; the
    // Android engine does not always report the end of a flushed utterance.
    for (const settle of [...this.pending]) settle();
    const { voice } = this.resolve(lang, slot);
    // With a single voice, a slight pitch change helps tell two speakers apart.
    const sameVoiceForB = slot === 'b' && this.voicesFor(lang).length < 2;
    this.playing += 1;
    this.emit();
    try {
      await new Promise<void>((resolve, reject) => {
        const settle = () => {
          this.pending.delete(settle);
          resolve();
        };
        this.pending.add(settle);
        this.engine
          .speak(text, { lang: voice?.lang ?? lang, rate, voiceId: voice?.id, pitch: sameVoiceForB ? 0.8 : 1 })
          .then(settle, (e: unknown) => {
            this.pending.delete(settle);
            reject(e);
          });
      });
    } finally {
      this.playing = Math.max(0, this.playing - 1);
      this.emit();
    }
  }

  private playUrl(url: string, rate: number): Promise<void> {
    this.stop();
    return new Promise((resolve, reject) => {
      const el = new Audio(url);
      el.playbackRate = rate;
      (el as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
      this.recordedEl = el;
      this.playing += 1;
      this.emit();
      let finished = false;
      const settle = (error?: Error) => {
        if (finished) return;
        finished = true;
        this.playing = Math.max(0, this.playing - 1);
        this.emit();
        if (error) reject(error);
        else resolve();
      };
      el.onended = () => settle();
      el.onpause = () => settle();
      el.onerror = () => settle(new Error('audio-error'));
      el.play().catch((e: unknown) => settle(e instanceof Error ? e : new Error(String(e))));
    });
  }

  stop() {
    this.engine.stop();
    for (const settle of [...this.pending]) settle();
    if (this.recordedEl) {
      this.recordedEl.pause();
      this.recordedEl = null;
    }
  }

  async openInstall() {
    await this.engine.openInstall?.();
  }
}

export const audio = new AudioService();

/** Small helper for pauses in audio sequences that can be cancelled. */
export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      resolve();
    });
  });
}
