# PYTHON P0 — 工具与门禁基线

在 canonical 基线 `801e251` 的审计 worktree 内，运行全部 python 非-selftest 契约检查器（node v24.16）。**本轮不修改任何 checker**。

## 结果：19 运行 / 18 PASS / 1 FAIL

| Checker | 结果 | 覆盖域 |
|---|---|---|
| check_python_source_manifest | PASS | source manifest 结构/EPUB 绑定 |
| check_python_lesson_normalizer | PASS(exit0) | lesson 字段规范化 |
| check_python_published_lesson_truth_contract | PASS | 已发布 lesson 真实性 |
| check_python_course_runtime_contract | PASS | course runtime |
| check_python_gs1_gs2_contract | PASS | GS1/GS2 |
| check_python_domain1a_contract | PASS（**实际执行代码**，stdout 校验 if语句） | Domain1A + 运行时输出 |
| check_python_domain1b_contract | PASS | Domain1B 字典 |
| check_python_safe_stdin_contract | PASS | input/while 安全 stdin |
| check_python_full_course_ledger_contract | PASS | 全课程 ledger |
| check_python_package_scale_contract | PASS | 分片规模 |
| check_python_home_release_contract | PASS | home 发布 |
| check_python_home_card_structure_contract | PASS | home card 结构 |
| **check_python_home_card_runtime_contract** | **FAIL (exit 1)** | home card ↔ registry projection |
| check_python_home_runtime_f2_contract | PASS | home runtime F2 |
| check_python_shard_train1_contract | PASS | 分片 train1 |
| check_python_shard_wxss_import_contract | PASS | 分片 wxss import |
| check_python_shard_style_isolation_contract | PASS | 分片样式隔离 |
| check_python_khaki_visual_contract | PASS | khaki 视觉 |
| check_python_app_config_contract | PASS | app 配置 |

## 唯一 FAIL 的分类

**`check_python_home_card_runtime_contract` → 真实缺陷（`TOOL_FALSE_POSITIVE` 已排除）。**

- 报错：`manifest visible ID missing from registry projection: python-0015-…-第-9-章-类`。
- 最小复现：checker 读 `utils/course-registry.js` 的 `getCourseById('python').pythonVisibleLessonIds`，与 `python-course-manifest.js` 的 visible section 集比对。
- 事实核验：manifest 有 9 个 section（0007–0015）；registry 只有 5 个（0007–0011）。checker 报第一个缺失 id，实际缺 4 个（0012/0013/0014/0015）。
- 判定：checker **正确**地检出 projection 漂移；缺陷在**内容侧数据**（registry 未同步），不在 checker。→ 归 P-A0 修复批，**不进技术债队列**。

## 能力边界（对后续轮次重要）

- **支持运行时执行验证**：domain1a/safe-stdin 类 checker 会真正跑 Python 代码并断言 stdout ⇒ `OUTPUT_EXPECTATION` / `RUNTIME_CONCEPT` 可自动化门禁。
- 现有 checker 覆盖：syntax/runtime、source manifest、published truth、双语（published truth 内含）、分片/样式/home projection、ledger、package scale。
- **未发现独立 originality checker 运行入口**（authoring corpus 侧可能另有工具，未纳入本运行基线）——P-A 若涉新增内容需评估 originality 门禁。

## 技术债队列（本轮登记，不处理）
- 无 checker 误判需修。队列当前为空。
