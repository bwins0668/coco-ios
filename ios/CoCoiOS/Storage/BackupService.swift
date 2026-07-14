import Foundation
import SwiftData

/// 本地备份导出 / 恢复
/// Stage G1：favoriteTerms 从 [String] 升级为 [FavoriteTermBackup]，携带 SM-2 状态；
/// 旧备份 ([String] 格式) 通过 importBackup 的二次解码自动迁移。
struct LocalBackup: Codable {
    let version: String
    let exportedAt: Date
    let data: BackupData

    struct BackupData: Codable {
        let favoriteTerms: [FavoriteTermBackup]
        let wrongQuestions: [WrongQuestion]
        let quizAttempts: [BackupAttempt]
    }

    /// Stage G1：单个收藏术语的完整 SM-2 快照
    struct FavoriteTermBackup: Codable {
        let termId: String
        let createdAt: Date
        let interval: Int
        let easeFactor: Double
        let repetitions: Int
        let dueDate: Date
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
            version: "1.1",
            exportedAt: Date(),
            data: .init(
                favoriteTerms: favorites.map {
                    LocalBackup.FavoriteTermBackup(
                        termId: $0.termId,
                        createdAt: $0.createdAt,
                        interval: $0.interval,
                        easeFactor: $0.easeFactor,
                        repetitions: $0.repetitions,
                        dueDate: $0.dueDate
                    )
                },
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

    /// 导入备份：新格式（v1.1）+ 旧格式（v1.0 favoriteTerms:[String]）都接受
    @discardableResult
    func importBackup(from json: String) -> Bool {
        guard let data = json.data(using: .utf8) else { return false }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        if let backup = try? decoder.decode(LocalBackup.self, from: data) {
            return applyImport(backup)
        }

        // 旧格式兜底：favoriteTerms 是 [String]，SM-2 字段全部回退默认
        struct LegacyBackup: Codable {
            struct Data: Codable {
                let favoriteTerms: [String]
                let wrongQuestions: [LocalBackup.WrongQuestion]
                let quizAttempts: [LocalBackup.BackupAttempt]
            }
            let version: String
            let exportedAt: Date
            let data: Data
        }
        if let legacy = try? decoder.decode(LegacyBackup.self, from: data) {
            let mapped = LocalBackup(
                version: legacy.version + "+legacy",
                exportedAt: legacy.exportedAt,
                data: .init(
                    favoriteTerms: legacy.data.favoriteTerms.map {
                        LocalBackup.FavoriteTermBackup(
                            termId: $0,
                            createdAt: Date(),
                            interval: 1,
                            easeFactor: 2.5,
                            repetitions: 0,
                            dueDate: Date()
                        )
                    },
                    wrongQuestions: legacy.data.wrongQuestions,
                    quizAttempts: legacy.data.quizAttempts
                )
            )
            return applyImport(mapped)
        }

        return false
    }

    private func applyImport(_ backup: LocalBackup) -> Bool {
        let ctx = AppContext.modelContext

        // 清空旧数据
        try? deleteAll(FavoriteTerm.self, in: ctx)
        try? deleteAll(MistakeRecord.self, in: ctx)
        try? deleteAll(QuizAttempt.self, in: ctx)

        // 写入新数据
        for f in backup.data.favoriteTerms {
            ctx.insert(FavoriteTerm(
                termId: f.termId,
                createdAt: f.createdAt,
                interval: f.interval,
                easeFactor: f.easeFactor,
                repetitions: f.repetitions,
                dueDate: f.dueDate
            ))
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
