import Foundation

@MainActor
final class CourseStore {
    static let shared = CourseStore()

    let manifest: CourseManifest

    private init() {
        guard let url = Bundle.main.url(forResource: "course-manifest", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let m = try? JSONDecoder().decode(CourseManifest.self, from: data) else {
            fatalError("无法加载 CourseData/course-manifest.json")
        }
        manifest = m
    }

    func course(id: String) -> CourseInfo? {
        manifest.courses.first(where: { $0.courseId == id })
    }
}
