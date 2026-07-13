"""定时给订阅 Hermes 的 coco 学习者推送每日统计。

用法：
    python scripts/hermes_cron_push.py             # 推送今日统计 + 术语到所有订阅者

订阅数据：data/feishu-subscribers.json
"""
import os
import sys
import json
import time
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
SUB_STORE = ROOT / "data" / "feishu-subscribers.json"

APP_ID = os.environ.get("LARK_APP_ID", "").strip()
APP_SECRET = os.environ.get("LARK_APP_SECRET", "").strip()
HOST = "https://open.feishu.cn"


# ---- 订阅存储 ----------------------------------------------------------------

def load_subscribers():
    if not SUB_STORE.exists():
        return []
    try:
        data = json.loads(SUB_STORE.read_text(encoding="utf-8"))
        # 兼容两种 schema: list or {"subscribers": [..]}
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            return data.get("subscribers", [])
        return []
    except Exception:
        return []


def save_subscribers(items):
    SUB_STORE.parent.mkdir(parents=True, exist_ok=True)
    SUB_STORE.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")


def add_subscriber(open_id, name="coco"):
    items = load_subscribers()
    if not any(s.get("open_id") == open_id for s in items):
        items.append({
            "open_id": open_id,
            "name": name,
            "subscribed_at": datetime.now().isoformat(),
            "daily_push": True,
        })
        save_subscribers(items)
        return True
    return False


def remove_subscriber(open_id):
    items = load_subscribers()
    items = [s for s in items if s.get("open_id") != open_id]
    save_subscribers(items)


# ---- token + 发送 -----------------------------------------------------------

def get_token():
    body = json.dumps({"app_id": APP_ID, "app_secret": APP_SECRET}).encode()
    req = urllib.request.Request(
        HOST + "/open-apis/auth/v3/tenant_access_token/internal",
        data=body, method="POST",
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
            if data.get("code") == 0:
                return data["tenant_access_token"]
    except Exception as e:
        print(f"[err] {e}")
    return None


def post(path, body, token):
    data = json.dumps(body, ensure_ascii=False).encode()
    req = urllib.request.Request(
        HOST + path, data=data, method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=utf-8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='ignore')[:500]
        return {"code": -1, "msg": f"HTTP {e.code}: {body}"}
    except Exception as e:
        return {"code": -1, "msg": str(e)}


def send_card(open_id, card, token):
    body = {"receive_id": open_id, "msg_type": "interactive",
            "content": json.dumps(card, ensure_ascii=False)}
    return post("/open-apis/im/v1/messages?receive_id_type=open_id", body, token=token)


# ---- 卡片（与 webhook 同款，独立定义避免循环导入） -----

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


# ---- 推送主逻辑 -----------------------------------------------------------

def push_to_all():
    """每日推送：今日统计 + 5 术语"""
    subs = load_subscribers()
    if not subs:
        print(f"[{datetime.now()}] no subscribers — skip")
        return
    token = get_token()
    if not token:
        print(f"[{datetime.now()}] cannot get token — skip")
        return
    for s in subs:
        if not s.get("daily_push", True):
            continue
        oid = s["open_id"]
        r1 = send_card(oid, STATS, token)
        time.sleep(0.6)
        r2 = send_card(oid, TERMS, token)
        c1 = r1.get("code") if isinstance(r1, dict) else -1
        c2 = r2.get("code") if isinstance(r2, dict) else -1
        print(f"[push] {s.get('name', '')}: stats={c1} terms={c2}")
        if c1 != 0:
            print(f"  stats err: {r1}")
        if c2 != 0:
            print(f"  terms err: {r2}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--bind" in args:
        print("=== Hermes 订阅 ===")
        print("请发送任何消息给 Hermes → 后台会自动加进订阅名单。")
    elif "--send-now" in args:
        idx = args.index("--send-now")
        open_id = args[idx + 1] if len(args) > idx + 1 else None
        if open_id:
            token = get_token()
            send_card(open_id, STATS, token)
            send_card(open_id, TERMS, token)
        else:
            print("--send-now 需要 open_id 参数")
    else:
        push_to_all()
