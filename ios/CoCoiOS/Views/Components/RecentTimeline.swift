import SwiftUI
import SwiftData

/// 最近练习时间线组件
struct RecentTimeline: View {
    @Environment(\.modelContext) private var ctx
    @State private var items: [TimelineItem] = []

    struct TimelineItem: Identifiable {
        let id: String
        let time: String
        let examLabel: String
        let sourceLabel: String
        let isCorrect: Bool
    }

    var body: some View {
        VStack(spacing: 0) {
            if items.isEmpty {
                emptyState
            } else {
                ForEach(Array(items.enumerated()), id: \.element.id) { idx, it in
                    if idx > 0 { Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2) }
                    HStack(alignment: .center, spacing: DT.space2) {
                        Circle()
                            .fill(it.isCorrect ? DT.successSoft : DT.dangerSoft)
                            .frame(width: 28, height: 28)
                            .overlay(Text(it.isCorrect ? "✓" : "×")
                                .font(.system(size: DT.fontCaption, weight: .semibold))
                                .foregroundStyle(it.isCorrect ? DT.success : DT.danger))
                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(it.examLabel) · \(it.sourceLabel)")
                                .font(.system(size: DT.fontBody))
                                .foregroundStyle(DT.ink)
                            Text(it.time)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textTertiary)
                        }
                        Spacer()
                    }
                    .padding(.horizontal, DT.space2).padding(.vertical, DT.space1)
                }
            }
        }
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
        .onAppear { reload() }
    }

    private var emptyState: some View {
        Text("暂无练习记录")
            .font(.system(size: DT.fontCaption))
            .foregroundStyle(DT.textTertiary)
            .padding(.vertical, DT.space3)
            .frame(maxWidth: .infinity)
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        var descriptor = FetchDescriptor<QuizAttempt>(
            sortBy: [SortDescriptor(\.answeredAt, order: .reverse)]
        )
        descriptor.fetchLimit = 10
        let attempts = (try? ctx.fetch(descriptor)) ?? []
        self.items = attempts.map { a in
            TimelineItem(
                id: a.questionId,
                time: Storage.timelineTime(a.answeredAt),
                examLabel: examLabel(a.exam),
                sourceLabel: sourceLabel(a.sourceType),
                isCorrect: a.isCorrect
            )
        }
    }

    private func examLabel(_ id: String) -> String {
        switch id {
        case "itpass": return "IT Passport"
        case "sg": return "SG 信息安全"
        default: return id
        }
    }

    private func sourceLabel(_ s: String) -> String {
        switch s {
        case "lesson_quiz": return "课程练习"
        case "past_exam_japanese": return "真题练习"
        case "wrong_only": return "错题重练"
        default: return s
        }
    }
}

#Preview {
    RecentTimeline()
}