# R6.3 Manual Visual Acceptance

Status: READY_FOR_MANUAL_VISUAL_PROOF

## DC HTML Authority
- File: `G:\项目\mini design\IT学习小程序 全站重构.dc.html`
- SHA256: `D7B90281142A6722A938270AA702DD68CBBFC451CAAAE656C24F683BE3D95DF0`
- Frames: 22 data-screen-label entries

## Course Page (pages/home/home)
| Check | Steps |
|---|---|
| JST date | Verify masthead shows 令和X年M月D日 (JST current date). Must be dynamic, not hardcoded. |
| Streak | Verify "连续 X 天" below date when streak > 0 |
| Course strip | Verify Py+Python, Ja+Java, Alg+算法基础 are separate stacked items. No "PyPython" concatenation. |
| Exam rows | Verify IT Passport/SG rows with accent border |
| 375/430px | Verify layout at narrow/wide widths |

## Practice Page (pages/practice/practice)
| Check | Steps |
|---|---|
| IT/SG/MO cards | Verify icon (64rpx) + body + chevron three-column layout. No overlap. |
| Continue card | Verify "CONTINUE · 继续上次" with exam name |
| Section numbering | Verify "01 选择考试" label |
| 375/430px | Verify layout |

## All Tab Pages
| Check | Steps |
|---|---|
| Bottom spacing | Verify last content item scrolls fully above tabbar on all 5 tabs |
| Tabbar opaque | Verify no content shows through tabbar background |
| Active state | Verify correct tab highlighted (#37418A) on switch |

## Quiz Page
| Check | Steps |
|---|---|
| Option feedback | Verify selected/correct/wrong states with QP token colors |