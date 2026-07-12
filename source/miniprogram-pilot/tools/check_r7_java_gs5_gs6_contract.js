/**
 * check_r7_java_gs5_gs6_contract.js
 * R7.GS5-GS6-CLEAN - classes/instances and constructors golden checker.
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
    label: 'GS5',
    chapterFile: 'java-ch05.js',
    lessonId: 'intro-ch05-lesson-003',
    chapterId: 'java-ch05',
    sourceSection: 'クラスとインスタンス',
    nextLessonId: 'intro-ch05-lesson-004',
    titlePatterns: [/クラスとインスタンス/, /类与实例|类と实例/],
  },
  {
    label: 'GS6',
    chapterFile: 'java-ch06.js',
    lessonId: 'intro-ch06-lesson-001',
    chapterId: 'java-ch06',
    sourceSection: 'コンストラクタ',
    nextLessonId: 'intro-ch06-lesson-002',
    titlePatterns: [/コンストラクタ/, /构造方法/],
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

function structuralJson(lesson) {
  return JSON.stringify(lesson || {});
}

function hasForbiddenStructuralKey(lesson) {
  var found = false;
  function visit(value) {
    if (!value || found) return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== 'object') return;
    Object.keys(value).forEach(function(key) {
      if (/^(options|correctAnswer|questionBank|wrongQuestion)$/i.test(key)) found = true;
      if (/^srs$/i.test(key)) found = true;
      visit(value[key]);
    });
  }
  visit(lesson);
  return found;
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
    fail(label + ' insufficient evidence (got ' + count + ', need ' + minCount + ')');
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

  requireText(config.label + ' ja blocks body', blockJa, 360);
  requireText(config.label + ' zh blocks body', blockZh, 360);

  if (!lesson.blocks || lesson.blocks.length < 5) fail(config.label + ' blocks < 5');

  requirePatternCount(config.label + ' why-needed explanation', text, [
    /なぜ|必要|使う|困る|まとめたい|初期/,
    /为什么|需要|什么时候用|如果没有|用来|初始/,
    /class|クラス|类/,
    /new|作る|生成|创建/,
    /出力|表示|输出|观察/,
  ], 5);

  requirePatternCount(config.label + ' input-process-output', text, [
    /入力|初期データ|引数|値/,
    /処理|代入|初期化|作成/,
    /出力|表示/,
    /输入|初始数据|参数|值/,
    /处理|赋值|初始化|创建/,
    /输出|观察/,
  ], 5);

  requirePatternCount(config.label + ' beginner mental model', text, [
    /モデル|イメージ|例え|設計図|カード|実物/,
    /心智模型|想成|比作|设计图|卡片|实际/,
    /順序|流れ|実行時/,
    /顺序|流程|运行时/,
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
    requireText(config.label + ' commonMistakes[' + index + '].ja', mistake.ja, 48);
    requireText(config.label + ' commonMistakes[' + index + '].zh', mistake.zh, 48);
    requirePatternCount(config.label + ' commonMistakes[' + index + '] concrete failure', (mistake.ja || '') + '\n' + (mistake.zh || ''), [
      /誤り|間違|エラー|原因|結果|実行|表示|変わる|変わらない/,
      /错误|原因|结果|执行|输出|会|变化|不变|编译/,
      /修正|直す|改成|恢复|修复/,
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
    /変更|書き換え|実行|確認|作成|観察/,
    /修改|改成|运行|确认|创建|观察/,
    /出力|表示/,
    /输出|结果/,
  ], 4);
  requirePatternCount(config.label + ' handson expected observation', text, [
    /予想|期待|観察|理由|なぜ|変わる|変わらない|違い/,
    /预期|观察|原因|为什么|变化|不变|不同|差异/,
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
  var json = structuralJson(lesson);
  if (/教材\s*(第\s*)?\d+\s*(ページ|页)|教材\d+ページ/.test(text)) fail(config.label + ' learner-visible textbook page ref found');
  if (/\b(sourceRef|lessonId|chapterId|semanticFidelity|profile|pedagogicalDelta)\b/.test(text)) fail(config.label + ' learner-visible internal metadata name found');
  if (text.indexOf(config.lessonId) !== -1) fail(config.label + ' lessonId found in learner-visible text');
  if (/profile=|lesson=/.test(text)) fail(config.label + ' profile= or lesson= found in learner-visible text/code');
  if (/TODO|TBD|同上|后面再说|自行理解|无教学意义日志|無意味なログ/.test(text)) fail(config.label + ' placeholder or meaningless learner text found');
  if (hasForbiddenStructuralKey(lesson)) fail(config.label + ' quiz/SRS structure key found');
  if (/\b(options|correctAnswer|questionBank|wrongQuestion)\b/.test(json) && hasForbiddenStructuralKey(lesson)) {
    fail(config.label + ' quiz structure found');
  }
}

function verifyExpectedOutput(config, example) {
  var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-gs5-gs6-java-'));
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
  requireText(config.label + ' code example code', example.code, 140);
  requireText(config.label + ' expectedOutput', example.expectedOutput, 10);
  requireText(config.label + ' jaExplanation', example.jaExplanation, 42);
  requireText(config.label + ' zhExplanation', example.zhExplanation, 42);
  verifyExpectedOutput(config, example);
  return example;
}

function countRegex(text, regex) {
  var match = String(text || '').match(regex);
  return match ? match.length : 0;
}

function extractNewArgs(code, className) {
  var re = new RegExp('\\bnew\\s+' + className + '\\s*\\(([^)]*)\\)', 'g');
  var out = [];
  var match;
  while ((match = re.exec(code)) !== null) out.push(match[1].trim());
  return out;
}

function uniqueCount(values) {
  var map = Object.create(null);
  values.forEach(function(value) { map[value] = true; });
  return Object.keys(map).length;
}

function checkGs5(lesson) {
  var config = GOLDENS[0];
  var text = learnerVisibleText(lesson);
  var blockJa = joinLang(lesson.blocks, 'ja');
  var blockZh = joinLang(lesson.blocks, 'zh');
  var example = checkCodeCommon(config, lesson);
  if (!example) return;
  var code = example.code || '';
  var expected = example.expectedOutput || '';

  requirePatternCount('GS5 ja class/instance concept', blockJa, [
    /クラス.*設計図|設計図.*クラス/,
    /インスタンス.*実際|実行時.*作ら/,
    /同じクラス.*複数|複数.*インスタンス/,
    /new.*作|new.*生成/,
    /参照|reference/,
    /フィールド|属性/,
    /まとめたい|データをまとめる/,
  ], 6);
  requirePatternCount('GS5 zh class/instance concept', blockZh, [
    /类.*设计图|设计图.*类/,
    /实例.*具体对象|实例.*实际对象|运行时.*创建/,
    /同一个\s*class|同一个类|多个实例/,
    /new.*创建|new.*生成/,
    /引用|reference/,
    /字段|属性/,
    /把.*数据.*放在一起|想把.*まとめ/,
  ], 6);
  requirePatternCount('GS5 new/reference/different-state explanation', text, [
    /new/,
    /参照|引用|reference/,
    /別々|違う|不同|各自/,
    /同じクラス|同一个 class|同一个类/,
    /状態|データ|字段|フィールド/,
    /変えても|変更しても|修改.*另一个|もう一方/,
  ], 6);

  if (!/\bclass\s+StudentCard\b/.test(code)) fail('GS5 code missing real StudentCard class');
  if (/\bStudentCard\s*\([^)]*\)\s*\{/.test(code)) fail('GS5 code should not make constructor the main concept');
  if (countRegex(code, /\bnew\s+StudentCard\s*\(\s*\)/g) < 2) fail('GS5 code should create at least two StudentCard instances with new StudentCard()');
  if (countRegex(code, /\bStudentCard\s+\w+\s*=\s*new\s+StudentCard\s*\(\s*\)/g) < 2) fail('GS5 code should store at least two new objects in variables');
  if (!/\bString\s+\w+\s*;/.test(code) || !/\b\w+\.\w+\s*=/.test(code)) fail('GS5 code should show fields assigned on instances');
  if (!/==|!=/.test(code) || !/false/.test(expected)) fail('GS5 output should prove two variables are not the same object');
  requirePatternCount('GS5 output proves different instance data', expected, [
    /Coco|Mei|Aki|Ren|Java|SQL/,
    /course|コース|课程|points|minutes/,
    /false/,
  ], 3);

  var mistakes = JSON.stringify(lesson.commonMistakes || []);
  requirePatternCount('GS5 required common mistakes', mistakes, [
    /new/,
    /クラス.*インスタンス|class.*object|类.*对象|类.*实例/,
    /同じ.*参照|同一.*对象|指向同一|同じ.*インスタンス/,
    /null/,
    /フィールド|字段|属性/,
    /変数名|变量名/,
  ], 4);

  var handson = (lesson.handson && (lesson.handson.ja + '\n' + lesson.handson.zh)) || '';
  requirePatternCount('GS5 handson two-instance observation', handson, [
    /2つ|二つ|两个|两张/,
    /インスタンス|实例|object/,
    /違う|不同|別々/,
    /変更|修改/,
    /もう一方|另一个|另一张/,
    /変わらない|不变|跟着变/,
    /予想|预期|観察|观察|理由|原因/,
  ], 6);
}

function checkGs6(lesson) {
  var config = GOLDENS[1];
  var text = learnerVisibleText(lesson);
  var blockJa = joinLang(lesson.blocks, 'ja');
  var blockZh = joinLang(lesson.blocks, 'zh');
  var example = checkCodeCommon(config, lesson);
  if (!example) return;
  var code = example.code || '';
  var expected = example.expectedOutput || '';

  requirePatternCount('GS6 ja constructor concept', blockJa, [
    /コンストラクタ/,
    /new.*自動|new.*実行/,
    /初期データ|初期値|初期状態/,
    /普通のメソッド|メソッド.*違/,
    /戻り値|戻り値を書かない/,
    /クラス名.*同じ/,
    /引数.*フィールド/,
  ], 6);
  requirePatternCount('GS6 zh constructor concept', blockZh, [
    /构造方法/,
    /new.*自动|new.*执行/,
    /初始数据|初始值|初始状态/,
    /普通方法.*不同|不是普通方法/,
    /返回类型|没有返回类型/,
    /类名.*一致|名字.*类名/,
    /参数.*字段/,
  ], 6);
  requirePatternCount('GS6 new-constructor relationship', text, [
    /new/,
    /コンストラクタ|构造方法/,
    /自動|自动/,
    /引数|参数/,
    /初期化|初始化/,
    /普通のメソッド|普通方法/,
    /戻り値|返回类型/,
  ], 7);

  if (!/\bclass\s+StudentCard\b/.test(code)) fail('GS6 code missing real StudentCard class');
  if (/\bvoid\s+StudentCard\s*\(/.test(code)) fail('GS6 constructor incorrectly has void return type');
  if (/\bStudentCard\s*\(\s*\)\s*\{/.test(code)) fail('GS6 code should not use empty constructor');
  if (!/\bStudentCard\s*\([^)]*(String|int)[^)]*\)\s*\{/.test(code)) fail('GS6 code missing real parameterized StudentCard constructor');
  if (!/this\.\w+\s*=/.test(code)) fail('GS6 constructor should initialize fields from parameters');
  var args = extractNewArgs(code, 'StudentCard');
  if (args.length < 2) fail('GS6 main should create at least two objects with new StudentCard(...)');
  if (uniqueCount(args) < 2) fail('GS6 two constructor calls should use different initial data');
  if (!/new\s+StudentCard\s*\(\s*"[^"]+"\s*,\s*\d+\s*\)/.test(code)) fail('GS6 new calls should pass concrete String/int initial data');
  requirePatternCount('GS6 output proves initialized object state', expected, [
    /Coco|Mei|Aki|Ren/,
    /minutes|分|study|学習|score/,
    /\d+/,
  ], 3);

  var mistakes = JSON.stringify(lesson.commonMistakes || []);
  requirePatternCount('GS6 required common mistakes', mistakes, [
    /void/,
    /名前|名.*一致|大小写|大文字|小文字|大小文字/,
    /引数|参数|型|类型|個数|数量/,
    /初期化|初始化|代入|赋值/,
    /普通.*メソッド|普通方法|手動|手动/,
  ], 4);

  var handson = (lesson.handson && (lesson.handson.ja + '\n' + lesson.handson.zh)) || '';
  requirePatternCount('GS6 handson constructor parameter observation', handson, [
    /引数|参数/,
    /2つ|二つ|两个/,
    /初期データ|初始数据|初期状態|初始状态/,
    /出力|输出/,
    /個数|数量|型|类型/,
    /エラー|错误/,
    /戻す|恢复|修正/,
    /予想|预期|観察|观察|理由|原因/,
  ], 7);
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

function checkCrossGoldenSimilarity(gs5, gs6) {
  var baselines = [
    { label: 'GS1', lesson: loadBaseline('java-ch01.js', 'intro-ch01-lesson-001') },
    { label: 'GS2', lesson: loadBaseline('java-ch02.js', 'intro-ch02-lesson-004') },
    { label: 'GS3', lesson: loadBaseline('java-ch03.js', 'intro-ch03-lesson-001') },
    { label: 'GS4', lesson: loadBaseline('java-ch04.js', 'intro-ch04-lesson-001') },
    { label: 'GS5', lesson: gs5 },
    { label: 'GS6', lesson: gs6 },
  ].filter(function(item) { return item.lesson; });

  [
    { part: 'blocks', threshold: 0.74 },
    { part: 'mistakes', threshold: 0.72 },
    { part: 'handson', threshold: 0.64 },
    { part: 'code', threshold: 0.90 },
  ].forEach(function(rule) {
    for (var i = 0; i < baselines.length; i++) {
      for (var j = i + 1; j < baselines.length; j++) {
        var a = baselines[i];
        var b = baselines[j];
        if ((a.label === 'GS1' || a.label === 'GS2' || a.label === 'GS3' || a.label === 'GS4') &&
            (b.label === 'GS1' || b.label === 'GS2' || b.label === 'GS3' || b.label === 'GS4')) {
          continue;
        }
        var similarity = diceSimilarity(lessonPart(a.lesson, rule.part), lessonPart(b.lesson, rule.part));
        if (similarity >= rule.threshold) {
          fail(a.label + '/' + b.label + ' ' + rule.part + ' appears pseudo-duplicated (similarity ' + similarity.toFixed(2) + ')');
        }
      }
    }
  });
}

function main() {
  console.log('[GS5-GS6] Checking golden lessons...');
  var gs5 = loadGolden(GOLDENS[0]);
  var gs6 = loadGolden(GOLDENS[1]);

  checkIdentity(GOLDENS[0], gs5);
  if (gs5) {
    checkCommonPedagogy(GOLDENS[0], gs5);
    checkGs5(gs5);
  }

  checkIdentity(GOLDENS[1], gs6);
  if (gs6) {
    checkCommonPedagogy(GOLDENS[1], gs6);
    checkGs6(gs6);
  }

  if (gs5 && gs6) checkCrossGoldenSimilarity(gs5, gs6);

  if (errors.length) {
    console.log('Errors (' + errors.length + '):');
    errors.forEach(function(error) { console.log('  X ' + error); });
    console.log('[GS5-GS6] FAIL');
    process.exit(1);
  }
  console.log('[GS5-GS6] PASS');
}

main();
