import SwiftUI

/// 闪卡中心：继续学习 + 课程入口（接入真实 QuizStore manifest + Storage 进度）
struct FlashcardsView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var ctx
    @State private var navigatePlayer: Bool = false
    @State private var navigateDeckSelect: Bool = false
    @State private var navigateAnki: Bool = false
    @State private var lastProgress: FlashcardProgress? = nil
    @State private var decks: [Storage.DeckInfo] = []

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space2) {
                backButton
                header
                continueSection
                coursesSection
                Spacer().frame(height: 80)
            }
            .padding(.top, DT.space3)
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
        .navigationDestination(isPresented: $navigatePlayer) {
            if let deck = decks.first {
                FlashcardPlayerView(package: deck.package, startIndex: 0)
            }
        }
        .navigationDestination(isPresented: $navigateAnki) { GlossaryView() }
        .onAppear { reload() }
    }

    private func reload() {
        AppContext.bootstrap(ctx)
        lastProgress = Storage.shared.getFlashcardProgress()
        decks = Storage.shared.getFlashcardDecks()
    }

    private var backButton: some View {
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

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("闪卡中心")
                .font(.system(size: DT.fontPageTitle, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text("フラッシュカード")
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textTertiary)
        }
        .padding(.horizontal, DT.space3)
    }

    private var continueSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionTitle("继续学习")
            if let p = lastProgress {
                Button(action: { navigatePlayer = true }) {
                    QPCard {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                QPPill(p.course == "itpass" ? "IT Passport" : "SG", background: DT.primarySoft, foreground: DT.primary)
                                Text(p.examTitle)
                                    .font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(DT.ink)
                            }
                            Text(p.deckLabel)
                                .font(.system(size: DT.fontCaption))
                                .foregroundStyle(DT.textSecondary)
                            HStack(spacing: 4) {
                                Text("第 \(p.currentIndex + 1) / \(p.total) 题")
                                    .font(.system(size: DT.fontCaption))
                                    .foregroundStyle(DT.textTertiary)
                                Spacer()
                                Text(Storage.relativeTime(p.updatedAt))
                                    .font(.system(size: DT.fontLabel))
                                    .foregroundStyle(DT.textGhost)
                            }
                            HStack {
                                Spacer()
                                Text("继续复习")
                                    .font(.system(size: DT.fontBody, weight: .semibold))
                                    .foregroundStyle(DT.surface)
                                    .padding(.horizontal, DT.space2)
                                    .padding(.vertical, 8)
                                    .background(DT.ink)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }
                .buttonStyle(.plain)
                .padding(.horizontal, DT.space3)
            } else {
                Text("先选择课程开始复习")
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textTertiary)
                    .padding(.horizontal, DT.space3)
            }
        }
    }

    private var coursesSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            sectionTitle("课程入口")
            VStack(spacing: DT.space1) {
                ForEach(decks) { deck in
                    courseCard(deck)
                }
                ankiCard
            }
            .padding(.horizontal, DT.space3)
        }
    }

    @ViewBuilder
    private func courseCard(_ deck: Storage.DeckInfo) -> some View {
        Button(action: { navigatePlayer = true }) {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space2) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Circle().fill(DT.itpassColor.opacity(0.18)).frame(width: 40, height: 40)
                            .overlay(Text(String(deck.title.prefix(2).uppercased()))
                                .font(.system(size: DT.fontCaption, weight: .semibold))
                                .foregroundStyle(DT.itpassColor))
                        VStack(alignment: .leading, spacing: 2) {
                            Text(deck.title).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                            Text("\(deck.total) 道真题").font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                        }
                    }
                    HStack(alignment: .center, spacing: DT.space2) {
                        statBlock(value: "\(deck.total)", label: "可复习题数", color: DT.ink)
                        statBlock(value: "\(deck.mistakes)", label: "错题数", color: DT.success)
                        statBlock(value: "\(deck.pending)", label: "待复习", color: DT.danger)
                    }
                    HStack(alignment: .center) {
                        HStack(spacing: 6) {
                            tagPill("真题")
                            tagPill("日语")
                            tagPill("中文")
                        }
                        Spacer()
                        Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var ankiCard: some View {
        Button(action: { navigateAnki = true }) {
            QPCard {
                VStack(alignment: .leading, spacing: DT.space2) {
                    HStack(alignment: .center, spacing: DT.space2) {
                        Circle().fill(DT.ankiColor.opacity(0.18)).frame(width: 40, height: 40)
                            .overlay(Text("卡").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ankiColor))
                        VStack(alignment: .leading, spacing: 2) {
                            Text("知识记忆卡").font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(DT.ink)
                            Text("术语记忆 / 收藏复习").font(.system(size: DT.fontCaption)).foregroundStyle(DT.textSecondary)
                        }
                    }
                    HStack(alignment: .center, spacing: DT.space2) {
                        statBlock(value: "1500", label: "术语库", color: DT.ink)
                        statBlock(value: "\(Storage.shared.getFavoriteTermCount())", label: "已收藏", color: DT.success)
                        statBlock(value: "0", label: "待复习", color: DT.danger)
                    }
                    HStack(alignment: .center) {
                        HStack(spacing: 6) {
                            tagPill("术语")
                            tagPill("日语")
                            tagPill("中文")
                        }
                        Spacer()
                        Text("›").font(.system(size: DT.fontPageTitle, weight: .light)).foregroundStyle(DT.textTertiary)
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func statBlock(value: String, label: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(value).font(.system(size: DT.fontBody, weight: .semibold)).foregroundStyle(color)
            Text(label).font(.system(size: DT.fontLabel)).foregroundStyle(DT.textTertiary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func tagPill(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontLabel))
            .padding(.horizontal, 6).padding(.vertical, 2)
            .overlay(Capsule().stroke(DT.lineStrong, lineWidth: 0.5))
            .foregroundStyle(DT.textSecondary)
    }

    private func sectionTitle(_ text: String) -> some View {
        Text(text).font(.system(size: DT.fontCaption, weight: .semibold)).tracking(2)
            .foregroundStyle(DT.textTertiary)
            .padding(.horizontal, DT.space3)
    }
}

#Preview {
    FlashcardsView()
}