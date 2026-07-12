import SwiftUI

struct LessonPlaceholderView: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text(section.title.zh)
                    .font(.title3.bold())
                Text("\(course.title.zh) / \(chapter.title.zh)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text("小节页面内容后续继续接入；这里是当前节点结构。")
                    .font(.body)
                    .foregroundStyle(.secondary)
                Text("lessonId: \(section.lessonId)")
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
                Spacer(minLength: 0)
            }
            .padding()
        }
        .navigationTitle(section.title.zh)
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    LessonPlaceholderView(
        course: CourseInfo(courseId: "itpass", title: CourseTitle(zh: "IT Passport", ja: "ITパスポート"), subtitle: CourseTitle(zh: "", ja: ""), color: "#2D64B3", chapterCount: 1, sectionCount: 1, chapters: [CourseChapter(chapterId: "itpass-ch01", chapterOrder: 1, title: CourseTitle(zh: "第1章", ja: "第1章"), description: CourseTitle(zh: "", ja: ""), pageStart: 0, pageEnd: 0, shard: "", sections: [CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")])]),
        chapter: CourseChapter(chapterId: "itpass-ch01", chapterOrder: 1, title: CourseTitle(zh: "第1章", ja: "第1章"), description: CourseTitle(zh: "", ja: ""), pageStart: 0, pageEnd: 0, shard: "", sections: [CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")]),
        section: CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")
    )
}
