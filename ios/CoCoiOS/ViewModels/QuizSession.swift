import Foundation
import Observation

/// 一次刷题会话的状态机（iOS 17 Observation）
@Observable
final class QuizSession {
    let package: String
    private(set) var questions: [Question]
    private(set) var index: Int = 0
    var selected: String?
    private(set) var correctCount: Int = 0
    private(set) var answered: Int = 0
    private(set) var showResult: Bool = false
    private(set) var lastWrongId: String?
    /// 每题的真实判分记录（按 questions 顺序）。第一题对应 history[0]，
    /// 写入 SwiftData QuizAttempt 时直接读这个，避免 lastWrongId 单点推断导致全部 isCorrect=true 的 bug。
    private(set) var history: [Bool] = []

    init(package: String, questions: [Question], shuffle: Bool = true) {
        self.package = package
        self.questions = shuffle ? questions.shuffled() : questions
        self.history = Array(repeating: false, count: self.questions.count)
    }

    var current: Question? {
        questions.indices.contains(index) ? questions[index] : nil
    }

    var isLast: Bool { index >= questions.count - 1 }
    var finished: Bool { answered >= questions.count }
    var progress: Double {
        questions.isEmpty ? 0 : Double(answered) / Double(questions.count)
    }

    func choose(_ key: String) {
        guard !showResult else { return }
        selected = key
    }

    /// 提交当前题；返回是否答对
    @discardableResult
    func submit() -> Bool {
        guard let q = current, let sel = selected, !showResult else { return false }
        answered += 1
        let correct = sel == q.answer
        if correct { correctCount += 1 } else { lastWrongId = q.id }
        // 记录在历史数组（按 questions 原始索引，而不是 shuffled view）
        // 注意：index 在 next() 时才递增，所以 submitted 时 index 仍指向当前题。
        if index < history.count { history[index] = correct }
        showResult = true
        return correct
    }

    func next() {
        showResult = false
        selected = nil
        lastWrongId = nil
        if !isLast { index += 1 }
    }
}
