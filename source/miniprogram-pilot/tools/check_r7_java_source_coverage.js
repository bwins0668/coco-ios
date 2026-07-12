const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_SECTIONS = path.join(ROOT, 'packages/java-course/data/source-sections.js');
const MANIFEST = path.join(ROOT, 'packages/java-course/data/java-course-manifest.js');
const REQUIRED_DOCS = [
  'docs/java-course/00_source_inventory.md',
  'docs/java-course/01_source_extraction_log.md',
  'docs/java-course/02_source_to_course_mapping.md',
  'docs/java-course/03_java_curriculum_manifest.md'
];

function fail(message) {
  console.error('[R7 Java source coverage] FAIL:', message);
  process.exit(1);
}

function readModule(file) {
  if (!fs.existsSync(file)) fail('missing module: ' + path.relative(ROOT, file));
  delete require.cache[require.resolve(file)];
  return require(file);
}

for (const rel of REQUIRED_DOCS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) fail('missing doc: ' + rel);
  const body = fs.readFileSync(file, 'utf8');
  if (!body.trim()) fail('empty doc: ' + rel);
}

const sourceModule = readModule(SOURCE_SECTIONS);
const manifestModule = readModule(MANIFEST);
const sources = sourceModule.sources || [];
const sourceSections = sourceModule.sections || [];
const manifest = manifestModule.manifest || manifestModule;
const chapters = manifest.chapters || [];

if (sources.length < 2) fail('expected both intro and practice Java sources');
if (!sourceSections.length) fail('no source sections declared');
if (!chapters.length) fail('no Java chapters declared');

const sourceIds = new Set(sources.map((source) => source.sourceId));
for (const source of sources) {
  if (!source.sourceId || !source.fileName || !source.sha256 || !source.pageCount) {
    fail('source inventory row is incomplete: ' + JSON.stringify(source));
  }
}

const lessonBySourceKey = new Map();
let lessonCount = 0;
for (const chapter of chapters) {
  if (!chapter.chapterId || !chapter.sourceId || !chapter.sections) fail('chapter summary incomplete');
  if (!sourceIds.has(chapter.sourceId)) fail('chapter uses unknown sourceId: ' + chapter.chapterId);
  for (const section of chapter.sections) {
    lessonCount++;
    if (!section.sectionId || !section.sourceRef) fail('section missing id/sourceRef in ' + chapter.chapterId);
    const ref = section.sourceRef;
    if (!sourceIds.has(ref.sourceId)) fail('section uses unknown sourceId: ' + section.sectionId);
    if (!Number.isInteger(ref.pageStart) || !Number.isInteger(ref.pageEnd) || ref.pageEnd < ref.pageStart) {
      fail('invalid page range for ' + section.sectionId);
    }
    const key = [ref.sourceId, ref.chapter, ref.section, ref.pageStart, ref.pageEnd].join('|');
    if (lessonBySourceKey.has(key)) fail('duplicate source mapping: ' + key);
    lessonBySourceKey.set(key, section.sectionId);
  }
}

for (const item of sourceSections) {
  if (!item.sourceId || !item.chapter || !item.section || !Number.isInteger(item.pageStart) || !Number.isInteger(item.pageEnd)) {
    fail('source section incomplete: ' + JSON.stringify(item));
  }
  if (!sourceIds.has(item.sourceId)) fail('source section uses unknown sourceId: ' + item.sourceId);
  const key = [item.sourceId, item.chapter, item.section, item.pageStart, item.pageEnd].join('|');
  if (!lessonBySourceKey.has(key)) fail('missing lesson mapping for source section: ' + key);
}

if (lessonCount !== sourceSections.length) {
  fail('lesson/source section count mismatch: lessons=' + lessonCount + ' sections=' + sourceSections.length);
}

console.log('[R7 Java source coverage] PASS:', lessonCount, 'sections mapped from', sources.length, 'sources');
