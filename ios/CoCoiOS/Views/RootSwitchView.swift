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
                    Label("课程", systemImage: selectedTab == 0 ? "house.fill" : "house")
                }

            PracticeView()
                .tag(1)
                .tabItem {
                    Label("刷题", systemImage: selectedTab == 1 ? "square.grid.3x3.fill" : "square.grid.3x3")
                }

            ReviewView()
                .tag(2)
                .tabItem {
                    Label("复习", systemImage: selectedTab == 2 ? "clock.fill" : "clock")
                }

            GlossaryView()
                .tag(3)
                .tabItem {
                    Label("术语", systemImage: selectedTab == 3 ? "character.book.closed.fill" : "character.book.closed")
                }

            ProfileView()
                .tag(4)
                .tabItem {
                    Label("我的", systemImage: selectedTab == 4 ? "person.fill" : "person")
                }
        }
        .tint(DT.primary)
        .toolbarBackground(.ultraThinMaterial, for: .tabBar)
        .toolbarBackground(.visible, for: .tabBar)
        .background(DT.canvas.ignoresSafeArea())
    }
}

#Preview {
    RootSwitchView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}