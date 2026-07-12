// Python shard WXSS import resolution contract (WXSS-F1)
// Fail-closed: all @import targets must exist and paths must not nest incorrectly.
// Usage: node tools/check_python_shard_wxss_import_contract.js [--root <dir>]

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var SHARD = "packages/python-course-foundations-b";

function parseArgs(argv) {
  var args = { root: ROOT };
  for (var i = 2; i < argv.length; i++) {
    if (argv[i] === "--root") { args.root = path.resolve(argv[i + 1]); i++; }
  }
  return args;
}

function findWxssFiles(root, shardRel) {
  var dir = path.join(root, shardRel);
  if (!fs.existsSync(dir)) return [];
  var results = [];
  function walk(d) {
    var entries = fs.readdirSync(d, { withFileTypes: true });
    entries.forEach(function(e) {
      var full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".wxss")) results.push(full);
    });
  }
  walk(dir);
  return results;
}

function parseImports(content) {
  var imports = [];
  var regex = /@import\s+["']([^"']+)["']/g;
  var match;
  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function main() {
  var args = parseArgs(process.argv);
  var root = args.root;
  var errors = [];
  var rows = [];

  var wxssFiles = findWxssFiles(root, SHARD);
  console.log("[Python shard WXSS import] Scanning " + wxssFiles.length + " WXSS files in " + SHARD);

  wxssFiles.forEach(function(file) {
    var content = fs.readFileSync(file, "utf8");
    var imports = parseImports(content);
    var fileDir = path.dirname(file);
    var relFile = path.relative(root, file).replace(/\\/g, "/");

    imports.forEach(function(imp) {
      var resolved = path.resolve(fileDir, imp);
      var relResolved = path.relative(root, resolved).replace(/\\/g, "/");
      var exists = fs.existsSync(resolved);
      var targetExt = path.extname(resolved);

      rows.push({ source: relFile, import: imp, resolved: relResolved, exists: exists });

      // Check: target must exist
      if (!exists) {
        errors.push(relFile + " imports '" + imp + "' -> " + relResolved + " (not found)");
      }

      // Check: target must be .wxss
      if (targetExt !== ".wxss") {
        errors.push(relFile + " imports '" + imp + "' -> " + relResolved + " (not .wxss)");
      }

      // Check: no nested package paths (bad pattern: .../packages/.../packages/...)
      if (relResolved.indexOf(SHARD + "/packages/") !== -1) {
        errors.push(relFile + " imports '" + imp + "' -> " + relResolved + " (incorrectly nested package path)");
      }

      // Check: path does not escape root
      if (relResolved.startsWith("..")) {
        errors.push(relFile + " imports '" + imp + "' -> " + relResolved + " (escapes root)");
      }
    });
  });

  // Output audit table
  console.log("");
  console.log("| source WXSS | import string | resolved target | exists |");
  console.log("|---|---|---|---|");
  rows.forEach(function(r) {
    console.log("| " + r.source + " | " + r.import + " | " + r.resolved + " | " + (r.exists ? "YES" : "NO") + " |");
  });

  if (errors.length) {
    console.error("");
    console.error("[Python shard WXSS import] FAIL");
    errors.forEach(function(e) { console.error("ERROR: " + e); });
    process.exit(1);
  }
  console.log("");
  console.log("[Python shard WXSS import] PASS: 0 errors, 0 warnings");
}

main();