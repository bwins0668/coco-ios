#!/usr/bin/env node
'use strict';

var path = require('path');
var common = require('./r6_6_contract_common');

var root = common.parseRootArg(process.argv.slice(2));
var inventory = common.loadRoutes(root);
var registered = common.registeredRouteSet(inventory.routes);
var errors = [];
var passes = [];

function fail(scope, message) { errors.push(scope + ': ' + message); }
function pass(scope, message) { passes.push(scope + ': ' + message); }

function mustContain(scope, text, pattern, message) {
  if (pattern.test(text)) pass(scope, message);
  else fail(scope, message);
}

function loadModule(rel) {
  return require(path.join(root, rel));
}

global.wx = global.wx || {
  getStorageSync: function () { return null; },
  setStorageSync: function () {},
  removeStorageSync: function () {}
};

var reviewWxml = common.readSafe(root, 'pages/review/review.wxml');
var reviewJs = common.readSafe(root, 'pages/review/review.js');
var glossaryWxml = common.readSafe(root, 'pages/glossary/glossary.wxml');
var glossaryJs = common.readSafe(root, 'pages/glossary/glossary.js');
var navigationJs = common.readSafe(root, 'utils/navigation.js');

mustContain('review entry', reviewWxml, /bindtap=["']goFlashcards["']/, 'Review tab exposes real flashcard entry');
mustContain('review entry', reviewJs, /goFlashcards\s*:\s*function[\s\S]*nav\.goFlashcards/, 'Review handler uses navigation intent');
mustContain('glossary entry', glossaryWxml, /bindtap=["']goToAnkiPlayer["']/, 'Glossary tab exposes Anki/flashcard entry');
mustContain('glossary entry', glossaryJs, /goToAnkiPlayer\s*:\s*function[\s\S]*nav\.goGlossaryAnkiReview/, 'Glossary handler uses navigation intent');
mustContain('navigation intents', navigationJs, /FLASHCARDS:\s*['"]\/pages\/flashcards\/flashcards['"]/, 'navigation intent targets Flashcard Center');
mustContain('navigation intents', navigationJs, /goGlossaryAnkiReview[\s\S]*anki-player\/anki-player\?from=glossary/, 'navigation intent targets glossary Anki player');

var flashcardsJson = common.readJsonSafe(root, 'pages/flashcards/flashcards.json') || {};
var flashcardsWxml = common.readSafe(root, 'pages/flashcards/flashcards.wxml');
var flashcardsJs = common.readSafe(root, 'pages/flashcards/flashcards.js');
if (flashcardsJson.navigationStyle === 'custom') pass('flashcard center', 'custom navigation');
else fail('flashcard center', 'navigationStyle must be custom');
mustContain('flashcard center', flashcardsWxml, /data-secondary-route=["']pages\/flashcards\/flashcards["']/, 'has secondary back marker');
mustContain('flashcard center', flashcardsWxml, /wx:for=["']{{courses}}["'][\s\S]*bindtap=["']openCourse["']/, 'renders real courses from state');
mustContain('flashcard center', flashcardsJs, /flashcardsState\.getFlashcardsLandingState\(\)/, 'loads real landing state');
if (common.hasForbiddenFakeContent(flashcardsWxml + flashcardsJs)) fail('flashcard center', 'contains fake/mock flashcard content');
else pass('flashcard center', 'no fake/mock content strings');

try {
  var flashcardsState = loadModule('utils/flashcards-state.js');
  var state = flashcardsState.getFlashcardsLandingState();
  if (state.itpassCount > 0 && state.sgCount > 0 && Array.isArray(state.courses) && state.courses.length >= 2) {
    pass('flashcard center data', 'landing state has non-empty IT/SG counts');
  } else {
    fail('flashcard center data', 'landing state missing non-empty IT/SG course counts');
  }
} catch (error) {
  fail('flashcard center data', 'cannot load landing state: ' + error.message);
}

var deckJson = common.readJsonSafe(root, 'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.json') || {};
var deckWxml = common.readSafe(root, 'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.wxml');
var deckJs = common.readSafe(root, 'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js');
if (deckJson.navigationStyle === 'custom') pass('deck select', 'custom navigation');
else fail('deck select', 'navigationStyle must be custom');
mustContain('deck select', deckWxml, /data-secondary-route=["']packages\/quiz\/pages\/flashcard-deck-select\/flashcard-deck-select["']/, 'has secondary back marker');
mustContain('deck select', deckWxml, /wx:for=["']{{decks}}["'][\s\S]*bindtap=["']selectDeck["']/, 'renders real deck list');
mustContain('deck select', deckWxml, /wx:elif=["']{{loadError}}["']|wx:if=["']{{loadError}}["']/, 'has honest error state');
mustContain('deck select', deckJs, /manifest\.getDecksForCourse/, 'loads deck list from real manifest');
mustContain('deck select', deckJs, /buildPlayerUrl[\s\S]*deckId/, 'builds player URL with real deckId');
mustContain('deck select', deckJs, /secondaryNav\.back/, 'goBack uses secondaryNav fallback');

try {
  var manifest = loadModule('packages/quiz/data/flashcard-manifest.js');
  ['itpass', 'sg'].forEach(function (course) {
    var decks = manifest.getDecksForCourse(course);
    if (!Array.isArray(decks) || decks.length === 0) {
      fail('deck manifest ' + course, 'no decks returned');
      return;
    }
    var first = decks[0];
    var info = manifest.getDeckInfo(course, first.yearId);
    if (!info || !info.playerRoute) {
      fail('deck manifest ' + course, 'first deck has no player route');
      return;
    }
    if (!registered[common.stripQuery(info.playerRoute)]) {
      fail('deck manifest ' + course, 'player route not registered: ' + info.playerRoute);
    } else {
      pass('deck manifest ' + course, 'first deck player route registered');
    }
  });
} catch (error2) {
  fail('deck manifest', 'cannot load manifest: ' + error2.message);
}

var playerRoutes = inventory.secondaryRoutes.filter(function (info) {
  return /packages\/quiz-(itpass|sg)-\d\/pages\/flashcard-player\/flashcard-player$/.test(info.route);
});
playerRoutes.forEach(function (info) {
  var scope = info.route;
  var cfg = common.readJsonSafe(root, scope + '.json') || {};
  var wxml = common.readSafe(root, scope + '.wxml');
  var js = common.readSafe(root, scope + '.js');
  var questionBindingCount = (wxml.match(/currentCard\.questionJa/g) || []).length;
  if (cfg.navigationStyle === 'custom') pass(scope, 'custom navigation');
  else fail(scope, 'navigationStyle must be custom');
  mustContain(scope, wxml, /data-secondary-route=["'][^"']+flashcard-player\/flashcard-player["']/, 'has secondary back marker');
  mustContain(scope, wxml, /viewState === 'content'[\s\S]*currentCard[\s\S]*currentCard\.questionJa/, 'content state renders currentCard question');
  if (questionBindingCount >= 2) pass(scope, 'front/back currentCard question bindings');
  else fail(scope, 'front/back currentCard question bindings');
  mustContain(scope, wxml, /wx:for=["']{{currentCard\.options}}["'][\s\S]*selectAnswer/, 'renders currentCard options');
  mustContain(scope, wxml, /viewState === 'empty'[\s\S]*goBack/, 'empty state has return path');
  mustContain(scope, wxml, /viewState === 'error'[\s\S]*goBack/, 'error state has return path');
  mustContain(scope, js, /currentCard:\s*cards\[0\]/, 'non-empty deck sets currentCard from real cards');
  mustContain(scope, js, /playableCountActual\s*===\s*0[\s\S]*viewState:\s*'empty'/, 'empty deck state is explicit');
  mustContain(scope, js, /secondaryNav\.back/, 'goBack uses secondaryNav fallback');
  if (common.hasForbiddenFakeContent(wxml + js)) fail(scope, 'contains fake/mock flashcard content');
});

var ankiJson = common.readJsonSafe(root, 'packages/glossary/pages/anki-player/anki-player.json') || {};
var ankiWxml = common.readSafe(root, 'packages/glossary/pages/anki-player/anki-player.wxml');
var ankiJs = common.readSafe(root, 'packages/glossary/pages/anki-player/anki-player.js');
if (ankiJson.navigationStyle === 'custom') pass('anki player', 'custom navigation');
else fail('anki player', 'navigationStyle must be custom');
mustContain('anki player', ankiWxml, /data-secondary-route=["']packages\/glossary\/pages\/anki-player\/anki-player["']/, 'has secondary back marker');
mustContain('anki player', ankiWxml, /currentTerm\.term[\s\S]*currentTerm\.zh/, 'renders real currentTerm front/back fields');
mustContain('anki player', ankiWxml, /empty-section[\s\S]*(暂无待复习术语|错题本空空如也)/, 'has honest empty state');
mustContain('anki player', ankiJs, /glossaryIndex|glossaryData/, 'loads real glossary data');
mustContain('anki player', ankiJs, /secondaryNav\.back/, 'goBack uses secondaryNav fallback');

console.log('=== R6.6B Flashcard Center Contract ===');
console.log('Root: ' + root);
console.log('Flashcard player routes: ' + playerRoutes.length);
console.log('');
console.log('Results: ' + passes.length + ' passed, ' + errors.length + ' failed');
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(function (error) { console.log('  - ' + error); });
  console.log('\n[FAIL] R6.6B flashcard center contract');
  process.exit(1);
}
console.log('\n[PASS] R6.6B flashcard center contract');
