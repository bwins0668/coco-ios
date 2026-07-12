import Foundation
import SwiftData

/// 数据桥接层（对应小程序 utils/storage.js 的聚合接口）
/// 提供首页 / 复习 / 错题 / 个人中心所需的所有汇总数据。
@MainActor
final class Storage {
    static let shared = Storage()

    private init() {}

    // MARK: - Convenience
    private var ctx: ModelContext { AppContext.modelContext }

    // MARK: - 上次练习
    struct LastAttempt: Equatable {
        let exam: String
        let sourceType: String
        let answeredAt: Date

        var examLabel: String {
            switch exam {
            case "itpass": return "IT Passport"
            case "sg": return "SG 信息安全"
            case "wrong_only": return "错题练习"
            default: return exam
            }
        }
        var sourceLabel: String {
            switch sourceType {
            case "lesson_quiz": return "模拟练习"
            case "past_exam_japanese": return "真题练习"
            case "wrong_only": return "错题重练"
            default: return sourceType
            }
        }
        var metaText: String {
            let rel = Self.relativeTime(answeredAt)
            return rel.isEmpty ? sourceLabel : "\(sourceLabel) · \(rel)"
        }
    }

    func getLastAttempt() -> LastAttempt? {
        var descriptor = FetchDescriptor<QuizAttempt>(
            sortBy: [SortDescriptor(\.answeredAt, order: .reverse)]
        )
        descriptor.fetchLimit = 1
        let arr = (try? ctx.fetch(descriptor)) ?? []
        guard let a = arr.first else { return nil }
        return LastAttempt(exam: a.exam, sourceType: a.sourceType, answeredAt: a.answeredAt)
    }

    // MARK: - 连续学习天数
    func getStreakCount() -> Int {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo") ?? .current
        let keyFormatter = DateFormatter()
        keyFormatter.dateFormat = "yyyy-MM-dd"
        keyFormatter.timeZone = cal.timeZone
        let todayKey = keyFormatter.string(from: Date())

        var streak = 0
        var d = Date()
        while true {
            let k = keyFormatter.string(from: d)
            let descriptor = FetchDescriptor<StudyStat>(
                predicate: #Predicate { $0.date == k }
            )
            let arr = (try? ctx.fetch(descriptor)) ?? []
            if arr.isEmpty { break }
            streak += 1
            guard let prev = cal.date(byAdding: .day, value: -1, to: d) else { break }
            d = prev
        }
        _ = todayKey
        return streak
    }

    // MARK: - 总览统计
    struct QuizStats {
        var total: Int = 0
        var correct: Int = 0
        var wrong: Int = 0
        var accuracy: Int = 0
        var todayTotal: Int = 0
        var byExam: [String: (accuracy: Int, total: Int)] = [:]
        var bySourceType: [String: (accuracy: Int, total: Int)] = [:]
    }

    func getQuizStats() -> QuizStats {
        let attempts = (try? ctx.fetch(FetchDescriptor<QuizAttempt>())) ?? []
        var stats = QuizStats()
        var byExamTotal: [String: (c: Int, t: Int)] = [:]
        var bySourceTotal: [String: (c: Int, t: Int)] = [:]
        let todayKey = StudyStat.todayKey()
        let dayFmt = DateFormatter()
        dayFmt.dateFormat = "yyyy-MM-dd"
        for a in attempts {
            stats.total += 1
            if a.isCorrect { stats.correct += 1 } else { stats.wrong += 1 }
            if dayFmt.string(from: a.answeredAt) == todayKey { stats.todayTotal += 1 }
            var be = byExamTotal[a.exam] ?? (0, 0)
            be.t += 1
            if a.isCorrect { be.c += 1 }
            byExamTotal[a.exam] = be
            var bs = bySourceTotal[a.sourceType] ?? (0, 0)
            bs.t += 1
            if a.isCorrect { bs.c += 1 }
            bySourceTotal[a.sourceType] = bs
        }
        stats.accuracy = stats.total > 0 ? Int(round(Double(stats.correct) / Double(stats.total) * 100)) : 0
        stats.byExam = byExamTotal.mapValues { v in
            (accuracy: v.t > 0 ? Int(round(Double(v.c) / Double(v.t) * 100)) : 0, total: v.t)
        }
        stats.bySourceType = bySourceTotal.mapValues { v in
            (accuracy: v.t > 0 ? Int(round(Double(v.c) / Double(v.t) * 100)) : 0, total: v.t)
        }
        return stats
    }

    // MARK: - 错题 / 收藏
    func getMistakeRecords() -> [MistakeRecord] {
        var descriptor = FetchDescriptor<MistakeRecord>(
            sortBy: [SortDescriptor(\.lastWrong, order: .reverse)]
        )
        return (try? ctx.fetch(descriptor)) ?? []
    }

    func getMistakeCount() -> Int {
        ((try? ctx.fetchCount(FetchDescriptor<MistakeRecord>())) ?? 0)
    }

    func getMistakesByCourse() -> [String: Int] {
        let all = getMistakeRecords()
        var dict: [String: Int] = [:]
        for m in all {
            dict[m.package, default: 0] += 1
        }
        return dict
    }

    func getFavoriteTermCount() -> Int {
        ((try? ctx.fetchCount(FetchDescriptor<FavoriteTerm>())) ?? 0)
    }

    // MARK: - 闪卡进度
    func getFlashcardProgress() -> FlashcardProgress? {
        var descriptor = FetchDescriptor<FlashcardProgress>(
            sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
        )
        descriptor.fetchLimit = 1
        return (try? ctx.fetch(descriptor))?.first
    }

    func getFlashcardDecks() -> [DeckInfo] {
        let packages = QuizStore.shared.manifest.packages
        let mistakes = getMistakesByCourse()
        return packages.map { pkg in
            DeckInfo(package: pkg.package,
                     title: pkg.package.replacingOccurrences(of: "quiz-", with: ""),
                     total: pkg.count,
                     mastered: 0,
                     pending: pkg.count,
                     mistakes: mistakes[pkg.package] ?? 0)
        }
    }

    struct DeckInfo: Identifiable {
        var id: String { package }
        let package: String
        let title: String
        let total: Int
        let mastered: Int
        let pending: Int
        let mistakes: Int
    }

    // MARK: - 时间辅助
    static func relativeTime(_ date: Date) -> String {
        let now = Date()
        let diff = now.timeIntervalSince(date)
        let m = Int(diff / 60)
        let h = Int(diff / 3600)
        let d = Int(diff / 86400)
        if m < 1 { return "刚刚" }
        if m < 60 { return "\(m) 分钟前" }
        if h < 24 { return "\(h) 小时前" }
        if d < 7 { return "\(d) 天前" }
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    static func timelineTime(_ date: Date) -> String {
        let cal = Calendar.current
        let now = Date()
        if cal.isDateInToday(date) {
            let f = DateFormatter()
            f.dateFormat = "HH:mm"
            return "今天 \(f.string(from: date))"
        }
        if cal.isDateInYesterday(date) {
            let f = DateFormatter()
            f.dateFormat = "HH:mm"
            return "昨天 \(f.string(from: date))"
        }
        let f = DateFormatter()
        f.dateFormat = "yyyy/MM/dd HH:mm"
        return f.string(from: now) == "now" ? "时间未记录" : f.string(from: date)
    }
}

/// 单例 ModelContext 注入，由 AppMain 在 init 时填充。
enum AppContext {
    @MainActor static var modelContext: ModelContext = {
        // 回退：内存容器，避免编译错误；真实容器由 AppMain 注入。
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try! ModelContainer(
            for: QuizAttempt.self, MistakeRecord.self, StudyStat.self,
            FavoriteTerm.self, FlashcardProgress.self,
            configurations: config
        )
        return container.mainContext
    }()
}