// chapter-list-model.js — Chapter-level accordion navigation
// P1 R5.4.3: Folding at chapter level, not section-group level
'use strict';

// Find chapter ID that contains the given unit ID
function findChapterByUnitId(unitId, chapters) {
  if (!unitId) return '';
  for (var c = 0; c < (chapters || []).length; c++) {
    var groups = chapters[c].sectionGroups || [];
    for (var g = 0; g < groups.length; g++) {
      var units = groups[g].units || [];
      for (var u = 0; u < units.length; u++) {
        if (units[u].id === unitId) return chapters[c].id;
      }
    }
  }
  return '';
}

function validChapterMap(chapters) {
  var map = {};
  (chapters || []).forEach(function (ch) {
    if (ch && ch.id) map[ch.id] = true;
  });
  return map;
}

function restoreExpandedState(expandedIds, chapters) {
  var valid = validChapterMap(chapters);
  var seen = {};
  var result = [];
  (expandedIds || []).forEach(function (id) {
    if (valid[id] && !seen[id]) {
      seen[id] = true;
      result.push(id);
    }
  });
  return result;
}

function isExpanded(expandedIds, id) {
  return (expandedIds || []).indexOf(id) >= 0;
}

function toggleChapter(expandedIds, chapterId, chapters) {
  var current = restoreExpandedState(expandedIds, chapters);
  var valid = validChapterMap(chapters);
  if (!valid[chapterId]) return current;
  if (isExpanded(current, chapterId)) {
    return current.filter(function (id) { return id !== chapterId; });
  }
  return current.concat(chapterId);
}

function expandAllChapters(chapters) {
  return (chapters || []).map(function (ch) { return ch.id; }).filter(Boolean);
}

function collapseAllChapters() {
  return [];
}

function resolveInitialExpandedState(routeQuery, chapters) {
  routeQuery = routeQuery || {};
  var chapterId = routeQuery.chapterId || '';
  if (!chapterId && routeQuery.unitId) {
    chapterId = findChapterByUnitId(routeQuery.unitId, chapters);
  }
  return restoreExpandedState(chapterId ? [chapterId] : [], chapters);
}

function pageRange(unit) {
  if (!unit || !unit.pdfPageStart) return '';
  return unit.pdfPageEnd && unit.pdfPageEnd > unit.pdfPageStart
    ? ('PDF ' + unit.pdfPageStart + '-' + unit.pdfPageEnd + ' 页')
    : ('PDF 第 ' + unit.pdfPageStart + ' 页');
}

function questionLabel(unit) {
  var count = unit && unit.questionCount;
  return count ? ('关联 ' + count + ' 题') : '暂无关联题';
}

function decorateChapters(chapters, expandedChapterIds) {
  var expanded = restoreExpandedState(expandedChapterIds, chapters);
  var expandedMap = {};
  expanded.forEach(function (id) { expandedMap[id] = true; });

  return (chapters || []).map(function (chapter) {
    var chapUnitCount = 0;
    var sectionGroups = (chapter.sectionGroups || []).map(function (group) {
      var units = (group.units || []).map(function (unit) {
        var u = {};
        for (var k in unit) u[k] = unit[k];
        u.pageLabel = pageRange(unit);
        u.questionLabel = questionLabel(unit);
        return u;
      });
      chapUnitCount += units.length;
      return {
        id: group.id,
        nativeSectionId: group.nativeSectionId,
        titleJa: group.titleJa,
        titleZh: group.titleZh,
        units: units
      };
    });

    return {
      id: chapter.id,
      titleJa: chapter.titleJa,
      titleZh: chapter.titleZh,
      order: chapter.order,
      exam: chapter.exam,
      sectionGroups: sectionGroups,
      unitCount: chapUnitCount,
      unitCountLabel: chapUnitCount + ' 个知识单元',
      isExpanded: !!expandedMap[chapter.id],
      stateLabel: expandedMap[chapter.id] ? '收起' : '展开',
      arrow: expandedMap[chapter.id] ? '⌃' : '⌄'
    };
  });
}

module.exports = {
  toggleChapter: toggleChapter,
  expandAllChapters: expandAllChapters,
  collapseAllChapters: collapseAllChapters,
  isExpanded: isExpanded,
  restoreExpandedState: restoreExpandedState,
  resolveInitialExpandedState: resolveInitialExpandedState,
  decorateChapters: decorateChapters
};
