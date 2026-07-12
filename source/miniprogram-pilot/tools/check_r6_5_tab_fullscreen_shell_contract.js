/**
 * tools/check_r6_5_tab_fullscreen_shell_contract.js
 * R6.5.5: Verify all 5 tab root pages use navigationStyle:custom fullscreen shell.
 *
 * Checks:
 * 1. Each tab page.json has navigationStyle: "custom"
 * 2. No tab page.json uses navigationBarTitleText
 * 3. Each tab page WXML has navSafeTop binding on root element
 * 4. Each tab page JS has _syncNavLayout() + navSafeTop data
 * 5. Each tab page WXSS uses QP canvas background
 * 6. Each tab page WXSS has bottom inset for TabBar containment
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');

var TAB_ROUTES = [
  { route: 'pages/home/home', label: '课程' },
  { route: 'pages/practice/practice', label: '刷题' },
  { route: 'pages/review/review', label: '复习' },
  { route: 'pages/glossary/glossary', label: '术语' },
  { route: 'pages/profile/profile', label: '我的' }
];

var errors = [];
var passes = [];

function fail(msg) { errors.push(msg); }
function pass(msg) { passes.push(msg); }

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; }
}

TAB_ROUTES.forEach(function (tab) {
  var jsonFile = path.join(ROOT, tab.route + '.json');
  var wxmlFile = path.join(ROOT, tab.route + '.wxml');
  var wxssFile = path.join(ROOT, tab.route + '.wxss');
  var jsFile = path.join(ROOT, tab.route + '.js');

  // ---- 1. page.json ----
  var jsonContent = readFileSafe(jsonFile);
  if (!jsonContent) {
    fail(tab.label + ': page.json missing');
    return;
  }
  try {
    var cfg = JSON.parse(jsonContent);
    if (cfg.navigationStyle !== 'custom') {
      fail(tab.label + ': navigationStyle is ' + (cfg.navigationStyle || 'default') + ', expected custom');
    } else {
      pass(tab.label + ': navigationStyle = custom');
    }
    if (cfg.navigationBarTitleText) {
      fail(tab.label + ': has navigationBarTitleText="' + cfg.navigationBarTitleText + '" — must use custom WXML title instead');
    } else {
      pass(tab.label + ': no native navigationBarTitleText');
    }
  } catch (e) {
    fail(tab.label + ': cannot parse page.json: ' + e.message);
    return;
  }

  // ---- 2. WXML: navSafeTop binding ----
  var wxml = readFileSafe(wxmlFile);
  if (wxml.indexOf('navSafeTop') < 0) {
    fail(tab.label + ': WXML missing navSafeTop binding');
  } else {
    pass(tab.label + ': WXML has navSafeTop binding');
  }

  // ---- 3. JS: _syncNavLayout + navSafeTop data ----
  var js = readFileSafe(jsFile);
  if (js.indexOf('_syncNavLayout') < 0) {
    fail(tab.label + ': JS missing _syncNavLayout method');
  } else {
    pass(tab.label + ': JS has _syncNavLayout');
  }
  if (js.indexOf('navSafeTop') < 0 || js.indexOf('navSafeTop: 64') < 0) {
    fail(tab.label + ': JS missing navSafeTop: 64 data field');
  } else {
    pass(tab.label + ': JS has navSafeTop data');
  }

  // ---- 4. WXSS: QP background + bottom inset ----
  var wxss = readFileSafe(wxssFile);
  var hasCanvas = wxss.indexOf('qp-color-canvas') >= 0 || wxss.indexOf('#F2EDE0') >= 0;
  if (!hasCanvas) {
    fail(tab.label + ': WXSS missing QP canvas background');
  } else {
    pass(tab.label + ': WXSS has QP canvas background');
  }
  if (wxss.indexOf('safe-area-inset-bottom') < 0) {
    fail(tab.label + ': WXSS missing safe-area bottom inset');
  } else {
    pass(tab.label + ': WXSS has safe-area bottom inset');
  }
});

// ---- Report ----
console.log('=== R6.5.5 Tab Fullscreen Shell Contract ===\n');

TAB_ROUTES.forEach(function (tab) {
  // just runs checks
});

console.log('Results: ' + passes.length + ' passed, ' + errors.length + ' failed');

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(function (e) { console.log('  ✗ ' + e); });
}

if (errors.length === 0) {
  console.log('\n[PASS] All 5 tab roots use custom fullscreen shell');
  process.exit(0);
} else {
  console.log('\n[FAIL] Tab fullscreen shell contract not met');
  process.exit(1);
}
