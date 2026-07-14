import SwiftUI

/// 课程中心页：01 资格考试 + 02 课程学习（接真实课程 + Storage 上次练习）
struct CourseCenterView: View {
    @Environment(\.modelContext) private var ctx
    @State private var lastExamLabel: String = ""
    @State private var lastSourceLabel: String = ""
    @State private var lastMetaText: String = ""
    @State private var hasLastAttempt: Bool = false
    @State private var selectedExam: String? = nil

    private let examCourses: [(id: String, name: String, color: Color, sub: String)] = [
        ("itpass", "IT Passport", DT.itpassColor, "IT Passport 真题练习与年度模拟"),
        ("sg", "SG 信息安全", DT.sgColor, "情報セキュリティマネジメント专项强化"),
        ("mos", "MOS 365", DT.textGhost, "MOS 365 认证考试（入口待确认）")
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
                        if hasLastAttempt { heroCard }
                        examSection
                        learningSection
                        Spacer().frame(height: 80)
                    }
                    .padding(.bottom, DT.space3)
                }
                .scrollContentBackground(.hidden)
                .navigationBarHidden(true)
                .navigationDestination(isPresented: Binding(
                    get: { selectedExam != nil },
                    set: { if !$0 { selectedExam = nil } }
                )) {
                    if let id = selectedExam {
                        CourseDetailView(courseId: id, courseName: examCourses.first(where: { $0.id == id })?.name ?? "")
                    }
                }
                .onAppear { reload() }
            }
            .background(DT.canvas.ignoresSafeArea())
        }
    private func reload() {
        AppContext.bootstrap(ctx)
        if let last = Storage.shared.getLastAttempt() {
            hasLastAttempt = true
            lastExamLabel = last.examLabel
            lastSourceLabel = last.sourceLabel
            lastMetaText = last.metaText
        } else {
            hasLastAttempt = false
        }
    }

    private var masthead: some View {
        QPMasthead(kicker: "COURSE · 课程中心", title: "课程", rightText: DT.jstDateString())
    }

    private var heroCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack {
                    Text("上次练习").font(.system(size: DT.fontCaption)).tracking(2).foregroundStyle(DT.textTertiary)
                    Spacer()
                    Text(lastMetaText).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                }
                Text(lastExamLabel).font(.system(size: DT.fontPageTitle, weight: .semibold)).foregroundStyle(DT.ink)
                Text(lastSourceLabel).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                HStack(spacing: DT.space1) {
                    QPPrimaryButton("继续练习 →") {}
                    QPOutlineButton("今日复习") {}
                }
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
                    Button(action: { if exam.id != "mos" { selectedExam = exam.id } }) {
                        QPCard {
                            HStack(alignment: .center, spacing: DT.space2) {
                                Rectangle().fill(exam.id == "mos" ? DT.textGhost : exam.color).frame(width: 3, height: 36)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(exam.name).font(.system(size: DT.fontBody, weight: .semibold))
                                        .foregroundStyle(exam.id == "mos" ? DT.textTertiary : DT.ink)
                                    Text(exam.sub).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(1)
                                }
                                Spacer(minLength: 0)
                                if exam.id == "mos" {
                                    QPPill("准备中")
                                } else {
                                    Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
                                }
                            }
                        }
                    }
                    .buttonStyle(.plain)
                    .opacity(exam.id == "mos" ? 0.6 : 1)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    private var learningSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "课程学习", meta: "Java / Python / SQL 已开放")
            VStack(spacing: DT.space1) {
                ForEach(learningCourses, id: \.id) { course in
                    Button(action: {}) {
                        QPCard {
                            HStack(alignment: .center, spacing: DT.space2) {
                                Rectangle().fill(course.color).frame(width: 3, height: 56)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(course.name).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                                    Text(course.sub).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(2)
                                }
                                Spacer(minLength: 0)
                                QPPill(course.pill, background: course.color, foreground: DT.ink)
                                Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }
}

#Preview {
    CourseCenterView()
}