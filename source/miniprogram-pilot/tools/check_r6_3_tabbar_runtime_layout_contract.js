#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = []; var passes = [];
function fail(m){ failures.push(m); } function pass(m){ passes.push(m); }
function read(f){ try{return fs.readFileSync(path.join(ROOT,f),'utf8')}catch(e){return null} }
function exists(f){ try{return fs.statSync(path.join(ROOT,f)).isFile()}catch(e){return false} }

var app = JSON.parse(read('app.json')||'{}');
if(app.tabBar&&app.tabBar.custom===true) pass('app.json custom tabbar enabled');
else fail('app.json tabBar.custom must be true');

var tabs = (app.tabBar&&app.tabBar.list)||[];
if(tabs.length===5) pass('5 tab entries');
else fail('tab count mismatch: '+tabs.length);

// Verify all 5 tab pages have bottom padding with safe-area
var hasBottom = /padding\s*:\s*[^;]*calc\(10[0-9]rpx\s*\+\s*env\(safe-area-inset-bottom\)\)/.source;
var hasPadBottom = /padding-bottom\s*:\s*calc\(10[0-9]rpx\s*\+\s*env\(safe-area-inset-bottom\)\)/.source;

tabs.forEach(function(t){
  var wxss = t.pagePath+'.wxss';
  var c = read(wxss)||'';
  if(new RegExp(hasBottom).test(c)||new RegExp(hasPadBottom).test(c))
    pass(t.pagePath+': has shared bottom inset');
  else
    fail(t.pagePath+': missing shared bottom inset');
});

// Tabbar must be fixed + opaque + z-indexed
var tb = read('custom-tab-bar/index.wxss')||'';
if(/position\s*:\s*fixed/.test(tb)) pass('tabbar position:fixed');
else fail('tabbar not position:fixed');
if(/background\s*:\s*var\(--qp-color-surface\)/.test(tb)) pass('tabbar opaque background');
else fail('tabbar missing opaque background');
if(/z-index\s*:\s*999/.test(tb)) pass('tabbar z-index:999');
else fail('tabbar missing z-index');

console.log('=== R6.3 TabBar Runtime Layout Contract ===');
console.log('Root: '+ROOT+'\n');
passes.forEach(function(m){ console.log('  PASS  '+m); });
if(failures.length){ console.log(''); failures.forEach(function(m){console.log('  FAIL  '+m)}); console.log('\n[FAIL] '+failures.length+' issue(s)'); process.exit(1); }
console.log('\n[PASS] all tab pages share bottom inset contract');
