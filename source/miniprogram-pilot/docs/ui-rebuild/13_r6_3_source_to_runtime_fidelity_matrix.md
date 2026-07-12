# R6.3 Source-to-Runtime Fidelity Matrix

Each registered page mapped to DC HTML frame with implementation status.

| Route | Current WXML | DC HTML Frame | Status | Notes |
|---|---|---|---|---|
| pages/home/home | home.wxml | 课程Continue | ✅ R6.3 | JST date + abbr fix applied |
| pages/practice/practice | practice.wxml | 刷题 | ✅ R6.3 | Card layout fixed |
| pages/review/review | review.wxml | 复习 | ✅ R6.2 | Section numbering added |
| pages/glossary/glossary | glossary.wxml | 术语表 | ✅ R6.1A | Entry list pattern |
| pages/profile/profile | profile.wxml | 我的 | ✅ R6.1A | Stat strip + row list |
| pages/course/course | course.wxml | 考试详情 | ✅ R6 | Course shell |
| pages/course-topic/course-topic | course-topic.wxml | Nearest:考试详情 | ✅ R6 | Topic shell |
| pages/course-organize/course-organize | course-organize.wxml | Nearest:考试详情 | ✅ R6 | Organizer shell |
| pages/flashcards/flashcards | flashcards.wxml | Nearest:刷题 | ✅ R6 | Flashcard center |
| pages/mistakes/mistakes | mistakes.wxml | Nearest:错题本 | ✅ R6 | Mistake shell |
| packages/quiz/pages/exam-menu/exam-menu | exam-menu.wxml | 练习方式 | ✅ R6 | Exam menu |
| packages/quiz/pages/quiz/quiz | quiz.wxml | 练习未答/已选/正确/错误 | ✅ R6.2 WXSS | QP feedback states |
| packages/quiz/pages/mistakes/mistakes | mistakes.wxml | 错题本/空 | ✅ R6 | Mistake list |
| packages/quiz/pages/analysis-detail/analysis-detail | analysis-detail.wxml | Nearest:详细解説 | ✅ R6 | Analysis |
| packages/quiz/pages/flashcard-quiz/flashcard-quiz | flashcard-quiz.wxml | Nearest:闪卡复习 | ✅ R6 | FC quiz |
| packages/quiz/pages/flashcard-deck-select/flashcard-deck-select | flashcard-deck-select.wxml | Nearest:练习方式 | ✅ R6 | Deck select |
| packages/glossary/pages/term-search/term-search | term-search.wxml | Nearest:术语表 | ✅ R6 | Search |
| packages/glossary/pages/term-detail/term-detail | term-detail.wxml | 术语详情 | ✅ R6 | Term detail |
| packages/glossary/pages/favorite-review/favorite-review | favorite-review.wxml | Nearest:术语表 | ✅ R6 | Favorites |
| packages/glossary/pages/anki-player/anki-player | anki-player.wxml | 闪卡复习 | ✅ R6 | Anki player |
| packages/course-*/pages/chapter-list/* | chapter-list.wxml | 教材章节 | ✅ R6 | Chapter lists |
| packages/course-*/pages/unit-detail/* | unit-detail.wxml | 详细解説 | ✅ R6 | Unit details |
| packages/quiz-*/pages/quiz/quiz | quiz.wxml | 练习未答/已选/正确/错误 | ✅ R6 | Subpackage quiz instances |
| packages/quiz-*/pages/flashcard-* | flashcard-*.wxml | Nearest:闪卡复习 | ✅ R6 | Flashcard players |

## Old Structure Zero-Clear List

- ❌ Old course hero → replaced with DC frame structure
- ❌ Old course big cards (Python/Java/Alg) → replaced with strip
- ❌ Old practice card template → replaced with icon+body+chevron rows
- ❌ Old profile card stack → replaced with stat strip
- ❌ Old glossary 4-grid → replaced with entry list