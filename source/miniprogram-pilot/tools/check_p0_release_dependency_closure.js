#!/usr/bin/env node
'use strict';

/*
 * Verifies the P0 release path is self-contained without bilingual drafts or
 * cross-subpackage runtime shims. `--staged` reads the index, so the same gate
 * can audit the exact candidate before a release commit; default reads files.
 */

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var JSON_MODE = process.argv.indexOf('--json') !== -1;
var STAGED_MODE = process.argv.indexOf('--staged') !== -1;
var failures = [];
var checkedFiles = [];
var maskedP1HoldPaths = [];

var DATA_PACKAGE_NAMES = [
  'quiz-itpass-1', 'quiz-itpass-2', 'quiz-itpass-3', 'quiz-itpass-4', 'quiz-itpass-5',
  'quiz-sg-1', 'quiz-sg-2'
];

function normalize(rel) {
  return String(rel).replace(/\\/g, '/');
}

function fail(rule, file, message) {
  failures.push({ rule: rule, file: normalize(file || ''), message: message || rule });
}

function fileExists(rel) {
  if (STAGED_MODE) {
    var result = childProcess.spawnSync('git', ['cat-file', '-e', ':' + normalize(rel)], {
      cwd: ROOT,
      encoding: 'utf8'
    });
    return result.status === 0;
  }
  return fs.existsSync(path.join(ROOT, rel));
}

function readGitBlob(revision, rel) {
  var result = childProcess.spawnSync('git', ['show', revision + ':' + normalize(rel)], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024
  });
  if (result.status !== 0) return null;
  return result.stdout;
}

function shouldMaskP1HoldLoader(rel) {
  if (STAGED_MODE || !/^packages\/quiz-(?:itpass-[1-5]|sg-[1-2])\/data\/loader\.js$/.test(normalize(rel))) return false;
  var working = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (!/translations_zh/.test(working)) return false;
  var head = readGitBlob('HEAD', rel);
  return !!head && !/translations_zh/.test(head);
}

function readFile(rel) {
  var normalized = normalize(rel);
  checkedFiles.push(normalized);
  if (STAGED_MODE) {
    var staged = readGitBlob('', normalized);
    if (staged === null) throw new Error('Unable to read staged file: ' + rel);
    return staged;
  }
  if (shouldMaskP1HoldLoader(normalized)) {
    if (maskedP1HoldPaths.indexOf(normalized) === -1) maskedP1HoldPaths.push(normalized);
    return readGitBlob('HEAD', normalized);
  }
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function listJsFiles(relDir) {
  if (STAGED_MODE) {
    var listed = childProcess.spawnSync('git', ['ls-files', '-s', '--', normalize(relDir)], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024
    });
    if (listed.status !== 0) return [];
    return listed.stdout.split(/\r?\n/).filter(Boolean).map(function (line) {
      var tab = line.indexOf('\t');
      return tab >= 0 ? line.slice(tab + 1) : '';
    }).filter(function (rel) { return rel.endsWith('.js'); });
  }

  var output = [];
  function walk(directory) {
    if (!fs.existsSync(directory)) return;
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.ai-bridge' || entry.name === 'test-artifacts') return;
      var full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && entry.name.endsWith('.js')) output.push(normalize(path.relative(ROOT, full)));
    });
  }
  walk(path.join(ROOT, relDir));
  return output;
}

function resolveRelativeRequire(owner, request) {
  var base = path.resolve(ROOT, path.dirname(owner), request);
  var candidates = [base, base + '.js', path.join(base, 'index.js')];
  for (var i = 0; i < candidates.length; i++) {
    var rel = normalize(path.relative(ROOT, candidates[i]));
    if (fileExists(rel)) return true;
  }
  return false;
}

function checkStaticRequires(files) {
  files.forEach(function (rel) {
    var text;
    try { text = readFile(rel); } catch (error) { fail('READ_FAILED', rel, error.message); return; }
    var staticRequire = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    var match;
    while ((match = staticRequire.exec(text))) {
      var request = match[1];
      if (request.indexOf('.') === 0 && !resolveRelativeRequire(rel, request)) {
        fail('MISSING_RELATIVE_REQUIRE_TARGET', rel, request);
      }
    }
    var stripped = text.replace(/require\s*\(\s*['"][^'"]+['"]\s*\)/g, '');
    if (/require\s*\(/.test(stripped)) fail('DYNAMIC_REQUIRE', rel, 'All release requires must have a static string target');
  });
}

function checkNoP1RuntimeDependency(files) {
  var p1Pattern = /(?:translations_zh\.js|translations_zh|review-batches|generate_flashcard_translations|prepare_flashcard_bilingual_review_batch|check_flashcard_bilingual_integrity|report_flashcard_bilingual_batch_budget|audit_flashcard_package_budget)/;
  files.forEach(function (rel) {
    var text = readFile(rel);
    if (p1Pattern.test(text)) fail('P1_RUNTIME_DEPENDENCY', rel, 'P0 release code refers to a P1 bilingual asset or tool');
  });
}

function checkFlashcardCenter() {
  var rel = 'pages/flashcards/flashcards.js';
  var text = readFile(rel);
  // R3.4: manifest is now read through utils/flashcards-state.js instead of the page directly
  var stateText = readFile('utils/flashcards-state.js');
  if (!/flashcard-summary-manifest/.test(text) && !/flashcard-summary-manifest/.test(stateText))
    fail('CENTER_MISSING_LIGHTWEIGHT_MANIFEST', rel, 'Flashcard center must read the summary manifest (via page or flashcards-state)');
  if (/wx\.loadSubPackage|flashcard_adapter|flashcard-export|getAllQuestions|\/data\/loader|require\s*\([^)]*quiz-(?:itpass|sg)-/.test(text)) {
    fail('CENTER_EAGER_OR_CROSS_PACKAGE_LOAD', rel, 'Center may only show summary and navigate to deck-select');
  }
}

function checkDeckSelect() {
  var rel = 'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js';
  var text = readFile(rel);
  // Strip only the exact _applyTheme method (R21 dark mode) before checking for getApp/globalData
  var stripped = text.replace(/_applyTheme\s*:\s*function\s*\(\s*\)\s*\{[\s\S]*?\n\s*\}/g, '');
  if (!/wx\.loadSubPackage\s*\(\s*\{/.test(text)) fail('DECK_SELECT_MISSING_REAL_SUBPACKAGE_LOAD', rel, 'Expected wx.loadSubPackage({ name })');
  if (!/name\s*:\s*deckInfo\.packageName/.test(text)) fail('DECK_SELECT_MISSING_PACKAGE_NAME', rel, 'Expected manifest packageName to drive loadSubPackage');
  if (!/success\s*:\s*function\s*\(\)\s*\{[\s\S]{0,500}navigateToPlayer\s*\(/.test(text)) {
    fail('DECK_SELECT_NO_SUCCESS_NAVIGATION', rel, 'Player navigation must occur after loadSubPackage success');
  }
  if (/loadSubPackage\s*=|function\s+loadSubPackage|EventChannel|flashcard-bridge|navigateTo-fallback/.test(stripped) ||
      /getApp\s*\(/.test(stripped) || /\.globalData/.test(stripped)) {
    fail('DECK_SELECT_SHIM_OR_CACHE_BRIDGE', rel, 'No shim, EventChannel, global cache, bridge route, or optimistic fallback is allowed');
  }
  if (!/deckId=/.test(text) || !/backCourse=/.test(text) || !/backPath=/.test(text)) {
    fail('DECK_SELECT_ROUTE_METADATA_INCOMPLETE', rel, 'Route must pass deckId, backCourse and backPath only');
  }
}

function checkNoCrossPackageLoaders() {
  var quizFiles = listJsFiles('packages/quiz');
  quizFiles.forEach(function (rel) {
    var text = readFile(rel);
    if (/packages\/quiz-(?:itpass|sg)-[^'"\s]*\/data\/loader|quiz-(?:itpass|sg)-[^'"\s]*\/data\/loader/.test(text)) {
      fail('QUIZ_CROSS_PACKAGE_LOADER', rel, 'Main quiz package must not require a sibling data loader');
    }
  });
}

function checkNoSilentEmptyDeck() {
  var loaderFiles = DATA_PACKAGE_NAMES.map(function (name) { return 'packages/' + name + '/data/loader.js'; });
  loaderFiles.forEach(function (rel) {
    if (!fileExists(rel)) { fail('MISSING_PACKAGE_LOADER', rel, 'Expected local package loader'); return; }
    var text = readFile(rel);
    if (/catch\s*\([^)]*\)\s*\{[\s\S]{0,180}return\s*\[\s*\]/.test(text)) {
      fail('SILENT_EMPTY_DECK_FALLBACK', rel, 'Loader may not catch an error and return an empty deck');
    }
  });
}

function checkAppRegistry() {
  var appJson;
  try { appJson = JSON.parse(readFile('app.json')); } catch (error) { fail('APP_JSON_INVALID', 'app.json', error.message); return; }
  var subpackages = appJson.subpackages || appJson.subPackages || [];
  var names = {};
  var roots = {};
  subpackages.forEach(function (pkg) {
    if (!pkg || !pkg.name || !pkg.root) { fail('SUBPACKAGE_INVALID', 'app.json', 'Subpackage needs name and root'); return; }
    if (names[pkg.name]) fail('SUBPACKAGE_NAME_DUPLICATE', 'app.json', pkg.name);
    if (roots[pkg.root]) fail('SUBPACKAGE_ROOT_DUPLICATE', 'app.json', pkg.root);
    names[pkg.name] = true;
    roots[pkg.root] = true;
  });

  DATA_PACKAGE_NAMES.forEach(function (name) {
    var found = subpackages.filter(function (pkg) { return pkg.name === name; })[0];
    if (!found) { fail('DATA_SUBPACKAGE_NOT_REGISTERED', 'app.json', name); return; }
    var playerPage = 'pages/flashcard-player/flashcard-player';
    if (!Array.isArray(found.pages) || found.pages.indexOf(playerPage) === -1) {
      fail('PLAYER_ROUTE_NOT_REGISTERED', 'app.json', name + ':' + playerPage);
    }
    var playerFile = normalize(path.join(found.root, playerPage + '.js'));
    if (!fileExists(playerFile)) fail('PLAYER_FILE_MISSING', playerFile, name);
  });
}

function checkPlayersNoP1OrEagerCourseLoad() {
  DATA_PACKAGE_NAMES.forEach(function (name) {
    var rel = 'packages/' + name + '/pages/flashcard-player/flashcard-player.js';
    if (!fileExists(rel)) return;
    var text = readFile(rel);
    // Strip only the exact _applyTheme method (R21 dark mode) before checking for getApp/globalData
    var stripped = text.replace(/_applyTheme\s*:\s*function\s*\(\s*\)\s*\{[\s\S]*?\n\s*\}/g, '');
    if (/translations_zh|review-batches|flashcard-bridge|EventChannel/.test(text) ||
        /getApp\s*\(/.test(stripped) || /\.globalData/.test(stripped)) {
      fail('PLAYER_P1_OR_BRIDGE_DEPENDENCY', rel, 'Player must use only its local loader and existing source fields');
    }
    if (/getAllQuestions\s*\(/.test(text)) {
      fail('PLAYER_FULL_COURSE_PRELOAD', rel, 'Player must request only its selected deck');
    }
  });
}

function main() {
  var releaseFiles = [
    'app.js', 'app.json', 'pages/flashcards/flashcards.js',
    'packages/quiz/pages/flashcard-deck-select/flashcard-deck-select.js',
    'packages/quiz/data/flashcard_adapter.js', 'packages/quiz/data/flashcard-manifest.js'
  ];
  DATA_PACKAGE_NAMES.forEach(function (name) {
    releaseFiles.push('packages/' + name + '/data/loader.js');
    releaseFiles.push('packages/' + name + '/pages/flashcard-player/flashcard-player.js');
  });
  releaseFiles = releaseFiles.filter(fileExists);

  checkStaticRequires(releaseFiles);
  checkNoP1RuntimeDependency(releaseFiles);
  checkFlashcardCenter();
  checkDeckSelect();
  checkNoCrossPackageLoaders();
  checkNoSilentEmptyDeck();
  checkAppRegistry();
  checkPlayersNoP1OrEagerCourseLoad();

  var result = {
    success: failures.length === 0,
    ok: failures.length === 0,
    mode: STAGED_MODE ? 'staged' : (maskedP1HoldPaths.length ? 'working-tree-p0-candidate-view' : 'working-tree'),
    checkedFiles: checkedFiles.length,
    maskedP1HoldPaths: maskedP1HoldPaths,
    failures: failures
  };
  if (JSON_MODE) {
    process.stdout.write(JSON.stringify(result) + '\n');
  } else if (result.ok) {
    process.stdout.write('PASS P0 release dependency closure (' + result.mode + ', ' + result.checkedFiles + ' reads)\n');
  } else {
    process.stdout.write('FAIL P0 release dependency closure (' + result.mode + ')\n');
    failures.forEach(function (item) { process.stdout.write('- [' + item.rule + '] ' + item.file + ': ' + item.message + '\n'); });
  }
  process.exitCode = result.ok ? 0 : 1;
}

main();
