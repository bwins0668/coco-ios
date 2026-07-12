$ErrorActionPreference = 'Stop'

# ============================================================
# A. 先保护旧 Foundation staged 成果到 %TEMP%
# ============================================================
$foundation = 'G:\项目\study-tools-miniprogram-sr-foundation'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $env:TEMP "study-tools-sr-foundation-backup-$stamp"

New-Item -ItemType Directory -Force $backup | Out-Null

git -C $foundation diff --cached --binary > (Join-Path $backup 'foundation-staged.patch')
Copy-Item (Join-Path $foundation 'tools\spaced_repetition_test_helpers.js') `
  (Join-Path $backup 'spaced_repetition_test_helpers.js') -Force

git -C $foundation status --short > (Join-Path $backup 'foundation-status.txt')
git -C $foundation branch --show-current > (Join-Path $backup 'foundation-branch.txt')
git -C $foundation rev-parse HEAD > (Join-Path $backup 'foundation-head.txt')
git -C $foundation diff --cached -- package.json .gitignore `
  > (Join-Path $backup 'foundation-root-hunks.diff')

Get-FileHash `
  (Join-Path $backup 'foundation-staged.patch'), `
  (Join-Path $backup 'spaced_repetition_test_helpers.js') `
  -Algorithm SHA256 |
  Format-Table -AutoSize |
  Out-File (Join-Path $backup 'sha256.txt') -Encoding utf8

Write-Host "Foundation backup: $backup"
Get-Content (Join-Path $backup 'sha256.txt')

# ============================================================
# B. 修复/确认 P0 runtime 后，先全量验证；任一失败立即停止
# ============================================================
$p0 = 'G:\项目\study-tools-miniprogram'
Set-Location $p0

npm test
if ($LASTEXITCODE) { throw 'npm test failed' }

npm run test:decks
if ($LASTEXITCODE) { throw 'deck integrity failed' }

npm run test:registry
if ($LASTEXITCODE) { throw 'registry failed' }

npm run test:size
if ($LASTEXITCODE) { throw 'size audit failed' }

npm run test:ui
if ($LASTEXITCODE) { throw 'UI contract failed' }

npm run test:content-compliance
if ($LASTEXITCODE) { throw 'content compliance failed' }

npm run test:syntax
if ($LASTEXITCODE) { throw 'syntax failed' }

npm run test:miniprogram-checks-json
if ($LASTEXITCODE) { throw 'JSON leaf checks failed' }

npm run test:miniprogram-checks
if ($LASTEXITCODE) { throw 'normal checks failed' }

npm run test:smoke
if ($LASTEXITCODE) { throw 'smoke failed' }

npm run test:runtime
if ($LASTEXITCODE) { throw 'DevTools runtime E2E still failed' }

npm run test:minium:runtime
if ($LASTEXITCODE) { throw 'Minium runtime matrix did not exit 0' }

git diff --check
if ($LASTEXITCODE) { throw 'diff whitespace check failed' }

# ============================================================
# C. P0 精确暂存：整文件
# ============================================================
git add -- `
  app.js `
  app.json `
  docs/post_autodrive_maintenance.md `
  packages/quiz/data/flashcard_adapter.js `
  packages/quiz/data/flashcard-manifest.js `
  packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js `
  tools/check_flashcard_p0_contract.js `
  tools/check_p0_release_dependency_closure.js `
  tools/run_miniprogram_checks.js

# package.json：
# y 仅选择 test:miniprogram-checks、test:miniprogram-checks-json、
# test:smoke、test:p0-release-closure；
# n 拒绝 bilingual / review batch / budget scripts。
git add -p -- package.json

# smoke：
# y 仅选择 v0.24.0、R3.91、R3.133、deck-select lazy-load 合同；
# n 拒绝任何双语或 translations_zh 假设。
git add -p -- tools/miniprogram_smoke_test.js

# 仅选择本地 loader、严格 count、错误态、重试、UI polish 的 P0 hunk；
# 对任何 translations_zh、中文字段强依赖、review batch hunk 一律 n。
git add -p -- `
  packages/quiz-itpass-1/data/deck-manifest.js `
  packages/quiz-itpass-2/data/deck-manifest.js `
  packages/quiz-itpass-3/data/deck-manifest.js `
  packages/quiz-itpass-4/data/deck-manifest.js `
  packages/quiz-itpass-5/data/deck-manifest.js `
  packages/quiz-sg-1/data/deck-manifest.js `
  packages/quiz-sg-2/data/deck-manifest.js

git add -p -- `
  packages/quiz-itpass-1/pages/flashcard-player/flashcard-player.js `
  packages/quiz-itpass-2/pages/flashcard-player/flashcard-player.js `
  packages/quiz-itpass-3/pages/flashcard-player/flashcard-player.js `
packages/quiz-itpass-4/pages/flashcard-player/flashcard-player.js `
  packages/quiz-itpass-5/pages/flashcard-player/flashcard-player.js `
  packages/quiz-sg-1/pages/flashcard-player/flashcard-player.js `
  packages/quiz-sg-2/pages/flashcard-player/flashcard-player.js

git add -p -- `
  packages/quiz-itpass-1/pages/flashcard-player/flashcard-player.wxml `
  packages/quiz-itpass-2/pages/flashcard-player/flashcard-player.wxml `
  packages/quiz-itpass-3/pages/flashcard-player/flashcard-player.wxml `
  packages/quiz-itpass-4/pages/flashcard-player/flashcard-player.wxml `
  packages/quiz-itpass-5/pages/flashcard-player/flashcard-player.wxml `
  packages/quiz-sg-1/pages/flashcard-player/flashcard-player.wxml `
  packages/quiz-sg-2/pages/flashcard-player/flashcard-player.wxml

git add -p -- `
  tools/audit_miniprogram_package_size.js `
  tools/check_flashcard_deck_integrity.js `
  tools/e2e_flashcard_runtime_test.js `
  tools/minium_flashcard_runtime_test.py `
  utils/storage.js `
  .gitignore

# 绝不能暂存这些 P1 文件：
# packages/quiz-itpass-*/data/loader.js
# packages/quiz-sg-*/data/loader.js
# packages/**/translations_zh.js
# tools/*bilingual*
# tools/*translation*
# tools/*review_batch*
# .ai-bridge/**
# tools/test-artifacts/**
# tools/**/__pycache__/**

# ============================================================
# D. 审计 staged P0 候选
# ============================================================
git diff --cached --name-only

$forbidden = git diff --cached --name-only |
  Select-String 'translations_zh|bilingual|review-batches|\.ai-bridge|test-artifacts|__pycache__'

if ($forbidden) {
  $forbidden
  throw 'P1/artifact file entered staged P0 candidate'
}

git diff --cached --check
if ($LASTEXITCODE) { throw 'staged whitespace check failed' }

node tools/check_p0_release_dependency_closure.js --staged
if ($LASTEXITCODE) { throw 'staged P0 closure failed' }

npm run test:miniprogram-checks-json
if ($LASTEXITCODE) { throw 'candidate JSON gate failed' }

npm run test:miniprogram-checks
if ($LASTEXITCODE) { throw 'candidate normal gate failed' }

npm run test:smoke
if ($LASTEXITCODE) { throw 'candidate smoke failed' }

# ============================================================
# E. 仅在全部 P0 gate 为 0 后提交、推送、建立 clean release worktree
# ============================================================
git commit -m 'fix: stabilize flashcards and prepare v0.24.0 release'
git push origin ui-polish-autodrive-8

$p0Sha = git rev-parse HEAD
$release = Join-Path $env:TEMP ("study-tools-miniprogram-release-v024-" + $p0Sha.Substring(0,8))
git worktree add --detach $release $p0Sha

if (git -C $release status --porcelain) {
  throw 'release worktree is not clean'
}

$unexpected = Get-ChildItem -LiteralPath $release -Recurse -Force -File |
  Where-Object {
    $_.Name -eq 'translations_zh.js' -or
    $_.FullName -match 'review-batches|\.ai-bridge|test-artifacts|__pycache__'
  }

if ($unexpected) {
  $unexpected.FullName
  throw 'P1/artifact found in release worktree'
}

Push-Location $release
npm run test:p0-release-closure
npm run test:miniprogram-checks-json
npm run test:miniprogram-checks
npm run test:runtime
npm run test:minium:runtime
Pop-Location

# ============================================================
# F. P0 通过后，建立 Foundation R2；绝不改写旧 Foundation 分支
# ============================================================
$foundationR2 = 'G:\项目\study-tools-miniprogram-sr-foundation-r2'

git -C $p0 worktree add `
  -b feature/spaced-repetition-foundation-v1-r2 `
  $foundationR2 `
  $p0Sha

git -C $foundationR2 apply --3way (Join-Path $backup 'foundation-staged.patch')

Copy-Item `
  (Join-Path $backup 'spaced_repetition_test_helpers.js') `
  (Join-Path $foundationR2 'tools\spaced_repetition_test_helpers.js') `
  -Force

# 若 package.json / .gitignore 有冲突，只保留 Foundation 最小 hunk，
# 绝不移除 P0 scripts，绝不引入 P1 bilingual scripts。
git -C $foundationR2 add -p -- package.json .gitignore

Push-Location $foundationR2
node tools/run_spaced_repetition_foundation_checks.js
node tools/run_spaced_repetition_foundation_checks.js --json
npm run test:spaced-foundation
npm run test:miniprogram-checks-json
npm run test:miniprogram-checks
npm run test:runtime
npm run test:ui
npm run test:syntax
npm run test:content-compliance
git diff --check
Pop-Location

git -C $foundationR2 add -- `
  utils/spaced-repetition `
  docs/spaced_repetition_v1_foundation.md `
  tools/spaced_repetition_test_helpers.js `
  tools/test_spaced_repetition_identity.js `
  tools/test_spaced_repetition_scheduler.js `
  tools/test_spaced_repetition_storage.js `
  tools/test_spaced_repetition_migration.js `
  tools/test_spaced_repetition_backup_restore.js `
  tools/test_spaced_repetition_events.js `
  tools/test_spaced_repetition_routes.js `
  tools/audit_spaced_repetition_identity.js `
  tools/audit_spaced_repetition_performance.js `
  tools/check_spaced_repetition_foundation.js `
  tools/check_spaced_repetition_no_cross_package_require.js `
  tools/run_spaced_repetition_foundation_checks.js

git -C $foundationR2 diff --cached --check
git -C $foundationR2 commit -m 'feat: add spaced repetition foundation on v0.24.0 baseline'
git -C $foundationR2 push -u origin feature/spaced-repetition-foundation-v1-r2
