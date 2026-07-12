#!/usr/bin/env node
'use strict';

/**
 * R23.4: Full runtime bilingual data integrity check.
 * Verifies that every flashcard card at runtime has complete bilingual data
 * (questionJa + questionZh, option textJa + textZh, explanation).
 * Loads through real loader pipeline (questions_zh.js + explanations_zh.js).
 */

var path = require('path');
var ROOT = path.resolve(__dirname, '..');

var kana = /[぀-ゟ゠-ヿ]/;
var pkgs = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

var totalCards = 0;
var questionZhOk = 0;
var questionZhMissing = 0;
var questionZhMixed = 0;
var optionZhOk = 0;
var optionZhMissing = 0;
var optionZhMixed = 0;
var explanationZhOk = 0;
var explanationZhMissing = 0;
var japaneseFallback = 0;
var bindingErrors = 0;

var report = {};

pkgs.forEach(function(pkg) {
  var loader;
  try {
    loader = require('../packages/' + pkg + '/data/loader');
  } catch(e) {
    report[pkg] = {error: 'loader not loaded: ' + e.message};
    bindingErrors++;
    return;
  }

  var years = Object.keys(loader.questionsByYear || {});
  var pkgReport = {};
  var pkgCards = 0, pkgQzhOk = 0, pkgQzhMissing = 0, pkgOzhOk = 0, pkgOzhMissing = 0, pkgEzhOk = 0;

  years.forEach(function(year) {
    var questions;
    try {
      questions = loader.getQuestionsByYear('', year);
    } catch(e) {
      pkgReport[year] = {error: e.message};
      return;
    }

    questions.forEach(function(q) {
      totalCards++;
      pkgCards++;

      // questionZh
      var hasQZh = !!(q.questionZh && q.questionZh.length >= 1 && q.questionZh !== q.questionJa);
      var qHasKana = kana.test(q.questionZh || '');
      if (hasQZh && !qHasKana) { questionZhOk++; pkgQzhOk++; }
      else if (qHasKana) { questionZhMixed++; }
      else { questionZhMissing++; pkgQzhMissing++; japaneseFallback++; }
 
      // options
      (q.options || []).forEach(function(o) {
        var jaHasKana = kana.test(o.textJa || '');
        var hasOZh = !!(o.textZh && o.textZh.length >= 1 && (o.textZh !== o.textJa || !jaHasKana));
        if (!o.textZh && !jaHasKana) {
          hasOZh = true;
        }
        var oHasKana = kana.test(o.textZh || '');
        if (hasOZh && !oHasKana) { optionZhOk++; pkgOzhOk++; }
        else if (oHasKana) { optionZhMixed++; }
        else { optionZhMissing++; pkgOzhMissing++; japaneseFallback++; }
      });
 
      // explanation
      var hasEZh = !!(q.explanationZh && q.explanationZh.length >= 1 && q.explanationZh !== q.explanationJa);
      if (hasEZh) { explanationZhOk++; pkgEzhOk++; }
      else { explanationZhMissing++; japaneseFallback++; }
    });
 
    pkgReport[year] = {cards: questions.length};
  });
 
  report[pkg] = {
    years: pkgReport,
    total: pkgCards,
    qZhOk: pkgQzhOk,
    qZhMissing: pkgQzhMissing,
    oZhOk: pkgOzhOk,
    oZhMissing: pkgOzhMissing,
    eZhOk: pkgEzhOk
  };
});
 
console.log('=== FLASHCARD RUNTIME BILINGUAL DATA INTEGRITY ===\n');
console.log(JSON.stringify(report, null, 2));
console.log('\n=== Aggregates ===');
console.log('totalCards: ' + totalCards);
console.log('questionZhOk: ' + questionZhOk);
console.log('questionZhMissing: ' + questionZhMissing);
console.log('questionZhMixed(kana): ' + questionZhMixed);
console.log('optionZhOk: ' + optionZhOk);
console.log('optionZhMissing: ' + optionZhMissing);
console.log('optionZhMixed(kana): ' + optionZhMixed);
console.log('explanationZhOk: ' + explanationZhOk);
console.log('explanationZhMissing: ' + explanationZhMissing);
console.log('japaneseFallbackCount: ' + japaneseFallback);
console.log('bindingErrorCount: ' + bindingErrors);
 
var hasFailures = bindingErrors > 0 || questionZhMissing > 0 || optionZhMissing > 0 || explanationZhMissing > 0 || japaneseFallback > 0;
 
console.log('\n=== Verdict ===');
if (hasFailures) {
  console.log('FAIL');
  process.exit(1);
} else {
  console.log('PASS');
  process.exit(0);
}

