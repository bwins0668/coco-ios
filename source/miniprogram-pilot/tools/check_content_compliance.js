// tools/check_content_compliance.js
// Study Tools Mini Program - Content Compliance Check
// Scans project files for marketing/promise expressions unsuitable for a learning tool.
// Run: node tools/check_content_compliance.js

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

// Forbidden marketing/promise expressions
const FORBIDDEN_WORDS = [
  '保证通过',
  '包过',
  '押题',
  '必过',
  '100%通过',
  '内部资料',
  '官方答案',
  '绝对安全',
  '永久保存',
  '云端同步',
  '自动备份'
];

// Directories to skip entirely
const SKIP_DIRS = ['.git', 'node_modules', '.workbuddy', 'generated-backup', 'generated-cache'];

// Relative paths to skip (directories or files) — data files contain IT terminology
// where forbidden character sequences appear as substrings of technical terms
// (e.g. "包过滤" contains "包过", "永久保存" in database commit explanation).
// These are not marketing promises and should not trigger compliance violations.
const SKIP_REL_DIRS = new Set([
  'packages/glossary/data',
  'packages/quiz/data',
  'packages/quiz/data/past_exam_bank',
  'packages/exam/data'
]);

function shouldSkipRelDir(rel) {
  if (SKIP_REL_DIRS.has(rel)) return true;
  return /^packages\/quiz-(itpass|sg)-\d+\/data(?:\/|$)/.test(rel);
}

// Files to skip (relative to ROOT) — tool scripts that define blacklist arrays
const SKIP_FILES = new Set([
  'tools/check_content_compliance.js',
  'tools/miniprogram_smoke_test.js',
  'docs/post_autodrive_maintenance.md'
]);

// File extensions to scan
const SCAN_EXTENSIONS = new Set(['.md', '.wxml', '.js', '.json', '.wxss']);

// Collect files to scan
function collectFiles(dir, relBase) {
  var results = [];
  var entries;
  try {
    entries = fs.readdirSync(dir);
  } catch (e) {
    return results;
  }
  for (var i = 0; i < entries.length; i++) {
    var name = entries[i];
    if (SKIP_DIRS.indexOf(name) >= 0) continue;
    var full = path.join(dir, name);
    var rel = relBase ? relBase + '/' + name : name;
    var stat;
    try {
      stat = fs.statSync(full);
    } catch (e) {
      continue;
    }
    if (stat.isDirectory()) {
      if (shouldSkipRelDir(rel)) continue;
      results = results.concat(collectFiles(full, rel));
    } else if (stat.isFile()) {
      if (SKIP_FILES.has(rel)) continue;
      var ext = path.extname(name);
      if (SCAN_EXTENSIONS.has(ext)) {
        results.push(rel);
      }
    }
  }
  return results;
}

// Get context around a match position
function getContext(text, pos, word, maxLen) {
  var start = Math.max(0, pos - Math.floor((maxLen - word.length) / 2));
  var end = Math.min(text.length, start + maxLen);
  if (end - start < maxLen) {
    start = Math.max(0, end - maxLen);
  }
  var snippet = text.substring(start, end).replace(/\n/g, ' ');
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

// Main
var files = collectFiles(ROOT, '');
var violations = [];

for (var fi = 0; fi < files.length; fi++) {
  var filePath = files[fi];
  var content;
  try {
    content = fs.readFileSync(path.join(ROOT, filePath), 'utf-8');
  } catch (e) {
    continue;
  }
  for (var wi = 0; wi < FORBIDDEN_WORDS.length; wi++) {
    var word = FORBIDDEN_WORDS[wi];
    var pos = content.indexOf(word);
    while (pos >= 0) {
      var ctx = getContext(content, pos, word, 80);
      violations.push({
        file: filePath,
        word: word,
        context: ctx
      });
      pos = content.indexOf(word, pos + word.length);
    }
  }
}

if (violations.length > 0) {
  console.log('Content compliance FAILED - ' + violations.length + ' violation(s) found:\n');
  for (var vi = 0; vi < violations.length; vi++) {
    var v = violations[vi];
    console.log('  ' + v.file + ': "' + v.word + '" -> ' + v.context);
  }
  console.log('\nFix the above violations or add file to SKIP_FILES if this is a false positive.');
  process.exit(1);
} else {
  console.log('Content compliance OK - ' + files.length + ' files scanned, 0 violations');
  process.exit(0);
}
