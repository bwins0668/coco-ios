#!/usr/bin/env node
'use strict';

/*
 * V3 formal bilingual gate.
 *
 * A card is checked-complete only when a structured translation record is
 * present under `deckId:rawCardId`, sourceHash still matches the raw Japanese
 * source, all Chinese fields are real Chinese translations, and an independent
 * reviewer recorded `reviewResult: 'pass'` with a permitted checked status.
 *
 * Legacy raw-id maps are inspected for field coverage but intentionally cannot
 * pass this gate: their keys are ambiguous across years and they carry no
 * source hash or independent review evidence.
 */
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var JSON_MODE = process.argv.indexOf('--json') >= 0;
var app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
var globalManifest = require(path.join(ROOT, 'packages/quiz/data/flashcard-manifest.js'));
var FORBIDDEN = ['TODO', '待翻译', 'N/A', 'null', 'undefined', '原文同上'];
var CHECKED_STATUSES = { ai_generated_checked: true, source_verified: true };
var courses = ['itpass', 'sg'];
var packageRows = Object.create(null);
var issues = [];

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
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function comparableText(value) {
  return stripHtml(value).replace(/[\s\u3000\u3001\u3002\uff0c\uff0e\uff1a\uff1b\uff01\uff1f\u300c\u300d\u300e\u300f\(\)\uff08\uff09\[\]\uff3b\uff3d]/g, '');
}

function isRealChinese(ja, zh, minimum) {
  zh = stripHtml(zh);
  ja = stripHtml(ja);
  if (!zh || zh.length < minimum || zh === ja || comparableText(zh) === comparableText(ja)) return false;
  if (FORBIDDEN.some(function (token) { return zh.indexOf(token) >= 0; })) return false;
  var chinese = (zh.match(/[\u4e00-\u9fff]/g) || []).length;
  var kana = (zh.match(/[\u3040-\u30ff]/g) || []).length;
  return chinese > 0 && chinese >= kana;
}

function optionId(option, index) {
  return String(option && (option.id || option.key) || String.fromCharCode(65 + index));
}

function answerId(raw) {
  return String(raw && (raw.answerId || raw.answer) || '');
}

function sourcePayload(deckId, raw) {
  var options = Array.isArray(raw.options) ? raw.options : [];
  return {
    deckId: deckId,
    rawCardId: String(raw.id || ''),
    questionJa: stripHtml(raw.questionJa || ''),
    options: options.map(function (option, index) {
      return { optionId: optionId(option, index), textJa: stripHtml(option.textJa || option.text || '') };
    }),
    answerId: answerId(raw),
    explanationJa: stripHtml(raw.explanationJa || '')
  };
}

function sourceHash(deckId, raw) {
  return crypto.createHash('sha256').update(JSON.stringify(sourcePayload(deckId, raw)), 'utf8').digest('hex');
}

function isPlayable(raw) {
  if (!raw || !raw.id || !stripHtml(raw.questionJa || '')) return false;
  var options = Array.isArray(raw.options) ? raw.options : [];
  var answer = answerId(raw);
  if (options.length < 2 || !answer) return false;
  var found = false;
  for (var i = 0; i < options.length; i++) {
    if (!stripHtml(options[i].textJa || options[i].text || '')) return false;
    if (optionId(options[i], i) === answer) found = true;
  }
  return found;
}

function makeRow(packageRoot, course) {
  return {
    package: packageRoot,
    course: course,
    source: 0,
    playable: 0,
    checkedComplete: 0,
    partial: 0,
    japaneseOnly: 0,
    missingQuestionZh: 0,
    missingOptionZh: 0,
    missingExplanationZh: 0,
    reviewFail: 0,
    aiGeneratedChecked: 0,
    sourceVerified: 0,
    invalidAnswers: 0,
    sourceHashMismatch: 0,
    legacyRecords: 0
  };
}

function mergeLegacyIntoRecord(raw, legacy, explanations) {
  var record = {};
  if (Array.isArray(legacy)) {
    record.questionZh = legacy[0] || '';
    record.options = (legacy[1] || []).map(function (text, index) { return { optionId: optionId((raw.options || [])[index] || {}, index), textZh: text || '' }; });
  } else if (legacy && typeof legacy === 'object') {
    record = legacy;
  }
  if (!record.explanationZh && explanations && explanations[raw.id]) record.explanationZh = explanations[raw.id];
  return record;
}

function structuredRecord(translations, deckId, rawId) {
  var key = deckId + ':' + rawId;
  if (translations && translations[key] && typeof translations[key] === 'object' && !Array.isArray(translations[key])) {
    return { record: translations[key], isLegacy: false, cardKey: key };
  }
  if (translations && translations[rawId]) {
    return { record: translations[rawId], isLegacy: true, cardKey: key };
  }
  return { record: null, isLegacy: false, cardKey: key };
}

function checkCard(row, deckId, raw, translations, explanations) {
  row.source++;
  if (!isPlayable(raw)) return;
  row.playable++;

  var rawId = String(raw.id);
  var entry = structuredRecord(translations, deckId, rawId);
  var record = mergeLegacyIntoRecord(raw, entry.record, explanations);
  if (entry.isLegacy) row.legacyRecords++;

  var qJa = stripHtml(raw.questionJa || '');
  var qOk = isRealChinese(qJa, record.questionZh, 4);
  var options = Array.isArray(raw.options) ? raw.options : [];
  var byOptionId = Object.create(null);
  (record.options || []).forEach(function (option) {
    if (!option) return;
    byOptionId[String(option.optionId || option.id || option.key || '')] = option;
  });
  var optionsOk = options.length >= 2;
  for (var i = 0; i < options.length; i++) {
    var sourceOption = options[i];
    var translatedOption = byOptionId[optionId(sourceOption, i)] || {};
    if (!isRealChinese(sourceOption.textJa || sourceOption.text || '', translatedOption.textZh || '', 2)) optionsOk = false;
  }
  var explanationOk = isRealChinese(raw.explanationJa || '', record.explanationZh || '', 5);
  var sourceHashOk = !!record.sourceHash && record.sourceHash === sourceHash(deckId, raw);
  var statusOk = !!CHECKED_STATUSES[record.translationStatus];
  var reviewOk = record.reviewResult === 'pass' && !!record.reviewedAt;
  var identityOk = record.cardKey === entry.cardKey && record.deckId === deckId && String(record.rawCardId || '') === rawId;
  var answerOk = String(record.answerId || '') === answerId(raw);

  if (!qOk) row.missingQuestionZh++;
  if (!optionsOk) row.missingOptionZh++;
  if (!explanationOk) row.missingExplanationZh++;
  if (!answerOk) row.invalidAnswers++;
  if (!sourceHashOk) row.sourceHashMismatch++;

  var checked = qOk && optionsOk && explanationOk && answerOk && sourceHashOk && statusOk && reviewOk && identityOk && !entry.isLegacy;
  if (checked) {
    row.checkedComplete++;
    if (record.translationStatus === 'ai_generated_checked') row.aiGeneratedChecked++;
    if (record.translationStatus === 'source_verified') row.sourceVerified++;
    return;
  }

  if (!reviewOk || !statusOk || !sourceHashOk || !identityOk || entry.isLegacy) row.reviewFail++;
  if (qOk || optionsOk || explanationOk) row.partial++;
  else row.japaneseOnly++;
}

function loadPackage(packageRoot) {
  return {
    raw: require(path.join(ROOT, packageRoot, 'data/questions.js')).questionsByYear || {},
    translations: require(path.join(ROOT, packageRoot, 'data/translations_zh.js')),
    explanations: require(path.join(ROOT, packageRoot, 'data/explanations_zh.js'))
  };
}

courses.forEach(function (course) {
  globalManifest.getDecksForCourse(course).forEach(function (deck) {
    var packageRoot = deck.packageRoot || ('packages/' + deck.packageName);
    var key = course + '|' + packageRoot;
    if (!packageRows[key]) packageRows[key] = makeRow(packageRoot, course);
    var row = packageRows[key];
    var data;
    try {
      data = loadPackage(packageRoot);
    } catch (error) {
      issues.push({ package: packageRoot, deckId: course + '/' + deck.yearId, reason: 'package_load_failed:' + error.message });
      return;
    }
    var rawDeck = data.raw[deck.yearId] || [];
    rawDeck.forEach(function (raw) {
      checkCard(row, course + '/' + deck.yearId, raw, data.translations, data.explanations);
    });
  });
});

var rows = Object.keys(packageRows).sort().map(function (key) { return packageRows[key]; });
var total = makeRow('TOTAL', 'TOTAL');
rows.forEach(function (row) {
  Object.keys(total).forEach(function (field) {
    if (typeof total[field] === 'number') total[field] += Number(row[field] || 0);
  });
});

if (!JSON_MODE) {
  log('package | course | source | playable | checkedComplete | partial | japaneseOnly | missingQuestionZh | missingOptionZh | missingExplanationZh | reviewFail');
  log('-'.repeat(160));
  rows.forEach(function (row) {
    log([row.package, row.course, row.source, row.playable, row.checkedComplete, row.partial, row.japaneseOnly, row.missingQuestionZh, row.missingOptionZh, row.missingExplanationZh, row.reviewFail].join(' | '));
  });
  log('-'.repeat(160));
  log(['TOTAL', 'TOTAL', total.source, total.playable, total.checkedComplete, total.partial, total.japaneseOnly, total.missingQuestionZh, total.missingOptionZh, total.missingExplanationZh, total.reviewFail].join(' | '));
  log('ai_generated_checked=' + total.aiGeneratedChecked + ' source_verified=' + total.sourceVerified + ' sourceHashMismatch=' + total.sourceHashMismatch + ' invalidAnswers=' + total.invalidAnswers + ' legacyRecords=' + total.legacyRecords);
}

var pass = issues.length === 0 &&
  total.checkedComplete === total.playable &&
  total.partial === 0 &&
  total.japaneseOnly === 0 &&
  total.missingQuestionZh === 0 &&
  total.missingOptionZh === 0 &&
  total.missingExplanationZh === 0 &&
  total.reviewFail === 0 &&
  total.sourceHashMismatch === 0 &&
  total.invalidAnswers === 0;

if (JSON_MODE) {
  console.log(JSON.stringify({ ok: pass, rows: rows, total: total, issues: issues }, null, 2));
}
if (!pass && !JSON_MODE) log('FAIL: bilingual content is not independently reviewed and complete.');
if (pass && !JSON_MODE) log('PASS: all playable cards are checked bilingual records with matching source hashes.');
process.exit(pass ? 0 : 1);
