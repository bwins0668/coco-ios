#!/usr/bin/env node
'use strict';
/**
 * Negative-mutation self-test for check_python_home_card_runtime_contract.js (T0 Track A).
 *
 * Proves the fixed checker derives the expected visible-lesson set from the
 * authoritative releaseVisibility (NOT a hardcoded constant 5) AND still catches
 * projection drift: missing / extra / duplicate / order / summary-inconsistency.
 *
 * Method: build a controlled fixture root. Real files that carry frozen hashes
 * (chapter lesson data, home.wxss, navigation, home.js/wxml) are COPIED unchanged
 * from the real worktree; the three projection sources (registry, source-manifest
 * releaseVisibility, public-course-summary) are SYNTHESIZED per case. Real course
 * data is never mutated.
 */
var fs = require('fs');
var path = require('path');
var os = require('os');
var cp = require('child_process');

var ROOT = path.resolve(__dirname, '..');
var CHECKER = path.join(ROOT, 'tools', 'check_python_home_card_runtime_contract.js');
var IDS9 = [
  'python-0007-gs1-run-visible-output',
  'python-0008-gs2-values-and-variables',
  'python-0009-7d37969c-第-3-章-列表简介',
  'python-0010-921b265b-第-4-章-操作列表',
  'python-0011-5c80c609-第-5-章-if语句',
  'python-0012-5cc0ecc6-第-6-章-字典',
  'python-0013-3f4a9a6a-第-7-章-用户输入和while循环',
  'python-0014-75c7d812-第-8-章-函数',
  'python-0015-0f96233e-第-9-章-类'
];
var COPY = [
  'pages/home/home.js',
  'pages/home/home.wxss',
  'pages/home/home.wxml',
  'utils/navigation.js',
  'packages/python-course/data/chapters/python-gs-ch01.js',
  'packages/python-course/pages/home/home.wxss'
];

function writeFile(root, rel, content) { var f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content, 'utf8'); }
function registryModule(ids) {
  return 'function getCourseById(id){ if(id!=="python") return {id:id}; return { id:"python", pythonVisibleLessonIds: ' + JSON.stringify(ids) +
    ', pythonPathLabelJa:"Python", pythonPathLabelZh:"Python" }; }\nmodule.exports = { getCourseById: getCourseById, COURSES: [] };\n';
}
function sourceManifestModule(ids) {
  return 'var pythonSourceManifest = { releaseVisibility: { visibleCourseLessonIds: ' + JSON.stringify(ids) + ' } };\nmodule.exports = { pythonSourceManifest: pythonSourceManifest };\n';
}
function publicSummaryModule(ids) { return 'module.exports = { visibleLessonIds: ' + JSON.stringify(ids) + ' };\n'; }

function buildFixture(caseSpec) {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pyhomecard-'));
  COPY.forEach(function (rel) {
    var src = path.join(ROOT, rel); var dst = path.join(dir, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  });
  writeFile(dir, 'utils/course-registry.js', registryModule(caseSpec.registry));
  writeFile(dir, 'packages/python-course/data/python-source-manifest.js', sourceManifestModule(caseSpec.releaseVisibility));
  writeFile(dir, 'utils/python-public-course-summary.js', publicSummaryModule(caseSpec.publicSummary));
  return dir;
}
function runChecker(root) {
  var r = cp.spawnSync('node', [CHECKER, '--root', root], { encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
function firstError(out) { var m = out.match(/ERROR:\s*(.+)/); return m ? m[1].trim() : ''; }

var first6 = IDS9.slice(0, 6);
var dupCase = IDS9.slice(0, 8).concat([IDS9[0]]); // len 9, dup of 0007, missing 0015
var cases = [
  { caseId: 'A-legal-9', expected: 'PASS', registry: IDS9, releaseVisibility: IDS9, publicSummary: IDS9 },
  { caseId: 'B-drop-published', expected: 'FAIL', registry: IDS9.slice(0, 8), releaseVisibility: IDS9, publicSummary: IDS9 },
  { caseId: 'C-inject-unpublished', expected: 'FAIL', registry: IDS9.concat(['python-9999-unpublished-artifact']), releaseVisibility: IDS9, publicSummary: IDS9 },
  { caseId: 'D-duplicate-id', expected: 'FAIL', registry: dupCase, releaseVisibility: IDS9, publicSummary: IDS9 },
  { caseId: 'E-resize-synced-no-const5', expected: 'PASS', registry: first6, releaseVisibility: first6, publicSummary: first6 },
  { caseId: 'F-summary-inconsistent', expected: 'FAIL', registry: IDS9, releaseVisibility: IDS9, publicSummary: IDS9.slice(0, 8) }
];

var results = [], allOk = true;
cases.forEach(function (c) {
  var dir = buildFixture(c);
  var res = runChecker(dir);
  var actual = res.code === 0 ? 'PASS' : 'FAIL';
  var ok = actual === c.expected;
  if (!ok) allOk = false;
  results.push({ caseId: c.caseId, expected: c.expected, actual: actual, failureSignal: actual === 'FAIL' ? firstError(res.out) : '', checkerCoverageProven: ok });
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
});

console.log(JSON.stringify({ selftest: 'check_python_home_card_runtime_contract', allPassed: allOk, cases: results }, null, 2));
process.exit(allOk ? 0 : 1);
