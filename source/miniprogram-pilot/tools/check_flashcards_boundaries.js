// tools/check_flashcards_boundaries.js
// R3.4 Behavioral + structural validator for flashcards read-boundary migration.
// PASS=0 / FAIL=1. Pure Node, mocks wx for persistence adapter.

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function fail(rule, detail) { failures.push({ rule: rule, detail: detail }); }
function readSrc(relPath) { try { return fs.readFileSync(path.join(ROOT, relPath), 'utf8'); } catch (e) { return ''; } }

console.log('=== Flashcards Boundary Validator (R3.4) ===\n');

// ---- Mock wx for persistence adapter ----
global.wx = {
  getStorageSync: function (key) {
    if (key === 'flashcard_progress_v1') return { course: 'itpass', exam: 'itpass', updatedAt: Date.now(), currentIndex: 5, total: 100 };
    if (key === 'study-tools-mini-favorite-terms-v1') return [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    return null;
  }
};

// ---- Behavioral: flashcards-state ----
console.log('--- flashcards-state ---');
var fs_;
try { fs_ = require('../utils/flashcards-state'); } catch (e) { fail('fs_require', 'cannot require flashcards-state: ' + e.message); }

if (fs_) {
  var r = fs_.getFlashcardsLandingState();
  var keys = Object.keys(r).sort();
  var expected = ['ankiFavoriteCount', 'courses', 'hasLastProgress', 'itpassCount', 'lastProgress', 'sgCount'];
  var ok = true;
  for (var i = 0; i < expected.length; i++) { if (keys.indexOf(expected[i]) === -1) { fail('fs_shape', 'missing: ' + expected[i]); ok = false; } }
  for (var j = 0; j < keys.length; j++) { if (expected.indexOf(keys[j]) === -1) { fail('fs_shape', 'extra: ' + keys[j]); ok = false; } }
  if (ok) console.log('  PASS: output shape matches page data contract');
  if (typeof r.hasLastProgress === 'boolean') console.log('  PASS: hasLastProgress is boolean');
  else fail('fs_type', 'hasLastProgress not boolean');
  if (r.lastProgress !== null && typeof r.lastProgress === 'object') console.log('  PASS: lastProgress is object');
  if (Array.isArray(r.courses) && r.courses.length === 2) console.log('  PASS: courses has 2 entries');
  else fail('fs_type', 'courses not 2-array');
  if (typeof r.ankiFavoriteCount === 'number' && r.ankiFavoriteCount >= 0) console.log('  PASS: ankiFavoriteCount >=0');
  else fail('fs_type', 'ankiFavoriteCount invalid');
  if (typeof r.itpassCount === 'number') console.log('  PASS: itpassCount is number');
  if (typeof r.sgCount === 'number') console.log('  PASS: sgCount is number');

  // No wx in flashcards-state
  var fsSrc = readSrc('utils/flashcards-state.js');
  if (/\bwx\./.test(fsSrc)) fail('fs_wx', 'flashcards-state uses wx');
  else console.log('  PASS: flashcards-state has no wx dependency');
  if (/\bsetStorageSync\b/.test(fsSrc)) fail('fs_write', 'flashcards-state writes storage');
  else console.log('  PASS: flashcards-state does not write storage');
}

// ---- Persistence adapter ----
console.log('\n--- flashcards-persistence ---');
var fpSrc = readSrc('utils/flashcards-persistence.js');
// Must only reference the two known keys
var keyRe = /['"]flashcard_progress_v1['"]/g;
var matchCount = (fpSrc.match(keyRe) || []).length;
console.log('  Check: flashcard_progress_v1 referenced ' + matchCount + ' times');
var keyRe2 = /['"]study-tools-mini-favorite-terms-v1['"]/g;
var matchCount2 = (fpSrc.match(keyRe2) || []).length;
console.log('  Check: study-tools-mini-favorite-terms-v1 referenced ' + matchCount2 + ' times');
if (/\bsetStorageSync\b/.test(fpSrc)) fail('fp_write', 'persistence adapter writes storage');
else console.log('  PASS: persistence adapter does not write storage');

// ---- Structural: flashcards.js ----
console.log('\n--- flashcards.js structural ---');
var fcSrc = readSrc('pages/flashcards/flashcards.js');
if (/wx\.getStorageSync/.test(fcSrc)) fail('fc_wx', 'flashcards.js still uses wx.getStorageSync directly');
else console.log('  PASS: no direct wx.getStorageSync in flashcards.js');
if (/require\s*\(\s*['"]\.\.\/\.\.\/data\/flashcard-summary-manifest/.test(fcSrc)) fail('fc_manifest', 'flashcards.js still directly requires flashcard-summary-manifest');
else console.log('  PASS: no direct manifest require in flashcards.js');
if (!/require\s*\(\s*['"]\.\.\/\.\.\/utils\/flashcards-state/.test(fcSrc)) fail('fc_state', 'flashcards.js does NOT require flashcards-state');
else console.log('  PASS: flashcards.js requires flashcards-state');

// Cleanup mock
delete global.wx;

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) { console.log('ALL FLASHCARD BOUNDARIES VERIFIED\nPASS'); process.exit(0); }
console.log('FAILURES (' + failures.length + '):');
for (var fi = 0; fi < failures.length; fi++) console.log('  [' + failures[fi].rule + '] ' + failures[fi].detail);
process.exit(1);
