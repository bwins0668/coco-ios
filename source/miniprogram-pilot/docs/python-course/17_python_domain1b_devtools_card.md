# Python Domain1B DevTools Card

本卡用于人工验收 Domain1B。运行前保持当前分支，不 push、不上传、不发布。

## 375px

| 入口 | 检查点 | 预期 |
|---|---|---|
| 首页 Python 卡 | 动态 lesson count | 显示 6 小节，来自 public projection length。 |
| 首页 Python 卡 | 卡其主题 | Python 卡保持 `#9A7B48` 系列卡其色，Java 不串色。 |
| Python Home | published 顺序 | GS1、GS2、Domain1A 三节、Domain1B 字典，共 6 节。 |
| Python Chapter | 最长日文/中文 | 字典 lesson 的日文与中文说明不溢出、不遮挡。 |
| Python Lesson | 最长 code | dictionary 示例在 code block 内横向滚动，不撑破页面。 |

## 390px

| 流程 | 检查点 | 预期 |
|---|---|---|
| 首页 -> Python | 路由 | 进入 `/packages/python-course/pages/home/home`。 |
| GS2 -> Domain1A | 顺序 | 变量后进入 list，再到 list 操作、if。 |
| Domain1A -> Domain1B | bridge | if lesson 后可继续看到 dictionary lesson，语义衔接自然。 |
| Domain1B direct-entry | 路由 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0012-5cc0ecc6-第-6-章-字典` 可直接打开。 |
| missing error state | 兜底 | 不存在 sectionId 显示错误状态并可返回。 |
| 返回链 | 返回 | lesson -> chapter -> Python Home -> 首页链路正常。 |

## 430px

| 区域 | 检查点 | 预期 |
|---|---|---|
| 首页 Java/Python | 信息层级 | Java 与 Python 卡都可读，Python 显示当前 6 小节，不出现“面向零基础”冗余 badge。 |
| Python card count | 动态 count | 与 `utils/python-public-course-summary.js.visibleLessonIds.length` 一致。 |
| card path label | 当前范围 | 显示 Python 入门 / 列表 / 条件分支 / 字典，不声称完整课程。 |
| Domain1B lesson | 代码与解释层级 | why、mental model、terms、code、line notes、mistakes、handson 顺序清楚。 |
| planned lesson | 不露出 | 第 7 章 用户输入和 while 循环不在 Home/Chapter/public projection 中出现。 |
| 其他课程 | 不串色 | Java、IT Passport、SG、MOS、算法不被 Python 卡其主题影响。 |

## Entry Summary

- Python Home: `/packages/python-course/pages/home/home`
- Domain1B Lesson: `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0012-5cc0ecc6-第-6-章-字典`
- Published count: 6
- Planned lesson visibility: hidden
