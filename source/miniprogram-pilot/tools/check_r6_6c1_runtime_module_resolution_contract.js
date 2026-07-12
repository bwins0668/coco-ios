'use strict';
var fs = require("fs");
var path = require("path");

var root = process.argv.indexOf("--root") >= 0
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : ".";

var appJsonPath = path.join(root, "app.json");
if (!fs.existsSync(appJsonPath)) { console.error("[FAIL] app.json not found in " + root); process.exit(1); }

var ignoredDirs = new Set(["data", "tools", "scratch"]);
var cfgPath = path.join(root, "project.config.json");
if (fs.existsSync(cfgPath)) {
  try {
    var cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    var ignores = (((cfg || {}).packOptions || {}).ignore || []);
    ignores.forEach(function(i) {
      if (i.type === "folder") ignoredDirs.add(i.value);
    });
  } catch(_) {}
}

function isIgnored(absPath) {
  var rel = path.relative(path.resolve(root), absPath).replace(/\\/g, "/");
  var part = rel.split("/")[0];
  return ignoredDirs.has(part);
}

function walkJS(dir, files) {
  files = files || [];
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(function(e) {
      if (e.name.startsWith(".") || e.name === "node_modules" || ignoredDirs.has(e.name)) return;
      var full = path.join(dir, e.name);
      if (e.isDirectory()) { walkJS(full, files); }
      else if (e.name.endsWith(".js")) { files.push(full); }
    });
  } catch(_) {}
  return files;
}

var allJS = walkJS(path.resolve(root));
var errors = [];

allJS.forEach(function(jsFile) {
  if (isIgnored(jsFile)) return;
  var content;
  try { content = fs.readFileSync(jsFile, "utf8"); } catch(_) { return; }
  var requireRe = /require\s*\(\s*['\"]([^'\"]+)['\"]/g;
  var m;
  var dir = path.dirname(jsFile);
  while ((m = requireRe.exec(content)) !== null) {
    var reqPath = m[1];
    if (!reqPath.startsWith(".")) continue;
    var resolved = path.resolve(dir, reqPath);
    var relToRoot = path.relative(path.resolve(root), resolved).replace(/\\/g, "/");
    var parts = relToRoot.split("/");
    if (ignoredDirs.has(parts[0])) {
      errors.push(path.relative(path.resolve(root), jsFile) + " requires '" + reqPath + "' -> IGNORED");
      continue;
    }
    var exists = fs.existsSync(resolved + ".js") || fs.existsSync(resolved) || fs.existsSync(resolved + ".json");
    if (!exists) {
      errors.push(path.relative(path.resolve(root), jsFile) + " requires '" + reqPath + "' -> NOT FOUND");
    }
  }
});

if (errors.length > 0) {
  console.error("[FAIL] R6.6C1 runtime module resolution -- " + errors.length + " violation(s):");
  errors.forEach(function(e) { console.error("  - " + e); });
  process.exit(1);
}
console.log("[PASS] R6.6C1 runtime module resolution contract");
