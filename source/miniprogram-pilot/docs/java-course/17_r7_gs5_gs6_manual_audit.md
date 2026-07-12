# R7 GS5-GS6 Manual Audit

## Scope

This audit covers only the two R7 golden-sample candidates:

- GS5: `intro-ch05-lesson-003`
- GS6: `intro-ch06-lesson-001`

It does not claim that all 336 Java lessons are complete, released, or accepted by a human reviewer.

## Audit Matrix

| Golden ID | lessonId | 教材概念 | 零基础难点 | 日语讲解策略 | 中文讲解策略 | 代码真实行为 | commonMistakes | handson 预期观察 | 下一节衔接 | 噪音检查 |
|---|---|---|---|---|---|---|---|---|---|---|
| GS5 | `intro-ch05-lesson-003` | クラスとインスタンス / 类与实例 | 容易把 class 当成具体对象，也容易以为变量保存对象本体 | 用「設計図と実物」区分 class 与 instance，并解释 `new`、参照、フィールド | 用“设计图与实物”建立心智模型，说明 class 不是某个具体学生卡，instance 才是运行时对象 | `StudentCard` 无显式 constructor，`main` 中两次 `new StudentCard()`，分别赋值 `Coco/Java` 与 `Mei/SQL`，输出 `same object? false` | 覆盖未 `new`、class/object 混淆、同一引用、null、写错对象字段 | 修改 `mei.course` 只改变 Mei 行；临时让 `mei = coco` 后观察同一引用导致变化联动，再恢复 | 指向真实下一节「簡単なクラスの宣⾔とインスタンスの⽣成」 | learner-visible 文本无教材页码、sourceRef、lessonId、chapterId、lesson=、profile= |
| GS6 | `intro-ch06-lesson-001` | コンストラクタ / 构造方法 | 容易把 constructor 当普通 method，误写 `void`，或不理解 new 时自动执行 | 说明 `new StudentCard("Coco", 45)` 的顺序、constructor 名称、无戻り値、参数到字段 | 用“创建卡片时填写申请表”解释初始数据、自动执行、没有返回类型不是遗漏 | `StudentCard(String name, int studyMinutes)` 初始化字段；`main` 用两组不同参数创建两个对象并输出不同初始状态 | 覆盖 `void`、大小写/命名、参数数量或类型不匹配、初始化遗漏、手动调用 constructor | 修改 constructor 参数观察初始状态差异；故意传错参数数量/类型观察错误并恢复 | 指向真实下一节「コンストラクタの例」 | learner-visible 文本无教材页码、sourceRef、lessonId、chapterId、lesson=、profile= |

## GS5 Quality Delta

修改前的问题：

- 正文仍含教材页码和内部 lesson 标识，人工阅读噪音高。
- 代码只有一个对象，且使用 constructor，无法作为“类与实例化”本节的聚焦样本。
- commonMistakes 与 handson 偏模板化，没有覆盖同一引用、null、字段写错对象等初学者真实风险。

修改后如何达到黄金标准：

- 日语用「設計図と実物」解释 class 与 instance，中文用“设计图与实物”说明 class 不是具体学生卡。
- 示例不把 constructor 作为主概念，而是用两次 `new StudentCard()`、字段赋值、`coco == mei` 证明两个实例不同。
- handson 要求修改其中一个实例，再观察另一个实例不应跟着变化，并用同一引用反例建立边界。
- 内容不复制教材原文，仅围绕真实 sourceRef 概念做零基础解释。
- 与 GS1-GS4 的差异在于：GS5 聚焦 object identity、reference、field state，不复用条件分支或 method call 的讲法。

## GS6 Quality Delta

修改前的问题：

- 构造方法课节仍像通用模板，只说“コンストラクタ”位置，没有讲清自动执行、无返回类型、参数初始化。
- 示例只创建一个对象，输出依赖标识行，无法证明 constructor 参数产生不同初始状态。
- handson 没有要求故意制造参数数量或类型错误，不能形成 fail-closed 学习闭环。

修改后如何达到黄金标准：

- 日语解释 `new` 与 constructor 自动执行顺序，中文明确说明 constructor 不是普通 method。
- 示例用 `StudentCard(String name, int studyMinutes)`，两次 `new` 传入不同参数并输出不同状态。
- commonMistakes 覆盖 `void`、命名大小写、参数不匹配、初始化遗漏、手动调用 constructor。
- 内容不复制教材原文，不引入 learner-visible metadata。
- 与 GS1-GS4 的差异在于：GS6 聚焦 object creation-time initialization，而不是输出骨架、变量、条件或 method 顺序。

## Verification Notes

- `tools/check_r7_java_gs5_gs6_contract.js` reads real lesson text and real Java code; it does not trust `semanticFidelity`, `profile`, or boolean metadata.
- `tools/check_r7_java_gs5_gs6_contract_selftest.js` mutates TEMP copies for A-O and requires the checker to fail closed for bad edits.
- No Quiz, SRS, wrong-question, route, page, renderer, or loader structure is introduced by this round.
