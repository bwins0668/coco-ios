# R8.HOME-BADGE-RM1 首页入门标签移除审计

## 目标

仅移除首页 Java 与 Python 卡片中的 `面向零基础` 视觉 pill。保留课程标题、路径、统计、颜色、路由、准备中状态和 Python Runtime-F2 main-package 边界。

## 来源定位

| 卡片 | badge 数据来源 | 渲染文件 | 样式文件 | 是否与其他模块共用 | 最小移除方式 |
|---|---|---|---|---|---|
| Java | `pages/home/home.wxml` 静态 `<text class="r7-java-course-entry__pill">面向零基础</text>` | `pages/home/home.wxml` | `pages/home/home.wxss` `.r7-java-course-entry__pill` | 否，仅 Java 首页卡 | 在该 scoped pill 选择器加 `display: none;` |
| Python | `pages/home/home.wxml` 静态 `<text class="r8-python-course-entry__pill">面向零基础</text>` | `pages/home/home.wxml` | `pages/home/home.wxss` `.r8-python-course-entry__pill` | 否，仅 Python 首页卡 | 在该 scoped pill 选择器加 `display: none;` |

## 保真项

| 区域 | 保留内容 | 证据 |
|---|---|---|
| Java 卡 | `Ja`、`Java`、`Java入門 / Java実践 / Java 基础 / Java 实践`、`19 章节 · 336 小节 · 双语讲解`、原蓝色、原入口 | `pages/home/home.wxml` 与 `pages/home/home.js` 未改，`pages/home/home.wxss` 仅隐藏 pill |
| Python 卡 | `Py`、`Python`、`Python入門 / リスト / 条件分岐 / Python 入门 / 列表 / 条件分支`、`5 小节 · 双语讲解`、卡其色、原入口 | `utils/python-public-course-summary.js` 未改，`sectionCount` 仍来自 `visibleLessonIds.length` |
| Runtime-F2 边界 | 首页只 require `../../utils/python-public-course-summary` | `tools/check_home_beginner_badge_removal_contract.js` 检查首页 require graph 不进入 `packages/python-course/**` |
| MOS | `准备中` 状态保留 | `pages/home/home.wxml` 的 `cc-exam-row__badge` 未改 |
| 算法 | `算法基础准备中` 状态保留 | `pages/home/home.wxml` 的 `r6-course-strip__badge` 未改 |

## 方式说明

本轮没有改 `pages/home/home.wxml`，原因是 Runtime-F2 后已有多个门禁绑定首页 WXML 结构和 hash。直接删 WXML 节点会让无关的历史结构门禁失败，且不属于用户反馈所要求的结构调整。

因此采用 scoped CSS 视觉移除：

- Java: `.r7-java-course-entry__pill { display: none; }`
- Python: `.r8-python-course-entry__pill { display: none; }`

这会让两个 `面向零基础` pill 不再渲染，同时不影响其他 badge：

- MOS 的 `准备中` 仍保留；
- 算法的 `算法基础准备中` 仍保留；
- IT Passport / SG 状态不变；
- Java 蓝色与 Python 卡其色不变；
- Python 首页入口仍走 main package public summary，不回退到 subpackage require。

## 验收入口

DevTools 首页：

`/pages/home/home`

人工检查：

- Java 卡不显示 `面向零基础`；
- Python 卡不显示 `面向零基础`；
- Java 与 Python 课程路径、统计和点击入口仍可用；
- MOS 与算法仍显示准备中状态；
- Console 不出现 `module 'packages/python-course/data/python-course-summary.js' is not defined`。
