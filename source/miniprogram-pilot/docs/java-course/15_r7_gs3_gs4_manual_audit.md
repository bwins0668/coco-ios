# R7 GS3-GS4 手动审计报告

> GS3 lessonId: `intro-ch03-lesson-001`
> GS4 lessonId: `intro-ch04-lesson-001`
> 基线: GS1 / GS2 已冻结，本文只审计 GS3 与 GS4。

## 真实课程序列

| Golden ID | lessonId | chapterId | 实际日文标题 | 实际中文标题 | sourceRef | 下一 lesson |
|---|---|---|---|---|---|---|
| GS3 | `intro-ch03-lesson-001` | `java-ch03` | 条件分岐 | 条件分支与判断 | `java_intro_tsukuba`, 第3章 条件分岐と繰り返し, section=`条件分岐`, pageStart=44 | `intro-ch03-lesson-002` / 条件分岐の例 |
| GS4 | `intro-ch04-lesson-001` | `java-ch04` | メソッドとは | 方法是什么 | `java_intro_tsukuba`, 第4章 メソッド（クラスメソッド）, section=`メソッドとは`, pageStart=88 | `intro-ch04-lesson-002` / メソッドの例 |

## 黄金样本审计

| Golden ID | lessonId | 教材概念 | 零基础难点 | 日语讲解策略 | 中文讲解策略 | 代码真实行为 | commonMistakes | handson 预期观察 | 下一节衔接 | 噪音检查 |
|---|---|---|---|---|---|---|---|---|---|---|
| GS3 | `intro-ch03-lesson-001` | 条件分岐、if、else、条件式、比較演算子 | 不知道程序为什么会跳过某些行，也容易把 true/false 当成猜测结果 | 用「分かれ道」解释条件式を評価する，按入力 -> 条件評価 -> 実行された道 -> 出力追踪 | 用“岔路口 / 判断门”说明程序按条件走路径，不是猜答案 | Java 21 示例用 `morningTemp=12` 与 `noonTemp=22` 经过同一 `if/else`，真实输出 `morning=wear jacket` 与 `noon=no jacket` | 覆盖 `=`/`==` 混淆、`>`/`>=` 边界、波括号与 else 配对、只背输出不解释 true/false | 修改两个温度值后观察两条输出变化，再把比较运算符临时改成 `>=`，确认分支反转原因 | 指向真实下一节 `条件分岐の例`，继续比较新的分支示例 | learner-visible 正文与代码输出不含教材页码、lessonId、sourceRef、profile、lesson=、Quiz/SRS 结构 |
| GS4 | `intro-ch04-lesson-001` | メソッド、メソッド呼び出し、main、static | 容易以为声明方法就会自动执行，或不理解 main 如何进入方法再回到下一行 | 用「名前の付いた手順カード」解释 main 呼び出し -> method 実行 -> main に戻る | 用“有名字的可重复步骤卡”解释调用次数、执行顺序和回到 main 的流程 | Java 21 示例在 main 外声明 `static void printWakeUpStep()`，main 调用两次，输出两条 method 行 | 覆盖方法定义在 main 内、忘记括号、大小写不一致、去掉 static 后直接调用 | 修改方法输出、减少调用次数、新增 `printEveningStep` 并从 main 调用，观察输出次数和顺序变化 | 指向真实下一节 `メソッドの例`，继续用调用顺序阅读新的方法示例 | learner-visible 正文与代码输出不含教材页码、lessonId、sourceRef、profile、lesson=、Quiz/SRS 结构 |

## Java 21 输出

GS3:

```text
morning=wear jacket
noon=no jacket
```

GS4:

```text
main:start
method:prepare notebook
method:prepare notebook
main:end
```

## Checker 结果摘要

- GS1 contract: PASS，GS1 lesson 与 checker 未修改。
- GS2 contract: PASS，GS2 lesson 与 checker 未修改。
- GS3-GS4 contract: PASS，零 warning。
- GS3-GS4 selftest TEMP A-L: PASS，全部真实在 TEMP 副本执行。
