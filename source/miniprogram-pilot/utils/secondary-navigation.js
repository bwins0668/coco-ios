'use strict';

var TAB_ROOTS = {
  '/pages/home/home': true,
  '/pages/practice/practice': true,
  '/pages/review/review': true,
  '/pages/glossary/glossary': true,
  '/pages/profile/profile': true
};

var SECONDARY_FALLBACKS = {
  'pages/course/course': { type: 'switchTab', url: '/pages/home/home' },
  'pages/course-topic/course-topic': { type: 'navigateTo', url: '/pages/course/course?courseId=itpass' },
  'pages/course-organize/course-organize': { type: 'navigateTo', url: '/pages/course/course?courseId=itpass' },
  'pages/flashcards/flashcards': { type: 'switchTab', url: '/pages/review/review' },
  'pages/mistakes/mistakes': { type: 'switchTab', url: '/pages/review/review' },

  'packages/glossary/pages/term-search/term-search': { type: 'switchTab', url: '/pages/glossary/glossary' },
  'packages/glossary/pages/term-detail/term-detail': { type: 'navigateTo', url: '/packages/glossary/pages/term-search/term-search' },
  'packages/glossary/pages/favorite-review/favorite-review': { type: 'switchTab', url: '/pages/glossary/glossary' },
  'packages/glossary/pages/anki-player/anki-player': { type: 'switchTab', url: '/pages/glossary/glossary' },

  'packages/quiz/pages/exam-menu/exam-menu': { type: 'switchTab', url: '/pages/practice/practice' },
  'packages/quiz/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass' },
  'packages/quiz/pages/mistakes/mistakes': { type: 'switchTab', url: '/pages/review/review' },
  'packages/quiz/pages/analysis-detail/analysis-detail': { type: 'navigateTo', url: '/packages/quiz/pages/mistakes/mistakes' },
  'packages/quiz/pages/flashcard-quiz/flashcard-quiz': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },

  'packages/quiz-itpass-1/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass' },
  'packages/quiz-itpass-1/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-itpass-1/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass' },
  'packages/quiz-itpass-2/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass' },
  'packages/quiz-itpass-2/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-itpass-2/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass' },
  'packages/quiz-itpass-3/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass' },
  'packages/quiz-itpass-3/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-itpass-3/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass' },
  'packages/quiz-itpass-4/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass' },
  'packages/quiz-itpass-4/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-itpass-4/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass' },
  'packages/quiz-itpass-5/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass' },
  'packages/quiz-itpass-5/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-itpass-5/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=itpass' },

  'packages/quiz-sg-1/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=sg' },
  'packages/quiz-sg-1/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-sg-1/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=sg' },
  'packages/quiz-sg-2/pages/quiz/quiz': { type: 'navigateTo', url: '/packages/quiz/pages/exam-menu/exam-menu?exam=sg' },
  'packages/quiz-sg-2/pages/flashcard-bridge/flashcard-bridge': { type: 'navigateTo', url: '/pages/flashcards/flashcards' },
  'packages/quiz-sg-2/pages/flashcard-player/flashcard-player': { type: 'navigateTo', url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=sg' },

  'packages/course-content/pages/chapter-list/chapter-list': { type: 'navigateTo', url: '/pages/course/course?courseId=itpass' },
  'packages/course-content/pages/unit-detail/unit-detail': { type: 'navigateTo', url: '/packages/course-content/pages/chapter-list/chapter-list?courseId=itpass' },
  'packages/course-itpass/pages/chapter-list/chapter-list': { type: 'navigateTo', url: '/pages/course/course?courseId=itpass' },
  'packages/course-itpass/pages/unit-detail/unit-detail': { type: 'navigateTo', url: '/packages/course-itpass/pages/chapter-list/chapter-list?courseId=itpass' },
  'packages/course-sg/pages/chapter-list/chapter-list': { type: 'navigateTo', url: '/pages/course/course?courseId=sg' },
  'packages/course-sg/pages/unit-detail/unit-detail': { type: 'navigateTo', url: '/packages/course-sg/pages/chapter-list/chapter-list?courseId=sg' },

  'packages/java-course/pages/home/home': { type: 'switchTab', url: '/pages/home/home' },
  'packages/java-course/pages/chapter/chapter': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course/pages/lesson/lesson': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course-a/pages/chapter/chapter': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course-a/pages/lesson/lesson': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course-b/pages/chapter/chapter': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course-b/pages/lesson/lesson': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course-c/pages/chapter/chapter': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },
  'packages/java-course-c/pages/lesson/lesson': { type: 'navigateTo', url: '/packages/java-course/pages/home/home' },

  'packages/python-course/pages/home/home': { type: 'switchTab', url: '/pages/home/home' },
  'packages/python-course/pages/chapter/chapter': { type: 'navigateTo', url: '/packages/python-course/pages/home/home' },
  'packages/python-course/pages/lesson/lesson': { type: 'navigateTo', url: '/packages/python-course/pages/home/home' },

  'packages/sql-course/pages/home/home': { type: 'switchTab', url: '/pages/home/home' },
  'packages/sql-course/pages/chapter/chapter': { type: 'navigateTo', url: '/packages/sql-course/pages/home/home' },
  'packages/sql-course/pages/lesson/lesson': { type: 'navigateTo', url: '/packages/sql-course/pages/home/home' }
};

function syncNavLayout(page) {
  var navSafeTop = 64;
  try {
    var menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
    var sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    navSafeTop = (menu && menu.bottom) ? menu.bottom + 14 : ((sysInfo.statusBarHeight || 20) + 52);
  } catch (e) {
    navSafeTop = 64;
  }
  if (page && page.data && page.data.navSafeTop !== navSafeTop && page.setData) {
    page.setData({ navSafeTop: navSafeTop });
  }
  return navSafeTop;
}

function resolveFallback(route, override) {
  return override || SECONDARY_FALLBACKS[route] || null;
}

function navigateFallback(route, override) {
  var fallback = resolveFallback(route, override);
  if (!fallback || !fallback.url) {
    console.error('[secondary-navigation] Missing fallback for route:', route);
    wx.showToast({ title: '返回路径缺失，请从底部入口返回', icon: 'none' });
    return;
  }
  var url = fallback.url;
  var fail = function (err) {
    console.error('[secondary-navigation] fallback failed:', route, fallback, err);
    wx.showToast({ title: '返回失败，请重试', icon: 'none' });
  };
  if (fallback.type === 'switchTab' || TAB_ROOTS[url]) {
    wx.switchTab({ url: url, fail: fail });
    return;
  }
  if (fallback.type === 'redirectTo') {
    wx.redirectTo({ url: url, fail: fail });
    return;
  }
  wx.navigateTo({ url: url, fail: fail });
}

function back(page, route, override) {
  var hasStack = false;
  try {
    var pages = getCurrentPages ? getCurrentPages() : [];
    hasStack = pages && pages.length > 1;
  } catch (e) {
    hasStack = false;
  }

  if (hasStack) {
    wx.navigateBack({
      delta: 1,
      fail: function (err) {
        console.error('[secondary-navigation] navigateBack failed:', route, err);
        navigateFallback(route, override);
      }
    });
    return;
  }
  navigateFallback(route, override);
}

module.exports = {
  SECONDARY_FALLBACKS: SECONDARY_FALLBACKS,
  syncNavLayout: syncNavLayout,
  back: back,
  navigateFallback: navigateFallback
};
