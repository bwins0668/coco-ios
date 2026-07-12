#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_domain1a_contract.js');

const IDS = {
  gs1: 'python-0007-gs1-run-visible-output',
  gs2: 'python-0008-gs2-values-and-variables',
  d1: 'python-0009-7d37969c-第-3-章-列表简介',
  d2: 'python-0010-921b265b-第-4-章-操作列表',
  d3: 'python-0011-5c80c609-第-5-章-if语句',
  extra: 'python-0012-5cc0ecc6-第-6-章-字典'
};

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

function createCaseRoot(workRoot, id) {
  const dest = path.join(workRoot, id);
  copyDir(ROOT, dest, 'packages/python-course');
  copyDir(ROOT, dest, 'pages/home');
  copyDir(ROOT, dest, 'utils');
  copyFile(ROOT, dest, 'app.json');
  copyFile(ROOT, dest, 'packages/java-course/data/java-course-manifest.js');
  return dest;
}

function writeModule(file, value) {
  fs.writeFileSync(file, 'module.exports = ' + JSON.stringify(value, null, 2) + ';\n', 'utf8');
}

function loadModule(file) {
  delete require.cache[require.resolve(file)];
  return require(file);
}

function mutateChapter(root, fn) {
  const file = path.join(root, 'packages/python-course/data/chapters/python-gs-ch01.js');
  const data = loadModule(file);
  fn(data);
  writeModule(file, data);
}

function mutateCourseManifest(root, fn) {
  const file = path.join(root, 'packages/python-course/data/python-course-manifest.js');
  const data = loadModule(file);
  fn(data.manifest || data);
  writeModule(file, data.manifest ? data : { manifest: data });
}

function mutateSource(root, fn) {
  const file = path.join(root, 'packages/python-course/data/python-source-manifest.js');
  const data = loadModule(file);
  fn(data.pythonSourceManifest || data);
  writeModule(file, data.pythonSourceManifest ? data : { pythonSourceManifest: data });
}

function lesson(data, id) {
  return (data.lessons || []).find((item) => item.lessonId === id);
}

function block(item, type) {
  return (item.blocks || []).find((entry) => entry.type === type);
}

function run(root) {
  const result = cp.spawnSync('node', [CHECKER, '--root', root], { encoding: 'utf8', windowsHide: true });
  return {
    status: result.status == null ? 1 : result.status,
    output: ((result.stdout || '') + (result.stderr || '')).trim()
  };
}

function keyOutput(output) {
  return output.split(/\r?\n/).filter(Boolean).slice(0, 3).join(' | ');
}

const cases = [
  {
    id: 'A',
    mutation: 'delete one Domain1A lesson',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { data.lessons = data.lessons.filter((item) => item.lessonId !== IDS.d1); })
  },
  {
    id: 'B',
    mutation: 'rewrite a Domain1A sourceUnitId',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      manifest.courseLessons.find((item) => item.courseLessonId === IDS.d1).sourceUnitId = 'py-src-mutated-domain1a';
    })
  },
  {
    id: 'C',
    mutation: 'rewrite a Domain1A sourceOrder',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      manifest.courseLessons.find((item) => item.courseLessonId === IDS.d1).sourceOrder = 99;
    })
  },
  {
    id: 'D',
    mutation: 'delete Chinese why',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { block(lesson(data, IDS.d1), 'why').zh = ''; })
  },
  {
    id: 'E',
    mutation: 'delete Japanese mental model',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { block(lesson(data, IDS.d1), 'mental-model').ja = ''; })
  },
  {
    id: 'F',
    mutation: 'objectives fewer than two',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1).objectives = lesson(data, IDS.d1).objectives.slice(0, 1); })
  },
  {
    id: 'G',
    mutation: 'lineNotes fewer than four',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1).codeExamples[0].lineNotes = lesson(data, IDS.d1).codeExamples[0].lineNotes.slice(0, 3); })
  },
  {
    id: 'H',
    mutation: 'commonMistakes fewer than three',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1).commonMistakes = lesson(data, IDS.d1).commonMistakes.slice(0, 2); })
  },
  {
    id: 'I',
    mutation: 'delete handson expected observation',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { delete lesson(data, IDS.d1).handson.expectedObservation; })
  },
  {
    id: 'J',
    mutation: 'expectedOutput mismatches stdout',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1).codeExamples[0].expectedOutput = 'wrong output'; })
  },
  {
    id: 'K',
    mutation: 'Python code injects input()',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1).codeExamples[0].code = 'input("name")\n' + lesson(data, IDS.d1).codeExamples[0].code; })
  },
  {
    id: 'L',
    mutation: 'Python code injects open()',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1).codeExamples[0].code = 'open("tmp.txt")\n' + lesson(data, IDS.d1).codeExamples[0].code; })
  },
  {
    id: 'M',
    mutation: 'inject options and correctAnswer',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      lesson(data, IDS.d1).options = ['A', 'B'];
      lesson(data, IDS.d1).correctAnswer = 'A';
    })
  },
  {
    id: 'N',
    mutation: 'two why blocks become identical',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      const from = block(lesson(data, IDS.d1), 'why');
      const to = block(lesson(data, IDS.d2), 'why');
      to.ja = from.ja;
      to.zh = from.zh;
    })
  },
  {
    id: 'O',
    mutation: 'two handson blocks become identical',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d2).handson = JSON.parse(JSON.stringify(lesson(data, IDS.d1).handson)); })
  },
  {
    id: 'P',
    mutation: 'two bridge blocks become identical',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d2).nextLessonBridge = JSON.parse(JSON.stringify(lesson(data, IDS.d1).nextLessonBridge)); })
  },
  {
    id: 'Q',
    mutation: 'two code examples only rename variables',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      const source = lesson(data, IDS.d2).codeExamples[0];
      lesson(data, IDS.d3).codeExamples[0].code = source.code.replace(/\btasks\b/g, 'items').replace(/\bdone\b/g, 'finished');
      lesson(data, IDS.d3).codeExamples[0].expectedOutput = source.expectedOutput.replace('done:', 'finished:');
    })
  },
  {
    id: 'R',
    mutation: 'modify GS1 learner-visible text',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.gs1).title.zh = '修改后的 GS1'; })
  },
  {
    id: 'S',
    mutation: 'modify GS2 learner-visible text',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.gs2).title.zh = '修改后的 GS2'; })
  },
  {
    id: 'T',
    mutation: 'make non-Domain1A planned lesson visible',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      const extra = manifest.courseLessons.find((item) => item.courseLessonId === IDS.extra);
      extra.status = 'published';
      extra.visibility = 'visible';
      manifest.releaseVisibility.visibleCourseLessonIds.push(IDS.extra);
    })
  },
  {
    id: 'U',
    mutation: 'real repository Domain1A contract',
    expectedExit: 0,
    realRoot: true
  }
];

function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-domain1a-selftest-'));
  const rows = [];
  try {
    for (const spec of cases) {
      const caseRoot = spec.realRoot ? ROOT : createCaseRoot(workRoot, spec.id);
      if (spec.mutate) spec.mutate(caseRoot);
      const result = run(caseRoot);
      rows.push({
        id: spec.id,
        mutation: spec.mutation,
        command: 'node tools/check_python_domain1a_contract.js --root ' + (spec.realRoot ? '<repo>' : '<temp>'),
        exitCode: result.status,
        key: keyOutput(result.output),
        expectedExit: spec.expectedExit,
        ok: result.status === spec.expectedExit
      });
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
    console.error('[Python Domain1A contract selftest] FAIL');
    failures.forEach((row) => console.error('ERROR:', row.id, 'expected exit', row.expectedExit, 'got', row.exitCode));
    process.exit(1);
  }
  console.log('[Python Domain1A contract selftest] PASS: A-U matched expected exits');
}

main();
