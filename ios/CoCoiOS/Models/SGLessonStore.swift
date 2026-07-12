import Foundation

/// SG 课程真实小节内容
struct SGLessonUnit: Codable, Hashable {
    let id: String
    let titleZh: String
    let titleJa: String
    let overviewZh: String
    let overviewJa: String
    let learningGoalZh: String
    let learningGoalJa: String
    let sections: [Section]
    let keyTerms: [KeyTerm]
    let caseBreakdown: [CasePart]

    struct Section: Codable, Hashable {
        let headingZh: String
        let headingJa: String
        let explanationZh: String
        let explanationJa: String
    }

    struct KeyTerm: Codable, Hashable {
        let termZh: String
        let termJa: String
        let english: String
        let definitionZh: String
        let definitionJa: String
        let examCueZh: String
    }

    struct CasePart: Codable, Hashable {
        let labelZh: String
        let bodyZh: String
    }
}

struct SGChapterDetail: Codable {
    let chapterId: String
    let chapterTitleZh: String
    let chapterTitleJa: String
    let units: [String: SGLessonUnit]
}

struct SGLessonData: Codable {
    let generatedAt: String
    let totalChapters: Int
    let totalUnits: Int
    let detail: [String: SGChapterDetail]
}

@MainActor
final class SGLessonStore {
    static let shared: SGLessonStore = {
        if let s = try? SGLessonStore() { return s }
        return SGLessonStore.empty
    }()

    let data: SGLessonData

    private static let empty = {
        let json = #"{"generatedAt":"","totalChapters":0,"totalUnits":0,"detail":{}}"#.data(using: .utf8)!
        let m = try! JSONDecoder().decode(SGLessonData.self, from: json)
        return SGLessonStore(preloaded: m)
    }()

    private init(preloaded data: SGLessonData) { self.data = data }

    private init() throws {
        guard let url = Bundle.main.url(forResource: "sg-lesson-detail", withExtension: "json") else {
            throw NSError(domain: "SGLessonStore", code: 1)
        }
        let raw = try Data(contentsOf: url)
        self.data = try JSONDecoder().decode(SGLessonData.self, from: raw)
    }

    func unit(chapterId: String, unitId: String) -> SGLessonUnit? {
        data.detail[chapterId]?.units[unitId]
    }
}