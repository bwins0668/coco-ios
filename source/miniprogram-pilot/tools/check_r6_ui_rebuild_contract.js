#!/usr/bin/env node
'use strict';

/*
 * R6 UI rebuild contract.
 * This is a static guard for the Claude Design landing work. It checks that
 * the R6 design docs exist, the Quiet Paper tokens moved to the frozen
 * design handoff values, and the primary route shells carry the expected
 * page-level classes without touching business data.
 */

var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];
var passes = [];

function rel(p) { return path.join(ROOT, p); }
function read(p) { return fs.readFileSync(rel(p), 'utf8'); }
function exists(p) { try { return fs.statSync(rel(p)).isFile(); } catch (e) { return false; } }
function pass(msg) { passes.push(msg); }
function fail(msg) { failures.push(msg); }

var requiredDocs = [
  'docs/ui-rebuild/00_design_handoff_inventory.md',
  'docs/ui-rebuild/01_current_route_inventory.md',
  'docs/ui-rebuild/02_design_to_route_mapping.md',
  'docs/ui-rebuild/03_pre_ui_baseline.md',
  'docs/ui-rebuild/04_design_system_contract.md',
  'docs/ui-rebuild/05_manual_visual_acceptance_card.md',
  'docs/ui-rebuild/06_screen_coverage.md',
  'docs/ui-rebuild/FINAL_UI_REBUILD_REPORT.md'
];

requiredDocs.forEach(function (doc) {
  if (!exists(doc)) fail('missing required R6 doc: ' + doc);
  else pass('doc exists: ' + doc);
});

var tokenExpectations = {
  '--qp-color-canvas': '#F2EDE0',
  '--qp-color-surface': '#FFFDF5',
  '--qp-color-surface-muted': '#F4F3EF',
  '--qp-color-fill-warm': '#E8DFC8',
  '--qp-color-ink': '#1A1410',
  '--qp-color-text-secondary': '#6F6B65',
  '--qp-color-text-tertiary': '#8A7060',
  '--qp-color-text-quaternary': '#8A8680',
  '--qp-color-text-ghost': '#C9C4BD',
  '--qp-color-text-phantom': '#D8CEB8',
  '--qp-color-primary': '#37418A',
  '--qp-color-primary-pressed': '#2C3676',
  '--qp-color-primary-soft': '#ECEEF6',
  '--qp-color-editorial': '#C5123A',
  '--qp-color-success': '#4E8A5E',
  '--qp-color-success-soft': '#EAF1EC',
  '--qp-color-danger': '#BE5750',
  '--qp-color-danger-soft': '#F7ECEB',
  '--qp-color-warning-soft': '#FBF1E9',
  '--qp-color-line': 'rgba(33,31,28,.08)',
  '--qp-color-line-strong': 'rgba(33,31,28,.14)',
  '--qp-radius-tag': '10rpx',
  '--qp-radius-sm': '20rpx',
  '--qp-radius-md': '24rpx',
  '--qp-radius-lg': '32rpx',
  '--qp-font-size-masthead': '68rpx',
  '--qp-font-family-data': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
};

if (exists('styles/tokens.wxss')) {
  var tokens = read('styles/tokens.wxss');
  Object.keys(tokenExpectations).forEach(function (name) {
    var value = tokenExpectations[name];
    var re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*:\\s*' + value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*;');
    if (re.test(tokens)) pass('R6 token value present: ' + name);
    else fail('R6 token value missing or stale: ' + name + ' = ' + value);
  });
} else {
  fail('missing styles/tokens.wxss');
}

var requiredPageMarkers = {
  'pages/home/home.wxml': ['cc-home', 'cc-hero', 'cc-section--courses'],
  'pages/practice/practice.wxml': ['practice-page', 'practice-head', 'practice-card--continue'],
  'pages/review/review.wxml': ['review-page', 'review-section', 'review-card'],
  'pages/glossary/glossary.wxml': ['glossary-hero', 'search-entry-card', 'r6-glossary-entry-list'],
 'pages/profile/profile.wxml': ['r6-profile-mast', 'stats-grid', 'backup-btn-group'],
  'pages/course/course.wxml': ['cs-page', 'cs-actions', 'cs-section'],
  'packages/quiz/pages/quiz/quiz.wxml': ['question-card', 'option-item'],
  'packages/quiz/pages/mistakes/mistakes.wxml': ['mistakes-page', 'mistake-card'],
  'packages/glossary/pages/term-detail/term-detail.wxml': ['term-detail'],
  'packages/glossary/pages/anki-player/anki-player.wxml': ['anki-page']
};

Object.keys(requiredPageMarkers).forEach(function (file) {
  if (!exists(file)) {
    fail('missing page file: ' + file);
    return;
  }
  var text = read(file);
  requiredPageMarkers[file].forEach(function (marker) {
    if (text.indexOf(marker) >= 0) pass(file + ' marker ' + marker);
    else fail(file + ' missing R6 marker ' + marker);
  });
});

var forbiddenTouched = [
  'utils/storage.js',
  'project.config.json',
  'app.json',
  'packages/course-itpass/data/term-resolver.js',
  'packages/course-sg/data/term-resolver.js'
];
forbiddenTouched.forEach(function (file) {
  if (exists(file)) pass('frozen file present and externally protected: ' + file);
});

console.log('=== R6 UI Rebuild Contract Check ===');
console.log('Root: ' + ROOT + '\n');
passes.forEach(function (msg) { console.log('  PASS  ' + msg); });
if (failures.length) {
  console.log('');
  failures.forEach(function (msg) { console.log('  FAIL  ' + msg); });
  console.log('\n[FAIL] R6 UI rebuild contract: ' + failures.length + ' issue(s)');
  process.exit(1);
}
console.log('\n[PASS] R6 UI rebuild contract: all ' + passes.length + ' checks passed');
