import SwiftUI

/// 错题本：错题复盘中心
/// 1:1 复刻小程序 pages/mistakes/mistakes.wxml
struct MistakesView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var wrongCount: Int = 27
    @State private var itpassCount: Int = 18
    @State private var sgCount: Int = 9
    @State private var lastWrongTime: String = "今天 21:30"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                hero
                actionGrid
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
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

    private var hero: some View {
        VStack(alignment: .leading, spacing: DT.space2) {
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("错题本")
                        .font(.system(size: DT.fontPageTitle, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text("答错自动收录 · 复盘巩固")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
                Spacer()
                VStack(alignment: .center, spacing: 2) {
                    Text("\(wrongCount)")
                        .font(.system(size: DT.fontDisplay, weight: .semibold))
                        .foregroundStyle(DT.editorial)
                    Text("待复盘")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                }
            }
            HStack(spacing: DT.space1) {
                if itpassCount > 0 {
                    Text("IT Passport \(itpassCount)")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(DT.primarySoft)
                        .foregroundStyle(DT.primary)
                        .clipShape(Capsule())
                }
                if sgCount > 0 {
                    Text("SG \(sgCount)")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(DT.successSoft)
                        .foregroundStyle(DT.success)
                        .clipShape(Capsule())
                }
                Spacer()
                Text(lastWrongTime)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textTertiary)
            }
        }
        .padding(DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    private var actionGrid: some View {
        VStack(spacing: DT.space1) {
            HStack(spacing: DT.space1) {
                actionTile(icon: "≡", title: "查看错题详情", stat: "\(wrongCount) 道", color: DT.danger)
                actionTile(icon: "▦", title: "闪卡复盘", stat: "Anki", color: DT.ankiColor)
            }
            actionTile(icon: "▶", title: "继续练习", stat: "做题", color: DT.primary, fullWidth: true)
        }
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private func actionTile(icon: String, title: String, stat: String, color: Color, fullWidth: Bool = false) -> some View {
        Button(action: {}) {
            HStack(alignment: .center, spacing: DT.space2) {
                Circle()
                    .fill(color.opacity(0.15))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(icon)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(color)
                    )
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Text(stat)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                }
                Spacer()
                Text("›")
                    .font(.system(size: DT.fontPageTitle, weight: .light))
                    .foregroundStyle(DT.textTertiary)
            }
            .padding(.horizontal, DT.space2)
            .padding(.vertical, DT.space2)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
        .frame(maxWidth: fullWidth ? .infinity : nil)
    }
}

#Preview {
    MistakesView()
}