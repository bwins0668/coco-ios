// tools/check_tab_read_models.js
// R3.3 Behavioral + structural validator for mistakes/glossary read-model migration.
// PASS=0 / FAIL=1. Pure Node, no wx, no storage writes.

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function fail(rule, detail) { failures.push({ rule: rule, detail: detail }); }
function readSrc(relPath) { try { return fs.readFileSync(path.join(ROOT, relPath), 'utf8'); } catch (e) { return ''; } }

console.log('=== Tab Read-Model Migration Validator (R3.3) ===\n');

// ---- Behavioral: mistakes-state ----
console.log('--- mistakes-state ---');
var ms;
try { ms = require('../utils/mistakes-state'); } catch (e) { fail('ms_require', 'cannot require mistakes-state: ' + e.message); }

if (ms) {
  var r = ms.getMistakesLandingState();
  var keys = Object.keys(r).sort();
  var expected = ['itpassCount', 'lastWrongTime', 'sgCount', 'wrongCount'];
  var ok = true;
  for (var i = 0; i < expected.length; i++) { if (keys.indexOf(expected[i]) === -1) { ok = false; fail('ms_shape', 'missing key: ' + expected[i]); } }
  for (var j = 0; j < keys.length; j++) { if (expected.indexOf(keys[j]) === -1) { ok = false; fail('ms_shape', 'extra key: ' + keys[j]); } }
  if (ok) console.log('  PASS: output shape matches page data contract');
  if (typeof r.wrongCount === 'number' && r.wrongCount >= 0) console.log('  PASS: wrongCount is number >=0');
  else fail('ms_type', 'wrongCount invalid: ' + JSON.stringify(r.wrongCount));
  if (typeof r.itpassCount === 'number' && r.itpassCount >= 0) console.log('  PASS: itpassCount is number >=0');
  else fail('ms_type', 'itpassCount invalid: ' + JSON.stringify(r.itpassCount));
  if (typeof r.sgCount === 'number' && r.sgCount >= 0) console.log('  PASS: sgCount is number >=0');
  else fail('ms_type', 'sgCount invalid: ' + JSON.stringify(r.sgCount));
  if (typeof r.lastWrongTime === 'string') console.log('  PASS: lastWrongTime is string');
  else fail('ms_type', 'lastWrongTime invalid: ' + JSON.stringify(r.lastWrongTime));

  // Verify no wx/Page/write deps
  var msSrc = readSrc('utils/mistakes-state.js');
  if (!/require\s*\(\s*['"]\.\/storage['"]\s*\)/.test(msSrc)) fail('ms_dep', 'mistakes-state does not require storage');
  else console.log('  PASS: mistakes-state requires storage');
  if (/\bsetStorageSync\b/.test(msSrc)) fail('ms_dep', 'mistakes-state writes storage');
  else console.log('  PASS: mistakes-state does not write storage');
  if (/\bwx\./.test(msSrc)) fail('ms_dep', 'mistakes-state uses wx');
  else console.log('  PASS: mistakes-state has no wx dependency');
}

// ---- Behavioral: glossary-state ----
console.log('\n--- glossary-state ---');
var gs;
try { gs = require('../utils/glossary-state'); } catch (e) { fail('gs_require', 'cannot require glossary-state: ' + e.message); }

if (gs) {
  var gr = gs.getGlossaryLandingState();
  var gkeys = Object.keys(gr).sort();
  if (gkeys.length === 1 && gkeys[0] === 'favoriteCount') console.log('  PASS: output shape matches page data contract');
  else fail('gs_shape', 'expected {favoriteCount}, got: ' + JSON.stringify(gkeys));
  if (typeof gr.favoriteCount === 'number' && gr.favoriteCount >= 0) console.log('  PASS: favoriteCount is number >=0');
  else fail('gs_type', 'favoriteCount invalid: ' + JSON.stringify(gr.favoriteCount));

  var gsSrc = readSrc('utils/glossary-state.js');
  if (/\bsetStorageSync\b/.test(gsSrc)) fail('gs_dep', 'glossary-state writes storage');
  else console.log('  PASS: glossary-state does not write storage');
  if (/\bwx\./.test(gsSrc)) fail('gs_dep', 'glossary-state uses wx');
  else console.log('  PASS: glossary-state has no wx dependency');
}

// ---- Structural: mistakes.js ----
console.log('\n--- mistakes.js structural ---');
var misSrc = readSrc('pages/mistakes/mistakes.js');
if (/require\s*\(\s*["']\.\.\/\.\.\/utils\/storage/.test(misSrc)) fail('mis_struct', 'mistakes.js still requires storage directly');
else console.log('  PASS: mistakes.js does not require storage directly');
if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/mistakes-state/.test(misSrc)) fail('mis_struct', 'mistakes.js does not require mistakes-state');
else console.log('  PASS: mistakes.js requires mistakes-state');
if (/\bgetWrongQuestionCount\b/.test(misSrc)) fail('mis_struct', 'mistakes.js still calls getWrongQuestionCount');
else console.log('  PASS: no direct storage API call in mistakes.js');
if (!/nav\.goMistakes\(\)/.test(misSrc)) fail('mis_struct', 'mistakes.js missing nav.goMistakes()');
else console.log('  PASS: mistakes.js uses nav.goMistakes()');

// ---- Structural: glossary.js ----
console.log('\n--- glossary.js structural ---');
var glsSrc = readSrc('pages/glossary/glossary.js');
if (/require\s*\(\s*["']\.\.\/\.\.\/utils\/storage/.test(glsSrc)) fail('gls_struct', 'glossary.js still requires storage directly');
else console.log('  PASS: glossary.js does not require storage directly');
if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/glossary-state/.test(glsSrc)) fail('gls_struct', 'glossary.js does not require glossary-state');
else console.log('  PASS: glossary.js requires glossary-state');
if (/\bgetFavoriteTermCount\b/.test(glsSrc)) fail('gls_struct', 'glossary.js still calls getFavoriteTermCount');
else console.log('  PASS: no direct storage API call in glossary.js');
if (!/nav\.goGlossaryRandomTerm\(\)/.test(glsSrc)) fail('gls_struct', 'glossary.js missing nav.goGlossaryRandomTerm()');
else console.log('  PASS: glossary.js uses nav intents');

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) {
  console.log('ALL READ-MODEL CHECKS PASS');
  process.exit(0);
}
console.log('FAILURES (' + failures.length + '):');
for (var fi = 0; fi < failures.length; fi++) console.log('  [' + failures[fi].rule + '] ' + failures[fi].detail);
process.exit(1);
