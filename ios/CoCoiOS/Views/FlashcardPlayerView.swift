import SwiftUI

/// 闪卡学习页 (B-12/B-13 1:1)：顶部 back + 进度 + 已掌握 + 三横线 menu
/// + 红顶 2px 闪卡（数据库/分类 tag + 10/1502 右上 + 中央大字 Index/Transaction
/// + タップして裏面を見る pill + 双底部 outline 按钮 (未记住红 / 已记住绿)
struct FlashcardPlayerView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var progress: Int = 10
    @State private var total: Int = 1502
    @State private var mastered: Int = 7
    @State private var showingAnswer: Bool = false
    @State private var dragOffset: CGFloat = 0
    @State private var dragRotation: CGFloat = 0

    private let swipeThreshold: CGFloat = 80

    private let categoryTag: String = "数据库"
    private let terms: [String] = ["Index", "Transaction", "Normalisation", "Isolation", "Constraint"]

    private var currentTerm: String {
        let i = max(0, min(progress - 1, terms.count - 1))
        return terms[i]
    }

    var body: some View {
        VStack(spacing: 0) {
            navBar
            progressSection
            Spacer().frame(height: DT.space3)
            flashCard
            Spacer()
            actionRow
        }
        .padding(.bottom, DT.space3)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
    }

    // MARK: - navBar
    private var navBar: some View {
        HStack {
            Button(action: { dismiss() }) {
                Text("‹").font(.system(size: 28, weight: .light))
                    .foregroundStyle(DT.textSecondary)
                    .frame(width: 44, height: 44)
            }
            Spacer()
        }
        .padding(.horizontal, DT.space2)
    }

    // MARK: - 进度区
    private var progressSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 0) {
                    Text("进度")
                        .font(.system(size: DT.fontLabel)).tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(progress)")
                            .font(.system(size: DT.fontMasthead, weight: .semibold))
                            .foregroundStyle(DT.ink)
                            .monospacedDigit()
                        Text("\(total)")
                            .font(.system(size: 32, weight: .semibold))
                            .foregroundStyle(DT.textSecondary)
                            .monospacedDigit()
                    }
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 0) {
                    Text("已掌握")
                        .font(.system(size: DT.fontLabel)).tracking(2)
                        .foregroundStyle(DT.textTertiary)
                    Text("\(mastered)")
                        .font(.system(size: DT.fontMasthead, weight: .semibold))
                        .foregroundStyle(DT.primary)
                        .monospacedDigit()
                }
                .padding(.trailing, DT.space1)
                Button(action: {}) {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(DT.textSecondary)
                        .frame(width: 32, height: 32)
                        .background(DT.surface)
                        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, DT.space3)

            // 极细蓝进度条 (1px 高)
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle().fill(DT.line).frame(height: 2)
                    Rectangle()
                        .fill(DT.primary)
                        .frame(width: max(2, geo.size.width * CGFloat(progress) / CGFloat(total)), height: 2)
                }
            }
            .frame(height: 2)
            .padding(.horizontal, DT.space3)
            .padding(.top, 4)
        }
    }

    // MARK: - 闪卡 (B-12 红顶 + 数据库/分类 tag + 10/1502 meta + 中央大字 Index/Transaction + タップして裏面を見る pill)
    private var flashCard: some View {
        VStack(spacing: 0) {
            Rectangle().fill(DT.editorial).frame(height: 2)
            VStack(spacing: DT.space3) {
                HStack(alignment: .top) {
                    Text(categoryTag)
                        .font(.system(size: DT.fontCaption, weight: .semibold))
                        .padding(.horizontal, 10).padding(.vertical, 4)
                        .background(DT.surfaceMuted)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous)
                                .stroke(DT.line, lineWidth: 0.5)
                        )
                    Spacer()
                    Text("\(progress)/\(total)")
                        .font(.system(size: DT.fontCaption, weight: .medium))
                        .foregroundStyle(DT.textTertiary)
                        .padding(.horizontal, 10).padding(.vertical, 4)
                        .background(DT.surfaceMuted)
                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusSm, style: .continuous))
                }
                .padding(.top, DT.space3)
                .padding(.horizontal, DT.space3)

                Spacer().frame(height: DT.space3)

                Text(currentTerm)
                    .font(.system(size: 48, weight: .bold))
                    .tracking(-0.5)
                    .foregroundStyle(DT.ink)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)

                Spacer().frame(height: DT.space4)

                if showingAnswer {
                    Text(meaningCN)
                        .font(.system(size: DT.fontBody, weight: .medium))
                        .foregroundStyle(DT.textSecondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(3)
                        .padding(.horizontal, DT.space3)
                } else {
                    Text("タップして裏面を見る")
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textTertiary)
                        .padding(.horizontal, 12).padding(.vertical, 6)
                        .background(DT.surfaceMuted)
                        .clipShape(Capsule())
                }

                Spacer().frame(height: DT.space3)
            }
            .frame(maxWidth: .infinity)
            .background(DT.surface)
        }
        .clipShape(RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DT.radiusXl, style: .continuous)
                .stroke(DT.line, lineWidth: 0.5)
        )
        .padding(.horizontal, DT.space3)
        .offset(x: dragOffset)
        .rotationEffect(.degrees(dragRotation))
        .gesture(
            DragGesture()
                .onChanged { value in
                    dragOffset = value.translation.width
                    dragRotation = Double(value.translation.width / 24)
                }
                .onEnded { value in
                    let translation = value.translation.width
                    if abs(translation) > swipeThreshold {
                        let mastered = translation < 0 ? false : true
                        withAnimation(.spring(response: 0.25, dampingFraction: 0.7)) {
                            dragOffset = translation > 0 ? 500 : -500
                            dragRotation = translation > 0 ? 15 : -15
                        }
                        nextCard(mastered: mastered)
                        resetDrag()
                    } else {
                        withAnimation(.spring(response: 0.25, dampingFraction: 0.7)) {
                            resetDrag()
                        }
                    }
                }
        )
        .frame(maxHeight: .infinity)
        .onTapGesture {
            withAnimation { showingAnswer.toggle() }
        }
    }

    private func resetDrag() {
        dragOffset = 0
        dragRotation = 0
    }

    private var meaningCN: String {
        switch currentTerm {
        case "Index":
            return "索引 — 数据库中对数据建立快速查找的数据结构，类似书的目录，能显著加速 WHERE 查询，但会增加写入开销。"
        case "Transaction":
            return "事务 — 数据库执行的逻辑工作单元，要么全部成功（COMMIT）要么全部失败回滚（ROLLBACK），遵循 ACID 特性。"
        case "Normalisation":
            return "规范化 — 通过函数依赖分析把表拆分以减少冗余、避免更新异常，常见范式：1NF/2NF/3NF/BCNF。"
        case "Isolation":
            return "隔离性 — 事务并发执行时彼此不互相干扰的强度等级；SQL 标准定义 READ UNCOMMITTED / COMMITTED / REPEATABLE READ / SERIALIZABLE 四级。"
        default:
            return "数据库术语释义。"
        }
    }

    // MARK: - 双底部 outline 按钮
    private var actionRow: some View {
        HStack(spacing: DT.space2) {
            Button(action: { nextCard(mastered: false) }) {
                HStack(spacing: 6) {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .semibold))
                    Text("未记住")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(DT.danger)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(DT.surface)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(DT.danger, lineWidth: 1))
            }
            .buttonStyle(.plain)

            Button(action: { nextCard(mastered: true) }) {
                HStack(spacing: 6) {
                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .semibold))
                    Text("已记住")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                }
                .foregroundStyle(DT.success)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(DT.surface)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(DT.success, lineWidth: 1))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, DT.space3)
        .padding(.top, DT.space3)
    }

    private func nextCard(mastered: Bool) {
        withAnimation {
            progress += 1
            if mastered { self.mastered += 1 }
            showingAnswer = false
        }
    }
}

#Preview {
    FlashcardPlayerView()
}
