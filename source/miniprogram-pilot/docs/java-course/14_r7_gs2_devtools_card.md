# R7 GS2 DevTools 人工验收卡

## 入口

- 分包：`packages/java-course-a`
- 章节：`java-ch02`
- 小节：`intro-ch02-lesson-004`
- 期望标题：`変数とデータ型` / `变量与数据类型`

## 页面核对

| 检查项 | 期望 |
|---|---|
| 标题 | 日文标题自然，中文标题为“变量与数据类型”。 |
| 学习目标 | 至少两条，包含变量为什么需要、int/double/String、声明/赋值/读取/输出。 |
| 正文 | 日中解释不是直译；中文能看到“贴标签”的心智模型。 |
| 术语 | 至少显示 variable / data type / assignment 的日中英三语术语。 |
| 代码 | 可复制，包含 String name、double hours、Java 运行时的 int score、int amount、double total。 |
| 预期输出 | 显示 name、hours、points、amount、total 五行。 |
| 常见错误 | 覆盖未初始化、String 双引号、int 小数不匹配。 |
| handson | 要求修改至少两项变量，观察输出变化，并触发再修正 int 小数错误。 |
| 下一节 | 指向 `変数の使用`。 |

## 手工验收动作

1. 打开 GS2 lesson 页面，确认没有正文页码、lessonId、sourceRef、profile、lesson=。
2. 复制代码到 Java 21 环境运行，确认输出与页面一致。
3. 修改 name 与 hours，确认 name/hours/total 输出变化。
4. 修改 amount 为 `1200.5` 且仍保留 int，确认编译报类型错误。
5. 改为 `double amount = 1200.5;` 后再次运行，确认错误消失。

