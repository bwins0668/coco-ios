# Python Shard Train1 DevTools Card

## Manual Review Scope

本轮完成后只请求一次联合 DevTools 人工验收。验收对象：

- 旧 Python home：`/packages/python-course/pages/home/home`
- 新 shard chapter：`/packages/python-course-foundations-b/pages/chapter/chapter?chapterId=python-foundations-b-ch01`
- 新 shard lesson 13：`/packages/python-course-foundations-b/pages/lesson/lesson?chapterId=python-foundations-b-ch01&sectionId=python-0013-3f4a9a6a-第-7-章-用户输入和while循环`
- 新 shard lesson 14：`/packages/python-course-foundations-b/pages/lesson/lesson?chapterId=python-foundations-b-ch01&sectionId=python-0014-75c7d812-第-8-章-函数`
- 新 shard lesson 15：`/packages/python-course-foundations-b/pages/lesson/lesson?chapterId=python-foundations-b-ch01&sectionId=python-0015-0f96233e-第-9-章-类`

## Visual Checks

- Python khaki visual style remains consistent with accepted cards.
- Old six lessons remain reachable and unchanged.
- Lesson 13 visibly renders `入力例 / 输入示例`.
- Code blocks fit horizontally and copy button remains available.
- Missing lesson route shows controlled error state.

## Runtime Checks

- Lesson 13 sample input is `Coco` and `3`.
- Lesson 13 output is deterministic and does not wait for extra input.
- Lesson 14 and 15 run without input.
- No upload, merge, PR, or preview release is implied by this manual review card.
