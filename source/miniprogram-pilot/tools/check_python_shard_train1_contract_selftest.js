#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_shard_train1_contract.js');

function copyRoot() {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'python-shard-train1-'));
  fs.cpSync(ROOT, target, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(ROOT, src).replace(/\\/g, '/');
      return rel !== '.git' && !rel.startsWith('.git/') &&
        rel !== 'node_modules' && !rel.startsWith('node_modules/') &&
        rel !== 'scratch' && !rel.startsWith('scratch/') &&
        rel !== 'artifacts' && !rel.startsWith('artifacts/');
    }
  });
  return target;
}

function run(root) {
  return cp.spawnSync('node', [CHECKER, '--root', root], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true
  });
}

function file(root, rel) {
  return path.join(root, rel);
}

function edit(root, rel, fn) {
  const f = file(root, rel);
  fs.writeFileSync(f, fn(fs.readFileSync(f, 'utf8')), 'utf8');
}

function replaceOnce(root, rel, from, to) {
  edit(root, rel, (text) => {
    if (text.includes(from)) return text.replace(from, to);
    const crlfFrom = from.replace(/\n/g, '\r\n');
    const crlfTo = to.replace(/\n/g, '\r\n');
    if (text.includes(crlfFrom)) return text.replace(crlfFrom, crlfTo);
    throw new Error('pattern not found in ' + rel + ': ' + from);
  });
}

function appendVisibleId(root, id) {
  replaceOnce(root, 'packages/python-course/data/python-source-manifest.js',
    '"python-0015-0f96233e-第-9-章-类"\n    ],',
    '"python-0015-0f96233e-第-9-章-类",\n      "' + id + '"\n    ],');
}

function appendSummaryId(root, id) {
  replaceOnce(root, 'utils/python-public-course-summary.js',
    "'python-0015-0f96233e-第-9-章-类'\n  ],",
    "'python-0015-0f96233e-第-9-章-类',\n    '" + id + "'\n  ],");
}

const chapterRel = 'packages/python-course-foundations-b/data/chapters/python-foundations-b-ch01.js';
const sourceRel = 'packages/python-course/data/python-source-manifest.js';

const mutations = [
  ['A ninth domain is visible', (root) => appendVisibleId(root, 'python-0017-fbf9e623-第-11-章-测试代码')],
  ['B thirteenth lesson is visible', (root) => appendVisibleId(root, 'python-0020-809422bc-第-12-章-武装飞船')],
  ['C selected lesson data is deleted', (root) => replaceOnce(root, chapterRel, "lessonId: 'python-0015-0f96233e-第-9-章-类',\n      chapterId: 'python-foundations-b-ch01'", "lessonId: 'python-0015-missing-selftest',\n      chapterId: 'python-foundations-b-ch01'")],
  ['D sourceUnitId is modified', (root) => replaceOnce(root, sourceRel, 'py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环', 'py-src-0013-mutated')],
  ['E courseLessonId is modified', (root) => replaceOnce(root, sourceRel, 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环', 'python-0013-mutated-course-lesson')],
  ['F sourceOrder is modified', (root) => replaceOnce(root, sourceRel, '"courseLessonId": "python-0013-3f4a9a6a-第-7-章-用户输入和while循环",\n      "sourceUnitId": "py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环",\n      "sourceOrder": 13,', '"courseLessonId": "python-0013-3f4a9a6a-第-7-章-用户输入和while循环",\n      "sourceUnitId": "py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环",\n      "sourceOrder": 18,')],
  ['G tocPath is modified', (root) => replaceOnce(root, sourceRel, 'Python编程：从入门到实践（第2版） > 第 7 章 用户输入和while循环', 'Python编程：从入门到实践（第2版） > 第 7 章 mutated')],
  ['H main package requires shard JS', (root) => fs.appendFileSync(file(root, 'pages/home/home.js'), "\nvar badShard = require('../../packages/python-course-foundations-b/data/python-foundations-b-manifest');\n", 'utf8')],
  ['I old Python package requires shard data', (root) => fs.appendFileSync(file(root, 'packages/python-course/utils/python-course-loader.js'), "\nvar badShard = require('../../python-course-foundations-b/data/python-foundations-b-manifest');\n", 'utf8')],
  ['J projection misses published ID', (root) => replaceOnce(root, 'utils/python-public-course-summary.js', ",\n    'python-0015-0f96233e-第-9-章-类'", '')],
  ['K projection includes planned ID', (root) => appendSummaryId(root, 'python-0016-3a01ec9d-第-10-章-文件和异常')],
  ['L non-input lesson uses input()', (root) => replaceOnce(root, chapterRel, 'print(morning)\\nprint(evening)', 'input("extra: ")\\nprint(morning)\\nprint(evening)')],
  ['M input lesson sampleInput is deleted', (root) => replaceOnce(root, chapterRel, "          sampleInput: 'Coco\\n3',\n", '')],
  ['N renderer stops consuming sampleInput', (root) => edit(root, 'packages/python-course-foundations-b/pages/lesson/lesson.wxml', (text) => text.replace(/sampleInput/g, 'hiddenInput'))],
  ['O stdin fixture mismatches expected output', (root) => replaceOnce(root, chapterRel, "sampleInput: 'Coco\\n3'", "sampleInput: 'Coco\\n2'")],
  ['P Chinese why is deleted', (root) => replaceOnce(root, chapterRel, "          zh: '真实应用里的 user input 每次可能不同。但学习时先使用同一组 sample input，就能稳定确认 loop 会运行几次、产生哪些 output。'", "          zh: ''")],
  ['Q lineNotes are removed', (root) => replaceOnce(root, chapterRel, 'lineNotes: [', 'lineNotez: [')],
  ['R commonMistakes are removed', (root) => replaceOnce(root, chapterRel, 'commonMistakes: [', 'commonMistakez: [')],
  ['S handson expected observation is removed', (root) => replaceOnce(root, chapterRel, 'expectedObservation:', 'expectedObservatioz:')],
  ['T stdout no longer matches expectedOutput', (root) => replaceOnce(root, chapterRel, "expectedOutput: 'Python: 20 min\\nPython: 30 min'", "expectedOutput: 'Python: 20 min\\nPython: 31 min'")],
  ['U why text is templated', (root) => replaceOnce(root, chapterRel, '同じ形の code を何度も直接書くと、直す場所が増えます。function にすると、何をしたい処理なのかを名前で読めて、使う側の script が短くなります。', '本物のアプリでは user input が毎回変わります。でも学習では、まず同じ sample input を使うと、loop が何回動き、どの output が出るかを安定して確認できます。')],
  ['V accepted GS1 content is modified', (root) => replaceOnce(root, 'packages/python-course/data/chapters/python-gs-ch01.js', 'Python script starts', 'Python script begins')]
];

function main() {
  const failures = [];
  const tempRoots = [];
  try {
    mutations.forEach(([name, mutate]) => {
      const root = copyRoot();
      tempRoots.push(root);
      mutate(root);
      const result = run(root);
      if (result.status === 0) {
        failures.push(name + ' expected exit 1 but got exit 0');
      }
    });
    const real = run(ROOT);
    if (real.status !== 0) {
      failures.push('W current repository expected exit 0 but failed: ' + (real.stdout + real.stderr).trim());
    }
  } finally {
    tempRoots.forEach((root) => fs.rmSync(root, { recursive: true, force: true }));
  }
  if (failures.length) {
    console.error('[Python shard Train1 selftest] FAIL');
    failures.forEach((failure) => console.error('ERROR:', failure));
    process.exit(1);
  }
  console.log('[Python shard Train1 selftest] PASS: mutations A-V failed, W passed');
}

main();
