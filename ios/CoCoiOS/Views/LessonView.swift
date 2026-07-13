import SwiftUI

/// 小节学习页：双语标题 + 概要 + 学习目标 + 关键术语 + 案例拆解
struct LessonView: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    @Environment(\.dismiss) private var dismiss
    @State private var showPracticeSheet: Bool = false
    @State private var sqlInput: String = ""
    @State private var sqlStatus: String = "idle"
    @State private var showSqlAnswer: Bool = false
    @State private var quizPicked: Int = -1
    @State private var quizStatus: String = "idle"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                titleCard

                let detail = LessonStore.shared.unit(courseId: course.courseId, chapterId: chapter.chapterId, unitId: section.sectionId)

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

                if let d = detail, !d.learningGoalZh.isEmpty {
                    sqlPlaygroundCard(detail: d)
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
        .sheet(isPresented: $showPracticeSheet) {
            LessonPracticeSheet(course: course, chapter: chapter, section: section)
                .presentationDetents([.medium, .large])
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

    private func sectionCard(_ s: LessonUnit.Section) -> some View {
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

    private func keyTermsCard(_ terms: [LessonUnit.KeyTerm]) -> some View {
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

    private func termRow(_ t: LessonUnit.KeyTerm) -> some View {
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

    private func caseBreakdownCard(_ parts: [LessonUnit.CasePart]) -> some View {
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

    @ViewBuilder
    private func sqlPlaygroundCard(detail: LessonUnit) -> some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionLabel("PRACTICE · 动手练习")
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    Text(detail.learningGoalZh)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.ink)
                    if !detail.learningGoalJa.isEmpty {
                        Text(detail.learningGoalJa)
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                    }
                    TextField("在此输入 SQL 语句…", text: $sqlInput, axis: .vertical)
                        .font(.system(.body, design: .monospaced))
                        .textFieldStyle(.plain)
                        .padding(DT.space1)
                        .background(DT.fillWarm)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous))
                        .overlay(RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous).stroke(DT.line, lineWidth: 0.5))
                    HStack(spacing: DT.space1) {
                        Button(action: { judgeSql(detail: detail) }) {
                            Text("判定")
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.surface)
                                .padding(.horizontal, DT.space2).padding(.vertical, 8)
                                .background(DT.primary)
                                .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm))
                        }
                        Button(action: { showSqlAnswer.toggle() }) {
                            Text(showSqlAnswer ? "隐藏答案" : "看答案")
                                .font(.system(size: DT.fontBody))
                                .foregroundStyle(DT.ink)
                                .padding(.horizontal, DT.space2).padding(.vertical, 8)
                                .overlay(RoundedRectangle(cornerRadius: DT.radiusSm).stroke(DT.line, lineWidth: 0.5))
                        }
                    }
                    if sqlStatus == "correct" {
                        Text("✓ 正确！查询符合要求。")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.success)
                    }
                    if sqlStatus == "wrong" {
                        Text("✗ 还不对。请检查语句后重试。")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.danger)
                    }
                    if showSqlAnswer, let firstSection = detail.sections.first {
                        Text("参考答案")
                            .font(.system(size: DT.fontLabel)).tracking(2)
                            .foregroundStyle(DT.textTertiary)
                        Text(firstSection.explanationZh.isEmpty ? "SELECT * FROM students_mst;" : firstSection.explanationZh)
                            .font(.system(.body, design: .monospaced))
                            .foregroundStyle(DT.ink)
                            .padding(DT.space1)
                            .background(DT.fillWarm)
                            .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm))
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private func judgeSql(detail: LessonUnit) {
        let input = sqlInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !input.isEmpty else { return }
        let upper = input.uppercased()
        let ok = upper.contains("SELECT") && upper.contains("FROM")
        sqlStatus = ok ? "correct" : "wrong"
    }

    private var actions: some View {
        VStack(spacing: DT.space1) {
            QPPrimaryButton("做本章小测") { showPracticeSheet = true }
            QPOutlineButton("返回章节") { dismiss() }
        }
        .padding(.horizontal, DT.space3)
    }

    private func sectionLabel(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontCaption, weight: .semibold)).tracking(2)
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, DT.space3)
    }
}

/// LessonView 弹出的小测入口：根据课程 courseId 列出该考试下的所有 package，
/// 点击 → 直接打开 QuizView 答题，按 courseMap.courseId 默认判 sourceType。
struct LessonPracticeSheet: View {
    let course: CourseInfo
    let chapter: CourseChapter
    let section: CourseSection

    @Environment(\.dismiss) private var dismiss
    @State private var pickedPackage: QuizPick? = nil

    struct QuizPick: Identifiable, Hashable {
        let id: String           // == package name
        let package: String
        let exam: String
        let sourceType: String
        let title: String
        let subtitle: String
        let count: Int
        let color: Color
    }

    private var picks: [QuizPick] {
        let manifest = QuizStore.shared.manifest
        let prefix = course.courseId == "itpass" ? "quiz-itpass"
                   : course.courseId == "sg"    ? "quiz-sg"
                   : nil
        guard let pfx = prefix else { return [] }
        return manifest.packages
            .filter { $0.package.hasPrefix(pfx) }
            .map { pkg in
                let cleaned = pkg.package.replacingOccurrences(of: pfx + "-", with: "")
                let examLabel = course.courseId == "sg" ? "SG" : "IT Passport"
                let kind = pfx == "quiz-sg" ? "SG 信息安全" : "IT Passport"
                return QuizPick(
                    id: pkg.package,
                    package: pkg.package,
                    exam: course.courseId,
                    sourceType: "past_exam_japanese",
                    title: "\(examLabel) · 年度 \(cleaned)",
                    subtitle: "\(kind) · 章节 \(chapter.title.zh) · 小节 \(section.title.zh)",
                    count: pkg.count,
                    color: course.courseId == "sg" ? DT.sgColor : DT.itpassColor
                )
            }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("做本章小测 · \(chapter.title.zh) / \(section.title.zh)")
                            .font(.system(size: DT.fontCaption)).tracking(2)
                            .foregroundStyle(DT.textTertiary)
                        Text("选择年度真题包，将立即开始答题")
                            .font(.system(size: DT.fontSectionTitle, weight: .semibold))
                            .foregroundStyle(DT.ink)
                    }
                    .padding(.top, DT.space2)

                    if picks.isEmpty {
                        QPCard {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("该课程暂无题库")
                                    .font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(DT.ink)
                                Text("目前仅 IT Passport 与 SG 提供真题练习，\(course.title.zh) 题库整理中。")
                                    .font(.system(size: DT.fontCaption))
                                    .foregroundStyle(DT.textSecondary)
                            }
                        }
                        .padding(.horizontal, DT.space3)
                    } else {
                        VStack(spacing: DT.space1) {
                            ForEach(picks) { p in
                                pickRow(p)
                            }
                        }
                        .padding(.horizontal, DT.space3)
                    }

                    Spacer().frame(height: 60)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .fullScreenCover(item: $pickedPackage) { p in
                NavigationStack {
                    QuizView(package: p.package, exam: p.exam, sourceType: p.sourceType)
                        .navigationBarHidden(true)
                        .background(DT.canvas.ignoresSafeArea())
                }
            }
        }
    }

    @ViewBuilder
    private func pickRow(_ p: QuizPick) -> some View {
        Button(action: { pickedPackage = p }) {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    Rectangle().fill(p.color).frame(width: 3, height: 36)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(p.title)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(p.subtitle)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                            .lineLimit(2)
                        Text("\(p.count) 题")
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                    }
                    Spacer(minLength: 0)
                    Text("→").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
                }
            }
        }
        .buttonStyle(.plain)
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