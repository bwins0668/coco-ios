#!/usr/bin/env node
'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var content = require(path.join(ROOT, 'packages/course-content/data/textbook-course.js'));
var questionData = require(path.join(ROOT, 'packages/quiz/data/course_questions.js'));
var questions = questionData.questions || [];
var questionsById = {};
questions.forEach(function (question) { questionsById[question.id] = question; });

var failures = [];
var REFERENCE_UNITS = [
  { exam: 'sg', id: 'sg-1-1-3', caseRequired: true },
  { exam: 'itpass', id: 'itpass-4-03', caseRequired: false }
];

function fail(message) {
  failures.push(message);
}

function usage(exitCode) {
  console.log('Usage: node tools/check_textbook_learning_experience.js --reference-only');
  process.exit(exitCode);
}

function parseArgs(argv) {
  if (argv.indexOf('--help') >= 0 || argv.indexOf('-h') >= 0) usage(0);
  if (argv.indexOf('--reference-only') < 0) {
    fail('use --reference-only for the R5.3A reference slice');
  }
}

function text(value) {
  return String(value || '').trim();
}

function textLength(value) {
  return text(value).replace(/\s+/g, '').length;
}

function assertText(value, field, minLength) {
  if (typeof value !== 'string' || textLength(value) < (minLength || 1)) {
    fail(field + ' must be a non-empty string with length >= ' + (minLength || 1));
  }
}

function normalize(value) {
  return text(value).replace(/\s+/g, '').toLowerCase();
}

function findUnit(unitId) {
  return (content.units || []).filter(function (unit) { return unit.id === unitId; })[0] || null;
}

function sourceById(sourceId) {
  return (content.sources || []).filter(function (source) { return source.sourceId === sourceId; })[0] || null;
}

function isAbbreviation(term) {
  var en = text(term.en || term.english);
  return /^[A-Z0-9][A-Z0-9/+.-]{1,12}$/.test(en);
}

function assertNoForbiddenPayload(label, value) {
  var serialized = JSON.stringify(value);
  if (/[A-Za-z]:\\|G:\\|file:\/\/|127\.0\.0\.1|localhost|data:application\/pdf|base64,|%PDF|TODO|placeholder|UNKNOWN/i.test(serialized)) {
    fail(label + ' contains forbidden local path, fake reader URL, PDF/base64 payload, TODO, placeholder, or UNKNOWN text');
  }
}

function validateSourceRef(unit, ref, field) {
  if (!ref || typeof ref !== 'object') {
    fail(field + ' sourceRef required');
    return;
  }
  var source = sourceById(ref.sourceId);
  if (!source) {
    fail(field + ' unknown sourceId: ' + ref.sourceId);
    return;
  }
  if (!Number.isInteger(ref.pdfPageStart) || !Number.isInteger(ref.pdfPageEnd)) {
    fail(field + ' pdf pages must be integers');
  } else if (ref.pdfPageStart < 1 || ref.pdfPageEnd < ref.pdfPageStart || ref.pdfPageEnd > source.pdfPageCount) {
    fail(field + ' pdf page range out of bounds');
  }
  if (ref.verificationStatus !== 'verified') fail(field + ' sourceRef must be verified');
  assertText(ref.headingJa, field + '.headingJa', 2);
  if (!Array.isArray(ref.anchorTermsJa) || !ref.anchorTermsJa.length) {
    fail(field + ' anchorTermsJa required');
  }
  if (ref.printedPageStart !== null || ref.printedPageEnd !== null) {
    fail(field + ' printed pages must remain null unless verified');
  }
}

function validateSourceAccess(unit) {
  var access = unit.sourceAccess;
  if (!access || typeof access !== 'object') {
    fail(unit.id + '.sourceAccess required');
    return;
  }
  if (access.mode !== 'locator_only' && access.mode !== 'authorized_remote_document') {
    fail(unit.id + '.sourceAccess.mode must be locator_only or authorized_remote_document');
  }
  if (access.status !== 'unbound' && access.status !== 'available' && access.status !== 'unavailable') {
    fail(unit.id + '.sourceAccess.status must be unbound, available, or unavailable');
  }
  assertText(access.displayLabel, unit.id + '.sourceAccess.displayLabel', 8);
  if (access.mode === 'locator_only' || access.status === 'unbound') {
    if (access.url || access.documentId) {
      fail(unit.id + '.sourceAccess locator_only/unbound must not expose url or documentId');
    }
  }
  assertNoForbiddenPayload(unit.id + '.sourceAccess', access);
}

function validateTerm(unit, term, index) {
  var prefix = unit.id + '.keyTerms[' + index + ']';
  assertText(term.id, prefix + '.id', 2);
  assertText(term.en, prefix + '.en', 2);
  assertText(term.ja, prefix + '.ja', 2);
  assertText(term.zh, prefix + '.zh', 2);
  assertText(term.termJa, prefix + '.termJa', 2);
  assertText(term.termZh, prefix + '.termZh', 2);
  assertText(term.english, prefix + '.english', 2);
  assertText(term.definitionJa, prefix + '.definitionJa', 24);
  assertText(term.definitionZh, prefix + '.definitionZh', 18);
  assertText(term.contextJa, prefix + '.contextJa', 24);
  assertText(term.contextZh, prefix + '.contextZh', 18);
  assertText(term.examCueJa, prefix + '.examCueJa', 18);
  assertText(term.examCueZh, prefix + '.examCueZh', 14);
  if (normalize(term.en) === normalize(term.ja) && normalize(term.ja) === normalize(term.zh)) {
    fail(prefix + ' en/ja/zh must not be three identical labels');
  }
  if (isAbbreviation(term) && !text(term.expansionEn) && text(term.definitionJa).indexOf(text(term.en)) < 0) {
    fail(prefix + ' abbreviation requires expansionEn or explanatory definition');
  }
  if (!Array.isArray(term.compareWith) || !term.compareWith.length) {
    fail(prefix + '.compareWith required');
  }
  if (!Array.isArray(term.sourceRefs) || !term.sourceRefs.length) {
    fail(prefix + '.sourceRefs required');
  } else {
    term.sourceRefs.forEach(function (ref, refIndex) {
      validateSourceRef(unit, ref, prefix + '.sourceRefs[' + refIndex + ']');
    });
  }
  assertNoForbiddenPayload(prefix, term);
}

function validateLearningExperience(unit, caseRequired) {
  var exp = unit.learningExperience;
  if (!exp || typeof exp !== 'object') {
    fail(unit.id + '.learningExperience required');
    return;
  }
  assertText(exp.goalJa, unit.id + '.learningExperience.goalJa', 30);
  assertText(exp.goalZh, unit.id + '.learningExperience.goalZh', 24);
  if (!exp.coreConcept || typeof exp.coreConcept !== 'object') {
    fail(unit.id + '.learningExperience.coreConcept required');
  } else {
    assertText(exp.coreConcept.headingJa, unit.id + '.learningExperience.coreConcept.headingJa', 4);
    assertText(exp.coreConcept.headingZh, unit.id + '.learningExperience.coreConcept.headingZh', 4);
    assertText(exp.coreConcept.bodyJa, unit.id + '.learningExperience.coreConcept.bodyJa', 120);
    assertText(exp.coreConcept.bodyZh, unit.id + '.learningExperience.coreConcept.bodyZh', 90);
  }
  if (!Array.isArray(exp.examCues) || exp.examCues.length < 2) {
    fail(unit.id + '.learningExperience.examCues requires at least two cues');
  } else {
    exp.examCues.forEach(function (cue, index) {
      assertText(cue.cueJa, unit.id + '.learningExperience.examCues[' + index + '].cueJa', 22);
      assertText(cue.cueZh, unit.id + '.learningExperience.examCues[' + index + '].cueZh', 16);
    });
  }
  if (!Array.isArray(exp.mistakeComparisons) || exp.mistakeComparisons.length < 2) {
    fail(unit.id + '.learningExperience.mistakeComparisons requires at least two comparisons');
  } else {
    exp.mistakeComparisons.forEach(function (item, index) {
      assertText(item.aJa, unit.id + '.learningExperience.mistakeComparisons[' + index + '].aJa', 2);
      assertText(item.bJa, unit.id + '.learningExperience.mistakeComparisons[' + index + '].bJa', 2);
      assertText(item.bodyJa, unit.id + '.learningExperience.mistakeComparisons[' + index + '].bodyJa', 36);
      assertText(item.bodyZh, unit.id + '.learningExperience.mistakeComparisons[' + index + '].bodyZh', 28);
    });
  }
  if (caseRequired) {
    if (!Array.isArray(exp.prerequisiteConcepts) || exp.prerequisiteConcepts.length < 3) {
      fail(unit.id + '.learningExperience.prerequisiteConcepts requires at least three concepts');
    }
    if (!Array.isArray(exp.caseBreakdown) || exp.caseBreakdown.length < 4) {
      fail(unit.id + '.learningExperience.caseBreakdown requires at least four case layers');
    } else {
      exp.caseBreakdown.forEach(function (item, index) {
        assertText(item.labelJa, unit.id + '.learningExperience.caseBreakdown[' + index + '].labelJa', 4);
        assertText(item.labelZh, unit.id + '.learningExperience.caseBreakdown[' + index + '].labelZh', 4);
        assertText(item.bodyJa, unit.id + '.learningExperience.caseBreakdown[' + index + '].bodyJa', 42);
        assertText(item.bodyZh, unit.id + '.learningExperience.caseBreakdown[' + index + '].bodyZh', 32);
      });
    }
  }
  assertNoForbiddenPayload(unit.id + '.learningExperience', exp);
}

function validateQuestions(unit) {
  if (!Array.isArray(unit.relatedQuestionIds)) {
    fail(unit.id + '.relatedQuestionIds must be array');
    return;
  }
  if (!unit.relatedQuestionIds.length && unit.practiceStatus !== 'no_existing_course_question') {
    fail(unit.id + ' empty relatedQuestionIds must use no_existing_course_question');
  }
  unit.relatedQuestionIds.forEach(function (qid) {
    var question = questionsById[qid];
    if (!question) {
      fail(unit.id + ' relatedQuestionId missing: ' + qid);
      return;
    }
    if (question.exam !== unit.exam) fail(unit.id + ' relatedQuestionId cross-exam: ' + qid);
    if (question.sourceType !== 'lesson_quiz') fail(unit.id + ' relatedQuestionId must be lesson_quiz: ' + qid);
  });
}

function validateUiContract() {
  var js = fs.readFileSync(path.join(ROOT, 'packages/course-content/pages/unit-detail/unit-detail.js'), 'utf8');
  var wxml = fs.readFileSync(path.join(ROOT, 'packages/course-content/pages/unit-detail/unit-detail.wxml'), 'utf8');
  if (wxml.indexOf('openTermDetail') < 0 || js.indexOf('openTermDetail') < 0) {
    fail('unit-detail must expose clickable term detail interaction');
  }
  if (wxml.indexOf('learningExperience') < 0) {
    fail('unit-detail must render the learningExperience reference layout when present');
  }
  if (wxml.indexOf('sourceAccess') < 0) {
    fail('unit-detail must render transparent sourceAccess status');
  }
  if (wxml.indexOf('td-term-sheet') < 0) {
    fail('unit-detail must render an in-page term detail sheet');
  }
}

function validateContentPackage() {
  var courseRoot = path.join(ROOT, 'packages/course-content');
  function walk(dir) {
    fs.readdirSync(dir).forEach(function (name) {
      var full = path.join(dir, name);
      var stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
        return;
      }
      if (!stat.isFile()) return;
      if (/\.(pdf|png|jpe?g|webp|gif)$/i.test(name)) {
        fail('course-content must not include PDF/image asset: ' + path.relative(ROOT, full).replace(/\\/g, '/'));
        return;
      }
      var body = fs.readFileSync(full, 'utf8');
      assertNoForbiddenPayload(path.relative(ROOT, full).replace(/\\/g, '/'), body);
    });
  }
  walk(courseRoot);
}

function validateFrozenDiff() {
  var diffNames = childProcess.execFileSync('git', ['diff', '--name-only'], {
    cwd: ROOT,
    encoding: 'utf8'
  }).split(/\r?\n/).filter(Boolean);
  diffNames.forEach(function (name) {
    if (/^packages\/quiz\//.test(name) || /^data\//.test(name) ||
      name === 'utils/storage.js' || name === 'utils/favorite-questions.js' ||
      name === 'app.js' || name === 'app.wxss' ||
      name === 'project.config.json' || name === 'project.private.config.json' ||
      name === 'tools/audit_miniprogram_package_size.js') {
      fail('frozen or out-of-scope file modified: ' + name);
    }
  });
}

function validateReferenceUnit(ref) {
  var unit = findUnit(ref.id);
  if (!unit) {
    fail('missing reference unit: ' + ref.id);
    return;
  }
  if (unit.exam !== ref.exam) fail(unit.id + ' exam mismatch');
  assertText(unit.titleJa, unit.id + '.titleJa', 4);
  assertText(unit.titleZh, unit.id + '.titleZh', 4);
  if (!Array.isArray(unit.sourceRefs) || !unit.sourceRefs.length) {
    fail(unit.id + '.sourceRefs required');
  } else {
    unit.sourceRefs.forEach(function (sourceRef, index) {
      validateSourceRef(unit, sourceRef, unit.id + '.sourceRefs[' + index + ']');
    });
  }
  validateSourceAccess(unit);
  validateLearningExperience(unit, ref.caseRequired);
  if (!Array.isArray(unit.keyTerms) || unit.keyTerms.length < 3) {
    fail(unit.id + '.keyTerms requires at least three terms');
  } else {
    unit.keyTerms.forEach(function (term, index) { validateTerm(unit, term, index); });
  }
  validateQuestions(unit);
  assertNoForbiddenPayload(unit.id, unit);
}

function main() {
  parseArgs(process.argv);
  REFERENCE_UNITS.forEach(validateReferenceUnit);
  validateUiContract();
  validateContentPackage();
  validateFrozenDiff();
  if (failures.length) {
    console.error('TEXTBOOK LEARNING EXPERIENCE FAIL (' + failures.length + ')');
    failures.slice(0, 200).forEach(function (message) { console.error('  - ' + message); });
    if (failures.length > 200) console.error('  ... ' + (failures.length - 200) + ' more');
    process.exit(1);
  }
  console.log('TEXTBOOK LEARNING EXPERIENCE PASS — 2 reference units expose source access, layered learning, trilingual term details, and safe package boundaries');
}

main();
