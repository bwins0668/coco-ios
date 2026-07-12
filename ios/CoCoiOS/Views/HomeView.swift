import SwiftUI

/// 首页：题库首页 / 课程中心（接入 Storage 真实数据）
struct HomeView: View {
    @Environment(\.modelContext) private var ctx
    @State private var jstDate: String = DT.jstDateString()
    @State private var lastExamLabel: String = ""
    @State private var lastSourceLabel: String = ""
    @State private var lastMetaText: String = ""
    @State private var hasLastAttempt: Bool = false
    @State private var streak: Int = 0
    @State private var navigateCourseId: String? = nil

    private let examCourses: [(id: String, name: String, color: Color, sub: String, available: Bool)] = [
        ("itpass", "IT Passport", DT.itpassColor, "IT Passport 真题练习与年度模拟", true),
        ("sg", "SG 信息安全", DT.sgColor, "情報セキュリティマネジメント专项强化", true),
        ("mos", "MOS 365", DT.textGhost, "MOS 365 认证考试（入口待确认）", false)
    ]

    private let learningCourses: [(id: String, name: String, sub: String, color: Color, pill: String)] = [
        ("java", "Java", "Java入門 / Java 实践 · 19 章 / 336 小节", DT.primarySoft, "面向零基础"),
        ("python", "Python", "Python 入门 / 进阶 · 9 小节", DT.successSoft, "面向零基础"),
        ("sql", "SQL 数据库", "SQL 入門 · 7 章 · 第 1 课已开放", DT.warningSoft, "实操判定")
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    if hasLastAttempt { heroCard } else { startCard }
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
            .onAppear(perform: load)
        }
    }

    private func load() {
        AppContext.bootstrap(ctx)
        if let last = Storage.shared.getLastAttempt() {
            hasLastAttempt = true
            lastExamLabel = last.examLabel
            lastSourceLabel = last.sourceLabel
            lastMetaText = last.metaText
        } else {
            hasLastAttempt = false
        }
        streak = Storage.shared.getStreakCount()
    }

    private var masthead: some View {
        QPMasthead(
            kicker: "课程 · 学习",
            title: "课程",
            rightText: jstDate,
            streak: streak
        )
    }

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
                        .padding(.horizontal, DT.space2).padding(.vertical, 8)
                        .background(DT.primary).foregroundStyle(DT.surface)
                        .clipShape(Capsule())
                    Text("SG 信息安全")
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .padding(.horizontal, DT.space2).padding(.vertical, 8)
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

    private var examSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "资格考试", meta: "\(examCourses.count) 考试")
            VStack(spacing: DT.space1) {
                ForEach(examCourses, id: \.id) { exam in
                    Button(action: { if exam.available { navigateCourseId = exam.id } }) {
                        QPCard {
                            HStack(alignment: .center, spacing: DT.space2) {
                                Rectangle().fill(exam.available ? exam.color : DT.textGhost)
                                    .frame(width: 3, height: 36)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(exam.name)
                                        .font(.system(size: DT.fontBody, weight: .semibold))
                                        .foregroundStyle(exam.available ? DT.ink : DT.textTertiary)
                                    Text(exam.sub)
                                        .font(.system(size: DT.fontCaption))
                                        .foregroundStyle(DT.textSecondary)
                                        .lineLimit(1)
                                }
                                Spacer(minLength: 0)
                                if exam.available {
                                    Text("›").font(.system(size: DT.fontPageTitle, weight: .light))
                                        .foregroundStyle(DT.textTertiary)
                                } else {
                                    QPPill("准备中")
                                }
                            }
                        }
                    }
                    .buttonStyle(.plain)
                    .opacity(exam.available ? 1 : 0.6)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private var learningSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "课程学习", meta: "Java / Python / SQL 已开放")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: DT.space1) {
                    ForEach(learningCourses, id: \.id) { course in
                        learningCard(course: course)
                    }
                    plannedCard
                }
                .padding(.horizontal, DT.space3)
            }
        }
    }

    @ViewBuilder
    private func learningCard(course: (id: String, name: String, sub: String, color: Color, pill: String)) -> some View {
        Button(action: {}) {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack {
                    Text(String(course.name.prefix(2)))
                        .font(.system(size: 11, weight: .semibold))
                        .tracking(1.5)
                        .foregroundStyle(DT.textTertiary)
                    Spacer()
                    QPPill(course.pill, background: course.color, foreground: DT.ink)
                }
                Text(course.name)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text(course.sub)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                    .lineLimit(2)
                Spacer(minLength: 0)
            }
            .frame(width: 200, height: 130, alignment: .topLeading)
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

    private var plannedCard: some View {
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
            Spacer(minLength: 0)
            Text("算法基础准备中")
                .font(.system(size: DT.fontLabel))
                .foregroundStyle(DT.textTertiary)
        }
        .frame(width: 140, height: 130, alignment: .topLeading)
        .padding(DT.space2)
        .background(DT.surface.opacity(0.4))
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
    }
}

#Preview {
    HomeView()
}