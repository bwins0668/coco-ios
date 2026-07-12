# 34_r6_6c1_runtime_manual_final_proof_checklist.md

## R6.6C.1 运行时人工最终验收清单

**状态**: READY_FOR_MANUAL_VISUAL_PROOF

### 390px 必检项

1. 冷启动，Console 无 MiniProgramError、无 module-not-defined 红色错误
2. Course 首页 → IT Passport detail: 返回按钮 44rpx 可见、标题 ITパスポート試験
3. Course 首页 → SG detail: 返回按钮可见、标题
4. Course → 错题本: 返回按钮可见、Hero 距 nav bar 16rpx
5. Practice → IT exam: 年份/模式选择
6. Practice → SG exam: 同上
7. Review → 闪卡复习 → Center → Deck → Player: 无白屏、有卡片
8. Glossary → 闪卡记忆/Anki → Center → Deck → Player: 无白屏
9. 空 deck 与错误状态: 诚实显示 empty/error、可返回
10. IT/SG quiz: 答题界面正常
11. chapter-list/unit-detail: 章节/单元详情
12. Glossary detail: 术语详情
13. direct-entry 无栈返回: fallback 正确
14. 点击返回箭头旁空白、标题、卡片不误触
15. 无原生白色顶部 chrome
16. Quiet Paper (#F2EDE0) 从状态栏到安全区连续
17. Console 无 MiniProgramError、module-not-defined、Component is not found

### 375px/430px 重点项

- Course detail: 胶囊、返回热区、标题、首个内容、bottom safe-area
- Mistakes: 胶囊、返回热区、Hero 不压返回、bottom safe-area
- SG exam: 完整导航链
- Flashcard center: 显示 itpass(15)/sg(11) 牌组数
- Flashcard player: currentCard 真实渲染、选项、进度条
- Quiz: 问题/选项/计时
- Glossary detail: 术语详情正常

### Console 验证

在 DevTools Console 中确认:
- [Global Error] 类错误: 0
- module ... is not defined: 0
- navigateBack failed: 0
- Component is not found: 0
- flashcard-manifest 日志: 正常

### 关键修复验证点

- `utils/flashcards-state.js` require 路径: `./flashcard-summary-manifest` (不是 `../data/`)
- `utils/flashcard-summary-manifest.js` 存在且导出正确
- `pages/course-topic/course-topic.wxml`: ct-back 无 bindtap goBack
- `pages/mistakes/mistakes.wxss`: hero margin-top 16rpx
- `styles/secondary-page-shell.wxss`: back icon 44rpx
- `pages/course/course.wxss`: cs-back__icon 44rpx
