# 38_r6_6rc_true_device_preview_card.md

## R6.6 真机预览验证卡

**候选版本 HEAD**: `edfcdac`
**Branch**: `feature/r6.6-secondary-route-dc-fidelity`

### 390px 真机必检 (20 项)

1. 冷启动 — Console 无 MiniProgramError / module-not-defined
2. 课程 Tab — 图标与文字同蓝 (#37418A)
3. 刷题 Tab — 图标与文字同蓝
4. 复习 Tab — 图标与文字同蓝
5. 术语 Tab — 图标与文字同蓝
6. 我的 Tab — 图标与文字同蓝
7. 切换 Tab — 前一 Tab 自动恢复灰 (#C9C4BD)，不闪蓝
8. 课程 → IT Passport detail — 返回按钮 44rpx 可见
9. 课程 → SG detail — 返回按钮可见
10. 课程 → 错题本 — Hero 距 nav bar 16rpx
11. Practice → IT exam — 年份/模式选择正常
12. Practice → SG exam — 同上
13. Review → 闪卡复习 → Center → Deck → Player — 无白屏
14. Glossary → Anki — 正常跳转
15. 章节列表 / 单元详情 — 正常
16. 设置 / 帮助 / 反馈 — 正常
17. direct-entry 无栈返回 — fallback 正确
18. 无原生白色 navigation bar
19. Quiet Paper (#F2EDE0) 从状态栏到底部连续
20. Console 无红色错误

### 375px / 430px 重点 (7 页)

- Course detail: 胶囊、返回热区、标题
- Mistakes: Hero 不压返回、底部安全区
- SG Exam: 完整导航链
- Flashcard Center: itpass(15)/sg(11) 牌组数
- Flashcard Player: currentCard 真实渲染、选项、进度
- Quiz: 问题/选项/计时
- Glossary Detail: 术语详情

### DevTools Console 检查项

- [Global Error] 类错误: 0
- module ... is not defined: 0
- navigateBack failed: 0
- Component is not found: 0
