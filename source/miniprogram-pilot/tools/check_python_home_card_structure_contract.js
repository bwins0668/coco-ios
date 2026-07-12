#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

const EXPECTED = {
  pythonRoute: '/packages/python-course/pages/home/home',
  gs1Hash: '8E67A0E37E107A5E102DE4CBBA50FBC94656CDB056B3474750A57B6714619199',
  gs2Hash: 'C6028928DB1BDC2D27D9B90A522D7AEFFF6B121F0851937AC43B3D6576656FCF',
  pythonHomeWxssHash: 'B7F8528998E66120E4DC19E119483727978FC9B0D38D638D948DEED80182D7B8',
  sourceUnitsStableHash: 'B9AABA9126A5AEABEF473B2F6B0B0F4EB5798F6CB4E3BF57FB929ECC7305D97A',
  d1a1Hash: '6FE237D87A66BC1FFBDC060EC545674D2E8369306BF85A6658EA1DC6D4D0E14B',
  d1a2Hash: '587B8E1F3393EAD1757470EA574E143F82187F38606E04D5470C7C5DE12BB6E6',
  d1a3Hash: '8592BB4E6F87827CBABA452941A3F246C673D23AF40733292F7793AD639A4DCB'
};

const JAVA_GUARD = {
  homeJsContentMarker: '/packages/java-course/pages/home/home',
  homeWxmlContentMarker: 'r7-java-course-entry',
  javaEntryCount: '19'
};

const BASELINE_COURSE_IDS = ['itpass', 'sg', 'mos365', 'algorithm'];

function parseArgs(argv) {
  const args = { root: ROOT };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') { args.root = path.resolve(argv[i + 1]); i += 1; }
  }
  return args;
}

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { errors.push('missing file: ' + rel); return ''; }
  return fs.readFileSync(file, 'utf8');
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function shaFile(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { errors.push('missing protected file: ' + rel); return ''; }
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { errors.push('missing module: ' + rel); return null; }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];

  const homeWxml = read(root, 'pages/home/home.wxml', errors);
  const homeJs = read(root, 'pages/home/home.js', errors);
  const homeWxss = read(root, 'pages/home/home.wxss', errors);
  const navJs = read(root, 'utils/navigation.js', errors);

  // Python card structure verification
  if (!/r8-python-course-entry/.test(homeWxml)) errors.push('Python card missing r8-python-course-entry class');
  if (!/r8-python-course-entry__pill/.test(homeWxml)) errors.push('Python card missing pill');
  if (!/r8-python-course-entry__meta/.test(homeWxml)) errors.push('Python card missing meta');
  if (!/pythonCourseSummary\.sectionCount/.test(homeWxml)) errors.push('Python card missing dynamic sectionCount');
  if (!/pythonCourseSummary\.titleJa/.test(homeWxml)) errors.push('Python card missing titleJa');
  if (!/pythonCourseSummary\.titleZh/.test(homeWxml)) errors.push('Python card missing titleZh');
  if (!/面向零基础/.test(homeWxml)) errors.push('Python card missing zero-beginner pill text');
  if (!/双语讲解/.test(homeWxml)) errors.push('Python card missing bilingual label');
  if (!/小节/.test(homeWxml)) errors.push('Python card missing lesson count unit');

  // Python route
  if (!navJs.includes(EXPECTED.pythonRoute)) errors.push('Python route changed or missing in navigation.js');

  // Java card preserved
  if (!homeJs.includes(JAVA_GUARD.homeJsContentMarker)) errors.push('Java home route changed');
  if (!/r7-java-course-entry/.test(homeWxml)) errors.push('Java card structure changed');
  if (!/javaCourseSummary\.chapterCount/.test(homeWxml)) errors.push('Java card chapter count missing');
  if (!/javaCourseSummary\.sectionCount/.test(homeWxml)) errors.push('Java card section count missing');

  // Pills isolation
  const javaPill = (homeWxml.match(/r7-java-course-entry__pill/g) || []).length;
  const pythonPill = (homeWxml.match(/r8-python-course-entry__pill/g) || []).length;
  if (javaPill !== 1) errors.push('Java card pill count changed');
  if (pythonPill !== 1) errors.push('Python card pill count must be exactly 1');

  // Python card must not be disabled/preparing
  if (/r6-course-strip__item--planned.*r8-python-course-entry/.test(homeWxml)) errors.push('Python card must not be planned/disabled state');

  // Khaki color preservation
  if (!/#9A7B48/.test(homeWxss)) errors.push('Python card missing khaki accent #9A7B48');
  if (!/#F4EBD8/.test(homeWxss)) errors.push('Python card missing khaki soft background #F4EBD8');
  if (!/#765A2B/.test(homeWxss)) errors.push('Python card missing khaki pill text #765A2B');

  // No green brand revert
  if (/#2f9e44|#eaf7ee/i.test(homeWxss)) errors.push('old Python brand green must not reappear');

  // Dynamic count verification
  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  const publicSummary = requireFresh(root, 'utils/python-public-course-summary.js', errors);
  if (sourceModule && sourceModule.pythonSourceManifest) {
    const visibleIds = (sourceModule.pythonSourceManifest.releaseVisibility || {}).visibleCourseLessonIds || [];
    const publicVisibleIds = (publicSummary && publicSummary.visibleLessonIds) || [];
    if (visibleIds.length !== publicVisibleIds.length) errors.push('source manifest visible count must match public projection, got ' + visibleIds.length + ' vs ' + publicVisibleIds.length);
    visibleIds.forEach((id, index) => {
      if (publicVisibleIds[index] !== id) errors.push('visible ID mismatch at ' + index + ': ' + id + ' vs ' + (publicVisibleIds[index] || '<missing>'));
    });
  }

  const summaryModule = requireFresh(root, 'packages/python-course/data/python-course-summary.js', errors);
  if (summaryModule) {
    const publicVisibleIds = (publicSummary && publicSummary.visibleLessonIds) || [];
    if (summaryModule.sectionCount !== publicVisibleIds.length) errors.push('Python summary sectionCount must match public projection length, got ' + summaryModule.sectionCount + ' vs ' + publicVisibleIds.length);
    if (summaryModule.sectionCount === 699) errors.push('Python summary sectionCount must not be 699 (total candidates)');
  }

  // Path description: check summary module directly (WXML uses {{}} interpolation)
  if (summaryModule) {
    const pathText = (summaryModule.titleJa || '') + ' ' + (summaryModule.titleZh || '');
    if (/函数|クラス|ファイル|项目实战|全栈|完整课程|699|精通/.test(pathText)) errors.push('Python path description mentions unpublished content');
    if (!/入門|入门|リスト|列表|条件分岐|条件分支/.test(pathText)) errors.push('Python path description missing current published scope');
  }
  // Also grep homeJs for hardcoded path references
  if (/699/.test(homeJs)) errors.push('699 must not appear in home.js data');
  if (/完整课程|全栈/.test(homeJs)) errors.push('full course claims must not appear in home.js');

  // GS1/GS2 hash
  const chapter = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (chapter && Array.isArray(chapter.lessons)) {
    const gs1 = chapter.lessons.find(l => l.lessonId === 'python-0007-gs1-run-visible-output');
    const gs2 = chapter.lessons.find(l => l.lessonId === 'python-0008-gs2-values-and-variables');
    if (digest(gs1 || {}) !== EXPECTED.gs1Hash) errors.push('GS1 learner-visible lesson hash changed');
    if (digest(gs2 || {}) !== EXPECTED.gs2Hash) errors.push('GS2 learner-visible lesson hash changed');
    const d1a1 = chapter.lessons.find(l => l.lessonId === 'python-0009-7d37969c-第-3-章-列表简介');
    const d1a2 = chapter.lessons.find(l => l.lessonId === 'python-0010-921b265b-第-4-章-操作列表');
    const d1a3 = chapter.lessons.find(l => l.lessonId === 'python-0011-5c80c609-第-5-章-if语句');
    if (digest(d1a1 || {}) !== EXPECTED.d1a1Hash) errors.push('Domain1A-1 learner-visible lesson hash changed');
    if (digest(d1a2 || {}) !== EXPECTED.d1a2Hash) errors.push('Domain1A-2 learner-visible lesson hash changed');
    if (digest(d1a3 || {}) !== EXPECTED.d1a3Hash) errors.push('Domain1A-3 learner-visible lesson hash changed');
  }

  // Khaki theme WXSS
  if (shaFile(root, 'packages/python-course/pages/home/home.wxss', errors) !== EXPECTED.pythonHomeWxssHash) errors.push('Python Home khaki wxss changed');

  // app.json, secondary-nav not modified
  if (shaFile(root, 'utils/secondary-navigation.js', errors) !== '5957801570A494BDB37D723BA9DD1AEF7C6B067EB363AFA85E26E529821FB415') errors.push('secondary navigation changed');

  // No global style injected
  if (homeWxml.includes('#9A7B48') || homeJs.includes('#9A7B48')) errors.push('khaki hex must only exist in Python card wxss, not in home WXML/JS');

  if (errors.length) {
    console.error('[Python home card structure contract] FAIL');
    errors.forEach(err => console.error('ERROR:', err));
    process.exit(1);
  }
  console.log('[Python home card structure contract] PASS: 0 errors, 0 warnings');
}

main();
