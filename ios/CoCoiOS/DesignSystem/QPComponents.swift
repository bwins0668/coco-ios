import SwiftUI

// MARK: - 页面顶部组件

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

struct QPSectionLabel: View {
    let number: String
    let title: String
    let meta: String?

    init(_ number: String, _ title: String, meta: String? = nil) {
        self.number = number
        self.title = title
        self.meta = meta
    }

    init(_ title: String) {
        self.number = ""
        self.title = title
        self.meta = nil
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

// MARK: - 卡片容器

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
            .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
    }
}

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
            .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
            .opacity(isMuted ? 0.6 : 1.0)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - R8 1:1 复刻 新组件

struct QPRedHeaderCard<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(DT.editorial)
                .frame(height: 2)
            content
                .padding(DT.space3)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(DT.surface)
        }
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 3)
    }
}

struct QPAnswerFeedbackBanner: View {
    let isCorrect: Bool
    let primaryText: String
    let secondaryText: String?
    var body: some View {
        HStack(alignment: .top, spacing: DT.space2) {
            ZStack {
                Circle()
                    .fill(isCorrect ? DT.success : DT.danger)
                    .frame(width: 22, height: 22)
                Image(systemName: isCorrect ? "checkmark" : "xmark")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(DT.surface)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(primaryText)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(isCorrect ? DT.success : DT.danger)
                if let s = secondaryText {
                    Text(s)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
            Spacer(minLength: 0)
        }
        .padding(DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke((isCorrect ? DT.success : DT.danger).opacity(0.2), lineWidth: 0.5)
        )
        .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
    }
}

struct QPNumericRow: View {
    struct Cell { let value: Int; let label: String }
    let cells: [Cell]
    init(_ cells: [Cell]) { self.cells = cells }
    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(cells.enumerated()), id: \.offset) { idx, cell in
                if idx > 0 {
                    Rectangle().fill(DT.line).frame(width: 0.5)
                }
                VStack(spacing: 4) {
                    Text("\(cell.value)")
                        .font(.system(size: DT.fontMasthead, weight: .semibold))
                        .tracking(-1)
                        .foregroundStyle(DT.ink)
                    Text(cell.label)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.vertical, DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
    }
}

struct QPSearchField: View {
    @Binding var text: String
    let placeholder: String
    init(text: Binding<String>, placeholder: String = "搜索") {
        self._text = text
        self.placeholder = placeholder
    }
    var body: some View {
        HStack(spacing: DT.space1) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(DT.textTertiary)
                .font(.system(size: DT.fontCaption))
            TextField("", text: $text, prompt: Text(placeholder).foregroundStyle(DT.textTertiary))
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.ink)
        }
        .padding(.horizontal, DT.space2)
        .padding(.vertical, 10)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
    }
}

struct QPDotChip: View {
    let label: String
    let count: Int?
    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(DT.textTertiary)
                .frame(width: 6, height: 6)
            Text(label)
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.ink)
            if let c = count {
                Text("\(c)")
                    .font(.system(size: DT.fontCaption, weight: .semibold))
                    .foregroundStyle(DT.textTertiary)
            }
        }
    }
}

struct QPLanguageCourseCard<Accessory: View>: View {
    let tag: String
    let title: String
    let subtitle: String
    let meta: String
    let accentColor: Color
    let backgroundColor: Color
    let isMuted: Bool
    let accessory: Accessory
    let action: () -> Void

    init(tag: String, title: String, subtitle: String, meta: String,
         accentColor: Color, backgroundColor: Color,
         isMuted: Bool = false,
         accessory: Accessory = EmptyView(),
         action: @escaping () -> Void = {}) {
        self.tag = tag; self.title = title; self.subtitle = subtitle; self.meta = meta
        self.accentColor = accentColor; self.backgroundColor = backgroundColor
        self.isMuted = isMuted; self.accessory = accessory; self.action = action
    }
    var body: some View {
        Button(action: action) {
            HStack(alignment: .top, spacing: 0) {
                Rectangle()
                    .fill(isMuted ? Color.clear : accentColor)
                    .frame(width: 3)
                    .padding(.vertical, DT.space2)
                VStack(alignment: .leading, spacing: 6) {
                    Text(tag)
                        .font(.system(size: DT.fontLabel, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(isMuted ? DT.textGhost : accentColor)
                    Text(title)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(isMuted ? DT.textTertiary : DT.ink)
                    Text(subtitle)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(isMuted ? DT.textGhost : DT.textSecondary)
                        .lineLimit(2)
                    if !meta.isEmpty && !isMuted {
                        Text(meta)
                            .font(.system(size: DT.fontLabel))
                            .tracking(0.5)
                            .foregroundStyle(DT.textTertiary)
                            .padding(.top, 2)
                    }
                    if isMuted {
                        Spacer().frame(height: 4)
                        Text(meta.isEmpty ? "准备中" : meta)
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                    }
                    Spacer(minLength: 0)
                }
                .padding(.horizontal, DT.space2)
                .padding(.vertical, DT.space2)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(isMuted ? DT.surface.opacity(0.4) : backgroundColor)
            }
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
            .padding(.horizontal, DT.space3)
        }
        .buttonStyle(.plain)
        .opacity(isMuted ? 0.7 : 1.0)
    }
}

// MARK: - Misc

struct QPEmptyState: View {
    let title: String
    let subtitle: String
    var body: some View {
        VStack(spacing: 12) {
            Text(title)
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text(subtitle)
                .font(.system(size: DT.fontLabel))
                .foregroundStyle(DT.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
    }
}
