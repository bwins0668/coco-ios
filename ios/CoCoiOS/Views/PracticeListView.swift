import SwiftUI
import SwiftData

struct PracticeListView: View {
    @Environment(\.modelContext) private var ctx
    @State private var packages: [QuizPackageInfo] = []

    var body: some View {
        List {
            Section("题库") {
                ForEach(packages) { pkg in
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
        .navigationTitle("刷题")
        .task { await load() }
    }

    private func load() async {
        packages = QuizStore.shared.manifest.packages
    }
}

#Preview {
    PracticeListView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}
