var secondaryNav = require('../../../../utils/secondary-navigation');
var loader = require('../../utils/sql-course-loader');
var PACKAGE_ROOT = 'packages/sql-course';
var SQL_PROGRESS_KEY = 'study-tools-mini-sql-progress-v1';

function readProgress() {
  try {
    var list = wx.getStorageSync(SQL_PROGRESS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

Page({
  data: {
    navSafeTop: 64,
    chapterId: '',
    sectionId: '',
    lesson: null,
    loadError: false,
    __themeDark: false,
    queryInput: '',
    queryResult: '',
    quizSelected: -1,
    quizResult: '',
    completed: false
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
    var completed = readProgress().indexOf(sectionId) !== -1;
    this.setData({ chapterId: chapterId, sectionId: sectionId, lesson: lesson, loadError: false, completed: completed });
  },
  onShow: function () {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
  },
  onQueryInput: function (event) {
    this.setData({ queryInput: event.detail.value, queryResult: '' });
  },
  judgeQuery: function () {
    var lesson = this.data.lesson;
    if (!lesson || !lesson.playground || !(lesson.playground.expectedQuery instanceof RegExp)) return;
    var ok = lesson.playground.expectedQuery.test(this.data.queryInput || '');
    this.setData({ queryResult: ok ? 'correct' : 'wrong' });
  },
  copyExample: function () {
    var lesson = this.data.lesson;
    var code = lesson && lesson.example ? lesson.example.code : '';
    if (!code) return;
    wx.setClipboardData({
      data: code,
      success: function () { wx.showToast({ title: '示例已复制', icon: 'none' }); }
    });
  },
  selectQuizOption: function (event) {
    var idx = Number(event.currentTarget.dataset.index);
    var lesson = this.data.lesson;
    if (!lesson || !lesson.quiz) return;
    var correct = idx === lesson.quiz.answerIdx;
    this.setData({ quizSelected: idx, quizResult: correct ? 'correct' : 'wrong' });
  },
  markComplete: function () {
    var sectionId = this.data.sectionId;
    if (!sectionId) return;
    try {
      var list = readProgress();
      if (list.indexOf(sectionId) === -1) {
        list.push(sectionId);
        wx.setStorageSync(SQL_PROGRESS_KEY, list);
      }
      this.setData({ completed: true });
      wx.showToast({ title: '已标记学过', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    }
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
