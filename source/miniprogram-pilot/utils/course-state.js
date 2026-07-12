// utils/course-state.js
// Pure-read adapter for course-specific learning state.
// No storage writes, no checkpoints, no progress fabrication.

var storage = require('./storage');
var registry = require('./course-registry');

var SOURCE_LABELS = {
  lesson_quiz: '模拟练习',
  past_exam_japanese: '真题练习',
  wrong_only: '错题重练'
};

/**
 * Get latest quiz attempt for a specific course (matched by attempt.exam === courseId).
 * @param {string} courseId
 * @returns {Object|null}
 */
function getLatestAttemptForCourse(courseId) {
  if (!courseId) return null;
  var list = storage.getQuizAttempts ? storage.getQuizAttempts() : [];
  if (!list.length) return null;

  var best = null;
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.exam !== courseId) continue;
    if (!a.answeredAt) continue;
    if (!best || a.answeredAt > best.answeredAt) best = a;
  }
  return best;
}

/**
 * Return certification course state (IT Passport / SG).
 * Always returns a safe object; never throws.
 * @param {string} courseId
 * @returns {{ courseId: string, lastAttempt: Object|null, hasHistoricalAttempt: boolean, canResume: boolean }}
 */
function getCertificationCourseState(courseId) {
  var course = registry.getCourseById(courseId);
  if (!course || course.courseKind !== 'certification' || course.availability !== 'available') {
    return { courseId: courseId || '', lastAttempt: null, hasHistoricalAttempt: false, canResume: false };
  }

  var attempt = getLatestAttemptForCourse(courseId);
  var hasAttempt = !!attempt;

  return {
    courseId: courseId,
    lastAttempt: hasAttempt ? {
      exam: attempt.exam,
      sourceType: attempt.sourceType,
      answeredAt: attempt.answeredAt
    } : null,
    hasHistoricalAttempt: hasAttempt,
    canResume: false // no checkpoint system exists
  };
}

/**
 * Format relative time string from a timestamp.
 * @param {number} ts
 * @returns {string}
 */
function formatRelativeTime(ts) {
  if (!ts) return '';
  var diff = Date.now() - ts;
  var min = Math.floor(diff / 60000);
  var hour = Math.floor(diff / 3600000);
  var day = Math.floor(diff / 86400000);
  if (min < 1) return '刚刚';
  if (min < 60) return min + '分钟前';
  if (hour < 24) return hour + '小时前';
  if (day < 7) return day + '天前';
  var d = new Date(ts);
  return (d.getMonth() + 1) + '/' + d.getDate();
}

module.exports = {
  getLatestAttemptForCourse: getLatestAttemptForCourse,
  getCertificationCourseState: getCertificationCourseState,
  formatRelativeTime: formatRelativeTime
};
