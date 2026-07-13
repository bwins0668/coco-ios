import SwiftUI

/// 自定义底部 Tab 图标：纯 SF Symbol（iOS 13+ baseline）。
/// 注意：早期版本用 ZStack + 外部 Circle 装饰，在 tabBar layout 中被判定为 layout
/// view 而遮住内部 Icon。改为纯 Image + 用 foregroundStyle 由 TabView tint 统一着色。
struct TabIcon: View {
    let system: String
    let active: Bool
    let color: Color
    let size: CGFloat

    init(_ system: String, active: Bool = false, color: Color = DT.primary, size: CGFloat = 22) {
        self.system = system
        self.active = active
        self.color = color
        self.size = size
    }

    var body: some View {
        Image(systemName: system)
            .font(.system(size: size, weight: active ? .semibold : .regular))
            .foregroundStyle(active ? color : DT.textTertiary)
            .symbolRenderingMode(.hierarchical)
    }
}

/// 各 Tab 图标（iOS 13/14 baseline SF Symbols）
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
