# R7 GS2 手动审计报告

> lessonId: `intro-ch02-lesson-004`
> 主题: `変数とデータ型` / `变量与数据类型`
> sourceRef: `java_intro_tsukuba`, 第2章 Java言語の基本, section=`変数`, pageStart=21

---

## 真实课程序列

| 项目 | 内容 |
|---|---|
| 当前 lesson | `intro-ch02-lesson-004` |
| 原始教材节名 | `変数` |
| 下一 lesson | `intro-ch02-lesson-005` / `変数の使用` |
| renderer 字段 | title, objectives, prerequisites, blocks, terms, codeExamples, lineNotes, commonMistakes, summary, nextLessonBridge, handson |

## 教学质量审计

| 项目 | 审计结论 |
|---|---|
| 为什么需要变量 | 日中都解释了程序需要记住信息、重复使用值，并把变量放入输入、处理、输出流程。 |
| 心智模型 | 中文使用“给数据贴标签的小盒子”，日文使用“ラベルを貼った引き出し”。 |
| 数据类型 | 明确区分 `int`、`double`、`String`，并说明类型决定可保存的数据种类。 |
| 声明/赋值/读取/输出 | blocks、lineNotes、summary 中均按顺序解释。 |
| Java 示例 | Java 21 可编译运行，真实使用 `int`、`double`、`String`、变量声明、赋值、计算和输出。 |
| commonMistakes | 覆盖未初始化就读取、String 忘记双引号、int 接收小数值三类具体错误。 |
| handson | 要求修改姓名、学习时间、分数、金额至少两项，观察输出变化，并故意触发 int 小数类型错误后修正。 |
| learner-visible 噪音 | 正文字段和代码输出不含教材页码、lessonId、sourceRef、profile、lesson=。 |
| Quiz/SRS 隔离 | 普通 Java 变量示例允许 `int score = 90;`，没有 options/correctAnswer/questionBank/SRS/wrongQuestion。 |

## Java 21 编译与输出

```text
name=Coco
hours=2.5
points=90
amount=1200
total=3000.0
```

## Checker 结果

- GS1 contract: PASS，未修改 GS1 lesson 或 GS1 checker。
- GS2 contract: PASS，零 warning。
- GS2 selftest TEMP A-I: PASS，全部真实执行。
- Java examples compile: 336 examples PASS。

