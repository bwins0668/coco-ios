# PYTHON D0 + B1（条件式）— 最终报告

最终状态：**PYTHON_D0_B1_PARTIALLY_COMPLETE**

- D0-R：**已解除**（REVIEW_CAPABILITY_AVAILABLE，实证）。
- D0-A：**已完成**（ch12-20 lesson 类型分类 + 推荐方案 B）。
- B1：**未执行**——顶层门禁虽满足，但发布撞上"loader 禁令 ∩ 内容主题完整性"结构性两难 + 广泛硬编码冻结契约面；本轮未写入任何 learner-visible 内容。因 reviewer 已可用，不能用 `..._REVIEW_CAPABILITY_BLOCKED`；B1 未发布，故取 `PARTIALLY_COMPLETE`。

## 基线与隔离
worktree `study-tools-miniprogram-python-d0-b1-conditional`，branch `feature/python-d0-review-architecture-b1`，start HEAD `6696b15`，无 remote，未 push，`git branch --contains 6696b15` 含本分支与 `feature/python-t0-gates-b1-prep`（同一线性历史）。

## 1. reviewer capability 是否恢复
**是 → REVIEW_CAPABILITY_AVAILABLE**。根因不是"不能 spawn"，而是**指定 `model` 覆盖或用 `code-reviewer` 类型会路由到不可用的 `deepseek-v4-pro`**。用默认 agent、不覆盖模型即可（实际模型 `claude-opus-4-8`）。

## 2. 独立性与 synthetic fixture 验证
独立 reviewer（writer≠reviewer）对合成 fixture（一处 releaseVisibility/projection 不一致 + 一处正常字段）独立给出：检出缺失 `lesson-C`、未误报 normalField、verdict=REJECTED。证据见 `PYTHON_REVIEWER_CAPABILITY_PROOF.json`。

## 3. 若仍 blocked 的层级
不再 blocked。历史阻塞发生在**平台 agent 模型路由层**（override/code-reviewer → deepseek-v4-pro 不可达），绕过方式：默认 spawn。

## 4. ch12-20 逐章 lesson 类型分类
见 `PYTHON_PROJECT_CHAPTER_CLASSIFICATION.json` / `PYTHON_PROJECT_CHAPTER_ARCHITECTURE_DECISION.md`：
- RUNTIME_RUNNABLE：ch10、ch11。
- RUNTIME_LIMITED：ch15、ch16、ch17（语言核心可演示，完整项目需外部库）。
- EXTERNAL_ENVIRONMENT_PROJECT：ch12/13/14（pygame）、ch18/19/20（django）。

## 5. 是否需要新 lessonKind/runtimeMode
**是**（推荐方案 B）。项目章须以真实形态呈现、明确"外部环境必需"、**不伪造 expectedOutput**；需新增 `lessonKind`(runnable|project) + `requiredEnvironment[]`，并在渲染层识别 project 类隐藏运行/断言入口。属独立架构轮，本轮不实现。

## 6. ch10、ch11 是否具备运行时发布资格
**内容/运行资格：是**（stdlib、stdin/stdout 可运行、HIGH 源证据、结构就绪、与已发布 9 节不重复主题）。
**发布资格：受阻**——见 §7。

## 7. 为何未执行 B1（无内容写入）
两类不可越约束（详 `PYTHON_B1_PUBLISH_BLOCKER.md`）：
1. **loader 禁令 ∩ 主题完整性**：干净新章必须改 `loader/`（全局禁止）；避开 loader 把 ch10/11 塞入"输入→类"章则违反内容主题完整性 / 改动已发布章元数据。二者各违一条不可越款，无合规第三路径。
2. **广泛硬编码冻结契约**：`published_lesson_truth`(9-id 硬列表)、`shard_train1`(id+逐节内容哈希)、`home_release`(冻结哈希)、`domain1a`(registry hash) 等约 8-10 个 checker 需作为受控发布整体刷新。

因此本轮**零 learner-visible 内容改动、零 runtime/共享发布文件改动**。

## 8. 未执行 B1 的明确声明
本轮**没有写入任何 learner-visible lesson 内容**，没有改动 releaseVisibility / public-summary / registry / manifest / loader / 任何 runtime 包，没有发布任何 artifact。

## 9. 690 backlog 真实状态
仍为**待从源全新撰写的占位骨架**，非待发布库存（沿用上轮 Track D 结论）。

## 10. diff 白名单 / 无 remote / 未 push / 工作区干净
本轮改动仅 `docs/python-d0/**`（4 份报告/证据）。零命中：learner 内容、artifacts、EPUB、Java/ITP/SG、pages/styles/routes/loader/storage/quiz/scoring、project config、registry、checker。见提交后 `git diff --name-only 6696b15...HEAD`、`git status --short`、`git remote -v`。

## 下一轮可执行范围（供用户决定）
1. 用户在下述发布接线中**显式窄授权其一**：(a) 仅增 chapter case 的 per-package loader 改动；(b) 新建 subpackage(app.json)；(c) 接受 foundations-b 重定主题为"基础续篇(ch7-11)"并授权改该章元数据。
2. 一并授权刷新 §7 所列冻结契约 checker（作为发布的一部分）。
3. 之后 ch10/ch11 可在一轮内：从源撰写 → 作者验证 → 独立 fresh review（现已可用）→ 受控发布。
4. ch12-20 须先落地方案 B 的 project-lesson 架构轮。
