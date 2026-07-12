#!/usr/bin/env node
'use strict';
/*
 * Verify home page learning focus cards use theme-aware CSS variables.
 * Specifically: .entry-card-primary must use var(--card-bg-elevated) not hardcoded white.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

var homeWxss = fs.readFileSync(path.join(ROOT, 'pages/home/home.wxss'), 'utf8');

// Check entry-card-primary uses var token for background
var primaryCardBg = homeWxss.match(/\.entry-card-primary[\s\S]*?background:\s*([^;]+)/);
if (!primaryCardBg) {
  failures.push('.entry-card-primary background not found');
} else {
  var bgValue = primaryCardBg[1].trim();
  if (bgValue.indexOf('var(--') < 0) {
    failures.push('.entry-card-primary uses hardcoded background: ' + bgValue);
  }
  if (bgValue.indexOf('card-bg-elevated') < 0 && bgValue.indexOf('card-bg') < 0) {
    failures.push('.entry-card-primary background is not a card-bg token: ' + bgValue);
  }
}

// Check no hardcoded #fbfcfd remains
if (homeWxss.indexOf('#fbfcfd') >= 0) {
  failures.push('home.wxss still contains hardcoded #fbfcfd');
}

// Verify all .entry-card-* use CSS variables for background
var entryCards = homeWxss.match(/\.entry-card[^{]*\{[\s\S]*?\}/g) || [];
entryCards.forEach(function(block) {
  // Skip entry-card-badge — intentionally uses brand gradient
  if (block.indexOf('entry-card-badge') >= 0) return;
  var bg = block.match(/background:\s*([^;\n]+)/);
  if (bg) {
    var val = bg[1].trim();
    if (val.indexOf('var(--') < 0 && val.indexOf('transparent') < 0 && val.indexOf('none') < 0) {
      var name = block.match(/\.([\w-]+)/);
      failures.push((name ? name[1] : 'unknown') + ' has hardcoded background: ' + val);
    }
  }
});

if (failures.length) {
  console.error('HOME LEARNING FOCUS THEME FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('HOME LEARNING FOCUS THEME PASS');
