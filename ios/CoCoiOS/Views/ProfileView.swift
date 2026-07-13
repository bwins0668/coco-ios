import SwiftUI
import SwiftData
import UIKit

/// 我的页：学习数据 + 分类正确率（接入 Storage 真实数据）
struct ProfileView: View {
    @Environment(\.modelContext) private var ctx
    @State private var totalAttempts: Int = 0
    @State private var accuracy: Int = 0
    @State private var wrongQuestionCount: Int = 0
    @State private var favoriteCount: Int = 0
    @State private var itpassAccuracy: Int = 0
    @State private var sgAccuracy: Int = 0
    @State private var learningStatus: String = ""

    var isNewUser: Bool { totalAttempts == 0 }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    section01
                    sectionStatus
                    section02
                    sectionTimeline
                    sectionSettings
                    sectionDanger
                    Spacer().frame(height: 80)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .onAppear { reload() }
        }
        .navigationTransition(.slide)
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        let stats = Storage.shared.getQuizStats()
        totalAttempts = stats.total
        accuracy = stats.accuracy
        wrongQuestionCount = Storage.shared.getMistakeCount()
        favoriteCount = Storage.shared.getFavoriteTermCount()
        itpassAccuracy = stats.byExam["itpass"]?.accuracy ?? 0
        sgAccuracy = stats.byExam["sg"]?.accuracy ?? 0
        learningStatus = Self.computeStatus(accuracy: stats.accuracy, total: stats.total)
    }

    private static func computeStatus(accuracy: Int, total: Int) -> String {
        if total == 0 { return "还没有学习记录，开始第一次练习吧" }
        if accuracy >= 80 { return "状态很好，继续保持！" }
        if accuracy >= 60 { return "基础不错，建议复盘错题" }
        return "建议先从错题和术语复习开始"
    }

    private var masthead: some View {
        QPMasthead(kicker: "PROFILE · 我的", title: "我的", rightText: DT.jstDateString())
    }

    private var section01: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "学习数据")
            statStrip
            favoriteRow
        }
    }

    private var statStrip: some View {
        HStack(alignment: .center, spacing: 0) {
            statBox(value: "\(totalAttempts)", label: "总答题", color: DT.ink)
            divider
            statBox(value: "\(accuracy)%", label: "正确率", color: DT.success)
            divider
            statBox(value: "\(wrongQuestionCount)", label: "错题", color: DT.danger)
        }
        .padding(.vertical, DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private func statBox(value: String, label: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(color)
            Text(label)
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textTertiary)
        }
        .frame(maxWidth: .infinity)
    }

    private var divider: some View {
        Rectangle().fill(DT.line).frame(width: 0.5, height: 36)
    }

    private var favoriteRow: some View {
        HStack {
            Text("已收藏术语").font(.system(size: DT.fontBody)).foregroundStyle(DT.ink)
            Spacer()
            Text("\(favoriteCount)").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.textSecondary)
        }
        .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private var sectionStatus: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "学习状态")
            QPCard {
                Text(learningStatus)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func accuracyRow(label: String, value: Int, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(label).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                Spacer()
                Text("\(value)%").font(.system(size: DT.fontCaption, weight: .medium)).foregroundStyle(color)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle().fill(DT.fillWarm).frame(height: 4)
                    Rectangle().fill(color).frame(width: max(2, geo.size.width * CGFloat(value) / 100), height: 4)
                }
            }
            .frame(height: 4)
        }
        .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
    }

    private var section02: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("03", "分类正确率")
            VStack(spacing: 0) {
                accuracyRow(label: "IT Passport", value: itpassAccuracy, color: DT.success)
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                accuracyRow(label: "SG", value: sgAccuracy, color: DT.primary)
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

    private var sectionTimeline: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("04", "最近练习")
            RecentTimeline()
        }
    }

    @State private var showingBackup: Bool = false
    @State private var backupMessage: String = ""

    private var sectionSettings: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("05", "数据与设置")
            VStack(spacing: 0) {
                settingRow(title: "复制备份数据", note: "本地", icon: "⎘", color: DT.primary) {
                    let json = BackupService.shared.exportBackupString()
                    UIPasteboard.general.string = json
                    backupMessage = "备份数据已复制到剪贴板（\(json.count) 字符）"
                    showingBackup = true
                }
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                settingRow(title: "从剪贴板恢复", note: "覆盖本地", icon: "⎗", color: DT.success) {
                    if let clip = UIPasteboard.general.string {
                        if BackupService.shared.importBackup(from: clip) {
                            backupMessage = "从剪贴板恢复成功"
                        } else {
                            backupMessage = "剪贴板内容不是有效备份"
                        }
                    } else {
                        backupMessage = "剪贴板为空"
                    }
                    showingBackup = true
                }
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                settingRow(title: "使用帮助", note: "", icon: "?", color: DT.textTertiary) {
                    backupMessage = "使用帮助可在 docs/ 中查看"
                    showingBackup = true
                }
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                settingRow(title: "意见反馈", note: "", icon: "✉", color: DT.primary) {
                    backupMessage = "可在 GitHub Issues 提交反馈"
                    showingBackup = true
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

    private var sectionDanger: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("06", "危险操作")
            Button(action: {
                BackupService.shared.clearAllData()
                backupMessage = "已清空本地学习记录（收藏和错题保留）"
                showingBackup = true
            }) {
                HStack {
                    Spacer()
                    Text("清空学习记录")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .foregroundStyle(DT.danger)
                    Spacer()
                }
                .padding(.vertical, DT.space2)
                .background(DT.dangerSoft)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            }
            .buttonStyle(.plain)
            .padding(.horizontal, DT.space3)
        }
        .alert("操作提示", isPresented: $showingBackup) {
            Button("好") { }
        } message: {
            Text(backupMessage)
        }
    }

    @ViewBuilder
    private func settingRow(title: String, note: String, icon: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(alignment: .center, spacing: DT.space2) {
                ZStack {
                    Circle().fill(color.opacity(0.15)).frame(width: 32, height: 32)
                    Text(icon).font(.system(size: DT.fontCaption, weight: .semibold)).foregroundStyle(color)
                }
                Text(title).font(.system(size: DT.fontBody)).foregroundStyle(DT.ink)
                Spacer()
                if !note.isEmpty {
                    Text(note).font(.system(size: DT.fontLabel)).foregroundStyle(DT.textTertiary)
                }
                Text("›").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    ProfileView()
}