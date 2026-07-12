#!/usr/bin/env node
'use strict';

var common = require('./r6_6_contract_common');

var root = common.parseRootArg(process.argv.slice(2));
var inventory = common.loadRoutes(root);
var errors = [];
var passes = [];
var routeRows = [];

function fail(route, message) { errors.push(route + ': ' + message); }
function pass(route, message) { passes.push(route + ': ' + message); }

function hasCustomHeader(wxml) {
  return /data-secondary-route=/.test(wxml) &&
    /(secondary-nav__back|cs-back__btn|r6-exam-nav__back)/.test(wxml) &&
    /bindtap=/.test(wxml);
}

function hasCanvasContract(wxml, wxss) {
  return /secondary-shell/.test(wxml) ||
    /secondary-page-shell\.wxss/.test(wxss) ||
    (/qp-color-canvas|#F2EDE0/.test(wxss) && /background(?:-color)?\s*:\s*var\(--qp-color-canvas\)|background(?:-color)?\s*:\s*#F2EDE0/i.test(wxss));
}

function hasBottomSafe(wxss, wxml) {
  return /safe-area-inset-bottom|secondary-bottom-safe|bottom-safe|calc\([^)]*safe-area|secondary-page-shell\.wxss/i.test(wxss + '\n' + wxml);
}

function hasNativeWhiteRoot(wxss) {
  return /(page|\.container|\.page|\.fc-container|\.fds-container|\.tc-page|\.td-page|\.analysis-page)\s*{[^}]*background(?:-color)?\s*:\s*(#fff|#ffffff|white)\b/i.test(wxss);
}

inventory.routes.forEach(function (info) {
  var route = info.route;
  var cfg = common.readJsonSafe(root, route + '.json') || {};
  var wxml = common.readSafe(root, route + '.wxml');
  var wxss = common.readSafe(root, route + '.wxss');
  var js = common.readSafe(root, route + '.js');
  var row = {
    route: route,
    category: info.category,
    navigationStyle: cfg.navigationStyle || '(native-default)',
    header: hasCustomHeader(wxml),
    canvas: hasCanvasContract(wxml, wxss),
    bottomSafe: hasBottomSafe(wxss, wxml)
  };
  routeRows.push(row);

  ['.json', '.wxml', '.wxss', '.js'].forEach(function (ext) {
    if (!common.exists(root, route + ext)) fail(route, 'missing ' + ext + ' file');
  });

  if (info.category === 'TAB_ROOT') {
    if (/data-secondary-route=|secondary-nav__back|cs-back__btn|r6-exam-nav__back/.test(wxml)) {
      fail(route, 'TAB_ROOT must not gain secondary back/header controls');
    } else {
      pass(route, 'TAB_ROOT has no secondary back control');
    }
    return;
  }

  if (cfg.navigationStyle !== 'custom') {
    fail(route, 'navigationStyle must be custom, got ' + (cfg.navigationStyle || '(native-default)'));
  } else {
    pass(route, 'navigationStyle custom');
  }

  if (!hasCustomHeader(wxml)) {
    fail(route, 'missing real custom secondary header/back control with data-secondary-route');
  } else {
    pass(route, 'custom secondary header/back control');
  }

  if (!/navSafeTop/.test(wxml) || !/getMenuButtonBoundingClientRect|getWindowInfo|getSystemInfoSync|syncNavLayout/.test(js)) {
    fail(route, 'missing runtime navSafeTop/capsule-safe layout contract');
  } else {
    pass(route, 'runtime navSafeTop/capsule-safe layout');
  }

  if (!hasCanvasContract(wxml, wxss)) {
    fail(route, 'missing Quiet Paper canvas contract');
  } else {
    pass(route, 'Quiet Paper canvas contract');
  }

  if (!hasBottomSafe(wxss, wxml)) {
    fail(route, 'missing bottom safe-area contract');
  } else {
    pass(route, 'bottom safe-area contract');
  }

  if (hasNativeWhiteRoot(wxss)) {
    fail(route, 'root/page container uses white background');
  } else {
    pass(route, 'no white root background');
  }
});

console.log('=== R6.6B Global Route Shell Contract ===');
console.log('Root: ' + root);
console.log('Routes: ' + inventory.routes.length);
console.log('TAB_ROOT: ' + inventory.tabRoutes.length);
console.log('SECONDARY: ' + inventory.secondaryRoutes.length);
console.log('');
routeRows.forEach(function (row) {
  console.log([
    row.category,
    row.route,
    'nav=' + row.navigationStyle,
    'header=' + (row.header ? 'yes' : 'no'),
    'canvas=' + (row.canvas ? 'yes' : 'no'),
    'bottomSafe=' + (row.bottomSafe ? 'yes' : 'no')
  ].join(' | '));
});

console.log('');
console.log('Results: ' + passes.length + ' passed, ' + errors.length + ' failed');
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(function (error) { console.log('  - ' + error); });
  console.log('\n[FAIL] R6.6B global route shell contract');
  process.exit(1);
}
console.log('\n[PASS] R6.6B global route shell contract');
