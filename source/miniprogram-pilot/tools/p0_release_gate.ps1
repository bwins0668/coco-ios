$ErrorActionPreference = 'Stop'

# ============================================================
# 0. 进入 P0 主仓库，确认现场
# ============================================================
$Repo = 'G:\项目\study-tools-miniprogram'
Set-Location -LiteralPath $Repo

$branch = (git branch --show-current).Trim()
if ($branch -ne 'ui-polish-autodrive-8') {
  throw "Unexpected branch: $branch"
}

git status --short
git log --oneline -3
git diff --check

# ============================================================
# 1. 先确认关键脚本真实存在并可执行
# ============================================================
$requiredScripts = @(
  'test:p0-release-closure',
  'test:miniprogram-checks-json',
  'test:miniprogram-checks',
  'test:runtime',
  'test:minium:runtime'
)

$scripts = node -e "console.log(JSON.stringify(require('./package.json').scripts || {}))" | ConvertFrom-Json

foreach ($name in $requiredScripts) {
  if (-not $scripts.PSObject.Properties.Name.Contains($name)) {
    throw "Missing package script: $name"
  }
  Write-Host "PASS script exists: $name"
}

# ============================================================
# 2. 先跑发布硬门禁；任何失败立即停止，不暂存
# ============================================================
npm run test:p0-release-closure
if ($LASTEXITCODE) { throw 'P0 release closure failed' }

npm run test:miniprogram-checks-json
if ($LASTEXITCODE) { throw 'JSON checks failed' }

npm run test:miniprogram-checks
if ($LASTEXITCODE) { throw 'Normal miniprogram checks failed' }

npm run test:runtime
if ($LASTEXITCODE) { throw 'Runtime gate failed: do not stage or commit' }

npm run test:minium:runtime
if ($LASTEXITCODE) { throw 'Minium runtime gate failed: do not stage or commit' }

npm test
if ($LASTEXITCODE) { throw 'Deck integrity failed' }

npm run test:registry
if ($LASTEXITCODE) { throw 'Registry failed' }

npm run test:size
if ($LASTEXITCODE) { throw 'Size audit failed' }

npm run test:ui
if ($LASTEXITCODE) { throw 'UI contract failed' }

npm run test:syntax
if ($LASTEXITCODE) { throw 'Syntax failed' }

npm run test:content-compliance
if ($LASTEXITCODE) { throw 'Content compliance failed' }

git diff --check
if ($LASTEXITCODE) { throw 'Whitespace check failed' }

# ============================================================
# 3. 精确暂存 P0 的"脚本闭包补丁"
#    只在上述所有门禁通过后执行
# ============================================================
git add -- `
  package.json `
  tools/run_miniprogram_checks.js `
  tools/miniprogram_smoke_test.js `
  tools/check_p0_release_dependency_closure.js `
  tools/e2e_flashcard_runtime_test.js `
  tools/minium_flashcard_runtime_test.py `
  tools/check_runtime_gate_truthfulness.js `
  docs/post_autodrive_maintenance.md

# 不存在的文件会报错；逐个确认并移除不存在项后重试。
# 绝不使用 git add . 或 git add -A。

git diff --cached --name-only

$forbidden = git diff --cached --name-only |
  Select-String 'translations_zh|bilingual|review-batches|\.ai-bridge|test-artifacts|__pycache__'

if ($forbidden) {
  $forbidden
  throw 'P1 or artifact entered staged candidate'
}

git diff --cached --check
if ($LASTEXITCODE) { throw 'Staged diff check failed' }

node tools/check_p0_release_dependency_closure.js --staged
if ($LASTEXITCODE) { throw 'Staged P0 closure failed' }

# ============================================================
# 4. 提交与推送
# ============================================================
git commit -m "test: restore release verification scripts"
git push origin ui-polish-autodrive-8

$P0Head = (git rev-parse HEAD).Trim()
Write-Host "P0 commit: $P0Head"

# ============================================================
# 5. 创建真正干净的 release worktree
# ============================================================
$Release = Join-Path $env:TEMP ("study-tools-release-v024-" + $P0Head.Substring(0,8))

if (Test-Path -LiteralPath $Release) {
  throw "Release worktree path already exists: $Release"
}

git worktree add --detach $Release $P0Head

if (git -C $Release status --porcelain) {
  throw 'Release worktree is dirty'
}

Push-Location $Release

npm run test:p0-release-closure
if ($LASTEXITCODE) { throw 'Clean worktree P0 closure failed' }
npm run test:miniprogram-checks-json
if ($LASTEXITCODE) { throw 'Clean worktree JSON checks failed' }

npm run test:miniprogram-checks
if ($LASTEXITCODE) { throw 'Clean worktree normal checks failed' }

npm run test:runtime
if ($LASTEXITCODE) { throw 'Clean worktree runtime failed' }

npm run test:minium:runtime
if ($LASTEXITCODE) { throw 'Clean worktree Minium runtime failed' }

npm test
if ($LASTEXITCODE) { throw 'Clean worktree deck integrity failed' }

npm run test:registry
npm run test:size
npm run test:ui
npm run test:syntax
npm run test:content-compliance

Pop-Location

Write-Host ''
Write-Host 'P0_RELEASE_WORKTREE_VERIFIED'
Write-Host "release worktree: $Release"
Write-Host "release commit: $P0Head"
