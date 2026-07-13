import Foundation

struct WidgetDataBridge {
    struct Snapshot {
        var streak: Int = 0
        var todayTotal: Int = 0
        var accuracy: Int = 0
        var favoriteCount: Int = 0
        var lastExamLabel: String = ""
        var lastMetaText: String = ""
    }

    @discardableResult
    static func readSnapshot() -> Snapshot? {
        let groupDefaultsName = "group.com.coco.ios"
        guard let defaults = UserDefaults(suiteName: groupDefaultsName) else { return nil }
        let snap = Snapshot(
            streak: defaults.integer(forKey: "widget_streak"),
            todayTotal: defaults.integer(forKey: "widget_today_total"),
            accuracy: defaults.integer(forKey: "widget_accuracy"),
            favoriteCount: defaults.integer(forKey: "widget_favorite_count"),
            lastExamLabel: defaults.string(forKey: "widget_last_exam_label") ?? "",
            lastMetaText: defaults.string(forKey: "widget_last_meta_text") ?? ""
        )
        return snap.streak == 0 && snap.todayTotal == 0 && snap.accuracy == 0 && snap.favoriteCount == 0 && snap.lastExamLabel.isEmpty && snap.lastMetaText.isEmpty ? nil : snap
    }

    static func write(_ snap: Snapshot) {
        let groupDefaultsName = "group.com.coco.ios"
        guard let defaults = UserDefaults(suiteName: groupDefaultsName) else { return }
        defaults.set(snap.streak, forKey: "widget_streak")
        defaults.set(snap.todayTotal, forKey: "widget_today_total")
        defaults.set(snap.accuracy, forKey: "widget_accuracy")
        defaults.set(snap.favoriteCount, forKey: "widget_favorite_count")
        defaults.set(snap.lastExamLabel, forKey: "widget_last_exam_label")
        defaults.set(snap.lastMetaText, forKey: "widget_last_meta_text")
    }
}
