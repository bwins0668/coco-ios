const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-java-neg-'));

function copyDir(from, to) {
  fs.cpSync(from, to, { recursive: true });
}

function copyBase(to) {
  fs.mkdirSync(to, { recursive: true });
  copyDir(path.join(ROOT, 'tools'), path.join(to, 'tools'));
  copyDir(path.join(ROOT, 'docs/java-course'), path.join(to, 'docs/java-course'));
  for (const name of ['java-course', 'java-course-a', 'java-course-b', 'java-course-c']) {
    copyDir(path.join(ROOT, 'packages', name), path.join(to, 'packages', name));
  }
}

function runNode(cwd, script, args = []) {
  const result = cp.spawnSync('node', [script].concat(args), {
    cwd,
    encoding: 'utf8',
    timeout: 240000,
    windowsHide: true
  });
  return { code: result.status, out: (result.stdout || '') + (result.stderr || '') };
}

function loadManifest(root) {
  const file = path.join(root, 'packages/java-course/data/java-course-manifest.js');
  delete require.cache[require.resolve(file)];
  return require(file).manifest;
}

function firstShard(root) {
  const manifest = loadManifest(root);
  const chapter = manifest.chapters[0];
  return path.join(root, chapter.packageRoot, 'data/chapters', chapter.shard);
}

function loadFirstShard(root) {
  const file = firstShard(root);
  delete require.cache[require.resolve(file)];
  return { file, mod: require(file) };
}

function writeModule(file, mod) {
  fs.writeFileSync(file, 'module.exports = ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
}

function countOf(body, needle) {
  return body.split(needle).length - 1;
}

function replaceOnce(file, needle, replacement) {
  const body = fs.readFileSync(file, 'utf8');
  const count = countOf(body, needle);
  if (count !== 1) throw new Error('expected exactly 1 replacement target, got ' + count + ': ' + needle.slice(0, 80));
  fs.writeFileSync(file, body.replace(needle, replacement), 'utf8');
}

function assertOnce(file, needle) {
  const body = fs.readFileSync(file, 'utf8');
  const count = countOf(body, needle);
  if (count !== 1) throw new Error('expected exactly 1 target, got ' + count + ': ' + needle);
}

const originality = 'tools/check_r7_java_content_originality_contract.js';

const tests = [
  {
    name: 'A duplicate Chinese core explanation',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      for (let i = 0; i < mod.lessons[0].blocks.length; i++) {
        const from = mod.lessons[0].blocks[i].zh;
        const to = mod.lessons[1].blocks[i].zh;
        replaceOnce(file, JSON.stringify(to), JSON.stringify(from));
      }
    }
  },
  {
    name: 'B duplicate Japanese core explanation',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      for (let i = 0; i < mod.lessons[0].blocks.length; i++) {
        const from = mod.lessons[0].blocks[i].ja;
        const to = mod.lessons[1].blocks[i].ja;
        replaceOnce(file, JSON.stringify(to), JSON.stringify(from));
      }
    }
  },
  {
    name: 'C duplicate runnable Java code',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      const from = mod.lessons[0].codeExamples[0].code;
      const to = mod.lessons[1].codeExamples[0].code;
      replaceOnce(file, JSON.stringify(to), JSON.stringify(from));
    }
  },
  {
    name: 'D generic repeated handson',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      replaceOnce(file, JSON.stringify(mod.lessons[1].handson.ja), JSON.stringify(mod.lessons[0].handson.ja));
      replaceOnce(file, JSON.stringify(mod.lessons[1].handson.zh), JSON.stringify(mod.lessons[0].handson.zh));
    }
  },
  {
    name: 'E placeholder TODO',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      const original = mod.lessons[0].summary.zh;
      replaceOnce(file, JSON.stringify(original), JSON.stringify('TODO ' + original));
    }
  },
  {
    name: 'F delete commonMistakes',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      assertOnce(file, '"lessonId": "intro-ch01-lesson-001",\n      "chapterId": "java-ch01"');
      mod.lessons[0].commonMistakes = [];
      writeModule(file, mod);
    }
  },
  {
    name: 'G lineNotes points to missing code',
    checker: originality,
    mutate(root) {
      const { file, mod } = loadFirstShard(root);
      const notes = mod.lessons[0].codeExamples[0].lineNotes;
      const snippet = notes[notes.length - 1].snippet;
      replaceOnce(file, JSON.stringify(snippet), JSON.stringify('not-in-code-snippet'));
    }
  },
  {
    name: 'H clean repository R7 checker set',
    checker: null,
    mutate() {}
  }
];

const r7Checkers = [
  'tools/check_r7_java_source_coverage.js',
  'tools/check_r7_java_bilingual_content_quality.js',
  'tools/check_r7_java_content_originality_contract.js',
  'tools/check_r7_java_no_quiz_contract.js',
  'tools/check_r7_java_runtime_package_contract.js',
  'tools/check_r7_java_examples_compile.js',
  'tools/check_r7_java_route_shell_contract.js'
];

const results = [];
for (let i = 0; i < tests.length; i++) {
  const test = tests[i];
  if (test.checker) {
    const dir = path.join(TMP_ROOT, 'case-' + i);
    copyBase(dir);
    test.mutate(dir);
    const result = runNode(dir, test.checker);
    results.push({
      test: test.name,
      checker: test.checker,
      code: result.code,
      ok: result.code !== 0,
      key: result.out.split(/\r?\n/).filter(Boolean).slice(0, 3).join(' | ')
    });
  } else {
    let allPass = true;
    const key = [];
    for (const checker of r7Checkers) {
      const result = runNode(ROOT, checker);
      if (result.code !== 0) allPass = false;
      key.push((result.out.split(/\r?\n/).filter(Boolean)[0] || checker) + ' exit=' + result.code);
    }
    results.push({
      test: test.name,
      checker: 'R7 checker set excluding negative runner self-recursion',
      code: allPass ? 0 : 1,
      ok: allPass,
      key: key.join(' | ')
    });
  }
}

for (const result of results) {
  const status = result.ok ? 'PASS' : 'FAIL';
  console.log([status, result.test, result.checker, 'exit=' + result.code, result.key].join(' | '));
}

if (results.some((result) => !result.ok)) process.exit(1);
