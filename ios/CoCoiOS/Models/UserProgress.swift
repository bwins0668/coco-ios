import Foundation
import SwiftData

/// 错题记录（SwiftData 持久化）
@Model
final class MistakeRecord {
    var questionId: String
    var package: String
    var wrongCount: Int
    var lastWrong: Date

    init(questionId: String, package: String, wrongCount: Int = 1, lastWrong: Date = .now) {
        self.questionId = questionId
        self.package = package
        self.wrongCount = wrongCount
        self.lastWrong = lastWrong
    }
}

/// 每日答题统计（SwiftData 持久化）
@Model
final class StudyStat {
    var date: String      // yyyy-MM-dd
    var answered: Int
    var correct: Int

    init(date: String, answered: Int, correct: Int) {
        self.date = date
        self.answered = answered
        self.correct = correct
    }

    static func todayKey(_ cal: Calendar = .current) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.calendar = cal
        return f.string(from: Date())
    }
}
