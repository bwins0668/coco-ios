# Python Domain1A source scope audit

R8.PYTHON-P1-D1A stage B publishes the first source-manifest driven Python Domain1A batch after the approved GS1 / GS2 entry. This is a small, continuous review candidate, not a full Python book release.

## Scope Selection Evidence

GS2 is mapped to `py-src-0008-f41e62b5-第-2-章-变量和简单数据类型`, sourceOrder `8`, with immediate parent `Python编程：从入门到实践（第2版）`. The next source candidates were reviewed in sourceOrder order.

| 顺序 | sourceUnitId | courseLessonId | tocPath | 原始标题 | parent | sourceOrder | type | 选择理由 |
|---:|---|---|---|---|---|---:|---|---|
| 1 | `py-src-0009-7d37969c-第-3-章-列表简介` | `python-0009-7d37969c-第-3-章-列表简介` | `Python编程：从入门到实践（第2版） > 第 3 章 列表简介` | 第 3 章 列表简介 | Python编程：从入门到实践（第2版） | 9 | chapter | GS2 后最早候选；从单个 value 过渡到 list 里的多个 value。 |
| 2 | `py-src-0010-921b265b-第-4-章-操作列表` | `python-0010-921b265b-第-4-章-操作列表` | `Python编程：从入门到实践（第2版） > 第 4 章 操作列表` | 第 4 章 操作列表 | Python编程：从入门到实践（第2版） | 10 | chapter | 与上一节连续；补上 append / assignment / pop 的状态变化。 |
| 3 | `py-src-0011-5c80c609-第-5-章-if语句` | `python-0011-5c80c609-第-5-章-if语句` | `Python编程：从入门到实践（第2版） > 第 5 章 if语句` | 第 5 章 if语句 | Python编程：从入门到实践（第2版） | 11 | chapter | 与前两节构成零基础链路：多个值 -> 改变状态 -> 根据状态选择路径。 |

## Adjacent Units Not Selected

| sourceUnitId | 与 Domain1A 的位置关系 | 当前状态 | 为什么未在本轮发布 |
|---|---|---|---|
| `py-src-0012-5cc0ecc6-第-6-章-字典` | 紧随 Domain1A 第 3 节之后，sourceOrder 12 | planned / internal | 字典会引入 key-value 结构，已经是下一组 data organization 主题；本轮不跨入 Domain1B。 |
| `py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环` | sourceOrder 13 | planned / internal | 涉及 input loop；本轮代码规则禁止 `input()`，且主题从数据结构转向交互流程。 |
| `py-src-0014-75c7d812-第-8-章-函数` | sourceOrder 14 | planned / internal | 函数是新的抽象单元，需要单独的 source scope 和运行契约。 |
| `py-src-0015-0f96233e-第-9-章-类` | sourceOrder 15 | planned / internal | 类属于对象建模，不适合塞入第一个零基础小批次。 |
| `py-src-0016-3a01ec9d-第-10-章-文件和异常` | sourceOrder 16 | planned / internal | 涉及文件与异常；本轮 Python 代码明确禁止文件读写。 |
| `py-src-0017-fbf9e623-第-11-章-测试代码` | sourceOrder 17 | planned / internal | 测试主题应建立在函数与项目结构之后，不能提前发布。 |
| `py-src-0020-809422bc-第-12-章-武装飞船` | sourceOrder 20 | planned / internal | 进入项目章节，已跳过中间 sourceOrders，不符合连续规则。 |
| `py-src-0021-659f0ecc-第-13-章-外星人来了` | sourceOrder 21 | planned / internal | 项目章节延续，非本轮基础语法小批次。 |
| `py-src-0022-76eb0652-第-14-章-记分` | sourceOrder 22 | planned / internal | 项目章节延续，必须等待后续独立 Domain scope。 |

## Teaching Audit

| courseLessonId | 零基础难点 | 日语讲解策略 | 中文策略 | 真实代码行为 | mistakes | handson 预期观察 | bridge 设计 | 噪音检查 |
|---|---|---|---|---|---|---|---|---|
| `python-0009-7d37969c-第-3-章-列表简介` | index 从 0 开始、`-1` 指末尾。 | 用「番号がついた棚」解释 list。 | 强调用一个名字管理一组 value。 | `days` 保存 3 个 string，输出长度、首项、末项。 | index 误读、漏方括号、漏逗号。 | 手动加入 `"Thu"` 后长度变 4，末尾变 Thu。 | 自然导向下一节：不只查看 list，还要修改 list。 | 未暴露 source metadata；无 `knowledgePoints`；无 quiz 字段。 |
| `python-0010-921b265b-第-4-章-操作列表` | list 原地变化，`append` / 赋值 / `pop` 的状态追踪。 | 用「動かせる行」解释项目追加、替换、取出。 | 强调状态变化和剩余顺序。 | `tasks` append 后增加、index 赋值后改写、`pop(0)` 后取出首项。 | `append` 返回值误解、`pop` 后仍认为原项存在、index 误位。 | 改成 `pop(2)` 后 done 为 review，remaining 保留 read / code。 | 导向 if：状态变化后需要选择不同路径。 | 未复制教材代码；无文件、网络、输入、随机或时间依赖。 |
| `python-0011-5c80c609-第-5-章-if语句` | `if` / `else` 分支、比较运算、indent 归属。 | 用「分かれ道の標識」解释 True/False 路径。 | 强调用 value 状态选择下一步。 | `score >= 60` 时输出 pass，否则 retry；最后固定输出 check complete。 | 漏 colon、indent 不齐、混淆 `=` 与比较。 | 改成 `score = 52` 后 result 变 retry，最后一行仍输出。 | 收束 Domain1A，并导向后续更复杂 data organization。 | 未暴露 EPUB、页码、href 或内部映射字段。 |

## Non-Template Proof

`python-0009-7d37969c-第-3-章-列表简介` introduces grouped values. Its code only reads from a list and reports length / first / last element. Its mistakes focus on index, bracket, and comma syntax. Its handson cannot be reused by later lessons because it asks the learner to manually add a fourth value before list mutation methods are introduced.

`python-0010-921b265b-第-4-章-操作列表` adds real mutation. Its code changes the same list with `append`, indexed assignment, and `pop`. The mistakes are about in-place behavior and removal state, not about list creation. Its handson changes the `pop` index, so the observation depends on mutation semantics.

`python-0011-5c80c609-第-5-章-if语句` adds branching. Its code does not reuse the list program; it compares a score and routes to pass / retry. The mistakes are colon, indentation, and comparison-specific. Its handson changes a numeric condition, and the bridge closes the list + if chain while pointing to the next data-organization batch.

Across all three lessons, the Japanese teaching layer is primary and Chinese is an auxiliary explanation layer. The code examples are original Python 3.11 snippets with deterministic stdout. No textbook body text, long source code, EPUB path, source metadata, page number, `knowledgePoints`, options, correct answers, quiz fields, SRS fields, or renderer-unconsumed fields are used.
