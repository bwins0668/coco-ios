import SwiftUI
import SwiftData

/// 术语搜索页：搜索 + 列表（接入 GlossaryStore 真实 1500 词条）
struct TermSearchView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var query: String = ""
    @State private var navigateDetail: GlossaryTerm? = nil

    private var filtered: [GlossaryTerm] {
        GlossaryStore.shared.search(query)
    }

    var body: some View {
        VStack(spacing: 0) {
            backButton
            searchBar
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

    private var searchBar: some View {
        HStack(spacing: 6) {
            Image(systemName: "magnifyingglass").foregroundStyle(DT.textTertiary)
            TextField("搜索术语、关键词...", text: $query)
                .font(.system(size: DT.fontBody))
                .textFieldStyle(.plain)
                .autocorrectionDisabled()
            if !query.isEmpty {
                Button(action: { query = "" }) {
                    Image(systemName: "xmark.circle.fill").foregroundStyle(DT.textTertiary)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, DT.space2).padding(.vertical, 10)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    private var list: some View {
        ScrollView {
            VStack(spacing: 0) {
                HStack {
                    Text("共 \(filtered.count) 条 · 总计 \(GlossaryStore.shared.data.total) 条")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                    Spacer()
                }
                .padding(.horizontal, DT.space3).padding(.top, DT.space1)
                if filtered.isEmpty {
                    emptyState
                } else {
                    ForEach(Array(filtered.prefix(200).enumerated()), id: \.element.id) { idx, term in
                        if idx > 0 {
                            Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space3)
                        }
                        Button(action: { navigateDetail = term }) {
                            termRow(term: term)
                        }
                        .buttonStyle(.plain)
                    }
                    if filtered.count > 200 {
                        Text("更多结果请缩小搜索范围")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                            .padding(.vertical, DT.space2)
                    }
                }
                Spacer().frame(height: 80)
            }
        }
    }

    private var emptyState: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("没有匹配的术语")
                    .font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                Text("试试搜索「数据库」「暗号化」「変数」等关键词。")
                    .font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private func termRow(term: GlossaryTerm) -> some View {
        HStack(alignment: .center, spacing: DT.space2) {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(term.zh).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                    Text(term.ja).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                }
                Text(term.term).font(.system(size: DT.fontLabel)).foregroundStyle(DT.textTertiary)
                if !term.explanationZh.isEmpty {
                    Text(term.explanationZh)
                        .font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(2)
                }
            }
            Spacer()
            if !term.category.isEmpty {
                QPPill(term.category, background: DT.fillWarm, foreground: DT.textTertiary)
            }
        }
        .padding(.horizontal, DT.space3).padding(.vertical, DT.space2)
    }
}

#Preview {
    TermSearchView()
}