import type { CourseDefinition } from '../types';
import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';
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
  description: 'Od powitań i rodzajników po czasowniki modalne, celownik i czas Perfekt — krok po kroku, bez tabel na start.',
  framework: 'CEFR A1 → wstęp do A2',
  units: [unit1, unit2, unit3, unit4],
  stories,
};
