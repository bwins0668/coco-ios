var secondaryNav = require('../../utils/secondary-navigation');
// pages/flashcards/flashcards.js
// v2: Fixed navigation, real stats, click lock, better UX
// R3.4: Read-model isolation — state via flashcards-state, persistence via flashcards-persistence
var flashcardsState = require('../../utils/flashcards-state');

Page({
  onLoad: function () { secondaryNav.syncNavLayout(this); },
  data: {
    navSafeTop: 64,
    hasLastProgress: false,
    lastProgress: null,
    courses: [],
    ankiFavoriteCount: 0,
    itpassCount: 0,
    sgCount: 0,
    isNavigating: false,
    navigatingCourse: '',
    // R20.1: 深色模式
    __themeDark: false
  },

  onShow: function () {
    this._clearNavigationLock();
    // R20.1: 运行时深色模式检测
    this._applyTheme();
    var state = flashcardsState.getFlashcardsLandingState();
    this.setData(state);
  },

  // R3.4: loadLastProgress / loadCourses / loadAnkiStats / loadDeckStats
  // migrated to utils/flashcards-state.js. Method stubs kept for
  // backward compatibility (WXML bindings may reference them indirectly
  // but the page no longer calls them from onShow).

  onHide: function () {
    this._clearNavigationLock();
  },

  onUnload: function () {
    this._clearNavigationLock();
  },

  _clearNavigationLock: function () {
    if (this._navigationUnlockTimer) {
      clearTimeout(this._navigationUnlockTimer);
      this._navigationUnlockTimer = null;
    }
    if (this.data.isNavigating || this.data.navigatingCourse) {
      this.setData({ isNavigating: false, navigatingCourse: '' });
    }
  },

  _releaseNavigationSoon: function () {
    var self = this;
    if (self._navigationUnlockTimer) clearTimeout(self._navigationUnlockTimer);
    self._navigationUnlockTimer = setTimeout(function () {
      self._clearNavigationLock();
    }, 600);
  },

  continueLastProgress: function () {
    if (this.data.isNavigating) return;
    var p = this.data.lastProgress;
    if (!p) return;
    var course = p.course || p.exam || 'itpass';
    this.navigateToFlashcard(course);
  },

  openCourse: function (e) {
    if (this.data.isNavigating) return;
    var exam = e.currentTarget.dataset.exam;
    if (!exam) return;
    this.navigateToFlashcard(exam);
  },

  navigateToFlashcard: function (course) {
    var self = this;
    self.setData({ isNavigating: true, navigatingCourse: course });

    wx.navigateTo({
      url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + course,
      success: function () {
        self._releaseNavigationSoon();
      },
      fail: function (err) {
        console.error('[flashcards] navigate to deck-select failed:', err);
        self._clearNavigationLock();
        wx.showToast({ title: '闪卡入口暂时无法打开，请重试', icon: 'none' });
      }
    });
  },

  openAnkiFromFlashcards: function () {
    if (this.data.isNavigating) return;
    var self = this;
    self.setData({ isNavigating: true, navigatingCourse: 'anki' });

    wx.navigateTo({
      url: '/packages/glossary/pages/anki-player/anki-player?from=flashcards',
      success: function () {
        self._releaseNavigationSoon();
      },
      fail: function (err) {
        console.error('[flashcards] anki navigate failed:', err);
        self._clearNavigationLock();
        wx.showToast({ title: '页面暂时无法打开，请重试', icon: 'none' });
      }
    });
  },

  /**
   * R20.1: 运行时深色模式检测
   */
  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },
  goBack: function () {
    secondaryNav.back(this, 'pages/flashcards/flashcards');
  }

});
