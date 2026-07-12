# PYTHON 全量修复路线图（P0 产出，不在本轮改内容）

基线 `801e251`。批次按风险与依赖拆分；停止条件明确。**内容重写不属于本轮**。

## 批次总览

| 批次 | 主题 | 唯一 lesson 数 | 需 FULL_REWRITE | 可机械修复 | 需 source 澄清 | 可并行 | 前置依赖 |
|---|---|---|---|---|---|---|---|
| **P-A0** | 修复 registry projection 断点（先解锁已完成内容） | 4（0012-0015 曝光）+1 registry 文件 | 否 | **是** | 否 | 否（单文件写） | 无 |
| **P-A** | P0 主题错位 / 映射断裂 / 全字段模板污染 | **0** | — | — | — | — | — |
| **P-B** | P1 source-objective-code-runtime 语义不一致 | **0** | — | — | — | — | — |
| **P-C** | P2 semanticKey / lineNotes / 双语 / 目录投影 / chapter manifest 漂移 | 9（block.type 归一） | 否 | 是 | 否 | 是 | P-A0 |
| **P-D** | P3 轻量文案 / 摘要 / 术语 | 低 | 否 | 是 | 否 | 是 | P-C |
| **P-E** | BLOCKED：EPUB 全文抽取 → 逐 lesson 源代码保真核验 | 9（复核）+ 全 corpus | 视结果 | 否 | **是** | 是（按章分片） | EPUB 全文抽取工具 |
| **P-F** | 已复验可保留章节 | 9（KEEP） | 否 | 否 | 否 | — | 无 |
| **P-G**（新增，最大工作量） | authoring backlog → runtime 发布流水线 | 687 lessons + ~360 specs | 逐条评估 | 半自动 | 部分 | 是（按 domain 分片） | P-A0 · P-E 工具 |

> 关键事实：**P-A / P-B 为空**——没有主题错位、映射断裂、模板污染或 source-code-runtime 语义不一致的已发布 lesson。已发布内容质量过关。真正的体量在 **P-G**（把已撰写但未发布的 687 lesson 安全导入 runtime）与 **P-E**（源保真核验工具缺口）。

## 各批次细节

### P-A0 · 解锁投影（第一批，最应先做）
- **为什么先做**：4 个已完成的高质量 lesson（字典/输入while/函数/类）因 `utils/course-registry.js` 投影未同步而**对 learner 不可见**；价值最高、风险最低、单文件、无依赖，且能让唯一 FAIL 的 checker 转 PASS。
- 写集：`utils/course-registry.js`（`pythonVisibleLessonIds` 补 0012-0015；刷新 `description` 与 `pythonPathLabelJa/Zh` 至"函数/类"态）。
- 文件写集冲突：无（单文件）。
- 验证门禁：`check_python_home_card_runtime_contract` 转 PASS + 全套 checker 保持 PASS。

### P-C · 一致性漂移（可并行，批 ≤ 9）
- block.type 枚举归一（`flow` ↔ `execution-flow` 统一）；semanticKey 已有效，仅规范枚举。
- 推荐 batch 大小：一次全 9（同类机械修改）。前置：P-A0。

### P-D · 轻量文案（可并行）
- 术语/摘要润色，低优先。前置：P-C。

### P-E · 源保真（BLOCKED，须先补工具）
- 当前 source manifest 为 toc-only，**无法**核验 lesson 代码是否忠实原书示例。
- 前置依赖：一个只读 EPUB 全文抽取工具（评估现有 `tools/audit_python_epub_source.py`），产出 `textEvidencePath/codeEvidence/extractionConfidence`，**不得回写 EPUB 源目录**。
- 可并行：按书/章分片。停止条件：每 lesson 具备 HIGH-confidence 源 evidence 或明确标记 BLOCKED_BY_SOURCE_AMBIGUITY。

### P-G · backlog 发布流水线（最大体量）
- 687 个 authoring lessons + ~360 asset-specs 已存在于 artifacts，未进 runtime。
- 这是"发布 + 校验"问题，不是"从零重写"问题：需逐条过 published-lesson-truth / runtime-execution / originality / projection 门禁后并入 runtime 分片。
- 可并行：按 domain（domain1a/1b/1c/functions/class/files… + book2/book3 主题）分片，每 Agent 独占写集。
- 前置：P-A0（投影机制打通）+ P-E（源核验工具，用于新发布内容的保真门禁）。

## 需特别回答（Section 8）

- **最初那 2–3 个疑似已完成章节，真实状态？** → 真实、高质量、非模板；实为 2 章 9 lesson，全部 GENUINELY_COMPLETE。
- **哪些可保留？** → 全部 9 个 lesson 内容 KEEP_AS_ACCEPTED。
- **哪些必须重开？** → 无。仅 4 个需 registry 投影修复（TARGETED_FIX，非重写）。
- **Python 全量实际工作量？** → 已发布 9 lesson；主线剩 book1 ch10-20；book2/book3 全未做；**687 lesson authoring backlog 未发布**（最大块）。
- **第一批最应先处理什么，为什么？** → **P-A0 投影解锁**：把 4 个已完成 lesson 送达 learner，单文件、零风险、消除唯一 FAIL。

## 停止条件
本路线图仅规划；任何内容/registry 改动均属后续批次。P0 到此为止。
