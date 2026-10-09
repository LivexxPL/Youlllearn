/**
 * Extension point for recorded (human) audio.
 *
 * The MVP ships no recordings: all audio comes from the device's
 * text-to-speech voices. To add recordings, place files under
 * `public/audio/<course>/` and register them in RECORDED below, keyed by the
 * exact text that would otherwise be sent to text-to-speech. Make sure every
 * file's licence allows offline redistribution and record it in
 * CONTENT_SOURCES.md (e.g. Lingua Libre / Wikimedia Commons recordings are
 * usually CC BY-SA — attribution required).
 */
import type { CourseId } from '../../content/types';

const RECORDED: Partial<Record<CourseId, Record<string, string>>> = {};

export function recordedAudioUrl(courseId: CourseId, text: string): string | undefined {
  return RECORDED[courseId]?.[text];
}

export function recordedCount(): number {
  return Object.values(RECORDED).reduce((n, m) => n + Object.keys(m ?? {}).length, 0);
}
