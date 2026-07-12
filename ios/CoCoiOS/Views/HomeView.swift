import SwiftUI

/// 首页：题库首页 / 课程中心
/// 1:1 复刻小程序 pages/home/home.wxml (R6.5 DC-authoritative)
struct HomeView: View {
    @State private var jstDate: String = DT.jstDateString()
    @State private var streak: Int = 7
    @State private var hasLastAttempt: Bool = true
    @State private var lastExamLabel: String = "IT Passport"
    @State private var lastSourceLabel: String = "真题练习"
    @State private var lastMetaText: String = "真题练习 · 2 小时前"

    private var examCourses: [ExamCourse] {
        [
            ExamCourse(id: "itpass",
                       name: "IT Passport",
                       description: "IT Passport 真题练习与年度模拟",
                       color: DT.itpassColor,
                       available: true),
            ExamCourse(id: "sg",
                       name: "SG 信息安全",
                       description: "情報セキュリティマネジメント专项强化",
                       color: DT.sgColor,
                       available: true),
            ExamCourse(id: "mos",
                       name: "MOS 365",
                       description: "MOS 365 认证考试（入口待确认）",
                       color: DT.textGhost,
                       available: false)
        ]
    }

    private var learningCourses: [LearningCourse] {
        [
            LearningCourse(abbr: "Ja", name: "Java",
                           descJa: "Java入門 / Java実践",
                           descZh: "Java 基础 / Java 实践",
                           meta: "19 章节 · 336 小节 · 双语讲解",
                           pill: "面向零基础", pillColor: DT.primarySoft,
                           action: .java),
            LearningCourse(abbr: "Py", name: "Python",
                           descJa: "Python 入门 / Python 进阶",
                           descZh: "从输出到函数与类",
                           meta: "9 小节 · 双语讲解",
                           pill: "面向零基础", pillColor: DT.successSoft,
                           action: .python),
            LearningCourse(abbr: "SQ", name: "SQL 数据库",
                           descJa: "SQL データベース入門",
                           descZh: "SQL 数据库核心",
                           meta: "7 章节 · 第 1 课已开放 · 双语讲解",
                           pill: "实操判定", pillColor: DT.warningSoft,
                           action: .sql)
        ]
    }

    enum CourseAction { case java, python, sql, language(String) }

    struct ExamCourse: Identifiable {
        let id: String
        let name: String
        let description: String
        let color: Color
        let available: Bool
    }

    struct LearningCourse: Identifiable {
        var id: String { name }
        let abbr: String
        let name: String
        let descJa: String
        let descZh: String
        let meta: String
        let pill: String
        let pillColor: Color
        let action: CourseAction
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()

                    if hasLastAttempt {
                        heroCard
                    } else {
                        startCard
                    }

                    examSection

                    learningSection

                    Spacer().frame(height: 60)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
        }
    }

    // MARK: - Masthead
    private var masthead: some View {
        QPMasthead(
            kicker: "课程 · 学习",
            title: "课程",
            rightText: jstDate,
            streak: streak
        )
    }

    // MARK: - Hero (Continue)
    private var heroCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack {
                    Text("上次练习")
                        .font(.system(size: DT.fontCaption))
                        .tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    Spacer()
                    Text(lastMetaText)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
                Text(lastExamLabel)
                    .font(.system(size: DT.fontPageTitle, weight: .semibold))
                    .tracking(-0.5)
                    .foregroundStyle(DT.ink)
                Text("\(lastSourceLabel) · ITパスポート試験")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)

                HStack(spacing: DT.space1) {
                    QPPrimaryButton("继续练习 →") {}
                    QPOutlineButton("今日复习") {}
                }
                .padding(.top, DT.space1)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    // MARK: - Start state (no practice)
    private var startCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("START · 开始学习")
                    .font(.system(size: DT.fontLabel))
                    .tracking(2)
                    .foregroundStyle(DT.editorial)
                Text("选择考试，开始训练")
                    .font(.system(size: DT.fontPageTitle, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("请选择要备考的考试")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)

                HStack(spacing: DT.space1) {
                    Text("IT Passport")
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .padding(.horizontal, DT.space2)
                        .padding(.vertical, 8)
                        .background(DT.primary)
                        .foregroundStyle(DT.surface)
                        .clipShape(Capsule())
                    Text("SG 信息安全")
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .padding(.horizontal, DT.space2)
                        .padding(.vertical, 8)
                        .overlay(Capsule().stroke(DT.lineStrong, lineWidth: 0.5))
                        .foregroundStyle(DT.ink)
                }
                .padding(.top, DT.space1)

                QPPrimaryButton("开始第一组练习 →") {}
                    .padding(.top, DT.space1)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    // MARK: - 01 资格考试
    private var examSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "资格考试", meta: "\(examCourses.count) 考试")
            VStack(spacing: DT.space1) {
                ForEach(Array(examCourses.enumerated()), id: \.element.id) { idx, course in
                    QPExamRowCard(
                        title: course.name,
                        description: course.description,
                        isPrimary: idx == 0 && course.available,
                        isMuted: !course.available,
                        accentColor: course.color
                    ) {}
                    .overlay(alignment: .trailing) {
                        if course.available {
                            Text(idx == 0 ? "→" : "›")
                                .font(.system(size: DT.fontPageTitle, weight: .light))
                                .foregroundStyle(idx == 0 ? DT.primary : DT.textTertiary)
                                .padding(.trailing, DT.space3)
                        } else {
                            QPPill("准备中")
                                .padding(.trailing, DT.space3)
                        }
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    // MARK: - 02 课程学习
    private var learningSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "课程学习", meta: "Java / Python / SQL 已开放")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: DT.space1) {
                    ForEach(learningCourses) { course in
                        learningCard(course: course)
                    }
                    VStack(alignment: .leading, spacing: DT.space1) {
                        Text("Alg")
                            .font(.system(size: 11, weight: .semibold))
                            .tracking(1.5)
                            .foregroundStyle(DT.textGhost)
                        Text("算法基础")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.textTertiary)
                        Text("准备中")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textGhost)
                    }
                    .frame(width: 140, height: 140, alignment: .topLeading)
                    .padding(DT.space2)
                    .background(DT.surface.opacity(0.4))
                    .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                            .stroke(DT.line, lineWidth: 0.5)
                    )
                    .overlay(alignment: .bottom) {
                        Text("算法基础准备中")
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                            .padding(.bottom, DT.space2)
                    }
                }
                .padding(.horizontal, DT.space3)
            }
        }
    }

    @ViewBuilder
    private func learningCard(course: LearningCourse) -> some View {
        Button(action: {}) {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack {
                    Text(course.abbr)
                        .font(.system(size: 11, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(DT.textTertiary)
                    Spacer()
                    QPPill(course.pill, background: course.pillColor, foreground: DT.ink)
                }
                Text(course.name)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("\(course.descJa) / \(course.descZh)")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                    .lineLimit(2)
                Spacer(minLength: 0)
                Text(course.meta)
                    .font(.system(size: DT.fontLabel))
                    .foregroundStyle(DT.textTertiary)
            }
            .frame(width: 200, height: 140, alignment: .topLeading)
            .padding(DT.space2)
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    HomeView()
}