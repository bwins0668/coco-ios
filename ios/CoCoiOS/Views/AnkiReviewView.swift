import SwiftUI
import SwiftData

/// Anki 闪卡复习页（Stage G1）：从 FavoriteTerm 取到期卡片，按 SM-2 算法调度复习。
///
/// - 加载：#Predicate { $0.dueDate <= now } 过滤 + 按 dueDate 升序（最久未复习优先）
/// - 评分：左滑 "未记住" q=1 / 右滑 "已掌握" q=4
/// - 持久化：每次评分调用 SM2Scheduler.apply 并 try? ctx.save()
struct AnkiReviewView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var dueRows: [DuePair] = []
    @State private var usingFallback: Bool = false
    @State private var favoriteTotal: Int = 0
    @State private var index: Int = 0
    @State private var showingAnswer: Bool = false
    @State private var remembered: Int = 0
    @State private var forgotten: Int = 0

    /// 复习条目：FavoriteTerm 用于 SM-2 写回；GlossaryTerm 用于 UI 渲染
    private struct DuePair {
        let row: FavoriteTerm?
        let term: GlossaryTerm
    }

    private var currentRow: DuePair? {
        guard index < dueRows.count else { return nil }
        return dueRows[index]
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                progressBlock
                card
                actions
                Spacer().frame(height: 40)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .onAppear { reload() }
    }

    // MARK: - 数据加载与 SM-2 写入
    private func reload() {
        AppContext.bootstrap(ctx)
        let now = Date()

        var descriptor = FetchDescriptor<FavoriteTerm>(
            predicate: #Predicate { $0.dueDate <= now },
            sortBy: [SortDescriptor(\.dueDate, order: .forward)]
        )
        descriptor.fetchLimit = 100  // 单次最多复习 100 张，避免极端数据卡顿

        let dueFavorites = (try? ctx.fetch(descriptor)) ?? []
        let pairs = dueFavorites.compactMap { row -> DuePair? in
            guard let term = GlossaryStore.shared.term(id: row.termId) else { return nil }
            return DuePair(row: row, term: term)
        }

        let totalFavorites = ((try? ctx.fetchCount(FetchDescriptor<FavoriteTerm>())) ?? 0)
        favoriteTotal = totalFavorites

        if !pairs.isEmpty {
            dueRows = pairs
            usingFallback = false
        } else if totalFavorites > 0 {
            // 用户有收藏但今天无到期：显示 "今日已完成" 空态
            dueRows = []
            usingFallback = false
        } else {
            // 完全无收藏：保留演示 fallback（前 10 个术语），不写 SM-2
            let fallback = Array(GlossaryStore.shared.search("").prefix(10))
            dueRows = fallback.map { DuePair(row: nil, term: $0) }
            usingFallback = true
        }

        index = 0
        remembered = 0
        forgotten = 0
        showingAnswer = false
    }

    private func next(quality: Int) {
        if let row = currentRow?.row {
            SM2Scheduler.apply(quality: quality, to: row)
            try? ctx.save()
        }
        if quality < 3 { forgotten += 1 } else { remembered += 1 }
        showingAnswer = false
        if index + 1 <= dueRows.count { index += 1 }
    }

    // MARK: - 视图片段
    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("\u{2039}").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    private var progressBlock: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text("术语复习")
                    .font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
                Text("\(index) / \(dueRows.count)")
                    .font(.system(size: DT.fontMasthead, weight: .semibold))
                    .foregroundStyle(DT.ink)
            }
            Spacer()
            HStack(spacing: 6) {
                pillStat(value: remembered, color: DT.success, label: "已掌握")
                pillStat(value: forgotten, color: DT.danger, label: "未记住")
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private func pillStat(value: Int, color: Color, label: String) -> some View {
        VStack(alignment: .trailing, spacing: 2) {
            Text("\(value)").font(.system(size: DT.fontSectionTitle, weight: .semibold)).foregroundStyle(color)
            Text(label).font(.system(size: DT.fontLabel)).foregroundStyle(DT.textTertiary)
        }
    }

    @ViewBuilder
    private var card: some View {
        if let pair = currentRow {
            VStack(alignment: .leading, spacing: DT.space2) {
                QPCard {
                    VStack(alignment: .leading, spacing: DT.space2) {
                        Text("中文").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
                        Text(pair.term.zh).font(.system(size: DT.fontDisplay, weight: .semibold)).foregroundStyle(DT.ink)
                        if showingAnswer {
                            Text("日本語").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary).padding(.top, 4)
                            Text(pair.term.ja).font(.system(size: DT.fontSectionTitle, weight: .semibold)).foregroundStyle(DT.ink)
                            Text("English").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary).padding(.top, 4)
                            Text(pair.term.term).font(.system(size: DT.fontBody)).foregroundStyle(DT.textSecondary)
                            if !pair.term.explanationZh.isEmpty {
                                Text(pair.term.explanationZh)
                                    .font(.system(size: DT.fontCaption))
                                    .foregroundStyle(DT.textTertiary)
                                    .padding(.top, 4)
                            }
                            if let row = pair.row {
                                sm2Badge(row: row)
                            }
                        } else {
                            Button(action: { showingAnswer = true }) {
                                Text("显示答案").font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(DT.primary)
                                    .frame(maxWidth: .infinity).padding(.vertical, DT.space1)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous)
                                            .stroke(DT.primary, lineWidth: 1)
                                    )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        } else if !usingFallback && favoriteTotal > 0 {
            // 进入时就已经没有 due，且确实有收藏
            todayDoneCard.padding(.horizontal, DT.space3)
        } else {
            finishedCard.padding(.horizontal, DT.space3)
        }
    }

    private func sm2Badge(row: FavoriteTerm) -> some View {
        HStack(spacing: 8) {
            tag("间隔 \(row.interval)d")
            tag(String(format: "EF %.2f", row.easeFactor))
            tag("已记 \(row.repetitions) 次")
        }
        .padding(.top, 6)
    }

    private func tag(_ s: String) -> some View {
        Text(s)
            .font(.system(size: DT.fontLabel, weight: .medium))
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(DT.fillWarm)
            .clipShape(Capsule())
    }

    private var todayDoneCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("今日复习已完成 \u{2705}")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.success)
                Text("\(favoriteTotal) 张已收藏 \u{00B7} 下一批将于明天到期")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                QPPrimaryButton("返回") { dismiss() }
                    .padding(.top, DT.space1)
            }
        }
    }

    private var finishedCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("本次复习完成").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                Text("已掌握 \(remembered) / 未记住 \(forgotten)").font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                QPPrimaryButton("再来一组") {
                    index = 0; remembered = 0; forgotten = 0; showingAnswer = false
                }
                .padding(.top, DT.space1)
            }
        }
    }

    private var actions: some View {
        Group {
            if currentRow != nil && showingAnswer {
                HStack(spacing: DT.space2) {
                    actionButton(icon: "\u{00D7}", title: "未记住", color: DT.danger, bg: DT.dangerSoft, quality: 1) {
                        next(quality: 1)
                    }
                    actionButton(icon: "\u{2713}", title: "已掌握", color: DT.success, bg: DT.successSoft, quality: 4) {
                        next(quality: 4)
                    }
                }
                .padding(.horizontal, DT.space3)
            }
        }
    }

    private func actionButton(icon: String, title: String, color: Color, bg: Color, quality: Int, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(icon).font(.system(size: DT.fontBody, weight: .semibold))
                Text(title).font(.system(size: DT.fontBody, weight: .semibold))
            }
            .foregroundStyle(color)
            .frame(maxWidth: .infinity).padding(.vertical, DT.space2)
            .background(bg)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    AnkiReviewView()
}
