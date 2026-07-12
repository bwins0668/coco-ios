var manifest = require('./manifest');

// ITP loader: only ITP chapters, paths at data root (no itpass/ subdir)
function getChapterModule(chapterId) {
  switch (chapterId) {
    case 'itpass-ch01': return require('./chapter-01.js');
    case 'itpass-ch02': return require('./chapter-02.js');
    case 'itpass-ch03': return require('./chapter-03.js');
    case 'itpass-ch04': return require('./chapter-04.js');
    case 'itpass-ch05': return require('./chapter-05.js');
    case 'itpass-ch06': return require('./chapter-06.js');
    case 'itpass-ch07': return require('./chapter-07.js');
    case 'itpass-ch08': return require('./chapter-08.js');
    case 'itpass-ch09': return require('./chapter-09.js');
    case 'itpass-ch10': return require('./chapter-10.js');
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
