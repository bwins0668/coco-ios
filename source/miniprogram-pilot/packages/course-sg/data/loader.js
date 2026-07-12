var manifest = require('./manifest');

// SG loader: only SG chapters, paths at data root (no sg/ subdir)
function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'sg-ch01': return require('./chapter-01.js');
    case 'sg-ch02': return require('./chapter-02.js');
    case 'sg-ch03': return require('./chapter-03.js');
    case 'sg-ch04': return require('./chapter-04.js');
    case 'sg-ch05': return require('./chapter-05.js');
    case 'sg-ch06': return require('./chapter-06.js');
    case 'sg-ch07': return require('./chapter-07.js');
    case 'sg-ch08': return require('./chapter-08.js');
    case 'sg-ch09': return require('./chapter-09.js');
    default: return null;
  }
}

function getUnitById(courseId, unitId) {
  var summary = manifest.getUnitSummary(courseId, unitId);
  if (!summary) return null;
  var chapterModule = getChapterModule(summary.chapterId);
  if (!chapterModule) return null;
  var units = chapterModule.units || [];
  for (var i = 0; i < units.length; i++) {
    if (units[i].id === unitId) return units[i];
  }
  return null;
}

function formatPrimarySource(unit) {
  if (!unit || !unit.sourceRefs || !unit.sourceRefs.length) return '';
  var ref = unit.sourceRefs[0];
  var source = manifest.getSourceById(ref.sourceId);
  var title = source ? source.displayTitleJa : ref.sourceId;
  var range = ref.pdfPageEnd > ref.pdfPageStart ? ('PDF 第 ' + ref.pdfPageStart + ' - ' + ref.pdfPageEnd + ' 页') : ('PDF 第 ' + ref.pdfPageStart + ' 页');
  return '原书定位：' + title + ' · ' + range;
}

module.exports = { getChapterModule: getChapterModule, getUnitById: getUnitById, formatPrimarySource: formatPrimarySource };
