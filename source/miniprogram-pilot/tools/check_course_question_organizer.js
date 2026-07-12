#!/usr/bin/env node
'use strict';
/*
 * tools/check_course_question_organizer.js  (R2.8)
 *
 * Exercises the course question organizer adapter against a mocked wx store:
 *
 *   1. 可组织课程识别 (itpass/sg → true; python/java/algorithm/mos → false)
 *   2. 非组织课程拒绝 (invalid status returned)
 *   3. wrong questions 仅按精确 exam 过滤
 *   4. favorite questions 仅来自独立收藏域 (favorite-questions.js)
 *   5. wrong 与 favorite 互不污染
 *   6. page-level available / invalid + sub-section available / empty
 *   7. 缺失或损坏数据安全降级（不产生 deferred）
 *   8. 不读取 canonical 题库正文
 *   9. 不写 storage
 *  10. 页面文件、路由、入口的静态存在性与引用完整性
 *
 * Exit 0 = pass, exit 1 = fail.
 */

var path = require('path');
var fs = require('fs');
var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(msg) { failures.push(msg); }

// ---- mocked wx storage ----
var store = {};
global.wx = {
  getStorageSync: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : ''; },
  setStorageSync: function (k, v) { store[k] = v; },
  removeStorageSync: function (k) { delete store[k]; }
};

// ---- seed test data ----
store['study-tools-mini-wrong-questions-v1'] = [
  { id: 'w1', exam: 'itpass', sourceType: 'lesson_quiz', wrongAt: 1719000000000, questionSnapshot: { questionZh: '什么是IT护照？', questionJa: 'ITパスポートとは？' } },
  { id: 'w2', exam: 'sg', sourceType: 'lesson_quiz', wrongAt: 1718000000000, questionSnapshot: { questionZh: '什么是SG？', questionJa: 'SGとは？' } },
  { id: 'w3', exam: 'itpass', sourceType: 'past_exam_japanese', wrongAt: 1717000000000, questionSnapshot: {} }
];
store['study-tools-mini-favorite-questions-v1'] = { version: 1, items: [
  { exam: 'itpass', questionId: 'q-itp-1', sourceType: 'lesson_quiz', createdAt: 1719000000000, key: 'itpass::lesson_quiz::q-itp-1' },
  { exam: 'itpass', questionId: 'q-itp-2', sourceType: 'past_exam_japanese', createdAt: 1718000000000, key: 'itpass::past_exam_japanese::q-itp-2' },
  { exam: 'sg', questionId: 'q-sg-1', sourceType: 'lesson_quiz', createdAt: 1717000000000, key: 'sg::lesson_quiz::q-sg-1' }
]};

// ---- load modules ----
var organizer = require(path.join(ROOT, 'utils/course-question-state'));
var favQuestions = require(path.join(ROOT, 'utils/favorite-questions'));
var storage = require(path.join(ROOT, 'utils/storage'));

// ===== 1. Organizable course identification =====
if (!organizer.isOrganizableCourse('itpass')) fail('1.1: itpass should be organizable');
if (!organizer.isOrganizableCourse('sg')) fail('1.2: sg should be organizable');
if (organizer.isOrganizableCourse('python')) fail('1.3: python should NOT be organizable');
if (organizer.isOrganizableCourse('java')) fail('1.4: java should NOT be organizable');
if (organizer.isOrganizableCourse('algorithm')) fail('1.5: algorithm should NOT be organizable');
if (organizer.isOrganizableCourse('mos365')) fail('1.6: mos365 should NOT be organizable');
if (organizer.isOrganizableCourse('')) fail('1.7: empty string should NOT be organizable');

// ===== 2. Non-organizable course returns invalid state =====
var sPython = organizer.getCourseQuestionOrganizerState('python');
if (sPython.status !== 'invalid') fail('2.1: python state should be invalid, got ' + sPython.status);
if (sPython.wrong.status !== 'invalid') fail('2.2: python wrong should be invalid');
if (sPython.favorite.status !== 'invalid') fail('2.3: python favorite should be invalid');

// ===== 3. Wrong questions filtered by exact exam =====
var wItpass = organizer.getWrongQuestionsForCourse('itpass');
if (wItpass.length !== 2) fail('3.1: itpass wrong should be 2, got ' + wItpass.length);
if (wItpass[0].exam !== 'itpass') fail('3.2: wrong item should have exam=itpass');

var wSg = organizer.getWrongQuestionsForCourse('sg');
if (wSg.length !== 1) fail('3.3: sg wrong should be 1, got ' + wSg.length);
if (wSg[0].exam !== 'sg') fail('3.4: sg wrong item should have exam=sg');

// ===== 4. Favorite questions only from independent domain =====
var fItpass = organizer.getFavoriteQuestionsForCourse('itpass');
if (fItpass.length !== 2) fail('4.1: itpass favorites should be 2, got ' + fItpass.length);
if (fItpass[0].exam !== 'itpass') fail('4.2: favorite should have exam=itpass');

var fSg = organizer.getFavoriteQuestionsForCourse('sg');
if (fSg.length !== 1) fail('4.3: sg favorites should be 1, got ' + fSg.length);

// ===== 5. Wrong and favorites are independent (no cross-contamination) =====
if (wItpass[0].createdAt !== undefined) fail('5.1: wrong items should not have createdAt');
if (fItpass[0].wrongAt !== undefined) fail('5.2: favorite items should not have wrongAt');

// ===== 6. State classification: available vs empty vs invalid (no deferred) =====
var sItpass = organizer.getCourseQuestionOrganizerState('itpass');
if (sItpass.status !== 'available') fail('6.1: itpass overall should be available, got ' + sItpass.status);
if (sItpass.wrong.status !== 'available') fail('6.2: itpass wrong should be available');
if (sItpass.favorite.status !== 'available') fail('6.3: itpass favorite should be available');
if (sItpass.wrong.count !== 2) fail('6.4: itpass wrong count should be 2');
if (sItpass.favorite.count !== 2) fail('6.5: itpass favorite count should be 2');

// No code path produces 'deferred' — verify it's absent from the API
var qStateSrc = fs.readFileSync(path.join(ROOT, 'utils/course-question-state.js'), 'utf8');
if (qStateSrc.indexOf("status: 'deferred'") >= 0 || qStateSrc.indexOf('status: "deferred"') >= 0) {
  fail('6.6: course-question-state must not return deferred (no real source in registry)');
}

// Clear storage to test empty state
var origWrong = store['study-tools-mini-wrong-questions-v1'];
var origFav = store['study-tools-mini-favorite-questions-v1'];
store['study-tools-mini-wrong-questions-v1'] = [];
store['study-tools-mini-favorite-questions-v1'] = { version: 1, items: [] };
var sEmpty = organizer.getCourseQuestionOrganizerState('itpass');
if (sEmpty.wrong.status !== 'empty') fail('6.7: empty wrong should be empty, got ' + sEmpty.wrong.status);
if (sEmpty.favorite.status !== 'empty') fail('6.8: empty favorite should be empty, got ' + sEmpty.favorite.status);
if (sEmpty.wrong.count !== 0) fail('6.9: empty wrong count should be 0');
// restore
store['study-tools-mini-wrong-questions-v1'] = origWrong;
store['study-tools-mini-favorite-questions-v1'] = origFav;

// ===== 7. Corrupted data safe degradation (never produces deferred) =====
store['study-tools-mini-wrong-questions-v1'] = null;
var wNull = organizer.getWrongQuestionsForCourse('itpass');
if (wNull.length !== 0) fail('7.1: null wrong should return empty array');

store['study-tools-mini-favorite-questions-v1'] = { version: 1, items: 'not-an-array' };
var fCorrupt = organizer.getFavoriteQuestionsForCourse('itpass');
if (fCorrupt.length !== 0) fail('7.2: corrupt favorites should return empty array');

store['study-tools-mini-favorite-questions-v1'] = { version: 1, items: [{ exam: 'itpass', questionId: 'x', sourceType: 'lesson_quiz', createdAt: 'bad' }] };
var fBadTime = organizer.getFavoriteQuestionsForCourse('itpass');
if (fBadTime.length !== 1) fail('7.3: bad createdAt should still count as 1 item');
if (fBadTime[0].createdAt !== 0) fail('7.4: non-number createdAt should default to 0');

// Corrupt data degrades to empty (available), never deferred
var sCorrupt = organizer.getCourseQuestionOrganizerState('itpass');
if (sCorrupt.status !== 'available') fail('7.5: corrupt storage should still be available (degraded to empty)');

// restore
store['study-tools-mini-wrong-questions-v1'] = origWrong;
store['study-tools-mini-favorite-questions-v1'] = origFav;

// ===== 8. No canonical question bank imported =====
var organizerSrc = qStateSrc; // reuse from check 6.6
var bannedPaths = ['questions.js', 'explanations_zh.js', 'past_exam_bank'];
for (var bi = 0; bi < bannedPaths.length; bi++) {
  if (organizerSrc.indexOf("require('../../data/" + bannedPaths[bi] + "')") >= 0 ||
      organizerSrc.indexOf('require("../../data/' + bannedPaths[bi] + '")') >= 0) {
    fail('8.1: course-question-state imports ' + bannedPaths[bi]);
  }
}

// ===== 9. No storage writes =====
if (organizerSrc.indexOf('setStorageSync') >= 0 || organizerSrc.indexOf('setStorage') >= 0) {
  fail('9.1: course-question-state must not write storage');
}
var finalWrong = storage.getWrongQuestions();
if (!Array.isArray(finalWrong) || finalWrong.length !== 3) {
  fail('9.2: organizer mutated wrong questions (expected 3, got ' + (Array.isArray(finalWrong) ? finalWrong.length : typeof finalWrong) + ')');
}

// ===== 10. Static existence: page files, route, entry =====
var pageDir = path.join(ROOT, 'pages', 'course-organize');
['course-organize.js', 'course-organize.wxml', 'course-organize.wxss', 'course-organize.json'].forEach(function (f) {
  if (!fs.existsSync(path.join(pageDir, f))) fail('10.1: missing page file ' + f);
});

var appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
if ((appJson.pages || []).indexOf('pages/course-organize/course-organize') < 0) {
  fail('10.2: page not registered in app.json');
}

var navJs = fs.readFileSync(path.join(ROOT, 'utils/navigation.js'), 'utf8');
if (navJs.indexOf('goCourseQuestionOrganizer') < 0) {
  fail('10.3: goCourseQuestionOrganizer missing in navigation.js');
}

var courseJs = fs.readFileSync(path.join(ROOT, 'pages/course/course.js'), 'utf8');
if (courseJs.indexOf('goQuestionOrganizer') < 0) {
  fail('10.4: goQuestionOrganizer missing in course.js');
}

var courseWxml = fs.readFileSync(path.join(ROOT, 'pages/course/course.wxml'), 'utf8');
if (courseWxml.indexOf('questionOrganization') < 0) {
  fail('10.5: questionOrganization capability guard missing in course.wxml');
}

// ---- Report ----
console.log('');
if (failures.length === 0) {
  console.log('COURSE QUESTION ORGANIZER PASS — 10 checks, 0 failures');
  process.exit(0);
} else {
  console.log('COURSE QUESTION ORGANIZER FAIL — ' + failures.length + ' failure(s):');
  failures.forEach(function (f) { console.log('  FAIL: ' + f); });
  process.exit(1);
}
