# PYTHON B1 — ch10/ch11 发布阻塞分析（为何本轮未写入）

B1 顶层门禁**已满足**：REVIEW_CAPABILITY_AVAILABLE ✓、D0-A 推荐已成型 ✓、ch10/ch11 = RUNTIME_RUNNABLE ✓、source evidence HIGH ✓、写集图已锁 ✓。

但**执行发布**撞上两类本轮不可越过的约束，故未写入任何 learner-visible 内容。

## 阻塞 1：loader 禁令 ∩ 内容主题完整性（结构性两难）

发布一节 runtime lesson 有且只有两条接线路径：

- **路径甲：新建 chapter（干净、主题诚实）** → 必须在 per-package course loader 的 `switch` 增加 `case`（如 `python-foundations-b-loader.js` 或新包 loader）。但全局禁止列表明列 **`loader/`（任何情况下不得修改）**。→ 违规。
- **路径乙：把 ch10/ch11 追加进已路由的 `python-foundations-b-ch01`（避开 loader）** → 该章标题是"从输入走向函数与 class"（ch7-9）。塞入"文件异常/测试"后，章标题/描述必须撒谎或被迫改写已发布章的元数据；这违反内容合同"标题/objectives/正文须围绕同一教学目标"，也等于改动已发布章。→ 违规。

两条路径各自命中一个不可越条款，**无第三条既合规又诚实的发布路径**。

## 阻塞 2：广泛的硬编码冻结契约面

即便解决阻塞 1，发布 2 节还需同步刷新一批**硬编码**冻结 checker（非动态派生）：

| checker | 冻结内容 | 发布需做 |
|---|---|---|
| `check_python_published_lesson_truth_contract` | EXPECTED = 恰好 9 个 lesson id 列表 | 追加 2 id |
| `check_python_shard_train1_contract` | lesson id + 逐节内容哈希 | 追加 2 节 + 重算内容哈希 |
| `check_python_home_release_contract` | gs/source/coverage 哈希 + 路由 | 视新增 source unit 情况刷新 |
| `check_python_domain1a_contract` | courseRegistryHash | 刷新（registry 变） |
| `check_python_package_scale_contract` | foundations-b 体积阈值 | 复核 < 1MB |
| 聚合/分片 manifest 相关 | totalSections=9 / totalChapters | 9→11 等 |

这些刷新本身是合法契约更新（非"降阈值/加白名单/关规则"），但面广、含逐节内容哈希重算，属**一次受控发布操作**，须在独立 fresh review 下整体完成，不宜与内容撰写在同一仓促步骤里混做。

## 结论

- reviewer 能力已恢复（真实可用），这是本轮解除的关键阻塞。
- 但 B1 发布因**阻塞 1（loader ∩ 主题完整性结构性两难）**在当前授权边界内**无合规路径**；阻塞 2 进一步要求一次成规模的受控发布。
- 故本轮**不写入 ch10/ch11 内容、不改任何 runtime/共享发布文件**，状态取 `PYTHON_D0_B1_PARTIALLY_COMPLETE`。

## 下一轮解锁 B1 所需的**明确窄授权**（供用户决定）

需用户在下一轮显式授权以下之一（否则无法诚实发布）：
1. **窄授权改 per-package course loader**（仅新增 chapter 的 `case`，不重构 loader），配合新建 `python-foundations-b-ch02`（"文件与测试"章）；或
2. **授权新建 subpackage**（改 `app.json` subPackages）承载 ch10/ch11；或
3. 明确接受把 foundations-b 重定主题为"基础续篇（ch7-11）"并授权改该章元数据。

并同时授权刷新上表所列冻结契约 checker（作为发布的一部分）。选定后，ch10/ch11 可在一轮内：从源撰写 → 作者验证 → 独立 fresh review（现已可用）→ 受控发布。
