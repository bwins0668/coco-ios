# R6.6 Secondary Route Inventory & DC HTML Mapping

> Updated: 2026-07-01 | Worktree: `feature/r6.6-secondary-route-dc-fidelity`
> Base: origin/main @ `5aa6d82` (R6.5 squash merge)
> DC Source: `G:\项目\mini design\IT学习小程序 全站重构.dc.html`
> R6.6B status: READY_FOR_MANUAL_VISUAL_PROOF, not manually accepted

## Route Counts

| Metric | Count |
|---|---:|
| Complete registered routes | 47 |
| TAB_ROOT routes | 5 |
| Secondary routes | 42 |
| Standard secondary back routes | 18 |
| Session exit routes | 23 |
| Result/modal exit routes | 1 |
| Platform-owned blocked routes | 0 |

## DC HTML Frames Reference

| Frame | Name | Lines | R6.6B Status |
|-------|------|-------|--------------|
| 1 | 课程首页 (Continue) | 68-121 | R6.5 accepted range, frozen |
| 2 | 刷题 | 124-161 | R6.5 accepted range, frozen |
| 3 | 复习 | 164-200 | R6.5 accepted range, frozen |
| 4 | 术语表 | 203-229 | R6.5 accepted range, frozen |
| 5 | 我的 | 232-271 | R6.5 accepted range, frozen |
| 6 | 考试详情 (IT Passport) | 279-307 | Basic shell recovered, visual proof pending |
| 7 | 练习方式 / 考试菜单 (SG) | 310-339 | Basic shell recovered, visual proof pending |
| 8 | 教材章节 | 342-360 | Basic shell recovered, visual proof pending |
| 9 | 详细解説 | 363-398 | Basic shell recovered, visual proof pending |
| 10 | 练习-未作答 | 406-425 | Basic shell recovered, visual proof pending |
| 11 | 练习-已选待确认 | 428-447 | Basic shell recovered, visual proof pending |
| 12 | 练习-作答正确 | 450-471 | Basic shell recovered, visual proof pending |
| 13 | 练习-错误+解析 | 474-495 | Basic shell recovered, visual proof pending |
| 14 | 本组结果 | 498-528 | Basic shell recovered, visual proof pending |
| 15 | 错题本(有数据) | 531-554 | Basic shell recovered, visual proof pending |
| 16 | 错题本(空状态) | 557-579 | Basic shell recovered, visual proof pending |

## Secondary Route Mapping

| # | Route | Package | Type | DC Frame | R6.6B Phase | Final State |
|---:|---|---|---|---|---|---|
| 1 | `pages/course/course` | main | Course shell | Course detail screenshot chain | A | READY_FOR_MANUAL_VISUAL_PROOF |
| 2 | `pages/course-topic/course-topic` | main | Course topic | Course support route | A | READY_FOR_MANUAL_VISUAL_PROOF |
| 3 | `pages/course-organize/course-organize` | main | Course organize | Course support route | A | READY_FOR_MANUAL_VISUAL_PROOF |
| 4 | `pages/flashcards/flashcards` | main | Flashcard Center | Flashcard chain | D | READY_FOR_MANUAL_VISUAL_PROOF |
| 5 | `pages/mistakes/mistakes` | main | Mistakes entry | Frame 15/16 | C | READY_FOR_MANUAL_VISUAL_PROOF |
| 6-9 | `packages/glossary/pages/*` | glossary | Search/detail/favorite/Anki | Glossary support + flashcard chain | D | READY_FOR_MANUAL_VISUAL_PROOF |
| 10 | `packages/quiz/pages/exam-menu/exam-menu` | quiz | Exam menu | Frame 6/7 | A | READY_FOR_MANUAL_VISUAL_PROOF |
| 11-15 | `packages/quiz/pages/*` | quiz | Quiz/mistakes/analysis/flashcard/deck select | Frame 10-16 + flashcard chain | B/C/D | READY_FOR_MANUAL_VISUAL_PROOF |
| 16-36 | `packages/quiz-itpass-*`, `packages/quiz-sg-*` | quiz data subpackages | Quiz sessions + flashcard bridge/player | Frame 10-14 + flashcard chain | B/D | READY_FOR_MANUAL_VISUAL_PROOF |
| 37-42 | `packages/course-*/*` | course subpackages | Chapter list + unit detail | Frame 8/9 | A | READY_FOR_MANUAL_VISUAL_PROOF |

## Implementation Status

| Route group | Count | Status | Evidence |
|---|---:|---|---|
| All secondary routes | 42 | custom navigation + Quiet Paper shell + 72rpx back + fallback | `check_r6_6_global_route_shell_contract`, `check_r6_6_back_navigation_contract` |
| Flashcard routes | 10 chain routes | real data render + empty/error state + fallback | `check_r6_6_flashcard_center_contract` |
| Tab roots | 5 | frozen, no secondary back added | R6.5 shell checks |

This document does not claim manual visual acceptance, release, push, PR, or merge.
