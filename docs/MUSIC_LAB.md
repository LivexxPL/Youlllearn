# Music Lab — learning languages through YouTube songs

Music Lab turns a song into lessons: the learner pastes a YouTube link and the lyrics, and gets
the lyrics in sync with the video, translations, the song's words in the regular reviews,
grammar notes adapted to their level, and exercises built from the song. Japanese gets
furigana, a kana reading line and Hepburn romaji from a morphological analysis that runs in
the browser.

Entry points: *Audio* tab → **Music Lab**, the Music Lab card on the home screen, or
`#/music`.

## What the learner can do

| Area | Details |
| --- | --- |
| Songs | Add a song: YouTube link (optional), title, artist, language, lyrics (paste or `.lrc`/`.srt`/`.vtt`/`.txt` file), optional line-by-line Polish translation. Edit, delete, favourite, export the lyrics as LRC. Three public-domain samples (Japanese, Spanish, German) with Polish translations. |
| Player | Official YouTube IFrame player; play/pause, speed 0.5×/0.75×/1×, tap a line's time to play it, loop a line, resume where you stopped (per device), karaoke view. Clear messages for private/removed videos, videos that cannot be embedded (also region- and age-restricted ones), no network, blocked player — always with an "Open in YouTube" link. |
| Sync | Lines are highlighted from the times in the file (LRC/SRT/VTT) or from **tap-sync** (play the video, tap when each line starts; ±0.1 s nudges; Space/Enter). A delay setting shifts all lyrics. Words/syllables are highlighted only when the file has word times (enhanced LRC `<mm:ss.xx>`, WebVTT `<00:00:12.500>`); nothing is estimated. |
| Display | Original text with tappable words; Japanese: furigana, hiragana/katakana reading line, romaji; Polish translation (own, sample or AI — AI lines are labelled, uncertain ones flagged). Display choices are remembered on the device. |
| Words | Tap a word: dictionary form, reading, romaji, part of speech, conjugated form (Japanese), meaning (course / own / AI, always labelled), "add to reviews", "I know it", own meaning, reading correction (Japanese). Words tab: all words with status filters. |
| Grammar | Per line and per song: constructions found by rules (particles, verb forms, contractions, set phrases…), each with a Polish explanation and a level; those above the learner's level are shown as "for later". |
| Practice | Eight exercise kinds from the song (below); results go to the review cards and to the song's line progress. |
| Library | Search, language/progress/favourite filters, sorting, "continue" card, playlists (create, rename, reorder, delete). |
| Difficulty | Orientation level from course-vocabulary coverage, share of words the learner knows, number of lines, words and kanji. |
| AI (optional) | Natural and literal translations, notes on idioms/wordplay, meanings of words outside the course — with the learner's own Anthropic API key. |

## Architecture

```
src/music/                 pure logic (unit-tested)
  youtube.ts               link parsing, IFrame API error codes
  lyrics.ts                plain/LRC/SRT/VTT parsers, active line/word, LRC export, edit reconciliation
  japanese/tokens.ts       tokens → furigana, reading line, Hepburn romaji, chunks, form labels
  japanese/dictionary.ts   builds the kuromoji tokenizer from the IPADIC files
  japanese/analysis.worker.ts   analysis in a Web Worker (download, Cache API, unpacking)
  japanese/analyzer.ts     main-thread client (one worker, stopped when idle)
  grammar.ts               rule-based grammar notes (Japanese tokens; Spanish/German patterns)
  vocab.ts                 words of a line, course dictionary lookups
  practice.ts              words with meanings, review card refs, reading corrections
  exercises.ts             the eight exercise kinds in the app's exercise formats
  difficulty.ts            coverage-based difficulty
  reviewItems.ts           the learner's song words as Items for the existing review engine
  samples.ts               public-domain samples
  ai.ts                    optional Claude assistant (request, validation, costs)
src/services/music.ts      storage, practice session recording, statistics
src/features/music/        screens: library, add/edit, song, sync, practice, playlist, AI settings
```

The existing pieces are reused, not duplicated: the session player and exercise steps, answer
checking, the SRS engine and its cards, the coin ledger, quests, achievements, TTS, the Dexie
database and its cloud/backup machinery.

### Data

Dexie version 3 adds three synchronised tables and two device-only ones:

| Table | Content | Sync / backup |
| --- | --- | --- |
| `songs` | lyrics with times and translations, video id, delay, reading corrections, AI glosses, line progress | yes; newer edit wins, line progress of both devices is combined; a deleted song stays as an empty record so a cloud copy cannot bring it back |
| `playlists` | name and ordered song ids | yes; newer edit wins (deletion records likewise) |
| `words` | words the learner saved: status (`new`, `known`, `learning`), own/AI meaning, contexts, course item | yes; newer change wins, contexts merged |
| `songCache` | Japanese analysis per song (fingerprint of the line texts) | no (device-only, derived) |
| `songState` | playback position and last opened time | no (device-only) |

Backup format 3 includes the three learner tables (older files still import). Device-only tables
are cleared on reset and on import. Changes to them never trigger a cloud upload.

### Review integration (no second SRS)

- A word the course teaches (matched by spelling, or for Japanese by the reading of its
  dictionary form — 遊ぶ ↔ あそぶ) uses **the course item's card**.
- Any other word becomes a card `w:<lang>:<word>` in the same `cards` table, with an Item built
  from the learner's entry (`src/music/reviewItems.ts`): its meaning, Japanese furigana, and the
  song line as the example sentence. Review sessions, the review list and Audio Quest load these
  Items (`useStudyCourse`) and treat them like course items, with the same SRS rules.
- Adding a word seeds the card like an item seen in a lesson (first review after ~10 minutes).
- Practice sessions create cards for practised words (like lesson completion) and review existing
  ones. Words marked "known" are left out of practice.

### Japanese analysis

- **kuromoji 0.1.2** (Apache-2.0) with its bundled **IPADIC** dictionary (IPADIC licence, permissive).
  The tokenizer is built from kuromoji's own modules; the dictionary files (12 files, 17 MB
  compressed, ~100 MB in memory) are emitted by a Vite plugin as `kuromoji/*.dic` (gzip data under a
  neutral extension, so no server adds `Content-Encoding` and the Cache API keeps 17 MB, not 100).
- The analysis runs in a Web Worker: first use downloads the dictionary (with progress), keeps it
  in the Cache API (`pq-ja-dictionary-v2`) and unpacks it with `DecompressionStream`. The worker is
  stopped after 90 s without work so its memory is released. Results are cached per song on the
  device, so a song analysed once opens instantly and offline.
- The Android app does not ship the 17 MB dictionary; it downloads it once from the published web
  app (GitHub Pages allows cross-origin requests) and keeps it offline the same way.
- Furigana go over kanji only; okurigana are aligned (食べる → 食(た)べる, 取り扱い → 取(と)り扱(あつか)い).
  Katakana and kana stay as written. The reading line replaces kanji with hiragana.
- **Romaji**: modified Hepburn — long vowels with macrons from the dictionary's pronunciation
  (東京 Tōkyō, 学校 gakkō, コーヒー kōhī), `ei` kept (先生 sensei), particles as pronounced (は wa,
  へ e, を o), っ doubles the consonant (matcha, hamatte), ん before a vowel or y as n'. A word and
  its endings are romanised together (遊びましょう asobimashō, 行かなきゃ ikanakya). This differs from
  the course's typing-oriented romaji (`ou`, `oo`), which matches what learners type on a keyboard;
  answer checking accepts both.
- **Reading corrections**: the dictionary picks the most likely reading, which is sometimes wrong
  (今日は as the greeting こんにちは). The learner can correct a word's reading; the correction is
  stored on the song and applied to furigana, the reading line, romaji and exercises.
- Words are tapped as chunks (a word with its endings); the sheet shows the dictionary form, its
  reading and the conjugated form (polite, past, negative, te-form, volitional, contracted
  〜てる/〜ちゃう…).

### Grammar notes

`src/music/grammar.ts` holds 44 Japanese and 19 Spanish/German explanations written for the app.
Japanese rules read parts of speech and conjugations (particles は/が/を/に/で/へ/と/も/の/か,
sentence-final particles, から/まで/けど/のに/ながら, te-form, 〜ている/〜てる, 〜てしまう/〜ちゃう,
〜ます/〜ましょう, past, 〜たら, negation including ぬ/ん and 〜なきゃ, 〜たい, volitional, copula,
〜んだ, causative, passive/potential, i- and na-adjectives, pronouns typical of songs, って, なんて,
classical forms). Spanish and German rules match patterns (gustar, ir a, estar + gerundio, tener
que, hay, ser/estar, diminutives, double negation, contractions, que + subjuntivo; modal verbs,
Perfekt, nicht/kein, -chen/-lein, contractions, apostrophe elision, Dativ prepositions,
two-way prepositions, lasst uns).

Each note has a level (JLPT-style N5/N4/N3 for Japanese, CEFR for Spanish/German). The learner's
level comes from their course position; notes above it are folded under "for later". The UI says
these are automatic hints and can miss unusual lyrics.

### Exercises

| Kind | Format reused | Source | Result goes to |
| --- | --- | --- | --- |
| Fill in the missing word | gap (authored) | a song line, a word from it; wrong options are other words of the song | line + word card |
| Listening: which line was sung | choice (listen-target) | the line played **from the video segment** (timed lyrics) or speech synthesis (labelled) | line |
| Matching words and meanings | match | words with meanings | word cards |
| Translation | choice (read-sentence) | the line; options are other lines' translations | line |
| Put the line in order | order | the line's words (Japanese: chunks with furigana) | line |
| Reading (Japanese) | choice (reading) | kanji words; options are readings of other words | word card / line |
| Grammar identification | choice (authored, with the line shown) | a construction found in the line; options are other notes | line |
| Dictation | type (dictation) | the line from the video or TTS; Japanese accepts the kana reading | line |

Nothing is invented: every prompt is a line or a word of the song; wrong options come from the
same song or the course. Listening exercises play the line in the **visible** player above the
exercises (YouTube does not allow hidden or audio-only playback). Lines never answered correctly
come first.

### Difficulty

The orientation level is the first course level whose vocabulary covers at least 60% of the
song's words (content words; Japanese uses dictionary forms). Shown with the coverage per level,
the share of words outside the course, the share the learner knows (review cards with a
correct answer, or marked as known), the number of lines and words, and for Japanese the number
of different kanji. JLPT-style labels come from the Japanese course units' references; the screen
states that this is an estimate based on the course vocabulary, not an official CEFR or JLPT
classification.

### Rewards (anti-farming)

- Playing a video earns nothing: no XP, coins, listening minutes or quests.
- Practice sessions give XP for correct answers like other sessions, count exercises for quests,
  and coins via the practice tiers: words and lines **answered correctly** that have not earned
  Music Lab coins today (`practice` entries with family `music`; the session id prevents double
  payment).
- New review cards from a session count as new words for the "new words" quest.
- Badges: *Pierwsza piosenka* (first session), *Śpiewnik* (50 different lines answered correctly),
  *Słowa z tekstów* (25 own song words answered correctly in reviews or practice), *Własna
  playlista* (5 different songs practised), *Znam to na pamięć* (every line of a song of at least
  8 lines answered correctly). Words merely added to the reviews do not count for the vocabulary
  badges (they count once practised).

## External services, costs and limits

| Service | Used for | Cost | Notes |
| --- | --- | --- | --- |
| YouTube IFrame Player API (`www.youtube.com/iframe_api`) | playing videos | free | Needs the internet. Only documented player methods are used. YouTube's terms apply (visible player of at least 200×200 px, no hidden or audio-only playback); YouTube may set cookies when the player loads. |
| YouTube oEmbed (`www.youtube.com/oembed`) | optional "get title" button | free | May be blocked by the browser (CORS); then the learner types the title. |
| kuromoji + IPADIC | Japanese analysis | free, offline after the first download | 17 MB download once per device; ~100 MB memory while analysing. |
| Anthropic Messages API (`api.anthropic.com`) | optional AI assistant | **paid by the key owner** | See below. |

No lyrics, captions or other content are read from YouTube, and no undocumented endpoints are
used. The app ships no copyrighted lyrics; the three samples are public-domain texts.

### Optional AI assistant

- Official SDK `@anthropic-ai/sdk` (loaded only when used; not precached), structured outputs
  (`client.beta.messages.parse` + JSON schema), effort `medium`.
- Models and prices per million input/output tokens: **Claude Opus 5.5** (default) $4 / $20,
  **Claude Sonnet 5.5** $2 / $10, **Claude Haiku 5.5** $0.10 / $0.50. A typical 30-line song is about
  $0.12 with Opus, $0.06 with Sonnet and under $0.01 with Haiku; the exact estimate is shown before
  every request and the real cost (from the response's usage) afterwards. Reasoning tokens are
  billed as output and are part of the estimate.
- Opus and Sonnet requests opt into server-side refusal fallbacks (`fallbacks: "default"`, beta
  `server-side-fallback-2026-07-01`); Haiku has none. A refusal, a truncated answer or an invalid
  answer is reported plainly.
- Sent: the song's title, artist, language, lines (up to 120) and words without a meaning (up to
  150). The model is told to translate only the given lines and never to add or complete lyrics;
  answers about other lines or words are discarded. The learner's own translations are never
  overwritten.
- The key (`sk-ant-…`) is stored only on the device (device-only meta `ai`): not in backups, not
  in the Google Drive copy, sent only to `api.anthropic.com`. The browser request uses the SDK's
  `dangerouslyAllowBrowser` option, intended for a user's own key in their own browser. The screen
  explains that anyone with access to the browser can read the key and recommends a spending
  limit in the Anthropic console.
- Free alternatives (always available): course meanings, rule-based grammar, own translations.

## Offline

| Works offline | Needs the internet |
| --- | --- |
| library, lyrics, translations, words, grammar, difficulty, text exercises, exercises read by speech synthesis, reviews of song words, Japanese display of songs analysed before | the video and everything played from it, the first Japanese analysis on a device (dictionary download), the AI assistant, "get title" |

## Tests

- Unit: `src/music/lyrics.test.ts` (links, formats, timing, editing),
  `src/music/japanese/tokens.test.ts` (real kuromoji analysis: readings, furigana, romaji, chunks,
  reading corrections, grammar rules), `src/music/exercises.test.ts` (all eight kinds, known words,
  dictation answers, difficulty), `src/music/ai.test.ts` (requests, fallbacks, costs, validation,
  refusals — with a fake client, no network), `src/services/music.test.ts` (storage, deletion
  records, merge, review integration, practice recording, coins once per day, badges, backups).
- End-to-end (`e2e/music.spec.ts`, phone and tablet, with a fake IFrame API): lyrics following
  the video, seeking, looping, speed, karaoke; a word into the reviews; a full practice session
  playing lines from the visible video; error messages for links and non-embeddable videos;
  tap-sync; Japanese analysis in the browser with the dictionary served by the app and cached;
  AI key handling.

## Limitations and next steps

- Lyrics must come from the learner (copy, own transcription, an `.lrc` they have); the app does
  not search for lyrics.
- The Japanese dictionary can choose a wrong reading or split unusual words (names, slang,
  classical forms); readings can be corrected, segmentation cannot.
- Spanish and German words are matched by their written form (plus simple ending rules shown as
  "similar word"); there is no lemmatiser for them offline, so conjugated verbs often have no
  course meaning without the AI assistant or an own meaning.
- Grammar notes are rule-based and cover common constructions only.
- In the Android app YouTube may refuse embedded playback in the web view (error 152/153); the
  app then offers "Open in YouTube". Not yet tried on a device.
- Word timing is only available from files that contain it.
- Possible next steps: per-stanza practice from the line sheet, sharing a song's timing (not the
  lyrics) between devices of different users, a Spanish/German lemmatiser.
