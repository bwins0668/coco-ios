# 30\_r6\_6c\_flashcard\_runtime\_root\_cause\_and\_recovery.md

## Flashcard 运行时根因与恢复

### 根因

**P0 缺陷**: `utils/flashcards-state.js:14` require `'../data/flashcard-summary-manifest'`

`project.config.json` 的 `packOptions.ignore` 配置忽略了根 `data/` 文件夹：
- `data/flashcard-summary-manifest.js` 虽然存在且被 Git 跟踪，但 DevTools 不会将其打包到小程序运行时
- 用户真实 Console 报错: `module '../data/flashcard-summary-manifest.js' is not defined`

### 从入口到渲染的完整链

1. **Review Tab** (`pages/review/review.js` → `nav.goFlashcards()`)
   → `wx.navigateTo('/pages/flashcards/flashcards')`

2. **Flashcard Center** (`pages/flashcards/flashcards.js` → `flashcardsState.getFlashcardsLandingState()`)
   → 已修复: require → `./flashcard-summary-manifest` (位于 `utils/`)
   → 获取: itpass (15 decks, 1486 playable), sg (11 decks, 444 playable)

3. **Deck Select** (`packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js`)
   → require `../../data/flashcard-manifest` → `pastExamIndex.getYears(course)`
   → 加载子包 → `wx.navigateTo(playerRoute)`

4. **Flashcard Player** (7 个子包，每个有独立的 bridge 和 player)
   - bridge: 设置 `globalData.__flashcard_cache` → `navigateBack`
   - player: loadDeckAsync → `normalizeCard(raw)` → `currentCard` 绑定

### 卡片渲染合同

每个 player 保证：
- `currentCard` 在 JS 和 WXML 中都存在
- 4 种视图状态: loading → error/empty/content → finished
- `secondary-shell` class + `goBack` handler + `navigationStyle: custom`
- 空 deck / 加载失败 / 错误 状态都有后备 UI

### 非空 deck 真实渲染链

```js
// deck-manifest.js → meta.js → loader.js
loader.loadDeckAsync(course, yearId, callback)
  → cards = rawData.map(normalizeCard).filter(Boolean)
  → setData({ cards, currentCard: cards[0], totalCards, viewState: 'content' })
```

### 已验证的子包

| 子包 | Player | Bridge | Data |
|------|--------|--------|------|
| quiz-itpass-1 | ✅ | ✅ | questions: 85 |
| quiz-itpass-2 | ✅ | ✅ | questions: 85 |
| quiz-itpass-3 | ✅ | ✅ | questions: 85 |
| quiz-itpass-4 | ✅ | ✅ | questions: 85 |
| quiz-itpass-5 | ✅ | ✅ | questions: 85 |
| quiz-sg-1 | ✅ | ✅ | questions: 44 |
| quiz-sg-2 | ✅ | ✅ | questions: 44 |
