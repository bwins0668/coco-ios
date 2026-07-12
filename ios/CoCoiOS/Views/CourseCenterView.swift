import SwiftUI
import SwiftData

struct CourseCenterView: View {
    @Environment(\.modelContext) private var ctx
    @State private var courses: [CourseInfo] = []
    @State private var selectedTab: String = "course"

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
            .background(DesignTokens.canvas.ignoresSafeArea())
        }
        .background(
            VStack(spacing: 0) {
                Spacer()
                QPTabBar(selection: $selectedTab, tabs: tabItems)
            }
            .ignoresSafeArea(edges: .bottom)
        )
        .onChange(of: selectedTab) { _, _ in
            switch selectedTab {
            case "practice": navigateTo = "practice"
            case "review": navigateTo = "review"
            default: break
            }
        }
        .background(
            NavigationLink(
                destination: PracticeListView(),
                tag: "practice",
                selection: $navigateTo
            )
        )
    }

    private var examCourses: [CourseInfo] {
        courses.filter { ["itpass", "sg", "mos"].contains($0.courseId) }
    }

    private var learningCourses: [CourseInfo] {
        courses.filter { ["java", "python", "sql", "algo"].contains($0.courseId) }
    }

    private var tabItems: [(String, String, String)] {
        [
            ("course", "课程", "book.fill"),
            ("practice", "刷题", "doc.text.fill"),
            ("review", "复习", "clock.fill"),
            ("terms", "术语", "book.fill"),
            ("profile", "我的", "person.fill")
        ]
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
            .listRowBackground(DesignTokens.surface)
        }
    }

    private var topSummary: some View {
        Section("上次练习") {
            QPCard(backgroundColor: DesignTokens.surface) {
                VStack(alignment: .leading, spacing: DesignTokens.space1) {
                    Text("IT Passport")
                        .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                        .foregroundStyle(DesignTokens.ink)
                    Text("继续练习 · 真题练习")
                        .font(.system(size: DesignTokens.fontCaption))
                        .foregroundStyle(DesignTokens.textSecondary)
                    HStack(spacing: DesignTokens.space2) {
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
                }
            }
        }
    }

    @State private var navigateTo: String? = nil

    private func load() async {
        courses = CourseStore.shared.manifest.courses
    }
}

#Preview {
    CourseCenterView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}
