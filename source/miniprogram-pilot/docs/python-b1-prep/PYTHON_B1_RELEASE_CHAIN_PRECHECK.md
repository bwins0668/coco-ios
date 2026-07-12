# PYTHON B1-PREP — Book1 ch10-20 发布链预检（只读）

## 已发布 lesson 的真实发布链（事实源）

```
真实 learner 可见性链路（P-A0/Track D 已核实）：
packages/python-course/data/python-source-manifest.js  (releaseVisibility.visibleCourseLessonIds = 权威 9)
  → utils/python-public-course-summary.js (visibleLessonIds，home card 实际消费者)
  → pages/home/home.js (卡片 sectionCount)
lesson 列表与路由：
packages/<pkg>/data/<pkg>-manifest.js (sections) → utils/<pkg>-loader.js → chapter/lesson 页
registry：utils/course-registry.js (pythonVisibleLessonIds) —— 仅被 checker 消费，无产品消费者，但契约要求与 releaseVisibility 一致。
```

新增一节可见 lesson 需同步的**共享文件**（任何新增都要动）：
1. `python-source-manifest.js` → `releaseVisibility.visibleCourseLessonIds` 追加 ID
2. `python-public-course-summary.js` → `visibleLessonIds` 追加 + 刷新 `pathLabel`
3. `course-registry.js` → `pythonVisibleLessonIds` 追加（并触发 domain1a hash 刷新轮）
4. 目标包 `<pkg>-manifest.js` → sections 追加
5. `app.json` → 仅当新增 subpackage 时

## 首批 11 节的发布可行性分类

| 分组 | 章 | runtime 可行性 | 结论 |
|---|---|---|---|
| **B1-basics-runnable** | ch10 文件和异常、ch11 测试代码 | stdin/stdout 可运行候选 | 可进入撰写（内容需全新撰写，见下） |
| **B1-project-nonrunnable（BLOCKED）** | ch12-20（武装飞船/外星人/记分/生成数据/下载数据/API/Django/账户/部署） | **不可运行**（pygame / matplotlib / plotly / requests / django，均非小程序 Python runtime 能执行） | 撰写前须先做架构决策 |

**关键约束**：现有运行时 lesson 模型是"小段可运行 Python + expectedOutput 断言"（domain1a/safe-stdin checker 实跑代码验证）。ch12-20 是 pygame 游戏 / 数据可视化 / Django Web，**无法在该模型下运行**。发布前必须先决定：
- 方案 A：为项目章引入**非执行型"讲解/走查"lesson 类型**（无 expectedOutput 断言），并相应放宽只跑得动的 runtime 契约（需新 checker 契约，勿削弱现有可运行契约）；
- 方案 B：**推迟** ch12-20，先只发布 ch10-11 与后续可运行的 book1/book2 基础章。

## 内容真实性（决定性，Track D 实测）

**11 节 artifact 全部为占位骨架**（`contentReality=PLACEHOLDER_SCAFFOLD`）：title="Python Lesson"、objectives="理解 Python Lesson 的基本概念"、code=`print('Python: Python Lesson')`。schema 合法但**零真实内容**。
→ 下一轮不是"审计已有草稿"，而是**以章级源证据（每章 15K–27K 字符 + 20–64 个真实代码块）全新撰写**。这与前几轮"690 backlog 待发布"的印象根本不同：backlog 是 690 个空模板，不是可发布草稿。

## 进度/导航兼容性

- 可见集合为 **append-only**，不改已发布 9 节 → 对现有进度/导航/下一课桥接无回归风险。
- 新 lesson 只新增自己的进度 key，无迁移需求。
