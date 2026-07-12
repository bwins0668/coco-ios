# Python khaki visual contract

R8.PYTHON-0A-K1 only changes the Python subpackage visual accent from green to a muted khaki paper theme. It does not change lesson text, runtime loading, routes, app.json, secondary navigation, Java, ITP, SG, MOS, algorithm modules, global tokens, or shared styles.

## Palette

| Token | Value | Use |
|---|---|---|
| `--python-khaki-accent` | #9A7B48 | primary Python brand accent, primary buttons, hero line |
| `--python-khaki-strong` | #765A2B | strong text accents and secondary actions |
| `--python-khaki-soft` | #F4EBD8 | soft paper highlight for stats and expected output |
| `--python-khaki-border` | #D8C39A | card, term, code, and outline borders |
| `--python-khaki-ink` | #4A3B25 | warm dark text on paper background |

## Area Map

| 区域 | 原视觉用途 | 新卡其色值 | 使用文件 | 用户可见效果 |
|---|---|---|---|---|
| Python Home hero top line | brand green top accent | #9A7B48 | `packages/python-course/pages/home/home.wxss` | 入口顶部变成低饱和卡其强调线 |
| Python Home kicker / section title / arrow | brand green text accent | #9A7B48 / #765A2B | `packages/python-course/pages/home/home.wxss` | 课程标签与箭头更温和，不再是明亮绿色 |
| Python Home stat cards | pale green highlight | #F4EBD8 + #D8C39A | `packages/python-course/pages/home/home.wxss` | 统计卡变成暖纸感浅色块 |
| Python primary / outline buttons | green action color | #9A7B48 / #765A2B | `packages/python-course/pages/home/home.wxss`, `packages/python-course/pages/lesson/lesson.wxss` | 主按钮可读，视觉不跳脱 |
| Lesson kicker / term / copy action | green lesson accent | #9A7B48 / #765A2B | `packages/python-course/pages/lesson/lesson.wxss` | GS1 / GS2 的标题、术语和复制按钮统一为卡其 |
| Handson card divider | green activity marker | #9A7B48 | `packages/python-course/pages/lesson/lesson.wxss` | 动手练习仍有强调，但更克制 |
| Expected output block | pale green output background | #F4EBD8 | `packages/python-course/pages/lesson/lesson.wxss` | 输出块保留可扫读层级，变成纸感浅卡其 |
| Python page cards / borders | neutral global line | #D8C39A | `packages/python-course/pages/home/home.wxss`, `packages/python-course/pages/lesson/lesson.wxss` | 卡片边界更贴合暖白背景 |

## Scope

低饱和卡其用于降低 Python 模块的品牌刺激感，让 GS1 / GS2 更像纸面课程而不是游戏化入口。全局样式没有修改，因为 Java / ITP / SG / MOS / 算法仍应保持既有色彩体系；Python 仅通过自己的 `home.wxss` 与 `lesson.wxss` 建立 scoped override，`chapter.wxss` 继续复用 Python Home 样式。

保留的语义绿色：无。当前 Python package 内没有正确 / 成功状态的绿色 UI；`lesson.js` 中的 `success` 只是 clipboard API callback 名称，不是视觉色彩。

GS1 / GS2 内容与 runtime 未改；Python source manifest 未改；Python 首页仍保持隐藏入口，人工验收继续通过 DevTools direct-entry 打开。
