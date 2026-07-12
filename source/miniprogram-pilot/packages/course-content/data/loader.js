var manifest = require('./manifest');

function getChapterModule(chapterId) {
  return manifest.chapters.filter(function (chapter) { return chapter.id === chapterId; })[0] || null;
}

function getUnitById(courseId, unitId) {
  var summary = manifest.getUnitSummary(courseId, unitId);
  if (!summary) return null;
  var chapterModule = getChapterModule(summary.chapterId);
  if (!chapterModule) return null;
  var unit = {};
  for (var key in summary) unit[key] = summary[key];
  unit.exam = courseId;
  unit.sourceRefs = [{
    sourceId: chapterModule.sourceId,
    pdfPageStart: summary.pdfPageStart || 0,
    pdfPageEnd: summary.pdfPageEnd || summary.pdfPageStart || 0,
    headingJa: summary.titleJa || '',
    anchorTermsJa: []
  }];
  unit.learningExperience = null;
  unit.learningGoalJa = summary.titleJa || '';
  unit.learningGoalZh = summary.titleZh || '';
  unit.overviewJa = '';
  unit.overviewZh = '';
  unit.sections = [];
  unit.keyTerms = [];
  unit.commonTraps = [];
  unit.relatedQuestionIds = [];
  return unit;
}

function formatPrimarySource(unit) {
  if (!unit || !unit.sourceRefs || !unit.sourceRefs.length) return '';
  var ref = unit.sourceRefs[0];
  var source = manifest.getSourceById(ref.sourceId);
  var title = source ? source.displayTitleJa : ref.sourceId;
  var range = ref.pdfPageEnd > ref.pdfPageStart ? ('PDF 第 ' + ref.pdfPageStart + ' - ' + ref.pdfPageEnd + ' 页') : ('PDF 第 ' + ref.pdfPageStart + ' 页');
  return '原书定位：' + title + ' · ' + range + ' / 纸质页未验证';
}

module.exports = {
  getChapterModule: getChapterModule,
  getUnitById: getUnitById,
  formatPrimarySource: formatPrimarySource
};
