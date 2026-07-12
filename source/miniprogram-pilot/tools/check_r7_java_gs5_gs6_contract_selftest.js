var fs = require('fs');
var os = require('os');
var path = require('path');
var cp = require('child_process');

var root = path.resolve(__dirname, '..');
var checker = path.resolve(root, 'tools/check_r7_java_gs5_gs6_contract.js');
var noQuiz = path.resolve(root, 'tools/check_r7_java_no_quiz_contract.js');
var gs5Id = 'intro-ch05-lesson-003';
var gs6Id = 'intro-ch06-lesson-001';

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
  var tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-gs5-gs6-'));
  [
    'tools/check_r7_java_gs5_gs6_contract.js',
    'tools/check_r7_java_no_quiz_contract.js',
    'packages/java-course-a/data/chapters/java-ch01.js',
    'packages/java-course-a/data/chapters/java-ch02.js',
    'packages/java-course-a/data/chapters/java-ch03.js',
    'packages/java-course-a/data/chapters/java-ch04.js',
    'packages/java-course-a/data/chapters/java-ch05.js',
    'packages/java-course-a/data/chapters/java-ch06.js',
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

function insertTextbookPage(lesson) {
  lesson.blocks[0].ja = '教材100ページを参照。' + lesson.blocks[0].ja;
}

function removeGs5ZhWhy(lesson) {
  lesson.blocks.forEach(function(block) {
    block.zh = '本节只观察 class、instance 和 new 的位置。';
  });
}

function removeGs5New(lesson) {
  var example = lesson.codeExamples[0];
  example.code = example.code.replace(/\bnew\s+StudentCard\s*\(/g, 'makeStudentCard(');
  example.expectedOutput = 'new removed';
}

function reduceGs5ToOneInstance(lesson) {
  var example = lesson.codeExamples[0];
  example.code =
    'public class JavaR7C05S003 {\n' +
    '  static class StudentCard {\n' +
    '    String name;\n' +
    '    String course;\n' +
    '  }\n' +
    '  public static void main(String[] args) {\n' +
    '    StudentCard first = new StudentCard();\n' +
    '    first.name = "Coco";\n' +
    '    first.course = "Java";\n' +
    '    System.out.println(first.name + " / " + first.course);\n' +
    '  }\n' +
    '}\n';
  example.expectedOutput = 'Coco / Java';
}

function removeGs5RiskMistakes(lesson) {
  lesson.commonMistakes = [
    {
      ja: '出力だけを見て、どの行が表示を作ったか確認しない。',
      zh: '只看输出，不确认是哪一行生成了显示结果。'
    },
    {
      ja: '説明を読まずにコードを写し、実行順序を説明しない。',
      zh: '不读解释就抄代码，也不说明执行顺序。'
    },
    {
      ja: '表示文を変えただけで、データの違いを確認したつもりになる。',
      zh: '只改显示文字，就以为自己确认了数据差异。'
    },
  ];
}

function removeGs5HandsonObservation(lesson) {
  lesson.handson.ja = '2つのインスタンスを作り、片方のデータを変更してください。';
  lesson.handson.zh = '创建两个实例，并修改其中一个实例的数据。';
}

function removeGs6Constructor(lesson) {
  var example = lesson.codeExamples[0];
  example.code =
    'public class JavaR7C06S001 {\n' +
    '  static class StudentCard {\n' +
    '    String name;\n' +
    '    int studyMinutes;\n' +
    '    String label() { return name + " studies " + studyMinutes + " minutes"; }\n' +
    '  }\n' +
    '  public static void main(String[] args) {\n' +
    '    StudentCard coco = new StudentCard();\n' +
    '    coco.name = "Coco";\n' +
    '    coco.studyMinutes = 45;\n' +
    '    System.out.println(coco.label());\n' +
    '  }\n' +
    '}\n';
  example.expectedOutput = 'Coco studies 45 minutes';
}

function voidGs6Constructor(lesson) {
  var example = lesson.codeExamples[0];
  example.code = example.code.replace(/\n(\s*)StudentCard\s*\(/, '\n$1void StudentCard(');
}

function removeGs6NewInMain(lesson) {
  var example = lesson.codeExamples[0];
  example.code = example.code.replace(/\bnew\s+StudentCard\s*\(/g, 'StudentCard.create(');
  example.expectedOutput = 'new removed';
}

function removeGs6DifferentInitialization(lesson) {
  var example = lesson.codeExamples[0];
  example.code = example.code.replace(/new StudentCard\("Mei",\s*\d+\)/g, 'new StudentCard("Coco", 45)');
  example.expectedOutput = String(example.expectedOutput || '').replace(/Mei[^\n]*/g, 'Coco studies 45 minutes');
}

function removeGs6HandsonObservation(lesson) {
  lesson.handson.ja = 'コンストラクタの引数を変更し、2つのオブジェクトを作ってください。';
  lesson.handson.zh = '修改构造方法参数，并创建两个对象。';
}

function copyGs4HandsonToGs6(tempRoot) {
  var ch4 = loadChapter(tempRoot, 'java-ch04');
  var gs4 = lessonOf(ch4, 'intro-ch04-lesson-001');
  mutate(tempRoot, 'java-ch06', gs6Id, function(lesson) {
    lesson.handson = {
      ja: String(gs4.handson.ja || '').replace(/メソッド/g, 'コンストラクタ'),
      zh: String(gs4.handson.zh || '').replace(/方法/g, '构造方法'),
    };
  });
}

function putScoreExample(lesson) {
  lesson.codeExamples[0].code =
    'public class JavaR7C05S003 {\n' +
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
  console.log('| 测试 | mutation | command | exit code | 关键输出 |');
  console.log('|---|---|---|---:|---|');
  results.forEach(function(result) {
    var status = result.ok ? 'PASS' : 'FAIL expected ' + result.expected;
    console.log('| ' + result.id + ' ' + status + ' | ' + result.mutation + ' | ' + result.command + ' | ' + result.exit + ' | ' + result.output.replace(/\|/g, '/') + ' |');
  });
}

console.log('GS5-GS6 Selftest starting...\n');

withTemp('TEMP A', 'GS5 learner-visible 正文插入 教材100ページ', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, insertTextbookPage); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP B', 'GS5 删除中文 why', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, removeGs5ZhWhy); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP C', 'GS5 删除 new', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, removeGs5New); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP D', 'GS5 从两个实例改为一个实例', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, reduceGs5ToOneInstance); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP E', 'GS5 删除 class/object/new/null 具体风险', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, removeGs5RiskMistakes); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP F', 'GS5 handson 删除预期观察', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, removeGs5HandsonObservation); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP G', 'GS6 删除 constructor', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch06', gs6Id, removeGs6Constructor); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP H', 'GS6 将 constructor 改成 void', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch06', gs6Id, voidGs6Constructor); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP I', 'GS6 删除 main 中的 new 调用', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch06', gs6Id, removeGs6NewInMain); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP J', 'GS6 删除两个对象不同初始化状态', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch06', gs6Id, removeGs6DifferentInitialization); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP K', 'GS6 handson 删除具体操作或预期观察', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  function(tempRoot) { mutate(tempRoot, 'java-ch06', gs6Id, removeGs6HandsonObservation); },
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP L', 'GS6 handson 改成 GS4 同类文本仅替换标题', 'node tools/check_r7_java_gs5_gs6_contract.js --root <temp-root>',
  copyGs4HandsonToGs6,
  runChecker, function(result) { return result.exit === 1; }, 'exit 1');

withTemp('TEMP M', '普通 Java 示例加入 int score = 90;', 'node tools/check_r7_java_no_quiz_contract.js',
  function(tempRoot) {
    mutate(tempRoot, 'java-ch05', gs5Id, putScoreExample, function(content) {
      return content.replace(/score/g, 'sc\\u006fre');
    });
  },
  runNoQuiz, function(result, tempRoot) {
    return result.exit === 0 && currentCode(tempRoot, 'java-ch05', gs5Id).indexOf('int score = 90;') !== -1;
  }, 'exit 0');

withTemp('TEMP N', '加入真实 Quiz options/correctAnswer', 'node tools/check_r7_java_no_quiz_contract.js',
  function(tempRoot) { mutate(tempRoot, 'java-ch05', gs5Id, putQuizStructure); },
  runNoQuiz, function(result) { return result.exit === 1; }, 'exit 1');

var baseline = runNode(checker, [], root);
record('TEMP O', '当前真实仓库 GS5-GS6 checker', 'node tools/check_r7_java_gs5_gs6_contract.js',
  baseline, baseline.exit === 0 && !hasWarning(baseline.out), 'exit 0 and zero warning');

printTable();
console.log('\n=== Result: ' + passed + ' PASS / ' + failed + ' FAIL / ' + (passed + failed) + ' TOTAL ===');

if (failed > 0) {
  console.log('SELFTEST FAILED');
  process.exit(1);
}

console.log('SELFTEST PASSED');
process.exit(0);
