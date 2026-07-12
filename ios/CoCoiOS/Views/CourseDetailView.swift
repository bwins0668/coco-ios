import SwiftUI

/// 课程详情页：考试知识结构 + 学习辅助
/// 1:1 复刻小程序 pages/course/course.wxml
struct CourseDetailView: View {
    let courseId: String
    let courseName: String

    @Environment(\.dismiss) private var dismiss

    private var topics: [(id: String, title: String, titleJa: String, enterable: Bool)] {
        [
            ("ch1", "第1章 硬件与基础理论", "第1章 ハードウェアと基礎理論", true),
            ("ch2", "第2章 软件与开发技术", "第2章 ソフトウェアと開発技術", true),
            ("ch3", "第3章 数据库与网络", "第3章 データベースとネットワーク", true),
            ("ch4", "第4章 信息安全", "第4章 情報セキュリティ", true),
            ("ch5", "第5章 项目管理与服务运营", "第5章 プロジェクトマネジメントとサービス運用", false)
        ]
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton

                VStack(alignment: .leading, spacing: 4) {
                    Text(courseName)
                        .font(.system(size: DT.fontPageTitle, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("资格考试")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
                .padding(.horizontal, DT.space3)

                QPCard {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("上次练习")
                            .font(.system(size: DT.fontCaption))
                            .tracking(2)
                            .foregroundStyle(DT.textTertiary)
                        Text("真题练习 · 今天 21:30")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                    }
                }
                .padding(.horizontal, DT.space3)

                QPPrimaryButton("开始刷题") {}
                    .padding(.horizontal, DT.space3)

                section01
                section02

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

    private var section01: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            Text("考试知识结构")
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .tracking(2)
                .foregroundStyle(DT.textTertiary)
                .padding(.horizontal, DT.space3)
            VStack(spacing: 0) {
                ForEach(Array(topics.enumerated()), id: \.element.id) { idx, topic in
                    if idx > 0 {
                        Rectangle()
                            .fill(DT.line)
                            .frame(height: 0.5)
                            .padding(.horizontal, DT.space3)
                    }
                    Button(action: {}) {
                        HStack(alignment: .center, spacing: 8) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(topic.title)
                                    .font(.system(size: DT.fontBody))
                                    .foregroundStyle(DT.ink)
                                Text(topic.titleJa)
                                    .font(.system(size: DT.fontCaption))
                                    .foregroundStyle(DT.textSecondary)
                            }
                            Spacer()
                            if topic.enterable {
                                Text("→")
                                    .font(.system(size: DT.fontBody))
                                    .foregroundStyle(DT.textTertiary)
                            } else {
                                Text("主题映射整理中")
                                    .font(.system(size: DT.fontLabel))
                                    .foregroundStyle(DT.textTertiary)
                            }
                        }
                        .padding(.horizontal, DT.space3)
                        .padding(.vertical, DT.space2)
                    }
                    .buttonStyle(.plain)
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

    private var section02: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            Text("学习辅助")
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .tracking(2)
                .foregroundStyle(DT.textTertiary)
                .padding(.horizontal, DT.space3)
            VStack(spacing: 0) {
                aidRow(title: "教材章节",
                       note: "按原书目录学习双语解説与 PDF 原书定位",
                       color: DT.primary)
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space3)
                aidRow(title: "题目整理",
                       note: "按课程查看错题与收藏题目",
                       color: DT.success)
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space3)
                aidRow(title: "全部错题复习",
                       note: "当前显示跨课程错题；课程筛选将在题目整理能力完成后开放。",
                       color: DT.danger)
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

    @ViewBuilder
    private func aidRow(title: String, note: String, color: Color) -> some View {
        Button(action: {}) {
            HStack(alignment: .center, spacing: DT.space2) {
                Rectangle()
                    .fill(color)
                    .frame(width: 3, height: 36)
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text(note)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineLimit(2)
                }
                Spacer(minLength: 0)
                Text("→")
                    .font(.system(size: DT.fontBody))
                    .foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space3)
            .padding(.vertical, DT.space2)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    CourseDetailView(courseId: "itpass", courseName: "IT Passport")
}