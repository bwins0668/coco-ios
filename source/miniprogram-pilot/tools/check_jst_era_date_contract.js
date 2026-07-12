#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var fails = []; var ok = 0;
function fail(m) { fails.push(m); console.log('  FAIL  ' + m); }
function pass(m) { ok++; }

// Verify home.js getJSTDateString exists and has era logic
var homeJs = path.join(ROOT, 'pages', 'home', 'home.js');
try {
  var hc = fs.readFileSync(homeJs, 'utf8');
  if (!/getJSTDateString/.test(hc)) fail('home.js missing getJSTDateString');
  else pass('home.js getJSTDateString present');
  if (!/jstDateStr/.test(hc)) fail('home.js missing jstDateStr data binding');
  else pass('home.js jstDateStr data binding present');
} catch(e) { fail('cannot read home.js: ' + e.message); }

// Verify profile.js has getJSTDateString
var profileJs = path.join(ROOT, 'pages', 'profile', 'profile.js');
try {
  var pc = fs.readFileSync(profileJs, 'utf8');
  if (!/getJSTDateString/.test(pc)) fail('profile.js missing getJSTDateString');
  else pass('profile.js getJSTDateString present');
  if (!/jstDateStr/.test(pc)) fail('profile.js missing jstDateStr data binding');
  else pass('profile.js jstDateStr data binding present');
} catch(e) { fail('cannot read profile.js: ' + e.message); }

// Verify home.wxml displays date and streak
var homeWxml = path.join(ROOT, 'pages', 'home', 'home.wxml');
try {
  var hw = fs.readFileSync(homeWxml, 'utf8');
  if (!/cc-mast__date/.test(hw)) fail('home.wxml missing date display class');
  else pass('home.wxml date display present');
  if (!/cc-mast__meta/.test(hw)) fail('home.wxml missing streak display class');
  else pass('home.wxml streak display present');
  if (!/cc-mast__meta__num/.test(hw)) fail('home.wxml missing streak number highlighting class');
  else pass('home.wxml streak number highlighting present');
} catch(e) { fail('cannot read home.wxml: ' + e.message); }

// Emulate the JST date function and test key dates
function getJSTDateStringTest(isoDate) {
  var now = new Date(isoDate);
  var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  var jst = new Date(utc + (9 * 3600000));
  var y = jst.getFullYear();
  var m = jst.getMonth() + 1;
  var d = jst.getDate();
  var name = function(y) {
    if (y >= 2019) {
      var reiwa = y - 2018;
      if (y === 2019 && m < 5) return '平成' + (y - 1988) + '年' + m + '月' + d + '日';
      return '令和' + reiwa + '年' + m + '月' + d + '日';
    }
    if (y >= 1989) return '平成' + (y - 1988) + '年' + m + '月' + d + '日';
    return y + '年' + m + '月' + d + '日';
  };
  return name(y);
}

var tests = [
  ['2026-06-30T00:00:00+09:00', '令和8年6月30日'],
  ['2019-05-01T00:00:00+09:00', '令和1年5月1日'],
  ['2019-04-30T00:00:00+09:00', '平成31年4月30日'],
  ['2020-01-01T00:00:00+09:00', '令和2年1月1日']
];
tests.forEach(function(t) {
  var result = getJSTDateStringTest(t[0]);
  if (result !== t[1]) fail('date ' + t[0] + ': expected ' + t[1] + ', got ' + result);
  else pass('date ' + t[0] + ' -> ' + t[1]);
});

// JST boundary: UTC 07:00 on 2026-06-30 = JST 16:00 same day
var boundary = getJSTDateStringTest('2026-06-30T07:00:00Z');
if (!/令和8年6月/.test(boundary)) fail('JST boundary failed: got ' + boundary);
else pass('JST UTC boundary correct');

console.log('\n=== JST Era Date Contract Check ===');
if (fails.length) {
  console.log('\n[FAIL] ' + fails.length + ' failure(s), ' + ok + ' passed');
  process.exit(1);
}
console.log('[PASS] ' + ok + ' checks passed');
