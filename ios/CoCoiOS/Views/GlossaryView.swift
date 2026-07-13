import SwiftUI

/// 术语 Tab：masthead + 「01 术语」4 行入口 + 底部「术语浏览」预告（与 R8 设计语言对齐）
struct GlossaryView: View {
    @Environment(\.modelContext) private var ctx
    @State private var favoriteCount: Int = 0
    @State private var navigateFavorite: Bool = false
    @State private var navigateAnki: Bool = false
    @State private var navigateRandom: Bool = false
    @State private var navigateAll: Bool = false

    private struct Entry: Identifiable {
        let id: String
        let icon: String
        let title: String
        let stat: String
        let color: Color
    }

    private var entries: [Entry] {
        [
            Entry(id: "favorite", icon: "♥", title: "收藏复习",
                  stat: favoriteCount > 0 ? "\(favoriteCount) 条" : "暂无",
                  color: DT.success),
            Entry(id: "anki", icon: "▦", title: "闪卡记忆",
                  stat: "Anki 算法",
                  color: DT.primary),
            Entry(id: "random", icon: "⚂", title: "随机术语",
                  stat: "每日探索",
                  color: DT.pythonAccent),
            Entry(id: "all", icon: "≡", title: "全部浏览",
                  stat: "\(GlossaryStore.shared.data.total) 条",
                  color: DT.javaAccent)
        ]
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    sectionEntries
                    Spacer().frame(height: 80)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .navigationDestination(isPresented: $navigateFavorite) { FavoriteReviewView() }
            .navigationDestination(isPresented: $navigateAnki) { AnkiReviewView() }
            .navigationDestination(isPresented: $navigateRandom) { TermSearchView() }
            .navigationDestination(isPresented: $navigateAll) { TermSearchView() }
            .onAppear(perform: reload)
        }
        .navigationTransition(.slide)
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        favoriteCount = Storage.shared.getFavoriteTermCount()
    }

    private var masthead: some View {
        QPMasthead(
            kicker: "GLOSSARY · 术语",
            title: "术语",
            rightText: DT.jstDateString()
        )
    }

    private var sectionEntries: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "术语复习", meta: "\(entries.count) 入口")
            VStack(spacing: DT.space1) {
                ForEach(entries) { entry in
                    entryRow(entry: entry)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func entryRow(entry: Entry) -> some View {
        Button(action: { navigate(to: entry.id) }) {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    ZStack {
                        Circle()
                            .fill(entry.color.opacity(0.18))
                            .frame(width: 36, height: 36)
                        Image(systemName: iconSystemName(entry.icon))
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(entry.color)
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        Text(entry.title)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(entry.stat)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                    Spacer(minLength: 0)
                    Text("›")
                        .font(.system(size: DT.fontPageTitle, weight: .light))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
        .buttonStyle(.plain)
    }

    private func iconSystemName(_ s: String) -> String {
        switch s {
        case "♥": return "heart.fill"
        case "▦": return "square.grid.3x3.fill"
        case "⚂": return "die.face.5.fill"
        case "≡": return "list.bullet"
        default: return "circle.fill"
        }
    }

    private func navigate(to id: String) {
        switch id {
        case "favorite": navigateFavorite = true
        case "anki":     navigateAnki = true
        case "random":   navigateRandom = true
        case "all":      navigateAll = true
        default: break
        }
    }
}

#Preview {
    GlossaryView()
}
