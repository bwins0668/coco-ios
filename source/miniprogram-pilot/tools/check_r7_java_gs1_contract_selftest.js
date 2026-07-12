var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var root = path.resolve(__dirname, '..');
var checker = path.resolve(root, 'tools/check_r7_java_gs1_contract.js');
var noQuiz = path.resolve(root, 'tools/check_r7_java_no_quiz_contract.js');
var chFile = path.resolve(root, 'packages/java-course-a/data/chapters/java-ch01.js');
var chRel = 'packages/java-course-a/data/chapters/java-ch01.js';

var results = [];
var passed = 0;
var failed = 0;

function runNode(scriptPath) {
  try {
    var out = cp.execFileSync(process.execPath, [scriptPath], {
      cwd: root,
      encoding: 'utf8',
      timeout: 15000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { exit: 0, out: out };
  } catch (e) {
    var output = String(e.stdout || '') + String(e.stderr || '');
    return {
      exit: typeof e.status === 'number' ? e.status : 1,
      out: output || String(e.message || ''),
    };
  }
}

function runChecker() {
  return runNode(checker);
}

function runNoQuiz() {
  return runNode(noQuiz);
}

function summarize(output) {
  return String(output || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 180);
}

function hasWarning(output) {
  return /warning/i.test(String(output || ''));
}

function record(id, mutation, command, result, ok, expected) {
  results.push({
    id: id,
    mutation: mutation,
    command: command,
    exit: result.exit,
    output: summarize(result.out),
    ok: ok,
    expected: expected,
  });
  if (ok) passed++;
  else failed++;
}

function mutateLesson(mutator) {
  delete require.cache[require.resolve(chFile)];
  var mod = require(chFile);
  var lesson = mod.lessons.find(function(l) { return l.lessonId === 'intro-ch01-lesson-001'; });
  if (!lesson) throw new Error('GS1 lesson not found');
  var transform = mutator(lesson, mod);
  var content = 'module.exports = ' + JSON.stringify(mod, null, 2) + ';\n';
  if (typeof transform === 'function') content = transform(content);
  fs.writeFileSync(chFile, content, 'utf8');
}

function restore(original) {
  fs.writeFileSync(chFile, original, 'utf8');
  delete require.cache[require.resolve(chFile)];
  try {
    cp.execFileSync('git', ['update-index', '--refresh', '--', chRel], {
      cwd: root,
      stdio: ['ignore', 'ignore', 'ignore'],
      timeout: 5000,
    });
  } catch (e) {
    // The content restore above is authoritative; this only clears racy stat data.
  }
}

function withMutation(id, mutation, command, mutator, runner, predicate, expected, original) {
  restore(original);
  mutateLesson(mutator);
  var result = runner();
  record(id, mutation, command, result, predicate(result), expected);
  restore(original);
}

function removeZhWhy(lesson) {
  for (var i = 0; i < lesson.blocks.length; i++) {
    var block = lesson.blocks[i];
    if (block.type === 'mechanic' || block.type === 'beginner-note') {
      block.zh = '请先观察示例代码中的 class、main 和 println 三个词，并记住它们会一起出现。';
    }
  }
}

function removeJaWhy(lesson) {
  for (var i = 0; i < lesson.blocks.length; i++) {
    var block = lesson.blocks[i];
    if (block.type === 'mechanic' || block.type === 'beginner-note') {
      block.ja = 'サンプルコードにある class、main、println の三つの語を見つけて、その並びを覚えます。';
    }
  }
}

function removeHandsonObservation(lesson) {
  lesson.handson.ja = 'サンプルコードの3つの println の文字列を、自分の言葉で書き換えてください。次に、1行目の println を main の { } の外に出してください。';
  lesson.handson.zh = '把示例代码中三个 println 的字符串换成你自己的话。然后，把第一个 println 移到 main 的 { } 外面。';
}

function removeHandsonAction(lesson) {
  lesson.handson.ja = 'サンプルコードを読み、class、main、println という三つの言葉を確認します。表示結果やエラーの違いも観察します。';
  lesson.handson.zh = '阅读示例代码，确认 class、main、println 这三个词。也观察显示结果和错误信息的差异。';
}

function putScoreExample(lesson) {
  lesson.codeExamples[0].code =
    'public class JavaR7C01S001 {\n' +
    '  public static void main(String[] args) {\n' +
    '    int score = 90;\n' +
    '    System.out.println(score);\n' +
    '  }\n' +
    '}\n';
  lesson.codeExamples[0].expectedOutput = '90';
  return function(content) {
    return content
      .replace('int score = 90;', 'int sc\\u006fre = 90;')
      .replace('System.out.println(score);', 'System.out.println(sc\\u006fre);');
  };
}

function putQuizStructure(lesson) {
  lesson.options = [{ label: 'A', text: 'program output' }];
  lesson.correctAnswer = 'A';
}

function gs1CodeContains(needle) {
  delete require.cache[require.resolve(chFile)];
  var mod = require(chFile);
  var lesson = mod.lessons.find(function(l) { return l.lessonId === 'intro-ch01-lesson-001'; });
  var code = lesson && lesson.codeExamples && lesson.codeExamples[0] && lesson.codeExamples[0].code;
  return String(code || '').indexOf(needle) !== -1;
}

function printTable() {
  console.log('| 测试 | mutation | 命令 | exit code | 关键输出 |');
  console.log('|---|---|---|---:|---|');
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    var status = r.ok ? 'PASS' : 'FAIL expected ' + r.expected;
    console.log('| ' + r.id + ' ' + status + ' | ' +
      r.mutation.replace(/\|/g, '\\|') + ' | `' + r.command + '` | ' +
      r.exit + ' | ' + r.output.replace(/\|/g, '\\|') + ' |');
  }
}

var ORIGINAL = fs.readFileSync(chFile, 'utf8');

try {
  console.log('GS1 Selftest starting...\n');

  withMutation(
    'TEMP A',
    'learner-visible 正文插入 教材100ページ',
    'node tools/check_r7_java_gs1_contract.js',
    function(lesson) { lesson.blocks[0].ja = '教材100ページを参照。' + lesson.blocks[0].ja; },
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP B',
    'expectedOutput 插入 lesson=',
    'node tools/check_r7_java_gs1_contract.js',
    function(lesson) { lesson.codeExamples[0].expectedOutput += '\nlesson=intro-ch01-lesson-001'; },
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP C',
    '删除中文 why 真实解释',
    'node tools/check_r7_java_gs1_contract.js',
    removeZhWhy,
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP C-JA',
    '删除日文 why 真实解释',
    'node tools/check_r7_java_gs1_contract.js',
    removeJaWhy,
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP D',
    '删除任一 commonMistake',
    'node tools/check_r7_java_gs1_contract.js',
    function(lesson) { lesson.commonMistakes.splice(1, 1); },
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP E',
    '删除 handson 预期观察',
    'node tools/check_r7_java_gs1_contract.js',
    removeHandsonObservation,
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP E-ACTION',
    '删除 handson 具体操作步骤',
    'node tools/check_r7_java_gs1_contract.js',
    removeHandsonAction,
    runChecker,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  withMutation(
    'TEMP F',
    '普通 Java 示例加入 int score = 90;',
    'node tools/check_r7_java_no_quiz_contract.js',
    putScoreExample,
    runNoQuiz,
    function(r) { return r.exit === 0 && gs1CodeContains('int score = 90;'); },
    'exit 0 and code contains int score = 90;',
    ORIGINAL
  );

  withMutation(
    'TEMP G',
    '加入真实 Quiz 结构 options/correctAnswer',
    'node tools/check_r7_java_no_quiz_contract.js',
    putQuizStructure,
    runNoQuiz,
    function(r) { return r.exit === 1; },
    'exit 1',
    ORIGINAL
  );

  restore(ORIGINAL);
  var baseline = runChecker();
  record(
    'TEMP H',
    '当前真实仓库',
    'node tools/check_r7_java_gs1_contract.js',
    baseline,
    baseline.exit === 0 && !hasWarning(baseline.out),
    'exit 0 and zero warning'
  );
} finally {
  restore(ORIGINAL);
}

printTable();
console.log('\n=== Result: ' + passed + ' PASS / ' + failed + ' FAIL / ' + (passed + failed) + ' TOTAL ===');

if (failed > 0) {
  console.log('SELFTEST FAILED');
  process.exit(1);
}

console.log('SELFTEST PASSED');
process.exit(0);
