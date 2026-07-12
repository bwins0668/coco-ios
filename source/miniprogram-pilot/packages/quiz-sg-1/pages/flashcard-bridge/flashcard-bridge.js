'use strict';
var secondaryNav = require('../../../../utils/secondary-navigation');
var app = getApp();
app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};
try {
  require('../../data/flashcard-export');
} catch (e) {
  console.error('[flashcard-bridge] flashcard-export require failed:', e);
}
Page({
  onShow: function () {
    this._applyTheme();
  },
  data: {
    navSafeTop: 64,
    __themeDark: false,},
  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    console.log('[flashcard-bridge] sg-1 bridge loaded');
    var cache = app.globalData.__flashcard_cache || {};
    var key = 'sg-1';
    var questions = cache[key] || [];
    console.log('[flashcard-bridge] cached questions:', questions.length, 'cache keys:', Object.keys(cache));

    var eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.emit('flashcardDataReady', {
        packageKey: key,
        count: questions.length,
        success: true
      });
      console.log('[flashcard-bridge] event emitted');
    }

    // Navigate back if we have data and were opened via navigateTo
    if (questions.length > 0) {
      try {
        var pages = getCurrentPages();
        console.log('[flashcard-bridge] pages count:', pages ? pages.length : 0);
        if (pages && pages.length > 1) {
          console.log('[flashcard-bridge] navigating back');
          wx.navigateBack({ delta: 1 });
        } else {
          console.log('[flashcard-bridge] root page, staying');
        }
      } catch (e) {
        console.error('[flashcard-bridge] navigation error:', e);
      }
    } else {
      console.log('[flashcard-bridge] no questions cached, staying');
    }
  }
,

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/quiz-sg-1/pages/flashcard-bridge/flashcard-bridge');
  }

});
