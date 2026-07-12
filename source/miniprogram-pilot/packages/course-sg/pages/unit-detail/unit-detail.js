var secondaryNav = require('../../../../utils/secondary-navigation');
var loader = require('../../data/loader');
var termResolver = require('../../data/term-resolver');

Page({
  data: {
    navSafeTop: 64,
    courseId: '',
    unitId: '',
    unit: null,
    sourceText: '',
    sourceInfo: null,
    practiceAvailable: false,
    displayTerms: [],
    selectedTerm: null,
    termSheetVisible: false,
    notFound: false,
    loadError: false,
    hasLearningExperience: false,
    learningExperience: null,
    showOriginal: false,
    __themeDark: false
  },

  onLoad: function (options) {
    secondaryNav.syncNavLayout(this);
    this._applyTheme();
    var courseId = (options && options.courseId) || '';
    var unitId = (options && options.unitId) || '';
    var unit = loader.getUnitById(courseId, unitId);
    if (!unit) {
      this.setData({
        courseId: courseId,
        unitId: unitId,
        notFound: true,
        loadError: true,
        hasLearningExperience: false,
        learningExperience: null,
        showOriginal: false
      });
      return;
    }

    var resolved = termResolver.resolveDisplayTerms(unit);
    var le = unit.learningExperience || null;
    var hasLE = !!(le && typeof le === 'object' && (
      le.coreConcept ||
      le.whyImportant ||
      (le.prerequisiteConcepts && le.prerequisiteConcepts.length) ||
      (le.caseBreakdown && le.caseBreakdown.length) ||
      le.examPattern ||
      (le.examCues && le.examCues.length) ||
      (le.mistakeComparisons && le.mistakeComparisons.length) ||
      (le.memoryTips && le.memoryTips.length) ||
      le.quizMapping
    ));

    this.setData({
      courseId: courseId,
      unitId: unitId,
      unit: unit,
      sourceText: loader.formatPrimarySource(unit),
      sourceInfo: this._buildSourceInfo(unit),
      practiceAvailable: !!(unit.topicId && unit.relatedQuestionIds && unit.relatedQuestionIds.length),
      displayTerms: resolved.terms || [],
      hasLearningExperience: hasLE,
      learningExperience: hasLE ? le : null,
      // Golden reading rhythm: LE first; Japanese original collapsed by default when LE exists
      showOriginal: !hasLE,
      notFound: false,
      loadError: false
    });
  },

  onShow: function () {
    this._applyTheme();
  },

  toggleOriginal: function () {
    this.setData({ showOriginal: !this.data.showOriginal });
  },

  startPractice: function () {
    var unit = this.data.unit;
    if (!unit || !unit.topicId || !unit.relatedQuestionIds || !unit.relatedQuestionIds.length) {
      wx.showToast({ title: '本节暂无可用主题练习', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/packages/quiz/pages/quiz/quiz?exam=' + unit.exam + '&sourceType=lesson_quiz&topicId=' + unit.topicId,
      fail: function () {
        wx.showToast({ title: '练习暂时无法打开', icon: 'none' });
      }
    });
  },

  openTermDetail: function (event) {
    var termId = event && event.currentTarget && event.currentTarget.dataset
      ? event.currentTarget.dataset.termId
      : '';
    for (var i = 0; i < this.data.displayTerms.length; i++) {
      if (this.data.displayTerms[i].id === termId) {
        this.setData({
          selectedTerm: this.data.displayTerms[i],
          termSheetVisible: true
        });
        return;
      }
    }
  },

  closeTermDetail: function () {
    this.setData({ selectedTerm: null, termSheetVisible: false });
  },

  noop: function () {},

  _applyTheme: function () {
    var app = getApp();
    var themeDark = !!(app && app.globalData && app.globalData.themeDark);
    if (this.data.__themeDark !== themeDark) {
      this.setData({ __themeDark: themeDark });
    }
  },

  _buildSourceInfo: function (unit) {
    var refs = (unit && unit.sourceRefs) || [];
    var ref = refs[0] || null;
    if (!ref) {
      return {
        sourceText: '',
        headingJa: '',
        anchorTermsText: '',
        pageLabel: '',
        accessLabel: '原书定位已验证 / 原书阅读尚未绑定'
      };
    }
    var pageLabel = ref.pdfPageEnd > ref.pdfPageStart
      ? ('PDF 第 ' + ref.pdfPageStart + ' - ' + ref.pdfPageEnd + ' 页')
      : ('PDF 第 ' + ref.pdfPageStart + ' 页');
    return {
      sourceText: loader.formatPrimarySource(unit),
      headingJa: ref.headingJa || '',
      anchorTermsText: (ref.anchorTermsJa || []).join(' / '),
      pageLabel: pageLabel,
      accessLabel: unit && unit.sourceAccess
        ? unit.sourceAccess.displayLabel
        : '原书定位已验证 / 原书阅读尚未绑定'
    };
  },

  goBack: function () {
    secondaryNav.back(this, 'packages/course-sg/pages/unit-detail/unit-detail');
  }
});
