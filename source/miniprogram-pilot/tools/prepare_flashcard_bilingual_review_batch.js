#!/usr/bin/env node
'use strict';

/*
 * Creates a semantic-review work bundle for exactly one formal deck.
 * It does not translate, fabricate Chinese text, or alter production data.
 * The generated bundle is keyed by deckId:rawCardId and includes the source
 * hash required by the V3 bilingual gate.
 *
 * Usage:
 *   node tools/prepare_flashcard_bilingual_review_batch.js --course itpass --year 01_aki
 */
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var course = 'itpass';
var yearId = '01_aki';

for (var i = 0; i < args.length; i++) {
  if (args[i] === '--course') course = String(args[++i] || '');
  if (args[i] === '--year') yearId = String(args[++i] || '');
}
if (!course || !yearId) {
  console.error('Usage: --course itpass|sg --year <yearId>');
  process.exit(2);
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
function optionId(option, index) {
  return String(option && (option.id || option.key) || String.fromCharCode(65 + index));
}
function answerId(raw) {
  return String(raw && (raw.answerId || raw.answer) || '');
}
function payload(deckId, raw) {
  return {
    deckId: deckId,
    rawCardId: String(raw.id || ''),
    questionJa: stripHtml(raw.questionJa || ''),
    options: (raw.options || []).map(function (option, index) {
      return {
        optionId: optionId(option, index),
        textJa: stripHtml(option.textJa || option.text || '')
      };
    }),
    answerId: answerId(raw),
    explanationJa: stripHtml(raw.explanationJa || '')
  };
}
function isPlayable(raw) {
  var data = payload('', raw);
  if (!data.rawCardId || !data.questionJa || data.options.length < 2 || !data.answerId) return false;
  return data.options.some(function (option) { return option.optionId === data.answerId && !!option.textJa; });
}
function sourceHash(deckId, raw) {
  return crypto.createHash('sha256').update(JSON.stringify(payload(deckId, raw)), 'utf8').digest('hex');
}

var manifest = require(path.join(ROOT, 'packages/quiz/data/flashcard-manifest.js'));
var deck = manifest.getDeckInfo(course, yearId);
if (!deck) {
  console.error('Deck not found: ' + course + '/' + yearId);
  process.exit(1);
}
var packageRoot = deck.packageRoot || ('packages/' + deck.packageName);
var questionsByYear = require(path.join(ROOT, packageRoot, 'data/questions.js')).questionsByYear || {};
var rawDeck = questionsByYear[yearId] || [];
var deckId = course + '/' + yearId;
var records = [];

rawDeck.forEach(function (raw) {
  if (!isPlayable(raw)) return;
  var cardPayload = payload(deckId, raw);
  records.push({
    cardKey: deckId + ':' + cardPayload.rawCardId,
    deckId: deckId,
    rawCardId: cardPayload.rawCardId,
    sourceHash: sourceHash(deckId, raw),
    questionJa: cardPayload.questionJa,
    questionZh: '',
    options: cardPayload.options.map(function (option) {
      return {
        optionId: option.optionId,
        textJa: option.textJa,
        textZh: '',
        explanationJa: '',
        explanationZh: ''
      };
    }),
    answerId: cardPayload.answerId,
    explanationJa: cardPayload.explanationJa,
    explanationZh: '',
    translationStatus: 'japanese_only',
    generatedAt: null,
    reviewedAt: null,
    reviewResult: 'needs_revision'
  });
});

var outputDir = path.join(ROOT, 'tools', 'review-batches');
fs.mkdirSync(outputDir, { recursive: true });
var output = path.join(outputDir, course + '__' + yearId + '__semantic-review.json');
fs.writeFileSync(output, JSON.stringify({
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  deckId: deckId,
  packageName: deck.packageName,
  sourceCount: rawDeck.length,
  playableCount: records.length,
  records: records
}, null, 2) + '\n', 'utf8');
console.log('REVIEW_BATCH_CREATED');
console.log('deckId=' + deckId);
console.log('package=' + deck.packageName);
console.log('source=' + rawDeck.length);
console.log('playable=' + records.length);
console.log('file=' + output);
