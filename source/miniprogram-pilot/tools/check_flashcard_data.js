#!/usr/bin/env node
// tools/check_flashcard_data.js
// Validates flashcard data adapter output for completeness and correctness.
// v2: Rejects pseudo-bilingual content (Japanese masquerading as Chinese).
// Usage: node tools/check_flashcard_data.js

var path = require('path');
var adapterPath = path.join(__dirname, '..', 'packages', 'quiz', 'data', 'flashcard_adapter.js');

// Mock wx for Node.js environment
if (typeof global.wx === 'undefined') {
  global.wx = {
    getStorageSync: function () { return null; },
    setStorageSync: function () {}
  };
}

var adapter;
try {
  adapter = require(adapterPath);
} catch (e) {
  console.error('[FAIL] Cannot load flashcard_adapter.js:', e.message);
  process.exit(1);
}

var EXAMS = ['itpass', 'sg'];
var totalIssues = 0;
var totalCards = 0;
var totalFiltered = 0;

function hasJapaneseKana(text) {
  if (!text) return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function isGenuineChinese(text) {
  if (!text || text.length < 3) return false;
  var hasChinese = false;
  var hasKana = false;
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0x4E00 && c <= 0x9FFF) hasChinese = true;
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF)) hasKana = true;
  }
  if (hasChinese && !hasKana) return true;
  if (hasChinese) {
    var chineseCount = 0;
    var kanaCount = 0;
    for (var j = 0; j < text.length; j++) {
      var cc = text.charCodeAt(j);
      if (cc >= 0x4E00 && cc <= 0x9FFF) chineseCount++;
      if ((cc >= 0x3040 && cc <= 0x309F) || (cc >= 0x30A0 && cc <= 0x30FF)) kanaCount++;
    }
    return chineseCount > kanaCount * 3;
  }
  return false;
}

function report(exam, stats) {
  console.log('\n=== ' + exam.toUpperCase() + ' ===');
  console.log('  Raw questions loaded:    ' + stats.total);
  console.log('  After normalization:     ' + stats.normalized);
  console.log('  Filtered out:            ' + stats.filtered);
  console.log('  After dedup:             ' + stats.deduped);
  console.log('  Dedup removed:           ' + stats.dedupCount);
  console.log('  Content status:');
  console.log('    Japanese only:         ' + (stats.contentStatus.japanese_only || 0));
  console.log('    Bilingual partial:     ' + (stats.contentStatus.bilingual_partial || 0));
  console.log('    Bilingual complete:    ' + (stats.contentStatus.bilingual_complete || 0));

  var yearKeys = Object.keys(stats.byYear);
  console.log('  Years:');
  for (var i = 0; i < yearKeys.length; i++) {
    console.log('    ' + yearKeys[i] + ': ' + stats.byYear[yearKeys[i]] + ' questions');
  }

  var catKeys = Object.keys(stats.categories);
  if (catKeys.length > 0) {
    console.log('  Categories:');
    for (var j = 0; j < catKeys.length; j++) {
      console.log('    ' + catKeys[j] + ': ' + stats.categories[catKeys[j]] + ' questions');
    }
  }

  totalCards += stats.deduped;
  totalFiltered += stats.filtered;
}

function validateCard(card) {
  var issues = [];
  var warnings = [];

  // Basic structural validation
  if (!card.id || typeof card.id !== 'string') {
    issues.push('Missing or invalid id');
  }
  if (!card.course || (card.course !== 'itpass' && card.course !== 'sg')) {
    issues.push('Invalid course: ' + card.course);
  }
  if (!card.questionJa || card.questionJa.length < 2) {
    issues.push('Missing or too short questionJa');
  }
  if (!card.answer) {
    issues.push('Missing answer key');
  }
  if (card.sourceType === 'past_exam_japanese' && !card.examYear) {
    issues.push('Missing examYear for past exam question');
  }

  // Options validation
  if (!Array.isArray(card.options) || card.options.length < 2) {
    issues.push('Insufficient options: ' + (card.options ? card.options.length : 0));
  } else {
    var correctCount = 0;
    for (var i = 0; i < card.options.length; i++) {
      var opt = card.options[i];
      if (!opt.key) issues.push('Option ' + i + ' missing key');
      if (!opt.textJa || opt.textJa.length < 1) {
        issues.push('Option ' + opt.key + ' missing textJa');
      }
      if (opt.isCorrect) correctCount++;
    }
    if (correctCount !== 1) {
      issues.push('Expected exactly 1 correct answer, found ' + correctCount);
    }
  }

  // Pseudo-bilingual detection
  if (card.contentStatus === 'bilingual_complete') {
    // Check questionZh is genuine Chinese
    if (!card.questionZh || card.questionZh === card.questionJa) {
      issues.push('bilingual_complete but questionZh is same as questionJa');
    } else if (!isGenuineChinese(card.questionZh)) {
      issues.push('bilingual_complete but questionZh is not genuine Chinese');
    }

    // Check options have genuine Chinese
    if (card.options) {
      for (var j = 0; j < card.options.length; j++) {
        var o = card.options[j];
        if (!o.textZh || o.textZh === o.textJa) {
          issues.push('bilingual_complete but option ' + o.key + ' textZh is same as textJa');
        } else if (!isGenuineChinese(o.textZh)) {
          issues.push('bilingual_complete but option ' + o.key + ' textZh is not genuine Chinese');
        }
        if (!o.explanationJa || o.explanationJa.length < 5) {
          warnings.push('bilingual_complete but option ' + o.key + ' missing explanationJa');
        }
        if (!o.explanationZh || o.explanationZh.length < 5) {
          warnings.push('bilingual_complete but option ' + o.key + ' missing explanationZh');
        }
      }
    }

    // Check explanations
    if (!card.explanationZh || card.explanationZh === card.explanationJa) {
      issues.push('bilingual_complete but explanationZh is same as explanationJa');
    } else if (!isGenuineChinese(card.explanationZh)) {
      issues.push('bilingual_complete but explanationZh is not genuine Chinese');
    }

    // Check mnemonics
    if (!card.mnemonicJa && !card.mnemonicZh) {
      warnings.push('bilingual_complete but no mnemonics');
    }
  }

  // Warnings for japanese_only
  if (card.contentStatus === 'japanese_only') {
    if (card.questionZh && card.questionZh !== card.questionJa && isGenuineChinese(card.questionZh)) {
      warnings.push('japanese_only but has genuine Chinese questionZh');
    }
  }

  return { issues: issues, warnings: warnings };
}

function getFlashcardDeckForNode(exam) {
  var packages = [];
  if (exam === 'itpass') {
    packages = ['quiz-itpass-1', 'quiz-itpass-2', 'quiz-itpass-3', 'quiz-itpass-4', 'quiz-itpass-5'];
  } else {
    packages = ['quiz-sg-1', 'quiz-sg-2'];
  }

  var rawQuestions = [];
  packages.forEach(function (pkg) {
    var loaderPath = path.join(__dirname, '..', 'packages', pkg, 'data', 'loader.js');
    // Clear require cache for reliability
    var absPath = path.resolve(loaderPath);
    delete require.cache[absPath];
    var loader = require(loaderPath);
    var questions = loader.getAllQuestions();
    rawQuestions = rawQuestions.concat(questions);
  });

  var stats = {
    total: rawQuestions.length,
    normalized: 0,
    filtered: 0,
    deduped: 0,
    dedupCount: 0,
    contentStatus: {
      japanese_only: 0,
      bilingual_partial: 0,
      bilingual_complete: 0
    },
    byYear: {},
    categories: {}
  };

  var normalizedCards = [];
  rawQuestions.forEach(function (raw) {
    var card = adapter.normalizeQuestion(raw);
    if (!card) {
      stats.filtered++;
      return;
    }
    stats.normalized++;
    normalizedCards.push(card);
  });

  var dedupedCards = adapter.dedupeCards(normalizedCards);
  stats.deduped = dedupedCards.length;
  stats.dedupCount = normalizedCards.length - dedupedCards.length;

  dedupedCards.forEach(function (card) {
    var status = adapter.detectContentStatus(card);
    stats.contentStatus[status] = (stats.contentStatus[status] || 0) + 1;

    var year = card.examYear || 'Unknown';
    stats.byYear[year] = (stats.byYear[year] || 0) + 1;

    var cat = card.category || 'Unknown';
    stats.categories[cat] = (stats.categories[cat] || 0) + 1;
  });

  return {
    cards: dedupedCards,
    stats: stats
  };
}

console.log('=== Flashcard Data Validation ===');
console.log('Adapter: ' + adapterPath);

var allIssues = [];
var allWarnings = [];
var idSet = {};
var duplicateIds = 0;

for (var e = 0; e < EXAMS.length; e++) {
  var exam = EXAMS[e];
  var deck = getFlashcardDeckForNode(exam);

  report(exam, deck.stats);

  for (var c = 0; c < deck.cards.length; c++) {
    var card = deck.cards[c];
    if (idSet[card.id]) {
      duplicateIds++;
    }
    idSet[card.id] = true;

    var result = validateCard(card);
    if (result.issues.length > 0) {
      allIssues.push({ id: card.id, issues: result.issues });
    }
    if (result.warnings.length > 0) {
      allWarnings.push({ id: card.id, warnings: result.warnings });
    }
  }
}

console.log('\n=== Summary ===');
console.log('Total flashcard questions: ' + totalCards);
console.log('Total filtered out:        ' + totalFiltered);
console.log('Duplicate IDs found:       ' + duplicateIds);
console.log('Cards with issues:         ' + allIssues.length);
console.log('Cards with warnings:       ' + allWarnings.length);

if (allIssues.length > 0) {
  console.log('\n=== Issues (first 50) ===');
  var shown = Math.min(allIssues.length, 50);
  for (var k = 0; k < shown; k++) {
    console.log('  ' + allIssues[k].id + ':');
    for (var m = 0; m < allIssues[k].issues.length; m++) {
      console.log('    - ' + allIssues[k].issues[m]);
    }
  }
  if (allIssues.length > 50) {
    console.log('  ... and ' + (allIssues.length - 50) + ' more');
  }
}

if (allWarnings.length > 0) {
  console.log('\n=== Warnings (first 30) ===');
  var shownW = Math.min(allWarnings.length, 30);
  for (var w = 0; w < shownW; w++) {
    console.log('  ' + allWarnings[w].id + ':');
    for (var w2 = 0; w2 < allWarnings[w].warnings.length; w2++) {
      console.log('    - ' + allWarnings[w].warnings[w2]);
    }
  }
}

console.log('\n=== Pass Criteria ===');
var pass = duplicateIds === 0 && allIssues.length === 0;
if (pass) {
  console.log('PASS');
} else {
  console.log('FAIL: ' + allIssues.length + ' cards have validation issues');
  process.exit(1);
}

process.exit(0);
