import SwiftUI
import SwiftData

/// 课程详情页：試験 · EXAM kicker + 大字标题 + 日文灰副 + 01 考试知识结构（三行 A/B/C）+ 01 选择练习方式（三卡片差异化）
/// 数据来源：CourseStore + Storage 上次练习
struct CourseDetailView: View {
    let courseId: String
    let courseName: String

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var course: CourseInfo? = nil
    @State private var lastMetaText: String = ""
    @State private var selectedChapter: CourseChapter? = nil
    @State private var packages: [QuizPackageInfo] = []
    @State private var navigatePackage: String? = nil

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    navBar
                    masthead
                    if isCertification {
                        if !lastMetaText.isEmpty {
                            QPCard {
                                HStack {
                                    Text("上次练习")
                                        .font(.system(size: DT.fontLabel)).tracking(2)
                                        .foregroundStyle(DT.textTertiary)
                                    Spacer()
                                    Text(lastMetaText)
                                        .font(.system(size: DT.fontCaption))
                                        .foregroundStyle(DT.textTertiary)
                                }
                            }
                            .padding(.horizontal, DT.space3)
                        }
                        structureSection
                        QPPrimaryButton("开始刷题") {
                            if let pkg = packages.first?.package, pkg.hasPrefix("quiz-\(courseId)") {
                                navigatePackage = pkg
                            }
                        }
                        .padding(.horizontal, DT.space3)
                        practiceSection
                        QPRuleLine()
                        auxiliarySection
                    } else {
                        learningContent
                    }
                    Spacer().frame(height: 100)
                }
                .padding(.top, DT.space2)
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .navigationDestination(isPresented: Binding(
                get: { selectedChapter != nil },
                set: { if !$0 { selectedChapter = nil } }
            )) {
                if let ch = selectedChapter {
                    ChapterView(course: course ?? empty,
                                chapter: ch)
                }
            }
            .navigationDestination(isPresented: Binding(
                get: { navigatePackage != nil },
                set: { if !$0 { navigatePackage = nil } }
            )) {
                if let pkg = navigatePackage {
                    QuizView(package: pkg, exam: courseId, sourceType: "past_exam_japanese")
                }
            }
            .onAppear { reload() }
        }
    }

    private var isCertification: Bool {
        courseId == "itpass" || courseId == "sg"
    }

    private var navBar: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
            Text(courseName)
                .font(.system(size: DT.fontBody, weight: .semibold))
                .foregroundStyle(DT.ink)
            Spacer()
            Color.clear.frame(width: 44, height: 44)
        }
        .padding(.horizontal, DT.space2)
    }

    private var masthead: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Text(isCertification ? "試験" : "COURSE")
                    .font(.system(size: DT.fontLabel, weight: .medium)).tracking(2)
                Text("·").foregroundStyle(DT.textTertiary)
                Text(isCertification ? "EXAM" : "学习")
                    .font(.system(size: DT.fontLabel, weight: .semibold)).tracking(2)
            }
            .foregroundStyle(DT.editorial)

            Text(courseName)
                .font(.system(size: DT.fontMasthead, weight: .semibold))
                .tracking(-0.5)
                .foregroundStyle(DT.ink)

            if let c = course {
                Text(c.subtitle.zh)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                    .lineLimit(2)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DT.space3)
    }

    private var structureSection: some View {
        let chapters = course?.chapters ?? []
        let domains: [(String, String)] = [
            ("A", "技术系"),
            ("B", "管理系"),
            ("C", "战略系")
        ]
        return VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "考试知识结构", meta: "3 分野")
            VStack(spacing: 0) {
                ForEach(Array(domains.enumerated()), id: \.offset) { idx, d in
                    if idx > 0 { Rectangle().fill(DT.line).frame(height: 0.5) }
                    Button(action: {
                        let target: CourseChapter?
                        if chapters.count > idx {
                            target = chapters[idx]
                        } else if let first = chapters.first {
                            target = first
                        } else { target = nil }
                        if let t = target { selectedChapter = t }
                    }) {
                        HStack {
                            ZStack {
                                Circle().fill(DT.surfaceMuted).frame(width: 32, height: 32)
                                Text(d.0)
                                    .font(.system(size: DT.fontCaption, weight: .semibold))
                                    .foregroundStyle(DT.textTertiary)
                            }
                            Text(d.1)
                                .font(.system(size: DT.fontBody, weight: .medium))
                                .foregroundStyle(DT.ink)
                            Spacer()
                            Text("›").font(.system(size: DT.fontPageTitle, weight: .light))
                                .foregroundStyle(DT.textTertiary)
                        }
                        .padding(.horizontal, DT.space2).padding(.vertical, DT.space1)
                    }
                    .buttonStyle(.plain)
                }
            }
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous).stroke(DT.line, lineWidth: 0.5))
            .padding(.horizontal, DT.space3)
        }
    }

    private var learningContent: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "课程目录", meta: "\(course?.chapterCount ?? 0) 章节 · \(course?.sectionCount ?? 0) 小节")
            if let course, course.chapters.isEmpty {
                QPCard {
                    Text("该课程的目录已登记，但可学习内容仍在整理中。")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
                .padding(.horizontal, DT.space3)
            } else {
                VStack(spacing: 0) {
                    ForEach(course?.chapters ?? []) { chapter in
                        Button(action: { selectedChapter = chapter }) {
                            HStack(alignment: .center, spacing: DT.space2) {
                                Text(String(format: "%02d", chapter.chapterOrder))
                                    .font(.system(size: DT.fontCaption, weight: .semibold))
                                    .foregroundStyle(DT.primary)
                                    .frame(width: 32)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(chapter.title.zh)
                                        .font(.system(size: DT.fontBody, weight: .semibold))
                                        .foregroundStyle(DT.ink)
                                    Text(chapter.title.ja)
                                        .font(.system(size: DT.fontCaption))
                                        .foregroundStyle(DT.textSecondary)
                                        .lineLimit(1)
                                }
                                Spacer(minLength: 0)
                                Text("\(chapter.sections.count) 小节")
                                    .font(.system(size: DT.fontLabel))
                                    .foregroundStyle(DT.textTertiary)
                                Text("›").font(.system(size: DT.fontPageTitle, weight: .light))
                                    .foregroundStyle(DT.textTertiary)
                            }
                            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
                        }
                        .buttonStyle(.plain)
                        if chapter.id != (course?.chapters.last?.id ?? "") {
                            Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                        }
                    }
                }
                .background(DT.surface)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous).stroke(DT.line, lineWidth: 0.5))
                .padding(.horizontal, DT.space3)
            }
            QPRuleLine()
            QPSectionLabel("02", "学习说明")
            QPCard {
                Text("内容来自小程序当前课程包；可用小节会显示双语讲解、关键术语与章节小测入口。")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                    .lineSpacing(3)
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private var practiceSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "选择练习方式")
            VStack(spacing: DT.space1) {
                QPCard(backgroundColor: DT.primarySoft, borderColor: DT.primary.opacity(0.3), borderWidth: 1) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("真题练习").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                            Text("按考试年度 / 回数完整模拟")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                            Text("\(packages.filter { $0.package.hasPrefix("quiz-\(courseId)") }.count) 套 · 推荐")
                                .font(.system(size: DT.fontLabel))
                                .foregroundStyle(DT.textTertiary)
                        }
                        Spacer(minLength: 0)
                        Button(action: {
                            if let pkg = packages.filter({ $0.package.hasPrefix("quiz-\(courseId)") }).first?.package {
                                navigatePackage = pkg
                            }
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: "arrow.right").font(.system(size: DT.fontBody, weight: .semibold))
                            }
                            .foregroundStyle(DT.surface)
                            .frame(width: 44, height: 32)
                            .background(DT.primary)
                            .clipShape(RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous))
                        }
                        .buttonStyle(.plain)
                    }
                }

                QPCard {
                    HStack(alignment: .center, spacing: DT.space2) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("课程练习").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                            Text("双语课程练习题，含中文翻译")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }
                        Spacer(minLength: 0)
                        Text("0")
                            .font(.system(size: DT.fontCaption, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        VStack(alignment: .trailing, spacing: 0) {
                            Text("已做").font(.system(size: 11))
                                .foregroundStyle(DT.textTertiary)
                            Text("›").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
                        }
                    }
                }

                QPCard {
                    HStack(alignment: .center, spacing: DT.space2) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("闪卡复习").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                            Text("年度模拟 100 · 分类 15")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }
                        Spacer(minLength: 0)
                        Text("›").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private var auxiliarySection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "学习辅助")
            VStack(spacing: 0) {
                aidRow(title: "教材章节",
                       note: "按原书目录学习双语解説与 PDF 原书定位",
                       color: DT.primary)
                Rectangle().fill(DT.line).frame(height: 0.5)
                aidRow(title: "题目整理",
                       note: "按课程查看错题与收藏题目",
                       color: DT.success)
                Rectangle().fill(DT.line).frame(height: 0.5)
                aidRow(title: "全部错题复习",
                       note: "当前显示跨课程错题；课程筛选将在题目整理能力完成后开放。",
                       color: DT.danger)
            }
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous).stroke(DT.line, lineWidth: 0.5))
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func aidRow(title: String, note: String, color: Color) -> some View {
        Button(action: {}) {
            HStack(alignment: .center, spacing: DT.space2) {
                Rectangle().fill(color).frame(width: 3, height: 36)
                VStack(alignment: .leading, spacing: 4) {
                    Text(title).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                    Text(note).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(2)
                }
                Spacer(minLength: 0)
                Text("›").font(.system(size: DT.fontBody)).foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
        }
        .buttonStyle(.plain)
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        course = CourseStore.shared.course(id: courseId)
        packages = QuizStore.shared.manifest.packages
        if let last = Storage.shared.getLastAttempt(), last.exam == courseId {
            lastMetaText = last.metaText
        } else {
            lastMetaText = ""
        }
    }
}
