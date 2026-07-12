#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OLD_ROOT = 'packages/python-course';
const SHARD_ROOT = 'packages/python-course-foundations-b';
const TRAIN_SCOPE = [
  {
    domainKey: 'r8-train1-input-while',
    sourceOrder: 13,
    sourceUnitId: 'py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环',
    courseLessonId: 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环',
    tocPath: 'Python编程：从入门到实践（第2版） > 第 7 章 用户输入和while循环'
  },
  {
    domainKey: 'r8-train1-functions',
    sourceOrder: 14,
    sourceUnitId: 'py-src-0014-75c7d812-第-8-章-函数',
    courseLessonId: 'python-0014-75c7d812-第-8-章-函数',
    tocPath: 'Python编程：从入门到实践（第2版） > 第 8 章 函数'
  },
  {
    domainKey: 'r8-train1-class',
    sourceOrder: 15,
    sourceUnitId: 'py-src-0015-0f96233e-第-9-章-类',
    courseLessonId: 'python-0015-0f96233e-第-9-章-类',
    tocPath: 'Python编程：从入门到实践（第2版） > 第 9 章 类'
  }
];
const FIRST_UNSELECTED = {
  sourceOrder: 16,
  courseLessonId: 'python-0016-3a01ec9d-第-10-章-文件和异常'
};
const OLD_HASHES = {
  'python-0007-gs1-run-visible-output': '8E67A0E37E107A5E102DE4CBBA50FBC94656CDB056B3474750A57B6714619199',
  'python-0008-gs2-values-and-variables': 'C6028928DB1BDC2D27D9B90A522D7AEFFF6B121F0851937AC43B3D6576656FCF',
  'python-0009-7d37969c-第-3-章-列表简介': '6FE237D87A66BC1FFBDC060EC545674D2E8369306BF85A6658EA1DC6D4D0E14B',
  'python-0010-921b265b-第-4-章-操作列表': '587B8E1F3393EAD1757470EA574E143F82187F38606E04D5470C7C5DE12BB6E6',
  'python-0011-5c80c609-第-5-章-if语句': '8592BB4E6F87827CBABA452941A3F246C673D23AF40733292F7793AD639A4DCB',
  'python-0012-5cc0ecc6-第-6-章-字典': 'AEC6FFA42F105D1A84EFC46D544FF7CC56F0206072EE26336B8C863448C3310A'
};
const OLD_VISIBLE_IDS = Object.keys(OLD_HASHES);
const FORBIDDEN_CODE = [
  /\bopen\s*\(/,
  /\brequests\b/,
  /\bsubprocess\b/,
  /\bos\.system\b/,
  /\bsocket\b/,
  /\bpip\b/,
  /\bsleep\s*\(/,
  /\brandom\b/,
  /\btime\b/,
  /https?:\/\//,
  /\b__import__\b/,
  /\beval\s*\(/,
  /\bexec\s*\(/
];
const FORBIDDEN_DATA = /sourceUnitId|courseLessonId|sourceOrder|tocPath|EPUB|spineHref|href|anchor|knowledgePoints|questionBank|correctAnswer|options|SRS|Quiz/i;

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

function fail(errors, message) {
  errors.push(message);
}

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(errors, 'missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(errors, 'missing module: ' + rel);
    return null;
  }
  try {
    delete require.cache[require.resolve(file)];
    return require(file);
  } catch (err) {
    fail(errors, 'cannot require ' + rel + ': ' + err.message);
    return null;
  }
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function normalizeOutput(value) {
  return String(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n$/, '');
}

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

function findUvPython311() {
  const appData = process.env.APPDATA;
  if (!appData) return null;
  const base = path.join(appData, 'uv', 'python');
  if (!fs.existsSync(base)) return null;
  const matches = fs.readdirSync(base).filter((name) => /^cpython-3\.11\./.test(name)).sort().reverse();
  for (const name of matches) {
    const exe = path.join(base, name, 'python.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

function runPython(code, stdinText) {
  const candidates = [];
  if (process.env.PYTHON) candidates.push({ command: process.env.PYTHON, args: [] });
  const uvPython = findUvPython311();
  if (uvPython) candidates.push({ command: uvPython, args: [] });
  candidates.push({ command: 'py', args: ['-3.11'] });
  candidates.push({ command: 'python', args: [] });
  for (const candidate of candidates) {
    const result = cp.spawnSync(candidate.command, candidate.args.concat(['-c', code]), {
      input: stdinText || '',
      encoding: 'utf8',
      timeout: 3000,
      windowsHide: true
    });
    if (!result.error || result.error.code !== 'ENOENT') return result;
  }
  return { status: 127, stdout: '', stderr: 'Python 3.11 runner not found' };
}

function visibleIdsFromManifest(manifest) {
  const ids = [];
  (manifest.chapters || []).forEach((chapter) => {
    (chapter.sections || []).forEach((section) => ids.push(section.lessonId));
  });
  return ids;
}

function collectRuntimeJs(root, dir, out) {
  out = out || [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (rel.startsWith('.git/') || rel.startsWith('tools/') || rel.startsWith('docs/') || rel.startsWith('scratch/') || rel.startsWith('artifacts/')) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) collectRuntimeJs(root, full, out);
    else if (/\.js$/.test(name)) out.push({ rel, full });
  }
  return out;
}

function checkArchitecture(root, errors) {
  const app = JSON.parse(read(root, 'app.json', errors) || '{}');
  const packages = app.subpackages || [];
  const legacy = packages.find((pkg) => pkg.root === OLD_ROOT);
  const shard = packages.find((pkg) => pkg.root === SHARD_ROOT);
  if (!legacy) fail(errors, 'app.json missing legacy Python package');
  if (!shard) fail(errors, 'app.json missing Train1 Python shard');
  if (shard) {
    ['pages/chapter/chapter', 'pages/lesson/lesson'].forEach((page) => {
      if (!(shard.pages || []).includes(page)) fail(errors, 'new shard route missing: ' + page);
    });
  }
  const shardLessonWxml = read(root, SHARD_ROOT + '/pages/lesson/lesson.wxml', errors);
  if (!/sampleInput/.test(shardLessonWxml) || !/入力例/.test(shardLessonWxml) || !/输入示例/.test(shardLessonWxml)) {
    fail(errors, 'new shard renderer must visibly consume sampleInput');
  }

  collectRuntimeJs(root, root).forEach((file) => {
    const text = fs.readFileSync(file.full, 'utf8');
    if (!file.rel.startsWith('packages/') && /require\s*\([^)]*packages\/python-course/.test(text)) {
      fail(errors, 'main package require graph enters Python package: ' + file.rel);
    }
    if (file.rel.startsWith(OLD_ROOT + '/') && /require\s*\([^)]*python-course-foundations-b/.test(text)) {
      fail(errors, 'old Python package requires new shard data: ' + file.rel);
    }
  });
}

function checkVisibility(root, sourceManifest, oldManifest, shardManifest, errors) {
  const summary = requireFresh(root, 'utils/python-public-course-summary.js', errors) || {};
  const sourceVisible = (sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || [];
  const publicVisible = summary.visibleLessonIds || [];
  const oldVisible = visibleIdsFromManifest(oldManifest || {});
  const shardVisible = visibleIdsFromManifest(shardManifest || {});
  if (!arraysEqual(sourceVisible, publicVisible)) fail(errors, 'source releaseVisibility and public projection differ');
  if (!arraysEqual(publicVisible, oldVisible)) fail(errors, 'public projection and Python legacy manifest differ');
  const newVisible = TRAIN_SCOPE.filter((item) => sourceVisible.includes(item.courseLessonId)).map((item) => item.courseLessonId);
  const expectedVisible = OLD_VISIBLE_IDS.concat(TRAIN_SCOPE.slice(0, newVisible.length).map((item) => item.courseLessonId));
  if (!arraysEqual(sourceVisible, expectedVisible)) {
    fail(errors, 'visible lessons must equal old six plus frozen Train1 prefix');
  }
  if (!arraysEqual(newVisible, shardVisible)) fail(errors, 'new shard manifest sections must equal visible Train1 lessons');
  const expectedPrefix = TRAIN_SCOPE.slice(0, newVisible.length).map((item) => item.courseLessonId);
  if (!arraysEqual(newVisible, expectedPrefix)) fail(errors, 'Train1 published lessons must be a contiguous prefix from sourceOrder 13');
  if (newVisible.length > 12) fail(errors, 'Train1 new lessons exceeds 12');
  if (new Set(newVisible.map((id) => TRAIN_SCOPE.find((item) => item.courseLessonId === id).domainKey)).size > 8) {
    fail(errors, 'Train1 domains exceeds 8');
  }
  if (sourceVisible.includes(FIRST_UNSELECTED.courseLessonId)) fail(errors, 'deferred sourceOrder 16 must not be visible');
  if (newVisible.length === 0) fail(errors, 'Train1 checker expected at least one published Train lesson');
}

function checkOldHashes(root, errors) {
  const oldChapter = requireFresh(root, OLD_ROOT + '/data/chapters/python-gs-ch01.js', errors);
  const lessons = oldChapter && oldChapter.lessons || [];
  Object.keys(OLD_HASHES).forEach((id) => {
    const lesson = lessons.find((item) => item.lessonId === id);
    if (digest(lesson || {}) !== OLD_HASHES[id]) fail(errors, 'old accepted lesson hash changed: ' + id);
  });
}

function checkSourceMapping(sourceManifest, ledger, errors) {
  if (!sourceManifest.coverage || sourceManifest.coverage.deepestSourceUnitCount !== 790) fail(errors, 'source map deepestSourceUnitCount drifted');
  if (!sourceManifest.coverage || sourceManifest.coverage.lessonCandidateCount !== 699) fail(errors, 'source map lessonCandidateCount drifted');
  if (!sourceManifest.coverage || sourceManifest.coverage.parentGroupOnlyCount !== 17) fail(errors, 'source map parentGroupOnlyCount drifted');
  if (!sourceManifest.coverage || sourceManifest.coverage.explicitExclusionCount !== 74) fail(errors, 'source map explicitExclusionCount drifted');
  const entries = ledger.entries || [];
  TRAIN_SCOPE.forEach((spec) => {
    const lesson = (sourceManifest.courseLessons || []).find((item) => item.courseLessonId === spec.courseLessonId);
    const entry = entries.find((item) => item.courseLessonId === spec.courseLessonId);
    if (!lesson) fail(errors, 'missing source courseLesson: ' + spec.courseLessonId);
    if (lesson && (lesson.sourceUnitId !== spec.sourceUnitId || lesson.sourceOrder !== spec.sourceOrder)) fail(errors, 'source mapping drifted: ' + spec.courseLessonId);
    if (lesson && lesson.originalTocPath !== spec.tocPath) fail(errors, 'courseLesson tocPath drifted: ' + spec.courseLessonId);
    const unit = (sourceManifest.sourceUnits || []).find((item) => item.sourceUnitId === spec.sourceUnitId);
    const unitTocPath = unit && Array.isArray(unit.tocPath) ? unit.tocPath.join(' > ') : '';
    if (unitTocPath !== spec.tocPath) fail(errors, 'sourceUnit tocPath drifted: ' + spec.sourceUnitId);
    if (lesson && lesson.visibility === 'visible' && lesson.status !== 'published') fail(errors, 'visible Train lesson is not source published: ' + spec.courseLessonId);
    if (entry && lesson && lesson.visibility === 'visible' && entry.packageTarget !== SHARD_ROOT) fail(errors, 'published Train lesson ledger packageTarget must be new shard: ' + spec.courseLessonId);
  });
  const first = entries.find((item) => item.courseLessonId === FIRST_UNSELECTED.courseLessonId);
  if (first && first.status !== 'deferred_asset_required') fail(errors, 'first unselected sourceOrder 16 must be deferred_asset_required');
}

function checkLessonQuality(lesson, spec, errors) {
  const label = lesson && lesson.lessonId || spec.courseLessonId;
  if (!lesson) {
    fail(errors, 'missing Train lesson data: ' + spec.courseLessonId);
    return;
  }
  const raw = JSON.stringify(lesson);
  if (FORBIDDEN_DATA.test(raw)) fail(errors, label + ' leaks source metadata or forbidden quiz/SRS fields');
  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) fail(errors, label + ' missing bilingual title');
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 2) fail(errors, label + ' needs at least 2 objectives');
  if (!Array.isArray(lesson.prerequisites) || !lesson.prerequisites.length) fail(errors, label + ' missing prerequisites');
  const blocks = lesson.blocks || [];
  blocks.forEach((block) => {
    if (!block.ja || !block.zh || !block.title || !block.title.ja || !block.title.zh) fail(errors, label + ' block missing bilingual content');
  });
  if (!blocks.some((block) => block.type === 'why')) fail(errors, label + ' missing why block');
  if (!blocks.some((block) => block.type === 'mental-model')) fail(errors, label + ' missing mental-model block');
  if (!blocks.some((block) => block.type === 'execution-flow')) fail(errors, label + ' missing execution-flow block');
  if (!Array.isArray(lesson.terms) || lesson.terms.length < 3) fail(errors, label + ' needs at least 3 terms');
  (lesson.terms || []).forEach((term) => {
    if (!term.ja || !term.zh || !term.en) fail(errors, label + ' term missing ja/zh/en');
  });
  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 3) fail(errors, label + ' needs at least 3 commonMistakes');
  if (!lesson.handson || !lesson.handson.expectedObservation || !lesson.handson.expectedObservation.ja || !lesson.handson.expectedObservation.zh) {
    fail(errors, label + ' missing handson expected observation');
  }
  if (!lesson.nextLessonBridge || !lesson.nextLessonBridge.ja || !lesson.nextLessonBridge.zh) fail(errors, label + ' missing nextLessonBridge');
  const examples = lesson.codeExamples || [];
  if (!examples.length) fail(errors, label + ' missing codeExamples');
  examples.forEach((example) => {
    const code = String(example.code || '');
    FORBIDDEN_CODE.forEach((pattern) => {
      if (pattern.test(code)) fail(errors, label + '/' + (example.exampleId || 'example') + ' contains forbidden code pattern ' + pattern);
    });
    const hasInput = /\binput\s*\(/.test(code);
    if (hasInput && (typeof example.sampleInput !== 'string' || !example.sampleInput)) fail(errors, label + ' input example missing sampleInput');
    if (!hasInput && example.sampleInput !== undefined) fail(errors, label + ' non-input example must not include sampleInput');
    if (!Array.isArray(example.lineNotes) || example.lineNotes.length < 4) fail(errors, label + ' example needs at least 4 lineNotes');
    const stdin = hasInput ? (example.sampleInput.endsWith('\n') ? example.sampleInput : example.sampleInput + '\n') : '';
    const result = runPython(code, stdin);
    if (result.status !== 0 || result.error || result.signal) {
      fail(errors, label + ' Python execution failed: ' + (result.stderr || (result.error && result.error.message) || result.signal || result.status));
    } else if (normalizeOutput(result.stdout) !== normalizeOutput(example.expectedOutput)) {
      fail(errors, label + ' stdout mismatch: expected ' + JSON.stringify(normalizeOutput(example.expectedOutput)) + ', got ' + JSON.stringify(normalizeOutput(result.stdout)));
    }
  });
}

function checkTemplateSignals(lessons, errors) {
  const why = new Set();
  const hands = new Set();
  const bridges = new Set();
  const codes = new Set();
  lessons.forEach((lesson) => {
    const whyBlock = (lesson.blocks || []).find((block) => block.type === 'why') || {};
    if (why.has(whyBlock.ja)) fail(errors, 'duplicate why text across Train lessons');
    why.add(whyBlock.ja);
    const hand = lesson.handson && lesson.handson.ja;
    if (hands.has(hand)) fail(errors, 'duplicate handson text across Train lessons');
    hands.add(hand);
    const bridge = lesson.nextLessonBridge && lesson.nextLessonBridge.ja;
    if (bridges.has(bridge)) fail(errors, 'duplicate bridge text across Train lessons');
    bridges.add(bridge);
    const code = lesson.codeExamples && lesson.codeExamples[0] && lesson.codeExamples[0].code;
    if (codes.has(code)) fail(errors, 'duplicate code behavior across Train lessons');
    codes.add(code);
  });
}

function checkPackageScale(root, errors) {
  const result = cp.spawnSync('node', ['tools/check_python_package_scale_contract.js', '--root', root], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true
  });
  if (result.status !== 0) fail(errors, 'package scale contract failed: ' + (result.stdout + result.stderr).split(/\r?\n/).slice(0, 8).join(' | '));
}

function checkDocs(root, errors) {
  read(root, 'docs/python-course/22_python_shard_train1_scope_audit.md', errors);
  read(root, 'docs/python-course/23_python_shard_train1_devtools_card.md', errors);
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  checkArchitecture(root, errors);
  const sourceModule = requireFresh(root, OLD_ROOT + '/data/python-source-manifest.js', errors);
  const oldManifestModule = requireFresh(root, OLD_ROOT + '/data/python-course-manifest.js', errors);
  const shardManifestModule = requireFresh(root, SHARD_ROOT + '/data/python-foundations-b-manifest.js', errors);
  const shardChapter = requireFresh(root, SHARD_ROOT + '/data/chapters/python-foundations-b-ch01.js', errors);
  const ledgerModule = requireFresh(root, 'tools/python-full-course-release-ledger.js', errors);
  const sourceManifest = sourceModule && sourceModule.pythonSourceManifest;
  const oldManifest = oldManifestModule && oldManifestModule.manifest;
  const shardManifest = shardManifestModule && shardManifestModule.manifest;
  const ledger = ledgerModule && ledgerModule.buildPythonFullCourseReleaseLedger ? ledgerModule.buildPythonFullCourseReleaseLedger(root) : {};

  if (sourceManifest) {
    checkVisibility(root, sourceManifest, oldManifest, shardManifest, errors);
    checkSourceMapping(sourceManifest, ledger, errors);
  }
  checkOldHashes(root, errors);
  const lessonsById = new Map(((shardChapter && shardChapter.lessons) || []).map((lesson) => [lesson.lessonId, lesson]));
  const visibleTrain = TRAIN_SCOPE
    .filter((spec) => sourceManifest && ((sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || []).includes(spec.courseLessonId))
    .map((spec) => lessonsById.get(spec.courseLessonId))
    .filter(Boolean);
  TRAIN_SCOPE.forEach((spec) => {
    if (sourceManifest && ((sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || []).includes(spec.courseLessonId)) {
      checkLessonQuality(lessonsById.get(spec.courseLessonId), spec, errors);
    }
  });
  checkTemplateSignals(visibleTrain, errors);
  checkPackageScale(root, errors);
  checkDocs(root, errors);

    // F2 sub-contract: WXSS import resolution
  const wxssResult = cp.spawnSync('node', [path.join(__dirname, 'check_python_shard_wxss_import_contract.js'), '--root', root], { encoding: 'utf8', windowsHide: true });
  if (wxssResult.status !== 0) {
    errors.push('shard WXSS import resolution failed: ' + (wxssResult.stderr || wxssResult.stdout || '').trim().slice(0, 200));
  }

  // WXSS-RUNTIME-F2 sub-contract: style isolation (no cross-package WXSS imports)
  const styleResult = cp.spawnSync('node', [path.join(__dirname, 'check_python_shard_style_isolation_contract.js'), '--root', root], { encoding: 'utf8', windowsHide: true });
  if (styleResult.status !== 0) {
    errors.push('SHARD_STYLE_ISOLATION_PASS failed: ' + (styleResult.stderr || styleResult.stdout || '').trim().slice(0, 200));
  }

if (warnings.length) fail(errors, 'warnings are not allowed: ' + warnings.join('; '));
  if (errors.length) {
    console.error('[Python shard Train1 contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    process.exit(1);
  }
  console.log('[Python shard Train1 contract] PASS: 0 errors, 0 warnings');
}

main();
