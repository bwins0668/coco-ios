import SwiftUI
import SwiftData

struct TabRootView: View {
    @State private var selectedTab: String = "course"

    var body: some View {
        TabView(selection: $selectedTab) {
            CourseCenterView()
                .tag("course")
                .tabItem {
                    Label("课程", systemImage: "house")
                }

            PracticeListView()
                .tag("practice")
                .tabItem {
                    Label("刷题", systemImage: "doc.text")
                }

            ReviewListView()
                .tag("review")
                .tabItem {
                    Label("复习", systemImage: "clock")
                }

            GlossaryPlaceholderView()
                .tag("terms")
                .tabItem {
                    Label("术语", systemImage: "book")
                }

            ProfilePlaceholderView()
                .tag("profile")
                .tabItem {
                    Label("我的", systemImage: "person")
                }
        }
    }
}

#Preview {
    TabRootView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}
