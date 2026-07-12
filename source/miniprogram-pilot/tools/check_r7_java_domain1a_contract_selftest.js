/**
 * check_r7_java_domain1a_contract_selftest.js — TEMP A-Q self-tests.
 *
 * Tests for Domain1A fail-closed contract checker.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CONTRACT = path.join(ROOT, 'tools/check_r7_java_domain1a_contract.js');
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) { tests.push({ name, fn }); }

// --- TEMP A: Contract file exists ---
test('TEMP-A: contract file exists', () => {
  if (!fs.existsSync(CONTRACT)) throw new Error('contract file missing');
});

// --- TEMP B: Contract is valid JS ---
test('TEMP-B: contract is valid JS', () => {
  require(CONTRACT);
});

// --- TEMP C: GS1 frozen lesson hash matches baseline ---
test('TEMP-C: GS1 frozen lesson hash', () => {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_gs1_contract.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout).trim());
});

// --- TEMP D: GS2 frozen lesson hash matches baseline ---
test('TEMP-D: GS2 frozen lesson hash', () => {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_gs2_contract.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout).trim());
});

// --- TEMP E: No quiz token leakage ---
test('TEMP-E: no quiz token leakage', () => {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_no_quiz_contract.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (r.status !== 0) throw new Error('quiz tokens found');
});

// --- TEMP F: Bilingual content quality ---
test('TEMP-F: bilingual content quality', () => {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_bilingual_content_quality.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout).trim());
});

// --- TEMP G: Java compile 336 PASS ---
test('TEMP-G: Java compile 336 PASS', () => {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_examples_compile.js')], { cwd: ROOT, encoding: 'utf8', timeout: 360000 });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout).trim());
});

// --- TEMP H: ch01 has 13 lessons ---
test('TEMP-H: ch01 has 13 lessons', () => {
  const m = require(path.join(ROOT, 'packages/java-course-a/data/chapters/java-ch01.js'));
  if (!m.lessons || m.lessons.length !== 13) throw new Error('expected 13 lessons, got ' + (m.lessons ? m.lessons.length : 0));
});

// --- TEMP I: ch02 has 24 lessons ---
test('TEMP-I: ch02 has 24 lessons', () => {
  const m = require(path.join(ROOT, 'packages/java-course-a/data/chapters/java-ch02.js'));
  if (!m.lessons || m.lessons.length !== 24) throw new Error('expected 24 lessons, got ' + (m.lessons ? m.lessons.length : 0));
});

// --- TEMP J: lesson-002 has sourceRef pageStart 5 ---
test('TEMP-J: lesson-002 has sourceRef pageStart 5', () => {
  const m = require(path.join(ROOT, 'packages/java-course-a/data/chapters/java-ch01.js'));
  const l = m.lessons.find(x => x.lessonId === 'intro-ch01-lesson-002');
  if (!l || l.sourceRef.pageStart !== 5) throw new Error('pageStart != 5');
});

// --- TEMP K: lesson-003 has sourceRef pageStart 6 ---
test('TEMP-K: lesson-003 has sourceRef pageStart 6', () => {
  const m = require(path.join(ROOT, 'packages/java-course-a/data/chapters/java-ch01.js'));
  const l = m.lessons.find(x => x.lessonId === 'intro-ch01-lesson-003');
  if (!l || l.sourceRef.pageStart !== 6) throw new Error('pageStart != 6');
});

// --- TEMP L: lesson-001 (frozen) unchanged ---
test('TEMP-L: lesson-001 frozen fields match baseline', () => {
  const m = require(path.join(ROOT, 'packages/java-course-a/data/chapters/java-ch01.js'));
  const l = m.lessons.find(x => x.lessonId === 'intro-ch01-lesson-001');
  if (!l || l.title.ja !== 'プログラムとは') throw new Error('lesson-001 title ja changed');
  if (l.objectives.length < 2) throw new Error('lesson-001 objectives changed');
});

// --- TEMP M: All rebuilt lessons have allowed fields only ---
test('TEMP-M: rebuilt lessons only use allowed fields', () => {
  const allowed = new Set(['lessonId','chapterId','order','title','sourceRef','objectives','prerequisites','blocks','terms','codeExamples','lineNotes','sourceSectionRef','commonMistakes','handson','summary','nextLessonBridge','semanticKey','type','en','ja','zh','explanationJa','explanationZh','exampleId','className','runnable','code','expectedOutput','jaExplanation','zhExplanation','line','snippet']);
  const bannedNew = ['knowledgePoints','profile','semanticFidelity','pedagogicalDelta'];
  const rebuilt = ['intro-ch01-lesson-002','intro-ch01-lesson-003','intro-ch01-lesson-004','intro-ch01-lesson-005','intro-ch01-lesson-006','intro-ch02-lesson-001','intro-ch02-lesson-002','intro-ch02-lesson-003','intro-ch02-lesson-005','intro-ch02-lesson-006'];
  for (const ch of ['java-ch01','java-ch02']) {
    const m = require(path.join(ROOT, 'packages/java-course-a/data/chapters', ch + '.js'));
    for (const id of rebuilt) {
      const l = m.lessons.find(x => x.lessonId === id);
      if (!l) continue;
      if (l.knowledgePoints) throw new Error(id + ' has banned field knowledgePoints');
      if (l.profile) throw new Error(id + ' has banned field profile');
      if (l.semanticFidelity) throw new Error(id + ' has banned field semanticFidelity');
      if (l.pedagogicalDelta) throw new Error(id + ' has banned field pedagogicalDelta');
    }
  }
});

// --- TEMP N: No remote configured ---
test('TEMP-N: no remote configured', () => {
  const r = cp.spawnSync('git', ['remote'], { cwd: ROOT, encoding: 'utf8' });
  if ((r.stdout || '').trim()) throw new Error('remote present: ' + r.stdout.trim());
});

// --- TEMP O: No upstream ---
test('TEMP-O: no upstream configured', () => {
  const r = cp.spawnSync('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status === 0) throw new Error('upstream configured');
});

// --- TEMP P: push.default is nothing ---
test('TEMP-P: push.default = nothing', () => {
  const r = cp.spawnSync('git', ['config', '--local', 'push.default'], { cwd: ROOT, encoding: 'utf8' });
  if ((r.stdout || '').trim() !== 'nothing') throw new Error('push.default != nothing: ' + (r.stdout || '').trim());
});

// --- TEMP Q: HEAD is a commit (not baseline, post-commit state) ---
test('TEMP-Q: HEAD is a valid commit (post-commit state)', () => {
  const r = cp.spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  const head = (r.stdout || '').trim();
  if (head.length !== 40) throw new Error('HEAD is not a valid commit hash: ' + head);
  // After R7.DOMAIN-1A-R1 commit, HEAD must differ from baseline — verify it's not empty
  if (head === '56a9336314350a4d461a1f1603e146fd854bb0d4') throw new Error('HEAD still at baseline — commit was expected');
  // Verify the commit subject matches
  const subject = cp.spawnSync('git', ['log', '-1', '--format=%s', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  const msg = (subject.stdout || '').trim();
  if (msg !== 'feat(java): rebuild domain 1A program structure, output, and variable foundations') {
    throw new Error('unexpected commit subject: ' + msg);
  }
});

// --- Run ---
console.log('[Domain1A selftest] Running ' + tests.length + ' tests (TEMP A-Q)...');
for (const t of tests) {
  try {
    t.fn();
    console.log('  PASS ' + t.name);
    passed++;
  } catch (e) {
    console.log('  FAIL ' + t.name + ': ' + e.message);
    failed++;
  }
}
console.log('[Domain1A selftest] ' + passed + '/' + tests.length + ' passed, ' + failed + ' failed');
if (failed > 0) process.exit(1);
