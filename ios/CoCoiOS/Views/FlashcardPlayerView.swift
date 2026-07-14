import SwiftUI
import SwiftData

/// 闪卡学习页：顶部 back + 进度 + 已掌握 + menu
/// + 红顶 2px 闪卡（tag + 进度 meta + 中央大字术语 + タップして裏面を見る pill）
/// + 左滑未 remember/右滑已记住，保留底部双按钮
struct FlashcardPlayerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var showingAnswer: Bool = false
    @State private var dragOffset: CGFloat = 0
    @State private var dragRotation: CGFloat = 0
    @State private var impact = UIImpactFeedbackGenerator(style: .medium)
    @State private var currentIndex: Int = 0
    @State private var terms: [(term: String, meaning: String)] = []
    @State private var masteredCount: Int = 0
    @State private var categoryTag: String = ""
    @State private var deckTitle: String = ""

    private let swipeThreshold: CGFloat = 80

    let package: String
    let startIndex: Int

    private var total: Int { terms.count }
    private var progress: Int { currentIndex + 1 }
    private var currentTerm: String {
        guard currentIndex < terms.count else { return "" }
        return terms[currentIndex].term
    }
    private var meaningCN: String {
        guard currentIndex < terms.count else { return "" }
        return terms[currentIndex].meaning
    }

    init(package: String, startIndex: Int = 0) {
        self.package = package
        self.startIndex = startIndex
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                navBar
                progressSection
                Spacer().frame(height: DT.space3)
                flashCard
                Spacer()
                actionRow
            }
            .padding(.bottom, DT.space3)
            .navigationBarHidden(true)
            .task { await load() }
        }
        .background(DT.canvas.ignoresSafeArea())
    }

    private func load() async {
        AppContext.bootstrap(ctx)
        let qs = QuizStore.shared.loadQuestions(package: package)
        let tag = package.contains("sg") ? "SG" : "IT Passport"
        categoryTag = "\(tag) · 真题闪卡"
        deckTitle = package
        var arr: [(String, String)] = []
        for q in qs {
            let term = q.questionZh.isEmpty ? q.questionJa : q.questionZh
            let meaning = q.options.map { $0.textZh.isEmpty ? $0.textJa : $0.textZh }.filter { !$0.isEmpty }.joined(separator: "\n")
            arr.append((term, meaning))
        }
        terms = arr
        currentIndex = max(0, min(startIndex, terms.count - 1))
        masteredCount = 0
    }

    // MARK: - navBar
    private var navBar: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
            Text(categoryTag)
                .font(.system(size: DT.fontLabel, weight: .medium))
                .tracking(1.5)
                .foregroundStyle(DT.textSecondary)
            Spacer()
            Menu {
                Button("重置进度", role: .destructive) { currentIndex = 0; masteredCount = 0 }
            } label: {
                Image(systemName: "ellipsis")
                    .font(.system(size: DT.fontBody, weight: .medium))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
        }
        .padding(.horizontal, DT.space2)
        .padding(.top, DT.space2)
    }

    // MARK: - progressSection
    private var progressSection: some View {
        VStack(spacing: DT.space1) {
            HStack {
                Text("进度 \(progress) / \(total)")
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .foregroundStyle(DT.textSecondary)
                Spacer()
                Text("已掌握 \(masteredCount)")
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .foregroundStyle(DT.success)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle().fill(DT.fillWarm).frame(height: 4)
                    Rectangle().fill(DT.primary)
                        .frame(width: max(2, geo.size.width * CGFloat(progress) / CGFloat(total > 0 ? total : 1)), height: 4)
                }
            }
            .frame(height: 4)
        }
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space2)
    }

    // MARK: - flashCard
    private var flashCard: some View {
        ZStack {
            RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                .fill(DT.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                        .stroke(DT.line, lineWidth: 0.5)
                )
                .overlay(
                    Rectangle().fill(DT.editorial).frame(height: 2),
                    alignment: .top
                )
            VStack(spacing: DT.space2) {
                HStack {
                    QPPill(categoryTag, background: DT.primarySoft, foreground: DT.primary)
                    Spacer()
                    Text("\(progress) / \(total)")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .foregroundStyle(DT.textTertiary)
                }
                if showingAnswer {
                    Text(meaningCN)
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.textSecondary)
                        .multilineTextAlignment(.leading)
                        .frame(maxWidth: .infinity, alignment: .leading)
                } else {
                    Text(currentTerm)
                        .font(.system(size: DT.fontPageTitle, weight: .semibold))
                        .foregroundStyle(DT.ink)
                        .multilineTextAlignment(.center)
                }
                Text(showingAnswer ? "已显示答案" : "点击卡片查看含义")
                    .font(.system(size: DT.fontLabel))
                    .foregroundStyle(DT.textGhost)
                    .padding(.horizontal, DT.space2).padding(.vertical, 6)
                    .background(DT.fillWarm)
                    .clipShape(Capsule())
            }
            .padding(DT.space3)
        }
        .padding(.horizontal, DT.space3)
        .onTapGesture { withAnimation { showingAnswer.toggle() } }
    }

    // MARK: - actionRow
    private var actionRow: some View {
        HStack(spacing: DT.space1) {
            Button(action: { nextCard(mastered: false) }) {
                HStack(spacing: 6) {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .semibold))
                    Text("未记住")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(DT.danger)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(DT.surface)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(DT.danger, lineWidth: 1))
            }
            .buttonStyle(.plain)

            Button(action: { nextCard(mastered: true) }) {
                HStack(spacing: 6) {
                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .semibold))
                    Text("已记住")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(DT.success)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(DT.surface)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(DT.success, lineWidth: 1))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space3)
    }

    private func nextCard(mastered: Bool) {
        let hapticStyle: UIImpactFeedbackGenerator.FeedbackStyle = mastered ? .light : .medium
        let generator = UIImpactFeedbackGenerator(style: hapticStyle)
        generator.impactOccurred()

        withAnimation {
            if mastered { masteredCount += 1 }
            showingAnswer = false
            if currentIndex < total - 1 {
                currentIndex += 1
            } else {
                currentIndex = 0
            }
            persistProgress()
        }
    }

    private func persistProgress() {
        guard !terms.isEmpty else { return }
        let tag = package.contains("sg") ? "SG" : "IT Passport"
        let examTitle = tag
        let deckLabel = package
        let existing = (try? ctx.fetch(FetchDescriptor<FlashcardProgress>(
            predicate: #Predicate { $0.course == package },
            sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
        )))?.first

        if let p = existing {
            p.currentIndex = currentIndex
            p.total = terms.count
            p.updatedAt = Date()
        } else {
            ctx.insert(FlashcardProgress(
                course: package,
                examTitle: examTitle,
                deckLabel: deckLabel,
                currentIndex: currentIndex,
                total: terms.count,
                updatedAt: Date()
            ))
        }
        try? ctx.save()
    }
}

#Preview {
    NavigationStack {
        FlashcardPlayerView(package: "quiz-itpass-1", startIndex: 0)
    }
}