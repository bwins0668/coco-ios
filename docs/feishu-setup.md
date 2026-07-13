# Hermes 飞书机器人接入指南

Hermes 是 coco-ios 自建应用，名称就叫 "Hermes"，跑在 Feishu OpenAPI。

## 架构

```
+----------------+        +--------+        +-------------------+
| 用户飞书 App   | <----> | ngrok  | <----> | 本机 webhook 服务 |
| (扫码 + 消息) |        | 公网 URL|        | (Python Flask)    |
+----------------+        +--------+        +-------------------+
                                                        |
                                            飞书 OpenAPI 调用
                                                       \|
                                              +-----------------------+
                                              | coco-ios 学习状态    |
                                              | (SwiftData + Storage) |
                                              +-----------------------+
```

## 启动链 (当前已经在跑)

| 进程 | PID | 端口 | 日志 |
|------|-----|------|------|
| `python scripts/feishu_webhook.py` | 28428 | 9876 | `logs/feishu_webhook.stdout.log` |
| `ngrok http 9876` | 28540 | 4040(mgmt) | `logs/ngrok.stdout.log` |

**当前公网回调地址**: <https://large-apostle-wreath.ngrok-free.dev/open-apis/event/v1/callback>

## 后台配置（一次性）

打开 <https://open.feishu.cn/app> → 选 Hermes → 左侧:

1. **事件与回调**:
   - 回调订阅方式选 "**将事件发送至开发者服务器**" (callback 2.0)
   - 回调 URL: `https://large-apostle-wreath.ngrok-free.dev/open-apis/event/v1/callback`
   - Verification Token: `hermes-default-verify`
   - Encrypt Key: (留空)
2. **事件权限** → 添加 `im.message.receive_v1` (机器人接收消息)
3. **应用权限** → 确认有 `im:message:send` / `im:message.p2p_msg:readonly` / `im:message.group_at_msg:readonly`

完成保存 → Herme 状态变成 "已接通" → 你手机飞书给 Hermes 发 "帮助" 即可。

## 命令清单（按 Hermes 已实现）

| 用户输入 | Hermes 响应 |
|----------|-------------|
| 帮助 / ? / help | 帮助卡片 |
| 统计 / 今日 / 进度 | 统计卡片 |
| 术语 / 新术语 | 5 个术语卡片 |
| 错题 / 复习 | 错题列表文字 |
| hi / hello / 你好 | 打招呼 + 提示帮助 |

## 重新启动

```bash
# 杀进程
netstat -ano | findstr :9876
taskkill /PID 28428 /F

# 重新启动 webhook
export LARK_APP_ID=cli_xxx
export LARK_APP_SECRET=yyy
python scripts/feishu_webhook.py > logs/feishu_webhook.stdout.log 2>&1 &

# 重新启动 ngrok（如果用免费版，每次 URL 都变）
ngrok http 9876
```

⚠️ **注意**：ngrok 免费版每次启动 URL 都变。重启后你需要：
1. 把新的 ngrok URL 替换到 `docs/feishu-setup.md`
2. 替换到飞书后台 "事件与回调 → 回调 URL"

或者升级 ngrok 付费版保留固定子域名。

## 环境变量

所有 secret 通过环境变量传入，**不入仓库**：
- `LARK_APP_ID` (cli_xxx)
- `LARK_APP_SECRET`
- `LARK_VERIFY_TOKEN` (默认 `hermes-default-verify`)
- `LARK_ENCRYPT_KEY` (空 = 不加密)
- `LARK_PORT` (默认 9876)

## 文件清单

| 文件 | 作用 |
|------|------|
| `scripts/feishu_bot.py` | QR PNG 生成 |
| `scripts/feishu_verify.py` | 验证 App/Bot 状态 |
| `scripts/feishu_daemon.py` | 旧版长连接版本（未启用，留存备用） |
| `scripts/feishu_webhook.py` | 当前生产版 - Flask webhook |
| `scripts/feishu-bot-qr.png` | 加 bot 二维码 |
| `docs/feishu-setup.md` | 本文档 |
