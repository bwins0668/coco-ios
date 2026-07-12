var secondaryNav = require('../../../../utils/secondary-navigation');
// packages/quiz/pages/flashcard-quiz/flashcard-quiz.js
// v4: Async subpackage loading via loadDeckAsync. Deck-specific (course + yearId).
// Loading → Error → Empty → Content: four mutually exclusive states.
var adapter;
try {
  adapter = require('../../data/flashcard_adapter');
} catch (e) {
  console.error('[flashcard-quiz] CRITICAL: adapter require failed', e);
  adapter = null;
}
var storage;
try {
  storage = require('../../../../utils/storage');
} catch (e) {
  console.error('[flashcard-quiz] CRITICAL: storage require failed', e);
  storage = null;
}

function getContentStatusLevel(card) {
  if (!card || !card.contentStatus) return 'japanese_only';
  return card.contentStatus;
}

Page({
  data: {
    navSafeTop: 64,
    course: '',
    courseLabel: '',
    deckLabel: '',
    yearId: '',
    packageName: '',
    cards: [],
    totalCards: 0,
    currentIndex: 0,
    currentCard: null,
    answeredList: [],
    wrongIds: [],
    // R20.1: dark mode
    __themeDark: false,
    sessionCorrect: 0,
    sessionWrong: 0,
    hasAnswered: false,
    selectedKey: '',
    isCorrect: false,
    showBack: false,
    isFinished: false,
    progressPercent: 0,
    timerText: '',
    startTime: 0,
    hasRestored: false,
    contentStatusLevel: 'japanese_only',
    userChoice: '',
    correctAnswer: '',
    optionExplanations: [],

    // === Four-state machine (mutually exclusive) ===
    isLoading: true,
    loadError: '',
    isEmpty: false,
    loadingMsg: '正在准备闪卡...',
    // Error details for error card
    errorCourse: '',
    errorDeckLabel: '',
    errorYearId: '',
    errorPackageName: '',
    errorDetail: ''
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    console.log('[flashcard-quiz] onLoad', options);
    this._applyTheme();

    var course = options.course || options.exam || 'itpass';
    var yearId = options.yearId || '';
    var deckLabel = options.deckLabel || yearId || '年度模拟';
    var courseLabel = course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡';

    this.setData({
      course: course,
      courseLabel: courseLabel,
      deckLabel: deckLabel,
      yearId: yearId,
      errorCourse: course,
      errorDeckLabel: deckLabel,
      errorYearId: yearId,
      loadingMsg: '正在加载 ' + deckLabel + '...'
    });

    if (!yearId) {
      this.setData({
        isLoading: false,
        loadError: '缺少牌组参数 (yearId)',
        errorDetail: '请从牌组选择页进入闪卡'
      });
      return;
    }

    if (!adapter) {
      this.setData({
        isLoading: false,
        loadError: '闪卡模块加载失败',
        errorDetail: '请退出重试'
      });
      return;
    }

    this.loadDeck(course, yearId);
  },

  onShow: function () {
    this._applyTheme();
    this.tryRestoreProgress();
  },

  onUnload: function () {
    this.stopTimer();
  },

  loadDeck: function (course, yearId) {
    var self = this;
    console.log('[flashcard-quiz] loadDeck', { course: course, yearId: yearId });

    self.setData({
      isLoading: true,
      loadError: '',
      isEmpty: false,
      loadingMsg: '正在加载 ' + (self.data.deckLabel || yearId) + '...'
    });

    adapter.loadDeckAsync(course, yearId).then(function (deck) {
      console.log('[flashcard-quiz] loadDeckAsync resolved', {
        total: deck.stats.total,
        deduped: deck.stats.deduped
      });

      var cards = deck.cards;
      for (var ci = 0; ci < cards.length; ci++) {
        cards[ci].showContentStatusTag = !!cards[ci].contentStatus;
      }

      if (!cards || cards.length === 0) {
        console.log('[flashcard-quiz] no cards in result');
        self.setData({
          isLoading: false,
          isEmpty: true,
          totalCards: 0,
          currentCard: null,
          cards: []
        });
        return;
      }

      console.log('[flashcard-quiz] loaded', cards.length, 'cards');
      self.setData({
        cards: cards,
        totalCards: cards.length,
        currentIndex: 0,
        currentCard: cards[0],
        contentStatusLevel: getContentStatusLevel(cards[0]),
        progressPercent: Math.round(1 / cards.length * 100) || 0,
        isFinished: false,
        hasAnswered: false,
        selectedKey: '',
        isCorrect: false,
        showBack: false,
        answeredList: [],
        wrongIds: [],
    // R20.1: dark mode
    __themeDark: false,
        sessionCorrect: 0,
        sessionWrong: 0,
        isLoading: false,
        loadError: '',
        isEmpty: false
      });
      self.startTimer();
      console.log('[flashcard-quiz] loaded successfully');
    }).catch(function (err) {
      console.error('[flashcard-quiz] loadDeckAsync FAILED:', err);
      console.error('[flashcard-quiz] error message:', err && err.message);
      console.error('[flashcard-quiz] error stack:', err && err.stack);
      self.setData({
        isLoading: false,
        loadError: '闪卡数据加载失败',
        errorDetail: (err && err.message) || '未知错误',
        cards: [],
        totalCards: 0,
        currentCard: null,
        isFinished: true
      });
    });
  },

  retryLoad: function () {
    this.loadDeck(this.data.course, this.data.yearId);
  },

  startTimer: function () {
    var startTime = Date.now();
    this.setData({ startTime: startTime });
    this._timerInterval = setInterval(function () {
      var diffSec = Math.floor((Date.now() - startTime) / 1000);
      var minutes = Math.floor(diffSec / 60);
      var seconds = diffSec % 60;
      this.setData({
        timerText: (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
      });
    }.bind(this), 1000);
  },

  stopTimer: function () {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  tryRestoreProgress: function () {
    if (this.data.hasRestored) return;
    try {
      if (!adapter) return;
      var progress = adapter.getFlashcardProgress();
      if (!progress || progress.course !== this.data.course) return;
      if (!progress.answeredList || progress.answeredList.length === 0) return;
      var cards = this.data.cards;
      var total = cards.length;
      if (total === 0) return;
      var restoreIndex = Math.min(progress.currentIndex || 0, total - 1);
      this.setData({
        hasRestored: true,
        currentIndex: restoreIndex,
        currentCard: cards[restoreIndex],
        contentStatusLevel: getContentStatusLevel(cards[restoreIndex]),
        progressPercent: Math.round((restoreIndex + 1) / total * 100) || 0,
        answeredList: progress.answeredList || [],
        wrongIds: progress.wrongIds || [],
        sessionCorrect: progress.sessionCorrect || 0,
        sessionWrong: progress.sessionWrong || 0
      });
    } catch (e) {
      console.warn('[flashcard-quiz] tryRestoreProgress failed:', e);
    }
  },

  saveProgress: function () {
    try {
      if (!adapter) return;
      var progress = {
        course: this.data.course,
        examTitle: this.data.courseLabel,
        deckLabel: this.data.deckLabel,
        yearId: this.data.yearId,
        currentIndex: this.data.currentIndex,
        total: this.data.totalCards,
        answeredList: this.data.answeredList,
        wrongIds: this.data.wrongIds,
        sessionCorrect: this.data.sessionCorrect,
        sessionWrong: this.data.sessionWrong,
        updatedAt: Date.now()
      };
      adapter.saveFlashcardProgress(progress);
    } catch (e) {
      console.warn('[flashcard-quiz] saveProgress failed:', e);
    }
  },

  selectAnswer: function (event) {
    if (this.data.hasAnswered || !this.data.currentCard) return;

    var key = event.currentTarget.dataset.key;
    var card = this.data.currentCard;
    var isCorrect = false;
    for (var i = 0; i < card.options.length; i++) {
      if (card.options[i].key === key && card.options[i].isCorrect) {
        isCorrect = true;
        break;
      }
    }

    var answeredList = this.data.answeredList.slice();
    answeredList.push({
      cardId: card.id,
      selectedKey: key,
      isCorrect: isCorrect
    });

    var wrongIds = this.data.wrongIds.slice();
    if (!isCorrect) {
      wrongIds.push(card.id);
      try {
        if (storage) {
          storage.addWrongQuestion(
            card.sourceId,
            card.course,
            key,
            {
              id: card.sourceId,
              exam: card.course,
              sourceType: card.sourceType,
              yearId: card.yearId,
              year: card.examYear,
              number: card.number,
              category: card.category,
              level: card.level,
              questionZh: card.questionZh,
              questionJa: card.questionJa,
              options: card.options.map(function (o) {
                return { key: o.key, textZh: o.textZh, textJa: o.textJa };
              }),
              answer: card.answer,
              explanationZh: card.explanationZh,
              explanationJa: card.explanationJa,
              translationStatus: card.translationStatus,
              explanationStatus: card.explanationStatus
            }
          );
        }
      } catch (e) {
        console.warn('[flashcard-quiz] addWrongQuestion failed:', e);
      }
    }

    this.setData({
      hasAnswered: true,
      selectedKey: key,
      userChoice: key,
      isCorrect: isCorrect,
      answeredList: answeredList,
      wrongIds: wrongIds,
      sessionCorrect: this.data.sessionCorrect + (isCorrect ? 1 : 0),
      sessionWrong: this.data.sessionWrong + (isCorrect ? 0 : 1)
    });

    this.saveProgress();
  },

  showExplanation: function () {
    var card = this.data.currentCard;
    var correctKey = '';
    var explanations = [];
    if (card && card.options) {
      for (var i = 0; i < card.options.length; i++) {
        if (card.options[i].isCorrect) {
          correctKey = card.options[i].key;
        }
      }
      if (card.optionExplanations && card.optionExplanations.length > 0) {
        explanations = card.optionExplanations;
      }
    }
    this.setData({
      showBack: true,
      correctAnswer: correctKey,
      optionExplanations: explanations
    });
  },

  nextCard: function () {
    var nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.totalCards) {
      this.finishDeck();
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentCard: this.data.cards[nextIndex],
      contentStatusLevel: getContentStatusLevel(this.data.cards[nextIndex]),
      progressPercent: Math.round((nextIndex + 1) / this.data.totalCards * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      userChoice: '',
      correctAnswer: '',
      optionExplanations: [],
      isCorrect: false,
      showBack: false
    });

    this.saveProgress();
  },

  finishDeck: function () {
    this.stopTimer();
    this.setData({
      isFinished: true,
      showBack: false
    });
    this.saveProgress();
  },

  restartDeck: function () {
    this.setData({
      currentIndex: 0,
      currentCard: this.data.cards[0],
      contentStatusLevel: getContentStatusLevel(this.data.cards[0]),
      progressPercent: Math.round(1 / this.data.totalCards * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      userChoice: '',
      correctAnswer: '',
      optionExplanations: [],
      isCorrect: false,
      showBack: false,
      isFinished: false,
      answeredList: [],
      wrongIds: [],
    // R20.1: dark mode
    __themeDark: false,
      sessionCorrect: 0,
      sessionWrong: 0
    });
    this.startTimer();
    this.saveProgress();
  },

  retryWrongCards: function () {
    var wrongIds = this.data.wrongIds.slice();
    if (wrongIds.length === 0) {
      wx.showToast({ title: '本次没有错题', icon: 'none' });
      return;
    }
    var wrongCards = [];
    for (var i = 0; i < this.data.cards.length; i++) {
      if (wrongIds.indexOf(this.data.cards[i].id) >= 0) {
        wrongCards.push(this.data.cards[i]);
      }
    }
    if (wrongCards.length === 0) {
      wx.showToast({ title: '未找到错题', icon: 'none' });
      return;
    }
    this.stopTimer();
    this.setData({
      cards: wrongCards,
      totalCards: wrongCards.length,
      currentIndex: 0,
      currentCard: wrongCards[0],
      contentStatusLevel: getContentStatusLevel(wrongCards[0]),
      progressPercent: Math.round(1 / wrongCards.length * 100) || 0,
      hasAnswered: false,
      selectedKey: '',
      userChoice: '',
      correctAnswer: '',
      optionExplanations: [],
      isCorrect: false,
      showBack: false,
      isFinished: false,
      answeredList: [],
      wrongIds: [],
    // R20.1: dark mode
    __themeDark: false,
      sessionCorrect: 0,
      sessionWrong: 0,
      deckLabel: '错题重练'
    });
    this.startTimer();
    this.saveProgress();
  },

  goHome: function () {
    wx.switchTab({ url: '/pages/home/home' });
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
    secondaryNav.back(this, 'packages/quiz/pages/flashcard-quiz/flashcard-quiz');
  }

});
