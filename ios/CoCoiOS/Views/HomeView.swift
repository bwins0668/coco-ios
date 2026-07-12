import SwiftUI

enum Theme {
    static let bg = Color(.systemGroupedBackground)
    static let card = Color(.secondarySystemGroupedBackground)
    static let accent = Color("AccentColor")
    static let correct = Color.green
    static let wrong = Color.red
}

struct HomeView: View {
    @Environment(\.modelContext) private var ctx
    @Query(sort: \StudyStat.date, order: .reverse) private var stats: [StudyStat]
    @State private var navigateTo: String?

    var body: some View {
        NavigationStack {
            List {
                todaySection
                Section("题库") {
                    ForEach(QuizStore.shared.manifest.packages) { pkg in
                        NavigationLink {
                            QuizView(package: pkg.package)
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(pkg.package)
                                        .font(.headline)
                                    Text("\(pkg.count) 题 · 中文 \(pkg.withZh)")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(.tertiary)
                            }
                            .padding(.vertical, 6)
                        }
                    }
                }
            }
            .navigationTitle("CoCo 学习")
        }
    }

    private var todaySection: some View {
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
                let rate = (s?.answered ?? 0) > 0
                    ? Double(s?.correct ?? 0) / Double(s?.answered ?? 0)
                    : 0
                Text(String(format: "%.0f%%", rate * 100)).bold()
            }
        }
    }
}
