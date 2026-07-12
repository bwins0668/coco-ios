import SwiftUI

/// 复习页：闪卡复习、错题复习、术语复习
/// 1:1 复刻小程序 pages/review/review.wxml (R6.5)
struct ReviewView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    section01
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
        VStack(alignment: .leading, spacing: 4) {
            Text("REVIEW · 復習")
                .font(.system(size: DT.fontLabel))
                .tracking(2)
                .foregroundStyle(DT.textTertiary)
            Text("复习")
                .font(.system(size: DT.fontMasthead, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text("巩固薄弱点，温故知新")
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space3)
    }

    private var section01: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "今日复习")
            VStack(spacing: DT.space1) {
                reviewCard(title: "闪卡复习",
                           sub: "IT Passport / SG 年度模拟闪卡",
                           color: DT.primary,
                           action: {})
                reviewCard(title: "错题复习",
                           sub: "回顾错题，巩固薄弱知识点",
                           color: DT.danger,
                           action: {})
                reviewCard(title: "术语复习",
                           sub: "复习收藏的术语与概念",
                           color: DT.success,
                           action: {})
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func reviewCard(title: String, sub: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    Rectangle()
                        .fill(color)
                        .frame(width: 3, height: 36)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(title)
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(sub)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                    Spacer(minLength: 0)
                    Text("›")
                        .font(.system(size: DT.fontPageTitle, weight: .light))
                        .foregroundStyle(DT.textTertiary)
                }
            }
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    ReviewView()
}