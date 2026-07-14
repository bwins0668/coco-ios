import Foundation

/// 通用课程小节内容（itpass / sg 共享 schema）
/// 与原 SGLessonStore 同形，但 key 不再 hardcode "sg"，由调用方传 courseId
struct LessonUnit: Codable, Hashable {
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

private struct LessonChapter: Codable {
    let chapterId: String
    let chapterTitleZh: String
    let chapterTitleJa: String
    let units: [String: LessonUnit]
}

private struct LessonData: Codable {
    let generatedAt: String
    let totalChapters: Int
    let totalUnits: Int
    let detail: [String: LessonChapter]
}

/// 统一 lesson 入口：支持 itpass / sg，未来可扩 java/python/sql
@MainActor
final class LessonStore {
    static let shared: LessonStore = {
        if let s = try? LessonStore() { return s }
        return LessonStore.empty
    }()

    /// [courseId: [chapterId: [unitId: LessonUnit]]]
    private var index: [String: [String: [String: LessonUnit]]] = [:]

    private static let empty: LessonStore = {
        let json = #"{"generatedAt":"","totalChapters":0,"totalUnits":0,"detail":{}}"#.data(using: .utf8)!
        let m = try! JSONDecoder().decode(LessonData.self, from: json)
        return LessonStore(preloaded: m, courseId: "_empty")
    }()

    private init(preloaded data: LessonData, courseId: String) {
        var bucket: [String: [String: LessonUnit]] = [:]
        for (_, ch) in data.detail {
            bucket[ch.chapterId] = ch.units
        }
        index[courseId] = bucket
    }

    private convenience init() throws {
        // 加载 sg
        var combined: [String: [String: [String: LessonUnit]]] = [:]
        if let url = Bundle.main.url(forResource: "sg-lesson-detail", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let model = try? JSONDecoder().decode(LessonData.self, from: data) {
            var bucket: [String: [String: LessonUnit]] = [:]
            for (_, ch) in model.detail { bucket[ch.chapterId] = ch.units }
            combined["sg"] = bucket
        }
        // 加载 itpass
        if let url = Bundle.main.url(forResource: "itpass-lesson-detail", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let model = try? JSONDecoder().decode(LessonData.self, from: data) {
            var bucket: [String: [String: LessonUnit]] = [:]
            for (_, ch) in model.detail { bucket[ch.chapterId] = ch.units }
            combined["itpass"] = bucket
        }
        // 加载 java（合 a/b/c 三套到同一 courseId bucket）
        if let url = Bundle.main.url(forResource: "java-lesson-detail", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let model = try? JSONDecoder().decode(LessonData.self, from: data) {
            var bucket: [String: [String: LessonUnit]] = [:]
            for (_, ch) in model.detail { bucket[ch.chapterId] = ch.units }
            combined["java"] = bucket
        }
        // 加载 python（如果 build-python-lesson-json 跑出非空 JSON，会自动注入）
        if let url = Bundle.main.url(forResource: "python-lesson-detail", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let model = try? JSONDecoder().decode(LessonData.self, from: data),
           !model.detail.isEmpty {
            var bucket: [String: [String: LessonUnit]] = [:]
            for (_, ch) in model.detail { bucket[ch.chapterId] = ch.units }
            combined["python"] = bucket
        }
        // 加载 sql
        if let url = Bundle.main.url(forResource: "sql-lesson-detail", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let model = try? JSONDecoder().decode(LessonData.self, from: data),
           !model.detail.isEmpty {
            var bucket: [String: [String: LessonUnit]] = [:]
            for (_, ch) in model.detail { bucket[ch.chapterId] = ch.units }
            combined["sql"] = bucket
        }
        // mos / algo 暂无源数据，stub JSON 已落 Bundle 但 detail 为空，跳过注入
        // 如未来 build-mos-lesson-json / build-algo-lesson-json 跑通，会自动加进 combined。
        self.init(inMemoryIndex: combined)
    }

    private init(inMemoryIndex: [String: [String: [String: LessonUnit]]]) {
        self.index = inMemoryIndex
    }

    func unit(courseId: String, chapterId: String, unitId: String) -> LessonUnit? {
        index[courseId]?[chapterId]?[unitId]
    }

    func chapterExists(courseId: String, chapterId: String) -> Bool {
        !(index[courseId]?[chapterId]?.isEmpty ?? true)
    }

    var totalUnitsLoaded: Int {
        index.values.reduce(0) { sum, chMap in
            sum + chMap.values.reduce(0) { $0 + $1.count }
        }
    }

    var loadedCourseIds: [String] {
        Array(index.keys).sorted()
    }
}
