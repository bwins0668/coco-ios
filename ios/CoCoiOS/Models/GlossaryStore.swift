import Foundation

/// 术语模型 + 加载器
struct GlossaryTerm: Codable, Identifiable, Hashable {
    let id: String
    let term: String       // 英文
    let zh: String
    let ja: String
    let en: String
    let category: String
    let level: String
    let tags: [String]
    let explanationZh: String
    let explanationJa: String
    let example: String
}

struct GlossaryData: Codable {
    let generatedAt: String
    let total: Int
    let categories: [String]
    let terms: [GlossaryTerm]
}

@MainActor
final class GlossaryStore {
    static let shared: GlossaryStore = {
        if let s = try? GlossaryStore() { return s }
        return GlossaryStore.empty
    }()

    let data: GlossaryData

    private static let empty = {
        let json = #"{"generatedAt":"","total":0,"categories":[],"terms":[]}"#.data(using: .utf8)!
        let m = try! JSONDecoder().decode(GlossaryData.self, from: json)
        return GlossaryStore(preloaded: m)
    }()

    private init(preloaded data: GlossaryData) { self.data = data }

    private init() throws {
        guard let url = Bundle.main.url(forResource: "glossary", withExtension: "json") else {
            throw NSError(domain: "GlossaryStore", code: 1)
        }
        let raw = try Data(contentsOf: url)
        self.data = try JSONDecoder().decode(GlossaryData.self, from: raw)
    }

    func term(id: String) -> GlossaryTerm? {
        data.terms.first { $0.id == id }
    }

    func search(_ query: String) -> [GlossaryTerm] {
        let q = query.lowercased().trimmingCharacters(in: .whitespaces)
        guard !q.isEmpty else { return Array(data.terms.prefix(100)) }
        return data.terms.filter {
            $0.zh.lowercased().contains(q) ||
            $0.ja.lowercased().contains(q) ||
            $0.term.lowercased().contains(q) ||
            $0.tags.contains(where: { $0.lowercased().contains(q) })
        }
    }
}