import SwiftUI

/// 错题本：错题复盘中心（接入 Storage 真实数据）
struct MistakesView: View {
    @Environment(\.modelContext) private var ctx
    @Environment(\.dismiss) private var dismiss

    @State private var wrongRecords: [MistakeRecord] = []
    @State private var byCourse: [String: Int] = [:]
    @State private var lastWrongTime: String = ""

    var wrongCount: Int { wrongRecords.count }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                hero
                if wrongCount > 0 { actionGrid; recentList } else { emptyState }
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
        wrongRecords = Storage.shared.getMistakeRecords()
        byCourse = Storage.shared.getMistakesByCourse()
        if let last = wrongRecords.first {
            lastWrongTime = Storage.relativeTime(last.lastWrong)
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
                    Text("\(wrongCount)")
                        .font(.system(size: DT.fontDisplay, weight: .semibold))
                        .foregroundStyle(DT.editorial)
                    Text("待复盘")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
            }

            if wrongCount > 0 {
                HStack(spacing: DT.space1) {
                    ForEach(courseChips(), id: \.0) { (course, count) in
                        Text("\(courseLabel(course)) \(count)")
                            .font(.system(size: DT.fontCaption, weight: .medium))
                            .padding(.horizontal, 10).padding(.vertical, 4)
                            .background(courseColor(course).opacity(0.15))
                            .foregroundStyle(courseColor(course))
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

    private func courseChips() -> [(String, Int)] {
        // 只显示大于 0 的，按 itpass -> sg -> 其它 排序
        let order = ["itpass", "sg", "java", "python", "sql"]
        var arr: [(String, Int)] = []
        for key in order {
            if let c = byCourse[key], c > 0 { arr.append((key, c)) }
        }
        for (k, v) in byCourse where !order.contains(k) && v > 0 {
            arr.append((k, v))
        }
        return arr
    }

    private func courseLabel(_ id: String) -> String {
        switch id {
        case "itpass": return "IT Passport"
        case "sg": return "SG"
        case "java": return "Java"
        case "python": return "Python"
        case "sql": return "SQL"
        default: return id
        }
    }

    private func courseColor(_ id: String) -> Color {
        switch id {
        case "itpass": return DT.primary
        case "sg": return DT.success
        case "java": return Color(hex: "C25A28")
        case "python": return Color(hex: "3776AB")
        case "sql": return Color(hex: "C57B00")
        default: return DT.textTertiary
        }
    }

    private var actionGrid: some View {
        VStack(spacing: DT.space1) {
            HStack(spacing: DT.space1) {
                actionTile(icon: "≡", title: "查看错题详情", stat: "\(wrongCount) 道", color: DT.danger, action: {})
                actionTile(icon: "▦", title: "闪卡复盘", stat: "Anki", color: DT.ankiColor, action: {})
            }
            actionTile(icon: "▶", title: "继续练习", stat: "做题", color: DT.primary, fullWidth: true, action: {})
        }
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private func actionTile(icon: String, title: String, stat: String, color: Color, fullWidth: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
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

    private var recentList: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("最近答错", meta: "按时间倒序")
            VStack(spacing: 0) {
                ForEach(Array(wrongRecords.prefix(10).enumerated()), id: \.offset) { idx, m in
                    if idx > 0 { Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2) }
                    HStack(alignment: .center, spacing: DT.space2) {
                        Rectangle().fill(DT.danger).frame(width: 3, height: 32)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(courseLabel(m.package.replacingOccurrences(of: "quiz-", with: ""))) · \(m.questionId)")
                                .font(.system(size: DT.fontBody))
                                .foregroundStyle(DT.ink)
                                .lineLimit(1)
                            Text("答错 \(m.wrongCount) 次 · \(Storage.relativeTime(m.lastWrong))")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textTertiary)
                        }
                        Spacer()
                        Text("→").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
                    }
                    .padding(.horizontal, DT.space2).padding(.vertical, DT.space1)
                }
            }
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .padding(.horizontal, DT.space3)
        }
    }
}

#Preview {
    MistakesView()
}