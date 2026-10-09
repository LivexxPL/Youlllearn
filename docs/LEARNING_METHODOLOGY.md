# Learning methodology

Polyglot Quest combines a few learning principles that are well supported by memory and
education research with design choices that are reasonable but **not proven**. This
document keeps the two apart. No method here is claimed to work equally well for everyone.

## How the sources were consulted

The sources in section 4 were checked through **web search results** (abstracts, publisher
or PubMed records, press releases and project pages, as surfaced by the search tool) on
2026-10-09. The development sandbox could not open most sites directly, so the **full texts
were not read**. Statements below stay at the level of detail those summaries support. Read
the original papers before relying on finer details.

## 1. Principles and how the app applies them

| Principle | How it is implemented | Evidence status |
| --- | --- | --- |
| **Spaced repetition** (distributed practice) | Every item met in a lesson gets an SRS card; reviews are scheduled at growing intervals (docs/SRS_ALGORITHM.md); the home screen and the Review tab always show what is due. | **Well supported** for verbal/vocabulary-type material: Cepeda et al. 2006 meta-analysis; rated "high utility" by Dunlosky et al. 2013. *Limitation*: much of the evidence comes from lab tasks. The best gap depends on how long the material must be remembered, and the app's specific intervals are a design choice. |
| **Retrieval practice** (active recall) | Lessons end with a retrieval test **without hints**. Reviews ask the learner to produce answers (typing, dictation, speaking, writing) rather than re-read. Audio flashcards require recalling the meaning before revealing it. | **Well supported**: Roediger & Karpicke 2006 (testing beat restudying on delayed tests); "high utility" in Dunlosky et al. 2013. *Limitation*: restudy can win on an immediate test, so the benefit shows later. That is why the app does not judge progress by in-session accuracy alone. |
| **Immediate, informative feedback** | After every graded exercise: correct answer, playable model audio, the reason (accent/typo tolerance, "another word"), and a short explanation for grammar items. | Commonly recommended in instructional research; **not separately verified** for this document. |
| **Interleaving** | Review sessions mix items and exercise types, and the same type rarely appears twice in a row. Lessons alternate presentation, recognition and recall. | **Promising but mixed**: Rohrer & Taylor 2007 (mathematics); rated "moderate utility" by Dunlosky et al. 2013. A meta-analysis reported in search results (Brunmair & Richter 2019) found a small average effect with very varied results. Treated as a **design hypothesis** for vocabulary. |
| **Recognition → production progression** | New items are introduced with audio, then recognised (choice, listening), then produced (typing, ordering, dictation, speaking, handwriting). An item counts as "established" only after a production success (docs/SRS_ALGORITHM.md §4–5). | Common pedagogical practice; the specific rules are **design decisions**. |
| **Comprehensible input and listening** | Audio Quest: listening-first exercises, hands-free sessions, dialogues and stories written only from vocabulary of completed lessons; Polish meaning explained *after* listening. | The idea that understandable input drives acquisition is influential in second-language research but **debated**. No sources on it were consulted for this document, so it is listed as a guiding principle, not a demonstrated effect. |
| **Gradual move from clear to natural speech** | Three listening stages (slow & clear → normal → closer to natural), chosen automatically from course progress and changeable by the learner. | **Design hypothesis.** TTS speed changes are not the same as natural connected speech. |
| **Contextual, sentence-based learning** | Each lesson has example sentences and a dialogue. Reviews include sentence listening, word order and dictation, not only isolated words. | Common recommendation; the mix is a **design decision**. |
| **Pronunciation practice** | Model audio at two speeds, record-and-compare, shadowing in rounds, syllable/mora breakdown, optional speech recognition shown only as "what the recogniser understood", and self-assessment. | Shadowing and self-comparison are **design hypotheses** here. No automatic pronunciation score is shown, because text matching cannot judge pronunciation, and pitch accent not at all. |
| **Short sessions, daily habit** | Daily goals of 5/10/20/30 minutes; a "3 minutes" quick session; time counts only while actively learning. | Distributing practice is supported (above). The motivation features are **design hypotheses**; see docs/MOTIVATION.md. |
| **Low-pressure mistakes** | Mistakes are re-practised later in the same session, never scored with "lives"; messages are encouraging; streaks are forgiving and never reset learning progress. | **Design principle.** Not separately verified here. |
| **Adaptive review** | Weak items ("needs extra practice") and items from the current lesson get priority; per-item skill counters steer the next exercise type. | **Design decision** built on the principles above. |

## 2. Level frameworks

- **Spanish and German** are aligned with **CEFR A1 → early A2**. The CEFR defines six levels
  (A1–C2). Its A1 global descriptor is about understanding and using familiar everyday
  expressions and very basic phrases for concrete needs, and exchanging basic personal details.
  Lesson objectives are written as can-do statements in that spirit. The units cover the
  topics the spec asks for: pronunciation, greetings, gender and number, articles, present
  tense, questions and negation, numbers, time, food, travel and university. German adds
  modal and separable verbs and progressive case introduction. Both courses give a first
  look at past and future constructions. See docs/CURRICULUM.md.
- **Japanese** has its own curriculum: kana first (with mora timing), then conversation
  patterns, particles, です/ます forms and 29 introductory kanji. It is designed with the
  **JF Standard for Japanese-Language Education** (Japan Foundation) in mind. JF Standard is
  task-based: levels are defined by what you can do, on the same six A1–C2 levels as the
  CEFR. **JLPT N5** is mentioned only as an orientation. JLPT is a separate test with its own
  scale, and CEFR/JF levels and JLPT levels are **not** equivalent.
- The courses cover roughly 2–3 hours of lessons per language plus open-ended reviews and
  listening. That is a start towards A1, not a complete A1 course.

## 3. What is a hypothesis and should be tested

These features rest on reasonable assumptions but have no direct evidence behind them in
this app:

- the effect of daily quests, XP, levels and badges on long-term consistency;
- forgiving streak "shields" vs no streak at all;
- hands-free listening (pocket mode) as effective practice when attention is divided;
- the listening-stage progression and TTS speed settings;
- shadowing and self-rated speaking without automatic assessment;
- rule-based handwriting hints (stroke count/start/direction) plus self-assessment.

The app stores enough local data to evaluate some of these with learners who opt in, for
example review accuracy over time and session frequency. Nothing is collected or sent
anywhere by default.

## 4. Sources consulted

| Source | What it supports here | Access and limitations |
| --- | --- | --- |
| Cepeda, Pashler, Vul, Wixted & Rohrer (2006). *Distributed practice in verbal recall tasks: A review and quantitative synthesis.* Psychological Bulletin 132(3), 354–380. https://pubmed.ncbi.nlm.nih.gov/16719566/ | Spacing improves retention. The best gap grows with the retention interval. | PubMed record and summaries via search; full text not read. Verbal recall tasks, largely lab-based. |
| Roediger & Karpicke (2006). *Test-enhanced learning: Taking memory tests improves long-term retention.* Psychological Science 17(3), 249–255. https://www.psychologicalscience.org/observer/test-enhanced-learning | Retrieval practice beats restudying on delayed tests. | Summary via search; prose passages, university students. |
| Dunlosky et al. (2013). *Improving students' learning with effective learning techniques.* Press release: https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html | Practice testing and distributed practice rated high utility; interleaving moderate. | Press release and secondary summaries; the monograph itself was not read. |
| Rohrer & Taylor (2007). *The shuffling of mathematics practice problems boosts learning.* Instructional Science 35, 481–498. | Interleaving can help (in mathematics). | Bibliographic details via search; the effect size was not verified. The domain differs from vocabulary learning. |
| Brunmair & Richter (2019), meta-analysis on interleaving, as reported in search results | The effect is small on average and varies widely. | Only a secondary mention; treat as unverified. |
| Woźniak, SM-2 description (SuperMemo archives). https://www-v1.supermemo.com/archives1990-2015/english/ol/sm2 | SM-2 rules: I(1)=1, I(2)=6, I(n)=I(n−1)·EF, EF update formula, minimum EF 1.3, grades 0–5. | Content confirmed via search; implementations differ on failed reviews (noted in docs/SRS_ALGORITHM.md). |
| Council of Europe, *CEFR level descriptions*. https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions | Six-level scale; A1/A2 descriptors. | A1 wording confirmed via a secondary quote; the A2 global-scale wording was not confirmed. |
| Japan Foundation, *JF Standard for Japanese-Language Education* (2024 pamphlet). https://www.jfstandard.jpf.go.jp/pdf/jfs2024_pamphlet_en.pdf | Task-based Can-do levels, A1–C2, compatible with the CEFR. | Via search; no specific A1 Can-do statements were copied. |
| MDN Web Docs, *SpeechRecognition* / *Using the Web Speech API*. https://developer.mozilla.org/docs/Web/API/SpeechRecognition | Chrome's recognition is server-based (needs network, sends audio); not Baseline. | Via search. Why speech recognition is optional and off by default. |

Only these sources were consulted for this document. Other well-known work (for example on
comprehensible input or shadowing) is mentioned only as background, and the app makes no
claims based on it.
