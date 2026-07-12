#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_khaki_visual_contract.js');

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
  copyDir(ROOT, dest, 'docs/python-course');
  copyFile(ROOT, dest, 'app.json');
  copyFile(ROOT, dest, 'utils/secondary-navigation.js');
  copyFile(ROOT, dest, 'packages/java-course/data/java-course-manifest.js');
  return dest;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
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

function mutateFile(root, rel, fn) {
  const file = path.join(root, rel);
  write(file, fn(read(file)));
}

const cases = [
  {
    id: 'A',
    mutation: 'delete Python khaki accent token',
    expectedExit: 1,
    mutate: (root) => {
      mutateFile(root, 'packages/python-course/pages/home/home.wxss', (txt) => txt.replace('--python-khaki-accent:#9A7B48;', ''));
      mutateFile(root, 'packages/python-course/pages/lesson/lesson.wxss', (txt) => txt.replace('--python-khaki-accent:#9A7B48;', ''));
    }
  },
  {
    id: 'B',
    mutation: 'change Python primary button back to old green',
    expectedExit: 1,
    mutate: (root) => {
      mutateFile(root, 'packages/python-course/pages/home/home.wxss', (txt) => txt.replace('.pc-btn--primary{background:var(--python-khaki-accent);', '.pc-btn--primary{background:#2f9e44;'));
    }
  },
  {
    id: 'C',
    mutation: 'delete khaki soft background token',
    expectedExit: 1,
    mutate: (root) => {
      mutateFile(root, 'packages/python-course/pages/home/home.wxss', (txt) => txt.replace('--python-khaki-soft:#F4EBD8;', ''));
      mutateFile(root, 'packages/python-course/pages/lesson/lesson.wxss', (txt) => txt.replace('--python-khaki-border:#D8C39A;', ''));
    }
  },
  {
    id: 'D',
    mutation: 'modify GS1 learner-visible text',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/python-course/data/chapters/python-gs-ch01.js', (txt) => txt.replace('Python script starts', 'Python script begins'))
  },
  {
    id: 'E',
    mutation: 'modify GS2 learner-visible text',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/python-course/data/chapters/python-gs-ch01.js', (txt) => txt.replace('Python keeps values by name', 'Python stores values by label'))
  },
  {
    id: 'F',
    mutation: 'modify app.json',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'app.json', (txt) => txt + '\n')
  },
  {
    id: 'G',
    mutation: 'modify secondary-navigation.js',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'utils/secondary-navigation.js', (txt) => txt + '\n// mutated\n')
  },
  {
    id: 'H',
    mutation: 'modify Java course manifest',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/java-course/data/java-course-manifest.js', (txt) => txt + '\n// mutated\n')
  },
  {
    id: 'I',
    mutation: 'add new shared style import inside Python package',
    expectedExit: 1,
    mutate: (root) => mutateFile(root, 'packages/python-course/pages/home/home.wxss', (txt) => txt + '\n@import "../../../../styles/shared-khaki.wxss";\n')
  },
  {
    id: 'J',
    mutation: 'real repository khaki visual contract remains green',
    expectedExit: 0,
    realRoot: true
  }
];

function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-khaki-selftest-'));
  const rows = [];
  try {
    for (const spec of cases) {
      const caseRoot = spec.realRoot ? ROOT : createCaseRoot(workRoot, spec.id);
      if (spec.mutate) spec.mutate(caseRoot);
      const result = run(caseRoot);
      rows.push({
        id: spec.id,
        mutation: spec.mutation,
        command: 'node tools/check_python_khaki_visual_contract.js --root ' + (spec.realRoot ? '<repo>' : '<temp>'),
        exitCode: result.status,
        key: keyOutput(result.output),
        ok: result.status === spec.expectedExit,
        expectedExit: spec.expectedExit
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
    console.error('[Python khaki visual contract selftest] FAIL');
    for (const row of failures) {
      console.error('ERROR:', row.id, 'expected exit', row.expectedExit, 'got', row.exitCode);
    }
    process.exit(1);
  }
  console.log('[Python khaki visual contract selftest] PASS: A-J matched expected exits');
}

main();
