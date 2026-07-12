# R6.5.5 Tab Fullscreen Shell Manual Acceptance

> Date: 2026-06-30
> Acceptance method: 微信开发者工具 (WeChat DevTools), real device preview
> Worktree: `feature/textbook-termcompletion-r5.4.7` @ `1f4ebd4`

## 用户人工验收通过范围

| Route | Page | Accepted |
|-------|------|----------|
| `pages/home/home` | 课程 | ✓ |
| `pages/practice/practice` | 刷题 | ✓ |
| `pages/review/review` | 复习 | ✓ |
| `pages/glossary/glossary` | 术语 | ✓ |
| `pages/profile/profile` | 我的 | ✓ |
| `custom-tab-bar/` | 全局 TabBar | ✓ |

## 已接受行为

1. 五个一级 Tab 不再显示微信原生白色导航栏
2. 米白 Quiet Paper 背景（`#F2EDE0`）从状态栏覆盖到 TabBar 上方完整区域
3. 小程序胶囊按钮未碰撞页面标题
4. 五个 Tab 连续切换正常（课程→刷题→复习→术语→我的→课程）
5. TabBar 选中态正确（active tab 高亮）
6. TabBar 背景不透明（`#F2EDE0` hardcoded + CSS variable fallback）
7. 页面正文不被 TabBar 遮挡（`calc(100rpx + safe-area-inset-bottom)` bottom inset）
8. 无页面闪白或顶部高度跳动
9. 课程页 Header：kicker/date 顶部对齐（`flex-start`），streak 居中
10. Profile 页 Header：kicker/date 顶部对齐（`flex-start`）

## 明确未扩大验收范围

以下路由/页面**未经过人工视觉验收**，仍保持 R6.5 前的原有状态：

- 课程详情 (`pages/course/course`, `pages/course-topic/course-topic`, `pages/course-organize/course-organize`)
- 闪卡中心 (`pages/flashcards/flashcards`)
- 错题本 (`pages/mistakes/mistakes`)
- 教材章节 (`packages/course-*/pages/*`)
- 考试详情 (`packages/quiz/pages/exam-menu/exam-menu`)
- 练习方式 / 考试菜单
- 主答题页 (`packages/quiz-*/pages/quiz/quiz`)
- 答对 / 答错 / 解析状态
- 练习完成页 / 结果页
- 术语详情 (`packages/glossary/pages/term-detail/term-detail`)
- 术语搜索 (`packages/glossary/pages/term-search/term-search`)
- 收藏复习 (`packages/glossary/pages/favorite-review/favorite-review`)
- 闪卡记忆 (`packages/glossary/pages/anki-player/anki-player`)
- 设置与其他辅助页

## 验收结论

**MANUAL_ACCEPTED_LIMITED_SCOPE**
