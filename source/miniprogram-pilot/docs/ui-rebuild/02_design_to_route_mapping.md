# R6 Claude Design 到真实路由映射

| Claude Design 页面 / 状态 | 真实路由 | 真实数据来源 | 真实交互 | 是否直接可实现 | 风险 | 最终方案 |
|---|---|---|---|---|---|---|
| 课程首页 Continue | pages/home/home | storage + course registry | continueLearning/goPractice/goReview/goToCourse | 是 | 不可伪造统计 | 保持真实 hasLastAttempt，仅重排视觉 |
| 课程首页 Start | pages/home/home | storage | goPractice/goToCourseArea | 是 | 不显示假 0 | 用 wx:else 诚实引导 |
| 课程首页 Early | pages/home/home | storage | continueLearning | 部分 | 需要成熟度阈值 | 不新增业务阈值，仅用现有记录映射到较克制状态 |
| 刷题 | pages/practice/practice | storage + navigation | continueLast/goITPassport/goSG | 是 | 不改路由 | 视觉重排为 masthead + continue + exam rows |
| 复习 | pages/review/review | storage + navigation | goFlashcards/goMistakes/goTermReview | 是 | 当前计数能力有限 | 展示真实入口，缺计数时不伪造数字 |
| 术语表 | pages/glossary/glossary | glossary index + favorites | 搜索/随机/Anki/收藏复习 | 是 | 1500 数字来自现有索引 | 改为搜索框 + 入口列表 |
| 我的 | pages/profile/profile | storage + stats | 备份/恢复/清空/复制版本 | 是 | 不能改存储语义 | 保留全部按钮，调整统计与管理分区 |
| 考试详情 | pages/course/course | course registry + storage | goPractice/goTextbook/goQuestionOrganizer/goMistakes | 是 | 不改 capabilities | 视觉改为 exam overview + single primary action |
| 练习方式 | packages/quiz/pages/exam-menu/exam-menu | quiz meta + navigation | 年度/课程/主题/闪卡入口 | 是 | 不改分包路由 | 只改 WXML/WXSS 展示 |
| 教材章节 | packages/course-*/pages/chapter-list/chapter-list | real chapter data | 展开、进入 unit | 是 | 三分包重复 | 用同一 token 化 WXSS 覆盖 |
| 详细解説 | packages/course-*/pages/unit-detail/unit-detail | real unit + canonical terms | 开始练习、术语弹层 | 是 | 禁止改内容/term resolver | 只改样式，不改 JS/data |
| 练习 C1 未作答 | packages/quiz*/pages/quiz/quiz | real questions | 选项点击 | 是 | 不改状态机 | 用现有 selected/answered 映射样式 |
| 练习 C2 已选 | packages/quiz*/pages/quiz/quiz | real questions | 确认/即时判题 | 是 | 设计有确认按钮，但现有状态机优先 | 不把单击判题改成确认按钮 |
| 练习 C3 正确 | packages/quiz*/pages/quiz/quiz | real answer + explanations | 下一题/解析 | 是 | 不改答案来源 | 仅强化 correct visual |
| 练习 C4 错误 | packages/quiz*/pages/quiz/quiz | real answer + wrong storage | 下一题/解析 | 是 | 不改错题写入 | 仅强化 wrong visual |
| 本组结果 | packages/quiz*/pages/quiz/quiz | attempt results | 再练/错题/解析 | 是 | 不改统计语义 | 视觉改为数据语言 |
| 错题本有数据 | packages/quiz/pages/mistakes/mistakes | wrong questions | start review/open detail | 是 | 不改优先级 | 列表 token 化 |
| 错题本空 | packages/quiz/pages/mistakes/mistakes | wrong questions | go practice | 是 | 不显示假题 | 诚实空状态 |
| 数据与备份 | pages/profile/profile | storage backup APIs | copy/restore/clear | 是 | 清空是高风险用户操作，不能自动触发 | 仅视觉分区，不改按钮 handler |
| 术语详情 | packages/glossary/pages/term-detail/term-detail | glossary loader + favorites | favorite/related/back | 是 | 不改收藏语义 | 主辅语言层级 |
| 闪卡复习 | packages/glossary/pages/anki-player/anki-player + packages/quiz-*/pages/flashcard-player/flashcard-player | glossary/deck data + local SRS | flip/rate/next | 是 | 不改 SRS 写入 | 仅低成本 transform/opacity 反馈 |

## 未覆盖设计稿页面的真实路由策略

分包桥接页、analysis-detail、course-topic、course-organize、flashcard-deck-select、flashcard-quiz 等使用最近邻设计语言：Masthead、SectionHeader、RowList、ActionBar、EmptyState 和 Feedback token。它们不新建假页面，不脱离真实路由。

## 冲突处理

- 设计稿 C2 写作“已选待确认”，但现有 quiz 规则禁止改变真实状态机。本轮不把单击判题改成确认按钮。
- 设计稿数字示例全部视为视觉占位。页面只能读取真实统计；没有真实来源时隐藏统计或显示诚实空状态。
- 设计稿使用远程 Google 字体。小程序实现不引入远程字体，改用系统字体 + system monospace。
