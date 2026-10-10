# Curriculum

All course text (vocabulary, sentences, dialogues, stories, grammar notes, exercises and
Polish explanations) was written for this project. It is validated by automated content
tests (structure, references, no placeholders), but it **has not yet been proofread by
native speakers**. That review is the first recommended step before a public release.

| Course | Framework | Units / lessons | Items | Sentences | Grammar notes | Authored exercises | Dialogues / stories | Lesson time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Spanish | CEFR A1 → A2 | 6 / 23 (A2: 9) | 276 (203 words, 73 phrases) | 163 | 45 | 96 | 23 / 8 | ≈ 3.6 h |
| German | CEFR A1 → A2 | 6 / 24 (A2: 9) | 283 (200 words, 83 phrases) | 166 | 44 | 98 | 24 / 8 | ≈ 3.8 h |
| Japanese | Kana + JF Standard A1 → A2 (JLPT N5 → N4 only as orientation) | 6 / 25 (A2: 7) | 362 (121 kana, 62 kanji, 56 words, 123 phrases) | 121 | 50 | 96 | 15 / 7 | ≈ 4.7 h |

Reviews, Audio Quest and stories add open-ended practice on top. Every unit carries a level
label (Kana, A1, A2) shown on the learning path; learners who already know a level can start
the next one from its first unit, and "continue" then moves on from the furthest completed
lesson. A1 is covered; **A2 is well under way but not complete** (missing topics are listed
at the end of each course section). See docs/LEARNING_METHODOLOGY.md §2.

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
| **Dzień po dniu** (A2) | 15 Daily routine: **reflexive verbs** (*me levanto*, stem changes), sequencing · 16 Shopping & clothes: numbers to 100, prices, *este/ese*, **direct object pronouns** *lo/la/los/las* · 17 Weather & seasons: *hace*, *llueve*, months; *gustar / encantar / preferir* · 18 At the doctor's: *me duele(n)* (like *gustar*), *ser* vs *estar* for states, advice |
| **Opowiadamy o przeszłości** (A2) | 19 Yesterday: **pretérito indefinido** of *-ar* verbs; *he trabajado* vs *trabajé* · 20 The weekend: *-er/-ir* verbs, *ir/ser* (*fui*) · 21 Holidays: irregular *hice, tuve, estuve, pude, vine* (Mexican dialogue) · 22 **Comparisons**: *más/menos … que*, *tan … como*, *mejor/peor*, superlative · 23 Childhood: **pretérito imperfecto**, background vs event |

Accents: listening items are tagged **es-ES** or **es-MX**, and the tag is shown.
Stories: *Nowa w Madrycie*, *Rodzina Pabla*, *Zwykły dzień Eleny*, *Wyjazd do Barcelony*,
*Mój pierwszy rok hiszpańskiego*, *Pechowy poniedziałek*, *Wakacje na Jukatanie*,
*Dzieciństwo w Andaluzji*.

Not yet covered for a complete A2: the simple future and the conditional, the affirmative
and negative imperative, indirect object pronouns and their combination (*se lo*),
*por* vs *para*, and *estar* + gerund.

## German (de)

| Unit | Lessons (topics and grammar) |
| --- | --- |
| **Erste Schritte** | 1 Greetings, nouns capitalised · 2 Introductions: *sein*, *du/Sie* · 3 Pronunciation (letter clusters, vowel length, stress; **Viennese station dialogue**, de-AT) |
| **Menschen und Dinge** | 4 *der/die/das*, plural · 5 Numbers & age · 6 Family: *mein/meine*, *haben* |
| **Alltag** | 7 Present tense, **verb-second word order** · 8 Questions (verb 1st/2nd), *nicht* vs *kein* · 9 Food & drink: **accusative**, stem-changing verbs · 10 Time · 11 My week: days, **separable verbs** |
| **Unterwegs** | 12 **Modal verbs** and the sentence bracket · 13 Travel: **dative** after *mit/zu/in*, *nach/zu/in* · 14 University: *weil* (verb-final) · 15 *Perfekt* with *haben/sein* (intro to A2) |
| **Tag für Tag** (A2) | 16 My day: **reflexive verbs** (*sich waschen*), pronoun position · 17 Clothes & shopping: *gefallen/passen/stehen* + **dative**, *dieser/welcher*, prices · 18 Weather & seasons: *es regnet*, months, **um / am / im** · 19 At the doctor's: *Mir tut … weh*, **imperative** (*Sie*, *du*, *ihr*) |
| **Erzählen** (A2) | 20 In the past: **Präteritum** of *sein/haben* and the modal verbs · 21 The weekend: *Perfekt* with irregular and separable participles, *haben* vs *sein* · 22 My flat: **two-way prepositions** (*Wo?* + dative, *Wohin?* + accusative), *liegen/legen, stehen/stellen* · 23 Opinions: **dass / wenn** clauses (verb last), *Wenn …, dann* word order · 24 **Comparative and superlative** (*besser als*, *am besten*, *lieber*) |

Cases are introduced progressively (accusative in lesson 9, dative in lesson 13), only after
the learner can already use basic phrases. Accents: de-DE and **de-AT**. Stories: *Nowy
sąsiad*, *Rodzina Leny*, *Sobotni poranek*, *Podróż do Wiednia*, *Pierwszy semestr*,
*Chory poniedziałek*, *Weekend w Wiedniu*, *Dawniej i dziś*.

Not yet covered for a complete A2: adjective endings in all cases, the genitive,
*Konjunktiv II* (*würde, hätte, wäre*) for polite requests, relative clauses and the
future with *werden*.

## Japanese (ja)

A dedicated curriculum, not a translation of the European courses.

| Unit | Lessons (topics and grammar) |
| --- | --- |
| **Hiragana** | 1 あ–こ (**mora timing**, stroke order) · 2 さ–と (shi, chi, tsu) · 3 な–ほ (fu; look-alikes ぬ/め, は/ほ) · 4 ま–ろ (Japanese r) · 5 わ, を, ん + dakuten · 6 だ, ば, ぱ (handakuten) · 7 Yōon (きゃ), small っ, long vowels (length changes meaning) |
| **Katakana** | 8 ア–ソ (when katakana is used; ー) · 9 タ–ホ (foreign sounds) · 10 マ–ン + dakuten (e.g. ポーランド) |
| **Pierwsze rozmowy** | 11 Greetings: polite vs casual, は read *wa* · 12 Self-introduction: **X は Y です**, じゃないです, 〜さん · 13 Questions: か, これ/それ/あれ, **の**, **も** · 14 Numbers & shopping: 〜を ください, what kanji are, kanji 一–十 百 千 円 |
| **Codzienność** | 15 Time & weekdays (〜じ, はん, 〜ようび; kanji 日 月 火 水 木 金 土; one character, several readings) · 16 **ます forms** and particles **を, に, で, へ**; verb-final word order · 17 Likes: 〜**が** すきです, い-adjectives, polite refusal · 18 Travel: あります/います, positions (上 下 中), で "by means of" |
| **Przeszłość i liczenie** (A2) | 19 Yesterday: polite past **〜ました / 〜ませんでした**, time words (今年 先週 来週 毎日) · 20 How was it?: **adjective past** (〜かったです, 〜でした), な-adjectives · 21 How many?: **counters** 〜つ, 〜人, 〜まい, 〜本 with sound changes, quantity after the particle |
| **Prośby, plany i pozwolenia** (A2) | 22 Please…: **verb groups**, dictionary form and the **て-form**, 〜てください · 23 What are you doing?: **〜ています** (in progress, states), **〜てもいいですか** · 24 Let's go together!: **〜たいです**, invitations **〜ませんか / 〜ましょう** · 25 Please don't…: the **ない-form**, 〜ないでください |

Particles covered: は, が, を, に, で, の, も, へ, か, と.
Kanji (62): 一二三四五六七八九十百千円 日月火水木金土 人山川口大小上下中 (A1) and
今年先週来毎 高安新古長 何本半分 見食飲読書 話聞買休 行会友時間 入出名前 (A2), each with
on/kun readings and example words. Japanese text uses kanji only after they are taught,
always with furigana (enforced by a content test).

- **Readings and romaji.** Kanji are shown with furigana (toggle in Settings). Romaji is a
  temporary aid: shown automatically until all hiragana lessons are completed, after that
  only as an optional hint that schedules the item for earlier review (Settings: on
  automatically / always / never). Typing accepts kana or romaji (converted to kana with a
  live preview), encouraging a later switch to a Japanese keyboard.
- **Spacing.** Beginner word spacing in sentences can be turned off.
- **Writing.** Every kana lesson offers tracing for its characters. The Writing hub covers all
  hiragana, katakana and the 62 kanji with stroke-order animation, tracing, writing from
  memory and freehand. Feedback is rule-based (stroke count, start point, direction) plus
  self-assessment. There is no handwriting "recognition".
- **Polish contrasts.** Grammar notes compare Japanese with Polish:
  - the verb or です comes at the end;
  - particles do the job of case endings (を ≈ accusative, で ≈ instrumental or "in");
  - verbs do not change by person;
  - modifiers and positions come before or after the noun (の, つくえの した);
  - politeness is systematic, and 〜さん is gender-neutral.
- Stories: *Hana się przedstawia*, *W sklepie*, *Mój dzień*, *Wycieczka do Kioto*, *Weekend
  w Narze*, *Zakupy na piknik*, *W muzeum*.

Not yet covered for a complete A2: plain (dictionary / た) forms in casual speech, 〜と
おもいます, 〜たことが あります, reasons with から / ので, the potential form, giving and
receiving (あげる / もらう / くれる) and more N4-level kanji.

## Quality checklist for new content

- Original text, or a licensed source recorded in CONTENT_SOURCES.md.
- Every item has a Polish gloss; variants go in `plAlts` / `alts` so that answer checking
  accepts them.
- Sentences use only vocabulary from the same or earlier lessons; stories unlock after the
  lesson that completes their vocabulary.
- A word or sentence is introduced only once per course (a test checks this; otherwise one
  word would get two independent review cards). Give every unit a `level`.
- Japanese: provide `reading` for kanji items and `tts` overrides wherever TTS might
  misread.
- Run `npm test`. The content tests fail on duplicate ids or texts, broken references,
  unanswerable questions, placeholder text, and Japanese kanji written without furigana or
  before they are taught. Run `npm run strokes` after adding Japanese text with new kanji.
