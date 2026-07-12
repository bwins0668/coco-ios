# FINAL UI Rebuild Report — R6.5 Limited DC-Authoritative Tab Shell

> Completed: 2026-06-30
> Worktree: `feature/textbook-termcompletion-r5.4.7`
> Final HEAD: `c9a6d94`

## Scope

This R6.5 series rebuilt the 5 primary tab root pages and the global TabBar to match the DC HTML design source (`G:\项目\mini design\IT学习小程序 全站重构.dc.html` Frames 1-5).

### Implemented & Manually Accepted

| Route | DC Frame | Status |
|-------|----------|--------|
| `pages/home/home` (课程) | Frame 1 | MANUAL_ACCEPTED |
| `pages/practice/practice` (刷题) | Frame 2 | MANUAL_ACCEPTED |
| `pages/review/review` (复习) | Frame 3 | MANUAL_ACCEPTED (marker) |
| `pages/glossary/glossary` (术语) | Frame 4 | MANUAL_ACCEPTED |
| `pages/profile/profile` (我的) | Frame 5 | MANUAL_ACCEPTED |
| `custom-tab-bar/` | All frames | MANUAL_ACCEPTED |

### Not In Scope (42 routes untouched)

All subpackage routes, quiz pages, course detail pages, textbook chapters, and secondary pages remain in their pre-R6.5 state. No DC HTML Frames 6-16 were implemented.

## Key Changes

1. **TabBar containment**: Hardcoded opaque background, safe-area bottom inset
2. **Fullscreen shell**: All 5 tabs use `navigationStyle: custom` + `navSafeTop`
3. **Course home**: DC-accurate hero, exam rows, course strip, section order
4. **Profile**: Rebuilt to 3 DC sections (reduced from 15+)
5. **Practice**: DC-aligned cards with JST date
6. **Header alignment**: Course + Profile masthead kicker/date on same baseline
7. **Streak centering**: Column flex with center alignment below era date

## Test Integrity

- **TEST_GAMING_RISK**: RESOLVED (R6.5.2 removed 140+ hidden smoke anchors/style stubs)
- **Smoke test**: 158 Passed / 1 Failed (R3.31 `/packages/` pre-existing)
- **Miniprogram checks**: 18/18 PASS
- **Term coverage**: ITP 73/73, SG 112/112, TOTAL 185/185
- **Package size**: PASS
- **Fullscreen shell contract**: 35/35 PASS
- **Tab page shell contract**: 20/20 PASS

## Unchanged

- All quiz/question/answer/canonical/term data
- Storage, scoring, review, mistake, statistics logic
- Subpackage routes and business semantics
- `project.config.json`, `project.private.config.json`
- `scratch/*.js`, `tools/r5_4_7_*.js`
