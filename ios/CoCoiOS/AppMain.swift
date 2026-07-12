import SwiftUI
import SwiftData

@main
struct CoCoiOSApp: App {
    let container: ModelContainer

    init() {
        do {
            container = try ModelContainer(for: MistakeRecord.self, StudyStat.self)
        } catch {
            fatalError("SwiftData 初始化失败: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            RootSwitchView()
                .background(DT.canvas.ignoresSafeArea())
        }
        .modelContainer(container)
    }
}

struct RootNavigationTitleModifier: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 17.0, *) {
            content
                .toolbarColorScheme(.light, for: .navigationBar)
        } else {
            content
        }
    }
}

extension View {
    func rootNavigationStyle() -> some View {
        modifier(RootNavigationTitleModifier())
    }
}