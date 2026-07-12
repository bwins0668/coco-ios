# R6.6B Global Manual Visual Acceptance Checklist

> Status: READY_FOR_MANUAL_VISUAL_PROOF. Use this in WeChat DevTools after the local commits are reviewed.
> Do not mark manual acceptance until Coco visually confirms these flows.

## 390px Primary Pass

1. [ ] Course detail: back control sits below safe area, above body title, no title overlap.
2. [ ] IT Passport exam / practice method: no native white nav bar, return works, year chips still navigate.
3. [ ] SG exam / practice method: no native white nav bar, return works, SG copy and route params remain correct.
4. [ ] Review -> 闪卡复习 -> Flashcard Center: landing cards show real counts, no blank center.
5. [ ] Flashcard Center -> deck select -> player: current card content appears on front/back; empty/error states have return.
6. [ ] Glossary -> 闪卡记忆 / Anki: Anki page renders real term front/back and can return.
7. [ ] Chapter list: Quiet Paper background continuous from top to bottom.
8. [ ] Unit detail / textbook detail: detail content is readable, return works.
9. [ ] Quiz page: question content, option selection, correct/wrong/analysis states remain usable.
10. [ ] Completion/result state: session can exit without trapping user.
11. [ ] Settings/help/feedback equivalents: any reachable support route has visible exit path.
12. [ ] Direct-entry no-stack fallback: open representative secondary pages directly and confirm fallback parent route.
13. [ ] Return button blank area: tapping outside the 72rpx back target does not trigger return.
14. [ ] No native white navigation bar: top chrome under the system capsule is Quiet Paper or dark theme.
15. [ ] Quiet Paper continuity: status area, custom header, body and bottom safe area do not split into white bands.

## 375px / 430px Responsive Pass

| Flow | 375px | 430px | Notes |
|---|---|---|---|
| Course | [ ] | [ ] | Back, capsule, body title and cards do not collide |
| SG exam menu | [ ] | [ ] | Header, stats, action rows and year chips remain readable |
| Flashcard Center | [ ] | [ ] | Course cards and deck list have no horizontal overflow |
| Flashcard Player | [ ] | [ ] | Front/back card content, options and bottom actions fit |
| Quiz | [ ] | [ ] | Question, options, feedback and progress are not hidden |
| Glossary detail | [ ] | [ ] | Header/back and term content do not overlap |
| Course chapter/unit | [ ] | [ ] | Chapter rows and detail blocks keep bottom safe area |

## Acceptance Rules

- Passing this checklist can upgrade the branch from READY_FOR_MANUAL_VISUAL_PROOF to manual visual acceptance.
- Do not use this checklist to claim release readiness, push, PR, merge or full-site business acceptance.
- Any visual issue should be recorded with route, viewport width, screenshot and whether it is shell/back/canvas or business content.
