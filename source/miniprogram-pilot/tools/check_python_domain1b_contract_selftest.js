#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_domain1b_contract.js');
const IDS = {
  gs1: 'python-0007-gs1-run-visible-output',
  gs2: 'python-0008-gs2-values-and-variables',
  d1a: 'python-0009-7d37969c-第-3-章-列表简介',
  d1a2: 'python-0010-921b265b-第-4-章-操作列表',
  d1a3: 'python-0011-5c80c609-第-5-章-if语句',
  d1b: 'python-0012-5cc0ecc6-第-6-章-字典',
  planned: 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环'
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
  copyDir(ROOT, dest, 'tools');
  copyDir(ROOT, dest, 'docs/python-course');
  copyFile(ROOT, dest, 'app.json');
  copyFile(ROOT, dest, 'project.config.json');
  copyFile(ROOT, dest, 'packages/java-course/data/java-course-manifest.js');
  return dest;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function loadModule(file) {
  delete require.cache[require.resolve(file)];
  return require(file);
}

function writeModule(file, value) {
  write(file, 'module.exports = ' + JSON.stringify(value, null, 2) + ';\n');
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

function mutatePublicSummary(root, fn) {
  const file = path.join(root, 'utils/python-public-course-summary.js');
  const data = loadModule(file);
  fn(data);
  writeModule(file, data);
}

function mutateFile(root, rel, fn) {
  const file = path.join(root, rel);
  write(file, fn(read(file)));
}

function lesson(data, id) {
  return (data.lessons || []).find((item) => item.lessonId === id);
}

function block(item, type) {
  return item && (item.blocks || []).find((entry) => entry.type === type);
}

function mutateDomain1B(root, fn) {
  mutateChapter(root, (data) => {
    const item = lesson(data, IDS.d1b);
    if (item) fn(item, data);
  });
}

function run(root) {
  const result = cp.spawnSync('node', [CHECKER, '--root', root], { encoding: 'utf8', windowsHide: true });
  return {
    status: result.status == null ? 1 : result.status,
    output: ((result.stdout || '') + (result.stderr || '')).trim()
  };
}

function keyOutput(output) {
  return output.split(/\r?\n/).filter(Boolean).slice(0, 4).join(' | ');
}

const cases = [
  {
    id: 'A',
    mutation: 'delete one Domain1B lesson',
    expectedExit: 1,
    mutate: (root) => {
      mutateChapter(root, (data) => {
        data.lessons = (data.lessons || []).filter((item) => item.lessonId !== IDS.d1b);
        data.chapter.sections = (data.chapter.sections || []).filter((item) => item.lessonId !== IDS.d1b);
      });
      mutateCourseManifest(root, (manifest) => {
        manifest.chapters[0].sections = manifest.chapters[0].sections.filter((item) => item.lessonId !== IDS.d1b);
      });
    }
  },
  {
    id: 'B',
    mutation: 'change Domain1B sourceUnitId',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      manifest.courseLessons.find((item) => item.courseLessonId === IDS.d1b).sourceUnitId = 'py-src-mutated-domain1b';
    })
  },
  {
    id: 'C',
    mutation: 'change Domain1B tocPath parent or sourceOrder',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      const unit = manifest.sourceUnits.find((item) => item.sourceUnitId === 'py-src-0012-5cc0ecc6-第-6-章-字典');
      unit.tocPath = ['Python编程：从入门到实践（第2版）', 'mutated'];
      manifest.courseLessons.find((item) => item.courseLessonId === IDS.d1b).sourceOrder = 99;
    })
  },
  {
    id: 'D',
    mutation: 'objectives fewer than two',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { item.objectives = item.objectives.slice(0, 1); })
  },
  {
    id: 'E',
    mutation: 'delete Chinese why',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { block(item, 'why').zh = ''; })
  },
  {
    id: 'F',
    mutation: 'delete Japanese mental model',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { block(item, 'mental-model').ja = ''; })
  },
  {
    id: 'G',
    mutation: 'lineNotes fewer than four',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { item.codeExamples[0].lineNotes = item.codeExamples[0].lineNotes.slice(0, 3); })
  },
  {
    id: 'H',
    mutation: 'commonMistakes fewer than three',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { item.commonMistakes = item.commonMistakes.slice(0, 2); })
  },
  {
    id: 'I',
    mutation: 'handson missing expected observation',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { delete item.handson.expectedObservation; })
  },
  {
    id: 'J',
    mutation: 'expectedOutput mismatch',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { item.codeExamples[0].expectedOutput = 'wrong output'; })
  },
  {
    id: 'K',
    mutation: 'inject input()',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { item.codeExamples[0].code = 'input(\"name\")\\n' + item.codeExamples[0].code; })
  },
  {
    id: 'L',
    mutation: 'inject open URL or requests',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => { item.codeExamples[0].code = 'import requests\\nopen(\"tmp.txt\")\\nurl = \"https://example.com\"\\n' + item.codeExamples[0].code; })
  },
  {
    id: 'M',
    mutation: 'inject options and correctAnswer',
    expectedExit: 1,
    mutate: (root) => mutateDomain1B(root, (item) => {
      item.options = ['A', 'B'];
      item.correctAnswer = 'A';
    })
  },
  {
    id: 'N',
    mutation: 'Domain1B why copies existing lesson',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      const from = block(lesson(data, IDS.gs1), 'why');
      const to = block(lesson(data, IDS.d1b), 'why');
      if (from && to) { to.ja = from.ja; to.zh = from.zh; }
    })
  },
  {
    id: 'O',
    mutation: 'Domain1B handson copies existing lesson',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      const from = lesson(data, IDS.gs1);
      const to = lesson(data, IDS.d1b);
      if (from && to) to.handson = JSON.parse(JSON.stringify(from.handson));
    })
  },
  {
    id: 'P',
    mutation: 'Domain1B bridge copies existing lesson',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      const from = lesson(data, IDS.gs1);
      const to = lesson(data, IDS.d1b);
      if (from && to) to.nextLessonBridge = JSON.parse(JSON.stringify(from.nextLessonBridge));
    })
  },
  {
    id: 'Q',
    mutation: 'Domain1B code only renames existing behavior',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => {
      const from = lesson(data, IDS.d1a2);
      const to = lesson(data, IDS.d1b);
      if (from && to) {
        to.codeExamples[0].code = from.codeExamples[0].code.replace(/\btasks\b/g, 'items');
        to.codeExamples[0].expectedOutput = from.codeExamples[0].expectedOutput;
      }
    })
  },
  {
    id: 'R',
    mutation: 'new published ID missing from main package projection',
    expectedExit: 1,
    mutate: (root) => mutatePublicSummary(root, (summary) => {
      summary.visibleLessonIds = summary.visibleLessonIds.filter((id) => id !== IDS.d1b);
    })
  },
  {
    id: 'S',
    mutation: 'public projection counts planned lesson',
    expectedExit: 1,
    mutate: (root) => mutatePublicSummary(root, (summary) => {
      summary.visibleLessonIds.push(IDS.planned);
    })
  },
  {
    id: 'T',
    mutation: 'home requires Python subpackage summary',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'pages/home/home.js', (txt) => "var leaked = require('../../packages/python-course/data/python-course-summary.js');\n" + txt)
  },
  {
    id: 'U',
    mutation: 'modify GS1 learner-visible content',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.gs1).summary.ja += ' mutated'; })
  },
  {
    id: 'V',
    mutation: 'modify GS2 learner-visible content',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.gs2).summary.ja += ' mutated'; })
  },
  {
    id: 'W',
    mutation: 'modify Domain1A learner-visible content',
    expectedExit: 1,
    mutate: (root) => mutateChapter(root, (data) => { lesson(data, IDS.d1a).summary.ja += ' mutated'; })
  },
  {
    id: 'X',
    mutation: 'current real repository',
    expectedExit: 0,
    realRoot: true
  }
];

function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-domain1b-selftest-'));
  const rows = [];
  try {
    for (const spec of cases) {
      const caseRoot = spec.realRoot ? ROOT : createCaseRoot(workRoot, spec.id);
      if (spec.mutate) spec.mutate(caseRoot);
      const result = run(caseRoot);
      rows.push({
        id: spec.id,
        mutation: spec.mutation,
        exitCode: result.status,
        expectedExit: spec.expectedExit,
        key: keyOutput(result.output),
        ok: result.status === spec.expectedExit
      });
    }
  } finally {
    fs.rmSync(workRoot, { recursive: true, force: true });
  }

  console.log('| 测试 | mutation | exit code | 关键输出 |');
  console.log('|---|---|---:|---|');
  rows.forEach((row) => {
    console.log('| ' + row.id + ' | ' + row.mutation + ' | ' + row.exitCode + ' | ' + row.key.replace(/\|/g, '/') + ' |');
  });
  const failures = rows.filter((row) => !row.ok);
  if (failures.length) {
    console.error('[Python Domain1B contract selftest] FAIL');
    failures.forEach((row) => console.error('ERROR:', row.id, 'expected exit', row.expectedExit, 'got', row.exitCode));
    process.exit(1);
  }
  console.log('[Python Domain1B contract selftest] PASS: A-X matched expected exits');
}

main();
