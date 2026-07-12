// tools/check_legacy_navigation_contracts.js
// R3.2 Navigation compatibility contract validator.
// Verifies every new R3.2 navigation intent produces the EXACT legacy URL.
// PASS=0 / FAIL=1. Pure Node, no wx, no storage.

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function fail(rule, detail) {
  failures.push({ rule: rule, detail: detail });
}

// Read navigation.js source to verify intents are present
var navSrc;
try {
  navSrc = fs.readFileSync(path.join(ROOT, 'utils/navigation.js'), 'utf8');
} catch (e) {
  console.log('FATAL: cannot read utils/navigation.js');
  process.exit(1);
}

// ---- R3.2 intent contract checks ----

// Each intent must produce exactly the expected URL. We verify the source
// code contains the exact URL string, not approximate matches.

var intents = [
  {
    name: 'goMistakesAnkiReview',
    expectedUrl: '/packages/glossary/pages/anki-player/anki-player?source=mistakes&from=mistakes'
  },
  {
    name: 'goGlossaryAnkiReview',
    expectedUrl: '/packages/glossary/pages/anki-player/anki-player?from=glossary'
  },
  {
    name: 'goGlossaryRandomTerm',
    expectedUrl: '/packages/glossary/pages/term-search/term-search?random=1'
  }
];

console.log('=== Legacy Navigation Contract Validator (R3.2) ===\n');

for (var i = 0; i < intents.length; i++) {
  var it = intents[i];
  var reFunc = new RegExp('function\\s+' + it.name + '\\s*\\([^)]*\\)\\s*\\{');
  if (!reFunc.test(navSrc)) {
    fail(it.name, 'function ' + it.name + ' not found in navigation.js');
  } else {
    console.log('  PASS: ' + it.name + ' function exists');
  }

  // Exact URL check — the URL must appear literally in the source
  if (navSrc.indexOf(it.expectedUrl) === -1) {
    fail(it.name, 'exact URL not found: ' + it.expectedUrl);
  } else {
    console.log('  PASS: ' + it.name + ' URL exact match: ' + it.expectedUrl);
  }
}

// ---- Existing API regression checks ----
// Verify existing navigation APIs are NOT altered
var existingChecks = [
  { name: 'goMistakes', url: '/packages/quiz/pages/mistakes/mistakes' },
  { name: 'goAnkiPlayer', url: 'from=home' },
  { name: 'goTermSearch', url: 'pages/term-search/term-search' },
  { name: 'goFavoriteReview', url: 'pages/favorite-review/favorite-review' },
  { name: 'goItPassport', url: 'exam=itpass' }
];

console.log('\n--- Existing API Regression ---');
for (var j = 0; j < existingChecks.length; j++) {
  var ec = existingChecks[j];
  if (navSrc.indexOf(ec.url) === -1) {
    fail(ec.name + '_regression', 'existing URL missing: ' + ec.url);
  } else {
    console.log('  PASS: ' + ec.name + ' URL intact');
  }
}

// ---- No free-form query builder ----
// Ensure no generic go(path, params) or go(url) function was added
var forbiddenPatterns = [
  { pattern: /function\s+go\s*\(\s*\w+\s*,\s*\w+\s*\)/, desc: 'generic go(path, params)' },
  { pattern: /function\s+go\s*\(\s*url\s*\)/, desc: 'generic go(url)' },
  { pattern: /function\s+buildUrl\s*\(/, desc: 'generic buildUrl()' }
];

console.log('\n--- Free-form Query Builder Check ---');
for (var k = 0; k < forbiddenPatterns.length; k++) {
  if (forbiddenPatterns[k].pattern.test(navSrc)) {
    fail('free_form', forbiddenPatterns[k].desc + ' detected in navigation.js');
  } else {
    console.log('  PASS: no ' + forbiddenPatterns[k].desc);
  }
}

// ---- No new storage/canonical/wx deps in new intents ----
// The new functions should be between the R3.2 comment and Legacy aliases
var r32Start = navSrc.indexOf('// ---- R3.2: Legacy tab navigation compatibility intents');
var r32End = navSrc.indexOf('// Legacy aliases');
if (r32Start >= 0 && r32End > r32Start) {
  var r32Block = navSrc.substring(r32Start, r32End);
  console.log('\n--- R3.2 Block Dependency Check ---');
  var depChecks = [
    { name: 'require storage', re: /require\s*\(\s*['"]\.\/storage/, desc: 'storage' },
    { name: 'require canonical', re: /require\s*\(\s*['"].*questions/, desc: 'canonical data' },
    { name: 'wx direct call', re: /\bwx\./, desc: 'wx API direct' }
  ];
  for (var d = 0; d < depChecks.length; d++) {
    if (depChecks[d].re.test(r32Block)) {
      fail('r32_dep', 'R3.2 intents require ' + depChecks[d].desc);
    } else {
      console.log('  PASS: no ' + depChecks[d].name + ' in R3.2 block');
    }
  }
}

// ---- Page migration checks ----

console.log('\n--- Page Migration Checks ---');

// mistakes.js: must NOT contain the old inline wx.navigateTo URLs
var mistakesSrc;
try { mistakesSrc = fs.readFileSync(path.join(ROOT, 'pages/mistakes/mistakes.js'), 'utf8'); } catch (e) { mistakesSrc = ''; }

var oldMistakesUrls = [
  '/packages/quiz/pages/mistakes/mistakes',
  'source=mistakes&from=mistakes',
  'exam=itpass'
];

if (mistakesSrc) {
  for (var mu = 0; mu < oldMistakesUrls.length; mu++) {
    if (mistakesSrc.indexOf(oldMistakesUrls[mu]) >= 0) {
      fail('mistakes_migration', 'old inline URL still present: ' + oldMistakesUrls[mu]);
    } else {
      console.log('  PASS: old mistakes URL removed: ' + oldMistakesUrls[mu]);
    }
  }
  // Must use nav.
  if (mistakesSrc.indexOf('nav.goMistakes()') === -1) fail('mistakes_migration', 'missing nav.goMistakes()');
  else console.log('  PASS: mistakes uses nav.goMistakes()');
  if (mistakesSrc.indexOf('nav.goMistakesAnkiReview()') === -1) fail('mistakes_migration', 'missing nav.goMistakesAnkiReview()');
  else console.log('  PASS: mistakes uses nav.goMistakesAnkiReview()');
  if (mistakesSrc.indexOf('nav.goItPassport()') === -1) fail('mistakes_migration', 'missing nav.goItPassport()');
  else console.log('  PASS: mistakes uses nav.goItPassport()');
} else {
  console.log('  SKIP: mistakes.js not readable');
}

// glossary.js: must NOT contain the old inline wx.navigateTo URLs
var glossarySrc;
try { glossarySrc = fs.readFileSync(path.join(ROOT, 'pages/glossary/glossary.js'), 'utf8'); } catch (e) { glossarySrc = ''; }

var oldGlossaryUrls = [
  'from=glossary',
  'random=1'
];

if (glossarySrc) {
  for (var gu = 0; gu < oldGlossaryUrls.length; gu++) {
    if (glossarySrc.indexOf(oldGlossaryUrls[gu]) >= 0) {
      fail('glossary_migration', 'old inline URL still present: ' + oldGlossaryUrls[gu]);
    } else {
      console.log('  PASS: old glossary URL removed: ' + oldGlossaryUrls[gu]);
    }
  }
  if (glossarySrc.indexOf('nav.goGlossaryAnkiReview()') === -1) fail('glossary_migration', 'missing nav.goGlossaryAnkiReview()');
  else console.log('  PASS: glossary uses nav.goGlossaryAnkiReview()');
  if (glossarySrc.indexOf('nav.goGlossaryRandomTerm()') === -1) fail('glossary_migration', 'missing nav.goGlossaryRandomTerm()');
  else console.log('  PASS: glossary uses nav.goGlossaryRandomTerm()');
} else {
  console.log('  SKIP: glossary.js not readable');
}

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) {
  console.log('ALL NAVIGATION CONTRACTS VERIFIED');
  console.log('PASS');
  process.exit(0);
} else {
  console.log('CONTRACT FAILURES (' + failures.length + '):');
  for (var ii = 0; ii < failures.length; ii++) {
    console.log('  [' + failures[ii].rule + '] ' + failures[ii].detail);
  }
  console.log('\nFAIL');
  process.exit(1);
}
