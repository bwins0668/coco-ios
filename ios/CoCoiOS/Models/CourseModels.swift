import Foundation

struct CourseInfo: Codable, Identifiable {
    let courseId: String
    let title: CourseTitle
    let subtitle: CourseTitle
    let color: String
    let chapterCount: Int
    let sectionCount: Int
    let chapters: [CourseChapter]
    var id: String { courseId }
}

struct CourseTitle: Codable {
    let zh: String
    let ja: String
}

struct CourseChapter: Codable, Identifiable {
    let chapterId: String
    let chapterOrder: Int
    let title: CourseTitle
    let description: CourseTitle
    let pageStart: Int
    let pageEnd: Int
    let shard: String
    let sections: [CourseSection]
    var id: String { chapterId }
}

struct CourseSection: Codable, Identifiable {
    let sectionId: String
    let lessonId: String
    let order: Int
    let title: CourseTitle
    let lessonKind: String
    let lessonRoute: String
    var id: String { sectionId }
}
