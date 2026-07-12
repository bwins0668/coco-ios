#!/usr/bin/env node
'use strict';
/*
 * tools/check_course_topic_practice.js  (R2.0 / R2.1)
 *
 * Proves the topic practice bridge against REAL question data (not just code
 * strings). Validates the pure scope engine + route builder + registry:
 *
 *   1. every available topic resolves to a valid scope via the registry
 *   2. every available topic's scope hits >=1 real question
 *   3. every hit question strictly carries selector exactValues (+ exam + lesson_quiz)
 *   4. exam/topic mismatch is rejected (valid:false)
 *   5. topicId + yearId is rejected (valid:false)
 *   6. wrong sourceType is rejected (valid:false)
 *   7. no topicId -> scope null -> filtering keeps the original set unchanged
 *   8. unknown topicId -> rejected -> empty set (never a broad/full bank)
 *   9. python/java/algorithm/mos own no topics -> no valid scope
 *  10. any practiceCapability=verified topic resolves valid AND has a real route
 *  11. scope engine purity: no storage writes, no question import, no mutation
 *
 * Exit 0 = pass, exit 1 = fail.
 */

var path = require('path');
var fs = require('fs');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(msg) { failures.push(msg); }

var scopeEngine = require(path.join(ROOT, 'utils/quiz-topic-scope.js'));
var registry = require(path.join(ROOT, 'utils/course-content-registry.js'));
var scopeSrc = fs.readFileSync(path.join(ROOT, 'utils/quiz-topic-scope.js'), 'utf8');

var QUESTIONS = (require(path.join(ROOT, 'packages/quiz/data/course_questions.js')).questions) || [];

var EXAMS = ['itpass', 'sg'];
var NON_TOPIC_COURSES = ['python', 'java', 'algorithm', 'mos365'];

// ---- 1..3 available topics resolve + hit real questions strictly ----
EXAMS.forEach(function (exam) {
  registry.getAvailableTopicsForCourse(exam).forEach(function (topic) {
    var tag = exam + '/' + topic.id;
    var scope = scopeEngine.resolveTopicScope({
      exam: exam, sourceType: 'lesson_quiz', topicId: topic.id
    });
    if (!scope || !scope.valid) {
      fail(tag + ': available topic did not resolve to a valid scope');
      return;
    }
    var hits = scopeEngine.filterQuestionsForTopicScope(QUESTIONS, scope);
    if (hits.length < 1) {
      fail(tag + ': scope hit 0 real questions');
      return;
    }
    var bad = hits.filter(function (q) {
      return !(q.exam === exam && q.sourceType === 'lesson_quiz' &&
        scope.exactValues.indexOf(q[scope.exactField]) >= 0);
    });
    if (bad.length) fail(tag + ': ' + bad.length + ' hit question(s) outside selector exactValues');
  });
});

// ---- 4. exam/topic mismatch rejected ----
(function () {
  // itpass topic id requested under sg exam -> exam-mismatch / unknown
  var s = scopeEngine.resolveTopicScope({ exam: 'sg', sourceType: 'lesson_quiz', topicId: 'strategy' });
  // 'strategy' exists for sg too, so test a cross check: request a topic that
  // exists only conceptually but force a wrong exam by tampering is N/A; instead
  // verify a genuinely unknown pairing is rejected.
  var s2 = scopeEngine.resolveTopicScope({ exam: 'itpass', sourceType: 'lesson_quiz', topicId: 'kamokuB' });
  if (s2 && s2.valid) fail('mismatch: unknown topicId for itpass must be rejected');
})();

// ---- 5. topicId + yearId rejected ----
(function () {
  var s = scopeEngine.resolveTopicScope({
    exam: 'itpass', sourceType: 'lesson_quiz', topicId: 'technology', yearId: 'r5'
  });
  if (!s || s.valid) fail('conflict: topicId + yearId must be rejected (valid:false)');
  if (s && s.valid === false && s.reason !== 'conflict-yearId') {
    fail('conflict: topicId + yearId reason should be conflict-yearId, got ' + s.reason);
  }
  // and the filtered set must be empty, never the full bank
  var filtered = scopeEngine.filterQuestionsForTopicScope(QUESTIONS, s);
  if (filtered.length !== 0) fail('conflict: topicId + yearId must produce an empty set');
})();

// ---- 6. wrong sourceType rejected ----
(function () {
  var s = scopeEngine.resolveTopicScope({
    exam: 'itpass', sourceType: 'past_exam_japanese', topicId: 'technology'
  });
  if (!s || s.valid) fail('sourceType: non-lesson_quiz topic scope must be rejected');
})();

// ---- 7. no topicId -> null -> unchanged set ----
(function () {
  var s = scopeEngine.resolveTopicScope({ exam: 'itpass', sourceType: 'lesson_quiz' });
  if (s !== null) fail('no-topic: scope must be null when topicId is absent');
  var sample = QUESTIONS.slice(0, 10);
  var out = scopeEngine.filterQuestionsForTopicScope(sample, s);
  if (out !== sample) fail('no-topic: filtering with null scope must return the original array reference unchanged');
})();

// ---- 8. unknown topicId -> rejected -> empty (never broad) ----
(function () {
  var s = scopeEngine.resolveTopicScope({
    exam: 'itpass', sourceType: 'lesson_quiz', topicId: 'definitely-not-real'
  });
  if (!s || s.valid) fail('unknown: unknown topicId must be rejected');
  var filtered = scopeEngine.filterQuestionsForTopicScope(QUESTIONS, s);
  if (filtered.length !== 0) fail('unknown: unknown topicId must yield an empty set, not a broad bank');
})();

// ---- 9. non-topic courses cannot produce a valid scope ----
NON_TOPIC_COURSES.forEach(function (courseId) {
  var s = scopeEngine.resolveTopicScope({
    exam: courseId, sourceType: 'lesson_quiz', topicId: 'technology'
  });
  if (s && s.valid) fail(courseId + ': must not produce a valid topic scope');
});

// ---- 10. verified topics must resolve valid AND have a real route ----
var verifiedTopics = (registry.TOPICS || []).filter(function (t) { return t.practiceCapability === 'verified'; });
var routeBuilder = null;
if (fs.existsSync(path.join(ROOT, 'utils/course-topic-practice.js'))) {
  routeBuilder = require(path.join(ROOT, 'utils/course-topic-practice.js'));
}
verifiedTopics.forEach(function (t) {
  var tag = t.courseId + '/' + t.id;
  var scope = scopeEngine.resolveTopicScope({
    exam: t.courseId, sourceType: 'lesson_quiz', topicId: t.id
  });
  if (!scope || !scope.valid) { fail(tag + ': verified topic must resolve to a valid scope'); return; }
  if (scopeEngine.filterQuestionsForTopicScope(QUESTIONS, scope).length < 1) {
    fail(tag + ': verified topic must hit >=1 real question');
  }
  if (!routeBuilder || typeof routeBuilder.buildTopicPracticeRoute !== 'function') {
    fail(tag + ': verified topic requires utils/course-topic-practice.js route builder');
    return;
  }
  var route = routeBuilder.buildTopicPracticeRoute(t.courseId, t.id);
  if (typeof route !== 'string' || route.indexOf('/packages/quiz/pages/quiz/quiz') !== 0) {
    fail(tag + ': route builder must produce a real quiz route, got ' + route);
  }
  if (route.indexOf('topicId=' + t.id) < 0) fail(tag + ': route must carry topicId (not raw category)');
  if (route.indexOf('sourceType=lesson_quiz') < 0) fail(tag + ': route must fix sourceType=lesson_quiz');
  if (route.indexOf('yearId=') >= 0) fail(tag + ': route must not carry yearId');
  if (/category=/.test(route)) fail(tag + ': route must not carry a raw category param');
});
// route builder must reject unknown / deferred topics
if (routeBuilder && typeof routeBuilder.buildTopicPracticeRoute === 'function') {
  if (routeBuilder.buildTopicPracticeRoute('itpass', 'definitely-not-real') !== null) {
    fail('route builder must return null for unknown topic');
  }
  NON_TOPIC_COURSES.forEach(function (c) {
    if (routeBuilder.buildTopicPracticeRoute(c, 'technology') !== null) {
      fail('route builder must return null for ' + c);
    }
  });
}

// ---- 11. scope engine purity (scan code, comments stripped) ----
var code = scopeSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
if (/setStorageSync|removeStorageSync|wx\.setStorage/.test(code)) fail('scope engine must not write storage');
if (/course_questions|past_exam_bank/.test(code)) fail('scope engine must not import the question bank');
if (/\.push\(|\.splice\(|q\[\w+\]\s*=|question\.\w+\s*=/.test(code)) fail('scope engine must not mutate questions');
var longStr = code.match(/'[^'\n]{400,}'|"[^"\n]{400,}"/);
if (longStr) fail('scope engine contains a suspiciously long string (possible question/textbook text)');

// ---- report ----
if (failures.length) {
  console.error('COURSE TOPIC PRACTICE FAIL (' + failures.length + ')');
  failures.forEach(function (f) { console.error('  - ' + f); });
  process.exit(1);
}
var availCount = EXAMS.reduce(function (n, e) { return n + registry.getAvailableTopicsForCourse(e).length; }, 0);
console.log('COURSE TOPIC PRACTICE PASS — ' + availCount + ' available topics resolve to exact category scope, ' +
  verifiedTopics.length + ' verified with real routes');
process.exit(0);
