/**
 * Study reminders.
 *
 * - Android: real local notifications via @capacitor/local-notifications,
 *   scheduled weekly for each chosen day; they fire even when the app is closed.
 * - Web: browsers cannot schedule notifications for a closed page without a
 *   push server, so reminders only appear while the app/tab is open. The UI
 *   states this limitation explicitly.
 *
 * Messages suggest small, achievable actions — never guilt or pressure.
 */
import { LocalNotifications, Weekday } from '@capacitor/local-notifications';
import { isNative } from './platform';
import type { Settings } from './db';
import { t, type MessageKey } from '../i18n';
import { brand } from '../config/brand';

const BASE_ID = 7100;
const MESSAGE_KEYS: MessageKey[] = ['notif.1', 'notif.2', 'notif.3', 'notif.4', 'notif.5', 'notif.6', 'notif.7'];
const WEEKDAYS = [Weekday.Sunday, Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday, Weekday.Saturday];

export type ReminderPermission = 'granted' | 'denied' | 'prompt' | 'unsupported';

export async function reminderPermission(): Promise<ReminderPermission> {
  if (isNative()) {
    const p = await LocalNotifications.checkPermissions();
    return p.display === 'granted' ? 'granted' : p.display === 'denied' ? 'denied' : 'prompt';
  }
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission === 'default' ? 'prompt' : Notification.permission;
}

export async function requestReminderPermission(): Promise<ReminderPermission> {
  if (isNative()) {
    const p = await LocalNotifications.requestPermissions();
    return p.display === 'granted' ? 'granted' : 'denied';
  }
  if (typeof Notification === 'undefined') return 'unsupported';
  const r = await Notification.requestPermission();
  return r === 'default' ? 'prompt' : r;
}

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: Number.isFinite(h) ? h : 19, minute: Number.isFinite(m) ? m : 0 };
}

export function reminderMessage(dayIndex: number): string {
  return t(MESSAGE_KEYS[dayIndex % MESSAGE_KEYS.length]);
}

let webTimer: ReturnType<typeof setInterval> | null = null;
let lastWebFire = '';

export async function rescheduleReminders(settings: Settings): Promise<void> {
  const { enabled, time, days } = settings.reminders;
  if (isNative()) {
    const pending = await LocalNotifications.getPending();
    const ours = pending.notifications.filter((n) => n.id >= BASE_ID && n.id < BASE_ID + 7);
    if (ours.length) await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });
    if (!enabled || (await reminderPermission()) !== 'granted') return;
    const { hour, minute } = parseTime(time);
    await LocalNotifications.schedule({
      notifications: days.map((d) => ({
        id: BASE_ID + d,
        title: brand.appName,
        body: reminderMessage(d),
        schedule: { on: { weekday: WEEKDAYS[d], hour, minute }, allowWhileIdle: true, repeats: true },
        smallIcon: 'ic_stat_polyglot',
      })),
    });
    return;
  }
  // Web fallback: in-page check every 30 s while the app is open.
  if (webTimer) clearInterval(webTimer);
  webTimer = null;
  if (!enabled || typeof Notification === 'undefined') return;
  webTimer = setInterval(() => {
    const now = new Date();
    const { hour, minute } = parseTime(time);
    const key = `${now.toDateString()}`;
    if (!days.includes(now.getDay()) || lastWebFire === key) return;
    if (now.getHours() === hour && now.getMinutes() === minute && Notification.permission === 'granted') {
      lastWebFire = key;
      showWebNotification(reminderMessage(now.getDay()));
    }
  }, 30_000);
}

function showWebNotification(body: string) {
  navigator.serviceWorker?.getRegistration?.().then((reg) => {
    if (reg) reg.showNotification(brand.appName, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' });
    else new Notification(brand.appName, { body, icon: 'icons/icon-192.png' });
  }).catch(() => new Notification(brand.appName, { body }));
}

export async function sendTestReminder(): Promise<void> {
  const body = reminderMessage(new Date().getDay());
  if (isNative()) {
    await LocalNotifications.schedule({
      notifications: [{ id: BASE_ID + 50, title: brand.appName, body, schedule: { at: new Date(Date.now() + 3000) }, smallIcon: 'ic_stat_polyglot' }],
    });
    return;
  }
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') showWebNotification(body);
}
