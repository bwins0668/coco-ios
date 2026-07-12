// tools/import_glossary_from_windows.js
// 从 Windows 完整版只读导入 Glossary 数据到微信小程序
// Run: node tools/import_glossary_from_windows.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SOURCE_PATH = path.resolve('E:/项目/sql-learning-hub/data/glossary/it_terms.js');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'glossary.js');

console.log('=== Glossary Import Script ===');
console.log('Source: ' + SOURCE_PATH);
console.log('Output: ' + OUTPUT_PATH);
console.log('');

// 1. Read source file (read-only)
if (!fs.existsSync(SOURCE_PATH)) {
  console.error('ERROR: Source file not found: ' + SOURCE_PATH);
  process.exit(1);
}

var sourceCode = fs.readFileSync(SOURCE_PATH, 'utf-8');
console.log('Source file size: ' + (sourceCode.length / 1024).toFixed(1) + ' KB');

// 2. Extract glossary array using vm sandbox
var sandbox = { window: {} };
vm.createContext(sandbox);

try {
  vm.runInContext(sourceCode, sandbox);
} catch (e) {
  console.error('ERROR: Failed to execute source file: ' + e.message);
  process.exit(1);
}

var sourceGlossary = sandbox.window.IT_TERMS_GLOSSARY;

if (!Array.isArray(sourceGlossary)) {
  console.error('ERROR: IT_TERMS_GLOSSARY is not an array');
  process.exit(1);
}

console.log('Source entries count: ' + sourceGlossary.length);

// Show first 3 entries structure summary
console.log('\n--- First 3 entries structure ---');
for (var i = 0; i < Math.min(3, sourceGlossary.length); i++) {
  var e = sourceGlossary[i];
  console.log('[' + i + '] id=' + e.id + ', en.term=' + (e.en && e.en.term) + ', zh.term=' + (e.zh && e.zh.term) + ', ja.term=' + (e.ja && e.ja.term));
  console.log('     category=' + e.category + ', level=' + e.level);
  console.log('     fields: ' + Object.keys(e).join(', '));
}

// 3. Convert entries
function padNum(n, len) {
  var s = String(n);
  while (s.length < len) s = '0' + s;
  return s;
}

function safeString(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'object') {
    try { return JSON.stringify(val); } catch (e) { return ''; }
  }
  var s = String(val);
  if (s === 'undefined' || s === '[object Object]') return '';
  return s;
}

function extractExample(entry) {
  var ex = entry.example;
  if (!ex) return '请结合课程内容理解该术语。';
  if (typeof ex === 'string') return safeString(ex) || '请结合课程内容理解该术语。';
  if (typeof ex === 'object') {
    if (ex.text) return safeString(ex.text);
    if (ex.sql) return safeString(ex.sql);
    // Try to get any string value from the object
    var keys = Object.keys(ex);
    for (var k = 0; k < keys.length; k++) {
      if (typeof ex[keys[k]] === 'string' && ex[keys[k]]) return ex[keys[k]];
    }
  }
  return '请结合课程内容理解该术语。';
}

function extractTags(entry) {
  var tags = [];
  if (entry.category) tags.push(entry.category);
  // Add exam tags
  var etags = entry.examTags || entry.exam_tags;
  if (Array.isArray(etags)) {
    for (var i = 0; i < etags.length; i++) {
      if (tags.indexOf(etags[i]) === -1) tags.push(etags[i]);
    }
  }
  // Add a few aliases if available (max 2)
  if (Array.isArray(entry.aliases) && entry.aliases.length > 0) {
    var added = 0;
    for (var i = 0; i < entry.aliases.length && added < 2; i++) {
      var a = safeString(entry.aliases[i]);
      if (a && tags.indexOf(a) === -1) {
        tags.push(a);
        added++;
      }
    }
  }
  if (tags.length === 0) tags.push('general');
  return tags;
}

var converted = [];
var idSet = {};
var termSet = {};
var warnings = [];

for (var i = 0; i < sourceGlossary.length; i++) {
  var src = sourceGlossary[i];

  // ID: normalize to term-0001
  var numId = padNum(i + 1, 4);
  var id = 'term-' + numId;

  // term: English term
  var term = (src.en && src.en.term) ? safeString(src.en.term) : '';
  if (!term && src.id) term = src.id.replace(/_/g, ' ');

  // zh: Chinese term
  var zh = (src.zh && src.zh.term) ? safeString(src.zh.term) : '';

  // ja: Japanese term
  var ja = (src.ja && src.ja.term) ? safeString(src.ja.term) : '';

  // category
  var category = src.category ? safeString(src.category) : 'general';

  // level
  var level = src.level ? safeString(src.level) : 'basic';

  // tags
  var tags = extractTags(src);

  // explanationZh
  var explanationZh = (src.zh && src.zh.explanation) ? safeString(src.zh.explanation) : '';
  if (!explanationZh && src.en && src.en.explanation) {
    explanationZh = safeString(src.en.explanation);
  }

  // explanationJa: use ja.note (which contains Japanese explanation)
  var explanationJa = '';
  if (src.ja && src.ja.note) {
    explanationJa = safeString(src.ja.note);
  } else if (src.ja && src.ja.explanation) {
    explanationJa = safeString(src.ja.explanation);
  }
  if (!explanationJa) {
    explanationJa = src.ja && src.ja.term ? safeString(src.ja.term) + 'に関する用語です。' : '関連用語です。';
  }

  // example
  var example = extractExample(src);

  // Validate required fields
  if (!term) {
    warnings.push('[' + i + '] empty term, using id: ' + src.id);
    term = safeString(src.id) || 'unknown-' + numId;
  }
  if (!zh) {
    zh = term; // fallback to English term
    warnings.push('[' + i + '] empty zh, using term as fallback');
  }
  if (!ja) {
    ja = term; // fallback to English term
    warnings.push('[' + i + '] empty ja, using term as fallback');
  }
  if (!explanationZh) {
    explanationZh = '暂无中文解释。';
    warnings.push('[' + i + '] empty explanationZh');
  }

  // Check for forbidden strings
  var allFields = [term, zh, ja, explanationZh, explanationJa, example, category, level];
  var hasBadString = false;
  for (var f = 0; f < allFields.length; f++) {
    if (allFields[f] === 'undefined' || allFields[f] === '[object Object]') {
      warnings.push('[' + i + '] field contains forbidden string: ' + allFields[f]);
      hasBadString = true;
    }
  }
  if (hasBadString) {
    // Fix them
    if (explanationZh === 'undefined' || explanationZh === '[object Object]') explanationZh = '暂无中文解释。';
    if (explanationJa === 'undefined' || explanationJa === '[object Object]') explanationJa = '関連用語です。';
    if (term === 'undefined' || term === '[object Object]') term = safeString(src.id) || 'term-' + numId;
    if (zh === 'undefined' || zh === '[object Object]') zh = term;
    if (ja === 'undefined' || ja === '[object Object]') ja = term;
    if (example === 'undefined' || example === '[object Object]') example = '请结合课程内容理解该术语。';
    if (category === 'undefined' || category === '[object Object]') category = 'general';
    if (level === 'undefined' || level === '[object Object]') level = 'basic';
  }

  // Clean tags
  var cleanTags = [];
  for (var t = 0; t < tags.length; t++) {
    var tag = safeString(tags[t]);
    if (tag && tag !== 'undefined' && tag !== '[object Object]') {
      cleanTags.push(tag);
    }
  }
  if (cleanTags.length === 0) cleanTags.push('general');

  var entry = {
    id: id,
    term: term,
    zh: zh,
    ja: ja,
    category: category,
    level: level,
    tags: cleanTags,
    explanationZh: explanationZh,
    explanationJa: explanationJa,
    example: example
  };

  converted.push(entry);

  // Check duplicate IDs
  if (idSet[id]) {
    warnings.push('DUPLICATE ID: ' + id);
  }
  idSet[id] = true;

  // Track duplicate terms
  var lowerTerm = term.toLowerCase();
  if (termSet[lowerTerm]) {
    // just a warning, not fatal
  }
  termSet[lowerTerm] = (termSet[lowerTerm] || 0) + 1;
}

console.log('\n--- Conversion Summary ---');
console.log('Converted entries: ' + converted.length);
console.log('Warnings: ' + warnings.length);

// Show duplicate terms
var dupTerms = [];
var termKeys = Object.keys(termSet);
for (var k = 0; k < termKeys.length; k++) {
  if (termSet[termKeys[k]] > 1) {
    dupTerms.push(termKeys[k] + ' (x' + termSet[termKeys[k]] + ')');
  }
}
if (dupTerms.length > 0) {
  console.log('Duplicate terms (warning, not fatal): ' + dupTerms.slice(0, 10).join(', '));
  if (dupTerms.length > 10) console.log('  ... and ' + (dupTerms.length - 10) + ' more');
}

// 4. Generate output file
var lines = [];
lines.push('// data/glossary.js');
lines.push('// Glossary data imported from Windows version');
lines.push('// Source: sql-learning-hub/data/glossary/it_terms.js');
lines.push('// Generated: ' + new Date().toISOString().split('T')[0]);
lines.push('// Total entries: ' + converted.length);
lines.push('');
lines.push('var glossary = [');

for (var i = 0; i < converted.length; i++) {
  var e = converted[i];
  lines.push('  {');
  lines.push('    id: ' + JSON.stringify(e.id) + ',');
  lines.push('    term: ' + JSON.stringify(e.term) + ',');
  lines.push('    zh: ' + JSON.stringify(e.zh) + ',');
  lines.push('    ja: ' + JSON.stringify(e.ja) + ',');
  lines.push('    category: ' + JSON.stringify(e.category) + ',');
  lines.push('    level: ' + JSON.stringify(e.level) + ',');
  lines.push('    tags: ' + JSON.stringify(e.tags) + ',');
  lines.push('    explanationZh: ' + JSON.stringify(e.explanationZh) + ',');
  lines.push('    explanationJa: ' + JSON.stringify(e.explanationJa) + ',');
  lines.push('    example: ' + JSON.stringify(e.example));
  lines.push('  }' + (i < converted.length - 1 ? ',' : ''));
}

lines.push('];');
lines.push('');
lines.push('module.exports = {');
lines.push('  glossary: glossary');
lines.push('};');
lines.push('');

var output = lines.join('\n');

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
console.log('\nOutput written to: ' + OUTPUT_PATH);
console.log('Output file size: ' + (output.length / 1024).toFixed(1) + ' KB');

// 5. Verify the output can be required
console.log('\n--- Verification ---');

// Clear require cache
delete require.cache[require.resolve(path.join(__dirname, '..', 'data', 'glossary'))];

try {
  var mod = require(path.join(__dirname, '..', 'data', 'glossary'));
  var data = mod.glossary;

  if (!Array.isArray(data)) {
    console.error('FAIL: glossary is not an array');
    process.exit(1);
  }
  console.log('PASS: glossary is array');

  if (data.length < 1500) {
    console.error('FAIL: expected >= 1500 entries, got ' + data.length);
    process.exit(1);
  }
  console.log('PASS: count = ' + data.length + ' (>= 1500)');

  // Check unique IDs
  var ids = {};
  var dupCount = 0;
  for (var i = 0; i < data.length; i++) {
    if (ids[data[i].id]) dupCount++;
    ids[data[i].id] = true;
  }
  if (dupCount > 0) {
    console.error('FAIL: ' + dupCount + ' duplicate IDs');
    process.exit(1);
  }
  console.log('PASS: no duplicate IDs');

  // Check required fields
  var fieldErrors = 0;
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    if (!d.term || d.term === 'undefined' || d.term === '[object Object]') { fieldErrors++; console.error('FAIL: [' + i + '] bad term: ' + d.term); }
    if (!d.zh || d.zh === 'undefined' || d.zh === '[object Object]') { fieldErrors++; console.error('FAIL: [' + i + '] bad zh'); }
    if (!d.ja || d.ja === 'undefined' || d.ja === '[object Object]') { fieldErrors++; console.error('FAIL: [' + i + '] bad ja'); }
    if (!Array.isArray(d.tags)) { fieldErrors++; console.error('FAIL: [' + i + '] tags not array'); }
    if (!d.explanationZh || d.explanationZh === 'undefined') { fieldErrors++; console.error('FAIL: [' + i + '] bad explanationZh'); }
    if (!d.explanationJa || d.explanationJa === 'undefined') { fieldErrors++; console.error('FAIL: [' + i + '] bad explanationJa'); }
  }
  if (fieldErrors > 0) {
    console.error('FAIL: ' + fieldErrors + ' field errors');
    process.exit(1);
  }
  console.log('PASS: all required fields valid');
  console.log('PASS: no forbidden strings');

} catch (e) {
  console.error('FAIL: require error: ' + e.message);
  process.exit(1);
}

console.log('\n=== IMPORT COMPLETE ===');
console.log('Total entries: ' + converted.length);
if (warnings.length > 0) {
  console.log('Warnings: ' + warnings.length);
  for (var w = 0; w < Math.min(warnings.length, 20); w++) {
    console.log('  ' + warnings[w]);
  }
  if (warnings.length > 20) console.log('  ... and ' + (warnings.length - 20) + ' more');
}
