# Python home card structure audit

R8.PYTHON-P1-CARD1 adds course structure information to the Python home card, matching the Java card's information hierarchy.

## Card field mapping

| 首页卡字段 | Java 卡当前结构 | Python 发布前 | Python 发布后 | 数据来源 | 是否动态 |
|---|---|---|---|---|---|
| 课程标题 | "Java" | "Python" | "Python" | `course-registry.js` displayName | 否 |
| 课程缩写 | "Ja" | "Py" | "Py" | `home.js` COURSE_ABBR | 否 |
| 零基础标签 | "面向零基础" | 无 | "面向零基础" | WXML text | 否 |
| 路径说明 | `Java入門 / Java実践` / `Java 基础 / Java 实践` | 无 | `Python入門 / リスト / 条件分岐` / `Python 入门 / 列表 / 条件分支` | `python-course-summary.js` → source manifest visible lessons | 是（跟随 visible 集合） |
| 章节/小节统计 | `19 章节 · 336 小节 · 双语讲解` | 无 | `5 小节 · 双语讲解` | `python-course-summary.js` → visibleCourseLessonIds.length | 是（跟随 visible 集合） |
| badge | 无 (硬编码在循环外) | `Algorithm` planned badge | `Algorithm` planned badge (不变) | WXML static | 否 |
| 卡片 route | `/packages/java-course/pages/home/home` | 通用 `goToCourse` → `/packages/python-course/...` | 通用 `goToCourse` → `/packages/python-course/...` | `utils/navigation.js` | 否 |
| disabled/available | available | available | available | `course-registry.js` availability | 否 |

## Why 5 and not 699

Python source manifest has 699 `lesson_candidates` mapped from the EPUB's finest teachable leaf nodes. These 699 are candidates for future content rounds, not published lessons. The current published scope is exactly 5 visible lessons:

1. `python-0007-gs1-run-visible-output` (GS1)
2. `python-0008-gs2-values-and-variables` (GS2)
3. `python-0009-7d37969c-第-3-章-列表简介` (Domain1A-1)
4. `python-0010-921b265b-第-4-章-操作列表` (Domain1A-2)
5. `python-0011-5c80c609-第-5-章-if语句` (Domain1A-3)

`python-course-summary.js` reads `releaseVisibility.visibleCourseLessonIds.length` at module load time, so the count automatically reflects the real published scope. It never touches the 699 lesson_candidate list or sourceUnits count.

## Why the path label says what it says

The current 5 published lessons cover: running Python / getting visible output (GS1), values and variables (GS2), list grouping (D1A-1), list mutation (D1A-2), and conditional branching (D1A-3). The path label `入門 / リスト / 条件分岐` captures this scope honestly.

Future topics (functions, classes, files, projects) are not mentioned because they are not yet available to users. When future content rounds publish these topics, the path label should be updated to reflect the expanded scope.

## Why Java and other cards are unchanged

The Java card is a separate hardcoded element in `home.wxml`. The Python card is added as a new, independent card element. The generic `languageCourses` loop now excludes Python (which was previously rendered through it), so the loop only renders Algorithm.

ITP, SG, MOS, and Algorithm cards are unchanged. No global home styles, section labels, or layout rules were modified.

## Minimal file changes

Three non-Python files were modified:
- `pages/home/home.js` — import summary, filter loop, add to setData
- `pages/home/home.wxml` — add Python card, keep Java card separate
- `pages/home/home.wxss` — add Python card khaki styles

One new Python package file:
- `packages/python-course/data/python-course-summary.js` — dynamically computes summary from manifest

## Khaki theme preservation

Python card styles use the accepted khaki palette: accent `#9A7B48`, soft background `#F4EBD8`, pill background `#FFF9F0`, pill text `#765A2B`. These values are scoped to `.r8-python-course-entry` and its children. No global CSS variables were modified.
