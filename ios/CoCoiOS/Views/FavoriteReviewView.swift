import SwiftUI
import SwiftData

/// 收藏复习页 (B-11 1:1)：大圆角空态卡 + 「去术语表」 黑色全宽主按钮 + 占位 outline 按钮
/// Stage G1：wire 「开始 Anki 复习」 → AnkiReviewView（Stage G1 SM-2 调度）
struct FavoriteReviewView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var favoriteCount: Int = 0
    @State private var navigateGlossary: Bool = false
    @State private var navigateAnki: Bool = false

    var body: some View {
        VStack(spacing: 0) {
            backButton
            if favoriteCount > 0 {
                hasFavoritesState
            } else {
                emptyState
            }
        }
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .navigationDestination(isPresented: $navigateGlossary) { GlossaryView() }
        .navigationDestination(isPresented: $navigateAnki) { AnkiReviewView() }
        .onAppear {
            AppContext.bootstrap(ctx)
            favoriteCount = Storage.shared.getFavoriteTermCount()
        }
    }

    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("\u{2039}").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    /// B-11 空态：居中 + 圆角 + 「+」 圆 button + 主标题 + 灰副 + 黑底全宽主按钮 + 占位 outline
    private var emptyState: some View {
        VStack {
            Spacer().frame(height: 60)
            VStack(spacing: DT.space2) {
                QPCard(cornerRadius: DT.radiusXl, padding: DT.space4) {
                    VStack(spacing: DT.space2) {
                        ZStack {
                            Circle()
                                .stroke(DT.textTertiary, lineWidth: 1)
                                .frame(width: 56, height: 56)
                            Image(systemName: "plus")
                                .font(.system(size: 22, weight: .light))
                                .foregroundStyle(DT.textTertiary)
                        }
                        .padding(.top, DT.space3)

                        Text("还没有收藏术语")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)

                        Text("当前还没有收藏术语。遇到重要术语时，可以先收藏，之后在这里集中复习。")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                            .multilineTextAlignment(.center)
                            .lineSpacing(3)
                            .padding(.horizontal, DT.space2)

                        Button(action: { navigateGlossary = true }) {
                            Text("去术语表")
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.surface)
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(DT.ink)
                                .clipShape(Capsule())
                        }
                        .buttonStyle(.plain)
                        .padding(.top, DT.space2)

                        // 占位 outline 按钮
                        Button(action: {}) {
                            Text("")
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                        }
                        .buttonStyle(.plain)
                        .overlay(Capsule().stroke(DT.line, lineWidth: 0.5))
                        .padding(.top, 6)
                    }
                }
                .padding(.horizontal, DT.space3)
            }
            Spacer()
        }
    }

    private var hasFavoritesState: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                headerBlock
                listOrMenuCard
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space2)
            .padding(.horizontal, DT.space3)
        }
    }

    private var headerBlock: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("收藏术语")
                .font(.system(size: DT.fontMasthead, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text("\(favoriteCount) 条已收藏 · 随时复习")
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textSecondary)
        }
    }

    private var listOrMenuCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("已收藏 \(favoriteCount) 条术语")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("通过 SM-2 算法（Anki 间隔重复）巩固记忆。")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                QPPrimaryButton("开始 Anki 复习") { navigateAnki = true }
                    .padding(.top, DT.space1)
            }
        }
    }
}

#Preview {
    FavoriteReviewView()
}
