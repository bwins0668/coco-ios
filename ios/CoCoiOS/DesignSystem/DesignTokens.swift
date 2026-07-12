import SwiftUI
import Foundation

/// 小程序 Quiet Paper / UI Freeze v1.0 设计令牌 —— SwiftUI 1:1 落地版本
enum DT {
    static let Theme = DT.self
    // MARK: - Colors
    static let canvas = Color(hex: "F2EDE0")              // 页面背景
    static let surface = Color(hex: "FFFDF5")             // 卡片背景
    static let surfaceMuted = Color(hex: "F4F3EF")        // 次级表面
    static let fillWarm = Color(hex: "E8DFC8")            // 暖色填充 / 准备中胶囊

    static let ink = Color(hex: "1A1410")                 // 主文字
    static let textSecondary = Color(hex: "6F6B65")       // 次级文字
    static let textTertiary = Color(hex: "8A7060")        // 三阶文字
    static let textQuaternary = Color(hex: "8A8680")
    static let textGhost = Color(hex: "C9C4BD")
    static let textPhantom = Color(hex: "D8CEB8")

    static let line = Color(hex: "332F28").opacity(0.08)  // 分隔线
    static let lineStrong = Color(hex: "332F28").opacity(0.14)

    static let primary = Color(hex: "37418A")              // 主色 / 课程
    static let primaryPressed = Color(hex: "2C3676")
    static let primarySoft = Color(hex: "ECEEF6")
    static let editorial = Color(hex: "C5123A")           // 重点强调红

    static let success = Color(hex: "4E8A5E")             // 已掌握 / 正确
    static let successSoft = Color(hex: "EAF1EC")
    static let danger = Color(hex: "BE5750")              // 错误 / 未记住
    static let dangerSoft = Color(hex: "F7ECEB")
    static let warningSoft = Color(hex: "FBF1E9")

    static let disabledBg = Color(hex: "332F28").opacity(0.10)
    static let disabledText = Color(hex: "C9C4BD")

    // MARK: - Theme aliases (compat with legacy QuizView)
    static let card = surface
    static let accent = primary
    static let correct = success
    static let wrong = danger
    static let bgCanvas = canvas

    // MARK: - Course colors (与小程序保持一致)
    static let itpassColor = Color(hex: "516376")
    static let sgColor = Color(hex: "5d6672")
    static let javaColor = Color(hex: "516376")
    static let pythonColor = Color(hex: "5d6672")
    static let sqlColor = Color(hex: "5d6672")
    static let mistakeColor = Color(hex: "6b5960")
    static let ankiColor = Color(hex: "4a5563")
    static let profileColor = Color(hex: "555d67")

    // MARK: - Typography (rpx 设计，按 1rpx = 0.5pt 等比缩放)
    static let fontLabel: CGFloat = 11      // 22rpx
    static let fontCaption: CGFloat = 13    // 26rpx
    static let fontBody: CGFloat = 15       // 30rpx
    static let fontMd: CGFloat = 14         // 28rpx
    static let fontSectionTitle: CGFloat = 17  // 34rpx
    static let fontPageTitle: CGFloat = 28  // 56rpx
    static let fontDisplay: CGFloat = 40    // 80rpx
    static let fontMasthead: CGFloat = 34   // 68rpx

    static let fontWeightRegular: CGFloat = 400
    static let fontWeightSemibold: CGFloat = 600

    // MARK: - Spacing (4pt / 8pt grid)
    static let space1: CGFloat = 8
    static let space2: CGFloat = 16
    static let space3: CGFloat = 24
    static let space4: CGFloat = 32
    static let space5: CGFloat = 40
    static let space6: CGFloat = 48

    // MARK: - Shape
    static let radiusTag: CGFloat = 5        // 10rpx
    static let radiusSm: CGFloat = 10        // 20rpx
    static let radiusMd: CGFloat = 12        // 24rpx
    static let radiusLg: CGFloat = 16        // 32rpx
    static let radiusXl: CGFloat = 20        // 40rpx
    static let radiusFull: CGFloat = 999

    // MARK: - Date helpers
    static func jstDateString() -> String {
        let now = Date()
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "Asia/Tokyo") ?? .current
        let y = calendar.component(.year, from: now)
        let m = calendar.component(.month, from: now)
        let d = calendar.component(.day, from: now)
        if y >= 2019 {
            if y == 2019 && m < 5 { return "平成31年\(m)月\(d)日" }
            let reiwa = y - 2018
            return "令和\(reiwa)年\(m)月\(d)日"
        }
        if y >= 1989 {
            let heisei = y - 1988
            return "平成\(heisei)年\(m)月\(d)日"
        }
        return "\(y)年\(m)月\(d)日"
    }
}

// MARK: - Color hex initializer
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        var a: UInt64 = 0
        var r: UInt64 = 0
        var g: UInt64 = 0
        var b: UInt64 = 0
        switch hex.count {
        case 3:
            a = 255
            r = (int >> 8) & 0xF * 17
            g = (int >> 4) & 0xF * 17
            b = int & 0xF * 17
        case 6:
            a = 255
            r = int >> 16
            g = (int >> 8) & 0xFF
            b = int & 0xFF
        case 8:
            a = int >> 24
            r = int >> 16 & 0xFF
            g = int >> 8 & 0xFF
            b = int & 0xFF
        default:
            a = 255
            r = 1
            g = 1
            b = 0
        }
        self.init(
            .displayP3,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}