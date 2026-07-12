import SwiftUI
import SwiftData

/// Anki 闪卡复习页：术语卡片翻面 + 已掌握 / 未掌握
struct AnkiReviewView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var terms: [TermItem] = TermItem.demo
    @State private var index: Int = 0
    @State private var showingAnswer: Bool = false
    @State private var remembered: Int = 0
    @State private var forgotten: Int = 0

    var current: TermItem? {
        guard index < terms.count else { return nil }
        return terms[index]
    }

    var progress: Double {
        terms.isEmpty ? 0 : Double(index) / Double(terms.count)
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
        .onAppear { AppContext.bootstrap(ctx) }
    }

    private var backButton: some View {
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

    private var progressBlock: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text("术语复习")
                    .font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
                Text("\(index) / \(terms.count)")
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
            Text("\(value)")
                .font(.system(size: DT.fontSectionTitle, weight: .semibold))
                .foregroundStyle(color)
            Text(label)
                .font(.system(size: DT.fontLabel))
                .foregroundStyle(DT.textTertiary)
        }
    }

    @ViewBuilder
    private var card: some View {
        if let t = current {
            VStack(alignment: .leading, spacing: DT.space2) {
                QPCard {
                    VStack(alignment: .leading, spacing: DT.space2) {
                        Text("中文").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
                        Text(t.zh)
                            .font(.system(size: DT.fontDisplay, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        if showingAnswer {
                            Text("日本語").font(.system(size: DT.fontLabel)).tracking(2).foregroundStyle(DT.textTertiary)
                                .padding(.top, 4)
                            Text(t.ja)
                                .font(.system(size: DT.fontSectionTitle, weight: .semibold))
                                .foregroundStyle(DT.ink)
                            Text("English")
                                .font(.system(size: DT.fontLabel)).tracking(2)
                                .foregroundStyle(DT.textTertiary)
                                .padding(.top, 4)
                            Text(t.en)
                                .font(.system(size: DT.fontBody))
                                .foregroundStyle(DT.textSecondary)
                            Text(t.desc)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textTertiary)
                                .padding(.top, 4)
                        } else {
                            Button(action: { showingAnswer = true }) {
                                Text("显示答案")
                                    .font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(DT.primary)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, DT.space1)
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
        } else {
            finishedCard
                .padding(.horizontal, DT.space3)
        }
    }

    private var finishedCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("本次复习完成")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("已掌握 \(remembered) / 未记住 \(forgotten)")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                QPPrimaryButton("再来一组") { index = 0; remembered = 0; forgotten = 0; showingAnswer = false }
                    .padding(.top, DT.space1)
            }
        }
    }

    private var actions: some View {
        Group {
            if current != nil && showingAnswer {
                HStack(spacing: DT.space2) {
                    actionButton(icon: "×", title: "未记住", color: DT.danger, bg: DT.dangerSoft) {
                        forgotten += 1
                        next()
                    }
                    actionButton(icon: "✓", title: "已掌握", color: DT.success, bg: DT.successSoft) {
                        remembered += 1
                        next()
                    }
                }
                .padding(.horizontal, DT.space3)
            }
        }
    }

    private func actionButton(icon: String, title: String, color: Color, bg: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(icon).font(.system(size: DT.fontBody, weight: .semibold))
                Text(title).font(.system(size: DT.fontBody, weight: .semibold))
            }
            .foregroundStyle(color)
            .frame(maxWidth: .infinity)
            .padding(.vertical, DT.space2)
            .background(bg)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        }
        .buttonStyle(.plain)
    }

    private func next() {
        showingAnswer = false
        if index + 1 <= terms.count {
            index += 1
        }
    }
}

#Preview {
    AnkiReviewView()
}