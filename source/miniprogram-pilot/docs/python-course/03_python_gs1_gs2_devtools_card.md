# Python GS1 / GS2 DevTools card

Manual review should open the Python subpackage directly. P0A intentionally does not add Python to the existing home navigation.

## Direct routes

| target | route |
|---|---|
| Python home | `/packages/python-course/pages/home/home` |
| Python chapter | `/packages/python-course/pages/chapter/chapter?chapterId=python-gs-ch01` |
| Python GS1 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output` |
| Python GS2 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables` |
| error state | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=missing` |

## 375px pass

| area | check |
|---|---|
| longest Japanese | GS1 title and mental model wrap without clipping |
| longest Chinese | GS2 why block wraps without overlapping next card |
| longest Python code | horizontal scroll is available; code does not resize the page width |
| lineNotes | Japanese and Chinese notes remain paired under the code block |
| commonMistakes | three mistakes fit as stacked readable rows |
| handson | action and expectedObservation both render |
| horizontal scroll | `python-code-scroll` keeps max width at 100% |

## 390px pass

| area | check |
|---|---|
| Python 首页 | shows one chapter and two sample sections only |
| Python GS1 | visible output example, line notes, mistakes, handson |
| Python GS2 | variable/value example and deterministic output |
| 章节入口 | chapter route opens from Python home card |
| direct-entry | lesson route works without navigation stack |
| error state | missing section shows return button |
| 返回链 | lesson -> chapter, chapter -> Python home, Python home -> main home |

## 430px pass

| area | check |
|---|---|
| 章节导航 | card spacing remains compact; arrow target is readable |
| 术语区 | Japanese, Chinese, English terms are visible without crowding |
| code 与解释层级 | code, expectedOutput, lineNotes appear in that order |
| 手指触控区域 | primary buttons and copy button keep comfortable hit size |
| bridge 可读性 | nextLessonBridge remains a normal closing card, not a hidden metadata note |

## Noise check

During manual review, the page must not show source IDs, source file information, page numbers, internal anchors, hidden mapping fields, unfinished lesson links, quiz controls, or SRS controls.
