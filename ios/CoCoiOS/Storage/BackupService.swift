import Foundation

/// 本地备份导出 / 恢复
struct LocalBackup: Codable {
    let version: String
    let exportedAt: Date
    let data: BackupData

    struct BackupData: Codable {
        let favoriteTerms: [String]
        let wrongQuestions: [WrongQuestion]
        let quizAttempts: [BackupAttempt]
    }

    struct WrongQuestion: Codable {
        let questionId: String
        let package: String
        let wrongCount: Int
        let lastWrong: Date
    }

    struct BackupAttempt: Codable {
        let questionId: String
        let package: String
        let exam: String
        let sourceType: String
        let answeredAt: Date
        let isCorrect: Bool
    }
}

@MainActor
final class BackupService {
    static let shared = BackupService()
    private init() {}

    func exportBackup() -> LocalBackup? {
        AppContext.modelContext  // ensure initialized
        let ctx = AppContext.modelContext

        let favorites = (try? ctx.fetch(FetchDescriptor<FavoriteTerm>())) ?? []
        let mistakes = (try? ctx.fetch(FetchDescriptor<MistakeRecord>())) ?? []
        let attempts = (try? ctx.fetch(FetchDescriptor<QuizAttempt>())) ?? []

        let backup = LocalBackup(
            version: "1.0",
            exportedAt: Date(),
            data: .init(
                favoriteTerms: favorites.map { $0.termId },
                wrongQuestions: mistakes.map {
                    LocalBackup.WrongQuestion(
                        questionId: $0.questionId, package: $0.package,
                        wrongCount: $0.wrongCount, lastWrong: $0.lastWrong
                    )
                },
                quizAttempts: attempts.map {
                    LocalBackup.BackupAttempt(
                        questionId: $0.questionId, package: $0.package,
                        exam: $0.exam, sourceType: $0.sourceType,
                        answeredAt: $0.answeredAt, isCorrect: $0.isCorrect
                    )
                }
            )
        )
        return backup
    }

    func exportBackupString() -> String {
        guard let backup = exportBackup() else { return "{}" }
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        let data = (try? encoder.encode(backup)) ?? Data()
        return String(data: data, encoding: .utf8) ?? "{}"
    }

    @discardableResult
    func importBackup(from json: String) -> Bool {
        guard let data = json.data(using: .utf8) else { return false }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        guard let backup = try? decoder.decode(LocalBackup.self, from: data) else { return false }

        let ctx = AppContext.modelContext

        // 清空旧数据
        for entity in [FavoriteTerm.self, MistakeRecord.self, QuizAttempt.self] {
            if let existing = try? ctx.fetch(FetchDescriptor<FetchResult>(predicate: .init(format: "TRUEPREDICATE"))) as? [Any] {
                _ = existing
            }
            // 通用删除：取所有后逐个删
            try? deleteAll(entity, in: ctx)
        }

        // 写入新数据
        for fid in backup.data.favoriteTerms {
            ctx.insert(FavoriteTerm(termId: fid))
        }
        for w in backup.data.wrongQuestions {
            ctx.insert(MistakeRecord(questionId: w.questionId, package: w.package,
                                      wrongCount: w.wrongCount, lastWrong: w.lastWrong))
        }
        for a in backup.data.quizAttempts {
            ctx.insert(QuizAttempt(
                questionId: a.questionId, package: a.package, exam: a.exam,
                sourceType: a.sourceType, answeredAt: a.answeredAt, isCorrect: a.isCorrect
            ))
        }
        try? ctx.save()
        return true
    }

    func clearAllData() {
        let ctx = AppContext.modelContext
        try? deleteAll(MistakeRecord.self, in: ctx)
        try? deleteAll(QuizAttempt.self, in: ctx)
        try? deleteAll(StudyStat.self, in: ctx)
        try? ctx.save()
    }

    private func deleteAll<T: PersistentModel>(_ type: T.Type, in ctx: ModelContext) throws {
        let descriptor = FetchDescriptor<T>(predicate: #Predicate { _ in true })
        let items = try ctx.fetch(descriptor)
        for item in items { ctx.delete(item) }
    }
}