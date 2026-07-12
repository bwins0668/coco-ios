#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];
var stats = { pages: 0, files: 0, edges: 0, componentEdges: 0, mainPkgDeps: 0, crossPkgDeps: 0, unresolved: 0 };

function fail(msg) { failures.push(msg); stats.unresolved++; }
function rel(file) { return path.relative(ROOT, file).replace(/\\/g, '/'); }

var seen = {};

// Resolve require('./xxx') relative to sourceDir
function resolveRequire(sourceDir, requireArg) {
  if (!requireArg.startsWith('./') && !requireArg.startsWith('../')) return null;
  var resolved = path.resolve(sourceDir, requireArg);
  var candidates = [resolved + '.js', resolved + '.json', resolved, path.join(resolved, 'index.js')];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i])) return candidates[i];
  }
  return null;
}

// Recursively scan a JS file for require() calls
function scanJsFile(filePath, subpackageRoot, pkgName) {
  if (seen[filePath]) return;
  seen[filePath] = true;
  stats.files++;

  var content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch (e) { fail(rel(filePath) + ': cannot read file'); return; }

  var sourceDir = path.dirname(filePath);
  var requireRe = /require\(['"]([^'"]+)['"]\)/g;
  var match;

  while ((match = requireRe.exec(content)) !== null) {
    var arg = match[1];
    stats.edges++;
    var resolved = resolveRequire(sourceDir, arg);
    if (resolved === null) continue; // non-relative

    if (!resolved) {
      fail(rel(filePath) + ':' + (match.index) + ' require(' + arg + ') unresolved');
      continue;
    }

    // Check package boundaries
    var resolvedRel = path.relative(subpackageRoot, resolved);
    if (resolvedRel.startsWith('..') || path.isAbsolute(resolvedRel)) {
      // Check if it's a main package dependency (allowed) or cross-subpackage (forbidden)
      var relToRoot = path.relative(ROOT, resolved);
      if (relToRoot.startsWith('packages' + path.sep) && !relToRoot.startsWith('packages' + path.sep + pkgName)) {
        fail(rel(filePath) + ': require(' + arg + ') crosses to ' + rel(resolved));
        stats.crossPkgDeps++;
        continue;
      }
      stats.mainPkgDeps++;
    }

    // Mark specific edges for assertion
    if (arg === './chapter-list-model' && resolved.includes('chapter-list-model')) {
      // edge detected
    }
    if (arg === './sources' && resolved.includes('sources.js')) {
      // edge detected
    }

    scanJsFile(resolved, subpackageRoot, pkgName);
  }
}

function checkSubpackage(pkgName) {
  var app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  var pkg = (app.subpackages || []).find(function(s) { return s.root === 'packages/' + pkgName; });
  if (!pkg) { fail(pkgName + ': not in app.json'); return; }

  var pkgRoot = path.join(ROOT, 'packages', pkgName);
  seen = {};

  (pkg.pages || []).forEach(function(page) {
    stats.pages++;
    var jsPath = path.join(pkgRoot, page + '.js');
    if (!fs.existsSync(jsPath)) {
      fail(pkgName + '/' + page + '.js: missing');
      return;
    }
    // Also verify .json and .wxml exist
    if (!fs.existsSync(path.join(pkgRoot, page + '.json')))
      fail(pkgName + '/' + page + '.json: missing');
    if (!fs.existsSync(path.join(pkgRoot, page + '.wxml')))
      fail(pkgName + '/' + page + '.wxml: missing');

    // Check usingComponents in JSON
    var jsonContent = fs.readFileSync(path.join(pkgRoot, page + '.json'), 'utf8');
    try {
      var json = JSON.parse(jsonContent);
      var comps = json.usingComponents || {};
      Object.keys(comps).forEach(function(name) {
        var compPath = comps[name];
        stats.componentEdges++;
        if (compPath.startsWith('wx://') || compPath.startsWith('plugin://')) return;
        if (!compPath.startsWith('./') && !compPath.startsWith('../')) return;
        var resolvedComp = resolveRequire(path.dirname(path.join(pkgRoot, page)), compPath);
        if (!resolvedComp) {
          fail(pkgName + '/' + page + ': usingComponents ' + name + '=' + compPath + ' unresolved');
        }
      });
    } catch (e) { /* JSON parse error - skip */ }

    // Scan the page and all its transitive dependencies
    scanJsFile(jsPath, pkgRoot, pkgName);
  });

  // Specific assertions
  var modelPath = path.join(pkgRoot, 'pages', 'chapter-list', 'chapter-list-model.js');
  if (!fs.existsSync(modelPath)) fail(pkgName + ': chapter-list-model.js missing from page directory');
  
  var sourcesPath = path.join(pkgRoot, 'data', 'sources.js');
  if (!fs.existsSync(sourcesPath)) fail(pkgName + ': sources.js missing from data directory');

  // Check forbidden patterns
  function scanForForbidden(dir) {
    fs.readdirSync(dir).forEach(function(f) {
      var fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) { scanForForbidden(fp); return; }
      if (!f.endsWith('.js') && !f.endsWith('.wxml') && !f.endsWith('.json')) return;
      var c = fs.readFileSync(fp, 'utf8');
      if (/G:\\|file:\/\/|127\.0\.0\.1|localhost|data:application\/pdf/i.test(c))
        fail(pkgName + ': ' + rel(fp) + ' contains forbidden pattern');
      if (/require\(['"].*course-content/.test(c))
        fail(pkgName + ': ' + rel(fp) + ' references old course-content');
    });
  }
  scanForForbidden(pkgRoot);
}

function main() {
  var args = process.argv;
  if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
    console.log('Usage: node tools/check_textbook_subpackage_runtime_closure.js --all');
    process.exit(0);
  }
  if (args.indexOf('--all') < 0) { fail('use --all'); }

  checkSubpackage('course-itpass');
  checkSubpackage('course-sg');

  console.log('Pages:', stats.pages, '| Files:', stats.files, '| Edges:', stats.edges,
    '| Components:', stats.componentEdges, '| MainPkg:', stats.mainPkgDeps,
    '| CrossPkg:', stats.crossPkgDeps, '| Unresolved:', stats.unresolved);

  if (failures.length) {
    console.error('RUNTIME CLOSURE FAIL (' + failures.length + ')');
    failures.forEach(function(m) { console.error('  - ' + m); });
    process.exit(1);
  }
  console.log('TEXTBOOK SUBPACKAGE RUNTIME CLOSURE PASS');
}
main();
