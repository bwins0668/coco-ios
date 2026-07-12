# R6 Claude Design 交接包盘点

## 来源

- 原始设计包目录：`G:\项目\mini design`
- 解压临时目录：`C:\Users\lvgua\AppData\Local\Temp\study-tools-r6-claude-design-20260630-211119`
- 证据目录：`G:\项目\study-tools-miniprogram-ui-r6-evidence\20260630-211119`
- ZIP：`G:\项目\mini design\# IT学习小程序设计重构..zip`
- ZIP SHA256：`7CD97B4AC87478E28D64EB86F89AFB34E29CF8C648EA853FC5099EB6C186B18E`

## 文件清单与 Hash

| 文件 | 类型 | SHA256 |
|---|---|---|
| 首页视觉方向探索.dc.html | 视觉方向 | `CE424A9E063172E625D1987DFC22E090230046ED8396FE0ABD03BDF9E2000CC5` |
| IT学习小程序 开发交接说明.dc.html | 交接说明 | `9D731CC95F7FD286DC4C52DA273C2C857A092A135B8EE821261D7476B732A4B7` |
| IT学习小程序 全站交互原型.dc.html | 交互原型 | `F17BD5C38E2C902D31DB7D467A939504DFA7F5493B96F7C62730AB9DE1865343` |
| IT学习小程序 全站重构.dc.html | 全站视觉 | `D7B90281142A6722A938270AA702DD68CBBFC451CAAAE656C24F683BE3D95DF0` |
| support.js | Claude Design 支撑脚本 | `E0650B109EC8F78CCC370FA27762B0C485CEE4F208156A671F346E8544FC2214` |
| screenshots/*.png | 设计截图 | 10 个 |
| uploads/*.png | 设计上传资源 | 23 个 |

## 可读性

- 可读取文件类型：ZIP、`.dc.html`、HTML/CSS、PNG、支撑 JS。
- 页面数量：设计交接说明冻结 19 屏；全站重构中标注 19 个主要屏幕，并补充 Start/Early/Continue 状态流。
- 页面状态数量：至少 25 个，包括首页 3 状态、练习 C1-C5、错题有数据/空、结果、闪卡翻面、数据备份、术语详情。
- 设计尺寸基准：390 x 844 设备画布，主内容左右 20px，底部安全区独立处理。
- 设计包可读性等级：A。理由：存在结构化交接文档、全站视觉 HTML、交互原型、截图与完整 token 表。

## 设计规则摘录

- 视觉目标：Quiet Paper x Newsprint + Terminal 数据语言。
- 信息层级：一屏一主行动，少框多线，编辑式刊头，区块编号 01/02。
- 色彩：暖纸底、深暖墨黑、单一墨蓝主强调、编辑红只用于 kicker/规则线，红绿仅用于答题反馈。
- 字体：小程序内使用系统中文/日文字体；等宽数据使用系统 monospace；不引入远程字体。
- 间距：8pt 网格，页面左右 20px，行列表靠分割线和留白组织。
- 圆角：tag 5px，小控件 10-12px，主卡/解析 14-16px；避免大圆角卡片堆叠。
- 动效：仅 transform / opacity 级反馈；不用持续高成本动画。
- 禁止项：大渐变、玻璃拟态、重阴影、花哨插画、多强调色、营销横幅、功能同权、虚构数据。

## 组件识别

基础组件：PageShell、Masthead、SectionHeader、PrimaryButton、SecondaryButton、GhostButton、StatusPill、ProgressLine、EmptyState、ErrorState、Skeleton、QuestionOption、AnswerFeedback、ExplanationSheet、BottomActionBar。

业务组件：LearningHero、ContinueCard、ExamEntryRow、ChapterList、UnitDetail、QuizContainer、QuestionView、ResultSummary、MistakeTaskList、ReviewHub、GlossaryHub、ProfileStats、BackupManage、FlashcardReview。

## 资源限制

设计包图片只作为只读证据，不复制进 Git 仓库。实现使用小程序 WXML/WXSS 与现有数据，不使用设计截图作背景，不引入远程字体、CDN 或大型 UI 框架。
