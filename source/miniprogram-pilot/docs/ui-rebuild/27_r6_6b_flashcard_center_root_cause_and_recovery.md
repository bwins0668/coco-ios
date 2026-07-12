# R6.6B Flashcard Center Root Cause And Recovery

> Status: READY_FOR_MANUAL_VISUAL_PROOF. This is not a manual visual acceptance record.

## Real Entry Chains

| Entry page | Tap node / handler | Target route | Query / params | Data source | Rendering proof | Return path |
|---|---|---|---|---|---|---|
| `pages/review/review` | `goFlashcards` | `pages/flashcards/flashcards` | none | `utils/flashcards-state.js` | `courses` renders real landing cards | fallback `/pages/review/review` |
| `pages/flashcards/flashcards` | `openCourse` | `packages/quiz/pages/flashcard-deck-select/flashcard-deck-select` | `course=itpass|sg` | `flashcard-manifest.getDecksForCourse` | `decks` renders real deck list | fallback `/pages/flashcards/flashcards` |
| `packages/quiz/pages/flashcard-deck-select/flashcard-deck-select` | `selectDeck` | 7 subpackage player routes | `course`, `deckId`, `yearId` | manifest + package local loader | `currentCard.questionJa` front/back + options | fallback to deck select |
| `pages/glossary/glossary` | `goToAnkiPlayer` | `packages/glossary/pages/anki-player/anki-player` | `from=glossary` | glossary index/chunks | `currentTerm.term` and `currentTerm.zh` | fallback `/pages/glossary/glossary` |

## Root Cause

The failing runtime screenshots exposed a combined shell-and-rendering gap: flashcard routes were not globally covered by the secondary custom navigation contract, and the Flashcard Center/player chain lacked a checker that proved real landing state, real deck selection, current-card rendering and honest empty/error states together. That allowed native white chrome or a page with progress/header state but missing main card content to survive static checks.

R6.6B closes the chain by enforcing custom navigation on every secondary route, adding a visible 72rpx back control and direct-entry fallback, and adding `check_r6_6_flashcard_center_contract.js` to verify the actual Review/Glossary entry chain and real card bindings.

## Real Data Proof

| Evidence | Value |
|---|---|
| Flashcard landing IT Passport count | 1486 |
| Flashcard landing SG count | 444 |
| Landing course cards | 2 |
| IT Passport deck count | 15 |
| SG deck count | 11 |
| First IT deck | `itpass/01_aki`, expected 100, raw 100, normalized 100 |
| First IT card | `01_AKI_Q1` |
| First SG deck | `sg/sg_01_aki`, expected 50, raw 50, normalized 50 |
| First SG card | `SG_01_AKI_問1` |

## Non-empty Deck State

For non-empty decks the player loads package-local loader data, normalizes each raw question into `currentCard`, sets `viewState: 'content'`, and renders the card front/back with `currentCard.questionJa` plus option buttons. TEMP F proves removing this binding fails the flashcard contract.

## Empty And Error State

If a deck is truly empty, the player sets `viewState: 'empty'` only when expected/source/playable counts are all zero. If expected data exists but normalization produces zero playable cards, it becomes an error state instead of a fake card. Both empty and error states expose `goBack`; TEMP G proves removing the empty state fails. Current manifest has non-empty sampled decks, so the empty state is code-path proof rather than a currently populated real deck sample.

## Business Boundaries Preserved

- No fake card, fixed SQL card, mock question or static demo content was added.
- Quiz answers, explanations, question IDs, scoring, mistake logic, SRS/storage semantics and local storage keys were not changed.
- Glossary Anki keeps its existing term data and review semantics; only shell/back/canvas recovery was added.
- This record does not claim manual visual acceptance, release, push, PR, or merge.
