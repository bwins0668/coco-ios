
function syncCurrentTabBar(page) {
  try {
    var tabBar = typeof page.getTabBar === 'function' ? page.getTabBar() : null;
    if (tabBar && typeof tabBar.syncSelectedFromRoute === 'function') {
      tabBar.syncSelectedFromRoute(page.route);
    }
  } catch (_) {}
}

// pages/review/review.js
// Review tab — entry overview for flashcards, mistakes, and term review.
// Does not create fake SRS counts or progress data.
var nav = require('../../utils/navigation');

Page({
  data: { navSafeTop: 64 },

  onLoad: function () { this._syncNavLayout(); },

  _syncNavLayout: function () {
    var navSafeTop = 64;
    try {
      var menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      var sysInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      navSafeTop = (menu && menu.bottom) ? menu.bottom + 14 : ((sysInfo.statusBarHeight || 20) + 52);
    } catch (e) { navSafeTop = 64; }
    if (this.data.navSafeTop !== navSafeTop) this.setData({ navSafeTop: navSafeTop });
  },

  onShow: function () { this._syncNavLayout(); syncCurrentTabBar(this); },

  goFlashcards: function () {
    nav.goFlashcards();
  },

  goMistakes: function () {
    nav.goMistakes();
  },

  goTermReview: function () {
    nav.goFavoriteReview();
  }
});
