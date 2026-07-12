import SwiftUI
import SwiftData

struct UnitDetailView: View {
    let course: CourseInfo
    let chapter: CourseChapter

    var body: some View {
        List {
            Section("小节") {
                ForEach(chapter.sections) { section in
                    NavigationLink {
                        LessonPlaceholderView(course: course, chapter: chapter, section: section)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(section.title.zh)
                                .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                                .foregroundStyle(DesignTokens.ink)
                            Text("\(section.lessonKind) · \(section.lessonId)")
                                .font(.system(size: DesignTokens.fontCaption))
                                .foregroundStyle(DesignTokens.textSecondary)
                        }
                        .padding(.vertical, DesignTokens.space1)
                    }
                    .listRowBackground(DesignTokens.surface)
                }
            }
        }
        .listStyle(.insetGrouped)
        .listRowSpacing(DesignTokens.space1)
        .scrollContentBackground(.hidden)
        .background(DesignTokens.canvas.ignoresSafeArea())
        .navigationTitle(chapter.title.zh)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("返回") {
                    // NavigationStack back
                }
                .foregroundStyle(DesignTokens.textSecondary)
                .font(.system(size: DesignTokens.fontBody))
            }
        }
    }
}
