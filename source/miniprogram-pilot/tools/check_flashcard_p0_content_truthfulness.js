#!/usr/bin/env node
'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var JSON_MODE = process.argv.indexOf('--json') !== -1;
var STAGED_MODE = process.argv.indexOf('--staged') !== -1;
var failures = [];
var checks = [];

var PLAYER_FILES = [
  'packages/quiz-itpass-1/pages/flashcard-player/flashcard-player.js',
  'packages/quiz-itpass-2/pages/flashcard-player/flashcard-player.js',
  'packages/quiz-itpass-3/pages/flashcard-player/flashcard-player.js',
  'packages/quiz-itpass-4/pages/flashcard-player/flashcard-player.js',
  'packages/quiz-itpass-5/pages/flashcard-player/flashcard-player.js',
  'packages/quiz-sg-1/pages/flashcard-player/flashcard-player.js',
  'packages/quiz-sg-2/pages/flashcard-player/flashcard-player.js'
];

var P0_WXML_FILES = [
  'packages/quiz-itpass-1/pages/flashcard-player/flashcard-player.wxml',
  'packages/quiz-sg-1/pages/flashcard-player/flashcard-player.wxml'
];

function normalize(rel) {
  return String(rel).replace(/\\/g, '/');
}

function fail(rule, file, message) {
  failures.push({ rule: rule, file: normalize(file), message: message });
}

function pass(rule, file) {
  checks.push({ rule: rule, file: normalize(file) });
}

function stagedNames() {
  var result = childProcess.spawnSync('git', ['diff', '--cached', '--name-only'], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  if (result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).filter(Boolean).map(normalize);
}

function readCandidate(rel) {
  var normalized = normalize(rel);
  if (!STAGED_MODE) return fs.readFileSync(path.join(ROOT, normalized), 'utf8');
  var result = childProcess.spawnSync('git', ['show', ':' + normalized], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024
  });
  if (result.status !== 0) throw new Error('Unable to read staged candidate: ' + normalized);
  return result.stdout;
}

function assertText(rule, file, text, expression, message) {
  if (expression.test(text)) pass(rule, file);
  else fail(rule, file, message);
}

function assertNoText(rule, file, text, expression, message) {
  if (expression.test(text)) fail(rule, file, message);
  else pass(rule, file);
}

function checkPlayer(file) {
  var text;
  try {
    text = readCandidate(file);
  } catch (error) {
    fail('PLAYER_UNREADABLE', file, error.message);
    return;
  }

  assertText('HAS_STRICT_ZH_GUARD', file, text, /function\s+hasVerifiedZhText\s*\(/, 'Missing hasVerifiedZhText guard');
  assertText('ZH_GUARD_CHECKS_DIFFERENCE', file, text, /!zh\s*\|\|\s*!ja\s*\|\|\s*zh\s*===\s*ja/, 'Guard must reject missing or Japanese-equal text');
  assertText('ZH_GUARD_CHECKS_CJK_RATIO', file, text, /chineseRatio\s*>=\s*0\.2/, 'Guard must require a real Chinese-character ratio');
  assertText('ZH_GUARD_REJECTS_KANA_HEAVY', file, text, /kanaRatio\s*<=\s*0\.15/, 'Guard must reject kana-heavy text');
  assertNoText('NO_WEAK_CHINESE_HEURISTIC', file, text, /return\s+chineseCount\s*>\s*kanaCount\s*;/, 'Weak chineseCount > kanaCount guard is forbidden');

  assertText('QUESTION_ZH_SANITIZED', file, text, /verifiedZh\(raw\.questionZh\s*,\s*questionJa\)/, 'questionZh must be sanitized by the guard');
  assertText('OPTION_ZH_SANITIZED', file, text, /verifiedZh\(source\.textZh\s*,\s*textJa\)/, 'option textZh must be sanitized by the guard');
  assertText('EXPLANATION_ZH_SANITIZED', file, text, /verifiedZh\(raw\.explanationZh\s*,\s*explanationJa\)/, 'explanationZh must be sanitized by the guard');
  assertText('MNEMONIC_ZH_SANITIZED', file, text, /verifiedZh\(raw\.mnemonicZh\s*,\s*mnemonicJa\)/, 'mnemonicZh must be sanitized by the guard');

  ['loading', 'error', 'empty', 'content'].forEach(function (state) {
    assertText('FOUR_STATE_' + state.toUpperCase(), file, text,
      new RegExp("viewState\\s*:\\s*['\\\"]" + state + "['\\\"]"),
      'Missing ' + state + ' state');
  });
  assertText('ERROR_RETRY', file, text, /retryLoad\s*:\s*function/, 'Missing retry handler');
  assertText('STRICT_SOURCE_COUNT', file, text, /sourceCountActual\s*!==\s*sourceCountExpected/, 'Source count must be exact');
  assertText('STRICT_PLAYABLE_COUNT', file, text, /playableCountActual\s*!==\s*playableCountExpected/, 'Playable count must be exact');
  assertText('EMPTY_ONLY_FOR_ZERO_MANIFEST', file, text, /sourceCountExpected\s*===\s*0\s*&&\s*playableCountExpected\s*===\s*0/, 'Empty may only be reached for an explicit zero manifest');
  assertText('FAILURE_DIAGNOSTICS', file, text, /console\.error\(\s*['"]\[flashcard-player\] load failed:/, 'Failure diagnostics must log the load context');

  assertNoText('NO_TRANSLATION_REQUIRE', file, text, /translations_zh/, 'Player must not reference translation files');
  assertNoText('NO_P1_STATUS', file, text, /translationStatus|needs_revision|bilingual_partial|bilingual_complete|contentStatus/, 'Player must not expose P1 bilingual status');
  assertNoText('NO_P1_TOOL_REFERENCE', file, text, /review-batches|generate_flashcard_translations/, 'Player must not reference P1 tooling');
  // Strip only the exact _applyTheme method (R21 dark mode) using its precise object-method signature.
  // This is a precise allowlist: only the exact _applyTheme:function(){} is stripped,
  // NOT any other getApp/globalData usage. Any non-theme getApp() will still fail.
  var stripped = text.replace(/_applyTheme\s*:\s*function\s*\(\s*\)\s*\{[\s\S]*?\n\s*\}/g, '');
  assertNoText('NO_BRIDGE_OR_GLOBAL_CACHE', file, stripped, /EventChannel|flashcard-bridge|getApp\s*\(|\.globalData|loadSubPackage\s*=/, 'Player must not use a bridge, global cache, or fake subpackage shim');
  assertNoText('NO_FULL_COURSE_PRELOAD', file, text, /getAllQuestions\s*\(/, 'Player must load only the selected deck');
  assertNoText('NO_SILENT_EMPTY_CATCH', file, text, /catch\s*\([^)]*\)\s*\{[\s\S]{0,240}return\s*\[\s*\]/, 'Player must not turn a load error into an empty deck');
}

function checkGuardedLine(file, text, property, guard) {
  var lines = text.split(/\r?\n/);
  var matched = 0;
  lines.forEach(function (line, index) {
    if (line.indexOf(property) === -1) return;
    matched += 1;
    if (line.indexOf(guard) === -1) {
      fail('WXML_UNGUARDED_' + property.replace(/[^A-Za-z]/g, '_'), file,
        'Line ' + (index + 1) + ' renders ' + property + ' without ' + guard);
    }
  });
  if (matched === 0) {
    fail('WXML_MISSING_' + property.replace(/[^A-Za-z]/g, '_'), file, 'Expected guarded ' + property + ' UI');
  } else if (!failures.some(function (item) { return item.file === file && item.rule === 'WXML_UNGUARDED_' + property.replace(/[^A-Za-z]/g, '_'); })) {
    pass('WXML_GUARDED_' + property.replace(/[^A-Za-z]/g, '_'), file);
  }
}

function checkWxml(file) {
  var text;
  try {
    text = readCandidate(file);
  } catch (error) {
    fail('WXML_UNREADABLE', file, error.message);
    return;
  }

  assertText('WXML_FOUR_STATE_LOADING', file, text, /viewState\s*===\s*['"]loading['"]/, 'Missing loading branch');
  assertText('WXML_FOUR_STATE_ERROR', file, text, /viewState\s*===\s*['"]error['"]/, 'Missing error branch');
  assertText('WXML_FOUR_STATE_EMPTY', file, text, /viewState\s*===\s*['"]empty['"]/, 'Missing empty branch');
  assertText('WXML_FOUR_STATE_CONTENT', file, text, /viewState\s*===\s*['"]content['"]/, 'Missing content branch');
  assertText('WXML_ERROR_RETRY', file, text, /bindtap=['"]retryLoad['"]/, 'Error view must provide retry');
  assertText('WXML_ERROR_BACK', file, text, /bindtap=['"]goBack['"]/, 'Error view must provide return');

  checkGuardedLine(file, text, 'currentCard.questionZh', 'hasQuestionZh');
  checkGuardedLine(file, text, 'item.textZh', 'hasTextZh');
  checkGuardedLine(file, text, 'selectedOption.textZh', 'selectedOption.hasTextZh');
  checkGuardedLine(file, text, 'correctOption.textZh', 'correctOption.hasTextZh');
  checkGuardedLine(file, text, 'currentCard.explanationZh', 'hasExplanationZh');
  checkGuardedLine(file, text, 'currentCard.mnemonicZh', 'hasMnemonicZh');

  assertNoText('NO_INLINE_JA_ZH_CONCAT', file, text, /textJa\}\}\s*\/\s*\{\{[^}]*textZh/, 'Japanese and Chinese must not be unconditionally concatenated');
  assertNoText('NO_P1_STATUS_UI', file, text, /needs_revision|bilingual_partial|bilingual_complete|contentStatus|翻译待修订|双语部分完成|双语完整/, 'P1 bilingual status must not be user-visible');
}

function main() {
  if (STAGED_MODE && stagedNames().length === 0) {
    if (JSON_MODE) {
      process.stdout.write(JSON.stringify({ success: false, ok: false, mode: 'staged', code: 'NO_STAGED_CANDIDATE', failures: [] }) + '\n');
    } else {
      process.stdout.write('NO_STAGED_CANDIDATE\n');
    }
    process.exitCode = 2;
    return;
  }

  PLAYER_FILES.forEach(checkPlayer);
  P0_WXML_FILES.forEach(checkWxml);
  var result = {
    success: failures.length === 0,
    ok: failures.length === 0,
    mode: STAGED_MODE ? 'staged' : 'working-tree',
    players: PLAYER_FILES.length,
    p0WxmlFiles: P0_WXML_FILES.length,
    passChecks: checks.length,
    failures: failures
  };

  if (JSON_MODE) {
    process.stdout.write(JSON.stringify(result) + '\n');
  } else if (result.ok) {
    process.stdout.write('PASS P0 content truthfulness (' + result.players + ' players, ' + result.p0WxmlFiles + ' WXML files, ' + result.passChecks + ' checks)\n');
  } else {
    process.stdout.write('FAIL P0 content truthfulness (' + result.mode + ')\n');
    failures.forEach(function (item) {
      process.stdout.write('- [' + item.rule + '] ' + item.file + ': ' + item.message + '\n');
    });
  }
  process.exitCode = result.ok ? 0 : 1;
}

main();
