#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ONE_MB = 1024 * 1024;
const PYTHON_SOFT_THRESHOLD = ONE_MB;
const PYTHON_SHARD_ROOT = 'packages/python-course-foundations-b';
const PYTHON_SHARD_SOURCE_ORDERS = new Set([13, 14, 15]);

function parseArgs(argv) {
  const args = { root: ROOT };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      args.root = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function fail(errors, message) {
  errors.push(message);
}

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(errors, 'missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function readJson(root, rel, errors) {
  const text = read(root, rel, errors);
  try {
    return text ? JSON.parse(text) : {};
  } catch (err) {
    fail(errors, rel + ' is not valid JSON: ' + err.message);
    return {};
  }
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(errors, 'missing module: ' + rel);
    return null;
  }
  try {
    delete require.cache[require.resolve(file)];
    return require(file);
  } catch (err) {
    fail(errors, 'cannot require ' + rel + ': ' + err.message);
    return null;
  }
}

function normalizeRel(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

function formatSize(bytes) {
  if (bytes >= ONE_MB) return (bytes / ONE_MB).toFixed(2) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}

function isSkippedRel(rel) {
  return rel === '.git' || rel.indexOf('.git/') === 0 ||
    rel === '.workbuddy' || rel.indexOf('.workbuddy/') === 0 ||
    rel === '.ai-bridge' || rel.indexOf('.ai-bridge/') === 0 ||
    rel === '.gpt-handoff' || rel.indexOf('.gpt-handoff/') === 0 ||
    rel === 'node_modules' || rel.indexOf('node_modules/') === 0 ||
    rel === 'outputs' || rel.indexOf('outputs/') === 0 ||
    rel === 'scratch' || rel.indexOf('scratch/') === 0 ||
    rel === 'artifacts' || rel.indexOf('artifacts/') === 0 ||
    rel === 'tools/test-artifacts' || rel.indexOf('tools/test-artifacts/') === 0 ||
    rel === 'tools/review-batches' || rel.indexOf('tools/review-batches/') === 0 ||
    rel === 'tools/generated-cache' || rel.indexOf('tools/generated-cache/') === 0 ||
    /^tools\/(?:.*\/)?__pycache__(?:\/|$)/.test(rel) ||
    rel === 'project.private.config.json' ||
    /(^|\/)devtools-.*\.log$/i.test(rel) || /\.patch$/i.test(rel) || /\.pyc$/i.test(rel) ||
    /translations_zh\.js$/i.test(rel);
}

function packIgnoreRules(root, errors) {
  const config = readJson(root, 'project.config.json', errors);
  return ((config.packOptions && config.packOptions.ignore) || [])
    .filter((rule) => rule && rule.type && rule.value)
    .map((rule) => ({ type: String(rule.type), value: normalizeRel(rule.value) }));
}

function isPackIgnoredRel(rel, rules) {
  const normalized = normalizeRel(rel);
  for (const rule of rules) {
    if (rule.type === 'folder' && (normalized === rule.value || normalized.indexOf(rule.value + '/') === 0)) return true;
    if (rule.type === 'file' && normalized === rule.value) return true;
    if (rule.type === 'suffix' && normalized.slice(-rule.value.length) === rule.value) return true;
  }
  return false;
}

function walk(root, dir, rules, files) {
  files = files || [];
  let entries = [];
  try {
    entries = fs.readdirSync(dir);
  } catch (err) {
    return files;
  }
  entries.forEach((name) => {
    const full = path.join(dir, name);
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (isSkippedRel(rel) || isPackIgnoredRel(rel, rules)) return;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(root, full, rules, files);
    else if (stat.isFile()) files.push({ rel, size: stat.size });
  });
  return files;
}

function computePackageSize(root, packageRoot, errors) {
  const rules = packIgnoreRules(root, errors);
  const files = walk(root, path.join(root, packageRoot), rules);
  return {
    root: packageRoot,
    size: files.reduce((sum, file) => sum + file.size, 0),
    fileCount: files.length,
    files
  };
}

function runTrueAudit(root, errors) {
  const result = cp.spawnSync('node', ['tools/audit_miniprogram_package_size.js'], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true
  });
  const output = ((result.stdout || '') + (result.stderr || '')).trim();
  if (result.status !== 0) {
    fail(errors, 'audit_miniprogram_package_size.js failed: ' + output.split(/\r?\n/).slice(-5).join(' | '));
    return output;
  }
  if (!/packages\/python-course:\s+[\d.]+\s+(?:KB|MB)/.test(output)) {
    fail(errors, 'package audit output did not include packages/python-course size');
  }
  if (fs.existsSync(path.join(root, PYTHON_SHARD_ROOT)) && !/packages\/python-course-foundations-b:\s+[\d.]+\s+(?:KB|MB)/.test(output)) {
    fail(errors, 'package audit output did not include packages/python-course-foundations-b size');
  }
  if (!/\[PASS\] Package size audit passed/.test(output)) {
    fail(errors, 'package audit did not report PASS');
  }
  return output;
}

function checkDocs(root, errors) {
  const ledgerDoc = read(root, 'docs/python-course/14_python_full_course_release_ledger.md', errors);
  const scaleDoc = read(root, 'docs/python-course/15_python_full_course_package_scale_plan.md', errors);
  const shardDoc = read(root, 'docs/python-course/20_python_shard_architecture.md', errors);
  if (!/699/.test(ledgerDoc) || !/releaseDomainKey/.test(ledgerDoc) || !/next_candidate/.test(ledgerDoc)) {
    fail(errors, 'release ledger doc must describe 699 candidates, releaseDomainKey, and next_candidate');
  }
  [
    '1.00 MB',
    '1.8 MB',
    '2 MB',
    'shard trigger',
    'R8.PYTHON-SHARD-P1',
    'main package',
    'public projection',
    'route',
    'subpackage runtime'
  ].forEach((needle) => {
    if (!scaleDoc.includes(needle)) fail(errors, 'package scale plan missing: ' + needle);
  });
  if (/不需要分包|无需分包|never shard|no shard needed/i.test(scaleDoc)) {
    fail(errors, 'package scale plan must not claim sharding is unnecessary');
  }
  [
    PYTHON_SHARD_ROOT,
    'Main package must not require',
    'Public Projection',
    'Package Scale'
  ].forEach((needle) => {
    if (!shardDoc.includes(needle)) fail(errors, 'shard architecture doc missing: ' + needle);
  });
}

function checkProjection(root, errors) {
  const summaryText = read(root, 'utils/python-public-course-summary.js', errors);
  [
    /blocks\s*:/,
    /codeExamples\s*:/,
    /expectedOutput\s*:/,
    /lineNotes\s*:/,
    /commonMistakes\s*:/,
    /handson\s*:/,
    /sourceUnitId/,
    /tocPath/,
    /lesson body/i
  ].forEach((pattern) => {
    if (pattern.test(summaryText)) fail(errors, 'main package projection contains learner body or source metadata: ' + pattern);
  });
  const homeJs = read(root, 'pages/home/home.js', errors);
  if (/require\([^)]*packages\/python-course/.test(homeJs)) fail(errors, 'main package home requires Python subpackage');
}

function checkLedgerTargets(root, errors) {
  const ledgerModule = requireFresh(root, 'tools/python-full-course-release-ledger.js', errors);
  if (!ledgerModule || !ledgerModule.buildPythonFullCourseReleaseLedger) return;
  const ledger = ledgerModule.buildPythonFullCourseReleaseLedger(root);
  if (!ledger.packageScale || ledger.packageScale.softThresholdBytes !== PYTHON_SOFT_THRESHOLD) {
    fail(errors, 'ledger packageScale soft threshold must be 1.00 MB');
  }
  if (!/1\.8MB/.test(ledger.packageScale.hardThresholdSource || '') || !/2MB/.test(ledger.packageScale.hardThresholdSource || '')) {
    fail(errors, 'ledger hard threshold source must mention audit 1.8MB and 2MB hard limit');
  }
  const entries = ledger.entries || [];
  const domains = ledger.releaseDomains || [];
  if (!entries.length || !domains.length) fail(errors, 'ledger entries/domains missing');
  entries.forEach((entry) => {
    if (!entry.packageTarget) fail(errors, 'ledger entry packageTarget missing: ' + entry.courseLessonId);
    const train1PublishedShard = entry.status === 'published' &&
      PYTHON_SHARD_SOURCE_ORDERS.has(entry.sourceOrder) &&
      entry.packageTarget === PYTHON_SHARD_ROOT;
    if ((entry.status === 'published' || entry.status === 'next_candidate') &&
      entry.packageTarget !== 'packages/python-course' &&
      !train1PublishedShard) {
      fail(errors, 'published/next candidate packageTarget must be current Python package: ' + entry.courseLessonId);
    }
  });
  domains.forEach((domain) => {
    if (!domain.packageTarget) fail(errors, 'ledger domain packageTarget missing: ' + domain.domainKey);
  });
  const targets = Array.from(new Set(entries.map((entry) => entry.packageTarget)));
  if (targets.length < 2) fail(errors, 'ledger must not assign all 699 entries to one packageTarget');
  if (entries.every((entry) => entry.packageTarget === 'packages/python-course')) {
    fail(errors, 'ledger assigns all content to current Python package');
  }
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  const pythonSize = computePackageSize(root, 'packages/python-course', errors);
  const shardExists = fs.existsSync(path.join(root, PYTHON_SHARD_ROOT));
  const shardSize = shardExists ? computePackageSize(root, PYTHON_SHARD_ROOT, errors) : null;
  const auditOutput = runTrueAudit(root, errors);
  if (pythonSize.size >= PYTHON_SOFT_THRESHOLD) {
    fail(errors, 'packages/python-course is at or above 1.00 MB soft threshold: ' + formatSize(pythonSize.size));
  }
  if (shardSize && shardSize.size >= PYTHON_SOFT_THRESHOLD) {
    fail(errors, PYTHON_SHARD_ROOT + ' is at or above 1.00 MB soft threshold: ' + formatSize(shardSize.size));
  }
  if (!/PACKAGE_FAIL\s*=\s*1\.8\s*\*\s*ONE_MB/.test(read(root, 'tools/audit_miniprogram_package_size.js', errors))) {
    fail(errors, 'audit_miniprogram_package_size.js hard target source changed from 1.8 MB');
  }
  if (!/HARD_LIMIT\s*=\s*2\s*\*\s*ONE_MB/.test(read(root, 'tools/audit_miniprogram_package_size.js', errors))) {
    fail(errors, 'audit_miniprogram_package_size.js WeChat hard limit source changed from 2 MB');
  }
  checkLedgerTargets(root, errors);
  checkProjection(root, errors);
  checkDocs(root, errors);

  if (warnings.length) fail(errors, 'warnings are not allowed: ' + warnings.join('; '));
  if (errors.length) {
    console.error('[Python package scale contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    if (auditOutput) console.error('AUDIT:', auditOutput.split(/\r?\n/).filter((line) => /packages\/python-course|\[PASS\]|\[FAIL\]/.test(line)).join(' | '));
    process.exit(1);
  }
  console.log('[Python package scale contract] PASS: 0 errors, 0 warnings');
  console.log('packages/python-course:', formatSize(pythonSize.size), '(' + pythonSize.fileCount + ' files)');
  if (shardSize) console.log(PYTHON_SHARD_ROOT + ':', formatSize(shardSize.size), '(' + shardSize.fileCount + ' files)');
  console.log('soft threshold: 1.00 MB');
}

main();
