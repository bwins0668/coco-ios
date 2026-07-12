var secondaryNav = require('../../../../utils/secondary-navigation');
// pages/glossary/glossary.js
var glossaryIndex = require('../../data/glossary_index').glossaryIndex;
const {
  getFavoriteTerms
} = require("../../../../utils/storage");

var MAX_DEFAULT = 30;
var MAX_SEARCH = 50;
var SEARCH_DEBOUNCE_MS = 300;

Page({
  data: {
    navSafeTop: 64,
    __themeDark: false,
    __themeDark: false,
    keyword: '',
    allData: [],
    filteredList: [],
    favoriteSet: {},
    totalCount: 0,
    showCount: 0,
    resultHint: '',
    categories: [],
    selectedCategory: '',
    searchHistory: [],
    // R3.40 批量操作
    batchMode: false,
    selectedTerms: {},
    selectedCount: 0
  },

  // R3.41 搜索防抖定时器
  _searchTimer: null,

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    this._applyTheme();
    // R3.54 随机术语：如果传入 random=1，随机选一个术语并跳转详情
    if (options && options.random === '1') {
      var data = glossaryIndex;
      if (data && data.length > 0) {
        var randomIndex = Math.floor(Math.random() * data.length);
        var randomTermId = data[randomIndex].id;
        wx.redirectTo({
          url: '/packages/glossary/pages/term-detail/term-detail?id=' + randomTermId
        });
        return;
      }
    }

    var data = glossaryIndex;
    // R3.37 提取所有分类
    var categorySet = {};
    var categories = [];
    for (var i = 0; i < data.length; i++) {
      var cat = data[i].category;
      if (cat && !categorySet[cat]) {
        categorySet[cat] = true;
        categories.push(cat);
      }
    }
    // R3.38 读取搜索历史
    var history = [];
    try {
      history = wx.getStorageSync('term-search-history') || [];
    } catch (e) {
      history = [];
    }
    this.setData({
      allData: data,
      filteredList: data.slice(0, MAX_DEFAULT),
      totalCount: data.length,
      showCount: Math.min(data.length, MAX_DEFAULT),
      resultHint: '当前显示 ' + Math.min(data.length, MAX_DEFAULT) + ' 条 / 共 ' + data.length + ' 条',
      categories: categories,
      searchHistory: history
    });
  },

  onShow: function () {
    this._applyTheme();
    this._applyTheme();
    this.refreshFavoriteStatus();
  },

  refreshFavoriteStatus: function () {
    var favSet = {};
    var favList = getFavoriteTerms();
    for (var i = 0; i < favList.length; i++) {
      favSet[favList[i].id] = true;
    }
    var data = this.data.allData;
    var marked = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      marked.push({
        id: item.id,
        term: item.term,
        zh: item.zh,
        ja: item.ja,
        category: item.category,
        level: item.level,
        _isFavorite: !!favSet[String(item.id)]
      });
    }
    var keyword = this.data.keyword;
    var filtered;
    if (keyword) {
      filtered = this.filterData(keyword, marked);
    } else {
      filtered = marked.slice(0, MAX_DEFAULT);
    }
    var showCount = filtered.length;
    var matchCount = keyword ? this.filterData(keyword, marked, true).length : marked.length;
    this.setData({
      allData: marked,
      favoriteSet: favSet,
      filteredList: filtered,
      totalCount: matchCount,
      showCount: showCount,
      resultHint: keyword
        ? '当前显示 ' + showCount + ' 条 / 共 ' + matchCount + ' 条匹配'
        : '当前显示 ' + showCount + ' 条 / 共 ' + marked.length + ' 条'
    });
  },

  onSearchInput: function (e) {
    var keyword = e.detail.value.trim();
    this.setData({ keyword: keyword });
    // R3.41 搜索防抖：延迟 300ms 执行搜索
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
    }
    var self = this;
    this._searchTimer = setTimeout(function () {
      self._doSearch(keyword);
    }, SEARCH_DEBOUNCE_MS);
  },

  // R3.41 实际执行搜索（防抖后调用）
  _doSearch: function (keyword) {
    var favSet = this.data.favoriteSet;
    var filtered;
    try {
      if (keyword) {
        var all = this.filterData(keyword, this.data.allData, true);
        var sliced = all.slice(0, MAX_SEARCH);
        // Apply favorite status
        for (var i = 0; i < sliced.length; i++) {
          sliced[i] = {
            id: sliced[i].id, term: sliced[i].term, zh: sliced[i].zh, ja: sliced[i].ja,
            category: sliced[i].category, level: sliced[i].level,
            _isFavorite: !!favSet[String(sliced[i].id)]
          };
        }
        filtered = sliced;
        this.setData({
          filteredList: filtered,
          totalCount: all.length,
          showCount: filtered.length,
          resultHint: '当前显示 ' + filtered.length + ' 条 / 共 ' + all.length + ' 条匹配'
        });
      } else {
        var raw = this.data.allData.slice(0, MAX_DEFAULT);
        var marked = [];
        for (var i = 0; i < raw.length; i++) {
          marked.push({
            id: raw[i].id,
            term: raw[i].term,
            zh: raw[i].zh,
            ja: raw[i].ja,
            category: raw[i].category,
            level: raw[i].level,
            _isFavorite: !!favSet[String(raw[i].id)]
          });
        }
        filtered = marked;
        this.setData({
          filteredList: filtered,
          totalCount: this.data.allData.length,
          showCount: filtered.length,
          resultHint: '当前显示 ' + filtered.length + ' 条 / 共 ' + this.data.allData.length + ' 条'
        });
      }
    } catch (err) {
      console.error('[Search Error]', err);
      // 异常兜底：显示空结果
      this.setData({
        filteredList: [],
        totalCount: 0,
        showCount: 0,
        resultHint: '搜索出现异常，请重试'
      });
    }
  },

  // R3.38 搜索确认时保存历史
  onSearchConfirm: function () {
    var keyword = this._pendingKeyword || this.data.keyword;
    if (!keyword || keyword.length < 2) return;
    var history = this.data.searchHistory.slice();
    // 移除重复项
    history = history.filter(function (item) {
      return item !== keyword;
    });
    // 添加到开头
    history.unshift(keyword);
    // 最多保存 10 条
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    try {
      wx.setStorageSync('term-search-history', history);
    } catch (e) {
      // ignore
    }
    this.setData({ searchHistory: history });
  },

  // R3.38 点击历史标签
  onHistoryTap: function (e) {
    var keyword = e.currentTarget.dataset.keyword;
    if (!keyword) return;
    this.setData({ keyword: keyword });
    this.onSearchInput({ detail: { value: keyword } });
  },

  // R3.38 清除搜索历史
  clearHistory: function () {
    try {
      wx.removeStorageSync('term-search-history');
    } catch (e) {
      // ignore
    }
    this.setData({ searchHistory: [] });
  },

  clearSearch: function () {
    var favSet = this.data.favoriteSet;
    var raw = this.data.allData.slice(0, MAX_DEFAULT);
    var filtered = [];
    for (var i = 0; i < raw.length; i++) {
      filtered.push({
        id: raw[i].id, term: raw[i].term, zh: raw[i].zh, ja: raw[i].ja,
        category: raw[i].category, level: raw[i].level,
        _isFavorite: !!favSet[String(raw[i].id)]
      });
    }
    this.setData({
      keyword: '',
      filteredList: filtered,
      totalCount: this.data.allData.length,
      showCount: filtered.length,
      resultHint: '当前显示 ' + filtered.length + ' 条 / 共 ' + this.data.allData.length + ' 条'
    });
  },

  filterData: function (keyword, source, returnAll) {
    var data = source || this.data.allData;
    if (!keyword) {
      return returnAll ? data : data.slice(0, MAX_DEFAULT);
    }
    var lower = keyword.toLowerCase();
    var results = data.filter(function (item) {
      if (item.term.toLowerCase().indexOf(lower) !== -1) return true;
      if (item.zh.indexOf(keyword) !== -1) return true;
      if (item.ja.indexOf(keyword) !== -1) return true;
      if (item.category.indexOf(keyword) !== -1) return true;
      if (Array.isArray(item.aliases)) {
        for (var i = 0; i < item.aliases.length; i++) {
          if (String(item.aliases[i]).toLowerCase().indexOf(lower) !== -1) return true;
        }
      }
      return false;
    });
    return returnAll ? results : results.slice(0, MAX_SEARCH);
  },

  goToDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packages/glossary/pages/term-detail/term-detail?id=' + id
    });
  },

  // R3.37 分类筛选
  onCategoryTap: function (e) {
    var category = e.currentTarget.dataset.category;
    var selected = this.data.selectedCategory === category ? '' : category;
    var keyword = this.data.keyword;
    var allData = this.data.allData;
    var favSet = this.data.favoriteSet;

    // 应用筛选：分类 + 关键词
    var filtered = allData;
    if (selected) {
      filtered = filtered.filter(function (item) {
        return item.category === selected;
      });
    }
    if (keyword) {
      var lower = keyword.toLowerCase();
      filtered = filtered.filter(function (item) {
        if (item.term.toLowerCase().indexOf(lower) !== -1) return true;
        if (item.zh.indexOf(keyword) !== -1) return true;
        if (item.ja.indexOf(keyword) !== -1) return true;
        if (item.category.indexOf(keyword) !== -1) return true;
        if (Array.isArray(item.aliases)) {
          for (var i = 0; i < item.aliases.length; i++) {
            if (String(item.aliases[i]).toLowerCase().indexOf(lower) !== -1) return true;
          }
        }
        return false;
      });
    }

    // 应用收藏状态
    var result = [];
    for (var i = 0; i < filtered.length; i++) {
      result.push({
        id: filtered[i].id,
        term: filtered[i].term,
        zh: filtered[i].zh,
        ja: filtered[i].ja,
        category: filtered[i].category,
        level: filtered[i].level,
        _isFavorite: !!favSet[String(filtered[i].id)]
      });
    }

    var showCount = result.length;
    var totalCount = selected
      ? allData.filter(function (item) { return item.category === selected; }).length
      : allData.length;

    this.setData({
      selectedCategory: selected,
      filteredList: result.slice(0, MAX_SEARCH),
      totalCount: totalCount,
      showCount: showCount,
      resultHint: keyword
        ? '当前显示 ' + showCount + ' 条 / 共 ' + filtered.length + ' 条匹配'
        : '分类「' + selected + '」共 ' + totalCount + ' 条'
    });
  },

  // R3.40 批量操作
  toggleBatchMode: function () {
    var batchMode = !this.data.batchMode;
    this.setData({
      batchMode: batchMode,
      selectedTerms: {},
      selectedCount: 0
    });
  },

  onTermCheckboxTap: function (e) {
    var id = String(e.currentTarget.dataset.id);
    var selected = this.data.selectedTerms;
    var copy = {};
    var keys = Object.keys(selected);
    for (var i = 0; i < keys.length; i++) {
      copy[keys[i]] = true;
    }
    if (copy[id]) {
      delete copy[id];
    } else {
      copy[id] = true;
    }
    this.setData({
      selectedTerms: copy,
      selectedCount: Object.keys(copy).length
    });
  },

  selectAll: function () {
    var list = this.data.filteredList;
    var selected = {};
    for (var i = 0; i < list.length; i++) {
      selected[String(list[i].id)] = true;
    }
    this.setData({
      selectedTerms: selected,
      selectedCount: Object.keys(selected).length
    });
  },

  deselectAll: function () {
    this.setData({
      selectedTerms: {},
      selectedCount: 0
    });
  },

  // R3.41 批量操作 - 添加存储保护
  batchAddToFavorites: function () {
    var selected = this.data.selectedTerms;
    var keys = Object.keys(selected);
    if (keys.length === 0) {
      wx.showToast({ title: '请先选择术语', icon: 'none' });
      return;
    }
    // R3.41 边界保护：限制单次批量操作数量
    if (keys.length > 50) {
      wx.showToast({ title: '单次最多批量收藏 50 个术语', icon: 'none' });
      return;
    }
    var allData = this.data.allData;
    var added = 0;
    var favSet = this.data.favoriteSet;
    try {
      var favList = getFavoriteTerms();
      for (var i = 0; i < keys.length; i++) {
        var id = keys[i];
        if (favSet[id]) continue;
        var found = null;
        for (var j = 0; j < allData.length; j++) {
          if (String(allData[j].id) === id) {
            found = allData[j];
            break;
          }
        }
        if (!found) continue;
        favList.push({
          id: found.id,
          term: found.term,
          zh: found.zh,
          ja: found.ja,
          category: found.category,
          level: found.level
        });
        favSet[id] = true;
        added++;
      }
      // R3.41 存储异常兜底
      try {
        wx.setStorageSync('study-tools-mini-favorite-terms-v1', JSON.stringify(favList));
      } catch (e) {
        wx.showToast({ title: '存储失败，请检查存储空间', icon: 'none' });
        return;
      }
      this.setData({
        favoriteSet: favSet,
        selectedTerms: {},
        selectedCount: 0
      });
      this.refreshFavoriteStatus();
      wx.showToast({
        title: '已添加 ' + added + ' 个术语到收藏',
        icon: 'none',
        duration: 2000
      });
    } catch (err) {
      console.error('[Batch Favorite Error]', err);
      wx.showToast({ title: '批量收藏失败，请重试', icon: 'none' });
    }
  },

  // R3.59 清空搜索历史
  clearSearchHistory: function () {
    var that = this;
    wx.showModal({
      title: '清空搜索历史',
      content: '确定要清空所有搜索历史吗？',
      confirmText: '清空',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          try {
            wx.removeStorageSync('term-search-history');
            that.setData({
              searchHistory: []
            });
            wx.showToast({
              title: '搜索历史已清空',
              icon: 'none',
              duration: 1500
            });
          } catch (e) {
            wx.showToast({
              title: '清空失败',
              icon: 'none',
              duration: 1500
            });
          }
        }
      }
    });
  },

  // R3.59 clearHistory 别名（兼容 WXML 中的 bindtap="clearHistory"）
  clearHistory: function () {
    this.clearSearchHistory();
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
    secondaryNav.back(this, 'packages/glossary/pages/term-search/term-search');
  }

});
