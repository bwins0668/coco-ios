# R6 Quiet Paper 设计系统合同

## Token 映射

| Claude Design token | 小程序 token | 值 |
|---|---|---|
| color.bg | `--qp-color-canvas` | `#F2EDE0` |
| color.surface | `--qp-color-surface` | `#FFFDF5` |
| color.fill.muted | `--qp-color-surface-muted` | `#F4F3EF` |
| color.fill.warm | `--qp-color-fill-warm` | `#E8DFC8` |
| color.ink | `--qp-color-ink` | `#1A1410` |
| color.text.secondary | `--qp-color-text-secondary` | `#6F6B65` |
| color.text.tertiary | `--qp-color-text-tertiary` | `#8A7060` |
| color.text.quaternary | `--qp-color-text-quaternary` | `#8A8680` |
| color.text.ghost | `--qp-color-text-ghost` | `#C9C4BD` |
| color.text.phantom | `--qp-color-text-phantom` | `#D8CEB8` |
| color.accent | `--qp-color-primary` | `#37418A` |
| color.accent.strong | `--qp-color-primary-pressed` | `#2C3676` |
| color.accent.weak | `--qp-color-primary-soft` | `#ECEEF6` |
| color.accent.editorial | `--qp-color-editorial` | `#C5123A` |
| color.success | `--qp-color-success` | `#4E8A5E` |
| color.success.weak | `--qp-color-success-soft` | `#EAF1EC` |
| color.danger | `--qp-color-danger` | `#BE5750` |
| color.danger.weak | `--qp-color-danger-soft` | `#F7ECEB` |
| color.warning.bg | `--qp-color-warning-soft` | `#FBF1E9` |
| color.line | `--qp-color-line` | `rgba(33,31,28,.08)` |
| color.line.strong | `--qp-color-line-strong` | `rgba(33,31,28,.14)` |

## 组件职责

- PageShell：统一暖纸背景、安全区、主内容横向 40rpx。
- Masthead：kicker + 大标题 + 日期/计数辅助，不承载业务逻辑。
- SectionHeader：编号、标题、分割线、meta。
- PrimaryButton / SecondaryButton / GhostButton：主次行动；pressed 只用 transform/opacity。
- RowList / TaskRow：真实数据行，支持右侧 meta 与 chevron。
- StatusPill：状态、tag、空态提示，不展示虚构计数。
- ProgressLine：细条，不做仪表盘。
- EmptyState / ErrorState / Skeleton：诚实空状态和加载状态。
- QuestionOption / AnswerFeedback / ExplanationSheet：只接收 quiz 现有状态，不能改判题来源。
- ResultSummary：只读本次真实结果。

## 输入输出边界

UI 组件只接收页面传入的展示字段与事件回调，不直连 storage，不读取题库，不写错题，不派生复习优先级。页面层继续使用现有 JS、storage、navigation、loader。

## 禁止直接复制的旧样式模式

- 冷蓝灰整站基调。
- `#f6f8fb`、`#1f2937` 等教材页硬编码色。
- 大量圆角卡片堆叠。
- 多强调色入口矩阵。
- 使用设计稿截图作为背景。
- 远程字体、CDN、在线图片依赖。

## 移动端与性能

- 页面底部保留 `env(safe-area-inset-bottom)`。
- 长日文与中英文术语使用 `line-height: 1.6-1.75`、`min-width: 0`、自然换行。
- 列表不新增高频 `setData`，只改样式与结构。
- 动效限制为 `transform`、`opacity`、`background-color`。
- 375/390/430 宽度通过固定 rpx 节奏与安全区约束检查。
