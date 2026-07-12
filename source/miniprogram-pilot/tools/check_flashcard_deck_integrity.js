#!/usr/bin/env node
'use strict';

/*
 * Formal per-deck count contract.
 * source = local loader output for one deck.
 * playable = cards usable by that same deck player after validation and
 * per-deck dedupe. It never performs the legacy cross-year global-id dedupe.
 */
var fs = require('fs');
var path = require('path');
var PROJECT = path.resolve(__dirname, '..');
var JSON_MODE = process.argv.indexOf('--json') >= 0;
var app = JSON.parse(fs.readFileSync(path.join(PROJECT, 'app.json'), 'utf8'));
var subpackages = (app.subpackages || []).reduce(function (map, item) {
  map[item.name] = item;
  return map;
}, {});
var globalManifest = require(path.join(PROJECT, 'packages/quiz/data/flashcard-manifest.js'));
var courses = ['itpass', 'sg'];
var rows = [];
var issues = [];
var totals = { sourceExpected: 0, sourceActual: 0, playableExpected: 0, playableActual: 0 };

function log() {
  if (!JSON_MODE) console.log.apply(console, arguments);
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function normalizeForCount(raw) {
  if (!raw || !raw.id) return { card: null, reason: 'missing_id' };
  if (!stripHtml(raw.questionJa)) return { card: null, reason: 'missing_question_ja' };
  var sourceOptions = Array.isArray(raw.options) ? raw.options : [];
  if (sourceOptions.length < 2) return { card: null, reason: 'fewer_than_two_options' };
  var answerId = String(raw.answerId || raw.answer || '');
  if (!answerId) return { card: null, reason: 'missing_answer_id' };
  var matchedAnswer = false;
  for (var i = 0; i < sourceOptions.length; i++) {
    var option = sourceOptions[i] || {};
    var key = String(option.id || option.key || String.fromCharCode(65 + i));
    if (!stripHtml(option.textJa || option.text)) return { card: null, reason: 'missing_option_ja' };
    if (key === answerId) matchedAnswer = true;
  }
  if (!matchedAnswer) return { card: null, reason: 'answer_not_in_options' };
  return { card: { id: String(raw.id) }, reason: '' };
}

function countPlayable(deckId, source) {
  var seen = Object.create(null);
  var reasons = Object.create(null);
  var playable = 0;
  for (var i = 0; i < source.length; i++) {
    var result = normalizeForCount(source[i]);
    if (!result.card) {
      reasons[result.reason] = (reasons[result.reason] || 0) + 1;
      continue;
    }
    // Do not dedupe across years. The deck is part of the identity.
    var key = deckId + '::' + result.card.id;
    if (seen[key]) {
      reasons.duplicate_in_deck = (reasons.duplicate_in_deck || 0) + 1;
      continue;
    }
    seen[key] = true;
    playable++;
  }
  return { playable: playable, reasons: reasons };
}

function loadLocal(packageRoot) {
  try {
    return {
      manifest: require(path.join(PROJECT, packageRoot, 'data/deck-manifest.js')),
      loader: require(path.join(PROJECT, packageRoot, 'data/loader.js'))
    };
  } catch (error) {
    return { error: error };
  }
}

function playerCheck(packageName, packageRoot) {
  var subpackage = subpackages[packageName];
  if (!subpackage) return 'SUBPACKAGE_NOT_REGISTERED';
  if ((subpackage.pages || []).indexOf('pages/flashcard-player/flashcard-player') < 0) return 'PLAYER_PAGE_MISSING';
  var base = path.join(PROJECT, packageRoot, 'pages/flashcard-player/flashcard-player');
  var extensions = ['.js', '.wxml', '.wxss', '.json'];
  for (var i = 0; i < extensions.length; i++) {
    if (!fs.existsSync(base + extensions[i])) return 'PLAYER_FILE_MISSING:' + extensions[i];
  }
  return '';
}

log('=== Flashcard Deck Integrity Check (formal source + playable contract) ===');

courses.forEach(function (course) {
  var decks = globalManifest.getDecksForCourse(course);
  log('\n--- ' + course.toUpperCase() + ' (' + decks.length + ' decks) ---');
  decks.forEach(function (deck) {
    var deckId = course + '/' + deck.yearId;
    var packageRoot = deck.packageRoot || ('packages/' + deck.packageName);
    var routeIssue = playerCheck(deck.packageName, packageRoot);
    var local = loadLocal(packageRoot);
    var localDeck = local.manifest && local.manifest.getDeckInfo ? local.manifest.getDeckInfo(deckId) : null;
    var source = local.loader && local.loader.getQuestionsByYear ? local.loader.getQuestionsByYear(course, deck.yearId) : [];
    var sourceActual = Array.isArray(source) ? source.length : 0;
    var counted = countPlayable(deckId, Array.isArray(source) ? source : []);
    var sourceExpected = localDeck && Number(localDeck.sourceCountExpected);
    var playableExpected = localDeck && Number(localDeck.playableCountExpected);
    var status = 'OK';

    if (routeIssue) status = 'FAIL:' + routeIssue;
    else if (local.error) status = 'FAIL:LOCAL_PACKAGE_LOAD:' + local.error.message;
    else if (!localDeck) status = 'FAIL:LOCAL_DECK_NOT_FOUND';
    else if (!Number.isFinite(sourceExpected) || !Number.isFinite(playableExpected)) status = 'FAIL:COUNT_CONTRACT_MISSING';
    else if (sourceExpected !== Number(deck.count || 0)) status = 'FAIL:GLOBAL_SOURCE_MISMATCH';
    else if (sourceActual !== sourceExpected) status = 'FAIL:SOURCE_MISMATCH';
    else if (counted.playable !== playableExpected) status = 'FAIL:PLAYABLE_MISMATCH';
    else if (playableExpected <= 0) status = 'FAIL:PLAYABLE_ZERO';

    if (status !== 'OK') issues.push({ deckId: deckId, status: status, reasons: counted.reasons });
    totals.sourceExpected += Number(sourceExpected || 0);
    totals.sourceActual += sourceActual;
    totals.playableExpected += Number(playableExpected || 0);
    totals.playableActual += counted.playable;

    var row = {
      course: course,
      deckId: deckId,
      yearLabel: deck.label,
      packageName: deck.packageName,
      sourceExpected: sourceExpected,
      sourceActual: sourceActual,
      playableExpected: playableExpected,
      playableActual: counted.playable,
      dropped: sourceActual - counted.playable,
      reasons: counted.reasons,
      status: status
    };
    rows.push(row);
    log('  ' + deckId + ' | ' + deck.packageName + ' | source=' + sourceExpected + '/' + sourceActual + ' playable=' + playableExpected + '/' + counted.playable + ' dropped=' + row.dropped + ' | ' + status);
  });
});

if (!JSON_MODE) {
  log('\n=== Summary ===');
  log('Total decks: ' + rows.length);
  log('Total source expected/actual: ' + totals.sourceExpected + '/' + totals.sourceActual);
  log('Total playable expected/actual: ' + totals.playableExpected + '/' + totals.playableActual);
  log('Issues: ' + issues.length);
  if (issues.length) {
    log('=== Issue details ===');
    issues.forEach(function (item) { log('  ' + item.deckId + ' | ' + item.status + ' | ' + JSON.stringify(item.reasons)); });
  }
}

if (JSON_MODE) {
  console.log(JSON.stringify({ ok: issues.length === 0, totals: totals, issues: issues, decks: rows }, null, 2));
}
process.exit(issues.length ? 1 : 0);
