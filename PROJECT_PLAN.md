# Polyglot Quest — project plan

Mobile-first, audio-first language learning for Polish speakers: **Spanish, German and Japanese** from zero.
One shared codebase runs as a web app/PWA and as an Android app via Capacitor.

This plan records the architecture decisions, the milestones and their status. The status
column is kept honest: a milestone is "done" only when it is implemented *and* checked
(lint, type check, unit tests, build; plus E2E/visual checks where relevant).

## 1. Environment assessment (2026-10-09)

| Tool | Available | Notes |
| --- | --- | --- |
| Node.js 22, npm 10 | ✅ | |
| Java 21 (OpenJDK), Gradle 8.14 | ✅ | Matches Capacitor 8 / AGP 8.13 requirements |
| Android SDK, Android Gradle Plugin | ❌ | Both are served only from `dl.google.com`, which this sandbox's network policy blocks (`maven.google.com` redirects there). **No APK can be compiled here.** The Android project is generated and verified, and `.github/workflows/android.yml` builds the APK on GitHub Actions. |
| Chromium (Playwright) | ✅ | `/opt/pw-browsers`, used for E2E tests and screenshot QA |
| Network to npm, Maven Central, services.gradle.org | ✅ | |
| Direct access to Tatoeba, Wikimedia, Tofugu, research sites | ❌ | Blocked. Licences and sources were checked through web search instead (see CONTENT_SOURCES.md, docs/LEARNING_METHODOLOGY.md). |
| Audio output / TTS voices | ❌ | Headless Chromium has no voices here, so TTS quality was not evaluated by ear; the fallbacks were exercised instead. |
| Push to GitHub | ✅ | Initially refused (403) until GitHub access was reconnected. The branch `claude/polyglot-quest-app-6awz6m` is now on GitHub. |

## 2. Architecture decisions

| Decision | Choice | Why / trade-offs |
| --- | --- | --- |
| UI | React 19 + TypeScript 6 + Vite 8 | One codebase for phone, tablet, desktop and Android. TS 6.0 instead of 7.0 because typescript-eslint supports `<6.1`. |
| Android | Capacitor 8 (WebView) | Shares 100% of UI code. Native plugins only where they add real value: text-to-speech (Android WebView has no `speechSynthesis`), speech recognition, local notifications, file sharing, haptics, keep-awake. |
| Persistence | IndexedDB via Dexie 4 | Offline, no account, export/import as JSON. |
| State | React context + Dexie live queries | No global store library needed at this size. |
| Routing | Tiny hash router (own code) | Works identically in browser, PWA, static hosting and the Capacitor WebView; integrates with the Android back button. |
| Offline (web) | vite-plugin-pwa (Workbox precache) | Whole app + content cached; the native build skips the service worker. |
| Audio | System TTS (Web Speech API on web, Android TextToSpeech on native) with an extension point for recorded audio | No paid API, works offline when voices are installed. Quality varies per device — evaluated in docs/AUDIO.md. |
| Pronunciation | Model audio + record-and-compare + self-assessment; optional speech recognition shows "what the recogniser understood" | We deliberately do **not** show a "pronunciation score": text-matching cannot judge pronunciation (and not pitch accent at all). |
| Handwriting | Pointer Events canvas, KanjiVG stroke data (CC BY-SA 3.0) | Stroke-order animation, tracing, writing from memory with rule-based hints (stroke count/start/direction) + self-assessment. No fake "recognition". |
| SRS | SM-2-inspired scheduler with learning steps | Documented in docs/SRS_ALGORITHM.md; production vs recognition aware. |
| Content | Original courses written for this project (Polish UI and explanations) | Third-party corpora were not reachable/licensable from this environment; see CONTENT_SOURCES.md. |
| Tests | Vitest (engine, content validation, DB), Playwright (E2E on phone + tablet viewports) | |

## 3. Milestones

| # | Milestone | Status |
| --- | --- | --- |
| 1 | Architecture & working application shell | ✅ done |
| 2 | Mobile-first UI & navigation | ✅ done: visual QA on phone (light/dark), tablet, desktop |
| 3 | Learning engine & real beginner lessons (es/de/ja) | ✅ done: 47 lessons; every lesson session is built and checked by tests |
| 4 | Audio Quest (audio-first learning) | ✅ done: all 15 requirements (docs/AUDIO.md); screen-off playback only "where supported" |
| 5 | Spaced repetition, daily goals, motivation | ✅ done |
| 6 | Stylus & tablet support | ✅ done: Pointer Events canvas, KanjiVG stroke guides, stylus mode, notes |
| 7 | Persistence, offline, import/export | ✅ done: IndexedDB, PWA precache, JSON export/import (E2E-tested round trip) |
| 8 | Tests, optimisation, Android packaging | ✅ tests (182 unit, 14 E2E) and Android project/CI. ⚠️ APK not compiled in this sandbox (SDK blocked); built by CI. |
| 9 | Documentation | ✅ done |

Checks run after the milestones: `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build`, `npm run build:native`, and `npx playwright test` (phone + tablet).

## 4. Scope of the MVP

Must work end to end, offline, on a phone:

- Onboarding (language, daily goal, audio check).
- Course path with real lessons for all three languages (≥ 12 per language).
- Lesson player with ≥ 3 exercise types per lesson, warm-up, retrieval test without hints,
  explanations after mistakes, summary and follow-up suggestion.
- Spaced-repetition reviews mixing recognition, listening, recall, spelling, dictation and speaking.
- Audio Quest: hands-free listening session, audio flashcards, listen & repeat, shadowing,
  dictation, dialogues and stories with comprehension questions, slow/normal/natural speed.
- Daily goal, active-time tracking, forgiving streak, daily quests, weekly challenge, XP/levels,
  badges, personal bests, recommendations.
- Kana/kanji writing with stroke order; freehand lesson notes; stylus mode.
- Settings, reminders, JSON export/import, reset.
- Android project + CI that produces a debug APK.

Out of scope for the MVP (documented as future work): accounts/sync, server-side ASR,
recorded native-speaker audio, AI tutors, additional interface languages (architecture ready).
