/**
 * Small sensory feedback: synthesized sound effects (Web Audio API — no
 * audio files needed) and haptics. Both respect the user's settings.
 */
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { isNative } from './platform';

let ctx: AudioContext | null = null;
let soundsOn = true;
let hapticsOn = true;

export function configureFeedback(opts: { sounds: boolean; haptics: boolean }) {
  soundsOn = opts.sounds;
  hapticsOn = opts.haptics;
}

function audioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.12) {
  const c = audioCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export type Cue = 'correct' | 'almost' | 'wrong' | 'complete' | 'tap' | 'reward';

export function cue(kind: Cue) {
  if (soundsOn) {
    switch (kind) {
      case 'correct':
        tone(660, 0, 0.12, 'triangle');
        tone(990, 0.09, 0.18, 'triangle');
        break;
      case 'almost':
        tone(660, 0, 0.14, 'triangle');
        tone(740, 0.1, 0.16, 'triangle', 0.08);
        break;
      case 'wrong':
        // Soft, low and short — informative, not punishing.
        tone(330, 0, 0.18, 'sine', 0.08);
        tone(294, 0.12, 0.2, 'sine', 0.06);
        break;
      case 'complete':
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.1));
        break;
      case 'reward':
        [784, 988, 1175].forEach((f, i) => tone(f, i * 0.07, 0.18, 'triangle', 0.09));
        break;
      case 'tap':
        tone(880, 0, 0.04, 'sine', 0.04);
        break;
    }
  }
  if (hapticsOn) haptic(kind);
}

function haptic(kind: Cue) {
  if (isNative()) {
    if (kind === 'correct' || kind === 'tap') Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    else if (kind === 'wrong') Haptics.notification({ type: NotificationType.Warning }).catch(() => {});
    else if (kind === 'complete' || kind === 'reward') Haptics.notification({ type: NotificationType.Success }).catch(() => {});
    return;
  }
  if ('vibrate' in navigator && (kind === 'wrong' || kind === 'complete')) {
    try {
      navigator.vibrate(kind === 'wrong' ? [20, 40, 20] : 30);
    } catch {
      /* ignore */
    }
  }
}
