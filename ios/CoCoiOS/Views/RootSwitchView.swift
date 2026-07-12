import SwiftUI
import SwiftData

struct RootSwitchView: View {
    var body: some View {
        TabView {
            CourseCenterView()
                .tabItem {
                    Label("课程", systemImage: "book.fill")
                }

            PracticeListView()
                .tabItem {
                    Label("刷题", systemImage: "doc.text.fill")
                }

            ReviewListView()
                .tabItem {
                    Label("复习", systemImage: "clock.fill")
                }

            GlossaryPlaceholderView()
                .tabItem {
                    Label("术语", systemImage: "character.book.closed.fill")
                }

            ProfilePlaceholderView()
                .tabItem {
                    Label("我的", systemImage: "person.fill")
                }
        }
        .tint(DesignTokens.primary)
        .toolbarBackground(DesignTokens.surface, for: .tabBar)
        .toolbarBackground(.visible, for: .tabBar)
        .background(DesignTokens.canvas.ignoresSafeArea())
    }
}

extension View {
    /// 强制导航栏使用浅色配色，避免大标题在浅色背景下显示为白字
    func forceLightNavigation() -> some View {
        modifier(LightNavigationBarModifier())
    }
}

struct LightNavigationBarModifier: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 16.0, *) {
            content
                .toolbarColorScheme(.light, for: .navigationBar)
        } else {
            content
        }
    }
}

#Preview {
    RootSwitchView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}