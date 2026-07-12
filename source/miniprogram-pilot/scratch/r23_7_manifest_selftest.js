#!/usr/bin/env node
'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const script = path.join(root, 'tools', 'r23_7_build_canonical_manifest.js');
const manifestPath = path.join(root, 'artifacts', 'r23_7_canonical_manifest.jsonl');
const summaryPath = path.join(root, 'artifacts', 'r23_7_canonical_manifest_summary.json');

childProcess.execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });

const records = fs.readFileSync(manifestPath, 'utf8').trim().split(/\r?\n/).map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

assert.strictEqual(records.length, 1945, 'canonical manifest must contain 1945 records');
assert.strictEqual(summary.totalQuestions, 1945, 'summary totalQuestions must be 1945');
assert.strictEqual(summary.uniqueQuestionIds, 1945, 'questionId values must be unique');
assert.strictEqual(summary.errors.length, 0, 'manifest summary must have no errors');

for (const record of records) {
  assert(record.package, 'record.package is required');
  assert(record.questionId, 'record.questionId is required');
  assert(/^sha256:[0-9a-f]{64}$/.test(record.sourceFingerprint), `${record.questionId} has invalid fingerprint`);
  assert(record.questionJa && record.questionJa.length > 0, `${record.questionId} questionJa is required`);
  assert(record.correctAnswer, `${record.questionId} correctAnswer is required`);
  assert(record.explanationJa && record.explanationJa.length > 0, `${record.questionId} explanationJa is required`);
  assert.deepStrictEqual(Object.keys(record.optionsJa), ['A', 'B', 'C', 'D'], `${record.questionId} optionsJa order`);
}

console.log('r23_7 manifest selftest PASS');
