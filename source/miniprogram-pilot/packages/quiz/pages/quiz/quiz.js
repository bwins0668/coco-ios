var secondaryNav = require('../../../../utils/secondary-navigation');
// pages/quiz/quiz.js
var questionsModule = require('../../data/questions');
var pastExamIndex = require('../../data/past_exam_bank/index');
var storage = require('../../../../utils/storage');
var topicScopeEngine = require('../../../../utils/quiz-topic-scope');
var favoriteQuestions = require('../../../../utils/favorite-questions');

// === Inline quiz dedup (moved from utils/quiz_dedupe.js to avoid main-package unused-JS warning) ===
function normalizeQuizText(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[Ａ-Ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[ａ-ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .toLowerCase();
}
function dedupeQuestions(questions) {
  var seen = Object.create(null);
  return questions.filter(function (q) {
    var stem = normalizeQuizText(q.questionZh || q.questionJa || q.title || q.term || '');
    var opts = normalizeQuizText((q.options || []).map(function (o) { return (o.textZh || o.textJa || o.text || '').trim(); }).join('|'));
    var ans = normalizeQuizText(q.answer || q.correctAnswer || q.correctIndex || '');
    var key = stem + '|' + opts + '|' + ans;
    if (!key || key === '||') return true;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

// === P0-3: HTML 清洗 + 日文检测 + 中文解析 fallback ===
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

function hasJapaneseKana(text) {
  if (!text) return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function isMostlyJapanese(text) {
  if (!text || text.length < 10) return false;
  var kanaCount = 0;
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF) || (code >= 0x4E00 && code <= 0x9FFF)) {
      kanaCount++;
    }
  }
  return kanaCount / text.length > 0.3;
}

function formatExplanation(raw) {
  var cleaned = stripHtmlTags(raw);
  if (!cleaned || cleaned.length < 5) return { clean: '', isJapanese: true };
  var isJa = hasJapaneseKana(cleaned) || isMostlyJapanese(cleaned);
  return { clean: cleaned, isJapanese: isJa };
}

function processQuestionForDisplay(q) {
  var result = {};
  for (var key in q) { result[key] = q[key]; }

  // 清洗题干 HTML
  if (q.questionZh) result.questionZhClean = stripHtmlTags(q.questionZh);
  if (q.questionJa) result.questionJaClean = stripHtmlTags(q.questionJa);

  // 处理中文解析：当前轻量页只处理课程题和本地错题快照；真题解释随年份分包加载。
  if (q.explanationZhClean && q.explanationZhClean.length > 10) {
    result.explanationZhClean = q.explanationZhClean;
  } else {
    var zhResult = formatExplanation(q.explanationZh);
    if (!zhResult.isJapanese && zhResult.clean && zhResult.clean.length > 10) {
      result.explanationZhClean = zhResult.clean;
    } else {
      var ans = q.answer || '';
      result.explanationZhClean = '正确答案：' + ans + '。本题考查IT基础知识，该选项最符合题意。';
    }
  }

  // 处理日文解析
  var jaResult = formatExplanation(q.explanationJa);
  result.explanationJaClean = jaResult.clean;

  return result;
}

function createWrongQuestionSnapshot(q) {
  if (!q) return null;
  return {
    id: q.id,
    exam: q.exam,
    sourceType: q.sourceType,
    yearId: q.yearId,
    year: q.year,
    number: q.number,
    category: q.category,
    level: q.level,
    questionZh: q.questionZhClean || q.questionZh || '',
    questionJa: q.questionJaClean || q.questionJa || '',
    options: q.options || [],
    answer: q.answer,
    explanationZh: q.explanationZhClean || q.explanationZh || '',
    explanationJa: q.explanationJaClean || q.explanationJa || '',
    translationStatus: q.translationStatus || 'complete',
    explanationStatus: q.explanationStatus || 'complete'
  };
}

Page({
  data: {
    navSafeTop: 64,
    exam: '',
    sourceType: 'lesson_quiz',
    modeLabel: '课程练习',
    examTitle: '',
    resultModeLabel: '',
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    selectedAnswer: '',
    answerState: 'unanswered',
    hasAnswered: false,
    isCorrect: false,
    showAnalysisDrawer: false,
    isFinished: false,
    showResult: false,
    totalQuestions: 0,
    sessionTotal: 0,
    sessionCorrect: 0,
    sessionWrong: 0,
    sessionAccuracy: 0,
    encouragementText: '',
    // v0.21.0 第四批：结果页轻量洞察
    accuracyLevel: '',
    insightHint: '',
    // v0.22.0 第一批：答题页体验增强
    examBadge: '',
    progressPercent: 0,
    feedbackTip: '',
    showFeedbackTip: false,
    // v0.22.0 第二批：结果页复盘增强
    nextAction: '',
    hasWrongQuestions: false,
    // R3.43 答题记录追踪
    answeredList: [],
    showReview: false,
    // R3.50 重练错题功能
    wrongQuestionIds: [],
    // R3.60 答题提示按钮
    showHint: false,
    // R3.62 答题计时器
    timerText: '',
    startTime: 0,
    // R20.1: dark mode
    __themeDark: false,
    // R2.0: verified topic practice scope (only set when topicId present)
    topicScopeActive: false,
    topicLabel: '',
    // R2.6: verified topic context for attempt metadata (only set for a valid scope)
    topicId: '',
    topicTitle: '',
    // R2.7: question favorite control (only enabled when identity is complete)
    canFavorite: false,
    isFavorited: false
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();

    var exam = options.exam || 'itpass';
    var sourceType = options.sourceType || 'lesson_quiz';
    var yearId = options.yearId || '';
    // R2.0: optional verified topic scope (only new query param)
    var topicId = options.topicId || '';

    // R3.62 答题计时器：记录开始时间并启动计时器
    var startTime = Date.now();
    this.setData({
      startTime: startTime
    });
    this._timerInterval = setInterval(function () {
      var now = Date.now();
      var diffMs = now - startTime;
      var diffSec = Math.floor(diffMs / 1000);
      var minutes = Math.floor(diffSec / 60);
      var seconds = diffSec % 60;
      var timerText = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
      if (this && this.setData) {
        this.setData({ timerText: timerText });
      }
    }.bind(this), 1000);

    if (sourceType === 'wrong_only') {
      this.loadWrongQuestions();
      return;
    }

    if (sourceType === 'past_exam_japanese') {
      this.redirectToPastExamPackage(exam, yearId);
      return;
    }

    this.loadPracticeQuestions(exam, sourceType, yearId, topicId);
  },

  onShow: function () {
    this._applyTheme();
  },

  redirectToPastExamPackage: function (exam, yearId) {
    if (!yearId) {
      wx.redirectTo({
        url: '/packages/quiz/pages/exam-menu/exam-menu?exam=' + exam,
        fail: function (err) {
          console.error('[quiz] redirect to exam menu failed', err);
          wx.showToast({ title: '请选择考试年份', icon: 'none' });
        }
      });
      return;
    }

    var route = pastExamIndex.getRoute(exam, yearId);
    if (!route || !route.route) {
      console.warn('[quiz] past exam split route missing', exam, yearId);
      wx.showToast({ title: '试卷分包缺失', icon: 'none' });
      this.setData({
        exam: exam,
        examTitle: (exam === 'sg' ? 'SG 考试' : 'IT Passport') + ' - 日文题练习',
        examBadge: exam === 'sg' ? 'SG' : 'IT',
        sourceType: 'past_exam_japanese',
        modeLabel: '日文题练习',
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0,
        answerState: 'unanswered',
        showAnalysisDrawer: false,
        showFeedbackTip: false,
        yearId: yearId
      });
      return;
    }

    wx.redirectTo({
      url: route.route,
      fail: function (err) {
        console.error('[quiz] redirect to split past exam failed', route.route, err);
        wx.showToast({ title: '打开试卷失败', icon: 'none' });
      }
    });
  },

  loadPracticeQuestions: function (exam, sourceType, yearId, topicId) {
    var examTitle = exam === 'sg' ? 'SG 考试' : 'IT Passport';
    var examBadge = exam === 'sg' ? 'SG' : 'IT';
    var modeLabel = sourceType === 'past_exam_japanese' ? '日文题练习' : '课程练习';

    // R2.0: resolve the optional verified topic scope (topicId is the only new param).
    // No topicId -> scope null -> original behavior is fully preserved.
    var topicScope = topicScopeEngine.resolveTopicScope({
      exam: exam, sourceType: sourceType, yearId: yearId, topicId: topicId
    });
    var topicScopeActive = !!topicId;
    var topicLabel = topicScopeEngine.getTopicPracticeLabel(topicScope);

    var allQuestions;
    if (topicScopeActive) {
      // Exact, registry-verified category scope. A rejected scope yields an empty
      // set (controlled empty state) and NEVER falls back to the full question bank.
      allQuestions = topicScopeEngine.filterQuestionsForTopicScope(questionsModule.questions, topicScope);
    } else {
      allQuestions = questionsModule.questions.filter(function (question) {
        return question.exam === exam && question.sourceType === sourceType;
      });
      if (yearId) {
        allQuestions = allQuestions.filter(function (question) {
          return question.yearId === yearId;
        });
      }
    }

    if (allQuestions.length > 0) {
      // P0-3: 清洗所有题目的 HTML 并生成中文解析 fallback
      var processed = dedupeQuestions(allQuestions).map(processQuestionForDisplay);
      var yearTag = yearId ? ('（' + yearId + '）') : '';
      this.setData({
        exam: exam,
        examTitle: examTitle + ' - ' + modeLabel + yearTag,
        examBadge: examBadge,
        sourceType: sourceType,
        modeLabel: modeLabel,
        resultModeLabel: examTitle + ' · ' + modeLabel + yearTag,
        questions: processed,
        totalQuestions: processed.length,
        currentQuestion: processed[0],
        currentIndex: 0,
        progressPercent: Math.round(1 / processed.length * 100) || 0,
        selectedAnswer: '',
        answerState: 'unanswered',
        hasAnswered: false,
        isCorrect: false,
        isFinished: false,
        showResult: false,
        showAnalysisDrawer: false,
        showFeedbackTip: false,
        yearId: yearId,
        topicScopeActive: topicScopeActive,
        topicLabel: topicLabel,
        topicId: (topicScope && topicScope.valid) ? topicScope.topicId : '',
        topicTitle: (topicScope && topicScope.valid) ? topicScope.title : ''
      });
      this._refreshFavoriteStateFor(processed[0]);
    } else {
      this.setData({
        exam: exam,
        examTitle: examTitle + ' - ' + modeLabel + (yearId ? ('（' + yearId + '）') : ''),
        examBadge: examBadge,
        sourceType: sourceType,
        modeLabel: modeLabel,
        resultModeLabel: examTitle + ' · ' + modeLabel,
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0,
        answerState: 'unanswered',
        showAnalysisDrawer: false,
        showFeedbackTip: false,
        yearId: yearId,
        topicScopeActive: topicScopeActive,
        topicLabel: topicLabel,
        topicId: (topicScope && topicScope.valid) ? topicScope.topicId : '',
        topicTitle: (topicScope && topicScope.valid) ? topicScope.title : ''
      });
    }
  },

  selectAnswer: function (event) {
    if (this.data.hasAnswered || !this.data.currentQuestion) return;

    var key = (event.detail && event.detail.label) ||
      (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.key);
    if (!key) return;
    this.setData({
      selectedAnswer: key,
      answerState: 'selected',
      showFeedbackTip: false,
      feedbackTip: '',
      showAnalysisDrawer: false
    });
  },

  confirmAnswer: function () {
    if (this.data.hasAnswered || !this.data.currentQuestion || !this.data.selectedAnswer) return;

    var key = this.data.selectedAnswer;
    var correctAnswer = this.data.currentQuestion.answer;
    var isCorrect = key === correctAnswer;
    var attemptExam = this.data.sourceType === 'wrong_only'
      ? (this.data.currentQuestion.exam || this.data.exam)
      : this.data.exam;

    if (!isCorrect) {
      storage.addWrongQuestion(
        this.data.currentQuestion.id,
        attemptExam,
        key,
        createWrongQuestionSnapshot(this.data.currentQuestion)
      );
    }

    var attemptPayload = {
      questionId: this.data.currentQuestion.id,
      exam: attemptExam,
      sourceType: this.data.sourceType,
      selectedAnswer: key,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
    };
    // R2.6: attach verified topic context ONLY for a real topic session. topicId
    // is non-empty only when the scope resolved valid via the registry; normal /
    // yearId / wrong_only attempts never carry it.
    if (this.data.topicScopeActive && this.data.topicId) {
      attemptPayload.topicId = this.data.topicId;
      attemptPayload.topicTitleSnapshot = this.data.topicTitle;
    }
    storage.addQuizAttempt(attemptPayload);

    var sessionTotal = this.data.sessionTotal + 1;
    var sessionCorrect = this.data.sessionCorrect + (isCorrect ? 1 : 0);
    var sessionWrong = this.data.sessionWrong + (isCorrect ? 0 : 1);

    // R3.43 追踪答题记录
    var answeredList = this.data.answeredList.slice();
    answeredList.push({
      questionId: this.data.currentQuestion.id,
      selectedAnswer: key,
      isCorrect: isCorrect
    });

    // R3.50 记录错题 ID
    var wrongQuestionIds = this.data.wrongQuestionIds.slice();
    if (!isCorrect) {
      wrongQuestionIds.push(this.data.currentQuestion.id);
    }

    // 答题反馈提示语
    var feedbackTip = '';
    if (isCorrect) {
      var tips = ['继续保持！', '回答正确，理解得不错！', '很好，这道题掌握了！', '不错哦！'];
      feedbackTip = tips[Math.floor(Math.random() * tips.length)];
    } else {
      feedbackTip = '正确答案是 ' + correctAnswer + '，建议结合解释理解知识点';
    }

    this.setData({
      selectedAnswer: key,
      answerState: isCorrect ? 'correct' : 'incorrect',
      hasAnswered: true,
      isCorrect: isCorrect,
      showAnalysisDrawer: true,
      sessionTotal: sessionTotal,
      sessionCorrect: sessionCorrect,
      sessionWrong: sessionWrong,
      sessionAccuracy: Math.round(sessionCorrect / sessionTotal * 100),
      feedbackTip: feedbackTip,
      showFeedbackTip: true
    });
  },

  nextQuestion: function () {
    var nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.questions.length) {
      this.showPracticeResult();
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      progressPercent: Math.round((nextIndex + 1) / this.data.totalQuestions * 100) || 0,
      selectedAnswer: '',
      answerState: 'unanswered',
      hasAnswered: false,
      isCorrect: false,
      showAnalysisDrawer: false,
      showFeedbackTip: false,
      feedbackTip: ''
    });
    this._refreshFavoriteStateFor(this.data.questions[nextIndex]);
  },

  showPracticeResult: function () {
    // R3.62 清除计时器
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }

    var accuracy = this.data.sessionTotal > 0
      ? Math.round(this.data.sessionCorrect / this.data.sessionTotal * 100)
      : 0;

    // 3级学习洞察 + 下一步建议
    var accuracyLevel = '';
    var encouragement = '';
    var insightHint = '';
    var nextAction = '';
    var hasWrongQuestions = this.data.sessionWrong > 0;

    if (this.data.sessionTotal === 0) {
      encouragement = '本次无答题记录';
      accuracyLevel = 'none';
      nextAction = '尝试开始一组新的练习';
    } else if (accuracy >= 85) {
      accuracyLevel = 'good';
      encouragement = '掌握较好';
      insightHint = '继续保持练习节奏，可以尝试其他考试方向';
      nextAction = '建议尝试其他考试方向或日文题练习';
    } else if (accuracy >= 60) {
      accuracyLevel = 'moderate';
      encouragement = '建议继续巩固';
      insightHint = '建议再练一组巩固薄弱知识点';
      nextAction = hasWrongQuestions ? '建议再练一次，并回顾本次错题' : '建议再来一组巩固练习';
    } else {
      accuracyLevel = 'low';
      encouragement = '建议复盘错题';
      insightHint = '建议先到错题本复习相关题目';
      nextAction = '建议先复习本次错题，理解后再重新练习';
    }

    this.setData({
      isFinished: true,
      showResult: true,
      sessionAccuracy: accuracy,
      encouragementText: encouragement,
      accuracyLevel: accuracyLevel,
      insightHint: insightHint,
      nextAction: nextAction,
      hasWrongQuestions: hasWrongQuestions,
      // R3.43 准备答题回顾数据（包含题目文本和正确答案）
      reviewList: (function () {
        var questions = this.data.questions;
        var answered = this.data.answeredList;
        var result = [];
        for (var i = 0; i < answered.length; i++) {
          var item = answered[i];
          var question = null;
          for (var j = 0; j < questions.length; j++) {
            if (String(questions[j].id) === String(item.questionId)) {
              question = questions[j];
              break;
            }
          }
          if (question) {
            var qClean = processQuestionForDisplay(question);
            result.push({
              questionId: item.questionId,
              selectedAnswer: item.selectedAnswer,
              isCorrect: item.isCorrect,
              questionZh: qClean.questionZhClean || question.questionZh || '',
              correctAnswer: question.answer || '',
              hint: question.shared_hint || ''
            });
          }
        }
        return result;
      })()
    });
  },

  // R3.60 切换提示显示
  toggleHint: function () {
    var showHint = !this.data.showHint;
    this.setData({
      showHint: showHint
    });
  },

  resetSession: function () {
    this.setData({
      currentIndex: 0,
      currentQuestion: null,
      selectedAnswer: '',
      answerState: 'unanswered',
      hasAnswered: false,
      isCorrect: false,
      showAnalysisDrawer: false,
      isFinished: false,
      showResult: false,
      sessionTotal: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionAccuracy: 0,
      encouragementText: '',
      accuracyLevel: '',
      insightHint: ''
    });
  },

  restartPractice: function () {
    var exam = this.data.exam;
    var sourceType = this.data.sourceType;
    this.resetSession();

    if (sourceType === 'wrong_only') {
      this.loadWrongQuestions();
    } else {
      this.loadPracticeQuestions(exam, sourceType, this.data.yearId || '');
    }
  },

  goMistakes: function () {
    wx.navigateTo({
      url: '/packages/quiz/pages/mistakes/mistakes'
    });
  },

  goAnalysisDetail: function () {
    if (!this.data.currentQuestion) return;
    var app = getApp();
    if (app && app.globalData) {
      app.globalData.analysisDetailQuestion = createWrongQuestionSnapshot(this.data.currentQuestion);
      app.globalData.analysisDetailMeta = {
        selectedAnswer: this.data.selectedAnswer,
        isCorrect: this.data.isCorrect,
        from: 'quiz'
      };
    }
    var q = this.data.currentQuestion;
    var url = '/packages/quiz/pages/analysis-detail/analysis-detail?questionId=' +
      encodeURIComponent(q.id || '') +
      '&exam=' + encodeURIComponent(q.exam || this.data.exam || '') +
      '&sourceType=' + encodeURIComponent(q.sourceType || this.data.sourceType || '') +
      '&yearId=' + encodeURIComponent(q.yearId || this.data.yearId || '');
    wx.navigateTo({ url: url });
  },

  goHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  finishQuiz: function () { secondaryNav.back(this, 'packages/quiz/pages/quiz/quiz'); },

  // R2.7: sync the favorite control to a given question's identity.
  _refreshFavoriteStateFor: function (q) {
    var identity = q ? { exam: q.exam, questionId: q.id, sourceType: q.sourceType } : null;
    var canFav = favoriteQuestions.isValidIdentity(identity);
    this.setData({
      canFavorite: canFav,
      isFavorited: canFav ? favoriteQuestions.isQuestionFavorited(identity) : false
    });
  },

  // R2.7: toggle favorite for the CURRENT question only. No effect on answering,
  // options, result state, or topic scope. Disabled for incomplete identity.
  toggleFavorite: function () {
    var q = this.data.currentQuestion;
    if (!q) return;
    var identity = { exam: q.exam, questionId: q.id, sourceType: q.sourceType };
    if (!favoriteQuestions.isValidIdentity(identity)) return;
    var nowFav = favoriteQuestions.toggleFavoriteQuestion(identity);
    this.setData({ isFavorited: nowFav });
  },

  // R2.0: return from a topic-scoped (incl. empty) session. Prefer the natural
  // back stack to the Topic page; if there is no stack, fall back safely to the
  // matching Course Shell (never a wrong exam, never a white screen).
  returnToTopic: function () {
    var self = this;
    var pages = getCurrentPages();
    if (pages && pages.length > 1) {
      wx.navigateBack({ fail: function () { self._fallbackToCourseShell(); } });
    } else {
      self._fallbackToCourseShell();
    }
  },

  _fallbackToCourseShell: function () {
    var exam = this.data.exam;
    if (exam === 'itpass' || exam === 'sg') {
      wx.redirectTo({
        url: '/pages/course/course?courseId=' + exam,
        fail: function () { wx.switchTab({ url: '/pages/home/home' }); }
      });
    } else {
      wx.switchTab({ url: '/pages/home/home' });
    }
  },

  // R3.43 切换答题回顾显示
  toggleReview: function () {
    this.setData({
      showReview: !this.data.showReview
    });
  },

  loadWrongQuestions: function () {
    var wrongQuestions = storage.getWrongQuestions();
    var allQuestions = questionsModule.questions;
    var matched = [];

    for (var i = 0; i < allQuestions.length; i++) {
      var question = allQuestions[i];
      for (var j = 0; j < wrongQuestions.length; j++) {
        if (wrongQuestions[j].id === question.id) {
          matched.push(question);
          break;
        }
      }
    }

    if (matched.length > 0) {
      var processed = matched.map(processQuestionForDisplay);
      this.setData({
        exam: 'wrong_only',
        examTitle: '错题练习',
        examBadge: '错题',
        sourceType: 'wrong_only',
        modeLabel: '错题重练',
        resultModeLabel: '错题练习 · 错题重练',
        questions: processed,
        totalQuestions: processed.length,
        currentQuestion: processed[0],
        currentIndex: 0,
        progressPercent: Math.round(1 / matched.length * 100) || 0,
        selectedAnswer: '',
        answerState: 'unanswered',
        hasAnswered: false,
        isCorrect: false,
        isFinished: false,
        showResult: false,
        showAnalysisDrawer: false,
        showFeedbackTip: false
      });
      this._refreshFavoriteStateFor(processed[0]);
    } else {
      this.setData({
        exam: 'wrong_only',
        examTitle: '错题练习',
        examBadge: '错题',
        sourceType: 'wrong_only',
        modeLabel: '错题重练',
        resultModeLabel: '错题练习 · 错题重练',
        questions: [],
        currentQuestion: null,
        isFinished: true,
        showResult: false,
        totalQuestions: 0,
        answerState: 'unanswered',
        showAnalysisDrawer: false,
        showFeedbackTip: false
      });
    }
  },

  // R3.46 答题结果页分享功能
  onShareAppMessage: function () {
    var title = 'Study Tools 刷题';
    if (this.data.showResult) {
      var accuracy = this.data.sessionAccuracy || 0;
      var total = this.data.sessionTotal || 0;
      title = '我在 Study Tools 刷题，正确率 ' + accuracy + '%，共 ' + total + ' 题，来挑战吧！';
    }
    return {
      title: title,
      path: '/packages/quiz/pages/exam-menu/exam-menu',
      imageUrl: ''
    };
  },

  // R3.50 重练本次错题
  retryWrongQuestions: function () {
    var wrongIds = this.data.wrongQuestionIds || [];
    if (wrongIds.length === 0) {
      wx.showToast({ title: '本次没有错题', icon: 'none' });
      return;
    }

    // 从当前题目中过滤出错题
    var allQuestions = this.data.questions;
    var wrongQuestions = [];
    for (var i = 0; i < allQuestions.length; i++) {
      for (var j = 0; j < wrongIds.length; j++) {
        if (String(allQuestions[i].id) === String(wrongIds[j])) {
          wrongQuestions.push(allQuestions[i]);
          break;
        }
      }
    }

    if (wrongQuestions.length === 0) {
      wx.showToast({ title: '未找到错题', icon: 'none' });
      return;
    }

    // 重置会话，但保留exam和sourceType
    this.setData({
      questions: wrongQuestions,
      totalQuestions: wrongQuestions.length,
      currentIndex: 0,
      currentQuestion: wrongQuestions[0],
      progressPercent: Math.round(1 / wrongQuestions.length * 100) || 0,
      selectedAnswer: '',
      answerState: 'unanswered',
      hasAnswered: false,
      isCorrect: false,
      isFinished: false,
      showResult: false,
      showAnalysisDrawer: false,
      sessionTotal: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionAccuracy: 0,
      encouragementText: '',
      accuracyLevel: '',
      insightHint: '',
      wrongQuestionIds: [],
      answeredList: [],
      showReview: false,
      showFeedbackTip: false
    });
    this._refreshFavoriteStateFor(wrongQuestions[0]);
  },

  // R3.71 进度保存提示
  onUnload: function () {
  if (this._timerInterval) {
    clearInterval(this._timerInterval);
    this._timerInterval = null;
  }

    wx.showToast({
      title: '答题进度已保存',
      icon: 'success',
      duration: 1500
    });
  },
  /**
   * R20.1: runtime dark mode detection
   */
  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/quiz/pages/quiz/quiz');
  }

});
