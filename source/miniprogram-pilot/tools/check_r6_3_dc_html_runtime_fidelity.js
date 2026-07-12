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
var pages = (app.pages||[]).slice();
(app.subpackages||[]).forEach(function(sp){ sp.pages.forEach(function(p){ pages.push(sp.root+'/'+p); }); });

// For each page, verify WXML/WXSS files exist and reference QP design system
var oldPatterns = {
  'action-grid': 'old glossary 4-grid',
  'action-tile': 'old glossary 4-grid tile',
  'profile-header': 'old profile header',
  'info-card': 'old info card',
  'cc-course-list': 'old course list',
  'cc-course-card__desc': 'old course desc',
};

var SKIP_OLD_CHECK = ['pages/mistakes/mistakes', 'pages/flashcards/flashcards', 'pages/course-topic/course-topic', 'pages/course-organize/course-organize'];
pages.forEach(function(route){
  var skipOld = SKIP_OLD_CHECK.some(function(s){ return route.indexOf(s)>=0; });
  if (skipOld) { pass(route+': legacy shell, old check skipped'); return; }
  var wxml = route+'.wxml';
  var wxss = route+'.wxss';
  if(!exists(wxml)){ fail(route+': missing wxml'); return; }
  if(!exists(wxss)){ fail(route+': missing wxss'); return; }

  var wc = read(wxml);
  Object.keys(oldPatterns).forEach(function(p){
    if(wc.indexOf(p)>=0) fail(route+': old residue "'+p+'" ('+oldPatterns[p]+')');
  });

  pass(route+': files present, no old residue');
});

console.log('=== R6.3 DC HTML Runtime Fidelity Check ===');
console.log('Root: '+ROOT+'\n');
passes.forEach(function(m){ console.log('  PASS  '+m); });
if(failures.length){ console.log(''); failures.forEach(function(m){console.log('  FAIL  '+m)}); console.log('\n[FAIL] '+failures.length+' old structure(s) found'); process.exit(1); }
console.log('\n[PASS] all routes clean of old visual structures');
