#!/usr/bin/env node
// tools/report_flashcard_inventory.js
// Generates a comprehensive flashcard inventory report with conservation assertions.
// Usage: node tools/report_flashcard_inventory.js

var path = require('path');

// Mock wx for Node.js
if (typeof global.wx === 'undefined') {
  global.wx = {
    getStorageSync: function () { return null; },
    setStorageSync: function () {}
  };
}

var adapter;
try {
  adapter = require('../packages/quiz/data/flashcard_adapter');
} catch (e) {
  console.error('[FAIL] Cannot load flashcard_adapter.js:', e.message);
  process.exit(1);
}

var pastExamIndex;
try {
  pastExamIndex = require('../packages/quiz/data/past_exam_bank/index');
} catch (e) {
  console.error('[FAIL] Cannot load past_exam_bank/index.js:', e.message);
  process.exit(1);
}

var EXAMS = ['itpass', 'sg'];
var allStats = {};

function analyzeCourse(exam) {
  var years = pastExamIndex.getYears(exam);
  var deck = adapter.getFlashcardDeck(exam);

  // Actual raw count loaded from split packages
  var rawLoaded = deck.stats.total;

  // Normalized count (after basic filtering)
  var normalizedCount = deck.stats.normalized;

  // Deduped count
  var dedupedCount = deck.stats.deduped;

  // Content status breakdown
  var contentStats = deck.stats.contentStatus || {};
  var jpOnly = contentStats.japanese_only || 0;
  var biPartial = contentStats.bilingual_partial || 0;
  var biComplete = contentStats.bilingual_complete || 0;

  // By year
  var byYear = {};
  for (var y = 0; y < deck.cards.length; y++) {
    var yk = deck.cards[y].examYear || deck.cards[y].yearId || 'unknown';
    if (!byYear[yk]) byYear[yk] = { total: 0, jpOnly: 0, biPartial: 0, biComplete: 0 };
    byYear[yk].total++;
    var cs = deck.cards[y].contentStatus;
    if (cs === 'japanese_only') byYear[yk].jpOnly++;
    else if (cs === 'bilingual_partial') byYear[yk].biPartial++;
    else if (cs === 'bilingual_complete') byYear[yk].biComplete++;
  }

  // By category
  var byCategory = {};
  for (var c = 0; c < deck.cards.length; c++) {
    var ck = deck.cards[c].category || 'unknown';
    if (!byCategory[ck]) byCategory[ck] = { total: 0, jpOnly: 0, biPartial: 0, biComplete: 0 };
    byCategory[ck].total++;
    var cs2 = deck.cards[c].contentStatus;
    if (cs2 === 'japanese_only') byCategory[ck].jpOnly++;
    else if (cs2 === 'bilingual_partial') byCategory[ck].biPartial++;
    else if (cs2 === 'bilingual_complete') byCategory[ck].biComplete++;
  }

  // By sourceType
  var bySourceType = {};
  for (var s = 0; s < deck.cards.length; s++) {
    var sk = deck.cards[s].sourceType || 'unknown';
    if (!bySourceType[sk]) bySourceType[sk] = 0;
    bySourceType[sk]++;
  }

  // Conservation checks
  var yearTotal = 0;
  var yearKeys = Object.keys(byYear);
  for (var yt = 0; yt < yearKeys.length; yt++) {
    yearTotal += byYear[yearKeys[yt]].total;
  }

  var catTotal = 0;
  var catKeys = Object.keys(byCategory);
  for (var ct = 0; ct < catKeys.length; ct++) {
    catTotal += byCategory[catKeys[ct]].total;
  }

  var contentTotal = jpOnly + biPartial + biComplete;

  var stats = {
    rawLoaded: rawLoaded,
    invalidFiltered: deck.stats.filtered,
    duplicateFiltered: deck.stats.dedupCount,
    normalized: normalizedCount,
    deduped: dedupedCount,
    jpOnly: jpOnly,
    biPartial: biPartial,
    biComplete: biComplete,
    byYear: byYear,
    byCategory: byCategory,
    bySourceType: bySourceType,
    yearTotal: yearTotal,
    catTotal: catTotal,
    contentTotal: contentTotal
  };

  // Conservation assertions
  var errors = [];

  // 1. rawLoaded - invalidFiltered = normalized
  var expectedNormalized = rawLoaded - deck.stats.filtered;
  if (expectedNormalized !== normalizedCount) {
    errors.push('CONSERVATION FAIL: raw(' + rawLoaded + ') - filtered(' + deck.stats.filtered + ') = ' + expectedNormalized + ' != normalized(' + normalizedCount + ')');
  }

  // 2. normalized - duplicateFiltered = deduped
  var expectedDeduped = normalizedCount - deck.stats.dedupCount;
  if (expectedDeduped !== dedupedCount) {
    errors.push('CONSERVATION FAIL: normalized(' + normalizedCount + ') - dedupCount(' + deck.stats.dedupCount + ') = ' + expectedDeduped + ' != deduped(' + dedupedCount + ')');
  }

  // 3. Year total must equal deduped
  if (yearTotal !== dedupedCount) {
    errors.push('CONSERVATION FAIL: yearTotal(' + yearTotal + ') != deduped(' + dedupedCount + ')');
  }

  // 4. Category total must equal deduped
  if (catTotal !== dedupedCount) {
    errors.push('CONSERVATION FAIL: catTotal(' + catTotal + ') != deduped(' + dedupedCount + ')');
  }

  // 5. Content status total must equal deduped
  if (contentTotal !== dedupedCount) {
    errors.push('CONSERVATION FAIL: contentTotal(' + contentTotal + ') != deduped(' + dedupedCount + ')');
  }

  stats.errors = errors;
  return stats;
}

console.log('=== Flashcard Inventory Report ===\n');

var totalErrors = 0;

for (var e = 0; e < EXAMS.length; e++) {
  var exam = EXAMS[e];
  var stats = analyzeCourse(exam);
  allStats[exam] = stats;

  console.log('--- ' + exam.toUpperCase() + ' ---');
  console.log('  rawLoaded (from split packages): ' + stats.rawLoaded);
  console.log('  invalidFilteredCount:            ' + stats.invalidFiltered);
  console.log('  duplicateFilteredCount:          ' + stats.duplicateFiltered);
  console.log('  normalizedCount:                 ' + stats.normalized);
  console.log('  dedupedCount (final usable):     ' + stats.deduped);
  console.log('');
  console.log('  usableJapaneseOnlyCount:         ' + stats.jpOnly);
  console.log('  usableBilingualPartialCount:     ' + stats.biPartial);
  console.log('  usableBilingualCompleteCount:    ' + stats.biComplete);
  console.log('');

  console.log('  By Year:');
  var yKeys = Object.keys(stats.byYear);
  for (var yi = 0; yi < yKeys.length; yi++) {
    var yData = stats.byYear[yKeys[yi]];
    console.log('    ' + yKeys[yi] + ': ' + yData.total + ' (JP:' + yData.jpOnly + ' BP:' + yData.biPartial + ' BC:' + yData.biComplete + ')');
  }
  console.log('    Year total: ' + stats.yearTotal);

  console.log('');
  console.log('  By Category:');
  var cKeys = Object.keys(stats.byCategory);
  for (var ci = 0; ci < cKeys.length; ci++) {
    var cData = stats.byCategory[cKeys[ci]];
    console.log('    ' + cKeys[ci] + ': ' + cData.total + ' (JP:' + cData.jpOnly + ' BP:' + cData.biPartial + ' BC:' + cData.biComplete + ')');
  }
  console.log('    Category total: ' + stats.catTotal);

  console.log('');
  console.log('  By SourceType:');
  var sKeys = Object.keys(stats.bySourceType);
  for (var si = 0; si < sKeys.length; si++) {
    console.log('    ' + sKeys[si] + ': ' + stats.bySourceType[sKeys[si]]);
  }

  if (stats.errors.length > 0) {
    console.log('');
    console.log('  *** CONSERVATION ERRORS ***');
    for (var ei = 0; ei < stats.errors.length; ei++) {
      console.log('    ' + stats.errors[ei]);
    }
    totalErrors += stats.errors.length;
  } else {
    console.log('');
    console.log('  Conservation: PASS');
  }
  console.log('');
}

// Cross-course summary
console.log('--- SUMMARY ---');
var totalRaw = 0, totalFiltered = 0, totalDedup = 0, totalJp = 0, totalBiP = 0, totalBiC = 0;
for (var si2 = 0; si2 < EXAMS.length; si2++) {
  var st = allStats[EXAMS[si2]];
  totalRaw += st.rawLoaded;
  totalFiltered += st.invalidFiltered;
  totalDedup += st.deduped;
  totalJp += st.jpOnly;
  totalBiP += st.biPartial;
  totalBiC += st.biComplete;
}
console.log('  Total raw:              ' + totalRaw);
console.log('  Total filtered:         ' + totalFiltered);
console.log('  Total deduped (usable): ' + totalDedup);
console.log('  Japanese only:          ' + totalJp);
console.log('  Bilingual partial:      ' + totalBiP);
console.log('  Bilingual complete:     ' + totalBiC);
console.log('');

if (totalErrors > 0) {
  console.log('FAIL: ' + totalErrors + ' conservation errors');
  process.exit(1);
} else {
  console.log('PASS: All conservation checks passed');
}
