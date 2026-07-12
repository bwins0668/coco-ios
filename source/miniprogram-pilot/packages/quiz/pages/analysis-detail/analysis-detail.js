var secondaryNav = require('../../../../utils/secondary-navigation');
// packages/quiz/pages/analysis-detail/analysis-detail.js
var questionsModule = require('../../data/questions');
var storage = require('../../../../utils/storage');

function stripHtmlTags(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeQuestion(q) {
  if (!q) return null;
  var options = Array.isArray(q.options) ? q.options : [];
  return {
    id: q.id || '',
    exam: q.exam || '',
    sourceType: q.sourceType || '',
    yearId: q.yearId || '',
    year: q.year || '',
    number: q.number || '',
    category: q.category || '',
    level: q.level || '',
    questionZh: stripHtmlTags(q.questionZhClean || q.questionZh || ''),
    questionJa: stripHtmlTags(q.questionJaClean || q.questionJa || ''),
    options: options,
    answer: q.answer || '',
    explanationZh: stripHtmlTags(q.explanationZhClean || q.explanationZh || ''),
    explanationJa: stripHtmlTags(q.explanationJaClean || q.explanationJa || ''),
    explanationStatus: q.explanationStatus || 'complete',
    translationStatus: q.translationStatus || 'complete'
  };
}

function findQuestionFromCourse(questionId, exam, sourceType) {
  var list = questionsModule.questions || [];
  for (var i = 0; i < list.length; i++) {
    var q = list[i];
    if (String(q.id) === String(questionId) &&
        (!exam || q.exam === exam) &&
        (!sourceType || q.sourceType === sourceType)) {
      return q;
    }
  }
  return null;
}

function findQuestionFromWrong(questionId) {
  var wrong = storage.getWrongQuestions ? storage.getWrongQuestions() : [];
  for (var i = 0; i < wrong.length; i++) {
    if (String(wrong[i].id) === String(questionId) && wrong[i].questionSnapshot) {
      return wrong[i].questionSnapshot;
    }
  }
  return null;
}

Page({
  data: {
    navSafeTop: 64,
    question: null,
    selectedAnswer: '',
    isCorrect: false,
    sourceLabel: '',
    hasQuestion: false
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    var app = getApp();
    var fromGlobal = app && app.globalData && app.globalData.analysisDetailQuestion;
    var meta = app && app.globalData && app.globalData.analysisDetailMeta;
    var questionId = options.questionId || '';
    var exam = options.exam || '';
    var sourceType = options.sourceType || '';
    var question = fromGlobal && (!questionId || String(fromGlobal.id) === String(questionId))
      ? fromGlobal
      : (findQuestionFromCourse(questionId, exam, sourceType) || findQuestionFromWrong(questionId));

    var normalized = normalizeQuestion(question);
    this.setData({
      question: normalized,
      hasQuestion: !!normalized,
      selectedAnswer: meta && meta.selectedAnswer || '',
      isCorrect: !!(meta && meta.isCorrect),
      sourceLabel: this._buildSourceLabel(normalized)
    });
  },

  _buildSourceLabel: function (q) {
    if (!q) return '';
    var examLabel = q.exam === 'sg' ? 'SG' : 'IT Passport';
    if (q.sourceType === 'past_exam_japanese') {
      return examLabel + ' · ' + (q.year || q.yearId || '日文真题');
    }
    if (q.sourceType === 'wrong_only') {
      return examLabel + ' · 错题复习';
    }
    return examLabel + ' · 课程练习';
  },

  goBackReview: function () {
    wx.navigateBack({
      delta: 1,
      fail: function () {
        wx.navigateTo({ url: '/packages/quiz/pages/mistakes/mistakes' });
      }
    });
  },

  goMistakes: function () {
    wx.navigateTo({ url: '/packages/quiz/pages/mistakes/mistakes' });
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/quiz/pages/analysis-detail/analysis-detail');
  }

});
