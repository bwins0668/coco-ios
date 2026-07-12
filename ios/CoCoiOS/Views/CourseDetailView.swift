import SwiftUI
import SwiftData

struct CourseDetailView: View {
    let course: CourseInfo
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            Section("章节") {
                ForEach(course.chapters) { chapter in
                    NavigationLink {
                        UnitDetailView(course: course, chapter: chapter)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(chapter.title.zh)
                                .font(.headline)
                            Text("\(chapter.sections.count) 节")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
        .navigationTitle(course.title.zh)
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct UnitDetailView: View {
    let course: CourseInfo
    let chapter: CourseChapter

    var body: some View {
        List {
            Section("小节") {
                ForEach(chapter.sections) { section in
                    NavigationLink {
                        LessonPlaceholderView(course: course, chapter: chapter, section: section)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(section.title.zh)
                                .font(.headline)
                            Text("\(section.lessonKind) · \(section.lessonId)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
        .navigationTitle(chapter.title.zh)
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try! ModelContainer(for: MistakeRecord.self, StudyStat.self, configurations: config)
    return CourseDetailView(course: CourseInfo(courseId: "itpass", title: CourseTitle(zh: "IT Passport", ja: "ITパスポート"), subtitle: CourseTitle(zh: "", ja: ""), color: "#2D64B3", chapterCount: 1, sectionCount: 1, chapters: [CourseChapter(chapterId: "itpass-ch01", chapterOrder: 1, title: CourseTitle(zh: "第1章", ja: "第1章"), description: CourseTitle(zh: "", ja: ""), pageStart: 0, pageEnd: 0, shard: "", sections: [CourseSection(sectionId: "itpass-1-01", lessonId: "itpass-1-01", order: 1, title: CourseTitle(zh: "1-01 信息相关理论", ja: "1-01 情報に関する理論"), lessonKind: "text", lessonRoute: "")])]))
        .modelContainer(container)
}
