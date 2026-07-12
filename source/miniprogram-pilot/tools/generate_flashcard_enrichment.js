#!/usr/bin/env node
// tools/generate_flashcard_enrichment.js
// Generates bilingual enrichment data for flashcard questions.
// Reads raw questions and generates Chinese translations, option explanations, and mnemonics.
// Usage: node tools/generate_flashcard_enrichment.js [--course itpass|sg] [--year yearId] [--limit N]

var path = require('path');
var fs = require('fs');

// Mock wx
if (typeof global.wx === 'undefined') {
  global.wx = {
    getStorageSync: function () { return null; },
    setStorageSync: function () {}
  };
}

var adapter = require('../packages/quiz/data/flashcard_adapter');

// Parse args
var args = process.argv.slice(2);
var course = 'itpass';
var yearFilter = '';
var limit = 50;

for (var i = 0; i < args.length; i++) {
  if (args[i] === '--course' && args[i + 1]) course = args[++i];
  if (args[i] === '--year' && args[i + 1]) yearFilter = args[++i];
  if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[++i], 10);
}

console.log('=== Flashcard Enrichment Generator ===');
console.log('Course: ' + course);
console.log('Year filter: ' + (yearFilter || 'all'));
console.log('Limit: ' + limit);
console.log('');

// Get deck
var deck = adapter.getFlashcardDeck(course);
var cards = deck.cards;

if (yearFilter) {
  cards = cards.filter(function (c) { return c.yearId === yearFilter; });
}

console.log('Available cards: ' + cards.length);

// Filter to japanese_only cards only
var jpOnlyCards = cards.filter(function (c) { return c.contentStatus === 'japanese_only'; });
console.log('Japanese only cards: ' + jpOnlyCards.length);

// Take first N
var toEnrich = jpOnlyCards.slice(0, limit);
console.log('Cards to enrich: ' + toEnrich.length);
console.log('');

// Generate enrichment for each card
var enrichments = {};

function generateChineseTranslation(jaText) {
  // Simple translation patterns for IT terminology
  // This is a placeholder - in production, this would call an AI API
  if (!jaText) return '';
  
  // For now, return a marker that this needs real translation
  return '[ZH] ' + jaText.substring(0, 50) + '...';
}

function generateOptionExplanation(opt, isCorrect) {
  // Generate explanation for why this option is correct or incorrect
  var prefix = isCorrect ? '此选项正确。' : '此选项错误。';
  return prefix + '根据题意分析，该选项' + (isCorrect ? '符合' : '不符合') + '题目要求。';
}

function generateMnemonic(question, answer) {
  // Generate a mnemonic for remembering the answer
  return '关键点：注意' + answer + '选项的核心概念。';
}

for (var j = 0; j < toEnrich.length; j++) {
  var card = toEnrich[j];
  var sourceId = card.sourceId;
  
  // Generate enrichment
  var enrich = {
    questionZh: generateChineseTranslation(card.questionJa),
    options: [],
    explanationJa: card.explanationJa || generateChineseTranslation(card.questionJa),
    explanationZh: generateChineseTranslation(card.explanationJa || card.questionJa),
    mnemonicJa: generateMnemonic(card.questionJa, card.answer),
    mnemonicZh: generateChineseTranslation(generateMnemonic(card.questionJa, card.answer)),
    contentStatus: 'bilingual_partial',
    contentOrigin: 'ai_assisted',
    reviewStatus: 'pending'
  };
  
  // Generate option translations and explanations
  for (var k = 0; k < card.options.length; k++) {
    var opt = card.options[k];
    enrich.options.push({
      textZh: generateChineseTranslation(opt.textJa),
      explanationJa: generateOptionExplanation(opt, opt.isCorrect),
      explanationZh: generateChineseTranslation(generateOptionExplanation(opt, opt.isCorrect))
    });
  }
  
  enrichments[sourceId] = enrich;
}

// Write enrichment chunk
var chunkName = 'enrichment_' + (yearFilter || 'all') + '_' + Date.now();
var outputPath = path.join(__dirname, '..', 'packages', 'quiz', 'data', 'flashcard-enrichment', course, chunkName + '.js');

var content = '// Auto-generated enrichment chunk\n';
content += 'module.exports = ' + JSON.stringify(enrichments, null, 2) + ';\n';

fs.writeFileSync(outputPath, content, 'utf8');
console.log('Written: ' + outputPath);
console.log('Enrichments: ' + Object.keys(enrichments).length);
console.log('');
console.log('Sample enrichment:');
var sampleId = Object.keys(enrichments)[0];
if (sampleId) {
  console.log('  ID: ' + sampleId);
  console.log('  questionZh: ' + enrichments[sampleId].questionZh.substring(0, 80));
  console.log('  contentStatus: ' + enrichments[sampleId].contentStatus);
}
