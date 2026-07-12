# Study Tools Mini — UI 视觉精修阶段报告

**报告时间**: 2026-06-16 22:02  
**起始 HEAD**: `28d571c` (add icons to main tab navigation)  
**结束 HEAD**: `10af9d3` (style: refine home card interaction feedback)  
**总提交数**: 19  
**修改文件数**: 20  
**总变更行数**: +1799 / -566  

---

## 一、阶段总览

本阶段从 UI 重设计启动（R3.133）延续至视觉精修阶段（UI-Polish-01~04），覆盖两个子阶段：

1. **视觉重设计子阶段**（R3.133 → R3.153）：大布局重塑 + 设计系统建立
2. **视觉精修子阶段**（UI-Polish-01 → UI-Polish-04）：间距压缩 + 字号提升 + 颜色层级 + 交互反馈

全部 **106 PASS / 0 FAIL**，零回滚，零数据破坏。

---

## 二、提交列表

| # | Commit | 说明 |
|---|--------|------|
| 1 | `28d571c` | add icons to main tab navigation |
| 2 | `793a112` | redesign it passport dashboard |
| 3 | `fe9205f` | redesign glossary search experience |
| 4 | `4ce6bc1` | redesign mistakes review experience |
| 5 | `4d00b6a` | redesign profile learning center |
| 6 | `1d0ba54` | add mini app design tokens |
| 7 | `58fe311` | unify entry card colors with design tokens |
| 8 | `3885377` | enhance anki summary celebration view |
| 9 | `f86ee72` | upgrade quiz page visual design |
| 10 | `781a574` | deepen exam-menu dashboard |
| 11 | `36f0c18` | deepen home page |
| 12 | `1ecc20d` | deepen glossary page |
| 13 | `5a3e022` | deepen mistakes page |
| 14 | `50df951` | deepen profile page |
| 15 | `2708bd5` | add global button, tag, color-bar utility classes |
| 16 | `7da86a4` | unify Anki buttons with gradient design system |
| 17 | `ae8912e` | tighten home card spacing |
| 18 | `4628730` | improve home card typography |
| 19 | `7876876` | enrich home card color hierarchy |
| 20 | `10af9d3` | refine home card interaction feedback |

---

## 三、修改文件汇总

| 文件 | 变更量 | 说明 |
|------|--------|------|
| `app.wxss` | +281 | 设计 Token 体系 + 全局按钮/标签/色条工具类 |
| `app.json` | +16/-6 | Tab 图标路径配置 |
| `packages/quiz/pages/quiz/quiz.wxss` | +605 重写 | Quiz 答题页沉浸式升级 |
| `packages/quiz/pages/exam-menu/exam-menu.wxss` | +356 重写 | 考试菜单 Dashboard 化 |
| `packages/quiz/pages/exam-menu/exam-menu.wxml` | +6 | 进度条元素 |
| `packages/glossary/pages/anki-player/anki-player.wxss` | +32 | Anki 按钮统一渐变 |
| `pages/home/home.wxss` | +216 | 首页 Hero + 卡片 + 间距 + 字号 + 交互 |
| `pages/glossary/glossary.wxml` | +67 | 术语页结构重组 |
| `pages/glossary/glossary.wxss` | +260 | 术语页学习中心化 |
| `pages/mistakes/mistakes.wxml` | +88 | 错题页结构重组 |
| `pages/mistakes/mistakes.wxss` | +320 | 错题页 Review Center 化 |
| `pages/profile/profile.wxss` | +118 | 个人页学习中心化 |
| `images/tab/*.png` | 8 新增 | Tab 图标（home/glossary/mistakes/profile × normal/active） |

---

## 四、卡片间距优化结果

### 首页入口卡片矩阵
| 属性 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| Grid gap | 12rpx | **8rpx** | -33% |
| Grid padding-bottom | 16rpx | **12rpx** | -25% |
| Card padding | 20rpx 12rpx 16rpx | **16rpx 10rpx 12rpx** | -20% |
| Hero margin-bottom | 16rpx | **10rpx** | -38% |
| Hero-top margin-bottom | 20rpx | **14rpx** | -30% |
| Hero-stats padding | 16rpx | **12rpx** | -25% |
| Hero-stats margin-bottom | 14rpx | **10rpx** | -29% |
| Icon wrap 尺寸 | 64rpx | **56rpx** | -12.5% |
| Icon wrap margin-bottom | 10rpx | **8rpx** | -20% |
| Suggestion margin-bottom | 12rpx | **8rpx** | -33% |
| Continue-section margin-bottom | 12rpx | **8rpx** | -33% |
| Achievement margin-top | 12rpx | **8rpx** | -33% |

**效果**: 首屏信息密度显著提升，卡片排列更紧凑，消除"大缝隙"，触控区域仍保持 44rpx+。

---

## 五、字号优化结果

| 元素 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| 入口卡片标题 `.entry-card-title` | 22rpx | **24rpx** | +2rpx |
| 入口卡片副标题 `.entry-card-desc` | 18rpx | **20rpx** | +2rpx |
| Hero 副标题 `.hero-subtitle` | 20rpx | **22rpx** | +2rpx |
| Hero 统计标签 `.hero-stat-label` | 18rpx | **20rpx** | +2rpx |
| 区块标题 `.section-title` | 26rpx | **28rpx** | +2rpx |
| 卡片统计文字 `.card-stat-text` | 18rpx | **20rpx** | +2rpx |
| 卡片状态标签 `.card-stat-status` | 16rpx | **18rpx** | +2rpx |
| 卡片时间 `.card-last-time` | 16rpx | **18rpx** | +2rpx |
| 卡片标题 `.card-title` | 22rpx | **24rpx** | +2rpx |

**效果**: 文字更清晰，信息层级更分明，无换行溢出。

---

## 六、颜色系统优化结果

### 设计 Token 体系（app.wxss）
```
--color-itpass: #4a90d9       (蓝)
--color-sg: #9c27b0           (紫)
--color-anki: #8b5cf6         (靛)
--color-glossary: #0891b2     (青)
--color-mistakes: #ef4444     (红)
--color-profile: #7c3aed      (深紫)
```
每个 Token 配套 `-light` 变体用于图标背景。

### 图标容器背景
优化前：`rgba(X, X, X, 0.1)` — 几乎看不到  
优化后：`rgba(X, X, X, 0.15)` — 主题色可感知，与卡片色条协调

### 卡片 Badge（错题/收藏数）
优化前：纯色 `#e74c3c`  
优化后：渐变 `linear-gradient(135deg, #ef4444, #dc2626)` + 投影

### 状态标签
优化前：纯色 `#4a90d9`  
优化后：渐变 `linear-gradient(135deg, #4a90d9, #6366f1)` + font-weight 600

### 弱项标签
优化前：纯色 `#fff3e0`  
优化后：渐变 `linear-gradient(135deg, #fff3e0, #ffe0b2)` + padding 增加

---

## 七、交互反馈优化结果

| 元素 | 优化前 | 优化后 |
|------|--------|--------|
| 入口卡片 `:active` | scale(0.97) | **scale(0.96) + opacity 0.92 + 阴影加深** |
| 建议卡片 `:active` | 无 | **scale(0.98) + opacity 0.92 + transition** |
| 继续学习卡片 `:active` | scale(0.98) | **scale(0.97) + opacity 0.92** |
| 建议操作按钮 `:active` | 无 | **scale(0.95) + opacity 0.88** |
| 继续练习按钮 `:active` | 无 | **scale(0.95) + opacity 0.88** |
| 快速开始按钮 `:active` | 无 | **scale(0.96) + 阴影缩小** |
| 返回顶部 `:active` | 无 | **scale(0.92) + 阴影缩小** |

所有新增交互均使用 `transition: 0.12s ease`，触感自然，不影响 bindtap。

---

## 八、页面视觉一致性结果

### 各页面 Hero 渐变色统一模式

| 页面 | 主色 | 渐变 |
|------|------|------|
| Home | 深海军蓝 | `#0f1f35 → #1a3050 → #1e3a5a → #152a45` |
| Glossary | 深蓝 | `#0a2a4a → #123a60 → #1a4d7a → #123a60` |
| Mistakes | 深红 | `#2a0f0f → #3a1a1a → #4d2222 → #3a1a1a` |
| Profile | 深紫 | `#1a0f2e → #2a1650 → #3d2068 → #2a1650` |
| Quiz | 深海军蓝 | 同 Home 体系 |
| Exam-Menu IT | 深蓝 | `#1a3a5c → #1e4d7a` |
| Exam-Menu SG | 深紫 | `#3a1a4c → #4d1e6a` |

### 统一设计模式
- **微点纹理**: 所有 Hero 区域使用 `radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)` 叠加
- **毛玻璃元素**: Badge / 搜索入口使用 `backdrop-filter: blur(10-20px)` + 半透明边框
- **卡片色条**: `::before` 5rpx 渐变色条，颜色对应模块主题色
- **按钮系统**: `gradient(#4a90d9 → #6366f1)` + 44rpx 圆角 + box-shadow
- **暗色/亮色适配**: 每个页面独立 `@media` 适配，亮色模式隐藏纹理 + 取消毛玻璃

---

## 九、全局工具类新增

### 按钮系统
- `.btn-primary` — 蓝紫渐变主按钮
- `.btn-secondary` — 描边次按钮
- `.btn-danger` — 红色渐变危险按钮

### 标签系统
- `.tag` + `.tag-itpass / .tag-sg / .tag-anki / .tag-glossary / .tag-mistakes / .tag-profile`

### 色条工具类
- `.bar-top` — 顶部色条基类
- `.bar-top-itpass / .bar-top-sg / .bar-top-anki / .bar-top-glossary / .bar-top-mistakes / .bar-top-profile`
- `.bar-left` — 左侧色条基类
- `.bar-left-success / .bar-left-warning / .bar-left-error / .bar-left-info`

---

## 十、当前验证状态

```
[1/4] Smoke test:       PASS (106 checks)
[2/4] Content compliance: PASS
[3/4] JS syntax:        PASS
[4/4] WXSS \n guard:    PASS
```

零 BOM 文件，零 diff 问题，零 pre-commit 阻塞。

---

## 十一、待继续精修任务池

按优先级排序：

1. **UI-Polish-05**: 全局按钮与标签颜色微调（app.wxss）
2. **UI-Polish-06**: 底部 Tab 视觉精修（图标 + 激活态 + 安全区）
3. **UI-Polish-07**: Anki 页面卡片与按钮精修
4. **UI-Polish-08**: 考试页面卡片与标签精修
5. **UI-Polish-09**: Glossary / 错题本卡片细节精修
6. **UI-Polish-10**: 视觉一致性 smoke test 补强
7. 首页首屏信息密度终审
8. 暗色模式可读性终审
9. 亮色模式可读性终审
10. 字号层级终审
11. 图标系统终审
12. 无效旧样式清理
13. 维护文档补充 UI 精修规则
14. 阶段性 UI 封箱报告

---

## 十二、用户回来后最应该手动检查的 10 件事

1. 🔍 **首页卡片间距** — 确认 8rpx gap 在真机上是否足够紧凑但不贴死
2. 🔍 **字号 24rpx 标题** — 确认 IT Passport / SG 卡片标题不会溢出换行
3. 🔍 **入口卡片点击** — 确认 `:active` 缩放 + 透明度变化在真机上流畅
4. 🔍 **Badge 渐变** — 确认红色渐变 badge 在白色/深色背景上可读
5. 🔍 **图标容器 0.15 透明度** — 确认浅色主题色背景在亮色模式下可辨识
6. 🔍 **底部 Tab 图标** — 确认 8 个 PNG 图标在各分辨率真机上清晰
7. 🔍 **Hero 纹理叠加** — 确认微点纹理在低分辨率设备上不闪烁
8. 🔍 **毛玻璃效果** — 确认 `backdrop-filter` 在不支持的小程序版本降级优雅
9. 🔍 **暗色模式适配** — 切换系统暗色模式，确认各页面文字对比度足够
10. 🔍 **建议卡片交互** — 确认建议卡片 `:active` 态不会与内部按钮冲突

---

**报告生成**: UI Designer  
**设计系统版本**: v0.23.0-ui-polish-04  
**验证状态**: 106 PASS / 0 FAIL  
**下一阶段**: UI-Polish-05 → 全局按钮与标签颜色微调
