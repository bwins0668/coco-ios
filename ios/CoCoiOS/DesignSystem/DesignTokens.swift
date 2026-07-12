import SwiftUI

/// 暗色 / 浅色双套令牌 —— 跟随系统切换
enum DT {
    static let canvas = Color("qp_canvas", bundle: nil, light: hex("F2EDE0"), dark: hex("1A1814"))
    static let surface = Color("qp_surface", bundle: nil, light: hex("FFFDF5"), dark: hex("23211D"))
    static let surfaceMuted = Color("qp_surfaceMuted", bundle: nil, light: hex("F4F3EF"), dark: hex("2A2823"))
    static let fillWarm = Color("qp_fillWarm", bundle: nil, light: hex("E8DFC8"), dark: hex("3D3528"))

    static let ink = Color("qp_ink", bundle: nil, light: hex("1A1410"), dark: hex("EDE6DA"))
    static let textSecondary = Color("qp_textSecondary", bundle: nil, light: hex("6F6B65"), dark: hex("C9C4BD"))
    static let textTertiary = Color("qp_textTertiary", bundle: nil, light: hex("8A7060"), dark: hex("9F958A"))
    static let textGhost = Color("qp_textGhost", bundle: nil, light: hex("C9C4BD"), dark: hex("6F6A60"))
    static let textPhantom = Color("qp_textPhantom", bundle: nil, light: hex("D8CEB8"), dark: hex("5A554D"))

    static let line = Color("qp_line", bundle: nil, light: hexAny("332F28", 0.08), dark: hexAny("EDE6DA", 0.12))
    static let lineStrong = Color("qp_lineStrong", bundle: nil, light: hexAny("332F28", 0.14), dark: hexAny("EDE6DA", 0.20))

    static let primary = Color("qp_primary", bundle: nil, light: hex("37418A"), dark: hex("9FA7E5"))
    static let primaryPressed = Color("qp_primaryPressed", bundle: nil, light: hex("2C3676"), dark: hex("B6BCEA"))
    static let primarySoft = Color("qp_primarySoft", bundle: nil, light: hex("ECEEF6"), dark: hex("2A2D44"))
    static let editorial = Color("qp_editorial", bundle: nil, light: hex("C5123A"), dark: hex("FF7A92"))

    static let success = Color("qp_success", bundle: nil, light: hex("4E8A5E"), dark: hex("7DBB8B"))
    static let successSoft = Color("qp_successSoft", bundle: nil, light: hex("EAF1EC"), dark: hex("1F2A24"))
    static let danger = Color("qp_danger", bundle: nil, light: hex("BE5750"), dark: hex("E58681"))
    static let dangerSoft = Color("qp_dangerSoft", bundle: nil, light: hex("F7ECEB"), dark: hex("2D1F1E"))
    static let warningSoft = Color("qp_warningSoft", bundle: nil, light: hex("FBF1E9"), dark: hex("2D2418"))

    static let disabledBg = Color("qp_disabledBg", bundle: nil, light: hexAny("332F28", 0.10), dark: hexAny("EDE6DA", 0.10))
    static let disabledText = Color("qp_disabledText", bundle: nil, light: hex("C9C4BD"), dark: hex("5A554D"))

    static let itpassColor = Color("qp_itpass", bundle: nil, light: hex("516376"), dark: hex("7891AB"))
    static let sgColor = Color("qp_sg", bundle: nil, light: hex("5d6672"), dark: hex("8E97A3"))
    static let javaColor = Color("qp_java", bundle: nil, light: hex("516376"), dark: hex("7891AB"))
    static let pythonColor = Color("qp_python", bundle: nil, light: hex("5d6672"), dark: hex("8E97A3"))
    static let sqlColor = Color("qp_sql", bundle: nil, light: hex("5d6672"), dark: hex("8E97A3"))
    static let mistakeColor = Color("qp_mistake", bundle: nil, light: hex("6b5960"), dark: hex("A08891"))
    static let ankiColor = Color("qp_anki", bundle: nil, light: hex("4a5563"), dark: hex("8694A8"))
    static let profileColor = Color("qp_profile", bundle: nil, light: hex("555d67"), dark: hex("8C97A6"))

    static let card = surface
    static let accent = primary
    static let correct = success
    static let wrong = danger
    static let bgCanvas = canvas

    // Typography / spacing / shape / jstDateString / Theme 别名保留原状
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

    static let space1: CGFloat = 8
    static let space2: CGFloat = 16
    static let space3: CGFloat = 24
    static let space4: CGFloat = 32
    static let space5: CGFloat = 40
    static let space6: CGFloat = 48

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

extension Color {
    static func hex(_ s: String) -> Color {
        Color(hex: s)
    }
    static func hexAny(_ s: String, _ alpha: Double) -> Color {
        Color(hex: s).opacity(alpha)
    }
}