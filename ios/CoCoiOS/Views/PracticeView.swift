import SwiftUI

/// 刷题页：选择考试 + 继续上次（接 QuizStore 真实 packages + Storage 上次练习）
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
                      packages: itpassPkgs.map { $0.package }),
            ExamEntry(id: "sg", name: "SG 信息安全",
                      sub: "情報セキュリティ · 专项强化 (\(sgPkgs.count) 套)",
                      available: !sgPkgs.isEmpty,
                      color: DT.sgColor,
                      packages: sgPkgs.map { $0.package }),
            ExamEntry(id: "mos", name: "MOS 365",
                      sub: "认证考试 — 准备中",
                      available: false,
                      color: DT.textGhost,
                      packages: [])
        ]
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: DT.space3) {
                    masthead
                    QPRuleLine()
                    if hasLastAttempt { continueCard }
                    chooseExamSection
                    if navigateLast, let pkg = lastPackage { hiddenLink(pkg: pkg) }
                    Spacer().frame(height: 80)
                }
                .padding(.bottom, DT.space3)
            }
            .scrollContentBackground(.hidden)
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

    @ViewBuilder
    private func hiddenLink(pkg: String) -> some View {
        NavigationLink(destination: QuizView(package: pkg, exam: lastExamId(),
                                              sourceType: "past_exam_japanese"), isActive: $navigateLast) {
            EmptyView()
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

    private var masthead: some View {
        QPMasthead(kicker: "DRILL · 刷题", title: "刷题", rightText: jstDate)
    }

    private var continueCard: some View {
        Button(action: { if lastPackage != nil { navigateLast = true } }) {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    HStack {
                        Text("CONTINUE · 继续上次")
                            .font(.system(size: DT.fontLabel))
                            .tracking(2)
                            .foregroundStyle(DT.editorial)
                        Spacer()
                        Text(lastMetaText)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }
                    HStack(spacing: 6) {
                        Text(lastExamLabel)
                            .font(.system(size: DT.fontPageTitle, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Text(lastSourceLabel)
                            .font(.system(size: DT.fontCaption))
                            .foregroundStyle(DT.textTertiary)
                    }
                    Text(lastPackage != nil ? "继续上次刷题 →" : "已结束 · 选择下方考试")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(lastPackage != nil ? DT.primary : DT.textGhost)
                        .padding(.top, DT.space1)
                }
            }
        }
        .buttonStyle(.plain)
        .disabled(lastPackage == nil)
        .padding(.horizontal, DT.space3)
    }

    private var chooseExamSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            QPSectionLabel("01", "选择考试", meta: "\(exams.count) 考试")
            VStack(spacing: DT.space1) {
                ForEach(exams) { exam in
                    examRow(exam: exam)
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func examRow(exam: ExamEntry) -> some View {
        if exam.available {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space1) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Rectangle().fill(exam.color).frame(width: 3, height: 36)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(exam.name).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                            Text(exam.sub).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary).lineLimit(1)
                        }
                        Spacer(minLength: 0)
                        Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
                    }
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
                                        .padding(.horizontal, DT.space2).padding(.vertical, 6)
                                        .background(DT.fillWarm)
                                        .clipShape(RoundedRectangle(cornerRadius: DT.radiusMd, style: .continuous))
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                    }
                }
            }
        } else {
            QPCard {
                HStack(alignment: .center, spacing: DT.space2) {
                    Rectangle().fill(exam.color).frame(width: 3, height: 36)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(exam.name).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.textTertiary)
                        Text(exam.sub).font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                    }
                    Spacer(minLength: 0)
                    QPPill("准备中")
                }
            }
            .opacity(0.6)
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
}