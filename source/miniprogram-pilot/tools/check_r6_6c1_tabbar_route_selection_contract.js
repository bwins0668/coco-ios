'use strict';
var fs = require("fs");
var path = require("path");

var root = process.argv.indexOf("--root") >= 0
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : ".";

var errors = [];

var jsPath = path.join(root, "custom-tab-bar", "index.js");
if (!fs.existsSync(jsPath)) { console.error("[FAIL] custom-tab-bar/index.js not found"); process.exit(1); }
var js = fs.readFileSync(jsPath, "utf8");

if (!/getCurrentPages/.test(js))
  errors.push("no getCurrentPages() — cannot sync with current route");
if (!/\.route/.test(js))
  errors.push("no .route property access — cannot determine current page route");
if (!/replace\(/.test(js) || !/\^\\\/\|\\\/\$/.test(js))
  errors.push("no route standardization — may mismatch app.json pagePath");
if (!/attached\s*:/.test(js))
  errors.push("no attached lifecycle — cold start will not sync selected");
if (!/pageLifetimes/.test(js))
  errors.push("no pageLifetimes — tab switches will not sync selected");

var switchMatch = js.match(/switchTab\s*:\s*function[^}]*\}/);
if (switchMatch && !/setData/.test(switchMatch[0]))
  errors.push("switchTab does not call setData — no immediate visual feedback");

var wxmlPath = path.join(root, "custom-tab-bar", "index.wxml");
if (fs.existsSync(wxmlPath)) {
  var w = fs.readFileSync(wxmlPath, "utf8");
  var iconExpr = (w.match(/selected\s*===\s*index/g) || []).length;
  if (iconExpr < 2)
    errors.push("WXML: icon and text must both use selected === index (found " + iconExpr + " occurrences)");
  if (!/r6-tabbar__text--active/.test(w))
    errors.push("WXML missing r6-tabbar__text--active class");
  if (!/r6-tabbar__text--inactive/.test(w))
    errors.push("WXML missing r6-tabbar__text--inactive class");
}

console.log("=== R6.6C1P3 TabBar Route Selection Contract ===");
console.log("Root: " + path.resolve(root));
if (errors.length === 0) {
  console.log("[PASS] R6.6C1P3 tabbar route selection contract");
  process.exit(0);
} else {
  console.error("[FAIL] " + errors.length + " violation(s):");
  errors.forEach(function(e) { console.error("  - " + e); });
  process.exit(1);
}
