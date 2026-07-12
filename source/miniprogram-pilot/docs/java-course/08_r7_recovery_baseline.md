# R7 恢复基线审计报告 (43724d8)

> 基线 commit: `43724d8acc7993e3a2081ac226ac0c3669965ad6`
> 基线标题: `docs(java): record R7.0A.1 content depth audit and DevTools visual proof card`
> 生成时间: 2026-07-02
> 恢复分支: `feature/r7-java-course-recovery`
> 来源: 从独立克隆 `study-tools-miniprogram-java-course-r7-recovery` 生成
> 原始取证工作区: `study-tools-miniprogram-java-course-r7` (未修改，仅只读查询)

---

## 0. 原始取证现场完整性声明

取证工作区 `G:\项目\study-tools-miniprogram-java-course-r7` 的 HEAD 为 `791637e`，工作区存在 19 个 unstaged 修改文件和 33 个未跟踪文件（包括 16 个 `update_ch*.sh`、`update_runner.js` 等改写脚本）。

**本恢复克隆完全独立**：
- 使用 `git clone --no-local --no-hardlinks` 创建
- `.git` 目录不与原取证目录共享
- 从 `43724d8` 原始基线 detach 并新建分支 `feature/r7-java-course-recovery`
- `push.default` 设置为 `nothing` 防误推
- 原取证工作区未执行任何写操作

取证工作区未被打扰的证据：
- 所有查询仅使用 `git rev-parse`、`git status`、`git log`、`git show`、`git diff`、`git ls-files`
- 未执行任何 `git reset` / `git restore` / `git clean` / `git stash`

---

## 1. 反模式记录（绝不复用的历史方案）

### 1.1 不合格提交链路

| Commit | 日期 | 说明 | 变更规模 | 问题 |
|---|---|---|---|---|
| `146df81` | 2026-07-02 | refactor: remediate 76 target lessons | 21 files, +6788/−6903 | 模板化批量改写，注释掉 originality checker 的关键门禁 |
| `caaa6f9` | 2026-07-02 | fix: restore semantic pedagogy contract | 未知 | 试图修复但未完全恢复门禁 |
| `791637e` | 2026-07-02 | test: add pedagogy gate checkers | +11880/−11150 | 重新启用 checker 但产生大量 FAIL |

**146df81 的具体反模式**：
1. 修改了全部 19 个 chapter 文件，新增 `tools/apply_java_pedagogical_remediation.js` (1827 行)
2. 修改了 `tools/check_r7_java_content_originality_contract.js`，注释掉了 jaDuplicates、zhDuplicates、handsonDuplicates 的门禁检查（原检查被改为 `// disabled`）
3. 注释掉了 target lesson 的 Jaccard 交叉验证（scoreZh、scoreJa、scoreHandson）
4. 新增 `tools/apply_java_pedagogical_remediation.js` 作为批量改写引擎

**791637e 的具体反模式**：
1. 新增 6 个 checker/脚本工具（`apply_r7_java_noise_cleanup.js`、`check_r7_java_semantic_pedagogy_contract.js`、`fix_repeated.js`、`generate_r7_audit_doc.js`、`run_r7_semantic_mutations.js`）
2. 新增 2 个审计文档
3. 仍然保留了被修改的 originality contract checker
4. 在后续脏工作区中，该 checker 被进一步修改（重新启用门禁），导致大量 FAIL

### 1.2 脏工作区遗留的改写脚本（绝不复用）

| 文件 | 大小 | 用途 | 风险 |
|---|---|---|---|
| `update_runner.js` | 26KB | 批量调度，逐 lesson 调用 `update_lesson.js` | 模板化替换，按 lesson 序号批量生成 |
| `update_ch*.sh` (16个) | 2-55KB | 每章独立 shell 改写脚本 | 并行多 Agent 改写时的分片脚本 |
| `tools/update_lesson.js` | 1.4KB | 单 lesson 字段替换 | 机械化字段替换 |
| `tools/apply_java_pedagogical_remediation.js` | 135KB | 大规模批量改写引擎 | 最大的遗留脚本 |
| `tools/rewrite_c_lessons.js` | 8.9KB | course-c 批量改写 | 模板化分片 |
| `rewrite_course_a.js` / `rewrite_course_b.js` | 108KB / 7KB | 单章节改写 | 按章节模板生成 |
| `tools/fix_repeated.js` | 864B | 修复重复内容 | 治标不治本 |

**共同反模式**：所有脚本依赖 `spawnSync('node', ['tools/update_lesson.js', file, lessonId, field, zh_text, ja_text])` 模式 — 即"按字段 + 按 lesson 序号 → 批量写入预生成文本"，无可解释性检查和交叉验证。

---

## 2. 43724d8 基线内容库存

### 2.1 统计摘要

| 项目 | 数量 | 结论 |
|---|---|---|
| chapter 数 | 19 | 完整 (java-ch01 ~ java-ch19) |
| lesson 数 | 336 | 完整 |
| runnable 示例数 | 336 | 每节 1 个，Java 21 编译通过 |
| source mapping 数 | 336 | 100% 覆盖，来源: `java_intro_tsukuba` + `java_practice_tsukuba` |
| 有 ja + zh blocks lesson 数 | 336 | 100% 双语覆盖 |
| 有 commonMistakes lesson 数 | 336 | 100% 覆盖 |
| 有 handson lesson 数 | 336 | 100% 覆盖 |
| 有 nextLessonBridge lesson 数 | 336 | 100% 覆盖 |
| 有 codeExamples lesson 数 | 336 | 100% 覆盖 |
| Java 21 编译通过示例数 | 336 | checker PASS |
| 明显 source metadata learner-visible 命中 | **1680** (blocks中) + **336** (codeExamples输出中) | **需关注** |
| TODO / placeholder 命中 | 0 | 干净 |
| dummy / null stuffing 候选 | 0 | 干净 |
| semanticFidelity 布尔标记 | 不存在于 43724d8 | 该字段在后续 commit 中添加 |

### 2.2 数据结构

每节 lesson 包含以下字段：
- `lessonId` / `chapterId` / `order` / `title` (ja+zh)
- `sourceRef` (sourceId, chapter, section, pageStart, pageEnd)
- `objectives` (数组, ja+zh)
- `prerequisites` (数组, ja+zh)
- `blocks` (5 个语义块: learning-goal → mechanic → beginner-note → pitfall → practice-prep, 每个含 ja+zh)
- `terms` (2-3 个术语, 含 en/ja/zh 及解释)
- `codeExamples` (1 个可运行示例, 含 className/code/expectedOutput/lineNotes)
- `commonMistakes` (2-3 条, 每条 ja+zh)
- `handson` (ja+zh)
- `summary` (ja+zh)
- `nextLessonBridge` (ja+zh)

### 2.3 模板结构特征

43724d8 基线的 336 个 lesson 共享同一套 5-block 教学模板：

1. **learning-goal** ("この節のねらい" / "本节目标") — 始终以 "教材Xページ「section_name」:" 开头
2. **mechanic** ("コードで見るポイント" / "从代码看重点") — 同样格式
3. **beginner-note** ("ゼロから読む順番" / "零基础阅读顺序") — 以 "教材Xページ「section_name」: 初心者は..." 格式
4. **pitfall** ("つまずきやすい点" / "容易卡住的点") — 以 "教材Xページ「section_name」: ここでの典型的なミスは..." 格式
5. **practice-prep** ("手を動かす前に" / "动手前确认") — 固定句式 "このミニ例は教材本文の写しではなく..."

**这是模板化生成的特征，不是"高质量个性化教学"**。v2 checker 正确识别了这种结构相似性。

---

## 3. v2 完整性检查器结果

由 `tools/check_r7_java_content_integrity_v2.js` 在 43724d8 基线上运行：

| 类别 | 数量 | 说明 |
|---|---|---|
| LIKELY_TEMPLATE_REPLICATION | 8,784 | blocks 正文在规范化后高度相似（Jaccard >= 0.95），反映模板结构 |
| CODE_BEHAVIOR_DUPLICATE | 276 | 代码行规范化后完全相同，仅改 class 名/变量名/日志/字面量 |
| LEARNER_VISIBLE_METADATA_NOISE | 1,680 | 教材页码(教材Xページ/教材第X页)出现在学生可见的 blocks 正文中 |
| PLACEHOLDER_OR_STUFFING | 0 | 无占位符 |
| PROGRESSION_CANDIDATE | 2,458 | 中等相似度(Jaccard 0.85-0.95)，可能为递进复用 |
| BOILERPLATE_ALLOWED | 0 | （当前未分离到独立类别，合并于以上类别中） |

**注意**：此数字较高反映了 43724d8 基线采用统一教学模板生成的特性。不是每个 finding 都代表内容缺陷 — 5 个固定栏目标题和教学模板句式会产生大量结构性相似。后续恢复的关键任务是在保留教学结构的前提下，确保每节有**本节独有的概念解释、代码行为、易错点和动手任务**。

详细的聚类库存见 `docs/java-course/10_r7_content_cluster_inventory.md`。

---

## 4. 既有 R6.6 门禁结果 (43724d8 基线)

| Checker | 结果 | 备注 |
|---|---|---|
| `check_r7_java_source_coverage.js` | PASS | 336 sections mapped from 2 sources |
| `check_r7_java_bilingual_content_quality.js` | PASS | 336 lessons |
| `check_r7_java_no_quiz_contract.js` | PASS | 72 files scanned |
| `check_r7_java_runtime_package_contract.js` | PASS | 19 chapters, 336 lessons |
| `check_r7_java_examples_compile.js` | PASS | 336 examples |
| `check_r7_java_route_shell_contract.js` | PASS | 9 pages checked |
| `check_r7_java_content_originality_contract.js` | PASS | 原始版本 (43724d8 时门禁尚未被弱化) |

---

## 5. 恢复结论

1. **43724d8 是一个结构完整的基线**：19 章、336 节、全部双语、全部有示例/易错点/动手任务/衔接。
2. **内容质量受模板化影响**：5-block 统一模板产生大量结构性相似文本，尤其 blocks 正文中混入教材页码（每 block 前缀）。
3. **代码行为重复**：157 个代码对在规范化后完全相同，说明部分 lesson 的代码示例行为无本质差异。
4. **无占位符或 stuffing**：基线在数据完整性上是干净的。
5. **后续恢复方向**：保留 5-block 教学结构，但需要 (a) 从 blocks 正文中移除教材页码前缀，(b) 确保每节代码示例展示本节独有行为，(c) commonMistakes 和 handson 针对本节独有概念，(d) 按小批量逐章改写而不是全量机械化替换。

---

## 6. 未 push / 未 PR / 未 merge / 未上传声明

- 本恢复克隆的 `feature/r7-java-course-recovery` 分支仅存在于本地
- 未执行任何 `git push`、`git pull`、`git fetch`（除 clone 外）
- 未创建任何 PR 或 merge
- 原取证工作区 `study-tools-miniprogram-java-course-r7` 未被修改
