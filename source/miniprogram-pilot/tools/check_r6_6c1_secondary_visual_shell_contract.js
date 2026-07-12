'use strict';
var fs = require("fs");
var path = require("path");

var root = process.argv.indexOf("--root") >= 0
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : ".";

var TAB_ROOTS = { "pages/home/home": 1, "pages/practice/practice": 1, "pages/review/review": 1, "pages/glossary/glossary": 1, "pages/profile/profile": 1 };

var errors = [];

// Load app.json to find secondary routes
var appJsonPath = path.join(root, "app.json");
if (!fs.existsSync(appJsonPath)) { console.error("[FAIL] app.json not found"); process.exit(1); }
var appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
var pages = appJson.pages || [];
var subs = appJson.subPackages || appJson.subpackages || [];

var routes = [];
pages.forEach(function(r) { if (!TAB_ROOTS[r]) routes.push(r); });
subs.forEach(function(pkg) {
  var pr = pkg.root || "";
  (pkg.pages || []).forEach(function(r) {
    var rt = pr + "/" + r;
    if (!TAB_ROOTS[rt]) routes.push(rt);
  });
});

// Load fallback map
var fallbacks = {};
var navPath = path.join(root, "utils", "secondary-navigation.js");
if (fs.existsSync(navPath)) {
  var navJs = fs.readFileSync(navPath, "utf8");
  var fbIdx = navJs.indexOf("SECONDARY_FALLBACKS");
  if (fbIdx >= 0) {
    var fbEnd = navJs.indexOf("};", fbIdx);
    var fbBlock = navJs.substring(fbIdx, fbEnd + 2);
    var keyRe = /'([^']+)'\s*:/g;
    var fm;
    while ((fm = keyRe.exec(fbBlock)) !== null) fallbacks[fm[1]] = true;
  }
}

routes.forEach(function(route) {
  var rtErrs = [];
  var jsonP = path.join(root, route + ".json");
  var jsP = path.join(root, route + ".js");
  var wxmlP = path.join(root, route + ".wxml");
  var wxssP = path.join(root, route + ".wxss");

  // navStyle
  if (fs.existsSync(jsonP)) {
    try {
      var pj = JSON.parse(fs.readFileSync(jsonP, "utf8"));
      if (pj.navigationStyle !== "custom") rtErrs.push("navStyle: " + (pj.navigationStyle || "default"));
    } catch(_) {}
  }

  // fallback
  if (!fallbacks[route]) rtErrs.push("no fallback in SECONDARY_FALLBACKS");

  // JS: goBack + secondary-navigation
  if (fs.existsSync(jsP)) {
    var js = fs.readFileSync(jsP, "utf8");
    if (!/secondary-navigation/.test(js)) rtErrs.push("no secondary-navigation require");
    if (!/goBack\s*:\s*function/.test(js)) rtErrs.push("no goBack function in JS");
  }

  // WXML: back nav + not full-width
  if (fs.existsSync(wxmlP)) {
    var w = fs.readFileSync(wxmlP, "utf8");
    if (!/secondary-nav__back|goBack|bindtap.*back/.test(w)) rtErrs.push("no back element in WXML");

  }

  // WXSS: no hardcoded white background
  if (fs.existsSync(wxssP)) {
    var x = fs.readFileSync(wxssP, "utf8");
    // Check for hardcoded white at page/root level
    if (/(?:page|container|shell)\s*\{[^}]*background(-color)?\s*:\s*(#fff|#ffffff|white)\b/i.test(x))
      rtErrs.push("hardcoded white background in root container");
  }

  if (rtErrs.length > 0) {
    console.error("[FAIL] " + route + ": " + rtErrs.join(", "));
    errors.push(route);
  }
});

console.log("");
if (errors.length === 0) {
  console.log("[PASS] R6.6C1 secondary visual shell contract -- " + routes.length + " routes OK");
  process.exit(0);
} else {
  console.error("[FAIL] " + errors.length + " route(s) with violations");
  process.exit(1);
}
