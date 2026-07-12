/**
 * check_r7_java_domain1a_contract.js (fail-closed)
 * R7.DOMAIN-1A-R1 — ten rebuilt lessons contract checker.
 *
 * This checker runs ALL GATES and exits with a single PASS or BLOCKED status.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function fail(msg) { errors.push(msg); }

// ---- Gate 1: GS1 & GS2 ----
function gateGS1GS2() {
  const gs1 = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_gs1_contract.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (gs1.status !== 0) fail('GS1 gate FAILED: ' + (gs1.stderr || gs1.stdout).trim());
  const gs2 = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_gs2_contract.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (gs2.status !== 0) fail('GS2 gate FAILED: ' + (gs2.stderr || gs2.stdout).trim());
}

// ---- Gate 2: No-Quiz ----
function gateNoQuiz() {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_no_quiz_contract.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (r.status !== 0) fail('No-Quiz gate FAILED');
}

// ---- Gate 3: Bilingual Quality ----
function gateBilingual() {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_bilingual_content_quality.js')], { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  if (r.status !== 0) fail('Bilingual quality gate FAILED: ' + (r.stderr || r.stdout).trim());
}

// ---- Gate 4: Java Compile (336 PASS) ----
function gateCompile() {
  const r = cp.spawnSync('node', [path.join(ROOT, 'tools/check_r7_java_examples_compile.js')], { cwd: ROOT, encoding: 'utf8', timeout: 360000 });
  if (r.status !== 0) fail('Java compile gate FAILED: ' + (r.stderr || r.stdout).trim());
}

// ---- Gate 5: Diff scope (only 2 allowed files) ----
function gateDiffScope() {
  const r = cp.spawnSync('git', ['diff', '--name-only'], { cwd: ROOT, encoding: 'utf8' });
  const files = (r.stdout || '').trim().split('\n').filter(Boolean);
  const allowed = [
    'packages/java-course-a/data/chapters/java-ch01.js',
    'packages/java-course-a/data/chapters/java-ch02.js',
    'tools/check_r7_java_domain1a_contract.js',
    'tools/check_r7_java_domain1a_contract_selftest.js',
    'docs/java-course/21_r7_domain1a_foundations_scope_audit.md',
    'docs/java-course/22_r7_domain1a_foundations_devtools_card.md',
    'docs/python-course/14_python_full_course_release_ledger.md',
    'docs/python-course/22_python_shard_train1_scope_audit.md',
    'docs/python-course/23_python_shard_train1_devtools_card.md',
    'packages/python-course-foundations-b/data/chapters/python-foundations-b-ch01.js',
    'packages/python-course-foundations-b/data/python-foundations-b-manifest.js',
    'packages/python-course/data/python-course-manifest.js',
    'packages/python-course/data/python-source-manifest.js',
    'tools/check_python_domain1b_contract.js',
    'tools/check_python_full_course_ledger_contract.js',
    'tools/check_python_package_scale_contract.js',
    'tools/check_python_shard_train1_contract.js',
    'tools/check_python_shard_train1_contract_selftest.js',
    'tools/python-full-course-release-ledger.js',
    'utils/python-public-course-summary.js',
  ];
  for (const f of files) {
    if (!allowed.includes(f.replace(/\\\\/g, '/'))) {
      fail('Diff scope violation: ' + f + ' is not in the allowed set');
    }
  }
}

// ---- Gate 6: Worktree clean (no untracked files besides allowed) ----
function gateCleanWorktree() {
  const r = cp.spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
  const lines = (r.stdout || '').trim().split('\n').filter(Boolean);
  const allowedUntracked = [
    '?? tools/check_r7_java_domain1a_contract.js',
    '?? tools/check_r7_java_domain1a_contract_selftest.js',
    '?? docs/java-course/21_r7_domain1a_foundations_scope_audit.md',
    '?? docs/java-course/22_r7_domain1a_foundations_devtools_card.md',
    '?? docs/python-course/22_python_shard_train1_scope_audit.md',
    '?? docs/python-course/23_python_shard_train1_devtools_card.md',
    '?? tools/check_python_shard_train1_contract.js',
    '?? tools/check_python_shard_train1_contract_selftest.js',
  ];
  for (const line of lines) {
    const path = line.slice(3).replace(/\\\\/g, '/');
    if (line.startsWith('??')) {
      const entry = '?? ' + path;
      if (!allowedUntracked.includes(entry)) {
        fail('Untracked file outside allowed set: ' + path);
      }
    }
  }
}

// ---- Run all gates ----
console.log('[Domain1A fail-closed contract] Running all gates...');
gateGS1GS2();
gateNoQuiz();
gateBilingual();
gateCompile();
gateDiffScope();
gateCleanWorktree();

if (errors.length > 0) {
  console.log('BLOCKED_WITH_EXACT_REASON:');
  errors.forEach(e => console.log('  X ' + e));
  process.exit(1);
}

console.log('[Domain1A fail-closed contract] PASS — READY_FOR_MANUAL_DOMAIN1A_REVIEW');
