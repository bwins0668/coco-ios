#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const crypto = require('crypto');
const { normalizeLessonHash } = require('./check_python_lesson_normalizer');

const ROOT = path.resolve(__dirname, '..');

const DOMAIN = [
  {
    sourceUnitId: 'py-src-0009-7d37969c-第-3-章-列表简介',
    courseLessonId: 'python-0009-7d37969c-第-3-章-列表简介',
    sourceOrder: 9,
    tocPath: 'Python编程：从入门到实践（第2版） > 第 3 章 列表简介',
    title: '第 3 章 列表简介',
    parent: 'Python编程：从入门到实践（第2版）',
    type: 'chapter'
  },
  {
    sourceUnitId: 'py-src-0010-921b265b-第-4-章-操作列表',
    courseLessonId: 'python-0010-921b265b-第-4-章-操作列表',
    sourceOrder: 10,
    tocPath: 'Python编程：从入门到实践（第2版） > 第 4 章 操作列表',
    title: '第 4 章 操作列表',
    parent: 'Python编程：从入门到实践（第2版）',
    type: 'chapter'
  },
  {
    sourceUnitId: 'py-src-0011-5c80c609-第-5-章-if语句',
    courseLessonId: 'python-0011-5c80c609-第-5-章-if语句',
    sourceOrder: 11,
    tocPath: 'Python编程：从入门到实践（第2版） > 第 5 章 if语句',
    title: '第 5 章 if语句',
    parent: 'Python编程：从入门到实践（第2版）',
    type: 'chapter'
  }
];

const EXPECTED = {
  gs1Hash: '206398403C3001A15CD8494F8BCB4836DC1D8E5E6B710A8A982BA7D99E52785F',
  gs2Hash: 'D870AD49677614F2E5504A43979AA0F306111A48C4CC9482461B2F133EEF6DC1',
  pythonHomeWxssHash: 'B7F8528998E66120E4DC19E119483727978FC9B0D38D638D948DEED80182D7B8',
  pythonLessonWxssHash: 'A1E503A70D74A2F0817CDA347AAE1A9D8308145A5BE200B0AEC772757C716586',
  sourceUnitsStableHash: 'B9AABA9126A5AEABEF473B2F6B0B0F4EB5798F6CB4E3BF57FB929ECC7305D97A',
  coverageHash: '7492487749078466FB9EE4141F65DE8356D20E7F0220BD676C70A9BC4F57D930',
  hostHomeWxmlHash: '8B2D51008834BFBA8E9165ED0986169510E442D80E12EB3E36EE45EB80858261',
  // Refreshed 2026-07-05 (T0) to the P-A0-audited registry state (67b17c6): the only
  // authorized diff vs the prior snapshot is pythonVisibleLessonIds 5->9 synced to
  // releaseVisibility. Guard retained — any further registry change re-FAILs here.
  courseRegistryHash: 'D5FDC511ACD17BD99E965A1F71B02F311092216A67FA2A0A208B886930D8BDDF',
  navigationHash: 'C0C2B80B1A1F611F0CBC33541BCEC12C6B5FDFBCF84692286ED8DB118A6BB306',
  appJsonHash: 'DBA99CBFC78136EDF69DA8C91391EAC5CCA56279B57697CF25E6019980B6D3CE',
  secondaryNavHash: '5957801570A494BDB37D723BA9DD1AEF7C6B067EB363AFA85E26E529821FB415',
  javaManifestHash: '8EF9A1B49C22E0EAE7B8DA7924930E1D3AB93B19973AAB8C8129B7A521704F59'
};

const TOP_LEVEL_LESSON_FIELDS = {
  lessonId: true,
  chapterId: true,
  order: true,
  title: true,
  objectives: true,
  prerequisites: true,
  blocks: true,
  terms: true,
  codeExamples: true,
  commonMistakes: true,
  handson: true,
  summary: true,
  nextLessonBridge: true
};

const EXAMPLE_FIELDS = {
  exampleId: true,
  code: true,
  expectedOutput: true,
  lineNotes: true
};

function parseArgs(argv) {
  const args = { root: ROOT };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      args.root = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing module: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function shaFile(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing protected file: ' + rel);
    return '';
  }
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function checkAppJsonPythonRoutes(root, errors) {
  const file = path.join(root, 'app.json');
  let app = {};
  try {
    app = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    errors.push('app.json invalid after Python shard routing update: ' + err.message);
    return;
  }
  const packages = app.subpackages || [];
  const legacy = packages.find((pkg) => pkg.root === 'packages/python-course');
  const shard = packages.find((pkg) => pkg.root === 'packages/python-course-foundations-b');
  if (!legacy) errors.push('app.json missing legacy packages/python-course subpackage');
  else {
    ['pages/home/home', 'pages/chapter/chapter', 'pages/lesson/lesson'].forEach((page) => {
      if (!(legacy.pages || []).includes(page)) errors.push('legacy Python subpackage lost page: ' + page);
    });
  }
  if (!shard) errors.push('app.json missing packages/python-course-foundations-b shard');
  else {
    ['pages/chapter/chapter', 'pages/lesson/lesson'].forEach((page) => {
      if (!(shard.pages || []).includes(page)) errors.push('Python foundations shard missing page: ' + page);
    });
  }
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function flattenVisible(value, out) {
  if (value == null) return;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    out.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => flattenVisible(item, out));
    return;
  }
  if (typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      if (['lessonId', 'chapterId', 'order', 'exampleId', 'line', 'runnable'].includes(key)) return;
      flattenVisible(value[key], out);
    });
  }
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[、。，,.!！?？:：;；'"“”「」『』（）()【】\[\]\-_/]/g, '');
}

function codeSignature(code) {
  return String(code || '')
    .replace(/#.*$/gm, '')
    .replace(/["'][^"']*["']/g, 'STR')
    .replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (word) => {
      if (['print', 'len', 'range', 'append', 'pop', 'sort', 'if', 'else', 'True', 'False'].includes(word)) return word;
      return 'ID';
    })
    .replace(/\s+/g, '');
}

function blockText(lesson, type) {
  const block = (lesson.blocks || []).find((item) => item.type === type);
  return block ? String(block.ja || '') + String(block.zh || '') : '';
}

function runPython(code, expectedOutput) {
  const runtime = findPython311();
  if (!runtime) return { ok: false, detail: 'CPython 3.11 runtime not found' };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'py-domain1a-'));
  const file = path.join(tmp, 'sample.py');
  try {
    fs.writeFileSync(file, code, 'utf8');
    const compileExpr = spawnPython(runtime, ['-c', 'compile(open(r"' + file.replace(/\\/g, '\\\\') + '", encoding="utf8").read(), r"' + file.replace(/\\/g, '\\\\') + '", "exec")']);
    if (compileExpr.status !== 0) return { ok: false, detail: 'compile() failed: ' + (compileExpr.stderr || compileExpr.stdout || '').trim() };
    const pyCompile = spawnPython(runtime, ['-m', 'py_compile', file]);
    if (pyCompile.status !== 0) return { ok: false, detail: 'py_compile failed: ' + (pyCompile.stderr || pyCompile.stdout || '').trim() };
    const run = spawnPython(runtime, [file]);
    if (run.status !== 0) return { ok: false, detail: 'python run failed: ' + (run.stderr || run.stdout || '').trim() };
    const stdout = (run.stdout || '').replace(/\r\n/g, '\n').replace(/\n$/, '');
    if (stdout !== expectedOutput) return { ok: false, detail: 'stdout mismatch expected [' + expectedOutput + '] got [' + stdout + ']' };
    return { ok: true, detail: stdout };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function spawnPython(runtime, args) {
  return cp.spawnSync(runtime.command, runtime.args.concat(args), { encoding: 'utf8', windowsHide: true });
}

function findPython311() {
  const candidates = [
    { command: 'python3.11', args: [] },
    { command: 'py', args: ['-3.11'] },
    { command: 'python', args: [] }
  ];
  for (const candidate of candidates) {
    const version = cp.spawnSync(candidate.command, candidate.args.concat(['--version']), { encoding: 'utf8', windowsHide: true });
    const output = ((version.stdout || '') + (version.stderr || '')).trim();
    if (version.status === 0 && /^Python 3\.11\./.test(output)) return candidate;
  }
  return null;
}

function checkPythonVersion(errors) {
  const runtime = findPython311();
  if (!runtime) errors.push('Domain1A checker requires CPython 3.11.x; tried python3.11, py -3.11, and python');
}

function checkBannedLessonContent(lesson, label, errors) {
  const visible = [];
  flattenVisible(lesson, visible);
  const text = visible.join('\n');
  [
    /sourceUnitId/i,
    /sourceRef/i,
    /courseLessonId/i,
    /tocPath/i,
    /EPUB/i,
    /z-library|1lib|z-lib/i,
    /spineHref/i,
    /page\s*\d+|第\s*\d+\s*页|ページ/i
  ].forEach((pattern) => {
    if (pattern.test(text)) errors.push(label + ' exposes source metadata or page noise: ' + pattern);
  });
}

function checkLessonShape(lesson, spec, errors) {
  if (!lesson) {
    errors.push('missing Domain1A lesson: ' + spec.courseLessonId);
    return;
  }
  Object.keys(lesson).forEach((key) => {
    if (!TOP_LEVEL_LESSON_FIELDS[key]) errors.push(spec.courseLessonId + ' contains renderer-unconsumed field: ' + key);
  });
  if (lesson.lessonId !== spec.courseLessonId) errors.push(spec.courseLessonId + ' lessonId mismatch');
  if (lesson.chapterId !== 'python-gs-ch01') errors.push(spec.courseLessonId + ' chapterId must stay python-gs-ch01');
  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) errors.push(spec.courseLessonId + ' missing bilingual title');
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 2) errors.push(spec.courseLessonId + ' needs at least two objectives');
  if (!Array.isArray(lesson.prerequisites) || !lesson.prerequisites.length || !lesson.prerequisites[0].ja || !lesson.prerequisites[0].zh) {
    errors.push(spec.courseLessonId + ' missing bilingual prerequisites');
  }
  const why = (lesson.blocks || []).find((block) => block.type === 'why');
  const mental = (lesson.blocks || []).find((block) => block.type === 'mental-model');
  if (!why || !why.ja || !why.zh) errors.push(spec.courseLessonId + ' missing bilingual why block');
  if (!mental || !mental.ja || !mental.zh) errors.push(spec.courseLessonId + ' missing bilingual mental model block');
  if (!Array.isArray(lesson.terms) || lesson.terms.length < 3) errors.push(spec.courseLessonId + ' needs at least three terms');
  (lesson.terms || []).forEach((term, index) => {
    if (!term.ja || !term.zh || !term.en || !term.explanationJa || !term.explanationZh) {
      errors.push(spec.courseLessonId + ' term #' + index + ' missing ja/zh/en/explanations');
    }
  });
  const example = lesson.codeExamples && lesson.codeExamples[0];
  if (!example) errors.push(spec.courseLessonId + ' missing code example');
  if (example) {
    Object.keys(example).forEach((key) => {
      if (!EXAMPLE_FIELDS[key]) errors.push(spec.courseLessonId + ' code example contains renderer-unconsumed field: ' + key);
    });
    if (!example.code || !example.expectedOutput) errors.push(spec.courseLessonId + ' missing code or expectedOutput');
    if (!Array.isArray(example.lineNotes) || example.lineNotes.length < 4) errors.push(spec.courseLessonId + ' needs at least four lineNotes');
    (example.lineNotes || []).forEach((note, index) => {
      if (!note.ja || !note.zh) errors.push(spec.courseLessonId + ' lineNote #' + index + ' missing bilingual text');
    });
    const unsafe = /\binput\s*\(|\bopen\s*\(|https?:\/\/|requests\b|subprocess\b|socket\b|os\.system\b|\bpip\b|\bsleep\s*\(|random\b|datetime\b|time\b|__import__|eval\s*\(|exec\s*\(/;
    if (unsafe.test(example.code)) errors.push(spec.courseLessonId + ' unsafe Python code token');
    const run = runPython(example.code, example.expectedOutput);
    if (!run.ok) errors.push(spec.courseLessonId + ' Python execution failed: ' + run.detail);
  }
  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 3) errors.push(spec.courseLessonId + ' needs at least three commonMistakes');
  (lesson.commonMistakes || []).forEach((mistake, index) => {
    if (!mistake.ja || !mistake.zh) errors.push(spec.courseLessonId + ' commonMistake #' + index + ' missing bilingual text');
  });
  if (!lesson.handson || !lesson.handson.ja || !lesson.handson.zh || !lesson.handson.action || !lesson.handson.expectedObservation) {
    errors.push(spec.courseLessonId + ' missing handson action or expected observation');
  } else if (!lesson.handson.action.ja || !lesson.handson.action.zh || !lesson.handson.expectedObservation.ja || !lesson.handson.expectedObservation.zh) {
    errors.push(spec.courseLessonId + ' handson action/observation must be bilingual');
  }
  if (!lesson.summary || !lesson.summary.ja || !lesson.summary.zh) errors.push(spec.courseLessonId + ' missing bilingual summary');
  if (!lesson.nextLessonBridge || !lesson.nextLessonBridge.ja || !lesson.nextLessonBridge.zh) errors.push(spec.courseLessonId + ' missing bilingual nextLessonBridge');
  checkBannedLessonContent(lesson, spec.courseLessonId, errors);
}

function checkTemplateUniqueness(domainLessons, errors) {
  const whyTexts = new Map();
  const mentalTexts = new Map();
  const handsonTexts = new Map();
  const bridgeTexts = new Map();
  const codeSigs = new Map();
  for (const lesson of domainLessons) {
    if (!lesson) continue;
    const id = lesson.lessonId;
    const why = normalizeText(blockText(lesson, 'why'));
    const mental = normalizeText(blockText(lesson, 'mental-model'));
    const handson = normalizeText(JSON.stringify(lesson.handson || {}));
    const bridge = normalizeText(JSON.stringify(lesson.nextLessonBridge || {}));
    const code = codeSignature(lesson.codeExamples && lesson.codeExamples[0] && lesson.codeExamples[0].code);
    for (const [label, value, map] of [
      ['why', why, whyTexts],
      ['mental model', mental, mentalTexts],
      ['handson', handson, handsonTexts],
      ['bridge', bridge, bridgeTexts],
      ['code behavior', code, codeSigs]
    ]) {
      if (!value) continue;
      if (map.has(value)) errors.push('Domain1A ' + label + ' is template-identical between ' + map.get(value) + ' and ' + id);
      map.set(value, id);
    }
  }
}

function checkSourceMapping(sourceManifest, manifest, errors) {
  const units = new Map((sourceManifest.sourceUnits || []).map((unit) => [unit.sourceUnitId, unit]));
  const lessons = new Map((sourceManifest.courseLessons || []).map((lesson) => [lesson.courseLessonId, lesson]));
  const visibleIds = sourceManifest.releaseVisibility && sourceManifest.releaseVisibility.visibleCourseLessonIds || [];
  const manifestIds = [];
  (manifest.chapters || []).forEach((chapter) => (chapter.sections || []).forEach((section) => manifestIds.push(section.lessonId)));

  if (DOMAIN.length < 3 || DOMAIN.length > 5) errors.push('Domain1A selected lesson count must be 3-5');
  for (let i = 1; i < DOMAIN.length; i += 1) {
    if (DOMAIN[i].sourceOrder !== DOMAIN[i - 1].sourceOrder + 1) errors.push('Domain1A sourceOrder is not continuous');
  }
  if (DOMAIN[0].sourceOrder !== 9) errors.push('Domain1A must start immediately after GS2 sourceOrder 8');

  for (const spec of DOMAIN) {
    const unit = units.get(spec.sourceUnitId);
    const mapped = lessons.get(spec.courseLessonId);
    if (!unit) errors.push('Domain1A sourceUnit missing: ' + spec.sourceUnitId);
    if (!mapped) errors.push('Domain1A courseLesson missing in source manifest: ' + spec.courseLessonId);
    if (unit) {
      const toc = (unit.tocPath || []).join(' > ');
      if (toc !== spec.tocPath) errors.push(spec.courseLessonId + ' tocPath drifted');
      if (unit.displayTitle !== spec.title) errors.push(spec.courseLessonId + ' original title drifted');
      if (unit.sourceOrder !== spec.sourceOrder) errors.push(spec.courseLessonId + ' sourceOrder drifted');
      if (unit.type !== spec.type) errors.push(spec.courseLessonId + ' source type drifted');
    }
    if (mapped) {
      if (mapped.sourceUnitId !== spec.sourceUnitId) errors.push(spec.courseLessonId + ' sourceUnitId mapping drifted');
      if (mapped.sourceOrder !== spec.sourceOrder) errors.push(spec.courseLessonId + ' mapped sourceOrder drifted');
      if ((mapped.originalTocPath || '') !== spec.tocPath) errors.push(spec.courseLessonId + ' mapped originalTocPath drifted');
      if (mapped.status !== 'published') errors.push(spec.courseLessonId + ' must be status=published');
      if (mapped.visibility !== 'visible') errors.push(spec.courseLessonId + ' must be visibility=visible');
    }
    if (!visibleIds.includes(spec.courseLessonId)) errors.push(spec.courseLessonId + ' missing from releaseVisibility.visibleCourseLessonIds');
    if (!manifestIds.includes(spec.courseLessonId)) errors.push(spec.courseLessonId + ' missing from Python Home/Chapter manifest sections');
  }

  visibleIds.forEach((id) => {
    if (!manifestIds.includes(id)) errors.push('visible Python lesson missing from Home/Chapter sections: ' + id);
  });
  manifestIds.forEach((id) => {
    if (!visibleIds.includes(id)) errors.push('Python Home/Chapter section missing from releaseVisibility: ' + id);
  });

  if (!sourceManifest.coverage || sourceManifest.coverage.deepestSourceUnitCount !== 790) errors.push('sourceUnits count must remain 790');
  if (!sourceManifest.coverage || sourceManifest.coverage.lessonCandidateCount !== 699) errors.push('lesson_candidate count must remain 699');
  if (!sourceManifest.coverage || sourceManifest.coverage.explicitExclusionCount !== 74) errors.push('explicit exclusions must remain 74');
  if (digest(sourceManifest.coverage || {}) !== EXPECTED.coverageHash) errors.push('source coverage hash drifted');
  const stableSourceUnits = (sourceManifest.sourceUnits || []).map((u) => ({
    sourceUnitId: u.sourceUnitId,
    sourceOrder: u.sourceOrder,
    tocPath: u.tocPath,
    title: u.title,
    displayTitle: u.displayTitle,
    depth: u.depth,
    parentSourceUnitId: u.parentSourceUnitId,
    type: u.type
  }));
  if (digest(stableSourceUnits) !== EXPECTED.sourceUnitsStableHash) errors.push('sourceUnits stable IDs/order/tocPath drifted');
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  checkPythonVersion(errors);
  if (shaFile(root, 'packages/python-course/pages/home/home.wxss', errors) !== EXPECTED.pythonHomeWxssHash) errors.push('accepted Python Home khaki wxss changed');
  if (shaFile(root, 'packages/python-course/pages/lesson/lesson.wxss', errors) !== EXPECTED.pythonLessonWxssHash) errors.push('accepted Python Lesson khaki wxss changed');
  if (shaFile(root, 'pages/home/home.wxml', errors) !== EXPECTED.hostHomeWxmlHash) errors.push('stage A home entry file changed during Domain1A');
  if (shaFile(root, 'utils/course-registry.js', errors) !== EXPECTED.courseRegistryHash) errors.push('course registry changed during Domain1A');
  if (shaFile(root, 'utils/navigation.js', errors) !== EXPECTED.navigationHash) errors.push('navigation changed during Domain1A');
  checkAppJsonPythonRoutes(root, errors);
  if (shaFile(root, 'utils/secondary-navigation.js', errors) !== EXPECTED.secondaryNavHash) errors.push('secondary navigation changed during Domain1A');
  if (shaFile(root, 'packages/java-course/data/java-course-manifest.js', errors) !== EXPECTED.javaManifestHash) errors.push('Java course manifest changed during Domain1A');

  const chapterModule = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  const manifestModule = requireFresh(root, 'packages/python-course/data/python-course-manifest.js', errors);
  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  if (!chapterModule || !manifestModule || !sourceModule) {
    console.error('[Python Domain1A contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    process.exit(1);
  }

  const lessons = chapterModule.lessons || [];
  const byId = new Map(lessons.map((lesson) => [lesson.lessonId, lesson]));
  const gs1 = byId.get('python-0007-gs1-run-visible-output');
  const gs2 = byId.get('python-0008-gs2-values-and-variables');
  if (normalizeLessonHash(gs1 || {}) !== EXPECTED.gs1Hash) errors.push('GS1 learner-visible lesson hash changed');
  if (normalizeLessonHash(gs2 || {}) !== EXPECTED.gs2Hash) errors.push('GS2 learner-visible lesson hash changed');

  const domainLessons = DOMAIN.map((spec) => byId.get(spec.courseLessonId));
  DOMAIN.forEach((spec, index) => {
    const lesson = byId.get(spec.courseLessonId);
    if (lesson && lesson.order !== index + 3) errors.push(spec.courseLessonId + ' order must continue after GS2');
    checkLessonShape(lesson, spec, errors);
  });
  checkTemplateUniqueness(domainLessons, errors);
  checkSourceMapping(sourceModule.pythonSourceManifest, manifestModule.manifest, errors);

  const rawLesson = read(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (/knowledgePoints/.test(rawLesson)) errors.push('knowledgePoints must not exist');
  if (/\b(options|correctAnswer|questionBank|wrongQuestion|SRS|Quiz)\b/.test(rawLesson)) errors.push('quiz/SRS/wrong-question fields must not exist in Domain1A lesson data');

  if (warnings.length) errors.push('warnings are not allowed: ' + warnings.join('; '));
  if (errors.length) {
    console.error('[Python Domain1A contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    process.exit(1);
  }
  console.log('[Python Domain1A contract] PASS: 0 errors, 0 warnings');
  DOMAIN.forEach((spec) => {
    const lesson = byId.get(spec.courseLessonId);
    const example = lesson && lesson.codeExamples && lesson.codeExamples[0];
    if (example) console.log(spec.courseLessonId + ' stdout: ' + example.expectedOutput.replace(/\n/g, ' / '));
  });
}

main();
