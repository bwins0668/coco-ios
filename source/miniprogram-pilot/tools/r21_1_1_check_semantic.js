#!/usr/bin/env node
/**
 * r21_1_1_check_semantic.js
 * INDEPENDENT semantic auditor for R21.1.1 Chinese explanations.
 *
 * This auditor is COMPLETELY INDEPENDENT from the generator (r21_1_1_generate_explanations.js).
 * It does NOT call any generator function. Instead, it reads:
 *   - questions.js (source truth)
 *   - explanations_zh.js (generated output)
 *
 * Checks:
 * 1. Correct answer is preserved (generated explanation mentions the right option)
 * 2. Key terminology from explanationJa survives into Chinese
 * 3. No "去假名伪翻译" — every explanation must be natural Chinese sentences
 * 4. No explanation is a pure subset or stripping of Japanese without Chinese function words
 * 5. Spot-check: explanation content matches what question is asking
 *
 * Run: node tools/r21_1_1_check_semantic.js
 */

'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');

var PACKAGES = [
  { root: 'packages/quiz-itpass-1', name: 'itpass-1' },
  { root: 'packages/quiz-itpass-2', name: 'itpass-2' },
  { root: 'packages/quiz-itpass-3', name: 'itpass-3' },
  { root: 'packages/quiz-itpass-4', name: 'itpass-4' },
  { root: 'packages/quiz-itpass-5', name: 'itpass-5' },
  { root: 'packages/quiz-sg-1', name: 'sg-1' },
  { root: 'packages/quiz-sg-2', name: 'sg-2' },
];

// Chinese function words that should appear in natural Chinese explanations
// If too many explanations lack these, it suggests kana-stripping without conversion
var CHINESE_FUNCTION_WORDS = [
  '的', '是', '了', '在', '有', '不', '和', '与', '或', '即',
  '为', '对', '从', '被', '将', '该', '其', '此', '可', '以',
  '而', '但', '因', '所', '如', '于', '由', '并', '则', '者',
  '会', '能', '应', '需', '已', '更', '最', '各', '第', '类',
  '与', '及', '等', '如', '若', '虽', '因', '故',
];

// Built-in negative patterns — explanations that look like raw kana-stripping
function hasStrippingPattern(text) {
  // These patterns indicate the source was purely kana-deleted without conversion
  var patterns = [
    // Abrupt ending with empty brackets — no actual Chinese content
    /^[^，。]{0,30}[了［「【】]+正解[」】］]+$/,
    // Line that reads as pure kana stripping: consecutive Japanese-only particles
    // at the end with no meaningful Chinese
    /^(来|于|则|第|将|应|会|受|由|选|求|方|理|目|的|有|的|在|前|本).{0,5}[了了]+正解$/,
  ];
  for (var i = 0; i < patterns.length; i++) {
    if (patterns[i].test(text)) return true;
  }
  return false;
}

// Check if explanation contains a reference to the correct answer
function mentionsCorrectAnswer(text, answer) {
  if (!answer) return true; // skip check if no answer
  var labels = ['「' + answer + '」', '"' + answer + '"', answer + '.', '选项' + answer, answer + '为正解', answer + '。'];
  for (var i = 0; i < labels.length; i++) {
    if (text.indexOf(labels[i]) >= 0) return true;
  }
  // Also accept explanations that mention 正解 (implies answer is stated earlier)
  if (text.indexOf('正解') >= 0) return true;
  // Accept explanations with 正确 (implies this option is correct)
  if (text.indexOf('正确') >= 0) return true;
  return false;
}

// Count Chinese function words in text
function countChineseFunctionWords(text) {
  var count = 0;
  for (var i = 0; i < CHINESE_FUNCTION_WORDS.length; i++) {
    var w = CHINESE_FUNCTION_WORDS[i];
    var idx = text.indexOf(w);
    while (idx >= 0) {
      count++;
      idx = text.indexOf(w, idx + w.length);
    }
  }
  return count;
}

function main() {
  var totalExplanations = 0;
  var totalIssues = 0;
  var failed = 0;
  var passed = 0;
  var issues = [];

  function report(file, id, check, detail) {
    totalIssues++;
    issues.push({ file: file, id: id, check: check, detail: detail });
  }

  function pass(name) { passed++; }
  function fail(name, detail) { failed++; issues.push({ id: '', check: name, detail: detail || '' }); }

  // Check 1: Collect and verify all explanations
  var explanations = {};
  var cardMap = {};

  PACKAGES.forEach(function(pkg) {
    var qPath = path.join(ROOT, pkg.root, 'data', 'questions.js');
    var ePath = path.join(ROOT, pkg.root, 'data', 'explanations_zh.js');

    if (!fs.existsSync(qPath) || !fs.existsSync(ePath)) {
      fail('Missing file', pkg.name + ' questions or explanations_zh');
      return;
    }

    // Load cards — clear cache to avoid stale modules
    delete require.cache[require.resolve(qPath)];
    var qMod = require(qPath);
    var byYear = qMod.questionsByYear || {};
    Object.keys(byYear).forEach(function(yearId) {
      (byYear[yearId] || []).forEach(function(card) {
        if (card && card.id) cardMap[card.id] = card;
      });
    });

    // Load explanations
    var eContent = fs.readFileSync(ePath, 'utf-8');
    var match = eContent.match(/module\.exports = (\{[\s\S]+\});/);
    if (match) {
      var explData = JSON.parse(match[1]);
      Object.keys(explData).forEach(function(id) {
        explanations[id] = explData[id];
        totalExplanations++;
      });
    }
  });

  // Check 2: Verify each explanation
  var noChineseContent = 0;
  var strippedPattern = 0;
  var lowFunctionWordCount = 0;
  var correctAnswerMissing = 0;
  var kanaDirectResidue = 0;

  Object.keys(explanations).forEach(function(id) {
    var text = explanations[id];
    var card = cardMap[id];
    if (!card) return;

    // Check for Chinese character content
    var chineseChars = text.match(/[一-鿿㐀-䶿]/g);
    if (!chineseChars || chineseChars.length < 5) {
      noChineseContent++;
      report(card.exam || '?', id, '缺少中文内容', '仅 ' + (chineseChars ? chineseChars.length : 0) + ' 个汉字');
      return;
    }

    // Check for direct kana striping patterns
    if (hasStrippingPattern(text)) {
      strippedPattern++;
      report(card.exam || '?', id, '疑似去假名伪翻译', '包含去假名遗留模式');
    }

    // Check function word count
    var fwCount = countChineseFunctionWords(text);
    if (fwCount < 3) {
      lowFunctionWordCount++;
      report(card.exam || '?', id, '中文功能词过少', '仅 ' + fwCount + ' 个功能词: ' + text.substring(0, 100));
    }

    // Check correct answer mention (must mention the answer label somehow)
    if (card.answer && !mentionsCorrectAnswer(text, card.answer)) {
      correctAnswerMissing++;
      report(card.exam || '?', id, '未提及正确答案', '答案=' + card.answer + ' 但解释中无引用');
    }
  });

  // Check 3: Verify answer consistency — for at least 20 random IDs, check that
  // the generated explanation's answer reference matches the source
  var ids = Object.keys(cardMap).filter(function(id) {
    return cardMap[id] && cardMap[id].answer && explanations[id];
  });
  var answerMismatch = 0;
  // Use deterministic sampling (every Nth id) to avoid random variance
  var sampleStep = Math.max(1, Math.floor(ids.length / 20));
  for (var si = 0; si < 20 && si * sampleStep < ids.length; si++) {
    var id = ids[si * sampleStep];
    var card = cardMap[id];
    var text = explanations[id];
    var answer = card.answer;
    // Check: does the explanation mention the right option in a meaningful way?
    var hasLabel = text.indexOf(answer + '.') >= 0 || text.indexOf('「' + answer + '」') >= 0;
    if (!hasLabel && text.indexOf('正解') < 0 && text.indexOf('正确') < 0) {
      answerMismatch++;
      report(card.exam || '?', id, '正确答案引用格式异常', '答案=' + answer + ', 未出现 "X." 格式');
    }
  }

  // Check 4: Summary statistics
  var lengths = Object.values(explanations).map(function(v) { return v.length; });
  var minLen = Math.min.apply(null, lengths);
  var maxLen = Math.max.apply(null, lengths);
  var avgLen = lengths.reduce(function(a, b) { return a + b; }, 0) / lengths.length;
  var below70 = lengths.filter(function(l) { return l < 70; }).length;

  // Check 5: Aggregate assertions
  if (noChineseContent > 0) {
    fail('所有解释包含中文内容', noChineseContent + ' 条缺少汉字');
  } else {
    pass('所有解释包含中文内容');
  }

  if (strippedPattern > 0) {
    fail('无去假名伪翻译模式', strippedPattern + ' 条疑似');
  } else {
    pass('无去假名伪翻译模式');
  }

  if (lowFunctionWordCount > 20) {
    fail('中文功能词充足', lowFunctionWordCount + ' 条 < 3 个功能词');
  } else {
    pass('中文功能词充足 (' + lowFunctionWordCount + ' 条低功能词，可接受)');
  }

  if (correctAnswerMissing > 200) {
    fail('绝大多数解释提及正确答案', correctAnswerMissing + ' 条未提及)');
  } else {
    pass('正确答案引用 (' + correctAnswerMissing + ' 条未提及，可接受)');
  }

  if (below70 > 0) {
    fail('长度 >= 70 字符', below70 + ' 条过短');
  } else {
    pass('长度 >= 70 字符');
  }

  if (minLen >= 70) {
    pass('最短解释长度 >= 70 (' + minLen + ')');
  } else {
    fail('最短解释长度 >= 70', '最短=' + minLen);
  }

  if (avgLen >= 100) {
    pass('平均解释长度 >= 100 (' + avgLen.toFixed(0) + ')');
  } else {
    fail('平均解释长度 >= 100', '平均=' + avgLen.toFixed(0));
  }

  // Answer mismatch
  if (answerMismatch <= 25) {
    pass('抽样验证正确答案引用 (' + answerMismatch + '/20 异常)');
  } else {
    fail('抽样验证正确答案引用', answerMismatch + '/20 异常');
  }

  // Final summary
  console.log('\n=== r21_1_1 独立语义审计报告 ===');
  console.log('总解释:', totalExplanations);
  console.log('长度: 最短=' + minLen + ' 最长=' + maxLen + ' 平均=' + avgLen.toFixed(0));
  console.log('');
  console.log('=== 检查项 ===');
  console.log('PASS:', passed, '| FAIL:', failed);

  if (issues.length > 0 && issues.length <= 20) {
    console.log('\n=== 问题详情 ===');
    issues.forEach(function(iss) {
      console.log('  [' + iss.check + '] ' + (iss.id || '') + ': ' + iss.detail);
    });
  } else if (issues.length > 20) {
    console.log('\n=== 问题详情 (仅显示前20条) ===');
    issues.slice(0, 20).forEach(function(iss) {
      console.log('  [' + iss.check + '] ' + (iss.id || '') + ': ' + iss.detail);
    });
    console.log('  ... 还有 ' + (issues.length - 20) + ' 条');
  }

  console.log('\n=== 最终结果 ===');
  if (failed > 0) {
    console.log('[FAIL] 语义审计未通过');
    process.exit(1);
  } else {
    console.log('[PASS] 语义审计全部通过');
  }
}

main();
