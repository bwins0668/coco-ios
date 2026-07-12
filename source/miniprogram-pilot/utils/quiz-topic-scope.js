// utils/quiz-topic-scope.js
// Pure topic-scope engine for verified exam-topic practice (R2.0).
//
// Turns an untrusted `topicId` query param into an EXACT, registry-verified
// category filter for the existing quiz. Never trusts a raw category string,
// never filters by title / keyword / translation, never touches storage,
// never mutates question objects, never fabricates questions.
//
// Resolution result contract:
//   - resolveTopicScope returns `null`            -> no topicId; caller keeps its
//                                                    normal (unchanged) behavior.
//   - resolveTopicScope returns `{valid:false}`   -> topicId present but rejected;
//                                                    caller must show a controlled
//                                                    empty state and MUST NOT fall
//                                                    back to the full question set.
//   - resolveTopicScope returns `{valid:true,...}`-> exact category scope.

var contentRegistry = require('./course-content-registry');

var LESSON_SOURCE = 'lesson_quiz';

/**
 * Resolve a topic scope from quiz query options.
 * @param {{exam?:string, sourceType?:string, topicId?:string, yearId?:string}} options
 * @returns {null|{valid:false, reason:string}|{valid:true, courseId, topicId, title, titleJa, exactField, exactValues}}
 */
function resolveTopicScope(options) {
  options = options || {};
  var topicId = options.topicId;
  if (!topicId) return null; // no topic scope requested -> normal behavior

  // topicId is mutually exclusive with a past-exam year selection.
  if (options.yearId) return { valid: false, reason: 'conflict-yearId' };

  // topic practice is only defined over lesson_quiz.
  if (options.sourceType !== LESSON_SOURCE) return { valid: false, reason: 'bad-sourceType' };

  var exam = options.exam;
  if (!exam) return { valid: false, reason: 'missing-exam' };

  var topic = contentRegistry.getTopicById(exam, topicId);
  if (!topic) return { valid: false, reason: 'unknown-topic' };
  if (topic.courseId !== exam) return { valid: false, reason: 'exam-mismatch' };
  if (topic.availability !== 'available') return { valid: false, reason: 'not-available' };

  var sel = topic.questionSelector;
  if (!sel || !sel.exactField || !Array.isArray(sel.exactValues) || sel.exactValues.length === 0) {
    return { valid: false, reason: 'bad-selector' };
  }

  return {
    valid: true,
    courseId: exam,
    topicId: topicId,
    title: topic.title,
    titleJa: topic.titleJa,
    exactField: sel.exactField,
    exactValues: sel.exactValues.slice()
  };
}

/**
 * Filter questions for a resolved scope. Self-contained: also enforces
 * exam + lesson_quiz so passing the full bank is safe.
 * @param {Array} questions
 * @param {null|object} scope
 * @returns {Array} a NEW array; never mutates input questions
 */
function filterQuestionsForTopicScope(questions, scope) {
  questions = questions || [];
  if (!scope) return questions;     // no scope -> unchanged
  if (!scope.valid) return [];      // rejected scope -> controlled empty, NEVER full bank
  var field = scope.exactField;
  var values = scope.exactValues;
  var courseId = scope.courseId;
  return questions.filter(function (q) {
    return q &&
      q.exam === courseId &&
      q.sourceType === LESSON_SOURCE &&
      values.indexOf(q[field]) >= 0;
  });
}

/**
 * Lightweight, honest range label. Empty string for no/invalid scope.
 * @param {null|object} scope
 * @returns {string}
 */
function getTopicPracticeLabel(scope) {
  if (!scope || !scope.valid) return '';
  return '本主题练习 · ' + scope.title;
}

module.exports = {
  resolveTopicScope: resolveTopicScope,
  filterQuestionsForTopicScope: filterQuestionsForTopicScope,
  getTopicPracticeLabel: getTopicPracticeLabel
};
