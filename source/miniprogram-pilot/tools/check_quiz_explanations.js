#!/usr/bin/env node
/**
 * check_quiz_explanations.js
 * 检查 IT Passport / SG 拆分真题中文解释质量。
 *
 * 用法：node tools/check_quiz_explanations.js
 */

'use strict';

var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var INDEX_PATH = path.join(ROOT, 'packages', 'quiz', 'data', 'past_exam_bank', 'index');

function loadSplitBank() {
  var index = require(INDEX_PATH);
  var fullBank = [];
  var explanations = {};
  var packageSummaries = [];

  (index.packages || []).forEach(function (pkg) {
    var dataRoot = path.join(ROOT, pkg.root, 'data');
    var questionsModule = require(path.join(dataRoot, 'questions'));
    var explMap = require(path.join(dataRoot, 'explanations_zh'));
    var byYear = questionsModule.questionsByYear || {};
    var count = 0;

    Object.keys(byYear).forEach(function (yearId) {
      var list = byYear[yearId] || [];
      count += list.length;
      fullBank = fullBank.concat(list);
    });
    Object.keys(explMap || {}).forEach(function (id) {
      explanations[id] = explMap[id];
    });
    packageSummaries.push({
      root: pkg.root,
      exam: pkg.exam,
      questions: count,
      explanations: Object.keys(explMap || {}).length
    });
  });

  return {
    index: index,
    fullBank: fullBank,
    explanations: explanations,
    packageSummaries: packageSummaries
  };
}

function countKana(text) {
  var count = 0;
  if (!text) return count;
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)) count++;
  }
  return count;
}

function main() {
  var data = loadSplitBank();
  var fullBank = data.fullBank;
  var explanations = data.explanations;
  var itpass = fullBank.filter(function (q) { return q.exam === 'itpass'; });
  var sg = fullBank.filter(function (q) { return q.exam === 'sg'; });

  var pass = 0;
  var fail = 0;
  var failDetails = [];

  function check(name, condition, detail) {
    if (condition) {
      pass++;
    } else {
      fail++;
      failDetails.push('[FAIL] ' + name + (detail ? ': ' + detail : ''));
    }
  }

  var ids = {};
  var duplicateIds = 0;
  fullBank.forEach(function (q) {
    if (ids[q.id]) duplicateIds++;
    ids[q.id] = true;
  });

  check('拆分索引存在并包含分包', data.index && data.index.packages && data.index.packages.length >= 7,
    'packages=' + ((data.index && data.index.packages || []).length));
  check('总题数为 1945', fullBank.length === 1945, 'got ' + fullBank.length);
  check('IT Passport 题数为 1500', itpass.length === 1500, 'got ' + itpass.length);
  check('SG 题数为 445', sg.length === 445, 'got ' + sg.length);
  check('题目 ID 无重复', duplicateIds === 0, duplicateIds + ' duplicate(s)');

  // 1. 覆盖率检查
  var missingZh = 0;
  fullBank.forEach(function (q) {
    if (!explanations[q.id] || explanations[q.id].length < 60) missingZh++;
  });
  check('IT Passport + SG 中文解释覆盖率 100%',
    missingZh === 0, missingZh + ' 题缺失或过短');

  // 2. 禁止词检查
  var forbidden = ['中文解析待补充', '待补充', '暂无中文解析', '暂无解析', '无法生成'];
  forbidden.forEach(function (word) {
    var count = 0;
    Object.values(explanations).forEach(function (v) {
      if (v.indexOf(word) >= 0) count++;
    });
    check('无禁止词 "' + word + '"', count === 0, count + ' 处');
  });

  // 3. HTML 残留检查
  var htmlPatterns = ['<div', '</div>', 'class=', 'id="kaisetsu"', 'ansbg'];
  htmlPatterns.forEach(function (pat) {
    var count = 0;
    Object.values(explanations).forEach(function (v) {
      if (v.indexOf(pat) >= 0) count++;
    });
    check('无 HTML 残留 "' + pat + '"', count === 0, count + ' 处');
  });

  // 4. 日文假名残留检查
  var kanaResidue = 0;
  Object.values(explanations).forEach(function (text) {
    if (countKana(text) > 0) kanaResidue++;
  });
  check('无日文假名残留',
    kanaResidue === 0,
    kanaResidue + '/' + fullBank.length);

  // 5. 长度检查
  var tooShort = 0;
  var lengths = Object.values(explanations).map(function (v) { return v.length; });
  lengths.forEach(function (l) { if (l < 70) tooShort++; });
  check('解释长度 >= 70 字符',
    tooShort === 0,
    tooShort + ' 题过短');

  var avgLen = lengths.reduce(function (a, b) { return a + b; }, 0) / lengths.length;
  check('平均解释长度 >= 100 字符',
    avgLen >= 100,
    avgLen.toFixed(0) + ' 字符');

  // 6. RFI/RFP/SLA 特别检查
  var acronymPattern = /\b(RFI|RFP|SLA)\b/;
  var rfpQuestions = fullBank.filter(function (q) {
    return acronymPattern.test([
      q.questionZh || '',
      q.questionJa || '',
      q.explanationZh || '',
      q.explanationJa || '',
    ].join(' '));
  });
  var rfpMissing = 0;
  rfpQuestions.forEach(function (q) {
    var expl = explanations[q.id] || '';
    if (!acronymPattern.test(expl)) {
      rfpMissing++;
    }
  });
  check('RFI/RFP/SLA 题目绝大部分有真实中文解释',
    rfpMissing === 0,
    rfpMissing + '/' + rfpQuestions.length + ' 缺失');

  console.log('\n=== 分包统计 ===');
  data.packageSummaries.forEach(function (item) {
    console.log(item.root + ': ' + item.questions + ' 题, ' + item.explanations + ' 条中文解释');
  });

  // 7. 抽样输出
  console.log('\n=== 抽样：IT Passport 5 题 ===');
  [0, 300, 600, 900, 1200].forEach(function (i) {
    if (i >= itpass.length) return;
    var q = itpass[i];
    console.log('\n---', q.id, '[' + q.yearId + '#' + q.number + '] ---');
    console.log((explanations[q.id] || 'MISSING').substring(0, 200));
  });

  console.log('\n=== 抽样：SG 5 题 ===');
  [0, 100, 200, 300, 400].forEach(function (i) {
    if (i >= sg.length) return;
    var q = sg[i];
    console.log('\n---', q.id, '[' + q.yearId + '#' + q.number + '] ---');
    console.log((explanations[q.id] || 'MISSING').substring(0, 200));
  });

  // 8. RFI 样例
  console.log('\n=== RFI/RFP 样例 ===');
  rfpQuestions.slice(0, 3).forEach(function (q) {
    console.log('\n---', q.id, '---');
    console.log((explanations[q.id] || 'MISSING').substring(0, 300));
  });

  // 统计
  console.log('\n=== 统计 ===');
  console.log('总题数:', fullBank.length);
  console.log('IT Passport:', itpass.length, '| SG:', sg.length);
  console.log('中文解释:', Object.keys(explanations).length);
  console.log('平均解释长度:', avgLen.toFixed(0), '字符');
  console.log('最短:', Math.min.apply(null, lengths), '| 最长:', Math.max.apply(null, lengths));

  // 最终结果
  console.log('\n=== 结果 ===');
  if (failDetails.length > 0) {
    failDetails.forEach(function (d) { console.log(d); });
  }
  console.log('PASS:', pass, '| FAIL:', fail);

  if (fail > 0) {
    console.log('\n[FAIL] 中文解释质量检查未通过');
    process.exit(1);
  } else {
    console.log('\n[PASS] 中文解释质量检查全部通过');
  }
}

main();
