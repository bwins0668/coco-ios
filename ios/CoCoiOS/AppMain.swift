import SwiftUI
import SwiftData

@main
struct CoCoiOSApp: App {
    let container: ModelContainer

    init() {
        let schema = Schema([
            QuizAttempt.self,
            MistakeRecord.self,
            StudyStat.self,
            FavoriteTerm.self,
            FlashcardProgress.self,
            FavoriteQuestion.self,
            LessonProgress.self
        ])
        // Stage G1 修复 + 防御兜底：先尝试持久化 store（SwiftData 轻量迁移），
        // 若失败（例如未来字段默认值缺失导致迁移失败）则 fallback 到 in-memory，
        // 确保 app 至少能启动。in-memory 模式下用户数据丢失，但 seed 演示数据会重建。
        do {
            let config = ModelConfiguration(schema: schema)
            container = try ModelContainer(for: schema, configurations: config)
        } catch {
            print("⚠️ SwiftData 持久化 store 加载失败: \(error)")
            print("   启用 in-memory fallback（用户数据将重置为 seed 演示数据）")
            let memConfig = ModelConfiguration(schema: schema, isStoredInMemoryOnly: true)
            container = try! ModelContainer(for: schema, configurations: memConfig)
        }
        AppContext.bootstrap(container.mainContext)
        Self.seedIfNeeded(container.mainContext)
    }

    var body: some Scene {
        WindowGroup {
            RootSwitchView()
                .preferredColorScheme(.light)
        }
        .modelContainer(container)
    }

    /// 首次启动：注入 7 天演示数据，让首页/复习/我的都有真实数字
    @MainActor
    private static func seedIfNeeded(_ ctx: ModelContext) {
        let descriptor = FetchDescriptor<QuizAttempt>()
        if let count = try? ctx.fetchCount(descriptor), count > 0 { return }

        let cal = Calendar.current
        let now = Date()
        let dayFmt = DateFormatter()
        dayFmt.dateFormat = "yyyy-MM-dd"
        let examList = ["itpass", "itpass", "itpass", "itpass", "itpass", "sg", "sg"]
        let sourceList = ["past_exam_japanese", "past_exam_japanese", "lesson_quiz", "past_exam_japanese", "lesson_quiz", "past_exam_japanese", "past_exam_japanese"]
        let correctFlags: [Bool] = [true, true, false, true, true, false, true]
        let packages = ["quiz-itpass-1", "quiz-itpass-1", "quiz-itpass-2", "quiz-itpass-2", "quiz-itpass-1", "quiz-sg-1", "quiz-sg-1"]
        let qIds = (0..<7).map { "demo-q-\($0)" }

        var totalAnswered = 0
        var totalCorrect = 0
        var byDay: [String: (a: Int, c: Int)] = [:]

        for i in 0..<24 {
            let dayOffset = 23 - (i / 4)
            guard let dayDate = cal.date(byAdding: .day, value: -dayOffset, to: now) else { continue }
            let attemptDate = cal.date(byAdding: .hour, value: -i, to: dayDate) ?? dayDate
            let idx = i % 7
            let isCorrect = correctFlags[idx]
            let exam = examList[idx]
            let source = sourceList[idx]
            let pkg = packages[idx]
            let qid = qIds[idx] + "-\(i)"

            let attempt = QuizAttempt(
                questionId: qid,
                package: pkg,
                exam: exam,
                sourceType: source,
                answeredAt: attemptDate,
                isCorrect: isCorrect
            )
            ctx.insert(attempt)
            if !isCorrect {
                let m = MistakeRecord(questionId: qid, package: pkg, wrongCount: 1, lastWrong: attemptDate)
                ctx.insert(m)
            }

            totalAnswered += 1
            if isCorrect { totalCorrect += 1 }
            let key = dayFmt.string(from: attemptDate)
            var d = byDay[key] ?? (0, 0)
            d.a += 1
            if isCorrect { d.c += 1 }
            byDay[key] = d
        }

        for (key, val) in byDay {
            ctx.insert(StudyStat(date: key, answered: val.a, correct: val.c))
        }

        // 收藏 5 条术语
        for i in 1...5 {
            ctx.insert(FavoriteTerm(termId: "term-\(i)", createdAt: cal.date(byAdding: .day, value: -i, to: now) ?? now))
        }

        // 闪卡进度
        let fp = FlashcardProgress(
            course: "itpass",
            examTitle: "IT Passport",
            deckLabel: "真题练习",
            currentIndex: 4,
            total: 1502,
            updatedAt: cal.date(byAdding: .hour, value: -2, to: now) ?? now
        )
        ctx.insert(fp)

        try? ctx.save()
        _ = totalAnswered
        _ = totalCorrect
    }
}

enum AppContext {
    @MainActor private static var _ctx: ModelContext?
    @MainActor static func bootstrap(_ ctx: ModelContext) { _ctx = ctx }
    @MainActor static var modelContext: ModelContext {
        if let c = _ctx { return c }
        // 回退
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try! ModelContainer(
            for: QuizAttempt.self, MistakeRecord.self, StudyStat.self,
            FavoriteTerm.self, FlashcardProgress.self, FavoriteQuestion.self, LessonProgress.self,
            configurations: config
        )
        let c = container.mainContext
        _ctx = c
        return c
    }
}