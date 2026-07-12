const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JAVA_ROOT = path.join(ROOT, 'packages/java-course');
const MANIFEST = path.join(JAVA_ROOT, 'data/java-course-manifest.js');
const LOADER = path.join(JAVA_ROOT, 'utils/java-course-loader.js');

function fail(message) {
  console.error('[R7 Java runtime package] FAIL:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + path.relative(ROOT, file));
  return fs.readFileSync(file, 'utf8');
}

if (!fs.existsSync(MANIFEST)) fail('missing file: packages/java-course/data/java-course-manifest.js');
if (!fs.existsSync(LOADER)) fail('missing file: packages/java-course/utils/java-course-loader.js');
const manifestModule = require(MANIFEST);
const manifest = manifestModule.manifest || manifestModule;
const loader = require(LOADER);
const chapters = manifest.chapters || [];
if (!chapters.length) fail('manifest has no chapters');

let expectedLessons = 0;
for (const chapter of chapters) {
  expectedLessons += (chapter.sections || []).length;
  if (!chapter.packageRoot || !chapter.chapterRoute) fail('chapter missing package route metadata: ' + chapter.chapterId);
  const shard = path.join(ROOT, chapter.packageRoot, 'data/chapters', chapter.shard);
  if (!fs.existsSync(shard)) fail('missing chapter shard: ' + chapter.shard);
  const moduleData = require(shard);
  if (!moduleData.chapter || moduleData.chapter.chapterId !== chapter.chapterId) fail('chapter shard id mismatch: ' + chapter.chapterId);
  if (!Array.isArray(moduleData.lessons) || moduleData.lessons.length !== chapter.sections.length) fail('lesson count mismatch for ' + chapter.chapterId);
  const packageLoaderFile = path.join(ROOT, chapter.packageRoot, 'utils/java-course-loader.js');
  if (!fs.existsSync(packageLoaderFile)) fail('missing package loader for ' + chapter.packageRoot);
  const packageLoader = require(packageLoaderFile);
  if (!packageLoader.getChapterWithLessons(chapter.chapterId)) fail('package loader cannot resolve chapter: ' + chapter.chapterId);
  const firstInChapter = chapter.sections[0];
  if (!firstInChapter.lessonRoute || firstInChapter.lessonRoute.indexOf('/' + chapter.packageRoot + '/pages/lesson/lesson') !== 0) {
    fail('section missing package lesson route: ' + firstInChapter.lessonId);
  }
  if (!packageLoader.getLessonById(chapter.chapterId, firstInChapter.lessonId)) fail('package loader cannot resolve lesson: ' + firstInChapter.lessonId);
}

const lessons = [];
for (const chapter of chapters) {
  const moduleData = require(path.join(ROOT, chapter.packageRoot, 'data/chapters', chapter.shard));
  lessons.push.apply(lessons, moduleData.lessons || []);
}
if (lessons.length !== expectedLessons) fail('loader lesson count mismatch');

const firstChapter = chapters[0];
const firstSection = firstChapter.sections[0];
if (loader.getChapterWithLessons(firstChapter.chapterId)) fail('root loader should not load chapter body');
if (!loader.getFirstLessonRoute() || loader.getFirstLessonRoute() !== firstSection.lessonRoute) fail('root loader cannot resolve first lesson route');

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

for (const file of ['packages/java-course', 'packages/java-course-a', 'packages/java-course-b', 'packages/java-course-c'].flatMap((root) => walk(path.join(ROOT, root))).filter((file) => /\.(js|wxml)$/.test(file))) {
  const rel = path.relative(ROOT, file);
  const body = read(file);
  if (/require\(['"](?:\.\.\/){3,}data\//.test(body)) {
    fail('Java runtime depends on root data in ' + rel);
  }
}

for (const root of ['packages/java-course', 'packages/java-course-a', 'packages/java-course-b', 'packages/java-course-c']) {
  const lessonWxml = read(path.join(ROOT, root, 'pages/lesson/lesson.wxml'));
  const chapterWxml = read(path.join(ROOT, root, 'pages/chapter/chapter.wxml'));
  if (!/loadError/.test(lessonWxml) || !/返回/.test(lessonWxml)) fail(root + ' lesson page lacks real error state with return path');
  if (!/loadError/.test(chapterWxml) || !/返回/.test(chapterWxml)) fail(root + ' chapter page lacks real error state with return path');
}

console.log('[R7 Java runtime package] PASS:', chapters.length, 'chapters,', lessons.length, 'lessons');
