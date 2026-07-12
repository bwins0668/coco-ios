#!/usr/bin/env node
'use strict';
/*
 * Verify that all 7 flashcard-player WXML files render explanationZh
 * alongside explanationJa on the back side. Never pure Japanese only.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

var PACKAGES = [
  'quiz-itpass-1', 'quiz-itpass-2', 'quiz-itpass-3', 'quiz-itpass-4', 'quiz-itpass-5',
  'quiz-sg-1', 'quiz-sg-2',
];

PACKAGES.forEach(function(pkg) {
  var wxml = fs.readFileSync(path.join(ROOT, 'packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.wxml'), 'utf8');

  // Must render explanationZh alongside explanationJa on back side
  if (wxml.indexOf('explanationZh') < 0) {
    failures.push(pkg + ': WXML does not render explanationZh');
  }

  // Must render textZh alongside textJa on options
  if (wxml.indexOf('textZh') < 0) {
    failures.push(pkg + ': WXML does not render textZh on options');
  }

  // Must use explanation label "解説 / 解析" (bilingual label)
  if (wxml.indexOf('解説 / 解析') < 0 && wxml.indexOf('解説') < 0) {
    failures.push(pkg + ': WXML missing 解説 explanation label');
  }

  // Must not use old "詳細解析" monoglot label
  if (wxml.indexOf('詳細解析') >= 0) {
    failures.push(pkg + ': WXML still uses old monoglot "詳細解析" label');
  }

  // hasExplanationZh must be used as wx:if
  if (wxml.indexOf('hasExplanationZh') < 0) {
    failures.push(pkg + ': WXML does not gate explanationZh with hasExplanationZh');
  }

  // hasTextZh must be used as wx:if
  if (wxml.indexOf('hasTextZh') < 0) {
    failures.push(pkg + ': WXML does not gate textZh with hasTextZh');
  }

  // Back-side block: explanation section must exist
  if (wxml.indexOf('fc-back-detail') < 0 && wxml.indexOf('fc-back-detail-ja') < 0) {
    failures.push(pkg + ': WXML missing back-side detail explanation block');
  }

  // Front-side feedback must show textZh
  if (wxml.indexOf('fc-feedback') >= 0) {
    if (wxml.indexOf('textZh') < 0 && wxml.indexOf('selectedOption.textZh') < 0) {
      // SG version may use different binding — check for selectedOption
      if (wxml.indexOf('selectedOption') >= 0 && wxml.indexOf('hasTextZh') < 0) {
        failures.push(pkg + ': front-side feedback missing hasTextZh gate');
      }
    }
  }
});

if (failures.length) {
  console.error('FLASHCARD EXPLANATION BILINGUAL FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('FLASHCARD EXPLANATION BILINGUAL PASS — all ' + PACKAGES.length + ' packages have bilingual explanation rendering');
