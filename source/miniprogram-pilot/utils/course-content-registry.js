// utils/course-content-registry.js
// Static, verified exam-topic registry for certification courses (R1.5).
//
// Pure data + pure read helpers. NO storage. NO question-bank import.
// NO textbook text. NO fabricated counts, progress, or accuracy.
//
// SOURCE OF TRUTH for the taxonomy below is the `category` field carried by
// every lesson_quiz question in packages/quiz/data/course_questions.js,
// audited read-only in R1.5-B:
//   - itpass lesson_quiz: 85/85 questions carry `category`
//   - sg     lesson_quiz: 44/44 questions carry `category`
// The values are the official IPA syllabus strands
// (テクノロジ系 / マネジメント系 / ストラテジ系). They are exact, stable
// string values matched by equality via questionSelector — NEVER inferred
// from titles, kana keywords, or display copy.
//
// practiceCapability is 'verified' for these six topics as of R2.1: the quiz
// page now accepts a `topicId` query param and delegates to the pure
// utils/quiz-topic-scope engine, which resolves topicId through THIS registry
// and filters by the exact `category` selector. Activation is gated by
// tools/check_course_topic_practice.js, which proves each verified topic
// resolves to a valid scope, hits >=1 real lesson_quiz question, and is backed
// by a real route from utils/course-topic-practice.js. A topic must NEVER be
// hand-flipped to 'verified' without passing that validator.
//
// SG's `科目B` category (a single lesson_quiz question) is intentionally NOT
// registered: one question is an incomplete exam-section fragment, not a
// coherent learning topic. Surfacing it would be honest-but-noisy; omitting
// it keeps the surfaced structure to the three verified strands.

var TOPICS = [
  // ---- IT Passport (itpass) — three official IPA strands ----
  {
    id: 'technology',
    courseId: 'itpass',
    title: '技术系',
    titleJa: 'テクノロジ系',
    structureKind: 'exam-topic',
    availability: 'available',
    questionSelector: { exactField: 'category', exactValues: ['テクノロジ系'] },
    practiceCapability: 'verified'
  },
  {
    id: 'management',
    courseId: 'itpass',
    title: '管理系',
    titleJa: 'マネジメント系',
    structureKind: 'exam-topic',
    availability: 'available',
    questionSelector: { exactField: 'category', exactValues: ['マネジメント系'] },
    practiceCapability: 'verified'
  },
  {
    id: 'strategy',
    courseId: 'itpass',
    title: '战略系',
    titleJa: 'ストラテジ系',
    structureKind: 'exam-topic',
    availability: 'available',
    questionSelector: { exactField: 'category', exactValues: ['ストラテジ系'] },
    practiceCapability: 'verified'
  },

  // ---- SG 情報セキュリティ (sg) — same three IPA strands ----
  {
    id: 'technology',
    courseId: 'sg',
    title: '技术系',
    titleJa: 'テクノロジ系',
    structureKind: 'exam-topic',
    availability: 'available',
    questionSelector: { exactField: 'category', exactValues: ['テクノロジ系'] },
    practiceCapability: 'verified'
  },
  {
    id: 'management',
    courseId: 'sg',
    title: '管理系',
    titleJa: 'マネジメント系',
    structureKind: 'exam-topic',
    availability: 'available',
    questionSelector: { exactField: 'category', exactValues: ['マネジメント系'] },
    practiceCapability: 'verified'
  },
  {
    id: 'strategy',
    courseId: 'sg',
    title: '战略系',
    titleJa: 'ストラテジ系',
    structureKind: 'exam-topic',
    availability: 'available',
    questionSelector: { exactField: 'category', exactValues: ['ストラテジ系'] },
    practiceCapability: 'verified'
  }
];

// Certification courses allowed to own topics. itpass / sg only.
// Learning courses (python/java/algorithm) and unresolved (mos365) get none.
var ALLOWED_COURSES = { itpass: true, sg: true };

// Real, audited question field names that a selector may target.
// Selector exactField must be one of these (proven present on questions).
var ALLOWED_SELECTOR_FIELDS = { category: true };

/** All registered topics for a course (any availability). */
function getTopicsForCourse(courseId) {
  if (!courseId) return [];
  return TOPICS.filter(function (t) { return t.courseId === courseId; });
}

/** Single topic by (courseId, topicId). topicId is unique within a course. */
function getTopicById(courseId, topicId) {
  if (!courseId || !topicId) return null;
  for (var i = 0; i < TOPICS.length; i++) {
    if (TOPICS[i].courseId === courseId && TOPICS[i].id === topicId) return TOPICS[i];
  }
  return null;
}

/** Topics whose selector is verified to hit real questions (availability='available'). */
function getAvailableTopicsForCourse(courseId) {
  return getTopicsForCourse(courseId).filter(function (t) {
    return t.availability === 'available';
  });
}

/** True only when the existing quiz route can really run this topic's practice. */
function isTopicPracticeAvailable(courseId, topicId) {
  var t = getTopicById(courseId, topicId);
  return !!(t && t.practiceCapability === 'verified');
}

module.exports = {
  TOPICS: TOPICS,
  ALLOWED_COURSES: ALLOWED_COURSES,
  ALLOWED_SELECTOR_FIELDS: ALLOWED_SELECTOR_FIELDS,
  getTopicsForCourse: getTopicsForCourse,
  getTopicById: getTopicById,
  getAvailableTopicsForCourse: getAvailableTopicsForCourse,
  isTopicPracticeAvailable: isTopicPracticeAvailable
};
