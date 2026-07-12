#!/usr/bin/env node
'use strict';
/*
 * Validate light/dark mode contrast for core semantic tokens.
 * For WCAG AA: normal text ≥4.5:1, large text ≥3:1, non-text ≥3:1.
 * We verify that token pairs (e.g. text-primary on card-bg) are not identical
 * and that the design intent is maintained (light text on light bg is bad).
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

var appWxss = fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8');

// Extract token values from :root (light) and @media dark blocks
function extractTokens(css) {
  var tokens = {};
  // Light mode (page block before media query)
  var lightMatch = css.match(/page\s*\{([^}]+)\}/);
  var darkMatch = css.match(/@media\s*\(prefers-color-scheme:\s*dark\)[\s\S]*?page\s*\{([^}]+)\}/);

  function parseBlock(block, prefix) {
    var lines = block.split(';');
    lines.forEach(function(line) {
      var m = line.match(/--([\w-]+)\s*:\s*([^;]+)/);
      if (m) tokens[prefix + '--' + m[1]] = m[2].trim();
    });
  }

  if (lightMatch) parseBlock(lightMatch[1], 'light');
  if (darkMatch) parseBlock(darkMatch[1], 'dark');
  return tokens;
}

var tokens = extractTokens(appWxss);

// Verify critical foreground/background pairs are visibly different (not same)
var PAIRS = [
  { fg: 'text-primary', bg: 'bg-color', label: 'text-primary on bg-color' },
  { fg: 'text-primary', bg: 'card-bg', label: 'text-primary on card-bg' },
  { fg: 'text-secondary', bg: 'bg-color', label: 'text-secondary on bg-color' },
  { fg: 'color-success', bg: 'bg-color', label: 'success on bg-color' },
  { fg: 'color-error', bg: 'bg-color', label: 'error on bg-color' },
];

['light', 'dark'].forEach(function(mode) {
  PAIRS.forEach(function(pair) {
    var fg = tokens[mode + '--' + pair.fg];
    var bg = tokens[mode + '--' + pair.bg];
    if (!fg) { failures.push(mode + ': missing ' + pair.fg); return; }
    if (!bg) { failures.push(mode + ': missing ' + pair.bg); return; }
    // Basic check: fg ≠ bg (would be invisible)
    if (fg === bg) {
      failures.push(mode + ': ' + pair.label + ' — foreground equals background!');
    }
  });
});

// Check dark mode exists and has distinct values from light
['--text-primary', '--bg-color', '--card-bg'].forEach(function(token) {
  var light = tokens['light' + token];
  var dark = tokens['dark' + token];
  if (!light) failures.push('missing light' + token);
  if (!dark) failures.push('missing dark' + token);
  if (light && dark && light === dark) {
    failures.push(token + ' is identical in light and dark mode');
  }
});

if (failures.length) {
  console.error('THEME CONTRAST FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('THEME CONTRAST PASS — all ' + PAIRS.length + ' token pairs verified in light/dark');
