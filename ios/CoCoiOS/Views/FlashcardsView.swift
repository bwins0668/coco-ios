import SwiftUI

/// 闪卡中心：继续学习 + 课程入口卡片
/// 1:1 复刻小程序 pages/flashcards/flashcards.wxml
struct FlashcardsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var hasLastProgress: Bool = true
    @State private var lastProgressExamTitle: String = "IT Passport"
    @State private var lastProgressDeckLabel: String = "年度模拟 1"
    @State private var currentIndex: Int = 4
    @State private var total: Int = 1502
    @State private var lastTime: String = "2 小时前"

    private struct Course: Identifiable {
        let id: String
        let title: String
        let desc: String
        let mockCount: Int
        let mastered: Int
        let pending: Int
        let tags: [String]
        let color: Color
    }

    private var courses: [Course] {
        [
            Course(id: "itpass", title: "IT Passport", desc: "ITパスポート試験",
                   mockCount: 1502, mastered: 1, pending: 1501,
                   tags: ["IT", "日语", "中文"], color: DT.itpassColor),
            Course(id: "sg", title: "SG 信息安全", desc: "情報セキュリティ",
                   mockCount: 880, mastered: 0, pending: 880,
                   tags: ["SG", "安全", "中文"], color: DT.sgColor)
        ]
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton

                VStack(alignment: .leading, spacing: 4) {
                    Text("闪卡中心")
                        .font(.system(size: DT.fontPageTitle, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("フラッシュカード")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
                .padding(.horizontal, DT.space3)

                continueSection
                coursesSection

                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
    }

    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹")
                    .font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    private var continueSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionTitle("继续学习")
            if hasLastProgress {
                continueCard
            } else {
                Text("先选择课程开始复习")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textTertiary)
                    .padding(.horizontal, DT.space3)
            }
        }
    }

    private var continueCard: some View {
        Button(action: {}) {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(lastProgressExamTitle)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(lastProgressDeckLabel)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                        Text("第 \(currentIndex + 1) / \(total) 题")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                        Text(lastTime)
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textGhost)
                    }
                    Spacer()
                    Text("继续复习")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.surface)
                        .padding(.horizontal, DT.space2)
                        .padding(.vertical, 10)
                        .background(DT.ink)
                        .clipShape(Capsule())
                }
            }
        }
        .buttonStyle(.plain)
        .padding(.horizontal, DT.space3)
    }

    private var coursesSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionTitle("课程入口")
            VStack(spacing: DT.space1) {
                ForEach(courses) { course in
                    courseCard(course)
                }
                ankiCard
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func courseCard(_ course: Course) -> some View {
        Button(action: {}) {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space2) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Circle()
                            .fill(course.color.opacity(0.18))
                            .frame(width: 40, height: 40)
                            .overlay(
                                Text(String(course.title.prefix(1)))
                                    .font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(course.color)
                            )
                        VStack(alignment: .leading, spacing: 2) {
                            Text(course.title)
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.ink)
                            Text(course.desc)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }
                    }

                    HStack(alignment: .center, spacing: DT.space2) {
                        statBlock(value: "\(course.mockCount)", label: "可复习题数", color: DT.ink)
                        statBlock(value: "\(course.mastered)", label: "已掌握", color: DT.success)
                        statBlock(value: "\(course.pending)", label: "待复习", color: DT.danger)
                    }

                    HStack(alignment: .center) {
                        HStack(spacing: 6) {
                            ForEach(course.tags, id: \.self) { tag in
                                Text(tag)
                                    .font(.system(size: DT.fontLabel))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .overlay(Capsule().stroke(DT.lineStrong, lineWidth: 0.5))
                                    .foregroundStyle(DT.textSecondary)
                            }
                        }
                        Spacer()
                        Text("›")
                            .font(.system(size: DT.fontPageTitle, weight: .light))
                            .foregroundStyle(DT.textTertiary)
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var ankiCard: some View {
        Button(action: {}) {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space2) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Circle()
                            .fill(DT.ankiColor.opacity(0.18))
                            .frame(width: 40, height: 40)
                            .overlay(
                                Text("卡")
                                    .font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(DT.ankiColor)
                            )
                        VStack(alignment: .leading, spacing: 2) {
                            Text("知识记忆卡")
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.ink)
                            Text("术语记忆 / 收藏复习")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }
                    }

                    HStack(alignment: .center, spacing: DT.space2) {
                        statBlock(value: "1500", label: "术语库", color: DT.ink)
                        statBlock(value: "0", label: "已收藏", color: DT.success)
                        statBlock(value: "0", label: "待复习", color: DT.danger)
                    }

                    HStack(alignment: .center) {
                        HStack(spacing: 6) {
                            tagPill("术语")
                            tagPill("日语")
                            tagPill("中文")
                        }
                        Spacer()
                        Text("›")
                            .font(.system(size: DT.fontPageTitle, weight: .light))
                            .foregroundStyle(DT.textTertiary)
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func statBlock(value: String, label: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(value)
                .font(.system(size: DT.fontBody, weight: .semibold))
                .foregroundStyle(color)
            Text(label)
                .font(.system(size: DT.fontLabel))
                .foregroundStyle(DT.textTertiary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func tagPill(_ text: String) -> some View {
        Text(text)
            .font(.system(size: DT.fontLabel))
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .overlay(Capsule().stroke(DT.lineStrong, lineWidth: 0.5))
            .foregroundStyle(DT.textSecondary)
    }

    private func sectionTitle(_ text: String) -> some View {
        Text(text)
            .font(.system(size: DT.fontCaption, weight: .semibold))
            .tracking(2)
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, DT.space3)
    }
}

#Preview {
    FlashcardsView()
}