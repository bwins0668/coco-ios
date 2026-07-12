var secondaryNav = require('../../../../utils/secondary-navigation');
// pages/mistakes/mistakes.js
var questionsModule = require('../../data/questions');
var storage = require("../../../../utils/storage");

var EXAM_NAMES = {
  itpass: 'IT Passport',
  sg: 'SG 考试'
};

var SOURCE_LABELS = {
  lesson_quiz: '课程练习',
  past_exam_japanese: '日文真题'
};

var FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'itpass', label: 'IT Passport' },
  { key: 'sg', label: 'SG' },
  { key: 'past_exam_japanese', label: '日文题' }
];

function formatTime(ts) {
  if (!ts) return '';
  var d = new Date(ts);
  if (isNaN(d.getTime())) return '';
  var now = new Date();
  var diff = now.getTime() - d.getTime();
  var dayMs = 24 * 60 * 60 * 1000;

  if (diff < dayMs && d.getDate() === now.getDate()) {
    return '今天 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  if (diff < 2 * dayMs && d.getDate() === now.getDate() - 1) {
    return '昨天 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function formatSavedAt(ts) {
  if (!ts) return '已收录';
  var d = new Date(ts);
  if (isNaN(d.getTime())) return '已收录';
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

// ========== 文本搜索 ==========

function matchText(source, keyword) {
  if (!keyword || keyword === '') return true;
  if (!source) return false;
  var k = keyword.toLowerCase().trim();
  if (k === '') return true;
  return source.toLowerCase().indexOf(k) !== -1;
}

function matchItem(item, keyword) {
  if (!keyword || keyword.trim() === '') return true;

  return matchText(item.questionZh, keyword) ||
    matchText(item.questionJa, keyword) ||
    matchText(item.correctAnswer, keyword) ||
    matchText(item.lastAnswer, keyword) ||
    matchText(item.explanationZh, keyword) ||
    matchText(item.explanationJa, keyword) ||
    matchText(item.examLabel, keyword) ||
    matchText(item.sourceLabel, keyword);
}

Page({
  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    this._applyTheme();
  },
  data: {
    navSafeTop: 64,
    __themeDark: false,
    __themeDark: false,
    wrongList: [],
    filteredList: [],
    totalCount: 0,
    reviewCount: 0,
    masteredCount: 0,
    itCount: 0,
    sgCount: 0,
    japaneseCount: 0,
    activeFilter: 'all',
    filterOptions: FILTER_OPTIONS,
    emptyHint: '当前没有错题，继续练习后会自动记录需要复习的题目。',
    searchKeyword: '',
    searchEmpty: false,
    viewMode: 'list',
    currentReviewIndex: 0,
    showExplanation: true,
    isFlipped: false
  },

  onShow: function () {
    this._applyTheme();
    this._applyTheme();
    this.loadWrongQuestions();
  },

  loadWrongQuestions: function () {
    var wrongQuestions = storage.getWrongQuestions();
    var allQuestions = questionsModule.questions;
    var wrongList = [];

    for (var i = 0; i < wrongQuestions.length; i++) {
      var wq = wrongQuestions[i];
      var question = null;
      for (var j = 0; j < allQuestions.length; j++) {
        if (allQuestions[j].id === wq.id) {
          question = allQuestions[j];
          break;
        }
      }
      if (!question && wq.questionSnapshot) {
        question = wq.questionSnapshot;
      }
      if (question) {
        var questionOptions = Array.isArray(question.options) ? question.options : [];
        var correctText = '';
        for (var k = 0; k < questionOptions.length; k++) {
          if (questionOptions[k].key === question.answer) {
            correctText = questionOptions[k].key + '. ' + (questionOptions[k].textZh || questionOptions[k].textJa || questionOptions[k].text || '');
            break;
          }
        }
        var optionsDisplay = [];
        for (var oi = 0; oi < questionOptions.length; oi++) {
          var opt = questionOptions[oi];
          optionsDisplay.push({
            key: opt.key,
            text: opt.textZh || opt.textJa || opt.text || ''
          });
        }
        wrongList.push({
          id: wq.id,
          exam: wq.exam,
          examLabel: EXAM_NAMES[wq.exam] || wq.exam,
          sourceType: question.sourceType || 'lesson_quiz',
          sourceLabel: SOURCE_LABELS[question.sourceType] || '课程练习',
          questionZh: question.questionZhClean || question.questionZh,
          questionJa: question.questionJaClean || question.questionJa,
          options: optionsDisplay,
          correctAnswer: correctText,
          explanationZh: question.explanationZhClean || question.explanationZh,
          explanationJa: question.explanationJaClean || question.explanationJa,
          lastAnswer: wq.lastAnswer,
          wrongAt: wq.wrongAt,
          wrongAtLabel: formatTime(wq.wrongAt),
          savedAtLabel: formatSavedAt(wq.wrongAt),
          translationStatus: question.translationStatus || 'complete',
          explanationStatus: question.explanationStatus || 'complete'
        });
      }
    }

    // 计算分组统计
    var itCount = 0;
    var sgCount = 0;
    var japaneseCount = 0;
    for (var ci = 0; ci < wrongList.length; ci++) {
      if (wrongList[ci].exam === 'itpass') itCount++;
      else if (wrongList[ci].exam === 'sg') sgCount++;
      if (wrongList[ci].sourceType === 'past_exam_japanese') japaneseCount++;
    }

    // 计算优先级提示
    var priorityHint = '';
    if (wrongList.length > 0) {
      var maxCategory = 'IT Passport';
      var maxCount = itCount;
      if (sgCount > maxCount) { maxCategory = 'SG'; maxCount = sgCount; }
      if (japaneseCount > maxCount) { maxCategory = '日文题'; maxCount = japaneseCount; }
      priorityHint = '建议优先复习，可从' + maxCategory + '开始';
    }

    this.setData({
      wrongList: wrongList,
      totalCount: wrongList.length,
      reviewCount: wrongList.length,
      masteredCount: 0,
      itCount: itCount,
      sgCount: sgCount,
      japaneseCount: japaneseCount,
      priorityHint: priorityHint,
      currentReviewIndex: 0,
      showExplanation: true
    });

    this.applyFilterAndSearch();
  },

  // ========== 搜索 ==========

  onSearchInput: function (e) {
    var keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.applyFilterAndSearch();
  },

  onClearSearch: function () {
    this.setData({ searchKeyword: '' });
    this.applyFilterAndSearch();
  },

  // ========== 筛选 + 搜索整合 ==========

  applyFilterAndSearch: function () {
    var filterKey = this.data.activeFilter;
    var keyword = this.data.searchKeyword || '';
    var list = this.data.wrongList;

    // 按分类筛选
    var filtered = list;
    if (filterKey === 'itpass') {
      filtered = list.filter(function (item) { return item.exam === 'itpass'; });
    } else if (filterKey === 'sg') {
      filtered = list.filter(function (item) { return item.exam === 'sg'; });
    } else if (filterKey === 'past_exam_japanese') {
      filtered = list.filter(function (item) { return item.sourceType === 'past_exam_japanese'; });
    }

    // 按关键词搜索
    var self = this;
    var searchResult = filtered;
    var isEmpty = false;
    if (keyword.trim() !== '') {
      searchResult = filtered.filter(function (item) {
        return matchItem(item, keyword);
      });
      isEmpty = searchResult.length === 0;
    }

    this.setData({
      filteredList: searchResult,
      searchEmpty: isEmpty,
      reviewCount: searchResult.length,
      currentReviewIndex: 0
    });
  },

  // ========== 分类筛选（保持向后兼容）==========

  applyFilter: function (filterKey) {
    var list = this.data.wrongList;
    var filtered = list;

    if (filterKey === 'itpass') {
      filtered = list.filter(function (item) { return item.exam === 'itpass'; });
    } else if (filterKey === 'sg') {
      filtered = list.filter(function (item) { return item.exam === 'sg'; });
    } else if (filterKey === 'past_exam_japanese') {
      filtered = list.filter(function (item) { return item.sourceType === 'past_exam_japanese'; });
    }

    this.setData({
      activeFilter: filterKey,
      filteredList: filtered
    });
  },

  onFilterChange: function (e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key });
    this.applyFilterAndSearch();
  },

  // ========== 模式切换 ==========

  switchToListMode: function () {
    this.setData({
      viewMode: 'list',
      currentReviewIndex: 0,
      showExplanation: true
    });
  },

  switchToReviewMode: function () {
    if (this.data.filteredList.length === 0) return;
    this.setData({
      viewMode: 'review',
      currentReviewIndex: 0,
      showExplanation: true,
      isFlipped: false
    });
  },

  // ========== 复习模式导航 ==========

  goPrevReview: function () {
    if (this.data.currentReviewIndex > 0) {
      this.setData({
        currentReviewIndex: this.data.currentReviewIndex - 1,
        showExplanation: true,
        isFlipped: false
      });
    }
  },

  goNextReview: function () {
    if (this.data.currentReviewIndex < this.data.filteredList.length - 1) {
      this.setData({
        currentReviewIndex: this.data.currentReviewIndex + 1,
        showExplanation: true,
        isFlipped: false
      });
    }
  },

  toggleExplanation: function () {
    this.setData({
      showExplanation: !this.data.showExplanation,
      isFlipped: false
    });
  },

  toggleFlip: function () {
    this.setData({
      isFlipped: !this.data.isFlipped
    });
  },

  // ========== 移出错题（保留原有逻辑）==========

  removeWrong: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '确认移除',
      content: '将该题目从错题本移除？移除后可以重新练习时再次记录。',
      confirmColor: '#f44336',
      success: function (res) {
        if (res.confirm) {
          storage.removeWrongQuestion(id);
          that.loadWrongQuestions();
          wx.showToast({
            title: '已移除',
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  },

  // 复习模式下移出当前
  removeFromReview: function () {
    var list = this.data.filteredList;
    var idx = this.data.currentReviewIndex;
    if (list.length === 0 || idx >= list.length) return;
    var id = list[idx].id;
    var that = this;
    wx.showModal({
      title: '确认移除',
      content: '将该题目从错题本移除？移除后可以重新练习时再次记录。',
      confirmColor: '#f44336',
      success: function (res) {
        if (res.confirm) {
          storage.removeWrongQuestion(id);
          that.loadWrongQuestions();
          wx.showToast({
            title: '已移除',
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  },

  // ========== 导航 ==========

  goPracticeWrong: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=wrong_only&sourceType=wrong_only'
    });
  },

  goStudy: function () {
    wx.switchTab({
      url: '/pages/home/home'
    });
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
    secondaryNav.back(this, 'packages/quiz/pages/mistakes/mistakes');
  }

});
