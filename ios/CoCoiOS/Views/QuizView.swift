import SwiftUI
import SwiftData

/// 刷题答题页（接 QuizSession 真实刷题 + 自动写 QuizAttempt 入库）
struct QuizView: View {
    let package: String
    let exam: String
    let sourceType: String

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var session: QuizSession?
    @State private var loaded: Bool = false

    var body: some View {
        ZStack {
            DT.canvas.ignoresSafeArea()
            Group {
                if let session {
                    QuizSessionView(session: session, package: package, exam: exam, sourceType: sourceType, onFinish: {
                        saveAttempt(session)
                        dismiss()
                    })
                } else {
                    ProgressView("加载题目…")
                        .tint(DT.ink)
                }
            }
        }
        .navigationBarHidden(true)
        .task {
            guard !loaded else { return }
            loaded = true
            let qs = QuizStore.shared.loadQuestions(package: package)
            session = QuizSession(package: package, questions: qs)
        }
    }

    private func saveAttempt(_ session: QuizSession) {
        AppContext.bootstrap(ctx)
        let dayKey = StudyStat.todayKey()
        let existing = (try? ctx.fetch(FetchDescriptor<StudyStat>(
            predicate: #Predicate { $0.date == dayKey }
        )))?.first
        if let stat = existing {
            stat.answered += session.answered
            stat.correct += session.correctCount
        } else {
            ctx.insert(StudyStat(date: dayKey, answered: session.answered, correct: session.correctCount))
        }

        // 给每道已答题写入 QuizAttempt，isCorrect 取自 session.history[i]（真值），
        // 而不是用 lastWrongId 单点推断（之前的版本会因 lastWrongId 多题共用导致全部 isCorrect=true）
        for i in 0..<min(session.answered, session.questions.count) {
            let q = session.questions[i]
            let isCorrect = i < session.history.count ? session.history[i] : false
            let attempt = QuizAttempt(
                questionId: q.id,
                package: package,
                exam: exam,
                sourceType: sourceType,
                answeredAt: Date(),
                isCorrect: isCorrect
            )
            ctx.insert(attempt)
            // 错题入库
            if !isCorrect {
                let existingWrong = (try? ctx.fetch(FetchDescriptor<MistakeRecord>(
                    predicate: #Predicate { $0.questionId == q.id }
                )))?.first
                if let m = existingWrong {
                    m.wrongCount += 1
                    m.lastWrong = Date()
                } else {
                    ctx.insert(MistakeRecord(questionId: q.id, package: package, wrongCount: 1, lastWrong: Date()))
                }
            }
        }

        try? ctx.save()
    }
}

struct QuizSessionView: View {
    @Bindable var session: QuizSession
    let package: String
    let exam: String
    let sourceType: String
    let onFinish: () -> Void

    var body: some View {
        if session.finished {
            QuizResultView(session: session, onFinish: onFinish)
        } else if let q = session.current {
            QuizQuestionView(session: session, question: q, package: package)
        }
    }
}

struct QuizQuestionView: View {
    @Bindable var session: QuizSession
    let question: Question
    let package: String

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            navBar
            progressBlock
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space2) {
                    questionCard
                    optionsCard
                    if session.showResult {
                        explanationCard
                    }
                    actionRow
                    Spacer().frame(height: 60)
                }
                .padding(.horizontal, DT.space3)
                .padding(.top, DT.space1)
            }
        }
    }

    private var navBar: some View {
        HStack {
            Text("\(session.answered + 1) / \(session.questions.count)")
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .foregroundStyle(DT.textSecondary)
            Spacer()
            Text(packageLabel)
                .font(.system(size: DT.fontLabel)).tracking(2)
                .foregroundStyle(DT.textTertiary)
        }
        .padding(.horizontal, DT.space3).padding(.top, DT.space2)
    }

    private var packageLabel: String {
        let map: [String: String] = [
            "quiz-itpass-1": "IT Passport · 年度 1",
            "quiz-itpass-2": "IT Passport · 年度 2",
            "quiz-itpass-3": "IT Passport · 年度 3",
            "quiz-itpass-4": "IT Passport · 年度 4",
            "quiz-itpass-5": "IT Passport · 年度 5",
            "quiz-sg-1": "SG 信息安全 · 年度 1",
            "quiz-sg-2": "SG 信息安全 · 年度 2"
        ]
        return map[package] ?? package
    }

    private var progressBlock: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Rectangle().fill(DT.line).frame(height: 2)
                Rectangle().fill(DT.editorial)
                    .frame(width: max(2, geo.size.width * session.progress), height: 2)
            }
        }
        .frame(height: 2)
        .padding(.horizontal, DT.space3)
    }

    private var questionCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack(spacing: 6) {
                    if !question.category.isEmpty {
                        QPPill(question.category)
                    }
                    if !question.subcategory.isEmpty {
                        Text(question.subcategory)
                            .font(.system(size: DT.fontLabel))
                            .foregroundStyle(DT.textTertiary)
                    }
                }
                Text(question.questionZh.isEmpty ? question.questionJa : question.questionZh)
                    .font(.system(size: DT.fontBody, weight: .medium))
                    .foregroundStyle(DT.ink)
                if !question.questionJa.isEmpty && !question.questionZh.isEmpty {
                    Text(question.questionJa)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
        }
    }

    private var optionsCard: some View {
        VStack(spacing: DT.space1) {
            ForEach(question.options) { opt in
                optionRow(opt)
            }
        }
    }

    @ViewBuilder
    private func optionRow(_ opt: QuizOption) -> some View {
        let isSelected = session.selected == opt.key
        let isCorrect = session.showResult && question.answer == opt.key
        let isWrong = session.showResult && isSelected && question.answer != opt.key

        Button(action: {
            guard !session.showResult else { return }
            session.choose(opt.key)
        }) {
            HStack(alignment: .center, spacing: DT.space2) {
                Text(opt.key)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(isSelected ? DT.surface : DT.ink)
                    .frame(width: 28, height: 28)
                    .background(isSelected ? DT.ink : DT.fillWarm)
                    .clipShape(Circle())
                Text(opt.textZh.isEmpty ? opt.textJa : opt.textZh)
                    .font(.system(size: DT.fontBody))
                    .foregroundStyle(DT.ink)
                    .multilineTextAlignment(.leading)
                Spacer()
                if isCorrect {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(DT.success)
                } else if isWrong {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(DT.danger)
                }
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
            .background(isSelected && !session.showResult ? DT.primarySoft : DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(isWrong ? DT.danger : (isCorrect ? DT.success : DT.line), lineWidth: isCorrect || isWrong ? 1.5 : 0.5)
            )
        }
        .buttonStyle(.plain)
        .disabled(session.showResult)
    }

    private var explanationCard: some View {
        QPCard(backgroundColor: DT.warningSoft, borderColor: DT.editorial.opacity(0.3), borderWidth: 1) {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("解析 / 解説")
                    .font(.system(size: DT.fontLabel)).tracking(2)
                    .foregroundStyle(DT.textTertiary)
                Text(question.explanationZh.isEmpty ? question.explanationJa : question.explanationZh)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.ink)
                if !question.explanationJa.isEmpty && !question.explanationZh.isEmpty {
                    Text(question.explanationJa)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
            }
        }
    }

    private var actionRow: some View {
        Group {
            if session.showResult {
                HStack(spacing: DT.space2) {
                    if let wrong = session.lastWrongId, wrong == question.id {
                        Button(action: {}) {
                            HStack(spacing: 6) {
                                Text("☆").font(.system(size: DT.fontBody, weight: .semibold))
                                Text("收藏").font(.system(size: DT.fontBody, weight: .semibold))
                            }
                            .foregroundStyle(DT.ink)
                            .frame(maxWidth: .infinity).padding(.vertical, DT.space2)
                            .background(DT.fillWarm)
                            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                        }
                        .buttonStyle(.plain)
                    }
                    Button(action: { session.next() }) {
                        Text(session.isLast ? "查看结果" : "下一题 →")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.surface)
                            .frame(maxWidth: .infinity).padding(.vertical, DT.space2)
                            .background(DT.ink)
                            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
            } else {
                Button(action: { _ = session.submit() }) {
                    Text(session.selected == nil ? "请选择答案" : "提交答案")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(session.selected == nil ? DT.textGhost : DT.surface)
                        .frame(maxWidth: .infinity).padding(.vertical, DT.space2)
                        .background(session.selected == nil ? DT.disabledBg : DT.ink)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                }
                .buttonStyle(.plain)
                .disabled(session.selected == nil)
            }
        }
    }
}

struct QuizResultView: View {
    let session: QuizSession
    let onFinish: () -> Void

    var accuracy: Int {
        session.answered == 0 ? 0 : Int(round(Double(session.correctCount) / Double(session.answered) * 100))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: DT.space2) {
            Spacer().frame(height: 60)
            VStack(spacing: DT.space2) {
                Image(systemName: "trophy.fill")
                    .font(.system(size: 56))
                    .foregroundStyle(DT.editorial)
                Text("本次刷题完成")
                    .font(.system(size: DT.fontPageTitle, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("准确率 \(accuracy)% · 共 \(session.answered) 题")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)

                HStack(spacing: DT.space2) {
                    statBlock(value: "\(session.correctCount)", label: "答对", color: DT.success)
                    statBlock(value: "\(session.answered - session.correctCount)", label: "答错", color: DT.danger)
                    statBlock(value: "\(session.questions.count)", label: "题库", color: DT.primary)
                }
                .padding(.horizontal, DT.space3)
            }
            .frame(maxWidth: .infinity)
            .padding(DT.space3)
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .padding(.horizontal, DT.space3)

            VStack(spacing: DT.space1) {
                QPPrimaryButton("完成") { onFinish() }
                QPOutlineButton("再来一组") { onFinish() }
            }
            .padding(.horizontal, DT.space3)
            Spacer()
        }
    }

    private func statBlock(value: String, label: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value).font(.system(size: DT.fontSectionTitle, weight: .semibold)).foregroundStyle(color)
            Text(label).font(.system(size: DT.fontLabel)).foregroundStyle(DT.textTertiary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, DT.space1)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
    }
}