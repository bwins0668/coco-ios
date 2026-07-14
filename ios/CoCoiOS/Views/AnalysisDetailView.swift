import SwiftUI

/// 题目解析页：显示日文题干、中文翻译、正确与错误答案指示、选项对照、详细解析以及分类标签。
struct AnalysisDetailView: View {
    let question: Question
    let selectedAnswer: String?
    
    @Environment(\.dismiss) private var dismiss
    
    private var isCorrect: Bool {
        guard let sel = selectedAnswer else { return false }
        return sel == question.answer
    }
    
    private var sourceLabel: String {
        let examLabel = question.exam == "sg" ? "SG 信息安全" : "IT Passport"
        if question.sourceType == "past_exam_japanese" {
            return "\(examLabel) · \(question.year.isEmpty ? "日文真题" : question.year)"
        } else if question.sourceType == "wrong_only" {
            return "\(examLabel) · 错题复习"
        }
        return "\(examLabel) · 课程练习"
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DT.space3) {
                // 返回按钮
                backButton
                
                // 顶部标题区
                headerSection
                
                // 题干区
                questionCard
                
                // 答案对比区
                answersComparisonCard
                
                // 选项对照区
                optionsSection
                
                // 详细解析区
                explanationCard
                
                // 标签区
                tagsSection
                
                // 底部行动按钮
                actionButtons
                
                Spacer().frame(height: 40)
            }
            .padding(.bottom, DT.space3)
        }
        .scrollContentBackground(.hidden)
        .background(DT.canvas.ignoresSafeArea())
        .navigationBarHidden(true)
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
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("ANALYSIS · 解析详情")
                .font(.system(size: DT.fontLabel))
                .tracking(2)
                .foregroundStyle(DT.textTertiary)
            Text("真题解析")
                .font(.system(size: DT.fontMasthead, weight: .semibold))
                .foregroundStyle(DT.ink)
            Text(sourceLabel)
                .font(.system(size: DT.fontCaption))
                .foregroundStyle(DT.textSecondary)
        }
        .padding(.horizontal, DT.space3)
    }
    
    private var questionCard: some View {
        QPRedHeaderCard {
            VStack(alignment: .leading, spacing: DT.space1) {
                Text("日文题干")
                    .font(.system(size: DT.fontLabel, weight: .semibold))
                    .foregroundStyle(DT.textTertiary)
                    .tracking(1.5)
                
                Text(question.questionJa)
                    .font(.system(size: DT.fontBody, weight: .medium))
                    .foregroundStyle(DT.ink)
                    .lineSpacing(2)
                
                if !question.questionZh.isEmpty {
                    Rectangle().fill(DT.line).frame(height: 0.5).padding(.vertical, 4)
                    
                    Text("中文辅助")
                        .font(.system(size: DT.fontLabel, weight: .semibold))
                        .foregroundStyle(DT.textTertiary)
                        .tracking(1.5)
                    
                    Text(question.questionZh)
                        .font(.system(size: DT.fontBody))
                        .foregroundStyle(DT.textSecondary)
                        .lineSpacing(2)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }
    
    private var answersComparisonCard: some View {
        QPCard {
            VStack(spacing: DT.space1) {
                HStack {
                    Text("正确答案")
                        .font(.system(size: DT.fontBody, weight: .semibold))
                        .foregroundStyle(DT.ink)
                    Spacer()
                    QPPill(question.answer, background: DT.successSoft, foreground: DT.success)
                }
                
                if let sel = selectedAnswer, !sel.isEmpty {
                    Divider().padding(.vertical, 2)
                    HStack {
                        Text("你的作答")
                            .font(.system(size: DT.fontBody, weight: .semibold))
                            .foregroundStyle(DT.ink)
                        Spacer()
                        QPPill(sel, background: isCorrect ? DT.successSoft : DT.dangerSoft, foreground: isCorrect ? DT.success : DT.danger)
                    }
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }
    
    private var optionsSection: some View {
        VStack(alignment: .leading, spacing: DT.space1) {
            Text("选项对照")
                .font(.system(size: DT.fontCaption, weight: .semibold))
                .foregroundStyle(DT.ink)
                .tracking(1.5)
                .padding(.horizontal, DT.space3)
            
            VStack(spacing: DT.space1) {
                ForEach(question.options) { opt in
                    let isCorrectOpt = opt.key == question.answer
                    let isSelectedWrongOpt = selectedAnswer == opt.key && !isCorrect
                    
                    QPCard(
                        backgroundColor: isCorrectOpt ? DT.successSoft : (isSelectedWrongOpt ? DT.dangerSoft : DT.surface),
                        borderColor: isCorrectOpt ? DT.success : (isSelectedWrongOpt ? DT.danger : DT.line)
                    ) {
                        HStack(alignment: .center, spacing: DT.space2) {
                            Text(opt.key)
                                .font(.system(size: DT.fontBody, weight: .semibold))
                                .foregroundStyle(isCorrectOpt || isSelectedWrongOpt ? DT.surface : DT.ink)
                                .frame(width: 28, height: 28)
                                .background(isCorrectOpt ? DT.success : (isSelectedWrongOpt ? DT.danger : DT.fillWarm))
                                .clipShape(Circle())
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text(opt.textZh.isEmpty ? opt.textJa : opt.textZh)
                                    .font(.system(size: DT.fontBody))
                                    .foregroundStyle(DT.ink)
                                
                                if !opt.textJa.isEmpty && !opt.textZh.isEmpty {
                                    Text(opt.textJa)
                                        .font(.system(size: DT.fontCaption))
                                        .foregroundStyle(DT.textSecondary)
                                }
                            }
                            Spacer()
                        }
                    }
                }
            }
            .padding(.horizontal, DT.space3)
        }
    }
    
    private var explanationCard: some View {
        QPCard {
            VStack(alignment: .leading, spacing: DT.space2) {
                Text("解析 / 解説")
                    .font(.system(size: DT.fontBody, weight: .semibold))
                    .foregroundStyle(DT.ink)
                
                Text(question.explanationZh.isEmpty ? "暂无中文解析" : question.explanationZh)
                    .font(.system(size: DT.fontCaption))
                    .foregroundStyle(DT.textSecondary)
                    .lineSpacing(3)
                
                if !question.explanationJa.isEmpty {
                    Divider().padding(.vertical, 4)
                    
                    Text("日文原文解析")
                        .font(.system(size: DT.fontLabel, weight: .semibold))
                        .foregroundStyle(DT.textTertiary)
                        .tracking(1)
                    
                    Text(question.explanationJa)
                        .font(.system(size: DT.fontCaption))
                        .foregroundStyle(DT.textSecondary)
                        .lineSpacing(3)
                }
            }
        }
        .padding(.horizontal, DT.space3)
    }
    
    private var tagsSection: some View {
        HStack(spacing: 8) {
            QPPill(question.category.isEmpty ? "未分类" : question.category)
            QPPill("Level: \(question.level.isEmpty ? "未分级" : question.level)")
            Spacer()
        }
        .padding(.horizontal, DT.space3)
    }
    
    private var actionButtons: some View {
        VStack(spacing: DT.space1) {
            QPPrimaryButton("返回") {
                dismiss()
            }
        }
        .padding(.horizontal, DT.space3)
    }
}
