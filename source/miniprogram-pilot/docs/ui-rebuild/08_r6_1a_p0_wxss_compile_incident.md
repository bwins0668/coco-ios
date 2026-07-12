# R6.1A-P0 WXSS Compilation Incident

## Impact
Global white screen on cold start. All tab pages failed to render because
the shared custom-tab-bar component could not compile its WXSS, causing a
cascading `Error: timeout`.

## Root Cause
`custom-tab-bar/index.wxss` used an incorrect relative import path:

```
@import "../../styles/tokens.wxss";
```

`custom-tab-bar/` is at depth 1 from the project root (same level as
`styles/`). The correct relative path from depth 1 to reach `styles/`
at root is `../styles/tokens.wxss`. The double `../../` caused the
WeChat compiler to resolve past the project root boundary, resulting in
the import failure.

Compare with depth-2 directories like `pages/home/` and
`components/option-item/` which correctly use `../../styles/tokens.wxss`.

## Fix
Changed `../../styles/tokens.wxss` to `../styles/tokens.wxss` in
`custom-tab-bar/index.wxss` (one character edit).

No new token files were created. No token values were changed. The
existing canonical `styles/tokens.wxss` remains the single source of
truth for Quiet Paper design tokens.

## Prevention
Added `tools/check_wxss_import_resolution.js` — a deterministic static
check that:

1. Scans all git-tracked `.wxss` files
2. Parses every `@import` directive
3. Resolves the relative path against the file's directory
4. Verifies the resolved target file exists on disk
5. Fails with exact file and import line if any import is unresolved

This check catches any WXSS import path error without requiring the
WeChat Developer Tools compiler.

## Verification
All automated gates pass:
- `check_wxss_import_resolution.js`: 28/28 imports resolve
- `check_r6_1_active_tab_binding.js`: 64/64 PASS
- `run_miniprogram_checks.js --json`: 18/18 PASS
- `check_r6_ui_rebuild_contract.js`: 64/64 PASS
- `check_ui_visual_contract.js`: PASS
- `check_theme_coverage.js`: PASS (47 pages)
- `check_design_tokens.js`: 0 violations
- `audit_miniprogram_package_size.js`: PASS
- `miniprogram_smoke_test.js`: 159/1 (only pre-existing R3.31)
- `git diff --check`: PASS

## Manual Verification Required
1. Rebuild in WeChat Developer Tools
2. Cold start → pages/home/home
3. Confirm no WXSS compilation error in Console
4. Switch through all 5 tabs (课程/刷题/复习/术语/我的)
5. Check course, glossary, profile pages render without white screen
6. Screenshot at 390px for all three main tabs