#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var ROOT = path.resolve(__dirname, '..');
var EXPECTED = {
  pythonRoute: '/packages/python-course/pages/home/home',
  gs1Hash: '8E67A0E37E107A5E102DE4CBBA50FBC94656CDB056B3474750A57B6714619199',
  gs2Hash: 'C6028928DB1BDC2D27D9B90A522D7AEFFF6B121F0851937AC43B3D6576656FCF',
  d1a1Hash: '6FE237D87A66BC1FFBDC060EC545674D2E8369306BF85A6658EA1DC6D4D0E14B',
  d1a2Hash: '587B8E1F3393EAD1757470EA574E143F82187F38606E04D5470C7C5DE12BB6E6',
  d1a3Hash: '8592BB4E6F87827CBABA452941A3F246C673D23AF40733292F7793AD639A4DCB',
  sourceUnitsStableHash: 'B9AABA9126A5AEABEF473B2F6B0B0F4EB5798F6CB4E3BF57FB929ECC7305D97A',
  pythonHomeWxssHash: 'B7F8528998E66120E4DC19E119483727978FC9B0D38D638D948DEED80182D7B8',
  homeWxssKhakiRequired: '#9A7B48'
};
function parseArgs(argv) { var args = { root: ROOT }; for (var i = 2; i < argv.length; i++) { if (argv[i] === '--root') { args.root = path.resolve(argv[i + 1]); i++; } } return args; }
function read(root, rel, errors) { var f = path.join(root, rel); if (!fs.existsSync(f)) { errors.push('missing: ' + rel); return ''; } return fs.readFileSync(f, 'utf8'); }
function digest(v) { return crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex').toUpperCase(); }
function shaFile(root, rel, errors) { var f = path.join(root, rel); if (!fs.existsSync(f)) { errors.push('missing: ' + rel); return ''; } return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').toUpperCase(); }
function requireFresh(root, rel, errors) { var f = path.join(root, rel); if (!fs.existsSync(f)) { errors.push('missing module: ' + rel); return null; } delete require.cache[require.resolve(f)]; return require(f); }

function main() {
  var p = parseArgs(process.argv);
  var root = p.root;
  var errors = [];
  var homeJs = read(root, 'pages/home/home.js', errors);
  var homeWxss = read(root, 'pages/home/home.wxss', errors);
  var homeWxml = read(root, 'pages/home/home.wxml', errors);

  // 1. No subpackage require in home.js
  var subPkgRe = /require\s*\(\s*['"]\.\.\/.*packages\/python-course\b/;
  if (subPkgRe.test(homeJs)) errors.push('home.js requires packages/python-course subpackage');

  // 2. Registry has pythonVisibleLessonIds as array
  var registry = requireFresh(root, 'utils/course-registry.js', errors);
  if (registry) {
    var pyCard = registry.getCourseById('python');
    if (!pyCard) errors.push('Python card missing from registry');
    if (pyCard && (!pyCard.pythonVisibleLessonIds || !Array.isArray(pyCard.pythonVisibleLessonIds))) errors.push('pythonVisibleLessonIds must be an array in registry');
    // NOTE: expected count is NOT a hardcoded constant. The authoritative size is
    // derived from releaseVisibility below (section 3). A stale literal (was `!== 5`)
    // is self-contradictory once releaseVisibility grows, so it was removed.
    if (pyCard && (!pyCard.pythonPathLabelJa || !pyCard.pythonPathLabelZh)) errors.push('Python path labels missing from registry');
    if (pyCard && (/関数|クラス|ファイル|699/.test((pyCard.pythonPathLabelJa||'') + (pyCard.pythonPathLabelZh||'')))) errors.push('Python path labels mention unpublished content');
  }

  // 3. Registry projection === manifest visible IDs
  var sm = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  if (sm && sm.pythonSourceManifest && registry) {
    var manifestVisible = (sm.pythonSourceManifest.releaseVisibility || {}).visibleCourseLessonIds || [];
    var pyCard = registry.getCourseById('python');
    var registryIds = pyCard ? (pyCard.pythonVisibleLessonIds || []) : [];
    if (manifestVisible.length !== registryIds.length) errors.push('registry projection length ' + registryIds.length + ' != manifest visible ' + manifestVisible.length);
    for (var i = 0; i < manifestVisible.length; i++) {
      if (!registryIds.includes(manifestVisible[i])) errors.push('manifest visible ID missing from registry projection: ' + manifestVisible[i]);
    }
    for (var j = 0; j < registryIds.length; j++) {
      if (!manifestVisible.includes(registryIds[j])) errors.push('registry projection has non-visible ID: ' + registryIds[j]);
    }
    // 3b. Order drift — lesson order is a course contract (order 1..N).
    for (var k = 0; k < Math.min(manifestVisible.length, registryIds.length); k++) {
      if (manifestVisible[k] !== registryIds[k]) errors.push('registry projection order drift at index ' + k + ': ' + registryIds[k] + ' != ' + manifestVisible[k]);
    }
    // 3c. Duplicate IDs in the registry projection.
    var seenReg = {};
    for (var d = 0; d < registryIds.length; d++) {
      if (seenReg[registryIds[d]]) errors.push('duplicate lessonId in registry projection: ' + registryIds[d]);
      seenReg[registryIds[d]] = true;
    }
    // 3d. Home/public summary (the actual runtime consumer) must mirror releaseVisibility exactly.
    var pub = requireFresh(root, 'utils/python-public-course-summary.js', errors);
    if (pub && Array.isArray(pub.visibleLessonIds)) {
      if (pub.visibleLessonIds.length !== manifestVisible.length) errors.push('public summary visibleLessonIds length ' + pub.visibleLessonIds.length + ' != releaseVisibility ' + manifestVisible.length);
      for (var q = 0; q < manifestVisible.length; q++) {
        if (pub.visibleLessonIds[q] !== manifestVisible[q]) errors.push('public summary visibleLessonIds drift at index ' + q + ': ' + pub.visibleLessonIds[q] + ' != ' + manifestVisible[q]);
      }
    } else if (pub) {
      errors.push('python-public-course-summary.visibleLessonIds must be an array');
    }
  }

  // 4. Home page safe fallback
  if (homeJs.includes('.pythonVisibleLessonIds') && !/(try\s*\{|catch\s*\(|\.length\s*\|\|\s*0)/.test(homeJs)) errors.push('Python card summary computation needs safe fallback');

  // 5. Python route correct
  var navJs = read(root, 'utils/navigation.js', errors); if (!navJs.includes(EXPECTED.pythonRoute)) errors.push('Python route missing in navigation.js');

  // 6. Khaki in home WXSS
  if (!homeWxss.includes(EXPECTED.homeWxssKhakiRequired)) errors.push('Python card missing khaki accent in home.wxss');
  if (/#2f9e44|#eaf7ee/i.test(homeWxss)) errors.push('old Python green must not reappear');

  // 7. Lesson data hashes
  var chapter = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (chapter && Array.isArray(chapter.lessons)) {
    var gs1 = chapter.lessons.find(function(l) { return l.lessonId === 'python-0007-gs1-run-visible-output'; });
    var gs2 = chapter.lessons.find(function(l) { return l.lessonId === 'python-0008-gs2-values-and-variables'; });
    var d1a1 = chapter.lessons.find(function(l) { return l.lessonId === 'python-0009-7d37969c-第-3-章-列表简介'; });
    var d1a2 = chapter.lessons.find(function(l) { return l.lessonId === 'python-0010-921b265b-第-4-章-操作列表'; });
    var d1a3 = chapter.lessons.find(function(l) { return l.lessonId === 'python-0011-5c80c609-第-5-章-if语句'; });
    if (digest(gs1||{}) !== EXPECTED.gs1Hash) errors.push('GS1 hash changed');
    if (digest(gs2||{}) !== EXPECTED.gs2Hash) errors.push('GS2 hash changed');
    if (digest(d1a1||{}) !== EXPECTED.d1a1Hash) errors.push('D1A-1 hash changed');
    if (digest(d1a2||{}) !== EXPECTED.d1a2Hash) errors.push('D1A-2 hash changed');
    if (digest(d1a3||{}) !== EXPECTED.d1a3Hash) errors.push('D1A-3 hash changed');
  }

  if (shaFile(root, 'packages/python-course/pages/home/home.wxss', errors) !== EXPECTED.pythonHomeWxssHash) errors.push('Python Home khaki wxss changed');

  // 8. No global style changes
  if (!/r8-python-course-entry/.test(homeWxss)) errors.push('Python card scoped styles missing');

  if (errors.length) { console.error('[Python home card runtime contract] FAIL'); errors.forEach(function(e) { console.error('ERROR:', e); }); process.exit(1); }
  console.log('[Python home card runtime contract] PASS: 0 errors, 0 warnings');
}
main();
