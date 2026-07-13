import SwiftUI
import SwiftData

/// 术语搜索页：返回 + 搜索框 + 类别 chips + 结果 list
/// 数据：GlossaryStore.search(query)
struct TermSearchView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var query: String = ""
    @State private var selectedCategory: String = "全部"
    @State private var navigateDetail: GlossaryTerm? = nil

    private var categories: [String] {
        ["全部"] + GlossaryStore.shared.data.categories
    }

    private var filtered: [GlossaryTerm] {
        let base = GlossaryStore.shared.search(query)
        guard selectedCategory != "全部" else { return base }
        return base.filter { $0.category == selectedCategory }
    }

    var body: some View {
        VStack(spacing: 0) {
            backButton
            masthead
            searchBar
            categoryChips
            list
        }
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .navigationDestination(isPresented: Binding(
            get: { navigateDetail != nil },
            set: { if !$0 { navigateDetail = nil } }
        )) {
            if let t = navigateDetail { TermDetailView(term: t) }
        }
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
        }
        .padding(.horizontal, DT.space2)
    }

    private var masthead: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("全部浏览").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
            Text("术语搜索").font(.system(size: DT.fontMasthead, weight: .semibold)).foregroundStyle(DT.ink)
            Text("\(GlossaryStore.shared.data.total) 条术语 · \(categories.count - 1) 个分类")
                .font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DT.space3)
    }

    private var searchBar: some View {
        QPSearchField(text: $query, placeholder: "搜索术语、关键词...")
            .padding(.horizontal, DT.space3)
            .padding(.top, DT.space1)
    }

    private var categoryChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(categories, id: \.self) { cat in
                    Button(action: { selectedCategory = cat }) {
                        Text(cat)
                            .font(.system(size: DT.fontCaption, weight: cat == selectedCategory ? .semibold : .medium))
                            .padding(.horizontal, DT.space2).padding(.vertical, 6)
                            .background(cat == selectedCategory ? DT.primary : DT.surface)
                            .foregroundStyle(cat == selectedCategory ? DT.surface : DT.ink)
                            .clipShape(Capsule())
                            .overlay(Capsule().stroke(cat == selectedCategory ? DT.primary : DT.line, lineWidth: 0.5))
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, DT.space3)
        }
        .padding(.vertical, DT.space2)
    }

    @ViewBuilder
    private var list: some View {
        if filtered.isEmpty {
            VStack {
                Spacer().frame(height: 40)
                Text("没有匹配的术语")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textTertiary)
            }
            .frame(maxWidth: .infinity)
        } else {
            ScrollView {
                VStack(spacing: 0) {
                    ForEach(filtered) { term in
                        Button(action: { navigateDetail = term }) {
                            QPCard {
                                VStack(alignment: .leading, spacing: 4) {
                                    HStack {
                                        Text(term.term)
                                            .font(.system(size: DT.fontBody, weight: .semibold))
                                            .foregroundStyle(DT.ink)
                                        Spacer()
                                        QPPill(term.category)
                                    }
                                    Text(term.zh)
                                        .font(.system(size: DT.fontCaption))
                                        .foregroundStyle(DT.textSecondary)
                                        .lineLimit(2)
                                }
                            }
                            .padding(.horizontal, DT.space3)
                            .padding(.bottom, DT.space1)
                        }
                        .buttonStyle(.plain)
                    }
                    Spacer().frame(height: 80)
                }
                .padding(.top, 4)
            }
        }
    }
}

#Preview { TermSearchView() }
