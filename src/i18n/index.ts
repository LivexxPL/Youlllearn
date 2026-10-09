/**
 * Interface translations.
 *
 * - Polish (`pl`) is the source catalogue and defines the set of keys.
 * - Another interface language is added by creating a catalogue typed as
 *   `Catalog` (missing keys fall back to Polish) and registering it below.
 * - Messages can contain `{param}` placeholders and plural forms resolved with
 *   Intl.PluralRules (Polish needs one/few/many).
 *
 * UI copy uses gender-neutral Polish (present tense / impersonal forms) so it
 * addresses every learner correctly without asking for their gender.
 */
import { pl } from './pl';

export type MessageKey = keyof typeof pl;
export type PluralMessage = { one: string; few?: string; many?: string; other: string };
export type Message = string | PluralMessage;
export type Catalog = Partial<Record<MessageKey, Message>>;
export type UiLangCode = 'pl';

const catalogs: Record<UiLangCode, Catalog> = { pl };
const locales: Record<UiLangCode, string> = { pl: 'pl-PL' };

let current: UiLangCode = 'pl';
let pluralRules = new Intl.PluralRules(locales[current]);

export function setUiLang(lang: UiLangCode) {
  current = lang;
  pluralRules = new Intl.PluralRules(locales[lang]);
  document.documentElement.lang = lang;
}

export function getUiLang(): UiLangCode {
  return current;
}

export function getLocale(): string {
  return locales[current];
}

export type Params = Record<string, string | number>;

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (m, name: string) => {
    const v = params[name];
    if (v === undefined) return m;
    return typeof v === 'number' ? formatNumber(v) : v;
  });
}

export function t(key: MessageKey, params?: Params): string {
  const msg: Message | undefined = catalogs[current][key] ?? (pl as Catalog)[key];
  if (msg === undefined) return key;
  if (typeof msg === 'string') return interpolate(msg, params);
  const count = Number(params?.count ?? 0);
  const category = Number.isInteger(count) ? pluralRules.select(count) : 'other';
  const form = (msg as Record<string, string | undefined>)[category] ?? msg.other;
  return interpolate(form, params);
}

export function formatNumber(n: number, digits = 0): string {
  return new Intl.NumberFormat(locales[current], { maximumFractionDigits: digits }).format(n);
}

export function formatPercent(fraction: number): string {
  return new Intl.NumberFormat(locales[current], { style: 'percent', maximumFractionDigits: 0 }).format(fraction);
}

export function formatDate(date: Date | number, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }): string {
  return new Intl.DateTimeFormat(locales[current], opts).format(date);
}

export function weekdayShort(dayIndex: number): string {
  // 2023-01-01 was a Sunday.
  const d = new Date(2023, 0, 1 + dayIndex);
  return new Intl.DateTimeFormat(locales[current], { weekday: 'short' }).format(d);
}

/** "12 min" / "1 h 5 min" */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return t('unit.secShort', { count: Math.max(0, Math.round(seconds)) });
  const min = Math.round(seconds / 60);
  if (min < 60) return t('unit.minShort', { count: min });
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${t('unit.hourShort', { count: h })} ${t('unit.minShort', { count: m })}` : t('unit.hourShort', { count: h });
}
