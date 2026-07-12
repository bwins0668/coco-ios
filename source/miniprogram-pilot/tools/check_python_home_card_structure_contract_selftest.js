#!/usr/bin/env node
'use strict';
var fs = require('fs');
var os = require('os');
var path = require('path');
var cp = require('child_process');

var ROOT = path.resolve(__dirname, '..');
var CHECKER = path.join(ROOT, 'tools/check_python_home_card_structure_contract.js');

function ensureDir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
function copyFile(root, dest, rel) { var from = path.join(root, rel); var to = path.join(dest, rel); ensureDir(to); fs.copyFileSync(from, to); }
function copyDir(root, dest, rel) { fs.cpSync(path.join(root, rel), path.join(dest, rel), { recursive: true }); }
function createCaseRoot(workRoot, id) { var dest = path.join(workRoot, id); copyDir(ROOT, dest, 'pages/home'); copyDir(ROOT, dest, 'packages/python-course'); copyDir(ROOT, dest, 'utils'); copyFile(ROOT, dest, 'app.json'); return dest; }
function writeFile(root, rel, content) { fs.writeFileSync(path.join(root, rel), content, 'utf8'); }
function readFile(root, rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function run(root) { var r = cp.spawnSync('node', [CHECKER, '--root', root], { encoding: 'utf8', windowsHide: true }); return { status: r.status == null ? 1 : r.status, output: ((r.stdout || '') + (r.stderr || '')).trim() }; }
function keyOutput(output) { return output.split(/\r?\n/).filter(Boolean).slice(0, 3).join(' | '); }

var cases = [
  { id: 'A', mutation: 'remove path from summary', expectedExit: 1, mutate: function (root) { writeFile(root, 'packages/python-course/data/python-course-summary.js', 'module.exports = { sectionCount: 5, titleJa: "", titleZh: "", visibleLessonCount: 5 };\n'); } },
  { id: 'B', mutation: 'remove lesson count from Python card', expectedExit: 1, mutate: function (root) { var t = readFile(root, 'pages/home/home.wxml'); writeFile(root, 'pages/home/home.wxml', t.replace(/\{\{pythonCourseSummary\.sectionCount\}\} 小节/g, '')); } },
  { id: 'C', mutation: 'set count to 699', expectedExit: 1, mutate: function (root) { writeFile(root, 'packages/python-course/data/python-course-summary.js', 'module.exports = { sectionCount: 699, titleJa: "Python入門 / リスト / 条件分岐", titleZh: "Python 入门 / 列表 / 条件分支", visibleLessonCount: 699 };\n'); } },
  { id: 'D', mutation: 'hide one visible lesson', expectedExit: 1, mutate: function (root) { var smFile = path.join(root, 'packages/python-course/data/python-source-manifest.js'); delete require.cache[require.resolve(smFile)]; var data = require(smFile); data.pythonSourceManifest.releaseVisibility.visibleCourseLessonIds = data.pythonSourceManifest.releaseVisibility.visibleCourseLessonIds.slice(0, 4); fs.writeFileSync(smFile, 'module.exports = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8'); } },
  { id: 'E', mutation: 'set count false-699', expectedExit: 1, mutate: function (root) { writeFile(root, 'packages/python-course/data/python-course-summary.js', 'module.exports = { sectionCount: 699, titleJa: "Python入門", titleZh: "Python 入门", visibleLessonCount: 699 };\n'); } },
  { id: 'F', mutation: 'path describes full course', expectedExit: 1, mutate: function (root) { writeFile(root, 'packages/python-course/data/python-course-summary.js', 'module.exports = { sectionCount: 5, titleJa: "Python 完整课程", titleZh: "全栈", visibleLessonCount: 5 };\n'); } },
  { id: 'G', mutation: 'path includes unpublished topics', expectedExit: 1, mutate: function (root) { writeFile(root, 'packages/python-course/data/python-course-summary.js', 'module.exports = { sectionCount: 5, titleJa: "関数", titleZh: "类", visibleLessonCount: 5 };\n'); } },
  { id: 'H', mutation: 'change Python route', expectedExit: 1, mutate: function (root) { var navFile = path.join(root, 'utils/navigation.js'); var t = readFile(root, 'utils/navigation.js'); writeFile(root, 'utils/navigation.js', t.replace("/packages/python-course/pages/home/home", "/packages/wrong-path/home/home")); } },
  { id: 'I', mutation: 'disable Python card', expectedExit: 1, mutate: function (root) { var t = readFile(root, 'pages/home/home.wxml'); writeFile(root, 'pages/home/home.wxml', t.replace('r8-python-course-entry', 'r6-course-strip__item--planned r8-python-course-entry')); } },
  { id: 'J', mutation: 'revert to green', expectedExit: 1, mutate: function (root) { var t = readFile(root, 'pages/home/home.wxss'); writeFile(root, 'pages/home/home.wxss', t.replace(/#9A7B48/g, '#2f9e44').replace(/#F4EBD8/g, '#eaf7ee')); } },
  
  { id: 'K', mutation: 'remove Java card pill', expectedExit: 1, mutate: function (root) { var t = readFile(root, 'pages/home/home.wxml'); writeFile(root, 'pages/home/home.wxml', t.replace('<text class="r7-java-course-entry__pill">面向零基础</text>', '')); } },
  { id: 'L', mutation: 'modify GS1 text', expectedExit: 1, mutate: function (root) { var chFile = path.join(root, 'packages/python-course/data/chapters/python-gs-ch01.js'); delete require.cache[require.resolve(chFile)]; var data = require(chFile); var gs1 = data.lessons.find(function (l) { return l.lessonId === 'python-0007-gs1-run-visible-output'; }); gs1.title.zh = 'modifiedGS1'; fs.writeFileSync(chFile, 'module.exports = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8'); } },
  { id: 'M', mutation: 'modify GS2 text', expectedExit: 1, mutate: function (root) { var chFile = path.join(root, 'packages/python-course/data/chapters/python-gs-ch01.js'); delete require.cache[require.resolve(chFile)]; var data = require(chFile); var gs2 = data.lessons.find(function (l) { return l.lessonId === 'python-0008-gs2-values-and-variables'; }); gs2.title.zh = 'modifiedGS2'; fs.writeFileSync(chFile, 'module.exports = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8'); } },
  { id: 'N', mutation: 'modify Domain1A text', expectedExit: 1, mutate: function (root) { var chFile = path.join(root, 'packages/python-course/data/chapters/python-gs-ch01.js'); delete require.cache[require.resolve(chFile)]; var data = require(chFile); var d1 = data.lessons.find(function (l) { return l.lessonId === 'python-0009-7d37969c-第-3-章-列表简介'; }); d1.title.zh = 'modifiedD1A'; fs.writeFileSync(chFile, 'module.exports = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8'); } },
  { id: 'O', mutation: 'real repository', expectedExit: 0, realRoot: true }
];

function main() {
  var workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-card-selftest-'));
  var rows = [];
  try {
    for (var i = 0; i < cases.length; i += 1) {
      var spec = cases[i];
      var caseRoot = spec.realRoot ? ROOT : createCaseRoot(workRoot, spec.id);
      if (spec.mutate) spec.mutate(caseRoot);
      var result = run(caseRoot);
      rows.push({ id: spec.id, mutation: spec.mutation, command: 'node tools/check_python_home_card_structure_contract.js --root ' + (spec.realRoot ? '<repo>' : '<temp>'), exitCode: result.status, key: keyOutput(result.output), expectedExit: spec.expectedExit, ok: result.status === spec.expectedExit });
    }
  } finally { fs.rmSync(workRoot, { recursive: true, force: true }); }

  console.log('| 测试 | mutation | command | exit code | 关键输出 |');
  console.log('|---|---|---|---:|---|');
  for (var j = 0; j < rows.length; j += 1) {
    var row = rows[j];
    console.log('| ' + row.id + ' | ' + row.mutation + ' | ' + row.command + ' | ' + row.exitCode + ' | ' + row.key.replace(/\|/g, '/') + ' |');
  }

  var failures = rows.filter(function (r) { return !r.ok; });
  if (failures.length) {
    console.error('[Python home card structure contract selftest] FAIL');
    failures.forEach(function (r) { console.error('ERROR:', r.id, 'expected exit', r.expectedExit, 'got', r.exitCode); });
    process.exit(1);
  }
  console.log('[Python home card structure contract selftest] PASS: A-O matched expected exits');
}

main();
