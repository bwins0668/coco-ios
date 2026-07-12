# PYTHON D0-A — Book1 第12–20章项目型 lesson 架构决策（只读，不实现）

依据：EPUB 全文证据（每章按 `<h1>` 边界切片 + 代码块库依赖检测）+ 现有小程序 stdin/stdout runtime 契约（safe_stdin / domain1a 实跑代码验证）。

## 逐章分类（客观库依赖 → 分类）

| 章 | 标题 | 依赖检测 | 分类 | 现在能验证 | 现在不能验证 |
|---|---|---|---|---|---|
| 10 | 文件和异常 | stdlib（open/try/except） | **RUNTIME_RUNNABLE** | 文件读写、异常处理、stdout | — |
| 11 | 测试代码 | stdlib（unittest） | **RUNTIME_RUNNABLE** | 断言、测试通过/失败、stdout | — |
| 12 | 武装飞船 | **pygame** | EXTERNAL_ENVIRONMENT_PROJECT | 无（纯 GUI 事件循环） | 窗口/渲染/事件 |
| 13 | 外星人来了 | **pygame** | EXTERNAL_ENVIRONMENT_PROJECT | 无 | 精灵/碰撞/帧循环 |
| 14 | 记分 | **pygame** | EXTERNAL_ENVIRONMENT_PROJECT | 计分数据结构（片段） | GUI 记分板 |
| 15 | 生成数据 | **matplotlib/plotly** | **RUNTIME_LIMITED** | 随机游走/掷骰数据生成逻辑 | 绘图渲染 |
| 16 | 下载数据 | csv/json + **matplotlib** | **RUNTIME_LIMITED** | CSV/JSON 解析（stdlib） | 图表渲染 |
| 17 | 使用API | **requests** + json | **RUNTIME_LIMITED** | JSON 处理逻辑 | 真实网络请求 |
| 18 | 从Django入手 | **django** | EXTERNAL_ENVIRONMENT_PROJECT | 无 | Web 框架/服务器/浏览器 |
| 19 | 用户账户 | **django** | EXTERNAL_ENVIRONMENT_PROJECT | 无 | 认证/表单/会话 |
| 20 | 部署 | **django**/平台 | EXTERNAL_ENVIRONMENT_PROJECT | 无 | 部署/托管 |

小结：RUNTIME_RUNNABLE=2（ch10,11）；RUNTIME_LIMITED=3（ch15,16,17）；EXTERNAL_ENVIRONMENT_PROJECT=6（ch12,13,14,18,19,20）。

## 三方案比较

| 维度 | A 全部强制 runnable | B 混合（runnable + environment-bound project lesson） | C 项目章仅阅读材料 |
|---|---|---|---|
| 教材保真 | 低（须把项目肢解/伪造成小片段） | **高**（项目按其真实形态呈现） | 中（丢失可操作性） |
| 学习价值 | 低（误导） | **高** | 中 |
| **运行时诚实性** | **破坏**（伪造 expectedOutput，等于 P0 严禁的占位/伪造） | **高**（明确标注"需外部环境"，不假装可运行） | 高 |
| UI/loader/scoring/progress 影响 | 大（要塞进不实内容） | 中（需新 lessonKind/runtimeMode + 一种"外部环境提示"渲染） | 小 |
| 对已发布 9 lesson 兼容 | 差 | **好**（append-only，新增 lessonKind 向后兼容） | 好 |
| 实现成本 | 中（但制造技术债与错误引导） | 中-高（需架构轮） | 低 |
| 错误引导风险 | **高** | 低 | 低 |
| 需额外产品授权 | — | 是（新字段 + 渲染 + 可能新 subpackage/loader） | 否 |

## 推荐：方案 B（混合）

单一 Python 课程内并存两类 lesson：
- **runnable lesson**（现有契约）：ch10,11 及后续可运行基础章，保留 code+expectedOutput+实跑验证。
- **environment-bound project lesson**（新 lessonKind）：ch12-20，按真实形态呈现教材代码与讲解，**不提供伪 expectedOutput**，附"外部环境必需（pygame/matplotlib/django…）"提示。

### 方案 B 需要的后续架构轮（本轮不实现）
- 新增 `lessonKind`（`runnable` | `project`）与可选 `runtimeMode`/`requiredEnvironment[]` 字段。
- 项目型 lesson 字段表达：`code`（真实教材代码，只读展示）、`explanation`、`commonMistakes`、`handson`（改为"在本地/外部环境尝试"引导，而非 runtime 断言）、**不设** `expectedOutput` 运行断言，改为 `externalEnvironmentNote`。
- runtime lesson 渲染需能识别 `lessonKind=project` 并隐藏"运行/断言"入口、显示外部环境提示。
- 进度/测验/导航保持兼容：project lesson 计入章节进度但不参与 stdin/stdout 断言门禁。
- 需要产品授权触及渲染层（pages/）与可能的新契约 checker——属独立架构轮，非本轮范围。

## 与 B1 的关系

方案 B 意味着 **ch10、ch11 属于 runnable 类、可在现有契约下发布**（无需等 project 架构）。ch12-20 必须等方案 B 的 project-lesson 架构落地后才谈发布。→ B1 首批应且只应是 ch10、ch11。
