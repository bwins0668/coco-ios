import Foundation

/// 选项（key = A/B/C/D）
struct QuizOption: Codable, Identifiable, Hashable {
    let key: String
    let textZh: String
    let textJa: String
    var id: String { key }
}

/// 单题（由 ios/tools/build-quiz-json.js 从微信小程序题库生成）
struct Question: Codable, Identifiable, Hashable {
    let id: String
    let exam: String
    let sourceType: String
    let year: String
    let yearId: String
    let number: Int
    let category: String
    let subcategory: String
    let topic: String
    let level: String
    let lessonId: String
    let lessonTitleZh: String
    let lessonTitleJa: String
    let questionZh: String
    let questionJa: String
    let options: [QuizOption]
    let answer: String
    let explanationZh: String
    let explanationJa: String
}

/// manifest.json 中的单个包信息
struct QuizPackageInfo: Codable, Identifiable {
    let package: String
    let count: Int
    let withAnswer: Int
    let withZh: Int
    let withExplanationZh: Int
    var id: String { package }
}

/// manifest.json 顶层
struct QuizManifest: Codable {
    let generatedAt: String
    let packages: [QuizPackageInfo]
    let total: Int
}

/// 题库加载器：从 App Bundle 读取 QuizData 目录下的 JSON
final class QuizStore {
    static let shared = QuizStore()

    let manifest: QuizManifest

    private init() {
        guard let url = Bundle.main.url(forResource: "manifest", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let m = try? JSONDecoder().decode(QuizManifest.self, from: data) else {
            fatalError("无法加载 manifest.json，请先运行 ios/tools/build-quiz-json.js")
        }
        manifest = m
    }

    func loadQuestions(package: String) -> [Question] {
        guard let url = Bundle.main.url(forResource: package, withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let arr = try? JSONDecoder().decode([Question].self, from: data) else {
            return []
        }
        return arr
    }
}
