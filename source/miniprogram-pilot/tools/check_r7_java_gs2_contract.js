/**
 * check_r7_java_gs2_contract.js
 * R7.GS2-CLEAN - intro-ch02-lesson-004 variables/data-types golden checker.
 */
var fs = require('fs');
var os = require('os');
var path = require('path');
var cp = require('child_process');
var root = process.cwd();

var LESSON_ID = 'intro-ch02-lesson-004';
var errors = [];

function fail(message) {
  errors.push(message);
}

function loadChapter() {
  return require(path.resolve(root, 'packages/java-course-a/data/chapters/java-ch02.js'));
}

function loadLesson() {
  var mod = loadChapter();
  var index = mod.lessons.findIndex(function(lesson) { return lesson.lessonId === LESSON_ID; });
  if (index < 0) return null;
  var lesson = mod.lessons[index];
  lesson._nextLesson = mod.lessons[index + 1] || null;
  return lesson;
}

function compact(text) {
  return String(text || '').replace(/\s+/g, '');
}

function flatten(values) {
  var out = [];
  values.forEach(function(value) {
    if (!value) return;
    if (Array.isArray(value)) {
      out = out.concat(flatten(value));
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(function(key) {
        out = out.concat(flatten([value[key]]));
      });
    } else {
      out.push(String(value));
    }
  });
  return out;
}

function learnerVisibleText(lesson) {
  var blocks = (lesson.blocks || []).map(function(block) {
    return { title: block.title, ja: block.ja, zh: block.zh };
  });
  var terms = (lesson.terms || []).map(function(term) {
    return {
      en: term.en,
      ja: term.ja,
      zh: term.zh,
      explanationJa: term.explanationJa,
      explanationZh: term.explanationZh,
    };
  });
  var examples = [];
  (lesson.codeExamples || []).forEach(function(example) {
    examples.push({
      expectedOutput: example.expectedOutput,
      jaExplanation: example.jaExplanation,
      zhExplanation: example.zhExplanation,
      lineNotes: (example.lineNotes || []).map(function(note) {
        return { ja: note.ja, zh: note.zh };
      }),
    });
  });
  return flatten([
    lesson.title,
    lesson.objectives,
    lesson.prerequisites,
    blocks,
    terms,
    examples,
    lesson.commonMistakes,
    lesson.handson,
    lesson.summary,
    lesson.nextLessonBridge,
  ]).join('\n');
}

function countMatches(text, patterns) {
  return patterns.reduce(function(count, pattern) {
    return count + (pattern.test(text) ? 1 : 0);
  }, 0);
}

function requirePatternCount(label, text, patterns, minCount) {
  var count = countMatches(text, patterns);
  if (count < minCount) {
    fail(label + ' insufficient learner-visible evidence (got ' + count + ', need ' + minCount + ')');
  }
}

function requireText(label, text, minLength) {
  if (!text || compact(text).length < minLength) {
    fail(label + ' missing or too short');
  }
}

function checkIdentity(lesson) {
  if (!lesson) {
    fail('GS2 lesson not found: ' + LESSON_ID);
    return;
  }
  if (lesson.lessonId !== LESSON_ID) fail('wrong lessonId: ' + lesson.lessonId);
  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) fail('title missing ja/zh');
  if (lesson.title && compact(lesson.title.ja).length < 2) fail('ja title too short');
  if (lesson.title && compact(lesson.title.zh).length < 2) fail('zh title too short');
  if (!lesson.sourceRef || lesson.sourceRef.section !== '変数') fail('sourceRef section mismatch for GS2');
  if (!lesson._nextLesson || lesson._nextLesson.lessonId !== 'intro-ch02-lesson-005') fail('next lesson mismatch');
  if (!lesson.objectives || lesson.objectives.length < 2) fail('objectives < 2');
}

function checkPedagogy(lesson) {
  var text = learnerVisibleText(lesson);
  var blockJa = (lesson.blocks || []).map(function(block) { return block.ja || ''; }).join('\n');
  var blockZh = (lesson.blocks || []).map(function(block) { return block.zh || ''; }).join('\n');

  requireText('ja blocks', blockJa, 240);
  requireText('zh blocks', blockZh, 240);

  requirePatternCount('ja why variables are needed', blockJa, [
    /情報を覚え/,
    /値を.*使い回/,
    /名前を付け/,
    /必要/,
    /変わる/,
    /入力.*処理.*出力/
  ], 4);

  requirePatternCount('zh why variables are needed', blockZh, [
    /记住信息/,
    /重复使用/,
    /贴标签/,
    /为什么.*变量/,
    /值.*变化/,
    /输入.*处理.*输出/
  ], 4);

  requirePatternCount('beginner mental model', text, [
    /ラベル/,
    /引き出し/,
    /貼标签/,
    /标签/,
    /種類/,
    /数据种类/
  ], 4);

  requirePatternCount('variable declaration assignment read order', text, [
    /宣言/,
    /代入/,
    /読み出/,
    /声明/,
    /赋值/,
    /读取/
  ], 5);

  requirePatternCount('input process output explanation', text, [
    /入力/,
    /処理/,
    /出力/,
    /输入/,
    /处理/,
    /输出/
  ], 6);

  requirePatternCount('terms ja zh en', text, [
    /variable/,
    /data type/,
    /assignment/,
    /変数/,
    /データ型/,
    /代入/,
    /变量/,
    /数据类型/,
    /赋值/
  ], 8);
}

function checkCodeExample(lesson) {
  var code = (lesson.codeExamples || [])[0];
  if (!code) {
    fail('missing code example');
    return;
  }
  if (!code.runnable) fail('code example not marked runnable');
  requireText('code example code', code.code, 80);
  requireText('expectedOutput', code.expectedOutput, 10);
  if (!/int\s+\w+\s*=/.test(code.code)) fail('code example missing int declaration/assignment');
  if (!/double\s+\w+\s*=/.test(code.code)) fail('code example missing double declaration/assignment');
  if (!/String\s+\w+\s*=/.test(code.code)) fail('code example missing String declaration/assignment');
  if (!/System\.out\.println\s*\([^)]*\w+/.test(code.code)) fail('code example does not output variables');
  if (!/int\s+score\s*=/.test(code.code)) fail('ordinary int score variable example missing');
  if (!code.lineNotes || code.lineNotes.length < 4) fail('lineNotes < 4');
  (code.lineNotes || []).forEach(function(note, index) {
    requireText('lineNotes[' + index + '].ja', note.ja, 18);
    requireText('lineNotes[' + index + '].zh', note.zh, 18);
  });
  verifyExpectedOutput(code);
}

function verifyExpectedOutput(example) {
  var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-gs2-'));
  var sourcePath = path.join(tempDir, example.className + '.java');
  try {
    fs.writeFileSync(sourcePath, example.code, 'utf8');
    cp.execFileSync('javac', [sourcePath], { cwd: tempDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000 });
    var actual = cp.execFileSync('java', ['-cp', tempDir, example.className], { cwd: tempDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000 });
    var normalizedActual = actual.replace(/\r\n/g, '\n').trim();
    var normalizedExpected = String(example.expectedOutput || '').replace(/\r\n/g, '\n').trim();
    if (normalizedActual !== normalizedExpected) {
      fail('expectedOutput mismatch: actual="' + normalizedActual + '" expected="' + normalizedExpected + '"');
    }
  } catch (e) {
    fail('Java example compile/run failed: ' + (e.stderr || e.message || e));
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

function checkCommonMistakes(lesson) {
  var mistakes = lesson.commonMistakes || [];
  if (mistakes.length < 3) {
    fail('commonMistakes < 3 (got ' + mistakes.length + ')');
    return;
  }
  requirePatternCount('required common mistakes', JSON.stringify(mistakes), [
    /未初期化|初始化/,
    /String[^。]*(ダブルクォーテーション|双引号)|双引号/,
    /int[^。]*(小数|小数值|double)/
  ], 3);
  mistakes.forEach(function(mistake, index) {
    requireText('commonMistakes[' + index + '].ja', mistake.ja, 32);
    requireText('commonMistakes[' + index + '].zh', mistake.zh, 32);
    requirePatternCount('commonMistakes[' + index + '] concrete cause', (mistake.ja || '') + '\n' + (mistake.zh || ''), [
      /エラー/,
      /错误/,
      /原因/,
      /修正/,
      /修正/
    ], 2);
  });
}

function checkHandson(lesson) {
  var handson = lesson.handson;
  if (!handson || !handson.ja || !handson.zh) {
    fail('handson missing ja/zh');
    return;
  }
  var text = handson.ja + '\n' + handson.zh;
  requirePatternCount('handson concrete edits', text, [
    /名前|姓名/,
    /学習時間|学习时间/,
    /score|分数/,
    /金額|金额/,
    /2つ|两项|至少两项/,
    /変更|修改/
  ], 5);
  requirePatternCount('handson expected observation', text, [
    /出力.*変わ/,
    /观察.*输出/,
    /小数.*int/,
    /エラー/,
    /错误/,
    /修正/
  ], 4);
}

function checkBridge(lesson) {
  var bridge = lesson.nextLessonBridge;
  if (!bridge || !bridge.ja || !bridge.zh) {
    fail('nextLessonBridge missing ja/zh');
    return;
  }
  var next = lesson._nextLesson;
  if (!next || bridge.ja.indexOf(next.title.ja) === -1) {
    fail('bridge does not point to real next lesson ja title');
  }
  if (!/変数/.test(bridge.ja + bridge.zh)) fail('bridge does not connect to variables');
}

function checkNoiseAndQuiz(lesson) {
  var text = learnerVisibleText(lesson);
  var codeAll = JSON.stringify(lesson.codeExamples || []);
  if (/教材\s*\d+\s*ページ|教材第\s*\d+\s*页|教材\d+ページ/.test(text)) fail('learner-visible textbook page ref found');
  if (/sourceRef|chapterId|semanticFidelity/.test(text)) fail('learner-visible internal metadata name found');
  if (text.indexOf(LESSON_ID) !== -1) fail('lessonId found in learner-visible text');
  if (/profile=|lesson=/.test(codeAll)) fail('profile= or lesson= found in code/output');
  if (/TODO|TBD|同上|后面再说|自行理解|无教学意义/.test(text)) fail('placeholder or meaningless learner text found');
  if (/\b(options|correctAnswer|questionBank|wrongQuestion|srs)\b/i.test(JSON.stringify(lesson))) {
    fail('quiz/SRS structure or token found');
  }
}

function main() {
  var lesson = loadLesson();
  console.log('[GS2] Checking intro-ch02-lesson-004...');
  checkIdentity(lesson);
  if (lesson) {
    checkPedagogy(lesson);
    checkCodeExample(lesson);
    checkCommonMistakes(lesson);
    checkHandson(lesson);
    checkBridge(lesson);
    checkNoiseAndQuiz(lesson);
  }

  if (errors.length) {
    console.log('Errors (' + errors.length + '):');
    errors.forEach(function(error) { console.log('  X ' + error); });
    console.log('[GS2] FAIL');
    process.exit(1);
  }
  console.log('[GS2] PASS');
}

main();
