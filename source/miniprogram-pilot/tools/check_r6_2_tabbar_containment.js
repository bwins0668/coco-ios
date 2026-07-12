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

var app = JSON.parse(readFileSafe('app.json') || '{}');
if (!app.tabBar || app.tabBar.custom !== true) {
  fail('app.json tabBar.custom is not true');
}
else { pass('app.json tabBar.custom is true'); }

var tabList = (app.tabBar && app.tabBar.list) || [];
if (tabList.length !== 5) {
  fail('tabBar must have exactly 5 entries');
} else { pass('tabBar has 5 entries'); }

/* custom-tab-bar component */
['custom-tab-bar/index.json','custom-tab-bar/index.wxml','custom-tab-bar/index.wxss','custom-tab-bar/index.js']
  .forEach(function (f) {
    if (fileExists(f)) pass('custom tabbar file exists: ' + f);
    else fail('missing custom tabbar file: ' + f);
  });

/* tabbar WXSS: opaque background */
var tabbarWxss = readFileSafe('custom-tab-bar/index.wxss') || '';
if (/background\s*:\s*var\(--qp-color-surface\)/.test(tabbarWxss)) {
  pass('custom-tab-bar has opaque QP surface background');
} else {
  fail('custom-tab-bar missing opaque background');
}

/* tabbar WXSS: safe-area */
if (/env\(safe-area-inset-bottom\)/.test(tabbarWxss)) {
  pass('custom-tab-bar handles safe-area-inset-bottom');
} else {
  fail('custom-tab-bar missing safe-area-inset-bottom');
}

/* tabbar WXSS: fixed positioning */
if (/position\s*:\s*fixed/.test(tabbarWxss)) {
  pass('custom-tab-bar is position:fixed');
} else {
  fail('custom-tab-bar must be position:fixed');
}

/* tabbar WXSS: z-index */
if (/z-index\s*:\s*\d+/.test(tabbarWxss)) {
  pass('custom-tab-bar has z-index');
} else {
  fail('custom-tab-bar missing z-index');
}

/* Each tab page must have bottom padding >= 100rpx */
var TAB_PAGES = {
  'pages/home/home': '课程',
  'pages/practice/practice': '刷题',
  'pages/review/review': '复习',
  'pages/glossary/glossary': '术语',
  'pages/profile/profile': '我的'
};

Object.keys(TAB_PAGES).forEach(function (route) {
  var label = TAB_PAGES[route];
  var wxssRel = route + '.wxss';
  if (!fileExists(wxssRel)) {
    fail(label + ': WXSS file missing ' + wxssRel);
    return;
  }
  var wxss = readFileSafe(wxssRel);

  /* bottom padding must be >= calc(100rpx + env(safe-area-inset-bottom)) */
  var hasBottomPad = /padding-bottom\s*:\s*calc\(10[0-9]rpx\s*\+\s*env\(safe-area-inset-bottom\)\)/.test(wxss); var hasShorthandPad = /padding\s*:\s*[^;]*calc\(10[0-9]rpx\s*\+\s*env\(safe-area-inset-bottom\)\)/.test(wxss);
  // shorthand padding
  if (hasBottomPad || hasShorthandPad) {
    pass(label + ': has adequate bottom padding with safe-area');
  } else {
    var match = wxss.match(/padding-bottom\s*:\s*([^;]+)/g);
    var detail = match ? match.join(', ') : 'none found';
    fail(label + ': bottom padding insufficient or missing safe-area (' + detail + ')');
  }
});

console.log('=== R6.2 TabBar Containment Check ===');
console.log('Root: ' + ROOT);
console.log('');
passes.forEach(function (msg) { console.log('  PASS  ' + msg); });
if (failures.length) {
  console.log('');
  failures.forEach(function (msg) { console.log('  FAIL  ' + msg); });
  console.log('\n[FAIL] R6.2 tabbar containment: ' + failures.length + ' issue(s)');
  process.exit(1);
}
console.log('\n[PASS] R6.2 tabbar containment: all tab pages have proper bottom space');
