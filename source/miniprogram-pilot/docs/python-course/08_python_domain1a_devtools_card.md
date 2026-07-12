# Python Domain1A DevTools review card

Open this worktree in WeChat DevTools:

`G:\项目\study-tools-miniprogram-python-r8-p1-d1a-clean`

This card is for manual review after automated gates pass. It does not mean Domain1A has already been manually accepted.

## Routes

| Target | Route |
|---|---|
| 首页 | `pages/home/home` |
| Python Home | `/packages/python-course/pages/home/home` |
| Python Chapter | `/packages/python-course/pages/chapter/chapter?chapterId=python-gs-ch01` |
| GS1 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output` |
| GS2 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables` |
| Domain1A-1 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0009-7d37969c-第-3-章-列表简介` |
| Domain1A-2 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0010-921b265b-第-4-章-操作列表` |
| Domain1A-3 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0011-5c80c609-第-5-章-if语句` |
| Missing error route | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=missing` |

## 375px

| Check | Expected result |
|---|---|
| 首页 Python 卡片可点击 | Home card enters Python Home; it is not grey planned state. |
| Python Home | Shows only GS1, GS2, and the three Domain1A lessons. |
| Python Chapter | Chapter list preserves order: GS1 -> GS2 -> Domain1A-1 -> Domain1A-2 -> Domain1A-3. |
| GS1 / GS2 | Approved content still renders and remains unchanged. |
| Domain1A every lesson | Each lesson renders title, objectives, why, mental model, code, line notes, mistakes, terms, handson, summary, and bridge. |
| Long Japanese | Long Japanese explanatory lines wrap cleanly without clipping. |
| Long Chinese | Chinese helper text wraps under the Japanese layer without overlap. |
| Long Python code | Code block scrolls horizontally when needed; text is not squeezed. |
| terms | Terms show Japanese / Chinese / English clearly. |
| handson | Action and expected observation are both visible. |
| Khaki theme | Accepted khaki accents remain; no green brand element returns. |

## 390px

| Flow | Expected result |
|---|---|
| 首页 -> Python Home | Tapping the Python card opens `/packages/python-course/pages/home/home`. |
| Python Home -> Chapter | Chapter entry opens `python-gs-ch01`. |
| Chapter -> lessons | GS1, GS2, and Domain1A lessons open from the visible list. |
| GS2 -> Domain1A first lesson | Next bridge and navigation make the first Domain1A lesson reachable for review. |
| Domain1A sequence | Previous / next continuity is conceptually natural: list intro -> list operations -> if statement. |
| Direct-entry | All lesson routes in this card can be opened directly. |
| Missing error state | Missing route shows the error state, not blank content. |
| 返回链 | Back behavior returns from lesson to chapter / home as before. |
| Active / pressed state | Pressed states remain readable and do not reintroduce green accents. |

## 430px

| Area | Expected result |
|---|---|
| 首页 Python 卡片 | Available state is clear and does not affect Java / ITP / SG / MOS / algorithm cards. |
| Khaki contrast | Buttons, cards, borders, and emphasis retain the approved muted khaki readability. |
| Chapter navigation | The five visible lessons are scannable and ordered. |
| Code / explanation hierarchy | Code examples, line notes, and explanation blocks have clear hierarchy. |
| terms | Bilingual term blocks remain legible with English technical terms. |
| handson | Handson content appears after concept explanation and before summary / bridge. |
| Domain1A final bridge | Last bridge closes this small batch and does not claim Domain-1 completion. |
| Other courses | No Java / ITP / SG / MOS / algorithm colors or routes bleed into Python pages. |
