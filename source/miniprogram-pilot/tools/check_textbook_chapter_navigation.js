#!/usr/bin/env node
'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var manifest = require(path.join(ROOT, 'packages/course-content/data/manifest.js'));
var questionData = require(path.join(ROOT, 'packages/quiz/data/course_questions.js'));
var failures = [];

var BASELINE = {
  itpass: { chapters: 10, groups: 73, units: 73 },
  sg: { chapters: 9, groups: 24, units: 112 }
};

function fail(message) {
  failures.push(message);
}

function usage(exitCode) {
  console.log('Usage: node tools/check_textbook_chapter_navigation.js --all');
  process.exit(exitCode);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function parseArgs(argv) {
  if (argv.indexOf('--help') >= 0 || argv.indexOf('-h') >= 0) usage(0);
  if (argv.indexOf('--all') < 0) fail('use --all for the R5.3B chapter navigation contract');
}

function gitDiffNames() {
  return childProcess.execFileSync('git', ['diff', '--name-only', 'b610522fd8a35686889e73a487bc4ed4185bee03..HEAD'], {
    cwd: ROOT,
    encoding: 'utf8'
  }).split(/\r?\n/).filter(Boolean);
}

function currentDiffNames() {
  return childProcess.execFileSync('git', ['diff', '--name-only'], {
    cwd: ROOT,
    encoding: 'utf8'
  }).split(/\r?\n/).filter(Boolean);
}

function allGroups() {
  var groups = [];
  (manifest.chapters || []).forEach(function (chapter) {
    (chapter.sectionGroups || []).forEach(function (group) {
      groups.push({
        id: group.id,
        chapterId: chapter.id,
        exam: chapter.exam,
        nativeSectionId: group.nativeSectionId,
        titleJa: group.titleJa,
        titleZh: group.titleZh,
        units: group.units || []
      });
    });
  });
  return groups;
}

function summarizeExam(exam) {
  var chapters = (manifest.chapters || []).filter(function (chapter) { return chapter.exam === exam; });
  var groups = [];
  var units = [];
  chapters.forEach(function (chapter) {
    (chapter.sectionGroups || []).forEach(function (group) {
      groups.push(group);
      units = units.concat(group.units || []);
    });
  });
  return { chapters: chapters, groups: groups, units: units };
}

function assertUnique(list, getId, label) {
  var seen = {};
  list.forEach(function (item) {
    var id = getId(item);
    if (seen[id]) fail('duplicate ' + label + ': ' + id);
    seen[id] = true;
  });
}

function assertDataInventory() {
  ['itpass', 'sg'].forEach(function (exam) {
    var summary = summarizeExam(exam);
    var expected = BASELINE[exam];
    if (summary.chapters.length !== expected.chapters) fail(exam + ' chapter count changed: ' + summary.chapters.length + ' !== ' + expected.chapters);
    if (summary.groups.length !== expected.groups) fail(exam + ' group count changed: ' + summary.groups.length + ' !== ' + expected.groups);
    if (summary.units.length !== expected.units) fail(exam + ' unit count changed: ' + summary.units.length + ' !== ' + expected.units);
    assertUnique(summary.groups, function (group) { return group.id; }, exam + ' group id');
    assertUnique(summary.units, function (unit) { return unit.id; }, exam + ' unit id');
    summary.groups.forEach(function (group) {
      if (!group.units || !group.units.length) fail(exam + ' group without unit: ' + group.id);
    });
  });
}

function assertQuestionLinks() {
  var questionsById = {};
  (questionData.questions || []).forEach(function (question) { questionsById[question.id] = question; });
  var content = require(path.join(ROOT, 'packages/course-content/data/textbook-course.js'));
  (content.units || []).forEach(function (unit) {
    (unit.relatedQuestionIds || []).forEach(function (qid) {
      var question = questionsById[qid];
      if (!question) {
        fail(unit.id + ' related question missing: ' + qid);
        return;
      }
      if (question.exam !== unit.exam) fail(unit.id + ' related question crosses exam: ' + qid);
      if (question.sourceType !== 'lesson_quiz') fail(unit.id + ' related question must remain lesson_quiz: ' + qid);
    });
  });
}

function assertModelContract() {
  var modelPath = path.join(ROOT, 'packages/course-content/pages/chapter-list/chapter-list-model.js');
  if (!fs.existsSync(modelPath)) {
    fail('missing chapter-list-model.js pure state model');
    return;
  }
  var model = require(modelPath);
  ['toggleChapter|expandAllChapters|collapseAllChapters', 'expandAll', 'collapseAll', 'isExpanded', 'restoreExpandedState', 'resolveInitialExpandedState', 'decorateChapters'].forEach(function (name) {
    if (typeof model[name] !== 'function') fail('chapter-list-model missing function: ' + name);
  });
  if (failures.length) return;

  var groups = [
    { id: 'g1', units: [{ id: 'u1' }] },
    { id: 'g2', units: [{ id: 'u2' }] }
  ];
  var chapters = [{ id: 'c1', sectionGroups: groups }];
  var state = model.toggleChapter|expandAllChapters|collapseAllChapters([], 'g1', groups);
  if (JSON.stringify(state) !== JSON.stringify(['g1'])) fail('toggleChapter|expandAllChapters|collapseAllChapters should open a valid closed group');
  state = model.toggleChapter|expandAllChapters|collapseAllChapters(state, 'g1', groups);
  if (JSON.stringify(state) !== JSON.stringify([])) fail('toggleChapter|expandAllChapters|collapseAllChapters should close an open group');
  state = model.toggleChapter|expandAllChapters|collapseAllChapters(['g1'], 'missing', groups);
  if (JSON.stringify(state) !== JSON.stringify(['g1'])) fail('toggleChapter|expandAllChapters|collapseAllChapters should ignore invalid group ids');
  var dupState = model.toggleChapter|expandAllChapters|collapseAllChapters([], 'g1', groups);
  dupState = model.toggleChapter|expandAllChapters|collapseAllChapters(dupState, 'g1', groups);
  dupState = model.toggleChapter|expandAllChapters|collapseAllChapters(dupState, 'g1', groups);
  if (dupState.length !== 1 || dupState[0] !== 'g1') fail('toggleChapter|expandAllChapters|collapseAllChapters should not duplicate ids across repeated clicks');
  if (model.collapseAll().length !== 0) fail('collapseAll should return empty array');
  if (!model.isExpanded(['g2'], 'g2')) fail('isExpanded should detect open group');
  if (model.isExpanded(['g2'], 'g1')) fail('isExpanded should not mark closed group open');
  if (model.restoreExpandedState(['g1', 'g1', 'missing'], groups).join(',') !== 'g1') fail('restoreExpandedState should dedupe and drop invalid ids');
  if (model.resolveInitialExpandedState({ unitId: 'u2' }, chapters).join(',') !== 'g2') fail('unitId deep link should expand containing group');
  if (model.resolveInitialExpandedState({ groupId: 'g1' }, chapters).join(',') !== 'g1') fail('groupId deep link should expand that group');
  if (model.resolveInitialExpandedState({}, chapters).length !== 0) fail('plain entry should keep all groups collapsed');
  var decorated = model.decorateChapters(chapters, ['g2']);
  if (!decorated[0].sectionGroups[1].isExpanded || decorated[0].sectionGroups[0].isExpanded) fail('decorateChapters should mark only expanded groups');
}

function assertPageImplementation() {
  var js = read('packages/course-content/pages/chapter-list/chapter-list.js');
  var wxml = read('packages/course-content/pages/chapter-list/chapter-list.wxml');
  var wxss = read('packages/course-content/pages/chapter-list/chapter-list.wxss');
  var json = read('packages/course-content/pages/chapter-list/chapter-list.json');
  var joined = [js, wxml, wxss, json].join('\n');

  ['toggleChapter|expandAllChapters|collapseAllChapters', 'toggleChapter|expandAllChapters|collapseAllChapters', 'toggleChapter|expandAllChapters|collapseAllChapters'].forEach(function (name) {
    if (js.indexOf(name) < 0) fail('chapter-list.js missing ' + name);
  });
  if (!/expandedChapterIds/.test(js)) fail('chapter-list.js must hold expandedChapterIds page state');
  if (!/resolveInitialExpandedState/.test(js)) fail('chapter-list.js must resolve initial expansion from route query');
  if (!/decorateChapters/.test(js)) fail('chapter-list.js must decorate chapters from expansion state');
  if (/goBack\s*:/.test(js) || /bindtap="goBack"/.test(wxml) || />返回</.test(wxml)) {
    fail('chapter-list must remove duplicate in-page back button');
  }
  if (!/bindtap="toggleChapter"/.test(wxml)) fail('group header must be tappable via toggleChapter|expandAllChapters|collapseAllChapters');
  if (!/wx:if="{{group\.isExpanded}}"/.test(wxml)) fail('unit cards must render only when their group is expanded');
  if (!/bindtap="toggleChapter"/.test(wxml)) fail('WXML missing expand all action');
  if (!/bindtap="toggleChapter"/.test(wxml)) fail('WXML missing collapse all action');
  if (!/showBulkControls/.test(wxml + js)) fail('bulk controls must be hidden when not meaningful');
  if (!/data-chapter-id="{{group\.id}}"/.test(wxml)) fail('group header must carry data-chapter-id');
  if (!/data-unit-id="{{unit\.id}}"/.test(wxml)) fail('unit card must carry data-unit-id');
  if (!/courseId=.*unitId=/.test(js)) fail('unit route must still pass courseId and unitId');
  if (/sourceType=lesson_quiz/.test(js)) fail('chapter-list must not navigate directly to Quiz');
  if (/utils\/storage|favorite-questions|packages\/quiz\/data|course_questions|wx\.getStorage|wx\.setStorage/.test(joined)) {
    fail('chapter-list must not depend on storage or canonical question data');
  }
  if (/[A-Za-z]:\\|G:\\|file:\/\/|127\.0\.0\.1|localhost|data:application\/pdf|base64,/i.test(joined)) {
    fail('chapter-list contains forbidden local path, fake source URL, or embedded payload');
  }
  if (/itpass-ch0\d-sec-\d+|sg-ch0\d-sec-\d+/.test(js)) fail('chapter-list must not hard-code exam-specific group ids');
  if (!/tc-chapter__toggle/.test(wxss)) fail('WXSS must style a visible expand/collapse affordance');
  if (!/min-height:\s*(88|90|92|96)rpx/.test(wxss)) fail('group header needs a comfortable touch target');
}

function assertAllowedDiffScope() {
  var allowed = {
    'packages/course-content/pages/chapter-list/chapter-list.js': true,
    'packages/course-content/pages/chapter-list/chapter-list.wxml': true,
    'packages/course-content/pages/chapter-list/chapter-list.wxss': true,
    'packages/course-content/pages/chapter-list/chapter-list.json': true,
    'packages/course-content/pages/chapter-list/chapter-list-model.js': true,
    'packages/course-itpass/pages/chapter-list/chapter-list-model.js': true,
    'packages/course-itpass/pages/chapter-list/chapter-list.js': true,
    'packages/course-itpass/pages/chapter-list/chapter-list.wxml': true,
    'packages/course-itpass/pages/chapter-list/chapter-list.wxss': true,
    'packages/course-itpass/pages/unit-detail/unit-detail.js': true,
    'packages/course-itpass/pages/unit-detail/unit-detail.wxml': true,
    'packages/course-itpass/pages/unit-detail/unit-detail.wxss': true,
    'packages/course-sg/pages/chapter-list/chapter-list.js': true,
    'packages/course-sg/pages/chapter-list/chapter-list.wxml': true,
    'packages/course-sg/pages/chapter-list/chapter-list.wxss': true,
    'packages/course-sg/pages/chapter-list/chapter-list-model.js': true,
    'packages/course-sg/pages/chapter-list/chapter-list.json': true,
    'packages/course-sg/pages/unit-detail/unit-detail.js': true,
    'packages/course-sg/pages/unit-detail/unit-detail.wxml': true,
    'packages/course-sg/pages/unit-detail/unit-detail.wxss': true,
    'packages/course-content/data/loader.js': true,
    'packages/course-content/data/textbook-course.js': true,
    'tools/check_textbook_chapter_navigation.js': true
  };
  currentDiffNames().forEach(function (name) {
    if (!allowed[name]) fail('out-of-scope current working tree change: ' + name);
  });
  gitDiffNames().forEach(function (name) {
    if (/^packages\/quiz\//.test(name) || /^data\//.test(name) ||
      name === 'utils/storage.js' || name === 'utils/favorite-questions.js' ||
      name === 'app.js' || name === 'app.wxss' ||
      name === 'project.config.json' || name === 'project.private.config.json' ||
      name === 'tools/audit_miniprogram_package_size.js') {
      fail('forbidden committed diff scope: ' + name);
    }
  });
}

function main() {
  parseArgs(process.argv);
  assertDataInventory();
  assertQuestionLinks();
  assertModelContract();
  assertPageImplementation();
  assertAllowedDiffScope();

  if (failures.length) {
    console.error('TEXTBOOK CHAPTER NAVIGATION FAIL (' + failures.length + ')');
    failures.forEach(function (message) { console.error('  - ' + message); });
    process.exit(1);
  }
  console.log('TEXTBOOK CHAPTER NAVIGATION PASS — collapsible group state, route preservation, inventory, and frozen boundaries verified');
}

main();
