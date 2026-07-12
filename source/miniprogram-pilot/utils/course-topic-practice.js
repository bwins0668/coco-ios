// utils/course-topic-practice.js
// Route builder for verified exam-topic practice (R2.1).
//
// Builds the ONE real quiz route a verified topic is allowed to open. The route
// carries `topicId` (never a raw category), fixes sourceType=lesson_quiz, and
// never adds yearId. Unknown or non-verified topics return null. No storage,
// no dependency on quiz-page internals.

var contentRegistry = require('./course-content-registry');

var ALLOWED_COURSES = { itpass: true, sg: true };
var QUIZ_PAGE = '/packages/quiz/pages/quiz/quiz';

/**
 * Whether a topic may start verified practice through the existing quiz.
 * @returns {boolean}
 */
function canStartTopicPractice(courseId, topicId) {
  if (!ALLOWED_COURSES[courseId]) return false;
  var topic = contentRegistry.getTopicById(courseId, topicId);
  return !!(topic &&
    topic.availability === 'available' &&
    topic.practiceCapability === 'verified');
}

/**
 * Build the verified topic practice route, or null when not allowed.
 * @returns {string|null}
 */
function buildTopicPracticeRoute(courseId, topicId) {
  if (!canStartTopicPractice(courseId, topicId)) return null;
  return QUIZ_PAGE +
    '?exam=' + courseId +
    '&sourceType=lesson_quiz' +
    '&topicId=' + topicId;
}

module.exports = {
  canStartTopicPractice: canStartTopicPractice,
  buildTopicPracticeRoute: buildTopicPracticeRoute
};
