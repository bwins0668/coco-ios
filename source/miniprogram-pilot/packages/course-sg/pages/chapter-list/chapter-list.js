var secondaryNav = require('../../../../utils/secondary-navigation');
var manifest = require('../../data/manifest');
var model = require('./chapter-list-model');

Page({
  data: {
    navSafeTop: 64,
    courseId: '',
    courseName: '',
    sourceTitle: '',
    chapters: [],
    expandedChapterIds: [],
    showBulkControls: false,
    notFound: false,
    __themeDark: false
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    var courseId = (options && options.courseId) || '';
    var course = manifest.getCourseManifest(courseId);
    if (!course) {
      this.setData({ courseId: courseId, notFound: true });
      return;
    }
    var expandedChapterIds = model.resolveInitialExpandedState(options, course.chapters);
    var chapters = model.decorateChapters(course.chapters, expandedChapterIds);
    this.setData({
      courseId: courseId,
      courseName: course.courseName,
      sourceTitle: course.sourceTitle,
      chapters: chapters,
      expandedChapterIds: expandedChapterIds,
      showBulkControls: (course.chapters || []).length >= 1,
      notFound: false
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  toggleChapter: function (e) {
    var chapterId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.chapterId;
    if (!chapterId) return;
    var next = model.toggleChapter(this.data.expandedChapterIds, chapterId, this.data.chapters);
    this.setData({
      expandedChapterIds: next,
      chapters: model.decorateChapters(this.data.chapters, next)
    });
  },

  expandAllChapters: function () {
    var next = model.expandAllChapters(this.data.chapters);
    this.setData({ expandedChapterIds: next, chapters: model.decorateChapters(this.data.chapters, next) });
  },

  collapseAllChapters: function () {
    var next = model.collapseAllChapters();
    this.setData({ expandedChapterIds: next, chapters: model.decorateChapters(this.data.chapters, next) });
  },

  openUnit: function (e) {
    var unitId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.unitId;
    if (!unitId) return;
    wx.navigateTo({
      url: '/packages/' + (this.data.courseId === 'itpass' ? 'course-itpass' : 'course-sg') +
        '/pages/unit-detail/unit-detail?courseId=' + this.data.courseId + '&unitId=' + unitId,
      fail: function () { wx.showToast({ title: '教材章节暂时无法打开', icon: 'none' }); }
    });
  },

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) this.setData({ __themeDark: themeDark });
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/course-sg/pages/chapter-list/chapter-list');
  }

});
