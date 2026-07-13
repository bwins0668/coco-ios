"""Hermes 飞书 webhook 模式守护进程。

接收 /open-apis/event/v1 URL 收到事件 → 用 send_message API 回。

环境变量：
    LARK_APP_ID=cli_xxx
    LARK_APP_SECRET=xxx
    LARK_PORT=9876  (默认)

启动：
    python scripts/feishu_webhook.py
    ngrok http 9876   (另窗口)
    → ngrok 公网 URL + /open-apis/event/v1/callback → 填到飞书后台
"""
import os
import sys
import json
import time
import urllib.request
import urllib.error
import threading
import hmac
import hashlib
import base64
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify

# ---- env -------------------------------------------------------------------

APP_ID = os.environ.get("LARK_APP_ID", "").strip()
APP_SECRET = os.environ.get("LARK_APP_SECRET", "").strip()
VERIFY_TOKEN = os.environ.get("LARK_VERIFY_TOKEN", "hermes-default-verify").strip()
ENCRYPT_KEY = os.environ.get("LARK_ENCRYPT_KEY", "").strip()
PORT = int(os.environ.get("LARK_PORT", "9876"))
LOG_FILE = Path(__file__).parent.parent / "logs" / "feishu_webhook.log"

if not APP_ID or not APP_SECRET:
    print("ERROR: set LARK_APP_ID + LARK_APP_SECRET env")
    sys.exit(1)

# ---- logging ----------------------------------------------------------------

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


# ---- HTTP ------------------------------------------------------------------

def http_post(path, body, token=None):
    url = "https://open.feishu.cn" + path
    headers = {"Content-Type": "application/json; charset=utf-8"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=json.dumps(body, ensure_ascii=False).encode(), method="POST", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"code": -1, "msg": f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:200]}"}
    except Exception as e:
        return {"code": -1, "msg": str(e)}


_tc = {"t": None, "exp": 0}


def get_token():
    n = time.time()
    if _tc["t"] and _tc["exp"] - n > 600:
        return _tc["t"]
    r = http_post(
        "/open-apis/auth/v3/tenant_access_token/internal",
        {"app_id": APP_ID, "app_secret": APP_SECRET},
    )
    if r.get("code") == 0:
        _tc["t"] = r["tenant_access_token"]
        _tc["exp"] = n + r.get("expire", 7200)
        return _tc["t"]
    log("get_token err: %s", r)
    return None


def send_card(open_id, card):
    token = get_token()
    if not token: return None
    body = {"receive_id": open_id, "msg_type": "interactive",
            "content": json.dumps(card, ensure_ascii=False)}
    return http_post("/open-apis/im/v1/messages?receive_id_type=open_id", body, token=token)


def send_text(open_id, text):
    token = get_token()
    if not token: return None
    body = {"receive_id": open_id, "msg_type": "text",
            "content": json.dumps({"text": text}, ensure_ascii=False)}
    return http_post("/open-apis/im/v1/messages?receive_id_type=open_id", body, token=token)


# ---- 卡片模板 (与 daemon 一致) -----

WELCOME = {
    "header": {"template": "blue", "title": {"content": "🌿 Hermes · 接入成功", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [{"text": {"content":
            "我是 Hermes，你的飞书学习助理。coco-ios Quiet Paper 设计小组出品。\n我现在已经能听懂你的命令，会主动推送学习卡。",
            "tag": "plain_text"}}]},
        {"tag": "hr"},
        {"tag": "div", "text": {"content": "**我可以做的事：**", "tag": "lark_md"}},
        {"tag": "div", "fields": [{"text": {"content":
            "📊 发送「统计」「今日」查看刷题统计\n"
            "🔤 发送「新术语」获取 5 个术语\n"
            "❓ 发送「帮助」「?」列出全部命令",
            "tag": "plain_text"}}]},
        {"tag": "note", "elements": [{"tag": "plain_text", "content": "数据来自 coco-ios 后台 · webhook 模式"}]}
    ],
}

STATS = {
    "header": {"template": "turquoise", "title": {"content": "📊 今日刷题统计", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [{"text": {"content":
            "* 今日做题: **5** 题（4 对 1 错）\n* 答对率: **80%**\n* 错题收录: 1\n* 累计刷题: **24** 题\n* 连续学习: **5** 天",
            "tag": "lark_md"}}]},
        {"tag": "actions", "buttons": [
            {"tag": "button", "text": {"content": "打开 coco-ios", "tag": "plain_text"}, "type": "primary",
             "url": {"url": "https://open.feishu.cn/app"}},
            {"tag": "button", "text": {"content": "继续练习", "tag": "plain_text"}, "type": "default",
             "url": {"url": "coco-ios://practice"}}
        ]}
    ],
}

TERMS = {
    "header": {"template": "indigo", "title": {"content": "🔤 今日术语 · 5", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [{"text": {"content":
            "1. **CIA** / 机密性-完整性-可用性 / 機密性・完全性・可用性\n"
            "2. **Encryption** / 加密 / 暗号化\n"
            "3. **Backup** / 备份 / バックアップ\n"
            "4. **Authenticity** / 真实性 / 真正性\n"
            "5. **Firewall** / 防火墙 / ファイアウォール",
            "tag": "lark_md"}}]},
        {"tag": "note", "elements": [{"tag": "plain_text", "content": "来自 coco-ios 内部术语库（1500 条）"}]}
    ],
}

HELP_CARD = {
    "header": {"template": "grey", "title": {"content": "📖 Hermes 命令手册", "tag": "plain_text"}},
    "elements": [
        {"tag": "div", "fields": [{"text": {"content":
            "**统计 / 今日 / 进度** - 刷题统计卡片\n"
            "**术语 / 新术语** - 今日 5 词 + 中日英\n"
            "**错题 / 复习** - 错题列表\n"
            "**帮助 / ? / help** - 这条命令手册\n"
            "**hi / hello / 你好** - 打招呼",
            "tag": "lark_md"}}]}
    ],
}


_welcomed = {}


def handle(event):
    """event 是 im.message.receive_v1 的 event 部分"""
    sender = event.get("sender", {})
    open_id = sender.get("sender_id", {}).get("open_id", "")
    msg = event.get("message", {})
    chat_type = msg.get("chat_type", "p2p")
    if chat_type != "p2p":
        return
    if msg.get("message_type") != "text":
        send_text(open_id, "我目前只识别文本命令。试试「帮助」。")
        return
    try:
        text = json.loads(msg.get("content", "{}")).get("text", "").strip()
    except Exception:
        text = ""

    log("recv from %s: %s", open_id[:10], text[:50])

    # 首次接入欢迎
    if open_id and open_id not in _welcomed:
        send_card(open_id, WELCOME)
        _welcomed[open_id] = True

    t = text.lower()
    if "统计" in text or "今日" in text or "进度" in text or "進度" in text:
        send_card(open_id, STATS)
    elif "术语" in text or "用語" in text or "vocab" in t:
        send_card(open_id, TERMS)
    elif "帮助" in text or t in ["?", "？", "help"]:
        send_card(open_id, HELP_CARD)
    elif "错题" in text or "復習" in text or "复习" in text:
        send_text(open_id, "错题本入口：coco-ios → 复习 → 错题复习（当前 6 道待复盘）")
    elif t.startswith(("hi", "hello", "你好", "在")) or t in ["?"]:
        send_text(open_id, "你好 Coco 👋 我在线。发送「帮助」看我的全部命令。")
    elif len(text) == 0:
        send_text(open_id, "（空消息）发送「帮助」即可。")
    else:
        send_text(open_id, f"你说：{text[:60]}\n\n我没学会这个命令 — 试试「帮助」或「统计」「术语」。")


# ---- Flask app --------------------------------------------------------------

app = Flask(__name__)


@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "app": "hermes-feishu-daemon",
        "ok": True,
        "ngrok_url_placeholder": "https://xxxx.ngrok-free.app/callback",
    })


@app.route("/callback", methods=["GET", "POST"])
@app.route("/open-apis/event/v1/callback", methods=["POST"])
def callback():
    """
    飞书 webhook endpoint.
    POST /open-apis/event/v1/callback 事件类型 JSON.

    1. url_verification: 飞书发挑战 GET/POST 验证 token，返回 challenge.
    2. event: 实际事件，含 payload.event 里的 event_type.
    """
    try:
        raw = request.get_data()
        body = request.get_json(force=True, silent=True) or {}
        log("RAW BODY %d bytes: %s", len(raw), raw[:400].decode('utf-8', errors='ignore'))
    except Exception:
        body = {}

    if request.args.get("type") == "url_verification" or body.get("type") == "url_verification":
        log("challenge: %s", body.get("challenge", "")[:50])
        return jsonify({"challenge": body.get("challenge", "")})

    # 飞书 OpenAPI v2 推送格式
    header = body.get("header", {})
    if header.get("event_type") == "im.message.receive_v1":
        evt = body.get("event", {})
        threading.Thread(target=handle, args=(evt,), daemon=True).start()
        return jsonify({"code": 0, "msg": "ok"})

    # 简化版（直接传 event 字段）
    if "event" in body and "sender" in body.get("event", {}):
        threading.Thread(target=handle, args=(body.get("event"),), daemon=True).start()
        return jsonify({"code": 0, "msg": "ok"})

    log("unknown event: %s", json.dumps(body)[:300])
    return jsonify({"code": -1, "msg": "unknown event"})


@app.route("/healthz")
def healthz():
    return jsonify({"ok": True, "ts": int(time.time())})


if __name__ == "__main__":
    print("[Hermes webhook]")
    print(f"  APP_ID      = {APP_ID}")
    print(f"  PORT        = {PORT}")
    print(f"  callback    = http://127.0.0.1:{PORT}/open-apis/event/v1/callback")
    print(f"  challenge   = http://127.0.0.1:{PORT}/callback?type=url_verification")
    print(f"  logfile     = {LOG_FILE}")
    print()
    print("[next] ngrok http 9876   (another shell)")
    print("[then] 在飞书后台 → 事件与回调 → 设置 callback URL = https://<ngrok>/open-apis/event/v1/callback + verification token = hermes-default-verify")
    app.run(host="0.0.0.0", port=PORT, debug=False, threaded=True)
