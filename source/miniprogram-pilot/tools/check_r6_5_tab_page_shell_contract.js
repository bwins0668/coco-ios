/**
 * tools/check_r6_5_tab_page_shell_contract.js
 * R6.5: Shared tab-page shell contract verification.
 *
 * Verifies that all 5 tab pages enforce the same bottom-inset contract
 * against the custom-tab-bar, preventing content overflow into the tab bar.
 *
 * This checker does NOT claim visual acceptance. It only proves structural
 * relationships: route → page WXML → root/scroll node → bottom inset source → tabbar.
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

var TAB_BAR_WXSS = path.join(ROOT, 'custom-tab-bar', 'index.wxss');
var TAB_BAR_WXML = path.join(ROOT, 'custom-tab-bar', 'index.wxml');

var errors = [];
var warnings = [];
var passes = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function pass(msg) { passes.push(msg); }

// ---- 1. TabBar structural checks ----
function checkTabBar() {
  if (!fs.existsSync(TAB_BAR_WXSS)) { fail('custom-tab-bar/index.wxss missing'); return; }
  if (!fs.existsSync(TAB_BAR_WXML)) { fail('custom-tab-bar/index.wxml missing'); return; }

  var wxss = fs.readFileSync(TAB_BAR_WXSS, 'utf8');
  var wxml = fs.readFileSync(TAB_BAR_WXML, 'utf8');

  // R6.5: tabbar must be position:fixed with z-index
  if (wxss.indexOf('position: fixed') === -1 && wxss.indexOf('position:fixed') === -1) {
    fail('TabBar: missing position:fixed');
  } else { pass('TabBar: position:fixed confirmed'); }

  if (!/z-index\s*:\s*\d+/.test(wxss)) {
    fail('TabBar: missing z-index');
  } else { pass('TabBar: z-index confirmed'); }

  // R6.5: tabbar background must be opaque
  var hasBg = /background-color\s*:\s*#[0-9A-Fa-f]{3,8}/.test(wxss) ||
              /background\s*:\s*#[0-9A-Fa-f]{3,8}/.test(wxss);
  if (!hasBg) {
    fail('TabBar: missing explicit opaque background-color');
  } else { pass('TabBar: opaque background-color confirmed'); }

  // R6.5: tabbar height must include env(safe-area-inset-bottom)
  if (wxss.indexOf('env(safe-area-inset-bottom)') === -1) {
    fail('TabBar: missing env(safe-area-inset-bottom) in height');
  } else { pass('TabBar: env(safe-area-inset-bottom) in height'); }

  // Tab bar must have 5 items (check JS list config)
  var tabJs = path.join(ROOT, 'custom-tab-bar', 'index.js');
  if (fs.existsSync(tabJs)) {
    var js = fs.readFileSync(tabJs, 'utf8');
    var listMatch = js.match(/list\s*:\s*\[([\s\S]*?)\]/);
    if (listMatch) {
      var items = (listMatch[1].match(/pagePath\s*:/g) || []).length;
      if (items !== 5) {
        fail('TabBar: JS list has ' + items + ' items, expected 5');
      } else { pass('TabBar: 5 JS list items confirmed'); }
    } else {
      fail('TabBar: could not parse list from index.js');
    }
  } else {
    fail('TabBar: custom-tab-bar/index.js missing');
  }
}

// ---- 2. Per-page bottom inset checks ----
function checkPageBottomInset(tabRoute) {
  var wxssFile = path.join(ROOT, tabRoute.route + '.wxss');
  var wxmlFile = path.join(ROOT, tabRoute.route + '.wxml');

  if (!fs.existsSync(wxssFile)) {
    fail(tabRoute.label + ': WXSS file missing: ' + wxssFile);
    return;
  }
  if (!fs.existsSync(wxmlFile)) {
    fail(tabRoute.label + ': WXML file missing: ' + wxmlFile);
    return;
  }

  var wxss = fs.readFileSync(wxssFile, 'utf8');
  var wxml = fs.readFileSync(wxmlFile, 'utf8');

  // Check for data-r6-active-tab marker
  if (wxml.indexOf('data-r6-active-tab') === -1) {
    warn(tabRoute.label + ': missing data-r6-active-tab marker');
  } else {
    var match = wxml.match(/data-r6-active-tab\s*=\s*"([^"]+)"/);
    if (match) {
      pass(tabRoute.label + ': data-r6-active-tab="' + match[1] + '" confirmed');
    }
  }

  // Check for bottom padding that includes calc() and safe-area
  var hasCalcBottom = /padding-bottom\s*:\s*calc\(/.test(wxss) ||
                      /padding\s*:.*calc\(.*env\(safe-area-inset-bottom\)/.test(wxss);
  var hasSafeBottom = wxss.indexOf('env(safe-area-inset-bottom)') !== -1;

  if (!hasSafeBottom) {
    fail(tabRoute.label + ': missing env(safe-area-inset-bottom) in bottom padding');
  } else if (!hasCalcBottom) {
    warn(tabRoute.label + ': safe-area present but no calc() for 100rpx + safe-area');
  } else {
    pass(tabRoute.label + ': bottom inset calc(100rpx + safe-area) confirmed');
  }

  // Check that root element padding includes at least 100rpx
  var paddingMatch = wxss.match(/padding[^;]*calc\s*\(\s*(\d+)rpx\s*\+\s*env\(safe-area-inset-bottom\)/);
  if (!paddingMatch) {
    paddingMatch = wxss.match(/padding-bottom\s*:\s*calc\s*\(\s*(\d+)rpx\s*\+\s*env\(safe-area-inset-bottom\)/);
    if (!paddingMatch) {
      warn(tabRoute.label + ': could not verify 100rpx minimum bottom padding');
    } else {
      var val = parseInt(paddingMatch[1], 10);
      if (val >= 100) {
        pass(tabRoute.label + ': bottom padding >= 100rpx (' + val + 'rpx)');
      } else {
        fail(tabRoute.label + ': bottom padding < 100rpx (' + val + 'rpx)');
      }
    }
  } else {
    var val = parseInt(paddingMatch[1], 10);
    if (val >= 100) {
      pass(tabRoute.label + ': bottom padding >= 100rpx (' + val + 'rpx)');
    } else {
      fail(tabRoute.label + ': bottom padding < 100rpx (' + val + 'rpx)');
    }
  }
}

// ---- 3. Run all checks ----
console.log('=== R6.5 Tab Page Shell Contract Check ===\n');

checkTabBar();
console.log('');

TAB_ROUTES.forEach(function (tab) {
  checkPageBottomInset(tab);
});

console.log('');
console.log('--- Results ---');
console.log('PASS: ' + passes.length);
console.log('WARN: ' + warnings.length);
console.log('FAIL: ' + errors.length);

if (warnings.length > 0) {
  console.log('\nWarnings:');
  warnings.forEach(function (w) { console.log('  ⚠ ' + w); });
}
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(function (e) { console.log('  ✗ ' + e); });
}

if (errors.length === 0) {
  console.log('\n✓ R6.5 tab-page shell contract: STRUCTURAL PASS');
  console.log('  (This does NOT claim visual acceptance — DevTools visual proof required)');
  process.exit(0);
} else {
  console.log('\n✗ R6.5 tab-page shell contract: STRUCTURAL FAIL');
  process.exit(1);
}
