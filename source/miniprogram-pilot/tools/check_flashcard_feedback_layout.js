#!/usr/bin/env node
'use strict';
/*
 * Verify flashcard-player answer feedback layout: vertical mobile layout,
 * no flex-row at the verdict container level, width 100% on verdict sections,
 * no side-by-side "your choice" / "correct answer" columns.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

var PACKAGES = [
  'quiz-itpass-1', 'quiz-itpass-2', 'quiz-itpass-3', 'quiz-itpass-4', 'quiz-itpass-5',
  'quiz-sg-1', 'quiz-sg-2',
];

PACKAGES.forEach(function(pkg) {
  var wxss = read(path.join('packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.wxss'));
  var wxml = read(path.join('packages', pkg, 'pages', 'flashcard-player', 'flashcard-player.wxml'));

  // 1. .fc-back-verdict must NOT be display:flex
  var verdict = wxss.match(/\.fc-back-verdict[\s\S]*?\}/);
  if (!verdict) {
    failures.push(pkg + ': .fc-back-verdict not found');
    return;
  }
  var verdictBlock = verdict[0];
  if (verdictBlock.indexOf('display:flex') >= 0 || verdictBlock.indexOf('display: flex') >= 0) {
    failures.push(pkg + ': .fc-back-verdict is still display:flex');
  }

  // 2. .fc-verdict-section must use width:100% or display:block
  var section = wxss.match(/\.fc-verdict-section[\s\S]*?\}/);
  if (section) {
    var sBlock = section[0];
    if (sBlock.indexOf('width:100%') < 0 && sBlock.indexOf('width: 100%') < 0 && sBlock.indexOf('display:block') < 0 && sBlock.indexOf('display: block') < 0) {
      failures.push(pkg + ': .fc-verdict-section lacks width:100%/display:block');
    }
  }

  // 3. .fc-action-row must be flex-direction:column (not row)
  var actionRow = wxss.match(/\.fc-action-row[\s\S]*?\}/);
  if (actionRow) {
    var aBlock = actionRow[0];
    if (aBlock.indexOf('flex-direction:column') < 0 && aBlock.indexOf('flex-direction: column') < 0) {
      failures.push(pkg + ': .fc-action-row is not flex-direction:column');
    }
  }

  // 4. .fc-btn-primary must have width:100%
  var btnPrimary = wxss.match(/\.fc-btn-primary[\s\S]*?\}/);
  if (btnPrimary && btnPrimary[0].indexOf('width:100%') < 0 && btnPrimary[0].indexOf('width: 100%') < 0 && btnPrimary[0].indexOf('width:100') < 0) {
    failures.push(pkg + ': .fc-btn-primary lacks width:100%');
  }

  // 5. WXML must not use fc-verdict-item (old flex child class)
  if (wxml.indexOf('fc-verdict-item') >= 0) {
    failures.push(pkg + ': WXML still uses fc-verdict-item (old flex class)');
  }

  // 6. Verdict sections must be vertical — check for any use of display:flex on verdict containers
  if (verdictBlock.indexOf('display:flex') >= 0) {
    failures.push(pkg + ': .fc-back-verdict uses display:flex (needs display:block)');
  }
});

if (failures.length) {
  console.error('FLASHCARD FEEDBACK LAYOUT FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('FLASHCARD FEEDBACK LAYOUT PASS — all ' + PACKAGES.length + ' packages vertical layout verified');
