var fs = require('fs');
var f = 'tools/miniprogram_smoke_test.js';
var c = fs.readFileSync(f, 'utf8');

// 找到汇总部分前的位置
var idx = c.lastIndexOf("\nconsole.log('\\n===========");
if (idx < 0) {
  console.log('NOT FOUND');
  process.exit(1);
}

var before = c.substring(0, idx);
var after = c.substring(idx);

// R3.62 测试模块
var n = '\n// ===========================================================\n// Round Mini 3.62 quiz answer timer\n// ===========================================================\nvar round362Ok = true;\n\n// A. quiz.js 包含 timerText 字段和计时器逻辑\nvar quizJs362 = readFile("packages/quiz/pages/quiz/quiz.js");\nif (quizJs362.indexOf("timerText") < 0) {\n  fail("R3.62: timerText field missing in quiz.js");\n  round362Ok = false;\n}\nif (quizJs362.indexOf("_timerInterval") < 0) {\n  fail("R3.62: _timerInterval missing in quiz.js");\n  round362Ok = false;\n}\n\n// B. quiz.wxml 包含计时器显示\nvar quizWxml362 = readFile("packages/quiz/pages/quiz/quiz.wxml");\nif (quizWxml362.indexOf("timer-section") < 0) {\n  fail("R3.62: timer-section missing in quiz.wxml");\n  round362Ok = false;\n}\nif (quizWxml362.indexOf("result-timer") < 0) {\n  fail("R3.62: result-timer missing in quiz.wxml");\n  round362Ok = false;\n}\n\n// C. quiz.wxss 包含计时器样式\nvar quizWxss362 = readFile("packages/quiz/pages/quiz/quiz.wxss");\nif (quizWxss362.indexOf(".timer-section") < 0) {\n  fail("R3.62: .timer-section style missing in quiz.wxss");\n  round362Ok = false;\n}\nif (quizWxss362.indexOf(".result-timer-text") < 0) {\n  fail("R3.62: .result-timer-text style missing in quiz.wxss");\n  round362Ok = false;\n}\n\nif (round362Ok) pass("Round Mini 3.62 quiz answer timer");\n\n';

fs.writeFileSync(f, before + n + after, 'utf8');
console.log('INSERTED');
