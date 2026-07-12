// tools/check_release_packaging.js
// R4.4 Release packaging exclusion validator.
// PASS=0 / FAIL=1. Pure Node — verifies project.config.json packaging rules.

var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(id, detail) { failures.push({ id: id, detail: detail }); }

console.log('=== Release Packaging Validator (R4.4) ===\n');

// 1. project.config.json must be valid JSON
var configPath = path.join(ROOT, 'project.config.json');
var config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('  PASS: project.config.json is valid JSON');
} catch (e) {
  fail('JSON', 'project.config.json parse error: ' + e.message);
  console.log('\nFAIL');
  process.exit(1);
}

// 2. packOptions.ignore must exist and be an array
var ignores = (config.packOptions && config.packOptions.ignore) || [];
if (!Array.isArray(ignores) || ignores.length === 0) {
  fail('IGNORE', 'packOptions.ignore is missing or empty');
} else {
  console.log('  PASS: packOptions.ignore has ' + ignores.length + ' entries');
}

// 3. scratch folder must be excluded
var hasScratch = ignores.some(function (r) { return r.value === 'scratch' && r.type === 'folder'; });
if (hasScratch) console.log('  PASS: scratch folder is excluded');
else fail('SCRATCH', 'scratch folder is NOT in packOptions.ignore');

// 4. All shebang files must be in excluded directories
var shebangFiles = [];
function scanShebang(dir) {
  try {
    var entries = fs.readdirSync(dir);
  } catch (e) { return; }
  for (var i = 0; i < entries.length; i++) {
    var full = path.join(dir, entries[i]);
    try {
      var st = fs.statSync(full);
      if (st.isDirectory()) {
        if (entries[i] !== 'node_modules' && entries[i] !== '.git') scanShebang(full);
      } else if (entries[i].endsWith('.js') || entries[i].endsWith('.ts') || entries[i].endsWith('.sh')) {
        var buf = fs.readFileSync(full);
        if (buf.length > 2 && buf[0] === 0x23 && buf[1] === 0x21) { // #!
          shebangFiles.push(path.relative(ROOT, full).replace(/\\/g, '/'));
        }
      }
    } catch (e) {}
  }
}
scanShebang(ROOT);

// Build set of excluded dirs/files
var excludedDirs = {};
var excludedFiles = {};
for (var j = 0; j < ignores.length; j++) {
  var ig = ignores[j];
  if (ig.type === 'folder') excludedDirs[ig.value] = true;
  if (ig.type === 'file') excludedFiles[ig.value] = true;
}

console.log('\n--- Shebang file audit (' + shebangFiles.length + ' files) ---');
var unexcludedShebangs = [];
for (var k = 0; k < shebangFiles.length; k++) {
  var sf = shebangFiles[k];
  var excluded = false;
  for (var dir in excludedDirs) {
    if (sf === dir || sf.indexOf(dir + '/') === 0) { excluded = true; break; }
  }
  if (excludedFiles[sf]) excluded = true;
  if (!excluded) unexcludedShebangs.push(sf);
}

if (unexcludedShebangs.length > 0) {
  for (var u = 0; u < unexcludedShebangs.length; u++) {
    console.log('  WARN: shebang file NOT excluded: ' + unexcludedShebangs[u]);
  }
  // tools/ is excluded as a folder, so tools/* files should be fine
  // Only flag if a shebang file is NOT under any excluded dir
  var trulyUnexcluded = unexcludedShebangs.filter(function (f) {
    for (var dir in excludedDirs) {
      if (f === dir || f.indexOf(dir + '/') === 0) return false;
    }
    return true;
  });
  if (trulyUnexcluded.length > 0) {
    fail('SHEBANG', trulyUnexcluded.length + ' shebang files outside excluded dirs: ' + trulyUnexcluded.join(', '));
  } else {
    console.log('  PASS: all shebang files covered by excluded dirs');
  }
} else {
  console.log('  PASS: no unexcluded shebang files');
}

// 5. Runtime directories must NOT be excluded
var runtimeDirs = ['pages', 'packages', 'utils', 'components', 'images', 'styles'];
for (var d = 0; d < runtimeDirs.length; d++) {
  if (excludedDirs[runtimeDirs[d]]) fail('RUNTIME', runtimeDirs[d] + '/ must not be excluded');
}
console.log('\n  PASS: runtime dirs not excluded: ' + runtimeDirs.join(', '));

// 6. quiz-topic-scope.js must NOT be excluded
if (excludedFiles['utils/quiz-topic-scope.js']) fail('TOPIC_SCOPE', 'quiz-topic-scope.js must not be excluded');
else console.log('  PASS: quiz-topic-scope.js not excluded');

// 7. No suffix=.js global exclusion
var hasSuffixJs = ignores.some(function (r) { return r.type === 'suffix' && r.value === '.js'; });
if (hasSuffixJs) fail('SUFFIX_JS', 'global .js suffix exclusion found — would break runtime');
else console.log('  PASS: no global .js suffix exclusion');

// 8. Core files must not be excluded
var coreFiles = ['app.js', 'app.json', 'app.wxss'];
for (var c = 0; c < coreFiles.length; c++) {
  if (excludedFiles[coreFiles[c]]) fail('CORE', coreFiles[c] + ' must not be excluded');
}
console.log('  PASS: core files not excluded: ' + coreFiles.join(', '));

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) {
  console.log('RELEASE PACKAGING VALID\nPASS');
  process.exit(0);
}
console.log('FAILURES (' + failures.length + '):');
for (var fi = 0; fi < failures.length; fi++) console.log('  [' + failures[fi].id + '] ' + failures[fi].detail);
console.log('\nFAIL');
process.exit(1);
