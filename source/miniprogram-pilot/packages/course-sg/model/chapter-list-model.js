'use strict';

function flattenGroups(chaptersOrGroups) {
  var groups = [];
  (chaptersOrGroups || []).forEach(function (item) {
    if (item && Array.isArray(item.sectionGroups)) {
      groups = groups.concat(item.sectionGroups);
    } else if (item && item.id) {
      groups.push(item);
    }
  });
  return groups;
}

function validGroupMap(groups) {
  var map = {};
  (groups || []).forEach(function (group) {
    if (group && group.id) map[group.id] = true;
  });
  return map;
}

function restoreExpandedState(expandedGroupIds, groups) {
  var valid = validGroupMap(flattenGroups(groups));
  var seen = {};
  var result = [];
  (expandedGroupIds || []).forEach(function (groupId) {
    if (valid[groupId] && !seen[groupId]) {
      seen[groupId] = true;
      result.push(groupId);
    }
  });
  return result;
}

function isExpanded(expandedGroupIds, groupId) {
  return (expandedGroupIds || []).indexOf(groupId) >= 0;
}

function toggleGroup(expandedGroupIds, groupId, groups) {
  var current = restoreExpandedState(expandedGroupIds, groups);
  var valid = validGroupMap(flattenGroups(groups));
  if (!valid[groupId]) return current;
  if (isExpanded(current, groupId)) {
    return current.filter(function (id) { return id !== groupId; });
  }
  return current.concat(groupId);
}

function expandAll(groups) {
  return flattenGroups(groups).map(function (group) { return group.id; }).filter(Boolean);
}

function collapseAll() {
  return [];
}

function findGroupIdByUnitId(unitId, chapters) {
  if (!unitId) return '';
  for (var c = 0; c < (chapters || []).length; c++) {
    var groups = chapters[c].sectionGroups || [];
    for (var g = 0; g < groups.length; g++) {
      var units = groups[g].units || [];
      for (var u = 0; u < units.length; u++) {
        if (units[u].id === unitId) return groups[g].id;
      }
    }
  }
  return '';
}

function resolveInitialExpandedState(routeQuery, chapters) {
  routeQuery = routeQuery || {};
  var groups = flattenGroups(chapters);
  var groupId = routeQuery.groupId || routeQuery.sectionGroupId || '';
  if (!groupId && routeQuery.unitId) {
    groupId = findGroupIdByUnitId(routeQuery.unitId, chapters);
  }
  return restoreExpandedState(groupId ? [groupId] : [], groups);
}

function pageRange(unit) {
  if (!unit) return '';
  return unit.pdfPageEnd && unit.pdfPageEnd > unit.pdfPageStart
    ? ('PDF 第 ' + unit.pdfPageStart + ' - ' + unit.pdfPageEnd + ' 页')
    : ('PDF 第 ' + unit.pdfPageStart + ' 页');
}

function questionLabel(unit) {
  var count = unit && unit.questionCount;
  return count ? ('关联 ' + count + ' 题') : '暂无关联题';
}

function decorateChapters(chapters, expandedGroupIds) {
  var groups = flattenGroups(chapters);
  var expanded = restoreExpandedState(expandedGroupIds, groups);
  var expandedMap = validGroupMap(expanded.map(function (groupId) { return { id: groupId }; }));
  return (chapters || []).map(function (chapter) {
    var unitCount = 0;
    var sectionGroups = (chapter.sectionGroups || []).map(function (group) {
      var units = (group.units || []).map(function (unit) {
        var unitCopy = {};
        for (var unitKey in unit) unitCopy[unitKey] = unit[unitKey];
        unitCopy.pageLabel = pageRange(unit);
        unitCopy.questionLabel = questionLabel(unit);
        return unitCopy;
      });
      unitCount += units.length;
      var groupCopy = {};
      for (var groupKey in group) {
        if (groupKey !== 'units') groupCopy[groupKey] = group[groupKey];
      }
      groupCopy.units = units;
      groupCopy.unitCount = units.length;
      groupCopy.unitCountLabel = units.length + ' 个知识单元';
      groupCopy.isExpanded = !!expandedMap[group.id];
      groupCopy.stateLabel = groupCopy.isExpanded ? '收起' : '展开';
      groupCopy.arrow = groupCopy.isExpanded ? '⌃' : '⌄';
      return groupCopy;
    });
    var chapterCopy = {};
    for (var chapterKey in chapter) {
      if (chapterKey !== 'sectionGroups') chapterCopy[chapterKey] = chapter[chapterKey];
    }
    chapterCopy.sectionGroups = sectionGroups;
    chapterCopy.groupCount = sectionGroups.length;
    chapterCopy.unitCount = unitCount;
    return chapterCopy;
  });
}

module.exports = {
  toggleGroup: toggleGroup,
  expandAll: expandAll,
  collapseAll: collapseAll,
  isExpanded: isExpanded,
  restoreExpandedState: restoreExpandedState,
  resolveInitialExpandedState: resolveInitialExpandedState,
  decorateChapters: decorateChapters
};
