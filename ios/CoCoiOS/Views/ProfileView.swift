import SwiftUI

/// 我的页：学习数据 + 分类正确率 + 数据与设置
/// 1:1 复刻小程序 pages/profile/profile.wxml (R6.5 DC-authoritative)
struct ProfileView: View {
    @State private var totalAttempts: Int = 0
    @State private var accuracy: Int = 0
    @State private var wrongQuestionCount: Int = 0
    @State private var favoriteCount: Int = 0
    @State private var itpassAccuracy: Int = 0
    @State private var sgAccuracy: Int = 0

    var isNewUser: Bool { totalAttempts == 0 }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    section01
                    section02
                    section03
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
        QPMasthead(kicker: "PROFILE · 我的", title: "我的", rightText: DT.jstDateString())
    }

    private var section01: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "学习数据")
            statStrip
            favoriteRow
        }
    }

    private var statStrip: some View {
        HStack(alignment: .center, spacing: 0) {
            statBox(value: "\(totalAttempts)", label: "总答题", color: DT.ink)
            divider
            statBox(value: "\(accuracy)%", label: "正确率", color: DT.success)
            divider
            statBox(value: "\(wrongQuestionCount)", label: "错题", color: DT.danger)
        }
        .padding(.vertical, DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private func statBox(value: String, label: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(color)
            Text(label)
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textTertiary)
        }
        .frame(maxWidth: .infinity)
    }

    private var divider: some View {
        Rectangle()
            .fill(DT.line)
            .frame(width: 0.5, height: 36)
    }

    private var favoriteRow: some View {
        HStack {
            Text("已收藏术语")
                .font(.system(size: DT.fontBody))
                .foregroundStyle(DT.ink)
            Spacer()
            Text("\(favoriteCount)")
                .font(.system(size: DT.fontBody, weight: .semibold))
                .foregroundStyle(DT.textSecondary)
        }
        .padding(.horizontal, DT.space2)
        .padding(.vertical, DT.space2)
        .background(DT.surface)
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
    }

    @ViewBuilder
    private var section02: some View {
        if isNewUser {
            VStack(alignment: .leading, spacing: DT.space1) {
                QPCard {
                    VStack(alignment: .leading, spacing: DT.space1) {
                        Text("还没有练习记录")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text("从首页选择 IT Passport 或 SG 方向开始练习，也可以先浏览术语表了解考试词汇。遇到重要术语可以先收藏，答错的题目会自动收录到错题本。")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                }
                .padding(.horizontal, DT.space3)
            }
        }
    }

    private var section03: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("02", "分类正确率")
            VStack(spacing: 0) {
                accuracyRow(label: "IT Passport", value: itpassAccuracy, color: DT.success)
                Rectangle().fill(DT.line).frame(height: 0.5).padding(.horizontal, DT.space2)
                accuracyRow(label: "SG", value: sgAccuracy, color: DT.primary)
            }
            .background(DT.surface)
            .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous)
                    .stroke(DT.line, lineWidth: 0.5)
            )
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func accuracyRow(label: String, value: Int, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(label)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                Spacer()
                Text("\(value)%")
                    .font(.system(size: DT.fontCaption, weight: .medium))
                    .foregroundStyle(color)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(DT.fillWarm)
                        .frame(height: 4)
                    Rectangle()
                        .fill(color)
                        .frame(width: max(2, geo.size.width * CGFloat(value) / 100), height: 4)
                }
            }
            .frame(height: 4)
        }
        .padding(.horizontal, DT.space2)
        .padding(.vertical, DT.space2)
    }
}

#Preview {
    ProfileView()
}