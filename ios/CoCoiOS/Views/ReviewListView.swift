import SwiftUI
import SwiftData

struct ReviewListView: View {
    @Environment(\.modelContext) private var ctx
    @State private var stats: [StudyStat] = []
    @State private var mistakes: [MistakeRecord] = []

    var body: some View {
        NavigationStack {
            List {
                Section("今日") {
                    let today = StudyStat.todayKey()
                    let s = stats.first(where: { $0.date == today })
                    HStack {
                        Label("已答", systemImage: "checkmark.circle")
                            .foregroundStyle(DesignTokens.textSecondary)
                        Spacer()
                        Text("\(s?.answered ?? 0) 题")
                            .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                            .foregroundStyle(DesignTokens.ink)
                    }
                    .listRowBackground(DesignTokens.surface)

                    HStack {
                        Label("正确率", systemImage: "percent")
                            .foregroundStyle(DesignTokens.textSecondary)
                        Spacer()
                        let rate = (s?.answered ?? 0) > 0 ? Double(s?.correct ?? 0) / Double(s?.answered ?? 0) : 0
                        Text(String(format: "%.0f%%", rate * 100))
                            .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                            .foregroundStyle(DesignTokens.ink)
                    }
                    .listRowBackground(DesignTokens.surface)
                }

                Section("错题") {
                    if mistakes.isEmpty {
                        Text("暂无错题")
                            .foregroundStyle(DesignTokens.textSecondary)
                            .listRowBackground(DesignTokens.surface)
                    } else {
                        ForEach(mistakes) { m in
                            Text("\(m.package) · \(m.questionId)")
                                .font(.system(size: DesignTokens.fontCaption))
                                .foregroundStyle(DesignTokens.ink)
                                .listRowBackground(DesignTokens.surface)
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .listRowSpacing(DesignTokens.space1)
            .scrollContentBackground(.hidden)
            .background(DesignTokens.canvas.ignoresSafeArea())
            .navigationTitle("复习")
            .navigationBarTitleDisplayMode(.large)
            .task { await load() }
        }
    }

    private func load() async {
        let statsDescriptor = FetchDescriptor<StudyStat>()
        stats = (try? ctx.fetch(statsDescriptor)) ?? []
        let mistakesDescriptor = FetchDescriptor<MistakeRecord>()
        mistakes = (try? ctx.fetch(mistakesDescriptor)) ?? []
    }
}

#Preview {
    ReviewListView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}