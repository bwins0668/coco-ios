# R6.4 Evidence Runtime Matrix

| 路由 | 用户证据编号 | .dc.html frame | 真实 WXML | 真实 WXSS | 实际组件链 | 数据来源 | 修复点 | 待人工验收 |
|---|---|---|---|---|---|---|---|---|
| pages/home/home | E-R6.4-001, E-R6.4-002 | 课程首页 (frame 1) + 课程Start (2) + 课程Early (3) + 课程Continue状态 (4) | pages/home/home.wxml | pages/home/home.wxss | custom-tab-bar/index -> pages/home/home | registry.getCoursesByKind(), storage.getStreak(), JST date | JST era date (editorial red, mono), streak number highlighted (primary blue, 30rpx semibold), course strip flex column anti-concatenation, section labels 01/02 | 390px/375px/430px |
| pages/practice/practice | E-R6.4-003 | 刷题 (frame 5) | pages/practice/practice.wxml | pages/practice/practice.wxss | custom-tab-bar/index -> pages/practice/practice | navigation.js intents, storage | Left-border accent (border-left: 6rpx) replacing box icon, three-column layout (body flex:1 + chevron), practice-card--exam class | 390px/375px/430px |
| pages/profile/profile | E-R6.4-004 | 我的 (frame 8) | pages/profile/profile.wxml | pages/profile/profile.wxss | custom-tab-bar/index -> pages/profile/profile | storage.getFavoriteTermCount(), getWrongQuestionCount(), getQuizStats(), profile-commands.js | Masthead (PROFILE·我的 + JST date), stat strip (totalAttempts/accuracy/wrongQuestionCount), section labels 01/02/03 | 390px/375px/430px |
| pages/review/review | E-R6.4-005 | 复习 (frame 6) | pages/review/review.wxml | pages/review/review.wxss | custom-tab-bar/index -> pages/review/review | storage review data | TabBar containment (bottom inset), section labels | 390px |
| pages/glossary/glossary | E-R6.4-005 | 术语表 (frame 7) | pages/glossary/glossary.wxml | pages/glossary/glossary.wxss | custom-tab-bar/index -> pages/glossary/glossary | glossary index (1500 terms) | TabBar containment (bottom inset), R6 entry list | 390px/375px |
| custom-tab-bar/index | E-R6.4-005 | All 5 TabBar frames | custom-tab-bar/index.wxml | custom-tab-bar/index.wxss | app.json tabBar.custom=true -> custom-tab-bar/index | tabBar list (5 routes) | 5 geometric icons (home/drill/review/glossary/profile), safe-area bottom, selected state | 390px切换动画 |

## Check Results

| Check | Result |
|---|---|
| check_jst_era_date_contract.js | 12/12 PASS |
| check_r6_4_course_strip_structure.js | 11/11 PASS |
| check_r6_4_practice_card_contract.js | 9/9 PASS |
| check_r6_3_dc_html_runtime_fidelity.js | 47/47 PASS (syntax repaired from commit 0311e19) |
| check_ui_visual_contract.js | PASS (updated to r6-course-strip__item) |
| check_r6_1_active_tab_binding.js | 64/64 PASS (updated to r6-profile-mast) |
| check_r6_2_tabbar_containment.js | PASS |
| miniprogram_smoke_test.js | 159/1 (only pre-existing R3.31) |
