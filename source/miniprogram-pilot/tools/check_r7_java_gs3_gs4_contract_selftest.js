var fs = require('fs');
var os = require('os');
var path = require('path');
var cp = require('child_process');

var root = path.resolve(__dirname, '..');
var checker = path.resolve(root, 'tools/check_r7_java_gs3_gs4_contract.js');
var noQuiz = path.resolve(root, 'tools/check_r7_java_no_quiz_contract.js');
var gs3Id = 'intro-ch03-lesson-001';
var gs4Id = 'intro-ch04-lesson-001';

var results = [];
var passed = 0;
var failed = 0;

function copyFile(srcRoot, dstRoot, rel) {
  var src = path.join(srcRoot, rel);
  var dst = path.join(dstRoot, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function makeTempRoot() {
  var tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-gs3-gs4-'));
  [
    'tools/check_r7_java_gs3_gs4_contract.js',
    'tools/check_r7_java_no_quiz_contract.js',
    'packages/java-course-a/data/chapters/java-ch01.js',
    'packages/java-course-a/data/chapters/java-ch02.js',
    'packages/java-course-a/data/chapters/java-ch03.js',
    'packages/java-course-a/data/chapters/java-ch04.js',
  ].forEach(function(rel) { copyFile(root, tempRoot, rel); });

  [
    'packages/java-course',
    'packages/java-course-b',
    'packages/java-course-c',
  ].forEach(function(rel) {
    fs.mkdirSync(path.join(tempRoot, rel), { recursive: true });
  });
  return tempRoot;
}

function chapterPath(tempRoot, chapter) {
  return path.join(tempRoot, 'packages/java-course-a/data/chapters/' + chapter + '.js');
}

function loadChapter(tempRoot, chapter) {
  var file = chapterPath(tempRoot, chapter);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function saveChapter(tempRoot, chapter, mod, transform) {
  var content = 'module.exports = ' + JSON.stringify(mod, null, 2) + ';\n';
  if (typeof transform === 'function') content = transform(content);
  fs.writeFileSync(chapterPath(tempRoot, chapter), content, 'utf8');
  delete require.cache[require.resolve(chapterPath(tempRoot, chapter))];
}

function lessonOf(mod, id) {
  var lesson = mod.lessons.find(function(item) { return item.lessonId === id; });
  if (!lesson) throw new Error('lesson not found: ' + id);
  return lesson;
}

function mutate(tempRoot, chapter, id, mutator, transform) {
  var mod = loadChapter(tempRoot, chapter);
  mutator(lessonOf(mod, id), mod);
  saveChapter(tempRoot, chapter, mod, transform);
}

function runNode(scriptPath, args, cwd) {
  try {
    var out = cp.execFileSync(process.execPath, [scriptPath].concat(args || []), {
      cwd: cwd || root,
      encoding: 'utf8',
      timeout: 30000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { exit: 0, out: out };
  } catch (e) {
    return {
      exit: typeof e.status === 'number' ? e.status : 1,
      out: String(e.stdout || '') + String(e.stderr || '') || String(e.message || ''),
    };
  }
}

function runChecker(tempRoot) {
  return runNode(checker, ['--root', tempRoot], root);
}

function runNoQuiz(tempRoot) {
  return runNode(path.join(tempRoot, 'tools/check_r7_java_no_quiz_contract.js'), [], tempRoot);
}

function currentCode(tempRoot, chapter, id) {
  var mod = loadChapter(tempRoot, chapter);
  var lesson = lessonOf(mod, id);
  return String(lesson.codeExamples && lesson.codeExamples[0] && lesson.codeExamples[0].code || '');
}

function summarize(output) {
  return String(output || '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 180);
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

function withTemp(id, mutation, command, setup, runner, predicate, expected) {
  var tempRoot = makeTempRoot();
  try {
    if (setup) setup(tempRoot);
    var result = runner(tempRoot);
    record(id, mutation, command, result, predicate(result, tempRoot), expected);
  } finally {
    try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch (e) {}
  }
}

function removeGs3ZhWhy(lesson) {
  lesson.blocks.forEach(function(block) {
    block.zh = '本节先观察 if、else 和比较符号在代码里的位置，并记住它们会影响输出。';
  });
}

function removeGs3If(lesson) {
  var example = lesson.codeExamples[0];
  example.code = example.code
    .replace(/\bif\s*\(/g, 'when (')
    .replace(/\belse\b/g, 'otherwise');
  example.expectedOutput = 'branch removed';
}

function removeGs3EqualsRisk(lesson) {
  lesson.commonMistakes = lesson.commonMistakes.filter(function(mistake) {
    return !/(=|==|代入|赋值)/.test((mistake.ja || '') + (mistake.zh || ''));
  });
}

function removeGs3HandsonObservation(lesson) {
  lesson.handson.ja = '条件に使う2つの値を変更し、比較演算子も1つ変更してください。';
  lesson.handson.zh = '修改两个条件值，再修改一个比较运算符。';
}

function removeGs4MethodDeclaration(lesson) {
  var example = lesson.codeExamples[0];
  example.code = 'public class JavaR7C04S001 {\n' +
    '  public static void main(String[] args) {\n' +
    '    System.out.println("main:start");\n' +
    '    System.out.println("main:end");\n' +
    '  }\n' +
    '}\n';
  example.expectedOutput = 'main:start\nmain:end';
}

function removeGs4MethodCall(lesson) {
  var example = lesson.codeExamples[0];
  example.code = example.code.replace(/^\s*print[A-Za-z0-9_]*\(\);\r?\n/gm, '');
  example.expectedOutput = String(example.expectedOutput || '')
    .replace(/^method:.*\r?\n?/gm, '')
    .trim();
}

function removeGs4HandsonAction(lesson) {
  lesson.handson.ja = 'メソッドの説明を読み、今の出力を確認してください。';
  lesson.handson.zh = '阅读方法说明，并确认当前输出。';
}

function copyGs2HandsonToGs4(tempRoot) {
  var ch2 = loadChapter(tempRoot, 'java-ch02');
  var gs2 = lessonOf(ch2, 'intro-ch02-lesson-004');
  mutate(tempRoot, 'java-ch04', gs4Id, function(lesson) {
    lesson.handson = {
      ja: String(gs2.handson.ja || '').replace(/変数/g, 'メソッド'),
      zh: String(gs2.handson.zh || '').replace(/变量/g, '方法'),
    };
  });
}

function putScoreExample(lesson) {
  lesson.codeExamples[0].code =
    'public class JavaR7C03S001 {\n' +
    '  public static void main(String[] args) {\n' +
    '    int score = 90;\n' +
    '    System.out.println(score);\n' +
    '  }\n' +
    '}\n';
  lesson.codeExamples[0].expectedOutput = '90';
}

function putQuizStructure(lesson) {
  lesson.options = [{ label: 'A', text: 'quiz answer' }];
  lesson.correctAnswer = 'A';
}

function printTable() {
  console.log('测试\tmutation\tcommand\texit code\t关键输出');
  results.forEach(function(result) {
    var status = result.ok ? 'PASS' : 'FAIL expected ' + result.expected;
    console.log(result.id + ' ' + status + '\t' + result.mutation + '\t' + result.command + '\t' + result.exit + '\t' + result.output);
  });
}

console.log('GS3-GS4 Selftest starting...\n');

withTemp('TEMP A', 'GS3 正文插入 教材100ページ', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) {
    mutate(tempRoot, 'java-ch03', gs3Id, function(lesson) {
      lesson.blocks[0].ja = '教材100ページを参照。' + lesson.blocks[0].ja;
    });
  },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP B', 'GS3 删除中文 why', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch03', gs3Id, removeGs3ZhWhy); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP C', 'GS3 删除 if', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch03', gs3Id, removeGs3If); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP D', 'GS3 commonMistakes 删除 = 与 == 风险说明', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch03', gs3Id, removeGs3EqualsRisk); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP E', 'GS3 handson 删除预期观察', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch03', gs3Id, removeGs3HandsonObservation); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP F', 'GS4 删除 main 外方法声明', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch04', gs4Id, removeGs4MethodDeclaration); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP G', 'GS4 删除 main 中方法调用', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch04', gs4Id, removeGs4MethodCall); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP H', 'GS4 handson 删除具体操作或预期观察', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch04', gs4Id, removeGs4HandsonAction); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP I', 'GS4 handson 改成 GS2 同类文本只换标题', 'node tools/check_r7_java_gs3_gs4_contract.js --root <temp-root>',
  copyGs2HandsonToGs4,
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP J', '普通 Java 示例加入 int score = 90;', 'node tools/check_r7_java_no_quiz_contract.js',
  function(tempRoot) {
    mutate(tempRoot, 'java-ch03', gs3Id, putScoreExample, function(content) {
      return content.replace(/score/g, 'sc\\u006fre');
    });
  },
  runNoQuiz, function(result, tempRoot) {
    return result.exit === 0 && currentCode(tempRoot, 'java-ch03', gs3Id).indexOf('int score = 90;') !== -1;
  }, 'exit 0');

withTemp('TEMP K', '加入真实 Quiz options/correctAnswer', 'node tools/check_r7_java_no_quiz_contract.js',
  function(tempRoot) { mutate(tempRoot, 'java-ch03', gs3Id, putQuizStructure); },
  runNoQuiz, function(result) { return result.exit === 1; }, 'exit 1');

var baseline = runNode(checker, [], root);
record('TEMP L', '当前真实仓库', 'node tools/check_r7_java_gs3_gs4_contract.js',
  baseline, baseline.exit === 0 && !hasWarning(baseline.out), 'exit 0 and zero warning');

printTable();
console.log('\n=== Result: ' + passed + ' PASS / ' + failed + ' FAIL / ' + (passed + failed) + ' TOTAL ===');

if (failed > 0) {
  console.log('SELFTEST FAILED');
  process.exit(1);
}

console.log('SELFTEST PASSED');
process.exit(0);
