#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_full_course_ledger_contract.js');

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
  copyDir(ROOT, dest, 'packages/python-course/data');
  copyDir(ROOT, dest, 'utils');
  copyDir(ROOT, dest, 'pages/home');
  copyDir(ROOT, dest, 'tools');
  copyFile(ROOT, dest, 'app.json');
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

function mutateSource(root, fn) {
  const file = path.join(root, 'packages/python-course/data/python-source-manifest.js');
  const data = loadModule(file);
  fn(data.pythonSourceManifest || data);
  writeModule(file, data.pythonSourceManifest ? data : { pythonSourceManifest: data });
}

function mutatePublicProjection(root, fn) {
  const file = path.join(root, 'utils/python-public-course-summary.js');
  const data = loadModule(file);
  fn(data);
  writeModule(file, data);
}

function mutateLedgerTool(root, fn) {
  const file = path.join(root, 'tools/python-full-course-release-ledger.js');
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
  return output.split(/\r?\n/).filter(Boolean).slice(0, 4).join(' | ');
}

const IDS = {
  firstPublished: 'python-0007-gs1-run-visible-output',
  planned: 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环'
};

const cases = [
  {
    id: 'A',
    mutation: 'delete one lesson_candidate ledger entry',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      manifest.courseLessons = manifest.courseLessons.filter((lesson) => lesson.courseLessonId !== IDS.planned);
    })
  },
  {
    id: 'B',
    mutation: 'duplicate sourceUnitId',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      manifest.courseLessons[12].sourceUnitId = manifest.courseLessons[11].sourceUnitId;
    })
  },
  {
    id: 'C',
    mutation: 'duplicate courseLessonId',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      manifest.courseLessons[12].courseLessonId = manifest.courseLessons[11].courseLessonId;
    })
  },
  {
    id: 'D',
    mutation: 'mark planned lesson as published without manifest visibility',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      const lesson = manifest.courseLessons.find((item) => item.courseLessonId === IDS.planned);
      lesson.status = 'published';
      lesson.visibility = 'internal';
    })
  },
  {
    id: 'E',
    mutation: 'published lesson missing from public projection',
    expectedExit: 1,
    mutate: (root) => mutatePublicProjection(root, (summary) => {
      summary.visibleLessonIds = summary.visibleLessonIds.filter((id) => id !== IDS.firstPublished);
    })
  },
  {
    id: 'F',
    mutation: 'public projection ID missing from manifest visible IDs',
    expectedExit: 1,
    mutate: (root) => mutatePublicProjection(root, (summary) => {
      summary.visibleLessonIds.push('python-9999-not-in-manifest');
    })
  },
  {
    id: 'G',
    mutation: 'make a domain sourceOrder non-continuous',
    expectedExit: 1,
    mutate: (root) => mutateLedgerTool(root, (txt) => txt.replace("if (order >= 9 && order <= 11) return 'python-domain1a';", "if (order === 9 || order === 11 || order === 13) return 'python-domain1a';"))
  },
  {
    id: 'H',
    mutation: 'make a top-level chapter domain cross unrelated concepts without continuity note',
    expectedExit: 1,
    mutate: (root) => mutateLedgerTool(root, (txt) => txt
      .replace("if (order === 13) return 'python-domain1c';", "if (order === 13 || order === 14) return 'python-domain1c';")
      .replace("conceptContinuity: key === 'python-domain1a',", "conceptContinuity: false,"))
  },
  {
    id: 'I',
    mutation: 'delete explicit exclusion reason',
    expectedExit: 1,
    mutate: (root) => mutateSource(root, (manifest) => {
      const excluded = manifest.sourceUnits.find((unit) => unit.inclusion === 'explicit_exclusion');
      excluded.exclusionReason = '';
    })
  },
  {
    id: 'J',
    mutation: 'inject textbook body payload into ledger',
    expectedExit: 1,
    mutate: (root) => mutateLedgerTool(root, (txt) => txt.replace('publishedVisibility: isVisible ?', "textbookPayload: 'EPUB copied lesson body payload should never live in the ledger',\n    publishedVisibility: isVisible ?"))
  },
  {
    id: 'K',
    mutation: 'remove packageTarget',
    expectedExit: 1,
    mutate: (root) => mutateLedgerTool(root, (txt) => txt.replace('entry.packageTarget = packageTargetForDomain(domain.domainIndex, entry.status);', "entry.packageTarget = '';"))
  },
  {
    id: 'L',
    mutation: 'force every lesson into one never-expanding package',
    expectedExit: 1,
    mutate: (root) => mutateLedgerTool(root, (txt) => txt.replace("if (status === 'published' || status === 'next_candidate') return CURRENT_PACKAGE_TARGET;", "return CURRENT_PACKAGE_TARGET;"))
  },
  {
    id: 'M',
    mutation: 'current real repository',
    expectedExit: 0,
    realRoot: true
  }
];

function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'python-full-ledger-selftest-'));
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
    console.error('[Python full-course ledger contract selftest] FAIL');
    failures.forEach((row) => console.error('ERROR:', row.id, 'expected exit', row.expectedExit, 'got', row.exitCode));
    process.exit(1);
  }
  console.log('[Python full-course ledger contract selftest] PASS: A-M matched expected exits');
}

main();
