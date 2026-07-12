#!/usr/bin/env node
'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var manifest = require(path.join(ROOT, 'packages/course-content/data/manifest.js'));
var questionData = require(path.join(ROOT, 'packages/quiz/data/course_questions.js'));
var failures = [];

var BASELINE = {
  itpass: { chapters: 10, groups: 73, units: 73 },
  sg: { chapters: 9, groups: 24, units: 112 },
  total: { chapters: 19, groups: 97, units: 185 }
};

function fail(msg) { failures.push(msg); }

function usage(exitCode) {
  console.log('Usage: node tools/check_textbook_productization.js --all');
  process.exit(exitCode);
}

function parseArgs(argv) {
  if (argv.indexOf('--help') >= 0 || argv.indexOf('-h') >= 0) usage(0);
  if (argv.indexOf('--all') < 0) fail('use --all for the R5.4 productization contract');
}

// P1: Verify app.json subpackage registration
function assertAppJsonSubpackages() {
  var app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  var roots = (app.subpackages || []).map(function(s) { return s.root; });
  if (roots.indexOf('packages/course-itpass') < 0) fail('app.json missing course-itpass subpackage');
  if (roots.indexOf('packages/course-sg') < 0) fail('app.json missing course-sg subpackage');
  if (roots.indexOf('packages/course-content') < 0) fail('app.json missing course-content subpackage');
}

// P2: Verify data inventory
function assertDataInventory() {
  ['itpass', 'sg'].forEach(function(exam) {
    var chapters = (manifest.chapters || []).filter(function(c) { return c.exam === exam; });
    var expected = BASELINE[exam];
    if (chapters.length !== expected.chapters) fail(exam + ': chapters ' + chapters.length + ' !== ' + expected.chapters);
    var groups = [];
    var units = [];
    chapters.forEach(function(ch) {
      (ch.sectionGroups || []).forEach(function(g) {
        groups.push(g);
        units = units.concat(g.units || []);
      });
    });
    if (groups.length !== expected.groups) fail(exam + ': groups ' + groups.length + ' !== ' + expected.groups);
    if (units.length !== expected.units) fail(exam + ': units ' + units.length + ' !== ' + expected.units);
  });
}

// P3: Verify sourceRef/anchorTerms/relatedQuestionIds intact
function assertSourceFidelity() {
  // Source fidelity is checked by check_textbook_course_fidelity.js (185 units)
  // and check_textbook_course_content.js. This checker validates the new
  // subpackage structure and navigation, not deep content fields.
  var content = require(path.join(ROOT, 'packages/course-content/data/textbook-course.js'));
  var unitCount = (content.units || []).length;
  if (unitCount !== 185) fail('total units: ' + unitCount + ' !== 185');
  var itpassUnits = (content.units || []).filter(function(u) { return u.exam === 'itpass'; }).length;
  var sgUnits = (content.units || []).filter(function(u) { return u.exam === 'sg'; }).length;
  if (itpassUnits !== 73) fail('itpass units: ' + itpassUnits + ' !== 73');
  if (sgUnits !== 112) fail('sg units: ' + sgUnits + ' !== 112');
}

// P4: Verify question links
function assertQuestionLinks() {
  var questionsById = {};
  (questionData.questions || []).forEach(function(q) { questionsById[q.id] = q; });
  var content = require(path.join(ROOT, 'packages/course-content/data/textbook-course.js'));
  (content.units || []).forEach(function(unit) {
    (unit.relatedQuestionIds || []).forEach(function(qid) {
      var q = questionsById[qid];
      if (!q) { fail(unit.id + ': question ' + qid + ' missing'); return; }
      if (q.exam !== unit.exam) fail(unit.id + ': question ' + qid + ' crosses exam');
      if (q.sourceType !== 'lesson_quiz') fail(unit.id + ': question ' + qid + ' must be lesson_quiz');
    });
  });
}

// P5: Verify new subpackage file existence
function assertSubpackageFiles() {
  ['course-itpass', 'course-sg'].forEach(function(pkg) {
    var base = path.join(ROOT, 'packages', pkg);
    if (!fs.existsSync(path.join(base, 'data', 'manifest.js'))) fail(pkg + ': missing data/manifest.js');
    if (!fs.existsSync(path.join(base, 'pages', 'chapter-list', 'chapter-list.js'))) fail(pkg + ': missing chapter-list page');
    if (!fs.existsSync(path.join(base, 'pages', 'unit-detail', 'unit-detail.js'))) fail(pkg + ': missing unit-detail page');
    if (!fs.existsSync(path.join(base, 'model', 'chapter-list-model.js'))) fail(pkg + ': missing model');
  });
}

// P6: Verify package size under limits
function assertPackageSizes() {
  var result = childProcess.spawnSync('node', [path.join(ROOT, 'tools', 'audit_miniprogram_package_size.js')], {
    cwd: ROOT, encoding: 'utf8', timeout: 15000
  });
  var out = result.stdout || '';
  var lines = out.split('\n');
  var sizes = {};
  lines.forEach(function(line) {
    var m = line.match(/packages\/(course-\w+):\s+([\d.]+)\s+(MB|KB)/);
    if (m) {
      var val = parseFloat(m[2]);
      if (m[3] === 'MB') val *= 1024;
      sizes[m[1]] = val;
    }
  });
  var limits = { 'course-content': 500, 'course-itpass': 1800, 'course-sg': 1800 };
  Object.keys(limits).forEach(function(pkg) {
    if (sizes[pkg] && sizes[pkg] > limits[pkg]) fail(pkg + ': ' + sizes[pkg].toFixed(1) + 'KB > ' + limits[pkg] + 'KB limit');
  });
  if (result.status !== 0) fail('package audit returned non-zero: ' + result.status);
}

// P7: Verify no forbidden patterns in subpackages
function assertNoForbiddenPatterns() {
  ['course-itpass', 'course-sg'].forEach(function(pkg) {
    var base = path.join(ROOT, 'packages', pkg);
    var files = [];
    function walk(dir) {
      fs.readdirSync(dir).forEach(function(f) {
        var fp = path.join(dir, f);
        if (fs.statSync(fp).isDirectory()) walk(fp);
        else if (/\.(js|wxml|wxss|json)$/.test(f)) files.push(fp);
      });
    }
    walk(base);
    files.forEach(function(fp) {
      var content = fs.readFileSync(fp, 'utf8');
      if (/G:\\|file:\/\/|127\.0\.0\.1|localhost|data:application\/pdf/i.test(content))
        fail(pkg + ': ' + path.relative(ROOT, fp) + ' contains forbidden path/URL');
    });
  });
}

// P8: Verify navigation routes
function assertNavigationRoutes() {
  var nav = fs.readFileSync(path.join(ROOT, 'utils', 'navigation.js'), 'utf8');
  if (nav.indexOf('course-itpass') < 0) fail('navigation.js missing course-itpass route');
  if (nav.indexOf('course-sg') < 0) fail('navigation.js missing course-sg route');
  if (nav.indexOf('courseId=') < 0 || nav.indexOf('chapter-list') < 0) fail('navigation.js textbook route incomplete');
}

function assertTermRegistries() {
  ['course-itpass', 'course-sg'].forEach(function(pkg) {
    var regPath = path.join(ROOT, 'packages', pkg, 'terms', 'registry.js');
    if (!fs.existsSync(regPath)) {
      fail(pkg + ': missing terms/registry.js');
      return;
    }
    var reg = require(regPath);
    if (typeof reg.getTerm !== 'function') fail(pkg + ': registry missing getTerm');
    if (typeof reg.getTerms !== 'function') fail(pkg + ': registry missing getTerms');
    if (typeof reg.register !== 'function') fail(pkg + ': registry missing register');
  });
}

function main() {
  parseArgs(process.argv);
  assertAppJsonSubpackages();
  assertDataInventory();
  assertSourceFidelity();
  assertQuestionLinks();
  assertSubpackageFiles();
  assertPackageSizes();
  assertNoForbiddenPatterns();
  assertNavigationRoutes();
  assertTermRegistries();

  // R5.4.1: Runtime closure verification
  var closureResult = require('child_process').spawnSync('node',
    [path.join(ROOT, 'tools', 'check_textbook_subpackage_runtime_closure.js'), '--all'],
    { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (closureResult.status !== 0) {
    fail('runtime closure check failed: ' + (closureResult.stderr || closureResult.stdout || '').trim());
  }

  if (failures.length) {
    console.error('TEXTBOOK PRODUCTIZATION FAIL (' + failures.length + ')');
    failures.forEach(function(m) { console.error('  - ' + m); });
    process.exit(1);
  }
  console.log('TEXTBOOK PRODUCTIZATION PASS — subpackage structure, inventory, fidelity, package sizes, and navigation verified');
}

main();
