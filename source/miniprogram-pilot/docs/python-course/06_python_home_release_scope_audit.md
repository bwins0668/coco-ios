# Python Home release scope audit

R8.PYTHON-P1-D1A stage A publishes only the already approved Python Home entry. It does not publish the Python book, Domain-1, or any planned source-mapped lesson beyond the visible approved lessons.

## Entry Scope

| 项目 | 发布前 | 发布后 | 实际控制文件 | 证据 |
|---|---|---|---|---|
| Python 首页卡片 | 灰色 / planned | 可点击 | `utils/course-registry.js`, `pages/home/home.wxml` | Python `availability` changes from `planned` to `available`; planned class no longer applies |
| 状态文案 | `Python / 算法基础准备中` | `算法基础准备中` | `pages/home/home.wxml` | Python is removed from the preparing badge; algorithm remains explicitly planned |
| 目标 route | generic course shell `/pages/course/course?courseId=python` | `/packages/python-course/pages/home/home` | `utils/navigation.js` | `goCourseHome('python')` routes directly to Python Home |
| GS1 / GS2 | 已验收 | 保持不变 | `packages/python-course/data/chapters/python-gs-ch01.js` | learner-visible data hash remains `B1CAD4BB884EC93241E1C6F188D0BA1C948F16D4E0D361329610E907D59D22EC` |
| planned lesson | 隐藏 | 继续隐藏 | `packages/python-course/data/python-course-manifest.js`, `packages/python-course/data/python-source-manifest.js` | Python Home sections must be sourced only from current `visible` lessons |
| Java / ITP / SG / MOS / 算法 | 基线 | 保持不变 | `utils/course-registry.js`, `utils/navigation.js`, `pages/home/home.js` | checker verifies baseline identities, status, and routes |

## Why This Is Not Full Release

This is an entry release, not a full Python-course release. The Home card now lets the user enter the already reviewed Python subpackage, but Python Home still exposes only source-manifest `visible` lessons. At stage A that means GS1 and GS2 only.

Python is marked available at the home-card level because GS1 / GS2 and the khaki theme have passed manual review. The other 697 source-mapped lesson candidates remain internal or planned until a later source-scoped content round promotes them with dedicated contract checks.

Global home styling is unchanged. The Python card uses the existing regular active course-strip style; Python khaki remains scoped to `packages/python-course/**`.

The accepted Python lesson theme is not redesigned. `packages/python-course/pages/home/home.wxss` and `packages/python-course/pages/lesson/lesson.wxss` remain part of the accepted K1 theme.

`app.json` is not modified. The Python subpackage routes were already registered in P0A.

`utils/secondary-navigation.js` is not modified. Python secondary fallback was already established in P0A.

`tools/check_python_course_runtime_contract.js` is updated from the P0A hidden-entry assertion to the P1 released-entry assertion, because stage A intentionally makes the Python Home route reachable from the existing Home course card.
