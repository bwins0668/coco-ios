#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const crypto = require('crypto');
const { normalizeLessonHash } = require('./check_python_lesson_normalizer');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOMAIN1B = [{
  sourceUnitId: 'py-src-0012-5cc0ecc6-第-6-章-字典',
  courseLessonId: 'python-0012-5cc0ecc6-第-6-章-字典',
  sourceOrder: 12,
  tocPath: 'Python编程：从入门到实践（第2版） > 第 6 章 字典',
  parent: 'Python编程：从入门到实践（第2版）',
  type: 'chapter'
}];

const EXPECTED = {
  gs1Hash: '206398403C3001A15CD8494F8BCB4836DC1D8E5E6B710A8A982BA7D99E52785F',
  gs2Hash: 'D870AD49677614F2E5504A43979AA0F306111A48C4CC9482461B2F133EEF6DC1',
  d1a1Hash: '7E78246EF79BAC5F147C59B6B75422AA737C72276FCADD856C4D2388FFFF2380',
  d1a2Hash: '1196EF5BDED1624AE4D0FD3CC908B70C15E7A9FCE8AC064AA69B68668CCDCF41',
  d1a3Hash: '131D2EED6CC14C0A8CCB4035DB1BCDE201D02622CEAE9F15F2E54790187B0127',
  d1b1Hash: 'F629391B108A413EED7E06625EBD536800315022BE2D3082D66F3268E575349F',
  pythonHomeWxssHash: 'B7F8528998E66120E4DC19E119483727978FC9B0D38D638D948DEED80182D7B8'
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
  try {
    delete require.cache[require.resolve(file)];
    return require(file);
  } catch (err) {
    errors.push('cannot require ' + rel + ': ' + err.message);
    return null;
  }
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function shaFile(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing protected file: ' + rel);
    return '';
  }
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function normalizeTocPath(value) {
  return Array.isArray(value) ? value.join(' > ') : String(value || '');
}

function parentRelation(unit) {
  const parts = Array.isArray(unit.tocPath) ? unit.tocPath.slice(0, -1) : [];
  return parts.length ? parts.join(' > ') : 'root';
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
      if (['lessonId', 'chapterId', 'order', 'exampleId', 'line'].includes(key)) return;
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
      if (['print', 'len', 'range', 'append', 'pop', 'sort', 'sorted', 'keys', 'if', 'else', 'True', 'False'].includes(word)) return word;
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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'py-domain1b-'));
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
  if (!runtime) errors.push('Domain1B checker requires CPython 3.11.x; tried python3.11, py -3.11, and python');
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

function checkBannedCode(code, label, errors) {
  [
    /\binput\s*\(/,
    /\bopen\s*\(/,
    /https?:\/\//i,
    /\brequests\b/,
    /\burllib\b/,
    /\bsubprocess\b/,
    /\bsocket\b/,
    /\bos\.system\b/,
    /\bpip\b/,
    /\bsleep\s*\(/,
    /\brandom\b/,
    /\btime\b/,
    /\btkinter\b/
  ].forEach((pattern) => {
    if (pattern.test(code)) errors.push(label + ' Python code contains banned operation: ' + pattern);
  });
}

function checkLessonShape(lesson, spec, previousLessons, errors) {
  if (!lesson) {
    errors.push('missing Domain1B lesson: ' + spec.courseLessonId);
    return;
  }
  Object.keys(lesson).forEach((key) => {
    if (!TOP_LEVEL_LESSON_FIELDS[key]) errors.push(spec.courseLessonId + ' contains renderer-unconsumed field: ' + key);
  });
  if (lesson.lessonId !== spec.courseLessonId) errors.push(spec.courseLessonId + ' lessonId mismatch');
  if (lesson.chapterId !== 'python-gs-ch01') errors.push(spec.courseLessonId + ' chapterId must stay python-gs-ch01');
  if (lesson.order !== 6) errors.push(spec.courseLessonId + ' order must be 6');
  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) errors.push(spec.courseLessonId + ' missing bilingual title');
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 2) errors.push(spec.courseLessonId + ' needs at least two objectives');
  if (!Array.isArray(lesson.prerequisites) || !lesson.prerequisites.some((item) => item.ja && item.zh)) errors.push(spec.courseLessonId + ' needs bilingual prerequisites');
  const why = (lesson.blocks || []).find((item) => item.type === 'why');
  const mental = (lesson.blocks || []).find((item) => item.type === 'mental-model');
  if (!why || !why.ja || !why.zh) errors.push(spec.courseLessonId + ' missing bilingual why');
  if (!mental || !mental.ja || !mental.zh) errors.push(spec.courseLessonId + ' missing bilingual mental model');
  if (!Array.isArray(lesson.terms) || lesson.terms.length < 3) errors.push(spec.courseLessonId + ' needs at least three terms');
  (lesson.terms || []).forEach((term, index) => {
    if (!term.ja || !term.zh || !term.en) errors.push(spec.courseLessonId + ' term missing ja/zh/en at ' + index);
  });
  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 3) errors.push(spec.courseLessonId + ' needs at least three commonMistakes');
  if (!lesson.handson || !lesson.handson.action || !lesson.handson.expectedObservation || !lesson.handson.action.ja || !lesson.handson.action.zh || !lesson.handson.expectedObservation.ja || !lesson.handson.expectedObservation.zh) {
    errors.push(spec.courseLessonId + ' handson needs action and expectedObservation in ja/zh');
  }
  if (!lesson.nextLessonBridge || !lesson.nextLessonBridge.ja || !lesson.nextLessonBridge.zh) errors.push(spec.courseLessonId + ' missing nextLessonBridge');
  if (/knowledgePoints/.test(JSON.stringify(lesson))) errors.push(spec.courseLessonId + ' must not use knowledgePoints');
  if (/options|correctAnswer|questionBank|Quiz|SRS/.test(JSON.stringify(lesson))) errors.push(spec.courseLessonId + ' must not include quiz/SRS fields');
  checkBannedLessonContent(lesson, spec.courseLessonId, errors);

  const examples = lesson.codeExamples || [];
  if (examples.length !== 1) errors.push(spec.courseLessonId + ' must have exactly one runnable example');
  examples.forEach((example, index) => {
    Object.keys(example).forEach((key) => {
      if (!EXAMPLE_FIELDS[key]) errors.push(spec.courseLessonId + ' example contains renderer-unconsumed field: ' + key);
    });
    if (!example.code || !example.expectedOutput) errors.push(spec.courseLessonId + ' example missing code or expectedOutput');
    if (!Array.isArray(example.lineNotes) || example.lineNotes.length < 4) errors.push(spec.courseLessonId + ' example needs at least four lineNotes');
    checkBannedCode(example.code || '', spec.courseLessonId, errors);
    const run = runPython(example.code || '', example.expectedOutput || '');
    if (!run.ok) errors.push(spec.courseLessonId + ' example ' + index + ' failed CPython check: ' + run.detail);
  });

  previousLessons.forEach((prev) => {
    if (!prev) return;
    if (normalizeText(blockText(prev, 'why')) && normalizeText(blockText(prev, 'why')) === normalizeText(blockText(lesson, 'why'))) {
      errors.push(spec.courseLessonId + ' why copies existing lesson: ' + prev.lessonId);
    }
    if (normalizeText(JSON.stringify(prev.handson || {})) && normalizeText(JSON.stringify(prev.handson || {})) === normalizeText(JSON.stringify(lesson.handson || {}))) {
      errors.push(spec.courseLessonId + ' handson copies existing lesson: ' + prev.lessonId);
    }
    if (normalizeText(JSON.stringify(prev.nextLessonBridge || {})) && normalizeText(JSON.stringify(prev.nextLessonBridge || {})) === normalizeText(JSON.stringify(lesson.nextLessonBridge || {}))) {
      errors.push(spec.courseLessonId + ' bridge copies existing lesson: ' + prev.lessonId);
    }
    const prevCode = (((prev.codeExamples || [])[0] || {}).code) || '';
    const code = (((lesson.codeExamples || [])[0] || {}).code) || '';
    if (prevCode && code && codeSignature(prevCode) === codeSignature(code)) {
      errors.push(spec.courseLessonId + ' code behavior is templated from existing lesson: ' + prev.lessonId);
    }
  });
}

function visibleIdsFromCourseManifest(manifest) {
  const ids = [];
  (manifest.chapters || []).forEach((chapter) => {
    (chapter.sections || []).forEach((section) => ids.push(section.lessonId));
  });
  return ids;
}

function checkSourceScope(sourceManifest, errors) {
  if ((sourceManifest.sourceUnits || []).length !== 790) errors.push('sourceUnits count drifted');
  if ((sourceManifest.courseLessons || []).length !== 699) errors.push('lesson candidates count drifted');
  if ((sourceManifest.sourceUnits || []).filter((unit) => unit.inclusion === 'explicit_exclusion').length !== 74) errors.push('explicit exclusions count drifted');
  DOMAIN1B.forEach((spec) => {
    const unit = (sourceManifest.sourceUnits || []).find((item) => item.sourceUnitId === spec.sourceUnitId);
    const lesson = (sourceManifest.courseLessons || []).find((item) => item.courseLessonId === spec.courseLessonId);
    if (!unit) errors.push('Domain1B source unit missing: ' + spec.sourceUnitId);
    if (!lesson) errors.push('Domain1B course lesson missing: ' + spec.courseLessonId);
    if (unit) {
      if (unit.sourceOrder !== spec.sourceOrder) errors.push('Domain1B sourceOrder mismatch: ' + unit.sourceOrder);
      if (normalizeTocPath(unit.tocPath) !== spec.tocPath) errors.push('Domain1B tocPath mismatch');
      if (parentRelation(unit) !== spec.parent) errors.push('Domain1B parent mismatch');
      if (unit.type !== spec.type) errors.push('Domain1B type mismatch');
      if (unit.inclusion !== 'lesson_candidate') errors.push('Domain1B source unit must be lesson_candidate');
    }
    if (lesson) {
      if (lesson.sourceUnitId !== spec.sourceUnitId) errors.push('Domain1B course lesson sourceUnitId mismatch');
      if (lesson.sourceOrder !== spec.sourceOrder) errors.push('Domain1B course lesson sourceOrder mismatch');
      if (lesson.status !== 'published' || lesson.visibility !== 'visible') errors.push('Domain1B source lesson must be published and visible');
    }
  });
}

function checkVisibility(root, sourceManifest, courseManifest, errors) {
  const publicSummary = requireFresh(root, 'utils/python-public-course-summary.js', errors) || {};
  const sourceVisible = (sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || [];
  const manifestVisible = visibleIdsFromCourseManifest(courseManifest);
  const publicVisible = publicSummary.visibleLessonIds || [];
  const required = DOMAIN1B.map((spec) => spec.courseLessonId);
  required.forEach((id) => {
    if (!sourceVisible.includes(id)) errors.push('Domain1B missing from source releaseVisibility: ' + id);
    if (!manifestVisible.includes(id)) errors.push('Domain1B missing from Python manifest visible IDs: ' + id);
    if (!publicVisible.includes(id)) errors.push('Domain1B missing from main public projection: ' + id);
  });
  [sourceVisible, manifestVisible, publicVisible].forEach((ids, index) => {
    const deferred = ids.filter((id) => id === 'python-0016-3a01ec9d-第-10-章-文件和异常');
    if (deferred.length) errors.push('deferred lesson appears in visible surface index ' + index);
  });
  if (sourceVisible.length !== manifestVisible.length || sourceVisible.length !== publicVisible.length) errors.push('visible ID counts differ across surfaces');
  sourceVisible.forEach((id, index) => {
    if (manifestVisible[index] !== id || publicVisible[index] !== id) errors.push('visible ID order mismatch at ' + index);
  });
  const homeJs = read(root, 'pages/home/home.js', errors);
  if (!/visibleLessonIds\.length/.test(homeJs)) errors.push('home count must be derived from visibleLessonIds.length');
  if (/require\s*\(\s*['"].*packages\/python-course/.test(homeJs)) errors.push('main package home requires Python subpackage');
}

function checkLedger(root, errors) {
  const mod = requireFresh(root, 'tools/python-full-course-release-ledger.js', errors);
  if (!mod || !mod.buildPythonFullCourseReleaseLedger) return;
  const ledger = mod.buildPythonFullCourseReleaseLedger(root);
  DOMAIN1B.forEach((spec) => {
    const entry = (ledger.entries || []).find((item) => item.courseLessonId === spec.courseLessonId);
    if (!entry) errors.push('Domain1B missing from release ledger: ' + spec.courseLessonId);
    else {
      if (entry.status !== 'published') errors.push('Domain1B ledger status must be published');
      if (entry.releaseDomainKey !== 'python-domain1b') errors.push('Domain1B releaseDomainKey mismatch');
      if (entry.packageTarget !== 'packages/python-course') errors.push('Domain1B packageTarget must be current package');
    }
  });
}

function checkGitDiffScope(root, errors) {
  if (!fs.existsSync(path.join(root, '.git'))) return;
  const result = cp.spawnSync('git', ['diff', '--name-only', 'HEAD', '--'], { cwd: root, encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) return;
  const changed = (result.stdout || '').split(/\r?\n/).filter(Boolean);
  const forbidden = changed.filter((rel) => {
    if (rel.startsWith('packages/python-course/')) return false;
    if (rel.startsWith('packages/python-course-foundations-b/')) return false;
    if (rel === 'utils/python-public-course-summary.js') return false;
    if (rel.startsWith('tools/check_python_')) return false;
    if (rel === 'tools/python-full-course-release-ledger.js') return false;
    if (rel.startsWith('docs/python-course/')) return false;
    if (rel === 'packages/python-course/data/python-source-manifest.js') return false;
    if (rel === 'app.json') return false;
    return rel.startsWith('packages/java-course') ||
      rel.startsWith('packages/course-itpass') ||
      rel.startsWith('packages/course-sg') ||
      rel.startsWith('packages/quiz') ||
      rel === 'project.config.json' ||
      rel === 'project.private.config.json' ||
      rel.startsWith('styles/') ||
      rel.startsWith('custom-tab-bar/');
  });
  if (forbidden.length) errors.push('forbidden non-Python diff detected: ' + forbidden.join(', '));
}

function checkPackageScale(root, errors) {
  const result = cp.spawnSync('node', ['tools/check_python_package_scale_contract.js', '--root', root], { cwd: root, encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) {
    errors.push('package scale contract failed: ' + ((result.stdout || '') + (result.stderr || '')).split(/\r?\n/).slice(0, 6).join(' | '));
  }
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];
  checkPythonVersion(errors);

  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  const manifestModule = requireFresh(root, 'packages/python-course/data/python-course-manifest.js', errors);
  const chapter = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (!sourceModule || !manifestModule || !chapter) return report(errors, warnings);
  const sourceManifest = sourceModule.pythonSourceManifest || sourceModule;
  const courseManifest = manifestModule.manifest || manifestModule;

  checkSourceScope(sourceManifest, errors);
  checkVisibility(root, sourceManifest, courseManifest, errors);
  checkLedger(root, errors);

  const lessons = chapter.lessons || [];
  const domainLessons = DOMAIN1B.map((spec) => lessons.find((lesson) => lesson.lessonId === spec.courseLessonId));
  if (domainLessons.length < 1 || domainLessons.length > 5 || domainLessons.some((lesson) => !lesson)) {
    errors.push('Domain1B lesson count must be 1-5 and all selected lessons must exist');
  }
  const previousLessons = [
    lessons.find((lesson) => lesson.lessonId === 'python-0007-gs1-run-visible-output'),
    lessons.find((lesson) => lesson.lessonId === 'python-0008-gs2-values-and-variables'),
    lessons.find((lesson) => lesson.lessonId === 'python-0009-7d37969c-第-3-章-列表简介'),
    lessons.find((lesson) => lesson.lessonId === 'python-0010-921b265b-第-4-章-操作列表'),
    lessons.find((lesson) => lesson.lessonId === 'python-0011-5c80c609-第-5-章-if语句')
  ];
  DOMAIN1B.forEach((spec, index) => checkLessonShape(domainLessons[index], spec, previousLessons, errors));

  if (normalizeLessonHash(previousLessons[0]) !== EXPECTED.gs1Hash) errors.push('GS1 learner-visible hash changed');
  if (normalizeLessonHash(previousLessons[1]) !== EXPECTED.gs2Hash) errors.push('GS2 learner-visible hash changed');
  if (normalizeLessonHash(previousLessons[2]) !== EXPECTED.d1a1Hash) errors.push('Domain1A lesson 1 hash changed');
  if (normalizeLessonHash(previousLessons[3]) !== EXPECTED.d1a2Hash) errors.push('Domain1A lesson 2 hash changed');
  if (normalizeLessonHash(previousLessons[4]) !== EXPECTED.d1a3Hash) errors.push('Domain1A lesson 3 hash changed');
  const d1bLesson = lessons.find((lesson) => lesson.lessonId === 'python-0012-5cc0ecc6-第-6-章-字典');
  if (normalizeLessonHash(d1bLesson) !== EXPECTED.d1b1Hash) errors.push('Domain1B lesson 1 (dict) hash changed');
  if (shaFile(root, 'packages/python-course/pages/home/home.wxss', errors) !== EXPECTED.pythonHomeWxssHash) errors.push('Python card khaki WXSS hash changed');

  checkGitDiffScope(root, errors);
  checkPackageScale(root, errors);

  if (warnings.length) errors.push('warnings are not allowed: ' + warnings.join('; '));
  return report(errors, warnings);
}

function report(errors, warnings) {
  if (errors.length || warnings.length) {
    console.error('[Python Domain1B contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    warnings.forEach((warn) => console.error('WARNING:', warn));
    process.exit(1);
  }
  console.log('[Python Domain1B contract] PASS: 0 errors, 0 warnings');
}

main();
