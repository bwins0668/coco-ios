import SwiftUI

struct QPButton: ButtonStyle {
    let variant: Variant
    let size: ControlSize

    enum Variant {
        case primary, secondary, outline, ghost
    }

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: fontSize, weight: .semibold))
            .frame(maxWidth: .infinity)
            .frame(height: height)
            .background(background(configuration.isPressed))
            .foregroundStyle(foreground)
            .clipShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0, anchor: .center)
            .animation(.easeInOut(duration: 0.12), value: configuration.isPressed)
    }

    private var fontSize: CGFloat {
        switch size {
        case .small: return DesignTokens.fontCaption
        default: return DesignTokens.fontBody
        }
    }

    private var height: CGFloat {
        size == .small ? 52 : DesignTokens.space5 * 2
    }

    @ViewBuilder
    private func background(_ isPressed: Bool) -> some View {
        switch variant {
        case .primary:
            Rectangle()
                .fill(isPressed ? DesignTokens.primaryPressed : DesignTokens.primary)
        case .secondary:
            Rectangle()
                .fill(DesignTokens.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: DesignTokens.radiusMedium)
                        .stroke(DesignTokens.lineStrong, lineWidth: DesignTokens.borderWidth)
                )
        case .outline:
            Rectangle()
                .fill(DesignTokens.surface)
        case .ghost:
            Rectangle()
                .fill(Color.clear)
        }
    }

    private var foreground: Color {
        switch variant {
        case .primary: return DesignTokens.surface
        case .secondary: return DesignTokens.ink
        case .outline: return DesignTokens.ink
        case .ghost: return DesignTokens.textSecondary
        }
    }
}
extension Color {
    var hex: String {
        let components = UIColor(self).cgColor.components ?? [0, 0, 0, 0]
        let r = Int(components[0] * 255)
        let g = Int(components[1] * 255)
        let b = Int(components[2] * 255)
        return String(format: "%02X%02X%02X", r, g, b)
    }
}
