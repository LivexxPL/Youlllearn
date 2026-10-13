# Roles, developer access and their limits

Polyglot Quest has three roles, all attached to the existing optional Google account
(docs/CLOUD_SYNC.md) — there is no second login, user database or "admin mode" toggle.

| Role | What it adds |
| --- | --- |
| `user` | nothing: the normal app, economy and progression (everyone, also when signed out) |
| `admin` | read-only insight: the dashboard (`/dev`), diagnostics, the local audit log, content and cosmetic catalogues |
| `developer` | **every permission, including future ones**: all of the above, every cosmetic without buying, locked content as a marked preview, unreleased features (feature flags), the sandbox with simulations |

## How it works

| Piece | File |
| --- | --- |
| Roles, permissions, the policy, `can()` / `assertCan()` / `contentAccess()` | `src/auth/permissions.ts` |
| Role ids and the build-time assignment | `src/auth/roles.ts` |
| Current principal (who is signed in, which role) | `src/auth/session.ts` |
| Developer entitlements on top of ownership | `src/auth/entitlements.ts` |
| Feature flags | `src/config/features.ts` |
| Sandbox and simulations (permission-checked) | `src/services/devtools.ts` |
| Local audit log, diagnostics (secrets redacted) | `src/services/audit.ts`, `src/services/diagnostics.ts` |
| Dashboard | `src/features/devtools/DevScreen.tsx` (route `#/dev`) |

**Identity.** The account is the Google account recorded by a sign-in on this device
(Google Identity Services → `userinfo`, see CLOUD_SYNC.md). Its stable Google account id
(`sub`) is stored in a device-only record that is never synchronised, exported or imported.

**Role assignment.** A *role id* is `SHA-256("polyglot-quest/role-id/v1:" + sub)`, as hex.
The build contains the role ids of the developer and admin accounts
(`VITE_DEVELOPER_ACCOUNTS`, `VITE_ADMIN_ACCOUNTS`). The app computes the role id of the
signed-in account and looks it up. Consequences:

- Nothing stored by the app says "admin" or "developer"; editing IndexedDB, localStorage,
  settings or the profile cannot grant a role (tested: `src/auth/auth.test.ts`,
  `e2e/roles.spec.ts`).
- Display names and e-mail addresses play no part.
- Role ids are not secrets and do not reveal the Google account id; the account id itself is
  never in the build. To pose as the developer by editing stored data one would need the
  developer's Google account id.
- No account gets a role by being first, and none can get one without the owner changing the
  build configuration.
- Signing out, signing in with another account or a reset recomputes the role at once; the
  developer look (e.g. a theme used without owning it) is taken off automatically.
- The role persists while the account stays signed in on the device: no "developer mode" to
  switch on after each start. (Google's hourly access token concerns Drive synchronisation
  only; it is not the session.)

**Authorisation.** Every privileged feature asks `can(principal, permission)`; there are no
role checks anywhere else. Unknown roles, unverified identities and signed-out users get no
privileged permission (default deny). The policy gives developers *all* permissions, so a
permission added later applies to developers without editing anything. Services check again
(`assertCan`): hiding a button or route is never the only protection — the `#/dev` route
itself refuses without the permission, and the simulation functions throw.

## Developer access and the normal economy

- **Cosmetics:** a developer may equip every item without owning it. This is an *override*
  computed from the role (`mayUseCosmetic`), never stored as ownership: no purchase, no ledger
  entry, no coins. The shop and collection mark such items "DEV".
- **Content:** gates use `contentAccess(principal, normallyOpen)`; a developer gets `preview`
  (opened, marked "DEV") instead of `locked`. Today this covers stories (dialogues) before their
  lesson; lessons are open to everyone. New gates should use the same helper.
- **Feature flags:** `stable` features are on for everyone; `beta` / `experimental` only with
  `features.preview` (developers). Example: the SRS card inspector in the dashboard.
- **Simulations run only in the sandbox** — a separate IndexedDB database
  (`polyglot-quest-sandbox`), entered from the dashboard, empty or as a copy of the real data.
  Test coins are ledger entries of type `adjustment` with ids `test:coins:…` and
  `ref: "developer-test"`; XP, streaks, lesson completions, achievements and onboarding can be
  simulated. The real database is not touched (tested), cloud synchronisation is disabled in
  the sandbox (in the service, not only the UI), and a banner is always shown with the way
  back. The sandbox flag lives in sessionStorage; on its own it grants nothing.
- There are no leaderboards, analytics or shared rankings to contaminate; achievements and
  coins in the real data are only ever earned by learning.

## Audit log and diagnostics

Dashboard actions (entering/resetting the sandbox, simulations) are recorded in a local log
in the real database (device-only, kept when the sandbox is reset). Diagnostics show the app
version, platform, storage, database counts and cloud state, plus recent errors and warnings
kept in memory. Anything that looks like a credential (`ya29…`, `Bearer …`, `…token=…`) is
redacted before it is kept; access tokens are never shown or logged.

## Bootstrap: designating the developer account (once)

1. Make sure Google sign-in is configured (docs/CLOUD_SYNC.md) and deployed.
2. Open the app, sign in with the Google account that should become the developer
   (*Profil → Zaloguj się przez Google*).
3. *Profil → Informacje techniczne* shows the account's role id (64 hexadecimal characters).
   Copy it.
4. GitHub → repository → *Settings → Secrets and variables → Actions → Variables*:
   - `DEVELOPER_ACCOUNT_IDS` = the role id (several: separated by commas),
   - optionally `ADMIN_ACCOUNT_IDS` for admins.
5. The next CI run builds and deploys the app with these ids; after it, the account is a
   developer on every device where it is signed in. To revoke, remove the id and let CI deploy.

Local development: put the same variables in `.env.local` as `VITE_DEVELOPER_ACCOUNTS=…` /
`VITE_ADMIN_ACCOUNTS=…` (ignored by git). The end-to-end tests use a separate build
(`npm run build:e2e`, settings in `.env.e2e`) with fake identities `e2e-developer` and
`e2e-admin`, which cannot exist as real Google accounts (real ids are numeric); the
production build never contains them.

## Security limits (honestly)

Polyglot Quest has **no server**: the app, its data and these checks all run in the user's
browser or WebView. Therefore:

- The roles protect against **promoting oneself through stored data** (IndexedDB,
  localStorage, settings, profile, backup files, the cloud copy) and against accidental
  privilege transfer between accounts. They do **not** protect against a technically capable
  user who modifies the app's code in their own browser (for example with developer tools):
  such a user can unlock anything *on their own device*. That is inherent to client-only
  authorisation; there is nothing on a server to protect.
- Because there is no shared data or other users' accounts, a role never exposes anyone
  else's information; an admin or developer sees only the data on their own device.
- The audit log is local and editable by the device owner: a convenience, not evidence.
- The Android APK cannot use Google sign-in (Google blocks it in WebViews), so roles are only
  available in the web/PWA version.
- If a backend is added later, the same permission names should be enforced there for every
  privileged operation, with the role assignment kept server-side (and the Google ID token
  verified on the server) and a server-side audit log.

## Tests

- `src/auth/auth.test.ts`: the policy matrix and default deny, role ids, assignment
  precedence, session changes (sign-out, another account, races), promotion attempts through
  stored data, developer entitlements and their removal.
- `src/services/devtools.test.ts`: simulations refuse without the permission and outside the
  sandbox, work in the sandbox with labelled test entries, and leave the real data untouched.
- `src/services/cloud/sync.test.ts`: no cloud traffic where synchronisation is unavailable
  (sandbox).
- `e2e/roles.spec.ts`: the developer gets full access right after signing in and after a
  restart, loses it on sign-out; an ordinary account editing stored data gets nothing; the
  sandbox flag alone grants nothing; admins are read-only; sandbox tests leave the real
  progress, coins and ledger untouched.
