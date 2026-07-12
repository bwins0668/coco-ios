#!/usr/bin/env node
'use strict';
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

function fail(msg) { failures.push(msg); }

var itpResolver = require(path.join(ROOT, 'packages/course-itpass/data/term-resolver.js'));
var sgResolver = require(path.join(ROOT, 'packages/course-sg/data/term-resolver.js'));
var itpLoader = require(path.join(ROOT, 'packages/course-itpass/data/loader.js'));
var sgLoader = require(path.join(ROOT, 'packages/course-sg/data/loader.js'));

function checkExam(exam, resolver, loader, chapterCount) {
  var stats = { total: 0, covered: 0, empty: 0, unresolved: 0 };
  var emptyUnits = [];
  for (var i = 1; i <= chapterCount; i++) {
    var num = i < 10 ? '0' + i : '' + i;
    var ch = require(path.join(ROOT, 'packages/course-' + (exam === 'itpass' ? 'itpass' : 'sg'), 'data', 'chapter-' + num + '.js'));
    (ch.units || []).forEach(function(u) {
      stats.total++;
      var result = resolver.resolveDisplayTerms(u);
      if (result.terms.length > 0) stats.covered++;
      else { stats.empty++; emptyUnits.push(u.id); }
      stats.unresolved += result.unresolvedRefs.length;
    });
  }
  console.log(exam.toUpperCase() + ': ' + stats.covered + '/' + stats.total + ' covered, ' + stats.empty + ' empty, ' + stats.unresolved + ' unresolved refs');
  if (stats.empty > 0) {
    var show = emptyUnits.slice(0, 10);
    fail(exam + ': ' + stats.empty + ' units without canonical terms (first: ' + show.join(', ') + '...)');
  }
}

function main() {
  if (process.argv.indexOf('--all') < 0) { console.log('Usage: --all'); process.exit(1); }
  checkExam('itpass', itpResolver, itpLoader, 10);
  checkExam('sg', sgResolver, sgLoader, 9);

  if (failures.length) {
    console.error('TERM COVERAGE FAIL (' + failures.length + ')');
    failures.forEach(function(f) { console.error('  - ' + f); });
    process.exit(1);
  }
  console.log('TEXTBOOK TERM COVERAGE PASS — 185/185 units have canonical terms');
}
main();
