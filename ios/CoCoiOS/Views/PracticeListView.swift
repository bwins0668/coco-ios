import SwiftUI
import SwiftData

struct PracticeListView: View {
    @Environment(\.modelContext) private var ctx
    @State private var packages: [QuizPackageInfo] = []

    var body: some View {
        NavigationStack {
            List {
                Section("题库") {
                    ForEach(packages) { pkg in
                        NavigationLink {
                            QuizView(package: pkg.package)
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(pkg.package)
                                        .font(.system(size: DesignTokens.fontBody, weight: .semibold))
                                        .foregroundStyle(DesignTokens.ink)
                                    Text("\(pkg.count) 题 · 中文 \(pkg.withZh)")
                                        .font(.system(size: DesignTokens.fontCaption))
                                        .foregroundStyle(DesignTokens.textSecondary)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(DesignTokens.textTertiary)
                                    .font(.system(size: DesignTokens.fontBody))
                            }
                            .padding(.vertical, DesignTokens.space1)
                        }
                        .listRowBackground(DesignTokens.surface)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .listRowSpacing(DesignTokens.space1)
            .scrollContentBackground(.hidden)
            .background(DesignTokens.canvas.ignoresSafeArea())
            .navigationTitle("刷题")
            .navigationBarTitleDisplayMode(.large)
            .task { await load() }
        }
    }

    private func load() async {
        packages = QuizStore.shared.manifest.packages
    }
}

#Preview {
    PracticeListView()
        .modelContainer(for: [MistakeRecord.self, StudyStat.self], inMemory: true)
}