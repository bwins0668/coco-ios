# R6.6 DC Source -> Runtime Matrix

> Updated: 2026-07-01
> Scope: R6.6B global secondary-route shell recovery, with existing R6.6A exam-menu record preserved as evidence.
> Status: READY_FOR_MANUAL_VISUAL_PROOF, not manually accepted.

## Global Runtime Contract

| Runtime area | Source / token | Current implementation | Evidence |
|---|---|---|---|
| Secondary page canvas | Quiet Paper canvas / `styles/tokens.wxss` | `styles/secondary-page-shell.wxss` imported by all 42 secondary pages | global route shell checker PASS |
| Custom navigation | DC top canvas requirement | all secondary `page.json` use `navigationStyle: custom` | 42/42 secondary routes |
| Back target | standard 72rpx left control | `secondary-nav__back`, `cs-back__btn`, or `r6-exam-nav__back` | back navigation checker PASS |
| Direct-entry fallback | canonical parent route map | `utils/secondary-navigation.js` `SECONDARY_FALLBACKS` | 42/42 secondary routes |
| Flashcard content | real deck/question data | landing state, deck manifest, local loader, `currentCard` WXML | flashcard checker PASS |
| Tab roots | R6.5 accepted shell | unchanged, no secondary back button | R6.5 tab checks PASS |

## Exam Menu Runtime Matrix

| Property | Value |
|---|---|
| Route | `packages/quiz/pages/exam-menu/exam-menu` |
| Package | quiz |
| Entry params | `?exam=itpass|sg` |
| DC Frame | Frame 6 (考试详情) + Frame 7 (练习方式) |
| Navigation | `secondaryNav.back(this, 'packages/quiz/pages/exam-menu/exam-menu')` |
| Fallback | `switchTab /pages/practice/practice` |
| Status | READY_FOR_MANUAL_VISUAL_PROOF |

## Exam Menu Source Mapping

| DC Section | Runtime Element | Data Source |
|---|---|---|
| Masthead | `.r6-exam-mast` | `EXAM_INFO[exam]` |
| Continue | `.r6-exam-continue` | `getLastAttemptByExam()` |
| IT Passport structure | `.r6-exam-cat-row` | existing static exam buckets |
| Stat strip | `.r6-exam-stat-strip` | `getQuizStatsByFilter()` |
| Suggestion | `.r6-exam-suggestion` | current JS suggestion tiers |
| Past exam | `.r6-exam-row--primary` + chips | `pastExamIndex.getYears()`, `getRoute()` |
| Lesson quiz | `.r6-exam-row` | existing lesson quiz route |
| Flashcard review | `.r6-exam-row` | deck-select route |
| Empty state | `.r6-exam-empty` | `overallTotal === 0` |

## Route Fallback Matrix

| Route | Category | Fallback type | Fallback URL | Verification |
|---|---|---|---|---|
| `pages/course/course` | SECONDARY_STANDARD_BACK | switchTab | `/pages/home/home` | registered target verified |
| `pages/course-topic/course-topic` | SECONDARY_STANDARD_BACK | navigateTo | `/pages/course/course?courseId=itpass` | registered target verified |
| `pages/course-organize/course-organize` | SECONDARY_STANDARD_BACK | navigateTo | `/pages/course/course?courseId=itpass` | registered target verified |
| `pages/flashcards/flashcards` | SECONDARY_STANDARD_BACK | switchTab | `/pages/review/review` | registered target verified |
| `pages/mistakes/mistakes` | SECONDARY_STANDARD_BACK | switchTab | `/pages/review/review` | registered target verified |
| `packages/glossary/pages/term-search/term-search` | SECONDARY_STANDARD_BACK | switchTab | `/pages/glossary/glossary` | registered target verified |
| `packages/glossary/pages/term-detail/term-detail` | SECONDARY_STANDARD_BACK | navigateTo | `/packages/glossary/pages/term-search/term-search` | registered target verified |
| `packages/glossary/pages/favorite-review/favorite-review` | SECONDARY_STANDARD_BACK | switchTab | `/pages/glossary/glossary` | registered target verified |
| `packages/glossary/pages/anki-player/anki-player` | SECONDARY_STANDARD_BACK | switchTab | `/pages/glossary/glossary` | registered target verified |
| `packages/quiz/pages/exam-menu/exam-menu` | SECONDARY_STANDARD_BACK | switchTab | `/pages/practice/practice` | registered target verified |
| `packages/quiz/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=itpass` | registered target verified |
| `packages/quiz/pages/mistakes/mistakes` | SECONDARY_STANDARD_BACK | switchTab | `/pages/review/review` | registered target verified |
| `packages/quiz/pages/analysis-detail/analysis-detail` | SECONDARY_RESULT_OR_MODAL_EXIT | navigateTo | `/packages/quiz/pages/mistakes/mistakes` | registered target verified |
| `packages/quiz/pages/flashcard-quiz/flashcard-quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz/pages/flashcard-deck-select/flashcard-deck-select` | SECONDARY_STANDARD_BACK | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-itpass-1/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=itpass` | registered target verified |
| `packages/quiz-itpass-1/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-itpass-1/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass` | registered target verified |
| `packages/quiz-itpass-2/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=itpass` | registered target verified |
| `packages/quiz-itpass-2/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-itpass-2/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass` | registered target verified |
| `packages/quiz-itpass-3/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=itpass` | registered target verified |
| `packages/quiz-itpass-3/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-itpass-3/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass` | registered target verified |
| `packages/quiz-itpass-4/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=itpass` | registered target verified |
| `packages/quiz-itpass-4/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-itpass-4/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass` | registered target verified |
| `packages/quiz-itpass-5/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=itpass` | registered target verified |
| `packages/quiz-itpass-5/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-itpass-5/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass` | registered target verified |
| `packages/quiz-sg-1/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=sg` | registered target verified |
| `packages/quiz-sg-1/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-sg-1/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=sg` | registered target verified |
| `packages/quiz-sg-2/pages/quiz/quiz` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/exam-menu/exam-menu?exam=sg` | registered target verified |
| `packages/quiz-sg-2/pages/flashcard-bridge/flashcard-bridge` | SECONDARY_SESSION_EXIT | navigateTo | `/pages/flashcards/flashcards` | registered target verified |
| `packages/quiz-sg-2/pages/flashcard-player/flashcard-player` | SECONDARY_SESSION_EXIT | navigateTo | `/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=sg` | registered target verified |
| `packages/course-content/pages/chapter-list/chapter-list` | SECONDARY_STANDARD_BACK | navigateTo | `/pages/course/course?courseId=itpass` | registered target verified |
| `packages/course-content/pages/unit-detail/unit-detail` | SECONDARY_STANDARD_BACK | navigateTo | `/packages/course-content/pages/chapter-list/chapter-list?courseId=itpass` | registered target verified |
| `packages/course-itpass/pages/chapter-list/chapter-list` | SECONDARY_STANDARD_BACK | navigateTo | `/pages/course/course?courseId=itpass` | registered target verified |
| `packages/course-itpass/pages/unit-detail/unit-detail` | SECONDARY_STANDARD_BACK | navigateTo | `/packages/course-itpass/pages/chapter-list/chapter-list?courseId=itpass` | registered target verified |
| `packages/course-sg/pages/chapter-list/chapter-list` | SECONDARY_STANDARD_BACK | navigateTo | `/pages/course/course?courseId=sg` | registered target verified |
| `packages/course-sg/pages/unit-detail/unit-detail` | SECONDARY_STANDARD_BACK | navigateTo | `/packages/course-sg/pages/chapter-list/chapter-list?courseId=sg` | registered target verified |

## Business Boundaries Preserved

- Storage, SRS, quiz scoring, wrong-question logic, statistics, answer keys, question IDs, explanations, textbook content and term data were not changed for business semantics.
- Quiz page shell-only edits are guarded by `tools/check_textbook_course_content.js`.
- This document does not claim manual visual acceptance, release, push, PR, or merge.
