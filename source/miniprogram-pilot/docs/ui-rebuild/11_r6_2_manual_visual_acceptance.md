# R6.2 Manual Visual Acceptance

Status: READY_FOR_MANUAL_VISUAL_PROOF

## TabBar (all tabs)
| Check | Route | Steps |
|---|---|---|
| No bottom overlap | 课程 tab | Scroll course page to bottom, verify last content visible above tabbar |
| No bottom overlap | 刷题 tab | Verify exam rows visible above tabbar |
| No bottom overlap | 复习 tab | Verify review cards visible above tabbar |
| No bottom overlap | 术语 tab | Verify entry rows visible above tabbar |
| No bottom overlap | 我的 tab | Verify stats strip visible above tabbar |
| Opaque background | Any tab | Verify no content shows through tabbar |
| Active state | All 5 tabs | Switch tabs, verify correct icon+text highlighted (#37418A) |
| Safe area | Any tab (iPhone) | Verify Home Indicator area handled |

## Course Page (pages/home/home)
| State | Steps |
|---|---|
| Continue | Have learning data, enter 课程. Verify masthead (kicker+title+streak), hero (上次练习+exam+继续练习), exam rows (IT Passport/SG with accent), course strip (Py/Java/Alg mono), numbered sections (01/02) |
| Start | Clear learning data. Verify hero shows 开始学习+CTA buttons |
| 375/430px | Verify layout at narrow and wide widths |

## Practice Page (pages/practice/practice)
| State | Steps |
|---|---|
| With data | Enter 刷题. Verify masthead with DRILL kicker+title, accent rule, continue card, numbered section (01 选择考试), exam rows with monospace icons |
| 375/430px | Verify layout |

## Review Page (pages/review/review)
| State | Steps |
|---|---|
| Loaded | Enter 复习. Verify masthead, accent rule, numbered section (01 今日复习), flashcard SRS card, mistake/term review cards |
| 375/430px | Verify layout |

## Quiz Page (packages/quiz/pages/quiz/quiz)
| State | Steps |
|---|---|
| Unanswered | Start quiz. Verify question card, option items with QP styling |
| Selected | Tap an option. Verify selected state with primary-soft background |
| Correct | Answer correctly. Verify correct state with success-soft background |
| Wrong | Answer incorrectly. Verify wrong state with danger-soft background |
| Results | Complete quiz. Verify result summary page |

## Glossary Page (pages/glossary/glossary)
| State | Steps |
|---|---|
| Loaded | Verify masthead, search bar, entry rows (全部浏览/闪卡记忆/随机术语/收藏复习) |
| Empty | Verify empty favorite state |

## Profile Page (pages/profile/profile)
| State | Steps |
|---|---|
| With data | Verify user info, stat strip, row lists, backup section |
| New user | Clear data. Verify welcome/empty state |