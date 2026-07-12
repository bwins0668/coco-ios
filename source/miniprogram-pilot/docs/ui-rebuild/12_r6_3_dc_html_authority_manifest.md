# R6.3 DC HTML Authority Manifest

## Source File

- **Path**: `G:\项目\mini design\IT学习小程序 全站重构.dc.html`
- **SHA256**: `D7B90281142A6722A938270AA702DD68CBBFC451CAAAE656C24F683BE3D95DF0`
- **Size**: 111,067 bytes
- **Frames**: 22 data-screen-label entries

## Frame Inventory

| # | Frame Label | Corresponding Route(s) |
|---|---|---|
| 1 | 课程首页 | pages/home/home |
| 2 | 课程Start | pages/home/home (start state) |
| 3 | 课程Early | pages/home/home (early state) |
| 4 | 课程Continue状态 | pages/home/home (continue state) |
| 5 | 刷题 | pages/practice/practice |
| 6 | 复习 | pages/review/review |
| 7 | 术语表 | pages/glossary/glossary |
| 8 | 我的 | pages/profile/profile |
| 9 | 考试详情 | pages/course/course |
| 10 | 练习方式 | packages/quiz/pages/exam-menu/exam-menu |
| 11 | 教材章节 | packages/course-*/pages/chapter-list/* |
| 12 | 详细解説 | packages/course-*/pages/unit-detail/* |
| 13 | 练习未答 | packages/quiz*/pages/quiz/quiz |
| 14 | 练习已选 | packages/quiz*/pages/quiz/quiz |
| 15 | 练习正确 | packages/quiz*/pages/quiz/quiz |
| 16 | 练习错误 | packages/quiz*/pages/quiz/quiz |
| 17 | 结果页 | packages/quiz*/pages/quiz/quiz |
| 18 | 错题本 | packages/quiz/pages/mistakes/mistakes |
| 19 | 错题本空 | packages/quiz/pages/mistakes/mistakes |
| 20 | 数据备份 | pages/profile/profile (backup section) |
| 21 | 术语详情 | packages/glossary/pages/term-detail/term-detail |
| 22 | 闪卡复习 | packages/glossary/pages/anki-player/anki-player |

## Design System Extracted

- **Color**: Warm paper bg (#FAF9F6), ink (#211F1C), accent (#37418A), editorial red (#C5123A), success (#4E8A5E), danger (#BE5750)
- **Typography**: Noto Sans SC/JP, IBM Plex Mono for data
- **Spacing**: 8pt grid, page margin 20-22px
- **Radius**: Buttons 12px, containers 14-16px, tags 5px
- **Shadows**: Almost none, only subtle on floating layers
- **Layout**: One primary action per screen, lines > boxes, numbered sections