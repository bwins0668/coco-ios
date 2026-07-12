# R6.5 DC Source → Runtime Mapping

> Created: 2026-06-30 | R6.5 DC HTML Source Structure Rescue
> Source: `G:\项目\mini design\IT学习小程序 全站重构.dc.html`
> Worktree: `feature/textbook-termcompletion-r5.4.7` @ `627973c`

## Mapping Table

| # | DC Frame | DC Source Node | Real Route | Real WXML | Real WXSS | Key Component Chain | Data Source | Old Structure Cleared | Pending Manual Verification |
|---|----------|---------------|------------|-----------|-----------|---------------------|-------------|----------------------|---------------------------|
| 1 | 课程首页 (Continue) | `.ph` Frame 1 lines 68-121 | `pages/home/home` | `home.wxml` (rewritten) | `home.wxss` (updated) | `.cc-mast` → `.cc-hero` → `.cc-exam-row` → `.r6-course-strip` | `getJSTDateString()` + `registry` + `storage` | ✓ Old Hero/Cards removed | PENDING |
| 2 | 刷题 | Frame 2 lines 124-161 | `pages/practice/practice` | `practice.wxml` (rewritten) | `practice.wxss` (rewritten) | `.r6-practice-mast` → `.r6-practice-card` | `practiceState` + `getJSTDateString()` | ✓ Old structure replaced | PENDING |
| 3 | 复习 | Frame 3 lines 164-200 | `pages/review/review` | `review.wxml` (marker added) | `review.wxss` (existing) | `.review-head` → `.review-card` | review handlers | ~ Existing structure compatible | PENDING |
| 4 | 术语 | Frame 4 lines 203-229 | `pages/glossary/glossary` | `glossary.wxml` (existing) | `glossary.wxss` (existing) | `.glossary-hero` → `.r6-glossary-row` | glossary state | ~ Existing structure compatible | PENDING |
| 5 | 我的 | Frame 5 lines 232-271 | `pages/profile/profile` | `profile.wxml` (rewritten) | `profile.wxss` (rewritten) | `.r6-profile-mast` → `.r6-profile-stat-strip` → `.r6-profile-row` | `storage.getQuizStats()` + `getJSTDateString()` | ✓ 15+ old sections removed | PENDING |
| 6 | 考试详情 | Frame 6 lines 279-307 | `packages/quiz/pages/exam-menu/exam-menu` | *(not modified)* | *(not modified)* | subpackage component | *(not modified)* | N/A (not in scope) | N/A |
| 7 | 练习方式 | Frame 7 lines 310-339 | *(exam-menu subpage)* | *(not modified)* | *(not modified)* | *(not modified)* | *(not modified)* | N/A (not in scope) | N/A |
| - | Global TabBar | `.tab` class in all frames | `custom-tab-bar/` | `index.wxml` | `index.wxss` (hardened) | `.r6-tabbar` → `.r6-tabbar__inner` | JS `list` config | ✓ Opaque background + safe-area | PENDING |

## Key Changes (R6.5)

### P0: TabBar containment
- `custom-tab-bar/index.wxss`: Hardcoded `#F2EDE0` background with CSS variable fallback
- All 5 tab pages: verified `calc(100rpx + env(safe-area-inset-bottom))` bottom padding
- TabBar z-index: 999, position: fixed

### P1: Course home rebuilt
- WXML: Section order corrected (01 资格考试 → 02 课程学习)
- Hero: Start state with exam picker when `!hasLastAttempt`
- Exam rows: border-left accent for primary, plain for secondary, muted for planned
- Course strip: abbr/name separated correctly (Py ≠ Python, Ja ≠ Java, Alg ≠ 算法基础)
- Removed: old "从一门课程或考试开始" text, old hero/card structures

### P1: Profile page rebuilt
- WXML: Only 3 DC sections (01 学习数据, 02 分类正确率, 03 数据与设置) + status card + version
- Removed: 15+ old sections (做题统计grid, 复习建议, 最近练习, 练习时间线, etc.)
- Kept: all real data bindings (totalAttempts, accuracy, wrongQuestionCount, etc.)
- Added: JST date display, empty state icon

### P2: Practice page aligned
- WXML/WXSS: Rewritten to match DC Frame 2
- Added: JST date in masthead
- Cards: continue card with editorial red border, primary exam row with left accent

## Verification Status

| Check | Result |
|-------|--------|
| `check_r6_5_tab_page_shell_contract.js` | 19 PASS / 0 FAIL |
| `run_miniprogram_checks.js --json` | 18/18 PASS |
| `check_textbook_term_coverage.js --all` | *(running)* |
| `audit_miniprogram_package_size.js` | *(running)* |
| `miniprogram_smoke_test.js` | *(running)* |

## Manual Acceptance Checklist

1. [ ] 课程首页: 390/375/430 — Continue hero, exam rows, course strip
2. [ ] 我的页: 390/375/430 — stat strip, accuracy bars, settings rows
3. [ ] 刷题入口: 390/375/430 — continue card, exam cards
4. [ ] 复习页: 390 — review cards
5. [ ] 术语页: 390 — search + action rows
6. [ ] 五 Tab 连续切换: 课程→刷题→复习→术语→我的→课程
7. [ ] TabBar 不透明、选中态正确、末项不遮挡
