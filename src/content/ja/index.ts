import type { CourseDefinition } from '../types';
import { unitHiragana } from './unit-hiragana';
import { unitKatakana } from './unit-katakana';
import { unitConversation } from './unit-conversation';
import { unitDaily } from './unit-daily';
import { stories } from './stories';

/** Lessons whose completion switches romaji off in "auto" mode. */
export const HIRAGANA_LESSONS = ['ja.l01', 'ja.l02', 'ja.l03', 'ja.l04', 'ja.l05', 'ja.l06', 'ja.l07'];
export const KATAKANA_LESSONS = ['ja.l08', 'ja.l09', 'ja.l10'];

export const japanese: CourseDefinition = {
  id: 'ja',
  name: 'Japoński',
  nativeName: '日本語',
  speechLang: 'ja-JP',
  accents: [{ id: 'ja-JP', label: 'Japonia (standard tokijski)', speechLang: 'ja-JP' }],
  color: 'var(--lang-ja)',
  emblem: '日',
  description:
    'Osobny program dla japońskiego: hiragana i katakana z pisaniem, rytm mor, partykuły, formy です / ます i pierwsze 29 kanji z czytaniami.',
  framework: 'Kana + JF Standard A1 (orientacyjnie zbliżone do JLPT N5)',
  units: [unitHiragana, unitKatakana, unitConversation, unitDaily],
  stories,
};
