# 33_r6_6c1_flashcard_cold_start_and_render_recovery.md

## R6.6C.1 Flashcard 冷启动与渲染恢复

### 冷启动包模拟

模拟工具: `scratch/_coldstart_sim.py`
验证结果:
- 426 文件被打包 (正确)
- 153 文件被排除 (data/, tools/, scratch/, .git/, etc.)
- `utils/flashcard-summary-manifest.js` 已包装 ✅
- `data/flashcard-summary-manifest.js` 已排除 ✅
- 所有 require 边解析: PASS ✅

### 模块错误根因

R6.6C 已修复: `utils/flashcards-state.js` 的 require 路径从 `../data/flashcard-summary-manifest` (运行时不可达，因为 root `data/` 被 `packOptions.ignore` 排除) 改为 `./flashcard-summary-manifest` (指向 `utils/flashcard-summary-manifest.js`，在主包内且不被排除)。

### 真实入口链

**Review Tab:**
```
pages/review/review.js → nav.goFlashcards() → wx.navigateTo('/pages/flashcards/flashcards')
→ Flashcard Center → wx.navigateTo('/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass')
→ Deck Select → wx.loadSubPackage → wx.navigateTo(playerRoute)
→ Flashcard Player → bridge 设置 cache → loadDeckAsync → normalizeCard → setData({currentCard})
```

### 非空 Deck 真实 currentCard 渲染链

```
deck-manifest.js → meta.js → loader.js → loadDeckAsync(course, yearId, callback)
→ cards = rawData.map(normalizeCard).filter(Boolean)
→ setData({ cards, currentCard: cards[0], totalCards, viewState: 'content' })
→ WXML: {{currentCard.questionJa}}, {{currentCard.options[]}}
```

### Empty/Error 状态机

| 状态 | 触发条件 | UI | 返回可达 |
|------|---------|-----|---------|
| loading | 页面加载 | fc-loading + 旋转器 | secondary-nav__back |
| error | loadDeckAsync 失败 | fc-error + 错误详情 + 重试 + 返回按钮 | ✅ |
| empty | 无可玩卡片 | fc-empty + "暂无可用题目" + 返回按钮 | ✅ |
| content | 卡片可用 | 问题 + 选项 + 进度 + 返回按钮 | ✅ |
| finished | 所有卡片已答 | 总结视图 | ✅ |

### 未改变业务语义

- 卡片组、题目、答案、解析内容: 未修改
- 判题、计分、错题、SRS、统计、进度: 未修改
- storage key 与迁移语义: 未修改
- 现有 Tab 路由、顺序、文案: 未修改

### 需要人工 DevTools 视觉证明的项

详细清单见 `docs/ui-rebuild/34_r6_6c1_runtime_manual_final_proof_checklist.md`
