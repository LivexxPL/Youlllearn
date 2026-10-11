import type { CourseDefinition } from '../types';
import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';
import { unit5 } from './unit5';
import { unit6 } from './unit6';
import { unit7 } from './unit7';
import { unit8 } from './unit8';
import { stories } from './stories';

export const german: CourseDefinition = {
  id: 'de',
  name: 'Niemiecki',
  nativeName: 'Deutsch',
  speechLang: 'de-DE',
  accents: [
    { id: 'de-DE', label: 'Niemcy', speechLang: 'de-DE' },
    { id: 'de-AT', label: 'Austria', speechLang: 'de-AT' },
  ],
  color: 'var(--lang-de)',
  emblem: 'DE',
  description:
    'Od powitań i rodzajników po czasy przeszłe, zdania podrzędne i porównania — krok po kroku od A1 do A2, bez tabel na start. Ostatni dział to dopiero początek B1: cele, argumenty, strona bierna, opowiadanie i zdania „co by było, gdyby…”.',
  framework: 'CEFR A1 → B1 (B1: pierwsze kroki)',
  units: [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8],
  stories,
};
