'use strict';
var secondaryNav = require('../../../../utils/secondary-navigation');

var deckManifest = require('../../data/deck-manifest');
var loader = require('../../data/loader');

function stripHtml(value) {
  if (!value || typeof value !== 'string') return '';
  return value
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

function normalizeDeckId(value) {
  var raw = String(value || '').trim();
  if (!raw) return '';
  try {
    return decodeURIComponent(raw).trim().replace(/^\/+|\/+$/g, '');
  } catch (error) {
    return raw.replace(/^\/+|\/+$/g, '');
  }
}

function countMatches(value, pattern) {
  var matches = String(value || '').match(pattern);
  return matches ? matches.length : 0;
}

function hasVerifiedZhText(textZh, textJa) {
  var zh = stripHtml(textZh);
  var ja = stripHtml(textJa);
  if (!zh || !ja || zh === ja) return false;

  var compact = zh.replace(/\s/g, '');
  if (compact.length < 2) return false;

  var chineseCount = countMatches(compact, /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g);
  var kanaCount = countMatches(compact, /[\u3040-\u309F\u30A0-\u30FF]/g);
  var chineseRatio = chineseCount / compact.length;
  var kanaRatio = kanaCount / compact.length;

  return chineseCount >= 2 && chineseRatio >= 0.2 && kanaRatio <= 0.15 && chineseRatio >= kanaRatio;
}

function verifiedZh(textZh, textJa) {
  var text = stripHtml(textZh);
  return hasVerifiedZhText(text, textJa) ? text : '';
}

function findOption(options, key) {
  for (var i = 0; i < options.length; i++) {
    if (options[i].key === key) return options[i];
  }
  return null;
}

function normalizeCard(raw, course, yearId) {
  if (!raw || !raw.id) return null;

  var questionJa = stripHtml(raw.questionJa || '');
  var sourceOptions = Array.isArray(raw.options) ? raw.options : [];
  var answerId = String(raw.answerId || raw.answer || '');
  if (!questionJa || sourceOptions.length < 2 || !answerId) return null;

  var questionZh = verifiedZh(raw.questionZh, questionJa);
  var options = [];
  for (var i = 0; i < sourceOptions.length; i++) {
    var source = sourceOptions[i] || {};
    var key = String(source.id || source.key || String.fromCharCode(65 + i));
    var textJa = stripHtml(source.textJa || source.text || '');
    if (!textJa) return null;

    var textZh = verifiedZh(source.textZh, textJa);
    var explanationJa = stripHtml(source.explanationJa || '');
    var explanationZh = verifiedZh(source.explanationZh, explanationJa);
    options.push({
      id: key,
      key: key,
      textJa: textJa,
      textZh: textZh,
      hasTextZh: !!textZh,
      explanationJa: explanationJa,
      explanationZh: explanationZh,
      hasExplanationZh: !!explanationZh,
      isCorrect: key === answerId
    });
  }

  var correctOption = findOption(options, answerId);
  if (!correctOption) return null;

  var explanationJa = stripHtml(raw.explanationJa || '');
  var explanationZh = verifiedZh(raw.explanationZh, explanationJa);
  var mnemonicJa = stripHtml(raw.mnemonicJa || '');
  var mnemonicZh = verifiedZh(raw.mnemonicZh, mnemonicJa);

  return {
    id: String(raw.id),
    deckId: course + '/' + yearId,
    course: course,
    yearId: yearId,
    questionJa: questionJa,
    questionZh: questionZh,
    hasQuestionZh: !!questionZh,
    options: options,
    answerId: answerId,
    answer: answerId,
    explanationJa: explanationJa,
    explanationZh: explanationZh,
    hasExplanationZh: !!explanationZh,
    mnemonicJa: mnemonicJa,
    mnemonicZh: mnemonicZh,
    hasMnemonicZh: !!mnemonicZh,
    sourceRef: raw.sourceRef || raw.id
  };
}

function getRoute() {
  try {
    var pages = getCurrentPages();
    return pages.length ? '/' + pages[pages.length - 1].route : '';
  } catch (error) {
    return '';
  }
}

function getLocalDecks() {
  return deckManifest.getAllLocalDecks ? deckManifest.getAllLocalDecks() : [];
}

Page({
  data: {
    navSafeTop: 64,
    viewState: 'loading',
    isLoading: true,
    isEmpty: false,
    loadError: '',
    loadingMsg: '正在加载闪卡…',
    course: '',
    courseLabel: '',
    deckId: '',
    deckLabel: '',
    yearId: '',
    packageName: '',
    playerPath: '',
    sourceCountExpected: 0,
    sourceCountActual: 0,
    playableCountExpected: 0,
    playableCountActual: 0,
    knownLocalDeckIds: '',
    errorDetail: '',
    route: '',
    cards: [],
    currentIndex: 0,
    currentCard: null,
    totalCards: 0,
    hasAnswered: false,
    selectedKey: '',
    selectedOption: null,
    correctOption: null,
    isCorrect: false,
    showBack: false,
    isFinished: false,
    sessionCorrect: 0,
    sessionWrong: 0,
    wrongIds: [],
    progressPercent: 0,
    // R20.1: dark mode
    __themeDark: false,
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._loadOptions = options || {};
    this._applyTheme();
    this.loadDeck(this._loadOptions);
  },

  loadDeck: function (options) {
    options = options || {};
    var rawDeckId = options.deckId || '';
    var canonicalDeckId = normalizeDeckId(rawDeckId);
    var packageMeta = loader.meta || {};
    var localDecks = getLocalDecks();
    var knownLocalDeckIds = localDecks.map(function (deck) { return deck.deckId; }).join(', ');
    var fallbackPackageName = packageMeta.packageRoot || packageMeta.packageKey || 'local-package';
    var fallbackPlayerPath = packageMeta.packageRoot
      ? '/' + packageMeta.packageRoot + '/pages/flashcard-player/flashcard-player'
      : getRoute();

    this.setData({
      viewState: 'loading',
      isLoading: true,
      isEmpty: false,
      loadError: '',
      loadingMsg: '正在加载闪卡…',
      errorDetail: '',
      cards: [],
      currentCard: null,
      totalCards: 0,
      sourceCountActual: 0,
      playableCountActual: 0,
      selectedKey: '',
      selectedOption: null,
      correctOption: null,
      hasAnswered: false,
      isFinished: false,
      showBack: false,
      packageName: fallbackPackageName,
      playerPath: fallbackPlayerPath,
      knownLocalDeckIds: knownLocalDeckIds,
      route: getRoute()
    });

    if (!canonicalDeckId) {
      this.failLoad('缺少 deckId。请从牌组选择页重新进入。', {
        deckId: '',
        course: '',
        yearId: '',
        deckLabel: '',
        packageName: fallbackPackageName,
        playerPath: fallbackPlayerPath,
        sourceCountExpected: 0,
        sourceCountActual: 0,
        playableCountExpected: 0,
        playableCountActual: 0,
        knownLocalDeckIds: knownLocalDeckIds,
        route: getRoute(),
        stack: ''
      });
      return;
    }

    var deckInfo = deckManifest.getDeckInfo ? deckManifest.getDeckInfo(canonicalDeckId) : null;
    var parts = canonicalDeckId.split('/');
    var course = parts[0] || '';
    var yearId = parts.slice(1).join('/');
    if (!deckInfo || !course || !yearId) {
      this.failLoad('当前数据分包不拥有此牌组。', {
        deckId: canonicalDeckId,
        course: course,
        yearId: yearId,
        deckLabel: yearId,
        packageName: fallbackPackageName,
        playerPath: fallbackPlayerPath,
        sourceCountExpected: 0,
        sourceCountActual: 0,
        playableCountExpected: 0,
        playableCountActual: 0,
        knownLocalDeckIds: knownLocalDeckIds,
        route: getRoute(),
        stack: ''
      });
      return;
    }

    course = deckInfo.course || course;
    yearId = deckInfo.yearId || yearId;
    var sourceCountExpected = Number(deckInfo.sourceCountExpected || deckInfo.rawExpectedCount || 0);
    var playableCountExpected = Number(deckInfo.playableCountExpected || deckInfo.renderableExpectedCount || 0);
    var courseLabel = course === 'sg' ? 'SG 闪卡' : 'IT Passport 闪卡';
    var deckLabel = deckInfo.yearLabel || yearId;
    var packageName = deckInfo.packageName || fallbackPackageName;
    var playerPath = deckInfo.playerPath || fallbackPlayerPath;

    this.setData({
      course: course,
      courseLabel: courseLabel,
      deckId: canonicalDeckId,
      deckLabel: deckLabel,
      yearId: yearId,
      packageName: packageName,
      playerPath: playerPath,
      sourceCountExpected: sourceCountExpected,
      playableCountExpected: playableCountExpected,
      loadingMsg: '正在加载「' + deckLabel + '」' + courseLabel + '…'
    });

    var sourceCountActual = 0;
    var playableCountActual = 0;
    try {
      var sourceCards = loader.getQuestionsByYear(course, yearId);
      if (!Array.isArray(sourceCards)) {
        throw new Error('本地 loader 未返回题目数组。');
      }
      sourceCountActual = sourceCards.length;
      var cards = [];
      for (var i = 0; i < sourceCountActual; i++) {
        var card = normalizeCard(sourceCards[i], course, yearId);
        if (card) cards.push(card);
      }
      playableCountActual = cards.length;
      var diagnostic = {
        course: course,
        deckId: canonicalDeckId,
        yearId: yearId,
        packageName: packageName,
        playerPath: playerPath,
        expectedCount: playableCountExpected,
        actualCount: playableCountActual,
        sourceCountExpected: sourceCountExpected,
        sourceCountActual: sourceCountActual,
        playableCountExpected: playableCountExpected,
        playableCountActual: playableCountActual,
        knownLocalDeckIds: knownLocalDeckIds,
        route: getRoute(),
        deckLabel: deckLabel,
        stack: ''
      };

      if (sourceCountActual !== sourceCountExpected) {
        this.failLoad('原始题目数不符合牌组契约。', diagnostic);
        return;
      }
      if (playableCountActual !== playableCountExpected) {
        this.failLoad('可答闪卡数不符合牌组契约。', diagnostic);
        return;
      }
      if (playableCountActual === 0) {
        if (sourceCountExpected === 0 && playableCountExpected === 0 && sourceCountActual === 0) {
          this.setData({
            viewState: 'empty',
            isLoading: false,
            isEmpty: true,
            loadError: '',
            sourceCountActual: sourceCountActual,
            playableCountActual: playableCountActual
          });
        } else {
          this.failLoad('牌组应有可答闪卡，但规范化后为零。', diagnostic);
        }
        return;
      }

      this.setData({
        viewState: 'content',
        isLoading: false,
        isEmpty: false,
        loadError: '',
        cards: cards,
        currentIndex: 0,
        currentCard: cards[0],
        totalCards: playableCountActual,
        sourceCountActual: sourceCountActual,
        playableCountActual: playableCountActual,
        progressPercent: Math.round(100 / playableCountActual)
      });
      console.log('[flashcard-player] loaded', diagnostic);
    } catch (error) {
      this.failLoad(error && error.message ? error.message : '本地 loader 发生未知错误。', {
        course: course,
        deckId: canonicalDeckId,
        yearId: yearId,
        packageName: packageName,
        playerPath: playerPath,
        expectedCount: playableCountExpected,
        actualCount: playableCountActual,
        sourceCountExpected: sourceCountExpected,
        sourceCountActual: sourceCountActual,
        playableCountExpected: playableCountExpected,
        playableCountActual: playableCountActual,
        knownLocalDeckIds: knownLocalDeckIds,
        route: getRoute(),
        deckLabel: deckLabel,
        stack: error && error.stack ? error.stack : ''
      });
    }
  },

  failLoad: function (reason, diagnostic) {
    var detail = {
      course: diagnostic.course || '',
      deckId: diagnostic.deckId || '',
      packageName: diagnostic.packageName || '',
      playerPath: diagnostic.playerPath || '',
      expectedCount: Number(diagnostic.expectedCount || diagnostic.playableCountExpected || 0),
      actualCount: Number(diagnostic.actualCount || diagnostic.playableCountActual || 0),
      sourceCountExpected: Number(diagnostic.sourceCountExpected || 0),
      sourceCountActual: Number(diagnostic.sourceCountActual || 0),
      playableCountExpected: Number(diagnostic.playableCountExpected || 0),
      playableCountActual: Number(diagnostic.playableCountActual || 0),
      knownLocalDeckIds: diagnostic.knownLocalDeckIds || '',
      route: diagnostic.route || getRoute(),
      stack: diagnostic.stack || ''
    };
    console.error('[flashcard-player] load failed:', reason, detail);
    this.setData({
      viewState: 'error',
      isLoading: false,
      isEmpty: false,
      loadError: reason,
      errorDetail: reason,
      course: detail.course || this.data.course,
      courseLabel: detail.course === 'sg' ? 'SG 闪卡' : (detail.course ? 'IT Passport 闪卡' : this.data.courseLabel),
      yearId: diagnostic.yearId || this.data.yearId,
      deckId: detail.deckId || this.data.deckId,
      deckLabel: diagnostic.deckLabel || this.data.deckLabel || diagnostic.yearId || '',
      packageName: detail.packageName || this.data.packageName,
      playerPath: detail.playerPath || this.data.playerPath,
      sourceCountExpected: detail.sourceCountExpected,
      sourceCountActual: detail.sourceCountActual,
      playableCountExpected: detail.playableCountExpected,
      playableCountActual: detail.playableCountActual,
      knownLocalDeckIds: detail.knownLocalDeckIds,
      route: detail.route
    });
  },

  retryLoad: function () {
    this.loadDeck(this._loadOptions || {});
  },

  selectAnswer: function (event) {
    if (this.data.hasAnswered || !this.data.currentCard) return;
    var key = String(event.currentTarget.dataset.key || '');
    var selectedOption = findOption(this.data.currentCard.options, key);
    if (!selectedOption) return;
    var correctOption = findOption(this.data.currentCard.options, this.data.currentCard.answerId);
    var isCorrect = !!correctOption && selectedOption.key === correctOption.key;
    var wrongIds = this.data.wrongIds.slice();
    if (!isCorrect && wrongIds.indexOf(this.data.currentCard.id) < 0) wrongIds.push(this.data.currentCard.id);

    this.setData({
      hasAnswered: true,
      selectedKey: key,
      selectedOption: selectedOption,
      correctOption: correctOption,
      isCorrect: isCorrect,
      sessionCorrect: this.data.sessionCorrect + (isCorrect ? 1 : 0),
      sessionWrong: this.data.sessionWrong + (isCorrect ? 0 : 1),
      wrongIds: wrongIds
    });
  },

  showExplanation: function () {
    if (this.data.hasAnswered) this.setData({ showBack: true });
  },

  nextCard: function () {
    var nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= this.data.totalCards) {
      this.setData({ isFinished: true, showBack: false });
      return;
    }
    this.setData({
      currentIndex: nextIndex,
      currentCard: this.data.cards[nextIndex],
      hasAnswered: false,
      selectedKey: '',
      selectedOption: null,
      correctOption: null,
      isCorrect: false,
      showBack: false,
      progressPercent: Math.round((nextIndex + 1) * 100 / this.data.totalCards)
    });
  },

  restartDeck: function () {
    if (!this.data.cards.length) return;
    this.setData({
      viewState: 'content',
      currentIndex: 0,
      currentCard: this.data.cards[0],
      hasAnswered: false,
      selectedKey: '',
      selectedOption: null,
      correctOption: null,
      isCorrect: false,
      showBack: false,
      isFinished: false,
      sessionCorrect: 0,
      sessionWrong: 0,
      wrongIds: [],
      progressPercent: Math.round(100 / this.data.cards.length)
    });
  },

  retryWrongCards: function () {
    if (!this.data.wrongIds.length) return;
    var wrongCards = [];
    for (var i = 0; i < this.data.cards.length; i++) {
      if (this.data.wrongIds.indexOf(this.data.cards[i].id) >= 0) wrongCards.push(this.data.cards[i]);
    }
    if (!wrongCards.length) return;
    this.setData({
      viewState: 'content',
      cards: wrongCards,
      currentIndex: 0,
      currentCard: wrongCards[0],
      totalCards: wrongCards.length,
      hasAnswered: false,
      selectedKey: '',
      selectedOption: null,
      correctOption: null,
      isCorrect: false,
      showBack: false,
      isFinished: false,
      sessionCorrect: 0,
      sessionWrong: 0,
      wrongIds: [],
      progressPercent: Math.round(100 / wrongCards.length)
    });
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
    secondaryNav.back(this, 'packages/quiz-itpass-1/pages/flashcard-player/flashcard-player');
  }

});
