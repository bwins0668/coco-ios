#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

function parseRootArg(argv) {
  var root = null;
  for (var i = 0; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) {
      root = argv[i + 1];
      i++;
    }
  }
  return path.resolve(root || path.join(__dirname, '..'));
}

function toPosix(value) {
  return String(value || '').replace(/\\/g, '/');
}

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function readJson(root, rel) {
  return JSON.parse(read(root, rel));
}

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function listTracked(root) {
  var output = childProcess.execFileSync('git', ['ls-files'], {
    cwd: root,
    encoding: 'utf8'
  });
  var tracked = {};
  output.split(/\r?\n/).filter(Boolean).forEach(function (rel) {
    tracked[toPosix(rel)] = true;
  });
  return tracked;
}

function buildPackageRoots(root) {
  var app = readJson(root, 'app.json');
  return (app.subpackages || []).map(function (sp) {
    return toPosix(sp.root).replace(/\/+$/, '');
  }).filter(Boolean);
}

function packageRootFor(rel, packageRoots) {
  rel = toPosix(rel);
  for (var i = 0; i < packageRoots.length; i++) {
    if (rel === packageRoots[i] || rel.indexOf(packageRoots[i] + '/') === 0) {
      return packageRoots[i];
    }
  }
  return '';
}

function buildPackIgnored(root) {
  var cfg = readJson(root, 'project.config.json');
  var ignored = [];
  (((cfg.packOptions || {}).ignore) || []).forEach(function (item) {
    if (!item || !item.value || !item.type) return;
    ignored.push({ type: item.type, value: toPosix(item.value).replace(/^\/+/, '') });
  });
  return ignored;
}

function isPackIgnored(rel, ignored) {
  rel = toPosix(rel);
  return ignored.some(function (item) {
    if (item.type === 'folder') {
      return rel === item.value || rel.indexOf(item.value + '/') === 0;
    }
    if (item.type === 'file') {
      return rel === item.value;
    }
    if (item.type === 'suffix') {
      return rel.slice(-item.value.length) === item.value;
    }
    return false;
  });
}

function resolveRequire(root, fromRel, request) {
  var fromDir = path.dirname(path.join(root, fromRel));
  var base = path.resolve(fromDir, request);
  var candidates = [base];
  if (!/\.js$/.test(request)) candidates.push(base + '.js');
  candidates.push(path.join(base, 'index.js'));
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i]) && fs.statSync(candidates[i]).isFile()) {
      return toPosix(path.relative(root, candidates[i]));
    }
  }
  return toPosix(path.relative(root, /\.js$/.test(request) ? base : base + '.js'));
}

function extractRequires(source) {
  var requires = [];
  var rx = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  var match;
  while ((match = rx.exec(source))) {
    if (/^\./.test(match[1])) requires.push(match[1]);
  }
  return requires;
}

function verifyExports(root, rel, source) {
  if (!exists(root, rel)) return [];
  if (/flashcard-summary-manifest/.test(rel)) {
    var value = require(path.join(root, rel));
    var missing = [];
    ['itpass', 'sg'].forEach(function (key) {
      if (!value[key] || typeof value[key].playableCount !== 'number' || typeof value[key].deckCount !== 'number') {
        missing.push(key + '.playableCount/deckCount');
      }
    });
    return missing;
  }
  if (/flashcards-state/.test(rel) && /getFlashcardsLandingState/.test(source)) {
    var state = require(path.join(root, rel));
    if (typeof state.getFlashcardsLandingState !== 'function') return ['getFlashcardsLandingState'];
  }
  return [];
}

var root = parseRootArg(process.argv.slice(2));
var tracked = listTracked(root);
var packageRoots = buildPackageRoots(root);
var ignored = buildPackIgnored(root);
var errors = [];
var passes = [];
var rows = [];
var visited = {};

function loadRouteEntries() {
  var app = readJson(root, 'app.json');
  var entries = ['app.js'];
  (app.pages || []).forEach(function (route) {
    entries.push(route + '.js');
  });
  (app.subpackages || []).forEach(function (sp) {
    (sp.pages || []).forEach(function (page) {
      entries.push(toPosix(sp.root + '/' + page + '.js'));
    });
  });
  return entries.filter(function (rel) { return tracked[rel]; });
}

function scanRuntimeFile(fromRel) {
  fromRel = toPosix(fromRel);
  if (visited[fromRel]) return;
  visited[fromRel] = true;
  if (!tracked[fromRel] || !/\.js$/.test(fromRel)) return;
  var source = read(root, fromRel);
  extractRequires(source).forEach(function (request) {
    var targetRel = resolveRequire(root, fromRel, request);
    var fromPkg = packageRootFor(fromRel, packageRoots);
    var targetPkg = packageRootFor(targetRel, packageRoots);
    rows.push({ from: fromRel, request: request, target: targetRel });

    if (!exists(root, targetRel)) {
      errors.push(fromRel + ': missing module ' + request + ' -> ' + targetRel);
      return;
    }
    passes.push(fromRel + ': resolved ' + request + ' -> ' + targetRel);

    if (!tracked[targetRel]) {
      errors.push(fromRel + ': resolved module is not git tracked: ' + targetRel);
    }
    if (isPackIgnored(targetRel, ignored)) {
      errors.push(fromRel + ': runtime module is excluded by project.config packOptions.ignore: ' + targetRel);
    }
    if (targetPkg && fromPkg !== targetPkg) {
      errors.push(fromRel + ': illegal cross-package runtime require to ' + targetRel);
    }
    verifyExports(root, targetRel, source).forEach(function (field) {
      errors.push(fromRel + ': required export missing from ' + targetRel + ': ' + field);
    });
    scanRuntimeFile(targetRel);
  });
}

loadRouteEntries().forEach(scanRuntimeFile);

console.log('=== R6.6C Runtime Module Resolution Contract ===');
console.log('Root: ' + root);
console.log('Runtime JS files: ' + Object.keys(visited).length);
console.log('Local require edges: ' + rows.length);
console.log('');
rows.forEach(function (row) {
  console.log(row.from + ' | ' + row.request + ' -> ' + row.target);
});
console.log('');
console.log('Results: ' + passes.length + ' passed, ' + errors.length + ' failed');
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(function (error) { console.log('  - ' + error); });
  console.log('\n[FAIL] R6.6C runtime module resolution contract');
  process.exit(1);
}
console.log('\n[PASS] R6.6C runtime module resolution contract');
