# 32_r6_6c1_runtime_dependency_and_route_truth_matrix.md

## R6.6C.1 运行时依赖与 Route 真相矩阵

### 冷启动包模拟

使用 `scratch/_coldstart_sim.py` 模拟微信小程序打包：
- 426 个文件被复制到打包包
- 153 个文件被 `packOptions.ignore` 排除
- `utils/flashcard-summary-manifest.js` 在打包包中 ✅
- 根 `data/` 文件夹完全排除 ✅
- 所有 257 条 require 边在打包约束下解析 ✅

### Flashcard 依赖链真相

| 消费文件 | require | 解析路径 | 存在 | Git 追踪 | Package 边界 | 冷启动可达 |
|----------|---------|----------|------|----------|-------------|-----------|
| utils/flashcards-state.js | ./flashcard-summary-manifest | utils/flashcard-summary-manifest.js | ✅ | ✅ | 主包内 | ✅ |
| utils/flashcards-state.js | ./flashcards-persistence | utils/flashcards-persistence.js | ✅ | ✅ | 主包内 | ✅ |
| pages/flashcards/flashcards.js | ../../utils/flashcards-state | utils/flashcards-state.js | ✅ | ✅ | 主包内 | ✅ |
| packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js | ../../data/flashcard-manifest | packages/quiz/data/flashcard-manifest.js | ✅ | ✅ | quiz 子包内 | ✅ |
| packages/quiz-itpass-1/pages/flashcard-player/flashcard-player.js | ../../data/deck-manifest | packages/quiz-itpass-1/data/deck-manifest.js | ✅ | ✅ | itpass-1 子包内 | ✅ |
| packages/quiz-itpass-1/pages/flashcard-player/flashcard-player.js | ../../data/loader | packages/quiz-itpass-1/data/loader.js | ✅ | ✅ | itpass-1 子包内 | ✅ |

### 42 条 Secondary Route 状态

所有 42 条二级 route 通过 visual shell 合同：
- navigationStyle: custom ✅
- secondary-navigation fallback ✅
- goBack handler ✅
- secondary-shell class ✅
- no hardcoded white background ✅

### TEMP 负向验证（关键项）

| 测试 | 描述 | 结果 | Exit Code | 证据 |
|------|------|------|-----------|------|
| A | 破坏 manifest require → ../data/ | PASS | 1 | `utils\flashcards-state.js requires '../data/flashcard-summary-manifest' -> IGNORED` |
| C | 删除 currentCard JS+WXML | PASS | 1 | `currentCard not in JS data/rendering, currentCard not in WXML rendering` |
| E | navigationStyle 改 default | PASS | 1 | `pages/course/course: navStyle: default` |
| J | 当前仓库全部 4 个 checker | PASS | 0 | All 4 checkers exit 0 |

### 门禁结果

- run_miniprogram_checks --json: 18/18 PASS
- miniprogram_smoke_test: 158/159 (R3.31 唯一已知)
- All R6.5/R6.6/R6.6C/R6.6C.1 checkers: PASS
- git diff --check: clean
