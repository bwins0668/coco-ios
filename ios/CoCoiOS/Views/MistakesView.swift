import SwiftUI
import SwiftData

/// 错题本页 (B-10 1:1)：MISTAKE 红顶 + 数字 row + chips + 建议优先复习 + 搜索 + 4 段切换 + 列表模式 + 重新练习错题 + 列表
struct MistakesView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx

    @State private var totalCount: Int = 0
    @State private var pendingCount: Int = 0
    @State private var masteredCount: Int = 0
    @State private var chipCounts: [(label: String, count: Int)] = []
    @State private var allRecords: [MistakeRecord] = []
    @State private var searchText: String = ""
    @State private var selectedFilter: String = "全部"  // 全部 / IT Passport / SG / 日文题
    @State private var mode: String = "列表模式"      // 列表模式 / 复习模式

    private let filters = ["全部", "IT Passport", "SG", "日文题"]
    private let modes = ["列表模式", "复习模式"]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                headerCard
                numericRow
                chipsRow
                suggestionCard
                searchField
                pickerRow
                Spacer().frame(height: 6)
                modeAndCta
                listOrEmpty
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space2)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .onAppear { reload() }
        .navigationTransition(.slide)
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

    private var headerCard: some View {
        QPRedHeaderCard {
            VStack(alignment: .leading, spacing: 4) {
                Text("错题本")
                    .font(.system(size: DT.fontMasthead, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("做题后，答错的题目会自动进入这里")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var numericRow: some View {
        QPNumericRow([
            QPNumericRow.Cell(value: totalCount, label: "全部错题"),
            QPNumericRow.Cell(value: pendingCount, label: "待复习"),
            QPNumericRow.Cell(value: masteredCount, label: "已掌握")
        ])
        .padding(.horizontal, DT.space3)
    }

    private var chipsRow: some View {
        HStack(spacing: DT.space2) {
            ForEach(chipCounts, id: \.label) { entry in
                QPDotChip(label: entry.label, count: entry.count)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space3)
    }

    private var suggestionCard: some View {
        QPCard(backgroundColor: DT.primarySoft, borderColor: DT.primary.opacity(0.25), borderWidth: 0.5) {
            HStack(spacing: DT.space2) {
                ZStack {
                    Circle().fill(DT.surface).frame(width: 28, height: 28)
                    Image(systemName: "minus")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(DT.textSecondary)
                }
                Text("建议优先复习，可从 IT Passport 开始")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.ink)
                Spacer()
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var searchField: some View {
        QPSearchField(text: $searchText, placeholder: "搜索错题：题干、答案、解析...")
            .padding(.horizontal, DT.space3)
    }

    private var pickerRow: some View {
        VStack(spacing: 6) {
            ForEach(filters, id: \.self) { f in
                Button(action: { selectedFilter = f }) {
                    HStack {
                        Spacer()
                        Text(f)
                            .font(.system(size: DT.fontBody, weight: f == selectedFilter ? .semibold : .medium))
                            .foregroundStyle(f == selectedFilter ? DT.ink : DT.textSecondary)
                        Spacer()
                    }
                    .padding(.vertical, 12)
                    .background(f == selectedFilter ? DT.primarySoft : DT.surface)
                    .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                            .stroke(f == selectedFilter ? DT.primary.opacity(0.3) : DT.line, lineWidth: f == selectedFilter ? 1 : 0.5)
                    )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var modeAndCta: some View {
        HStack(spacing: DT.space1) {
            // 模式切换：列表模式 / 复习模式
            HStack(spacing: 0) {
                ForEach(modes, id: \.self) { m in
                    Button(action: { mode = m }) {
                        Text(m)
                            .font(.system(size: DT.fontCaption, weight: m == mode ? .semibold : .medium))
                            .padding(.horizontal, DT.space2).padding(.vertical, 8)
                            .background(mode == m ? DT.primarySoft : DT.surface)
                            .foregroundStyle(mode == m ? DT.ink : DT.textSecondary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .clipShape(Capsule())
            .overlay(Capsule().stroke(DT.line, lineWidth: 0.5))

            Spacer()

            // 重新练习错题
            Button(action: {}) {
                Text("重新练习错题")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.surface)
                    .padding(.horizontal, DT.space2).padding(.vertical, 12)
                    .background(DT.primary)
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, DT.space3)
    }

    // MARK: - List
    @ViewBuilder
    private var listOrEmpty: some View {
        if filteredRecords.isEmpty {
            QPCard {
                VStack(spacing: 8) {
                    Text("还没有错题")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("现在错题本是空的，去刷几道题练习一下吧。")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
            .padding(.horizontal, DT.space3)
        } else {
            VStack(spacing: DT.space1) {
                ForEach(filteredRecords, id: \.questionId) { r in
                    mistakeRow(r)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private var filteredRecords: [MistakeRecord] {
        allRecords.filter { r in
            // 课程过滤（简化：用 package 前缀推断）
            switch selectedFilter {
            case "IT Passport": return r.package.contains("itpass")
            case "SG":           return r.package.contains("sg")
            case "日文题":        return !r.package.isEmpty && r.package != "unknown"
            default:             return true
            }
        }
    }

    @ViewBuilder
    private func mistakeRow(_ r: MistakeRecord) -> some View {
        QPCard {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        QPPill(packageLabel(r.package))
                        Text(questionSnippet(questionId: r.questionId))
                            .font(.system(size: DT.fontCaption, weight: .semibold))
                            .foregroundStyle(DT.ink)
                            .lineLimit(2)
                    }
                }
                Spacer(minLength: 0)
                Text(relativeTime(r.lastWrong))
                    .font(.system(size: DT.fontLabel))
                    .foregroundStyle(DT.textTertiary)
            }
        }
    }

    private func packageLabel(_ pkg: String) -> String {
        if pkg.contains("itpass") { return "IT Passport" }
        if pkg.contains("sg") { return "SG 信息安全" }
        if pkg.isEmpty { return "Unknown" }
        return pkg
    }

    private func questionSnippet(questionId: String) -> String {
        // Try to find the question's text in any loaded package (one-time walk)
        for pkg in QuizStore.shared.manifest.packages {
            if let url = Bundle.main.url(forResource: pkg.package, withExtension: "json"),
               let data = try? Data(contentsOf: url),
               let arr = try? JSONDecoder().decode([Question].self, from: data) {
                if let q = arr.first(where: { $0.id == questionId }) {
                    let body = q.questionZh.isEmpty ? q.questionJa : q.questionZh
                    return String(body.prefix(48))
                }
            }
        }
        return questionId
    }

    private func relativeTime(_ date: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "zh_CN")
        f.dateFormat = "今天 HH:mm"
        if Calendar.current.isDateInToday(date) { return f.string(from: date) }
        f.dateFormat = "MM-dd HH:mm"
        return f.string(from: date)
    }

    // MARK: - Lifecycle
    private func reload() {
        AppContext.bootstrap(ctx)
        let r = (try? ctx.fetch(FetchDescriptor<MistakeRecord>(
            sortBy: [SortDescriptor(\.lastWrong, order: .reverse)]
        ))) ?? []
        allRecords = r
        totalCount = r.count
        pendingCount = r.filter { $0.wrongCount > 0 }.count
        masteredCount = r.filter { $0.wrongCount == 0 }.count

        // chips
        let itpassCount = r.filter { $0.package.contains("itpass") }.count
        let sgCount = r.filter { $0.package.contains("sg") }.count
        chipCounts = [
            (label: "IT Passport", count: itpassCount),
            (label: "日文题", count: r.count)
        ].filter { $0.count > 0 }
        if sgCount > 0 {
            chipCounts.insert((label: "SG", count: sgCount), at: 0)
        }
    }
}
