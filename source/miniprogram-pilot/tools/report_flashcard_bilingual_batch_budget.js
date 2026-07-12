#!/usr/bin/env node
'use strict';

/*
 * Read-only size forecast for one future checked bilingual deck batch.
 * It never changes production data and labels the estimate as mechanical,
 * not as a semantic-quality signal.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var LIMIT = 2 * 1024 * 1024;
var args = process.argv.slice(2);
var course = 'itpass';
var yearId = '01_aki';
for (var i = 0; i < args.length; i++) {
  if (args[i] === '--course') course = String(args[++i] || course);
  if (args[i] === '--year') yearId = String(args[++i] || yearId);
}

function bytes(target) {
  if (!fs.existsSync(target)) return 0;
  var stat = fs.statSync(target);
  if (stat.isFile()) return stat.size;
  return fs.readdirSync(target).reduce(function (total, name) {
    if (name === '.git' || name === 'node_modules') return total;
    return total + bytes(path.join(target, name));
  }, 0);
}
function mb(value) { return (value / 1024 / 1024).toFixed(3); }
function strip(value) { return String(value || '').replace(/<[^>]+>/g, '').trim(); }
function optionId(option, index) { return String(option && (option.id || option.key) || String.fromCharCode(65 + index)); }

var manifest = require(path.join(ROOT, 'packages/quiz/data/flashcard-manifest.js'));
var deck = manifest.getDeckInfo(course, yearId);
if (!deck) {
  console.error('Deck not found: ' + course + '/' + yearId);
  process.exit(1);
}
var packageRoot = deck.packageRoot || ('packages/' + deck.packageName);
var questions = require(path.join(ROOT, packageRoot, 'data/questions.js')).questionsByYear[yearId] || [];
var playable = questions.filter(function (raw) {
  var options = raw.options || [];
  var answer = String(raw.answerId || raw.answer || '');
  return !!raw.id && !!strip(raw.questionJa) && options.length >= 2 && options.some(function (option, index) {
    return optionId(option, index) === answer && !!strip(option.textJa || option.text);
  });
});

var sourceChars = 0;
var structuralRows = playable.map(function (raw) {
  var deckId = course + '/' + yearId;
  var options = (raw.options || []).map(function (option, index) {
    var textJa = strip(option.textJa || option.text);
    sourceChars += textJa.length;
    return { optionId: optionId(option, index), textJa: textJa, textZh: '', explanationJa: '', explanationZh: '' };
  });
  var questionJa = strip(raw.questionJa);
  var explanationJa = strip(raw.explanationJa);
  sourceChars += questionJa.length + explanationJa.length;
  return {
    cardKey: deckId + ':' + raw.id,
    deckId: deckId,
    rawCardId: raw.id,
    sourceHash: '0'.repeat(64),
    questionJa: questionJa,
    questionZh: '',
    options: options,
    answerId: String(raw.answerId || raw.answer || ''),
    explanationJa: explanationJa,
    explanationZh: '',
    translationStatus: 'ai_generated_checked',
    generatedAt: '2026-06-24T00:00:00.000Z',
    reviewedAt: '2026-06-24T00:00:00.000Z',
    reviewResult: 'pass'
  };
});
var structuralBytes = Buffer.byteLength(JSON.stringify(structuralRows), 'utf8');
// Conservative mechanical estimate: structured payload + a Chinese text budget
// approximately equal to source Japanese text UTF-8 bytes plus 15% review/meta slack.
var ChineseBudgetBytes = Buffer.byteLength('中'.repeat(sourceChars), 'utf8');
var projectedBatchBytes = Math.ceil((structuralBytes + ChineseBudgetBytes) * 1.15);
var packageBytes = bytes(path.join(ROOT, packageRoot));
var projectedPackageBytes = packageBytes + projectedBatchBytes;
var legacyTranslationBytes = bytes(path.join(ROOT, packageRoot, 'data', 'translations_zh.js'));
var explanationBytes = bytes(path.join(ROOT, packageRoot, 'data', 'explanations_zh.js'));

console.log('=== Bilingual Batch Budget (mechanical forecast) ===');
console.log('deckId=' + course + '/' + yearId);
console.log('package=' + deck.packageName);
console.log('currentPackage=' + mb(packageBytes) + ' MiB');
console.log('playable=' + playable.length);
console.log('currentLegacyTranslation=' + mb(legacyTranslationBytes) + ' MiB');
console.log('currentExplanation=' + mb(explanationBytes) + ' MiB');
console.log('structuredRecordBaseline=' + mb(structuralBytes) + ' MiB');
console.log('estimatedCheckedBatch=' + mb(projectedBatchBytes) + ' MiB');
console.log('projectedPackage=' + mb(projectedPackageBytes) + ' MiB');
console.log('hardLimit=' + mb(LIMIT) + ' MiB');
console.log('risk=' + (projectedPackageBytes > LIMIT ? 'OVER_LIMIT_SPLIT_REQUIRED' : 'WITHIN_LIMIT_ESTIMATE'));
console.log('note=Estimate is mechanical only; semantic review remains a separate gate.');
process.exit(projectedPackageBytes > LIMIT ? 1 : 0);
