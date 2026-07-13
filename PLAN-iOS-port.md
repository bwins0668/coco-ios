# CoCo iOS — 学习小程序迁原生 iOS App

## 目标
把 `source/miniprogram-pilot/`（微信小程序：IT/日语/SG/Java/Python/SQL 题库、课程、闪卡）
重写成一个**原生 iOS App**（SwiftUI + SwiftData），在 iPhone 上离线可用。

## 当前状态（2026-07-13，R6.5 实战稳态）

### 已完成（main 已上线装机闭环）
- ✅ GitHub 仓库 `bwins0668/coco-ios` master HEAD = `f0ddfd6`，与远端一致
- ✅ 5 Tab 壳（课程/刷题/复习/术语/我的）+ 自定义 Tab 图标 + Quiet Paper 设计令牌 + Dark Mode 支持
- ✅ 18 个 View 上线（RootSwitchView / Home / Practice / Quiz / Flashcards / FlashcardPlayer /
     Mistakes / Review / AnkiReview / FavoriteReview / Glossary / TermSearch / TermDetail /
     CourseCenter / CourseDetail / Chapter / Lesson / Profile）+ 3 个组件（RecentTimeline /
     StudyDashboard / TabIcons）
- ✅ SwiftData 5 model：QuizAttempt / MistakeRecord / StudyStat / FavoriteTerm / FlashcardProgress
- ✅ 内容资产 100% 落地 Bundle：
    - 题库 2074 题（8 包：`quiz` + `quiz-itpass-1..5` + `quiz-sg-1,2`）
    - 课程 7 条（`itpass` 19/185 + `sg` 19/185 + `java` 19/336 + `python` 2/9 + `sql` 1/1 + `mos` 空 + `algo` 空）
    - 术语 1500 词条（15 个分类，最大分类 programming 289 / system 231 / database 204）
- ✅ SG 课程 lesson 真内容（9 章 112 unit）落地 `sg-lesson-detail.json`（706 KB），LessonView 真渲染 overview/sections/keyTerms/caseBreakdown
- ✅ 演示数据种子：首次启动注入 24 QuizAttempts + 24h StudyStats + 5 FavoriteTerm + 1 FlashcardProgress
- ✅ CI 装机闭环：master push → GitHub Actions macOS runner 出无签名 device IPA → 30d artifact
- ✅ Windows 本地重签安装：`pwsh scripts/reinstall-coco-ios.ps1`（gh run download → python repackage → zsign → tidevice install → UDID `00008130-000E60A61E30001C`）
- ✅ 最近 5 次 CI 全部 success（`29245985095`/`29216734979`/`29216442527`/`29216154079`/`29216147924`）
- ✅ ZSB 飞书 bot 旁路接入（不混入 iOS 主线）

### 进行中（2026-07-13 ABCDE 全自动推进）
- 🔄 **A**：验证 `ios/tools/build-*.js` 是否齐备 —— **4 个脚本全部到位**（build-quiz-json / build-course-json / build-glossary-json / build-sg-lesson-json），P0 警报解除
- 🔄 **B**：本文件 PLAN 改写 → 当前快照（已完成）
- 🔄 **C-1**：侦察源小程序 → itpass / sg 同 schema，章节正文充足
- ⏳ **C-2**：新建 `build-itpass-lesson-json.js`，输出 `itpass-lesson-detail.json`，LessonStore 通用化
- ⏳ **C-3**：批量接入 itpass 19 章节 × chapter-*.js → ChapterView lessonRoute 填充 + LessonView 增量
- ⏳ **D**：master push → CI 重拉 → zsign → tidevice install 刷入 iPhone
- ⏳ **E**：git commit + push + 中文最终报告

### 已知缺口
- 🟡 itpass 19 章 lesson 真内容已抽但还未在 Bundle 资源列表（待 C-2 完成后注册）
- 🟡 mos / algo 课程为 0/0 空壳（占位 + 卡片色，非 P0）
- 🟡 python 2/9 + sql 1/1 是薄壳（仅作目录占位，正文需后续展开）
- 🟡 PLAN 状态章节每次回合后必须刷新（本次已刷新）

### 已废止记录
- ~~SwiftData `Color(hex:)` immutable 初始化错误~~ → 修法：必须 `var` + 逐个赋值
- ~~Swift 6 FetchDescriptor predicate pack expansion 警告~~ → 改用 `FetchDescriptor<T>()` 不带 predicate
- ~~`sheet(item:)` 要求 Item: Identifiable~~ → LessonView 用 sheet 入口必须包装 Identifiable wrapper
- ~~`reinstall-coco-ios.ps1` 缺 UTF-8 BOM 解析失败~~ → 全部 .ps1 强制 UTF-8 with BOM

## 源数据资产（小程序侧，已落档）
- 题库 8 包 JS，形态：`{ questions: [...] }` 或 `{ questionsByYear: { year: [...] } }`，中文来自 `questions_zh.js`，解析来自 `explanations_zh.js`
- 课程 manifest：`packages/<course>/data/manifest.js`，chapter-*.js 补真实内容（含 sections / keyTerms / caseBreakdown）
- 术语：`packages/glossary/data/chunks/glossary_chunk_*.js`，合并写入 `glossary.json`

## 移植约定
- 证书/描述文件/密钥（.p12/.mobileprovision/.env）禁止入库
- 小程序源仅作内容提取源，iOS 工程不依赖小程序运行时
- build 脚本必须用 ROOT = `path.resolve(__dirname, '../..')` 自定位，CI 里 `cd ios` 也能跑
- 每加一章节 lesson 必须同步：build 脚本 + Bundle JSON + project.yml 资源注册 + CI step
- 5 Tab 自定义图标（CSS/border 方案不稳定，已经全切到 local SVG 27×27 viewBox）

## 内容管线（必须全链路自动）
1. push master → CI
2. node `ios/tools/build-quiz-json.js` → 8 quiz JSON
3. node `ios/tools/build-course-json.js` → course-manifest.json
4. node `ios/tools/build-glossary-json.js` → glossary.json
5. node `ios/tools/build-sg-lesson-json.js` → sg-lesson-detail.json
6. node `ios/tools/build-itpass-lesson-json.js` → itpass-lesson-detail.json （新增）
7. brew install xcodegen / xcodegen generate
8. xcodebuild -sdk iphoneos CODE_SIGNING_ALLOWED=NO
9. zip Payload → CoCoiOS-unsigned.ipa → upload artifact

## 本地装机
```pwsh
pwsh scripts/reinstall-coco-ios.ps1
# gh run download → python repackage_to_payload.py → zsign (-k p12 -p '1' -m mp -b com.CLaov.M3EM) → tidevice -u <UDID> install
```

UDID `00008130-000E60A61E30001C` · Bundle `com.CLaov.M3EM`
