# CoCo iOS — 把学习小程序搬上 iOS 原生 App

## 目标
把 `source/miniprogram-pilot/`（微信小程序：IT/日语/SG/Java/Python/SQL 题库、课程、闪卡）
重写成一个**原生 iOS App**（SwiftUI + SwiftData），在 iPhone 上离线可用。

## 当前状态（2026-07-12）
- ✅ GitHub 仓库 bwins0668/coco-ios 已创建并推送 baseline（master 分支，2167 文件）
- ✅ 小程序源码已作为 `source/miniprogram-pilot/` 归档保留，供内容提取参考
- ⏳ 原生 iOS 工程尚未创建

## 源数据资产（已确认可复用）
题库数据是 `module.exports = { id: { questionZh, optionsZh, options, answer } }` 的 JS 对象：
- 7 个 quiz 包：quiz / quiz-itpass-1..5 / quiz-sg-1..2
- `questions.js` 含标准答案字段 `"answer": "A"`，可直接用作判分 key
- `explanations_zh.js` 含中文解析，用作答题后讲解
- 课程包：course-sg / course-itpass / java-course* / python-course* / sql-course
- 组件 / utils / i18n 仅作 UI 逻辑参考，不移植

## 移植路线（建议分阶段）
### Phase 0 — 工程骨架
- 新建 `ios/` Xcode 工程（SwiftUI App，Bundle ID 待定）
- 数据层：用 SwiftData 建 Question / QuizBank / UserRecord 模型
- 内容管线：写一个 Node/Python 脚本把 `*.js` 题库转成 JSON / Swift 资源

### Phase 1 — 刷题核心
- 题库列表 → 题目卡片（选项、选中、提交）
- 判分（用 answer 字段）+ 解析展示
- 进度/错题本地持久化（SwiftData）

### Phase 2 — 课程与闪卡
- 课程包浏览（SG/IT Pass/Java/Python/SQL）
- 闪卡复习（SRS 间隔重复）

### Phase 3 — 体验与发布
- UI 对齐小程序设计语言（紧凑、卡片化、动态感）
- TestFlight / 真机签名（参考 HelloiOS 的 zsign + tidevice 流程）

## 约定
- 证书/描述文件/密钥（.p12/.mobileprovision/.env）禁止入库（见根 .gitignore）
- 小程序源仅作参考，不在 iOS 工程内引用其运行时
