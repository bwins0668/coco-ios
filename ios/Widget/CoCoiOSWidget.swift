import WidgetKit
import SwiftUI
import SwiftData

struct SimpleEntry: TimelineEntry {
    let date: Date
    let streak: Int
    let todayTotal: Int
    let accuracy: Int
    let favoriteCount: Int
    let lastExamLabel: String
    let lastMetaText: String
}

struct CoCoiOSWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "CoCoiOSHome", provider: Provider()) { entry in
            CoCoiOSWidgetEntry(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("CoCo Study")
        .description("Show study summary snapshot.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry(date: Date(), streak: 0, todayTotal: 0, accuracy: 0, favoriteCount: 0, lastExamLabel: "", lastMetaText: "")
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) { completion(current()) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let timeline = Timeline(entries: [current()], policy: .after(Date().addingTimeInterval(300)))
        completion(timeline)
    }

    private func current() -> SimpleEntry {
        #if os(iOS)
        let snap = WidgetDataBridge.readSnapshot() ?? WidgetDataBridge.Snapshot()
        return SimpleEntry(date: Date(), streak: snap.streak, todayTotal: snap.todayTotal, accuracy: snap.accuracy, favoriteCount: snap.favoriteCount, lastExamLabel: snap.lastExamLabel, lastMetaText: snap.lastMetaText)
        #else
        return SimpleEntry(date: Date(), streak: 0, todayTotal: 0, accuracy: 0, favoriteCount: 0, lastExamLabel: "", lastMetaText: "")
        #endif
    }
}

struct CoCoiOSWidgetEntry: View {
    let entry: SimpleEntry
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .firstTextBaseline) {
                Text("CoCo 学习")
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                Spacer()
                Text("今日 \(entry.todayTotal)")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundStyle(.secondary)
            }
            Divider()
            HStack(alignment: .firstTextBaseline, spacing: 6) {
                Text("连续 \(entry.streak) 天")
                Spacer()
                Text("正确率 \(entry.accuracy)%")
            }
            .font(.system(size: 12, weight: .medium, design: .rounded))
            if !entry.lastExamLabel.isEmpty {
                Text("\(entry.lastExamLabel)\(entry.lastMetaText.isEmpty ? "" : " · \(entry.lastMetaText)")")
                    .font(.system(size: 11, weight: .regular, design: .rounded))
                    .foregroundStyle(.secondary)
            }
        }
        .padding(10)
    }
}

#Preview(as: .systemSmall) {
    CoCoiOSWidget()
} timeline: {
    SimpleEntry(date: Date(), streak: 12, todayTotal: 5, accuracy: 78, favoriteCount: 3, lastExamLabel: "IT Passport", lastMetaText: "10秒前")
}
