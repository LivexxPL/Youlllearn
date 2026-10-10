# Architecture

One TypeScript/React codebase serves the browser (PWA) and the Android app (Capacitor
WebView). No server, no account: everything runs and is stored on the device.

```
src/
  app/          App shell: hash router (+ Android back-button stack), navigation, lazy routes
  components/   Design-system components (buttons, sheets, progress, charts, audio buttons…)
  config/       brand.ts: name, ids, colours (single place to rebrand)
  content/      Courses (es, de, ja): typed data + registry with lookup tables
  engine/       Pure, unit-tested logic: SRS, answer checking, kana/romaji, exercise and
                session builders, gamification, recommendations, levels, audio playlists
  features/     Screens: home, learn, lesson, session player (14 step types), review,
                audio (Audio Quest), progress, settings/about, writing (pad, kana chart, notes)
  i18n/         Message catalogue (Polish) + t(), plural rules, formatting
  services/     Side effects: IndexedDB (Dexie), progress recording, activity timer,
                audio (TTS/recording/recognition), notifications, backup, keep-awake, PWA
  state/        Settings context + data hooks (Dexie live queries)
  styles/       tokens.css (design tokens, light/dark), base, components, layout, features
e2e/            Playwright tests (phone + tablet) and the screenshot tour
scripts/        Stroke-data extraction (KanjiVG), icon generation
android/        Capacitor Android project
```

## Data flow

1. **Content** (`src/content/<lang>/`) is plain typed data: units (each with a level label:
   Kana, A1, A2) → lessons → items, sentences, grammar notes, authored exercises, dialogue,
   summary. `registry.ts` builds lookup maps (id → item / lesson) once per course. Content
   validation tests check ids, references, dialogue questions, tile rebuilds, that no word or
   sentence is introduced twice, Japanese specifics (romaji, readings, kanji written with
   furigana and only after they are taught), and guard against placeholder text.
2. **Engine** functions turn content + the learner's cards into concrete exercise lists
   (`buildLessonSession`, `buildReviewSession`, Audio Quest builders). They are
   deterministic for a given seed, which makes them testable.
3. **Session player** (`features/session/`) renders steps and collects outcomes.
4. **Services** write results: SRS cards, lesson progress, daily statistics, XP, quests and
   achievements (`services/progress.ts`). Screens subscribe to IndexedDB through
   `useLiveQuery`, so every view updates after a write without a global store.

## Persistence (IndexedDB via Dexie)

| Table | Content |
| --- | --- |
| `settings` | One record: courses, goal, theme and colour palette, audio, romaji/furigana, stylus, reminders… |
| `cards` | SRS state per item/sentence/concept (docs/SRS_ALGORITHM.md) |
| `lessonProgress` | Completion, best/last accuracy per lesson |
| `dailyStats` | Per day: active seconds, listening seconds, open seconds, exercises, correct, new items, reviews, lessons, speaking, writing, audio sessions, XP, best run, courses |
| `achievements`, `rewards` | Unlocked badges; claimed quest/challenge rewards (granted once) |
| `drawings` | Handwriting practice (`practice:<char>`) and lesson notes (`note:<lessonId>`), normalised stroke points with pressure |
| `meta` | Streak state, lesson resume position, story results, flags |

Export/import (`services/backup.ts`) writes all tables to a versioned JSON file and
validates it before replacing data. "Reset" clears everything after typed confirmation.

**Active time vs open time.** `services/activity.ts` counts a second as *active* only while
a learning activity is open **and** the learner interacted within 60 s, or Audio Quest is
playing. Time the app is merely visible is stored separately (`openSec`) and shown next to
it, never counted towards the goal.

## Routing and navigation

A hash router (`app/router.ts`) works the same on static hosting, as an installed PWA and in
the Capacitor WebView. Full-screen activities (lesson, review session, Audio Quest
sessions, writing practice, notes, onboarding) hide the navigation. The Android back button
and Escape run a stack of back handlers: open sheet → quit confirmation → previous screen →
minimise the app.

Layout breakpoints (`styles/layout.css`): phones get a bottom tab bar; ≥ 768 px a navigation
rail; ≥ 1100 px a labelled sidebar and two-column dashboards. Content width is capped
(680 px for reading and exercises), so tablets don't get stretched lines.

## Design system

- **Tokens** (`styles/tokens.css`): spacing on a 4 px grid, radii, type scale, 48/56 px touch
  targets, and colour roles for light and dark themes. Theme, text size (4 steps, on top of
  system font scaling) and motion (system / reduced / full) are user settings.
- **Colour palettes** (`config/palettes.ts`): the classic palette lives in `tokens.css`; seven
  pastel palettes (strawberry, mint, lavender, peach, lemon, sky, candy floss), each with a
  light and a dark version, override the colour tokens as inline custom properties on
  `<html>` (`services/appearance.ts`), with an optional background motif (an SVG tile).
  `palettes.test.ts` checks every palette and mode: body text ≥ 7:1, secondary text, links,
  buttons, hero text and status colours ≥ 4.5:1, chart bars ≥ 3:1, and that the classic data
  matches `tokens.css`. The applied colours are cached in localStorage, and a small inline
  script in `index.html` paints them before the app loads (no flash of the default theme).
- **Components** (`components/ui.tsx`, `components.css`): buttons with a tactile pressed
  state, cards, chips, progress bar and ring, switch, segmented control, list rows, bottom
  sheet (focus trap, Escape/back to close), banners, toasts.
- **Charts** (`components/charts.tsx`): validated with the dataviz palette validator
  (OKLCH lightness band, chroma floor, colour-vision-deficiency separation, normal-vision
  floor, contrast against the card surface):

  | Palette | Light (`#ffffff` surface) | Dark (`#161d26` surface) |
  | --- | --- | --- |
  | Memory states: established / learning / due / needs practice | `#1baf7a` `#2a78d6` `#eda100` `#e87ba4`: all checks pass; contrast < 3:1 for three swatches, so **every swatch has a text label and count** (legend doubles as table view) and status pills always carry text | `#199e70` `#3987e5` `#c98500` `#d55181`: all checks pass |
  | Minutes per day (single series) | `#0d9488`: pass | `#0fa595`: pass |

  Charts follow the rules: one axis, a solid goal reference line, 2 px surface gaps between
  stacked segments, a per-bar tooltip on hover and keyboard focus, and a table view.
  Identity is never conveyed by colour alone.

## Internationalisation

All UI strings live in `src/i18n/pl.ts`; `t(key, params)` handles `{param}` interpolation and
plural categories via `Intl.PluralRules` (Polish one/few/many/other). Copy is gender-neutral
(present tense, impersonal forms). To add an interface language:

1. Create `src/i18n/<lang>.ts` typed as `Catalog` (missing keys fall back to Polish).
2. Register it in `src/i18n/index.ts` and add the option to Settings.
3. Course glosses are in `pl` fields; add sibling fields (e.g. `en`) and extend `gloss()` in
   `src/content/text.ts`.

## Adding a course or lessons

Add `src/content/<id>/` with units, lessons, stories and an `index.ts` `CourseDefinition`,
then register it in `registry.ts` and `COURSE_ORDER`. The content tests run on every course
automatically. Each lesson needs an objective, items, sentences, ≥ 3 graded exercise types
(the session builder guarantees variety), a summary and, ideally, a dialogue. Give every
unit a `level` (shown on the learning path, used for progress per level and the "start at
this level" shortcut). New Japanese unit files are picked up by `npm run strokes`
automatically.

## Testing

| Layer | Tool | What |
| --- | --- | --- |
| Engine, content, services | Vitest (`npm test`) | SRS math, answer checking (accents, typos, ß/umlauts, romaji→kana), kana conversion, session builders for **every** lesson, gamification, recommendations, audio playlists, backup round-trip, stroke hints, brand/config sync, content integrity |
| App | Playwright (`npm run test:e2e`) | Phone (Pixel 7) and tablet (1180×820): onboarding, full lesson → progress, starting at A2 and continuing from there, resume, review, audio flashcards and hands-free player, kana chart, writing practice with autosave, lesson notes, export → reset → import |
| Visual QA | `SCREENSHOTS=1 npm run test:e2e -- visual` | Screenshot tour on phone (light and dark), tablet and desktop |

## Performance notes

Routes are lazy-loaded. Course content for all three languages (~340 KB of source, under
100 KB gzip) and stroke data (~21 KB gzip, loaded on first use) ship with the app, so it works offline from the first
start. The web build precaches ~1 MB with Workbox. The native build skips the service
worker, because Capacitor serves files from the APK.
