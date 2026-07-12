import SwiftUI
import SwiftData

/// 错题本：按课程分组
struct MistakesView: View {
    @Environment(\.modelContext) private var ctx
    @Environment(\.dismiss) private var dismiss

    @State private var groups: [(course: String, count: Int, label: String, color: Color, records: [MistakeRecord])] = []
    @State private var totalCount: Int = 0
    @State private var lastWrongTime: String = ""
    @State private var selectedCourse: String? = nil

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                hero
                if totalCount > 0 { actionGrid; groupList } else { emptyState }
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .onAppear { reload() }
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        let all = Storage.shared.getMistakeRecords()
        totalCount = all.count
        if let first = all.first {
            lastWrongTime = Storage.relativeTime(first.lastWrong)
        }
        let grouped = Dictionary(grouping: all, by: { $0.package })
        let order = ["quiz-itpass-1", "quiz-itpass-2", "quiz-itpass-3", "quiz-itpass-4", "quiz-itpass-5",
                     "quiz-sg-1", "quiz-sg-2"]
        var result: [(String, Int, String, Color, [MistakeRecord])] = []
        for pkg in order {
            if let items = grouped[pkg], !items.isEmpty {
                result.append((pkg, items.count, courseLabel(pkg), courseColor(pkg), items))
            }
        }
        for (pkg, items) in grouped where !order.contains(pkg) {
            result.append((pkg, items.count, pkg, DT.textTertiary, items))
        }
        groups = result
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

    private var hero: some View {
        VStack(alignment: .leading, spacing: DT.space2) {
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("错题本")
                        .font(.system(size: DT.fontPageTitle, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("答错自动收录 · 复盘巩固")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
                Spacer()
                VStack(alignment: .center, spacing: 2) {
                    Text("\(totalCount)")
                        .font(.system(size: DT.fontDisplay, weight: .semibold))
                        .foregroundStyle(DT.editorial)
                    Text("待复盘")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
            }

            if totalCount > 0 {
                HStack(spacing: DT.space1) {
                    ForEach(groups, id: \.course) { g in
                        Text("\(g.label) \(g.count)")
                            .font(.system(size: DT.fontCaption, weight: .medium))
                            .padding(.horizontal, 10).padding(.vertical, 4)
                            .background(g.color.opacity(0.15))
                            .foregroundStyle(g.color)
                            .clipShape(Capsule())
                    }
                    Spacer()
                    Text(lastWrongTime)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
        .padding(DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    private var actionGrid: some View {
        VStack(spacing: DT.space1) {
            HStack(spacing: DT.space1) {
                actionTile(icon: "≡", title: "查看错题详情", stat: "\(totalCount) 道", color: DT.danger)
                actionTile(icon: "▦", title: "闪卡复盘", stat: "Anki", color: DT.ankiColor)
            }
            actionTile(icon: "▶", title: "继续练习", stat: "做题", color: DT.primary, fullWidth: true)
        }
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private func actionTile(icon: String, title: String, stat: String, color: Color, fullWidth: Bool = false) -> some View {
        Button(action: {}) {
            HStack(alignment: .center, spacing: DT.space2) {
                Circle().fill(color.opacity(0.15)).frame(width: 40, height: 40)
                    .overlay(Text(icon).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(color))
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                    Text(stat).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                }
                Spacer()
                Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }

    private var groupList: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("", "按课程分组")
            VStack(spacing: DT.space1) {
                ForEach(groups, id: \.course) { g in
                    courseGroupCard(g)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func courseGroupCard(_ g: (course: String, count: Int, label: String, color: Color, records: [MistakeRecord])) -> some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack {
                    Rectangle().fill(g.color).frame(width: 3, height: 24)
                    Text(g.label).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                    Spacer()
                    Text("\(g.count) 道")
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .padding(.horizontal, 8).padding(.vertical, 2)
                        .background(g.color.opacity(0.15))
                        .foregroundStyle(g.color)
                        .clipShape(Capsule())
                }
                ForEach(Array(g.records.prefix(3).enumerated()), id: \.offset) { _, r in
                    HStack(spacing: 6) {
                        Text("·").font(.system(size: DT.fontCaption)).foregroundStyle(DT.textTertiary)
                        Text("题号 \(r.questionId)")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                            .lineLimit(1)
                        Spacer()
                        Text(Storage.relativeTime(r.lastWrong))
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                    }
                }
                if g.records.count > 3 {
                    Text("还有 \(g.records.count - 3) 道...")
                        .font(.system(size: DT.fontLabel))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
    }

    private var emptyState: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("暂无错题记录")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("完成一次练习后，答错的题目会自动收录到这里。")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                QPPrimaryButton("开始练习") {}
                    .padding(.top, DT.space1)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private func courseLabel(_ pkg: String) -> String {
        let cleaned = pkg.replacingOccurrences(of: "quiz-", with: "")
        if pkg.contains("itpass") { return "IT Passport · \(cleaned.replacingOccurrences(of: "itpass-", with: ""))" }
        if pkg.contains("sg") { return "SG · \(cleaned.replacingOccurrences(of: "sg-", with: ""))" }
        return pkg
    }

    private func courseColor(_ pkg: String) -> Color {
        if pkg.contains("itpass") { return DT.itpassColor }
        if pkg.contains("sg") { return DT.sgColor }
        return DT.textTertiary
    }
}

#Preview {
    MistakesView()
}