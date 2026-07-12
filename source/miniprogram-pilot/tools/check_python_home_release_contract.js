#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

const EXPECTED = {
  gs1Hash: '8E67A0E37E107A5E102DE4CBBA50FBC94656CDB056B3474750A57B6714619199',
  gs2Hash: 'C6028928DB1BDC2D27D9B90A522D7AEFFF6B121F0851937AC43B3D6576656FCF',
  sourceUnitsStableHash: 'B9AABA9126A5AEABEF473B2F6B0B0F4EB5798F6CB4E3BF57FB929ECC7305D97A',
  coverageHash: '7492487749078466FB9EE4141F65DE8356D20E7F0220BD676C70A9BC4F57D930',
  javaHomeRoute: '/packages/java-course/pages/home/home',
  pythonHomeRoute: '/packages/python-course/pages/home/home',
  gs1Route: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output',
  gs2Route: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables'
};

const BASELINE_COURSES = {
  itpass: {
    kind: 'exam',
    courseKind: 'certification',
    displayName: 'IT Passport',
    availability: 'available',
    route: '/pages/course/course?courseId=itpass'
  },
  sg: {
    kind: 'exam',
    courseKind: 'certification',
    displayName: 'SG 信息安全',
    availability: 'available',
    route: '/pages/course/course?courseId=sg'
  },
  mos365: {
    kind: 'certification',
    courseKind: 'legacy-practice',
    displayName: 'MOS 365',
    availability: 'unresolved'
  },
  java: {
    kind: 'language',
    courseKind: 'learning',
    displayName: 'Java',
    availability: 'planned'
  },
  algorithm: {
    kind: 'fundamentals',
    courseKind: 'learning',
    displayName: '算法基础',
    availability: 'planned'
  }
};

function parseArgs(argv) {
  const args = { root: ROOT };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      args.root = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function sha256(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing protected file: ' + rel);
    return '';
  }
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing module: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function assertNoRendererUnknownFields(lesson, label, errors) {
  const allowed = {
    lessonId: true,
    chapterId: true,
    order: true,
    source: true,
    title: true,
    objectives: true,
    prerequisites: true,
    blocks: true,
    terms: true,
    codeExamples: true,
    lineNotes: true,
    commonMistakes: true,
    handson: true,
    summary: true,
    nextLessonBridge: true
  };
  Object.keys(lesson || {}).forEach((key) => {
    if (!allowed[key]) errors.push(label + ' contains renderer-unconsumed field: ' + key);
  });
}

function captureRoute(nav, courseId) {
  const captured = { navigateTo: [], switchTab: [], toast: [] };
  global.wx = {
    navigateTo: function (opts) { captured.navigateTo.push(opts && opts.url); },
    switchTab: function (opts) { captured.switchTab.push(opts && opts.url); },
    showToast: function (opts) { captured.toast.push(opts && opts.title); }
  };
  nav.goCourseHome(courseId);
  delete global.wx;
  return captured;
}

function checkRegistryAndRoutes(root, errors) {
  const registry = requireFresh(root, 'utils/course-registry.js', errors);
  const nav = requireFresh(root, 'utils/navigation.js', errors);
  if (!registry || !nav) return;

  const python = registry.getCourseById('python');
  assert(!!python, 'home registry missing Python card', errors);
  if (python) {
    assert(python.kind === 'language', 'Python card kind changed', errors);
    assert(python.courseKind === 'learning', 'Python card courseKind changed', errors);
    assert(python.displayName === 'Python', 'Python card displayName changed', errors);
    assert(python.availability === 'available', 'Python card must be available, got ' + python.availability, errors);
    assert(!/planned|preparing|comingSoon|disabled|unresolved/.test(String(python.availability)), 'Python card still has disabled/preparing availability', errors);
  }

  Object.keys(BASELINE_COURSES).forEach((id) => {
    const expected = BASELINE_COURSES[id];
    const actual = registry.getCourseById(id);
    assert(!!actual, 'missing baseline course: ' + id, errors);
    if (!actual) return;
    ['kind', 'courseKind', 'displayName', 'availability'].forEach((key) => {
      assert(actual[key] === expected[key], id + ' ' + key + ' changed: expected ' + expected[key] + ' got ' + actual[key], errors);
    });
  });

  const pyRoute = captureRoute(nav, 'python');
  assert(pyRoute.navigateTo[0] === EXPECTED.pythonHomeRoute, 'goCourseHome("python") must navigate to ' + EXPECTED.pythonHomeRoute + ', got ' + (pyRoute.navigateTo[0] || pyRoute.switchTab[0] || pyRoute.toast[0] || '<none>'), errors);
  ['itpass', 'sg'].forEach((id) => {
    const route = captureRoute(nav, id);
    assert(route.navigateTo[0] === BASELINE_COURSES[id].route, 'goCourseHome("' + id + '") route changed', errors);
  });
}

function checkHomeFiles(root, errors) {
  const homeJs = read(root, 'pages/home/home.js', errors);
  const homeWxml = read(root, 'pages/home/home.wxml', errors);
  const homeWxss = read(root, 'pages/home/home.wxss', errors);

  assert(/registry\.getCoursesByKind\('language'\).*registry\.getCoursesByKind\('fundamentals'\)/s.test(homeJs), 'home language course list must still come from registry', errors);
  assert(/course\.id !== 'java'/.test(homeJs), 'home must keep Java out of generic languageCourses list', errors);
  assert(/bindtap="goToCourse"\s+data-course-id="\{\{item\.id\}\}"/.test(homeWxml), 'home Python card must keep goToCourse binding through registry item id', errors);
  assert(!/disabled/.test(homeWxml), 'home course strip must not add disabled state', errors);
  assert(!/Python\s*\/\s*算法基础准备中/.test(homeWxml), 'home still says Python / 算法基础准备中', errors);
  assert(!/Python[^<\n\r]*准备中|准备中[^<\n\r]*Python/.test(homeWxml), 'home still labels Python as preparing', errors);
  assert(/算法基础准备中/.test(homeWxml), 'algorithm planned badge should remain honest', errors);
  assert(/Java\s*\/\s*Python\s*已开放/.test(homeWxml), 'course section meta must state Java / Python 已开放', errors);
  assert(homeJs.includes(EXPECTED.javaHomeRoute), 'Java home route changed or missing', errors);
    // Khaki hex allowed only when scoped within .r8-python-course-entry, never for global home styles
  var khakiMentions = (homeWxss.match(/#9A7B48/g) || []).length;
  var scopedEntryMentions = (homeWxss.match(/\.r8-python-course-entry\b/g) || []).length;
  assert(scopedEntryMentions > 0, 'Python card scoped styles missing from home wxss', errors);
  assert(!homeWxss.includes('--python-khaki'), 'global home wxss must not use Python khaki CSS variables', errors);
  assert(khakiMentions === 0 || scopedEntryMentions > 0, 'khaki hex #9A7B48 must only appear within scoped Python card entry', errors);
  assert(!/#2f9e44|#eaf7ee/i.test(homeWxml + '\n' + homeJs + '\n' + homeWxss), 'old Python brand green injected into home card', errors);
}

function checkPythonRoutesAndVisibility(root, errors) {
  const appJson = JSON.parse(read(root, 'app.json', errors) || '{}');
  const pythonPackage = (appJson.subpackages || []).find((pkg) => pkg.root === 'packages/python-course');
  assert(!!pythonPackage, 'app.json missing Python subpackage', errors);
  if (pythonPackage) {
    ['pages/home/home', 'pages/chapter/chapter', 'pages/lesson/lesson'].forEach((page) => {
      assert((pythonPackage.pages || []).includes(page), 'Python subpackage missing route: ' + page, errors);
    });
  }

  const loader = requireFresh(root, 'packages/python-course/utils/python-course-loader.js', errors);
  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  if (!loader || !sourceModule) return;
  const manifest = loader.getManifest();
  const sourceManifest = sourceModule.pythonSourceManifest;
  assert(manifest && manifest.courseId === 'python', 'Python Home manifest must load courseId=python', errors);
  const chapter = loader.getChapterWithLessons('python-gs-ch01');
  assert(!!chapter, 'Python Home must resolve python-gs-ch01', errors);
  assert(loader.getFirstLessonRoute() === EXPECTED.gs1Route, 'GS1 first route changed', errors);
  assert(!!loader.getLessonById('python-gs-ch01', 'python-0007-gs1-run-visible-output'), 'GS1 no longer resolves', errors);
  assert(!!loader.getLessonById('python-gs-ch01', 'python-0008-gs2-values-and-variables'), 'GS2 no longer resolves', errors);
  assert(loader.getLessonById('python-gs-ch01', 'missing') === null, 'missing lesson should remain controlled null/error state', errors);

  const visibleFromManifest = [];
  (manifest.chapters || []).forEach((ch) => {
    (ch.sections || []).forEach((section) => visibleFromManifest.push(section.lessonId));
  });
  const visibleFromSource = (sourceManifest.courseLessons || [])
    .filter((lesson) => lesson.visibility === 'visible')
    .map((lesson) => lesson.courseLessonId);
  assert(visibleFromManifest.length > 0, 'Python Home has no visible sections', errors);
  assert(visibleFromManifest.every((id) => visibleFromSource.includes(id)), 'Python Home includes a non-visible source lesson: ' + visibleFromManifest.join(', '), errors);
  assert(visibleFromSource.every((id) => visibleFromManifest.includes(id)), 'source manifest visible lesson missing from Python Home: ' + visibleFromSource.filter((id) => !visibleFromManifest.includes(id)).join(', '), errors);
  const plannedVisible = (sourceManifest.courseLessons || [])
    .filter((lesson) => lesson.visibility !== 'visible' && visibleFromManifest.includes(lesson.courseLessonId));
  assert(plannedVisible.length === 0, 'planned/internal lesson displayed in Python Home: ' + plannedVisible.map((l) => l.courseLessonId).join(', '), errors);

  assert(sourceManifest.coverage && sourceManifest.coverage.deepestSourceUnitCount === 790, 'sourceUnits count drifted', errors);
  assert(sourceManifest.coverage && sourceManifest.coverage.lessonCandidateCount === 699, 'lesson_candidate count drifted', errors);
  assert(sourceManifest.coverage && sourceManifest.coverage.explicitExclusionCount === 74, 'explicit exclusions count drifted', errors);
  assert(digest(sourceManifest.coverage) === EXPECTED.coverageHash, 'source manifest coverage hash drifted', errors);
  const stableSourceUnits = (sourceManifest.sourceUnits || []).map((u) => ({
    sourceUnitId: u.sourceUnitId,
    sourceOrder: u.sourceOrder,
    tocPath: u.tocPath,
    title: u.title,
    displayTitle: u.displayTitle,
    depth: u.depth,
    parentSourceUnitId: u.parentSourceUnitId,
    type: u.type
  }));
  assert(digest(stableSourceUnits) === EXPECTED.sourceUnitsStableHash, 'sourceUnits stable IDs/order/tocPath drifted', errors);

  (chapter.lessons || []).forEach((lesson) => assertNoRendererUnknownFields(lesson, lesson.lessonId || '<unknown lesson>', errors));
}

function checkProtectedContent(root, errors) {
  const chapter = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (chapter && Array.isArray(chapter.lessons)) {
    const gs1 = chapter.lessons.find((lesson) => lesson.lessonId === 'python-0007-gs1-run-visible-output');
    const gs2 = chapter.lessons.find((lesson) => lesson.lessonId === 'python-0008-gs2-values-and-variables');
    assert(digest(gs1 || {}) === EXPECTED.gs1Hash, 'Python GS1 learner-visible data hash changed', errors);
    assert(digest(gs2 || {}) === EXPECTED.gs2Hash, 'Python GS2 learner-visible data hash changed', errors);
  }
  const lessonText = read(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  assert(!/knowledgePoints/.test(lessonText), 'knowledgePoints must not exist in Python lesson data', errors);
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  checkRegistryAndRoutes(root, errors);
  checkHomeFiles(root, errors);
  checkPythonRoutesAndVisibility(root, errors);
  checkProtectedContent(root, errors);

  if (errors.length || warnings.length) {
    console.error('[Python home release contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    warnings.forEach((warn) => console.error('WARNING:', warn));
    process.exit(1);
  }
  console.log('[Python home release contract] PASS: 0 errors, 0 warnings');
}

main();
