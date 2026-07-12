var secondaryNav = require('../../../../utils/secondary-navigation');
var loader = require('../../utils/python-foundations-b-loader');
var PACKAGE_ROOT = 'packages/python-course-foundations-b';

Page({
  data: {
    navSafeTop: 64,
    chapterId: '',
    sectionId: '',
    lesson: null,
    loadError: false,
    __themeDark: false
  },
  onLoad: function (query) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    var chapterId = (query && query.chapterId) || '';
    var sectionId = (query && query.sectionId) || '';
    var lesson = loader.getLessonById(chapterId, sectionId);
    if (!lesson) {
      this.setData({ chapterId: chapterId, sectionId: sectionId, loadError: true });
      return;
    }
    this.setData({ chapterId: chapterId, sectionId: sectionId, lesson: lesson, loadError: false });
  },
  onShow: function () {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
  },
  copyCode: function (event) {
    var index = event.currentTarget.dataset.index || 0;
    var example = this.data.lesson && this.data.lesson.codeExamples ? this.data.lesson.codeExamples[index] : null;
    if (!example) return;
    wx.setClipboardData({
      data: example.code,
      success: function () {
        wx.showToast({ title: '代码已复制', icon: 'none' });
      }
    });
  },
  goBack: function () {
    secondaryNav.back(this, PACKAGE_ROOT + '/pages/lesson/lesson', {
      type: 'navigateTo',
      url: '/' + PACKAGE_ROOT + '/pages/chapter/chapter?chapterId=' + this.data.chapterId
    });
  },
  _applyTheme: function () {
    var app = getApp();
    var dark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== dark) this.setData({ __themeDark: dark });
  }
});
