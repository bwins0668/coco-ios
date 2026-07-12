/**
 * check_r7_java_gs3_gs4_contract.js
 * R7.GS3-GS4-CLEAN - conditions and methods golden lesson checker.
 */
var fs = require('fs');
var os = require('os');
var path = require('path');
var cp = require('child_process');

var root = process.cwd();
var args = process.argv.slice(2);
for (var i = 0; i < args.length; i++) {
  if (args[i] === '--root' && args[i + 1]) {
    root = path.resolve(args[i + 1]);
    i++;
  }
}

var GOLDENS = [
  {
    label: 'GS3',
    chapterFile: 'java-ch03.js',
    lessonId: 'intro-ch03-lesson-001',
    chapterId: 'java-ch03',
    sourceSection: '条件分岐',
    nextLessonId: 'intro-ch03-lesson-002',
    titlePatterns: [/条件分岐/, /条件分支|条件判断/],
  },
  {
    label: 'GS4',
    chapterFile: 'java-ch04.js',
    lessonId: 'intro-ch04-lesson-001',
    chapterId: 'java-ch04',
    sourceSection: 'メソッドとは',
    nextLessonId: 'intro-ch04-lesson-002',
    titlePatterns: [/メソッド/, /方法|method/i],
  },
];

var errors = [];

function fail(message) {
  errors.push(message);
}

function chapterPath(chapterFile) {
  return path.resolve(root, 'packages/java-course-a/data/chapters', chapterFile);
}

function loadChapter(chapterFile) {
  var file = chapterPath(chapterFile);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function loadGolden(config) {
  var mod = loadChapter(config.chapterFile);
  var index = mod.lessons.findIndex(function(lesson) {
    return lesson.lessonId === config.lessonId;
  });
  if (index < 0) return null;
  var lesson = mod.lessons[index];
  lesson._nextLesson = mod.lessons[index + 1] || null;
  return lesson;
}

function loadBaseline(chapterFile, lessonId) {
  var mod = loadChapter(chapterFile);
  return mod.lessons.find(function(lesson) { return lesson.lessonId === lessonId; }) || null;
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
      code: example.code,
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

function joinLang(items, lang) {
  return (items || []).map(function(item) {
    return item && item[lang] ? item[lang] : '';
  }).join('\n');
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

function checkIdentity(config, lesson) {
  if (!lesson) {
    fail(config.label + ' lesson not found: ' + config.lessonId);
    return;
  }
  if (lesson.lessonId !== config.lessonId) fail(config.label + ' wrong lessonId');
  if (lesson.chapterId !== config.chapterId) fail(config.label + ' wrong chapterId');
  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) fail(config.label + ' title missing ja/zh');
  if (lesson.title && lesson.title.zh === lesson.title.ja) fail(config.label + ' zh title directly copies ja title');
  if (lesson.title && !config.titlePatterns[0].test(lesson.title.ja || '')) fail(config.label + ' ja title does not match topic');
  if (lesson.title && !config.titlePatterns[1].test(lesson.title.zh || '')) fail(config.label + ' zh title does not match topic');
  if (!lesson.sourceRef || lesson.sourceRef.section !== config.sourceSection) fail(config.label + ' sourceRef section mismatch');
  if (!lesson._nextLesson || lesson._nextLesson.lessonId !== config.nextLessonId) fail(config.label + ' next lesson mismatch');
  if (!lesson.objectives || lesson.objectives.length < 2) fail(config.label + ' objectives < 2');
  (lesson.objectives || []).forEach(function(objective, index) {
    requireText(config.label + ' objectives[' + index + '].ja', objective.ja, 18);
    requireText(config.label + ' objectives[' + index + '].zh', objective.zh, 18);
  });
}

function checkCommonPedagogy(config, lesson) {
  var text = learnerVisibleText(lesson);
  var blockJa = joinLang(lesson.blocks, 'ja');
  var blockZh = joinLang(lesson.blocks, 'zh');

  requireText(config.label + ' ja blocks body', blockJa, 300);
  requireText(config.label + ' zh blocks body', blockZh, 300);

  if (!lesson.blocks || lesson.blocks.length < 5) fail(config.label + ' blocks < 5');

  requirePatternCount(config.label + ' input-process-output ja/zh', text, [
    /入力/,
    /処理/,
    /出力/,
    /输入/,
    /处理/,
    /输出/,
  ], 5);

  requirePatternCount(config.label + ' learner-visible mental model', text, [
    /モデル|イメージ|例え|たとえ/,
    /心智模型|想成|比作|模型/,
    /順序|流れ/,
    /顺序|流程|路径/,
  ], 4);

  checkTerms(config, lesson);
  checkLineNotes(config, lesson);
  checkCommonMistakes(config, lesson);
  checkHandsonCommon(config, lesson);
  checkBridge(config, lesson);
  checkNoiseAndQuiz(config, lesson);
}

function checkTerms(config, lesson) {
  var terms = lesson.terms || [];
  if (terms.length < 3) {
    fail(config.label + ' terms < 3');
    return;
  }
  terms.forEach(function(term, index) {
    requireText(config.label + ' terms[' + index + '].en', term.en, 2);
    requireText(config.label + ' terms[' + index + '].ja', term.ja, 2);
    requireText(config.label + ' terms[' + index + '].zh', term.zh, 2);
    requireText(config.label + ' terms[' + index + '].explanationJa', term.explanationJa, 18);
    requireText(config.label + ' terms[' + index + '].explanationZh', term.explanationZh, 18);
  });
}

function checkLineNotes(config, lesson) {
  var code = (lesson.codeExamples || [])[0];
  if (!code) {
    fail(config.label + ' missing code example');
    return;
  }
  if (!code.lineNotes || code.lineNotes.length < 4) {
    fail(config.label + ' lineNotes < 4');
    return;
  }
  code.lineNotes.forEach(function(note, index) {
    requireText(config.label + ' lineNotes[' + index + '].ja', note.ja, 22);
    requireText(config.label + ' lineNotes[' + index + '].zh', note.zh, 22);
    if (note.snippet && code.code.indexOf(note.snippet) === -1) {
      fail(config.label + ' lineNotes[' + index + '] snippet not found in code: ' + note.snippet);
    }
  });
}

function checkCommonMistakes(config, lesson) {
  var mistakes = lesson.commonMistakes || [];
  if (mistakes.length < 3) {
    fail(config.label + ' commonMistakes < 3 (got ' + mistakes.length + ')');
    return;
  }
  mistakes.forEach(function(mistake, index) {
    requireText(config.label + ' commonMistakes[' + index + '].ja', mistake.ja, 42);
    requireText(config.label + ' commonMistakes[' + index + '].zh', mistake.zh, 42);
    requirePatternCount(config.label + ' commonMistakes[' + index + '] concrete failure', (mistake.ja || '') + '\n' + (mistake.zh || ''), [
      /エラー|誤り|原因|結果|実行|表示/,
      /错误|原因|结果|执行|输出|会/,
      /修正|直す|改成|修复/,
    ], 2);
  });
}

function checkHandsonCommon(config, lesson) {
  var handson = lesson.handson;
  if (!handson || !handson.ja || !handson.zh) {
    fail(config.label + ' handson missing ja/zh');
    return;
  }
  var text = handson.ja + '\n' + handson.zh;
  requirePatternCount(config.label + ' handson concrete action', text, [
    /変更|書き換え|実行|確認/,
    /修改|改成|运行|确认/,
    /出力|表示/,
    /输出|观察/,
  ], 4);
  requirePatternCount(config.label + ' handson expected observation', text, [
    /変わる|違い|観察|理由|なぜ/,
    /变化|不同|观察|原因|为什么|预期/,
    /確認/,
    /确认/,
  ], 4);
}

function checkBridge(config, lesson) {
  var bridge = lesson.nextLessonBridge;
  if (!bridge || !bridge.ja || !bridge.zh) {
    fail(config.label + ' nextLessonBridge missing ja/zh');
    return;
  }
  var next = lesson._nextLesson;
  if (!next || !next.title) {
    fail(config.label + ' next lesson missing for bridge');
    return;
  }
  if (bridge.ja.indexOf(next.title.ja) === -1) fail(config.label + ' bridge does not include real next ja title');
  if (bridge.zh.indexOf(next.title.zh) === -1) fail(config.label + ' bridge does not include real next zh title');
}

function checkNoiseAndQuiz(config, lesson) {
  var text = learnerVisibleText(lesson);
  var codeAll = JSON.stringify(lesson.codeExamples || []);
  if (/教材\s*(第\s*)?\d+\s*(ページ|页)|教材\d+ページ/.test(text)) fail(config.label + ' learner-visible textbook page ref found');
  if (/\b(sourceRef|lessonId|chapterId|semanticFidelity)\b/.test(text)) fail(config.label + ' learner-visible internal metadata name found');
  if (text.indexOf(config.lessonId) !== -1) fail(config.label + ' lessonId found in learner-visible text');
  if (/profile=|lesson=/.test(codeAll) || /profile=|lesson=/.test(text)) fail(config.label + ' profile= or lesson= found in learner-visible text/code');
  if (/TODO|TBD|同上|后面再说|自行理解|无教学意义日志|無意味なログ/.test(text)) fail(config.label + ' placeholder or meaningless learner text found');
  if (/\b(options|correctAnswer|questionBank|wrongQuestion|srs|SRS)\b/.test(JSON.stringify(lesson))) {
    fail(config.label + ' quiz/SRS structure or token found');
  }
}

function verifyExpectedOutput(config, example) {
  var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-gs3-gs4-java-'));
  var sourcePath = path.join(tempDir, example.className + '.java');
  try {
    fs.writeFileSync(sourcePath, example.code, 'utf8');
    cp.execFileSync('javac', [sourcePath], {
      cwd: tempDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    });
    var actual = cp.execFileSync('java', ['-cp', tempDir, example.className], {
      cwd: tempDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    });
    var normalizedActual = actual.replace(/\r\n/g, '\n').trim();
    var normalizedExpected = String(example.expectedOutput || '').replace(/\r\n/g, '\n').trim();
    if (normalizedActual !== normalizedExpected) {
      fail(config.label + ' expectedOutput mismatch: actual="' + normalizedActual + '" expected="' + normalizedExpected + '"');
    }
  } catch (e) {
    fail(config.label + ' Java example compile/run failed: ' + (e.stderr || e.message || e));
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

function checkCodeCommon(config, lesson) {
  var example = (lesson.codeExamples || [])[0];
  if (!example) {
    fail(config.label + ' missing code example');
    return null;
  }
  if (!example.runnable) fail(config.label + ' code example not marked runnable');
  requireText(config.label + ' code example className', example.className, 4);
  requireText(config.label + ' code example code', example.code, 120);
  requireText(config.label + ' expectedOutput', example.expectedOutput, 10);
  requireText(config.label + ' jaExplanation', example.jaExplanation, 36);
  requireText(config.label + ' zhExplanation', example.zhExplanation, 36);
  verifyExpectedOutput(config, example);
  return example;
}

function checkGs3(lesson) {
  var config = GOLDENS[0];
  var text = learnerVisibleText(lesson);
  var blockJa = joinLang(lesson.blocks, 'ja');
  var blockZh = joinLang(lesson.blocks, 'zh');
  var example = checkCodeCommon(config, lesson);
  if (!example) return;
  var code = example.code || '';

  requirePatternCount('GS3 ja why conditions are needed', blockJa, [
    /条件/,
    /必要/,
    /場合/,
    /選/,
    /実行/,
    /評価/,
    /true/,
    /false/,
    /分岐/,
  ], 7);
  requirePatternCount('GS3 zh why conditions are needed', blockZh, [
    /条件/,
    /需要|为什么/,
    /选择|岔路|判断门/,
    /执行/,
    /路径/,
    /true/,
    /false/,
    /分支/,
  ], 7);
  requirePatternCount('GS3 beginner mental model', text, [
    /分かれ道|信号|ゲート/,
    /条件式を評価/,
    /岔路口|判断门/,
    /程序不是.*猜|不是.*猜答案/,
    /路径/,
    /true.*false|false.*true/,
  ], 5);

  if (!/\bif\s*\(/.test(code)) fail('GS3 code missing real if statement');
  if (!/\belse\b/.test(code)) fail('GS3 code missing real else branch');
  if (!/(>=|<=|==|!=|>|<)/.test(code)) fail('GS3 code missing comparison operator');
  if ((code.match(/\bint\s+\w+\s*=/g) || []).length < 2) fail('GS3 code should show at least two input values');
  requirePatternCount('GS3 expected output shows different branches', example.expectedOutput || '', [
    /morning=.*jacket/,
    /noon=.*jacket/,
    /wear/,
    /no jacket/,
  ], 4);

  requirePatternCount('GS3 true/false flow explanation', text, [
    /true/,
    /false/,
    /実行される/,
    /飛ば/,
    /执行/,
    /跳过/,
    /条件表达式/,
    /条件式/,
  ], 7);

  var mistakes = JSON.stringify(lesson.commonMistakes || []);
  requirePatternCount('GS3 required common mistakes', mistakes, [
    /=.*==|==.*=/,
    /代入|赋值/,
    />=.*>|>.*>=|境界|边界/,
    /中かっこ|波括号|\{|\}/,
    /else/,
  ], 5);

  var handson = (lesson.handson.ja || '') + '\n' + (lesson.handson.zh || '');
  requirePatternCount('GS3 handson branch edits', handson, [
    /2つ|二つ|两个|两处/,
    /値|值/,
    /比較演算子|比较运算符/,
    />=|>|==/,
    /true|false/,
    /分岐|分支/,
  ], 5);
}

function extractMainBody(code) {
  var match = /public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/.exec(code);
  if (!match) return null;
  var start = match.index + match[0].length;
  var depth = 1;
  for (var i = start; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') depth--;
    if (depth === 0) {
      return {
        body: code.slice(start, i),
        before: code.slice(0, match.index),
        after: code.slice(i + 1),
      };
    }
  }
  return null;
}

function checkGs4(lesson) {
  var config = GOLDENS[1];
  var text = learnerVisibleText(lesson);
  var blockJa = joinLang(lesson.blocks, 'ja');
  var blockZh = joinLang(lesson.blocks, 'zh');
  var example = checkCodeCommon(config, lesson);
  if (!example) return;
  var code = example.code || '';
  var main = extractMainBody(code);

  requirePatternCount('GS4 ja why methods are needed', blockJa, [
    /メソッド/,
    /必要/,
    /名前/,
    /手順/,
    /呼び出/,
    /main/,
    /順序/,
    /戻/,
    /static/,
  ], 7);
  requirePatternCount('GS4 zh why methods are needed', blockZh, [
    /方法/,
    /为什么|需要/,
    /名字|命名/,
    /步骤/,
    /调用/,
    /main/,
    /顺序/,
    /返回/,
    /static/,
    /堆在/,
  ], 8);
  requirePatternCount('GS4 beginner mental model', text, [
    /名前の付いた手順|手順カード/,
    /呼び出/,
    /戻る/,
    /有名字的可重复步骤/,
    /步骤卡/,
    /调用/,
    /返回main|回到main/,
  ], 6);

  if (!main) {
    fail('GS4 code missing main method');
    return;
  }
  var outsideMain = main.before + '\n' + main.after;
  var methodMatches = [];
  var methodRegex = /static\s+void\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(\s*\)\s*\{/g;
  var match;
  while ((match = methodRegex.exec(outsideMain)) !== null) {
    if (match[1] !== 'main') methodMatches.push(match[1]);
  }
  if (!methodMatches.length) fail('GS4 code missing main-outside static void method declaration');
  var called = methodMatches.some(function(name) {
    return new RegExp('\\b' + name + '\\s*\\(\\s*\\)\\s*;').test(main.body);
  });
  if (!called) fail('GS4 code does not call the declared method from main');
  if (/\bnew\s+/.test(code)) fail('GS4 code should not introduce new/instances in this lesson');
  requirePatternCount('GS4 output proves call order', example.expectedOutput || '', [
    /main:start/,
    /method:/,
    /main:end/,
  ], 3);

  requirePatternCount('GS4 call order explanation', text, [
    /main.*呼び出/,
    /呼び出.*戻/,
    /順序/,
    /main.*调用/,
    /调用.*返回/,
    /顺序/,
  ], 5);

  var forbiddenFuture = /引数|参数|戻り値|返回值|インスタンスメソッド|实例方法|カプセル化|封装|継承|继承|オーバーロード|重载/;
  if (forbiddenFuture.test(text)) fail('GS4 learner text introduces future concepts too early');

  var mistakes = JSON.stringify(lesson.commonMistakes || []);
  requirePatternCount('GS4 required common mistakes', mistakes, [
    /main.*内|main.*里面|main.*内部/,
    /括弧|かっこ|括号|\(\)/,
    /大文字|小文字|大小写/,
    /static/,
  ], 4);

  var handson = (lesson.handson.ja || '') + '\n' + (lesson.handson.zh || '');
  requirePatternCount('GS4 handson method edits', handson, [
    /メソッド|方法/,
    /main/,
    /呼び出|调用/,
    /出力|输出/,
    /回数|次数/,
    /順序|顺序/,
    /変更|修改/,
  ], 6);
}

function normalizeForSimilarity(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[a-z_][a-z0-9_]*/g, 'x')
    .replace(/[0-9]+/g, '0')
    .replace(/\s+/g, '')
    .replace(/[、。，．.,:：;；'"`“”‘’()\[\]{}<>＜＞「」『』｜|/\\-]/g, '');
}

function bigrams(text) {
  var normalized = normalizeForSimilarity(text);
  var map = Object.create(null);
  for (var i = 0; i < normalized.length - 1; i++) {
    var gram = normalized.slice(i, i + 2);
    map[gram] = (map[gram] || 0) + 1;
  }
  return map;
}

function diceSimilarity(a, b) {
  var left = bigrams(a);
  var right = bigrams(b);
  var leftTotal = 0;
  var rightTotal = 0;
  var overlap = 0;
  Object.keys(left).forEach(function(key) {
    leftTotal += left[key];
    if (right[key]) overlap += Math.min(left[key], right[key]);
  });
  Object.keys(right).forEach(function(key) {
    rightTotal += right[key];
  });
  if (!leftTotal || !rightTotal) return 0;
  return (2 * overlap) / (leftTotal + rightTotal);
}

function lessonPart(lesson, part) {
  if (part === 'blocks') return joinLang(lesson.blocks, 'ja') + '\n' + joinLang(lesson.blocks, 'zh');
  if (part === 'mistakes') return JSON.stringify(lesson.commonMistakes || []);
  if (part === 'handson') return (lesson.handson && (lesson.handson.ja + '\n' + lesson.handson.zh)) || '';
  if (part === 'code') return JSON.stringify((lesson.codeExamples || []).map(function(example) {
    return { code: example.code, expectedOutput: example.expectedOutput };
  }));
  return '';
}

function checkCrossGoldenSimilarity(gs3, gs4) {
  var baselines = [
    { label: 'GS1', lesson: loadBaseline('java-ch01.js', 'intro-ch01-lesson-001') },
    { label: 'GS2', lesson: loadBaseline('java-ch02.js', 'intro-ch02-lesson-004') },
    { label: 'GS3', lesson: gs3 },
    { label: 'GS4', lesson: gs4 },
  ].filter(function(item) { return item.lesson; });

  [
    { part: 'blocks', threshold: 0.74 },
    { part: 'mistakes', threshold: 0.72 },
    { part: 'handson', threshold: 0.64 },
    { part: 'code', threshold: 0.82 },
  ].forEach(function(rule) {
    for (var i = 0; i < baselines.length; i++) {
      for (var j = i + 1; j < baselines.length; j++) {
        var a = baselines[i];
        var b = baselines[j];
        if ((a.label === 'GS1' || a.label === 'GS2') && (b.label === 'GS1' || b.label === 'GS2')) continue;
        var similarity = diceSimilarity(lessonPart(a.lesson, rule.part), lessonPart(b.lesson, rule.part));
        if (similarity >= rule.threshold) {
          fail(a.label + '/' + b.label + ' ' + rule.part + ' appears pseudo-duplicated (similarity ' + similarity.toFixed(2) + ')');
        }
      }
    }
  });
}

function main() {
  console.log('[GS3-GS4] Checking golden lessons...');
  var gs3 = loadGolden(GOLDENS[0]);
  var gs4 = loadGolden(GOLDENS[1]);

  checkIdentity(GOLDENS[0], gs3);
  if (gs3) {
    checkCommonPedagogy(GOLDENS[0], gs3);
    checkGs3(gs3);
  }

  checkIdentity(GOLDENS[1], gs4);
  if (gs4) {
    checkCommonPedagogy(GOLDENS[1], gs4);
    checkGs4(gs4);
  }

  if (gs3 && gs4) checkCrossGoldenSimilarity(gs3, gs4);

  if (errors.length) {
    console.log('Errors (' + errors.length + '):');
    errors.forEach(function(error) { console.log('  X ' + error); });
    console.log('[GS3-GS4] FAIL');
    process.exit(1);
  }
  console.log('[GS3-GS4] PASS');
}

main();
