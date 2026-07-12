var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var root = path.resolve(__dirname, '..');
var checker = path.resolve(root, 'tools/check_r7_java_gs2_contract.js');
var noQuiz = path.resolve(root, 'tools/check_r7_java_no_quiz_contract.js');
var chFile = path.resolve(root, 'packages/java-course-a/data/chapters/java-ch02.js');
var chRel = 'packages/java-course-a/data/chapters/java-ch02.js';
var lessonId = 'intro-ch02-lesson-004';

var results = [];
var passed = 0;
var failed = 0;

function runNode(scriptPath) {
  try {
    var out = cp.execFileSync(process.execPath, [scriptPath], {
      cwd: root,
      encoding: 'utf8',
      timeout: 20000,
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

function loadModule() {
  delete require.cache[require.resolve(chFile)];
  return require(chFile);
}

function mutateLesson(mutator) {
  var mod = loadModule();
  var lesson = mod.lessons.find(function(item) { return item.lessonId === lessonId; });
  if (!lesson) throw new Error('GS2 lesson not found');
  var transform = mutator(lesson, mod);
  var content = 'module.exports = ' + JSON.stringify(mod, null, 2) + ';\n';
  if (typeof transform === 'function') content = transform(content);
  fs.writeFileSync(chFile, content, 'utf8');
  delete require.cache[require.resolve(chFile)];
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
  } catch (e) {}
}

function withMutation(id, mutation, command, mutator, runner, predicate, expected, original) {
  restore(original);
  mutateLesson(mutator);
  var result = runner();
  record(id, mutation, command, result, predicate(result), expected);
  restore(original);
}

function removeZhWhy(lesson) {
  lesson.blocks.forEach(function(block) {
    block.zh = '本节先观察变量、int、double 和 String 这些词，并记住它们在代码里出现的位置。';
  });
}

function removeDouble(lesson) {
  lesson.blocks.forEach(function(block) {
    block.ja = String(block.ja || '').replace(/double/g, 'numeric');
    block.zh = String(block.zh || '').replace(/double/g, '数字类型');
  });
  lesson.terms = (lesson.terms || []).filter(function(term) { return term.en !== 'data type'; });
  lesson.codeExamples[0].code = lesson.codeExamples[0].code.replace(/double\s+hours\s*=\s*2\.5;/, 'int hours = 2;');
  lesson.codeExamples[0].expectedOutput = lesson.codeExamples[0].expectedOutput.replace('hours=2.5', 'hours=2');
  lesson.codeExamples[0].lineNotes = lesson.codeExamples[0].lineNotes.filter(function(note) {
    return !/double|小数/.test((note.ja || '') + (note.zh || '') + (note.snippet || ''));
  });
}

function removeHandsonObservation(lesson) {
  lesson.handson.ja = 'name、hours、score、amount のうち2つを変更してください。次に、score の行も変更してください。';
  lesson.handson.zh = '修改 name、hours、score、amount 中的两项。然后再修改 score 那一行。';
}

function putScoreExample(lesson) {
  lesson.codeExamples[0].code =
    'public class JavaR7C02S004 {\n' +
    '  public static void main(String[] args) {\n' +
    '    int score = 90;\n' +
    '    System.out.println(score);\n' +
    '  }\n' +
    '}\n';
  lesson.codeExamples[0].expectedOutput = '90';
  return function(content) {
    return content.replace(/score/g, 'sc\\u006fre');
  };
}

function putQuizStructure(lesson) {
  lesson.options = [{ label: 'A', text: 'score answer' }];
  lesson.correctAnswer = 'A';
}

function gs2CodeContains(needle) {
  var mod = loadModule();
  var lesson = mod.lessons.find(function(item) { return item.lessonId === lessonId; });
  var code = lesson && lesson.codeExamples && lesson.codeExamples[0] && lesson.codeExamples[0].code;
  return String(code || '').indexOf(needle) !== -1;
}

function printTable() {
  console.log('测试\tmutation\tcommand\texit code\t关键输出');
  results.forEach(function(result) {
    var status = result.ok ? 'PASS' : 'FAIL expected ' + result.expected;
    console.log(result.id + ' ' + status + '\t' + result.mutation + '\t' + result.command + '\t' + result.exit + '\t' + result.output);
  });
}

var ORIGINAL = fs.readFileSync(chFile, 'utf8');

try {
  console.log('GS2 Selftest starting...\n');

  withMutation('TEMP A', 'GS2 正文插入 教材100ページ', 'node tools/check_r7_java_gs2_contract.js',
    function(lesson) { lesson.blocks[0].ja = '教材100ページを参照。' + lesson.blocks[0].ja; },
    runChecker, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  withMutation('TEMP B', 'expectedOutput 插入 lesson=', 'node tools/check_r7_java_gs2_contract.js',
    function(lesson) { lesson.codeExamples[0].expectedOutput += '\nlesson=intro-ch02-lesson-004'; },
    runChecker, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  withMutation('TEMP C', '删除中文“为什么需要变量”', 'node tools/check_r7_java_gs2_contract.js',
    removeZhWhy,
    runChecker, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  withMutation('TEMP D', '删除 double 示例或说明', 'node tools/check_r7_java_gs2_contract.js',
    removeDouble,
    runChecker, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  withMutation('TEMP E', '删除一个 commonMistake', 'node tools/check_r7_java_gs2_contract.js',
    function(lesson) { lesson.commonMistakes.splice(1, 1); },
    runChecker, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  withMutation('TEMP F', '删除 handson 的预期观察', 'node tools/check_r7_java_gs2_contract.js',
    removeHandsonObservation,
    runChecker, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  withMutation('TEMP G', '普通 Java 示例加入 int score = 90;', 'node tools/check_r7_java_no_quiz_contract.js',
    putScoreExample,
    runNoQuiz, function(result) { return result.exit === 0 && gs2CodeContains('int score = 90;'); }, 'exit 0', ORIGINAL);

  withMutation('TEMP H', '加入真实 Quiz options/correctAnswer', 'node tools/check_r7_java_no_quiz_contract.js',
    putQuizStructure,
    runNoQuiz, function(result) { return result.exit === 1; }, 'exit 1', ORIGINAL);

  restore(ORIGINAL);
  var baseline = runChecker();
  record('TEMP I', '当前真实仓库', 'node tools/check_r7_java_gs2_contract.js',
    baseline, baseline.exit === 0 && !hasWarning(baseline.out), 'exit 0 and zero warning');
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
