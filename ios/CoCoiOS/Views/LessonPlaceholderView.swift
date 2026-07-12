import SwiftUI
import SwiftData

struct LessonPlaceholderView: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DesignTokens.space2) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(section.title.zh)
                        .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                        .foregroundStyle(DesignTokens.ink)
                    Text(section.title.ja)
                        .font(.system(size: DesignTokens.fontCaption))
                        .foregroundStyle(DesignTokens.textSecondary)
                }
                .padding(DesignTokens.space2)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(DesignTokens.surface)
                .clipShape(RoundedRectangle(cornerRadius: DesignTokens.radiusLarge, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: DesignTokens.radiusLarge, style: .continuous)
                        .stroke(DesignTokens.line, lineWidth: DesignTokens.borderWidth)
                )

                QPCard(backgroundColor: DesignTokens.surface) {
                    Text("小节内容占位")
                        .font(.system(size: DesignTokens.fontBody))
                        .foregroundStyle(DesignTokens.textSecondary)
                }

                Text("本节排版将迁移小程序原内容，首版以文本 + 双语呈现。")
                    .font(.system(size: DesignTokens.fontCaption))
                    .foregroundStyle(DesignTokens.textTertiary)
            }
            .padding(DesignTokens.space2)
        }
        .background(DesignTokens.canvas.ignoresSafeArea())
        .navigationTitle(section.title.zh)
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try! ModelContainer(for: MistakeRecord.self, StudyStat.self, configurations: config)

    return LessonPlaceholderView(
        course: CourseInfo(courseId: "itpass", title: CourseTitle(zh: "IT Passport", ja: "ITパスポート"), subtitle: CourseTitle(zh: "", ja: ""), color: "#2D64B3", chapterCount: 1, sectionCount: 1, chapters: [CourseChapter(chapterId: "itpass-ch01", chapterOrder: 1, title: CourseTitle(zh: "第1章", ja: "第1章"), description: CourseTitle(zh: "", ja: ""), pageStart: 0, pageEnd: 0, shard: "", sections: [CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")])]),
        chapter: CourseChapter(chapterId: "itpass-ch01", chapterOrder: 1, title: CourseTitle(zh: "第1章", ja: "第1章"), description: CourseTitle(zh: "", ja: ""), pageStart: 0, pageEnd: 0, shard: "", sections: [CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")]),
        section: CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")
    )
    .modelContainer(container)
}
