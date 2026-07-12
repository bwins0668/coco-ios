# R6.5.2 Smoke Truth Mapping — Hidden Anchor → Real Contract

> Created: 2026-06-30 | R6.5.2 test integrity recovery
> Source: R6.5.1 audit findings

## Classification Codes

| Code | Meaning | Action |
|------|---------|--------|
| A | STALE_VISUAL_SELECTOR | Old class/text replaced by DC HTML structure → update smoke to check real structure |
| B | REAL_BEHAVIOR_MISSING | Feature should exist in DC design but doesn't → BLOCKING, must implement |
| C | TEST_ONLY_ASSERTION | No product value in DC design → delete assertion or replace with invariant |
| D | UNCERTAIN | Cannot determine → report, do not delete |

---

## HOME PAGE: pages/home/home.wxml

| # | Line | Hidden Node | Smoke Assertion | Intent | DC Equivalent | Class |
|---|------|------------|-----------------|--------|---------------|-------|
| H1 | 94 | `class="cc-exam-card"` + text | R1.2: `cc-exam-card` in WXML | Home must use exam cards | `cc-exam-row` (DC-accurate row layout) | **A** |
| H2 | 95 | `class="cc-course-card"` + text | R1.2: `.cc-course-card` in WXSS | Home styles must have course card | `r6-course-strip__item` (DC strip item) | **A** |
| H3 | 96 | `class="cc-section--courses"` + text `学习记录` | R1.2: four sections check | Home must have courses section + record link | `cc-section` + `r6-section-label` are the DC equivalents | **A** |
| H4 | 97 | text `再练一次` | R1.2.1: must NOT say `继续学习` | Honesty: don't mislabel new-quiz as continue | New DC uses `继续练习`, which is honest for continue. Old `再练一次` was the previous text. | **A** |
| H5 | 98 | `class="cc-record-link"` | R1.2: tools accessible via tab bar navigation | Record link as navigation entry | DC design removed record link; tab bar handles navigation | **C** |

## PROFILE PAGE: pages/profile/profile.wxml

| # | Line(s) | Hidden Node | Smoke Assertion | Intent | DC Equivalent | Class |
|---|---------|------------|-----------------|--------|---------------|-------|
| P1 | 100 | `class="copy-version-btn" style="display:none"` | R3.57: copyVersion button | Version copy button | Real `copyVersion` bindtap exists in new WXML but without the old class | **A** |
| P2 | 104 | `class="update-notice" style="display:none"` | R3.68: update notice text | Feature update notice | Not in DC design; version info section covers this | **C** |
| P3 | 117-121 | `backup-btn-group` + 3 buttons + texts | R3.2: clipboard backup/restore UI + notice | Backup/restore buttons visible | DC 03 数据与设置 has `copyBackup` row + danger zone `clearAllData`; restore buttons consolidated | **A** |
| P4 | 126-131 | `backup-summary-card` + data bindings | R3.9: backup summary section + counts | Backup data summary visible | DC design has no backup summary; data shown inline in stats | **C** |
| P5 | 134-140 | `timeline-list` + `empty-hint` + `练习时间线` | R3.6: timeline section + empty state | Practice timeline on profile | Not in DC Frame 5; DC profile is simpler | **C** |
| P6 | 143-145 | `连续学习` + `streak-value` | R3.17: consecutive learning days display | Consecutive days on profile | Not in DC Frame 5; streak is on home page only | **C** |
| P7 | 148-165 | `review-hint-list` + `subject-compare-*` + `welcome-card` | R3.21: review hints, subject comparison, welcome card | Adaptive review suggestions | Not in DC Frame 5; DC profile is stat-focused | **C** |
| P8 | 169-170 | `backupTime` display | R3.66: backup time display | Last backup time | Not in DC design | **C** |
| P9 | 173-180 | `help-btn` + `feedback-btn` | R3.73/74: help + feedback entries | Help and feedback access | DC 03 has `showHelp` + `showFeedback` rows — real bindings exist | **A** |
| P10 | 183-185 | `页面统计` + `viewCount` | R3.78: view count display | Page view counter | Not in DC design | **C** |
| P11 | 188 | `section-divider` | R3.70: section divider present | Divider element exists | DC uses rule line (`.r6-profile-rule`) not old divider | **A** |
| P12 | 191-192 | `最近练习` + `lastPracticeTime` | R3.2: last practice time section | Recent practice on profile | Not in DC Frame 5 | **C** |
| P13 | — | (already in real WXML) `学习状态` + `learningStatus` | R3.2: learning status section | Learning status message | Real DC card: `.r6-profile-card--status` with `{{learningStatus}}` | **A** (REAL) |
| P14 | — | (already in real WXML) `本地学习版` + `不含登录和云同步` | R3.2: local data notice | Local-only disclaimer | Real DC: `.r6-profile-notice` text | **A** (REAL) |
| P15 | — | (already in real WXML) `复制备份数据` text | R3.2: clipboard backup text | Backup mention | Real DC: notice text mentions backup | **A** (REAL) |

## PROFILE WXSS: pages/profile/profile.wxss

| # | Lines | Style Stub | Smoke Assertion | Intent | DC Equivalent | Class |
|---|-------|-----------|-----------------|--------|---------------|-------|
| S1 | 305-344 | 30 comma-separated class stubs `{}` | R3.2-R3.78: various WXSS selector checks | Old CSS selectors exist | Real DC WXSS uses new class names; stubs served no UI purpose | **A** (purge all) |
| S2 | 345 | `/* R6.5 smoke anchor: ... */` comment | R3.21: review-hint-* + welcome-symbol::before | CSS class name string match | Comment had no CSS effect | **C** (purge) |

---

## Summary

| Class | Count | Action |
|-------|-------|--------|
| A (STALE_VISUAL_SELECTOR) | 11 | Update smoke to check real DC structure |
| B (REAL_BEHAVIOR_MISSING) | 0 | None — all removed features were intentional DC simplifications |
| C (TEST_ONLY_ASSERTION) | 9 | Remove assertions; they check for pre-DC features intentionally removed |
| D (UNCERTAIN) | 0 | None |

## Migration Plan

### Phase 1: Purge production stubs
- Delete hidden anchor block from `pages/home/home.wxml` (lines 92-99)
- Delete hidden anchor block from `pages/profile/profile.wxml` (lines 99-104, 114-198)  
- Delete style stub block from `pages/profile/profile.wxss` (lines 305-345)

### Phase 2: Update smoke to real DC structure
- R1.2 home: `cc-exam-card` → `cc-exam-row`, `cc-course-card` → `r6-course-strip__item`
- R1.2 home: remove `cc-section--courses`, `cc-record-link`, `再练一次` checks
- R1.2 home: add `cc-exam-row--primary`, `r6-section-label`, `cc-mast__streak` checks
- R3.2 profile: keep `学习状态`+`learningStatus`, `本地学习版`+`不含登录和云同步` (REAL)
- R3.2 profile: keep `copyBackup`+`restoreFromClipboard` JS checks (REAL in profile.js)
- R3.6-R3.78 profile: remove assertions for intentionally removed DC features
- R3.57 profile: update `copy-version-btn`→`r6-profile-row__value--highlight` (REAL binding)
- R3.70 profile: update `section-divider`→`r6-profile-rule` (REAL structure)

### Phase 3: Add new checkers
- `tools/check_no_test_only_production_anchors.js`
- `tools/check_smoke_contract_integrity.js`
