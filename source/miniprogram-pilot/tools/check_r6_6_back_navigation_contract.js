#!/usr/bin/env node
'use strict';

var common = require('./r6_6_contract_common');

var root = common.parseRootArg(process.argv.slice(2));
var inventory = common.loadRoutes(root);
var registered = common.registeredRouteSet(inventory.routes);
var navJs = common.readSafe(root, 'utils/secondary-navigation.js');
var fallbackMap = common.extractFallbackMap(navJs);
var errors = [];
var passes = [];
var rows = [];

function fail(route, message) { errors.push(route + ': ' + message); }
function pass(route, message) { passes.push(route + ': ' + message); }

function findBackControl(wxml) {
  var rx = /<view\b([^>]*(?:secondary-nav__back|cs-back__btn|r6-exam-nav__back)[^>]*)>/g;
  var match;
  while ((match = rx.exec(wxml))) {
    var tag = match[1];
    var handler = (tag.match(/bindtap=["']([^"']+)["']/) || tag.match(/catchtap=["']([^"']+)["']/) || [])[1] || '';
    var route = (tag.match(/data-secondary-route=["']([^"']+)["']/) || [])[1] || '';
    var klass = (tag.match(/class=["']([^"']+)["']/) || [])[1] || '';
    if (handler) return { tag: tag, handler: handler, route: route, klass: klass };
  }
  return null;
}

function hasHitTargetCss(route, klass, wxss) {
  var classNames = String(klass || '').split(/\s+/).filter(Boolean);
  classNames.push('secondary-nav__back');
  var source = wxss + '\n' + common.readSafe(root, 'styles/secondary-page-shell.wxss');
  for (var i = 0; i < classNames.length; i++) {
    var name = classNames[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var rx = new RegExp('\\.' + name + '\\s*{[^}]*?(?:width|min-width)\\s*:\\s*72rpx[^}]*?(?:height|min-height)\\s*:\\s*72rpx', 's');
    if (rx.test(source)) return true;
  }
  return false;
}

if (!navJs) {
  errors.push('utils/secondary-navigation.js: missing shared secondary navigation utility');
} else {
  passes.push('utils/secondary-navigation.js: present');
}

inventory.secondaryRoutes.forEach(function (info) {
  var route = info.route;
  var wxml = common.readSafe(root, route + '.wxml');
  var wxss = common.readSafe(root, route + '.wxss');
  var js = common.readSafe(root, route + '.js');
  var control = findBackControl(wxml);
  var fallback = fallbackMap[route];
  rows.push({
    route: route,
    control: control ? control.handler : '(missing)',
    fallback: fallback ? fallback.url : '(missing)'
  });

  if (!control) {
    fail(route, 'missing visible left back/exit control');
  } else {
    pass(route, 'visible left control bound to ' + control.handler);
    if (!control.route || control.route !== route) {
      fail(route, 'back control data-secondary-route must equal route');
    } else {
      pass(route, 'back control route marker matches');
    }
    if (/container|page\b|root|shell\s*$/.test(control.klass) && !/secondary-nav__back|cs-back__btn|r6-exam-nav__back/.test(control.klass)) {
      fail(route, 'back control appears bound to a broad/full-width container');
    }
    if (!hasHitTargetCss(route, control.klass, wxss)) {
      fail(route, 'back/exit control must have at least 72rpx x 72rpx hit target');
    } else {
      pass(route, '72rpx x 72rpx hit target');
    }
    var handlerRx = new RegExp(control.handler + '\\s*:\\s*function\\s*\\([^)]*\\)\\s*{([\\s\\S]*?)(?:\\n\\s{2}[A-Za-z0-9_]+\\s*:\\s*function|\\n\\s*}\\);)', 'g');
    var handlerBody = '';
    var handlerMatch;
    while ((handlerMatch = handlerRx.exec(js))) {
      handlerBody = handlerMatch[1] || handlerBody;
    }
    if (!handlerBody || handlerBody.indexOf('secondaryNav.back') < 0) {
      fail(route, 'handler ' + control.handler + ' must call secondaryNav.back for stack + direct-entry fallback');
    } else {
      pass(route, 'handler uses secondaryNav.back');
    }
  }

  if (!fallback) {
    fail(route, 'missing canonical fallback in SECONDARY_FALLBACKS');
  } else {
    var fallbackRoute = common.stripQuery(fallback.url);
    if (!registered[fallbackRoute]) {
      fail(route, 'fallback target is not a registered route: ' + fallback.url);
    } else {
      pass(route, 'fallback target registered: ' + fallback.url);
    }
    if (fallback.type !== 'switchTab' && fallback.type !== 'navigateTo' && fallback.type !== 'redirectTo') {
      fail(route, 'fallback type must be switchTab/navigateTo/redirectTo, got ' + fallback.type);
    }
  }
});

console.log('=== R6.6B Back Navigation Contract ===');
console.log('Root: ' + root);
console.log('Secondary routes: ' + inventory.secondaryRoutes.length);
console.log('');
rows.forEach(function (row) {
  console.log(row.route + ' | handler=' + row.control + ' | fallback=' + row.fallback);
});
console.log('');
console.log('Results: ' + passes.length + ' passed, ' + errors.length + ' failed');
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(function (error) { console.log('  - ' + error); });
  console.log('\n[FAIL] R6.6B back navigation contract');
  process.exit(1);
}
console.log('\n[PASS] R6.6B back navigation contract');
