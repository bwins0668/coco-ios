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

/// 收藏术语记录（Stage G1：扩展 SM-2 字段，SwiftData 轻量迁移自动接管旧数据）
@Model
final class FavoriteTerm {
    var termId: String
    var createdAt: Date

    // SM-2 间隔复习算法字段（Stage G1 新增）
    /// 复习间隔天数；首次学习后为 1，通过后逐步递增
    var interval: Int
    /// 易读因子 EF；标准 SM-2 默认 2.5，clamp >= 1.3
    var easeFactor: Double
    /// 连续记住次数；失败时归零
    var repetitions: Int
    /// 下次到期时间；筛选 dueDate <= Date() 作为复习列表
    var dueDate: Date

    init(termId: String,
         createdAt: Date = .now,
         interval: Int = 1,
         easeFactor: Double = 2.5,
         repetitions: Int = 0,
         dueDate: Date = .now) {
        self.termId = termId
        self.createdAt = createdAt
        self.interval = interval
        self.easeFactor = easeFactor
        self.repetitions = repetitions
        self.dueDate = dueDate
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

// MARK: - SM-2 间隔复习调度器（Stage G1）
//
// 经典 SM-2 (SuperMemo-2) 实现：
//   q ∈ {0..5}，q<3 视为失败、否则视为通过
//   EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))，clamp EF' >= 1.3
//   失败：repetitions = 0，interval = 1
//   通过：repetitions += 1，interval = {1, 6, round(prev * EF)}
//   next due = now + interval 天
//
// 当前 app 仅使用两档评分：未记住(q=1) / 已掌握(q=4)，与之前的设计保持一致。
enum SM2Scheduler {
    /// 应用一次评分到 FavoriteTerm 并就地更新 interval / easeFactor / repetitions / dueDate。
    static func apply(quality q: Int, to term: FavoriteTerm, now: Date = .now) {
        let quality = max(0, min(5, q))

        // 1) 更新易读因子 EF
        var ef = term.easeFactor
            + (0.1 - Double(5 - quality) * (0.08 + Double(5 - quality) * 0.02))
        if ef < 1.3 { ef = 1.3 }

        // 2) 计算新一轮间隔与连续次数
        var reps = term.repetitions
        var interval: Int
        if quality < 3 {
            reps = 0
            interval = 1
        } else {
            reps += 1
            switch reps {
            case 1: interval = 1
            case 2: interval = 6
            default: interval = max(1, Int((Double(term.interval) * ef).rounded()))
            }
        }

        // 3) 写回 term（SwiftData 自动追踪属性变更）
        term.easeFactor = ef
        term.repetitions = reps
        term.interval = interval
        term.dueDate = now.addingTimeInterval(TimeInterval(interval) * 86_400)
    }
}
