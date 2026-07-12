import SwiftUI

/// 术语页：术语表学习中心（接入 Storage 真实收藏数 + 路由 4 个入口）
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
                  color: Color(hex: "C25A28")),
            Entry(id: "anki", icon: "▦", title: "闪卡记忆", stat: "Anki",
                  color: Color(hex: "5C4B8A")),
            Entry(id: "random", icon: "⚂", title: "随机术语", stat: "探索",
                  color: Color(hex: "3F8C82")),
            Entry(id: "all", icon: "≡", title: "全部浏览", stat: "1500 条",
                  color: Color(hex: "37418A"))
        ]
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space2) {
                    hero
                    entriesList
                    Spacer().frame(height: 80)
                }
                .padding(.top, DT.space3)
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .navigationDestination(isPresented: $navigateFavorite) { FavoriteReviewView() }
            .navigationDestination(isPresented: $navigateAnki) { AnkiReviewView() }
            .navigationDestination(isPresented: $navigateRandom) { TermSearchView() }
            .navigationDestination(isPresented: $navigateAll) { TermSearchView() }
            .onAppear {
                AppContext.bootstrap(ctx)
                favoriteCount = Storage.shared.getFavoriteTermCount()
            }
        }
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: DT.space2) {
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("术语表")
                        .font(.system(size: DT.fontPageTitle, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("1500 条 IT 术语 · 中英日三语")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
                Spacer()
                if favoriteCount > 0 {
                    Text("\(favoriteCount) 收藏")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .padding(.horizontal, 10).padding(.vertical, 4)
                        .background(DT.fillWarm).foregroundStyle(DT.ink)
                        .clipShape(Capsule())
                }
            }

            Button(action: {}) {
                HStack(alignment: .center, spacing: DT.space2) {
                    Text("⌕").font(.system(size: DT.fontBody, weight: .medium)).foregroundStyle(DT.textTertiary)
                    Text("搜索术语、关键词...")
                        .font(.system(size: DT.fontCaption)).foregroundStyle(DT.textTertiary)
                    Spacer()
                    Text("›").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
                }
                .padding(.horizontal, DT.space2).padding(.vertical, 10)
                .background(DT.surfaceMuted)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous)
                        .stroke(DT.line, lineWidth: 0.5)
                )
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, DT.space3)
    }

    private var entriesList: some View {
        VStack(spacing: DT.space1) {
            ForEach(entries) { entry in
                Button(action: {
                    switch entry.id {
                    case "favorite": navigateFavorite = true
                    case "anki": navigateAnki = true
                    case "random": navigateRandom = true
                    case "all": navigateAll = true
                    default: break
                    }
                }) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Circle().fill(entry.color.opacity(0.15)).frame(width: 40, height: 40)
                            .overlay(Text(entry.icon).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(entry.color))
                        Text(entry.title).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                        Spacer()
                        Text(entry.stat).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textTertiary)
                        Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
                    }
                    .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
                    .background(DT.surface)
                    .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                            .stroke(DT.line, lineWidth: 0.5)
                    )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, DT.space3)
    }
}

#Preview {
    GlossaryView()
}