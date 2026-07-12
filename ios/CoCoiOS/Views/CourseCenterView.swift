import SwiftUI
import SwiftData

struct CourseCenterView: View {
    @Environment(\.modelContext) private var ctx
    @State private var courses: [CourseInfo] = []

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: DesignTokens.space3) {
                    topSummary
                    section(title: "01 资格考试") {
                        ForEach(examCourses) { course in
                            courseRow(course: course)
                        }
                    }
                    section(title: "02 课程学习") {
                        ForEach(learningCourses) { course in
                            courseRow(course: course)
                        }
                    }
                }
                .padding(.horizontal, DesignTokens.space2)
                .padding(.bottom, DesignTokens.space4)
            }
            .scrollContentBackground(.hidden)
            .background(DesignTokens.canvas.ignoresSafeArea())
            .navigationTitle("课程")
            .navigationBarTitleDisplayMode(.large)
            .task { await load() }
        }
    }

    @ViewBuilder
    private func section<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: DesignTokens.space1) {
            Text(title)
                .font(.system(size: DesignTokens.fontLabel, weight: .semibold))
                .tracking(2)
                .foregroundStyle(DesignTokens.textTertiary)
                .padding(.horizontal, DesignTokens.space1)
                .padding(.top, DesignTokens.space1)
            VStack(spacing: DesignTokens.space1) {
                content()
            }
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
            QPCard(backgroundColor: DesignTokens.surface) {
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(course.title.zh)
                            .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                            .foregroundStyle(DesignTokens.ink)
                        if !course.subtitle.zh.isEmpty {
                            Text(course.subtitle.zh)
                                .font(.system(size: DesignTokens.fontCaption))
                                .foregroundStyle(DesignTokens.textSecondary)
                                .lineLimit(2)
                        }
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
            }
        }
        .buttonStyle(.plain)
    }

    private var topSummary: some View {
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
                        // 由系统 TabView 触发切换，无内部路由
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(DesignTokens.primary)
                    .controlSize(.small)

                    Button("今日复习") {
                        // 由系统 TabView 触发切换，无内部路由
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
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