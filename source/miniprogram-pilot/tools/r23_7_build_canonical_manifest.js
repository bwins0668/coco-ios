#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARTIFACTS_DIR = path.join(ROOT, 'artifacts');
const MANIFEST_PATH = path.join(ARTIFACTS_DIR, 'r23_7_canonical_manifest.jsonl');
const SUMMARY_PATH = path.join(ARTIFACTS_DIR, 'r23_7_canonical_manifest_summary.json');

const PACKAGES = [
  'quiz-itpass-1',
  'quiz-itpass-2',
  'quiz-itpass-3',
  'quiz-itpass-4',
  'quiz-itpass-5',
  'quiz-sg-1',
  'quiz-sg-2'
];

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeText(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function computeFingerprint(record) {
  const payload = [
    record.package,
    record.questionId,
    normalizeText(record.questionJa),
    record.optionsJa.A || '',
    record.optionsJa.B || '',
    record.optionsJa.C || '',
    record.optionsJa.D || '',
    record.correctAnswer || '',
    normalizeText(record.explanationJa)
  ].join('\x00');
  return `sha256:${crypto.createHash('sha256').update(payload, 'utf8').digest('hex')}`;
}

function makeOptionsJa(question) {
  const optionsJa = { A: '', B: '', C: '', D: '' };
  const options = Array.isArray(question.options) ? question.options : [];
  for (const option of options) {
    if (option && OPTION_KEYS.includes(option.key)) {
      optionsJa[option.key] = normalizeText(option.textJa || '');
    }
  }
  return optionsJa;
}

function loadPackageQuestions(pkg, errors) {
  const dataFile = path.join(ROOT, 'packages', pkg, 'data', 'questions.js');
  if (!fs.existsSync(dataFile)) {
    errors.push({ type: 'missing_questions_file', package: pkg, path: dataFile });
    return [];
  }

  delete require.cache[require.resolve(dataFile)];
  const moduleData = require(dataFile);
  const byYear = moduleData.questionsByYear || {};
  const records = [];

  Object.keys(byYear).sort().forEach((yearId) => {
    const list = Array.isArray(byYear[yearId]) ? byYear[yearId] : [];
    list.forEach((question) => {
      const optionsJa = makeOptionsJa(question);
      const record = {
        package: pkg,
        questionId: question.id || '',
        sourceFingerprint: '',
        questionJa: normalizeText(question.questionJa || ''),
        optionsJa,
        emptyOptionKeys: OPTION_KEYS.filter((key) => !optionsJa[key]),
        optionTextStatus: OPTION_KEYS.every((key) => !optionsJa[key])
          ? 'all_empty'
          : (OPTION_KEYS.some((key) => !optionsJa[key]) ? 'partially_empty' : 'complete'),
        correctAnswer: question.answer || '',
        explanationJa: normalizeText(question.explanationJa || ''),
        yearId,
        year: question.year || '',
        number: question.number || null,
        category: question.category || '',
        topic: question.topic || ''
      };
      record.sourceFingerprint = computeFingerprint(record);
      records.push(record);
    });
  });

  return records;
}

function validateRecords(records) {
  const errors = [];
  const seen = new Map();
  const packageCounts = {};

  for (const record of records) {
    packageCounts[record.package] = (packageCounts[record.package] || 0) + 1;

    if (!record.questionId) errors.push({ type: 'missing_question_id', package: record.package });
    if (seen.has(record.questionId)) {
      errors.push({
        type: 'duplicate_question_id',
        questionId: record.questionId,
        firstPackage: seen.get(record.questionId),
        secondPackage: record.package
      });
    }
    seen.set(record.questionId, record.package);

    if (!record.questionJa) errors.push({ type: 'missing_question_ja', questionId: record.questionId, package: record.package });
    if (!record.correctAnswer) errors.push({ type: 'missing_correct_answer', questionId: record.questionId, package: record.package });
    if (!record.explanationJa) errors.push({ type: 'missing_explanation_ja', questionId: record.questionId, package: record.package });
    if (!OPTION_KEYS.includes(record.correctAnswer)) {
      errors.push({ type: 'invalid_correct_answer', questionId: record.questionId, answer: record.correctAnswer });
    }
  }

  return { errors, uniqueQuestionIds: seen.size, packageCounts };
}

function main() {
  ensureDir(ARTIFACTS_DIR);

  const loadErrors = [];
  const records = PACKAGES.flatMap((pkg) => loadPackageQuestions(pkg, loadErrors));
  records.sort((a, b) => {
    const pkgOrder = PACKAGES.indexOf(a.package) - PACKAGES.indexOf(b.package);
    if (pkgOrder !== 0) return pkgOrder;
    return a.questionId.localeCompare(b.questionId);
  });

  const validation = validateRecords(records);
  const errors = loadErrors.concat(validation.errors);

  fs.writeFileSync(MANIFEST_PATH, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8');

  const summary = {
    status: errors.length === 0 ? 'PASS' : 'FAIL',
    totalQuestions: records.length,
    expectedQuestions: 1945,
    totalMatchesExpected: records.length === 1945,
    uniqueQuestionIds: validation.uniqueQuestionIds,
    packageCounts: validation.packageCounts,
    errors,
    generatedAt: new Date().toISOString(),
    manifestPath: 'artifacts/r23_7_canonical_manifest.jsonl'
  };
  fs.writeFileSync(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  console.log('=== R23.7 Canonical Manifest ===');
  console.log(`totalQuestions: ${summary.totalQuestions}`);
  console.log(`uniqueQuestionIds: ${summary.uniqueQuestionIds}`);
  console.log(`errors: ${errors.length}`);
  console.log(`manifest: ${summary.manifestPath}`);

  if (summary.totalQuestions !== 1945 || errors.length > 0) {
    process.exit(1);
  }
}

main();
