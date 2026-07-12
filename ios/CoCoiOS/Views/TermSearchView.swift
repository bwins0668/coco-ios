import SwiftUI

/// 术语搜索页：搜索 + 列表
struct TermSearchView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var query: String = ""
    @State private var terms: [TermItem] = TermItem.demo
    @State private var navigateDetail: TermItem? = nil

    var filtered: [TermItem] {
        if query.isEmpty { return terms }
        let q = query.lowercased()
        return terms.filter {
            $0.zh.lowercased().contains(q) ||
            $0.ja.lowercased().contains(q) ||
            $0.en.lowercased().contains(q)
        }
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
            Image(systemName: "magnifyingglass")
                .foregroundStyle(DT.textTertiary)
            TextField("搜索术语、关键词...", text: $query)
                .font(.system(size: DT.fontBody))
                .textFieldStyle(.plain)
                .autocorrectionDisabled()
            if !query.isEmpty {
                Button(action: { query = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(DT.textTertiary)
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
                    Text("共 \(filtered.count) 条")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                    Spacer()
                }
                .padding(.horizontal, DT.space3)
                .padding(.top, DT.space1)
                ForEach(Array(filtered.enumerated()), id: \.element.id) { idx, term in
                    if idx > 0 {
                        Rectangle().fill(DT.line).frame(height: 0.5)
                            .padding(.horizontal, DT.space3)
                    }
                    Button(action: { navigateDetail = term }) {
                        termRow(term: term)
                    }
                    .buttonStyle(.plain)
                }
                Spacer().frame(height: 80)
            }
        }
    }

    private func termRow(term: TermItem) -> some View {
        HStack(alignment: .center, spacing: DT.space2) {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(term.zh).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                    Text(term.ja).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                }
                Text(term.en).font(.system(size: DT.fontLabel)).foregroundStyle(DT.textTertiary)
                Text(term.desc).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(2)
            }
            Spacer()
            Text(term.favorited ? "♥" : "☆")
                .font(.system(size: DT.fontBody))
                .foregroundStyle(term.favorited ? DT.editorial : DT.textTertiary)
        }
        .padding(.horizontal, DT.space3).padding(.vertical, DT.space2)
    }
}

/// 术语数据模型（演示用，下一轮接真实 glossary JSON）
struct TermItem: Identifiable, Hashable {
    let id: String
    let zh: String
    let ja: String
    let en: String
    let desc: String
    var favorited: Bool

    static let demo: [TermItem] = [
        TermItem(id: "1", zh: "算法", ja: "アルゴリズム", en: "Algorithm",
                 desc: "为解决问题而定义的有限步骤序列。", favorited: true),
        TermItem(id: "2", zh: "数据库", ja: "データベース", en: "Database",
                 desc: "按结构组织、可长期保存的数据集合。", favorited: false),
        TermItem(id: "3", zh: "服务器", ja: "サーバ", en: "Server",
                 desc: "为其他客户端提供资源或服务的程序。", favorited: true),
        TermItem(id: "4", zh: "编译器", ja: "コンパイラ", en: "Compiler",
                 desc: "把源代码翻译成目标代码的程序。", favorited: false),
        TermItem(id: "5", zh: "二进制", ja: "2進数", en: "Binary",
                 desc: "以 0/1 表示的数制。", favorited: false),
        TermItem(id: "6", zh: "加密", ja: "暗号化", en: "Encryption",
                 desc: "对信息进行编码以保护其机密性。", favorited: true),
        TermItem(id: "7", zh: "索引", ja: "インデックス", en: "Index",
                 desc: "加速数据库查询的数据结构。", favorited: false),
        TermItem(id: "8", zh: "网络", ja: "ネットワーク", en: "Network",
                 desc: "通过链路互连的设备集合。", favorited: false)
    ]
}

#Preview {
    TermSearchView()
}