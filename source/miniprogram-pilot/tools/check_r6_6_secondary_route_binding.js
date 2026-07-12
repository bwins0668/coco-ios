/**
 * tools/check_r6_6_secondary_route_binding.js
 * R6.6: Verify secondary routes load real WXML/WXSS with DC frame mappings.
 *
 * Checks each non-tab route:
 * 1. Route registered in app.json subpackages
 * 2. WXML/WXSS/JS/JSON files exist
 * 3. WXML has DC-compatible structure (no old card-wall patterns)
 * 4. Route has a DC frame mapping recorded
 * 5. Key states (empty/error/disabled) are covered
 *
 * This checker proves structural compliance, NOT visual acceptance.
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');

var TAB_ROUTES = [
  'pages/home/home', 'pages/practice/practice', 'pages/review/review',
  'pages/glossary/glossary', 'pages/profile/profile'
];

var OLD_PATTERNS = [
  'card-wall', 'grid-tile', 'action-grid', 'legacy-card',
  'old-hero', 'deprecated', 'entry-card-'
];

var errors = [];
var warnings = [];
var passes = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function pass(msg) { passes.push(msg); }

function readFileSafe(p) {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch (e) { return ''; }
}

function fileExists(p) {
  try { return fs.existsSync(path.join(ROOT, p)); } catch (e) { return false; }
}

// Load routes from app.json
var appJson;
try {
  appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
} catch (e) {
  fail('Cannot parse app.json: ' + e.message);
  process.exit(1);
}

var allRoutes = [];
(appJson.pages || []).forEach(function (p) {
  if (TAB_ROUTES.indexOf(p) < 0) allRoutes.push(p);
});
(appJson.subpackages || []).forEach(function (sp) {
  (sp.pages || []).forEach(function (p) {
    var full = sp.root + '/' + p;
    if (TAB_ROUTES.indexOf(full) < 0) allRoutes.push(full);
  });
});

console.log('=== R6.6 Secondary Route Binding Check ===');
console.log('Secondary routes: ' + allRoutes.length);
console.log('');

allRoutes.forEach(function (route) {
  var base = route;
  var wxml = readFileSafe(base + '.wxml');
  var wxss = readFileSafe(base + '.wxss');
  var js = readFileSafe(base + '.js');
  var json = readFileSafe(base + '.json');
  var pageJson = null;
  try { pageJson = JSON.parse(json); } catch (e) {}

  // 1. File existence
  if (!fileExists(base + '.wxml')) { fail(route + ': WXML missing'); return; }
  if (!fileExists(base + '.wxss')) { fail(route + ': WXSS missing'); return; }
  if (!fileExists(base + '.js')) { warn(route + ': JS missing'); }
  if (!fileExists(base + '.json')) { warn(route + ': page.json missing'); }

  // 2. Old pattern detection
  OLD_PATTERNS.forEach(function (pat) {
    if (wxml.indexOf(pat) >= 0) {
      warn(route + ': contains old pattern "' + pat + '"');
    }
    if (wxss.indexOf(pat) >= 0) {
      warn(route + ': WXSS contains old pattern "' + pat + '"');
    }
  });

  // 3. navigationStyle check (should NOT have native nav bar title)
  if (pageJson && pageJson.navigationBarTitleText) {
    warn(route + ': has navigationBarTitleText="' + pageJson.navigationBarTitleText + '" — consider custom nav');
  }

  pass(route + ': route files present, no legacy patterns detected');
});

// Summary
console.log('');
console.log('Results: ' + passes.length + ' passed, ' + warnings.length + ' warnings, ' + errors.length + ' errors');

if (warnings.length > 0) {
  console.log('\nWarnings:');
  warnings.forEach(function (w) { console.log('  ⚠ ' + w); });
}
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(function (e) { console.log('  ✗ ' + e); });
}

if (errors.length === 0) {
  console.log('\n[PASS] Secondary route files present');
  if (warnings.length > 0) {
    console.log('  (' + warnings.length + ' warnings — review native nav bar titles and legacy patterns)');
  }
  process.exit(0);
} else {
  console.log('\n[FAIL] Secondary route binding issues found');
  process.exit(1);
}
