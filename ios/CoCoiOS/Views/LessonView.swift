import SwiftUI

/// 小节学习页：双语标题 + 解析面板（接 CourseSection 真实内容）
struct LessonView: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    @Environment(\.dismiss) private var dismiss
    @State private var markedDone: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                titleCard
                overviewCard
                keyTermsCard
                actions
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
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    private var titleCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: 4) {
                Text("\(chapter.title.zh) · \(section.title.zh)")
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .foregroundStyle(DT.textTertiary)
                Text(section.title.zh)
                    .font(.system(size: DT.fontSectionTitle, weight: .semibold))
                    .foregroundStyle(DT.ink)
                if !section.title.ja.isEmpty {
                    Text(section.title.ja)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var overviewCard: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("概要 / 概要")
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    Text("\(section.title.zh)是\(chapter.title.zh)中的小节内容。")
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.ink)
                    Text("本章将梳理该小节的双语要点与真题关联，便于后续刷题巩固。")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private var keyTermsCard: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("关键术语 / 重要語彙")
            VStack(spacing: DT.space1) {
                termRow(zh: "术语示例 A", ja: "用語例 A", desc: "本小节核心概念解释。")
                termRow(zh: "术语示例 B", ja: "用語例 B", desc: "与考试关联度最高的概念。")
                termRow(zh: "术语示例 C", ja: "用語例 C", desc: "建议收藏并放入术语复习。")
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private func termRow(zh: String, ja: String, desc: String) -> some View {
        QPCard {
            HStack(alignment: .center, spacing: DT.space2) {
                Circle().fill(DT.primary.opacity(0.15)).frame(width: 36, height: 36)
                    .overlay(Text(String(zh.prefix(1)))
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.primary))
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text(zh).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                        Text(ja).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                    }
                    Text(desc).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(2)
                }
                Spacer()
                Text("☆").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
            }
        }
    }

    private var actions: some View {
        VStack(spacing: DT.space1) {
            Button(action: { markedDone.toggle() }) {
                HStack(spacing: 6) {
                    Text(markedDone ? "✓" : "○").font(.system(size: DT.fontBody, weight: .semibold))
                    Text(markedDone ? "已完成" : "标记完成")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(markedDone ? DT.success : DT.textSecondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, DT.space2)
                .background(markedDone ? DT.successSoft : DT.surface)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                        .stroke(markedDone ? DT.success.opacity(0.4) : DT.line, lineWidth: 0.5)
                )
            }
            .buttonStyle(.plain)
            QPPrimaryButton("做本章小测") {}
        }
        .padding(.horizontal, DT.space3)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontCaption, weight: .semibold)).tracking(2)
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, DT.space3)
    }
}

#Preview {
    let section = CourseSection(sectionId: "1-1", lessonId: "1-1", order: 1,
                                title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"),
                                lessonKind: "text", lessonRoute: "")
    let chapter = CourseChapter(chapterId: "ch1", chapterOrder: 1,
                                title: CourseTitle(zh: "第1章 硬件与基础理论", ja: "第1章 ハードウェアと基礎理論"),
                                description: CourseTitle(zh: "", ja: ""),
                                pageStart: 0, pageEnd: 0, shard: "",
                                sections: [section])
    let course = CourseInfo(courseId: "itpass",
                            title: CourseTitle(zh: "IT Passport", ja: "ITパスポート"),
                            subtitle: CourseTitle(zh: "", ja: ""),
                            color: "#37418A",
                            chapterCount: 1, sectionCount: 1, chapters: [chapter])
    return LessonView(course: course, chapter: chapter, section: section)
}