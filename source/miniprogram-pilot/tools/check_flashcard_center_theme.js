#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

var wxss = fs.readFileSync(path.join(ROOT, 'pages/flashcards/flashcards.wxss'), 'utf8');

// Ensure card background is themed
if (wxss.indexOf('background:var(--card-bg)') < 0 && wxss.indexOf('background: var(--card-bg)') < 0) {
  failures.push('flashcards.wxss does not use card-bg variable');
}

// Ensure no hardcoded hex/rgb color values (except in shadows/rgba)
var hexColors = wxss.match(/#([0-9a-fA-F]{3,6})/g) || [];
hexColors.forEach(function (color) {
  failures.push('Hardcoded hex color found: ' + color);
});

if (failures.length) {
  console.error('FLASHCARD CENTER THEME FAIL');
  failures.forEach(function (f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('FLASHCARD CENTER THEME PASS');
