import Foundation

@MainActor
final class CourseStore {
    static let shared: CourseStore = {
        do {
            return try CourseStore()
        } catch {
            print("[CourseStore] init failed: \(error). Falling back to empty manifest.")
            return CourseStore.empty
        }
    }()

    let manifest: CourseManifest

    private static let empty: CourseStore = {
        let data = "{\"generatedAt\":\"\",\"courses\":[]}".data(using: .utf8)!
        // swiftlint:disable:next force_try
        let m = try! JSONDecoder().decode(CourseManifest.self, from: data)
        return CourseStore(preloaded: m)
    }()

    private init(preloaded manifest: CourseManifest) {
        self.manifest = manifest
    }

    private init() throws {
        guard let url = Bundle.main.url(forResource: "course-manifest", withExtension: "json") else {
            throw NSError(domain: "CourseStore", code: 1, userInfo: [NSLocalizedDescriptionKey: "course-manifest.json not in bundle"])
        }
        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        self.manifest = try decoder.decode(CourseManifest.self, from: data)
    }

    func course(id: String) -> CourseInfo? {
        manifest.courses.first(where: { $0.courseId == id })
    }
}