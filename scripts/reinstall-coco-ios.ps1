#!/usr/bin/env pwsh
# reinstall-coco-ios.ps1
# 一键：拉取最新 CI 无签名 IPA -> 重组标准 Payload -> zsign 重签 -> 安装到 Coco的iPhone
# 支持 USB 或 无线（手机开启「通过网络连接」且同 Wi-Fi 时免线）。
param(
  [string]$Udid = "00008130-000E60A61E30001C"
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Repo = Split-Path -Parent $Root
$ProjRoot = Split-Path -Parent $Repo   # G:\项目
$Local = Join-Path $ProjRoot "_local\ios-sign"
$Zsign = Join-Path $Local "zsign.exe"
$CertDir = Join-Path $ProjRoot ".hermes\desktop-attachments"
$P12 = Join-Path $CertDir "4KQ5JXJ558_330DB5FB7B971B1D0325152CDEDC788C.p12"
$MP  = Join-Path $CertDir "4KQ5JXJ558_330DB5FB7B971B1D0325152CDEDC788C.mobileprovision"
$P12Pass = "1"
$BundleId = "com.CLaov.M3EM"

Write-Host "==> 查找最新 CI 构建 ..." -ForegroundColor Cyan
$run = (gh run list --repo bwins0668/coco-ios --limit 1 --json databaseId,conclusion | ConvertFrom-Json) | Select-Object -First 1
if ($run.conclusion -ne 'success') { Write-Error "最新 CI 未成功: $($run.conclusion)"; exit 1 }
$runId = $run.databaseId
Write-Host "    使用 run #$runId"

$Unsigned = Join-Path $Repo "CoCoiOS-unsigned.ipa"
if (Test-Path $Unsigned) { Remove-Item $Unsigned }
gh run download $runId -n CoCoiOS-unsigned.ipa -D $Repo
if (-not (Test-Path $Unsigned)) { Write-Error "未下载到 IPA"; exit 1 }

$PayloadIpa = Join-Path $Repo "CoCoiOS-payload.ipa"
$PyScript = Join-Path $Root "repackage_to_payload.py"
& python $PyScript $Unsigned $PayloadIpa

$Signed = Join-Path $Repo "CoCoiOS-signed.ipa"
if (Test-Path $Signed) { Remove-Item $Signed }
Write-Host "==> zsign 重签 ..." -ForegroundColor Cyan
& $Zsign -k $P12 -p $P12Pass -m $MP -b $BundleId -o $Signed $PayloadIpa
if (-not (Test-Path $Signed)) { Write-Error "重签失败"; exit 1 }

Write-Host "==> 安装到 $Udid ..." -ForegroundColor Cyan
tidevice -u $Udid install $Signed
Write-Host "==> 完成。手机桌面应出现/更新 CoCo 学习" -ForegroundColor Green
