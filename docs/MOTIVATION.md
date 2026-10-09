# Daily goals and motivation

Implementation: `src/engine/gamification.ts` (rules, unit-tested), `src/services/progress.ts`
(recording and rewards), `src/services/activity.ts` (time tracking), Home and Progress
screens.

## Principles

- Make starting easy: one prominent "Kontynuuj naukę" button, a 3-minute session option,
  and a 5-minute minimum goal.
- Fair and transparent: every reward is fixed and visible before you start. Nothing can be
  bought. No random loot, no artificial scarcity, no countdown pressure.
- No guilt: copy never shames. Missing a day costs nothing but the streak counter, which is
  forgiving. **Learning progress (cards, lessons, XP) is never reset by a broken streak.**
- Honest numbers: active learning time is counted separately from time the app is open.
  Retention is labelled as an estimate.

## Daily goal

5 / 10 / 20 / 30 minutes of **active** learning (chosen in onboarding, changeable in Settings).
A second counts as active while a lesson, review, Audio Quest activity or writing practice is
open and the learner interacted in the last 60 s, or while Audio Quest is playing (so
hands-free listening counts). The home ring shows minutes against the goal. Progress shows
active vs app-open time for the chosen period.

## Tracked statistics

Per day (`dailyStats`): active minutes, listening minutes, app-open minutes, exercises,
correct answers, new words, reviews, lessons, speaking and writing exercises, Audio Quest
sessions, XP, best run of correct answers, and courses practised. The Progress screen shows
totals, a 7- or 28-day chart, weekly consistency, the memory-state breakdown, estimated
retention (labelled *szacunek*) and measured 30-day accuracy.

## XP and levels

| Action | XP |
| --- | --- |
| Correct answer on first try | 10 |
| Correct answer on a retry | 5 |
| Lesson completed | +20 |
| Listening minute in a hands-free session | 2 |
| Audio flashcard recalled (not "again"); handwriting rated as at least "Prawie" | 5 |
| Correct answer to a story question | 10 |
| Each daily quest | 20 |
| All three daily quests | +30 bonus |
| Weekly challenge | 100 |

Level *n* starts at `75 · n · (n − 1)` total XP (0, 150, 450, 900, …), and each level has a
title (*Tropiciel*, …). XP never decreases.

## Streak with forgiving recovery

- A day counts as active with ≥ 1 active minute, ≥ 5 exercises, 1 lesson or 1 Audio Quest
  session. A low-energy day still counts.
- **Shields:** every 5 active days earn a shield (max 3). A missed day after an active day
  uses a shield automatically, and the streak survives. The home screen says when a shield
  was used, without blame.
- Without shields the streak counter restarts. The longest streak is kept as a personal best,
  and after a break of more than 3 days the app greets the learner back warmly (and unlocks
  the *Powrót na szlak* badge).

## Daily quests (3 per day)

Picked deterministically per learner and day: one *core*, one *audio*, one *skill* quest,
with targets scaled to the daily goal.

| Category | Pool |
| --- | --- |
| core | finish a lesson; N reviews; N exercises; N new words |
| audio | N listening minutes; 1 Audio Quest session |
| skill | 3 speaking exercises; 5 written characters (only with the Japanese course); a run of N correct answers |

## Weekly challenge

One per week from: 5 active days, N lessons, N listening minutes, N reviews, 15 speaking
exercises, or goal × 5 active minutes.

## Badges (24) and personal bests

Milestones for lessons (1/10/25), words started (50/150), established words (25), streaks
(3/7/30), active days (20), listening (30/120 min), reviews (100/500), speaking (25),
hiragana and katakana completed, handwriting (50), all three courses tried, comeback,
a perfect lesson, and completing each course. Locked badges show how to earn them.
Personal bests: longest streak, most XP in a day, most active minutes in a day, longest run
of correct answers.

## Recommendations

The home screen suggests one activity (`src/engine/recommend.ts`):

1. 15 or more reviews due (or 8 or more once today's goal is met) → a review session first.
2. Goal met, and at least one lesson done → a review if anything is due, otherwise a relaxed
   5-minute Audio Quest session.
3. Otherwise → the next lesson.
4. Course finished → a review if anything is due, otherwise repeat a lesson.

The card always shows the estimated time (lesson minutes, or 18 s per review card).

## Reminders

- Choose the time, the days of the week, or turn reminders off. Off by default.
- **Android:** real local notifications, scheduled weekly for the chosen days. They fire
  even when the app is closed. The message rotates through seven friendly suggestions (e.g.
  *"Masz 5 minut? Kilka słów czeka na krótką powtórkę."*). Never guilt or streak threats.
- **Web:** browsers cannot schedule notifications for a closed page without a push server
  (and this app has no server). Reminders only appear while the app or tab is open; the
  Settings screen says so and asks for notification permission only when reminders are
  turned on.
