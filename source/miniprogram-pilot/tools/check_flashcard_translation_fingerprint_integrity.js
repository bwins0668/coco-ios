#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(ROOT, 'artifacts', 'r23_7_canonical_manifest.jsonl');
const PACKAGES = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

function loadManifestMap() {
  const map = new Map();
  fs.readFileSync(MANIFEST, 'utf8').split(/\r?\n/).filter(Boolean).forEach((line) => {
    const record = JSON.parse(line);
    map.set(`${record.package}:${record.questionId}`, record.sourceFingerprint);
  });
  return map;
}

function main() {
  const manifest = loadManifestMap();
  const rows = [];
  const failures = [];

  for (const pkg of PACKAGES) {
    const filePath = path.join(ROOT, 'packages', pkg, 'data', 'questions_zh.js');
    delete require.cache[require.resolve(filePath)];
    const questionsZh = require(filePath);
    const modern = Object.entries(questionsZh).filter(([, value]) => value && value.sourceFingerprint);
    let checked = 0;
    for (const [questionId, value] of modern) {
      checked += 1;
      const expected = manifest.get(`${pkg}:${questionId}`);
      if (!expected) failures.push(`${pkg}:${questionId}: missing manifest record`);
      else if (value.sourceFingerprint !== expected) failures.push(`${pkg}:${questionId}: sourceFingerprint mismatch`);
    }
    rows.push({ package: pkg, checked, legacy: Object.keys(questionsZh).length - checked });
  }

  console.log('=== FLASHCARD TRANSLATION FINGERPRINT INTEGRITY ===');
  console.log(JSON.stringify({ rows, failures }, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

main();
