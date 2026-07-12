import SwiftUI

/// 闪卡学习页：当前题 + 进度 + 解析面板 + 记住/未记住按钮
/// 1:1 复刻小程序 pages/quiz/pages/flashcard-player/flashcard-player.wxml
struct FlashcardPlayerView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var progress: Int = 4
    @State private var total: Int = 1502
    @State private var mastered: Int = 1
    @State private var showingAnswer: Bool = true

    private let word: String = "行"
    private let readingJa: String = "行（レコード）"
    private let explanation: String = "中文释义"
    private let langHint: String = "日本語 / 解析"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                progressBar
                card
                explanationCard
                actionButtons
                Spacer().frame(height: 40)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space2)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
    }

    private var backButton: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹")
                    .font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    private var progressBar: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("进度")
                        .font(.system(size: DT.fontLabel))
                        .tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    Text("\(progress)")
                        .font(.system(size: DT.fontMasthead, weight: .semibold))
                        .foregroundStyle(DT.ink)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("已掌握")
                        .font(.system(size: DT.fontLabel))
                        .tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    Text("\(mastered)")
                        .font(.system(size: DT.fontMasthead, weight: .semibold))
                        .foregroundStyle(DT.success)
                }
            }
            .padding(.horizontal, DT.space3)

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(DT.line)
                        .frame(height: 1)
                    Rectangle()
                        .fill(DT.editorial)
                        .frame(width: max(2, geo.size.width * CGFloat(progress) / CGFloat(total)), height: 1)
                }
            }
            .frame(height: 1)
            .padding(.horizontal, DT.space3)
        }
    }

    private var card: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space2) {
                Text(word)
                    .font(.system(size: DT.fontDisplay, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text(explanation)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
            }
        }
        .padding(.horizontal, DT.space3)
    }

    private var explanationCard: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            HStack(spacing: 6) {
                Text("☰")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                Text("解析")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                Text("\(progress)/\(total)")
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(DT.fillWarm)
                    .foregroundStyle(DT.textTertiary)
                    .clipShape(Capsule())
                Spacer()
                Button(action: {}) {
                    Image(systemName: "list.bullet")
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.textTertiary)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, DT.space3)

            Text("中文释义")
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textSecondary)
                .padding(.horizontal, DT.space3)

            Text(word)
                .font(.system(size: DT.fontDisplay, weight: .semibold))
                .foregroundStyle(DT.ink)
                .padding(.horizontal, DT.space3)

            Text(langHint)
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textTertiary)
                .padding(.horizontal, DT.space3)

            QPCard {
                Text(readingJa)
                    .font(.system(size: DT.fontBody))
                    .foregroundStyle(DT.ink)
            }
            .padding(.horizontal, DT.space3)

            Color.clear.frame(height: DT.space3)
        }
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.editorial, lineWidth: 1)
        )
        .padding(.horizontal, DT.space3)
    }

    private var actionButtons: some View {
        HStack(spacing: DT.space2) {
            Button(action: {}) {
                HStack(spacing: 6) {
                    Text("×")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                    Text("未记住")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(DT.danger)
                .frame(maxWidth: .infinity)
                .padding(.vertical, DT.space2)
                .background(DT.dangerSoft)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            }
            .buttonStyle(.plain)

            Button(action: {}) {
                HStack(spacing: 6) {
                    Text("✓")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                    Text("已记住")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(DT.success)
                .frame(maxWidth: .infinity)
                .padding(.vertical, DT.space2)
                .background(DT.successSoft)
                .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, DT.space3)
    }
}

#Preview {
    FlashcardPlayerView()
}