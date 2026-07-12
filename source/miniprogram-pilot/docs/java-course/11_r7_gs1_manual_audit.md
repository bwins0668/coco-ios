# R7 GS1 手动审计报告

> lessonId: `intro-ch01-lesson-001`
> 主题: プログラムとは / 程序是什么
> 章节: java-ch01, order 1/13
> sourceRef: java_intro_tsukuba, 第1章 Java言語に触れる, section="プログラムとは"

---

## 每节详细审计

| 项目 | 内容 |
|---|---|
| lessonId | intro-ch01-lesson-001 |
| 教材概念 | Java程序的最基本结构：class（容器）、main（入口）、println（输出） |
| 为什么选择它 | 全课程第一个lesson，定义了零基础学生的入口体验。没有这一节，学生无法理解"Java程序是什么" |
| 零基础难点 | 文件名=类名的约定（不遵守就编译报错）、{ }配对（容易漏掉一个）、大小写严格区分（system和System完全不同） |
| 日文讲解策略 | 用「」标记关键概念，使用「→」箭头直观展示三层结构，用"箱"（盒子）的比喻帮助理解class是容器 |
| 中文讲解策略 | 不直译日文，用中文学习者熟悉的"框架→入口→输出"三层结构，强调"预测→运行→对比"的学习习惯 |
| 代码真实行为 | 3行println从上到下顺序输出，每行输出对应代码中的一个println调用 |
| 常见错误是否具体 | 是。3条错误各有具体场景（文件名不一致、println在main外、大小写错误）、具体错误信息、具体原因 |
| handson 是否可执行 | 是。3步渐进：改字符串→移println到main外→读错误信息并解释原因 |
| 与下一节关系 | 下一节「Java言語のプログラムコード」延续class+main结构，学习注释和代码格式 |
| learner-visible 噪音检查 | 0处教材页码，0处lessonId，0处sourceRef，0处TODO/placeholder |
| 修复前问题 | blocks中每段以"教材4ページ"开头；代码输出含lesson=intro-ch01-lesson-001；中文标题"程序とは"是日文直译；commonMistakes混杂页码 |
| 修复后效果 | 全部learner-visible噪音清零；中文标题自然；易错点每条都有场景+原因+后果；handson有完整操作链 |

---

## Java 21 编译与运行

- 编译: `javac JavaR7C01S001.java` → OK
- 运行: `java JavaR7C01S001` → OK
- expectedOutput: 3行ASCII输出，验证class/main/println三层结构
- 336/336 examples compile: PASS

---

## GS1 Checker 结果

- GS1 contract: PASS（零 warning，`why` / handson 关键教学契约已改为 fail-closed）
- GS1 selftest TEMP A-H: PASS（所有 TEMP 均真实执行；warning 不再算通过）
- content_integrity_v2: 默认只读；只有显式 `--write-report` 才会更新 `10_r7_content_cluster_inventory.md`

---

## 全量回归门禁对比

| Checker | 修改前 | 修改后 |
|---|---|---|
| source_coverage | PASS | PASS |
| bilingual_content_quality | PASS | PASS |
| no_quiz_contract | PASS | PASS |
| runtime_package | PASS | PASS |
| examples_compile | PASS | PASS |
| route_shell | PASS | PASS |
| miniprogram_checks | 18/18 | 18/18 |
| R6 regression (11 checkers) | ALL PASS | ALL PASS |
| content_integrity_v2 | 12,836 findings | 12,836 findings (默认只读，不改脏文档) |
