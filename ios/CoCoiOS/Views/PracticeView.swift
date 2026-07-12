import SwiftUI

/// 刷题页：选择考试 + 继续上次
/// 1:1 复刻小程序 pages/practice/practice.wxml (R6.5 DC-aligned)
struct PracticeView: View {
    @State private var jstDate: String = DT.jstDateString()
    @State private var hasLastAttempt: Bool = true
    @State private var lastExamLabel: String = "IT Passport"
    @State private var lastSourceLabel: String = "真题练习"
    @State private var lastMetaText: String = "今天 21:30"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()

                    if hasLastAttempt {
                        continueCard
                    }

                    chooseExamSection

                    Spacer().frame(height: 80)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
        }
    }

    private var masthead: some View {
        QPMasthead(kicker: "DRILL · 刷题", title: "刷题", rightText: jstDate)
    }

    private var continueCard: some View {
        Button(action: {}) {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    HStack {
                        Text("CONTINUE · 继续上次")
                            .font(.system(size: DT.fontLabel))
                            .tracking(2)
                            .foregroundStyle(DT.editorial)
                        Spacer()
                        Text(lastMetaText)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }
                    HStack(spacing: 6) {
                        Text(lastExamLabel)
                            .font(.system(size: DT.fontPageTitle, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(lastSourceLabel)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }
                    Text("继续上次刷题 →")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.primary)
                        .padding(.top, DT.space1)
                }
            }
        }
        .buttonStyle(.plain)
        .padding(.horizontal, DT.space3)
    }

    private var chooseExamSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "选择考试")
            VStack(spacing: DT.space1) {
                examRow(name: "IT Passport",
                        sub: "ITパスポート試験 · 按年度模拟",
                        available: true,
                        isPrimary: true,
                        color: DT.itpassColor,
                        action: {})
                examRow(name: "SG 信息安全",
                        sub: "情報セキュリティ · 专项强化",
                        available: true,
                        isPrimary: false,
                        color: DT.sgColor,
                        action: {})
                examRow(name: "MOS 365",
                        sub: "认证考试 — 准备中",
                        available: false,
                        isPrimary: false,
                        color: DT.textGhost,
                        action: {})
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func examRow(name: String,
                         sub: String,
                         available: Bool,
                         isPrimary: Bool,
                         color: Color,
                         action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(alignment: .center, spacing: DT.space2) {
                Rectangle()
                    .fill(available ? color : DT.textGhost)
                    .frame(width: 3, height: 36)
                VStack(alignment: .leading, spacing: 4) {
                    Text(name)
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(available ? DT.ink : DT.textTertiary)
                    Text(sub)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineLimit(1)
                }
                Spacer(minLength: 0)
                if available {
                    Text("›")
                        .font(.system(size: DT.fontPageTitle, weight: .light))
                        .foregroundStyle(isPrimary ? DT.primary : DT.textTertiary)
                } else {
                    QPPill("准备中")
                }
            }
            .padding(.horizontal, DT.space2)
            .padding(.vertical, DT.space2)
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .opacity(available ? 1 : 0.6)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    PracticeView()
}