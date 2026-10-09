# Audio and Audio Quest

## 1. Audio Quest: requirement → implementation

| # | Requirement | Where it lives |
| --- | --- | --- |
| 1 | Listen to a word, identify its meaning | Audio Quest → *Słuchaj i rozpoznawaj* (`/audio/listen`); listening exercises in lessons and reviews |
| 2 | Listen to a phrase, choose the translation | Same mode (sentences make up about 30% of it); `listen-sentence` exercises in lessons/reviews |
| 3 | Short conversation + comprehension questions | Lesson dialogues (*Dialog* step + questions); Audio Quest → *Dialogi i historie* (stories unlock after their lesson) |
| 4 | Listen and repeat | *Słuchaj i powtarzaj* (`/audio/repeat`); speaking steps in lessons |
| 5 | Shadowing | *Shadowing* (`/audio/shadowing`): several rounds, from slow to natural, speaking along with the model |
| 6 | Slow, normal, natural playback; replay | Every audio button has a "slow" companion; replay is always free; the hands-free player has natural speed at stage 3 |
| 7 | Audio flashcards | *Audio fiszki* (`/audio/flashcards`): hear → recall → reveal → self-rate (updates SRS) |
| 8 | Dictation | *Dyktando* (`/audio/dictation`) and dictation exercises in lessons/reviews (accent- and typo-tolerant checking) |
| 9 | Listen-first vocabulary reviews | *Słuchaj i rozpoznawaj* and listening exercises in normal reviews pick due/weak cards first |
| 10 | Listening-only session with minimal visuals | *Sesja tylko słuchanie* (hands-free): one big card, three controls, optional **pocket mode** (black screen, tap = pause/resume, long-press = exit) |
| 11 | Background / screen-off practice where supported | Pocket mode keeps the screen on (Wake Lock API / KeepAwake plugin). Media Session handlers (play/pause/next/previous) are registered where the browser exposes them. True screen-off TTS is **not guaranteed**; the app says so on the Audio Quest screen. |
| 12 | Playlists from current lessons and the review queue | Hands-free playlists are built from the learner's cards, due and weakest first, or from one lesson (`?lesson=…`, offered after each lesson). Sized to 5/10/15 minutes. |
| 13 | Stories and dialogues from known vocabulary | 14 (es) / 15 (de) / 8 (ja) lesson dialogues; 5 + 5 + 4 stories, each unlocked only after the lesson whose vocabulary it uses |
| 14 | Clear beginner audio → more natural speech | Listening stages 1–3: stage 1 plays slow then normal, stage 2 normal, stage 3 natural rate. Chosen automatically from course progress (< 30% / < 65% / later) and changeable. |
| 15 | Repeat a difficult phrase several times without penalty | Replay never affects scoring. In hands-free mode, *Trudne — powtórz 3×* replays the current item 3 times and marks it for extra review. |

**Meaning after listening.** Hands-free entries follow *listen → pause to think → meaning
(spoken Polish narration, or shown on screen) → listen again → pause to repeat aloud*.
Flashcards reveal meaning only after an attempt to recall it. Dialogue and story steps play
first, with the transcript and translation hidden until requested.

**Recommended headphone session (5–15 min).** Audio Quest → *Rozpocznij sesję*. With 10
minutes at stage 1 the playlist holds about 46 entries (≈ 13 s each).

## 2. Engines

| Platform | Text-to-speech | Speech recognition (optional, off by default) |
| --- | --- | --- |
| Web / PWA | Web Speech API `speechSynthesis`. Voices come from the browser/OS; some are network voices. | Web Speech API `SpeechRecognition`. In Chrome this is server-based (needs internet, sends audio to the vendor). Not available in every browser (e.g. Firefox). |
| Android (Capacitor) | `@capacitor-community/text-to-speech` → Android TextToSpeech service (Android WebView has no `speechSynthesis`) | `@capacitor-community/speech-recognition` → Android SpeechRecognizer (offline only if the device has the language pack) |

- **Voice choice.** Voices are ranked: exact region first (es-ES, de-DE, ja-JP), then local,
  then "natural/neural/enhanced" names. Users can choose a voice per language in Settings and
  test it there.
- **Accents.** Spanish listening items are tagged es-ES (Spain) or es-MX (Mexico), German
  de-DE or de-AT. The accent is shown next to the line. When no voice for that region is
  installed, the app says which voice it used instead.
- **Two speakers.** Dialogues use voice slots A/B. With only one voice installed, slot B gets
  a lower pitch so the speakers stay distinguishable.
- **Speeds.** Rates come from `rateFor(speed, stage)`: slow 0.62; normal 0.82 / 0.92 / 1.0 by
  stage; natural 1.05. All are multiplied by the user's speech-rate setting (70–130%).
- **Failure handling.** A watchdog finishes utterances that never report an end, which some
  engines do after backgrounding. Stopping playback settles every pending utterance. A
  failed utterance becomes a short pause, so the hands-free playlist keeps going with
  on-screen text. When no voice exists, listening exercises show the text and say so.
- **Recorded audio (extension point).** `src/services/audio/recorded.ts` maps exact texts
  to files under `public/audio/<course>/`. Mapped recordings are played instead of TTS. The
  MVP ships none (see CONTENT_SOURCES.md for licensed candidates).

## 3. Pronunciation quality by language

**Not evaluated by ear in this project.** The build sandbox has no audio output, and headless
Chromium there has no voices: every utterance fails with `synthesis-failed`, which the app
handles. The notes below describe what the content does to help the engines and what to
check on real devices. They are not listening-test results.

| Language | What the app does | What to verify on a device |
| --- | --- | --- |
| Spanish | Plain text to the es-ES / es-MX voice; `/`-alternatives are read as a pause. | Stress on accented words, ¿/¡ handling, the difference between regional voices. |
| German | Plain text to de-DE / de-AT. | Umlauts and ß, sentence melody of questions, separable verbs at clause end. |
| Japanese | Kana items are sent as kana. Single kanji items are sent with their main reading (`reading` field) to avoid wrong on/kun choices. Sentences are sent without furigana markup, and authors can override any text with a `tts` field. | Kanji readings in sentences (engine-dependent), particle は read as "wa", long vowels and っ, **pitch accent** (the app does not and cannot check it). |

Expectation, to be checked on devices: current Spanish and German system voices are
generally intelligible. Japanese is the most likely to misread kanji in context and to
produce unnatural pitch accent. This is why kana readings are supplied wherever the content
allows.

## 4. Pronunciation feedback, honestly

- No pronunciation score is ever shown.
- Provided instead: model audio (normal and slow), **record yourself and compare**
  (MediaRecorder), shadowing rounds, syllable/mora breakdown for Japanese, and
  self-assessment (*Brzmiało podobnie / Częściowo / Muszę poćwiczyć*).
- Optional speech recognition displays "System rozpoznał: …" with matched words highlighted,
  plus a disclaimer that this measures intelligibility for a recogniser, not correct
  pronunciation. For Japanese it compares kana-normalised text only. Pitch accent cannot be
  judged this way.

## 5. Background playback limitations

| Platform | Behaviour |
| --- | --- |
| Browser tab | Chrome on Android typically pauses speech synthesis when the tab is hidden. Keep the screen on (pocket mode) for reliable playback. |
| Android app | The app skips stopping audio when it goes to the background during a hands-free session. Android may still throttle the WebView's timers, so the gaps between phrases can stretch or stop. Pocket mode is the reliable option. |
| Media Session (lock screen) | Registered when available. With TTS-only audio, browsers may not show controls because no media element is playing. |

A future native audio service (foreground service + pre-rendered TTS files) would make
screen-off sessions reliable; see README → Future work.

## 6. Options considered

| Option | Decision |
| --- | --- |
| Device TTS (Web Speech / Android TTS) | **Used.** Free, offline once voices are installed, good quality on most modern devices. |
| eSpeak NG | Not bundled: GPL-3.0 obligations and less natural formant synthesis (see CONTENT_SOURCES.md). Could be a last-resort fallback. |
| Openly licensed recordings (Lingua Libre / Commons, Tatoeba audio) | Not bundled in the MVP. Per-file licence tracking is needed; the extension point is ready. |
| Cloud TTS/ASR APIs | Rejected for the core experience: paid accounts, privacy, internet required. |
| Whisper-compatible on-device ASR | Future option. Model size and battery cost are high, and it only transcribes. |
