# R6.2 Runtime Layout Contract

## TabBar Dimensions
- Height: `100rpx` + `env(safe-area-inset-bottom)`
- Positioning: `position: fixed; bottom: 0`
- Z-index: `999`
- Background: `var(--qp-color-surface)` (#FFFDF5, opaque)
- Top border: `1rpx solid var(--qp-color-line)`

## Page Bottom Spacing
Every tab page (pages/home, pages/practice, pages/review, pages/glossary, pages/profile) must reserve bottom space matching the tabbar height.

### Tab Page Containers
| Route | Container Class | Bottom Padding |
|---|---|---|
| pages/home/home | `.cc-home` | `calc(100rpx + env(safe-area-inset-bottom))` |
| pages/practice/practice | `.practice-page` | `calc(100rpx + env(safe-area-inset-bottom))` |
| pages/review/review | `.review-page` | `calc(100rpx + env(safe-area-inset-bottom))` |
| pages/glossary/glossary | `.container` | `calc(100rpx + env(safe-area-inset-bottom))` |
| pages/profile/profile | `.container` | `calc(100rpx + env(safe-area-inset-bottom))` |

### Sub-package Pages
Sub-package pages (non-tab routes) may NOT have a visible tabbar when navigated to via navigateTo. However, pages that are also reachable via switchTab must include the bottom padding.

## ScrollView Rules
- Last item in any scroll list must be completely visible above the tabbar.
- Scroll containers that cover the full viewport height should account for the tabbar height.

## Safe Area Rules
- iPhone Home Indicator area must be handled by `env(safe-area-inset-bottom)` on both the tabbar and page containers.
- At 375px, 390px, and 430px widths, no content should be obscured by the tabbar or home indicator.

## Non-Tab Pages
Secondary pages (course detail, quiz, chapter list, etc.) opened via navigateTo do NOT display the tabbar. These pages do not need the extra bottom padding.

## Verification
- `tools/check_r6_2_tabbar_containment.js` verifies all tab pages have adequate bottom padding.
- Manual visual verification must confirm no content overlaps with tabbar on all 5 tabs at 390px device width.