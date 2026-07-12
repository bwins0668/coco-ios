# CoCo iOS 无线重装 / 调试指南

## 现状（2026-07-12 实测）
- ✅ 手机已配对（tidevice 配对记录存在：`~/.tidevice/ssl/00008130-*.pem`）
- ✅ App 已安装：`com.CLaov.M3EM` (CoCo 学习 0.1)，描述文件有效至 2027-07-08
- ✅ 证书可用：Team `4KQ5JXJ558` (Lapis Kouri)，p12 + mobileprovision 已就位
- ⚠️ 手机**尚未开启**「通过网络连接」（mDNS 无 `_apple-mobdev2` 广播，已用脚本验证）

## 一、手机端开启无线调试（只需做一次）
在 iPhone 上：
1. 确认已开启「开发者模式」：
   `设置 → 隐私与安全性 → 开发者模式` → 打开（若没有此选项，需先用 Mac/Xcode 跑一次真机调试激活）
2. 开启局域网连接：
   `设置 → 开发者 → 打开「通过局域网连接」`(Wireless Debugging / Connect via Network)
3. 保持 iPhone 与电脑在**同一 Wi-Fi**（当前手机 IP：`192.168.1.133`）

> 开启后，电脑侧 mDNS 会出现 `_apple-mobdev2._tcp.local` 广播，tidevice 即可免线发现。

## 二、电脑侧验证无线可见
```bash
tidevice list
# 预期 ConnType 出现 Wireless，或能看到 Coco的iPhone 无需 USB
```
若仍 only USB，说明手机开关未开或不在同网段。

## 三、一键重签 + 安装（USB 或 Wireless 通用）
脚本：`scripts/reinstall-coco-ios.ps1`（Windows）/ 等价 bash 见下。
它做：下载最新 CI 无签名 IPA → 重组成标准 Payload → zsign 用你的证书 → `tidevice install`。
tidevice 在无线配对后无需 `-u` 也可识别，但建议显式传 UDID 最稳：

```bash
tidevice -u 00008130-000E60A61E30001C install CoCoiOS-signed.ipa
```

## 四、CIDR / 网络注意
- 电脑与手机须同网段（都是 `192.168.1.x`）。
- 公司/校园网可能屏蔽 mDNS，家用路由一般 OK。
- 手机 IP 会变，重装前可 `tidevice -u <UDID> info | grep WiFiAddress` 仅看 MAC；IP 用 `ping Coco的iPhone.local` 解析。

## 五、排错
| 现象 | 原因 | 解决 |
|---|---|---|
| `Device not detected`（拔线后） | 未开「通过网络连接」 | 回「一」开启 |
| `DeveloperImage not found` | 启动调试需挂载开发者镜像 | 个人签名仅安装不需；若 launch 才需 |
| `application-identifier mismatch` | Bundle ID ≠ 描述文件 | 工程须用 `com.CLaov.M3EM` |
| zsign `Can't find payload` | IPA 缺 Payload/ | 脚本已自动重组，勿手打 `zip` |
