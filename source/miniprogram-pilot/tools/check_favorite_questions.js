#!/usr/bin/env node
'use strict';
/*
 * tools/check_favorite_questions.js  (R2.7)
 *
 * Exercises the independent question-favorite domain against a mocked wx store,
 * the REAL utils/storage.js + utils/favorite-questions.js:
 *
 *   1. toggle adds, toggle again removes (idempotent, never duplicates)
 *   2. key combines exam+sourceType+questionId (stable, no question text)
 *   3. stored items contain NO question body (no questionZh/options/explanation)
 *   4. cross-exam isolation (itpass vs sg counts independent)
 *   5. incomplete identity cannot be favorited
 *   6. backup export includes favoriteQuestions; import round-trips
 *   7. legacy backup (no favoriteQuestions) imports fine, leaves favorites empty
 *   8. corrupt favoriteQuestions shape is ignored safely
 *   9. term favorites are untouched by question-favorite writes
 *  10. favorite-questions never imports the question bank / builds a route
 *
 * Exit 0 = pass, exit 1 = fail.
 */

var path = require('path');
var fs = require('fs');
var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(msg) { failures.push(msg); }

var store = {};
global.wx = {
  getStorageSync: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : ''; },
  setStorageSync: function (k, v) { store[k] = v; },
  removeStorageSync: function (k) { delete store[k]; }
};

var storage = require(path.join(ROOT, 'utils/storage.js'));
var fav = require(path.join(ROOT, 'utils/favorite-questions.js'));

var IT = { exam: 'itpass', questionId: 'q-itpass-lesson-0001', sourceType: 'lesson_quiz' };
var IT2 = { exam: 'itpass', questionId: 'q-itpass-lesson-0002', sourceType: 'lesson_quiz' };
var SG = { exam: 'sg', questionId: 'q-sg-lesson-0001', sourceType: 'lesson_quiz' };

// ---- 1. toggle add/remove idempotent ----
if (fav.isQuestionFavorited(IT) !== false) fail('initial state must be not-favorited');
if (fav.toggleFavoriteQuestion(IT) !== true) fail('first toggle must favorite (return true)');
if (fav.isQuestionFavorited(IT) !== true) fail('IT must be favorited after toggle');
if (fav.getFavoriteQuestionCountForExam('itpass') !== 1) fail('itpass count must be 1');
// toggle the same identity object again -> removed
if (fav.toggleFavoriteQuestion(IT) !== false) fail('second toggle must remove (return false)');
if (fav.getFavoriteQuestionCountForExam('itpass') !== 0) fail('itpass count must be 0 after removal');
// re-add then verify no duplicates even if storage seeded with a dup
fav.toggleFavoriteQuestion(IT);
store[storage.FAVORITE_QUESTIONS_KEY].items.push({ key: fav.buildKey(IT), exam: IT.exam, questionId: IT.questionId, sourceType: IT.sourceType, createdAt: 1 });
if (fav.getFavoriteQuestionCountForExam('itpass') !== 1) fail('duplicate items must be de-duplicated on read');

// ---- 2/3. key shape + no question text ----
var stored = store[storage.FAVORITE_QUESTIONS_KEY];
var sample = stored.items[0];
if (sample.key !== 'itpass::lesson_quiz::q-itpass-lesson-0001') fail('key must be exam::sourceType::questionId, got ' + sample.key);
['questionZh', 'questionJa', 'options', 'answer', 'explanationZh', 'explanationJa', 'title', 'term'].forEach(function (banned) {
  if (banned in sample) fail('favorite item must not store question body field: ' + banned);
});

// ---- 4. cross-exam isolation ----
fav.toggleFavoriteQuestion(SG);
fav.toggleFavoriteQuestion(IT2);
if (fav.getFavoriteQuestionCountForExam('itpass') !== 2) fail('itpass should have 2 favorites');
if (fav.getFavoriteQuestionCountForExam('sg') !== 1) fail('sg should have 1 favorite');
if (fav.getFavoriteQuestionKeysForExam('sg').indexOf('q-itpass-lesson-0001') >= 0) fail('cross-exam leak: itpass id in sg list');

// ---- 5. incomplete identity ----
if (fav.toggleFavoriteQuestion({ exam: 'itpass', questionId: 'x' }) !== false) fail('incomplete identity (no sourceType) must not favorite');
if (fav.isQuestionFavorited({ questionId: 'x' }) !== false) fail('incomplete identity must report not-favorited');

// ---- 6. backup export/import round-trip ----
var exported = storage.exportLocalBackup();
if (!exported.data.favoriteQuestions || !Array.isArray(exported.data.favoriteQuestions.items)) fail('export must include favoriteQuestions {items}');
var expCount = exported.data.favoriteQuestions.items.length;
Object.keys(store).forEach(function (k) { delete store[k]; });
if (!storage.importLocalBackup(exported)) fail('importLocalBackup rejected a fresh export');
if (fav.getFavoriteQuestionCountForExam('itpass') + fav.getFavoriteQuestionCountForExam('sg') !== expCount) fail('import lost favorites');

// ---- 7. legacy backup (no favoriteQuestions) ----
Object.keys(store).forEach(function (k) { delete store[k]; });
var legacy = { app: 'study-tools-mini', version: 'vX', data: { favoriteTerms: [{ id: 't1' }], wrongQuestions: [], quizAttempts: [] } };
if (!storage.importLocalBackup(legacy)) fail('legacy backup without favoriteQuestions must import');
if (fav.getFavoriteQuestionCountForExam('itpass') !== 0) fail('legacy import must leave question favorites empty');
if (storage.getFavoriteTerms().length !== 1) fail('legacy term favorites must import intact');

// ---- 8. corrupt favoriteQuestions shape ignored ----
Object.keys(store).forEach(function (k) { delete store[k]; });
var corrupt = { app: 'study-tools-mini', version: 'vX', data: { favoriteTerms: [], wrongQuestions: [], quizAttempts: [], favoriteQuestions: { items: 'not-an-array' } } };
if (!storage.importLocalBackup(corrupt)) fail('backup with corrupt favoriteQuestions should still import other data');
if (fav.getFavoriteQuestionCountForExam('itpass') !== 0) fail('corrupt favoriteQuestions must be ignored safely');

// ---- 9. term favorites untouched by question favorites ----
Object.keys(store).forEach(function (k) { delete store[k]; });
storage.addFavoriteTerm('term-1');
fav.toggleFavoriteQuestion(IT);
if (!storage.isFavoriteTerm('term-1')) fail('question favorite write must not disturb term favorites');
if (store[storage.FAVORITE_TERMS_KEY] === store[storage.FAVORITE_QUESTIONS_KEY]) fail('term and question favorites must use distinct keys');

// ---- 10. source purity ----
var favSrc = fs.readFileSync(path.join(ROOT, 'utils/favorite-questions.js'), 'utf8');
if (/course_questions|past_exam_bank/.test(favSrc)) fail('favorite-questions must not import the question bank');
if (/navigateTo|\/packages\/quiz\/pages\/quiz/.test(favSrc)) fail('favorite-questions must not build a practice route');

if (failures.length) {
  console.error('FAVORITE QUESTIONS FAIL (' + failures.length + ')');
  failures.forEach(function (f) { console.error('  - ' + f); });
  process.exit(1);
}
console.log('FAVORITE QUESTIONS PASS — independent, isolated, backup-compatible, no question text stored');
process.exit(0);
