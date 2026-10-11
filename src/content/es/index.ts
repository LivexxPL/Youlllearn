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
  description:
    'Od powitań po opowieści, plany i opinie: plan dnia, zakupy, pogoda, zdrowie, wakacje, prośby i polecenia. Pełny materiał A1–A2, a z poziomu B1 na razie tylko pierwszy dział (tryb łączący, czas zaprzeszły, zdania warunkowe). Słuchanie z akcentem z Hiszpanii i Meksyku.',
  framework: 'CEFR A1 → B1 (B1: pierwsze kroki)',
  units: [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8],
  stories,
};
