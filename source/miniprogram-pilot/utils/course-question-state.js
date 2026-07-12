// utils/course-question-state.js
// Pure-read adapter for the course question organizer (R2.8).
//
// Course wrong questions are filtered ONLY by the exact wrong.exam field.
// Course favorites come from the independent favorite-questions domain.
// No keyword matching, no priority re-computation, no canonical writes.
// Wrong records carry no priority/errorCount, so wrong ordering is by the real
// most-recent-wrong time (wrongAt) only — never a fabricated "most needed".
//
// State model (verified against static course-registry — no runtime capability toggle):
//   page-level:  available | invalid
//   sub-section: available | empty
// "deferred" is NOT currently producible (no course has questionOrganization:true
// with non-available availability), so it is intentionally absent from the API.

var storage = require('./storage');
var favoriteQuestions = require('./favorite-questions');
var registry = require('./course-registry');

var COURSE_EXAMS = { itpass: true, sg: true };

function isOrganizableCourse(courseId) {
  if (!COURSE_EXAMS[courseId]) return false;
  var c = registry.getCourseById(courseId);
  return !!(c && c.courseKind === 'certification' && c.availability === 'available');
}

// Wrong questions for a course, newest-wrong first. Lightweight view of the
// record's own snapshot — no cross-package question-bank import.
function getWrongQuestionsForCourse(courseId) {
  if (!isOrganizableCourse(courseId)) return [];
  var list = (storage.getWrongQuestions && storage.getWrongQuestions()) || [];
  return list
    .filter(function (w) { return w && w.exam === courseId; })
    .sort(function (a, b) { return (b.wrongAt || 0) - (a.wrongAt || 0); })
    .map(function (w) {
      var snap = w.questionSnapshot || {};
      return {
        questionId: w.id,
        exam: w.exam,
        sourceType: w.sourceType || snap.sourceType || '',
        wrongAt: w.wrongAt || 0,
        questionZh: snap.questionZh || '',
        questionJa: snap.questionJa || ''
      };
    });
}

// Course favorites, newest-favorited first. Identity only (no question text).
function getFavoriteQuestionsForCourse(courseId) {
  if (!isOrganizableCourse(courseId)) return [];
  return favoriteQuestions.getFavoriteQuestionsForExam(courseId).map(function (it) {
    return {
      questionId: it.questionId,
      exam: it.exam,
      sourceType: it.sourceType,
      createdAt: it.createdAt || 0
    };
  });
}

function sectionState(items) {
  return { status: items.length > 0 ? 'available' : 'empty', items: items, count: items.length };
}

// Organizer state. Page-level: available | invalid.  Sub-section: available | empty.
function getCourseQuestionOrganizerState(courseId) {
  if (!isOrganizableCourse(courseId)) {
    return {
      status: 'invalid',
      courseId: courseId || '',
      courseName: '',
      wrong: { status: 'invalid', items: [], count: 0 },
      favorite: { status: 'invalid', items: [], count: 0 }
    };
  }
  var course = registry.getCourseById(courseId);
  return {
    status: 'available',
    courseId: courseId,
    courseName: course.displayName,
    wrong: sectionState(getWrongQuestionsForCourse(courseId)),
    favorite: sectionState(getFavoriteQuestionsForCourse(courseId))
  };
}

module.exports = {
  isOrganizableCourse: isOrganizableCourse,
  getWrongQuestionsForCourse: getWrongQuestionsForCourse,
  getFavoriteQuestionsForCourse: getFavoriteQuestionsForCourse,
  getCourseQuestionOrganizerState: getCourseQuestionOrganizerState
};
