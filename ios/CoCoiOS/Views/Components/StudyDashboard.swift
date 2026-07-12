import SwiftUI

/// 学习数据可视化：连续天数 + 最近 7 天答题柱状图
struct StudyDashboard: View {
    @Environment(\.modelContext) private var ctx
    @State private var streak: Int = 0
    @State private var weeklyAnswered: [Int] = Array(repeating: 0, count: 7)
    @State private var weeklyCorrect: [Int] = Array(repeating: 0, count: 7)
    @State private var weekLabels: [String] = []

    private let maxValue: Int = 0  // 计算属性

    var body: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("连续学习")
                            .font(.system(size: DT.fontLabel)).tracking(2)
                            .foregroundStyle(DT.textTertiary)
                        HStack(alignment: .firstTextBaseline, spacing: 4) {
                            Text("\(streak)")
                                .font(.system(size: DT.fontDisplay, weight: .semibold))
                                .foregroundStyle(DT.editorial)
                            Text("天")
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("本周答题")
                            .font(.system(size: DT.fontLabel)).tracking(2)
                            .foregroundStyle(DT.textTertiary)
                        Text("\(weeklyAnswered.reduce(0, +))")
                            .font(.system(size: DT.fontSectionTitle, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        let c = weeklyCorrect.reduce(0, +)
                        let t = weeklyAnswered.reduce(0, +)
                        Text(t > 0 ? "正确率 \(Int(round(Double(c) / Double(t) * 100)))%" : "无数据")
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textSecondary)
                    }
                }

                HStack(alignment: .bottom, spacing: 8) {
                    let total = max(1, weeklyAnswered.max() ?? 1)
                    ForEach(0..<7, id: \.self) { idx in
                        VStack(spacing: 4) {
                            ZStack(alignment: .bottom) {
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(DT.fillWarm)
                                    .frame(width: 16, height: 60)
                                let h = max(2, CGFloat(weeklyAnswered[idx]) / CGFloat(total) * 60)
                                VStack(spacing: 0) {
                                    Spacer()
                                    RoundedRectangle(cornerRadius: 3)
                                        .fill(DT.editorial)
                                        .frame(width: 16, height: h)
                                }
                                .frame(height: 60)
                            }
                            Text(weekLabels.indices.contains(idx) ? weekLabels[idx] : "")
                                .font(.system(size: 9))
                                .foregroundStyle(DT.textTertiary)
                        }
                    }
                }
                .frame(height: 76)
                .padding(.top, 4)
            }
        }
        .padding(.horizontal, DT.space3)
        .onAppear { reload() }
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        streak = Storage.shared.getStreakCount()

        var cal = Calendar.current
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo") ?? .current
        let dayFmt = DateFormatter()
        dayFmt.dateFormat = "yyyy-MM-dd"
        dayFmt.timeZone = cal.timeZone
        let labelFmt = DateFormatter()
        labelFmt.dateFormat = "M/d"
        labelFmt.timeZone = cal.timeZone

        var answered: [Int] = []
        var correct: [Int] = []
        var labels: [String] = []
        for offset in (0..<7).reversed() {
            let d = cal.date(byAdding: .day, value: -offset, to: Date()) ?? Date()
            let key = dayFmt.string(from: d)
            labels.append(labelFmt.string(from: d))
            let descriptor = FetchDescriptor<StudyStat>(predicate: #Predicate { $0.date == key })
            if let s = (try? ctx.fetch(descriptor))?.first {
                answered.append(s.answered)
                correct.append(s.correct)
            } else {
                answered.append(0)
                correct.append(0)
            }
        }
        self.weeklyAnswered = answered
        self.weeklyCorrect = correct
        self.weekLabels = labels
    }
}

#Preview {
    StudyDashboard()
}