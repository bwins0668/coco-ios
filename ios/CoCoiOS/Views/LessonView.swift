import SwiftUI

/// 小节学习页：双语标题 + 概要 + 学习目标 + 关键术语 + 案例拆解
struct LessonView: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                titleCard

                let detail = SGLessonStore.shared.unit(chapterId: chapter.chapterId, unitId: section.sectionId)

                if let d = detail, !d.overviewZh.isEmpty {
                    overviewCard(overviewZh: d.overviewZh, learningGoalZh: d.learningGoalZh)
                }

                if let d = detail {
                    ForEach(Array(d.sections.enumerated()), id: \.offset) { _, s in
                        sectionCard(s)
                    }
                }

                if let d = detail, !d.keyTerms.isEmpty {
                    keyTermsCard(d.keyTerms)
                }

                if let d = detail, !d.caseBreakdown.isEmpty {
                    caseBreakdownCard(d.caseBreakdown)
                }

                actions
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
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

    private var titleCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("\(chapter.title.zh) · \(chapter.title.ja)")
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .foregroundStyle(DT.textTertiary)
                Text(section.title.zh)
                    .font(.system(size: DT.fontSectionTitle, weight: .semibold))
                    .foregroundStyle(DT.ink)
                if !section.title.ja.isEmpty {
                    Text(section.title.ja)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private func overviewCard(overviewZh: String, learningGoalZh: String) -> some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("概要 / 概要")
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    Text(overviewZh)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.ink)
                        .lineSpacing(3)
                    if !learningGoalZh.isEmpty {
                        Divider().background(DT.line)
                        Text("学习目标")
                            .font(.system(size: DT.fontLabel)).tracking(2)
                            .foregroundStyle(DT.textTertiary)
                        Text(learningGoalZh)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                            .lineSpacing(2)
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private func sectionCard(_ s: SGLessonUnit.Section) -> some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel(s.headingZh.isEmpty ? "详解" : s.headingZh)
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    if !s.headingJa.isEmpty && !s.headingZh.isEmpty {
                        Text(s.headingJa)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }
                    if !s.explanationZh.isEmpty {
                        Text(s.explanationZh)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.ink)
                            .lineSpacing(3)
                    }
                    if !s.explanationJa.isEmpty && !s.explanationZh.isEmpty {
                        Text(s.explanationJa)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                            .lineSpacing(2)
                            .padding(.top, 4)
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private func keyTermsCard(_ terms: [SGLessonUnit.KeyTerm]) -> some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("关键术语 / 重要語彙")
            VStack(spacing: DT.space1) {
                ForEach(Array(terms.enumerated()), id: \.offset) { _, t in
                    termRow(t)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private func termRow(_ t: SGLessonUnit.KeyTerm) -> some View {
        QPCard {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(t.termZh)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    if !t.english.isEmpty {
                        Text(t.english)
                            .font(.system(size: DT.fontCaption, weight: .medium))
                            .tracking(1)
                            .foregroundStyle(DT.textTertiary)
                    }
                    Spacer()
                    if !t.termJa.isEmpty {
                        Text(t.termJa)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                }
                if !t.definitionZh.isEmpty {
                    Text(t.definitionZh)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineSpacing(2)
                }
                if !t.examCueZh.isEmpty {
                    HStack(spacing: 4) {
                        Text("💡").font(.system(size: DT.fontLabel))
                        Text(t.examCueZh)
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.editorial)
                    }
                    .padding(.top, 2)
                }
            }
        }
    }

    private func caseBreakdownCard(_ parts: [SGLessonUnit.CasePart]) -> some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("案例拆解 / ケース分析")
            VStack(spacing: 0) {
                ForEach(Array(parts.enumerated()), id: \.offset) { idx, p in
                    if idx > 0 { Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2) }
                    VStack(alignment: .leading, spacing: 4) {
                        Text(p.labelZh)
                            .font(.system(size: DT.fontCaption, weight: .semibold))
                            .tracking(1)
                            .foregroundStyle(DT.primary)
                        Text(p.bodyZh)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.ink)
                            .lineSpacing(3)
                    }
                    .padding(.horizontal, DT.space2)
                    .padding(.vertical, DT.space2)
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

    private var actions: some View {
        VStack(spacing: DT.space1) {
            QPPrimaryButton("做本章小测") {}
        }
        .padding(.horizontal, DT.space3)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontCaption, weight: .semibold)).tracking(2)
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, DT.space3)
    }
}

#Preview {
    let section = CourseSection(sectionId: "sg-1-1-1", lessonId: "sg-1-1-1", order: 1,
                                title: CourseTitle(zh: "1-1-1 信息安全是什么", ja: "1-1-1 情報セキュリティとは"),
                                lessonKind: "text", lessonRoute: "")
    let chapter = CourseChapter(chapterId: "sg-ch01", chapterOrder: 1,
                                title: CourseTitle(zh: "第1章 信息安全是什么", ja: "第1章 情報セキュリティとは"),
                                description: CourseTitle(zh: "", ja: ""),
                                pageStart: 0, pageEnd: 0, shard: "",
                                sections: [section])
    let course = CourseInfo(courseId: "sg",
                            title: CourseTitle(zh: "SG 信息安全", ja: "SG 情報セキュリティ"),
                            subtitle: CourseTitle(zh: "", ja: ""),
                            color: "#37418A",
                            chapterCount: 1, sectionCount: 1, chapters: [chapter])
    return LessonView(course: course, chapter: chapter, section: section)
}