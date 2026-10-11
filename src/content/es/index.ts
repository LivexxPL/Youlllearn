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

export const spanish: CourseDefinition = {
  id: 'es',
  name: 'Hiszpański',
  nativeName: 'Español',
  speechLang: 'es-ES',
  accents: [
    { id: 'es-ES', label: 'Hiszpania', speechLang: 'es-ES' },
    { id: 'es-MX', label: 'Meksyk', speechLang: 'es-MX' },
  ],
  color: 'var(--lang-es)',
  emblem: 'ES',
  description: 'Od powitań po opowieści o przeszłości: plan dnia, zakupy, pogoda, zdrowie, wakacje i porównania. Słuchanie z akcentem z Hiszpanii i Meksyku.',
  framework: 'CEFR A1 → A2',
  units: [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8],
  stories,
};
