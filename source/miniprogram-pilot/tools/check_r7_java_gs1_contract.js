/**
 * check_r7_java_gs1_contract.js
 * R7.GS1-CLEAN - intro-ch01-lesson-001 fail-closed contract checker.
 */
var path = require('path');
var root = process.cwd();

function loadLesson() {
  var f = path.resolve(root, 'packages/java-course-a/data/chapters/java-ch01.js');
  var mod = require(f);
  var lesson = mod.lessons.find(function(x) { return x.lessonId === 'intro-ch01-lesson-001'; });
  if (!lesson) return null;
  lesson._nextLesson = mod.lessons[1] || null;
  return lesson;
}

var errors = [];

function fail(message) {
  errors.push(message);
}

function compact(text) {
  return String(text || '').replace(/\s+/g, '');
}

function joinLang(items, lang) {
  return (items || []).map(function(item) { return item && item[lang] ? item[lang] : ''; }).join('\n');
}

function countMatches(text, patterns) {
  var count = 0;
  for (var i = 0; i < patterns.length; i++) {
    if (patterns[i].test(text)) count++;
  }
  return count;
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

function lessonLearnerText(lesson) {
  var parts = [];
  (lesson.blocks || []).forEach(function(block) {
    parts.push(block.ja || '', block.zh || '');
  });
  if (lesson.handson) parts.push(lesson.handson.ja || '', lesson.handson.zh || '');
  (lesson.commonMistakes || []).forEach(function(mistake) {
    parts.push(mistake.ja || '', mistake.zh || '');
  });
  (lesson.codeExamples || []).forEach(function(example) {
    parts.push(example.expectedOutput || '');
    parts.push(example.jaExplanation || '', example.zhExplanation || '');
    (example.lineNotes || []).forEach(function(note) {
      parts.push(note.ja || '', note.zh || '');
    });
  });
  return parts.join('\n');
}

function checkWhyExplanations(lesson) {
  var blockJa = joinLang(lesson.blocks, 'ja');
  var blockZh = joinLang(lesson.blocks, 'zh');

  requireText('ja blocks body', blockJa, 180);
  requireText('zh blocks body', blockZh, 180);

  requirePatternCount('ja why explanation', blockJa, [
    /class[^。]*動きません/,
    /main[^。]*入口がありません/,
    /println[^。]*何も出ません/,
    /なければ/,
    /ないと/,
    /初めて/,
    /ため/,
    /必要/,
    /理由/,
    /なぜ/
  ], 3);

  requirePatternCount('zh why explanation', blockZh, [
    /没有\s*class[^。]*不能运行/,
    /没有\s*main[^。]*没有执行入口/,
    /没有\s*println[^。]*看不到/,
    /否则/,
    /原因/,
    /为什么/,
    /需要/,
    /才是一个/,
    /必须/
  ], 3);

  requirePatternCount('ja mental model', blockJa, [
    /class\s*を探す/,
    /main\s*を探す/,
    /println\s*を探す/,
    /順/,
    /流れ/,
    /枠/,
    /位置関係/
  ], 4);

  requirePatternCount('zh mental model', blockZh, [
    /找\s*class/,
    /找\s*main/,
    /找\s*println/,
    /顺序/,
    /流程/,
    /框架/,
    /位置关系/
  ], 4);
}

function checkHandson(lesson) {
  var handson = lesson.handson;
  if (!handson || !handson.ja || !handson.zh) {
    fail('handson missing ja/zh');
    return;
  }

  var text = handson.ja + '\n' + handson.zh;

  requirePatternCount('handson concrete action', text, [
    /書き換え/,
    /実行/,
    /main\s*の\s*\{\s*\}\s*の外/,
    /コンパイル/,
    /把[^。]*换成/,
    /运行/,
    /移到\s*main\s*的\s*\{\s*\}\s*外面/,
    /重新编译/
  ], 5);

  requirePatternCount('handson expected observation', text, [
    /表示されることを確認/,
    /エラーメッセージ/,
    /観察/,
    /なぜ/,
    /確認.*表示/,
    /观察.*错误信息/,
    /为什么.*报错/,
    /解释/
  ], 4);
}

function checkCommonMistakes(lesson) {
  var mistakes = lesson.commonMistakes || [];
  if (mistakes.length < 3) {
    fail('commonMistakes < 3 (got ' + mistakes.length + ')');
    return;
  }

  for (var i = 0; i < mistakes.length; i++) {
    var mistake = mistakes[i];
    requireText('commonMistakes[' + i + '].ja', mistake && mistake.ja, 40);
    requireText('commonMistakes[' + i + '].zh', mistake && mistake.zh, 40);
    requirePatternCount('commonMistakes[' + i + '] concrete failure', (mistake.ja || '') + '\n' + (mistake.zh || ''), [
      /エラー/,
      /错误/,
      /原因/,
      /コンパイル/,
      /编译/,
      /一致/,
      /外/
    ], 2);
  }
}

function checkCodeExample(lesson) {
  var code = (lesson.codeExamples || [])[0];
  if (!code || !code.code || code.code.length < 30) fail('missing or too-short code example');
  if (code && !code.runnable) fail('code example not marked runnable');
  if (code && !code.expectedOutput) fail('missing expectedOutput');
  if (!code || !code.lineNotes || code.lineNotes.length < 4) {
    fail('lineNotes < 4 (got ' + ((code && code.lineNotes) ? code.lineNotes.length : 0) + ')');
  }

  var codeAll = JSON.stringify(lesson.codeExamples || []);
  if (/lesson=/.test(codeAll)) fail('lesson= found in code/output');
  if (/profile=/.test(codeAll)) fail('profile= found in code/output');
  if (/\b(options|correctAnswer|questionBank|wrongQuestion)\b/.test(codeAll)) fail('quiz structure found in code example');
}

function checkBridge(lesson) {
  var bridge = lesson.nextLessonBridge;
  if (!bridge || !bridge.ja || !bridge.zh) {
    fail('nextLessonBridge missing ja/zh');
    return;
  }
  if (lesson._nextLesson) {
    var nextTitle = lesson._nextLesson.title && lesson._nextLesson.title.ja;
    if (nextTitle && bridge.ja.indexOf(nextTitle) === -1 && bridge.ja.indexOf('次') === -1) {
      fail('bridge does not reference next lesson: ' + nextTitle);
    }
  }
}

function checkLearnerVisibleNoise(lesson) {
  var learnerText = lessonLearnerText(lesson);
  if (/教材\s*\d+\s*(ページ|页)/.test(learnerText)) fail('learner-visible textbook page ref found');
  if (learnerText.indexOf(lesson.lessonId) !== -1) fail('lessonId found in learner-visible text');
  if (/TODO|TBD|同上|后面再说|自行理解|只要记住/.test(learnerText)) fail('forbidden placeholder text found');
}

function main() {
  var lesson = loadLesson();
  if (!lesson) {
    console.log('[GS1] FAIL: lesson not found');
    process.exit(1);
  }

  console.log('[GS1] Checking intro-ch01-lesson-001...');

  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) fail('title missing ja/zh');
  if (lesson.title && lesson.title.zh === lesson.title.ja) fail('zh title is direct copy of ja title');
  if (!lesson.objectives || lesson.objectives.length < 2) fail('objectives < 2');
  if (!lesson.sourceRef) fail('sourceRef missing');

  checkWhyExplanations(lesson);
  checkCodeExample(lesson);
  checkCommonMistakes(lesson);
  checkHandson(lesson);
  checkBridge(lesson);
  checkLearnerVisibleNoise(lesson);

  if (errors.length) {
    console.log('Errors (' + errors.length + '):');
    errors.forEach(function(error) { console.log('  X ' + error); });
    console.log('[GS1] FAIL');
    process.exit(1);
  }

  console.log('[GS1] PASS');
}

main();
