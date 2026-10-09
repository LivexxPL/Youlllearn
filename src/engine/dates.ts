/** Local-calendar date helpers. Day keys are `YYYY-MM-DD` in the device's time zone. */

export const DAY_MS = 24 * 60 * 60 * 1000;

export function dayKey(date: Date | number = Date.now()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, delta: number): string {
  const d = parseDayKey(key);
  d.setDate(d.getDate() + delta);
  return dayKey(d);
}

/** Whole calendar days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  const da = parseDayKey(a);
  const db = parseDayKey(b);
  return Math.round((db.getTime() - da.getTime()) / DAY_MS);
}

/** Monday-based ISO week id, e.g. `2026-W41`. */
export function weekKey(date: Date | number = Date.now()): string {
  const d = new Date(typeof date === 'number' ? date : date.getTime());
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (target.getUTCDay() + 6) % 7; // Monday = 0
  target.setUTCDate(target.getUTCDate() - dayNum + 3); // Thursday of this week
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const week =
    1 + Math.round(((target.getTime() - firstThursday.getTime()) / DAY_MS - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Day keys Monday..Sunday of the week containing `key`. */
export function weekDays(key: string): string[] {
  const d = parseDayKey(key);
  const offset = (d.getDay() + 6) % 7;
  const monday = addDays(key, -offset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function lastNDays(key: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(key, i - n + 1));
}
