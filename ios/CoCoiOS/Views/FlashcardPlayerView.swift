import SwiftUI

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
        VStack(spacing: 0) {
            navBar
            progressSection
            Spacer().frame(height: DT.space3)
            flashCard
            Spacer()
            actionRow
        }
        .padding(.bottom, DT.space3)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .task { await load() }
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
        }
        .padding(.horizontal, DT.space2)
    }

    // MARK: - 进度区
    private var progressSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 0) {
                    Text("进度")
                        .font(.system(size: DT.fontLabel)).tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(progress)")
                            .font(.system(size: DT.fontMasthead, weight: .semibold))
                            .foregroundStyle(DT.ink)
                            .monospacedDigit()
                        Text("/ \(total)")
                            .font(.system(size: DT.fontBody, weight: .medium))
                            .foregroundStyle(DT.textSecondary)
                            .monospacedDigit()
                    }
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 0) {
                    Text("已掌握")
                        .font(.system(size: DT.fontLabel)).tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    Text("\(masteredCount)")
                        .font(.system(size: DT.fontMasthead, weight: .semibold))
                        .foregroundStyle(DT.primary)
                        .monospacedDigit()
                }
                .padding(.trailing, DT.space1)
            }
            .padding(.horizontal, DT.space3)

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle().fill(DT.line).frame(height: 2)
                    Rectangle()
                        .fill(DT.primary)
                        .frame(width: max(2, geo.size.width * CGFloat(progress) / CGFloat(total > 0 ? total : 1)), height: 2)
                }
            }
            .frame(height: 2)
            .padding(.horizontal, DT.space3)
            .padding(.top, 4)
        }
    }

    // MARK: - 闪卡
    private var flashCard: some View {
        VStack(spacing: 0) {
            Rectangle().fill(DT.editorial).frame(height: 2)
            VStack(spacing: DT.space3) {
                HStack(alignment: .top) {
                    Text(categoryTag)
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .padding(.horizontal, 10).padding(.vertical, 4)
                        .background(DT.surfaceMuted)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous)
                                .stroke(DT.line, lineWidth: 0.5)
                        )
                    Spacer()
                    Text("\(progress)/\(total)")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .foregroundStyle(DT.textTertiary)
                        .padding(.horizontal, 10).padding(.vertical, 4)
                        .background(DT.surfaceMuted)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous))
                }
                .padding(.top, DT.space3)
                .padding(.horizontal, DT.space3)

                Spacer().frame(height: DT.space3)

                Text(currentTerm)
                    .font(.system(size: 48, weight: .bold))
                    .tracking(-0.5)
                    .foregroundStyle(DT.ink)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)

                Spacer().frame(height: DT.space4)

                if showingAnswer && !meaningCN.isEmpty {
                    Text(meaningCN)
                        .font(.system(size: DT.fontBody, weight: .medium))
                        .foregroundStyle(DT.textSecondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(3)
                        .padding(.horizontal, DT.space3)
                } else if !meaningCN.isEmpty {
                    Text("タップして裏面を見る")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                        .padding(.horizontal, 12).padding(.vertical, 6)
                        .background(DT.surfaceMuted)
                        .clipShape(Capsule())
                }

                Spacer().frame(height: DT.space3)
            }
            .frame(maxWidth: .infinity)
            .background(DT.surface)
        }
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 3)
        .padding(.horizontal, DT.space3)
        .offset(x: dragOffset)
        .rotationEffect(.degrees(dragRotation))
        .gesture(
            DragGesture()
                .onChanged { value in
                    dragOffset = value.translation.width
                    dragRotation = Double(value.translation.width / 24)
                }
                .onEnded { value in
                    let translation = value.translation.width
                    if abs(translation) > swipeThreshold {
                        let mastered = translation > 0
                        withAnimation(.spring(response: 0.25, dampingFraction: 0.7)) {
                            dragOffset = translation > 0 ? 500 : -500
                            dragRotation = translation > 0 ? 15 : -15
                        }
                        nextCard(mastered: mastered)
                        resetDrag()
                    } else {
                        withAnimation(.spring(response: 0.25, dampingFraction: 0.7)) {
                            resetDrag()
                        }
                    }
                }
        )
        .frame(maxHeight: .infinity)
        .onTapGesture {
            withAnimation { showingAnswer.toggle() }
        }
    }

    private func resetDrag() {
        dragOffset = 0
        dragRotation = 0
    }

    // MARK: - 双底部 outline 按钮
    private var actionRow: some View {
        HStack(spacing: DT.space2) {
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
