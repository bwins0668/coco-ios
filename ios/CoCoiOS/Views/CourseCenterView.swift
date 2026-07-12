import SwiftUI
import SwiftData

struct CourseCenterView: View {
    @Environment(\.modelContext) private var ctx
    @State private var courses: [CourseInfo] = []
    @State private var lastPackage: String? = nil
    @State private var streak: Int = 0

    var body: some View {
        NavigationStack {
            List {
                topSummary
                Section("01 资格考试") {
                    ForEach(examCourses) { course in
                        courseRow(course: course)
                    }
                }
                Section("02 课程学习") {
                    ForEach(learningCourses) { course in
                        courseRow(course: course)
                    }
                }
            }
            .navigationTitle("课程")
            .task { await load() }
        }
    }

    private var examCourses: [CourseInfo] {
        courses.filter { ["itpass", "sg", "mos"].contains($0.courseId) }
    }

    private var learningCourses: [CourseInfo] {
        courses.filter { ["java", "python", "sql", "algo"].contains($0.courseId) }
    }

    @ViewBuilder
    private func courseRow(course: CourseInfo) -> some View {
        NavigationLink {
            CourseDetailView(course: course)
        } label: {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(course.title.zh)
                        .font(.headline)
                    Text(course.subtitle.zh)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                    HStack(spacing: 6) {
                        Text("\(course.chapterCount) 章节 · \(course.sectionCount) 小节")
                        if course.courseId == "mos" || course.courseId == "algo" {
                            Text("准备中")
                                .font(.caption2)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(Capsule())
                        }
                    }
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
                }
                Spacer(minLength: 0)
                Image(systemName: course.courseId == "itpass" ? "arrow.right.circle.fill" : "chevron.right")
                    .foregroundStyle(course.courseId == "itpass" ? Color(course.color) : .tertiary)
            }
            .padding(.vertical, 6)
        }
    }

    private var topSummary: some View {
        Section("上次练习") {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("IT Passport")
                        .font(.headline)
                    Text(lastPackage.map { "真题练习 · \($0)" } ?? "真题练习")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer(minLength: 0)
                Button("继续练习") {
                    if let pkg = lastPackage {
                        navigateToQuiz(pkg)
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.small)
                Button("今日复习") {
                    navigateToReview()
                }
                .buttonStyle(.bordered)
                .controlSize(.small)
            }
            .padding(.vertical, 4)
        }
    }

    private func navigateToQuiz(_ pkg: String) {
        // TODO: route to QuizView with package
    }

    private func navigateToReview() {
        // TODO: route to review
    }

    private func load() async {
        // TODO: hydrate from StudyStat / last session
    }
}

#Preview {
    CourseCenterView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}
