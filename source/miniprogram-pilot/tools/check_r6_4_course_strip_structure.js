#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var fails = []; var ok = 0;
function fail(m) { fails.push(m); console.log('  FAIL  ' + m); }
function pass(m) { ok++; }

// Check home.wxml course strip structure
var wxml = path.join(ROOT, 'pages', 'home', 'home.wxml');
try {
  var content = fs.readFileSync(wxml, 'utf8');
  // Must have r6-course-strip container
  if (!/r6-course-strip/.test(content))
    fail('home.wxml missing r6-course-strip container');
  else pass('r6-course-strip container present');

  // Must have r6-course-strip__abbr and r6-course-strip__name as separate elements
  if (!/r6-course-strip__abbr/.test(content))
    fail('home.wxml missing r6-course-strip__abbr element');
  else pass('r6-course-strip__abbr element present');

  if (!/r6-course-strip__name/.test(content))
    fail('home.wxml missing r6-course-strip__name element');
  else pass('r6-course-strip__name element present');

  // Verify abbr and name are separate view elements, not concatenated in one text
  var abbrIdx = content.indexOf('r6-course-strip__abbr');
  var nameIdx = content.indexOf('r6-course-strip__name');
  if (abbrIdx < 0 || nameIdx < 0) {
    fail('cannot locate abbr and name elements');
  } else {
    // Check that between abbr closing and name opening there is a tag boundary, not plain text
    var between = content.substring(abbrIdx, nameIdx + 5);
    if (/<text[^>]*>.*<text[^>]*>/.test(between))
      fail('abbr and name appear to be nested in same text flow');
    else
      pass('abbr and name are structurally separated');
  }

  // Anti-concatenation: no single text node should contain both abbr and displayName patterns
  var textNodes = content.match(/<text[^>]*>([^<]*)<\/text>/g) || [];
  var badCombine = textNodes.some(function(tn) {
    var inner = tn.replace(/<[^>]+>/g, '');
    // If a text node has two consecutive capitalized words like "PyPython", flag it
    return /[A-Z][a-z]+[A-Z][a-z]+/.test(inner) && /Python|Java|算法/.test(inner);
  });
  if (badCombine) {
    fail('possible abbr-title concatenation detected in text nodes');
  } else {
    pass('no text node concatenation detected');
  }
} catch(e) { fail('cannot read home.wxml: ' + e.message); }

// Check home.wxss has course strip item layout
var wxss = path.join(ROOT, 'pages', 'home', 'home.wxss');
try {
  var css = fs.readFileSync(wxss, 'utf8');
  if (!/r6-course-strip__item/.test(css))
    fail('home.wxss missing r6-course-strip__item CSS');
  else pass('r6-course-strip__item CSS present');

  // Must ensure flex-direction: column to prevent side-by-side
  if (/r6-course-strip__item\s*\{[^}]*flex-direction\s*:\s*column/.test(css))
    pass('r6-course-strip__item uses flex-direction: column');
  else
    fail('r6-course-strip__item missing flex-direction: column');

  if (/r6-course-strip__abbr/.test(css))
    pass('r6-course-strip__abbr CSS present');
  else
    fail('r6-course-strip__abbr CSS missing');

} catch(e) { fail('cannot read home.wxss: ' + e.message); }

// Check that addCourseAbbrs exists and COURSE_ABBR is defined
var homeJs = path.join(ROOT, 'pages', 'home', 'home.js');
try {
  var js = fs.readFileSync(homeJs, 'utf8');
  if (!/COURSE_ABBR/.test(js))
    fail('home.js missing COURSE_ABBR mapping');
  else pass('COURSE_ABBR mapping present');
  if (!/addCourseAbbrs/.test(js))
    fail('home.js missing addCourseAbbrs function');
  else pass('addCourseAbbrs function present');
  if (!/languageCoursesWithAbbr/.test(js))
    fail('home.js missing languageCoursesWithAbbr usage');
  else pass('languageCoursesWithAbbr used in setData');
} catch(e) { fail('cannot read home.js: ' + e.message); }

console.log('\n=== R6.4 Course Strip Structure Check ===');
if (fails.length) {
  console.log('\n[FAIL] ' + fails.length + ' failure(s), ' + ok + ' passed');
  process.exit(1);
}
console.log('[PASS] ' + ok + ' checks passed');
