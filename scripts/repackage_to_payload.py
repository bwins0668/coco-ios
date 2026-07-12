#!/usr/bin/env python3
# repackage_to_payload.py
# 将 CI 产出的「.app 直接 zip」IPA 重组成标准 Payload/ 布局，便于 zsign 回包。
import zipfile, os, shutil, tempfile, sys

def main():
    if len(sys.argv) != 3:
        print("usage: repackage_to_payload.py <in.ipa> <out.ipa>")
        sys.exit(2)
    src, out = sys.argv[1], sys.argv[2]
    tmp = tempfile.mkdtemp()
    with zipfile.ZipFile(src) as z:
        z.extractall(tmp)
    apps = [n for n in os.listdir(tmp) if n.endswith('.app')]
    if not apps:
        print("ERROR: no .app found in", src); sys.exit(1)
    app = apps[0]
    payload = os.path.join(tmp, 'Payload')
    os.makedirs(payload, exist_ok=True)
    shutil.move(os.path.join(tmp, app), os.path.join(payload, app))
    if os.path.exists(out):
        os.remove(out)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(payload):
            for f in files:
                fp = os.path.join(root, f)
                z.write(fp, os.path.relpath(fp, tmp))
    print("OK payload ipa:", out, os.path.getsize(out), "bytes")

if __name__ == '__main__':
    main()
