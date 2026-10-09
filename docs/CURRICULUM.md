# Curriculum

All course text (vocabulary, sentences, dialogues, stories, grammar notes, exercises and
Polish explanations) was written for this project. It is validated by automated content
tests (structure, references, no placeholders), but it **has not yet been proofread by
native speakers**. That review is the first recommended step before a public release.

| Course | Framework | Units / lessons | Items | Sentences | Grammar notes | Authored exercises | Dialogues / stories | Lesson time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Spanish | CEFR A1 → intro to A2 | 4 / 14 | 165 (114 words, 51 phrases) | 101 | 27 | 60 | 14 / 5 | ≈ 2 h |
| German | CEFR A1 → intro to A2 | 4 / 15 | 171 (122 words, 49 phrases) | 103 | 26 | 62 | 15 / 5 | ≈ 2.2 h |
| Japanese | Kana + JF Standard A1 (JLPT N5 only as orientation) | 4 / 18 | 273 (121 kana, 29 kanji, 56 words, 67 phrases) | 98 | 36 | 68 | 8 / 4 | ≈ 3.3 h |

Reviews, Audio Quest and stories add open-ended practice on top. The courses are a solid
start towards A1, not a complete A1 course. See docs/LEARNING_METHODOLOGY.md §2.

## Shared lesson format

Every lesson is turned into a session by `buildLessonSession` (tested for every lesson):

1. **Objective** (can-do statement), plus an optional pronunciation primer.
2. **Warm-up**: quick recall of weak or due items from earlier lessons (from the second
   lesson on).
3. **New material**: items introduced in chunks of three (kana: five) with audio, meaning,
   notes, gender/plural and a memory tip, each followed by recognition and listening practice
   and interleaved recall of the previous chunk.
4. **Grammar notes** with tables, tappable examples and a "Po polsku…" contrast, followed by
   authored gap/choice exercises with explanations.
5. **Contextual examples** and word-order / sentence-listening exercises.
6. **Dialogue** with per-speaker voices and comprehension questions.
7. Matching, **speaking** (repeat/shadow), and for Japanese **writing** (tracing).
8. **Retrieval test without hints**: production and listening, covering the lesson's items.
9. **Summary** of what was learned, results, and a **recommended follow-up** (a short review
   later, or listening to the lesson in Audio Quest).

Every lesson has at least three graded exercise types. Wrong answers get an explanation and
are re-practised at the end of the lesson.

## Spanish (es)

| Unit | Lessons (topics and grammar) |
| --- | --- |
| **Pierwsze kroki** | 1 Greetings (*¡Hola!*; time-of-day greetings; ¿ ¡) · 2 Introductions (*ser*, nationality m/f) · 3 Pronunciation & survival phrases (reading rules, written accent; **Mexican-Spanish dialogue**) |
| **Ludzie i rzeczy** | 4 Gender & number, articles *el/la/los/las/un/una* · 5 Numbers 0–20 & age (*tener*) · 6 Family (*mi/tu/su*, plural *ser*) |
| **Codzienność** | 7 Present tense *-ar* verbs, *tú/usted* · 8 Questions & negation · 9 Café: *-er/-ir* verbs, ordering · 10 Telling the time · 11 Days of the week |
| **W świecie** | 12 Travel: *estar* vs location, *ir* · 13 University: adjective agreement, *tener que* · 14 Plans & memories: *ir a* + infinitive, *pretérito perfecto* (first look at future and past) |

Accents: listening items are tagged **es-ES** or **es-MX**, and the tag is shown.
Stories: *Nowa w Madrycie*, *Rodzina Pabla*, *Zwykły dzień Eleny*, *Wyjazd do Barcelony*,
*Mój pierwszy rok hiszpańskiego*.

## German (de)

| Unit | Lessons (topics and grammar) |
| --- | --- |
| **Erste Schritte** | 1 Greetings, nouns capitalised · 2 Introductions: *sein*, *du/Sie* · 3 Pronunciation (letter clusters, vowel length, stress; **Viennese station dialogue**, de-AT) |
| **Menschen und Dinge** | 4 *der/die/das*, plural · 5 Numbers & age · 6 Family: *mein/meine*, *haben* |
| **Alltag** | 7 Present tense, **verb-second word order** · 8 Questions (verb 1st/2nd), *nicht* vs *kein* · 9 Food & drink: **accusative**, stem-changing verbs · 10 Time · 11 My week: days, **separable verbs** |
| **Unterwegs** | 12 **Modal verbs** and the sentence bracket · 13 Travel: **dative** after *mit/zu/in*, *nach/zu/in* · 14 University: *weil* (verb-final) · 15 *Perfekt* with *haben/sein* (intro to A2) |

Cases are introduced progressively (accusative in lesson 9, dative in lesson 13), only after
the learner can already use basic phrases. Accents: de-DE and **de-AT**. Stories: *Nowy
sąsiad*, *Rodzina Leny*, *Sobotni poranek*, *Podróż do Wiednia*, *Pierwszy semestr*.

## Japanese (ja)

A dedicated curriculum, not a translation of the European courses.

| Unit | Lessons (topics and grammar) |
| --- | --- |
| **Hiragana** | 1 あ–こ (**mora timing**, stroke order) · 2 さ–と (shi, chi, tsu) · 3 な–ほ (fu; look-alikes ぬ/め, は/ほ) · 4 ま–ろ (Japanese r) · 5 わ, を, ん + dakuten · 6 だ, ば, ぱ (handakuten) · 7 Yōon (きゃ), small っ, long vowels (length changes meaning) |
| **Katakana** | 8 ア–ソ (when katakana is used; ー) · 9 タ–ホ (foreign sounds) · 10 マ–ン + dakuten (e.g. ポーランド) |
| **Pierwsze rozmowy** | 11 Greetings: polite vs casual, は read *wa* · 12 Self-introduction: **X は Y です**, じゃないです, 〜さん · 13 Questions: か, これ/それ/あれ, **の**, **も** · 14 Numbers & shopping: 〜を ください, what kanji are, kanji 一–十 百 千 円 |
| **Codzienność** | 15 Time & weekdays (〜じ, はん, 〜ようび; kanji 日 月 火 水 木 金 土; one character, several readings) · 16 **ます forms** and particles **を, に, で, へ**; verb-final word order · 17 Likes: 〜**が** すきです, い-adjectives, polite refusal · 18 Travel: あります/います, positions (上 下 中), で "by means of" |

Particles covered: は, が, を, に, で, の, も, へ, か.
Kanji (29): 一二三四五六七八九十百千円 日月火水木金土 人山川口大小上下中, each with
on/kun readings and example words.

- **Readings and romaji.** Kanji are shown with furigana (toggle in Settings). Romaji is a
  temporary aid: shown automatically until all hiragana lessons are completed, after that
  only as an optional hint that schedules the item for earlier review (Settings: on
  automatically / always / never). Typing accepts kana or romaji (converted to kana with a
  live preview), encouraging a later switch to a Japanese keyboard.
- **Spacing.** Beginner word spacing in sentences can be turned off.
- **Writing.** Every kana lesson offers tracing for its characters. The Writing hub covers all
  hiragana, katakana and the 29 kanji with stroke-order animation, tracing, writing from
  memory and freehand. Feedback is rule-based (stroke count, start point, direction) plus
  self-assessment. There is no handwriting "recognition".
- **Polish contrasts.** Grammar notes compare Japanese with Polish:
  - the verb or です comes at the end;
  - particles do the job of case endings (を ≈ accusative, で ≈ instrumental or "in");
  - verbs do not change by person;
  - modifiers and positions come before or after the noun (の, つくえの した);
  - politeness is systematic, and 〜さん is gender-neutral.
- Stories: *Hana się przedstawia*, *W sklepie*, *Mój dzień*, *Wycieczka do Kioto*.

## Quality checklist for new content

- Original text, or a licensed source recorded in CONTENT_SOURCES.md.
- Every item has a Polish gloss; variants go in `plAlts` / `alts` so that answer checking
  accepts them.
- Sentences use only vocabulary from the same or earlier lessons; stories unlock after the
  lesson that completes their vocabulary.
- Japanese: provide `reading` for kanji items and `tts` overrides wherever TTS might
  misread.
- Run `npm test`. The content tests fail on duplicate ids, broken references, unanswerable
  questions or placeholder text.
