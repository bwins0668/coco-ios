# R6 当前路由与状态盘点

## 摘要

- 小程序根目录：`G:\项目\study-tools-miniprogram-textbook-termcompletion-r5.4.7`
- 注册路由总数：47
- 主包页面：10
- 分包页面：37
- 当前 Tab：课程、刷题、复习、术语、我的
- 当前真实数据来源：`utils/storage.js`、`utils/navigation.js`、`utils/course-content-registry.js`、`data/questions.js`、`packages/quiz-*/data/*`、`packages/glossary/data/*`、`packages/course-*/data/*`

## 注册页面清单

| # | 路由 | 所属主包/分包 | 数据来源 | 核心交互 | 关键状态 | 设计稿对应 |
|---|---|---|---|---|---|---|
| 1 | pages/home/home | 主包 | storage + course registry | 继续练习、进入考试/课程/复习 | start/early/continue | 课程首页 |
| 2 | pages/practice/practice | 主包 | storage + navigation | 继续上次、选择考试 | loaded/empty continue | 刷题 |
| 3 | pages/review/review | 主包 | storage + navigation | 进入闪卡/错题/术语复习 | loaded/empty counts | 复习 |
| 4 | pages/course/course | 主包 | course registry + storage | 选择练习方式、教材章节、题目整理 | certification/learning/notFound | 考试详情 |
| 5 | pages/course-topic/course-topic | 主包 | topic registry | 返回、主题练习 | loaded/notFound | 详细解説最近邻 |
| 6 | pages/course-organize/course-organize | 主包 | wrong/favorite questions | 错题/收藏 tab | wrong/favorite/empty | 题目整理最近邻 |
| 7 | pages/flashcards/flashcards | 主包 | flashcard manifest | 选择课程闪卡、术语 Anki | loaded/empty | 闪卡入口 |
| 8 | pages/glossary/glossary | 主包 | glossary index + favorites | 搜索、全部浏览、随机、收藏复习、Anki | favorite/no favorite | 术语 |
| 9 | pages/mistakes/mistakes | 主包 | wrong questions | 进入错题复习 | empty/loaded | 错题入口 |
| 10 | pages/profile/profile | 主包 | storage + stats | 备份、恢复、统计、清空确认 | new/loaded/backup empty | 我的/数据备份 |
| 11 | packages/glossary/pages/term-search/term-search | packages/glossary | glossary loader | 搜索、随机、打开详情 | empty/search/result | 术语搜索最近邻 |
| 12 | packages/glossary/pages/term-detail/term-detail | packages/glossary | glossary loader + favorites | 收藏、相关术语、返回 | favorite/unfavorite/notFound | 术语详情 |
| 13 | packages/glossary/pages/favorite-review/favorite-review | packages/glossary | term favorites | 收藏术语复习 | empty/loaded/completed | 术语复习 |
| 14 | packages/glossary/pages/anki-player/anki-player | packages/glossary | glossary + local SRS | 翻卡、记得/不熟 | loading/content/done/empty | 闪卡复习 |
| 15 | packages/quiz/pages/exam-menu/exam-menu | packages/quiz | quiz meta + navigation | 真题/课程/主题/闪卡入口 | loaded/empty | 练习方式 |
| 16 | packages/quiz/pages/quiz/quiz | packages/quiz | course questions + storage | 选项、判题、解析、下一题、结果 | initial/selected/correct/wrong/result | 练习 C1-C5/结果 |
| 17 | packages/quiz/pages/mistakes/mistakes | packages/quiz | wrong questions | 开始复习、分析详情 | empty/loaded | 错题本 |
| 18 | packages/quiz/pages/analysis-detail/analysis-detail | packages/quiz | quiz data + explanations | 查看解析、返回错题 | loaded/notFound | 解析详情 |
| 19 | packages/quiz/pages/flashcard-quiz/flashcard-quiz | packages/quiz | flashcard questions | 闪卡 quiz | loading/content/done | 闪卡练习最近邻 |
| 20 | packages/quiz/pages/flashcard-deck-select/flashcard-deck-select | packages/quiz | flashcard manifest | 选择 deck | loading/loaded/error | 闪卡入口最近邻 |
| 21 | packages/quiz-itpass-1/pages/quiz/quiz | quiz-itpass-1 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 22 | packages/quiz-itpass-1/pages/flashcard-bridge/flashcard-bridge | quiz-itpass-1 | bridge | 装载后返回 | loading/error | 辅助页 |
| 23 | packages/quiz-itpass-1/pages/flashcard-player/flashcard-player | quiz-itpass-1 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 24 | packages/quiz-itpass-2/pages/quiz/quiz | quiz-itpass-2 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 25 | packages/quiz-itpass-2/pages/flashcard-bridge/flashcard-bridge | quiz-itpass-2 | bridge | 装载后返回 | loading/error | 辅助页 |
| 26 | packages/quiz-itpass-2/pages/flashcard-player/flashcard-player | quiz-itpass-2 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 27 | packages/quiz-itpass-3/pages/quiz/quiz | quiz-itpass-3 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 28 | packages/quiz-itpass-3/pages/flashcard-bridge/flashcard-bridge | quiz-itpass-3 | bridge | 装载后返回 | loading/error | 辅助页 |
| 29 | packages/quiz-itpass-3/pages/flashcard-player/flashcard-player | quiz-itpass-3 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 30 | packages/quiz-itpass-4/pages/quiz/quiz | quiz-itpass-4 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 31 | packages/quiz-itpass-4/pages/flashcard-bridge/flashcard-bridge | quiz-itpass-4 | bridge | 装载后返回 | loading/error | 辅助页 |
| 32 | packages/quiz-itpass-4/pages/flashcard-player/flashcard-player | quiz-itpass-4 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 33 | packages/quiz-itpass-5/pages/quiz/quiz | quiz-itpass-5 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 34 | packages/quiz-itpass-5/pages/flashcard-bridge/flashcard-bridge | quiz-itpass-5 | bridge | 装载后返回 | loading/error | 辅助页 |
| 35 | packages/quiz-itpass-5/pages/flashcard-player/flashcard-player | quiz-itpass-5 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 36 | packages/quiz-sg-1/pages/quiz/quiz | quiz-sg-1 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 37 | packages/quiz-sg-1/pages/flashcard-bridge/flashcard-bridge | quiz-sg-1 | bridge | 装载后返回 | loading/error | 辅助页 |
| 38 | packages/quiz-sg-1/pages/flashcard-player/flashcard-player | quiz-sg-1 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 39 | packages/quiz-sg-2/pages/quiz/quiz | quiz-sg-2 | split question bank | 真题答题 | initial/selected/correct/wrong/result | 练习 C1-C5 |
| 40 | packages/quiz-sg-2/pages/flashcard-bridge/flashcard-bridge | quiz-sg-2 | bridge | 装载后返回 | loading/error | 辅助页 |
| 41 | packages/quiz-sg-2/pages/flashcard-player/flashcard-player | quiz-sg-2 | deck data | 闪卡学习 | loading/content/done/error | 闪卡复习 |
| 42 | packages/course-content/pages/chapter-list/chapter-list | course-content | course content manifest | 展开章节、进入 unit | loading/loaded/empty | 教材章节 |
| 43 | packages/course-content/pages/unit-detail/unit-detail | course-content | course content manifest | 查看解説、开始主题练习、术语弹层 | loaded/notFound/sheet | 详细解説 |
| 44 | packages/course-itpass/pages/chapter-list/chapter-list | course-itpass | ITP chapter data | 展开章节、进入 unit | loading/loaded/empty | 教材章节 |
| 45 | packages/course-itpass/pages/unit-detail/unit-detail | course-itpass | ITP chapter data + terms | 查看解説、开始主题练习、术语弹层 | loaded/notFound/sheet | 详细解説 |
| 46 | packages/course-sg/pages/chapter-list/chapter-list | course-sg | SG chapter data | 展开章节、进入 unit | loading/loaded/empty | 教材章节 |
| 47 | packages/course-sg/pages/unit-detail/unit-detail | course-sg | SG chapter data + terms | 查看解説、开始主题练习、术语弹层 | loaded/notFound/sheet | 详细解説 |

## 隐藏但可达状态

- 练习：未作答、已选择、正确反馈、错误反馈、解析展开、下一题、完成结果、返回。
- 复习：待复习列表、错题列表、空错题、术语收藏空态、闪卡完成。
- 数据：备份为空、备份有数据、恢复入口、危险操作确认。
- 教材：章节为空、章节展开、unit not found、术语弹层。

## 已知基线风险

- `tools/miniprogram_smoke_test.js` 现场已有 1 项失败：`R3.31: broken navigation targets: /packages/`。
- `tools/check_theme_coverage.js` 现场已有硬编码颜色失败，集中在主包课程页与 course-* 教材页 WXSS。
