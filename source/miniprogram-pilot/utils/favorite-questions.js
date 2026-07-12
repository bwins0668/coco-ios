// utils/favorite-questions.js
// Independent question-favorite domain (R2.7).
//
// Stores ONLY stable identity + lightweight time — never question text, options,
// explanations, or any copy of the question bank. Fully isolated from term
// favorites / flashcards / wrong questions. Persists via storage's dedicated
// FAVORITE_QUESTIONS_KEY ({version:1, items:[...]}). Never writes canonical data,
// never builds a practice route.
//
// Identity = { exam, questionId, sourceType }. The audited stable key combines
// all three (questionId is globally unique today, but exam+sourceType make the
// key self-describing and safe even if a future split bank reuses an id).

var storage = require('./storage');

function isValidIdentity(identity) {
  return !!(identity && identity.exam && identity.questionId && identity.sourceType);
}

function buildKey(identity) {
  return String(identity.exam) + '::' + String(identity.sourceType) + '::' + String(identity.questionId);
}

// Read all well-formed favorite items, de-duplicated by key (defends against
// corrupt or hand-edited backups). Never throws.
function getAll() {
  var data = storage.getFavoriteQuestions();
  var items = (data && Array.isArray(data.items)) ? data.items : [];
  var seen = Object.create(null);
  var out = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (!it || !it.exam || !it.questionId || !it.sourceType) continue;
    var key = it.key || buildKey(it);
    if (seen[key]) continue;
    seen[key] = true;
    out.push({
      key: key,
      exam: it.exam,
      questionId: it.questionId,
      sourceType: it.sourceType,
      createdAt: typeof it.createdAt === 'number' ? it.createdAt : 0
    });
  }
  return out;
}

function saveAll(items) {
  storage.saveFavoriteQuestions({ version: 1, items: items });
}

function isQuestionFavorited(identity) {
  if (!isValidIdentity(identity)) return false;
  var key = buildKey(identity);
  return getAll().some(function (it) { return it.key === key; });
}

// Toggle. Returns the NEW favorited state (true=now favorited, false=removed).
// Idempotent: a question can never appear twice.
function toggleFavoriteQuestion(identity) {
  if (!isValidIdentity(identity)) return false;
  var items = getAll();
  var key = buildKey(identity);
  var idx = -1;
  for (var i = 0; i < items.length; i++) {
    if (items[i].key === key) { idx = i; break; }
  }
  if (idx >= 0) {
    items.splice(idx, 1);
    saveAll(items);
    return false;
  }
  items.push({
    key: key,
    exam: identity.exam,
    questionId: identity.questionId,
    sourceType: identity.sourceType,
    createdAt: Date.now()
  });
  saveAll(items);
  return true;
}

function removeFavoriteQuestion(identity) {
  if (!isValidIdentity(identity)) return;
  var key = buildKey(identity);
  saveAll(getAll().filter(function (it) { return it.key !== key; }));
}

// Full favorite items for a course (most-recent first).
function getFavoriteQuestionsForExam(exam) {
  if (!exam) return [];
  return getAll()
    .filter(function (it) { return it.exam === exam; })
    .sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
}

// Stable questionIds for a course (used by the internal practice scope; never a
// route param). Most-recent first.
function getFavoriteQuestionKeysForExam(exam) {
  return getFavoriteQuestionsForExam(exam).map(function (it) { return it.questionId; });
}

function getFavoriteQuestionCountForExam(exam) {
  return getFavoriteQuestionsForExam(exam).length;
}

module.exports = {
  buildKey: buildKey,
  isValidIdentity: isValidIdentity,
  isQuestionFavorited: isQuestionFavorited,
  toggleFavoriteQuestion: toggleFavoriteQuestion,
  removeFavoriteQuestion: removeFavoriteQuestion,
  getFavoriteQuestionsForExam: getFavoriteQuestionsForExam,
  getFavoriteQuestionKeysForExam: getFavoriteQuestionKeysForExam,
  getFavoriteQuestionCountForExam: getFavoriteQuestionCountForExam
};
