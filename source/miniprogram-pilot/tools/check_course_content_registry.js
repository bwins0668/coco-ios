#!/usr/bin/env node
'use strict';
/*
 * tools/check_course_content_registry.js  (R1.5)
 *
 * Validates utils/course-content-registry.js against the REAL audited data:
 *   1. every (courseId, id) pair is unique
 *   2. courseId is an allowed, available certification course (course-registry)
 *   3. questionSelector is non-empty and targets an audited real field
 *   4. structureKind / availability / practiceCapability use the allowed enums
 *   5. every availability='available' topic's selector hits >=1 real question
 *   6. every practiceCapability='verified' topic has a real practice route
 *      (course-topic-practice adapter must build a registered route for it)
 *   7. the registry stays pure: no question-bank import, no textbook text,
 *      no fabricated counts / progress / accuracy keys
 *
 * Exit 0 = pass, exit 1 = fail.
 */

var path = require('path');
var fs = require('fs');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(msg) { failures.push(msg); }

var registry = require(path.join(ROOT, 'utils/course-content-registry.js'));
var courseRegistry = require(path.join(ROOT, 'utils/course-registry.js'));
var registrySrc = fs.readFileSync(path.join(ROOT, 'utils/course-content-registry.js'), 'utf8');

// Real question bank — read-only, used to prove selector hits.
var questionBank = require(path.join(ROOT, 'packages/quiz/data/course_questions.js'));
var QUESTIONS = (questionBank && questionBank.questions) || [];

var TOPICS = registry.TOPICS || [];
var STRUCTURE_KINDS = { 'exam-topic': true };
var AVAILABILITY = { available: true, deferred: true };
var PRACTICE = { verified: true, deferred: true };

// ---- 0. basic shape ----
if (!Array.isArray(TOPICS) || TOPICS.length === 0) {
  fail('registry must export a non-empty TOPICS array');
}

// ---- 1. unique (courseId, id) ----
var seenKey = {};
TOPICS.forEach(function (t, i) {
  var key = String(t.courseId) + '::' + String(t.id);
  if (seenKey[key]) fail('duplicate topic key (courseId,id): ' + key);
  seenKey[key] = true;
  if (!t.id) fail('topic[' + i + '] missing id');
});

// ---- 2..6 per-topic checks ----
TOPICS.forEach(function (t) {
  var tag = (t.courseId || '?') + '/' + (t.id || '?');

  // 2. courseId allowed + certification + available
  if (!registry.ALLOWED_COURSES[t.courseId]) {
    fail(tag + ': courseId not in ALLOWED_COURSES (itpass/sg only)');
  } else {
    var course = courseRegistry.getCourseById(t.courseId);
    if (!course) fail(tag + ': courseId not found in course-registry');
    else {
      if (course.courseKind !== 'certification') fail(tag + ': course is not a certification course');
      if (course.availability !== 'available') fail(tag + ': course is not available');
    }
  }

  // enums
  if (!STRUCTURE_KINDS[t.structureKind]) fail(tag + ': invalid structureKind ' + t.structureKind);
  if (!AVAILABILITY[t.availability]) fail(tag + ': invalid availability ' + t.availability);
  if (!PRACTICE[t.practiceCapability]) fail(tag + ': invalid practiceCapability ' + t.practiceCapability);

  // titles present (structure must be nameable, not fabricated copy)
  if (!t.title || !t.titleJa) fail(tag + ': missing title/titleJa');

  // 3. selector non-empty + 4. field audited-real
  var sel = t.questionSelector;
  if (!sel || typeof sel !== 'object') {
    fail(tag + ': missing questionSelector');
    return;
  }
  if (!sel.exactField) fail(tag + ': selector.exactField empty');
  if (!Array.isArray(sel.exactValues) || sel.exactValues.length === 0) {
    fail(tag + ': selector.exactValues empty');
  }
  if (sel.exactField && !registry.ALLOWED_SELECTOR_FIELDS[sel.exactField]) {
    fail(tag + ': selector field "' + sel.exactField + '" is not an audited real question field');
  }
  // field must actually exist on at least one real question of this exam
  var fieldSeenOnExam = QUESTIONS.some(function (q) {
    return q.exam === t.courseId && sel.exactField && q[sel.exactField] !== undefined;
  });
  if (sel.exactField && !fieldSeenOnExam) {
    fail(tag + ': selector field "' + sel.exactField + '" never appears on real ' + t.courseId + ' questions');
  }

  // 5. available topic must hit >=1 real question
  if (t.availability === 'available' && sel && sel.exactField && Array.isArray(sel.exactValues)) {
    var hits = QUESTIONS.filter(function (q) {
      return q.exam === t.courseId &&
        q.sourceType === 'lesson_quiz' &&
        sel.exactValues.indexOf(q[sel.exactField]) >= 0;
    }).length;
    if (hits < 1) fail(tag + ': availability=available but selector hits 0 real questions');
  }

  // 6. verified practice topic must have a real registered route
  if (t.practiceCapability === 'verified') {
    var routeBuilt = false;
    try {
      var bridge = require(path.join(ROOT, 'utils/course-topic-practice.js'));
      var route = bridge.buildTopicPracticeRoute &&
        bridge.buildTopicPracticeRoute(t.courseId, t.id);
      routeBuilt = !!(route && typeof route === 'string' && route.indexOf('/packages/') === 0);
    } catch (e) {
      routeBuilt = false;
    }
    if (!routeBuilt) {
      fail(tag + ': practiceCapability=verified but no real route built by course-topic-practice');
    }
  }
});

// ---- 7. registry purity (scan code only, comments stripped) ----
var codeOnly = registrySrc
  .replace(/\/\*[\s\S]*?\*\//g, '')   // block comments
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1'); // line comments (keep "://" in urls intact)

if (/require\(['"][^'"]*course_questions/.test(codeOnly) ||
    /require\(['"][^'"]*past_exam_bank/.test(codeOnly) ||
    /require\(['"][^'"]*\/questions['"]\)/.test(codeOnly)) {
  fail('registry must not import the question bank (must stay pure-static)');
}
// no fabricated quantitative keys declared as object keys in the static registry
['questionCount', 'totalQuestions', 'progress', 'accuracy', 'completion', 'correctRate']
  .forEach(function (k) {
    var re = new RegExp('\\b' + k + '\\b\\s*:');
    if (re.test(codeOnly)) fail('registry must not embed fabricated key: ' + k);
  });
// no textbook-sized content blobs. A valid JS string literal never holds a
// raw newline, so [^'\n] keeps the run inside a single literal (no false
// cross-matching across unrelated quotes in the code).
var longString = codeOnly.match(/'[^'\n]{400,}'|"[^"\n]{400,}"/);
if (longString) fail('registry contains a suspiciously long string (possible textbook/question text)');

// ---- report ----
if (failures.length) {
  console.error('COURSE CONTENT REGISTRY FAIL (' + failures.length + ')');
  failures.forEach(function (f) { console.error('  - ' + f); });
  process.exit(1);
}
var available = TOPICS.filter(function (t) { return t.availability === 'available'; }).length;
var verified = TOPICS.filter(function (t) { return t.practiceCapability === 'verified'; }).length;
console.log('COURSE CONTENT REGISTRY PASS — ' + TOPICS.length + ' topics, ' +
  available + ' available, ' + verified + ' practice-verified');
process.exit(0);
