const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GS1_ID = 'python-0007-gs1-run-visible-output';
const GS2_ID = 'python-0008-gs2-values-and-variables';

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function copyFile(root, dest, rel) {
  const from = path.join(root, rel);
  const to = path.join(dest, rel);
  ensureDir(to);
  fs.copyFileSync(from, to);
}

function copyDir(root, dest, rel) {
  const from = path.join(root, rel);
  const to = path.join(dest, rel);
  fs.cpSync(from, to, { recursive: true });
}

function createCaseRoot(workRoot, name) {
  const dest = path.join(workRoot, name);
  copyDir(ROOT, dest, 'packages/python-course');
  for (const rel of [
    'app.json',
    'utils/course-registry.js',
    'pages/home/home.js',
    'pages/home/home.wxml',
    'tools/check_python_source_manifest.js',
    'tools/check_python_gs1_gs2_contract.js',
  ]) {
    copyFile(ROOT, dest, rel);
  }
  return dest;
}

function requireFresh(file) {
  delete require.cache[require.resolve(file)];
  return require(file);
}

function chapterFile(root) {
  return path.join(root, 'packages/python-course/data/chapters/python-gs-ch01.js');
}

function sourceManifestFile(root) {
  return path.join(root, 'packages/python-course/data/python-source-manifest.js');
}

function loadChapter(root) {
  return requireFresh(chapterFile(root));
}

function saveChapter(root, data) {
  fs.writeFileSync(chapterFile(root), 'module.exports = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8');
}

function loadSourceManifest(root) {
  const mod = requireFresh(sourceManifestFile(root));
  return mod.pythonSourceManifest || mod;
}

function saveSourceManifest(root, manifest) {
  const text = 'module.exports = { pythonSourceManifest: ' + JSON.stringify(manifest, null, 2) + ' };\n';
  fs.writeFileSync(sourceManifestFile(root), text, 'utf8');
}

function findLesson(chapter, lessonId) {
  return chapter.lessons.find((lesson) => lesson.lessonId === lessonId);
}

function findBlock(lesson, type) {
  return lesson.blocks.find((block) => block.type === type);
}

function run(command, root) {
  const result = cp.spawnSync(command[0], command.slice(1), {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true
  });
  return {
    status: result.status == null ? 1 : result.status,
    output: ((result.stdout || '') + (result.stderr || '')).trim()
  };
}

function keyOutput(output) {
  return output.split(/\r?\n/).filter(Boolean).slice(0, 3).join(' | ');
}

function runCase(workRoot, spec) {
  const caseRoot = spec.realRoot ? ROOT : createCaseRoot(workRoot, spec.id);
  if (spec.mutate) spec.mutate(caseRoot);
  const result = run(spec.command(caseRoot), caseRoot);
  const ok = result.status === spec.expectedExit;
  return {
    id: spec.id,
    mutation: spec.mutation,
    command: spec.commandText,
    exitCode: result.status,
    key: keyOutput(result.output),
    ok: ok,
    expectedExit: spec.expectedExit
  };
}

function gsCommand(root) {
  return ['node', path.join(root, 'tools/check_python_gs1_gs2_contract.js'), '--root', root];
}

function sourceCommand(root) {
  return ['node', path.join(root, 'tools/check_python_source_manifest.js'), '--root', root];
}

function mutateChapter(root, updater) {
  const data = loadChapter(root);
  updater(data, findLesson(data, GS1_ID), findLesson(data, GS2_ID));
  saveChapter(root, data);
}

const cases = [
  {
    id: 'A',
    mutation: 'GS1 learner-visible text injects 教材100ページ',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { gs1.summary.ja += ' 教材100ページ'; })
  },
  {
    id: 'B',
    mutation: 'GS1 removes Chinese why',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { findBlock(gs1, 'why').zh = ''; })
  },
  {
    id: 'C',
    mutation: 'GS1 removes Japanese mental model',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { findBlock(gs1, 'mental-model').ja = ''; })
  },
  {
    id: 'D',
    mutation: 'GS1 commonMistakes count drops below three',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { gs1.commonMistakes = gs1.commonMistakes.slice(0, 2); })
  },
  {
    id: 'E',
    mutation: 'GS1 handson expectedObservation removed',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { delete gs1.handson.expectedObservation; })
  },
  {
    id: 'F',
    mutation: 'GS1 code adds input()',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { gs1.codeExamples[0].code += '\ninput("name: ")'; })
  },
  {
    id: 'G',
    mutation: 'GS1 code adds open()',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1) => { gs1.codeExamples[0].code += '\nopen("sample.txt")'; })
  },
  {
    id: 'H',
    mutation: 'GS2 real Python code removed',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => { gs2.codeExamples[0].code = ''; })
  },
  {
    id: 'I',
    mutation: 'GS2 expectedOutput mismatches stdout',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => { gs2.codeExamples[0].expectedOutput = 'wrong output'; })
  },
  {
    id: 'J',
    mutation: 'GS2 code adds network URL',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => { gs2.codeExamples[0].code += '\nprint("https://example.invalid")'; })
  },
  {
    id: 'K',
    mutation: 'GS2 adds options and correctAnswer',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => {
      gs2.options = ['A'];
      gs2.correctAnswer = 'A';
    })
  },
  {
    id: 'L',
    mutation: 'GS1 and GS2 why normalize to same text',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => {
      findBlock(gs2, 'why').ja = findBlock(gs1, 'why').ja;
      findBlock(gs2, 'why').zh = findBlock(gs1, 'why').zh;
    })
  },
  {
    id: 'M',
    mutation: 'GS1 and GS2 handson share the same action and observation',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => {
      gs2.handson.action = JSON.parse(JSON.stringify(gs1.handson.action));
      gs2.handson.expectedObservation = JSON.parse(JSON.stringify(gs1.handson.expectedObservation));
    })
  },
  {
    id: 'N',
    mutation: 'GS2 code becomes print-only behavior like GS1',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <temp>',
    expectedExit: 1,
    command: gsCommand,
    mutate: (root) => mutateChapter(root, (data, gs1, gs2) => {
      gs2.codeExamples[0].code = 'print("alpha")\nprint("beta")\nprint("gamma")\nprint("delta")';
      gs2.codeExamples[0].expectedOutput = 'alpha\nbeta\ngamma\ndelta';
    })
  },
  {
    id: 'O',
    mutation: 'source manifest removes one lesson_candidate source unit',
    commandText: 'node tools/check_python_source_manifest.js --root <temp>',
    expectedExit: 1,
    command: sourceCommand,
    mutate: (root) => {
      const manifest = loadSourceManifest(root);
      const doomed = manifest.sourceUnits.find((unit) => unit.inclusion === 'lesson_candidate');
      manifest.sourceUnits = manifest.sourceUnits.filter((unit) => unit.sourceUnitId !== doomed.sourceUnitId);
      saveSourceManifest(root, manifest);
    }
  },
  {
    id: 'P',
    mutation: 'source manifest explicit_exclusion loses reason',
    commandText: 'node tools/check_python_source_manifest.js --root <temp>',
    expectedExit: 1,
    command: sourceCommand,
    mutate: (root) => {
      const manifest = loadSourceManifest(root);
      const entry = manifest.sourceUnits.find((unit) => unit.inclusion === 'explicit_exclusion');
      delete entry.exclusionReason;
      saveSourceManifest(root, manifest);
    }
  },
  {
    id: 'Q1',
    mutation: 'real repository source manifest remains green',
    commandText: 'node tools/check_python_source_manifest.js --root <repo>',
    expectedExit: 0,
    command: sourceCommand,
    realRoot: true
  },
  {
    id: 'Q2',
    mutation: 'real repository GS1/GS2 remains green',
    commandText: 'node tools/check_python_gs1_gs2_contract.js --root <repo>',
    expectedExit: 0,
    command: gsCommand,
    realRoot: true
  }
];

function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-gs-selftest-'));
  const rows = [];
  try {
    for (const spec of cases) {
      rows.push(runCase(workRoot, spec));
    }
  } finally {
    fs.rmSync(workRoot, { recursive: true, force: true });
  }

  console.log('| 测试 | mutation | command | exit code | 关键输出 |');
  console.log('|---|---|---|---:|---|');
  for (const row of rows) {
    console.log('| ' + row.id + ' | ' + row.mutation + ' | ' + row.command + ' | ' + row.exitCode + ' | ' + row.key.replace(/\|/g, '/') + ' |');
  }

  const failures = rows.filter((row) => !row.ok);
  if (failures.length) {
    console.error('[Python GS1/GS2 selftest] FAIL');
    for (const row of failures) {
      console.error('ERROR:', row.id, 'expected exit', row.expectedExit, 'got', row.exitCode);
    }
    process.exit(1);
  }
  console.log('[Python GS1/GS2 selftest] PASS: A-Q matched expected exits');
}

main();
