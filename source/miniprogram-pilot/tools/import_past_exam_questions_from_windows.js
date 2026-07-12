// tools/import_past_exam_questions_from_windows.js
// 从 Windows 完整版过去问数据中只读提取日文真题到小程序题库
// Run: node tools/import_past_exam_questions_from_windows.js

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ITPASS_SOURCE = path.resolve('E:/项目/sql-learning-hub/data/it_passport_past_exams.js');
var SG_SOURCE = path.resolve('E:/项目/sql-learning-hub/data/sg_past_exams.js');
var OUTPUT_PATH = path.join(__dirname, '..', 'data', 'questions.js');
var IMPORT_COUNT = 50; // 每个考试导入 50 题

console.log('=== Past Exam Import Script ===');
console.log('IT Passport source: ' + ITPASS_SOURCE);
console.log('SG source: ' + SG_SOURCE);
console.log('Output: ' + OUTPUT_PATH);
console.log('Import count per exam: ' + IMPORT_COUNT);
console.log('');

// ---- Utility functions ----

/**
 * 清理 HTML 标签和实体，保留纯文本
 */
function cleanHtml(html) {
  if (!html || typeof html !== 'string') return '';
  var s = html;
  // 将 <br> / <br/> / <p> / <div> 等块级元素转为换行或空格
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n');
  s = s.replace(/<\/div>/gi, '\n');
  s = s.replace(/<\/li>/gi, '\n');
  s = s.replace(/<\/dl>/gi, '\n');
  s = s.replace(/<\/dd>/gi, '\n');
  // 去除所有剩余 HTML 标签
  s = s.replace(/<[^>]+>/g, '');
  // HTML 实体转换
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&amp;/g, '&');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&apos;/g, "'");
  // 压缩多余空白
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/[ \t]+/g, ' ');
  s = s.trim();
  return s;
}

function safeString(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'object') {
    try { return JSON.stringify(val); } catch (e) { return ''; }
  }
  var s = String(val);
  if (s === 'undefined' || s === '[object Object]') return '';
  return s.trim();
}

function idxToLetter(idx) {
  return ['A', 'B', 'C', 'D'][idx] || 'A';
}

/**
 * 用 vm sandbox 加载源文件中的 const 数组
 */
function loadSourceData(filePath, varName) {
  var code = fs.readFileSync(filePath, 'utf-8');
  // 将 const XXX = [...] 替换为 var XXX = [...]
  code = code.replace('const ' + varName, 'var ' + varName);
  var sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox[varName];
}

/**
 * 将源数据中的一条题目转换为目标格式
 */
function convertQuestion(raw, exam, index) {
  var idPrefix = exam === 'itpass' ? 'q-itpass-past-' : 'q-sg-past-';
  var id = idPrefix + String(index + 1).padStart(4, '0');

  var questionJa = cleanHtml(raw.question);
  var explanationJa = cleanHtml(raw.explanation);
  var answerKey = idxToLetter(raw.answer);

  // 清理选项
  var options = [];
  for (var i = 0; i < raw.options.length && i < 4; i++) {
    var optText = cleanHtml(raw.options[i]);
    options.push({
      key: idxToLetter(i),
      textZh: optText, // 日文兜底，非中文翻译
      textJa: optText
    });
  }

  // 确保至少 4 个选项
  while (options.length < 4) {
    options.push({
      key: idxToLetter(options.length),
      textZh: '',
      textJa: ''
    });
  }

  return {
    id: id,
    exam: exam,
    sourceType: 'past_exam_japanese',
    year: safeString(raw.year),
    yearId: safeString(raw.yearId),
    number: raw.number || (index + 1),
    source: 'windows_past_exam',
    category: safeString(raw.category),
    topic: safeString(raw.topic),
    subcategory: safeString(raw.subcategory),
    level: 'exam',
    lessonId: '',
    lessonTitleZh: '日文真题',
    lessonTitleJa: '過去問',
    questionZh: questionJa, // 日文兜底，非中文翻译
    questionJa: questionJa,
    options: options,
    answer: answerKey,
    explanationZh: explanationJa, // 日文兜底，非中文翻译
    explanationJa: explanationJa,
    hasZhTranslation: false,
    hasJaTranslation: true,
    zhFallbackFromJa: true,
    translationStatus: 'zh_fallback_from_ja',
    explanationStatus: 'shared_hint',
    hasZhExplanation: false,
    hasJaExplanation: true,
    explanationShared: true
  };
}

// ---- Main ----

try {
  // 1. 加载源数据
  console.log('Loading IT Passport past exams...');
  var itpassRaw = loadSourceData(ITPASS_SOURCE, 'IT_PASSPORT_PAST_EXAMS');
  console.log('  Total IT Passport past exams: ' + itpassRaw.length);

  console.log('Loading SG past exams...');
  var sgRaw = loadSourceData(SG_SOURCE, 'SG_PAST_EXAMS');
  console.log('  Total SG past exams: ' + sgRaw.length);

  // 2. 选取题目（优先最新年度 = 源文件顺序前 50 条）
  var itpassSelected = itpassRaw.slice(0, IMPORT_COUNT);
  var sgSelected = sgRaw.slice(0, IMPORT_COUNT);

  console.log('  Selected IT Passport: ' + itpassSelected.length + ' (from ' + itpassSelected[0].yearId + ' to ' + itpassSelected[itpassSelected.length - 1].yearId + ')');
  console.log('  Selected SG: ' + sgSelected.length + ' (from ' + sgSelected[0].yearId + ' to ' + sgSelected[sgSelected.length - 1].yearId + ')');

  // 3. 转换
  var itpassQuestions = [];
  for (var i = 0; i < itpassSelected.length; i++) {
    itpassQuestions.push(convertQuestion(itpassSelected[i], 'itpass', i));
  }

  var sgQuestions = [];
  for (var j = 0; j < sgSelected.length; j++) {
    sgQuestions.push(convertQuestion(sgSelected[j], 'sg', j));
  }

  var newQuestions = itpassQuestions.concat(sgQuestions);
  console.log('  Converted: ' + newQuestions.length + ' past exam questions');

  // 4. 读取已有 questions.js 并追加
  var existingContent = fs.readFileSync(OUTPUT_PATH, 'utf-8');

  // 验证已有数据
  var existingModule = require(path.join(__dirname, '..', 'data', 'questions'));
  var existingQuestions = existingModule.questions;
  console.log('  Existing questions: ' + existingQuestions.length);

  // 检查 ID 冲突
  var existingIds = {};
  for (var k = 0; k < existingQuestions.length; k++) {
    existingIds[existingQuestions[k].id] = true;
  }
  for (var m = 0; m < newQuestions.length; m++) {
    if (existingIds[newQuestions[m].id]) {
      console.error('ERROR: ID conflict: ' + newQuestions[m].id);
      process.exit(1);
    }
  }

  // 5. 生成新的 questions.js
  // 提取 module.exports 前的数组内容
  var arrayEnd = existingContent.lastIndexOf('];');
  if (arrayEnd === -1) {
    console.error('ERROR: Cannot find array end in questions.js');
    process.exit(1);
  }

  var beforeArrayEnd = existingContent.substring(0, arrayEnd);
  var afterArrayEnd = existingContent.substring(arrayEnd);

  // 构建新题目字符串
  var newItemsStr = '';
  for (var n = 0; n < newQuestions.length; n++) {
    newItemsStr += ',\n  ' + JSON.stringify(newQuestions[n], null, 4).replace(/\n/g, '\n  ');
  }

  var newContent = beforeArrayEnd + newItemsStr + '\n' + afterArrayEnd;

  // 更新头部注释
  var totalCount = existingQuestions.length + newQuestions.length;
  var itpassTotal = existingQuestions.filter(function(q) { return q.exam === 'itpass'; }).length + itpassQuestions.length;
  var sgTotal = existingQuestions.filter(function(q) { return q.exam === 'sg'; }).length + sgQuestions.length;

  newContent = newContent.replace(
    /\/\/ Total entries:.*/,
    '// Total entries: ' + totalCount + ' (itpass: ' + itpassTotal + ', sg: ' + sgTotal + ')'
  );
  newContent = newContent.replace(
    /\/\/ Lesson quiz data imported from Windows version/,
    '// Lesson quiz + past exam questions imported from Windows version'
  );

  // 6. 写入
  fs.writeFileSync(OUTPUT_PATH, newContent, 'utf-8');
  console.log('');
  console.log('=== Import Complete ===');
  console.log('Total questions: ' + totalCount);
  console.log('  itpass: ' + itpassTotal + ' (lesson: ' + existingQuestions.filter(function(q) { return q.exam === 'itpass'; }).length + ' + past: ' + itpassQuestions.length + ')');
  console.log('  sg: ' + sgTotal + ' (lesson: ' + existingQuestions.filter(function(q) { return q.exam === 'sg'; }).length + ' + past: ' + sgQuestions.length + ')');
  console.log('Output: ' + OUTPUT_PATH);

} catch (e) {
  console.error('IMPORT FAILED: ' + e.message);
  console.error(e.stack);
  process.exit(1);
}
