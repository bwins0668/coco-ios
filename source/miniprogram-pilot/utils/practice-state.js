// utils/practice-state.js
// R3.1 Pure read-model adapter for practice tab landing state.
//
// Takes a LAST_ATTEMPT from storage.getLastAttempt() and returns a view-model
// object with the exact same shape that pages/practice/practice.js has always
// produced via its inline _loadState. No wx, no Page, no setData, no writes.
//
// Input contract:
//   lastAttempt:  storage.getLastAttempt() return value (object or null)
//   May be null/undefined/falsy → safe empty state.
//
// Output contract (stable — never adds/removes/renames keys):
//   {
//     hasLastAttempt:  boolean,
//     lastExamLabel:   string,
//     lastSourceLabel: string,
//     lastExam:        string,
//     lastSourceType:  string
//   }
//
// Exam label mapping (inline, no external dependency on navigation.js or
// course-registry — the page only ever shows two exam names and a wrong_only
// sentinel, so the mapping is intentionally small and self-contained).

var storage = require('./storage');

var EXAM_LABELS = { itpass: 'IT Passport', sg: 'SG 信息安全' };
var SOURCE_LABELS = { lesson_quiz: '模拟练习', past_exam_japanese: '真题练习', wrong_only: '错题重练' };

function getPracticeLandingState() {
  var lastAttempt = null;
  try {
    lastAttempt = storage.getLastAttempt ? storage.getLastAttempt() : null;
  } catch (e) {
    lastAttempt = null;
  }

  if (!lastAttempt) {
    return {
      hasLastAttempt: false,
      lastExamLabel: '',
      lastSourceLabel: '',
      lastExam: '',
      lastSourceType: ''
    };
  }

  if (lastAttempt.sourceType === 'wrong_only') {
    return {
      hasLastAttempt: true,
      lastExamLabel: '错题练习',
      lastSourceLabel: '错题重练',
      lastExam: 'wrong_only',
      lastSourceType: 'wrong_only'
    };
  }

  return {
    hasLastAttempt: true,
    lastExamLabel: EXAM_LABELS[lastAttempt.exam] || lastAttempt.exam || '',
    lastSourceLabel: SOURCE_LABELS[lastAttempt.sourceType] || lastAttempt.sourceType || '',
    lastExam: lastAttempt.exam || '',
    lastSourceType: lastAttempt.sourceType || ''
  };
}

module.exports = {
  getPracticeLandingState: getPracticeLandingState
};
