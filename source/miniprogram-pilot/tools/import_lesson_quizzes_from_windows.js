// tools/import_lesson_quizzes_from_windows.js
// 从 Windows 完整版课程数据中只读提取双语 quizList 到小程序题库
// Run: node tools/import_lesson_quizzes_from_windows.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ITPASS_SOURCE = path.resolve('E:/项目/sql-learning-hub/data/it_passport_lessons.js');
const SG_SOURCE = path.resolve('E:/项目/sql-learning-hub/data/sg_lessons.js');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'questions.js');
const BACKUP_PATH = path.join(__dirname, 'generated-backup', 'questions_backup_v05.js');

console.log('=== Lesson Quiz Import Script ===');
console.log('IT Passport source: ' + ITPASS_SOURCE);
console.log('SG source: ' + SG_SOURCE);
console.log('Output: ' + OUTPUT_PATH);
console.log('');

// ---- Utility functions ----

function safeString(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'object') {
    try { return JSON.stringify(val); } catch (e) { return ''; }
  }
  var s = String(val);
  if (s === 'undefined' || s === '[object Object]') return '';
  return s.trim();
}

/**
 * 解析双语字符串 "日文文本 (中文文本)"
 * 返回 { ja: "...", zh: "..." }
 */
function parseBilingual(text) {
  text = safeString(text);
  if (!text) return { ja: '', zh: '' };

  // 找最后一个 " (" 后的中文括号内容
  // 匹配模式：(.+?)\s*\(([^)]+)\)\s*$
  var match = text.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { ja: match[1].trim(), zh: match[2].trim() };
  }
  // 没有中文括号，全部当作日文
  return { ja: text, zh: '' };
}

function idxToLetter(idx) {
  var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return letters[idx] || 'A';
}

function loadLessonFile(filePath, varName) {
  var code = fs.readFileSync(filePath, 'utf-8');
  // 文件使用 const XXX = [...] 格式
  // 用 vm sandbox 加载
  var sandbox = {};
  vm.createContext(sandbox);
  // 把 const 替换为 var 以便在 sandbox 中赋值
  var modifiedCode = code.replace(/^const\s+/m, 'var ');
  vm.runInContext(modifiedCode, sandbox);
  return sandbox[varName];
}

// ---- Main logic ----

// 1. Backup current questions.js
if (fs.existsSync(OUTPUT_PATH)) {
  fs.copyFileSync(OUTPUT_PATH, BACKUP_PATH);
  console.log('Backup created: ' + BACKUP_PATH);
}

// 2. Load source files
var itpassLessons = null;
var sgLessons = null;

try {
  itpassLessons = loadLessonFile(ITPASS_SOURCE, 'IT_PASSPORT_LESSONS');
  console.log('IT Passport lessons loaded: ' + itpassLessons.length);
} catch (e) {
  console.error('ERROR loading IT Passport lessons: ' + e.message);
  process.exit(1);
}

try {
  sgLessons = loadLessonFile(SG_SOURCE, 'SG_LESSONS');
  console.log('SG lessons loaded: ' + sgLessons.length);
} catch (e) {
  console.error('ERROR loading SG lessons: ' + e.message);
  process.exit(1);
}

// 3. Extract quizzes
var converted = [];
var warnings = [];
var itpassQuizCount = 0;
var sgQuizCount = 0;

function extractQuizzes(lessons, exam) {
  var prefix = exam === 'itpass' ? 'q-itpass-lesson' : 'q-sg-lesson';
  var quizNum = 0;

  for (var i = 0; i < lessons.length; i++) {
    var lesson = lessons[i];
    if (!lesson.quizList || !Array.isArray(lesson.quizList)) continue;

    for (var j = 0; j < lesson.quizList.length; j++) {
      quizNum++;
      var quiz = lesson.quizList[j];
      var id = prefix + '-' + String(quizNum).padStart(4, '0');

      // Parse bilingual question
      var qParsed = parseBilingual(quiz.question);
      var questionJa = qParsed.ja;
      var questionZh = qParsed.zh;

      // If no Chinese question, use Japanese as fallback
      if (!questionZh) {
        questionZh = questionJa;
        warnings.push('[' + id + '] questionZh fallback to Japanese');
      }

      // Parse options
      if (!Array.isArray(quiz.options) || quiz.options.length < 4) {
        warnings.push('[' + id + '] SKIP: options < 4');
        continue;
      }

      var options = [];
      var keys = ['A', 'B', 'C', 'D'];
      for (var k = 0; k < Math.min(quiz.options.length, 4); k++) {
        var optParsed = parseBilingual(quiz.options[k]);
        options.push({
          key: keys[k],
          textZh: optParsed.zh || optParsed.ja,
          textJa: optParsed.ja
        });
      }

      // Map answer
      var answer = idxToLetter(quiz.answerIdx);

      // Explanation: use hint
      var hint = safeString(quiz.hint);
      var explanationZh = hint || '请结合本课内容理解该题。';
      var explanationJa = hint || 'この問題はレッスン内容と合わせて理解してください。';

      // Category: use lesson section or exam
      var category = safeString(lesson.section) || exam;
      // Clean up category: remove parenthetical Chinese if present
      var catParsed = parseBilingual(category);
      category = catParsed.ja || category;

      // Level
      var level = 'basic';

      // Lesson metadata
      var lessonId = safeString(lesson.subSectionId || lesson.id);
      var lessonTitleZh = safeString(lesson.titleZh);
      var lessonTitleJa = safeString(lesson.titleJa);

      var entry = {
        id: id,
        exam: exam,
        sourceType: 'lesson_quiz',
        lessonId: lessonId,
        lessonTitleZh: lessonTitleZh,
        lessonTitleJa: lessonTitleJa,
        category: category,
        level: level,
        questionZh: questionZh,
        questionJa: questionJa,
        options: options,
        answer: answer,
        explanationZh: explanationZh,
        explanationJa: explanationJa
      };

      // Validate
      var valid = true;
      if (!entry.questionZh) { warnings.push('[' + id + '] empty questionZh'); valid = false; }
      if (!entry.questionJa) { warnings.push('[' + id + '] empty questionJa'); valid = false; }
      if (options.length < 4) { warnings.push('[' + id + '] options < 4'); valid = false; }
      if (!['A', 'B', 'C', 'D'].includes(entry.answer)) { warnings.push('[' + id + '] invalid answer'); valid = false; }
      if (!entry.explanationZh) { warnings.push('[' + id + '] empty explanationZh'); valid = false; }
      if (!entry.explanationJa) { warnings.push('[' + id + '] empty explanationJa'); valid = false; }

      // Check forbidden strings
      var allStrings = [entry.questionZh, entry.questionJa, entry.explanationZh, entry.explanationJa];
      for (var o = 0; o < options.length; o++) {
        allStrings.push(options[o].textZh, options[o].textJa);
      }
      for (var s = 0; s < allStrings.length; s++) {
        if (allStrings[s] === 'undefined' || allStrings[s] === '[object Object]') {
          warnings.push('[' + id + '] forbidden string: ' + allStrings[s]);
          valid = false;
        }
      }

      if (valid) {
        converted.push(entry);
        if (exam === 'itpass') itpassQuizCount++;
        else sgQuizCount++;
      }
    }
  }
}

extractQuizzes(itpassLessons, 'itpass');
extractQuizzes(sgLessons, 'sg');

console.log('');
console.log('--- Conversion Summary ---');
console.log('IT Passport quizzes: ' + itpassQuizCount);
console.log('SG quizzes: ' + sgQuizCount);
console.log('Total converted: ' + converted.length);
console.log('Warnings: ' + warnings.length);
if (warnings.length > 0) {
  for (var w = 0; w < Math.min(warnings.length, 10); w++) {
    console.log('  ' + warnings[w]);
  }
  if (warnings.length > 10) console.log('  ... and ' + (warnings.length - 10) + ' more');
}

// 4. Safety check: don't overwrite if too few
if (converted.length < 20) {
  console.error('');
  console.error('ERROR: Only ' + converted.length + ' quizzes converted (need >= 20). Aborting.');
  console.error('data/questions.js NOT overwritten.');
  process.exit(1);
}

if (itpassQuizCount < 10) {
  console.error('ERROR: itpass only has ' + itpassQuizCount + ' quizzes (need >= 10). Aborting.');
  process.exit(1);
}

if (sgQuizCount < 10) {
  console.error('ERROR: sg only has ' + sgQuizCount + ' quizzes (need >= 10). Aborting.');
  process.exit(1);
}

// 5. Generate output
var lines = [];
lines.push('// data/questions.js');
lines.push('// Lesson quiz data imported from Windows version');
lines.push('// Source: it_passport_lessons.js + sg_lessons.js');
lines.push('// Generated: ' + new Date().toISOString().split('T')[0]);
lines.push('// Total entries: ' + converted.length + ' (itpass: ' + itpassQuizCount + ', sg: ' + sgQuizCount + ')');
lines.push('');
lines.push('var questions = [');

for (var i = 0; i < converted.length; i++) {
  var e = converted[i];
  lines.push('  {');
  lines.push('    id: ' + JSON.stringify(e.id) + ',');
  lines.push('    exam: ' + JSON.stringify(e.exam) + ',');
  lines.push('    sourceType: ' + JSON.stringify(e.sourceType) + ',');
  lines.push('    lessonId: ' + JSON.stringify(e.lessonId) + ',');
  lines.push('    lessonTitleZh: ' + JSON.stringify(e.lessonTitleZh) + ',');
  lines.push('    lessonTitleJa: ' + JSON.stringify(e.lessonTitleJa) + ',');
  lines.push('    category: ' + JSON.stringify(e.category) + ',');
  lines.push('    level: ' + JSON.stringify(e.level) + ',');
  lines.push('    questionZh: ' + JSON.stringify(e.questionZh) + ',');
  lines.push('    questionJa: ' + JSON.stringify(e.questionJa) + ',');
  lines.push('    options: [');
  for (var o = 0; o < e.options.length; o++) {
    var opt = e.options[o];
    var comma = o < e.options.length - 1 ? ',' : '';
    lines.push('      { key: ' + JSON.stringify(opt.key) + ', textZh: ' + JSON.stringify(opt.textZh) + ', textJa: ' + JSON.stringify(opt.textJa) + ' }' + comma);
  }
  lines.push('    ],');
  lines.push('    answer: ' + JSON.stringify(e.answer) + ',');
  lines.push('    explanationZh: ' + JSON.stringify(e.explanationZh) + ',');
  lines.push('    explanationJa: ' + JSON.stringify(e.explanationJa));
  lines.push('  }' + (i < converted.length - 1 ? ',' : ''));
}

lines.push('];');
lines.push('');
lines.push('module.exports = {');
lines.push('  questions: questions');
lines.push('};');
lines.push('');

var output = lines.join('\n');
fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
console.log('');
console.log('Output written to: ' + OUTPUT_PATH);
console.log('Output file size: ' + (output.length / 1024).toFixed(1) + ' KB');

// 6. Verify
console.log('');
console.log('--- Verification ---');

delete require.cache[require.resolve(path.join(__dirname, '..', 'data', 'questions'))];
try {
  var mod = require(path.join(__dirname, '..', 'data', 'questions'));
  var data = mod.questions;

  if (!Array.isArray(data)) { console.error('FAIL: not array'); process.exit(1); }
  console.log('PASS: questions is array');
  console.log('PASS: count = ' + data.length);

  var itCount = data.filter(function(q) { return q.exam === 'itpass'; }).length;
  var sgCount2 = data.filter(function(q) { return q.exam === 'sg'; }).length;
  console.log('PASS: itpass = ' + itCount + ', sg = ' + sgCount2);

  if (itCount < 10) { console.error('FAIL: itpass < 10'); process.exit(1); }
  if (sgCount2 < 10) { console.error('FAIL: sg < 10'); process.exit(1); }

  // Check fields
  var fieldErrors = 0;
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    if (!d.id) { fieldErrors++; console.error('FAIL: [' + i + '] no id'); }
    if (d.sourceType !== 'lesson_quiz') { fieldErrors++; console.error('FAIL: [' + i + '] sourceType != lesson_quiz'); }
    if (!d.lessonId) { fieldErrors++; console.error('FAIL: [' + i + '] no lessonId'); }
    if (!d.questionZh || d.questionZh === 'undefined') { fieldErrors++; console.error('FAIL: [' + i + '] bad questionZh'); }
    if (!d.questionJa || d.questionJa === 'undefined') { fieldErrors++; console.error('FAIL: [' + i + '] bad questionJa'); }
    if (!d.explanationZh) { fieldErrors++; console.error('FAIL: [' + i + '] no explanationZh'); }
    if (!d.explanationJa) { fieldErrors++; console.error('FAIL: [' + i + '] no explanationJa'); }
    if (!['A','B','C','D'].includes(d.answer)) { fieldErrors++; console.error('FAIL: [' + i + '] bad answer: ' + d.answer); }
    if (!Array.isArray(d.options) || d.options.length < 4) { fieldErrors++; console.error('FAIL: [' + i + '] options < 4'); }
    else {
      for (var o = 0; o < d.options.length; o++) {
        if (!d.options[o].key || !d.options[o].textZh || !d.options[o].textJa) {
          fieldErrors++;
          console.error('FAIL: [' + i + '] option ' + o + ' missing key/textZh/textJa');
        }
      }
    }
  }
  if (fieldErrors > 0) { console.error('FAIL: ' + fieldErrors + ' field errors'); process.exit(1); }
  console.log('PASS: all fields valid');
  console.log('PASS: no forbidden strings');
} catch (e) {
  console.error('FAIL: require error: ' + e.message);
  process.exit(1);
}

console.log('');
console.log('=== IMPORT COMPLETE ===');
console.log('Total: ' + converted.length + ' quizzes (itpass: ' + itpassQuizCount + ', sg: ' + sgQuizCount + ')');
