#!/usr/bin/env python3
"""验证飞书机器人是否真的存在 + 当前 app 的状态。

凭证从环境变量读取，绝不入库：
    export LARK_APP_ID=cli_xxx
    export LARK_APP_SECRET=xxx
    python scripts/feishu_verify.py
"""
import os
import sys
import json
import urllib.request
import urllib.error

APP_ID = os.environ.get("LARK_APP_ID", "").strip()
APP_SECRET = os.environ.get("LARK_APP_SECRET", "").strip()
HOST = "https://open.feishu.cn"

if not APP_ID or not APP_SECRET:
    print("ERROR: set LARK_APP_ID and LARK_APP_SECRET env vars first")
    sys.exit(1)

def http(url, headers=None, method="GET"):
    req = urllib.request.Request(url, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read().decode("utf-8")
            return r.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return -1, str(e)

def step1_token():
    print("\n[1] 拿 tenant_access_token ...")
    url = f"{HOST}/open-apis/auth/v3/tenant_access_token/internal"
    body = json.dumps({"app_id": APP_ID, "app_secret": APP_SECRET}).encode()
    print(f"    payload keys: app_id(len={len(APP_ID)}), app_secret(len={len(APP_SECRET)})")
    status, text = http(url, headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
    print(f"    HTTP {status}")
    print(f"    raw body: {text[:800]}")
    data = json.loads(text)
    print(f"    code={data.get('code')} msg={data.get('msg')}")
    if data.get("code") != 0:
        return None
    return data["tenant_access_token"]


def step1b_app_token():
    print("\n[1b] 备用: 拿 app_access_token ...")
    url = f"{HOST}/open-apis/auth/v3/app_access_token/internal"
    body = json.dumps({"app_id": APP_ID, "app_secret": APP_SECRET}).encode()
    status, text = http(url, headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
    print(f"    HTTP {status} body: {text[:300]}")
    return text
    url = f"{HOST}/open-apis/bot/v3/info"
    status, text = http(url, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    print(f"    HTTP {status}")
    print(f"    {text[:500]}")
    return text

def step3_app_status(token):
    print("\n[3] 查 app 状态：GET /open-apis/application/v6/applications/{app_id} ...")
    url = f"{HOST}/open-apis/application/v6/applications/{APP_ID}?app_id={APP_ID}"
    status, text = http(url, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    print(f"    HTTP {status}")
    print(f"    {text[:500]}")
    return text

def step4_app_visibility(token):
    print("\n[4] 检查应用能不能被搜到：GET /open-apis/application/v6/applications/{app_id}/visibility ...")
    url = f"{HOST}/open-apis/application/v6/applications/{APP_ID}/visibility"
    status, text = http(url, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    print(f"    HTTP {status}")
    print(f"    {text[:500]}")
    return text

def main():
    token = step1_token()
    if not token:
        print("\n❌ 拿 token 失败，最常见原因：App Secret 错 / App ID 在隔离环境 / 该 app 已被禁用")
        sys.exit(1)
    bot = step2_bot_info(token)
    app = step3_app_status(token)
    vis = step4_app_visibility(token)

    # 简单结论
    print("\n========== 结论 ==========")
    try:
        b = json.loads(bot)
        if b.get("code") == 0:
            bot_info = b.get("data", {}).get("bot", {})
            print(f"✅ 机器人存在")
            print(f"   app_name={bot_info.get('app_name')}")
            print(f"   avatar_url={bot_info.get('avatar_url')}")
            print(f"   ip_white_list={bot_info.get('ip_white_list')}")
            print(f"   tags={bot_info.get('tags')}")
        else:
            print(f"❌ 机器人查询失败: code={b.get('code')} msg={b.get('msg')}")
            print(f"   → 后台'机器人'能力可能未开启，或该 app 还没创建 bot")
    except Exception as e:
        print(f"⚠️ 解析 bot info 失败: {e}")

    try:
        a = json.loads(app)
        if a.get("code") == 0:
            app_data = a.get("data", {})
            print(f"\n✅ App 数据查询成功")
            print(f"   status={app_data.get('status')}")
            print(f"   app_name={app_data.get('app_name')}")
        else:
            print(f"\n❌ App 数据查询失败: code={a.get('code')} msg={a.get('msg')}")
    except Exception as e:
        print(f"⚠️ 解析 app 失败: {e}")

if __name__ == "__main__":
    main()
