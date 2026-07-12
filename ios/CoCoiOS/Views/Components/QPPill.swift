import SwiftUI

struct QPPill: View {
    let text: String
    let backgroundColor: Color
    let foregroundColor: Color

    init(
        _ text: String,
        backgroundColor: Color = DesignTokens.fillWarm,
        foregroundColor: Color = DesignTokens.textTertiary
    ) {
        self.text = text
        self.backgroundColor = backgroundColor
        self.foregroundColor = foregroundColor
    }

    var body: some View {
        Text(text)
            .font(.system(size: DesignTokens.fontLabel))
            .padding(.horizontal, DesignTokens.space2)
            .padding(.vertical, 2)
            .background(backgroundColor)
            .foregroundStyle(foregroundColor)
            .clipShape(Capsule())
    }
}
