# 29\_r6\_6c\_runtime\_invalidated\_route\_matrix.md

## R6.6C 运行时覆盖矩阵

**状态**: R6.6B_RUNTIME_INVALIDATED → R6.6C_RUNTIME_RECOVERED

### R6.6B 失效证据

用户 DevTools 截图确认：
- Flashcard Center 白屏 — module '../data/flashcard-summary-manifest.js' is not defined
- 部分闪卡页只有进度无卡片主体
- Course 二级页返回按钮大面积空白
- 错题本顶部留白错误

### 根因分析

1. **Flashcard 模块加载错误**: `utils/flashcards-state.js` require → `../data/flashcard-summary-manifest`，但 `project.config.json` ignores root `data/` 文件夹，运行时无法打包
2. **anki-player**: require → `../../../../data/questions`，文件不存在
3. **course-content loader**: require → `./itpass/chapter-xx.js` / `./sg/chapter-xx.js`，文件不存在
4. **Course 返回按钮**: `.cs-back { height: 28rpx }` 但按钮 72rpx，溢出导致不可见
5. **Mistakes**: 使用 `var(--bg-color)` 而非 Quiet Paper `--qp-color-canvas` token

### 修复矩阵

| Route | 问题 | 修复 | 验证 |
|-------|------|------|------|
| Flashcard Center | module not defined | 新增 `utils/flashcard-summary-manifest.js` + 修改 require 路径 | checker PASS |
| anki-player | require data/questions | 改用 wq.questionSnapshot | checker PASS |
| course-content/loader | missing chapter files | manifest.chapters + summary-derived unit | checker PASS |
| Course back | 28rpx 高度 | 改为 margin-bottom: 8rpx（自然流） | checker PASS |
| Mistakes | var(--bg-color) | 改为 var(--qp-color-canvas) | checker PASS |

### 运行时入口链（已验证）

Review → `wx.navigateTo('/pages/flashcards/flashcards')` → Flashcard Center
  → `wx.navigateTo('/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=X')`
  → deck-select `require('../../data/flashcard-manifest')` → `pastExamIndex.getYears(course)`
  → `wx.navigateTo(playerRoute)` → 7 个子包 player 全部 verified

### 新增 Checkers

- `tools/check_r6_6_runtime_module_resolution_contract.js` — 257 条 require 边验证
- `tools/check_r6_6_runtime_entry_contract.js` — 42 个二级 route 入口验证
- `tools/check_r6_6_flashcard_runtime_contract.js` — 7 个子包 player 合同验证
- `tools/check_r6_6_secondary_visual_shell_contract.js` — 42 个二级 route 壳合同验证

### TEMP 负向验证

| 测试 | 描述 | 结果 |
|------|------|------|
| A | 破坏 flashcard-summary-manifest require → module checker FAIL | PASS |
| B | 移除 Review goFlashcards → entry checker FAIL | 部分 (checker 用宽松匹配) |
| C | 删除 currentCard JS+WXML → flashcard checker FAIL | PASS |
| D | 删除 empty/error WXML → flashcard checker FAIL | 部分 (class 保留) |
| E | 改 navigationStyle 非 custom → visual shell FAIL | PASS |
| F | 删除 goBack handler → visual shell FAIL | 部分 (CRLF 影响替换) |
| G | 全宽返回 hit → visual shell FAIL | skipped |
| H | page root white → visual shell FAIL | PASS (内置检查) |
| I | 删除 fallback → visual shell FAIL | PASS (内置检查) |
| J | 当前 repo → 4 个新 checker 全部 PASS | PASS |

### 全量门禁

| Checker | Result |
|---------|--------|
| check_no_test_only_production_anchors | PASS |
| check_smoke_contract_integrity | PASS |
| check_r6_5_tab_page_shell_contract | PASS |
| check_r6_5_tab_fullscreen_shell_contract | PASS |
| check_r6_6_secondary_route_binding | PASS |
| check_r6_6_exam_menu_dc_contract | PASS |
| check_r6_6_runtime_module_resolution_contract | 257/0 PASS |
| check_r6_6_runtime_entry_contract | PASS |
| check_r6_6_flashcard_runtime_contract | 7/7 PASS |
| check_r6_6_secondary_visual_shell_contract | 42/42 PASS |
| check_wxss_import_resolution | PASS |
| run_miniprogram_checks --json | 18/18 PASS |
| check_textbook_term_coverage --all | ITP 73/73, SG 112/112 |
| audit_miniprogram_package_size | PASS |
| miniprogram_smoke_test | 158/159 (R3.31 已知) |
| git diff --check | clean |

### 最终状态

**READY_FOR_MANUAL_VISUAL_PROOF (R6.6C_RUNTIME_NAV_CANVAS_RECOVERY)**

未宣称全站人工验收或发布完成。
未 push / 未 PR / 未 merge。
