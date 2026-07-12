'use strict';
var fs = require("fs");
var path = require("path");

var root = process.argv.indexOf("--root") >= 0
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : ".";

var errors = [];

// 1. TabBar selected initial value must be -1
var jsPath = path.join(root, "custom-tab-bar", "index.js");
if (!fs.existsSync(jsPath)) { console.error("[FAIL] custom-tab-bar/index.js not found"); process.exit(1); }
var js = fs.readFileSync(jsPath, "utf8");
if (/selected\s*:\s*0\b(?!\s*\n\s*\w)/.test(js) && !/selected\s*:\s*-1/.test(js))
  errors.push("TabBar selected initial value must be -1, not 0");

// 2. syncSelectedFromRoute exists and is a method
if (!/syncSelectedFromRoute\s*:\s*function/.test(js))
  errors.push("TabBar missing syncSelectedFromRoute method");

// 3. Unknown route falls back to -1, not 0
if (/idx\s*=\s*0/.test(js) && /else|fallback|default|unknown/.test(js))
  errors.push("unknown route appears to fallback to 0 instead of -1");

// 4. attached/ready/pageLifetimes must NOT set selected
var lifecycleBlock = (js.match(/attached[\s\S]*?(?=methods\s*:|\n\})/) || [""])[0];
if (/setData\s*\(\s*\{\s*selected\s*:/.test(lifecycleBlock))
  errors.push("attached lifecycle sets selected — must be removed");
var plBlock = (js.match(/pageLifetimes[\s\S]*?(?=\}\s*,?\s*\n\s*\})/) || [""])[0];
if (/setData\s*\(\s*\{\s*selected\s*:/.test(plBlock))
  errors.push("pageLifetimes sets selected — must be removed");

// 5. switchTab must NOT call setData
var swBlock = (js.match(/switchTab\s*:\s*function[\s\S]*?(?=\n\s*\},)/) || [""])[0];
if (/setData/.test(swBlock))
  errors.push("switchTab calls setData — must not pre-set selected on old instance");

var TAB_PAGES = ["home", "practice", "review", "glossary", "profile"];
TAB_PAGES.forEach(function(name) {
  var pjsPath = path.join(root, "pages", name, name + ".js");
  if (!fs.existsSync(pjsPath)) { errors.push("pages/" + name + "/" + name + ".js not found"); return; }
  var pjs = fs.readFileSync(pjsPath, "utf8");

  // 6. onShow must call syncCurrentTabBar
  var onShowMatch = pjs.match(/onShow\s*:\s*function[\s\S]*?(?=\n\s*\},?\s*\n)/);
  var onShowBody = onShowMatch ? onShowMatch[0] : "";
  if (!/syncCurrentTabBar/.test(onShowBody))
    errors.push("pages/" + name + " onShow does not call syncCurrentTabBar");

  // 7. onReady must call syncCurrentTabBar (if onReady exists)
  if (/onReady/.test(pjs)) {
    var onReadyMatch = pjs.match(/onReady\s*:\s*function[\s\S]*?(?=\n\s*\},?\s*\n)/);
    var onReadyBody = onReadyMatch ? onReadyMatch[0] : "";
    // Even if onReady exists elsewhere, check if it has sync
  }

  // 8. Must use this.route (not hardcoded string)
  if (!/\.route/.test(onShowBody) && !/page\.route/.test(pjs))
    errors.push("pages/" + name + " sync does not use page.route");
});

// 9. WXML icon and text still use same selected === index
var wxmlPath = path.join(root, "custom-tab-bar", "index.wxml");
if (fs.existsSync(wxmlPath)) {
  var w = fs.readFileSync(wxmlPath, "utf8");
  var selCount = (w.match(/selected\s*===\s*index/g) || []).length;
  if (selCount < 2)
    errors.push("WXML: icon and text must both use selected === index (found " + selCount + ")");
  if (!/r6-tabbar__text--active/.test(w))
    errors.push("WXML missing r6-tabbar__text--active");
  if (!/r6-tabbar__text--inactive/.test(w))
    errors.push("WXML missing r6-tabbar__text--inactive");
}

console.log("=== R6.6C1P3.1 TabBar Lifecycle Ownership Contract ===");
console.log("Root: " + path.resolve(root));
if (errors.length === 0) {
  console.log("[PASS] R6.6C1P3.1 tabbar lifecycle ownership contract");
  process.exit(0);
} else {
  console.error("[FAIL] " + errors.length + " violation(s):");
  errors.forEach(function(e) { console.error("  - " + e); });
  process.exit(1);
}
