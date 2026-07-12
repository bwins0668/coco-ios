# PYTHON T0 + B1-PREP — 最终报告

最终状态：**PYTHON_T0_B1_PREP_COMPLETE_REVIEW_CAPABILITY_BLOCKED**

理由：T0 两个 stale checker 已修复并各带负变异自测（全绿）；B1-PREP 源证据/发布链/写集准备完成。但独立 fresh reviewer 能力在本环境不可用（见 §5），依规则最终状态取保守值，且**下一轮 learner-visible 内容正式写入不得在此状态下开始**。

## 基线与隔离
- worktree `study-tools-miniprogram-python-t0-b1-prep`，branch `feature/python-t0-gates-b1-prep`，start HEAD `1c7ec3b`，无 remote，未 push。
- `git branch --contains 1c7ec3b` = `feature/python-pa0-pe-source-evidence`（同一 canonical 线性历史）。

## 1. `pythonVisibleLessonIds` 5→9 是投影一致性修复，不是功能解锁
上轮 P-A0 的改动使 registry 投影与权威 `releaseVisibility`(9) 一致。**Track D 已核实**：`pythonVisibleLessonIds` 全产品代码零消费者，learner 可见性由 `releaseVisibility → python-public-course-summary → home.js` 驱动、本就是 9。故 4 节此前已可达；P-A0 消除的是"两处投影漂移"这一 contract 缺陷。

## 2. learner 可见性真实链路
`releaseVisibility.visibleCourseLessonIds`(权威 9) → `utils/python-public-course-summary.js`(visibleLessonIds 9) → `pages/home/home.js`(卡片 sectionCount)。lesson 列表/路由走 `<pkg>-manifest.js → <pkg>-loader.js`。registry 仅被 checker 消费。

## 3. 两个 stale checker 的根因、修复与负变异覆盖
### 3.1 `check_python_home_card_runtime_contract`
- 根因：第 42 行硬编码 `pythonVisibleLessonIds.length !== 5`，与第 50–58 行"registry === releaseVisibility(9)"自相矛盾 → 任何长度必红（P0 起即红）。
- 修复：删除硬编码常数，期望数量**从权威 releaseVisibility 动态派生**；并补齐**顺序漂移(3b)、重复 ID(3c)、home/public summary 一致性(3d)** 检查。
- 负变异自测 `check_python_home_card_runtime_contract_selftest.js`（受控 fixture，不碰真实数据）：

| Case | 期望 | 实测 |
|---|---|---|
| A 合法 9 | PASS | PASS |
| B 删除已发布 lesson | FAIL | FAIL |
| C 注入未发布 artifact | FAIL | FAIL |
| D 重复 lessonId | FAIL | FAIL |
| **E 同步缩到 6（证明不依赖旧常数 5）** | PASS | PASS |
| F home summary 与 releaseVisibility 不一致 | FAIL | FAIL |

### 3.2 `check_python_domain1a_contract`
- 根因：第 51 行 `courseRegistryHash` 是 P-A0 前的旧快照，对已确认合法的 registry 投影修复必然报错。
- 修复：刷新为当前已审核 registry 状态的 sha256（`D5FDC511…`），**保留 hash 防篡改守卫**（未删除、未改永真、未放宽）。
- 负变异自测 `check_python_domain1a_registry_guard_selftest.js`：合法当前=MATCH；恢复旧 5-ID 投影 / 额外篡改 / 注入未发布 / 改 Java 条目 = 均 DIFFER（仍被捕捉）。

### 3.3 修复后全套
19/19 python 契约 checker PASS（此前 17/19）。

## 4. 是否保留防篡改能力
是。home card checker 现能捕捉：缺失/多余/重复/顺序漂移/summary 不一致；domain1a hash guard 现能捕捉：旧 5-ID 回退、任意 registry 篡改、注入未发布、改动其他 course。均有自测证明。**未通过关规则/降阈值/加白名单变绿。**

## 5. reviewer capability 是否可用
**否 → REVIEW_CAPABILITY_BLOCKED**。3 次 spawn（code-reviewer 默认 / general-purpose+sonnet / haiku 探针）均因底层 `deepseek-v4-pro` 不可用失败，`model` override 无效。详见 `PYTHON_REVIEWER_CAPABILITY_PREFLIGHT.md`。

## 6. 哪些结果仅作者验证、不能称 independent-reviewed
- T0 两个 checker 修复 + 两个负变异自测：由主控制 Agent（writer）完成，机器可复现，但**未经独立 reviewer 签署**。
- B1-PREP 全部产物：同样仅作者验证。
不得据此开始 learner-visible 内容正式写入。

## 7. Book1 ch10-20 真实 lessonId / 源证据 / 结构 / 写集
11 个候选（从 P-E manifest 精确定位，非猜测）：python-0016(ch10 文件和异常)、0017(ch11 测试)、0020(ch12 武装飞船)、0021(ch13 外星人来了)、0022(ch14 记分)、0024(ch15 生成数据)、0025(ch16 下载数据)、0026(ch17 使用API)、0028(ch18 从Django入手)、0029(ch19 用户账户)、0030(ch20 部署)。

- **源证据**：每章按 `<h1 id=nav_point_N>` 边界只读切片，得章级 textHash + 20–64 个真实代码块 hash（共 424 块）。证据在 `PYTHON_B1_SOURCE_EVIDENCE_PACK.json`（HIGH，章级精确）。
- **结构**：11 节 schema 全部合法（blocks/codeExamples+expectedOutput+lineNotes/objectives/terms/handson）。
- **内容真实性（决定性）**：**11 节全部为占位骨架**（title="Python Lesson"、code=`print('Python: Python Lesson')`）；全 corpus 690 个未发布 artifact **无一例外**均为此类占位。→ 下一轮是**从源全新撰写**，非草稿审计。
- **runtime 可行性**：仅 ch10-11 是 stdin/stdout 可运行候选；ch12-20（pygame/matplotlib/django）**不可在小程序 runtime 运行**，撰写前须先做 lesson 类型架构决策。
- **写集**：共享文件（releaseVisibility / public-summary / registry / manifest / app.json）必须单写者最终集成；per-lesson body 可组内并行。详见 `PYTHON_B1_EXECUTION_MANIFEST.json` 与 `PYTHON_B1_WRITESET_COLLISION_GRAPH.json`。

## 8. 下一轮准确可执行范围
1. **先解阻塞**：为 ch12-20 决策 runtime lesson 类型（非执行走查型 vs 推迟）。
2. **可立即启动的最小批**：ch10、ch11 两节——runnable、源证据 HIGH、结构就绪；**从源全新撰写**内容（非占位）。
3. 撰写后同步 5 个共享发布文件（单写者），并触发一次 domain1a hash 刷新。
4. 前置：先解除 reviewer 能力阻塞（否则不得开始正式写入）。
5. **修正历史工作量估算**：真实剩余 ≈ 690 节全新撰写（有骨架+源证据辅助），远大于"发布已有草稿"。

## 9. diff 白名单与零内容改动
本轮改动仅：`tools/check_python_home_card_runtime_contract.js`、`tools/check_python_domain1a_contract.js`、`tools/check_python_home_card_runtime_contract_selftest.js`(新)、`tools/check_python_domain1a_registry_guard_selftest.js`(新)、`docs/python-b1-prep/**`。零命中：learner-visible lesson、artifacts 内容、EPUB、Java/ITP/SG、pages/styles/routes/loader/storage/quiz/scoring、project config、`utils/course-registry.js`。全文切片缓存在 scratchpad/库外，不进 Git。

## 10. 工作区干净、无 remote、未 push
见提交后 `git status --short` 干净、`git remote -v` 空、`git diff --check` 干净、`git diff --name-only 1c7ec3b...HEAD` 仅白名单文件。
