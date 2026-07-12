#!/usr/bin/env node
'use strict';
/**
 * build-quiz-json.js
 * 把微信小程序的题库源码（module.exports = {...}）归一化成 iOS App 使用的标准 JSON。
 *
 * 支持两种源形状：
 *   shape1  quiz 基础包:            { questions: [ {id, questionZh, options:[{key,textZh,textJa}], answer, explanationZh} ] }
 *   shape2  quiz-itpass-* / sg-*:   { packageKey, questionsByYear: { yearId: [ {id, questionJa, options:[{key,textJa}], answer} ] } }
 *                                    中文来自同目录 questions_zh.js（按 id）+ explanations_zh.js（按 id）
 *
 * 输出（默认 ios/CoCoiOS/Resources/QuizData/）：
 *   <package>.json   标准化题目数组
 *   manifest.json    总索引（包名、题数、是否有答案/中文）
 *
 * 用法：node ios/tools/build-quiz-json.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_PACKAGES = path.join(ROOT, 'source', 'miniprogram-pilot', 'packages');
const OUT_DIR = path.join(ROOT, 'ios', 'CoCoiOS', 'Resources', 'QuizData');

function loadOpt(dir, name) {
  const f = path.join(dir, name);
  if (!fs.existsSync(f)) return {};
  try { return require(f); } catch (e) { console.warn('  ⚠ 无法加载', name, e.message); return {}; }
}

/** 归一化单个题目为统一 schema */
function normalize(q, zhEntry, exEntry) {
  const options = (q.options || []).map((o) => {
    const key = o.key;
    const zh = (zhEntry && (zhEntry.optionsZh && zhEntry.optionsZh[key]) || (zhEntry && zhEntry.options && zhEntry.options.find(x => x.key === key && x.textZh))) || '';
    const textZh = (zh && typeof zh === 'string') ? zh : (zh && zh.textZh) || '';
    return {
      key: key,
      textZh: textZh || o.textZh || '',
      textJa: o.textJa || o.text || '',
    };
  });
  return {
    id: q.id,
    exam: q.exam || '',
    sourceType: q.sourceType || '',
    year: q.year || '',
    yearId: q.yearId || '',
    number: q.number || 0,
    category: q.category || '',
    subcategory: q.subcategory || '',
    topic: q.topic || '',
    level: q.level || '',
    lessonId: q.lessonId || '',
    lessonTitleZh: q.lessonTitleZh || '',
    lessonTitleJa: q.lessonTitleJa || '',
    questionZh: q.questionZh || (zhEntry && zhEntry.questionZh) || '',
    questionJa: q.questionJa || '',
    options,
    answer: (q.answer || '').toString().toUpperCase(),
    explanationZh: q.explanationZh || (exEntry || '') || '',
    explanationJa: q.explanationJa || '',
  };
}

function extractFromPackage(pkgDir) {
  const dataDir = path.join(pkgDir, 'data');
  if (!fs.existsSync(path.join(dataDir, 'questions.js'))) return null;
  const q = require(path.join(dataDir, 'questions.js'));
  const zhMap = loadOpt(dataDir, 'questions_zh.js');
  const exMap = loadOpt(dataDir, 'explanations_zh.js');

  let raw = [];
  if (Array.isArray(q.questions)) {
    raw = q.questions; // shape1
  } else if (q.questionsByYear && typeof q.questionsByYear === 'object') {
    Object.values(q.questionsByYear).forEach(arr => {
      if (Array.isArray(arr)) raw.push(...arr.filter(x => x && x.id));
    });
  } else {
    return null;
  }

  const out = raw
    .filter(x => x && x.id)
    .map(x => normalize(x, zhMap[x.id], exMap[x.id]));

  // 去重（按 id）
  const seen = new Set();
  const dedup = out.filter(x => { if (seen.has(x.id)) return false; seen.add(x.id); return true; });
  return dedup;
}

function main() {
  if (!fs.existsSync(SRC_PACKAGES)) {
    console.error('源目录不存在:', SRC_PACKAGES);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const pkgDirs = fs.readdirSync(SRC_PACKAGES)
    .map(d => path.join(SRC_PACKAGES, d))
    .filter(d => fs.statSync(d).isDirectory() && fs.existsSync(path.join(d, 'data', 'questions.js')));

  const manifest = { generatedAt: new Date().toISOString(), packages: [] };
  let total = 0;

  for (const dir of pkgDirs) {
    const name = path.basename(dir);
    const questions = extractFromPackage(dir);
    if (!questions) continue;
    const withAnswer = questions.filter(q => q.answer).length;
    const withZh = questions.filter(q => q.questionZh).length;
    const withEx = questions.filter(q => q.explanationZh).length;
    const outFile = path.join(OUT_DIR, name + '.json');
    fs.writeFileSync(outFile, JSON.stringify(questions, null, 2), 'utf8');
    manifest.packages.push({
      package: name,
      count: questions.length,
      withAnswer,
      withZh,
      withExplanationZh: withEx,
    });
    total += questions.length;
    console.log(`✓ ${name.padEnd(16)} ${String(questions.length).padStart(5)} 题 | 答案 ${withAnswer} | 中文 ${withZh} | 解析 ${withEx}`);
  }

  manifest.total = total;
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('—'.repeat(50));
  console.log(`总计 ${manifest.packages.length} 个包，${total} 道题`);
  console.log('输出目录:', OUT_DIR);
}

main();
