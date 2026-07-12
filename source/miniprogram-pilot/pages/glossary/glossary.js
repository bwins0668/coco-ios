
function syncCurrentTabBar(page) {
  try {
    var tabBar = typeof page.getTabBar === 'function' ? page.getTabBar() : null;
    if (tabBar && typeof tabBar.syncSelectedFromRoute === 'function') {
      tabBar.syncSelectedFromRoute(page.route);
    }
  } catch (_) {}
}

// pages/glossary/glossary.js - 术语 tab 轻入口
var glossaryState = require("../../utils/glossary-state");
var nav = require("../../utils/navigation");

Page({
  onLoad: function (options) {
    this._applyTheme();
    this._applyTheme();
    this._syncNavLayout();
  },
  data: {
    __themeDark: false,
    navSafeTop: 64,
    favoriteCount: 0
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
    syncCurrentTabBar(this);
    this._applyTheme();
    this._syncNavLayout();
    var state = glossaryState.getGlossaryLandingState();
    this.setData(state);
  },

  goToGlossarySearch: function () {
    nav.goTermSearch();
  },

  goToFavoriteReview: function () {
    nav.goFavoriteReview();
  },

  goToAnkiPlayer: function () {
    nav.goGlossaryAnkiReview();
  },

  // R3.54 随机术语：跳转到术语搜索页，并触发随机筛选
  goToRandomTerm: function () {
    nav.goGlossaryRandomTerm();
  }
,

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  }
,

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  }
});
