#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
var passes = [];
var traces = [];

function rel(p) {
  return path.join(ROOT, p);
}

function read(p) {
  return fs.readFileSync(rel(p), 'utf8');
}

function exists(p) {
  try {
    return fs.statSync(rel(p)).isFile();
  } catch (e) {
    return false;
  }
}

function pass(msg) {
  passes.push(msg);
}

function fail(msg) {
  failures.push(msg);
}

function requireText(file, text, msg) {
  if (file.indexOf(text) >= 0) pass(msg);
  else fail(msg);
}

function forbidText(file, text, msg) {
  if (file.indexOf(text) >= 0) fail(msg);
  else pass(msg);
}

function pageFiles(route) {
  return {
    json: route + '.json',
    wxml: route + '.wxml',
    wxss: route + '.wxss',
    js: route + '.js'
  };
}

function checkPage(label, tabText, contract) {
  var tab = tabByText[tabText];
  if (!tab) {
    fail(label + ': app.json tabBar missing tab text "' + tabText + '"');
    return;
  }
  var route = tab.pagePath;
  var files = pageFiles(route);
  ['json', 'wxml', 'wxss', 'js'].forEach(function (kind) {
    if (exists(files[kind])) pass(label + ': ' + files[kind] + ' exists');
    else fail(label + ': missing ' + files[kind]);
  });
  if (!exists(files.wxml) || !exists(files.wxss)) return;

  var wxml = read(files.wxml);
  var wxss = read(files.wxss);
  contract.wxmlRequired.forEach(function (marker) {
    requireText(wxml, marker, label + ': actual WXML marker "' + marker + '"');
  });
  contract.wxssRequired.forEach(function (marker) {
    requireText(wxss, marker, label + ': actual WXSS marker "' + marker + '"');
  });
  contract.wxmlForbidden.forEach(function (marker) {
    forbidText(wxml, marker, label + ': old WXML residue forbidden "' + marker + '"');
  });

  traces.push({
    tab: tabText,
    route: route,
    wxml: files.wxml,
    wxss: files.wxss,
    componentChain: 'app.json tabBar custom=true -> custom-tab-bar/index -> ' + files.wxml
  });
}

var app;
try {
  app = JSON.parse(read('app.json'));
} catch (e) {
  fail('cannot parse app.json: ' + e.message);
  app = {};
}

var tabBar = app.tabBar || {};
var list = Array.isArray(tabBar.list) ? tabBar.list : [];
var tabByText = {};
list.forEach(function (item) {
  tabByText[item.text] = item;
});

if (tabBar.custom === true) pass('app.json tabBar.custom is true');
else fail('app.json tabBar.custom must be true so the runtime shared R6.1 tabbar is loaded');

[
  'custom-tab-bar/index.json',
  'custom-tab-bar/index.wxml',
  'custom-tab-bar/index.wxss',
  'custom-tab-bar/index.js'
].forEach(function (file) {
  if (exists(file)) pass('runtime custom tabbar file exists: ' + file);
  else fail('missing runtime custom tabbar file: ' + file);
});

if (exists('custom-tab-bar/index.wxml')) {
  var tabbarWxml = read('custom-tab-bar/index.wxml');
  requireText(tabbarWxml, 'r6-tabbar', 'custom-tab-bar WXML has R6.1 root marker');
  requireText(tabbarWxml, 'switchTab', 'custom-tab-bar WXML binds switchTab');
}
if (exists('custom-tab-bar/index.js')) {
  var tabbarJs = read('custom-tab-bar/index.js');
  list.forEach(function (item) {
    requireText(tabbarJs, item.pagePath, 'custom-tab-bar JS knows route ' + item.pagePath);
  });
}

checkPage('Course tab', '课程', {
  wxmlRequired: [
    'data-r6-active-tab="course"',
    'r6-section-label',
    'cc-exam-row',
    'r6-course-strip',
    'cc-hero'
  ],
  wxssRequired: [
    '.r6-section-label',
    '.cc-exam-row',
    '.r6-course-strip',
    '.cc-hero'
  ],
  wxmlForbidden: [
    'cc-course-list',
    'cc-course-card__desc'
  ]
});

checkPage('Glossary tab', '术语', {
  wxmlRequired: [
    'data-r6-active-tab="glossary"',
    'r6-glossary-search',
    'r6-glossary-entry-list',
    'r6-glossary-row',
    'bindtap="goToAnkiPlayer"',
    'bindtap="goToRandomTerm"'
  ],
  wxssRequired: [
    '.r6-glossary-search',
    '.r6-glossary-entry-list',
    '.r6-glossary-row'
  ],
  wxmlForbidden: [
    'action-grid',
    'action-tile'
  ]
});

checkPage('Profile tab', '我的', {
  wxmlRequired: [
    'data-r6-active-tab="profile"',
    'r6-profile-stat-strip',
    'r6-profile-mast',
    'r6-profile-row',
    'r6-section-label'
  ],
  wxssRequired: [
    '.r6-profile-stat-strip',
    '.r6-profile-mast',
    '.r6-profile-row',
    '.r6-section-label'
  ],
  wxmlForbidden: [
    'profile-header',
    'info-card'
  ]
});

console.log('=== R6.1 Active Tab Runtime Binding Check ===');
console.log('Root: ' + ROOT);
console.log('');
traces.forEach(function (trace) {
  console.log('- ' + trace.tab + ': ' + trace.route);
  console.log('  WXML: ' + trace.wxml);
  console.log('  WXSS: ' + trace.wxss);
  console.log('  Chain: ' + trace.componentChain);
});
console.log('');
passes.forEach(function (msg) {
  console.log('  PASS  ' + msg);
});
if (failures.length) {
  console.log('');
  failures.forEach(function (msg) {
    console.log('  FAIL  ' + msg);
  });
  console.log('\n[FAIL] R6.1 active tab binding: ' + failures.length + ' issue(s)');
  process.exit(1);
}

console.log('\n[PASS] R6.1 active tab binding: actual tab routes load the R6.1 implementation');
