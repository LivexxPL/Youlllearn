import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CANCEL_SETTLE_MS, WebSpeechEngine, expectedDurationMs } from './tts';
import { AudioService, rateFor } from './index';

class FakeUtterance {
  lang = '';
  rate = 1;
  pitch = 1;
  voice: unknown = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

/**
 * Behaves like Chrome's speechSynthesis: cancelling speech that is playing is applied
 * asynchronously, and the late "interrupted" notification also removes an utterance that was
 * passed to speak() right after cancel(). Cancelling while idle has no effect.
 */
function fakeSynth() {
  const queue: FakeUtterance[] = [];
  const synth = {
    spoken: [] as FakeUtterance[],
    get speaking() {
      return queue.length > 0;
    },
    pending: false,
    speak(u: FakeUtterance) {
      synth.spoken.push(u);
      queue.push(u);
    },
    cancel() {
      if (!queue.length) return;
      setTimeout(() => {
        for (const u of queue.splice(0)) u.onerror?.({ error: 'interrupted' });
      }, 10);
    },
    getVoices: () => [],
    addEventListener: () => {},
    /** Plays the head of the queue to the end. */
    finishCurrent() {
      const u = queue.shift();
      u?.onstart?.();
      u?.onend?.();
    },
    get queue() {
      return queue;
    },
  };
  return synth;
}

function engineWith(synth: ReturnType<typeof fakeSynth>) {
  return new WebSpeechEngine(
    () => synth as unknown as SpeechSynthesis,
    FakeUtterance as unknown as typeof SpeechSynthesisUtterance,
  );
}

describe('web speech engine', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('plays the slow version when it replaces speech that is still playing', async () => {
    const synth = fakeSynth();
    const engine = engineWith(synth);
    const normal = engine.speak('¿Dónde está la estación?', { lang: 'es-ES', rate: 0.82 });
    expect(synth.spoken).toHaveLength(1);

    // Tap the turtle while the normal version is still being spoken.
    let slowDone = false;
    const slow = engine.speak('¿Dónde está la estación?', { lang: 'es-ES', rate: 0.54 }).then(() => (slowDone = true));
    await normal; // the replaced utterance settles immediately
    await vi.advanceTimersByTimeAsync(CANCEL_SETTLE_MS + 5);

    // The asynchronous cancel only hit the old utterance; the slow one was queued afterwards.
    expect(synth.spoken).toHaveLength(2);
    expect(synth.spoken[1].rate).toBe(0.54);
    expect(synth.queue).toEqual([synth.spoken[1]]);
    expect(slowDone).toBe(false);
    synth.finishCurrent();
    await slow;
    expect(slowDone).toBe(true);
  });

  it('also waits when speech was stopped just before (audio.stop() then a new line)', async () => {
    const synth = fakeSynth();
    const engine = engineWith(synth);
    void engine.speak('Erste Zeile', { lang: 'de-DE', rate: 1 });
    engine.stop();
    const next = engine.speak('Zweite Zeile', { lang: 'de-DE', rate: 1 });
    await vi.advanceTimersByTimeAsync(CANCEL_SETTLE_MS + 5);
    expect(synth.queue.map((u) => u.text)).toEqual(['Zweite Zeile']);
    synth.finishCurrent();
    await next;
  });

  it('does not start a replaced utterance after stop()', async () => {
    const synth = fakeSynth();
    const engine = engineWith(synth);
    void engine.speak('Hallo', { lang: 'de-DE', rate: 1 });
    const second = engine.speak('Hallo', { lang: 'de-DE', rate: 0.6 });
    engine.stop();
    await second;
    await vi.advanceTimersByTimeAsync(CANCEL_SETTLE_MS * 2);
    expect(synth.spoken).toHaveLength(1);
  });

  it('gives slow speech time to finish, even when the voice starts late', async () => {
    const synth = fakeSynth();
    const engine = engineWith(synth);
    let done = false;
    const p = engine.speak('毎日', { lang: 'ja-JP', rate: 0.54 }).then(() => (done = true));
    // A network voice starts speaking after 3 s.
    await vi.advanceTimersByTimeAsync(3000);
    synth.spoken[0].onstart?.();
    // "mainichi", spoken slowly, is still playing 1.5 s later: the watchdog must not end it.
    await vi.advanceTimersByTimeAsync(1500);
    expect(done).toBe(false);
    synth.spoken[0].onend?.();
    await p;
    expect(done).toBe(true);
  });

  it('still settles when an engine never reports the end', async () => {
    const synth = fakeSynth();
    const engine = engineWith(synth);
    let done = false;
    void engine.speak('Hola', { lang: 'es-ES', rate: 1 }).then(() => (done = true));
    await vi.advanceTimersByTimeAsync(20_000);
    expect(done).toBe(true);
  });
});

describe('speech rates', () => {
  it('makes slow clearly slower than normal at every listening stage', () => {
    for (const stage of [1, 2, 3] as const) {
      expect(rateFor('slow', stage) / rateFor('normal', stage), `stage ${stage}`).toBeLessThanOrEqual(0.7);
      expect(rateFor('slow', stage)).toBeGreaterThanOrEqual(0.5);
    }
    expect(rateFor('natural', 3)).toBeGreaterThan(rateFor('normal', 3));
    // The user's speed setting scales every speed but stays within engine limits.
    expect(rateFor('slow', 1, 0.5)).toBe(0.4);
  });

  it('estimates longer durations for kanji than for their character count', () => {
    expect(expectedDurationMs('毎日', 1)).toBeGreaterThan(expectedDurationMs('ab', 1) * 2);
    expect(expectedDurationMs('hola', 0.5)).toBe(expectedDurationMs('hola', 1) * 2);
  });
});

describe('voice choice', () => {
  const voices = [
    { id: 'es1', name: 'Spain A', lang: 'es-ES', local: true, isDefault: false },
    { id: 'es2', name: 'Spain B', lang: 'es-ES', local: true, isDefault: false },
    { id: 'mx1', name: 'Mexico', lang: 'es-MX', local: true, isDefault: false },
  ];
  const engine = {
    kind: 'web' as const,
    init: async () => {},
    voices: () => voices,
    speak: async () => {},
    stop: () => {},
    onVoicesChanged: () => () => {},
  };

  it('uses the voice chosen in Settings, even from another region', () => {
    const service = new AudioService(engine);
    service.configure({ voices: { es: 'mx1' }, speechRate: 1 });
    expect(service.resolve('es-ES').voice?.id).toBe('mx1');
    // A line tagged with an accent still gets a voice of that region.
    expect(service.resolve('es-ES', 'a', true).voice?.id).toBe('es1');
    expect(service.resolve('es-MX', 'a', true).voice?.id).toBe('mx1');
  });

  it('gives the second speaker a different voice when one exists', () => {
    const service = new AudioService(engine);
    service.configure({ voices: {}, speechRate: 1 });
    expect(service.resolve('es-ES').voice?.id).toBe('es1');
    expect(service.resolve('es-ES', 'b').voice?.id).toBe('es2');
  });
});
