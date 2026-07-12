#!/usr/bin/env node
'use strict';
/*
 * Validate that all 7 flashcard packages have bilingual textZh/explanationZh
 * data loaded through the translation pipeline.
 * Checks that loader.js (mergeTranslation) joins translations_zh + explanations_zh.
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
  var loaderPath = path.join(ROOT, 'packages', pkg, 'data', 'loader.js');
  var translationsPath = path.join(ROOT, 'packages', pkg, 'data', 'translations_zh.js');
  var explanationsPath = path.join(ROOT, 'packages', pkg, 'data', 'explanations_zh.js');

  // Loader must exist
  if (!fs.existsSync(loaderPath)) {
    failures.push(pkg + ': loader.js missing');
    return;
  }

  var loader = fs.readFileSync(loaderPath, 'utf8');

  // Must call mergeTranslation or mergeChinese
  if (loader.indexOf('mergeTranslation') < 0 && loader.indexOf('merge_translation') < 0 && loader.indexOf('mergeChinese') < 0) {
    failures.push(pkg + ': loader.js does not call mergeChinese/mergeTranslation');
  }

  // Must reference questions_zh or translations_zh
  if (loader.indexOf('questions_zh') < 0 && loader.indexOf('translations_zh') < 0) {
    failures.push(pkg + ': loader.js does not reference questions_zh');
  }

  // Must reference explanations_zh
  if (loader.indexOf('explanations_zh') < 0) {
    failures.push(pkg + ': loader.js does not reference explanations_zh');
  }

  // questions_zh.js or translations_zh.js must exist and have content
  var questionsZhPath = path.join(ROOT, 'packages', pkg, 'data', 'questions_zh.js');
  if (!fs.existsSync(translationsPath) && !fs.existsSync(questionsZhPath)) {
    failures.push(pkg + ': neither questions_zh.js nor translations_zh.js exist');
  } else {
    var srcPath = fs.existsSync(questionsZhPath) ? questionsZhPath : translationsPath;
    var tSize = fs.statSync(srcPath).size;
    if (tSize < 100) {
      failures.push(pkg + ': bilingual data file too small (' + tSize + ' bytes)');
    }
  }

  // explanations_zh.js must exist and have content
  if (!fs.existsSync(explanationsPath)) {
    failures.push(pkg + ': explanations_zh.js missing');
  } else {
    var eSize = fs.statSync(explanationsPath).size;
    if (eSize < 100) {
      failures.push(pkg + ': explanations_zh.js too small (' + eSize + ' bytes)');
    }
  }
});

// Verify normalizeCard produces textZh/explanationZh fields
var playerJs = fs.readFileSync(path.join(ROOT, 'packages', 'quiz-itpass-1', 'pages', 'flashcard-player', 'flashcard-player.js'), 'utf8');
if (playerJs.indexOf('textZh') < 0) failures.push('normalizeCard does not produce textZh');
if (playerJs.indexOf('hasTextZh') < 0) failures.push('normalizeCard does not produce hasTextZh');
if (playerJs.indexOf('explanationZh') < 0) failures.push('normalizeCard does not produce explanationZh');
if (playerJs.indexOf('hasExplanationZh') < 0) failures.push('normalizeCard does not produce hasExplanationZh');

// Verify WXML uses textZh/explanationZh bindings
var wxmlPath = path.join(ROOT, 'packages', 'quiz-itpass-1', 'pages', 'flashcard-player', 'flashcard-player.wxml');
var wxml = fs.readFileSync(wxmlPath, 'utf8');
['textZh', 'hasTextZh', 'explanationZh', 'hasExplanationZh'].forEach(function(field) {
  if (wxml.indexOf(field) < 0) {
    failures.push('flashcard-player.wxml does not bind ' + field);
  }
});

if (failures.length) {
  console.error('FLASHCARD FEEDBACK BILINGUAL FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('FLASHCARD FEEDBACK BILINGUAL PASS — all ' + PACKAGES.length + ' packages have bilingual pipeline');
