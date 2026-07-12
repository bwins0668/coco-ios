#!/usr/bin/env node
// tools/report_flashcard_content_coverage.js
// Node.js only — cross-subpackage require is not available in WeChat runtime.
'use strict';

var path = require('path');
var pastExamIndex = require('../packages/quiz/data/past_exam_bank/index');
var enrichment = require('../packages/quiz/data/flashcard-enrichment/index');

// ---- HTML cleaning (shared with quiz pages) ----
function stripHtmlTags(html) {
  if (!html || typeof html !== 'string') return '';
  return html
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
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

// ---- Normalize a single raw question into flashcard format ----
function normalizeQuestion(raw) {
  if (!raw || !raw.id) return null;

  var qJa = stripHtmlTags(raw.questionJa || '');
  var qZh = stripHtmlTags(raw.questionZh || '');

  if (!qJa && !qZh) return null;

  var options = Array.isArray(raw.options) ? raw.options : [];
  if (options.length < 2) return null;

  var normalizedOptions = [];
  var hasCorrect = false;
  var hasValidOptions = true;
  for (var i = 0; i < options.length; i++) {
    var opt = options[i];
    var optJa = stripHtmlTags(opt.textJa || opt.text || '');
    var optZh = stripHtmlTags(opt.textZh || opt.text || '');
    if (!optJa && !optZh) {
      hasValidOptions = false;
      break;
    }
    var isCorrect = opt.key === raw.answer || opt.isCorrect === true;
    if (isCorrect) hasCorrect = true;

    normalizedOptions.push({
      key: opt.key || String.fromCharCode(65 + i),
      textJa: optJa,
      textZh: optZh,
      isCorrect: isCorrect,
      explanationJa: stripHtmlTags(opt.explanationJa || ''),
      explanationZh: stripHtmlTags(opt.explanationZh || '')
    });
  }

  if (!hasCorrect || !hasValidOptions) return null;

  var explanationJa = stripHtmlTags(raw.explanationJa || '');
  var explanationZh = stripHtmlTags(raw.explanationZh || '');

  var examYear = raw.year || '';
  var examLabel = raw.label || raw.year || '';
  var category = raw.category || '';

  return {
    id: 'fc_' + raw.id,
    sourceId: raw.id,
    course: raw.exam === 'sg' ? 'sg' : 'itpass',
    sourceType: raw.sourceType || 'past_exam_japanese',
    sourceReference: raw.source || '',
    examYear: examYear,
    examLabel: examLabel,
    yearId: raw.yearId || '',
    number: raw.number || 0,
    category: category,
    level: raw.level || '',
    questionJa: qJa || qZh,
    questionZh: qZh || qJa,
    options: normalizedOptions,
    answer: raw.answer || '',
    explanationJa: explanationJa,
    explanationZh: explanationZh,
    mnemonicJa: raw.mnemonicJa || '',
    mnemonicZh: raw.mnemonicZh || '',
    translationStatus: raw.translationStatus || '',
    explanationStatus: raw.explanationStatus || '',
    sharedHint: raw.shared_hint || '',
    contentStatus: 'japanese_only',
    contentOrigin: 'source',
    reviewStatus: 'pending'
  };
}

// ---- Content status detection ----
function detectContentStatus(card) {
  var hasRealZhQuestion = card.questionZh && card.questionZh !== card.questionJa && isGenuineChinese(card.questionZh);
  var hasRealZhOptions = false;
  var hasOptionExplanations = false;
  var hasMnemonic = !!(card.mnemonicJa || card.mnemonicZh);

  if (card.options && card.options.length > 0) {
    var zhOptCount = 0;
    var explCount = 0;
    for (var i = 0; i < card.options.length; i++) {
      var o = card.options[i];
      if (o.textZh && o.textZh !== o.textJa && isGenuineChinese(o.textZh)) zhOptCount++;
      if (o.explanationJa || o.explanationZh) explCount++;
    }
    hasRealZhOptions = zhOptCount === card.options.length;
    hasOptionExplanations = explCount === card.options.length;
  }

  var hasRealZhExplanation = card.explanationZh && card.explanationZh !== card.explanationJa && isGenuineChinese(card.explanationZh);
  var hasRealMnemonic = (card.mnemonicJa && card.mnemonicJa.length > 5) || (card.mnemonicZh && isGenuineChinese(card.mnemonicZh));

  if (hasRealZhQuestion && hasRealZhOptions && hasOptionExplanations && hasRealZhExplanation && hasRealMnemonic) {
    return 'bilingual_complete';
  }
  if (hasRealZhQuestion || hasRealZhOptions || hasRealZhExplanation) {
    return 'bilingual_partial';
  }
  return 'japanese_only';
}

// ---- Apply enrichment data to a card ----
function applyEnrichment(card, enrich) {
  if (!enrich) return card;

  var merged = {};
  for (var k in card) { merged[k] = card[k]; }

  if (enrich.questionZh) merged.questionZh = enrich.questionZh;
  if (enrich.options && Array.isArray(enrich.options)) {
    for (var i = 0; i < merged.options.length && i < enrich.options.length; i++) {
      var eo = enrich.options[i];
      if (eo.textZh) merged.options[i].textZh = eo.textZh;
      if (eo.explanationJa) merged.options[i].explanationJa = eo.explanationJa;
      if (eo.explanationZh) merged.options[i].explanationZh = eo.explanationZh;
    }
  }
  if (enrich.explanationJa) merged.explanationJa = enrich.explanationJa;
  if (enrich.explanationZh) merged.explanationZh = enrich.explanationZh;
  if (enrich.mnemonicJa) merged.mnemonicJa = enrich.mnemonicJa;
  if (enrich.mnemonicZh) merged.mnemonicZh = enrich.mnemonicZh;
  if (enrich.contentStatus) merged.contentStatus = enrich.contentStatus;
  if (enrich.contentOrigin) merged.contentOrigin = enrich.contentOrigin;
  if (enrich.reviewStatus) merged.reviewStatus = enrich.reviewStatus;

  return merged;
}

// ---- Dedup by normalized stem + options + answer ----
function normalizeQuizText(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[Ａ-Ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[ａ-ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .toLowerCase();
}

function dedupeCards(cards) {
  var seen = Object.create(null);
  return cards.filter(function (c) {
    var stem = normalizeQuizText(c.questionZh || c.questionJa || '');
    var opts = normalizeQuizText(c.options.map(function (o) { return (o.textZh || o.textJa || '').trim(); }).join('|'));
    var ans = normalizeQuizText(c.answer || '');
    var key = stem + '|' + opts + '|' + ans;
    if (!key || key === '||') return true;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

// ---- Course processing ----
function processCourse(course) {
  var years = pastExamIndex.getYears(course);
  var allRaw = [];
  var failedPackages = [];

  for (var i = 0; i < years.length; i++) {
    var y = years[i];
    try {
      var pkgDir = y.packageRoot.replace('packages/', '');
      var loader = require('../packages/' + pkgDir + '/data/loader');
      var pkgQs = loader.getAllQuestions();
      for (var j = 0; j < pkgQs.length; j++) {
        if (pkgQs[j].exam === course && pkgQs[j].yearId === y.yearId) {
          allRaw.push(pkgQs[j]);
        }
      }
    } catch (e) {
      failedPackages.push({ packageKey: y.packageKey, error: e.message });
    }
  }

  // Register enrichment chunks manually
  if (course === 'itpass') {
    enrichment.registerChunk('itpass', 'enrichment_all_1782224635785');
  }
  // Load enrichment
  enrichment.loadAllChunksForCourse(course);

  // Normalize
  var normalized = [];
  var filteredCount = 0;
  for (var k = 0; k < allRaw.length; k++) {
    var card = normalizeQuestion(allRaw[k]);
    if (card) {
      var enrich = enrichment.getEnrichmentForCard(course, card.sourceId);
      if (enrich) {
        card = applyEnrichment(card, enrich);
      }
      if (card.contentStatus === 'japanese_only') {
        card.contentStatus = detectContentStatus(card);
      }
      normalized.push(card);
    } else {
      filteredCount++;
    }
  }

  // Dedup
  var deduped = dedupeCards(normalized);
  var dedupCount = normalized.length - deduped.length;

  // Stats
  var contentStats = { japanese_only: 0, bilingual_partial: 0, bilingual_complete: 0 };
  var questionZhGenuine = 0;
  var textZhGenuine = 0;
  var optionExplanationCoverage = 0;
  var mnemonicCoverage = 0;
  var degraded = 0;

  for (var m = 0; m < deduped.length; m++) {
    var c = deduped[m];
    contentStats[c.contentStatus]++;

    // questionZh genuine Chinese coverage
    if (c.questionZh && c.questionZh !== c.questionJa && isGenuineChinese(c.questionZh)) {
      questionZhGenuine++;
    }

    // textZh genuine Chinese coverage (options)
    var allOptionsTextZh = true;
    if (c.options && c.options.length > 0) {
      for (var n = 0; n < c.options.length; n++) {
        var opt = c.options[n];
        if (!opt.textZh || opt.textZh === opt.textJa || !isGenuineChinese(opt.textZh)) {
          allOptionsTextZh = false;
          break;
        }
      }
    } else {
      allOptionsTextZh = false;
    }
    if (allOptionsTextZh && c.options && c.options.length > 0) {
      textZhGenuine++;
    }

    // Option explanation coverage
    var allOptionsHaveExplanation = true;
    if (c.options && c.options.length > 0) {
      for (var p = 0; p < c.options.length; p++) {
        var opt2 = c.options[p];
        if (!opt2.explanationJa && !opt2.explanationZh) {
          allOptionsHaveExplanation = false;
          break;
        }
      }
    } else {
      allOptionsHaveExplanation = false;
    }
    if (allOptionsHaveExplanation && c.options && c.options.length > 0) {
      optionExplanationCoverage++;
    }

    // Mnemonic coverage
    if (c.mnemonicJa || c.mnemonicZh) {
      mnemonicCoverage++;
    }

    // Degraded due to missing fields
    if (filteredCount > 0) {
      degraded = filteredCount;
    }
  }

  // Conservation check
  var totalFlashcards = contentStats.japanese_only + contentStats.bilingual_partial + contentStats.bilingual_complete;
  var conservationOk = totalFlashcards === deduped.length;

  return {
    course: course,
    rawQuestionCount: allRaw.length,
    flashcardQuestionCount: deduped.length,
    filteredOut: filteredCount,
    dedupRemoved: dedupCount,
    contentStatus: contentStats,
    questionZhGenuine: questionZhGenuine,
    textZhGenuine: textZhGenuine,
    optionExplanationCoverage: optionExplanationCoverage,
    mnemonicCoverage: mnemonicCoverage,
    degradedByMissingFields: degraded,
    failedPackages: failedPackages,
    conservationCheck: {
      total: totalFlashcards,
      japanese_only: contentStats.japanese_only,
      bilingual_partial: contentStats.bilingual_partial,
      bilingual_complete: contentStats.bilingual_complete,
      ok: conservationOk
    }
  };
}

// ---- Main ----
function main() {
  var courseFilter = process.argv[2] || null;
  var courses = ['sg', 'itpass'];
  if (courseFilter && courses.indexOf(courseFilter) >= 0) {
    courses = [courseFilter];
  }

  var results = {};
  for (var i = 0; i < courses.length; i++) {
    results[courses[i]] = processCourse(courses[i]);
  }

  console.log(JSON.stringify(results, null, 2));
}

main();