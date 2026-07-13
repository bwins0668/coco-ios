import SwiftUI
import Foundation

/// 小程序 Quiet Paper / UI Freeze v1.0 设计令牌 —— SwiftUI 1:1 落地版本
/// 暗色模式：跟随系统自动切换色板
enum DT {
    // MARK: - Colors (Light + Dark variants)
    static let canvas = Color(light: hex("F2EEE3"), dark: hex("1A1814"))
    static let surface = Color(light: hex("FFFDF5"), dark: hex("23211D"))
    static let surfaceMuted = Color(light: hex("F4F3EF"), dark: hex("2A2823"))
    static let fillWarm = Color(light: hex("EBE5D2"), dark: hex("3D3528"))

    static let ink = Color(light: hex("1F1E1B"), dark: hex("EDE6DA"))
    static let textSecondary = Color(light: hex("5A564E"), dark: hex("C9C4BD"))
    static let textTertiary = Color(light: hex("9C978B"), dark: hex("9F958A"))
    static let textGhost = Color(light: hex("C8C4B7"), dark: hex("6F6A60"))
    static let textPhantom = Color(light: hex("D8CEB8"), dark: hex("5A554D"))

    static let line = Color(light: hexAny("332F28", 0.10), dark: hexAny("EDE6DA", 0.12))
    static let lineStrong = Color(light: hexAny("332F28", 0.18), dark: hexAny("EDE6DA", 0.20))

    // R8: 加深主蓝以对齐设计图 (#1E2980)
    static let primary = Color(light: hex("1E2980"), dark: hex("9FA7E5"))
    static let primaryPressed = Color(light: hex("161E66"), dark: hex("B6BCEA"))
    static let primarySoft = Color(light: hex("E4E9F5"), dark: hex("2A2D44"))
    static let editorial = Color(light: hex("BC2D2D"), dark: hex("FF7A92"))

    static let success = Color(light: hex("2F7D52"), dark: hex("7DBB8B"))
    static let successSoft = Color(light: hex("DDEAE1"), dark: hex("1F2A24"))
    static let danger = Color(light: hex("D34743"), dark: hex("E58681"))
    static let dangerSoft = Color(light: hex("FBE6E5"), dark: hex("2D1F1E"))
    static let warningSoft = Color(light: hex("FBF1E9"), dark: hex("2D2418"))

    // R8: 课程专属色标 (设计图 Java/Python/SQL/Alg)
    static let javaAccent = Color(light: hex("2D64B3"), dark: hex("6F95D6"))
    static let javaBg = Color(light: hex("E4ECF8"), dark: hex("1F2A3D"))
    static let pythonAccent = Color(light: hex("A3743B"), dark: hex("C49463"))
    static let pythonBg = Color(light: hex("F6EFE1"), dark: hex("2D2418"))
    static let sqlAccent = Color(light: hex("2D64B3"), dark: hex("6F95D6"))
    static let sqlBg = Color(light: hex("E4ECF8"), dark: hex("1F2A3D"))

    static let disabledBg = Color(light: hexAny("332F28", 0.06), dark: hexAny("EDE6DA", 0.10))
    static let disabledText = Color(light: hex("C8C4B7"), dark: hex("6F6A60"))

    // Course aliases（保留兼容 + 改深主蓝 / 改 Java/Python 调色）
    static let itpassColor = primary
    static let sgColor = Color(light: hex("4A7C59"), dark: hex("7DBB8B"))
    static let javaColor = javaAccent
    static let pythonColor = pythonAccent
    static let sqlColor = sqlAccent
    static let mistakeColor = danger
    static let ankiColor = success
    static let profileColor = textSecondary

    // MARK: - Theme aliases
    static let card = surface
    static let accent = primary
    static let correct = success
    static let wrong = danger
    static let bgCanvas = canvas

    // MARK: - Typography
    static let fontLabel: CGFloat = 11
    static let fontCaption: CGFloat = 13
    static let fontBody: CGFloat = 15
    static let fontMd: CGFloat = 14
    static let fontSectionTitle: CGFloat = 17
    static let fontPageTitle: CGFloat = 28
    static let fontDisplay: CGFloat = 40
    static let fontMasthead: CGFloat = 34

    static let fontWeightRegular: CGFloat = 400
    static let fontWeightSemibold: CGFloat = 600

    // MARK: - Spacing
    static let space1: CGFloat = 8
    static let space2: CGFloat = 16
    static let space3: CGFloat = 24
    static let space4: CGFloat = 32
    static let space5: CGFloat = 40
    static let space6: CGFloat = 48

    // MARK: - Shape
    static let radiusTag: CGFloat = 5
    static let radiusSm: CGFloat = 10
    static let radiusMd: CGFloat = 12
    static let radiusLg: CGFloat = 16
    static let radiusXl: CGFloat = 20
    static let radiusFull: CGFloat = 999

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

// 旧版 QuizView 兼容
typealias Theme = DT

// MARK: - Color hex initializer + light/dark variants
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

    /// 自动跟随系统的暗色 / 浅色 双套色板
    init(light: Color, dark: Color) {
        #if os(iOS) || os(tvOS) || os(watchOS) || os(macOS)
        self.init(uiColor: UIColor { trait in
            trait.userInterfaceStyle == .dark ? UIColor(dark) : UIColor(light)
        })
        #else
        self = light
        #endif
    }
}

// MARK: - hex helpers (for use in DT static initializers)
private func hex(_ s: String) -> Color { Color(hex: s) }
private func hexAny(_ s: String, _ alpha: Double) -> Color { Color(hex: s).opacity(alpha) }