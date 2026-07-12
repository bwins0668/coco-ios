#!/usr/bin/env node
'use strict';

/* Full repository JavaScript parser gate. It does not execute application code. */
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var SKIP = new Set(['.git', 'node_modules', 'tools/test-artifacts', 'tools/review-batches']);
var files = [];

function visit(relative) {
  var absolute = path.join(ROOT, relative);
  var stat = fs.statSync(absolute);
  if (stat.isDirectory()) {
    if (SKIP.has(relative.replace(/\\/g, '/'))) return;
    fs.readdirSync(absolute).forEach(function (name) {
      visit(path.join(relative, name));
    });
    return;
  }
  if (stat.isFile() && path.extname(relative) === '.js') files.push(relative);
}

visit('.');
files.sort();

var failures = [];
files.forEach(function (relative) {
  var result = childProcess.spawnSync(process.execPath, ['--check', path.join(ROOT, relative)], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 15000
  });
  if (result.status !== 0) {
    failures.push({ file: relative, output: String(result.stderr || result.stdout || '').slice(0, 1200) });
  }
});

if (failures.length) {
  console.error('JavaScript syntax FAIL (' + failures.length + '/' + files.length + ')');
  failures.forEach(function (item) {
    console.error('- ' + item.file + '\n' + item.output);
  });
  process.exit(1);
}
console.log('JavaScript syntax PASS (' + files.length + ' files)');
