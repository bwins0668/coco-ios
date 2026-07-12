'use strict';
var fs = require('fs');
var path = require('path');

var root = process.argv[2] || '.';
var appJsonPath = path.join(root, 'app.json');
if (!fs.existsSync(appJsonPath)) { console.error('[FAIL] app.json not found'); process.exit(1); }

var appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
var pages = appJson.pages || [];
var subPackages = appJson.subPackages || appJson.subpackages || [];

var TAB_ROOTS = {
  'pages/home/home': true, 'pages/practice/practice': true,
  'pages/review/review': true, 'pages/glossary/glossary': true,
  'pages/profile/profile': true
};

var secondaryRoutes = [];
pages.forEach(function(r) { if (!TAB_ROOTS[r]) secondaryRoutes.push(r); });
subPackages.forEach(function(pkg) {
  var pr = pkg.root || '';
  (pkg.pages || []).forEach(function(r) {
    var rt = pr + '/' + r;
    if (!TAB_ROOTS[rt]) secondaryRoutes.push(rt);
  });
});

// Load fallback map from secondary-navigation.js
var fallbackRoutes = {};
var navPath = path.join(root, 'utils', 'secondary-navigation.js');
if (fs.existsSync(navPath)) {
  var navJs = fs.readFileSync(navPath, 'utf8');
  var fbStart = navJs.indexOf('SECONDARY_FALLBACKS');
  if (fbStart >= 0) {
    var fbEnd = navJs.indexOf('};', fbStart);
    if (fbEnd >= 0) {
      var fbBlock = navJs.substring(fbStart, fbEnd + 2);
      var keyRe = /'([^']+)'\s*:/g;
      var fbm;
      while ((fbm = keyRe.exec(fbBlock)) !== null) {
        fallbackRoutes[fbm[1]] = true;
      }
    }
  }
}

console.log('=== R6.6C Secondary Visual Shell Contract ===');
console.log('Root: ' + path.resolve(root));
console.log('Secondary routes: ' + secondaryRoutes.length);
console.log('Fallback entries: ' + Object.keys(fallbackRoutes).length);

var errors = [];

secondaryRoutes.forEach(function(route) {
  var rtErrs = [];
  var jsP = path.join(root, route + '.js');
  var wxmlP = path.join(root, route + '.wxml');
  var wxssP = path.join(root, route + '.wxss');
  var jsonP = path.join(root, route + '.json');

  // navStyle check
  if (fs.existsSync(jsonP)) {
    try {
      var pj = JSON.parse(fs.readFileSync(jsonP, 'utf8'));
      if (pj.navigationStyle !== 'custom') rtErrs.push('navStyle: ' + (pj.navigationStyle || 'default'));
    } catch(e) { rtErrs.push('JSON parse error'); }
  }

  // fallback check
  if (!fallbackRoutes[route]) rtErrs.push('no fallback');

  // JS checks
  if (fs.existsSync(jsP)) {
    var js = fs.readFileSync(jsP, 'utf8');
    if (!/secondary-navigation/.test(js)) rtErrs.push('no sec-nav require');
    if (!/goBack|secondaryNav\s*\.\s*back/.test(js)) rtErrs.push('no goBack handler');
  }

  // WXML checks
  if (fs.existsSync(wxmlP)) {
    var w = fs.readFileSync(wxmlP, 'utf8');
    if (!/secondary-shell/.test(w)) rtErrs.push('no secondary-shell class');
    if (!/goBack|secondary-nav__back|bindtap.*back/.test(w)) rtErrs.push('no back element');
  }

  // WXSS checks
  if (fs.existsSync(wxssP)) {
    var x = fs.readFileSync(wxssP, 'utf8');
    if (!/\-\-qp-color-canvas|secondary-page-shell|\-\-bg-color/.test(x))
      rtErrs.push('no canvas token');
    if (/background(-color)?\s*:\s*(#[fF]{3,6}|white)\b/.test(x) && !/dark-theme/i.test(x))
      rtErrs.push('hardcoded white bg');
  }

  if (rtErrs.length > 0) {
    console.error('[FAIL] ' + route + ': ' + rtErrs.join(', '));
    errors.push(route);
  }
});

console.log('');
if (errors.length === 0) {
  console.log('[PASS] R6.6C secondary visual shell contract -- ' + secondaryRoutes.length + ' routes OK');
  process.exit(0);
} else {
  console.error('[FAIL] ' + errors.length + ' route(s) with violations');
  process.exit(1);
}