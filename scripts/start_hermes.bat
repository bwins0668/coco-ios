# 一键启动 Hermes (Windows 批处理)
# 把这个文件放进 Windows 启动文件夹, 开机自动跑

@echo off
title Hermes feishu daemon
setlocal

set LARK_APP_ID=
set LARK_APP_SECRET=
REM 真实使用应该从某个非公开位置 (例如 %LOCALAPPDATA%\hermes\feishu.env) 读取
REM 这里先从环境变量读，没有则跳过
if "%LARK_APP_SECRET%"=="" (
  if exist "C:\Users\lvgua\AppData\Local\hermes\feishu.env" (
    for /f "tokens=*" %%a in ('type "C:\Users\lvgua\AppData\Local\hermes\feishu.env"') do (
      set %%a
    )
  )
)

cd /d G:\项目\coco-ios

REM 启动 webhook
start /b "Hermes webhook" cmd /c ^
  "python scripts/feishu_webhook.py >> logs\webhook.out.log 2>&1"

REM 启动 ngrok
start /b "ngrok" cmd /c ^
  ""%LocalAppData%\Microsoft\WindowsApps\ngrok.exe" http 9876 -log=logs\ngrok.out.log"

echo Hermes 启动中... 端口 9876
timeout /t 5 /nobreak > nul
curl http://127.0.0.1:9876/healthz
echo.
echo ngrok 公网 URL 写入 logs\ngrok.out.log
type logs\ngrok.out.log | findstr /i "started tunnel"
pause
