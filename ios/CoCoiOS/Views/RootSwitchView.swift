import SwiftUI
import SwiftData

/// 根视图：5 Tab 切换
struct RootSwitchView: View {
    @State private var selectedTab: Int = 0
    @State private var homePath: [HomeRoute] = []
    @State private var practicePath: [PracticeRoute] = []
    @State private var reviewPath: [ReviewRoute] = []
    @State private var glossaryPath: [GlossaryRoute] = []
    @State private var profilePath: [ProfileRoute] = []

    enum HomeRoute: Hashable { case courseDetail(String, String), flashcards, flashcardPlayer }
    enum PracticeRoute: Hashable { case examMenu(String) }
    enum ReviewRoute: Hashable { case flashcards, mistakes, termReview }
    enum GlossaryRoute: Hashable { case favoriteReview, ankiReview, random, all }
    enum ProfileRoute: Hashable { case backup, help, feedback }

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tag(0)
                .tabItem {
                    Label {
                        Text("课程")
                    } icon: {
                        CourseTabIcon(active: selectedTab == 0)
                    }
                }

            PracticeView()
                .tag(1)
                .tabItem {
                    Label {
                        Text("刷题")
                    } icon: {
                        PracticeTabIcon(active: selectedTab == 1)
                    }
                }

            ReviewView()
                .tag(2)
                .tabItem {
                    Label {
                        Text("复习")
                    } icon: {
                        ReviewTabIcon(active: selectedTab == 2)
                    }
                }

            GlossaryView()
                .tag(3)
                .tabItem {
                    Label {
                        Text("术语")
                    } icon: {
                        GlossaryTabIcon(active: selectedTab == 3)
                    }
                }

            ProfileView()
                .tag(4)
                .tabItem {
                    Label {
                        Text("我的")
                    } icon: {
                        ProfileTabIcon(active: selectedTab == 4)
                    }
                }
        }
        .tint(DT.primary)
        .toolbarBackground(DT.surface, for: .tabBar)
        .toolbarBackground(.visible, for: .tabBar)
        .background(DT.canvas.ignoresSafeArea())
    }
}

#Preview {
    RootSwitchView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}