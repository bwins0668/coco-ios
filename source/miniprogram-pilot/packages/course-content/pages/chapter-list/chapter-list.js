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
    expandedGroupIds: [],
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
    var expandedGroupIds = model.resolveInitialExpandedState(options, course.chapters);
    var chapters = model.decorateChapters(course.chapters, expandedGroupIds);
    this.setData({
      courseId: courseId,
      courseName: course.courseName,
      sourceTitle: course.sourceTitle,
      chapters: chapters,
      expandedGroupIds: expandedGroupIds,
      showBulkControls: (course.chapters || []).length >= 1,
      notFound: false
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  toggleGroup: function (e) {
    var groupId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.groupId;
    if (!groupId) return;
    var next = model.toggleGroup(this.data.expandedGroupIds, groupId, this.data.chapters);
    this.setData({
      expandedGroupIds: next,
      chapters: model.decorateChapters(this.data.chapters, next)
    });
  },

  expandAllGroups: function () {
    var next = model.expandAll(this.data.chapters);
    this.setData({ expandedGroupIds: next, chapters: model.decorateChapters(this.data.chapters, next) });
  },

  collapseAllGroups: function () {
    var next = model.collapseAll();
    this.setData({ expandedGroupIds: next, chapters: model.decorateChapters(this.data.chapters, next) });
  },

  openUnit: function (e) {
    var unitId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.unitId;
    if (!unitId) return;
    wx.navigateTo({
      url: '/packages/course-content/pages/unit-detail/unit-detail?courseId=' + this.data.courseId + '&unitId=' + unitId,
      fail: function () { wx.showToast({ title: '教材章节暂时无法打开', icon: 'none' }); }
    });
  },

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) this.setData({ __themeDark: themeDark });
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/course-content/pages/chapter-list/chapter-list');
  }

});