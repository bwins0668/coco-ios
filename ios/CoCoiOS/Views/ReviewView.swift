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
                .padding(.bottom, DT.space4)
            }
            .scrollContentBackground(.hidden)
            .safeAreaInset(edge: .bottom) { Color.clear.frame(height: 0) }
            .navigationBarHidden(true)
            .navigationDestination(isPresented: $navigateFlashcards) { FlashcardsView() }
            .navigationDestination(isPresented: $navigateMistakes) { MistakesView() }
            .navigationDestination(isPresented: $navigateTermReview) { GlossaryView() }
            .onAppear { reload() }
        }
        .background(DT.canvas.ignoresSafeArea())
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
                           sub: "IT Passport / SG 年度模拟闪卡",
                           badge: nil,
                           action: { navigateFlashcards = true })
                reviewCard(title: "错题复习",
                           sub: "回顾错题，巩固薄弱知识点",
                           badge: wrongCount > 0 ? "\(wrongCount)" : nil,
                           action: { navigateMistakes = true })
                reviewCard(title: "术语复习",
                           sub: "复习收藏的术语与概念",
                           badge: favoriteCount > 0 ? "\(favoriteCount)" : nil,
                           action: { navigateTermReview = true })
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func reviewCard(title: String, sub: String, badge: String?, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(title)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(sub)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                    Spacer()
                    if let badge {
                        Text(badge)
                            .font(.system(size: DT.fontCaption, weight: .semibold))
                            .foregroundStyle(DT.primary)
                            .padding(.horizontal, 8).padding(.vertical, 4)
                            .background(DT.primarySoft)
                            .clipShape(Capsule())
                    }
                    Image(systemName: "chevron.right")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
        .buttonStyle(.plain)
    }
}