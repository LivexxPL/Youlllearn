import type { CourseDefinition } from '../types';
import { unitHiragana } from './unit-hiragana';
import { unitKatakana } from './unit-katakana';
import { unitConversation } from './unit-conversation';
import { unitDaily } from './unit-daily';
import { unitPast } from './unit-past';
import { unitRequests } from './unit-requests';
import { unitCasual } from './unit-casual';
import { unitB1 } from './unit-b1';
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
    'Osobny program dla japońskiego: hiragana i katakana z pisaniem, rytm mor, partykuły, formy です / ます, czas przeszły, liczniki, forma て, mowa potoczna i 106 kanji z czytaniami. Poziom B1 jest dopiero zaczęty: zdania warunkowe, przysługi, przypuszczenia, strona bierna i pierwsze kroki w keigo — do pełnego B1 (N3) brakuje jeszcze wielu lekcji.',
  framework: 'Kana + JF Standard A1 → B1 (orientacyjnie JLPT N5 → N3; B1: pierwsze kroki)',
  units: [unitHiragana, unitKatakana, unitConversation, unitDaily, unitPast, unitRequests, unitCasual, unitB1],
  stories,
};
