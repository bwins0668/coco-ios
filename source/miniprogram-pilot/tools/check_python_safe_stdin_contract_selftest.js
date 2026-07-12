#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join(ROOT, 'tools/check_python_safe_stdin_contract.js');

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, text) {
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, text, 'utf8');
}

function run(root) {
  return cp.spawnSync('node', [CHECKER, '--root', root], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true
  });
}

function createFixture(mutator) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'python-safe-stdin-'));
  write(path.join(root, 'packages/python-course-foundations-b/pages/lesson/lesson.wxml'), '<view>{{item.sampleInput}}<text>入力例</text><text>输入示例</text></view>');
  write(path.join(root, 'packages/python-course-foundations-b/data/python-foundations-b-manifest.js'), [
    "module.exports = { manifest: { chapters: [{ chapterId: 'fixture', shard: 'fixture.js' }] } };",
    ''
  ].join('\n'));
  write(path.join(root, 'packages/python-course-foundations-b/data/chapters/fixture.js'), [
    'module.exports = {',
    "  chapter: { chapterId: 'fixture', sections: [] },",
    '  lessons: [{',
    "    lessonId: 'fixture-input',",
    '    codeExamples: [{',
    "      exampleId: 'fixture-input-example',",
    "      code: 'name = input(\"name: \")\\nprint(\"Hello \" + name)',",
    "      sampleInput: 'Coco',",
    "      expectedOutput: 'name: Hello Coco'",
    '    }]',
    '  }]',
    '};',
    ''
  ].join('\n'));
  if (mutator) mutator(root);
  return root;
}

function expectPass(name, root, failures) {
  const result = run(root);
  if (result.status !== 0) {
    failures.push(name + ' expected PASS, got FAIL: ' + (result.stdout + result.stderr).trim());
  }
}

function expectFail(name, root, failures, needle) {
  const result = run(root);
  const output = (result.stdout + result.stderr).trim();
  if (result.status === 0) {
    failures.push(name + ' expected FAIL, got PASS');
  } else if (needle && output.indexOf(needle) === -1) {
    failures.push(name + ' failed without expected evidence "' + needle + '": ' + output);
  }
}

function main() {
  const roots = [];
  const failures = [];
  try {
    const valid = createFixture();
    roots.push(valid);
    expectPass('valid input fixture', valid, failures);

    const missingSample = createFixture((root) => {
      const file = path.join(root, 'packages/python-course-foundations-b/data/chapters/fixture.js');
      fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace("      sampleInput: 'Coco',\n", ''), 'utf8');
    });
    roots.push(missingSample);
    expectFail('missing sampleInput', missingSample, failures, 'sampleInput is missing');

    const rendererBlind = createFixture((root) => {
      fs.writeFileSync(path.join(root, 'packages/python-course-foundations-b/pages/lesson/lesson.wxml'), '<view>入力例 输入示例</view>', 'utf8');
    });
    roots.push(rendererBlind);
    expectFail('renderer missing sampleInput binding', rendererBlind, failures, 'does not consume sampleInput');

    const stdoutMismatch = createFixture((root) => {
      const file = path.join(root, 'packages/python-course-foundations-b/data/chapters/fixture.js');
      fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace("      expectedOutput: 'name: Hello Coco'", "      expectedOutput: 'Hello Coco'"), 'utf8');
    });
    roots.push(stdoutMismatch);
    expectFail('stdout mismatch', stdoutMismatch, failures, 'stdout mismatch');
  } finally {
    roots.forEach((root) => fs.rmSync(root, { recursive: true, force: true }));
  }

  if (failures.length) {
    console.error('[Python safe stdin selftest] FAIL');
    failures.forEach((failure) => console.error('ERROR:', failure));
    process.exit(1);
  }
  console.log('[Python safe stdin selftest] PASS: valid fixture passed; negative mutations failed');
}

main();
