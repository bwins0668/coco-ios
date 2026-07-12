#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'artifacts');
const MANIFEST = path.join(ARTIFACTS, 'r23_7_canonical_manifest.jsonl');
const BATCH_ROOT = path.join(ARTIFACTS, 'r23_7_batches');
const CHECKPOINT_ROOT = path.join(ARTIFACTS, 'r23_7_checkpoints');
const REVIEW_ROOT = path.join(ARTIFACTS, 'r23_7_reviews');
const OPTION_KEYS = ['A', 'B', 'C', 'D'];
const STATEMENT_COMBINATION = /^[a-d](?:[，,、]\s*[a-d])*$/i;

const KANA_RE = /[ぁ-んァ-ン]/;
const EN_FRAGMENT_RE = /\b(?:the|and|or|of|to|in)\b/i;
const JA_RESIDUE_RE = /(?:以下記述|利活用|据点|成果物|不正アクセス|不正访问|該当|行う|取り扱い|あらかじめ|として|について|において|に関する|に基づ)/;
const TEMPLATE_RE = /本题考查IT基础知识|该选项最符合题意|建议结合解释理解知识点/;
const UNNATURAL_ZH_RE = /(?:[A-D]连|指挥指挥|正确的[。.]|错误的[。.]|目的公司|其被派遣公司|指导和命令|也称为合资企业|我们会判断每一个说法|劳务派遣公司的员工在劳务派遣公司的指导和命令下从事工作的劳动合同)/;

function parseArgs(argv) {
  const args = { package: '', batchId: '' };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--package') args.package = argv[++i];
    else if (arg === '--batch-id') args.batchId = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.package || !args.batchId) throw new Error('--package and --batch-id are required');
  return args;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadManifestMap() {
  const map = new Map();
  fs.readFileSync(MANIFEST, 'utf8').split(/\r?\n/).filter(Boolean).forEach((line) => {
    const record = JSON.parse(line);
    map.set(record.questionId, record);
  });
  return map;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function naturalScore(text) {
  let score = 5;
  if (KANA_RE.test(text)) score -= 2;
  if (EN_FRAGMENT_RE.test(stripAllowedEnglish(text))) score -= 1;
  if (JA_RESIDUE_RE.test(text)) score -= 1;
  if (TEMPLATE_RE.test(text)) score -= 2;
  if (UNNATURAL_ZH_RE.test(text)) score -= 2;
  if (text.length < 12) score -= 1;
  return Math.max(1, score);
}

function stripAllowedEnglish(text) {
  return String(text || '')
    .replace(/\b[\w.+-]+@[\w.-]+\b/g, '')
    .replace(/\b(?:co|or|ac|go|ne)\.jp\b/gi, '')
    .replace(/\b[A-Z]{2,}(?:\/[A-Z]+)?\b/g, '');
}

function hasCorrectAnswerLabelMismatch(text, correctAnswer) {
  const labels = [];
  const patterns = [
    /正确答案是[“"]([A-Ea我Ueiu])[”"]/g,
    /[“"]([A-Ea我Ueiu])[”"]是正确答案/g,
    /答案是[“"]([A-Ea我Ueiu])[”"]/g,
    /正解是[“"]([A-Ea我Ueiu])[”"]/g,
    /[“"]([A-Ea我Ueiu])[”"](?:的)?(?:组合)?(?:最恰当|最适合|正确)/g
  ];
  for (const pattern of patterns) {
    let match = pattern.exec(text);
    while (match) {
      labels.push(match[1]);
      match = pattern.exec(text);
    }
  }
  return labels.some((label) => label !== correctAnswer);
}

function normalizeStatementCombination(value) {
  return String(value || '').trim().toLowerCase().split(/[，,、]\s*/).join('');
}

function reviewOne(item, manifest) {
  const allZh = `${item.questionZh}\n${JSON.stringify(item.optionsZh)}\n${item.explanationZh}`;
  const fingerprintMatch = !!manifest && item.sourceFingerprint === manifest.sourceFingerprint;
  const optionCoverage = {};
  let optionCoveragePass = true;

  for (const key of OPTION_KEYS) {
    const optionZh = item.optionsZh ? String(item.optionsZh[key] || '').trim() : '';
    const ja = manifest ? String(manifest.optionsJa[key] || '') : '';
    const isBoundaryOption = !ja || /^[アイウエオカキクケコ]$/.test(ja);
    const isStatementOption = STATEMENT_COMBINATION.test(ja.trim());
    const statementOk = !isStatementOption || normalizeStatementCombination(optionZh) === normalizeStatementCombination(ja);
    const ok = optionZh.length > 0 && !KANA_RE.test(optionZh.replace(/[アイウエオカキクケコ]/g, ''));
    const boundaryOk = !isBoundaryOption || /原题未提供/.test(optionZh);
    optionCoverage[key] = {
      semanticMatch: ok && boundaryOk && statementOk,
      omittedConstraint: isStatementOption && !statementOk,
      inventedClaim: isBoundaryOption && !boundaryOk,
      untranslatedResidue: KANA_RE.test(optionZh.replace(/[アイウエオカキクケコ]/g, ''))
    };
    if (!optionCoverage[key].semanticMatch) optionCoveragePass = false;
  }

  const score = Math.min(naturalScore(item.questionZh), naturalScore(item.explanationZh), naturalScore(JSON.stringify(item.optionsZh || {})));
  const japaneseSyntaxResidue = JA_RESIDUE_RE.test(allZh);
  const englishFragmentResidue = EN_FRAGMENT_RE.test(stripAllowedEnglish(allZh));
  const unnaturalChineseArtifact = UNNATURAL_ZH_RE.test(allZh);
  const correctAnswerLabelMismatch = manifest ? hasCorrectAnswerLabelMismatch(item.explanationZh, manifest.correctAnswer) : true;
  const visualBoundaryRespected = item.visualClassification
    ? !/：|;|；/.test(Object.values(item.optionsZh || {}).join('')) || /原题未提供/.test(Object.values(item.optionsZh || {}).join(''))
    : true;

  const result = {
    questionId: item.questionId,
    sourceFingerprint: item.sourceFingerprint,
    fingerprintMatch,
    questionSemanticMatch: !!item.questionZh && item.questionZh.length >= 8 && !KANA_RE.test(item.questionZh),
    correctAnswerPreserved: manifest ? OPTION_KEYS.includes(manifest.correctAnswer) && item.correctAnswer === manifest.correctAnswer : false,
    optionCoverage,
    explanationOnTopic: !!item.explanationZh && item.explanationZh.length >= 30 && !TEMPLATE_RE.test(item.explanationZh),
    explanationExplainsWhyCorrect: /正确|因此|所以|关键|答案|选/.test(item.explanationZh),
    japaneseSyntaxResidue,
    englishFragmentResidue,
    unnaturalChineseArtifact,
    correctAnswerLabelMismatch,
    visualBoundaryRespected,
    naturalChineseScore: score,
    reviewVerdict: 'PASS',
    reviewNotes: ''
  };

  const failures = [];
  if (!result.fingerprintMatch) failures.push('fingerprint mismatch');
  if (!result.questionSemanticMatch) failures.push('question zh has kana/too short');
  if (!result.correctAnswerPreserved) failures.push('correct answer changed');
  if (!optionCoveragePass) failures.push('option coverage failed');
  if (!result.explanationOnTopic) failures.push('explanation too short/template');
  if (!result.explanationExplainsWhyCorrect) failures.push('explanation lacks judging connective');
  if (result.japaneseSyntaxResidue) failures.push('japanese syntax residue');
  if (result.englishFragmentResidue) failures.push('english fragment residue');
  if (result.unnaturalChineseArtifact) failures.push('unnatural Chinese artifact');
  if (result.correctAnswerLabelMismatch) failures.push('correct answer label mismatch');
  if (!result.visualBoundaryRespected) failures.push('visual boundary violation');
  if (result.naturalChineseScore < 4) failures.push('natural score below 4');

  if (failures.length > 0) {
    result.reviewVerdict = 'FAIL';
    result.reviewNotes = failures.join('; ');
  }
  return result;
}

function main() {
  const args = parseArgs(process.argv);
  ensureDir(REVIEW_ROOT);
  ensureDir(path.join(REVIEW_ROOT, args.package));

  const batchPath = path.join(BATCH_ROOT, args.package, `${args.batchId}.json`);
  const checkpointPath = path.join(CHECKPOINT_ROOT, args.package, `${args.batchId}.json`);
  const reviewPath = path.join(REVIEW_ROOT, args.package, `${args.batchId}.json`);
  const manifestMap = loadManifestMap();
  const batch = readJson(batchPath);

  const reviews = batch.translations.map((item) => reviewOne(item, manifestMap.get(item.questionId)));
  const summary = {
    package: args.package,
    batchId: args.batchId,
    total: reviews.length,
    pass: reviews.filter((item) => item.reviewVerdict === 'PASS').length,
    fail: reviews.filter((item) => item.reviewVerdict !== 'PASS').length,
    fingerprintMismatch: reviews.filter((item) => !item.fingerprintMatch).length,
    questionSemanticFail: reviews.filter((item) => !item.questionSemanticMatch).length,
    correctAnswerChanged: reviews.filter((item) => !item.correctAnswerPreserved).length,
    optionSemanticFail: reviews.filter((item) => Object.values(item.optionCoverage).some((option) => !option.semanticMatch)).length,
    explanationFail: reviews.filter((item) => !item.explanationOnTopic || !item.explanationExplainsWhyCorrect).length,
    japaneseSyntaxResidue: reviews.filter((item) => item.japaneseSyntaxResidue).length,
    englishFragmentResidue: reviews.filter((item) => item.englishFragmentResidue).length,
    unnaturalChineseArtifact: reviews.filter((item) => item.unnaturalChineseArtifact).length,
    correctAnswerLabelMismatch: reviews.filter((item) => item.correctAnswerLabelMismatch).length,
    visualBoundaryViolation: reviews.filter((item) => !item.visualBoundaryRespected).length,
    lowNaturalScore: reviews.filter((item) => item.naturalChineseScore < 4).length
  };

  const payload = { summary, reviews };
  fs.writeFileSync(reviewPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const checkpoint = readJson(checkpointPath);
  checkpoint.semanticReviewPassed = summary.fail === 0;
  checkpoint.styleLintPassed = summary.japaneseSyntaxResidue === 0 && summary.englishFragmentResidue === 0 && summary.unnaturalChineseArtifact === 0 && summary.lowNaturalScore === 0;
  checkpoint.fingerprintPassed = summary.fingerprintMismatch === 0;
  checkpoint.completedAt = summary.fail === 0 ? new Date().toISOString() : '';
  fs.writeFileSync(checkpointPath, `${JSON.stringify(checkpoint, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    package: args.package,
    batchId: args.batchId,
    reviewPath: path.relative(ROOT, reviewPath).replace(/\\/g, '/'),
    ...summary
  }, null, 2));

  if (summary.fail > 0) process.exit(1);
}

main();
