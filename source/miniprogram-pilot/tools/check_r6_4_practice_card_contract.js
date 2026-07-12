#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var fails = []; var ok = 0;
function fail(m) { fails.push(m); console.log('  FAIL  ' + m); }
function pass(m) { ok++; }

// Check practice.wxml has three-column structure
var wxml = path.join(ROOT, 'pages', 'practice', 'practice.wxml');
try {
  var content = fs.readFileSync(wxml, 'utf8');
  if (!/practice-card--exam/.test(content))
    fail('practice.wxml missing practice-card--exam class');
  else pass('practice-card--exam class present');

  if (!/practice-card__body/.test(content))
    fail('practice.wxml missing practice-card__body');
  else pass('practice-card__body present');

  if (!/practice-card__chev/.test(content))
    fail('practice.wxml missing practice-card__chev');
  else pass('practice-card__chev present');

  // Verify exam cards no longer have practice-card__icon
  if (/practice-card__icon/.test(content))
    fail('practice.wxml still has practice-card__icon (should use left-border accent)');
  else pass('practice-card__icon removed');

  // Count practice-card--exam instances (should be 3: IT, SG, MOS)
  var examMatches = content.match(/practice-card--exam/g);
  if (!examMatches || examMatches.length < 3)
    fail('expected 3 practice-card--exam rows, found ' + (examMatches ? examMatches.length : 0));
  else pass('3 practice-card--exam rows present');

} catch(e) { fail('cannot read practice.wxml: ' + e.message); }

// Check practice.wxss has left-border accent pattern
var wxss = path.join(ROOT, 'pages', 'practice', 'practice.wxss');
try {
  var css = fs.readFileSync(wxss, 'utf8');
  if (!/practice-card--exam/.test(css))
    fail('practice.wxss missing practice-card--exam CSS');
  else pass('practice-card--exam CSS present');

  if (!/border-left/.test(css))
    fail('practice.wxss missing border-left accent (DC HTML pattern)');
  else pass('border-left accent present');

  if (!/practice-card__body[^_]*\{[^}]*overflow\s*:\s*hidden/.test(css))
    fail('practice-card__body missing overflow: hidden');
  else pass('practice-card__body has overflow: hidden');

  // Must have flex-direction: row for exam cards
  if (/practice-card--exam\s*\{[^}]*flex-direction\s*:\s*row/.test(css))
    pass('practice-card--exam flex-direction: row confirmed');
  else if (/\.practice-card\s*\{[^}]*flex-direction\s*:\s*row/.test(css))
    pass('practice-card flex-direction: row confirmed');
  else
    fail('practice cards missing flex-direction: row');
} catch(e) { fail('cannot read practice.wxss: ' + e.message); }

console.log('\n=== R6.4 Practice Card Layout Contract ===');
if (fails.length) {
  console.log('\n[FAIL] ' + fails.length + ' failure(s), ' + ok + ' passed');
  process.exit(1);
}
console.log('[PASS] ' + ok + ' checks passed');
