import Foundation
import SwiftUI

enum DesignTokens {
    // MARK: - Colors (Quiet Paper / UI Freeze v1.0)
    static let canvas = Color(hex: "F2EDE0")
    static let surface = Color(hex: "FFFDF5")
    static let surfaceMuted = Color(hex: "F4F3EF")
    static let fillWarm = Color(hex: "E8DFC8")

    static let ink = Color(hex: "1A1410")
    static let textSecondary = Color(hex: "6F6B65")
    static let textTertiary = Color(hex: "8A7060")
    static let textQuaternary = Color(hex: "8A8680")
    static let textGhost = Color(hex: "C9C4BD")

    static let line = Color(hex: "332F28").opacity(0.08)
    static let lineStrong = Color(hex: "332F28").opacity(0.14)

    static let primary = Color(hex: "37418A")
    static let primaryPressed = Color(hex: "2C3676")
    static let primarySoft = Color(hex: "ECEEF6")
    static let editorial = Color(hex: "C5123A")

    static let success = Color(hex: "4E8A5E")
    static let successSoft = Color(hex: "EAF1EC")
    static let danger = Color(hex: "BE5750")
    static let dangerSoft = Color(hex: "F7ECEB")
    static let warningSoft = Color(hex: "FBF1E9")

    static let disabledBg = Color(hex: "332F28").opacity(0.10)
    static let disabledText = Color(hex: "C9C4BD")

    // MARK: - Course colors
    static let courseItpass = Color(hex: "2D64B3")
    static let courseSG = Color(hex: "4A7C59")
    static let courseJava = Color(hex: "E76F00")
    static let coursePython = Color(hex: "3776AB")
    static let courseSQL = Color(hex: "336791")

    // MARK: - Typography
    static let fontMasthead: CGFloat = 34
    static let fontDisplay: CGFloat = 40
    static let fontPageTitle: CGFloat = 28
    static let fontSectionTitle: CGFloat = 17
    static let fontBody: CGFloat = 15
    static let fontCaption: CGFloat = 13
    static let fontLabel: CGFloat = 11

    static let fontWeightRegular: CGFloat = 400
    static let fontWeightSemibold: CGFloat = 600

    // MARK: - Spacing
    static let space1: CGFloat = 8
    static let space2: CGFloat = 16
    static let space3: CGFloat = 24
    static let space4: CGFloat = 32
    static let space5: CGFloat = 40
    static let space6: CGFloat = 48
    static let space8: CGFloat = 64

    // MARK: - Shape
    static let radiusTag: CGFloat = 10
    static let radiusSmall: CGFloat = 20
    static let radiusMedium: CGFloat = 24
    static let radiusLarge: CGFloat = 32
    static let borderWidth: CGFloat = 2
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
            r = (int >> 16) & 0xF * 17
            g = (int >> 8) & 0xF * 17
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
