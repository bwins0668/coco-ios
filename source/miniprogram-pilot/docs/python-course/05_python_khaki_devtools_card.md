# Python khaki DevTools card

Open the Python subpackage directly. P0A-K1 intentionally keeps Python hidden from the existing home navigation.

## Direct routes

| target | route |
|---|---|
| Python Home | `/packages/python-course/pages/home/home` |
| Python Chapter | `/packages/python-course/pages/chapter/chapter?chapterId=python-gs-ch01` |
| Python GS1 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output` |
| Python GS2 | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables` |
| Error state | `/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=missing` |

## 375px pass

| area | check |
|---|---|
| Python Home | warm paper background, khaki hero border, no green brand element |
| Chapter | inherited khaki card border and section accent |
| GS1 | title, mental model, output, mistakes, handson remain readable |
| GS2 | variable/value code, output, terms, bridge remain readable |
| 主按钮 | khaki button text is readable and does not use green |
| 卡片边框 | muted khaki border is visible but quiet |
| code block | horizontal scroll still works and code width does not resize page |
| terms | term names use khaki strong color |
| handson | left divider uses muted khaki, not green |
| green check | 不能出现绿色品牌元素 |

## 390px pass

| area | check |
|---|---|
| GS1 / GS2 | lesson content, line notes, expectedOutput and bridge keep original order |
| active / pressed state | existing interaction remains unchanged; only brand color is khaki |
| 返回链 | lesson -> chapter, chapter -> Python Home, Python Home -> main home |
| error state | missing lesson route shows the existing return action |
| 横向代码滚动 | `python-code-scroll` still keeps max width at 100% |

## 430px pass

| area | check |
|---|---|
| 页面层级 | warm white background, white paper cards, khaki accents |
| 卡其边框 | card and stat borders are clear without becoming dark coffee |
| 暖白背景 | page reads as Quiet Paper, not yellow or military green |
| 按钮可读性 | primary khaki button keeps contrast with light text |
| 文字对比 | warm ink and secondary copy remain legible |
| module isolation | no Java / ITP / SG color appears inside Python package; no Python khaki leaks outward |
