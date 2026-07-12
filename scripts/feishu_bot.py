#!/usr/bin/env python3
"""生成飞书机器人邀请二维码（PNG）。

用法：
    LARK_APP_ID=cli_xxx python scripts/feishu_bot.py
    # 输出：scripts/feishu-bot-qr.png

之后用任意 app_id / bot_id 都行，注意这个 app 必须开启"机器人"能力并发布。
"""
import os
import sys
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "scripts" / "feishu-bot-qr.png"


def main():
    app_id = os.environ.get("LARK_APP_ID", "").strip()
    bot_id = os.environ.get("LARK_BOT_ID", "").strip() or app_id  # 自建应用 = bot id 形同 app id
    if not bot_id:
        print("ERROR: set LARK_APP_ID (or LARK_BOT_ID) first.")
        sys.exit(1)

    # 自建应用机器人"扫码加机器人"URL（已发布机器人可走这个）
    # 文档：https://open.feishu.cn/document/server-docs/im-v1/bot-group/search-bot
    url = f"https://open.feishu.cn/page/contact-group-v2?bot_id={bot_id}"
    print(f"[feishu] encoding URL: {url}")

    try:
        import qrcode
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "qrcode[pil]"])
        import qrcode

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, format="PNG")
    print(f"[feishu] wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"[feishu] scan QR with Feishu mobile → opens bot page → 添加机器人 to your group/DM")


if __name__ == "__main__":
    main()
