import SwiftUI
import SwiftData

struct LessonPlaceholderView: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DesignTokens.space2) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(section.title.zh)
                        .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                        .foregroundStyle(DesignTokens.ink)
                    Text(section.title.ja)
                        .font(.system(size: DesignTokens.fontCaption))
                        .foregroundStyle(DesignTokens.textSecondary)
                }
                .padding(DesignTokens.space2)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(DesignTokens.surface)
                .clipShape(RoundedRectangle(cornerRadius: DesignTokens.radiusLarge, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: DesignTokens.radiusLarge, style: .continuous)
                        .stroke(DesignTokens.line, lineWidth: DesignTokens.borderWidth)
                )

                QPCard(backgroundColor: DesignTokens.surface) {
                    Text("小节内容占位")
                        .font(.system(size: DesignTokens.fontBody))
                        .foregroundStyle(DesignTokens.textSecondary)
                }

                Text("本节排版将迁移小程序原内容，首版以文本 + 双语呈现。")
                    .font(.system(size: DesignTokens.fontCaption))
                    .foregroundStyle(DesignTokens.textTertiary)
            }
            .padding(DesignTokens.space2)
        }
        .background(DesignTokens.canvas.ignoresSafeArea())
        .navigationTitle(section.title.zh)
        .navigationBarTitleDisplayMode(.inline)
    }
}