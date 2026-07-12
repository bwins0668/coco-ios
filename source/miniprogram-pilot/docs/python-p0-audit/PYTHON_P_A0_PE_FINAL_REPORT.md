# PYTHON P-A0 + P-E — 最终报告

最终状态：**PYTHON_P_A0_PE_PARTIALLY_COMPLETE**

原因摘要：P-E 全部完成且证据/映射完整；P-A0 内容修复正确（registry 现精确镜像权威 `releaseVisibility`=9），但**两处 stale 冻结守卫 checker** 与**无法在本环境 spawn 独立评审 agent**这两点使 P-A0 无法按"全绿门禁 + 独立 reviewer ACCEPTED"被认证，故取保守状态。详见 §4、§15。

---

## 1. 基线与隔离证据
| 项 | 值 |
|---|---|
| Python canonical 侧 clone | `study-tools-miniprogram-python-full-corpus-auto-clean`（含 e143868） |
| control worktree | `study-tools-miniprogram-python-pa0-pe-control` |
| control branch | `feature/python-pa0-pe-source-evidence` |
| start HEAD | `e143868` |
| end HEAD | 见提交（两个：registry fix + evidence） |
| remote | 无（`git remote -v` 空）；全程无 push/merge/rebase |
| `git branch --contains e143868` | `feature/python-content-p0-audit`（P0 分支，同一线性历史） |

## 2. P-A0 前后 9 lesson 可见性对比
`pythonVisibleLessonIds`：**5 → 9**
- before: `[python-0007, 0008, 0009, 0010, 0011]`
- after: `[python-0007, 0008, 0009, 0010, 0011, 0012, 0013, 0014, 0015]`
- 与权威 `releaseVisibility.visibleCourseLessonIds`（9）集合完全相等。

## 3. 被"解锁"的 4 个 lessonId 与真实可访问性
新增：`python-0012-…字典`、`python-0013-…用户输入和while循环`、`python-0014-…函数`、`python-0015-…类`。

**重要修正（Track D 实测）**：这 4 节的真实 learner 可访问性**在 P-A0 之前就已成立**。产品可见性由 `releaseVisibility`（9）经 `packages/python-course/data/python-course-summary.js` → `utils/python-public-course-summary.js` → `pages/home/home.js` 驱动；`course-manifest`（9 sections）+ loader（无 5-cap，遍历全部 `mod.lessons`）负责列出与路由。全产品代码中 **`pythonVisibleLessonIds` 无任何消费者**（唯一引用是它自己的定义 `utils/course-registry.js:65`）。因此：
- P-A0 修复的是**两处投影之间的真实数据漂移**（registry 列表 vs 权威 releaseVisibility），这正是 `check_python_home_card_runtime_contract` 契约存在的意义；
- 但 P-A0 **不是**让 4 节"从不可见变可见"的功能开关——它们此前已由 releaseVisibility 路径服务。

## 4. P-A0 reviewer 结论与门禁
- **独立 agent 评审未能执行**：本环境两次 spawn 评审 agent 均因模型访问错误（`deepseek-v4-pro[1M]` 不可用，`model` 覆盖未生效）失败。任务要求"作者与 reviewer 必须不是同一 Agent"在此环境**不可满足**，已如实登记为门禁缺口。
- 主控制 agent 以最大严谨度做了等价的只读自验证（见 §2/§3/§9）。
- **门禁 checker 现状（registry=9）**：17 PASS / 2 FAIL。
  - `check_python_home_card_runtime_contract` FAIL — **自相矛盾的 stale checker**：第 42 行硬编码 `pythonVisibleLessonIds.length !== 5`，第 50-58 行要求 `registry === releaseVisibility`（=9）。任何长度都无法同时满足（=5 报缺 python-0015，=9 报 length must be 5）；该 checker 在 P0（registry=5）时即为红。分类：**TOOL_FALSE_POSITIVE_CANDIDATE / STALE_SELF_CONTRADICTORY**。
  - `check_python_domain1a_contract` FAIL — 第 405 行 `EXPECTED.courseRegistryHash` 冻结哈希守卫，对任何 registry 编辑（含本任务授权的这次）必然失败。分类：**TOOL_FALSE_POSITIVE_CANDIDATE / STALE_FREEZE_HASH**。
  - 二者均为 stale 守卫，非我改动引入的真实缺陷；且本轮 diff 白名单不含 `tools/check_*.js`、任务禁止改 checker 变绿 → 保留不动，登记为独立 checker-refresh 轮技术债。

## 5. EPUB inventory / 提取成功率 / 风险
- 1 个 EPUB（三剑客合订本），sha256 `860F1817…` 匹配；17,260,692 bytes。
- spine 66 全部提取（0 失败）；NCX navPoint 968（与 corpus `tocNodeCount:968` 一致）；代码块 1795。
- 风险：Book1 单文档 `text00001.html` 内锚点切分 → 证据为 doc-level（MEDIUM）；少量标题特殊引号/缺编号；图片内代码未 OCR。

## 6. 每本书全文 section / 结构数
| bookId | navPoint | 说明 |
|---|---|---|
| book1-crash-course | 37 | TOC 章级粗粒度 |
| book2-automate | 585 | 小节级细粒度 |
| book3-playground | 346 | 章/节级 |
代码块 1795 已建 `PYTHON_EPUB_CODEBLOCK_INDEX.json`（含 codeHash/lineCount/firstLine）。

## 7. 699 lesson 的 mappingStatus 分布
| status | 数 |
|---|---|
| FULLTEXT_LINKED | 674 |
| AMBIGUOUS | 21 |
| UNMAPPED | 4 |
置信度：MEDIUM 674 / LOW 21 / NONE 4。按书：book1=20（全 fulltext）、book2=446（425+21 ambiguous）、book3=229（全 fulltext）、unmapped 4。
4 个 UNMAPPED：python-0281 / 0282（"第 步"缺编号）、python-0409（16.2.2 SMTP"Hello"特殊引号）、python-0431（16.7 项目：只给我发短信 模块）。

## 8. 391 asset-spec 关联完整性
391 个 asset-spec 的 python-id **全部（391/391）**对应到 699 lesson 之一；无孤儿 asset-spec。

## 9. 可进入下一轮内容审计的 artifact
releaseEligibility 分布：**ALREADY_RELEASED 9 / ELIGIBLE_FOR_NEXT_AUDIT_BATCH 665 / BLOCKED_BY_SOURCE_EVIDENCE 25**。
> 强调：`FULLTEXT_LINKED` 仅表示"具备进入内容审计的最低教材证据"，**不等于可发布**。665 个 eligible 仍需逐条内容审计（含 book1 doc-level 证据的精度提升）后才谈发布。

## 10. 被 source evidence 阻断的 artifact
25 个 `BLOCKED_BY_SOURCE_EVIDENCE`（21 AMBIGUOUS + 4 UNMAPPED），须人工消歧或补精确锚点。0 个 `BLOCKED_BY_ARTIFACT_DEFECT`（所有 record contentStatus=written）。

## 11. Python 当前可发布 lesson 总数
运行时已发布 = **9**（python-0007…0015），全部 P0 KEEP_AS_ACCEPTED。本轮**未新增任何运行时发布**。

## 12. 未来全量内容工作量（去重后真实数字）
- 唯一 lesson 候选 = **699**（corpus 权威去重）；已发布 9；**written-but-unpublished = 690**。
- 其中具源证据可进审计 665，被阻断 25。
- 另有 391 asset-spec（项目多步伴随件，隶属上述 lesson，不重复计数）。
- 按书剩余：book1 未发布 11（ch10-20）、book2 446、book3 229。

## 13. 下一轮推荐首个内容批次
**Book1 第 10–20 章（11 个 book1 候选）**：紧接已发布的 ch1-9 从零主线，全部 FULLTEXT_LINKED，教学优先级最高、与现有运行时同包架构、无跨书歧义。先做它能让"从入门到实践"主线连续成篇，再横向铺 book2/book3。
（并列的独立技术债：checker-refresh 轮，修正 home_card_runtime 第 42 行 `==5`→由 releaseVisibility.length 推导、刷新 domain1a `courseRegistryHash`。）

## 14. diff scope 与冻结域零触碰证据
本轮改动文件仅：`utils/course-registry.js`、`tools/extract_python_epub_source_evidence.js`、`docs/python-source-evidence/**`、`docs/python-p0-audit/PYTHON_P_A0_PE_FINAL_REPORT.md`。
零命中：EPUB 原文件、任何 Python/artifacts lesson 内容、Java/ITP/SG、pages/ styles/ routes/ loader/ storage/ quiz/ scoring/ project config。全文缓存写在 worktree 之外 `_python_source_evidence_cache/`，不进 Git。

## 15. 最终工作区干净证据
两个提交后：`git diff --check` 干净；`git status --short` 干净；`git diff --name-only e143868...HEAD` 仅列上述白名单文件。

## 未完成项（导致 PARTIALLY_COMPLETE）
1. 两处 stale 守卫 checker 未转绿（本轮禁改 checker）→ 需独立 checker-refresh 轮。
2. 独立 agent 评审因环境模型访问失败无法执行 → P-A0 缺"reviewer≠writer"正式签署。
P-E 侧无未完成项。
