$ErrorActionPreference = 'Stop'

Set-Location -LiteralPath 'G:\项目\study-tools-miniprogram'

# 0. 确认当前分支与现场
$branch = (git branch --show-current).Trim()
if ($branch -ne 'ui-polish-autodrive-8') {
  throw "Unexpected branch: $branch"
}

git status --short
git diff --check

# 1. 先查看这几个文件当前是否真的有未提交 P0 改动
git diff -- `
  package.json `
  tools/run_miniprogram_checks.js `
  tools/miniprogram_smoke_test.js `
  tools/check_p0_release_dependency_closure.js `
  tools/e2e_flashcard_runtime_test.js `
  tools/minium_flashcard_runtime_test.py

# 2. 精确暂存已有的 P0 工具文件
# 不包含不存在的 check_runtime_gate_truthfulness.js
git add -- `
  tools/run_miniprogram_checks.js `
  tools/miniprogram_smoke_test.js `
  tools/check_p0_release_dependency_closure.js `
  tools/e2e_flashcard_runtime_test.js `
  tools/minium_flashcard_runtime_test.py

# 3. package.json 只选 P0 release / runtime 脚本
git add -p -- package.json

# 选择原则：
# y：test:p0-release-closure
# y：test:miniprogram-checks-json
# y：test:miniprogram-checks
# y：test:runtime
# y：test:minium:runtime
# n：任何 bilingual / translation / review batch / budget 脚本

# 4. 检查暂存区
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check

$forbidden = git diff --cached --name-only |
  Select-String 'translations_zh|bilingual|review-batches|\.ai-bridge|test-artifacts|__pycache__'

if ($forbidden) {
  $forbidden
  throw 'P1 or artifact entered staged candidate'
}

# 5. 确认 package.json 中已暂存的脚本变化只有目标 P0 脚本
git diff --cached -- package.json

# 6. 用当前暂存候选再跑闭包审计
node tools/check_p0_release_dependency_closure.js --staged
if ($LASTEXITCODE) { throw 'Staged P0 closure failed' }

# 7. 提交与推送
git commit -m "test: restore release verification scripts"
git push origin ui-polish-autodrive-8

$P0Head = (git rev-parse HEAD).Trim()
Write-Host "P0 supplemental commit: $P0Head"

# 8. 建立新的干净 release worktree
$Release = Join-Path $env:TEMP ("study-tools-release-v024-" + $P0Head.Substring(0,8))

if (Test-Path -LiteralPath $Release) {
  throw "Release directory already exists: $Release"
}

git worktree add --detach $Release $P0Head

if (git -C $Release status --porcelain) {
  throw 'Release worktree is dirty'
}

# 9. 在干净提交环境复验
Push-Location $Release

node -e "console.log(require('./package.json').scripts || {})"

npm run test:p0-release-closure
if ($LASTEXITCODE) { throw 'Clean P0 closure failed' }

npm run test:miniprogram-checks-json
if ($LASTEXITCODE) { throw 'Clean JSON gate failed' }

npm run test:miniprogram-checks
if ($LASTEXITCODE) { throw 'Clean normal gate failed' }

npm run test:runtime
if ($LASTEXITCODE) { throw 'Clean runtime failed' }

npm run test:minium:runtime
if ($LASTEXITCODE) { throw 'Clean Minium runtime failed' }

npm test
if ($LASTEXITCODE) { throw 'Clean deck integrity failed' }

npm run test:registry
if ($LASTEXITCODE) { throw 'Clean registry failed' }

npm run test:size
if ($LASTEXITCODE) { throw 'Clean size audit failed' }

npm run test:ui
if ($LASTEXITCODE) { throw 'Clean UI contract failed' }

npm run test:syntax
if ($LASTEXITCODE) { throw 'Clean syntax failed' }

npm run test:content-compliance
if ($LASTEXITCODE) { throw 'Clean content compliance failed' }

git diff --check
if ($LASTEXITCODE) { throw 'Clean diff check failed' }

Pop-Location

Write-Host ''
Write-Host 'P0_RELEASE_WORKTREE_VERIFIED'
Write-Host "release commit: $P0Head"
Write-Host "release worktree: $Release"
