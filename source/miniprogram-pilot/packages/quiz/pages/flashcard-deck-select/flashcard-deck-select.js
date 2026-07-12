'use strict';
var secondaryNav = require('../../../../utils/secondary-navigation');

var manifest = require('../../data/flashcard-manifest');

function buildPlayerUrl(deckInfo, deckId, course) {
  var backPath = '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + encodeURIComponent(course);
  return deckInfo.playerRoute +
    '?deckId=' + encodeURIComponent(deckId) +
    '&backCourse=' + encodeURIComponent(course) +
    '&backPath=' + encodeURIComponent(backPath);
}

Page({
  data: {
    navSafeTop: 64,
    course: '',
    courseLabel: '',
    courseDesc: '',
    decks: [],
    isLoading: true,
    loadError: '',
    isNavigating: false,
    lastNavigationDiagnostic: '',
    // R20.1: 深色模式
    __themeDark: false
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    // R20.1: 运行时深色模式检测
    this._applyTheme();
    var course = options.course || options.exam || 'itpass';
    var courseLabel = course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡';
    var courseDesc = course === 'sg' ? '情報セキュリティマネジメント' : 'IT パスポート試験';

    this.setData({
      course: course,
      courseLabel: courseLabel,
      courseDesc: courseDesc
    });
    this.loadDecks(course);
  },

  loadDecks: function (courseOrEvent) {
    var course = typeof courseOrEvent === 'string'
      ? courseOrEvent
      : ((courseOrEvent && courseOrEvent.currentTarget && courseOrEvent.currentTarget.dataset && courseOrEvent.currentTarget.dataset.course) || this.data.course);
    this.setData({ isLoading: true, loadError: '' });
    try {
      var decks = manifest.getDecksForCourse(course);
      if (!decks || decks.length === 0) {
        this.setData({ isLoading: false, loadError: '暂无可用牌组' });
        return;
      }
      this.setData({ decks: decks, isLoading: false, loadError: '' });
    } catch (error) {
      console.error('[flashcard-deck-select] loadDecks failed:', error);
      this.setData({ isLoading: false, loadError: '加载牌组列表失败：' + (error.message || '未知错误') });
    }
  },

  selectDeck: function (event) {
    if (this.data.isNavigating) return;

    var dataset = (event && event.currentTarget && event.currentTarget.dataset) || {};
    var course = this.data.course;
    var yearId = dataset.yearId;
    if (!course || !yearId) {
      wx.showToast({ title: '牌组参数缺失', icon: 'none' });
      return;
    }

    var deckInfo = manifest.getDeckInfo(course, yearId);
    if (!deckInfo || !deckInfo.playerRoute || !deckInfo.packageName) {
      console.error('[flashcard-deck-select] manifest lookup failed:', { course: course, yearId: yearId, deckInfo: deckInfo });
      wx.showToast({ title: '找不到牌组入口', icon: 'none' });
      return;
    }

    var deckId = course + '/' + yearId;
    var playerUrl = buildPlayerUrl(deckInfo, deckId, course);
    var self = this;
    this.setData({
      isNavigating: true,
      lastNavigationDiagnostic: 'start deck=' + deckId + ' package=' + deckInfo.packageName + ' mode=loadSubPackage'
    });
    wx.showLoading({ title: '加载牌组…', mask: true });

    function finish(diagnostic) {
      wx.hideLoading();
      self.setData({ isNavigating: false, lastNavigationDiagnostic: diagnostic || self.data.lastNavigationDiagnostic });
    }

    function navigateToPlayer() {
      self.setData({ lastNavigationDiagnostic: 'navigate start deck=' + deckId + ' package=' + deckInfo.packageName });
      wx.navigateTo({
        url: playerUrl,
        success: function () {
          finish('navigate success deck=' + deckId + ' package=' + deckInfo.packageName);
        },
        fail: function (error) {
          finish('navigate fail deck=' + deckId + ' package=' + deckInfo.packageName + ' err=' + (error && error.errMsg || 'unknown'));
          console.error('[flashcard-deck-select] player navigation failed:', {
            error: error,
            course: course,
            yearId: yearId,
            deckId: deckId,
            packageName: deckInfo.packageName,
            playerRoute: deckInfo.playerRoute
          });
          wx.showToast({ title: '闪卡启动失败，请重试', icon: 'none' });
        }
      });
    }

    // Production WeChat always uses the real subpackage API. The DevTools
    // automation runtime can omit that API even though direct navigation loads
    // the declared target package itself; it receives no injected loader or
    // synthetic success callback.
    if (typeof wx.loadSubPackage !== 'function') {
      self.setData({ lastNavigationDiagnostic: 'subpackage api unavailable; direct route in automation deck=' + deckId + ' package=' + deckInfo.packageName });
      navigateToPlayer();
      return;
    }

    wx.loadSubPackage({
      name: deckInfo.packageName,
      success: function () {
        self.setData({ lastNavigationDiagnostic: 'subpackage success deck=' + deckId + ' package=' + deckInfo.packageName });
        navigateToPlayer();
      },
      fail: function (error) {
        finish('subpackage fail deck=' + deckId + ' package=' + deckInfo.packageName + ' err=' + (error && error.errMsg || 'unknown'));
        console.error('[flashcard-deck-select] loadSubPackage failed:', {
          error: error,
          course: course,
          yearId: yearId,
          deckId: deckId,
          packageName: deckInfo.packageName,
          playerRoute: deckInfo.playerRoute
        });
        wx.showToast({ title: '牌组资源加载失败，请重试', icon: 'none' });
      }
    });
  },


  /**
   * R20.1: 运行时深色模式检测
   */
  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select');
  }

});
