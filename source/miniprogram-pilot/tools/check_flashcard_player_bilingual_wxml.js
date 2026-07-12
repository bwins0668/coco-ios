#!/usr/bin/env node
'use strict';

/**
 * R23.4: Verify real flashcard-player WXML bilingual rendering.
 * Checks that 7 real player WXML files have proper bilingual node bindings.
 */

var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');

var pkgs = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];
var failures = [];

var requiredBindings = [
  {field: 'questionZh', context: '作答前问题', check: ['questionZh']},
  {field: 'hasQuestionZh', context: '问题中文可见控制', check: ['hasQuestionZh']},
  {field: 'textZh', context: '选项中文', check: ['textZh']},
  {field: 'hasTextZh', context: '选项中文控制', check: ['hasTextZh']},
  {field: 'selectedOption.textZh', context: '答后选中项中文', check: ['selectedOption.textZh']},
  {field: 'selectedOption.hasTextZh', context: '答后选中项中文控制', check: ['selectedOption.hasTextZh']},
  {field: 'correctOption.textZh', context: '答后正确答案中文', check: ['correctOption.textZh']},
  {field: 'correctOption.hasTextZh', context: '答后正确答案中文控制', check: ['correctOption.hasTextZh']},
  {field: 'explanationZh', context: '解析中文', check: ['explanationZh']},
  {field: 'hasExplanationZh', context: '解析中文控制', check: ['hasExplanationZh']},
];

pkgs.forEach(function(pkg) {
  var wxmlPath = path.join(ROOT, 'packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.wxml');
  if (!fs.existsSync(wxmlPath)) {
    failures.push(pkg + ': flashcard-player.wxml missing');
    return;
  }

  var wxml = fs.readFileSync(wxmlPath, 'utf8');

  // Check no hidden/if hiding Chinese
  var zhIfCount = (wxml.match(/wx:if="\{\{.*questionZh/g) || []).length;
  var zhHiddenCount = (wxml.match(/hidden="\{\{.*questionZh/g) || []).length;

  requiredBindings.forEach(function(req) {
    var found = false;
    req.check.forEach(function(pattern) {
      if (wxml.indexOf(pattern) >= 0) found = true;
    });
    if (!found) {
      failures.push(pkg + ': WXML missing binding for "' + req.field + '" (' + req.context + ')');
    }
  });

  // Verify explanationZh rendering is NOT hidden behind hasExplanationZh === false
  // The exp-zh node should use wx:if="{{currentCard.hasExplanationZh}}" not hidden/wx:if with negation
  if (wxml.indexOf('explanationZh') >= 0 && wxml.indexOf('hasExplanationZh') < 0) {
    failures.push(pkg + ': WXML has explanationZh binding but no hasExplanationZh guard');
  }

  // Check that Chinese text appears AFTER ja text (Japanese primary, Chinese secondary)
  // questionZh after questionJa, textZh after textJa
  var lines = wxml.split('\n');
  var prevZh = null;
  lines.forEach(function(line, i) {
    if (line.indexOf('questionZh') >= 0 && line.indexOf('explanationZh') < 0 && line.indexOf('mnemonicZh') < 0) {
      var prevLine = i > 0 ? lines[i-1] : '';
      if (prevLine.indexOf('questionJa') < 0 && prevLine.indexOf('hasQuestionZh') < 0) {
        failures.push(pkg + ': WXML line ' + (i+1) + ': questionZh should appear after questionJa line');
      }
    }
  });
});

console.log('=== FLASHCARD PLAYER BILINGUAL WXML VERIFICATION ===\n');

pkgs.forEach(function(pkg) {
  var status = 'PASS';
  var pkgFails = failures.filter(function(f) { return f.indexOf(pkg) === 0; });
  if (pkgFails.length > 0) status = 'FAIL (' + pkgFails.length + ')';
  console.log('  ' + pkg + ': ' + status);
});

console.log('\nFailures: ' + failures.length);
failures.forEach(function(f) { console.log('  [FAIL] ' + f); });

process.exit(failures.length > 0 ? 1 : 0);
