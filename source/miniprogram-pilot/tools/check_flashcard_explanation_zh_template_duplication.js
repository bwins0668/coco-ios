#!/usr/bin/env node
'use strict';

const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKAGES = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

function normalize(text) {
  return String(text || '').replace(/\s+/g, '').replace(/[，。；：、,.]/g, '').slice(0, 120);
}

function main() {
  const failures = [];
  const warnings = [];
  const rows = [];
  for (const pkg of PACKAGES) {
    const questionsZhPath = path.join(ROOT, 'packages', pkg, 'data', 'questions_zh.js');
    const explanationsPath = path.join(ROOT, 'packages', pkg, 'data', 'explanations_zh.js');
    delete require.cache[require.resolve(questionsZhPath)];
    delete require.cache[require.resolve(explanationsPath)];
    const questionsZh = require(questionsZhPath);
    const explanations = require(explanationsPath);
    const seen = new Map();
    const modernIds = Object.keys(questionsZh).filter((id) => questionsZh[id] && questionsZh[id].sourceFingerprint);
    for (const id of modernIds) {
      const text = String(explanations[id] || '');
      if (/本题考查|该选项最符合题意|建议结合解释理解知识点/.test(text)) failures.push(`${pkg}:${id}: generic template phrase`);
      const key = normalize(text);
      if (key.length >= 80) {
        const list = seen.get(key) || [];
        list.push(id);
        seen.set(key, list);
      }
    }
    for (const [key, ids] of seen.entries()) {
      if (ids.length > 1) warnings.push(`${pkg}: repeated explanation prefix ${key.slice(0, 24)}... ids=${ids.join(',')}`);
    }
    rows.push({ package: pkg, checked: modernIds.length });
  }
  console.log('=== FLASHCARD EXPLANATION ZH TEMPLATE DUPLICATION ===');
  console.log(JSON.stringify({ rows, failures, warnings }, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

main();
