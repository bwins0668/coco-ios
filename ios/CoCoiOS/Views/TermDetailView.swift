import SwiftUI

/// 术语详情页：双语 + 收藏 + Anki 复习入口
struct TermDetailView: View {
    let term: TermItem
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var favorited: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                header
                QPCard {
                    VStack(alignment: .leading, spacing: DT.space1) {
                        sectionLabel("中文释义")
                        Text(term.zh)
                            .font(.system(size: DT.fontPageTitle, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(term.desc)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                }
                .padding(.horizontal, DT.space3)

                QPCard {
                    VStack(alignment: .leading, spacing: DT.space1) {
                        sectionLabel("日本語 / Japanese")
                        Text(term.ja)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text("English: \(term.en)")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }
                }
                .padding(.horizontal, DT.space3)

                HStack(spacing: DT.space1) {
                    Button(action: toggleFavorite) {
                        HStack(spacing: 6) {
                            Text(favorited ? "♥" : "☆")
                                .font(.system(size: DT.fontBody, weight: .semibold))
                            Text(favorited ? "已收藏" : "收藏术语")
                                .font(.system(size: DT.fontBody, weight: .semibold))
                        }
                        .foregroundStyle(favorited ? DT.editorial : DT.ink)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DT.space2)
                        .background(favorited ? DT.dangerSoft : DT.fillWarm)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                    }
                    .buttonStyle(.plain)
                    Button(action: {}) {
                        HStack(spacing: 6) {
                            Text("▦").font(.system(size: DT.fontBody, weight: .semibold))
                            Text("加入 Anki").font(.system(size: DT.fontBody, weight: .semibold))
                        }
                        .foregroundStyle(DT.ink)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DT.space2)
                        .background(DT.surface)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                                .stroke(DT.line, lineWidth: 0.5)
                        )
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, DT.space3)
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .onAppear {
            AppContext.bootstrap(ctx)
            favorited = term.favorited
        }
    }

    private func toggleFavorite() {
        favorited.toggle()
        let id = term.id
        if favorited {
            ctx.insert(FavoriteTerm(termId: id))
        } else {
            let descriptor = FetchDescriptor<FavoriteTerm>(
                predicate: #Predicate { $0.termId == id }
            )
            if let existing = try? ctx.fetch(descriptor) {
                for e in existing { ctx.delete(e) }
            }
        }
        try? ctx.save()
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
            Text(term.zh)
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text(term.en)
                .font(.system(size: DT.fontCaption, weight: .medium))
                .tracking(1)
                .foregroundStyle(DT.textTertiary)
        }
        .padding(.horizontal, DT.space3)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontLabel)).tracking(2)
            .foregroundStyle(DT.textTertiary)
    }
}

#Preview {
    TermDetailView(term: TermItem(id: "1", zh: "算法", ja: "アルゴリズム", en: "Algorithm",
                                  desc: "为解决问题而定义的有限步骤序列。", favorited: false))
}