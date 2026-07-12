# 31\_r6\_6c\_runtime\_manual\_visual\_proof\_checklist.md

## R6.6C 运行时人工视觉验收清单

**状态**: READY_FOR_MANUAL_VISUAL_PROOF

本 Checklist 供 Coco 在真机或 DevTools 390px / 375px / 430px 视口下手动逐项验收。

---

### 390px 必检项（22 项）

1. 冷启动课程首页 — 看到 course center (IT Passport + SG)
2. Course → IT Passport detail — 有返回按钮、标题 `IT パスポート試験`、课程内容
3. Course → SG detail — 有返回按钮、标题、课程内容
4. Course → 错题本 — 有返回、`错题本` 标题、错题统计
5. Practice → IT exam — 能看到年份/模式选择
6. Practice → SG exam — 同上
7. SG / IT → quiz — 答题界面正常
8. quiz → correct/wrong/analysis/result — 各状态正常
9. Review → Flashcard Center → 卡片列表 + 统计数据
10. Glossary → Flashcard / Anki — 正常跳转
11. Flashcard deck select — 牌组列表可见
12. Flashcard player — 题目 + 选项 + 进度条
13. Course → chapter list — 章节列表
14. chapter → unit detail — 单元详情
15. Glossary → detail — 术语详情
16. Settings / Help / Feedback — 基础页面
17. 直接输入一个 secondary route — 正常加载
18. 只点返回箭头可返回 — 不误触空白/标题/卡片
19. 无 native white chrome — 所有二级页无顶部白条
20. Quiet Paper 连续 — 壳背景色一致 `#F2EDE0`（浅纸色）
21. 无白屏 — 任何页面都不能纯白
22. Console 无红色错误 — `[Global Error]` / `module not defined` 等

### 375px / 430px 重点项（7 个关键 page）

每个检查：胶囊位置 | 返回热区 | 标题 | 首个内容 | bottom safe-area | 横向溢出 | 白色顶栏 | 返回 fallback

- Course detail
- Mistakes
- SG exam
- Flashcard Center
- Flashcard player
- Quiz
- Glossary detail

### Console 验证

在 DevTools Console 中检查：
- 无 `[Global Error]`
- 无 `module ... is not defined`
- 无 `require args is` 相关错误
- 闪卡页面 `flashcard-manifest` 日志正常
- 返回按钮点击无 `navigateBack failed` 错误
