import SwiftUI

/// 复习页：闪卡复习、错题复习、术语复习（接入 Storage 真实数据）
struct ReviewView: View {
    @Environment(\.modelContext) private var ctx
    @State private var wrongCount: Int = 0
    @State private var favoriteCount: Int = 0
    @State private var flashcardsCount: Int = 0
    @State private var navigateFlashcards: Bool = false
    @State private var navigateMistakes: Bool = false
    @State private var navigateTermReview: Bool = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    section01
                    Spacer().frame(height: 80)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .navigationDestination(isPresented: $navigateFlashcards) { FlashcardsView() }
            .navigationDestination(isPresented: $navigateMistakes) { MistakesView() }
            .navigationDestination(isPresented: $navigateTermReview) { GlossaryView() }
            .onAppear { reload() }
        }
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        wrongCount = Storage.shared.getMistakeCount()
        favoriteCount = Storage.shared.getFavoriteTermCount()
        flashcardsCount = Storage.shared.getFlashcardDecks().reduce(0) { $0 + $1.total }
    }

    private var masthead: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("REVIEW · 復習")
                .font(.system(size: DT.fontLabel))
                .tracking(2)
                .foregroundStyle(DT.textTertiary)
            Text("复习")
                .font(.system(size: DT.fontMasthead, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text("巩固薄弱点，温故知新")
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space3)
    }

    private var section01: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            HStack(alignment: .bottom) {
                QPSectionLabel("01", "今日复习")
                Spacer()
                Text("巩固薄弱点")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space3)

            VStack(spacing: DT.space1) {
                reviewCard(title: "闪卡复习",
                           sub: "IT Passport / SG 年度模拟闪卡 · \(flashcardsCount) 题",
                           color: DT.primary,
                           icon: "▦",
                           badge: nil,
                           action: { navigateFlashcards = true })
                reviewCard(title: "错题复习",
                           sub: wrongCount > 0 ? "已答错 \(wrongCount) 道 · 建议优先复盘" : "回顾错题，巩固薄弱知识点",
                           color: DT.danger,
                           icon: "✕",
                           badge: wrongCount > 0 ? "\(wrongCount)" : nil,
                           action: { navigateMistakes = true })
                reviewCard(title: "术语复习",
                           sub: favoriteCount > 0 ? "已收藏 \(favoriteCount) 条术语，可随时复习" : "复习收藏的术语与概念",
                           color: DT.success,
                           icon: "♥",
                           badge: favoriteCount > 0 ? "\(favoriteCount)" : nil,
                           action: { navigateTermReview = true })
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func reviewCard(title: String, sub: String, color: Color, icon: String, badge: String?, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    ZStack {
                        Circle().fill(color.opacity(0.15)).frame(width: 44, height: 44)
                        Text(icon).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(color)
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Text(title)
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.ink)
                            if let b = badge {
                                Text(b)
                                    .font(.system(size: DT.fontCaption, weight: .semibold))
                                    .padding(.horizontal, 6).padding(.vertical, 1)
                                    .background(color)
                                    .foregroundStyle(DT.surface)
                                    .clipShape(Capsule())
                            }
                        }
                        Text(sub)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                    Spacer(minLength: 0)
                    Text("›").font(.system(size: DT.fontPageTitle, weight: .light))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    ReviewView()
}