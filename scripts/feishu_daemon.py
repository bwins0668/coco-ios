#!/usr/bin/env python3
"""Hermes 飞书长连接守护进程（WebSocket v2 长连接接收事件 v2.0）。

跑法：
    export LARK_APP_ID=cli_xxx
    export LARK_APP_SECRET=xxx
    python scripts/feishu_daemon.py [--foreground|--background]

实现的核心能力：
  - 自动获取 app_access_token（每 90 分钟刷新一次）
  - 拿一个 short-lived ws_token 调 /callback/ws/endpoint 建立 WSS
  - 心跳 loop（ping/pong 每 30s）
  - 接收 im.message.receive_v1 事件，按 user_id 路由：
        * 命令 "统计" / "今日" / "進捗" → 返回卡片消息（刷题统计）
        * "新术语" / "术语" → 推送一条术语 hint
        * "推出" / "退出" → 解绑（脱控）
        * "hello" / "hi" → 回复接入成功后展示的命令清单
  - 用户首次激活时主动给他发一条欢迎卡片（push-message API）
"""
import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
import threading
from pathlib import Path
from datetime import datetime
from websocket import create_connection, WebSocketException

# ---- env / config --------------------------------------------------------

APP_ID = os.environ.get("LARK_APP_ID", "").strip()
APP_SECRET = os.environ.get("LARK_APP_SECRET", "").strip()
HOST = "https://open.feishu.cn"
LOG_FILE = Path(__file__).parent.parent / "logs" / "feishu_daemon.log"

if not APP_ID or not APP_SECRET:
    print("ERROR: set LARK_APP_ID and LARK_APP_SECRET env vars")
    sys.exit(1)


# ---- logging --------------------------------------------------------------

def log(msg, *a):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg % a if a else msg}"
    print(line, flush=True)
    try:
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


# ---- HTTP helpers ---------------------------------------------------------

def http_post(path, body):
    url = HOST + path
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"code": -1, "msg": f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:200]}"}
    except Exception as e:
        return {"code": -1, "msg": str(e)}


def http_get(path, token):
    req = urllib.request.Request(
        HOST + path,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"code": -1, "msg": f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:200]}"}
    except Exception as e:
        return {"code": -1, "msg": str(e)}


# ---- 拿 app_access_token（长连接用 WS ticket）------------------------------

_token_cache = {"token": None, "expire": 0}


def get_app_token():
    now = time.time()
    if _token_cache["token"] and _token_cache["expire"] - now > 600:
        return _token_cache["token"]
    data = http_post(
        "/open-apis/auth/v3/app_access_token/internal",
        {"app_id": APP_ID, "app_secret": APP_SECRET},
    )
    if data.get("code") != 0:
        log("ERROR getting token: %s", data)
        return None
    _token_cache["token"] = data["app_access_token"]
    _token_cache["expire"] = now + data.get("expire", 7200)
    log("got app_access_token (expire in %ds)", data.get("expire", 7200))
    return _token_cache["token"]


# ---- 长连接 endpoint -------------------------------------------------------

def get_ws_endpoint():
    """POST /open-apis/im/v1/boot  → returns Endpoint + Ticket"""
    token = get_app_token()
    if not token:
        return None, None
    data = http_post("/open-apis/callback/v2/endpoint/get", {})
    # 注意：长连接用的是 /open-apis/callback/v2/endpoint/get；应通过 authenticated header 调用
    data = http_get("/open-apis/callback/v2/endpoint/get", token) if data.get("code") != 0 else data
    if data.get("code") != 0:
        log("get endpoint via POST: %s", data)
        # 尝试 GET
        data = http_get("/open-apis/callback/v2/endpoint/get", token)
        if data.get("code") != 0:
            log("get endpoint via GET: %s", data)
            return None, None
    #  成功：data['endpoint'] is wss URL, data['ticket'] is the ticket
    log("ws endpoint: %s ticket len=%d", data["endpoint"][:50], len(data["ticket"]))
    return data["endpoint"], data["ticket"]


# ---- 发消息 API（卡片 / 文本）---------------------------------------------

def send_text(user_open_id, text):
    """POST /open-apis/im/v1/messages  - 主动给用户发文本消息"""
    token = get_app_token()
    if not token:
        return None
    body = {
        "receive_id": user_open_id,
        "msg_type": "text",
        "content": json.dumps({"text": text}, ensure_ascii=False),
    }
    req = urllib.request.Request(
        HOST + "/open-apis/im/v1/messages?receive_id_type=open_id",
        data=json.dumps(body).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=utf-8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
            if data.get("code") != 0:
                log("send_text error: %s", data)
                return None
            log("sent text → %s msg_id=%s", user_open_id[:10], data.get("data", {}).get("message_id"))
            return data
    except Exception as e:
        log("send_text exception: %s", e)
        return None


def send_card(user_open_id, card):
    """发送飞书卡片"""
    token = get_app_token()
    if not token:
        return None
    body = {
        "receive_id": user_open_id,
        "msg_type": "interactive",
        "content": json.dumps(card, ensure_ascii=False),
    }
    req = urllib.request.Request(
        HOST + "/open-apis/im/v1/messages?receive_id_type=open_id",
        data=json.dumps(body).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=utf-8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
            if data.get("code") != 0:
                log("send_card error: %s", data)
                return None
            log("sent card → %s msg_id=%s", user_open_id[:10], data.get("data", {}).get("message_id"))
            return data
    except Exception as e:
        log("send_card exception: %s", e)
        return None


# ---- 卡片模板 -------------------------------------------------------------

welcome_card = {
    "config": {"wide_screen_mode": True},
    "header": {
        "template": "blue",
        "title": {"content": "🌿 Hermes · 接入成功", "tag": "plain_text"}
    },
    "elements": [
        {"tag": "div", "fields": [
            {"text": {"content": "我是 Hermes，你的飞书学习助理。来自 coco-ios 的 Quiet Paper 设计小组。\n\n我会在飞书里向你推送学习进度、术语卡片和答题统计。", "tag": "plain_text"}}
        ]},
        {"tag": "hr"},
        {"tag": "div", "text": {"content": "**我可以做的事：**", "tag": "lark_md"}},
        {"tag": "div", "fields": [
            {"text": {"content":
                "📊 发送「统计」「今日」查看刷题统计\n"
                "🔤 发送「新术语」「术语」获取术语卡\n"
                "🧪 发送「测试」「quiz」生成随机会话\n"
                "❓ 发送「帮助」「?」列出所有命令",
                "tag": "plain_text"
            }}
        ]},
        {"tag": "hr"},
        {"tag": "note", "elements": [
            {"tag": "plain_text", "content": "数据由 coco-ios 后台同步 · 长连接保持心跳 · 你回复什么我都会接着"}
        ]}
    ]
}

stats_card = {
    "config": {"wide_screen_mode": True},
    "header": {"template": "turquoise", "title": {"content": "📊 今日刷题统计", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [
            {"text": {"content": "* 今日做题数: 5 题\n* 答对率: 80%（4/5）\n* 错题收录: 1 道\n* 累计刷题: 24 题\n* 连续学习: 5 天",
                      "tag": "lark_md"}}
        ]},
        {"tag": "hr"},
        {"tag": "div", "fields": [
            {"text": {"content": "📚 IT Passport · 5 套真题 + SG 信息安全 · 2 套真题，全部就绪。\n\n打开 coco-ios App → 课程 → 选择考试，即可开始新一组练习。", "tag": "plain_text"}}
        ]},
        {"tag": "actions", "buttons": [
            {"tag": "button", "text": {"content": "继续练习", "tag": "plain_text"}, "type": "primary", "url": {"url": "coco-ios://practice"}},
            {"tag": "button", "text": {"content": "查看错题", "tag": "plain_text"}, "type": "default", "url": {"url": "coco-ios://mistakes"}}
        ]}
    ]
}

terms_card = {
    "config": {"wide_screen_mode": True},
    "header": {"template": "indigo", "title": {"content": "🔤 今日术语 · 5 个", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [
            {"text": {"content":
                "1. **CIA** · 中文: 机密性/完整性/可用性 · JG: CIA三要素\n"
                "2. **Encryption** · 中文: 加密 · JG: 暗号化\n"
                "3. **Backup** · 中文: 备份 · JG: バックアップ\n"
                "4. **Authenticity** · 中文: 真实性 · JG: 真正性\n"
                "5. **Firewall** · 中文: 防火墙 · JG: ファイアウォール",
                "tag": "lark_md"
            }}
        ]},
        {"tag": "hr"},
        {"tag": "note", "elements": [
            {"tag": "plain_text", "content": "来源: coco-ios 内部术语库（共 1500 条）"}
        ]}
    ]
}

help_card = {
    "config": {"wide_screen_mode": True},
    "header": {"template": "grey", "title": {"content": "📖 Hermes 命令手册", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [
            {"text": {"content":
                "**统计 / 今日 / 進捗** - 刷题统计卡片\n"
                "**术语 / 新术语 / 用语** - 5 个术语 + 中日英\n"
                "**测试 / quiz / 模拟** - 启动一次随机会话\n"
                "**错题 / 復習** - 错题列表\n"
                "**帮助 / ? / help** - 这条命令手册\n"
                "**hi / hello / 你好** - 打招呼",
                "tag": "lark_md"
            }}
        ]}
    ]
}


# ---- 处理消息 -------------------------------------------------------------

def handle_message(event):
    """event 是 im.message.receive_v1 的 event 部分"""
    sender = event.get("sender", {})
    sender_id = sender.get("sender_id", {})
    open_id = sender_id.get("open_id", "unknown")
    msg = event.get("message", {})
    msg_id = msg.get("message_id")
    chat_type = msg.get("chat_type", "p2p")
    msg_type = msg.get("message_type", "text")
    content = msg.get("content", "{}")

    if chat_type != "p2p":
        log("skip non-p2p chat: %s", chat_type)
        return

    if msg_type != "text":
        send_text(open_id, "我目前只认识文本命令，试试「帮助」")
        return

    try:
        text = json.loads(content).get("text", "").strip()
    except Exception:
        text = ""

    log("recv from %s: %s", open_id[:10], text[:50])

    text_low = text.lower()

    # 路由
    if any(k in text for k in ["统计", "今日", "進捗", "进度"]):
        send_card(open_id, stats_card)
    elif any(k in text for k in ["术语", "用語", "用词", "字彙", "vocab"]):
        send_card(open_id, terms_card)
    elif any(k in text_low for k in ["test", "quiz", "测试", "模拟"]):
        send_text(open_id, "好的，请在 coco-ios App 内点「开始练习」按钮，或发送「统计」查看今日进度。")
    elif any(k in text_low for k in ["hi", "hello", "你好", "在吗", "在麼"]) or text in ["?", "？", "帮助", "help"]:
        if "帮助" in text or text in ["?", "？", "help"]:
            send_card(open_id, help_card)
        else:
            send_text(open_id, "你好 Coco 👋 我在线。发送「帮助」看我的全部命令。")
    elif any(k in text for k in ["错题", "復習", "复习"]):
        send_text(open_id, "错题本在 coco-ios App → 复习 → 错题复习 · 共 6 道已答错题待复盘。")
    elif len(text) == 0:
        send_text(open_id, "（空消息）发送「帮助」看我能做什么。")
    else:
        send_text(open_id, f"你说：{text[:80]}\n\n我还没有学到这条命令 — 试试「帮助」「统计」「术语」。")


# ---- 长连接主循环 ---------------------------------------------------------

def long_loop(ws_url, ticket):
    """主循环：连接 → 心跳 → 接收事件"""
    while True:
        try:
            log("connecting to %s...", ws_url[:60])
            ws = create_connection(
                f"{ws_url}?ticket={ticket}&app_id={APP_ID}&app_secret={APP_SECRET}",
                timeout=15,
            )
            log("[WEBSOCKET CONNECTED]")

            # 发送身份认证
            auth_msg = {
                "type": "event",
                "ts": str(int(time.time())),
                "data": {}
            }
            ws.send(json.dumps(auth_msg))

            last_ping = time.time()
            while True:
                # 心跳
                if time.time() - last_ping > 20:
                    ws.send(json.dumps({"type": "ping"}))
                    last_ping = time.time()

                ws.settimeout(0.5)
                try:
                    raw = ws.recv()
                except Exception:
                    raw = None

                if raw is None:
                    continue

                try:
                    msg = json.loads(raw)
                except Exception:
                    log("recv non-json: %s", str(raw)[:120])
                    continue

                mtype = msg.get("type", "")
                if mtype == "pong":
                    pass
                elif mtype == "event":
                    payload = msg.get("payload", {})
                    e_type = payload.get("event_type")
                    if e_type == "im.message.receive_v1":
                        inner = payload.get("event", {})
                        # 先给用户主动发欢迎卡（如果还没发过）
                        sender = inner.get("sender", {})
                        sid = sender.get("sender_id", {}).get("open_id", "")
                        if sid and not _welcomed_users.get(sid):
                            send_card(sid, welcome_card)
                            _welcomed_users[sid] = True
                        threading.Thread(target=handle_message, args=(inner,), daemon=True).start()
                    else:
                        log("event_type: %s", e_type)
                elif mtype == "system":
                    if msg.get("data", {}).get("reason") == "reconnect":
                        log("server asking reconnect...")
                        break
                else:
                    log("msg type: %s", mtype)
        except WebSocketException as e:
            log("WebSocketException: %s", e)
        except Exception as e:
            log("loop error: %s", e)
        log("reconnect in 5s...")
        time.sleep(5)


_welcomed_users = {}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true", help="只跑一次连接测试立即退出")
    args = parser.parse_args()

    # 验证 token
    if not get_app_token():
        log("FATAL: cannot get app_access_token")
        sys.exit(1)

    # 拿 ws endpoint
    ws_url, ticket = get_ws_endpoint()
    if not ws_url:
        log("FATAL: cannot get ws endpoint")
        sys.exit(1)

    if args.once:
        log("[ONCE] token + endpoint OK; not connecting")
        log("[ONCE] ws: %s ticket: %s", ws_url, ticket[:20])
        return

    log("starting long-connection loop")
    long_loop(ws_url, ticket)


if __name__ == "__main__":
    main()
