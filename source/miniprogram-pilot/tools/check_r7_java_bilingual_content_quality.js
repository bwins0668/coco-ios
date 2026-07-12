const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'packages/java-course/data/java-course-manifest.js');
const BANNED = [/TODO/i, /TBD/i, /待补充/, /内容省略/, /説明省略/, /同教材/, /同上/, /后续再写/, /自行理解/, /^略$/];

function fail(message) {
  console.error('[R7 Java bilingual quality] FAIL:', message);
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
if (!lessons.length) fail('no lessons loaded');

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function assertPair(obj, label, lessonId) {
  if (!obj || !text(obj.ja) || !text(obj.zh)) fail(lessonId + ' missing bilingual pair: ' + label);
  for (const rx of BANNED) {
    if (rx.test(obj.ja) || rx.test(obj.zh)) fail(lessonId + ' banned placeholder in ' + label);
  }
}

const seenExplanations = new Map();
for (const lesson of lessons) {
  const id = lesson.lessonId || '(unknown)';
  if (!lesson.chapterId || !Number.isInteger(lesson.order)) fail(id + ' missing chapter/order');
  assertPair(lesson.title, 'title', id);
  if (!lesson.sourceRef || !lesson.sourceRef.sourceId || !lesson.sourceRef.chapter || !lesson.sourceRef.section) {
    fail(id + ' missing sourceRef');
  }
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 2) fail(id + ' needs at least 2 objectives');
  lesson.objectives.forEach((item, i) => assertPair(item, 'objective ' + i, id));
  if (!Array.isArray(lesson.prerequisites) || lesson.prerequisites.length < 1) fail(id + ' needs prerequisites');
  lesson.prerequisites.forEach((item, i) => assertPair(item, 'prerequisite ' + i, id));
  if (!Array.isArray(lesson.blocks) || lesson.blocks.length < 4) fail(id + ' needs content blocks');
  lesson.blocks.forEach((block, i) => {
    if (!block.semanticKey || !block.type || !block.title) fail(id + ' block missing metadata ' + i);
    assertPair(block.title, 'block title ' + i, id);
    if (!text(block.ja) || !text(block.zh)) fail(id + ' block missing bilingual body ' + i);
    const key = text(block.zh).slice(0, 120);
    seenExplanations.set(key, (seenExplanations.get(key) || 0) + 1);
  });
  if (!Array.isArray(lesson.terms) || lesson.terms.length < 2) fail(id + ' needs at least 2 terms');
  lesson.terms.forEach((term, i) => {
    if (!text(term.en) || !text(term.ja) || !text(term.zh) || !text(term.explanationJa) || !text(term.explanationZh)) {
      fail(id + ' incomplete term ' + i);
    }
  });
  if (!Array.isArray(lesson.codeExamples) || lesson.codeExamples.filter((x) => x.runnable).length < 1) fail(id + ' needs runnable code example');
  lesson.codeExamples.forEach((example, i) => {
    if (!example.exampleId || !example.className || !text(example.code) || !text(example.expectedOutput)) fail(id + ' incomplete code example ' + i);
    if (!Array.isArray(example.lineNotes) || example.lineNotes.length < 3) fail(id + ' needs 3+ line notes');
    example.lineNotes.forEach((note, n) => assertPair(note, 'line note ' + i + '.' + n, id));
  });
  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 2) fail(id + ' needs 2+ common mistakes');
  lesson.commonMistakes.forEach((item, i) => assertPair(item, 'mistake ' + i, id));
  assertPair(lesson.handson, 'handson', id);
  assertPair(lesson.summary, 'summary', id);
  assertPair(lesson.nextLessonBridge, 'next bridge', id);
}

for (const [body, count] of seenExplanations.entries()) {
  if (body.length > 40 && count > 5) fail('repeated explanation body appears ' + count + ' times: ' + body);
}

console.log('[R7 Java bilingual quality] PASS:', lessons.length, 'lessons');
