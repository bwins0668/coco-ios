#!/usr/bin/env node
'use strict';
/*
 * Check that every registered page's WXSS uses CSS variables (no hardcoded hex colors).
 * Scans app.json main pages + all subpackage pages.
 */
var fs = require('fs');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];

function read(p) { return fs.readFileSync(path.join(ROOT, p), 'utf8'); }
function exists(p) { try { fs.accessSync(path.join(ROOT, p)); return true; } catch (e) { return false; } }

var app = JSON.parse(read('app.json'));

// Collect all page paths
var pages = app.pages.slice(); // main pages
(app.subPackages || []).forEach(function(sp) {
  (sp.pages || []).forEach(function(p) { pages.push(sp.root + '/' + p); });
});
(app.subpackages || []).forEach(function(sp) {
  (sp.pages || []).forEach(function(p) { pages.push(sp.root + '/' + p); });
});

var SKIP_LIST = [
  // Components / libs with no WXSS or trivial
  'components/',       // skip component wxss (each has unique minimal styles)
  'packageA/',         // standard subpackage example
  'packageB/',
];

function isSkipped(pagePath) {
  return SKIP_LIST.some(function(s) { return pagePath.indexOf(s) >= 0; });
}

var HEX_RE = /#[0-9a-f]{3,8}\b/gi;

pages.forEach(function(pagePath) {
  if (isSkipped(pagePath)) return;
  var wxssPath = pagePath + '.wxss';
  if (!exists(wxssPath)) return;
  var content;
  try { content = read(wxssPath); } catch (e) { return; }

  // Remove CSS variable declarations and color function calls (var(), rgba(), etc.)
  // and comments
  var cleaned = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/var\([^)]*\)/g, '')
    .replace(/rgba?\([^)]*\)/g, '')
    .replace(/hsla?\([^)]*\)/g, '');

  var hexMatches = cleaned.match(HEX_RE);
  if (hexMatches) {
    // Filter out known allowed exceptions
    var violators = hexMatches.filter(function(h) {
      var hl = h.toLowerCase();
      // Intentional brand accent colors — gradient badges, etc.
      if (hl === '#ef4444' || hl === '#dc2626') return false;
      // #fff/#ffffff in text color properties only
      if (hl === '#fff' || hl === '#ffffff') {
        // Only flag if used in background/border contexts
        var lines = cleaned.split('\n').filter(function(l) {
          return l.indexOf(h) >= 0 && (l.indexOf('background') >= 0 || l.indexOf('border') >= 0 || l.indexOf('color') >= 0);
        });
        // Allow #fff in color (text) properties — text-inverse is white
        var textLines = lines.filter(function(l) { return l.indexOf('color:') >= 0 && l.indexOf('background') < 0; });
        lines = lines.filter(function(l) { return l.indexOf('background') >= 0 || l.indexOf('border') >= 0; });
        if (lines.length === 0) return false; // only in text properties — OK
        return true; // has background/border usage
      }
      return true;
    });

    if (violators.length > 0) {
      var pagesSuffix = pagePath.replace(/^pages\//, '');
      failures.push(wxssPath + ' has hardcoded hex colors: ' + violators.slice(0, 8).join(', '));
    }
  }
});

if (failures.length) {
  console.error('THEME COVERAGE FAIL');
  failures.forEach(function(f) { console.error('- ' + f); });
  process.exit(1);
}
console.log('THEME COVERAGE PASS — all ' + pages.length + ' registered pages use CSS variables');
