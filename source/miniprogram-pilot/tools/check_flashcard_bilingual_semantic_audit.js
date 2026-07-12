#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REVIEW_ROOT = path.join(ROOT, 'artifacts', 'r23_7_reviews');
const PACKAGES = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

function loadReviewPassMap(pkg) {
  const map = new Map();
  const dir = path.join(REVIEW_ROOT, pkg);
  if (!fs.existsSync(dir)) return map;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    const payload = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
    for (const review of payload.reviews || []) {
      map.set(review.questionId, review);
    }
  }
  return map;
}

function main() {
  const failures = [];
  const rows = [];
  for (const pkg of PACKAGES) {
    const questionsZhPath = path.join(ROOT, 'packages', pkg, 'data', 'questions_zh.js');
    const explanationsPath = path.join(ROOT, 'packages', pkg, 'data', 'explanations_zh.js');
    delete require.cache[require.resolve(questionsZhPath)];
    delete require.cache[require.resolve(explanationsPath)];
    const questionsZh = require(questionsZhPath);
    const explanations = require(explanationsPath);
    const reviewMap = loadReviewPassMap(pkg);
    const modernIds = Object.keys(questionsZh).filter((id) => questionsZh[id] && questionsZh[id].sourceFingerprint);
    for (const id of modernIds) {
      const record = questionsZh[id];
      const review = reviewMap.get(id);
      if (!record.questionZh || !record.options || record.options.length !== 4 || !explanations[id]) {
        failures.push(`${pkg}:${id}: missing bilingual runtime field`);
      }
      if (!review || review.reviewVerdict !== 'PASS' || review.sourceFingerprint !== record.sourceFingerprint) {
        failures.push(`${pkg}:${id}: missing PASS semantic review`);
      }
    }
    rows.push({ package: pkg, checked: modernIds.length });
  }
  console.log('=== FLASHCARD BILINGUAL SEMANTIC AUDIT ===');
  console.log(JSON.stringify({ rows, failures }, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

main();
