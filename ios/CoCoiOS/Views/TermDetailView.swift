import SwiftUI
import SwiftData

/// 术语详情页：双语 + 收藏 + Anki（接入 GlossaryStore + SwiftData）
struct TermDetailView: View {
    let term: GlossaryTerm
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
                        if !term.explanationZh.isEmpty {
                            Text(term.explanationZh)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }
                    }
                }
                .padding(.horizontal, DT.space3)

                QPCard {
                    VStack(alignment: .leading, spacing: DT.space1) {
                        sectionLabel("日本語 / Japanese")
                        Text(term.ja).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                        Text("English: \(term.term)")
                            .font(.system(size: DT.fontCaption)).foregroundStyle(DT.textTertiary)
                        if !term.explanationJa.isEmpty {
                            Text(term.explanationJa).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                        }
                    }
                }
                .padding(.horizontal, DT.space3)

                if !term.example.isEmpty && term.example != "请结合课程内容理解该术语。" {
                    QPCard {
                        VStack(alignment: .leading, spacing: DT.space1) {
                            sectionLabel("示例 / 例")
                            Text(term.example).font(.system(size: DT.fontCaption)).foregroundStyle(DT.ink)
                        }
                    }
                    .padding(.horizontal, DT.space3)
                }

                HStack(spacing: DT.space1) {
                    Button(action: toggleFavorite) {
                        HStack(spacing: 6) {
                            Text(favorited ? "♥" : "☆").font(.system(size: DT.fontBody, weight: .semibold))
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
                        .frame(maxWidth: .infinity).padding(.vertical, DT.space2)
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
            favorited = isFavorited()
        }
    }

    private func isFavorited() -> Bool {
        let id = term.id
        let descriptor = FetchDescriptor<FavoriteTerm>(
            predicate: #Predicate { $0.termId == id }
        )
        return ((try? ctx.fetchCount(descriptor)) ?? 0) > 0
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
            HStack(spacing: 6) {
                Text(term.term)
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .tracking(1)
                    .foregroundStyle(DT.textTertiary)
                if !term.category.isEmpty {
                    QPPill(term.category, background: DT.fillWarm, foreground: DT.textTertiary)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontLabel)).tracking(2)
            .foregroundStyle(DT.textTertiary)
    }
}

#Preview {
    TermDetailView(term: GlossaryTerm(id: "term-0001", term: "Database", zh: "数据库",
                                       ja: "データベース", en: "Database", category: "database",
                                       level: "basic", tags: ["itpass", "sg"],
                                       explanationZh: "按结构组织、存储和管理数据的仓库。",
                                       explanationJa: "DB とも呼ばれる。",
                                       example: "CREATE DATABASE school;"))
}