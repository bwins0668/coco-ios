import SwiftUI

struct QPCard<Content: View>: View {
    let content: Content
    let backgroundColor: Color
    let cornerRadius: CGFloat
    let borderColor: Color
    let borderWidth: CGFloat
    let padding: CGFloat

    init(
        backgroundColor: Color = DesignTokens.surface,
        cornerRadius: CGFloat = DesignTokens.radiusLarge,
        borderColor: Color = DesignTokens.line,
        borderWidth: CGFloat = DesignTokens.borderWidth,
        padding: CGFloat = DesignTokens.space2,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.backgroundColor = backgroundColor
        self.cornerRadius = cornerRadius
        self.borderColor = borderColor
        self.borderWidth = borderWidth
        self.padding = padding
    }

    var body: some View {
        content
            .padding(padding)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
    }
}
