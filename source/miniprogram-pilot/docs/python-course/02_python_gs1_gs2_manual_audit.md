# Python GS1 / GS2 manual audit

The two golden samples are original bilingual lessons derived from the first two real `lesson_candidate` source units. They do not copy textbook body text or textbook code.

| Golden | sourceUnitId | 原始 TOC 路径 | 教材概念 | 初学者难点 | 日语策略 | 中文策略 | 原创代码行为 | mistakes | handson 预期观察 | 下一节衔接 | 噪音检查 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GS1 | py-src-0007-7a787e55-第-1-章-起步 | Python编程：从入门到实践（第2版） > 第 1 章 起步 | 起步、运行、可见输出 | 不知道代码是否真的执行；容易忽略从上到下顺序 | 用 `script`、`interpreter`、`statement` 建立执行流 | 用“屏幕可见反馈”解释 print 的价值 | 4 行 print 依次输出运行过程 | 括号、引号、输出顺序 | 只改第 2 行文字时，只有第 2 行输出变化 | 转向给 value 起名字 | 无 sourceRef、无页码、无教材正文、无原书代码 |
| GS2 | py-src-0008-f41e62b5-第-2-章-变量和简单数据类型 | Python编程：从入门到实践（第2版） > 第 2 章 变量和简单数据类型 | value、variable、string、expression | 容易把名字和值混为一谈；容易误解 string 和 number | 用“ラベル付きの箱”讲名字和值 | 用“贴标签的盒子”独立解释 variable | 给 string 和 number 命名，再组合 message 并输出 | 引号包变量名、未赋值先使用、混合类型相加 | 只改 `language` 的 value 时，message 首词变化而计数不变 | 后续扩展 string 与 number 表达式 | 不暴露 source metadata；与 GS1 代码行为不同 |

## Originality checks

| check | result |
|---|---|
| 教材正文复制 | none |
| 教材代码复制 | none |
| sourceRef / page / internal anchor exposed | none |
| 与 Java GS1-GS8 示例结构重复 | no; Python code uses print-only execution then variable/value composition |
| GS1 / GS2 模板化 | no; why、mental model、handson、code signature all differ |
| Python code | Python 3.11 compatible, deterministic stdout, no input, no file IO, no network |
| learner-visible banned wording | blocked by `tools/check_python_gs1_gs2_contract.js` |

## Golden selection table

| Golden ID | sourceUnitId | courseLessonId | 原始短标题 | Python 日文标题 | Python 中文标题 | 下一 source unit | 选择理由 |
|---|---|---|---|---|---|---|---|
| GS1 | py-src-0007-7a787e55-第-1-章-起步 | python-0007-gs1-run-visible-output | 第 1 章 起步 | Pythonスクリプトを動かして、見える結果を出す | 运行 Python 脚本，得到看得见的结果 | py-src-0008-f41e62b5-第-2-章-变量和简单数据类型 | 最早的可教目录单元，适合建立“运行后看到输出”的第一体验 |
| GS2 | py-src-0008-f41e62b5-第-2-章-变量和简单数据类型 | python-0008-gs2-values-and-variables | 第 2 章 变量和简单数据类型 | 値を名前に入れて、あとから使う | 把值放进名字里，再拿出来使用 | py-src-0009-7d37969c-第-3-章-列表简介 | 紧接 GS1，主题自然转入 variable、string、expression |
