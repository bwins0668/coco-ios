import SwiftUI

/// 收藏复习页：列出所有 FavoriteTerm 进入 Anki 流程
struct FavoriteReviewView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var navigateAnki: Bool = false
    @State private var favoriteCount: Int = 0

    var body: some View {
        VStack(spacing: 0) {
            backButton
            header
            content
        }
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .navigationDestination(isPresented: $navigateAnki) { AnkiReviewView() }
        .onAppear {
            AppContext.bootstrap(ctx)
            favoriteCount = Storage.shared.getFavoriteTermCount()
        }
    }

    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("收藏复习")
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text("\(favoriteCount) 条已收藏 · 随时复习")
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textSecondary)
        }
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private var content: some View {
        if favoriteCount > 0 {
            ScrollView {
                VStack(spacing: DT.space2) {
                    QPCard {
                        VStack(alignment: .leading, spacing: DT.space1) {
                            Text("已收藏 \(favoriteCount) 条术语")
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.ink)
                            Text("通过 Anki 算法巩固记忆。")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                            QPPrimaryButton("开始 Anki 复习") { navigateAnki = true }
                                .padding(.top, DT.space1)
                        }
                    }
                    Spacer().frame(height: 80)
                }
                .padding(.horizontal, DT.space3)
                .padding(.top, DT.space2)
            }
        } else {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    Text("暂无收藏术语")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("搜索术语并点击 ☆ 即可收藏到此处。")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                    QPPrimaryButton("去搜索术语") {}
                        .padding(.top, DT.space1)
                }
            }
            .padding(.horizontal, DT.space3)
            .padding(.top, DT.space2)
        }
    }
}

#Preview {
    FavoriteReviewView()
}