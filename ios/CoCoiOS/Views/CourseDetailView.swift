import SwiftUI

/// 课程详情页：考试知识结构 + 学习辅助（接入 CourseStore 真实章节数据）
struct CourseDetailView: View {
    let courseId: String
    let courseName: String

    @Environment(\.dismiss) private var dismiss
    @State private var course: CourseInfo? = nil
    @State private var lastMetaText: String = ""
    @State private var selectedChapter: CourseChapter? = nil

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                header
                if !lastMetaText.isEmpty {
                    QPCard {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("上次练习")
                                .font(.system(size: DT.fontCaption))
                                .tracking(2)
                                .foregroundStyle(DT.textTertiary)
                            Text(lastMetaText)
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.ink)
                        }
                    }
                    .padding(.horizontal, DT.space3)
                }
                QPPrimaryButton("开始刷题") {}
                    .padding(.horizontal, DT.space3)
                chapterSection
                learningSection
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .navigationDestination(isPresented: Binding(
            get: { selectedChapter != nil },
            set: { if !$0 { selectedChapter = nil } }
        )) {
            if let ch = selectedChapter {
                ChapterView(course: course ?? CourseInfo(courseId: courseId,
                                                          title: CourseTitle(zh: courseName, ja: courseName),
                                                          subtitle: CourseTitle(zh: "", ja: ""),
                                                          color: "#37418A",
                                                          chapterCount: 0, sectionCount: 0, chapters: []),
                            chapter: ch)
            }
        }
        .onAppear { reload() }
    }

    private func reload() {
        course = CourseStore.shared.course(id: courseId)
        if let last = Storage.shared.getLastAttempt(), last.exam == courseId {
            lastMetaText = last.metaText
        } else {
            lastMetaText = ""
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

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(course?.title.zh ?? courseName)
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(DT.ink)
            HStack(spacing: 6) {
                Text("资格考试")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textTertiary)
                if let c = course {
                    Text("· \(c.chapterCount) 章 / \(c.sectionCount) 小节")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var chapterSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("考试知识结构")
            if let chapters = course?.chapters, !chapters.isEmpty {
                VStack(spacing: 0) {
                    ForEach(Array(chapters.enumerated()), id: \.element.id) { idx, ch in
                        if idx > 0 {
                            Rectangle().fill(DT.line).frame(height: 0.5)
                                .padding(.horizontal, DT.space2)
                        }
                        chapterRow(chapter: ch)
                    }
                }
                .background(DT.surface)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                        .stroke(DT.line, lineWidth: 0.5)
                )
                .padding(.horizontal, DT.space3)
            } else {
                emptyChaptersCard
            }
        }
    }

    private func chapterRow(chapter: CourseChapter) -> some View {
        Button(action: { selectedChapter = chapter }) {
            HStack(alignment: .center, spacing: 8) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(chapter.title.zh)
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.ink)
                        .lineLimit(1)
                    if !chapter.title.ja.isEmpty {
                        Text(chapter.title.ja)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                            .lineLimit(1)
                    }
                    HStack(spacing: 6) {
                        Text("\(chapter.sections.count) 小节")
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                    }
                }
                Spacer()
                Text("→")
                    .font(.system(size: DT.fontBody))
                    .foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2)
            .padding(.vertical, DT.space2)
        }
        .buttonStyle(.plain)
    }

    private var emptyChaptersCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("课程内容正在整理")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("课程目录、教材导航与章节练习将在内容校验完成后开放。")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var learningSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("学习辅助")
            VStack(spacing: 0) {
                aidRow(title: "教材章节",
                       note: "按原书目录学习双语解説与 PDF 原书定位",
                       color: DT.primary)
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                aidRow(title: "题目整理",
                       note: "按课程查看错题与收藏题目",
                       color: DT.success)
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
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
                Rectangle().fill(color).frame(width: 3, height: 36)
                VStack(alignment: .leading, spacing: 4) {
                    Text(title).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                    Text(note).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(2)
                }
                Spacer(minLength: 0)
                Text("→").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
        }
        .buttonStyle(.plain)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontCaption, weight: .semibold)).tracking(2)
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, DT.space3)
    }
}

#Preview {
    CourseDetailView(courseId: "itpass", courseName: "IT Passport")
}