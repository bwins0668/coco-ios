#!/usr/bin/env node
'use strict';

const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'artifacts');
const MANIFEST = path.join(ARTIFACTS, 'r23_7_canonical_manifest.jsonl');
const PACKAGE = '_r23_7_review_selftest';
const BATCH_ID = 'bad-naturalness-candidate';
const ANSWER_BATCH_ID = 'bad-answer-label-candidate';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readManifestRecord(questionId) {
  if (!fs.existsSync(MANIFEST)) {
    cp.execFileSync(process.execPath, ['tools/r23_7_build_canonical_manifest.js'], {
      cwd: ROOT,
      stdio: 'inherit'
    });
  }
  const record = fs.readFileSync(MANIFEST, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .find((item) => item.questionId === questionId);
  assert(record, `canonical manifest must contain ${questionId}`);
  return record;
}

function writeFixture(record, batchId, translation) {
  const batchDir = path.join(ARTIFACTS, 'r23_7_batches', PACKAGE);
  const checkpointDir = path.join(ARTIFACTS, 'r23_7_checkpoints', PACKAGE);
  ensureDir(batchDir);
  ensureDir(checkpointDir);

  const batch = {
    package: PACKAGE,
    batchId,
    questionIds: [record.questionId],
    translations: [translation]
  };

  fs.writeFileSync(path.join(batchDir, `${batchId}.json`), `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(checkpointDir, `${batchId}.json`), `${JSON.stringify({
    package: PACKAGE,
    batchId,
    questionIds: [record.questionId],
    translatedCount: 1,
    semanticReviewPassed: false,
    styleLintPassed: false,
    fingerprintPassed: false,
    retryCount: 0,
    completedAt: ''
  }, null, 2)}\n`, 'utf8');
}

function runReview(batchId) {
  const result = cp.spawnSync(process.execPath, [
    'tools/r23_7_review_batch.js',
    '--package',
    PACKAGE,
    '--batch-id',
    batchId
  ], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  const reviewPath = path.join(ARTIFACTS, 'r23_7_reviews', PACKAGE, `${batchId}.json`);
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  return { result, review };
}

function main() {
  const record = readManifestRecord('01_AKI_Q1');
  const baseTranslation = {
    package: record.package,
    questionId: record.questionId,
    sourceFingerprint: record.sourceFingerprint,
    questionZh: '根据《劳务派遣法》，A公司决定将Y先生派遣至B公司。本案中，下列哪种关系是恰当的？',
    optionsZh: {
      A: 'A公司与B公司的委托关系',
      B: 'A公司与Y先生之间的劳务派遣合同关系',
      C: 'B公司与Y先生的雇佣关系',
      D: 'B公司与Y先生的指挥命令关系'
    },
    explanationZh: '劳务派遣合同规定：派遣劳动者由派遣公司雇用，并在接收公司指挥命令下工作。在劳务派遣合同中，派遣公司与被派遣劳动者之间建立雇佣关系，接收公司与被派遣劳动者之间建立指挥命令关系。因此，正确答案是“D”。',
    correctAnswer: record.correctAnswer,
    visualClassification: '',
    optionTextStatus: 'complete'
  };

  writeFixture(record, BATCH_ID, {
    ...baseTranslation,
    optionsZh: {
      ...baseTranslation.optionsZh,
      D: 'B连与Y先生的指挥指挥关系'
    },
    explanationZh: '劳务派遣合同是劳务派遣公司的员工在劳务派遣公司的指导和命令下从事工作的劳动合同。在劳务派遣合同中，派遣公司与被派遣劳动者之间建立雇佣关系，派遣公司与被派遣劳动者之间建立指挥命令关系。本题中，A公司为派遣公司，B公司为接收公司，Y先生为派遣工人。以此为基础，我们会判断每一个说法是正确还是错误。\n- A公司与B公司建立劳务派遣合同关系。\n- A公司（派遣公司）与Y先生建立雇佣关系。\n- B公司（目的公司）与Y先生之间建立指挥与命令关系。\n- 正确。 Y先生将在其被派遣公司B公司的指导和命令下从事工作。'
  });
  const naturalness = runReview(BATCH_ID);
  assert.notStrictEqual(naturalness.result.status, 0, 'bad natural Chinese candidate must fail review');
  assert.strictEqual(naturalness.review.summary.fail, 1, 'review summary must record one failed item');
  assert.match(
    naturalness.review.reviews[0].reviewNotes,
    /unnatural Chinese artifact/,
    'review notes must explain why the candidate failed'
  );

  writeFixture(record, ANSWER_BATCH_ID, {
    ...baseTranslation,
    explanationZh: `${baseTranslation.explanationZh}\n因此，“E”是正确答案。`
  });
  const answerLabel = runReview(ANSWER_BATCH_ID);
  assert.notStrictEqual(answerLabel.result.status, 0, 'wrong answer label in explanation must fail review');
  assert.match(
    answerLabel.review.reviews[0].reviewNotes,
    /correct answer label mismatch/,
    'review notes must identify the wrong answer label'
  );

  console.log('R23.7 review gate selftest PASS');
}

main();
