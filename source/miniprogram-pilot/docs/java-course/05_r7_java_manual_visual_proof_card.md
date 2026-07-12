# R7 Java Manual Visual Proof Card

**Date** 2026-07-01 | **Branch** feature/r7-java-course-bilingual-content

## Minimum representative samples for WeChat DevTools manual verification

Open WeChat DevTools and navigate each route. Confirm all items pass.

### 390px viewport (iPhone 14 / standard miniprogram width)

| # | route / page | checkpoints |
|---|---|---|
| 1 | 首页 Java 入口卡 | Java course card visible, Quiet Paper background continuous, no white navbar |
| 2 | /packages/java-course/pages/home/home | Java Course Home renders 19 chapters, scroll list, no overflow |
| 3 | First chapter page (java-ch01) | Chapter list with 13 sections, back button not covering title |
| 4 | First lesson (intro-ch01-lesson-001) | 5 bilingual blocks, runnable code, copy button, terms, mistakes, handson |
| 5 | Control-flow chapter (java-ch03) | if/switch/for lessons listed, correct structure |
| 6 | OOP chapter (java-ch06 or java-ch07) | constructor/inheritance sections visible |
| 7 | Exception or Collection lesson | try/catch example or ArrayList example renders correctly |
| 8 | Practice chapter (any ch09-ch19) | Practice lesson with import / API usage |
| 9 | Longest Java code block | horizontal scroll only inside code block, page doesn't overflow |
| 10 | Longest bilingual explanation | text wraps within card, no truncation |
| 11 | Error state (direct open with invalid lessonId) | "小节暂不可用" with return button |
| 12 | Direct entry without stack | back button → returns to chapter/ home appropriately |

### 375px viewport (small Android)

| # | route | checkpoints |
|---|---|---|
| 1 | Java Home | no horizontal overflow, all 19 chapters reachable |
| 2 | Lesson Reader (any lesson) | code block scroll-x works, copy button accessible |
| 3 | Longest code block | scroll within block, page stable |

### 430px viewport (iPad / wide)

| # | route | checkpoints |
|---|---|---|
| 1 | Chapter page | sections fill width, no card overlap |
| 2 | OOP Lesson (inheritance/polymorphism) | layout respects wider viewport |
| 3 | Practice Lesson | import+example layout clean |

### Universal checks (every page)

- Quiet Paper background continuous (no white nav bar)
- Back button does not obscure title
- Back hot zone works (taps anywhere on back icon/ text)
- Japanese and Chinese content visually layered (ja first, zh second)
- Long code scrolls only inside code block (horizontal); page does NOT horizontally overflow
- Copy code button visible and tappable
- Content not clipped by safe-area insets
- No large meaningless whitespace gaps
- No white screen on any route
- Console shows 0 MiniProgramError, 0 "module not defined", 0 "Component is not found"
- No Quiz elements, no options, no score, no wrong-answer, no SRS

### Pre-flight

- [ ] DevTools → clear cache → compile → check each route
- [ ] Console filter: "Error" → must be empty
- [ ] Test: tap back button on lesson → returns to chapter, not blank
- [ ] Test: copy code button → shows success feedback

### Expected outcome

All items pass → R7_JAVA_CONTENT_FIDELITY_CANDIDATE
Any item fails → record screenshot + route + console error
