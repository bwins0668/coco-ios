#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_home_release_contract.js');

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
  copyDir(ROOT, dest, 'pages/home');
  copyDir(ROOT, dest, 'utils');
  copyDir(ROOT, dest, 'packages/python-course');
  copyFile(ROOT, dest, 'app.json');
  return dest;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function mutateFile(root, rel, fn) {
  const file = path.join(root, rel);
  write(file, fn(read(file)));
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

function removePythonHomeRoute(root) {
  const appFile = path.join(root, 'app.json');
  const app = JSON.parse(read(appFile));
  const pkg = (app.subpackages || []).find((item) => item.root === 'packages/python-course');
  pkg.pages = pkg.pages.filter((page) => page !== 'pages/home/home');
  write(appFile, JSON.stringify(app, null, 2));
}

const cases = [
  {
    id: 'A',
    mutation: 'set Python card back to disabled/planned',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'utils/course-registry.js', (txt) => txt.replace(/(id: 'python',[\s\S]*?availability: ')available(')/, '$1planned$2'))
  },
  {
    id: 'B',
    mutation: 'restore Python preparing badge text',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'pages/home/home.wxml', (txt) => txt.replace('算法基础准备中', 'Python / 算法基础准备中'))
  },
  {
    id: 'C',
    mutation: 'route Python card to Java home',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'utils/navigation.js', (txt) => txt.replace('/packages/python-course/pages/home/home', '/packages/java-course/pages/home/home'))
  },
  {
    id: 'D',
    mutation: 'remove Python Home route from app.json',
    expectedExit: 1,
    mutate: removePythonHomeRoute
  },
  {
    id: 'E',
    mutation: 'show a planned lesson in Python Home',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/python-course/data/python-course-manifest.js', (txt) => {
      const planned = ",\n        {\n          sectionId: 'python-planned-dictionary',\n          lessonId: 'python-0012-5cc0ecc6-第-6-章-字典',\n          order: 6,\n          title: { ja: '辞書', zh: '字典' },\n          runnableExampleCount: 0,\n          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0012-5cc0ecc6-第-6-章-字典'\n        }";
      return txt.replace(/(lessonRoute: '\/packages\/python-course\/pages\/lesson\/lesson\?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables'\r?\n\s*\})/, '$1' + planned);
    })
  },
  {
    id: 'F',
    mutation: 'change Java home card route',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'pages/home/home.js', (txt) => txt.replace('/packages/java-course/pages/home/home', '/packages/python-course/pages/home/home'))
  },
  {
    id: 'G',
    mutation: 'modify GS1 learner-visible text',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/python-course/data/chapters/python-gs-ch01.js', (txt) => txt.replace('Python script starts', 'Python script begins'))
  },
  {
    id: 'H',
    mutation: 'modify GS2 learner-visible text',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/python-course/data/chapters/python-gs-ch01.js', (txt) => txt.replace('Python keeps values by name', 'Python stores values by label'))
  },
  {
    id: 'I',
    mutation: 'inject old Python brand green into home card',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'pages/home/home.wxml', (txt) => txt.replace('{{item.displayName}}</text>', '{{item.displayName}}</text><text style="color:#2f9e44">Python</text>'))
  },
  {
    id: 'J',
    mutation: 'real repository home release contract',
    expectedExit: 0,
    realRoot: true
  }
];

function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-home-release-selftest-'));
  const rows = [];
  try {
    for (const spec of cases) {
      const caseRoot = spec.realRoot ? ROOT : createCaseRoot(workRoot, spec.id);
      if (spec.mutate) spec.mutate(caseRoot);
      const result = run(caseRoot);
      rows.push({
        id: spec.id,
        mutation: spec.mutation,
        command: 'node tools/check_python_home_release_contract.js --root ' + (spec.realRoot ? '<repo>' : '<temp>'),
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
    console.error('[Python home release contract selftest] FAIL');
    failures.forEach((row) => console.error('ERROR:', row.id, 'expected exit', row.expectedExit, 'got', row.exitCode));
    process.exit(1);
  }
  console.log('[Python home release contract selftest] PASS: A-J matched expected exits');
}

main();
