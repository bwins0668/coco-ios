import SwiftUI
import SwiftData

struct CourseCenterView: View {
    @Environment(\.modelContext) private var ctx
    @State private var courses: [CourseInfo] = []
    @State private var navigateTo: String? = nil

    var body: some View {
        NavigationStack {
            List {
                topSummary
                Section("01 资格考试") {
                    ForEach(examCourses) { course in
                        courseRow(course: course)
                    }
                }
                .headerProminence(.increased)

                Section("02 课程学习") {
                    ForEach(learningCourses) { course in
                        courseRow(course: course)
                    }
                }
                .headerProminence(.increased)
            }
            .navigationTitle("课程")
            .navigationBarTitleDisplayMode(.large)
            .task { await load() }
            .background(
                NavigationLink(
                    destination: PracticeListView(),
                    tag: "practice",
                    selection: $navigateTo
                )
            )
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
                        .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                        .foregroundStyle(DesignTokens.ink)
                    Text(course.subtitle.zh)
                        .font(.system(size: DesignTokens.fontCaption))
                        .foregroundStyle(DesignTokens.textSecondary)
                        .lineLimit(2)
                    HStack(spacing: 6) {
                        Text("\(course.chapterCount) 章节 · \(course.sectionCount) 小节")
                        if course.courseId == "mos" || course.courseId == "algo" {
                            QPPill("准备中")
                        }
                    }
                    .font(.system(size: DesignTokens.fontCaption))
                    .foregroundStyle(DesignTokens.textTertiary)
                }
                Spacer(minLength: 0)
                Image(systemName: course.courseId == "itpass" ? "arrow.right.circle.fill" : "chevron.right")
                    .foregroundStyle(course.courseId == "itpass" ? DesignTokens.primary : DesignTokens.textTertiary)
                    .font(.system(size: DesignTokens.fontBody))
            }
            .padding(.vertical, DesignTokens.space1)
        }
    }

    private var topSummary: some View {
        Section("上次练习") {
            QPCard(backgroundColor: DesignTokens.surface) {
                HStack(spacing: DesignTokens.space3) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("IT Passport")
                            .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                            .foregroundStyle(DesignTokens.ink)
                        Text("继续练习 · 真题练习")
                            .font(.system(size: DesignTokens.fontCaption))
                            .foregroundStyle(DesignTokens.textSecondary)
                    }
                    Spacer()
                    Button("继续练习") {
                        navigateTo = "practice"
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(DesignTokens.primary)
                    .controlSize(.small)
                    Button("今日复习") {
                        navigateTo = "review"
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                }
                .padding(.vertical, DesignTokens.space1)
            }
        }
    }

    private func load() async {
        courses = CourseStore.shared.manifest.courses
    }
}

#Preview {
    CourseCenterView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}
