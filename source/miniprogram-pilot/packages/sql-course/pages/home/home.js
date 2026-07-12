var secondaryNav = require('../../../../utils/secondary-navigation');
var loader = require('../../utils/sql-course-loader');

Page({
  data: {
    navSafeTop: 64,
    manifest: null,
    chapters: [],
    loadError: false,
    __themeDark: false
  },
  onLoad: function () {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    var manifest = loader.getManifest();
    this.setData({
      manifest: manifest,
      chapters: manifest ? (manifest.chapters || []) : [],
      loadError: !manifest
    });
  },
  onShow: function () {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
  },
  openChapter: function (event) {
    var route = event.currentTarget.dataset.route;
    if (!route) return;
    wx.navigateTo({ url: route });
  },
  startFirstLesson: function () {
    var route = loader.getFirstLessonRoute();
    if (!route) {
      wx.showToast({ title: '课程内容暂时无法打开', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: route });
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/sql-course/pages/home/home', { type: 'switchTab', url: '/pages/home/home' });
  },
  _applyTheme: function () {
    var app = getApp();
    var dark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== dark) this.setData({ __themeDark: dark });
  }
});
