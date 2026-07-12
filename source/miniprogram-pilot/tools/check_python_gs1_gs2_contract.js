const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');

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

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing file: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function flattenVisible(value, out) {
  if (value == null) return;
  if (typeof value === 'string' || typeof value === 'number') {
    out.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenVisible(item, out);
    return;
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (['lessonId', 'chapterId', 'order', 'exampleId', 'line', 'snippet', 'runnable'].includes(key)) continue;
      flattenVisible(value[key], out);
    }
  }
}

function normalizeText(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, '').replace(/[、。，,.!！?？:：;；'"“”「」『』（）()【】\[\]\-_/]/g, '');
}

function runPythonCode(code, expectedOutput) {
  const runtime = findPython311();
  if (!runtime) return { ok: false, detail: 'CPython 3.11 runtime not found' };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'py-gs-check-'));
  const file = path.join(tmp, 'sample.py');
  try {
    fs.writeFileSync(file, code, 'utf8');
    const compile = spawnPython(runtime, ['-m', 'py_compile', file]);
    if (compile.status !== 0) return { ok: false, detail: 'py_compile failed: ' + (compile.stderr || compile.stdout || '').trim() };
    const run = spawnPython(runtime, [file]);
    if (run.status !== 0) return { ok: false, detail: 'python run failed: ' + (run.stderr || run.stdout || '').trim() };
    const stdout = (run.stdout || '').replace(/\r\n/g, '\n').replace(/\n$/, '');
    if (stdout !== expectedOutput) {
      return { ok: false, detail: 'stdout mismatch: expected [' + expectedOutput + '] got [' + stdout + ']' };
    }
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

function codeSignature(code) {
  return String(code || '')
    .replace(/#.*$/gm, '')
    .replace(/["'][^"']*["']/g, 'STR')
    .replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (m) => {
      if (['print', 'range', 'len', 'str', 'int', 'float'].includes(m)) return m;
      return 'ID';
    })
    .replace(/\s+/g, '');
}

function blockText(block) {
  if (!block) return '';
  return String(block.ja || '') + String(block.zh || '');
}

function handsonComparableText(lesson) {
  const handson = lesson && lesson.handson || {};
  const action = handson.action || {};
  const expectedObservation = handson.expectedObservation || {};
  return [
    action.ja || '',
    action.zh || '',
    expectedObservation.ja || '',
    expectedObservation.zh || '',
  ].join('');
}

function checkLesson(name, lesson, manifest, sourceManifest, errors) {
  if (!lesson) {
    errors.push(name + ' missing');
    return null;
  }
  const map = (sourceManifest.goldenSelection || []).find((item) => item.goldenId === name);
  if (!map) errors.push(name + ' missing goldenSelection mapping');
  if (map) {
    const unit = (sourceManifest.sourceUnits || []).find((item) => item.sourceUnitId === map.sourceUnitId);
    if (!unit) errors.push(name + ' sourceUnitId not found in sourceUnits');
    if (!map.courseLessonId || map.courseLessonId !== lesson.lessonId) errors.push(name + ' courseLessonId does not match real lesson id');
    if (unit && map.originalTocPath !== unit.tocPath.join(' > ')) errors.push(name + ' TOC path mismatch');
  }
  if (!lesson.title || !lesson.title.ja || !lesson.title.zh) errors.push(name + ' missing bilingual titles');
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 2) errors.push(name + ' needs at least two objectives');
  if (!Array.isArray(lesson.prerequisites) || !lesson.prerequisites.length) errors.push(name + ' missing prerequisites');
  const why = (lesson.blocks || []).find((block) => block.type === 'why');
  const mental = (lesson.blocks || []).find((block) => block.type === 'mental-model');
  if (!why || !why.ja || !why.zh) errors.push(name + ' missing bilingual why block');
  if (!mental || !mental.ja || !mental.zh) errors.push(name + ' missing bilingual mental model block');
  const example = lesson.codeExamples && lesson.codeExamples[0];
  if (!example || !example.code) errors.push(name + ' missing Python code');
  if (!example || typeof example.expectedOutput !== 'string' || !example.expectedOutput) errors.push(name + ' missing expectedOutput');
  if (!example || !Array.isArray(example.lineNotes) || example.lineNotes.length < 4) errors.push(name + ' needs at least four lineNotes');
  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 3) errors.push(name + ' needs at least three commonMistakes');
  if (!lesson.handson || !lesson.handson.action || !lesson.handson.expectedObservation) errors.push(name + ' missing handson action or expected observation');
  if (!lesson.nextLessonBridge || !lesson.nextLessonBridge.ja || !lesson.nextLessonBridge.zh) errors.push(name + ' missing nextLessonBridge');
  if (!Array.isArray(lesson.terms) || lesson.terms.length < 3) errors.push(name + ' needs at least three terms');
  if (lesson.knowledgePoints) errors.push(name + ' must not contain knowledgePoints');
  for (const field of Object.keys(lesson)) {
    if (!['lessonId', 'chapterId', 'order', 'title', 'objectives', 'prerequisites', 'blocks', 'terms', 'codeExamples', 'commonMistakes', 'handson', 'summary', 'nextLessonBridge'].includes(field)) {
      errors.push(name + ' contains unrendered field: ' + field);
    }
  }
  const visible = [];
  flattenVisible(lesson, visible);
  const visibleText = visible.join('\n');
  const banned = [
    /教材\d+页/, /教材\d+ページ/, /sourceRef/, /sourceUnitId/, /courseLessonId/, /chapterId/,
    /profile/, /semanticFidelity/, /lesson=/, /TODO/, /TBD/, /同上/, /后面再说/, /自行理解/,
    /debug/i, /内部路径/, /EPUB/, /z-library/i, /1lib/i, /z-lib/i,
    /options/, /correctAnswer/, /questionBank/,
  ];
  for (const re of banned) {
    if (re.test(visibleText)) errors.push(name + ' learner-visible banned text: ' + re);
  }
  if (example && example.code) {
    const code = example.code;
    const codeBanned = [
      /\binput\s*\(/, /\bopen\s*\(/, /\brequests\b/, /\bsubprocess\b/, /\bos\.system\b/, /\bsocket\b/,
      /\bpip\b/, /\btime\.sleep\s*\(/, /\brandom\b/, /https?:\/\//, /[A-Za-z]:\\|\/tmp\/|\/Users\/|\/home\//,
      /\btkinter\b|\bpygame\b|\bPyQt\b|\bDjango\b|\bflask\b/,
    ];
    for (const re of codeBanned) {
      if (re.test(code)) errors.push(name + ' unsafe Python code token: ' + re);
    }
    const result = runPythonCode(code, example.expectedOutput || '');
    if (!result.ok) errors.push(name + ' Python execution failed: ' + result.detail);
  }
  return { lesson, why, mental, example };
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];
  const sourceMod = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  const courseMod = requireFresh(root, 'packages/python-course/data/python-course-manifest.js', errors);
  const shard = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (!sourceMod || !courseMod || !shard) return report(errors, warnings);
  const sourceManifest = sourceMod.pythonSourceManifest || sourceMod;
  const courseManifest = courseMod.manifest || courseMod;
  const lessons = shard.lessons || [];
  const gs1 = lessons.find((lesson) => lesson.lessonId === 'python-0007-gs1-run-visible-output');
  const gs2 = lessons.find((lesson) => lesson.lessonId === 'python-0008-gs2-values-and-variables');
  const c1 = checkLesson('GS1', gs1, courseManifest, sourceManifest, errors);
  const c2 = checkLesson('GS2', gs2, courseManifest, sourceManifest, errors);

  const visibleIds = sourceManifest.releaseVisibility && sourceManifest.releaseVisibility.visibleCourseLessonIds || [];
  const sectionIds = [];
  (courseManifest.chapters || []).forEach((chapter) => {
    (chapter.sections || []).forEach((section) => sectionIds.push(section.lessonId));
  });
  for (const id of ['python-0007-gs1-run-visible-output', 'python-0008-gs2-values-and-variables']) {
    if (!visibleIds.includes(id)) errors.push('releaseVisibility must keep ' + id + ' visible');
    if (!sectionIds.includes(id)) errors.push('course manifest must keep ' + id + ' visible');
  }

  if (c1 && c2) {
    if (normalizeText(blockText(c1.why)) === normalizeText(blockText(c2.why))) errors.push('GS1 and GS2 why blocks are template-identical');
    if (normalizeText(blockText(c1.mental)) === normalizeText(blockText(c2.mental))) errors.push('GS1 and GS2 mental models are template-identical');
    const m1 = normalizeText((gs1.commonMistakes || []).map((m) => m.ja + m.zh).join(''));
    const m2 = normalizeText((gs2.commonMistakes || []).map((m) => m.ja + m.zh).join(''));
    if (m1 === m2) errors.push('GS1 and GS2 commonMistakes are template-identical');
    const h1 = normalizeText(handsonComparableText(gs1));
    const h2 = normalizeText(handsonComparableText(gs2));
    if (h1 === h2) errors.push('GS1 and GS2 handson blocks are template-identical');
    if (normalizeText(gs1.nextLessonBridge.ja + gs1.nextLessonBridge.zh) === normalizeText(gs2.nextLessonBridge.ja + gs2.nextLessonBridge.zh)) {
      errors.push('GS1 and GS2 bridges are template-identical');
    }
    if (codeSignature(c1.example.code) === codeSignature(c2.example.code)) errors.push('GS1 and GS2 code behavior is too similar');
  }

  if (warnings.length) errors.push('warnings are not allowed: ' + warnings.join('; '));
  report(errors, warnings);
}

function report(errors, warnings) {
  if (errors.length || warnings.length) {
    console.error('[Python GS1/GS2 contract] FAIL');
    for (const err of errors) console.error('ERROR:', err);
    for (const warn of warnings) console.error('WARNING:', warn);
    process.exit(1);
  }
  console.log('[Python GS1/GS2 contract] PASS: 0 errors, 0 warnings');
}

main();
