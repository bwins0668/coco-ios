'use strict';
var secondaryNav = require('../../../../utils/secondary-navigation');
var app = getApp();
app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};
require('../../data/flashcard-export');
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
    console.log('[flashcard-bridge] itpass-2 bridge loaded, data ready');
    var cache = app.globalData.__flashcard_cache || {};
    var key = 'itpass-2';
    var questions = cache[key] || [];
    var eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.emit('flashcardDataReady', {
        packageKey: key,
        count: questions.length,
        success: true
      });
    }
            if (questions.length > 0) {
      try {
        var pages = getCurrentPages();
        if (pages && pages.length > 1) {
          wx.navigateBack({ delta: 1 });
        }
      } catch (e) {
        console.error('[flashcard-bridge] navigation error:', e);
      }
    };
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
    secondaryNav.back(this, 'packages/quiz-itpass-2/pages/flashcard-bridge/flashcard-bridge');
  }

});


