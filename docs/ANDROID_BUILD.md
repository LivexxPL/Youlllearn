# Building the Android app

Polyglot Quest is packaged with **Capacitor 8**. The `android/` directory is a normal Gradle
project and is committed to the repository. The web bundle is copied into it by
`npx cap sync android`.

> **Status in this repository's development sandbox:** the Android project is configured,
> but **no APK has been built here**. The Android Gradle Plugin and the Android SDK
> (platforms, build-tools) are only distributed from `dl.google.com` / `maven.google.com`,
> and this sandbox's network policy blocks them (HTTP 403). Everything else is ready. Build
> locally with the steps below, or let the included GitHub Actions workflow build it.

## 1. Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 22 (20+ works) | `npm ci` |
| JDK | 21 | Temurin/OpenJDK |
| Android SDK | Platform 36, Build-Tools 36, Platform-Tools | Easiest via Android Studio (Ladybug or newer) or `sdkmanager` |
| Gradle | 8.14.3 | Downloaded automatically by `./gradlew` |
| Android Gradle Plugin | 8.13.0 | From Google Maven |
| Device | Android 7.0+ (minSdk 24) | target/compile SDK 36 |

Set `ANDROID_HOME` (or `sdk.dir` in `android/local.properties`) to your SDK location.

## 2. Debug APK (install directly on a phone)

```bash
npm ci
npm run android:debug          # = build:native + cap sync + ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or step by step:

```bash
npm run build:native           # type check + Vite build without service worker
npx cap sync android           # copy web assets + update native plugins
cd android && ./gradlew assembleDebug
```

To develop in Android Studio: `npm run cap:sync && npx cap open android`.

Debug builds are signed with the **shared debug key** `android/app/debug.keystore` (password
`android`, alias `androiddebugkey`), committed on purpose. Every build, local or CI, is
signed the same way, so a newer debug APK installs over the previous one and keeps the
learner's progress. The key is public: it is fine for testing and personal use, never for a
store release (use the release key from §3).

## 3. Release APK and App Bundle

Release builds must be signed. **Without signing credentials** `assembleRelease` produces
`app-release-unsigned.apk`, which cannot be installed until it is signed.

### 3.1 Create a keystore (once — keep it safe)

```bash
keytool -genkeypair -v -keystore android/polyglot-release.jks -alias polyglot \
  -keyalg RSA -keysize 4096 -validity 10000
```

Losing this key means you cannot publish updates under the same app id. `*.jks`,
`*.keystore` and `keystore.properties` are git-ignored.

### 3.2 Provide the credentials

Either copy `android/keystore.properties.example` to `android/keystore.properties` and fill
it in (paths are relative to `android/`):

```properties
storeFile=polyglot-release.jks
storePassword=…
keyAlias=polyglot
keyPassword=…
```

…or set environment variables (used by CI): `ANDROID_KEYSTORE_FILE`,
`ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.

### 3.3 Build

```bash
npm run android:release        # → android/app/build/outputs/apk/release/app-release.apk
npm run android:bundle         # → android/app/build/outputs/bundle/release/app-release.aab (Google Play)
```

**Versioning:** `versionName` comes from `package.json`. `versionCode` is derived from it
(`major·10000 + minor·100 + patch`) unless the `VERSION_CODE` environment variable is set.
CI sets it to the workflow run number.

## 4. Continuous integration (GitHub Actions)

- `.github/workflows/ci.yml`: lint, type check, unit tests, production build, Playwright
  E2E (phone + tablet).
- `.github/workflows/android.yml`: on every push to `main` / `claude/**` and on tags `v*`.
  It builds the web bundle and syncs Capacitor, builds **`app-debug.apk`** (always) and the
  release APK, and uploads them as workflow artifacts. If the repository secrets
  `ANDROID_KEYSTORE_BASE64` (`base64 -w0 polyglot-release.jks`), `ANDROID_KEYSTORE_PASSWORD`,
  `ANDROID_KEY_ALIAS` and `ANDROID_KEY_PASSWORD` are set, the release APK is signed and an
  **AAB** is built too. Otherwise an unsigned release APK is uploaded.

On every push the workflow also publishes the installable APK (the signed release APK when
the secrets are set, otherwise the debug APK) as the GitHub release **`android-latest`**,
replacing the previous one. Phones can therefore always download the newest version from one
permanent link, without logging in or unpacking a ZIP:

https://github.com/LivexxPL/Youlllearn/releases/download/android-latest/polyglot-quest.apk

Adding the signing secrets later switches that link from the debug key to the release key.
Android does not install an app over one signed with another key, so phones that have the
debug APK must uninstall it once (export the progress first, import it afterwards).

The same APK is also attached to each run's *Artifacts* section. Install it by opening it on
the phone (allow "install unknown apps") or with `adb install -r`. Step-by-step instructions
in Polish: [INSTALACJA.md](../INSTALACJA.md).

`ci.yml` publishes the tested web build to GitHub Pages at https://livexxpl.github.io/Youlllearn/,
both as the `gh-pages` branch and as a Pages deployment, so either Pages source works (enable
Pages once in *Settings → Pages*: source "GitHub Actions", or "Deploy from a branch" with
`gh-pages`).

## 5. What the Android build contains

| Area | Details |
| --- | --- |
| Plugins | App (back button, lifecycle), Filesystem + Share (backup export), Haptics, Local Notifications (reminders), Splash Screen, community Text-to-Speech, Speech Recognition, Keep Awake |
| Permissions | `INTERNET` (WebView); `RECORD_AUDIO` (from speech recognition, requested only when you record or use recognition); `MODIFY_AUDIO_SETTINGS` (WebView microphone); `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK` (reminders). `SCHEDULE_EXACT_ALARM` is **removed**: reminders do not need minute precision, and the permission is restricted on Google Play. |
| Backup | `android:allowBackup="false"`. Progress stays on the device, matching the in-app privacy statement. Use *Ustawienia → Eksportuj postępy* to move data. |
| Icons | Adaptive launcher icon (with monochrome layer for themed icons), legacy and round icons, notification icon `ic_stat_polyglot`, splash. All are generated from one SVG by `npm run icons` (`scripts/generate-icons.mjs`), using the colours from `src/config/brand.ts`. |
| Edge-to-edge | Capacitor SystemBars injects `--safe-area-inset-*` CSS variables; the layout pads for them. |
| Back button | Closes sheets and dialogs first, then asks before leaving a lesson, then navigates back; on the home screen it minimises the app. |
| Audio | Android WebView has no `speechSynthesis`, so all TTS goes through the native plugin. If no voice is installed, Settings and onboarding offer *Zainstaluj głosy* (opens the system TTS installer). |

## 6. Rebranding before publishing

1. Change `src/config/brand.ts` (name, `appId`, colours).
2. Mirror `appId`/`appName` in `capacitor.config.ts`. `src/config/brand.test.ts` fails if they
   differ.
3. Android ids: update `namespace`/`applicationId` in `android/app/build.gradle`, the
   package of `MainActivity.java` (move the file to the matching folder), and
   `android/app/src/main/res/values/strings.xml`.
4. `npm run icons` to regenerate the icons and splash in the new colours.

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `SDK location not found` | Create `android/local.properties` with `sdk.dir=/path/to/Android/Sdk` or set `ANDROID_HOME`. |
| Gradle cannot download `com.android.tools.build:gradle` | Allow access to `dl.google.com` and `maven.google.com` (proxy/firewall). |
| App starts with a white screen | Run `npm run build:native && npx cap sync android` again: `webDir` (`dist`) was missing or stale. |
| No sound | Install a voice: Android Settings → Accessibility/System → Text-to-speech output → install the language data. Then select it in the app's Settings. |
