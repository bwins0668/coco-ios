# R6 Pre-UI 基线

## Worktree

- 唯一 worktree：`G:\项目\study-tools-miniprogram-textbook-termcompletion-r5.4.7`
- 小程序根目录：`G:\项目\study-tools-miniprogram-textbook-termcompletion-r5.4.7`
- 当前 branch：`feature/textbook-termcompletion-r5.4.7`
- 起始 HEAD：`fc1246b4f235f788fa9df8485b5a16d798c0dc21`
- 最近 commit：`2026-06-30 13:15:49 +0900 feat(course): complete canonical term registry for ITP(73/73) and SG(112/112)`
- Git common dir：`G:/项目/study-tools-miniprogram/.git`
- 上游：`NO_UPSTREAM`

## 起始工作区状态

Staged：无。

Unstaged：

- `project.config.json`
- `project.private.config.json`

Untracked：

- `scratch/gen_itp_resolver.js`
- `scratch/gen_itp_terms_ch04.js`
- `scratch/gen_sg_resolver.js`
- `tools/r5_4_7_baseline_audit.js`
- `tools/r5_4_7_gen_registry.js`
- `tools/r5_4_7_list_units.js`
- `tools/r5_4_7_map_termids.js`

这些全部视为既有用户资产。本轮不暂存、不覆盖、不还原。

## 基线检查结果

| 命令 | 结果 | 摘要 |
|---|---|---|
| `git diff --check` | PASS | 无 whitespace error |
| `node tools/run_miniprogram_checks.js --json` | PASS | 18/18 |
| `node tools/check_textbook_term_coverage.js --all` | PASS | ITP 73/73, SG 112/112, total 185/185 |
| `node tools/miniprogram_smoke_test.js` | PRE_EXISTING_FAILURE | 159 passed / 1 failed；失败：`R3.31: broken navigation targets: /packages/` |
| `node tools/check_design_tokens.js` | PASS | Quiet Paper v1 token contract passed |
| `node tools/check_theme_coverage.js` | PRE_EXISTING_FAILURE | 主包 course/home 等与 course-* 教材页硬编码色值 |
| `node tools/check_theme_contrast.js` | PASS | 5 token pairs verified |
| `node tools/audit_miniprogram_package_size.js` | PASS | main 242.9 KB；total 13.06 MB；packages/quiz-itpass-1 与 -4 为 watch line |

## 设计与页面统计

- 设计包可读性等级：A
- 设计页面总数：19
- 设计状态总数：至少 25
- 真实注册页面总数：47
- 已映射页面数：47
- 未映射页面数：0
- 业务冲突数：2

## 高风险文件清单

冻结且本轮不触碰：

- `project.config.json`
- `project.private.config.json`
- `utils/storage.js`
- `app.json`
- `theme.json`
- `packages/course-*/data/**`
- `packages/course-*/terms/**`
- `packages/quiz-*/data/**`
- `packages/glossary/data/**`
- canonical / term resolver / manifest 数据文件

## 本轮计划改动范围

- 新增文档：`docs/ui-rebuild/*.md`
- 新增检查：`tools/check_r6_ui_rebuild_contract.js`
- 设计系统：`styles/tokens.wxss`、`app.wxss`
- 展示层 WXML/WXSS：主包 Tab 页面、课程/教材页面、quiz/flashcard/glossary/review/profile 的纯 UI 样式
- JS 改动原则：默认不改；如必须只添加展示态字段，不改变存储、判题、复习、题库语义

## 继续条件

没有 worktree 锁定失败、detached HEAD、题库/存储语义风险阻塞。基线失败均已标记为 PRE_EXISTING_FAILURE，可自动进入实现。
