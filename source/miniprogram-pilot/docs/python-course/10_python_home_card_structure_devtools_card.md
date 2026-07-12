# Python home card structure DevTools review card

Open this worktree in WeChat DevTools:

`G:\项目\study-tools-miniprogram-python-r8-card1-clean`

## Routes

| Target | Route |
|---|---|
| 首页 | `pages/home/home` |
| Python Home | `/packages/python-course/pages/home/home` |

## 375px

| Check | Expected result |
|---|---|
| Python card title | "Python" visible with "Py" abbreviation. |
| Python card pill | "面向零基础" pill visible, right-aligned, khaki tint. |
| Python card path | `Python入門 / リスト / 条件分岐 / Python 入门 / 列表 / 条件分支` visible as subtitle. |
| Python card meta | `5 小节 · 双语讲解` visible, neutral tertiary text color. |
| Card height | Python card height matches Java card height; no overflow or truncation. |
| Line wrapping | Long Japanese subtitle wraps naturally; Chinese subtitle on same line. |
| Tap area | Entire card is tappable; hover state shows pressed effect. |
| Khaki border | Left border is muted khaki (`#9A7B48`), not Java blue. |
| Java card | Java card unchanged — title, subtitle, chapter/section count, blue left border remain. |
| Algorithm card | "アルゴリズム基礎" grey planned card unchanged. |

## 390px

| Flow | Expected result |
|---|---|
| 首页 Python card | Tap enters Python Home at `/packages/python-course/pages/home/home`. |
| Python Home | Shows 5 visible lessons: GS1, GS2, Domain1Ax3. |
| Python Chapter | `python-gs-ch01` lists all 5 in correct order. |
| Back to home | Return from Python Home to homepage; Python card info unchanged. |
| planned lessons | No unplanned lesson visible. |

## 430px

| Area | Expected result |
|---|---|
| Java / Python alignment | Both cards sit side by side in the course-strip list with identical info hierarchy. |
| Card height parity | Python card does not appear taller or shorter than Java card. |
| Khaki isolation | Python khaki colors do not bleed into Java blue or anywhere else. |
| MOS / Algorithm greys | MOS unresolved and Algorithm planned cards remain in their baseline muted states. |
| ITP / SG exams | Exam section cards remain unchanged. |

This card is for manual review. It does not claim the structure has already been accepted.
