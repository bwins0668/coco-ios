import SwiftUI

/// 页面顶部 Masthead：kicker + title + 日期/连胜
struct QPMasthead: View {
    let kicker: String
    let title: String
    let rightText: String?
    let streak: Int?

    init(kicker: String, title: String, rightText: String? = nil, streak: Int? = nil) {
        self.kicker = kicker
        self.title = title
        self.rightText = rightText
        self.streak = streak
    }

    var body: some View {
        HStack(alignment: .bottom) {
            VStack(alignment: .leading, spacing: 4) {
                Text(kicker)
                    .font(.system(size: DT.fontLabel))
                    .tracking(2)
                    .foregroundStyle(DT.textTertiary)
                Text(title)
                    .font(.system(size: DT.fontMasthead, weight: .semibold))
                    .tracking(-0.5)
                    .foregroundStyle(DT.ink)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                if let right = rightText {
                    Text(right)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
                if let s = streak, s > 0 {
                    HStack(spacing: 2) {
                        Text("连续")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                        Text("\(s)")
                            .font(.system(size: DT.fontCaption, weight: .semibold))
                            .foregroundStyle(DT.editorial)
                        Text("天")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                }
            }
        }
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space3)
    }
}

/// 页面顶部分隔线：左侧 4pt 暖色块 + 右侧细线
struct QPRuleLine: View {
    var body: some View {
        HStack(spacing: 0) {
            Rectangle()
                .fill(DT.ink)
                .frame(width: 24, height: 1.5)
            Rectangle()
                .fill(DT.line)
                .frame(height: 0.5)
        }
        .padding(.horizontal, DT.space3)
    }
}

/// 区块小标题：01 / 02 编号 + 标题 + 右侧 meta
struct QPSectionLabel: View {
    let number: String
    let title: String
    let meta: String?

    init(_ number: String, _ title: String, meta: String? = nil) {
        self.number = number
        self.title = title
        self.meta = meta
    }

    var body: some View {
        HStack(alignment: .center, spacing: 8) {
            Text(number)
                .font(.system(size: DT.fontBody, weight: .regular))
                .foregroundStyle(DT.textTertiary)
                .frame(width: 22, alignment: .leading)
            Text(title)
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .tracking(1.5)
                .foregroundStyle(DT.ink)
            Spacer()
            if let meta = meta {
                Text(meta)
                    .font(.system(size: DT.fontLabel))
                    .tracking(0.5)
                    .foregroundStyle(DT.textTertiary)
            }
        }
        .padding(.horizontal, DT.space3)
    }
}

/// 通用卡片容器
struct QPCard<Content: View>: View {
    let content: Content
    let backgroundColor: Color
    let cornerRadius: CGFloat
    let borderColor: Color
    let borderWidth: CGFloat
    let padding: CGFloat

    init(
        backgroundColor: Color = DT.surface,
        cornerRadius: CGFloat = DT.radiusLg,
        borderColor: Color = DT.line,
        borderWidth: CGFloat = 0.5,
        padding: CGFloat = DT.space2,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.backgroundColor = backgroundColor
        self.cornerRadius = cornerRadius
        self.borderColor = borderColor
        self.borderWidth = borderWidth
        self.padding = padding
    }

    var body: some View {
        content
            .padding(padding)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
    }
}

/// 小程序风格的胶囊标签
struct QPPill: View {
    let text: String
    let background: Color
    let foreground: Color

    init(_ text: String, background: Color = DT.fillWarm, foreground: Color = DT.textTertiary) {
        self.text = text
        self.background = background
        self.foreground = foreground
    }

    var body: some View {
        Text(text)
            .font(.system(size: DT.fontLabel, weight: .medium))
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .background(background)
            .foregroundStyle(foreground)
            .clipShape(Capsule())
    }
}

/// 主按钮（小程序 cc-btn--primary）
struct QPPrimaryButton: View {
    let title: String
    let action: () -> Void

    init(_ title: String, action: @escaping () -> Void) {
        self.title = title
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: DT.fontBody, weight: .semibold))
                .foregroundStyle(DT.surface)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(DT.ink)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

/// 次按钮（小程序 cc-btn--outline）
struct QPOutlineButton: View {
    let title: String
    let action: () -> Void

    init(_ title: String, action: @escaping () -> Void) {
        self.title = title
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: DT.fontBody, weight: .semibold))
                .foregroundStyle(DT.ink)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(DT.fillWarm)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

/// 左侧色条卡片（home cc-exam-row）
struct QPExamRowCard: View {
    let title: String
    let description: String
    let isPrimary: Bool
    let isMuted: Bool
    let accentColor: Color
    let action: () -> Void
    let accessory: AnyView

    init(title: String,
         description: String,
         isPrimary: Bool = false,
         isMuted: Bool = false,
         accentColor: Color = DT.primary,
         action: @escaping () -> Void = {},
         accessory: AnyView = AnyView(EmptyView())) {
        self.title = title
        self.description = description
        self.isPrimary = isPrimary
        self.isMuted = isMuted
        self.accentColor = accentColor
        self.action = action
        self.accessory = accessory
    }

    var body: some View {
        Button(action: action) {
            HStack(alignment: .center, spacing: DT.space2) {
                Rectangle()
                    .fill(isMuted ? DT.textGhost : accentColor)
                    .frame(width: 3)
                    .padding(.vertical, 4)
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(isMuted ? DT.textTertiary : DT.ink)
                    Text(description)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineLimit(2)
                }
                Spacer(minLength: 0)
                accessory
            }
            .padding(.horizontal, DT.space2)
            .padding(.vertical, DT.space2)
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .opacity(isMuted ? 0.6 : 1.0)
        }
        .buttonStyle(.plain)
    }
}