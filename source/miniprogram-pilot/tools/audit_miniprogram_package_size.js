#!/usr/bin/env node
/**
 * audit_miniprogram_package_size.js
 * DevTools-like auxiliary audit for local miniprogram package sizes.
 *
 * This estimates:
 * - main-package candidate: files outside every app.json subpackage root
 * - each declared subpackage root
 *
 * It intentionally counts non-subpackage root files so generated backups and
 * local tooling cannot silently inflate the package footprint.
 */

'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var ONE_KB = 1024;
var ONE_MB = 1024 * 1024;
var MAIN_WARN = 1.4 * ONE_MB;
var MAIN_FAIL = 1.5 * ONE_MB;
var PACKAGE_WARN = 1.5 * ONE_MB;
var PACKAGE_FAIL = 1.8 * ONE_MB;
var HARD_LIMIT = 2 * ONE_MB;
var excludedUntrackedP1Holds = [];
var packIgnoreRules = null;

function toRel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function normalizeRel(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

function getPackIgnoreRules() {
  if (packIgnoreRules !== null) return packIgnoreRules;
  try {
    var projectConfig = readJson('project.config.json');
    packIgnoreRules = ((projectConfig.packOptions && projectConfig.packOptions.ignore) || [])
      .filter(function (rule) { return rule && rule.type && rule.value; })
      .map(function (rule) {
        return {
          type: String(rule.type),
          value: normalizeRel(rule.value)
        };
      });
  } catch (e) {
    packIgnoreRules = [];
  }
  return packIgnoreRules;
}

function formatSize(bytes) {
  if (bytes >= ONE_MB) return (bytes / ONE_MB).toFixed(2) + ' MB';
  return (bytes / ONE_KB).toFixed(1) + ' KB';
}

function isSkippedRel(rel) {
  return rel === '.git' || rel.indexOf('.git/') === 0 ||
    rel === '.workbuddy' || rel.indexOf('.workbuddy/') === 0 ||
    rel === '.ai-bridge' || rel.indexOf('.ai-bridge/') === 0 ||
    rel === '.gpt-handoff' || rel.indexOf('.gpt-handoff/') === 0 ||
    rel === 'node_modules' || rel.indexOf('node_modules/') === 0 ||
    rel === 'outputs' || rel.indexOf('outputs/') === 0 ||
    rel === 'scratch' || rel.indexOf('scratch/') === 0 ||
    rel === 'artifacts' || rel.indexOf('artifacts/') === 0 ||
    rel === 'tools/test-artifacts' || rel.indexOf('tools/test-artifacts/') === 0 ||
    rel === 'tools/review-batches' || rel.indexOf('tools/review-batches/') === 0 ||
    rel === 'tools/generated-cache' || rel.indexOf('tools/generated-cache/') === 0 ||
    /^tools\/(?:.*\/)?__pycache__(?:\/|$)/.test(rel) ||
    rel === 'project.private.config.json' ||
    /(^|\/)devtools-.*\.log$/i.test(rel) || /\.patch$/i.test(rel) || /\.pyc$/i.test(rel) ||
    /translations_zh\.js$/i.test(rel);
}

function isPackIgnoredRel(rel) {
  var normalized = normalizeRel(rel);
  var rules = getPackIgnoreRules();
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    var value = rule.value;
    if (!value) continue;
    if (rule.type === 'folder') {
      if (normalized === value || normalized.indexOf(value + '/') === 0) return true;
    } else if (rule.type === 'file') {
      if (normalized === value) return true;
    } else if (rule.type === 'suffix') {
      if (normalized.slice(-value.length) === value) return true;
    }
  }
  return false;
}

function walk(dir, files) {
  files = files || [];
  var entries;
  try {
    entries = fs.readdirSync(dir);
  } catch (e) {
    return files;
  }
  entries.forEach(function (name) {
    var full = path.join(dir, name);
    var rel = toRel(full);
    if (isSkippedRel(rel) || isPackIgnoredRel(rel)) return;
    var stat;
    try {
      stat = fs.statSync(full);
    } catch (e) {
      return;
    }
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (stat.isFile()) {
      files.push({ rel: rel, abs: full, size: stat.size });
    }
  });
  return files;
}

function sum(files) {
  return files.reduce(function (total, file) { return total + file.size; }, 0);
}

function topFiles(files, limit) {
  return files.slice().sort(function (a, b) { return b.size - a.size; }).slice(0, limit);
}

function isInsideRoot(rel, root) {
  return rel === root || rel.indexOf(root + '/') === 0;
}

function printTop(title, files, limit) {
  console.log('\n' + title);
  var top = topFiles(files, limit || 12);
  if (top.length === 0) {
    console.log('  (none)');
    return;
  }
  top.forEach(function (file, index) {
    console.log(String(index + 1).padStart(2, ' ') + '. ' + formatSize(file.size).padStart(9, ' ') + '  ' + file.rel);
  });
}

function main() {
  var appJson = readJson('app.json');
  var subpackages = (appJson.subpackages || []).map(function (pkg) {
    return {
      root: String(pkg.root || '').replace(/\\/g, '/').replace(/\/+$/, ''),
      name: pkg.name || ''
    };
  }).filter(function (pkg) { return pkg.root; });

  var allFiles = walk(ROOT);
  var packages = subpackages.map(function (pkg) {
    var files = allFiles.filter(function (file) { return isInsideRoot(file.rel, pkg.root); });
    return {
      root: pkg.root,
      name: pkg.name,
      files: files,
      size: sum(files)
    };
  });

  var subRoots = packages.map(function (pkg) { return pkg.root; });
  var mainFiles = allFiles.filter(function (file) {
    return !subRoots.some(function (root) { return isInsideRoot(file.rel, root); });
  });
  var mainSize = sum(mainFiles);
  var totalSize = sum(allFiles);

  var failures = [];
  var warnings = [];

  if (mainSize > MAIN_FAIL) {
    failures.push('main-package candidate exceeds 1.5 MB: ' + formatSize(mainSize));
  } else if (mainSize > MAIN_WARN) {
    warnings.push('main-package candidate above 1.4 MB warning line: ' + formatSize(mainSize));
  }

  packages.forEach(function (pkg) {
    if (pkg.size > PACKAGE_FAIL) {
      failures.push(pkg.root + ' exceeds 1.8 MB target: ' + formatSize(pkg.size));
    } else if (pkg.size > PACKAGE_WARN) {
      warnings.push(pkg.root + ' above 1.5 MB watch line: ' + formatSize(pkg.size));
    }
    if (pkg.size > HARD_LIMIT) {
      failures.push(pkg.root + ' exceeds WeChat single-package 2 MB limit: ' + formatSize(pkg.size));
    }
  });

  var forbiddenRuntimeFiles = [
    'packages/quiz/data/past_exam_bank/full_bank.js',
    'packages/quiz/data/past_exam_bank/explanations_zh.js'
  ];
  forbiddenRuntimeFiles.forEach(function (rel) {
    var file = path.join(ROOT, rel);
    if (fs.existsSync(file)) {
      failures.push('old aggregate runtime file still exists: ' + rel + ' (' + formatSize(fs.statSync(file).size) + ')');
    }
  });

  var quizQuestionsPath = path.join(ROOT, 'packages/quiz/data/questions.js');
  if (fs.existsSync(quizQuestionsPath) && fs.statSync(quizQuestionsPath).size > ONE_MB) {
    failures.push('packages/quiz/data/questions.js is still a large aggregate: ' + formatSize(fs.statSync(quizQuestionsPath).size));
  }

  console.log('=== Miniprogram Package Size Audit ===');
  console.log('Root:', ROOT);
  console.log('Mode: P0 release-candidate auxiliary audit');
  console.log('Pack ignore source: project.config.json packOptions.ignore (' + getPackIgnoreRules().length + ' rules)');
  console.log('Subpackages:', subRoots.join(', '));

  console.log('\n--- Size Summary ---');
  console.log('total local code estimate:', formatSize(totalSize), '(' + allFiles.length + ' files)');
  console.log('main-package candidate:', formatSize(mainSize), '(' + mainFiles.length + ' files)');
  packages.forEach(function (pkg) {
    console.log(pkg.root + ':', formatSize(pkg.size), '(' + pkg.files.length + ' files)');
  });

  printTop('--- Main Package Candidate Top 20 ---', mainFiles, 20);
  packages.forEach(function (pkg) {
    printTop('--- ' + pkg.root + ' Top 10 ---', pkg.files, 10);
  });

  if (warnings.length > 0) {
    console.log('\n--- Warnings ---');
    warnings.forEach(function (item) { console.log('[WARN] ' + item); });
  }

  if (failures.length > 0) {
    console.log('\n--- Failures ---');
    failures.forEach(function (item) { console.log('[FAIL] ' + item); });
    console.log('\n[FAIL] Package size audit failed');
    process.exit(1);
  }

  console.log('\n[PASS] Package size audit passed');
}

main();
