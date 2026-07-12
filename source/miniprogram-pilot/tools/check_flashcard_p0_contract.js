#!/usr/bin/env node
'use strict';

/*
 * Static P0 contract gate. This is intentionally not a substitute for
 * DevTools/true-device runtime evidence.
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var SENTINELS = [
  { dir: 'packages/quiz-itpass-1', course: 'itpass', yearId: '01_aki' },
  { dir: 'packages/quiz-sg-1', course: 'sg', yearId: 'sg_01_aki' }
];

function stripHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function isPlayable(question) {
  if (!question || !question.id || !stripHtml(question.questionJa)) return false;
  var options = Array.isArray(question.options) ? question.options : [];
  var answer = String(question.answerId || question.answer || '');
  if (options.length < 2 || !answer) return false;
  for (var i = 0; i < options.length; i++) {
    var option = options[i] || {};
    var key = String(option.id || option.key || String.fromCharCode(65 + i));
    if (!stripHtml(option.textJa || option.text)) return false;
    if (key === answer) return true;
  }
  return false;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkStaticEntrypoint() {
  var app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  var preload = app.preloadRule && app.preloadRule['pages/flashcards/flashcards'];
  var packages = preload && preload.packages ? preload.packages : [];
  assert(packages.indexOf('quiz-itpass-1') < 0 && packages.indexOf('quiz-sg-1') < 0,
    'Flashcard center still preloads data subpackages');

  var mainPage = fs.readFileSync(path.join(ROOT, 'pages/flashcards/flashcards.js'), 'utf8');
  assert(mainPage.indexOf('past_exam_bank') < 0, 'Main flashcard page references question-bank data');
  assert(mainPage.indexOf('flashcard_adapter') < 0, 'Main flashcard page references legacy adapter');
  assert(mainPage.indexOf('/packages/quiz/pages/exam-menu/') < 0, 'Main flashcard page retains legacy fallback route');

  var selectPage = fs.readFileSync(path.join(ROOT, 'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js'), 'utf8');
  assert(selectPage.indexOf('wx.loadSubPackage') >= 0, 'Deck select does not call real loadSubPackage');
  assert(selectPage.indexOf('installing shim') < 0 && selectPage.indexOf('__flashcard_cache') < 0,
    'Deck select contains forbidden runtime bridge/cache markers');
}

function checkSentinel(sentinel) {
  var base = path.join(ROOT, sentinel.dir);
  var manifest = require(path.join(base, 'data/deck-manifest'));
  var loader = require(path.join(base, 'data/loader'));
  var player = fs.readFileSync(path.join(base, 'pages/flashcard-player/flashcard-player.js'), 'utf8');
  var wxml = fs.readFileSync(path.join(base, 'pages/flashcard-player/flashcard-player.wxml'), 'utf8');

  assert(player.indexOf("viewState: 'loading'") >= 0, sentinel.dir + ': missing four-state view model');
  assert(player.indexOf('sourceCountExpected') >= 0 && player.indexOf('playableCountExpected') >= 0,
    sentinel.dir + ': missing count contract fields');
  assert(player.indexOf("require('../../data/loader')") >= 0,
    sentinel.dir + ': player does not use local loader');
  assert(wxml.indexOf("viewState === 'loading'") >= 0 && wxml.indexOf("viewState === 'error'") >= 0,
    sentinel.dir + ': WXML is not aligned with four-state model');

  var deckId = sentinel.course + '/' + sentinel.yearId;
  var deck = manifest.getDeckInfo(deckId);
  assert(deck, sentinel.dir + ': missing local deck ' + deckId);
  assert(Number.isFinite(deck.sourceCountExpected), sentinel.dir + ': invalid sourceCountExpected');
  assert(Number.isFinite(deck.playableCountExpected), sentinel.dir + ': invalid playableCountExpected');

  var source = loader.getQuestionsByYear(sentinel.course, sentinel.yearId);
  var playable = source.filter(isPlayable);
  assert(source.length === deck.sourceCountExpected,
    deckId + ': source mismatch actual=' + source.length + ' expected=' + deck.sourceCountExpected);
  assert(playable.length === deck.playableCountExpected,
    deckId + ': playable mismatch actual=' + playable.length + ' expected=' + deck.playableCountExpected);

  return {
    deckId: deckId,
    source: source.length,
    playable: playable.length,
    package: sentinel.dir
  };
}

try {
  checkStaticEntrypoint();
  var results = SENTINELS.map(checkSentinel);
  console.log('P0 static contract PASS');
  results.forEach(function (item) {
    console.log(item.deckId + ' | package=' + item.package + ' | source=' + item.source + ' | playable=' + item.playable);
  });
  process.exit(0);
} catch (error) {
  console.error('P0 static contract FAIL: ' + error.message);
  process.exit(1);
}
