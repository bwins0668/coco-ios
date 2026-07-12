#!/usr/bin/env node
'use strict';

/* Read-only local package-budget report. */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var LIMIT = 2 * 1024 * 1024;
var EXCLUDED = { '.git': true, 'node_modules': true, 'tools': true, '.ai-bridge': true };

function sizeOf(target) {
  var total = 0;
  if (!fs.existsSync(target)) return total;
  var stat = fs.statSync(target);
  if (stat.isFile()) return stat.size;
  fs.readdirSync(target).forEach(function (name) {
    if (EXCLUDED[name]) return;
    total += sizeOf(path.join(target, name));
  });
  return total;
}

function mb(bytes) { return (bytes / 1024 / 1024).toFixed(3); }
var app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
var rows = [];
var packageRoots = (app.subpackages || []).map(function (item) { return item.root.replace(/\\/g, '/'); });

(app.subpackages || []).forEach(function (item) {
  var bytes = sizeOf(path.join(ROOT, item.root));
  rows.push({ name: item.name, root: item.root, bytes: bytes, risk: bytes > LIMIT ? 'OVER_LOCAL_2MB_BUDGET' : 'OK' });
});

var mainBytes = 0;
fs.readdirSync(ROOT).forEach(function (name) {
  if (EXCLUDED[name] || name === 'packages') return;
  mainBytes += sizeOf(path.join(ROOT, name));
});

console.log('=== Flashcard Package Budget (read-only) ===');
console.log('Local per-package budget: ' + mb(LIMIT) + ' MiB');
console.log('main | ' + mb(mainBytes) + ' MiB | ' + (mainBytes > LIMIT ? 'OVER_LOCAL_2MB_BUDGET' : 'OK'));
rows.forEach(function (row) {
  console.log(row.name + ' | ' + row.root + ' | ' + mb(row.bytes) + ' MiB | ' + row.risk);
});
var failures = rows.filter(function (row) { return row.bytes > LIMIT; });
if (mainBytes > LIMIT) failures.push({ name: 'main' });
console.log('Package count: ' + rows.length + ' | Over budget: ' + failures.length);
process.exit(failures.length ? 1 : 0);
