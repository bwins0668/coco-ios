const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JAVA_ROOTS = ['packages/java-course', 'packages/java-course-a', 'packages/java-course-b', 'packages/java-course-c'].map((rel) => path.join(ROOT, rel));
const banned = /\b(options|answer|correctAnswer|score|quiz|choice|questionBank|wrongQuestion|srs)\b/i;
const bannedUi = /(选择题|单选|多选|判断题|提交答案|正确答案|答题卡|错题|判分)/;

function fail(message) {
  console.error('[R7 Java no-quiz contract] FAIL:', message);
  process.exit(1);
}

function walk(dir) {
  if (!fs.existsSync(dir)) fail('missing Java package');
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

const files = JAVA_ROOTS.flatMap((root) => walk(root)).filter((file) => /\.(js|wxml|wxss|json)$/.test(file));
if (!files.length) fail('no Java package files');

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const body = fs.readFileSync(file, 'utf8');
  if (banned.test(body)) fail('banned quiz/SRS token in ' + rel);
  if (/\.(wxml|js)$/.test(file) && bannedUi.test(body)) fail('banned quiz UI text in ' + rel);
  if (/require\(['"].*(quiz|wrong|spaced-repetition|storage)/i.test(body)) fail('Java package calls quiz/wrong/SRS/storage module in ' + rel);
}

console.log('[R7 Java no-quiz contract] PASS:', files.length, 'files scanned');
