# Jak zacząć korzystać z Polyglot Quest

Są dwa sposoby. Oba są darmowe, bez konta i bez reklam. Postępy zostają na Twoim urządzeniu.

| Sposób | Link | Dla kogo |
| --- | --- | --- |
| **Aplikacja w przeglądarce** (najprostszy) | **https://livexxpl.github.io/Youlllearn/** | Każdy telefon, tablet i komputer: Android, iPhone, iPad, Windows, Mac |
| **Aplikacja na Androida (APK)** | **https://github.com/LivexxPL/Youlllearn/releases/download/android-latest/polyglot-quest.apk** | Telefony i tablety z Androidem |

Czytasz to na komputerze? Zeskanuj kod aparatem telefonu:

| Aplikacja w przeglądarce | Aplikacja na Androida (APK) |
| :-: | :-: |
| <img src="docs/qr/web.svg" width="160" alt="Kod QR z linkiem do aplikacji w przeglądarce"> | <img src="docs/qr/apk.svg" width="160" alt="Kod QR z linkiem do pliku APK"> |

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

**Konto Google (wersja w przeglądarce / zainstalowana z przeglądarki):** *Profil* (awatar w
prawym górnym rogu ekranu startowego) → *Zaloguj się przez Google*. Postępy zapisują się
same na Twoim Dysku Google, w ukrytym folderze aplikacji (aplikacja nie widzi innych plików).
Na nowym urządzeniu na ekranie powitalnym wybierz *Masz już postępy na Dysku Google?
Przywróć je*. Google daje dostęp na około godzinę — potem, jeśli coś czeka na zapis, na
ekranie startowym pojawi się przycisk *Zapisz teraz* (jedno dotknięcie).

W aplikacji APK logowanie Google nie działa (Google blokuje je w oknach wbudowanych w
aplikacje). Tam, albo bez konta: *Ustawienia → Dane i kopia zapasowa → Eksportuj postępy*
na starym urządzeniu, a potem *Importuj postępy* z tego pliku na nowym.

## Jednorazowe ustawienie dla właściciela repozytorium

Strona https://livexxpl.github.io/Youlllearn/ działa, gdy w repozytorium włączone jest GitHub
Pages. Workflow CI publikuje każdą sprawdzoną wersję na oba sposoby, więc pasuje każde z dwóch
ustawień w *Settings → Pages → Build and deployment → Source*:

- **GitHub Actions** — nic więcej nie trzeba ustawiać;
- **Deploy from a branch** — wtedy wybierz Branch: **gh-pages** / **(root)** → Save.

Strona pojawia się po zakończeniu najbliższego przebiegu CI (kilka minut).

### Logowanie Google i kopia na Dysku (jednorazowo, ok. 10 minut)

1. Wejdź na <https://console.cloud.google.com/> i utwórz projekt (np. „Polyglot Quest”).
2. *APIs & Services → Library* → wyszukaj **Google Drive API** → *Enable*.
3. *APIs & Services → OAuth consent screen*: nazwa aplikacji, Twój e-mail, odbiorcy
   **External**. Dopóki aplikacja jest w trybie **Testing**, w *Test users* dodaj konta Google,
   które mają się logować (np. swoje). Zakresy: `openid`, `userinfo.email`, `userinfo.profile`,
   `drive.appdata`.
4. *APIs & Services → Credentials → Create credentials → OAuth client ID* → typ
   **Web application**. W *Authorised JavaScript origins* dodaj `https://livexxpl.github.io`
   (do testów lokalnych także `http://localhost:5173` i `http://localhost:4173`). Adres
   przekierowania nie jest potrzebny.
5. Skopiuj **Client ID** (kończy się na `.apps.googleusercontent.com` — to nie jest hasło) i
   w repozytorium GitHub: *Settings → Secrets and variables → Actions → Variables →
   New repository variable*, nazwa `GOOGLE_CLIENT_ID`, wartość: Client ID.
6. *Actions → CI → Run workflow* (gałąź `claude/polyglot-quest-app-6awz6m`) — po kilku minutach
   strona zostanie opublikowana z logowaniem. To samo po każdej zmianie zmiennych.

Projekt w Google Cloud i te usługi są w tym zastosowaniu bezpłatne; kopia zajmuje miejsce na
Twoim Dysku (zwykle poniżej 1 MB). Szczegóły techniczne: [docs/CLOUD_SYNC.md](docs/CLOUD_SYNC.md).

### Konto dewelopera (jednorazowo, po skonfigurowaniu logowania Google)

1. W aplikacji zaloguj się swoim kontem Google (*Profil → Zaloguj się przez Google*).
2. *Profil → Informacje techniczne* pokazuje **identyfikator roli** konta (64 znaki). Skopiuj go.
   To skrót identyfikatora konta Google — nie jest tajny i nie ujawnia konta.
3. W repozytorium GitHub: *Settings → Secrets and variables → Actions → Variables →
   New repository variable*, nazwa `DEVELOPER_ACCOUNT_IDS`, wartość: identyfikator roli
   (kilka kont: po przecinku). Opcjonalnie `ADMIN_ACCOUNT_IDS` dla administratorów.
4. *Actions → CI → Run workflow*. Po tym przebiegu CI to konto jest rozpoznawane jako
   deweloper automatycznie po zalogowaniu: wszystkie kosmetyki bez kupowania, podgląd zablokowanych treści, panel
   *Ustawienia → Narzędzia deweloperskie* z diagnostyką i piaskownicą do testów (osobne dane
   testowe — prawdziwe postępy zostają nietknięte).

Aplikacja nie ma serwera, więc role sprawdza sama na urządzeniu: nie da się ich nadać sobie
przez zmianę zapisanych danych, ale ktoś, kto zmodyfikuje kod aplikacji w swojej przeglądarce,
może obejść blokady po swojej stronie. Szczegóły i ograniczenia:
[docs/DEVELOPER_ACCESS.md](docs/DEVELOPER_ACCESS.md).

## Dla programistów

```bash
npm ci
npm run dev        # http://localhost:5173
```

Więcej: [README.md](README.md) i [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md).

Kody QR (`docs/qr/*.svg`, używane też w aplikacji) wygenerowano biblioteką
[qrcode](https://www.npmjs.com/package/qrcode) (MIT). Po zmianie linków wygeneruj je ponownie:

```bash
npx qrcode@1.5.4 -t svg -e M -q 4 -d 0f141a -l ffffff -o docs/qr/web.svg "https://livexxpl.github.io/Youlllearn/"
npx qrcode@1.5.4 -t svg -e M -q 4 -d 0f141a -l ffffff -o docs/qr/apk.svg "https://github.com/LivexxPL/Youlllearn/releases/download/android-latest/polyglot-quest.apk"
```
