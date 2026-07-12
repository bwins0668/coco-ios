var secondaryNav = require('../../../../utils/secondary-navigation');
// packages/glossary/pages/favorite-review/favorite-review.js
// 收藏术语复习模式 - v0.15.0 增强
var glossaryIndex = require('../../data/glossary_index').glossaryIndex;
var glossaryLoader = require('../../data/glossary_loader');
var storage = require("../../../../utils/storage");

function extractFavoriteId(item) {
  if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }
  if (item && typeof item === 'object' && item.id !== undefined && item.id !== null && item.id !== '') {
    return item.id;
  }
  return '';
}

function getExampleText(term) {
  if (!term || typeof term !== 'object') {
    return '';
  }
  if (typeof term.example === 'string' && term.example.trim()) {
    return term.example;
  }
  if (!Array.isArray(term.examples)) {
    return '';
  }
  var safeExamples = [];
  for (var i = 0; i < term.examples.length; i++) {
    if (typeof term.examples[i] === 'string' && term.examples[i].trim()) {
      safeExamples.push(term.examples[i]);
    }
  }
  return safeExamples.join('\n');
}

function formatSavedAt(timestamp) {
  if (!timestamp) return '已收藏';
  var d = new Date(timestamp);
  if (isNaN(d.getTime())) return '已收藏';
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  var h = d.getHours();
  var min = d.getMinutes();
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) +
    ' ' + (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min);
}

function matchTerm(item, keyword) {
  if (!keyword) return true;
  var lower = keyword.toLowerCase();
  if (item.term && item.term.toLowerCase().indexOf(lower) !== -1) return true;
  if (item.zh && item.zh.indexOf(keyword) !== -1) return true;
  if (item.ja && item.ja.indexOf(keyword) !== -1) return true;
  if (item.category && item.category.indexOf(keyword) !== -1) return true;
  if (item.explanationZh && item.explanationZh.indexOf(keyword) !== -1) return true;
  if (item.explanationJa && item.explanationJa.indexOf(keyword) !== -1) return true;
  return false;
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
    // 收藏列表
    favorites: [],
    // 当前复习索引
    currentIndex: 0,
    currentTerm: null,
    detail: null,
    exampleText: '',
    showExplanation: false,
    hasFavorites: false,
    totalCount: 0,
    isFirstItem: true,
    isLastItem: false,
    nextBtnText: '下一个',
    // v0.15.0 新增
    mode: 'list',
    searchKeyword: '',
    filteredFavorites: [],
    searchEmpty: false,
    currentSavedAt: '',
    // v0.21.0 新增
    lastSavedAtFormatted: '',
    reviewCompletionHint: ''
  },

  onShow: function () {
    this._applyTheme();
    this._applyTheme();
    this.loadFavorites();
  },

  loadFavorites: function () {
    var favoriteItems = storage.getFavoriteTerms();
    var allGlossary = glossaryIndex;
    var matched = [];
    var glossaryById = {};
    var seenIds = {};

    if (!Array.isArray(favoriteItems)) {
      favoriteItems = [];
    }
    if (!Array.isArray(allGlossary)) {
      allGlossary = [];
    }

    // 构建 savedAt 映射
    var savedAtMap = {};
    for (var fi = 0; fi < favoriteItems.length; fi++) {
      var favItem = favoriteItems[fi];
      var favId = extractFavoriteId(favItem);
      if (favId && favItem && typeof favItem.savedAt === 'number') {
        savedAtMap[favId] = favItem.savedAt;
      }
    }

    for (var g = 0; g < allGlossary.length; g++) {
      if (allGlossary[g] && allGlossary[g].id) {
        glossaryById[allGlossary[g].id] = allGlossary[g];
      }
    }

    for (var i = 0; i < favoriteItems.length; i++) {
      var favId = extractFavoriteId(favoriteItems[i]);
      if (!favId || !glossaryById[favId] || seenIds[favId]) {
        continue;
      }
      var term = glossaryById[favId];
      var rawSavedAt = savedAtMap[favId] || null;
      term._savedAt = rawSavedAt;
      term._savedAtFormatted = rawSavedAt ? formatSavedAt(rawSavedAt) : '';
      matched.push(term);
      seenIds[favId] = true;
    }

    // 应用搜索
    var searchKw = this.data.searchKeyword;
    var filtered = searchKw ? matched.filter(function (t) { return matchTerm(t, searchKw); }) : matched;

    // 计算最近收藏时间
    var lastSavedAt = 0;
    for (var li = 0; li < favoriteItems.length; li++) {
      var litem = favoriteItems[li];
      if (litem && typeof litem.savedAt === 'number' && litem.savedAt > lastSavedAt) {
        lastSavedAt = litem.savedAt;
      }
    }
    var lastSavedAtFormatted = lastSavedAt > 0 ? formatSavedAt(lastSavedAt) : '';

    if (matched.length > 0) {
      this.setData({
        favorites: matched,
        filteredFavorites: filtered,
        searchEmpty: searchKw && filtered.length === 0,
        currentIndex: 0,
        currentTerm: matched[0],
        detail: null,
        exampleText: '',
        showExplanation: false,
        hasFavorites: true,
        totalCount: matched.length,
        isFirstItem: true,
        isLastItem: matched.length <= 1,
        nextBtnText: matched.length <= 1 ? '已到最后' : '下一个',
        currentSavedAt: formatSavedAt(matched[0]._savedAt),
        lastSavedAtFormatted: lastSavedAtFormatted
      });
    } else {
      this.setData({
        favorites: [],
        filteredFavorites: [],
        searchEmpty: false,
        currentIndex: 0,
        currentTerm: null,
        detail: null,
        exampleText: '',
        showExplanation: false,
        hasFavorites: false,
        totalCount: 0,
        isFirstItem: true,
        isLastItem: false,
        nextBtnText: '下一个',
        currentSavedAt: '',
        lastSavedAtFormatted: ''
      });
    }
  },

  // 搜索
  onSearchInput: function (e) {
    var keyword = e.detail.value.trim();
    var allFavorites = this.data.favorites;
    var filtered = keyword ? allFavorites.filter(function (t) { return matchTerm(t, keyword); }) : allFavorites;
    this.setData({
      searchKeyword: keyword,
      filteredFavorites: filtered,
      searchEmpty: keyword && filtered.length === 0
    });
  },

  clearSearch: function () {
    this.setData({
      searchKeyword: '',
      filteredFavorites: this.data.favorites,
      searchEmpty: false
    });
  },

  // 模式切换
  switchToListMode: function () {
    this.setData({ mode: 'list' });
  },

  switchToReviewMode: function () {
    this.setData({ mode: 'review' });
  },

  // 列表模式: 点击跳详情
  goDetailFromList: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: '/packages/glossary/pages/term-detail/term-detail?id=' + id
      });
    }
  },

  // 列表模式: 取消收藏
  unfavoriteFromList: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏该术语吗？',
      success: function (res) {
        if (res.confirm) {
          storage.removeFavoriteTerm(id);
          wx.showToast({ title: '已取消收藏', icon: 'success' });
          that.loadFavorites();
        }
      }
    });
  },

  // 复习模式: 取消收藏当前
  unfavoriteCurrent: function () {
    var that = this;
    var term = this.data.currentTerm;
    if (!term || !term.id) return;
    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏「' + (term.term || term.id) + '」吗？',
      success: function (res) {
        if (res.confirm) {
          storage.removeFavoriteTerm(term.id);
          wx.showToast({ title: '已取消收藏', icon: 'success' });
          that.loadFavorites();
        }
      }
    });
  },

  // 复习模式: 浏览
  revealExplanation: function () {
    var current = this.data.currentTerm;
    var detail = current ? glossaryLoader.getTermById(current.id) : null;
    if (!detail) {
      wx.showToast({
        title: '术语详情不存在',
        icon: 'none'
      });
      return;
    }
    var isLast = this.data.isLastItem;
    var completionHint = '';
    if (isLast) {
      completionHint = '🎉 复习完成！已看完所有收藏术语的解释。';
    }
    this.setData({
      detail: detail,
      exampleText: getExampleText(detail),
      showExplanation: true,
      reviewCompletionHint: completionHint
    });
  },

  updateCurrentTerm: function (newIdx) {
    var favorites = this.data.favorites || [];
    if (newIdx < 0 || newIdx >= favorites.length) {
      return;
    }
    var isLast = newIdx >= favorites.length - 1;
    this.setData({
      currentIndex: newIdx,
      currentTerm: favorites[newIdx],
      currentSavedAt: formatSavedAt(favorites[newIdx]._savedAt),
      detail: null,
      exampleText: '',
      showExplanation: false,
      isFirstItem: newIdx === 0,
      isLastItem: isLast,
      nextBtnText: isLast ? '已到最后' : '下一个',
      reviewCompletionHint: ''
    });
  },

  prevTerm: function () {
    var idx = this.data.currentIndex;
    if (idx <= 0) {
      return;
    }
    this.updateCurrentTerm(idx - 1);
  },

  nextTerm: function () {
    var idx = this.data.currentIndex;
    if (idx >= this.data.favorites.length - 1) {
      return;
    }
    this.updateCurrentTerm(idx + 1);
  },

  goDetail: function () {
    var termId = this.data.currentTerm ? this.data.currentTerm.id : '';
    if (termId) {
      wx.navigateTo({
        url: '/packages/glossary/pages/term-detail/term-detail?id=' + termId
      });
    }
  },

  goSearch: function () {
    wx.navigateTo({
      url: '/packages/glossary/pages/term-search/term-search'
    });
  },

  // 去术语表（tab页）
  goToGlossary: function () {
    wx.switchTab({
      url: '/pages/glossary/glossary'
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
    secondaryNav.back(this, 'packages/glossary/pages/favorite-review/favorite-review');
  }

});
