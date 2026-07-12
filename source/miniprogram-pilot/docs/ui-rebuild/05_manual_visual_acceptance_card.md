# R6 人工视觉验收卡

状态：READY_FOR_MANUAL_VISUAL_PROOF

无法在当前终端生成微信开发者工具真实运行截图时，按本卡在 DevTools 中逐页验收。截图必须来自真实运行小程序，不得使用设计稿截图替代。

| 路由 | 入口 | 数据状态 | 应看到 | 对应设计页 | 交互检查 | 通过标准 |
|---|---|---|---|---|---|---|
| pages/home/home | 启动进入课程 Tab | 无记录/有记录各一次 | 暖纸背景、刊头、唯一主行动、资格考试入口 | 课程 Start/Early/Continue | 继续练习、今日复习、考试入口 | 不显示虚构 0，按钮可点击 |
| pages/practice/practice | 刷题 Tab | 有/无上次记录 | 刷题刊头、继续卡、考试列表 | 刷题 | 继续上次、ITP、SG | 路由正常 |
| pages/review/review | 复习 Tab | 有/无错题收藏 | 复习入口列表，真实空态 | 复习 | 闪卡、错题、术语复习 | 无数据不白屏 |
| pages/glossary/glossary | 术语 Tab | 1500 术语 | 搜索入口与四个快捷入口 | 术语 | 搜索、随机、Anki、收藏 | 数字来自真实索引 |
| pages/profile/profile | 我的 Tab | 新用户/有记录 | 学习数据、分类正确率、数据管理 | 我的/数据备份 | 复制备份、恢复、清空确认 | 不自动触发危险操作 |
| pages/course/course | 首页/刷题进入考试 | ITP/SG | 考试概览、练习方式、教材章节、题目整理 | 考试详情 | 进入练习/教材/错题 | capabilities 不变 |
| packages/course-*/pages/chapter-list/chapter-list | 考试详情-教材章节 | 真实章节 | 章节列表、展开状态、空态 | 教材章节 | 展开/进入 unit | 长日文可读 |
| packages/course-*/pages/unit-detail/unit-detail | 章节进入 | 真实 unit | 解説、术语、例子、练习按钮 | 详细解説 | 术语弹层、开始练习 | 内容不变 |
| packages/quiz/pages/exam-menu/exam-menu | 考试详情/刷题 | 真实考试 | 练习方式列表 | 练习方式 | 年度/课程/闪卡入口 | 路由不退化 |
| packages/quiz*/pages/quiz/quiz | 任意练习入口 | 真实题目 | C1-C5 状态与解析 | 练习状态 | 选择、判题、解析、下一题、结果 | 答案/进度/错题语义不变 |
| packages/quiz/pages/mistakes/mistakes | 复习/结果页 | 有错题/无错题 | 错题列表或诚实空态 | 错题本 | 开始复习、打开解析 | 不伪造错题 |
| packages/glossary/pages/term-detail/term-detail | 术语搜索进入 | 真实术语 | 三语主辅分层、收藏、相关术语 | 术语详情 | 收藏切换、返回 | 收藏语义不变 |
| packages/glossary/pages/anki-player/anki-player | 术语/复习进入 | 收藏/术语数据 | 翻卡、SRS 按钮、完成 | 闪卡复习 | 翻卡、记得/不熟 | SRS 写入不变 |

## 截图要求

使用 390 宽度优先，补充 375 和 430 宽度 spot check。命名：`序号_路由_状态_设备宽度.png`。每张截图登记到证据目录 manifest。
