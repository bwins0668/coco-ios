var secondaryNav = require('../../../../utils/secondary-navigation');
var glossaryData = require("../../data/glossary_index");
var STORAGE_KEY = "study-tools-mini-anki-status-v1";
var SWIPE_THRESHOLD = 80;
var CATEGORY_LABELS_ZH = {
  all: "全部",
  algorithm: "算法",
  automation: "自动化",
  business: "业务",
  cloud: "云计算",
  database: "数据库",
  git: "Git",
  java: "Java",
  network: "网络",
  programming: "编程",
  project: "项目管理",
  python: "Python",
  security: "信息安全",
  system: "系统",
  testing: "测试",
  web: "Web",
  development: "开发",
  frontend: "前端",
  backend: "后端",
  data: "数据",
  ai: "AI",
  storage: "存储",
  design: "设计",
  architecture: "架构",
  operating_system: "操作系统",
  os: "操作系统",
  sql: "SQL",
  itpass: "IT Passport",
  sg: "SG"
};

function getCategoryLabel(category) {
  return CATEGORY_LABELS_ZH[category] || category || "";
}

function withCategoryLabel(item) {
  return Object.assign({}, item, {
    categoryLabel: getCategoryLabel(item.category)
  });
}

Page({
  onShow: function () {
    this._applyTheme();
    this._applyTheme();
  },
  data: {
    navSafeTop: 64,
    __themeDark: false,
    __themeDark: false,
    currentTerm: null, currentIndex: 0, totalCount: 0,
    isFlipped: false, isComplete: false,
    masteredCount: 0, progressPercent: 0, swipeStyle: "",
    categories: [], selectedCategory: "all", selectedCategoryLabel: "全部", showFilter: false,
    dataSource: "glossary", initialTotal: 0, summary: null,
    isLoading: true, errorMsg: ""
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    this._applyTheme();
    this._sessionStart = Date.now();
    this._firstPassCount = 0;
    this._totalLoops = 0;
    this._eliminatedCount = 0;
    var source = (options && options.source) || "glossary";
    var from = (options && options.from) || "";
    this.setData({ dataSource: source, from: from });
    this.initSession();
  },

  initSession: function (category) {
    this._firstPassCount = 0;
    this._totalLoops = 0;
    this._eliminatedCount = 0;
    var source = this.data.dataSource;
    var items = (source === "mistakes") ? this.loadMistakesData() : this.loadGlossaryData();
    if (!items || items.length === 0) {
      this.setData({ totalCount: 0, categories: [], initialTotal: 0, summary: null });
      return;
    }
    if (source === "glossary" && this.data.categories.length === 0) {
      var catMap = {}, cats = [];
      for (var i = 0; i < items.length; i++) {
        var c = items[i].category; if (c && !catMap[c]) { catMap[c] = true; cats.push(c); }
      }
      cats.sort();
      this.setData({
        categories: cats.map(function (key) {
          return { key: key, label: getCategoryLabel(key) };
        })
      });
    }
    category = category || this.data.selectedCategory || "all";
    var ankiStatus = {};
    try { ankiStatus = wx.getStorageSync(STORAGE_KEY) || {}; } catch (e) {}
    var queue = [];
    for (var i = 0; i < items.length; i++) {
      var t = items[i];
      if (category !== "all" && t.category !== category && source === "glossary") continue;
      var s = ankiStatus[t.id];
      if (!s || s.status !== "mastered") {
        queue.push(Object.assign(withCategoryLabel(t), { loopCount: 0 }));
      }
    }
    this.ankiStatus = ankiStatus;
    this.queue = queue;
    this.initialTotal = queue.length;
    this.setData({
      selectedCategory: category,
      selectedCategoryLabel: getCategoryLabel(category),
      totalCount: queue.length, currentIndex: 0, initialTotal: queue.length,
      isComplete: false, summary: null,
      masteredCount: this.countMastered(),
      progressPercent: 0
    });
    if (queue.length > 0) this.setData({ currentTerm: queue[0] });
    this.setData({ isLoading: false });
  },

  loadGlossaryData: function () { return glossaryData.glossaryIndex || []; },

  loadMistakesData: function () {
    var storage = require("../../../../utils/storage");
    var wrongQ = storage.getWrongQuestions() || [];
    var result = [];
    for (var i = 0; i < wrongQ.length; i++) {
      var wq = wrongQ[i];
      var q = wq && wq.questionSnapshot;
      if (!q) continue;
      var correctOpt = "";
      var options = Array.isArray(q.options) ? q.options : [];
      for (var k = 0; k < options.length; k++) {
        if (options[k].key === q.answer) { correctOpt = (options[k].textZh || options[k].textJa || ""); break; }
      }
      result.push({
        id: "mistake_" + wq.id, term: q.questionZh || q.questionJa || "未知题目", reading: "",
        zh: "正确答案: " + q.answer + ". " + (correctOpt || ""),
        ja: (q.explanationZh || q.explanationJa || ""),
        category: wq.exam || "unknown"
      });
    }
    return result;
  },

  buildSummary: function () {
    var elapsed = Date.now() - this._sessionStart;
    var mins = Math.floor(elapsed / 60000);
    var secs = Math.floor((elapsed % 60000) / 1000);
    var fp = this._firstPassCount || 0;
    var tl = this._totalLoops || 0;
    var total = this.initialTotal;
    return {
      totalCards: total,
      firstPass: fp,
      accuracy: total > 0 ? Math.round((fp / total) * 100) : 0,
      totalLoops: tl,
      eliminated: this._eliminatedCount || 0,
      elapsedStr: (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs
    };
  },

  restartSession: function () {
    this._sessionStart = Date.now();
    this.setData({ summary: null });
    this.initSession();
  },

  countMastered: function () {
    var c = 0; if (!this.ankiStatus) return 0;
    for (var k in this.ankiStatus) { if (this.ankiStatus[k].status === "mastered") c++; }
    return c;
  },

  persistStatus: function (id, status) {
    if (!this.ankiStatus) this.ankiStatus = {};
    var now = Date.now();
    var e = this.ankiStatus[id] || { reviewCount: 0, status: "new", lastReview: 0 };
    e.status = status; e.reviewCount = (e.reviewCount || 0) + 1; e.lastReview = now;
    this.ankiStatus[id] = e;
    try { wx.setStorageSync(STORAGE_KEY, this.ankiStatus); } catch (e) {}
  },

  toggleFlip: function () { this.setData({ isFlipped: !this.data.isFlipped }); },
  toggleFilter: function () { this.setData({ showFilter: !this.data.showFilter }); },
  selectCategory: function (e) {
    var cat = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: cat, currentIndex: 0, isFlipped: false, showFilter: false });
    this.initSession(cat);
  },

  nextCard: function () {
    var n = this.data.currentIndex + 1;
    if (n >= this.queue.length) {
      var summary = this.buildSummary();
      this.setData({ isComplete: true, summary: summary, totalCount: 0 });
      return;
    }
    this.setData({
      currentIndex: n, currentTerm: this.queue[n],
      isFlipped: false,
      progressPercent: Math.min(100, Math.round((n / Math.max(this.initialTotal, 1)) * 100)),
      swipeStyle: ""
    });
  },

  markForgot: function () {
    var t = this.data.currentTerm; if (!t) return;
    this._totalLoops++;
    this.persistStatus(t.id, "review");
    var insertPos = Math.min(this.data.currentIndex + 4, this.queue.length);
    t.loopCount = (t.loopCount || 0) + 1;
    this.queue.splice(insertPos, 0, t);
    this.setData({
      swipeStyle: "transform:translateX(-120rpx);opacity:0;transition:all 0.25s",
      totalCount: this.queue.length
    });
    setTimeout(this.nextCard.bind(this), 280);
  },

  markMastered: function () {
    var t = this.data.currentTerm; if (!t) return;
    if (t.loopCount === 0) this._firstPassCount++;
    this.persistStatus(t.id, "mastered");
    if (this.data.dataSource === "mistakes") {
      var storage = require("../../../../utils/storage");
      storage.removeWrongQuestion(t.id.replace("mistake_", ""));
      this._eliminatedCount++;
    }
    this.setData({
      swipeStyle: "transform:translateX(120rpx);opacity:0;transition:all 0.25s",
      masteredCount: this.countMastered()
    });
    setTimeout(this.nextCard.bind(this), 280);
  },

  onTouchStart: function (e) {
    this._tx = e.touches[0].clientX; this._ty = e.touches[0].clientY; this._sw = true;
  },
  onTouchMove: function (e) {
    if (!this._sw) return;
    var dx = e.touches[0].clientX - this._tx;
    if (Math.abs(dx) > 20) {
      this.setData({ swipeStyle: "transform:translateX(" + dx + "px);opacity:" + Math.max(0, 1 - Math.abs(dx) / 400) });
    }
  },
  onTouchEnd: function (e) {
    this._sw = false; if (this._tx === undefined) return;
    var dx = e.changedTouches[0].clientX - this._tx;
    if (dx > SWIPE_THRESHOLD) { this.markMastered(); }
    else if (dx < -SWIPE_THRESHOLD) { this.markForgot(); }
    else { this.setData({ swipeStyle: "transform:translateX(0);opacity:1" }); }
    this._tx = undefined; this._ty = undefined;
  },

  loadAllTerms: function () { this.initSession(); },


  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },
  goBack: function () {
    secondaryNav.back(this, 'packages/glossary/pages/anki-player/anki-player');
  }

});
