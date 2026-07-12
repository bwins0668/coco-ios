#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
var passes = [];

function fail(msg) { failures.push(msg); }
function pass(msg) { passes.push(msg); }

function readFileSafe(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
  catch (e) { return null; }
}

function fileExists(rel) {
  try { return fs.statSync(path.join(ROOT, rel)).isFile(); }
  catch (e) { return false; }
}

/* Collect all git-tracked .wxss files */
function gitLsFiles(pattern) {
  var cp = require('child_process');
  try {
    var out = cp.execFileSync('git', ['ls-files', pattern], { cwd: ROOT, encoding: 'utf8' });
    return out.trim().split(/[\r\n]+/).filter(Boolean);
  } catch (e) { return []; }
}

var wxssFiles = gitLsFiles('*.wxss');
if (wxssFiles.length === 0) {
  fail('no git-tracked .wxss files found');
  process.exit(1);
}
pass(wxssFiles.length + ' git-tracked .wxss files');

var checked = 0;
var unresolved = 0;

wxssFiles.forEach(function (rel) {
  var content = readFileSafe(rel);
  if (content === null) { fail(rel + ' cannot be read'); return; }

  var importRe = /@import\s+["']([^"']+)["']/g;
  var match;
  while ((match = importRe.exec(content)) !== null) {
    var importPath = match[1];
    var dir = path.dirname(rel);
    var resolved = path.normalize(path.join(dir, importPath)).replace(/\\/g, '/');
    checked++;

    if (!fileExists(resolved)) {
      unresolved++;
      fail(rel + ' -> @import "' + importPath + '" -> resolved "' + resolved + '" NOT FOUND');
    }
  }
});

if (checked === 0) pass('no @import directives found (nothing to check)');
else if (unresolved === 0) pass('all ' + checked + ' @import directives resolved');

console.log('=== WXSS Import Resolution Check ===');
console.log('Root: ' + ROOT);
console.log('');
passes.forEach(function (msg) { console.log('  PASS  ' + msg); });
if (failures.length) {
  console.log('');
  failures.forEach(function (msg) { console.log('  FAIL  ' + msg); });
  console.log('\n[FAIL] WXSS import resolution: ' + failures.length + ' unresolved import(s)');
  process.exit(1);
}
console.log('\n[PASS] all WXSS imports resolve');
