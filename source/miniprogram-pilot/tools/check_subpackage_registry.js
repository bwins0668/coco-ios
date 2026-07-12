#!/usr/bin/env node
/**
 * check_subpackage_registry.js — app.json subpackage registry gate.
 *
 * Fails on:
 *   - duplicate subpackage name
 *   - duplicate subpackage root
 *   - duplicate page entries inside one subpackage
 *   - missing page files under the subpackage root (.js/.wxml/.wxss/.json)
 *   - flashcard bridge/player pages registered outside quiz data subpackages
 */

'use strict';

var fs = require('fs');
var path = require('path');

var JSON_MODE = process.argv.indexOf('--json') !== -1;
var PAGE_EXTS = ['.js', '.wxml', '.wxss', '.json'];
var DATA_ROOT_RE = /^packages\/quiz-(itpass|sg)-\d+$/;
var FLASHCARD_DATA_PAGES = {
  'pages/flashcard-bridge/flashcard-bridge': true,
  'pages/flashcard-player/flashcard-player': true
};

function normalizeRel(p) {
  return String(p || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

function log() {
  if (!JSON_MODE) {
    console.log.apply(console, arguments);
  }
}

function addMap(map, key, index) {
  if (!Object.prototype.hasOwnProperty.call(map, key)) {
    map[key] = [];
  }
  map[key].push(index);
}

function hasDuplicate(items, value) {
  var count = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i] === value) count++;
  }
  return count > 1;
}

function pageFiles(root, page) {
  var files = [];
  var base = path.join(process.cwd(), root, page);
  for (var i = 0; i < PAGE_EXTS.length; i++) {
    var ext = PAGE_EXTS[i];
    var abs = base + ext;
    files.push({
      ext: ext,
      path: path.relative(process.cwd(), abs).replace(/\\/g, '/'),
      exists: fs.existsSync(abs)
    });
  }
  return files;
}

function pushIssue(issues, code, message) {
  issues.push({ code: code, message: message });
}

function main() {
  var appPath = path.join(process.cwd(), 'app.json');
  var raw;
  var app;

  try {
    raw = fs.readFileSync(appPath, 'utf8');
  } catch (e) {
    console.error('FAIL: cannot read app.json: ' + e.message);
    process.exit(1);
  }

  try {
    app = JSON.parse(raw);
  } catch (e2) {
    console.error('FAIL: app.json is not valid JSON: ' + e2.message);
    process.exit(1);
  }

  var subpackageKey = Array.isArray(app.subpackages) ? 'subpackages' : null;
  if (!subpackageKey && Array.isArray(app.subPackages)) {
    subpackageKey = 'subPackages';
  }

  if (!subpackageKey) {
    console.error('FAIL: app.json has no subpackages/subPackages array');
    process.exit(1);
  }

  var packages = app[subpackageKey];
  var byName = {};
  var byRoot = {};
  var issues = [];
  var rows = [];

  for (var i = 0; i < packages.length; i++) {
    var pkg = packages[i] || {};
    var name = String(pkg.name || '');
    var root = normalizeRel(pkg.root || '');
    addMap(byName, name, i);
    addMap(byRoot, root, i);
  }

  for (var nameKey in byName) {
    if (Object.prototype.hasOwnProperty.call(byName, nameKey) && byName[nameKey].length > 1) {
      pushIssue(issues, 'DUPLICATE_NAME', 'subpackage name "' + nameKey + '" appears at indexes ' + byName[nameKey].join(', '));
    }
  }

  for (var rootKey in byRoot) {
    if (Object.prototype.hasOwnProperty.call(byRoot, rootKey) && byRoot[rootKey].length > 1) {
      pushIssue(issues, 'DUPLICATE_ROOT', 'subpackage root "' + rootKey + '" appears at indexes ' + byRoot[rootKey].join(', '));
    }
  }

  for (var j = 0; j < packages.length; j++) {
    var subpackage = packages[j] || {};
    var subName = String(subpackage.name || '');
    var subRoot = normalizeRel(subpackage.root || '');
    var pages = Array.isArray(subpackage.pages) ? subpackage.pages.map(normalizeRel) : [];
    var duplicatePages = [];
    var missingFiles = [];
    var dataPageProblems = [];

    if (!subName) {
      pushIssue(issues, 'MISSING_NAME', 'subpackage at index ' + j + ' has no name');
    }

    if (!subRoot) {
      pushIssue(issues, 'MISSING_ROOT', 'subpackage "' + subName + '" at index ' + j + ' has no root');
    }

    if (!Array.isArray(subpackage.pages)) {
      pushIssue(issues, 'MISSING_PAGES', 'subpackage "' + subName + '" at index ' + j + ' has no pages array');
    }

    for (var p = 0; p < pages.length; p++) {
      var page = pages[p];
      if (hasDuplicate(pages, page) && duplicatePages.indexOf(page) === -1) {
        duplicatePages.push(page);
        pushIssue(issues, 'DUPLICATE_PAGE', 'subpackage "' + subName + '" repeats page "' + page + '"');
      }

      var files = pageFiles(subRoot, page);
      for (var f = 0; f < files.length; f++) {
        if (!files[f].exists) {
          missingFiles.push(files[f].path);
          pushIssue(issues, 'MISSING_PAGE_FILE', 'subpackage "' + subName + '" page "' + page + '" is missing ' + files[f].path);
        }
      }

      if (FLASHCARD_DATA_PAGES[page] && !DATA_ROOT_RE.test(subRoot)) {
        dataPageProblems.push(page);
        pushIssue(issues, 'FLASHCARD_PAGE_WRONG_ROOT', 'flashcard data page "' + page + '" is registered under non-data root "' + subRoot + '"');
      }

      if (FLASHCARD_DATA_PAGES[page] && page.indexOf(subRoot + '/') === 0) {
        pushIssue(issues, 'FLASHCARD_PAGE_ABSOLUTE_PATH', 'subpackage "' + subName + '" page "' + page + '" must be relative to root, not include the root prefix');
      }
    }

    rows.push({
      index: j,
      name: subName,
      root: subRoot,
      pages: pages,
      duplicateName: byName[subName] && byName[subName].length > 1,
      duplicateRoot: byRoot[subRoot] && byRoot[subRoot].length > 1,
      duplicatePages: duplicatePages,
      missingFiles: missingFiles,
      dataPageProblems: dataPageProblems
    });
  }

  if (JSON_MODE) {
    console.log(JSON.stringify({
      ok: issues.length === 0,
      subpackageKey: subpackageKey,
      subpackageCount: packages.length,
      packages: rows,
      issues: issues
    }, null, 2));
  } else {
    log('Subpackage registry check');
    log('app.json key: ' + subpackageKey);
    log('subpackage count: ' + packages.length);
    log('');
    log('| index | name | root | pages | duplicate name | duplicate root | missing files |');
    log('| ----: | ---- | ---- | ----: | -------------- | -------------- | ------------: |');
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      log('| ' + row.index + ' | ' + row.name + ' | ' + row.root + ' | ' + row.pages.length + ' | ' + (row.duplicateName ? 'YES' : 'no') + ' | ' + (row.duplicateRoot ? 'YES' : 'no') + ' | ' + row.missingFiles.length + ' |');
      for (var rp = 0; rp < row.pages.length; rp++) {
        log('  - ' + row.pages[rp]);
      }
    }

    if (issues.length > 0) {
      log('');
      log('FAIL: subpackage registry has ' + issues.length + ' issue(s):');
      for (var x = 0; x < issues.length; x++) {
        log('  [' + issues[x].code + '] ' + issues[x].message);
      }
    } else {
      log('');
      log('PASS: subpackage names and roots are unique, pages are deduped, and page files exist.');
    }
  }

  process.exit(issues.length === 0 ? 0 : 1);
}

main();
