# R6.6A.1 Exam Menu Implementation Record

> Route: `packages/quiz/pages/exam-menu/exam-menu`
> Package: quiz
> DC Frames: 6 (考试详情) + 7 (练习方式)
> Status: IMPLEMENTED_BUT_NOT_VISUALLY_VERIFIED

## Changes

| File | Change |
|------|--------|
| `exam-menu.json` | `navigationStyle: "custom"` (removed native nav bar) |
| `exam-menu.js` | Added `navSafeTop: 64` + `_syncNavLayout()` + `goBack()`; removed duplicate `_applyTheme`; simplified handler names |
| `exam-menu.wxml` | Full rewrite: custom nav header with back button, DC-style masthead, stat strip, exam rows, empty state |
| `exam-menu.wxss` | Full rewrite: QP canvas background, DC card styles, section labels, stat strip, suggestion, empty state |

## Key Features

- Custom navigation bar with back button (‹) + page title
- navSafeTop calculated from device menu button rect
- DC Frame 6 structure: masthead (kicker + title + subtitle), continue card, 考试知识结构 (IT Passport)
- DC Frame 7 structure: 选择练习方式 (真题练习 primary / 课程练习 / 闪卡复习), 学习辅助
- Honest empty state with dot indicator
- Stat strip (累计答题 / 正确率 / 总答题) with suggestion text
- Section labels with numbered headers (01, 02, 03)

## Unchanged Business Boundaries

- All quiz stats computation (getQuizStatsByFilter, getLastAttemptByExam)
- Past exam index navigation (getYears, getRoute)
- Lesson quiz, past exam, flashcard navigation
- Storage, scoring, review, mistake logic — NOT MODIFIED

## Manual Acceptance Checklist

390px:
1. [ ] Enter exam-menu from course tab → IT Passport or SG
2. [ ] No native white navigation bar
3. [ ] Custom header: back button (‹) + title + capsule safe area
4. [ ] Back button navigates to correct previous page
5. [ ] Masthead shows exam title + subtitle correctly
6. [ ] Continue card shows last practice time (if data exists)
7. [ ] 选择练习方式 cards show correct stats
8. [ ] Empty state shows honest guidance text
9. [ ] No TabBar visible (secondary page)
10. [ ] Cold start and back-navigation don't cause layout jumps

375px / 430px:
- [ ] Header and first card not clipped or colliding
