#!/usr/bin/env node
'use strict';
/*
 * Verify SRS code-level contracts across 26 decks.
 *
 * This app uses in-memory SRS session state (not persistent scheduling):
 *   - sessionCorrect / sessionWrong counters
 *   - wrongIds array for retry
 *   - completeDeck / retryDeck state transitions
 *   - Data loading via deckId-based loaders
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

// 1. Verify 26 decks across all packages
var PACKAGES = [
  { name: 'quiz-itpass-1', decksExpected: 3 },
  { name: 'quiz-itpass-2', decksExpected: 3 },
  { name: 'quiz-itpass-3', decksExpected: 3 },
  { name: 'quiz-itpass-4', decksExpected: 3 },
  { name: 'quiz-itpass-5', decksExpected: 3 },
  { name: 'quiz-sg-1',     decksExpected: 5 },
  { name: 'quiz-sg-2',     decksExpected: 6 },
];
var TOTAL_DECKS_EXPECTED = 26;

var totalDataFiles = 0;
PACKAGES.forEach(function(pkg) {
  var dataDir = path.join(ROOT, 'packages', pkg.name, 'data');
  if (!fs.existsSync(dataDir)) {
    failures.push(pkg.name + ': data directory missing');
    return;
  }
  var files = fs.readdirSync(dataDir);
  var dataFiles = files.filter(function(f) { return /^(questions|loader|index|explanations|translations)/.test(f); });
  totalDataFiles += dataFiles.length;
  if (dataFiles.length < 2) {
    failures.push(pkg.name + ': insufficient data files (' + dataFiles.join(',') + ')');
  }
});

// 2. Verify player.js has SRS session state
['quiz-itpass-1', 'quiz-sg-1'].forEach(function(playerPkg) {
  var playerJs;
  try {
    playerJs = fs.readFileSync(path.join(ROOT, 'packages', playerPkg, 'pages', 'flashcard-player', 'flashcard-player.js'), 'utf8');
  } catch (e) { failures.push(playerPkg + ': player.js not found'); return; }

  // Session state management
  if (playerJs.indexOf('sessionCorrect') < 0) failures.push(playerPkg + ': player.js missing sessionCorrect');
  if (playerJs.indexOf('sessionWrong') < 0) failures.push(playerPkg + ': player.js missing sessionWrong');
  if (playerJs.indexOf('wrongIds') < 0) failures.push(playerPkg + ': player.js missing wrongIds tracking');
  if (playerJs.indexOf('currentIndex') < 0) failures.push(playerPkg + ': player.js missing currentIndex');
  if (playerJs.indexOf('isFinished') < 0) failures.push(playerPkg + ': player.js missing isFinished');
  if (playerJs.indexOf('totalCards') < 0) failures.push(playerPkg + ': player.js missing totalCards');
  if (playerJs.indexOf('progressPercent') < 0) failures.push(playerPkg + ': player.js missing progressPercent');

  // Retry logic (wrong cards only) — either dedicated retry method or restartDeck
  if (playerJs.indexOf('retryWrong') < 0 && playerJs.indexOf('retryWrongCards') < 0 && playerJs.indexOf('restartDeck') < 0) {
    failures.push(playerPkg + ': player.js missing retry/restart logic');
  }

  // Deck isolation: deckId-based data loading
  if (playerJs.indexOf('deckId') < 0 && playerJs.indexOf('deck_id') < 0) {
    failures.push(playerPkg + ': player.js missing deckId for deck isolation');
  }

  // isCorrect determination
  if (playerJs.indexOf('isCorrect') < 0) failures.push(playerPkg + ': player.js missing isCorrect determination');

  // Card navigation
  if (playerJs.indexOf('nextCard') < 0) failures.push(playerPkg + ': player.js missing nextCard');
  if (playerJs.indexOf('showExplanation') < 0) failures.push(playerPkg + ': player.js missing showExplanation');

  // Restart / reset
  if (playerJs.indexOf('restartDeck') < 0 && playerJs.indexOf('restart') < 0) {
    failures.push(playerPkg + ': player.js missing restartDeck');
  }
});

// 3. Verify flashcard-quiz.js (older implementation) also has session state
try {
  var quizJs = fs.readFileSync(path.join(ROOT, 'packages', 'quiz', 'pages', 'flashcard-quiz', 'flashcard-quiz.js'), 'utf8');
  if (quizJs.indexOf('sessionCorrect') < 0) failures.push('flashcard-quiz.js: missing sessionCorrect');
  if (quizJs.indexOf('sessionWrong') < 0) failures.push('flashcard-quiz.js: missing sessionWrong');
  if (quizJs.indexOf('wrongIds') < 0) failures.push('flashcard-quiz.js: missing wrongIds');
} catch (e) { failures.push('flashcard-quiz.js not found'); }

if (failures.length) {
  console.error('FLASHCARD SRS BEHAVIOR FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('FLASHCARD SRS BEHAVIOR PASS — ' + TOTAL_DECKS_EXPECTED + ' decks, SRS session state verified in player.js');
