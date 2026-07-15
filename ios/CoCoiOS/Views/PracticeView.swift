import SwiftUI

/// 刷题页：1:1 复刻小程序 pages/practice/practice.wxml (R6.5 DC-aligned)
/// 关键视觉特征：
/// - Masthead: "DRILL · 刷题" kicker + "刷题" title + JST 日期
/// - Rule line: 24rpx primary accent bar + 1rpx ink line (opacity 0.72)
/// - Continue card: editorial (红) 顶部 5rpx accent border, "CONTINUE · 继续上次" kicker
/// - Section label: "01" + "选择考试" + meta count
/// - Exam cards: horizontal layout with chevron, primary exam = primary-soft bg + left 3rpx primary border
/// - Muted exam: opacity 0.55 + "准备中" badge instead of chevron
/// - Package chips: horizontal scroll, fillWarm bg, radius-md
struct PracticeView: View {
    @Environment(\.modelContext) private var ctx
    @State private var jstDate: String = DT.jstDateString()
    @State private var hasLastAttempt: Bool = false
    @State private var lastExamLabel: String = ""
    @State private var lastSourceLabel: String = ""
    @State private var lastMetaText: String = ""
    @State private var lastPackage: String? = nil
    @State private var navigateLast: Bool = false
    @State private var navigatePackage: String? = nil

    private struct ExamEntry: Identifiable {
        let id: String
        let name: String
        let sub: String
        let available: Bool
        let color: Color
        let packages: [String]
        let isPrimary: Bool  // IT Passport = primary
    }

    private var exams: [ExamEntry] {
        let manifest = QuizStore.shared.manifest
        let itpassPkgs = manifest.packages.filter { $0.package.hasPrefix("quiz-itpass") }
        let sgPkgs = manifest.packages.filter { $0.package.hasPrefix("quiz-sg") }
        return [
            ExamEntry(id: "itpass", name: "IT Passport",
                      sub: "ITパスポート試験 · 按年度模拟 (\(itpassPkgs.count) 套)",
                      available: !itpassPkgs.isEmpty,
                      color: DT.itpassColor,
                      packages: itpassPkgs.map { $0.package },
                      isPrimary: true),
            ExamEntry(id: "sg", name: "SG 信息安全",
                      sub: "情報セキュリティ · 专项强化 (\(sgPkgs.count) 套)",
                      available: !sgPkgs.isEmpty,
                      color: DT.sgColor,
                      packages: sgPkgs.map { $0.package },
                      isPrimary: false),
            ExamEntry(id: "mos", name: "MOS 365",
                      sub: "认证考试 — 准备中",
                      available: false,
                      color: DT.textGhost,
                      packages: [],
                      isPrimary: false)
        ]
    }

    var body: some View {
        NavigationStack {
            ScrollViewReader { proxy in
                ZStack(alignment: .bottomTrailing) {
                    DT.canvas.ignoresSafeArea()

                    ScrollView {
                        VStack(alignment: .leading, spacing: DT.space3) {
                            Color.clear.frame(height: 1).id("top")

                            // ===== Masthead =====
                            QPMasthead(kicker: "DRILL · 刷题", title: "刷题", rightText: jstDate)
                                .padding(.top, DT.space3)

                            // ===== Rule line =====
                            QPRuleLine()
                                .padding(.bottom, 4)

                            // ===== Continue last session =====
                            if hasLastAttempt {
                                continueCard
                            }

                            // ===== Section: 选择考试 =====
                            chooseExamSection
                        }
                        .padding(.bottom, DT.space4)
                    }
                    .refreshable { reload() }
                    .scrollContentBackground(.hidden)

                    // Floating back to top button
                    Button(action: {
                        withAnimation(.spring()) {
                            proxy.scrollTo("top", anchor: .top)
                        }
                    }) {
                        Image(systemName: "arrow.up")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundStyle(DT.surface)
                            .frame(width: 44, height: 44)
                            .background(DT.ink.opacity(0.85))
                            .clipShape(Circle())
                            .shadow(color: Color.black.opacity(0.12), radius: 4, x: 0, y: 2)
                    }
                    .padding(.trailing, DT.space3)
                    .padding(.bottom, DT.space3)
                    .buttonStyle(.plain)
                }
            }
            .safeAreaInset(edge: .bottom) { Color.clear.frame(height: 0) }
            .background(DT.canvas.ignoresSafeArea())
            .navigationBarHidden(true)
            .navigationDestination(isPresented: $navigateLast) {
                if let pkg = lastPackage {
                    QuizView(package: pkg, exam: lastExamId(), sourceType: "past_exam_japanese")
                }
            }
            .navigationDestination(isPresented: Binding(
                get: { navigatePackage != nil },
                set: { if !$0 { navigatePackage = nil } }
            )) {
                if let pkg = navigatePackage {
                    QuizView(package: pkg, exam: pkg.contains("sg") ? "sg" : "itpass",
                             sourceType: "past_exam_japanese")
                }
            }
            .onAppear { reload() }
        }
    }

    private func lastExamId() -> String {
        if let last = Storage.shared.getLastAttempt() { return last.exam }
        return "itpass"
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        if let last = Storage.shared.getLastAttempt() {
            hasLastAttempt = true
            lastExamLabel = last.examLabel
            lastSourceLabel = last.sourceLabel
            lastMetaText = last.metaText
            lastPackage = last.sourceType == "wrong_only" ? nil : QuizStore.shared.manifest.packages.first?.package
        } else {
            hasLastAttempt = false
        }
    }

    // MARK: - Continue Card (editorial accent top border)
    private var continueCard: some View {
        Button(action: { if lastPackage != nil { navigateLast = true } }) {
            QPCard(backgroundColor: DT.surface, cornerRadius: DT.radiusLg,
                   borderColor: DT.line.opacity(0.2), borderWidth: 0.5, padding: DT.space2) {
                VStack(alignment: .leading, spacing: DT.space1) {
                    // Top: kicker + meta
                    HStack {
                        Text("CONTINUE · 继续上次")
                            .font(.system(size: DT.fontLabel))
                            .tracking(2)
                            .foregroundStyle(DT.editorial)
                        Spacer()
                        if !lastMetaText.isEmpty {
                            Text(lastMetaText)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textTertiary)
                        }
                    }

                    // Title row
                    HStack(spacing: 6) {
                        Text(lastExamLabel)
                            .font(.system(size: DT.fontPageTitle, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(lastSourceLabel)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }

                    // Action text
                    Text(lastPackage != nil ? "继续上次刷题 →" : "已结束 · 选择下方考试")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(lastPackage != nil ? DT.primary : DT.textGhost)
                        .padding(.top, DT.space1)
                }
            }
            .overlay(alignment: .top) {
                // Editorial accent top border (5rpx)
                Rectangle()
                    .fill(DT.editorial)
                    .frame(height: 5)
                    .clipShape(RoundedRectangle(cornerRadius: DT.radiusLg, style: .continuous))
                    .padding(.horizontal, 0.5)
            }
            .padding(.horizontal, DT.space3)
        }
        .buttonStyle(.plain)
        .disabled(lastPackage == nil)
    }

    // MARK: - Choose Exam Section
    private var chooseExamSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            // Section label: "01" + "选择考试" + meta
            QPSectionLabel("01", "选择考试", meta: "\(exams.count) 考试")

            VStack(spacing: DT.space1) {
                ForEach(exams) { exam in
                    examRow(exam: exam)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    // MARK: - Exam Row (horizontal card with chevron / badge)
    @ViewBuilder
    private func examRow(exam: ExamEntry) -> some View {
        if exam.available {
            // Primary exam (IT Passport) gets primary-soft bg + left accent border
            // Secondary exams get normal surface
            let isPrimary = exam.isPrimary
            let cardBg = isPrimary ? DT.primarySoft : DT.surface
            let leftBorder = isPrimary ? exam.color : Color.clear
            let leftBorderWidth: CGFloat = isPrimary ? 3 : 0

            Button(action: { navigatePackage = exam.packages.first }) {
                QPCard(backgroundColor: cardBg, cornerRadius: DT.radiusMd,
                       borderColor: DT.line, borderWidth: 0.5, padding: 0) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        // Left accent bar (only for primary)
                        if isPrimary {
                            Rectangle()
                                .fill(leftBorder)
                                .frame(width: 3, height: 36)
                        }

                        // Content
                        VStack(alignment: .leading, spacing: 4) {
                            Text(exam.name)
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.ink)
                            Text(exam.sub)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                                .lineLimit(1)
                        }

                        Spacer(minLength: 0)

                        // Chevron
                        Text("›")
                            .font(.system(size: DT.fontPageTitle, weight: .light))
                            .foregroundStyle(DT.textTertiary)
                    }
                    .padding(.horizontal, DT.space2)
                    .padding(.vertical, DT.space2)
                }
                .overlay(alignment: .leading) {
                    if isPrimary {
                        Rectangle()
                            .fill(leftBorder)
                            .frame(width: 3)
                            .clipShape(RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous))
                    }
                }
            }
            .buttonStyle(.plain)

            // Package chips (horizontal scroll) - only show if packages exist
            if !exam.packages.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(exam.packages, id: \.self) { pkg in
                            Button(action: { navigatePackage = pkg }) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(packageLabel(pkg))
                                        .font(.system(size: DT.fontCaption, weight: .semibold))
                                        .foregroundStyle(DT.ink)
                                    Text("\(questionCount(pkg)) 题")
                                        .font(.system(size: DT.fontLabel))
                                        .foregroundStyle(DT.textTertiary)
                                }
                                .padding(.horizontal, DT.space2)
                                .padding(.vertical, 6)
                                .background(DT.fillWarm)
                                .clipShape(RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, DT.space3)
                    .padding(.top, 4)
                }
            }
        } else {
            // Muted exam (MOS 365) - opacity 0.55 + "准备中" badge
            Button(action: {}) {
                QPCard(backgroundColor: DT.surface, cornerRadius: DT.radiusMd,
                       borderColor: DT.line, borderWidth: 0.5, padding: DT.space2) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Rectangle()
                            .fill(exam.color)
                            .frame(width: 3, height: 36)

                        VStack(alignment: .leading, spacing: 4) {
                            Text(exam.name)
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(DT.textTertiary)
                            Text(exam.sub)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                        }

                        Spacer(minLength: 0)

                        // Badge instead of chevron
                        QPPill("准备中", background: DT.disabledBg, foreground: DT.disabledText)
                    }
                }
            }
            .buttonStyle(.plain)
            .opacity(0.55)
            .disabled(true)
        }
    }

    private func packageLabel(_ pkg: String) -> String {
        let cleaned = pkg.replacingOccurrences(of: "quiz-itpass-", with: "")
            .replacingOccurrences(of: "quiz-sg-", with: "")
        return "\(pkg.contains("sg") ? "SG" : "IT") · \(cleaned)"
    }

    private func questionCount(_ pkg: String) -> Int {
        QuizStore.shared.manifest.packages.first { $0.package == pkg }?.count ?? 0
    }
}

#Preview {
    PracticeView()
        .modelContainer(for: [QuizAttempt.self, MistakeRecord.self, StudyStat.self, FavoriteTerm.self, FlashcardProgress.self], inMemory: true)
}