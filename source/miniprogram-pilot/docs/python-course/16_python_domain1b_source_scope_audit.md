# Python Domain1B Source Scope Audit

本文件记录 R8.PYTHON-FULL-P0-D1B 阶段 B 的 source scope。依据真实 sourceOrder、source manifest、release ledger 与当前公开 Domain1A 末尾，Domain1B 只发布一个连续 leaf lesson。

## Domain1B Scope

| 顺序 | sourceUnitId | courseLessonId | tocPath | 原始标题 | parent | sourceOrder | 为什么选入 |
|---:|---|---|---|---|---|---:|---|
| 1 | py-src-0012-5cc0ecc6-第-6-章-字典 | python-0012-5cc0ecc6-第-6-章-字典 | Python编程：从入门到实践（第2版） > 第 6 章 字典 | 第 6 章 字典 | Python编程：从入门到实践（第2版） | 12 | 紧接 Domain1A sourceOrder 11，是最早 next_candidate，且形成单一 dictionary/key/value 知识域。 |

## Domain1A 到 Domain1B

Domain1A 的最后一节是 `python-0011-5c80c609-第-5-章-if语句`，它让学习者用条件选择路径。Domain1B 接着进入 dictionary，把“状态与数据”从 list/if 的组合推进到 key/value 查询：学习者可以用 key 找 value、添加新 key、更新已有 value。

## 未选相邻节点

| sourceOrder | sourceUnitId | 原始标题 | 未选原因 |
|---:|---|---|---|
| 13 | py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环 | 第 7 章 用户输入和while循环 | 新主题，涉及 input/while；本轮不得跨入 Domain1C，也不得在示例中使用 input。 |
| 14 | py-src-0014-75c7d812-第-8-章-函数 | 第 8 章 函数 | 新抽象边界，不能为凑 1-5 节跨域。 |
| 15 | py-src-0015-0f96233e-第-9-章-类 | 第 9 章 类 | 新对象建模主题，非 Domain1B。 |
| 16 | py-src-0016-3a01ec9d-第-10-章-文件和异常 | 第 10 章 文件和异常 | 涉及文件概念，当前 checker 禁止 open/file I/O 示例。 |
| 17 | py-src-0017-fbf9e623-第-11-章-测试代码 | 第 11 章 测试代码 | 新测试主题，非当前连续知识域。 |

## 教学质量说明

- 零基础难点：dictionary 不是按位置拿值，而是用 key 的含义 lookup value；新增 key 与更新 key 的写法相似，容易混淆。
- 日语讲解策略：用 “ラベル付きの引き出し” 建立 mental model，保留 dictionary/key/value/lookup 英文技术术语。
- 中文辅助策略：用“贴标签的抽屉”解释 key/value 对应关系，强调不是 list 的位置编号。
- 真实代码行为：`profile` 从 3 个 key/value 开始，读取 `name` 与 `focus`，新增 `status`，把 `lessons` 从 6 更新到 7，并用 `sorted(profile.keys())` 得到稳定输出。
- mistakes：覆盖 missing key、key 引号、把 dictionary 当 list 位置编号三类概念专属误区。
- handson：添加 `level` key，并观察 keys 列表与 `level: start` 输出。
- bridge：只描述继续观察 data 的移动方式，不公开未验收 lesson ID、source metadata 或未来完整目录。

## 非模板化证明

Domain1B 的 why、mental model、handson、bridge 与代码行为都围绕 dictionary/key/value lookup；没有复制 GS1、GS2 或 Domain1A 的 why、mistakes、handson、bridge 或代码行为。示例没有使用教材正文、原书长代码、knowledgePoints、quiz/SRS 字段，也没有泄漏 sourceUnitId、courseLessonId、tocPath、页码、EPUB href、anchor 或内部路径给 learner-visible 数据。
