#!/usr/bin/env node
'use strict';

const assert = require('assert');
const cp = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const result = cp.spawnSync(process.execPath, [
  'tools/r23_7_merge_package.js',
  '--package',
  'quiz-itpass-1',
  '--dry-run'
], {
  cwd: ROOT,
  encoding: 'utf8'
});

assert.strictEqual(result.status, 0, result.stderr || result.stdout);
const payload = JSON.parse(result.stdout);
assert.strictEqual(payload.package, 'quiz-itpass-1');
assert.strictEqual(payload.totalManifestRecords, 300);
assert.strictEqual(payload.mergedRecords, 300);
assert.strictEqual(payload.missingPassedTranslations, 0);
assert.strictEqual(payload.fingerprintMismatch, 0);
assert.strictEqual(payload.questionFile, 'packages/quiz-itpass-1/data/questions_zh.js');
assert.strictEqual(payload.explanationFile, 'packages/quiz-itpass-1/data/explanations_zh.js');

console.log('R23.7 merge package selftest PASS');
