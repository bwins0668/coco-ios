# Python course architecture

R8.PYTHON-0A 建立 Python 课程的第一阶段：全书目录 source map、单个 subpackage、GS1/GS2 两节黄金样本。planned lesson 只存在于内部 manifest，不进入现有首页导航。

## Runtime audit

| Python 所需能力 | Java 现有实现文件 | 是否可复用 | Python 最小接入方式 |
|---|---|---|---|
| subpackage 注册 | `app.json` | 可复用结构 | 新增 `packages/python-course` 三个页面 |
| 课程首页 shell | `packages/java-course/pages/home/*` | 可复用布局形态 | 新建 Python home，保留 secondary shell 和返回链 |
| 章节列表 | `packages/java-course-a/pages/chapter/*` | 可复用交互模式 | 新建 Python chapter，仅列 GS1/GS2 |
| 小节渲染 | `packages/java-course-a/pages/lesson/*` | 可复用字段消费方式 | 新建 Python lesson，去掉 source page 展示，增加 handson observation |
| 数据 loader | `packages/java-course-a/utils/java-course-loader.js` | 可复用 API 形态 | 新建 `utils/python-course-loader.js` |
| 数据 manifest | `packages/java-course/data/java-course-manifest.js` | 可复用 manifest 思路 | 新建 `data/python-course-manifest.js` |
| 分片 lesson 数据 | `packages/java-course-a/data/chapters/*.js` | 可复用 shard 方式 | 新建 `data/chapters/python-gs-ch01.js` |
| 返回链 | `utils/secondary-navigation.js` | 复用并最小接入 | 补 Python 三页 fallback，页面内仍传更精确的 override |
| 首页总导航 | `pages/home/home.*` / `utils/course-registry.js` | 本轮不接入 | 保持 Python planned，不新增入口 |

## Modified existing files

Two existing runtime files are changed:

| file | reason |
|---|---|
| `app.json` | registers the Python subpackage route so DevTools can open the direct package path |
| `utils/secondary-navigation.js` | adds global fallback entries required by the secondary visual shell contract |

No existing `pages/home/**`, Java course files, project config, or DevTools private config are modified.

## Package structure

| path | purpose |
|---|---|
| `packages/python-course/data/python-source-manifest.js` | TOC-only source map covering 790 deepest source units |
| `packages/python-course/data/python-course-manifest.js` | visible Python course manifest with one reviewable chapter and two sections |
| `packages/python-course/data/chapters/python-gs-ch01.js` | GS1/GS2 original bilingual lessons |
| `packages/python-course/utils/python-course-loader.js` | loader API matching Java shape |
| `packages/python-course/pages/home/*` | direct Python course home |
| `packages/python-course/pages/chapter/*` | visible chapter shell |
| `packages/python-course/pages/lesson/*` | bilingual lesson renderer with code copy and output display |

## Source manifest model

| section | meaning |
|---|---|
| `sourceUnits` | all 790 deepest TOC nodes with `sourceUnitId`, `tocPath`, `sourceOrder`, type, and inclusion |
| `courseChapters` | internal grouping derived from stable source paths |
| `courseLessons` | one-to-one mapping for every `lesson_candidate` source unit |
| `exclusionLedger` | every non-lesson source unit with a reason |
| `goldenSelection` | GS1/GS2 source mapping and selection rationale |
| `releaseVisibility` | exact list of the only visible lesson IDs |

IDs are derived from stable source-unit identifiers and SHA-1 path digests. They are not random UUIDs and do not depend on translated Japanese or Chinese titles.

## Field whitelist

| 字段 | Java lesson 数据存在 | renderer 消费 | 用户可见 | Python 可使用 |
|---|---|---|---|---|
| `title.ja/zh` | yes | yes | yes | yes |
| `objectives[]` | yes | yes | yes | yes |
| `prerequisites[]` | yes | yes | yes | yes |
| `blocks[]` | yes | yes | yes | yes |
| `terms[]` | yes | yes | yes | yes |
| `codeExamples[].code` | yes | yes | yes | yes |
| `codeExamples[].expectedOutput` | yes | yes | yes | yes |
| `codeExamples[].lineNotes[]` | yes | yes | yes | yes |
| `commonMistakes[]` | yes | yes | yes | yes |
| `handson.ja/zh` | yes | yes | yes | yes |
| `handson.action` | Python-specific | yes | yes | yes |
| `handson.expectedObservation` | Python-specific | yes | yes | yes |
| `summary` | yes | yes | yes | yes |
| `nextLessonBridge` | yes | yes | yes | yes |
| `knowledgePoints` | no | no | no | no |
| source metadata fields | Java has some | Python renderer does not | no | no |

`knowledgePoints` remains forbidden because it would be unrendered metadata in this runtime. Source IDs and TOC evidence stay in `python-source-manifest.js`, not in learner-visible page data.

## Visibility strategy

Only `python-0007-gs1-run-visible-output` and `python-0008-gs2-values-and-variables` are visible in P0A. All other mapped lessons remain internal `planned` entries. Existing home navigation is unchanged, so users do not see an unfinished Python course from the main home page.

## Package-size strategy

The Python package contains one small runtime shell and two hand-authored lessons. The large source map is text-only TOC metadata and stores no EPUB body. Later batches should keep lesson shards small and split domains before content grows.

## Next route

The next phase should be `R8.PYTHON-DOMAIN-1`, using the existing source manifest to choose a small contiguous knowledge domain. That phase should not reinterpret P0A as a full Python course.
