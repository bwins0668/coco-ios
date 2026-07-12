var sourceManifestModule = require('./python-source-manifest');
var courseManifestModule = require('./python-course-manifest');

function compute() {
  var sourceManifest = sourceManifestModule.pythonSourceManifest;
  var visibleIds = (sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || [];
  var sectionCount = visibleIds.length;
  var titleJa = 'Python入門 / リスト / 条件分岐 / 辞書';
  var titleZh = 'Python 入门 / 列表 / 条件分支 / 字典';

  return {
    sectionCount: sectionCount,
    titleJa: titleJa,
    titleZh: titleZh,
    visibleLessonCount: sectionCount
  };
}

module.exports = compute();
