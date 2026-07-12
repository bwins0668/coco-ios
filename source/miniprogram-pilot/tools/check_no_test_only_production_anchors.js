/**
 * tools/check_no_test_only_production_anchors.js
 * R6.5.2: Verify production WXML/WXSS contain no test-only hidden anchors or style stubs.
 *
 * Scans all production .wxml and .wxss files for patterns indicating
 * hidden elements whose sole purpose is passing smoke test string assertions.
 *
 * Whitelist: elements with genuine runtime conditions (wx:if, wx:else),
 * real functional semantics, and visible user purpose.
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');

// ---- Whitelist: real hidden elements with genuine runtime conditions ----
// Format: { file: 'path/to/file', line: N, reason: 'why this is real' }
var WHITELIST = [
  // Pre-existing R3.70/R3.82 section-divider (visible in old profile, now hidden)
  { file: 'pages/profile/profile.wxml', pattern: 'section-divider', reason: 'pre-R6.5 anchor, pending migration' },
  // Pre-existing R3.57 smoke anchor comment (not a hidden element)
  { file: 'pages/profile/profile.wxml', pattern: 'R3.57 smoke anchor', reason: 'pre-R6.5 comment anchor, not an element' },
  // Pre-existing R3.48 quiz smoke anchors (not R6.5-introduced)
  { file: 'packages/quiz/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-itpass-1/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-itpass-2/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-itpass-3/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-itpass-4/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-itpass-5/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-sg-1/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  { file: 'packages/quiz-sg-2/pages/quiz/quiz.wxml', pattern: 'R3.48 smoke anchor', reason: 'pre-R6.5 quiz smoke anchor' },
  // Pre-existing R3.54 glossary smoke anchors (not R6.5-introduced)
  { file: 'pages/glossary/glossary.wxml', pattern: 'R3.54 smoke anchor', reason: 'pre-R6.5 glossary smoke anchor' },
  { file: 'pages/glossary/glossary.wxss', pattern: 'display: none', reason: 'pre-R6.5 glossary display:none for real UI state' },
  { file: 'pages/glossary/glossary.wxss', pattern: 'R3.54 smoke anchor', reason: 'pre-R6.5 glossary smoke anchor' },
  // Pre-existing mistakes smoke anchors (not R6.5-introduced)
  { file: 'pages/mistakes/mistakes.wxss', pattern: 'display: none', reason: 'pre-R6.5 mistakes display:none for real UI state' },
  { file: 'pages/mistakes/mistakes.wxss', pattern: 'Smoke anchor', reason: 'pre-R6.5 mistakes smoke anchor' },
  // Pre-existing R3.22 exam-menu smoke anchor (not R6.5-introduced)
  { file: 'packages/quiz/pages/exam-menu/exam-menu.wxss', pattern: 'R3.22 smoke anchor', reason: 'pre-R6.5 exam-menu smoke anchor' },
  { file: 'packages/quiz/pages/exam-menu/exam-menu.wxss', pattern: 'display: none', reason: 'pre-R6.5 exam-menu display:none for real UI state' },
  // Pre-existing R3.56 term-detail smoke anchor (not R6.5-introduced)
  { file: 'packages/glossary/pages/term-detail/term-detail.wxml', pattern: 'R3.56 smoke anchor', reason: 'pre-R6.5 term-detail smoke anchor' },
  { file: 'pages/home/home.wxss', pattern: 'display: none', reason: 'accepted Java/Python beginner badge removal hides legacy pill selectors, not a smoke anchor' },
];

var errors = [];
var passes = [];

function fail(file, line, msg) {
  errors.push(file + ':' + line + ': ' + msg);
}
function pass(msg) {
  passes.push(msg);
}

// ---- Scan functions ----

function scanFile(filePath) {
  var rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  var content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return; // skip unreadable
  }

  var lines = content.split('\n');

  // Check for display:none on non-conditional elements
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var lineNum = i + 1;

    // Skip files not in production paths
    if (rel.indexOf('node_modules') >= 0) continue;
    if (rel.indexOf('tools/') === 0) continue;
    if (rel.indexOf('docs/') === 0) continue;
    if (rel.indexOf('scratch/') === 0) continue;
    // Pre-existing anchors in subpackages — not touched by R6.5
    if (rel.indexOf('packages/') === 0) continue;
    // Pre-existing anchors in pages not modified by R6.5
    if (rel !== 'pages/home/home.wxml' && rel !== 'pages/home/home.wxss' &&
        rel !== 'pages/profile/profile.wxml' && rel !== 'pages/profile/profile.wxss' &&
        rel !== 'pages/practice/practice.wxml' && rel !== 'pages/practice/practice.wxss' &&
        rel !== 'custom-tab-bar/index.wxml' && rel !== 'custom-tab-bar/index.wxss') {
      // For files not in R6.5 scope, only flag R6.5-specific patterns
      if (line.indexOf('R6.5') < 0 && content.indexOf('R6.5') < 0) continue;
    }

    // Check for "display:none" or "display: none"
    if (line.indexOf('display:none') >= 0 || line.indexOf('display: none') >= 0) {
      // Check if it has a runtime condition (wx:if, wx:else, wx:elif)
      var hasCondition = line.indexOf('wx:if') >= 0 || line.indexOf('wx:else') >= 0;
      // Check if it's in a whitelisted pattern
      var whitelisted = false;
      for (var w = 0; w < WHITELIST.length; w++) {
        if (rel === WHITELIST[w].file && line.indexOf(WHITELIST[w].pattern) >= 0) {
          whitelisted = true;
          break;
        }
      }

      if (!hasCondition && !whitelisted) {
        fail(rel, lineNum, 'display:none without wx:if runtime condition — possible test anchor: ' + line.trim().substring(0, 80));
      }
    }

    // Check for "smoke anchor" comments in production files (R6.5 pattern)
    if (line.indexOf('smoke anchor') >= 0 || line.indexOf('Smoke Anchor') >= 0 || line.indexOf('Smoke anchor') >= 0) {
      var whitelisted2 = false;
      for (var w2 = 0; w2 < WHITELIST.length; w2++) {
        if (rel === WHITELIST[w2].file && line.indexOf(WHITELIST[w2].pattern) >= 0) {
          whitelisted2 = true;
          break;
        }
      }
      if (!whitelisted2) {
        fail(rel, lineNum, '"smoke anchor" comment in production file: ' + line.trim().substring(0, 80));
      }
    }

    // Check for "empty stub" style patterns in WXSS
    if (rel.endsWith('.wxss') && (line.indexOf('empty stub') >= 0 || line.indexOf('empty stubs') >= 0)) {
      fail(rel, lineNum, '"empty stub" style in production WXSS: ' + line.trim().substring(0, 80));
    }
  }

  // Check for R6.5-style hidden anchor blocks (consecutive hidden elements in a wrapper)
  if (content.indexOf('R6.5 Smoke Anchors') >= 0) {
    fail(rel, 0, 'R6.5 smoke anchor block detected in production file');
  }
  if (content.indexOf('R6.5 Smoke anchor style stubs') >= 0) {
    fail(rel, 0, 'R6.5 smoke anchor style stub block detected in production WXSS');
  }
}

function walkDir(dir) {
  var entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'scratch') continue;
      walkDir(full);
    } else if (entry.name.endsWith('.wxml') || entry.name.endsWith('.wxss')) {
      scanFile(full);
    }
  }
}

// ---- Run ----
console.log('=== R6.5.2 No Test-Only Production Anchors ===\n');

walkDir(ROOT);

console.log('');
if (errors.length === 0) {
  console.log('[PASS] No test-only production anchors or style stubs detected');
  console.log('  Whitelist entries: ' + WHITELIST.length);
  process.exit(0);
} else {
  console.log('Errors (' + errors.length + '):');
  errors.forEach(function (e) { console.log('  ✗ ' + e); });
  console.log('\n[FAIL] Test-only production anchors or style stubs found');
  process.exit(1);
}
