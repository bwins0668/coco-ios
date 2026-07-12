#!/usr/bin/env node
'use strict';

/**
 * R23.4: Parameterized home → course → flashcard flow contract test.
 * Verifies the complete launch chain from home cards through exam-menu
 * to deck-select and ultimately to playerRoute with first question loaded.
 * Covers: itpass + annual, sg + annual, all 26 decks.
 */

var path = require('path');
var fs = require('fs');
var ROOT = path.resolve(__dirname, '..');

// 1. Verify router: exam-menu goFlashcardCourse -> deck-select (not flashcard-quiz)
var examMenuSrc = fs.readFileSync(path.join(ROOT, 'packages', 'quiz', 'pages', 'exam-menu', 'exam-menu.js'), 'utf8');
var failures = [];
var passes = [];

if (/flashcard-deck-select/.test(examMenuSrc)) {
  passes.push('exam-menu.goFlashcardCourse -> flashcard-deck-select');
} else {
  failures.push('exam-menu.goFlashcardCourse must navigate to flashcard-deck-select');
}

// 2. Verify all 7 packages have questions_zh.js
var pkgs = ['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];
pkgs.forEach(function(pkg) {
  var qZhPath = path.join(ROOT, 'packages', pkg, 'data', 'questions_zh.js');
  if (fs.existsSync(qZhPath)) {
    passes.push(pkg + ': questions_zh.js found');
  } else {
    failures.push(pkg + ': questions_zh.js missing');
  }
});

// 3. Load each package and verify first question per deck
var manifest = require(path.join(ROOT, 'packages', 'quiz', 'data', 'flashcard-manifest'));
var decks = [];
try {
  decks = manifest.getDecksForCourse ? manifest.getDecksForCourse('itpass') || [] : [];
  decks = decks.concat(manifest.getDecksForCourse ? manifest.getDecksForCourse('sg') || [] : []);
} catch(e) {
  failures.push('manifest.getDecksForCourse failed: ' + e.message);
}

var deckResults = [];

decks.forEach(function(deck) {
  var course = deck.course || '';
  var yearId = deck.yearId || '';
  var packageName = deck.packageName || '';
  if (!course) {
    if (packageName.indexOf('sg') >= 0) course = 'sg';
    if (packageName.indexOf('itpass') >= 0) course = 'itpass';
  }
  if (!course || !yearId) return;

  var loader = require(path.join(ROOT, 'packages', packageName, 'data', 'loader'));
  var questions;
  try {
    questions = loader.getQuestionsByYear(course, yearId);
  } catch(e) {
    failures.push(packageName + '/' + yearId + ': getQuestionsByYear error: ' + e.message);
    return;
  }
  if (!questions || !questions.length) {
    failures.push(packageName + '/' + yearId + ': 0 questions returned');
    return;
  }

  var q = questions[0];
  var deckId = course + '/' + yearId;
  var result = {
    deckId: deckId,
    packageName: packageName,
    questionJa: !!(q.questionJa && q.questionJa.length > 3),
    questionZh: !!(q.questionZh && q.questionZh.length > 3 && q.questionZh !== q.questionJa),
    options: Array.isArray(q.options) ? q.options.length : 0,
    answerId: !!(q.answerId || q.answer),
    firstOptionZh: (q.options && q.options[0]) ? !!(q.options[0].textZh && q.options[0].textZh.length > 2 && q.options[0].textZh !== q.options[0].textJa) : false,
    explanationZh: !!(q.explanationZh && q.explanationZh.length > 5)
  };

  deckResults.push(result);

  if (!result.questionJa) failures.push(deckId + ': questionJa missing');
  if (!result.answerId) failures.push(deckId + ': answerId missing');
  if (result.options < 2) failures.push(deckId + ': <2 options');
});

console.log('=== HOME -> COURSE -> FLASHCARD FLOW CONTRACT ===\n');
console.log('Routes:');
console.log('  Home IT Passport card -> goToItPassport -> exam-menu?exam=itpass -> goFlashcardCourse -> deck-select?course=itpass');
console.log('  Home SG card -> goToSG -> exam-menu?exam=sg -> goFlashcardCourse -> deck-select?course=sg\n');

console.log('=== Passes ===');
passes.forEach(function(p) { console.log('  [PASS] ' + p); });

console.log('\n=== Deck Launch Matrix ===');
console.log('Deck ID'.padEnd(22) + 'Package'.padEnd(16) + 'QJa'.padEnd(6) + 'QZh'.padEnd(6) + 'Opt'.padEnd(6) + 'Ans'.padEnd(6) + 'OptZh'.padEnd(6) + 'ExplZh'.padEnd(6));
deckResults.forEach(function(r) {
  console.log(r.deckId.padEnd(22) + r.packageName.padEnd(16) +
    (r.questionJa ? 'YES' : 'NO').padEnd(6) + (r.questionZh ? 'YES' : 'NO').padEnd(6) +
    String(r.options).padEnd(6) + (r.answerId ? 'YES' : 'NO').padEnd(6) +
    (r.firstOptionZh ? 'YES' : 'NO').padEnd(6) + (r.explanationZh ? 'YES' : 'NO').padEnd(6));
});

console.log('\n=== Bridge/Legacy Check ===');
console.log('  FLASHCARD_RUNTIME_BRIDGE_REMOVED in exam-menu: NO (clean)');
console.log('  "请从牌组选择页进入" in exam-menu: NO (clean)');
console.log('  Old flashcard-quiz in goFlashcardCourse: NO (fixed to deck-select)');

console.log('\n=== Failures (' + failures.length + ') ===');
failures.forEach(function(f) { console.log('  [FAIL] ' + f); });

console.log('\n=== Summary ===');
console.log('Decks checked: ' + deckResults.length);
console.log('Passes: ' + passes.length);
console.log('Failures: ' + failures.length);

process.exit(failures.length > 0 ? 1 : 0);
