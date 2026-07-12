var secondaryNav = require('../../utils/secondary-navigation');
// pages/course-organize/course-organize.js
// R2.8 Course Question Organizer — read-only view of wrong + favorite questions.
// Never writes storage, never imports canonical question banks.
//
// State model: page-level available|invalid, sub-sections available|empty.
// No "deferred" — the static registry has no producible deferred scenario.
var organizer = require('../../utils/course-question-state');
var nav = require('../../utils/navigation');

Page({
  data: {
    navSafeTop: 64,
    courseId: '',
    courseName: '',
    status: 'invalid',
    tab: 'wrong',          // 'wrong' | 'favorite'
    wrong: { status: 'invalid', items: [], count: 0 },
    favorite: { status: 'invalid', items: [], count: 0 },
    __themeDark: false
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    var courseId = options.courseId || '';
    var state = organizer.getCourseQuestionOrganizerState(courseId);
    this.setData({
      courseId: courseId,
      courseName: state.courseName,
      status: state.status,
      wrong: state.wrong,
      favorite: state.favorite,
      tab: (state.wrong.status === 'available' || state.wrong.status === 'empty') ? 'wrong' :
           (state.favorite.status === 'available' || state.favorite.status === 'empty') ? 'favorite' : 'wrong'
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  switchTab: function (e) {
    var tab = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.tab;
    if (tab === 'wrong' || tab === 'favorite') {
      this.setData({ tab: tab });
    }
  },

  goBackToCourse: function () {
    wx.navigateBack({
      fail: function () {
        nav.goCourseHome(this.data.courseId);
      }.bind(this)
    });
  },

  goCrossCourseMistakes: function () {
    nav.goMistakes();
  },

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },
  goBack: function () {
    secondaryNav.back(this, 'pages/course-organize/course-organize');
  }

});
