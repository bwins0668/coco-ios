#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHARD_ROOT = 'packages/python-course-foundations-b';

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

function requireFresh(root, rel, errors, optional) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    if (!optional) fail(errors, 'missing module: ' + rel);
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

function normalizeOutput(value) {
  return String(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n$/, '');
}

function codeUsesInput(code) {
  return /\binput\s*\(/.test(String(code || ''));
}

function findUvPython311() {
  const appData = process.env.APPDATA;
  if (!appData) return null;
  const base = path.join(appData, 'uv', 'python');
  if (!fs.existsSync(base)) return null;
  const matches = fs.readdirSync(base)
    .filter((name) => /^cpython-3\.11\./.test(name))
    .sort()
    .reverse();
  for (const name of matches) {
    const exe = path.join(base, name, 'python.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

function runPython(code, stdinText, timeoutMs) {
  const candidates = [];
  if (process.env.PYTHON) candidates.push({ command: process.env.PYTHON, args: [] });
  const uvPython = findUvPython311();
  if (uvPython) candidates.push({ command: uvPython, args: [] });
  candidates.push({ command: 'py', args: ['-3.11'] });
  candidates.push({ command: 'python', args: [] });

  let last = null;
  for (const candidate of candidates) {
    const result = cp.spawnSync(candidate.command, candidate.args.concat(['-c', code]), {
      input: stdinText,
      encoding: 'utf8',
      timeout: timeoutMs,
      windowsHide: true
    });
    last = {
      command: candidate.command + (candidate.args.length ? ' ' + candidate.args.join(' ') : ''),
      status: result.status,
      signal: result.signal,
      error: result.error,
      stdout: result.stdout || '',
      stderr: result.stderr || ''
    };
    if (!result.error || result.error.code !== 'ENOENT') return last;
  }
  return last || { command: '<none>', error: new Error('no Python runner found'), stdout: '', stderr: '' };
}

function collectLessons(root, errors) {
  const lessons = [];
  const legacy = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors, true);
  if (legacy && Array.isArray(legacy.lessons)) {
    legacy.lessons.forEach((lesson) => lessons.push({ packageRoot: 'packages/python-course', lesson }));
  }
  const shardManifest = requireFresh(root, SHARD_ROOT + '/data/python-foundations-b-manifest.js', errors, false);
  if (shardManifest) {
    const manifest = shardManifest.manifest || shardManifest;
    (manifest.chapters || []).forEach((chapter) => {
      const shardFile = chapter.shard;
      if (!shardFile) {
        fail(errors, 'shard chapter missing shard file: ' + (chapter.chapterId || '<unknown>'));
        return;
      }
      const mod = requireFresh(root, SHARD_ROOT + '/data/chapters/' + shardFile, errors, false);
      if (mod && Array.isArray(mod.lessons)) {
        mod.lessons.forEach((lesson) => lessons.push({ packageRoot: SHARD_ROOT, lesson }));
      }
    });
  }
  return lessons;
}

function checkRenderer(root, errors) {
  const wxml = read(root, SHARD_ROOT + '/pages/lesson/lesson.wxml', errors);
  if (!/sampleInput/.test(wxml)) fail(errors, 'new shard lesson renderer does not consume sampleInput');
  if (!/入力例/.test(wxml)) fail(errors, 'new shard lesson renderer does not display Japanese input label');
  if (!/输入示例/.test(wxml)) fail(errors, 'new shard lesson renderer does not display Chinese input label');
}

function checkExample(entry, example, errors) {
  const lessonId = entry.lesson.lessonId || '<unknown lesson>';
  const exampleId = example.exampleId || '<unknown example>';
  const code = String(example.code || '');
  const hasInput = codeUsesInput(code);
  const sampleInput = example.sampleInput;

  if (!hasInput && sampleInput !== undefined) {
    fail(errors, lessonId + '/' + exampleId + ' provides sampleInput but code does not use input()');
  }
  if (!hasInput) return;

  if (entry.packageRoot !== SHARD_ROOT) {
    fail(errors, lessonId + '/' + exampleId + ' uses input() outside the controlled Python shard');
  }
  if (typeof sampleInput !== 'string' || sampleInput.length === 0) {
    fail(errors, lessonId + '/' + exampleId + ' uses input() but sampleInput is missing');
    return;
  }
  if (sampleInput.indexOf('\r') !== -1) {
    fail(errors, lessonId + '/' + exampleId + ' sampleInput must use LF, not CRLF');
  }
  const stdin = sampleInput.endsWith('\n') ? sampleInput : sampleInput + '\n';
  const result = runPython(code, stdin, 3000);
  if (result.error && result.error.code === 'ENOENT') {
    fail(errors, 'Python 3.11 runner not found for safe stdin execution');
    return;
  }
  if (result.error) {
    fail(errors, lessonId + '/' + exampleId + ' Python execution error: ' + result.error.message);
    return;
  }
  if (result.signal === 'SIGTERM' || result.error && result.error.code === 'ETIMEDOUT') {
    fail(errors, lessonId + '/' + exampleId + ' timed out; input lesson may wait for extra stdin');
    return;
  }
  if (result.status !== 0) {
    fail(errors, lessonId + '/' + exampleId + ' exited ' + result.status + ': ' + normalizeOutput(result.stderr));
    return;
  }
  const expected = normalizeOutput(example.expectedOutput);
  const actual = normalizeOutput(result.stdout);
  if (actual !== expected) {
    fail(errors, lessonId + '/' + exampleId + ' stdout mismatch: expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
  }
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  checkRenderer(root, errors);
  const lessons = collectLessons(root, errors);
  lessons.forEach((entry) => {
    (entry.lesson.codeExamples || []).forEach((example) => checkExample(entry, example, errors));
  });

  if (warnings.length) fail(errors, 'warnings are not allowed: ' + warnings.join('; '));
  if (errors.length) {
    console.error('[Python safe stdin contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    process.exit(1);
  }
  console.log('[Python safe stdin contract] PASS: 0 errors, 0 warnings');
}

main();
