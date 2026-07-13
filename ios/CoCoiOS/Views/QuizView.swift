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
    @State private var elapsedSec: Int = 0
    @State private var timer: Timer? = nil

    var body: some View {
        ZStack {
            DT.canvas.ignoresSafeArea()
            Group {
                if let session {
                    QuizSessionView(session: session, package: package, exam: exam,
                                    sourceType: sourceType, elapsed: elapsedSec,
                                    onFinish: {
                                        stopTimer()
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
            startTimer()
        }
        .onDisappear { stopTimer() }
    }

    private func startTimer() {
            elapsedSec = 0
            timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
                Task { @MainActor in
                    elapsedSec += 1
                }
            }
        }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
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
    let elapsed: Int
    let onFinish: () -> Void

    var body: some View {
        if session.finished {
            QuizResultView(session: session, onFinish: onFinish)
        } else if let q = session.current {
            QuizQuestionView(session: session, question: q,
                             package: package, exam: exam, sourceType: sourceType,
                             elapsed: elapsed)
        }
    }
}

struct QuizQuestionView: View {
    @Bindable var session: QuizSession
    let question: Question
    let package: String
    let exam: String
    let sourceType: String
    let elapsed: Int

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                navBar
                questionCard
                optionsCard
                if session.showResult {
                    feedbackBanner
                    explanationCard
                }
                actionRow
                Spacer().frame(height: 60)
            }
            .padding(.horizontal, DT.space3)
            .padding(.top, DT.space1)
        }
    }

    private var navBar: some View {
        HStack {
            Circle()
                .fill(DT.primary)
                .frame(width: 28, height: 28)
                .overlay(
                    Text(package.contains("sg") ? "SG" : "IT")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundStyle(DT.surface)
                )
            Text(packageLabel)
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .foregroundStyle(DT.ink)
                .lineLimit(1)
                .truncationMode(.tail)
            Spacer(minLength: DT.space1)
            HStack(spacing: 4) {
                Image(systemName: "clock")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundStyle(DT.textTertiary)
                Text(timeString)
                    .font(.system(size: DT.fontCaption, weight: .semibold))
                    .foregroundStyle(DT.ink)
                    .monospacedDigit()
            }
            .padding(.horizontal, 8).padding(.vertical, 4)
            .background(DT.surface)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(DT.line, lineWidth: 0.5))
        }
        .padding(.top, DT.space2)
    }

    private var timeString: String {
        let m = max(0, elapsed / 60)
        let s = max(0, elapsed % 60)
        return String(format: "%02d:%02d", m, s)
    }

    private var packageLabel: String {
        let map: [String: String] = [
            "quiz-itpass-1": "IT Passport - 日文题练习 (01...)",
            "quiz-itpass-2": "IT Passport - 日文题练习 (02...)",
            "quiz-itpass-3": "IT Passport - 日文题练习 (03...)",
            "quiz-itpass-4": "IT Passport - 日文题练习 (04...)",
            "quiz-itpass-5": "IT Passport - 日文题练习 (05...)",
            "quiz-sg-1": "SG 信息安全 - 日文题练习 (01...)",
            "quiz-sg-2": "SG 信息安全 - 日文题练习 (02...)"
        ]
        return map[package] ?? package
    }

    private var questionCard: some View {
        QPRedHeaderCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text(question.questionZh.isEmpty ? question.questionJa : question.questionZh)
                    .font(.system(size: DT.fontBody, weight: .medium))
                    .foregroundStyle(DT.ink)
                    .lineSpacing(2)
                if !question.questionJa.isEmpty && !question.questionZh.isEmpty {
                    Text(question.questionJa)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineSpacing(2)
                        .padding(.top, 2)
                }
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.vertical, 4)
                HStack(spacing: 6) {
                    Text("第 \(session.index + 1) / \(session.questions.count) 题")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
                HStack(spacing: 6) {
                    QPPill("日文题练习")
                    Text(questionMeta)
                        .font(.system(size: DT.fontLabel))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
    }

    private var questionMeta: String {
        var parts: [String] = []
        if !question.year.isEmpty { parts.append(question.year) }
        parts.append("第\(question.number)题")
        return parts.joined(separator: " ")
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
        let hasResult = session.showResult
        let isCorrectAnswer = hasResult && question.answer == opt.key
        let isWrongPick = hasResult && isSelected && question.answer != opt.key

        let background: Color = {
            if isCorrectAnswer { return DT.successSoft }
            if isWrongPick { return DT.dangerSoft }
            if isSelected && !hasResult { return DT.primarySoft }
            return DT.surface
        }()
        let border: Color = {
            if isCorrectAnswer { return DT.success }
            if isWrongPick { return DT.danger }
            if isSelected && !hasResult { return DT.primary }
            return DT.line
        }()
        let circleText: Color = {
            if isCorrectAnswer || isWrongPick { return DT.surface }
            if isSelected && !hasResult { return DT.surface }
            return DT.ink
        }()
        let circleBg: Color = {
            if isCorrectAnswer { return DT.success }
            if isWrongPick { return DT.danger }
            if isSelected && !hasResult { return DT.primary }
            return DT.fillWarm
        }()

        Button(action: {
            guard !session.showResult else { return }
            session.choose(opt.key)
        }) {
            HStack(alignment: .center, spacing: DT.space2) {
                Text(opt.key)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(circleText)
                    .frame(width: 28, height: 28)
                    .background(circleBg)
                    .clipShape(Circle())
                VStack(alignment: .leading, spacing: 2) {
                    Text(opt.textZh.isEmpty ? opt.textJa : opt.textZh)
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.ink)
                        .multilineTextAlignment(.leading)
                    if !opt.textJa.isEmpty && !opt.textZh.isEmpty {
                        Text(opt.textJa)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                }
                Spacer(minLength: 0)
                if isCorrectAnswer {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(DT.success)
                } else if isWrongPick {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(DT.danger)
                }
            }
            .padding(.horizontal, DT.space2).padding(.vertical, DT.space2)
            .background(background)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(border, lineWidth: (isCorrectAnswer || isWrongPick || (isSelected && !hasResult)) ? 1.5 : 0.5)
            )
        }
        .buttonStyle(.plain)
        .disabled(session.showResult)
    }

    @ViewBuilder
    private var feedbackBanner: some View {
        if !isUserPickCorrect() {
            QPAnswerFeedbackBanner(
                isCorrect: false,
                primaryText: "回答错误，正确答案是 \(question.answer)",
                secondaryText: "正确答案是 \(question.answer)，建议结合解析理解知识点"
            )
        }
    }

    private func isUserPickCorrect() -> Bool {
        guard session.showResult, let sel = session.selected else { return false }
        return sel == question.answer
    }

    @ViewBuilder
    private var explanationCard: some View {
        VStack(alignment: .leading, spacing: DT.space2) {
            if !isUserPickCorrect() {
                explanationBlock(title: "简要解析", body: question.explanationZh.isEmpty ? question.explanationJa : question.explanationZh)
                if !question.explanationJa.isEmpty && !question.explanationZh.isEmpty {
                    explanationBlock(title: "日文原文", body: question.explanationJa)
                }
                Button(action: {}) {
                    HStack(spacing: 4) {
                        Text("查看完整解析").font(.system(size: DT.fontBody, weight: .semibold))
                        Image(systemName: "chevron.right").font(.system(size: 12, weight: .semibold))
                    }
                    .foregroundStyle(DT.primary)
                    .padding(.vertical, 8)
                }
                .buttonStyle(.plain)
            } else {
                explanationBlock(title: "解析 / 解説", body: question.explanationZh.isEmpty ? question.explanationJa : question.explanationZh)
            }
        }
    }

    @ViewBuilder
    private func explanationBlock(title: String, body: String) -> some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text(title)
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text(body)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                    .lineSpacing(3)
            }
        }
    }

    private var actionRow: some View {
        VStack(spacing: DT.space1) {
            if session.showResult {
                let userCorrect = isUserPickCorrect()
                Button(action: { session.next() }) {
                    Text(session.isLast ? "查看结果" : "下一题 →")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.surface)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(userCorrect ? DT.success : DT.primary)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
            } else if session.selected != nil {
                Button(action: { _ = session.submit() }) {
                    Text("确认作答")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.surface)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(DT.primary)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                Text("确认前可以重新选择选项")
                    .font(.system(size: DT.fontLabel))
                    .foregroundStyle(DT.textTertiary)
            } else {
                Button(action: {}) {
                    Text("请选择答案")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.textGhost)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(DT.disabledBg)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .disabled(true)
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
