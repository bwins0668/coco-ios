# R6.6A.2 Course Detail Page Implementation

> Route: `pages/course/course`
> DC Frame: 考试详情 + 课程学习 (course shell)
> Status: IMPLEMENTED_BUT_NOT_VISUALLY_VERIFIED

## Changes

| File | Change |
|------|--------|
| `course.json` | `navigationStyle: "custom"` |
| `course.wxml` | Added custom nav header + back button + navSafeTop |
| `course.wxss` | Added nav styles, removed hardcoded system font stack |
| `course.js` | Added `navSafeTop` + `_syncNavLayout()` + `goBack()` |

## Preserved

- All course data loading (registry, courseState, contentRegistry)
- All handlers: goPractice, goTopic, goTextbook, goQuestionOrganizer, goMistakes, goBackHome
- Honest states: notFound, certification, learning, empty
- All WXSS layout, tokens, dark theme

## Navigation

- Back button: `wx.navigateBack({delta: 1})`
- Home: `goBackHome()` → `nav.goCourseTab()`
- Practice: `nav.goCoursePractice(id)`

## Manual Acceptance

390px:
1. [ ] No native white nav bar
2. [ ] Custom header: back + course name
3. [ ] Back button works
4. [ ] Certification view: IT Passport / SG
5. [ ] Learning view: Python / Java / Algo
6. [ ] Not found: honest empty state
7. [ ] No tab bar visible
