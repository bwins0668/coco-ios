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
                .background(DesignTokens.canvas.ignoresSafeArea())
        }
        .modelContainer(container)
    }
}