import { ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components/ui';
import { brand } from '../../config/brand';
import { appVersion } from '../../services/platform';
import { t } from '../../i18n';

const LIBS: [string, string, string][] = [
  ['React', 'MIT', 'https://react.dev'],
  ['Dexie.js (IndexedDB)', 'Apache-2.0', 'https://dexie.org'],
  ['Capacitor + oficjalne wtyczki', 'MIT', 'https://capacitorjs.com'],
  ['@capacitor-community: text-to-speech, speech-recognition, keep-awake', 'MIT', 'https://github.com/capacitor-community'],
  ['Lucide (ikony)', 'ISC', 'https://lucide.dev'],
  ['Plus Jakarta Sans (krój pisma, Tokotype)', 'SIL OFL 1.1', 'https://github.com/tokotype/PlusJakartaSans'],
  ['Workbox (tryb offline)', 'MIT', 'https://developer.chrome.com/docs/workbox'],
];

export default function AboutScreen() {
  return (
    <div className="page">
      <PageHeader title={t('set.about')} back fallback="/settings" />

      <section className="card stack stack--s">
        <h2 className="card__title">
          {brand.appName} · {t('set.version', { version: appVersion })}
        </h2>
        <p className="muted">{brand.description}</p>
      </section>

      <section className="card stack stack--s" aria-labelledby="method">
        <h2 id="method" className="card__title">
          {t('set.methodology')}
        </h2>
        <p>
          Aplikacja łączy zasady dobrze opisane w badaniach nad uczeniem się — <strong>powtórki rozłożone w czasie</strong>,{' '}
          <strong>aktywne przypominanie</strong> (odpowiadanie z pamięci zamiast ponownego czytania), <strong>przeplatanie</strong> różnych
          typów ćwiczeń oraz <strong>natychmiastową informację zwrotną</strong> — z dużą ilością słuchania zrozumiałego materiału.
        </p>
        <p>
          Nie każda metoda działa tak samo dla każdej osoby. Niektóre elementy (np. shadowing, tryb tylko słuchanie, motywacja przez
          zadania dnia) to <strong>hipotezy projektowe</strong> oparte na dobrych praktykach — opisujemy je w dokumentacji jako takie.
        </p>
        <p className="subtle">
          Algorytm powtórek to uproszczona odmiana SM-2 z krokami nauki; oszacowanie „pamięci słów” jest modelem, a nie pomiarem.
          Szczegóły: dokumentacja w repozytorium (docs/LEARNING_METHODOLOGY.md, docs/SRS_ALGORITHM.md).
        </p>
      </section>

      <section className="card stack stack--s" aria-labelledby="sources">
        <h2 id="sources" className="card__title">
          {t('set.sources')}
        </h2>
        <p>
          <strong>Treść kursów</strong> (słownictwo, zdania, dialogi, objaśnienia, historie) została napisana od podstaw dla tego projektu i
          nie kopiuje materiałów zewnętrznych.
        </p>
        <p>
          <strong>Dane kolejności kresek</strong> znaków japońskich pochodzą z projektu{' '}
          <a href="https://kanjivg.tagaini.net" target="_blank" rel="noreferrer">
            KanjiVG <ExternalLink size={12} />
          </a>{' '}
          © Ulrich Apel i współtwórcy, licencja{' '}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">
            CC BY-SA 3.0
          </a>
          . Wyodrębnione ścieżki kresek są udostępniane na tej samej licencji.
        </p>
        <p>
          <strong>Głosy</strong> pochodzą z syntezatora mowy Twojego systemu lub przeglądarki — dźwięk jest generowany na urządzeniu. Jakość i
          dostępność zależą od zainstalowanych głosów.
        </p>
        <ul className="list">
          {LIBS.map(([name, license, url]) => (
            <li key={name} className="list-row">
              <div className="list-row__body">
                <div className="list-row__title">{name}</div>
                <div className="list-row__desc">{license}</div>
              </div>
              <a className="icon-btn" href={url} target="_blank" rel="noreferrer" aria-label={name}>
                <ExternalLink size={18} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card stack stack--s" aria-labelledby="privacy">
        <h2 id="privacy" className="card__title">
          Prywatność
        </h2>
        <p>
          Postępy, notatki i rysunki są zapisywane wyłącznie na tym urządzeniu. Aplikacja nie ma kont, reklam ani analityki. Jeśli włączysz
          rozpoznawanie mowy, przeglądarka (np. Chrome) może przesłać nagranie do usługi rozpoznawania mowy swojego dostawcy — dlatego ta
          funkcja jest domyślnie wyłączona.
        </p>
      </section>
    </div>
  );
}
