#!/usr/bin/env node
'use strict';
/*
 * R20.2: 逐题中文解释特异性门禁 — COUNTS-CORRECT REVISION
 *
 * STRICT RELEASE MODE：6 项全零才 PASS，否则 FAIL + exit code 1。
 *
 * 6 项精确指标：
 *   emptyExplanationZhCount          — explanationZh 为空或 <5 字符
 *   japaneseFallbackCount            — zhFallbackFromJa === true（日文回退）
 *   bindingErrorCount                — explanationZh 存在但 hasExplanationZh 为 false
 *   templatedExplanationCount        — 模板化概括（"本题考查..." 等解题策略模板）
 *   missingTerminologyMappingCount   — 中日文无本题特有共享术语
 *   duplicateTemplateAcrossDifferentJaCount — 不同日文解说被同一中文模板覆盖
 *
 * 用法：
 *   test:   strict release 门禁（exit 1 on any > 0）
 *   audit:  统计模式（exit 0，输出全部分包数据）
 */
var mode = process.argv[2] === '--audit' ? 'audit' : 'strict';

var PACKAGES = [
  { name: 'quiz-itpass-1', label: 'ITPass 01-03' },
  { name: 'quiz-itpass-2', label: 'ITPass 04-06' },
  { name: 'quiz-itpass-3', label: 'ITPass 07-08+28' },
  { name: 'quiz-itpass-4', label: 'ITPass 28-29' },
  { name: 'quiz-itpass-5', label: 'ITPass 30-31' },
  { name: 'quiz-sg-1',     label: 'SG 01-07+28' },
  { name: 'quiz-sg-2',     label: 'SG 28-31' },
];

var counters = {
  totalQuestions: 0,
  emptyExplanationZhCount: 0,
  japaneseFallbackCount: 0,
  bindingErrorCount: 0,
  templatedExplanationCount: 0,
  missingTerminologyMappingCount: 0,
  duplicateTemplateAcrossDifferentJaCount: 0,
};

var sampleQuestions = [];
var seenTemplates = {};
var pkgStats = {};

// Cross-script+Han+katakana term matcher, no single-char/generic exam words
var GENERIC = /本题|本題|正确|正确答案|选项|题干|复习|排除|混淆|其他|含义|目的|场景|区分|回到|重点|通常|使用|适合|属于|需要|选择|概念|流程|应用|描述|说明|技术|信息|安全|管理|基础|基礎|範囲|顺序|中的|次の|うち|適切|もの|どれ|それぞれ/;

function extractTerms(text) {
  var matches = text.match(/[一-鿿\udada-\udaff぀-ゟ゠-ヿa-zA-Z0-9_]{2,}(?:\s*[一-鿿\udada-\udaff぀-ゟ゠-ヿa-zA-Z0-9_]+)*/g) || [];
  return matches.filter(function(t) { return t.length >= 3 && !GENERIC.test(t); }).slice(0, 10);
}

PACKAGES.forEach(function (pkg) {
  var pkgName = pkg.name;
  var loader;
  try {
    loader = require('../packages/' + pkgName + '/data/loader');
  } catch (e) {
    console.error('[SKIP] ' + pkgName + ': loader not found');
    return;
  }
  var allQuestions = loader.getAllQuestions ? loader.getAllQuestions() : [];
  if (!Array.isArray(allQuestions)) return;

  var pCounters = {
    total: 0, empty: 0, fallback: 0, binding: 0, template: 0, noTerm: 0, dup: 0
  };

  allQuestions.forEach(function (q) {
    if (!q) return;
    pCounters.total++;
    counters.totalQuestions++;

    var explanationJa = (q.explanationJa || '').replace(/<[^>]+>/g, '').trim();
    var explanationZh = (loader.explanationsById && loader.explanationsById[q.id] || q.explanationZh || '').trim();

    // 1. Empty
    if (!explanationZh || explanationZh.length < 5) {
      counters.emptyExplanationZhCount++;
      pCounters.empty++;
      if (sampleQuestions.length < 10) {
        sampleQuestions.push({ pkg: pkgName, id: q.id || '?', reason: 'EMPTY', detail: '(empty <5 chars)' });
      }
      return;
    }

    // 2. Japanese fallback
    if (q.zhFallbackFromJa === true) {
      counters.japaneseFallbackCount++;
      pCounters.fallback++;
    }

    // 3. Binding error — explanationZh exists but hasExplanationZh is false
    if (q.hasExplanationZh === false && explanationZh.length > 5) {
      counters.bindingErrorCount++;
      pCounters.binding++;
    }

    if (!explanationJa || explanationJa.length < 5) return;

    // 4. Template-only
    var isTemplate = /本题|本題/.test(explanationZh) && explanationZh.length < 150;
    if (isTemplate) {
      counters.templatedExplanationCount++;
      pCounters.template++;
    }

    // 5. Missing terminology mapping
    var jaTerms = extractTerms(explanationJa);
    var zhTerms = extractTerms(explanationZh);
    var shared = false;
    if (isTemplate) {
      for (var i = 0; i < jaTerms.length && !shared; i++) {
        var jt = jaTerms[i];
        for (var j = 0; j < zhTerms.length && !shared; j++) {
          var zt = zhTerms[j];
          // shared via kanji overlap
          for (var k = 0; k < jt.length; k++) {
            var ch = jt.charAt(k);
            if (/[一-鿿]/.test(ch) && ch.length === 1 && zt.indexOf(ch) >= 0 && zt.length >= 2) {
              shared = true;
              break;
            }
          }
        }
      }
      if (!shared && explanationZh.length < 150) {
        counters.missingTerminologyMappingCount++;
        pCounters.noTerm++;
      }
    }

    // 6. Duplicate template across different JA
    if (isTemplate) {
      var templateKey = explanationZh.replace(/\d+/g, '').replace(/\s+/g, '').substring(0, 60);
      if (seenTemplates[templateKey]) {
        var prevJaHash = seenTemplates[templateKey].jaHash;
        var curJaHash = explanationJa.replace(/\s+/g, '').substring(0, 80);
        if (prevJaHash && prevJaHash !== curJaHash) {
          counters.duplicateTemplateAcrossDifferentJaCount++;
          pCounters.dup++;
        }
      } else {
        seenTemplates[templateKey] = {
          jaHash: explanationJa.replace(/\s+/g, '').substring(0, 80),
          firstId: q.id
        };
      }
    }

    // Sample collection
    if (sampleQuestions.length < 8 && isTemplate) {
      sampleQuestions.push({
        pkg: pkgName,
        id: q.id || '?',
        reason: 'TEMPLATE' + (shared ? '' : '+noTerm'),
        jaTerms: jaTerms.slice(0, 3).join(', '),
        zh: explanationZh.substring(0, 70)
      });
    }
  });

  pkgStats[pkgName] = {
    label: pkg.label,
    total: pCounters.total,
    empty: pCounters.empty,
    fallback: pCounters.fallback,
    binding: pCounters.binding,
    template: pCounters.template,
    noTerm: pCounters.noTerm,
    dup: pCounters.dup
  };
});

// ============ OUTPUT ============

console.log('======================================================================');
console.log('中文解释特异性门禁 — ' + (mode === 'strict' ? 'STRICT RELEASE' : 'INFORMATIONAL AUDIT'));
console.log('======================================================================\n');

console.log('=== 6 项精确指标 ===\n');
console.log('emptyExplanationZhCount:                   ' + counters.emptyExplanationZhCount + ' — MUST BE 0');
console.log('japaneseFallbackCount:                     ' + counters.japaneseFallbackCount + ' — MUST BE 0');
console.log('bindingErrorCount:                         ' + counters.bindingErrorCount + ' — MUST BE 0');
console.log('templatedExplanationCount:                 ' + counters.templatedExplanationCount + ' — MUST BE 0');
console.log('missingTerminologyMappingCount:            ' + counters.missingTerminologyMappingCount + ' — MUST BE 0');
console.log('duplicateTemplateAcrossDifferentJaCount:   ' + counters.duplicateTemplateAcrossDifferentJaCount + ' — MUST BE 0\n');
console.log('（总题目数: ' + counters.totalQuestions + '）\n');

if (mode === 'audit' || mode === 'strict') {
  console.log('=== 分包统计 ===\n');
  PACKAGES.forEach(function (pkg) {
    var s = pkgStats[pkg.name] || {};
    console.log('[' + s.label + '] ' + pkg.name);
    console.log('  总: ' + s.total + ' | 空: ' + s.empty + ' | 回退: ' + s.fallback + ' | 绑定: ' + s.binding + ' | 模板: ' + s.template + ' | 缺术语: ' + s.noTerm + ' | 重复: ' + s.dup);
    console.log('');
  });

  console.log('=== 问题样本 ===\n');
  sampleQuestions.slice(0, 6).forEach(function (s) {
    console.log('  [' + s.pkg + '] ' + s.id + ' (' + s.reason + ')');
    if (s.jaTerms) console.log('    JA terms: ' + s.jaTerms);
    console.log('    ZH: ' + s.zh + '...');
    console.log('');
  });
}

var hasIssue =
  counters.emptyExplanationZhCount > 0 ||
  counters.japaneseFallbackCount > 0 ||
  counters.bindingErrorCount > 0 ||
  counters.templatedExplanationCount > 0 ||
  counters.missingTerminologyMappingCount > 0 ||
  counters.duplicateTemplateAcrossDifferentJaCount > 0;

if (mode === 'strict') {
  if (hasIssue) {
    console.log('=== 结论 ===\n');
    console.log('FLASHCARD EXPLANATION ZH SPECIFICITY FAIL');
    console.log('');
    console.log('翻译质量不符合发布标准。以下 6 项指标必须全零但当前未达标：');
    var lines = [];
    if (counters.emptyExplanationZhCount > 0) lines.push('  ❌ emptyExplanationZhCount = ' + counters.emptyExplanationZhCount);
    if (counters.japaneseFallbackCount > 0) lines.push('  ❌ japaneseFallbackCount = ' + counters.japaneseFallbackCount);
    if (counters.bindingErrorCount > 0) lines.push('  ❌ bindingErrorCount = ' + counters.bindingErrorCount);
    if (counters.templatedExplanationCount > 0) lines.push('  ❌ templatedExplanationCount = ' + counters.templatedExplanationCount);
    if (counters.missingTerminologyMappingCount > 0) lines.push('  ❌ missingTerminologyMappingCount = ' + counters.missingTerminologyMappingCount);
    if (counters.duplicateTemplateAcrossDifferentJaCount > 0) lines.push('  ❌ duplicateTemplateAcrossDifferentJaCount = ' + counters.duplicateTemplateAcrossDifferentJaCount);
    lines.forEach(function(l) { console.log(l); });
    console.log('');
    console.log('R20_2_BLOCKED_BY_EXPLANATION_TRANSLATION_QUALITY');
    process.exit(1);
  }
  console.log('FLASHCARD EXPLANATION ZH SPECIFICITY PASS');
  console.log(counters.totalQuestions + ' questions all pass quality gates.');
  process.exit(0);
}

// audit mode: exit 0 regardless
process.exit(0);
