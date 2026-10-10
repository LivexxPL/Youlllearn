# Spaced-repetition algorithm

Implementation: `src/engine/srs.ts` (pure functions, unit-tested in `src/engine/srs.test.ts`).
Review sessions are built in `src/engine/reviewSession.ts`.

The scheduler is a **simplified variant of SM-2** (P. Woźniak, SuperMemo, 1990), with
learning steps as popularised by Anki, plus a few adaptations for language learning.
SM-2 was chosen because it is small, well documented and easy to reason about. It is not
the most accurate scheduler available (newer models such as FSRS fit memory data better),
but it is predictable, and every number below is visible in the code.

## 1. What is stored per item ("card")

One card per vocabulary item, sentence or grammar concept that has an authored exercise.
All of it lives in IndexedDB (`cards` table).

| Field | Meaning |
| --- | --- |
| `phase` | `learning` (new), `review`, `relearning` (after a lapse) |
| `step` | Position in the learning steps |
| `ease` | SM-2 easiness factor (start 2.5, clamped to 1.3–2.8) |
| `interval` | Current interval in days (0 during learning steps) |
| `due` | Next scheduled review (timestamp) |
| `reviews`, `correct`, `incorrect` | Times reviewed; correct and incorrect responses |
| `lastReviewed` | Last review date |
| `reps`, `lapses` | Consecutive successful reviews; number of times forgotten |
| `confidence` | Last self-assessment (1 "again" … 4 "easy"), from flashcards, speaking and writing |
| `lastSkill`, `skills` | Exercise type of the last review, and per-skill success/failure counters |
| `productionOk`, `recognitionOk` | Successes in production vs recognition exercises |
| `recent` | Last 8 results (true/false) |
| `history` | Last 30 review events: time, skill, grade |

"Difficulty rating" is represented by `ease` (lower = harder) together with `lapses` and
`recent`.

## 2. From exercise outcome to grade

SM-2 grades answers 0–5. The app derives the grade from what happened in the exercise
(`gradeFromOutcome`):

| Outcome | Grade |
| --- | --- |
| Wrong answer | 1 |
| Correct but "almost" (accent or typo tolerated, or a hint used, e.g. romaji shown) | 3 |
| Correct **recognition** (multiple choice, listening choice, matching) | 4 |
| Correct **production** (typing, dictation, speaking, handwriting, grammar gap) | 5 |
| Self-rating: again / hard / good / easy | 1 / 3 / 4 / 5 |

## 3. Learning phase (new and lapsed items)

- Learning steps: **10 minutes**, then **1 day**.
- An item met in a lesson gets its card when the lesson is finished. If every exercise on it
  was flawless, it starts at the 1-day step. Any mistake keeps the 10-minute step, so a short
  follow-up review is offered.
- A wrong answer during learning returns the card to the first step.
- A correct answer moves it to the next step. Graduation to `review` happens after the last
  step, or immediately on a grade-5 (production) answer. The first interval is 1 day, or
  2 days when a production success graduates the card straight from the first step.
- Relearning cards graduate back to 30% of their previous interval (at least 1 day).

## 4. Review phase

On a correct answer (grade ≥ 3):

1. `ease ← ease + (0.1 − (5 − q)·(0.08 + (5 − q)·0.02))`. This is the original SM-2 update,
   clamped to 1.3–2.8.
2. Late reviews get partial credit: `base = interval + overdueDays / 2`.
3. New interval:
   - grade 3 (hard): `max(interval + 1, base × 1.2)`;
   - second successful review: **3 days** (recognition) or **4 days** (production). Original
     SM-2 jumps to 6 days; a gentler step suits beginners;
   - later reviews: `base × factor`, where `factor = ease` for production successes and
     `min(ease, 1.6)` for recognition successes. Grade 5 adds ×1.15.
4. A ±5% deterministic jitter (for intervals ≥ 3 days) spreads out items learnt together.
5. The interval is capped at 365 days. **Until the item has at least one production success,
   it is capped at 14 days.** Recognising a word is not the same as being able to use it.

**Early reviews.** Extra practice, audio flashcards and writing practice can review a card
before its due day. A success then only shows recall after the time that actually passed, so
the interval becomes `max(interval, elapsedDays × factor)`; ease and the repetition count do
not change. Without this rule, practising a word every few minutes would push it out for
months. A mistake made early is still a lapse.

On a wrong answer (grade < 3): `lapses + 1`, `ease − 0.2` (min 1.3), `reps ← 0`. The card goes
to `relearning` with the 10-minute step, and its eventual return interval is set to 30% of
the old one. (Implementations of SM-2 differ on whether a failure changes the easiness. This
one lowers it a little, like Anki.)

## 5. Review states shown to the learner

| State (UI label) | Rule |
| --- | --- |
| New (*Nowe*) | No card yet: the item hasn't been met in a lesson |
| Learning (*W nauce*) | In learning/relearning steps, or in review with a short interval |
| Review due (*Do powtórki*) | Learning cards: `due ≤ now`. Review cards: due any time today. |
| Established (*Utrwalone*) | Review phase, interval ≥ 21 days **and** at least one production success |
| Needs extra practice (*Wymaga ćwiczeń*) | ≥ 3 lapses, or ≥ 2 failures among the last 3–4 results |

## 6. Choosing what to review

`cardPriority` orders the queue:

- due: +100; overdue relative to the interval: up to +40;
- still in learning: +10;
- needs extra practice: +30, plus +5 for each recent failure;
- belongs to the lesson being reviewed ("review this lesson"): +15;
- sentences: −5, so single words go first when time is short.

Session sizes: standard 15, quick 5, weak items 12, extra practice 12, lesson review 12.
"Extra practice" fills the session with not-yet-due cards, the weakest first.

**Exercise choice (avoiding overfitting to multiple choice).** For each item card, the
review builder (`chooseSkill`) picks one skill from the candidates that suit the item:
recognition, recall, listening, typing (production), dictation and, for Japanese
characters, handwriting.

- An item that has been recognised but never produced gets a production-type exercise with
  60% probability.
- Otherwise each candidate is scored by how long ago that skill was practised on this card
  (never practised scores highest) and by its past failures. Skills already used often in the
  current session are heavily penalised.

Sentence cards rotate through listening, word-order, dictation, translation and
(optionally) speaking or shadowing. Exercises are then interleaved, so the same exercise type
rarely appears twice in a row.

## 7. Retention estimate (labelled as an estimate in the UI)

For review cards, recall probability is modelled as `0.9^(elapsedDays / interval)`. This
assumes the schedule aims for about 90% recall at the due date and that forgetting is
exponential. For learning cards it is a rough function of recent accuracy (0.4–0.9). The
Progress screen shows the average as "≈ NN %" with the note "szacunek" (estimate). It is a
model output, not a measurement. The measured number shown next to it is answer accuracy
over the last 30 days.

## 8. Limitations and possible improvements

- SM-2 parameters are fixed, not fitted to the learner. A future version could fit FSRS-style
  parameters from the review history (already stored per card).
- Items are scheduled independently. Related items (e.g. a verb and its conjugated forms)
  do not influence each other.
- Self-ratings (flashcards, speaking, writing) are trusted as given.
