/**
 * Active-learning time tracker.
 *
 * Counts a second as "active" only when a learning activity is open AND the
 * learner interacted within the last IDLE_MS, or audio is playing in a
 * listening activity. Time the app is merely open is counted separately
 * (openSec) and shown for transparency, never towards the daily goal.
 */
import type { CourseId } from '../content/types';
import { addStats } from './progress';

export type ActivityKind = 'lesson' | 'review' | 'audio' | 'writing';

const IDLE_MS = 60_000;
const FLUSH_EVERY = 5;

class ActivityTracker {
  private kind: ActivityKind | null = null;
  private courseId: CourseId | undefined;
  private lastInteraction = 0;
  private listening = false;
  private pending = { activeSec: 0, listeningSec: 0, openSec: 0 };
  private ticks = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<(sessionActive: number) => void>();
  private sessionActive = 0;

  install() {
    if (this.timer || typeof window === 'undefined') return;
    this.timer = setInterval(() => this.tick(), 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    });
    window.addEventListener('pagehide', () => this.flush());
  }

  start(kind: ActivityKind, courseId?: CourseId) {
    this.kind = kind;
    this.courseId = courseId;
    this.lastInteraction = Date.now();
    this.sessionActive = 0;
  }

  stop() {
    this.flush();
    this.kind = null;
    this.listening = false;
  }

  ping() {
    this.lastInteraction = Date.now();
  }

  setListening(on: boolean) {
    this.listening = on;
    if (on) this.ping();
  }

  get currentSessionSeconds() {
    return this.sessionActive;
  }

  subscribe(cb: (sessionActive: number) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private tick() {
    const visible = document.visibilityState === 'visible';
    if (visible) this.pending.openSec += 1;
    if (this.kind) {
      const interacting = visible && Date.now() - this.lastInteraction < IDLE_MS;
      // Listening counts even with the screen off/in background (pocket mode).
      if (interacting || this.listening) {
        this.pending.activeSec += 1;
        this.sessionActive += 1;
        this.listeners.forEach((l) => l(this.sessionActive));
      }
      if (this.listening) this.pending.listeningSec += 1;
    }
    this.ticks += 1;
    if (this.ticks % FLUSH_EVERY === 0) this.flush();
  }

  flush() {
    const p = this.pending;
    if (!p.activeSec && !p.listeningSec && !p.openSec) return;
    this.pending = { activeSec: 0, listeningSec: 0, openSec: 0 };
    addStats(p, p.activeSec ? this.courseId : undefined).catch((e) => console.warn('stats flush failed', e));
  }
}

export const activity = new ActivityTracker();
