var secondaryNav = require('../../../../utils/secondary-navigation');
// pages/exam-menu/exam-menu.js · R6.6 DC-aligned
var storage = require("../../../../utils/storage");
var pastExamIndex = require("../../data/past_exam_bank/index");

var EXAM_INFO = {
  itpass: { title: 'IT Passport', desc: 'IT パスポート試験' },
  sg: { title: 'SG 情報セキュリティマネジメント', desc: '情報セキュリティマネジメント試験' }
};

function formatTimeAgo(ts) {
  if (!ts) return '';
  var now = Date.now(); var diff = now - ts;
  if (diff < 0) return '';
  var minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return minutes + ' 分钟前';
  var hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + ' 小时前';
  var days = Math.floor(hours / 24);
  if (days < 7) return days + ' 天前';
  if (days < 30) return Math.floor(days / 7) + ' 周前';
  return Math.floor(days / 30) + ' 个月前';
}

function countCategories(exam) {
  var years = pastExamIndex.getYears(exam) || [];
  return years.length;
}

Page({
  data: {
    __themeDark: false,
    exam: '', examTitle: '', examDesc: '',
    lessonTotal: 0, lessonAccuracy: 0,
    pastTotal: 0, pastAccuracy: 0,
    overallTotal: 0, overallAccuracy: 0,
    lastPracticeText: '',
    suggestion: { text: '', level: '' },
    pastExamList: [], pastExamExpanded: false,
    activePastExamYearId: '',
    flashcardTotal: '--', flashcardCategoryCount: '--',
    navSafeTop: 64
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    this._syncNavLayout();
    var exam = options.exam || 'itpass';
    var info = EXAM_INFO[exam] || EXAM_INFO.itpass;
    this.setData({ exam: exam, examTitle: info.title, examDesc: info.desc });
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
    var exam = this.data.exam;
    var lessonStats = storage.getQuizStatsByFilter(exam, 'lesson_quiz');
    var pastStats = storage.getQuizStatsByFilter(exam, 'past_exam_japanese');
    var overallTotal = (lessonStats.total || 0) + (pastStats.total || 0);
    var overallCorrect = (lessonStats.correct || 0) + (pastStats.correct || 0);
    var overallAccuracy = overallTotal > 0 ? Math.round(overallCorrect / overallTotal * 100) : 0;
    var lastTs = storage.getLastAttemptByExam(exam);
    var lastText = formatTimeAgo(lastTs);
    var suggestion = { text: '', level: '' };
    if (overallTotal === 0) suggestion = { text: '从课程练习开始，逐步了解考试内容', level: 'start' };
    else if (overallAccuracy >= 80) suggestion = { text: '掌握良好，可以尝试日文真题挑战', level: 'good' };
    else if (overallAccuracy >= 60) suggestion = { text: '建议多做课程练习巩固基础', level: 'moderate' };
    else suggestion = { text: '建议先复习基础知识点再继续练习', level: 'review' };
    var pastExamList = pastExamIndex.getYears(exam);
    var flashcardCategoryCount = countCategories(exam);
    var firstYear = pastExamList && pastExamList[0];
    var flashcardTotal = firstYear ? firstYear.count : '--';
    this.setData({
      lessonTotal: lessonStats.total || 0, lessonAccuracy: lessonStats.accuracy || 0,
      pastTotal: pastStats.total || 0, pastAccuracy: pastStats.accuracy || 0,
      overallTotal: overallTotal, overallAccuracy: overallAccuracy,
      lastPracticeText: lastText, suggestion: suggestion,
      pastExamList: pastExamList,
      flashcardTotal: flashcardTotal, flashcardCategoryCount: flashcardCategoryCount
    });
  },

  goLessonQuiz: function () {
    wx.navigateTo({ url: '/packages/quiz/pages/quiz/quiz?exam=' + this.data.exam + '&sourceType=lesson_quiz' });
  },

  goPastExam: function () {
    var first = (this.data.pastExamList || [])[0];
    if (!first) { wx.showToast({ title: '暂无真题年份', icon: 'none' }); return; }
    var route = pastExamIndex.getRoute(this.data.exam, first.yearId);
    if (!route || !route.route) { wx.showToast({ title: '试卷分包缺失', icon: 'none' }); return; }
    wx.navigateTo({ url: route.route });
  },

  togglePastExamList: function () {
    this.setData({ pastExamExpanded: !this.data.pastExamExpanded });
  },

  goPastExamYear: function (event) {
    var dataset = event.currentTarget.dataset || {};
    var yearId = dataset.yearId;
    if (!yearId) { wx.showToast({ title: '试卷信息缺失', icon: 'none' }); return; }
    this.setData({ activePastExamYearId: yearId });
    var route = pastExamIndex.getRoute(this.data.exam, yearId);
    if (!route || !route.route) { wx.showToast({ title: '试卷分包缺失', icon: 'none' }); return; }
    wx.navigateTo({
      url: route.route,
      fail: function () { wx.showToast({ title: '打开试卷失败', icon: 'none' }); }
    });
  },

  goFlashcardCourse: function () {
    var exam = this.data.exam || 'itpass';
    wx.navigateTo({
      url: '/packages/quiz/pages/flashcard-deck-select/flashcard-deck-select?course=' + exam,
      fail: function () { wx.showToast({ title: '闪卡启动失败', icon: 'none' }); }
    });
  },


  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) this.setData({ __themeDark: themeDark });
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/quiz/pages/exam-menu/exam-menu');
  }

});
