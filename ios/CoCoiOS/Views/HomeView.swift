import SwiftUI

/// 首页：START 卡片 + 01 资格考试（3 卡）+ 02 课程学习（4 课程卡）
/// 数据来源：Storage 上次练习 + Streak
struct HomeView: View {
    @Environment(\.modelContext) private var ctx
    @State private var jstDate: String = DT.jstDateString()
    @State private var streak: Int = 0
    @State private var navigateCourseId: String? = nil
    @State private var navigateQuizPackage: String? = nil

    private let examCourses: [(id: String, name: String, color: Color, primary: Bool, sub: String, available: Bool)] = [
        ("itpass", "IT Passport", DT.primary, true, "IT パスポート試験対策 · 按年度模擬練習", true),
        ("sg", "SG 信息安全", DT.sgColor, false, "情報セキュリティマネジメント · 专项強化", true),
        ("mos", "MOS 365", DT.textGhost, false, "MOS 365 认证考试 — 入口待确认", false)
    ]

    private struct LearningCourse: Identifiable {
        let id: String
        let tag: String
        let title: String
        let subtitle: String
        let meta: String
        let accent: Color
        let background: Color
        let muted: Bool
    }
    private let learningCourses: [LearningCourse] = [
        LearningCourse(id: "java", tag: "Ja", title: "Java",
                       subtitle: "Java入門 / Java实践 / Java 基础 / Java 実践",
                       meta: "19 章节 · 336 小节 · 双语讲解",
                       accent: DT.javaAccent, background: DT.javaBg, muted: false),
        LearningCourse(id: "python", tag: "Py", title: "Python",
                       subtitle: "Python入門 / 入力 / while / function / class / Python 入门 / 输入 / while / 函数 / 类",
                       meta: "9 小节 · 双语讲解",
                       accent: DT.pythonAccent, background: DT.pythonBg, muted: false),
        LearningCourse(id: "sql", tag: "SQL", title: "SQL 数据库",
                       subtitle: "SQL データベース入門 / SQL 数据库核心",
                       meta: "7 章节 · 第 1 课已开放 · 双语讲解",
                       accent: DT.sqlAccent, background: DT.sqlBg, muted: false),
        LearningCourse(id: "algo", tag: "Alg", title: "算法基础",
                       subtitle: "",
                       meta: "算法基础准备中",
                       accent: DT.textGhost, background: DT.surface, muted: true)
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    startCard
                    examSection
                    learningSection
                    Spacer().frame(height: 80)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .navigationDestination(isPresented: Binding(
                get: { navigateCourseId != nil },
                set: { if !$0 { navigateCourseId = nil } }
            )) {
                if let id = navigateCourseId {
                    CourseDetailView(
                        courseId: id,
                        courseName: examCourses.first(where: { $0.id == id })?.name ?? ""
                    )
                }
            }
            .navigationDestination(isPresented: Binding(
                get: { navigateQuizPackage != nil },
                set: { if !$0 { navigateQuizPackage = nil } }
            )) {
                if let pkg = navigateQuizPackage {
                    QuizView(package: pkg, exam: "itpass", sourceType: "past_exam_japanese")
                }
            }
            .onAppear(perform: load)
        }
    }

    private func load() {
        AppContext.bootstrap(ctx)
        streak = Storage.shared.getStreakCount()
    }

    private var masthead: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("课程 · 学习")
                        .font(.system(size: DT.fontLabel)).tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    Text("课程")
                        .font(.system(size: DT.fontMasthead, weight: .semibold))
                        .tracking(-0.5)
                        .foregroundStyle(DT.ink)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text(jstDate)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                    if streak > 0 {
                        HStack(spacing: 4) {
                            Text("连续").font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                            Text("\(streak)").font(.system(size: DT.fontCaption, weight: .semibold)).foregroundStyle(DT.editorial)
                            Text("天").font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                        }
                    }
                }
            }
        }
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space3)
    }

    private var startCard: some View {
        QPRedHeaderCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("START · 开始学习")
                    .font(.system(size: DT.fontLabel, weight: .medium)).tracking(2)
                    .foregroundStyle(DT.editorial)
                Text("选择考试，开始训练")
                    .font(.system(size: DT.fontPageTitle, weight: .semibold)).tracking(-0.5)
                    .foregroundStyle(DT.ink)
                Text("请选择要备考的考试")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)

                HStack(spacing: DT.space1) {
                    PillToggle(text: "IT Passport", selected: true, action: {})
                    PillToggle(text: "SG 信息安全", selected: false, action: {})
                }
                .padding(.top, DT.space1)

                Button(action: {
                    navigateQuizPackage = "quiz-itpass-1"
                }) {
                    HStack(spacing: 4) {
                        Text("开始第一组练习")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                    }
                    .foregroundStyle(DT.surface)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(DT.primary)
                    .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .padding(.top, DT.space1)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var examSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "资格考试", meta: "3 考试")
            VStack(spacing: 0) {
                ForEach(Array(examCourses.enumerated()), id: \.offset) { idx, exam in
                    if idx > 0 { Rectangle().fill(DT.line).frame(height: 0.5) }
                    examRow(exam: exam)
                }
            }
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous).stroke(DT.line, lineWidth: 0.5))
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func examRow(exam: (id: String, name: String, color: Color, primary: Bool, sub: String, available: Bool)) -> some View {
        Button(action: { if exam.available { navigateCourseId = exam.id } }) {
            HStack(alignment: .center, spacing: DT.space2) {
                Circle()
                    .fill(exam.primary ? exam.color : DT.surface)
                    .overlay(Circle().stroke(exam.primary ? exam.color : DT.textGhost, lineWidth: 1.5))
                    .frame(width: 18, height: 18)
                    .overlay(
                        exam.primary ? Circle().fill(DT.surface).frame(width: 8, height: 8) : nil
                    )
                VStack(alignment: .leading, spacing: 4) {
                    Text(exam.name)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(exam.available ? DT.ink : DT.textTertiary)
                    Text(exam.sub)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(exam.available ? DT.textSecondary : DT.textGhost)
                        .lineLimit(1)
                }
                Spacer(minLength: 0)
                if exam.available {
                    Text("→").font(.system(size: DT.fontBody, weight: .medium))
                        .foregroundStyle(DT.textTertiary)
                } else {
                    QPPill("准备中")
                }
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space1)
        }
        .buttonStyle(.plain)
        .opacity(exam.available ? 1.0 : 0.6)
    }

    private var learningSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "课程学习", meta: "Java / Python / SQL 已开放")
            VStack(spacing: DT.space1) {
                ForEach(learningCourses) { c in
                    courseCard(c)
                }
            }
        }
    }

    @ViewBuilder
    private func courseCard(_ c: LearningCourse) -> some View {
        Button(action: {}) {
            HStack(alignment: .top, spacing: 0) {
                Rectangle()
                    .fill(c.muted ? Color.clear : c.accent)
                    .frame(width: 3)
                    .padding(.vertical, DT.space2)
                VStack(alignment: .leading, spacing: 6) {
                    Text(c.tag)
                        .font(.system(size: DT.fontLabel, weight: .semibold)).tracking(1.5)
                        .foregroundStyle(c.muted ? DT.textGhost : c.accent)
                    Text(c.title)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(c.muted ? DT.textTertiary : DT.ink)
                    if !c.subtitle.isEmpty {
                        Text(c.subtitle)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(c.muted ? DT.textGhost : DT.textSecondary)
                            .lineLimit(2)
                    }
                    Text(c.meta)
                        .font(.system(size: DT.fontLabel)).tracking(0.5)
                        .foregroundStyle(DT.textTertiary)
                        .padding(.top, 2)
                    Spacer(minLength: 0)
                }
                .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(c.muted ? DT.surface.opacity(0.4) : c.background)
            }
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous).stroke(DT.line, lineWidth: 0.5))
            .padding(.horizontal, DT.space3)
        }
        .buttonStyle(.plain)
        .opacity(c.muted ? 0.7 : 1.0)
    }
}

private struct PillToggle: View {
    let text: String
    let selected: Bool
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(text)
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .padding(.horizontal, DT.space2).padding(.vertical, 8)
                .background(selected ? DT.primary : DT.surface)
                .foregroundStyle(selected ? DT.surface : DT.ink)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(selected ? DT.primary : DT.lineStrong, lineWidth: 0.5))
        }
        .buttonStyle(.plain)
    }
}
