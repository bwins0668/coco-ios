import SwiftUI

/// 自定义底部 Tab 图标（PF Symbols 组合 / 状态化）
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
        ZStack {
            if active {
                Circle()
                    .fill(color.opacity(0.15))
                    .frame(width: size + 14, height: size + 14)
            }
            Image(systemName: active ? "\(system).fill" : system)
                .font(.system(size: size, weight: active ? .semibold : .regular))
                .foregroundStyle(active ? color : DT.textTertiary)
                .symbolRenderingMode(.hierarchical)
        }
    }
}

/// 5 个 Tab 各自的图标组合
struct CourseTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon("book.fill", active: active, color: DT.primary)
    }
}
struct PracticeTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon("doc.text.fill", active: active, color: DT.success)
    }
}
struct ReviewTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon("clock.fill", active: active, color: DT.editorial)
    }
}
struct GlossaryTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon("character.book.closed.fill", active: active, color: DT.primary)
    }
}
struct ProfileTabIcon: View {
    let active: Bool
    var body: some View {
        TabIcon("person.fill", active: active, color: DT.profileColor)
    }
}

#Preview {
    HStack(spacing: 16) {
        CourseTabIcon(active: false)
        PracticeTabIcon(active: true)
        ReviewTabIcon(active: false)
        GlossaryTabIcon(active: true)
        ProfileTabIcon(active: false)
    }
    .padding()
    .background(DT.canvas)
}