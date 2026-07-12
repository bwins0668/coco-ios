# R6.3 Tab Root Layout Contract

## TabBar Dimensions
- Height: `100rpx` + `env(safe-area-inset-bottom)`
- Position: `fixed; bottom: 0; z-index: 999`
- Background: `var(--qp-color-surface)` (#FFFDF5) — opaque
- Top border: `1rpx solid var(--qp-color-line)`

## Shared Bottom Inset Contract
All 5 tab root pages MUST use the same bottom padding formula:
`padding-bottom: calc(100rpx + env(safe-area-inset-bottom))`

| Route | Container | Padding |
|---|---|---|
| pages/home/home | .cc-home | calc(100rpx + env(...)) |
| pages/practice/practice | .practice-page | calc(100rpx + env(...)) |
| pages/review/review | .review-page | calc(100rpx + env(...)) |
| pages/glossary/glossary | .container | calc(100rpx + env(...)) |
| pages/profile/profile | .container | calc(100rpx + env(...)) |

## Verification
- `tools/check_r6_3_tabbar_runtime_layout_contract.js`
- Must PASS for all 5 tab pages
