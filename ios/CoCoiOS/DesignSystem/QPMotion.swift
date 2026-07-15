import SwiftUI

/// R10 · UI 动效增强层 —— 全局动效常量与修饰符
enum Motion {
    /// 卡片 / 按钮按压 弹回
    static let pressSpring = Animation.spring(response: 0.32, dampingFraction: 0.72, blendDuration: 0.05)
    /// 内容入场 / settle
    static let settleSpring = Animation.spring(response: 0.45, dampingFraction: 0.78, blendDuration: 0.08)
    /// 页面间 transition
    static let pageSpring = Animation.spring(response: 0.42, dampingFraction: 0.86, blendDuration: 0.1)

    /// 数字滚动
    static let numeric = Animation.interpolatingSpring(stiffness: 70, damping: 12)

    /// 闪烁（错误 / 成功高亮）
    static let flash = Animation.easeInOut(duration: 0.18)
}

/// 按压缩放修饰符（按压时缩到 0.97，松手回弹）
struct PressableCard: ViewModifier {
    let scale: CGFloat
    @State private var pressed = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(pressed ? scale : 1.0)
            .animation(Motion.pressSpring, value: pressed)
            .simultaneousGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in if !pressed { pressed = true } }
                    .onEnded { _ in if pressed { pressed = false } }
            )
    }
}

extension View {
    /// 卡片按压时缩到指定比例（默认 0.97），松手回弹
    func pressableCard(scale: CGFloat = 0.97) -> some View {
        modifier(PressableCard(scale: scale))
    }
}

/// 数字滚动（绑定 Int 状态变化时使用 numericText contentTransition）
struct NumericRollText: View {
    let value: Int
    let font: Font
    let color: Color

    var body: some View {
        Text("\(value)")
            .font(font)
            .foregroundStyle(color)
            .contentTransition(.numericText())
            .animation(Motion.numeric, value: value)
    }
}

/// 列表项 stagger 出现（onAppear 时透明度 0->1 + Y 8->0）
struct AppearDelay: ViewModifier {
    let delay: Double
    @State private var appeared = false

    func body(content: Content) -> some View {
        content
            .opacity(appeared ? 1 : 0)
            .offset(y: appeared ? 0 : 8)
            .animation(Motion.settleSpring.delay(delay), value: appeared)
            .onAppear { appeared = true }
    }
}

extension View {
    /// 列表项 stagger 入场（带延迟秒数）
    func appearDelay(_ delay: Double) -> some View {
        modifier(AppearDelay(delay: delay))
    }
}

/// shake 动画的 GeometryEffect 实现（sin 周期振荡 + animatable 驱动）
private struct Shake: GeometryEffect {
    var amount: CGFloat = 8
    var shakesPerUnit: CGFloat = 3
    var animatableData: CGFloat

    func effectValue(size: CGSize) -> ProjectionTransform {
        let translation = amount * sin(animatableData * .pi * shakesPerUnit)
        return ProjectionTransform(CGAffineTransform(translationX: translation, y: 0))
    }
}

struct ShakeOnChange: ViewModifier {
    let trigger: Bool
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .modifier(Shake(animatableData: phase))
            .onChange(of: trigger) { _, newValue in
                if newValue {
                    withAnimation(.linear(duration: 0.45)) { phase += 1 }
                }
            }
    }
}

extension View {
    /// trigger 从 false 变 true 时左右抖动一次
    func shakeOnChange(trigger: Bool) -> some View {
        modifier(ShakeOnChange(trigger: trigger))
    }
}

/// 转场淡入（push 视图层叠淡入）—— iOS 17+ 可用，避开 .navigationTransition(.slide)
struct FadeInTransition: ViewModifier {
    @State private var appeared = false
    func body(content: Content) -> some View {
        content
            .opacity(appeared ? 1 : 0)
            .scaleEffect(appeared ? 1 : 0.985)
            .animation(Motion.pageSpring, value: appeared)
            .onAppear { appeared = true }
    }
}

extension View {
    /// 首次出现淡入 + 微缩放
    func fadeInOnAppear() -> some View {
        modifier(FadeInTransition())
    }
}
