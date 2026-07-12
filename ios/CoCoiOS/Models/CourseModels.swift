import Foundation

struct CourseTitle: Codable {
    let zh: String
    let ja: String

    init(zh: String, ja: String) {
        self.zh = zh
        self.ja = ja
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let dict = try? container.decode([String: String].self) {
            self.zh = dict["zh"] ?? ""
            self.ja = dict["ja"] ?? ""
        } else if let str = try? container.decode(String.self) {
            self.zh = str
            self.ja = str
        } else {
            self.zh = ""
            self.ja = ""
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(["zh": zh, "ja": ja])
    }
}

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

struct CourseChapter: Codable, Identifiable {
    let chapterId: String
    let chapterOrder: Int
    let title: CourseTitle
    let description: CourseTitle?
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

struct CourseManifest: Codable {
    let generatedAt: String
    let courses: [CourseInfo]
}