# Google account and cloud copy

An optional Google sign-in keeps a copy of the learner's progress on **their own Google
Drive**, so it survives a lost phone, can be restored on a new device and can be used on
several devices. The app still works without an account, offline, and the device remains the
source of truth.

There is no server of ours: the browser talks directly to Google.

## How it works

| Piece | File |
| --- | --- |
| Configuration (client id, scopes, file name) | `src/config/cloud.ts` |
| Google sign-in (Google Identity Services, token model) | `src/services/cloud/google.ts` |
| Drive REST calls (application data folder) | `src/services/cloud/drive.ts` |
| Merge of two copies (pure functions) | `src/services/cloud/merge.ts` |
| Orchestration, state, automatic sync | `src/services/cloud/sync.ts` |
| UI: Profile → "Konto Google i kopia w chmurze", Home banner, onboarding restore | `src/features/profile/*`, `HomeScreen.tsx`, `OnboardingScreen.tsx` |

- **Scopes:** `openid email profile` (name and picture for the profile) and
  `https://www.googleapis.com/auth/drive.appdata`, which only reaches the app's hidden
  *application data folder*. The app cannot see or change any other file on the Drive.
- **File:** one JSON file, `polyglot-quest-sync.json`, in the same format as the export file
  (`services/backup.ts`, format version checked on download). It is small (typically far
  below 1 MB) and counts towards the user's Google storage.
- **Access token:** Google's pop-up returns an access token valid for about an hour. A web app
  without a server cannot get a refresh token, so:
  - while the token is valid, changes are synchronised automatically 10 s after they settle
    (at most 5 min later during a long session; time statistics alone at most every 5 min),
    when the app goes to the background and when it comes back after more than 5 minutes;
  - once it has expired, a banner on Home ("Ostatnie postępy czekają na zapis…") and the
    Profile's "Synchronizuj teraz" renew access with one tap. The pop-up opens only from a
    click, because browsers block pop-ups that do not follow a user action. The token is kept
    in `sessionStorage` so that a reload within the hour does not ask again.
- **Synchronisation:** list the copies → download them unless the copy is the one this device
  uploaded last (same Drive `modifiedTime`) → merge into the local database in one
  transaction → upload the result if it differs from the cloud copy. Concurrent copies (two
  devices creating the file at the same moment) are merged into one and the extra deleted.
  A copy that cannot be read (damaged, or written by a newer app version) is never
  overwritten; the app asks to update instead.
- **Change detection:** a fingerprint (hash of the canonical JSON) of the learner data as last
  synchronised is stored; a Dexie `storagemutated` listener re-checks it after changes.

## Merge rules

Records are matched by primary key and nothing is ever deleted by a merge:

| Table | Rule |
| --- | --- |
| `cards` | the version reviewed more recently (then: more repetitions) |
| `lessonProgress` | latest completion, earliest first completion, highest completion count, best accuracy |
| `dailyStats` | per day the larger value of each counter, courses combined — the same day is never counted twice; practice on two devices on one day can be undercounted |
| `achievements` | union, earliest unlock |
| `rewards` | union (ids name the quest and its period) |
| `drawings` | the more recently updated drawing |
| `settings` | this device's settings plus courses started elsewhere; the cloud settings on a device that has not been set up yet (restore) |
| `meta` | streak: the state evaluated to the later day, shield days combined, best streak max; flags: any set flag; story results: newer |
| `ledger` | union of coin transactions by id — ids name the event, so a reward or purchase made on two devices counts once (ECONOMY_DESIGN.md) |

**Device-only records** (`isDeviceMeta` in `services/db.ts`: the account and sync state, the
lesson resume position, the dismissed install hint) are never uploaded, never taken from the
cloud, left out of export files and kept on import.

Known limits: deletions do not propagate (the app has none for synchronised data today);
two devices uploading within the same second can overwrite each other's upload — both keep
their data locally and the next synchronisation merges it again.

## Where it works

- **Web and installed PWA** (Chrome/Edge/Firefox/Safari, Android and desktop): yes.
- **Android APK:** no — Google blocks its sign-in in embedded WebViews
  (`disallowed_useragent`). The Profile explains this and links to the web version; progress
  can be moved with export/import. A native sign-in plugin would be the way to add it later.
- **Without a client id** (forks, local builds) the account section only says that it is not
  configured; nothing else changes.

## Setting up the Google client id (once)

1. <https://console.cloud.google.com/> → create a project (e.g. "Polyglot Quest").
2. *APIs & Services → Library* → enable **Google Drive API**.
3. *APIs & Services → OAuth consent screen* (Google Auth Platform): app name, support e-mail,
   **External** audience. While the app is in **Testing**, add the Google accounts that may
   sign in under *Test users*. Scopes: `openid`, `.../auth/userinfo.email`,
   `.../auth/userinfo.profile`, `.../auth/drive.appdata` (non-sensitive, no verification
   needed for personal use).
4. *APIs & Services → Credentials → Create credentials → OAuth client ID* →
   **Web application**. *Authorised JavaScript origins*: `https://livexxpl.github.io`, and for
   development `http://localhost:5173` and `http://localhost:4173`. No redirect URI is needed.
5. Give the build the client id (`…apps.googleusercontent.com`, public by design), either:
   - GitHub: *Settings → Secrets and variables → Actions → Variables* → `GOOGLE_CLIENT_ID`
     (CI passes it to the build as `VITE_GOOGLE_CLIENT_ID`), or
   - locally: `.env.local` with `VITE_GOOGLE_CLIENT_ID=…`.

The project and these APIs are free for this use; the copy uses the user's own Drive storage.

## Tests

- `src/services/cloud/merge.test.ts` — every merge rule, idempotence, fingerprints.
- `src/services/cloud/sync.test.ts` — full synchronisation against an in-memory Drive:
  first upload, no traffic without changes, restore onto a new device, two devices, expired
  access, unreadable copy left untouched, duplicate copies folded, device-only records,
  sign-out.
- `e2e/cloud.spec.ts` — in the browser with a fake Google sign-in and Drive: sign in from the
  Profile, automatic upload, greeting by name, sign-out; restore from the welcome screen on a
  new device; expired access → Home banner → one tap → saved.
