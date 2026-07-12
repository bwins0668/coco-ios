var secondaryNav = require('../../utils/secondary-navigation');
// pages/course/course.js · R6.6 DC-aligned course detail shell
var nav = require('../../utils/navigation');
var registry = require('../../utils/course-registry');
var courseState = require('../../utils/course-state');
var contentRegistry = require('../../utils/course-content-registry');

Page({
  data: {
    courseId: '',
    course: null,
    notFound: false,
    state: null,
    lastMetaText: '',
    topics: [],
    __themeDark: false,
    navSafeTop: 64
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    this._syncNavLayout();
    var courseId = options.courseId || '';
    var course = registry.getCourseById(courseId);

    if (!course || course.availability === 'unresolved' || !course.capabilities || !course.capabilities.courseShell) {
      this.setData({ notFound: true, courseId: courseId });
      return;
    }

    this.setData({ courseId: courseId, course: course });

    if (course.courseKind === 'certification') {
      var state = courseState.getCertificationCourseState(courseId);
      var metaText = '';
      if (state.lastAttempt) {
        var label = state.lastAttempt.sourceType === 'wrong_only' ? '错题重练' :
                    (state.lastAttempt.sourceType === 'lesson_quiz' ? '模拟练习' :
                     state.lastAttempt.sourceType === 'past_exam_japanese' ? '真题练习' : '');
        var time = courseState.formatRelativeTime(state.lastAttempt.answeredAt);
        metaText = label;
        if (time) metaText = metaText ? metaText + ' · ' + time : time;
      }
      var topics = contentRegistry.getTopicsForCourse(courseId).map(function (t) {
        return {
          id: t.id, title: t.title, titleJa: t.titleJa,
          enterable: t.availability === 'available'
        };
      });
      this.setData({ state: state, lastMetaText: metaText, topics: topics });
    }
  },

  _syncNavLayout: function () {
    var navSafeTop = 64;
    try {
      var menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      var sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      navSafeTop = (menu && menu.bottom) ? menu.bottom + 14 : ((sysInfo.statusBarHeight || 20) + 52);
    } catch (e) { navSafeTop = 64; }
    if (this.data.navSafeTop !== navSafeTop) this.setData({ navSafeTop: navSafeTop });
  },

  onShow: function () {
    this._applyTheme();
    this._syncNavLayout();
  },

  goPractice: function () { nav.goCoursePractice(this.data.courseId); },

  goTopic: function (e) {
    var topicId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.topicId;
    if (!topicId) return;
    nav.goCourseTopic(this.data.courseId, topicId);
  },

  goMistakes: function () { nav.goMistakes(); },
  goQuestionOrganizer: function () { nav.goCourseQuestionOrganizer(this.data.courseId); },
  goTextbook: function () { nav.goCourseTextbook(this.data.courseId); },
  goBackHome: function () { nav.goCourseTab(); },


  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) this.setData({ __themeDark: themeDark });
  },
  goBack: function () {
    secondaryNav.back(this, 'pages/course/course');
  }

});
