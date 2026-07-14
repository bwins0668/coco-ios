import Foundation
import SwiftData

/// 单次答题记录（保留时间线、分类正确率、最近一次会话等数据）
@Model
final class QuizAttempt {
    var questionId: String
    var package: String       // 来自 QuizManifest.package
    var exam: String          // itpass / sg / mos
    var sourceType: String    // lesson_quiz / past_exam_japanese / wrong_only
    var answeredAt: Date
    var isCorrect: Bool

    init(questionId: String, package: String, exam: String, sourceType: String, answeredAt: Date = .now, isCorrect: Bool) {
        self.questionId = questionId
        self.package = package
        self.exam = exam
        self.sourceType = sourceType
        self.answeredAt = answeredAt
        self.isCorrect = isCorrect
    }
}

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

/// 收藏术语记录
@Model
final class FavoriteTerm {
    var termId: String
    var createdAt: Date

    init(termId: String, createdAt: Date = .now) {
        self.termId = termId
        self.createdAt = createdAt
    }
}

/// 闪卡学习进度（最近一次）
@Model
final class FlashcardProgress {
    var course: String       // itpass / sg / python 等
    var examTitle: String
    var deckLabel: String
    var currentIndex: Int
    var total: Int
    var updatedAt: Date

    init(course: String, examTitle: String, deckLabel: String, currentIndex: Int, total: Int, updatedAt: Date = .now) {
        self.course = course
        self.examTitle = examTitle
        self.deckLabel = deckLabel
        self.currentIndex = currentIndex
        self.total = total
        self.updatedAt = updatedAt
    }
}

/// 收藏题目记录（SwiftData 持久化）
@Model
final class FavoriteQuestion {
    @Attribute(.unique) var questionId: String
    var createdAt: Date

    init(questionId: String, createdAt: Date = .now) {
        self.questionId = questionId
        self.createdAt = createdAt
    }
}

/// 课节学习进度记录（SwiftData 持久化）
@Model
final class LessonProgress {
    @Attribute(.unique) var lessonId: String
    var courseId: String
    var isCompleted: Bool
    var updatedAt: Date

    init(lessonId: String, courseId: String, isCompleted: Bool = false, updatedAt: Date = .now) {
        self.lessonId = lessonId
        self.courseId = courseId
        self.isCompleted = isCompleted
        self.updatedAt = updatedAt
    }
}