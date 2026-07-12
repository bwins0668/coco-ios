import SwiftUI
import SwiftData

struct QuizView: View {
    let package: String
    @State private var session: QuizSession?
    @State private var loaded = false
    @Environment(\.modelContext) private var ctx
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Group {
            if let session {
                QuizSessionView(session: session, package: package)
            } else {
                ProgressView("加载题目…")
            }
        }
        .navigationTitle(package)
        .navigationBarTitleDisplayMode(.inline)
        .task {
            guard !loaded else { return }
            loaded = true
            let qs = QuizStore.shared.loadQuestions(package: package)
            session = QuizSession(package: package, questions: qs)
        }
    }
}

struct QuizSessionView: View {
    @Bindable var session: QuizSession
    let package: String
    @Environment(\.modelContext) private var ctx

    var body: some View {
        VStack(spacing: 0) {
            ProgressView(value: session.progress)
                .padding(.horizontal)
                .padding(.top, 8)

            if let q = session.current {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text(q.questionZh.isEmpty ? q.questionJa : q.questionZh)
                            .font(.title3.bold())
                            .padding(.top, 8)

                        if !q.category.isEmpty {
                            Text(q.category + (q.subcategory.isEmpty ? "" : " · " + q.subcategory))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }

                        VStack(spacing: 10) {
                            ForEach(q.options) { opt in
                                OptionRow(
                                    option: opt,
                                    selected: session.selected == opt.key,
                                    state: optionState(optionKey: opt.key, question: q)
                                ) {
                                    session.choose(opt.key)
                                }
                            }
                        }
                        .disabled(session.showResult)

                        if session.showResult {
                            ResultCard(session: session, question: q)
                        }
                    }
                    .padding()
                }
            } else if session.finished {
                SummaryCard(session: session, package: package)
            }

            bottomBar(q: session.current)
        }
    }

    private func optionState(optionKey: String, question: Question) -> OptionRow.State {
        if !session.showResult { return session.selected == optionKey ? .selected : .idle }
        if optionKey == question.answer { return .correct }
        if session.selected == optionKey { return .wrong }
        return .idle
    }

    @ViewBuilder
    private func bottomBar(q: Question?) -> some View {
        VStack {
            if session.showResult {
                Button(session.isLast ? "查看结果" : "下一题") {
                    if session.isLast { session.next() } else { session.next() }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .frame(maxWidth: .infinity)
            } else {
                Button("提交") {
                    let correct = session.submit()
                    recordResult(correct: correct)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .frame(maxWidth: .infinity)
                .disabled(session.selected == nil)
            }
        }
        .padding()
        .background(Theme.card)
    }

    private func recordResult(correct: Bool) {
        let key = StudyStat.todayKey()
        let req = FetchDescriptor<StudyStat>(predicate: #Predicate { $0.date == key })
        if let s = try? ctx.fetch(req).first {
            s.answered += 1
            if correct { s.correct += 1 }
        } else {
            ctx.insert(StudyStat(date: key, answered: 1, correct: correct ? 1 : 0))
        }
        if !correct, let id = session.lastWrongId {
            ctx.insert(MistakeRecord(questionId: id, package: package))
        }
        try? ctx.save()
    }
}

struct OptionRow: View {
    enum State { case idle, selected, correct, wrong }

    let option: QuizOption
    let selected: Bool
    let state: State
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .top, spacing: 12) {
                Text(option.key)
                    .font(.headline)
                    .frame(width: 28, height: 28)
                    .background(badgeColor.opacity(0.15))
                    .foregroundStyle(badgeColor)
                    .clipShape(Circle())
                Text(option.textZh.isEmpty ? option.textJa : option.textZh)
                    .font(.body)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 0)
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.card)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(borderColor, lineWidth: state == .idle && selected ? 2 : 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
    }

    private var badgeColor: Color {
        switch state {
        case .correct: return Theme.correct
        case .wrong: return Theme.wrong
        default: return Theme.accent
        }
    }
    private var borderColor: Color {
        switch state {
        case .correct: return Theme.correct
        case .wrong: return Theme.wrong
        case .selected: return Theme.accent
        default: return Color(.separator)
        }
    }
}

struct ResultCard: View {
    let session: QuizSession
    let question: Question

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: session.selected == question.answer ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .foregroundStyle(session.selected == question.answer ? Theme.correct : Theme.wrong)
                Text(session.selected == question.answer ? "回答正确" : "正确答案：\(question.answer)")
                    .font(.headline)
            }
            if !question.explanationZh.isEmpty {
                Text(question.explanationZh)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(Theme.card)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .padding(.top, 4)
    }
}

struct SummaryCard: View {
    let session: QuizSession
    let package: String
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "trophy.fill").font(.largeTitle).foregroundStyle(Theme.accent)
            Text("本轮完成").font(.title2.bold())
            Text("答对 \(session.correctCount) / \(session.answered)")
                .font(.headline)
            let rate = session.answered > 0 ? Double(session.correctCount) / Double(session.answered) : 0
            Text(String(format: "正确率 %.0f%%", rate * 100))
                .foregroundStyle(.secondary)
            Button("返回") { dismiss() }
                .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}
