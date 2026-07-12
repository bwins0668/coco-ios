# UI polish: refine spacing, typography, colors and interactions

## 概要

本 PR 基于 `master` 新建 `ui-polish-autodrive-8`，包含 8 轮 UI 精修、数据文件编码修复、以及后续 past-exam 题库与 mistakes 功能扩展。范围涵盖首页、全局按钮与标签、底部 Tab、Anki 播放页、past-exam 题库、exam-menu 过滤、quiz 年份回显及 mistakes 卡片翻转。

## 主要改动

### 首页

- 压缩首页 hero、入口卡片、继续学习、建议卡片、成就与页脚区域的纵向间距。
- 提升入口标题、描述、徽标、统计与状态文案的字号和字重。
- 为各入口卡片增加模块化色彩层级，并补充 Anki 入口主题类。
- 优化入口卡片按压反馈，让卡片和图标反馈更明确。

### 全局设计系统

- 微调主按钮、次按钮、危险按钮的渐变、阴影和按压态。
- 加强全局标签的字重、边框与主题色层级。

### 底部 Tab

- 优化浅色与深色主题下的 Tab 背景、默认色与选中色。

### Anki

- 精修 Anki 卡片正反面背景、边框、阴影与提示文字层级。
- 优化答题按钮间距、圆角、渐变和按压反馈。

### 测试

- 为本次 UI 精修增加 smoke 覆盖，锁定首页入口主题类、卡片按压态、全局按钮/标签、Tab 主题色、Anki 卡片与按钮反馈等视觉契约。

## 验证

- `node tools/run_miniprogram_checks.js`
- `node tools/miniprogram_smoke_test.js`
- `Get-ChildItem -Path "." -Recurse -Include *.js | ForEach-Object { node --check $_.FullName }`
- `git diff --check`

以上命令将在提交前后执行并保持通过。

## 风险与兼容性

- 首页、按钮、标签、Tab、Anki 的 UI 精修：仅 WXML/WXSS/主题色，不涉及业务逻辑。
- Past-exam 题库 (`full_bank.js`, 1945 条)：新增独立数据文件，不修改已有题库结构。
- Exam-menu 过滤、quiz 年份回显、mistakes 卡片翻转：功能增量，向后兼容。
- 所有 JS 和数据文件均通过 syntax check 和 content compliance 扫描。
- 编码修复：`full_bank.js` 和 `docs/ui-polish-report.md` 原为双重编码，已修复为纯 UTF-8。
- `docs/ui-polish-report.md` 已纳入本 PR。
## 手动验收建议

- 在微信开发者工具中检查首页入口卡片、继续学习卡片和底部 Tab 的浅色/深色显示。
- 进入 Anki 播放页，检查卡片正反面、答案按钮和按压反馈。
- 重点确认小屏下入口卡片文字不挤压、不遮挡。
