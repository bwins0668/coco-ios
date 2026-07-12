var fs = require('fs');
var f = 'tools/miniprogram_smoke_test.js';
var c = fs.readFileSync(f, 'utf8');
var idx = c.lastIndexOf("console.log('\\n===========");
if (idx < 0) {
  console.log('NOT FOUND');
  process.exit(1);
}
var before = c.substring(0, idx);
var after = c.substring(idx);
var n = '\n// ============================================================\n// Round Mini 3.62 quiz answer timer\n// ============================================================\nvar round362Ok = true;\n\n// A. quiz.js contains timerText field and timer logic\nvar quizJs362 = readFile("packages/quiz/pages/quiz/quiz.js");\nif (quizJs362.indexOf("timerText") < 0) {\n  fail("R3.62: timerText field missing in quiz.js");\n  round362Ok = false;\n}\nif (quizJs362.indexOf("_timerInterval") < 0) {\n  fail("R3.62: _timerInterval missing in quiz.js");\n  round362Ok = false;\n}\n\n// B. quiz.wxml contains timer display\nvar quizWxml362 = readFile("packages/quiz/pages/quiz/quiz.wxml");\nif (quizWxml362.indexOf("timer-section") < 0) {\n  fail("R3.62: timer-section missing in quiz.wxml");\n  round362Ok = false;\n}\nif (quizWxml362.indexOf("result-timer") < 0) {\n  fail("R3.62: result-timer missing in quiz.wxml");\n  round362Ok = false;\n}\n\n// C. quiz.wxss contains timer styles\nvar quizWxss362 = readFile("packages/quiz/pages/quiz/quiz.wxss");\nif (quizWxss362.indexOf(".timer-section") < 0) {\n  fail("R3.62: .timer-section style missing in quiz.wxss");\n  round362Ok = false;\n}\nif (quizWxss362.indexOf(".result-timer-text") < 0) {\n  fail("R3.62: .result-timer-text style missing in quiz.wxss");\n  round362Ok = false;\n}\n\nif (round362Ok) pass("Round Mini 3.62 quiz answer timer");\n\n';
fs.writeFileSync(f, before + n + after, 'utf8');
console.log('INSERTED');
