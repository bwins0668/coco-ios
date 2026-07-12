// utils/navigation.js
// Lightweight stateless navigation adapter for the 5-tab course center.
// No storage reads/writes. No business logic. No G4 WIP dependencies.

var registry = require('./course-registry');
var contentRegistry = require('./course-content-registry');

var TAB = {
  COURSE:   '/pages/home/home',
  PRACTICE: '/pages/practice/practice',
  REVIEW:   '/pages/review/review',
  GLOSSARY: '/pages/glossary/glossary',
  PROFILE:  '/pages/profile/profile'
};

var LEGACY = {
  FLASHCARDS:       '/pages/flashcards/flashcards',
  MISTAKES:         '/pages/mistakes/mistakes',
  MISTAKES_FULL:    '/packages/quiz/pages/mistakes/mistakes',
  EXAM_MENU_ITPASS: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass',
  EXAM_MENU_SG:     '/packages/quiz/pages/exam-menu/exam-menu?exam=sg',
  QUIZ_ITPASS:      '/packages/quiz/pages/quiz/quiz?exam=itpass&sourceType=lesson_quiz',
  TERM_SEARCH:      '/packages/glossary/pages/term-search/term-search',
  FAVORITE_REVIEW:  '/packages/glossary/pages/favorite-review/favorite-review',
  ANKI_PLAYER:      '/packages/glossary/pages/anki-player/anki-player?from=home',
  ANALYSIS_DETAIL:  '/packages/quiz/pages/analysis-detail/analysis-detail'
};

function switchTabSafe(url) {
  wx.switchTab({ url: url,
    fail: function (err) { console.error('[nav] switchTab failed:', url, err);
      wx.showToast({ title: '页面切换失败，请重试', icon: 'none' }); }
  });
}

function navigateToSafe(url) {
  wx.navigateTo({ url: url,
    fail: function (err) { console.error('[nav] navigateTo failed:', url, err);
      wx.showToast({ title: '页面暂时无法打开', icon: 'none' }); }
  });
}

// ---- Public API ----

function goCourseTab()     { switchTabSafe(TAB.COURSE); }
function goPracticeTab()   { switchTabSafe(TAB.PRACTICE); }
function goReviewTab()     { switchTabSafe(TAB.REVIEW); }
function goGlossaryTab()   { switchTabSafe(TAB.GLOSSARY); }
function goProfileTab()    { switchTabSafe(TAB.PROFILE); }
function goFlashcards()    { navigateToSafe(LEGACY.FLASHCARDS); }
function goMistakes()      { navigateToSafe(LEGACY.MISTAKES_FULL); }
function goQuickPractice() { navigateToSafe(LEGACY.QUIZ_ITPASS); }
function goTermSearch()    { navigateToSafe(LEGACY.TERM_SEARCH); }
function goFavoriteReview(){ navigateToSafe(LEGACY.FAVORITE_REVIEW); }
function goAnkiPlayer()    { navigateToSafe(LEGACY.ANKI_PLAYER); }
function goAnalysisDetail(){ navigateToSafe(LEGACY.ANALYSIS_DETAIL); }

function continueLastQuiz(exam, sourceType) {
  var url = '/packages/quiz/pages/quiz/quiz?exam=' + (exam || 'itpass') + '&sourceType=' + (sourceType || 'lesson_quiz');
  navigateToSafe(url);
}

// ---- R1.3: Course shell navigation ----

/** Navigate to the unified course shell page. Only courseShell:true courses allowed. */
function goCourseHome(courseId) {
  if (!registry.isCourseShellAvailable(courseId)) {
    wx.showToast({ title: '课程暂不可用', icon: 'none' });
    return;
  }
  if (courseId === 'python') {
    navigateToSafe('/packages/python-course/pages/home/home');
    return;
  }
  navigateToSafe('/pages/course/course?courseId=' + courseId);
}

/** Navigate to real practice entry for itpass/sg. */
function goCoursePractice(courseId) {
  if (courseId === 'itpass') { navigateToSafe(LEGACY.EXAM_MENU_ITPASS); return; }
  if (courseId === 'sg')     { navigateToSafe(LEGACY.EXAM_MENU_SG); return; }
  wx.showToast({ title: '暂无练习入口', icon: 'none' });
}

// ---- R1.6: verified exam-topic navigation ----

/**
 * Navigate to the generic exam-topic page. Only opens when the topic is a real,
 * available structure resolved from course-content-registry. Unknown course/topic
 * (including MOS/Python/Java/algorithm, which own no topics) fails safe.
 */
function goCourseTopic(courseId, topicId) {
  var topic = contentRegistry.getTopicById(courseId, topicId);
  if (!topic || topic.availability !== 'available') {
    wx.showToast({ title: '主题暂不可进入', icon: 'none' });
    return;
  }
  navigateToSafe('/pages/course-topic/course-topic?courseId=' + courseId + '&topicId=' + topicId);
}

/**
 * Start verified topic practice (R2.1). Route is built ONLY by the route builder
 * (never hand-assembled here); deferred/unknown topics show a low-noise toast and
 * never navigate to a wrong page.
 */
function goCourseTopicPractice(courseId, topicId) {
  var topicPractice = require('./course-topic-practice');
  var route = topicPractice.buildTopicPracticeRoute(courseId, topicId);
  if (!route) {
    wx.showToast({ title: '本主题练习暂未开放', icon: 'none' });
    return;
  }
  navigateToSafe(route);
}

// ---- R2.8: Course question organizer ----

/** Navigate to the course question organizer. only itpass/sg allowed. */
function goCourseQuestionOrganizer(courseId) {
  if (courseId !== 'itpass' && courseId !== 'sg') {
    wx.showToast({ title: '该课程暂不支持题目整理', icon: 'none' });
    return;
  }
  navigateToSafe('/pages/course-organize/course-organize?courseId=' + courseId);
}

// ---- R5: textbook-grounded course content ----

/** Navigate to the lazy textbook chapter directory for IT Passport / SG. */
function goCourseTextbook(courseId) {
  if (courseId !== 'itpass' && courseId !== 'sg') {
    wx.showToast({ title: '该课程暂未开放教材章节', icon: 'none' });
    return;
  }
  var pkg = courseId === 'itpass' ? 'course-itpass' : 'course-sg';
  navigateToSafe('/packages/' + pkg + '/pages/chapter-list/chapter-list?courseId=' + courseId);
}

// ---- R3.2: Legacy tab navigation compatibility intents ----
// Each intent encodes ONE exact target path + fixed query. No free-form params.

/** Navigate to anki-player for mistakes-sourced flashcard review. */
function goMistakesAnkiReview() {
  navigateToSafe('/packages/glossary/pages/anki-player/anki-player?source=mistakes&from=mistakes');
}

/** Navigate to anki-player from the glossary tab context. */
function goGlossaryAnkiReview() {
  navigateToSafe('/packages/glossary/pages/anki-player/anki-player?from=glossary');
}

/** Navigate to term-search with random=1 to trigger random term selection. */
function goGlossaryRandomTerm() {
  navigateToSafe('/packages/glossary/pages/term-search/term-search?random=1');
}

// Legacy aliases — delegate to goCoursePractice for backward compat
function goItPassport() { goCoursePractice('itpass'); }
function goSG()         { goCoursePractice('sg'); }

module.exports = {
  TAB: TAB, LEGACY: LEGACY,
  switchTabSafe: switchTabSafe, navigateToSafe: navigateToSafe,
  goCourseTab: goCourseTab, goPracticeTab: goPracticeTab, goReviewTab: goReviewTab,
  goGlossaryTab: goGlossaryTab, goProfileTab: goProfileTab,
  goFlashcards: goFlashcards, goMistakes: goMistakes,
  goItPassport: goItPassport, goSG: goSG,
  goQuickPractice: goQuickPractice, goTermSearch: goTermSearch,
  goFavoriteReview: goFavoriteReview, goAnkiPlayer: goAnkiPlayer,
  goAnalysisDetail: goAnalysisDetail, continueLastQuiz: continueLastQuiz,
  goCourseHome: goCourseHome, goCoursePractice: goCoursePractice,
  goCourseTopic: goCourseTopic, goCourseTopicPractice: goCourseTopicPractice,
  goCourseQuestionOrganizer: goCourseQuestionOrganizer,
  goCourseTextbook: goCourseTextbook,
  goMistakesAnkiReview: goMistakesAnkiReview,
  goGlossaryAnkiReview: goGlossaryAnkiReview,
  goGlossaryRandomTerm: goGlossaryRandomTerm
};
