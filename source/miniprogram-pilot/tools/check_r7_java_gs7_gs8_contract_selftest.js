/**
 * check_r7_java_gs7_gs8_contract_selftest.js
 * R7.GS7-GS8-REBUILD - Self-test mutation framework for the contract checker.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');

const root = process.cwd();

// Define mutation tests
const tests = [
  {
    id: 'A',
    description: 'GS7 learner-visible text has "教材100ページ"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/"zh":\s*"继承"\s*,/, '"zh": "继承 教材100ページ",');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Found forbidden pattern/noise'
  },
  {
    id: 'B',
    description: 'GS7 delete Chinese why',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/"zh":\s*"本节目标"\s*/, '"zh": ""');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Missing Chinese text'
  },
  {
    id: 'C',
    description: 'GS7 delete "extends"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('extends Person', '');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must define a Person parent class'
  },
  {
    id: 'D',
    description: 'GS7 delete parent member call',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('student.introduce();', '');
      content = content.replace('student.name =', '//');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must call at least one inherited member'
  },
  {
    id: 'E',
    description: 'GS7 delete child own member',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('student.study();', '');
      content = content.replace('student.school =', '//');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must call/use Student subclass specific members'
  },
  {
    id: 'F',
    description: 'GS7 handson delete expected observation',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/"handson":\s*\{[^}]*\}/, '"handson": { "ja": "", "zh": "" }');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Missing Japanese text'
  },
  {
    id: 'G',
    description: 'GS8 learner-visible text has "教材100ページ"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('"zh": "程序运行与内存管理"', '"zh": "程序运行与内存管理 教材100ページ"');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Found forbidden pattern/noise'
  },
  {
    id: 'H',
    description: 'GS8 delete Japanese "不保证立即执行 GC" disclaimer',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/保証はない/g, '保証する');
      content = content.replace(/保証されません/g, '保証する');
      content = content.replace(/とは限りません/g, '保証する');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Japanese content must contain warning/disclaimer'
  },
  {
    id: 'I',
    description: 'GS8 delete Chinese "不保证立即回收" disclaimer',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/不保证/g, '保证');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Chinese content must contain warning/disclaimer'
  },
  {
    id: 'J',
    description: 'GS8 expectedOutput has "GC已完成" assertion',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/"expectedOutput":\s*"[^"]*"/, '"expectedOutput": "Created: Data-1\\nReference cleared (set to null)\\nGC completed"');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must not assert that GC actually finished'
  },
  {
    id: 'K',
    description: 'GS8 adds "finalize()"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('static class SampleObject {', 'static class SampleObject { protected void finalize() {}');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must not use finalize()'
  },
  {
    id: 'L',
    description: 'GS8 adds "Thread.sleep()"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('System.gc();', 'System.gc(); Thread.sleep(100);');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must not use Thread.sleep()'
  },
  {
    id: 'M',
    description: 'GS8 handson says "确认对象一定已被回收"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/"handson":\s*\{[^}]*\}/, '"handson": { "ja": "確認する", "zh": "确认对象一定已被回收" }');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'must not ask to confirm GC or observe timing'
  },
  {
    id: 'N',
    description: 'GS8 handson reverted to collections template',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch12.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/"handson":\s*\{[^}]*\}/, '"handson": { "ja": "確認する", "zh": "修改集合框架" }');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Reverted template check'
  },
  {
    id: 'O',
    description: 'Ordinary Java example has "int score = 90;"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('student.school = \\"Tech Academy\\";', 'student.school = \\"Tech Academy\\";\\n    int score = 90;');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 0,
    expectOutputContains: 'Completed with 0 errors and 0 warnings'
  },
  {
    id: 'P',
    description: 'Java example has "options" or "correctAnswer"',
    mutate: (tempRoot) => {
      const file = path.join(tempRoot, 'packages/java-course-b/data/chapters/java-ch07.js');
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace('"objectives": [', '"options": [], "objectives": [');
      fs.writeFileSync(file, content, 'utf8');
    },
    expectedExitCode: 1,
    expectOutputContains: 'Forbidden Quiz structural key found'
  },
  {
    id: 'Q',
    description: 'Current real repository check',
    mutate: () => {
      // No mutation
    },
    expectedExitCode: 0,
    expectOutputContains: 'Completed with 0 errors and 0 warnings'
  }
];

function setupTempDir() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'java-gs7-gs8-rebuild-selftest-'));

  // Create packages structure
  fs.mkdirSync(path.join(tempDir, 'packages/java-course-b/data/chapters'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'packages/java-course-a/data/chapters'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'tools'), { recursive: true });

  // Copy files
  fs.copyFileSync(
    path.join(root, 'packages/java-course-b/data/chapters/java-ch07.js'),
    path.join(tempDir, 'packages/java-course-b/data/chapters/java-ch07.js')
  );
  fs.copyFileSync(
    path.join(root, 'packages/java-course-b/data/chapters/java-ch12.js'),
    path.join(tempDir, 'packages/java-course-b/data/chapters/java-ch12.js')
  );

  const ch05 = path.join(root, 'packages/java-course-a/data/chapters/java-ch05.js');
  if (fs.existsSync(ch05)) {
    fs.copyFileSync(ch05, path.join(tempDir, 'packages/java-course-a/data/chapters/java-ch05.js'));
  }
  const ch06 = path.join(root, 'packages/java-course-a/data/chapters/java-ch06.js');
  if (fs.existsSync(ch06)) {
    fs.copyFileSync(ch06, path.join(tempDir, 'packages/java-course-a/data/chapters/java-ch06.js'));
  }

  fs.copyFileSync(
    path.join(root, 'tools/check_r7_java_gs7_gs8_contract.js'),
    path.join(tempDir, 'tools/check_r7_java_gs7_gs8_contract.js')
  );

  return tempDir;
}

function cleanTempDir(tempDir) {
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

console.log('# R7.GS7-GS8-REBUILD Self-Test Results\n');
console.log('| 测试 | mutation | command | exit code | 结果 | 关键输出 |');
console.log('|---|---|---|---:|---|---|');

let allPassed = true;

tests.forEach(test => {
  let tempDir = null;
  let cmd = '';
  let exitCode = 0;
  let output = '';

  try {
    if (test.id === 'Q') {
      cmd = 'node tools/check_r7_java_gs7_gs8_contract.js';
      const res = cp.spawnSync('node', ['tools/check_r7_java_gs7_gs8_contract.js'], { encoding: 'utf8' });
      exitCode = res.status;
      output = res.stdout + '\n' + res.stderr;
    } else {
      tempDir = setupTempDir();
      test.mutate(tempDir);
      cmd = `node tools/check_r7_java_gs7_gs8_contract.js --root "${tempDir}"`;

      const res = cp.spawnSync('node', [
        path.join(tempDir, 'tools/check_r7_java_gs7_gs8_contract.js'),
        '--root',
        tempDir
      ], { encoding: 'utf8' });

      exitCode = res.status;
      output = res.stdout + '\n' + res.stderr;
    }
  } catch (err) {
    exitCode = -999;
    output = err.message;
  } finally {
    if (tempDir) {
      cleanTempDir(tempDir);
    }
  }

  const outputClean = output.replace(/\r?\n/g, ' ').substring(0, 100);
  const match = exitCode === test.expectedExitCode && output.includes(test.expectOutputContains);
  const statusStr = match ? 'PASS' : 'FAIL';

  if (!match) {
    allPassed = false;
  }

  console.log(`| ${test.id} | ${test.description} | \`${cmd}\` | ${exitCode} | **${statusStr}** | ${outputClean} |`);
});

if (allPassed) {
  console.log('\nAll mutation self-tests passed successfully!');
  process.exit(0);
} else {
  console.error('\nSome mutation self-tests failed.');
  process.exit(1);
}
