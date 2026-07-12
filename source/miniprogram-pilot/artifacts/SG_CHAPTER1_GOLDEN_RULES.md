# SG Chapter1 Golden Rules

Status: `SG_CHAPTER1_GOLDEN_BASELINE_READY`  
Scope: `packages/course-sg` Chapter 1 only (9 units)  
Purpose: immutable template for Chapter 2–9 knowledge reconstruction

## Non-negotiable structure (every unit)

Each unit MUST include `learningExperience` with:

1. **coreConcept** (`headingZh` + `bodyZh`) — classroom teaching, not one-line definition
2. **whyImportant** (`headingZh` + `bodyZh`) — business reality first; may mention exam, but never exam-only
3. **prerequisiteConcepts** (≥3) — each with label + body
4. **caseBreakdown** (≥3 steps) — complete business story: people/system/event/consequence
5. **examPattern** (`bodyZh`) + **examCues** (≥2) — IPA style, not “容易考”
6. **mistakeComparisons** (≥2) — true **A vs B** labels + contrast explanation
7. **memoryTips** (≥2) — mnemonic/process, not body paraphrase
8. **quizMapping** — honest: use real `relatedQuestionIds` only; empty if none; explain why/how

Also rewrite:

- `overviewZh` (textbook overview, no template)
- section `explanationZh` (natural, no template)

## Quantitative thresholds (gate enforced)

| Field | Minimum |
|---|---|
| coreConcept.bodyZh | 120 |
| whyImportant.bodyZh | 90 |
| caseBreakdown items | 3 |
| each case bodyZh | 40 |
| case total bodyZh | 180 |
| examPattern.bodyZh | 50 |
| examCues | 2 |
| mistakeComparisons | 2 |
| each mistake bodyZh | 40 |
| A/B labels | required |
| memoryTips | 2 |
| each tipZh | 12 |
| quizMapping.explanationZh | 30 |
| overviewZh | 100 |
| prerequisiteConcepts | 3 |

## Forbidden patterns

- Template residue: `先判断它属于/是在讲`、`这样可以把`、`不是直接问定义`、`做SG案例题时不会只按词面选择`
- Kana inside Chinese teaching fields (`overviewZh` / `explanationZh` / LE zh bodies)
- Forged `relatedQuestionIds`
- Blank term definitions pretending to exist (UI must show `定义暂未完成`)
- Per-unit style drift that breaks Chapter1 consistency

## Style consistency rules

- Title style: `编号 + 中文主题`（案例单元用“案例一/二：…”）
- Voice: teacher lecture → business meaning → exam mapping
- Mistake section always visualizable as **A vs B**
- Memory tips are short actionable mnemonics
- Case steps are narrative, not bullet keywords only

## UI golden reading rhythm

1. Chinese title primary; Japanese title secondary
2. **教材知识层** first and prominent (numbered ①–⑧)
3. Japanese original blocks **collapsed by default** when LE exists
4. Toggle: `展开/收起日文原文对照`
5. Terms: definition if ready; else honest empty state
6. Units without LE remain compatible (legacy fields)

## Gate command

```bash
node tools/check_sg_course_knowledge.js
```

Must print `[PASS]` before any later chapter is authored.

## Expansion rule for Chapter 2–9

- Copy this structure 100%
- Do not invent weaker schemas
- Do not ship template coaching text
- Do not continue if gate fails
