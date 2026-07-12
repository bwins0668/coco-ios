#!/usr/bin/env node
'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var TARGET_VERSION = 'v0.28.0';
var LEGACY_VERSION = 'v0.24.0';
var JSON_MODE = process.argv.indexOf('--json') !== -1;
var STAGED_MODE = process.argv.indexOf('--staged') !== -1;
var failures = [];
var checked = [];

var RELEASE_SOURCES = [
  {
    file: 'app.js',
    contract: /version\s*:\s*['"]v0\.28\.0['"]/
  },
  {
    file: 'utils/storage.js',
    contract: /version\s*:\s*['"]v0\.28\.0['"]/
  },
  {
    file: 'tools/miniprogram_smoke_test.js',
    contract: /(?:smoke|miniprogram|Minium)/i
  }
];

function normalize(rel) {
  return String(rel).replace(/\\/g, '/');
}

function fail(rule, file, message) {
  failures.push({ rule: rule, file: normalize(file), message: message });
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
  checked.push(normalized);
  if (!STAGED_MODE) return fs.readFileSync(path.join(ROOT, normalized), 'utf8');
  var result = childProcess.spawnSync('git', ['show', ':' + normalized], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024
  });
  if (result.status !== 0) throw new Error('Unable to read staged candidate: ' + normalized);
  return result.stdout;
}

function inspectSource(source) {
  var text;
  try {
    text = readCandidate(source.file);
  } catch (error) {
    fail('VERSION_SOURCE_UNREADABLE', source.file, error.message);
    return;
  }
  if (!source.contract.test(text)) {
    fail('VERSION_SOURCE_MISMATCH', source.file, 'Expected ' + TARGET_VERSION + ' release contract');
  }
  if (text.indexOf(LEGACY_VERSION) !== -1) {
    fail('STALE_V024_IN_RELEASE_SOURCE', source.file, 'Found ' + LEGACY_VERSION + ' in a P0 release source');
  }
}

function main() {
  if (STAGED_MODE && stagedNames().length === 0) {
    if (JSON_MODE) {
      process.stdout.write(JSON.stringify({
        success: false,
        ok: false,
        mode: 'staged',
        code: 'NO_STAGED_CANDIDATE',
        targetVersion: TARGET_VERSION,
        checkedFiles: []
      }) + '\n');
    } else {
      process.stdout.write('NO_STAGED_CANDIDATE\n');
    }
    process.exitCode = 2;
    return;
  }

  RELEASE_SOURCES.forEach(inspectSource);
  var result = {
    success: failures.length === 0,
    ok: failures.length === 0,
    mode: STAGED_MODE ? 'staged' : 'working-tree',
    targetVersion: TARGET_VERSION,
    checkedFiles: checked,
    failures: failures
  };

  if (JSON_MODE) {
    process.stdout.write(JSON.stringify(result) + '\n');
  } else if (result.ok) {
    process.stdout.write('PASS release version contract: ' + TARGET_VERSION + ' (' + result.mode + ')\n');
    checked.forEach(function (file) { process.stdout.write('  PASS ' + file + '\n'); });
  } else {
    process.stdout.write('FAIL release version contract: ' + TARGET_VERSION + ' (' + result.mode + ')\n');
    failures.forEach(function (item) {
      process.stdout.write('  FAIL [' + item.rule + '] ' + item.file + ': ' + item.message + '\n');
    });
  }
  process.exitCode = result.ok ? 0 : 1;
}

main();
