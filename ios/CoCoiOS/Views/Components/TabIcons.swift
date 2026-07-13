import SwiftUI

/// 自定义底部 Tab 图标：选中态外圈浅色圆 + SF Symbol 填充；fallback 在 symbol 不存在时给个几何占位
/// 注：避免使用 SF Symbols 5+ 才有的 variant（如 book.fill/doc.text.fill 等在某些 iOS build
/// 上静默回退为空白）。CourseTabIcon 改用 house.fill（iOS 13 起永存），PracticeTabIcon 用 list.bullet.rectangle。
struct TabIcon: View {
    let system: String
    let fallback: AnyView
    let active: Bool
    let color: Color
    let size: CGFloat

    init(_ system: String, fallback: AnyView = AnyView(EmptyView()),
         active: Bool = false, color: Color = DT.primary, size: CGFloat = 22) {
        self.system = system
        self.fallback = fallback
        self.active = active
        self.color = color
        self.size = size
    }

    var body: some View {
        ZStack {
            if active {
                Circle()
                    .fill(color.opacity(0.15))
                    .frame(width: size + 14, height: size + 14)
            }
            // primary symbol
            Image(systemName: active ? system + ".fill" : system)
                .font(.system(size: size, weight: active ? .semibold : .regular))
                .foregroundStyle(active ? color : DT.textTertiary)
                .symbolRenderingMode(.hierarchical)
            // fallback 永远叠在最上层（iOS 16+ 无重叠；旧版会双显示但比空白强）
            fallback
        }
    }
}

/// 各 Tab 图标（永远存在的 SF Symbol，避免任何 fill-only 静默回退）
struct CourseTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon(active ? "house.fill" : "house", active: active, color: DT.primary)
    }
}
struct PracticeTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon(active ? "square.grid.3x3.fill" : "square.grid.3x3", active: active, color: DT.success)
    }
}
struct ReviewTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon(active ? "clock.fill" : "clock", active: active, color: DT.editorial)
    }
}
struct GlossaryTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon(active ? "character.book.closed.fill" : "character.book.closed",
               active: active, color: DT.primary)
    }
}
struct ProfileTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon(active ? "person.fill" : "person", active: active, color: DT.profileColor)
    }
}

#Preview {
    VStack(spacing: 24) {
        HStack(spacing: 16) {
            CourseTabIcon(active: false)
            CourseTabIcon(active: true)
            PracticeTabIcon(active: false)
            PracticeTabIcon(active: true)
            ReviewTabIcon(active: false)
            ReviewTabIcon(active: true)
            GlossaryTabIcon(active: false)
            GlossaryTabIcon(active: true)
            ProfileTabIcon(active: false)
            ProfileTabIcon(active: true)
        }
        .padding()
        .background(DT.canvas)
    }
}
