#!/usr/bin/env node
'use strict';
/*
 * tools/check_attempt_context_compatibility.js  (R2.6)
 *
 * Proves the optional topic-attempt context is backward compatible, using a
 * mocked wx storage and the REAL utils/storage.js + utils/course-state.js:
 *
 *   1. legacy attempts WITHOUT topicId remain readable by the stat/last readers
 *   2. a normal attempt (no topic payload) never gains a topicId
 *   3. a topic attempt stores topicId/topicTitleSnapshot strictly from payload
 *   4. attempts persist under the SAME quizAttempts key (no new storage key)
 *   5. backup export/import round-trips the optional topic context losslessly
 *   6. course-state still reports canResume=false for a topic attempt
 *   7. utils/storage.js declares no extra storage key for topic context
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

// fresh require
var storage = require(path.join(ROOT, 'utils/storage.js'));
var courseState = require(path.join(ROOT, 'utils/course-state.js'));

// ---- 1. legacy attempts (no topicId) stay readable ----
store[storage.QUIZ_ATTEMPTS_KEY || 'study-tools-mini-quiz-attempts-v1'] = [
  { id: 'attempt-1-q1', questionId: 'q1', exam: 'itpass', sourceType: 'lesson_quiz',
    selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true, answeredAt: 1000 }
];
var legacyStats = storage.getQuizStatsByFilter('itpass', 'lesson_quiz');
if (!legacyStats || legacyStats.total !== 1) fail('legacy attempt without topicId is not readable by getQuizStatsByFilter');
if (storage.getLastAttemptByExam('itpass') !== 1000) fail('legacy attempt not readable by getLastAttemptByExam');

// reset store
Object.keys(store).forEach(function (k) { delete store[k]; });

// ---- 2. normal attempt gets no topicId ----
storage.addQuizAttempt({ questionId: 'q2', exam: 'itpass', sourceType: 'lesson_quiz',
  selectedAnswer: 'B', correctAnswer: 'C', isCorrect: false });
var attempts = storage.getQuizAttempts();
if (attempts.length !== 1) fail('addQuizAttempt did not persist normal attempt');
if ('topicId' in attempts[0]) fail('normal attempt must not carry topicId');

// ---- 3. topic attempt stores topic context from payload ----
storage.addQuizAttempt({ questionId: 'q3', exam: 'sg', sourceType: 'lesson_quiz',
  selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true,
  topicId: 'technology', topicTitleSnapshot: '技术系' });
attempts = storage.getQuizAttempts();
var topicAttempt = attempts[attempts.length - 1];
if (topicAttempt.topicId !== 'technology') fail('topic attempt must store topicId from payload');
if (topicAttempt.topicTitleSnapshot !== '技术系') fail('topic attempt must store topicTitleSnapshot from payload');

// ---- 4. no new storage key for topic context ----
var keys = Object.keys(store);
if (keys.length !== 1) fail('topic context must not introduce extra storage keys, found: ' + keys.join(','));
if (keys[0] !== (storage.QUIZ_ATTEMPTS_KEY || 'study-tools-mini-quiz-attempts-v1')) {
  fail('attempts must persist under the quiz attempts key only, found: ' + keys[0]);
}

// ---- 5. backup export/import round-trips topic context ----
// seed minimum valid backup shape requirements (favoriteTerms / wrongQuestions arrays exist)
var exported = storage.exportLocalBackup();
var hasTopicInExport = (exported.data.quizAttempts || []).some(function (a) { return a.topicId === 'technology'; });
if (!hasTopicInExport) fail('export must include topic context on topic attempts');
// wipe and re-import
Object.keys(store).forEach(function (k) { delete store[k]; });
var ok = storage.importLocalBackup(exported);
if (!ok) fail('importLocalBackup rejected a freshly exported backup');
var reattempts = storage.getQuizAttempts();
if (!reattempts.some(function (a) { return a.topicId === 'technology' && a.topicTitleSnapshot === '技术系'; })) {
  fail('import lost the optional topic context');
}
// legacy backup (no topicId fields) must still import fine
var legacyBackup = { app: 'study-tools-mini', version: 'vX', data: {
  favoriteTerms: [], wrongQuestions: [],
  quizAttempts: [{ id: 'a', questionId: 'q', exam: 'itpass', sourceType: 'lesson_quiz', selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true, answeredAt: 5 }]
} };
if (!storage.importLocalBackup(legacyBackup)) fail('legacy backup without topic context must import');

// ---- 6. course-state never treats a topic attempt as resumable ----
Object.keys(store).forEach(function (k) { delete store[k]; });
storage.addQuizAttempt({ questionId: 'q9', exam: 'itpass', sourceType: 'lesson_quiz',
  selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true, topicId: 'technology', topicTitleSnapshot: '技术系' });
var cstate = courseState.getCertificationCourseState('itpass');
if (cstate.canResume !== false) fail('course-state must keep canResume=false even for topic attempts');
if (!cstate.hasHistoricalAttempt) fail('course-state should still see the attempt as history');

// ---- 7. source: no extra storage key constant added for topic context ----
var storageSrc = fs.readFileSync(path.join(ROOT, 'utils/storage.js'), 'utf8');
if (/topic[-_]?attempt[-_]?context|topicAttempts.*KEY|TOPIC.*_KEY/i.test(storageSrc)) {
  fail('storage.js must not declare a dedicated topic-context storage key');
}

if (failures.length) {
  console.error('ATTEMPT CONTEXT COMPATIBILITY FAIL (' + failures.length + ')');
  failures.forEach(function (f) { console.error('  - ' + f); });
  process.exit(1);
}
console.log('ATTEMPT CONTEXT COMPATIBILITY PASS — optional topic context is backward compatible, no new key');
process.exit(0);
