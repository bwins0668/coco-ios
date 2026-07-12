# R7 GS5-GS6 DevTools Manual Review Card

## Scope

Manual review candidate only. This card is for DevTools inspection of GS5 and GS6 after automated gates pass. It does not mean the lessons have already been accepted.

## 390px Viewport

| Area | Action | Expected observation |
|---|---|---|
| Java 首页 | Open Java course entry | Java course home renders without empty, error, or broken layout state |
| Chapter 5 -> GS5 | Open Chapter 5 and enter `intro-ch05-lesson-003` | Title shows クラスとインスタンス / 类与实例 |
| Chapter 6 -> GS6 | Open Chapter 6 and enter `intro-ch06-lesson-001` | Title shows コンストラクタ / 构造方法 |
| GS5 longest explanation | Read the longest class / instance explanation | Text wraps cleanly, explains class as design blueprint and instance as runtime object |
| GS6 longest explanation | Read the longest constructor explanation | Text wraps cleanly, explains constructor auto-runs during `new` |
| GS5 code block | Inspect class / instance code | `StudentCard`, two `new StudentCard()` calls, two different field states, and `same object? false` are visible |
| GS6 code block | Inspect constructor code | `StudentCard(String name, int studyMinutes)` is visible without horizontal text overlap |
| Direct entry | Open GS5/GS6 directly from route if supported | Back behavior has no stack crash; direct-entry state remains readable |
| Error state | Open an invalid lesson id in Java course route | Error state is explicit and does not show blank page |

## 375px Viewport

| Area | Action | Expected observation |
|---|---|---|
| GS5 code scroll | Drag horizontally inside the code block | Long Java lines scroll inside the code area, not the whole page |
| GS6 code scroll | Drag horizontally inside the code block | Constructor signature and `new StudentCard("Coco", 45)` remain readable |
| Long Chinese explanation | Read GS5 and GS6 Chinese blocks | Long paragraphs wrap without overlapping adjacent content |
| Long Japanese explanation | Read GS5 and GS6 Japanese blocks | Japanese text wraps with stable line height |
| commonMistakes | Expand/read mistakes if collapsed by UI | Each mistake remains specific, readable, and not clipped |
| handson | Read handson section | GS5 includes two-instance observation; GS6 includes parameter mismatch and restore step |

## 430px Viewport

| Area | Action | Expected observation |
|---|---|---|
| Chapter 5 | Open chapter list | Chapter 5 entry remains tappable and text does not overflow |
| Chapter 6 | Open chapter list | Chapter 6 entry remains tappable and text does not overflow |
| GS5 | Open GS5 | Class / instance explanation and code are readable with comfortable spacing |
| GS6 | Open GS6 | Constructor explanation and code are readable with comfortable spacing |

## GS5 Manual Learning Checks

1. Create or read two instances: `coco` and `mei`.
2. Confirm their object data differs: `Coco course=Java` and `Mei course=SQL`.
3. Modify one object, such as `mei.course`, and confirm the other object should not change.
4. Confirm the explanation naturally distinguishes class as blueprint from instance as concrete runtime object.

## GS6 Manual Learning Checks

1. Create two objects with different constructor parameters.
2. Confirm constructor initialization is visible in output.
3. Deliberately use the wrong parameter count or type.
4. Observe the error, then restore the correct call.
5. Confirm the lesson does not describe constructor as an ordinary method and does not add a `void` return type.

## Review Result Field

Use one of these after human inspection:

- `READY_FOR_MANUAL_GS5_GS6_REVIEW`
- `BLOCKED_WITH_EXACT_REASON: <reason>`
