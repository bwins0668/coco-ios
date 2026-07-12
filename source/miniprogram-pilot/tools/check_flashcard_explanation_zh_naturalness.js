#!/usr/bin/env node
'use strict';

const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKAGES = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];
const KANA_RE = /[\u3041-\u309f\u30a0-\u30fa\u30fc-\u30ff]/;
const EN_FRAGMENT_RE = /\b(?:the|and|or|of|to|in)\b/i;
const BAD_RE = /(?:以下記述|利活用|据点|成果物|不正アクセス|不正访问|該当|行う|取り扱い|あらかじめ|として|について|において|に関する|に基づ|本题考查|该选项最符合题意)/;

function stripAllowedEnglish(text) {
  return String(text || '')
    .replace(/\b[\w.+-]+@[\w.-]+\b/g, '')
    .replace(/\b(?:co|or|ac|go|ne)\.jp\b/gi, '')
    .replace(/\b[A-Z]{2,}(?:\/[A-Z]+)?\b/g, '');
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
    const modernIds = Object.keys(questionsZh).filter((id) => questionsZh[id] && questionsZh[id].sourceFingerprint);
    let checked = 0;
    for (const id of modernIds) {
      checked += 1;
      const text = String(explanations[id] || '');
      if (text.length < 20) failures.push(`${pkg}:${id}: explanation too short/missing`);
      if (KANA_RE.test(text)) failures.push(`${pkg}:${id}: kana residue`);
      if (EN_FRAGMENT_RE.test(stripAllowedEnglish(text))) failures.push(`${pkg}:${id}: english fragment residue`);
      if (BAD_RE.test(text)) failures.push(`${pkg}:${id}: forbidden template/residue`);
    }
    rows.push({ package: pkg, checked });
  }
  console.log('=== FLASHCARD EXPLANATION ZH NATURALNESS ===');
  console.log(JSON.stringify({ rows, failures }, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

main();
