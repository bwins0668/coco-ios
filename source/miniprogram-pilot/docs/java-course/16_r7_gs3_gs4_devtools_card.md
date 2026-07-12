# R7 GS3-GS4 DevTools 人工验收卡

## 入口

| Golden ID | 分包 | 章节 | lessonId | 期望标题 |
|---|---|---|---|---|
| GS3 | `packages/java-course-a` | `java-ch03` | `intro-ch03-lesson-001` | 条件分岐 / 条件分支与判断 |
| GS4 | `packages/java-course-a` | `java-ch04` | `intro-ch04-lesson-001` | メソッドとは / 方法是什么 |

## 390px

- Java 首页：确认章节入口可进入 Chapter 3 与 Chapter 4。
- Chapter 3 -> GS3：标题、目标、正文、术语、代码、常见错误、handson、下一节都可见。
- Chapter 4 -> GS4：标题、目标、正文、术语、代码、常见错误、handson、下一节都可见。
- 最长解释区：GS3 的“岔路口 / 判断门”和 GS4 的“步骤卡”解释不溢出、不遮挡。
- 条件分支代码块：`if`、`else`、两个温度值与两行 expectedOutput 清晰可复制。
- 方法代码块：main 外方法声明、main 内两次调用、四行 expectedOutput 清晰可复制。
- direct-entry 无栈返回：从分享或直达链接进入 GS3 / GS4 后返回行为正常。
- error state：错误 lessonId 或加载失败时显示既有错误态，不出现空白页。

## 375px

- GS3 代码块：横向滚动或换行表现稳定，`morning=wear jacket` 与 `noon=no jacket` 不被截断。
- GS4 代码块：`static void printWakeUpStep()` 与两次 `printWakeUpStep();` 可辨认。
- 长中文解释：GS3 true/false、GS4 调用顺序说明不互相覆盖。
- 长日文解释：GS3 条件式評価、GS4 呼び出し順序说明不溢出。

## 430px

- Chapter 3：章节列表中 GS3 标题显示自然，下一节仍是 `条件分岐の例`。
- Chapter 4：章节列表中 GS4 标题显示自然，下一节仍是 `メソッドの例`。
- GS3：常见错误四条完整显示，handson 能看到修改两个值与比较运算符的要求。
- GS4：常见错误四条完整显示，handson 能看到新增或修改方法、从 main 调用、观察次数与顺序的要求。

## 手工验收动作

1. 打开 GS3，复制代码到 Java 21 环境运行，确认输出与页面 expectedOutput 一致。
2. 在 GS3 中按 handson 修改两个温度值，再改比较运算符，确认分支输出变化。
3. 打开 GS4，复制代码到 Java 21 环境运行，确认 method 行输出两次。
4. 在 GS4 中减少一次调用，再新增一个方法并从 main 调用，确认输出次数和顺序跟调用位置一致。
5. 全程确认页面正文不显示教材页码、内部 ID、profile、lesson= 或 Quiz/SRS 结构。
