# Jak zacząć korzystać z Polyglot Quest

Są dwa sposoby. Oba są darmowe, bez konta i bez reklam. Postępy zostają na Twoim urządzeniu.

| Sposób | Link | Dla kogo |
| --- | --- | --- |
| **Aplikacja w przeglądarce** (najprostszy) | **https://livexxpl.github.io/Youlllearn/** | Każdy telefon, tablet i komputer: Android, iPhone, iPad, Windows, Mac |
| **Aplikacja na Androida (APK)** | **https://github.com/LivexxPL/Youlllearn/releases/download/android-latest/polyglot-quest.apk** | Telefony i tablety z Androidem |

Obie wersje są budowane automatycznie przy każdej zmianie w projekcie. Aplikacja webowa
trafia do sieci dopiero wtedy, gdy przejdzie wszystkie testy.

## 1. Aplikacja w przeglądarce (polecana na start)

1. Otwórz **https://livexxpl.github.io/Youlllearn/** na telefonie lub komputerze.
2. Dodaj ją do ekranu głównego. Otwiera się wtedy jak zwykła aplikacja i działa bez internetu:
   - **Android (Chrome):** w aplikacji stuknij *Ustawienia → Aplikacja na telefonie →
     Zainstaluj aplikację* (albo baner na ekranie startowym). Możesz też użyć menu przeglądarki
     **⋮ → Zainstaluj aplikację / Dodaj do ekranu głównego**.
   - **iPhone / iPad (Safari):** stuknij **Udostępnij** (kwadrat ze strzałką) →
     **Do ekranu początkowego**.
   - **Komputer (Chrome, Edge):** kliknij ikonę instalacji na końcu paska adresu.
3. Gotowe: ikona Polyglot Quest jest na ekranie głównym.

Gdy pojawi się nowa wersja, aplikacja sama to wykryje i pokaże przycisk „Odśwież”.

## 2. Aplikacja na Androida (APK)

Wersja na Androida ma dwie przewagi: **przypomnienia działają także przy zamkniętej
aplikacji** i używa systemowych głosów Androida.

1. Na telefonie otwórz link do pobrania:
   **https://github.com/LivexxPL/Youlllearn/releases/download/android-latest/polyglot-quest.apk**
2. Otwórz pobrany plik `polyglot-quest.apk`.
3. Przy pierwszej instalacji Android zapyta, czy pozwolić przeglądarce instalować aplikacje
   („nieznane źródła”). Zezwól i wróć do instalacji.
4. **Aktualizacje:** pobierz plik z tego samego linku i zainstaluj na obecną wersję. Postępy
   zostają. W aplikacji: *Ustawienia → Aplikacja na telefonie → Najnowsza wersja aplikacji*.

> Masz starszą wersję APK pobraną jako plik ZIP z GitHub Actions? Była podpisana innym
> kluczem, więc Android nie zainstaluje nowej wersji na nią. Najpierw zrób kopię postępów
> (*Ustawienia → Dane i kopia zapasowa → Eksportuj postępy*), odinstaluj starą wersję,
> zainstaluj nową i zaimportuj kopię (*Importuj postępy*). To jednorazowe: kolejne wersje
> instalują się już na poprzednią.

To wersja testowa (debug), podpisana publicznym kluczem z repozytorium, a nie wersja ze sklepu
Google Play. Instaluj ją tylko z linku powyżej.

## Głos i wymowa

Aplikacja czyta słowa głosami zainstalowanymi w systemie. Jeśli lektor milczy albo czyta z
polskim akcentem, doinstaluj głosy:

- **Android:** w ustawieniach systemu wyszukaj „Zamiana tekstu na mowę”. Przy silniku
  **Usługi mowy od Google** otwórz ustawienia → *Zainstaluj dane głosowe* i pobierz głosy
  hiszpański, niemiecki i japoński. (Nazwy menu różnią się trochę między producentami.) W
  aplikacji na Androida ten ekran otwiera przycisk *Zainstaluj głosy*.
- **iPhone / iPad:** *Ustawienia → Dostępność → Treść mówiona → Głosy* i pobierz głosy dla
  tych języków.

W aplikacji: *Ustawienia → Dźwięk i mowa* pokazuje, które głosy są dostępne, i pozwala je
wybrać.

## Przenoszenie postępów między urządzeniami

Postępy są zapisane tylko na urządzeniu, nie ma konta ani chmury. Aby przenieść naukę:
*Ustawienia → Dane i kopia zapasowa → Eksportuj postępy* na starym urządzeniu, a potem
*Importuj postępy* z tego pliku na nowym.

## Jednorazowe ustawienie dla właściciela repozytorium

Strona https://livexxpl.github.io/Youlllearn/ działa, gdy GitHub Pages publikuje gałąź
`gh-pages`, którą tworzy workflow CI. Jeśli link pokazuje błąd 404, włącz to raz w GitHubie:
*Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch:
**gh-pages** / **(root)** → Save*. Po minucie strona działa.

## Dla programistów

```bash
npm ci
npm run dev        # http://localhost:5173
```

Więcej: [README.md](README.md) i [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md).
