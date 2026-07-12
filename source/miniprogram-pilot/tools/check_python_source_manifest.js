const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ALLOWED_VISIBLE = [
  'python-0007-gs1-run-visible-output',
  'python-0008-gs2-values-and-variables',
  'python-0009-7d37969c-第-3-章-列表简介',
  'python-0010-921b265b-第-4-章-操作列表',
  'python-0011-5c80c609-第-5-章-if语句'
];

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function visibleIdsFromCourseManifest(manifest) {
  const ids = [];
  (manifest.chapters || []).forEach((chapter) => {
    (chapter.sections || []).forEach((section) => ids.push(section.lessonId));
  });
  return ids;
}

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

function fail(problems, message) {
  problems.push(message);
}

function readModule(root, rel, problems) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(problems, 'missing file: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function visibleLessonRoutes(root) {
  const appFile = path.join(root, 'app.json');
  if (!fs.existsSync(appFile)) return [];
  const app = JSON.parse(fs.readFileSync(appFile, 'utf8'));
  const pkg = (app.subpackages || []).find((item) => item.root === 'packages/python-course');
  if (!pkg) return [];
  return (pkg.pages || []).map((page) => '/packages/python-course/' + page);
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];
  const mod = readModule(root, 'packages/python-course/data/python-source-manifest.js', errors);
  if (!mod) return report(errors, warnings);
  const manifest = mod.pythonSourceManifest || mod;

  if (!manifest.epub || !/^[0-9A-F]{64}$/.test(manifest.epub.sha256 || '')) fail(errors, 'EPUB SHA-256 missing or invalid');
  if (!manifest.opf || !manifest.opf.metadata || !Object.keys(manifest.opf.metadata).length) fail(errors, 'EPUB metadata missing');
  if (!manifest.nav || !manifest.nav.ncxPath) fail(errors, 'NCX path missing');
  if (!Array.isArray(manifest.spine) || !manifest.spine.length) fail(errors, 'spine missing');

  const sourceUnits = manifest.sourceUnits || [];
  if (!sourceUnits.length) fail(errors, 'sourceUnits missing');
  const ids = new Set();
  const orders = new Set();
  let lessonCandidateCount = 0;
  let explicitExclusionCount = 0;
  for (const unit of sourceUnits) {
    if (!unit.sourceUnitId) fail(errors, 'sourceUnitId missing');
    if (ids.has(unit.sourceUnitId)) fail(errors, 'duplicate sourceUnitId: ' + unit.sourceUnitId);
    ids.add(unit.sourceUnitId);
    if (!unit.sourceOrder) fail(errors, 'sourceOrder missing: ' + unit.sourceUnitId);
    if (orders.has(unit.sourceOrder)) fail(errors, 'duplicate sourceOrder: ' + unit.sourceOrder);
    orders.add(unit.sourceOrder);
    if (!Array.isArray(unit.tocPath) || !unit.tocPath.length) fail(errors, 'tocPath missing: ' + unit.sourceUnitId);
    if (!unit.displayTitle) fail(errors, 'displayTitle missing: ' + unit.sourceUnitId);
    if (!['lesson_candidate', 'parent_group_only', 'explicit_exclusion'].includes(unit.inclusion)) {
      fail(errors, 'invalid inclusion: ' + unit.sourceUnitId);
    }
    if (unit.inclusion === 'lesson_candidate') lessonCandidateCount += 1;
    if (unit.inclusion === 'explicit_exclusion') {
      explicitExclusionCount += 1;
      if (!unit.exclusionReason) fail(errors, 'explicit_exclusion missing reason: ' + unit.sourceUnitId);
    }
  }

  if (!manifest.coverage || manifest.coverage.deepestSourceUnitCount !== sourceUnits.length) {
    fail(errors, 'coverage deepestSourceUnitCount does not match sourceUnits');
  }
  if (manifest.coverage && manifest.coverage.lessonCandidateCount !== lessonCandidateCount) {
    fail(errors, 'coverage lessonCandidateCount mismatch');
  }
  if (manifest.coverage && manifest.coverage.explicitExclusionCount !== explicitExclusionCount) {
    fail(errors, 'coverage explicitExclusionCount mismatch');
  }

  const courseLessons = manifest.courseLessons || [];
  const lessonBySource = new Map();
  for (const lesson of courseLessons) {
    if (!lesson.sourceUnitId || !ids.has(lesson.sourceUnitId)) fail(errors, 'courseLesson sourceUnitId missing from sourceUnits: ' + (lesson.sourceUnitId || ''));
    if (lessonBySource.has(lesson.sourceUnitId)) fail(errors, 'duplicate course lesson for source unit: ' + lesson.sourceUnitId);
    lessonBySource.set(lesson.sourceUnitId, lesson);
    if (!['planned', 'golden', 'published', 'mapped'].includes(lesson.status)) fail(errors, 'invalid course lesson status: ' + lesson.courseLessonId);
  }
  for (const unit of sourceUnits) {
    if (unit.inclusion === 'lesson_candidate' && !lessonBySource.has(unit.sourceUnitId)) {
      fail(errors, 'lesson_candidate not mapped: ' + unit.sourceUnitId);
    }
  }

  for (const lesson of courseLessons) {
    const unit = sourceUnits.find((item) => item.sourceUnitId === lesson.sourceUnitId);
    if (unit && unit.inclusion === 'parent_group_only' && lesson.status === 'published') {
      fail(errors, 'parent_group_only published as lesson: ' + unit.sourceUnitId);
    }
  }

  const ledger = manifest.exclusionLedger || [];
  for (const entry of ledger) {
    if (!entry.reason) fail(errors, 'exclusionLedger entry missing reason: ' + entry.sourceUnitId);
  }

  const visibility = manifest.releaseVisibility || {};
  const visibleLessons = visibility.visibleCourseLessonIds || [];
  const golden = manifest.goldenSelection || [];
  const publicSummary = readModule(root, 'utils/python-public-course-summary.js', errors) || {};
  const courseManifestModule = readModule(root, 'packages/python-course/data/python-course-manifest.js', errors) || {};
  const manifestVisible = visibleIdsFromCourseManifest(courseManifestModule.manifest || courseManifestModule);
  const publicVisible = publicSummary.visibleLessonIds || [];
  if (!arraysEqual(visibleLessons, publicVisible)) fail(errors, 'releaseVisibility must match main-package public projection visibleLessonIds');
  if (!arraysEqual(publicVisible, manifestVisible)) fail(errors, 'public projection visibleLessonIds must match Python course manifest sections');
  if (visibleLessons.length < ALLOWED_VISIBLE.length) fail(errors, 'releaseVisibility must include accepted GS1, GS2, and Domain1A baseline');
  for (const id of ALLOWED_VISIBLE) {
    if (!visibleLessons.includes(id)) fail(errors, 'releaseVisibility missing visible lesson: ' + id);
  }
  if (golden.length !== 2) fail(errors, 'goldenSelection must contain GS1 and GS2');
  for (const lesson of courseLessons) {
    const isVisible = visibleLessons.includes(lesson.courseLessonId);
    if (isVisible && !['golden', 'published'].includes(lesson.status)) fail(errors, 'visible lesson is not golden/published: ' + lesson.courseLessonId);
    if (!isVisible && lesson.status === 'published') fail(errors, 'non-visible lesson marked published: ' + lesson.courseLessonId);
  }

  const routes = visibleLessonRoutes(root).join('\n');
  if (routes.includes('planned')) fail(errors, 'planned lesson route exposed in app pages');

  const raw = fs.readFileSync(path.join(root, 'packages/python-course/data/python-source-manifest.js'), 'utf8');
  if (/TODO|TBD|z-library|1lib|z-lib/i.test(raw)) fail(errors, 'source manifest contains placeholder or source site text');
  if (/def\s+\w+\([^)]*\):[\s\S]{800,}/.test(raw)) fail(errors, 'source manifest appears to contain long textbook code');
  if (warnings.length) fail(errors, 'warnings are not allowed: ' + warnings.join('; '));
  return report(errors, warnings);
}

function report(errors, warnings) {
  if (errors.length || warnings.length) {
    console.error('[Python source manifest] FAIL');
    for (const err of errors) console.error('ERROR:', err);
    for (const warn of warnings) console.error('WARNING:', warn);
    process.exit(1);
  }
  console.log('[Python source manifest] PASS: 0 errors, 0 warnings');
}

main();
