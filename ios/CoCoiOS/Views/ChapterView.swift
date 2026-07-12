import SwiftUI

/// 章节学习页：小节列表 + 双语标题 + 进度（接 CourseStore 真实章节）
struct ChapterView: View {
    let course: CourseInfo
    let chapter: CourseChapter

    @Environment(\.dismiss) private var dismiss
    @State private var selectedSection: CourseSection? = nil

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                header
                progressBar
                sectionList
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .navigationDestination(isPresented: Binding(
            get: { selectedSection != nil },
            set: { if !$0 { selectedSection = nil } }
        )) {
            if let s = selectedSection {
                LessonView(course: course, chapter: chapter, section: s)
            }
        }
    }

    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(course.title.zh)
                .font(.system(size: DT.fontCaption, weight: .medium))
                .foregroundStyle(DT.textTertiary)
            Text(chapter.title.zh)
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(DT.ink)
            if !chapter.title.ja.isEmpty {
                Text(chapter.title.ja)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var progressBar: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("进度").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
                Spacer()
                Text("0 / \(chapter.sections.count) 小节")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle().fill(DT.line).frame(height: 2)
                    Rectangle().fill(DT.editorial).frame(width: 2, height: 2)
                }
            }
            .frame(height: 2)
        }
        .padding(.horizontal, DT.space3)
    }

    private var sectionList: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            Text("小节列表")
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .tracking(2)
                .foregroundStyle(DT.textTertiary)
                .padding(.horizontal, DT.space3)
            VStack(spacing: 0) {
                ForEach(Array(chapter.sections.enumerated()), id: \.element.id) { idx, section in
                    if idx > 0 {
                        Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                    }
                    sectionRow(section: section)
                }
            }
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .padding(.horizontal, DT.space3)
        }
    }

    private func sectionRow(section: CourseSection) -> some View {
        Button(action: { selectedSection = section }) {
            HStack(alignment: .center, spacing: DT.space2) {
                ZStack {
                    Circle().fill(DT.surfaceMuted).frame(width: 28, height: 28)
                    Text("\(section.order)")
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .foregroundStyle(DT.textTertiary)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(section.title.zh)
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.ink)
                        .lineLimit(1)
                    if !section.title.ja.isEmpty {
                        Text(section.title.ja)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                            .lineLimit(1)
                    }
                }
                Spacer(minLength: 0)
                Text("→")
                    .font(.system(size: DT.fontBody))
                    .foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space1)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    let demo = CourseChapter(
        chapterId: "demo", chapterOrder: 1,
        title: CourseTitle(zh: "第1章 示例章节", ja: "第1章 デモ"),
        description: CourseTitle(zh: "", ja: ""),
        pageStart: 0, pageEnd: 0, shard: "",
        sections: [
            CourseSection(sectionId: "1-1", lessonId: "1-1", order: 1,
                          title: CourseTitle(zh: "1-1 示例小节 A", ja: "1-1 デモ A"),
                          lessonKind: "text", lessonRoute: ""),
            CourseSection(sectionId: "1-2", lessonId: "1-2", order: 2,
                          title: CourseTitle(zh: "1-2 示例小节 B", ja: "1-2 デモ B"),
                          lessonKind: "text", lessonRoute: ""),
            CourseSection(sectionId: "1-3", lessonId: "1-3", order: 3,
                          title: CourseTitle(zh: "1-3 示例小节 C", ja: "1-3 デモ C"),
                          lessonKind: "text", lessonRoute: "")
        ]
    )
    let course = CourseInfo(courseId: "itpass",
                            title: CourseTitle(zh: "IT Passport", ja: "ITパスポート"),
                            subtitle: CourseTitle(zh: "", ja: ""),
                            color: "#37418A",
                            chapterCount: 1, sectionCount: 3, chapters: [demo])
    return ChapterView(course: course, chapter: demo)
}