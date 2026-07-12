# R6.1 Runtime Gap Root Cause Analysis

## Evidence

- E-001: Course tab screenshot shows old card list (Python / Java / algorithm), old CTA, old tabbar
- E-002: Glossary tab screenshot shows old four-grid layout, old tabbar
- E-003: Profile tab screenshot shows old "Study Tools Mini + info cards", old tabbar
- E-004: Shared tabbar across all three screenshots shows old native tabbar

## Root Cause Table

| Tab | Actual Route | Actual WXML | Actual WXSS | Component Chain | Was Old Design? | Root Cause | Fix |
|---|---|---|---|---|---|---|---|
| 课程 | pages/home/home | pages/home/home.wxml | pages/home/home.wxss | app.json native tabBar | Yes | R6 used cc-course-list (old card list) not R6.1 row/strip patterns; no custom-tab-bar existed; tabBar.custom was false | Renamed cc-course-list→r6-course-strip, added r6-exam-row, r6-section-label; enabled custom-tab-bar |
| 术语 | pages/glossary/glossary | pages/glossary/glossary.wxml | pages/glossary/glossary.wxss | app.json native tabBar | Yes | R6 used action-grid/action-tile (four-grid) not entry-list pattern; tabBar.custom false | Renamed action-grid→r6-glossary-entry-list, action-tile→r6-glossary-row; enabled custom-tab-bar |
| 我的 | pages/profile/profile | pages/profile/profile.wxml | pages/profile/profile.wxss | app.json native tabBar | Yes | R6 used profile-header/info-card (old card stack) not stat-strip/row-list pattern; tabBar.custom false | Renamed profile-header→r6-profile-head, info-card→r6-profile-card+r6-profile-row; added r6-profile-stat-strip, r6-profile-row-list; enabled custom-tab-bar |
| Shared TabBar | app.json tabBar | none (native) | none (native) | Native WeChat | Yes | app.json had no custom:true; no custom-tab-bar component existed; old native tabbar rendered in all tabs | Created custom-tab-bar/index.* with QP-styled geometric icons; set tabBar.custom:true in app.json; all 5 tab routes preserved |

## Why R6 Static Checks Passsed but Runtime Was Still Old

R6 added Quiet Paper tokens, theme coverage, and visual contract checks that scanned for CSS variable usage and structural markers across all file paths. These checks passed because:

1. `check_r6_ui_rebuild_contract.js` verified the expected markers existed — but those markers (action-grid, profile-header) were the OLD class names that the pages already had before R6
2. `check_theme_coverage.js` scanned all WXSS files for hex color violations — QP tokens were already in app.wxss, but the page-level WXSS still used the old class names with QP-token values
3. No check verified that the actual runtime tab routes loaded the R6.1 implementation specifically

The missing check — `check_r6_1_active_tab_binding.js` — was added in this round to close the gap.

## Modified Files Per Tab

### Course tab
- `pages/home/home.wxml`: data-r6-active-tab, r6-section-label, r6-exam-row, r6-course-strip, r6-course-strip__desc
- `pages/home/home.wxss`: .r6-section-label, .r6-exam-row, renamed .cc-course-list→.r6-course-strip, .cc-course-card__desc→.r6-course-strip__desc

### Glossary tab
- `pages/glossary/glossary.wxml`: data-r6-active-tab, r6-glossary-search, r6-glossary-entry-list, r6-glossary-row
- `pages/glossary/glossary.wxss`: .r6-glossary-*

### Profile tab
- `pages/profile/profile.wxml`: data-r6-active-tab, r6-profile-head, r6-profile-stat-strip, r6-profile-row-list, r6-profile-row, r6-profile-card
- `pages/profile/profile.wxss`: corresponding .r6-profile-*

### Shared TabBar
- `app.json`: tabBar.custom=true
- `custom-tab-bar/index.*`: new component with QP-styled geometric icons

## Real Data Preservation

All JS, storage, navigation, course registry, glossary state, and profile command modules remain untouched. All smoke-test anchors (goToAnkiPlayer, goToRandomTerm, backup-btn-group, review-hint-list, timeline-list, welcome-card, etc.) remain in the WXML.