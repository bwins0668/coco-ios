import SwiftUI
import SwiftData

struct ReviewListView: View {
    @Environment(\.modelContext) private var ctx
    @State private var stats: [StudyStat] = []
    @State private var mistakes: [MistakeRecord] = []

    var body: some View {
        List {
            Section("今日") {
                let today = StudyStat.todayKey()
                let s = stats.first(where: { $0.date == today })
                HStack {
                    Label("已答", systemImage: "checkmark.circle")
                    Spacer()
                    Text("\(s?.answered ?? 0) 题").bold()
                }
                HStack {
                    Label("正确率", systemImage: "percent")
                    Spacer()
                    let rate = (s?.answered ?? 0) > 0 ? Double(s?.correct ?? 0) / Double(s?.answered ?? 0) : 0
                    Text(String(format: "%.0f%%", rate * 100)).bold()
                }
            }
            Section("错题") {
                if mistakes.isEmpty {
                    Text("暂无错题")
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(mistakes) { m in
                        Text("\(m.package) · \(m.questionId)")
                            .font(.caption)
                    }
                }
            }
        }
        .navigationTitle("复习")
        .task { await load() }
    }

    private func load() async {
        stats = (try? ctx.fetch(FetchDescriptor<StudyStat>(predicate: #Predicate { true }))) ?? []
        mistakes = (try? ctx.fetch(FetchDescriptor<MistakeRecord>(predicate: #Predicate { true }))) ?? []
    }
}

#Preview {
    ReviewListView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}
