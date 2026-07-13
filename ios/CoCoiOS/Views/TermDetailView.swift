import SwiftUI
import SwiftData

/// 术语详情页：返回 + masthead + 红顶 中文释义 + 日文释义 + 示例 + 收藏 toggle
struct TermDetailView: View {
    let term: GlossaryTerm
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var favorited: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                masthead
                zhBlock
                jaBlock
                if !term.example.isEmpty && term.example != "请结合课程内容理解该术语。" {
                    exampleBlock
                }
                actions
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space2)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .onAppear(perform: reload)
    }

    // MARK: - Header
    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
            Button(action: toggleFavorite) {
                Image(systemName: favorited ? "heart.fill" : "heart")
                    .font(.system(size: DT.fontBody))
                    .foregroundStyle(favorited ? DT.danger : DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, DT.space2)
    }

    private var masthead: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Text(term.category)
                    .font(.system(size: DT.fontLabel, weight: .medium)).tracking(1.5)
                    .foregroundStyle(DT.textTertiary)
                Text("·").foregroundStyle(DT.textTertiary)
                Text(term.level)
                    .font(.system(size: DT.fontLabel, weight: .medium)).tracking(1.5)
                    .foregroundStyle(DT.textTertiary)
            }
            Text(term.term)
                .font(.system(size: DT.fontMasthead, weight: .semibold)).tracking(-0.5)
                .foregroundStyle(DT.ink)
            Text(term.zh)
                .font(.system(size: DT.fontBody, weight: .medium))
                .foregroundStyle(DT.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DT.space3)
    }

    /// 红顶卡 (中文释义)
    private var zhBlock: some View {
        QPRedHeaderCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                sectionLabel("中文释义 / Chinese")
                Text(term.zh)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                if !term.explanationZh.isEmpty {
                    Text(term.explanationZh)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineSpacing(3)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var jaBlock: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                sectionLabel("日本語 / Japanese")
                Text(term.ja)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                if !term.explanationJa.isEmpty {
                    Text(term.explanationJa)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineSpacing(3)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var exampleBlock: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                sectionLabel("示例 / 例")
                Text(term.example)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.ink)
                    .lineSpacing(3)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var actions: some View {
        VStack(spacing: DT.space1) {
            QPPrimaryButton(favorited ? "已收藏 ✓" : "☆ 收藏术语") { toggleFavorite() }
            QPOutlineButton("加入闪卡复习") { }
        }
        .padding(.horizontal, DT.space3)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text)
            .font(.system(size: DT.fontLabel, weight: .semibold))
            .tracking(2)
            .foregroundStyle(DT.textTertiary)
    }

    // MARK: - Data
    private func reload() {
        AppContext.bootstrap(ctx)
        favorited = (try? ctx.fetch(FetchDescriptor<FavoriteTerm>(
            predicate: #Predicate { $0.termId == term.id }
        )))?.first != nil
    }

    private func toggleFavorite() {
        AppContext.bootstrap(ctx)
        if favorited {
            if let existing = (try? ctx.fetch(FetchDescriptor<FavoriteTerm>(
                predicate: #Predicate { $0.termId == term.id }
            )))?.first {
                ctx.delete(existing)
            }
        } else {
            ctx.insert(FavoriteTerm(termId: term.id, createdAt: Date()))
        }
        try? ctx.save()
        favorited.toggle()
    }
}

#Preview {
    TermDetailView(term: GlossaryTerm(
        id: "demo",
        term: "Sample Term",
        zh: "示例术语",
        ja: "サンプル用語",
        en: "Sample",
        category: "demo",
        level: "basic",
        tags: [],
        explanationZh: "示例中文解释",
        explanationJa: "サンプル説明",
        example: "Sample example sentence."
    ))
}
