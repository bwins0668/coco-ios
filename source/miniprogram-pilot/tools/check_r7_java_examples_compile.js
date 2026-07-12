const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'packages/java-course/data/java-course-manifest.js');

function fail(message) {
  console.error('[R7 Java examples compile] FAIL:', message);
  process.exit(1);
}

if (!fs.existsSync(MANIFEST)) fail('missing manifest');
const manifest = require(MANIFEST).manifest;
const lessons = [];
for (const chapter of manifest.chapters || []) {
  const shard = path.join(ROOT, chapter.packageRoot || 'packages/java-course', 'data/chapters', chapter.shard);
  if (!fs.existsSync(shard)) fail('missing chapter shard: ' + chapter.chapterId);
  const mod = require(shard);
  lessons.push.apply(lessons, mod.lessons || []);
}
const examples = [];
for (const lesson of lessons) {
  for (const example of lesson.codeExamples || []) {
    if (example.runnable) examples.push({ lesson, example });
  }
}
if (!examples.length) fail('no runnable examples');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'r7-java-examples-'));
let checked = 0;

function run(command, args, cwd) {
  return childProcess.spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 8000, windowsHide: true });
}

for (const item of examples) {
  const lessonId = item.lesson.lessonId;
  const example = item.example;
  const dir = path.join(tmp, lessonId.replace(/[^a-zA-Z0-9_-]/g, '_'), example.exampleId);
  fs.mkdirSync(dir, { recursive: true });
  const javaFile = path.join(dir, example.className + '.java');
  fs.writeFileSync(javaFile, example.code, 'utf8');
  const compile = run('javac', [javaFile], dir);
  if (compile.status !== 0) fail(lessonId + '/' + example.exampleId + '/' + example.className + ' compile failed: ' + (compile.stderr || compile.stdout));
  const exec = run('java', ['-cp', dir, example.className], dir);
  if (exec.status !== 0) fail(lessonId + '/' + example.exampleId + '/' + example.className + ' run failed: ' + (exec.stderr || exec.stdout));
  const actual = (exec.stdout || '').replace(/\r\n/g, '\n').trim();
  const expected = String(example.expectedOutput || '').replace(/\r\n/g, '\n').trim();
  if (actual !== expected) fail(lessonId + '/' + example.exampleId + '/' + example.className + ' output mismatch expected=[' + expected + '] actual=[' + actual + ']');
  checked++;
}

console.log('[R7 Java examples compile] PASS:', checked, 'examples');
