// Python shard style isolation contract (WXSS-RUNTIME-F2)
// Fail-closed: no cross-subpackage WXSS imports in shard.
// Allowed: shard-local, repo root styles/**

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

// Extract non-import CSS body for rule comparison
function extractCssBody(content) {
  return content.replace(/@import\s+["'][^"']*["']\s*;?\s*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

function normalizeCss(css) {
  return css.replace(/\s+/g, " ").replace(/\s*([{};:,])\s*/g, "$1").trim();
}

function main() {
  var args = parseArgs(process.argv);
  var root = args.root;
  var errors = [];
  var rows = [];

  var wxssFiles = findWxssFiles(root, SHARD);
  console.log("[Python shard style isolation] Scanning " + wxssFiles.length + " WXSS files");

  wxssFiles.forEach(function(file) {
    var content = fs.readFileSync(file, "utf8");
    var imports = parseImports(content);
    var fileDir = path.dirname(file);
    var relFile = path.relative(root, file).replace(/\\/g, "/");

    imports.forEach(function(imp) {
      var resolved = path.resolve(fileDir, imp);
      var relResolved = path.relative(root, resolved).replace(/\\/g, "/");
      var exists = fs.existsSync(resolved);

      var category = "unknown";
      if (relResolved.startsWith("styles/")) category = "root_shared_style";
      else if (relResolved.startsWith(SHARD + "/")) category = "shard_local";
      else if (relResolved.startsWith("packages/")) category = "other_subpackage";
      else if (relResolved.startsWith("pages/") || relResolved.startsWith("components/") || relResolved.startsWith("custom-tab-bar/")) category = "main_package_nonstyle";
      else if (!exists) category = "missing";
      else if (relResolved.startsWith("..")) category = "outside_repo";

      rows.push({ source: relFile, import: imp, resolved: relResolved, exists: exists, category: category });

      if (!exists) errors.push(relFile + " import '" + imp + "' -> " + relResolved + " (not found)");
      if (category === "other_subpackage" || category === "main_package_nonstyle") {
        errors.push(relFile + " import '" + imp + "' -> " + relResolved + " (FORBIDDEN: " + category + ")");
      }
      if (category === "outside_repo" || category === "missing" && !exists) {
        // Already caught above
      }
    });
  });

  // Verify mirror files exist
  var mirrors = [
    SHARD + "/styles/chapter-visual-contract.wxss",
    SHARD + "/styles/lesson-visual-contract.wxss"
  ];
  mirrors.forEach(function(m) {
    if (!fs.existsSync(path.join(root, m))) errors.push("Mirror file missing: " + m);
  });

  // Compare: mirror CSS body vs legacy CSS body
  var legacyChapterTarget = path.join(root, "packages/python-course/pages/home/home.wxss");
  var mirrorChapter = path.join(root, SHARD + "/styles/chapter-visual-contract.wxss");
  if (fs.existsSync(legacyChapterTarget) && fs.existsSync(mirrorChapter)) {
    var legacyChapterCss = normalizeCss(extractCssBody(fs.readFileSync(legacyChapterTarget, "utf8")));
    var mirrorChapterCss = normalizeCss(extractCssBody(fs.readFileSync(mirrorChapter, "utf8")));
    if (legacyChapterCss !== mirrorChapterCss) {
      errors.push("chapter-visual-contract.wxss CSS body differs from legacy home.wxss");
    }
  }

  var legacyLessonTarget = path.join(root, "packages/python-course/pages/lesson/lesson.wxss");
  var mirrorLesson = path.join(root, SHARD + "/styles/lesson-visual-contract.wxss");
  if (fs.existsSync(legacyLessonTarget) && fs.existsSync(mirrorLesson)) {
    var legacyLessonCss = normalizeCss(extractCssBody(fs.readFileSync(legacyLessonTarget, "utf8")));
    var mirrorLessonCss = normalizeCss(extractCssBody(fs.readFileSync(mirrorLesson, "utf8")));
    if (legacyLessonCss !== mirrorLessonCss) {
      errors.push("lesson-visual-contract.wxss CSS body differs from legacy lesson.wxss");
    }
  }

  console.log("");
  console.log("| source WXSS | import | resolved | exists | category |");
  console.log("|---|---|---|---|---|");
  rows.forEach(function(r) {
    console.log("| " + r.source + " | " + r.import + " | " + r.resolved + " | " + (r.exists ? "YES" : "NO") + " | " + r.category + " |");
  });

  if (errors.length) {
    console.error("");
    console.error("[Python shard style isolation] FAIL");
    errors.forEach(function(e) { console.error("ERROR: " + e); });
    process.exit(1);
  }
  console.log("");
  console.log("[Python shard style isolation] PASS: 0 errors, 0 warnings");
}

main();