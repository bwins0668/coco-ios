#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXPECTED = {
  sourceUnits: 790,
  lessonCandidates: 699,
  parentGroups: 17,
  explicitExclusions: 74
};
const TRAIN1_SHARD_TARGET = 'packages/python-course-foundations-b';
const TRAIN1_SHARD_SOURCE_ORDERS = new Set([13, 14, 15]);

const ALLOWED_ENTRY_FIELDS = {
  sourceUnitId: true,
  courseLessonId: true,
  sourceOrder: true,
  tocPath: true,
  parentRelation: true,
  type: true,
  releaseDomainKey: true,
  releaseWave: true,
  status: true,
  packageTarget: true,
  publishedVisibility: true
};

const FORBIDDEN_LEDGER_PATTERNS = [
  /textbookPayload/i,
  /lessonBody/i,
  /bodyPayload/i,
  /codeExamples/i,
  /expectedOutput/i,
  /spineHref/i,
  /href\s*:/i,
  /anchor\s*:/i,
  /z-library|1lib|z-lib/i,
  /EPUB copied|copied lesson body/i
];

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

function normalizeTocPath(value) {
  return Array.isArray(value) ? value.join(' > ') : String(value || '');
}

function parentRelation(unit) {
  const parts = Array.isArray(unit.tocPath) ? unit.tocPath.slice(0, -1) : [];
  return parts.length ? parts.join(' > ') : 'root';
}

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

function checkCoverage(sourceManifest, ledger, errors) {
  const sourceUnits = sourceManifest.sourceUnits || [];
  const candidates = sourceUnits.filter((unit) => unit.inclusion === 'lesson_candidate');
  const parentGroups = sourceUnits.filter((unit) => unit.inclusion === 'parent_group_only');
  const explicitExclusions = sourceUnits.filter((unit) => unit.inclusion === 'explicit_exclusion');

  if (sourceUnits.length !== EXPECTED.sourceUnits) fail(errors, 'sourceUnits count must be 790, got ' + sourceUnits.length);
  if (candidates.length !== EXPECTED.lessonCandidates) fail(errors, 'lesson_candidate count must be 699, got ' + candidates.length);
  if (parentGroups.length !== EXPECTED.parentGroups) fail(errors, 'parent groups must be 17, got ' + parentGroups.length);
  if (explicitExclusions.length !== EXPECTED.explicitExclusions) fail(errors, 'explicit exclusions must be 74, got ' + explicitExclusions.length);
  if (!ledger.coverage || ledger.coverage.lessonCandidates !== EXPECTED.lessonCandidates) {
    fail(errors, 'ledger coverage lessonCandidates must be 699');
  }
  if (!Array.isArray(ledger.entries) || ledger.entries.length !== EXPECTED.lessonCandidates) {
    fail(errors, 'ledger entries must cover exactly 699 lesson candidates, got ' + ((ledger.entries || []).length));
  }
  if (!Array.isArray(ledger.explicitExclusions) || ledger.explicitExclusions.length !== EXPECTED.explicitExclusions) {
    fail(errors, 'ledger explicitExclusions must cover 74 exclusions');
  }
  explicitExclusions.forEach((unit) => {
    if (!unit.exclusionReason) fail(errors, 'explicit_exclusion missing reason: ' + unit.sourceUnitId);
  });
  (ledger.explicitExclusions || []).forEach((entry) => {
    if (!entry.exclusionReason) fail(errors, 'ledger explicit exclusion missing reason: ' + entry.sourceUnitId);
  });
}

function checkEntries(sourceManifest, ledger, publicIds, manifestIds, errors) {
  const allowedStatuses = new Set(ledger.ALLOWED_LEDGER_STATUSES || ['published', 'next_candidate', 'planned', 'deferred_asset_required', 'explicit_exclusion']);
  const sourceUnitsById = new Map((sourceManifest.sourceUnits || []).map((unit) => [unit.sourceUnitId, unit]));
  const courseLessonsById = new Map((sourceManifest.courseLessons || []).map((lesson) => [lesson.courseLessonId, lesson]));
  const candidateSourceIds = new Set((sourceManifest.sourceUnits || []).filter((unit) => unit.inclusion === 'lesson_candidate').map((unit) => unit.sourceUnitId));
  const sourceSeen = new Set();
  const courseSeen = new Set();
  const visibleSet = new Set((sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || []);

  (ledger.entries || []).forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (!ALLOWED_ENTRY_FIELDS[key]) fail(errors, 'ledger entry contains forbidden field ' + key + ': ' + (entry.courseLessonId || '<unknown>'));
    });
    Object.keys(ALLOWED_ENTRY_FIELDS).forEach((key) => {
      if (entry[key] === undefined || entry[key] === null || entry[key] === '') {
        fail(errors, 'ledger entry missing ' + key + ': ' + (entry.courseLessonId || '<unknown>'));
      }
    });
    const rawEntry = JSON.stringify(entry);
    FORBIDDEN_LEDGER_PATTERNS.forEach((pattern) => {
      if (pattern.test(rawEntry)) fail(errors, 'ledger entry includes forbidden payload pattern ' + pattern + ': ' + (entry.courseLessonId || '<unknown>'));
    });
    if (!allowedStatuses.has(entry.status)) fail(errors, 'invalid ledger status ' + entry.status + ': ' + entry.courseLessonId);
    if (sourceSeen.has(entry.sourceUnitId)) fail(errors, 'duplicate ledger sourceUnitId: ' + entry.sourceUnitId);
    sourceSeen.add(entry.sourceUnitId);
    if (courseSeen.has(entry.courseLessonId)) fail(errors, 'duplicate ledger courseLessonId: ' + entry.courseLessonId);
    courseSeen.add(entry.courseLessonId);
    if (!candidateSourceIds.has(entry.sourceUnitId)) fail(errors, 'ledger sourceUnitId is not lesson_candidate: ' + entry.sourceUnitId);
    const unit = sourceUnitsById.get(entry.sourceUnitId);
    const lesson = courseLessonsById.get(entry.courseLessonId);
    if (!unit) fail(errors, 'ledger sourceUnitId missing from sourceUnits: ' + entry.sourceUnitId);
    if (!lesson) fail(errors, 'ledger courseLessonId missing from courseLessons: ' + entry.courseLessonId);
    if (lesson && lesson.sourceUnitId !== entry.sourceUnitId) fail(errors, 'ledger sourceUnitId does not match courseLesson: ' + entry.courseLessonId);
    if (lesson && lesson.sourceOrder !== entry.sourceOrder) fail(errors, 'ledger sourceOrder does not match courseLesson: ' + entry.courseLessonId);
    if (unit && normalizeTocPath(unit.tocPath) !== entry.tocPath) fail(errors, 'ledger tocPath does not match source unit: ' + entry.courseLessonId);
    if (unit && parentRelation(unit) !== entry.parentRelation) fail(errors, 'ledger parentRelation does not match source unit: ' + entry.courseLessonId);
    if (unit && unit.type !== entry.type) fail(errors, 'ledger type does not match source unit: ' + entry.courseLessonId);
    const shouldBePublic = visibleSet.has(entry.courseLessonId);
    if (shouldBePublic && entry.status !== 'published') fail(errors, 'visible lesson must be ledger published: ' + entry.courseLessonId);
    if (shouldBePublic && entry.publishedVisibility !== 'public') fail(errors, 'visible lesson must have public publishedVisibility: ' + entry.courseLessonId);
    if (entry.status === 'published' && (!shouldBePublic || !publicIds.includes(entry.courseLessonId) || !manifestIds.includes(entry.courseLessonId))) {
      fail(errors, 'ledger published lesson is not visible in all public surfaces: ' + entry.courseLessonId);
    }
    const train1PublishedShard = entry.status === 'published' &&
      TRAIN1_SHARD_SOURCE_ORDERS.has(entry.sourceOrder) &&
      entry.packageTarget === TRAIN1_SHARD_TARGET;
    if ((entry.status === 'published' || entry.status === 'next_candidate') &&
      entry.packageTarget !== 'packages/python-course' &&
      !train1PublishedShard) {
      fail(errors, 'published/next candidate must stay in current Python package target: ' + entry.courseLessonId);
    }
  });

  candidateSourceIds.forEach((sourceUnitId) => {
    if (!sourceSeen.has(sourceUnitId)) fail(errors, 'lesson_candidate missing from ledger: ' + sourceUnitId);
  });
}

function checkVisibility(sourceManifest, publicSummary, courseManifest, errors) {
  const sourceVisible = (sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || [];
  const publicIds = publicSummary.visibleLessonIds || [];
  const manifestIds = visibleIdsFromCourseManifest(courseManifest);
  if (!arraysEqual(sourceVisible, publicIds)) fail(errors, 'source releaseVisibility and public projection visible IDs differ');
  if (!arraysEqual(publicIds, manifestIds)) fail(errors, 'public projection and Python course manifest visible IDs differ');
  const homeJs = read(ROOT, 'pages/home/home.js', errors);
  if (/require\([^)]*packages\/python-course/.test(homeJs)) fail(errors, 'main package home requires Python subpackage');
  if (!/visibleLessonIds\.length/.test(homeJs) && !/pythonPublicSummary\.visibleLessonIds\.length/.test(homeJs)) {
    fail(errors, 'home count must be derived from visibleLessonIds.length');
  }
  return { publicIds, manifestIds };
}

function checkDomains(sourceManifest, ledger, errors) {
  const entryById = new Map((ledger.entries || []).map((entry) => [entry.courseLessonId, entry]));
  const sourceUnitsById = new Map((sourceManifest.sourceUnits || []).map((unit) => [unit.sourceUnitId, unit]));
  const domains = ledger.releaseDomains || [];
  if (!Array.isArray(domains) || !domains.length) fail(errors, 'releaseDomains missing');
  const domainKeys = new Set();
  domains.forEach((domain) => {
    if (domainKeys.has(domain.domainKey)) fail(errors, 'duplicate domainKey: ' + domain.domainKey);
    domainKeys.add(domain.domainKey);
    if (!Array.isArray(domain.entryIds) || !domain.entryIds.length) fail(errors, 'domain missing entryIds: ' + domain.domainKey);
    if (domain.lessonCount < 1 || domain.lessonCount > 5) fail(errors, 'domain lessonCount must be 1-5: ' + domain.domainKey);
    if (domain.lessonCount !== (domain.entryIds || []).length) fail(errors, 'domain lessonCount does not match entryIds: ' + domain.domainKey);
    if (!domain.conceptTheme || /TODO|TBD|placeholder/i.test(domain.conceptTheme)) fail(errors, 'domain missing concept theme: ' + domain.domainKey);
    if (!domain.releaseWave) fail(errors, 'domain missing releaseWave: ' + domain.domainKey);
    if (!domain.packageTarget) fail(errors, 'domain missing packageTarget: ' + domain.domainKey);
    const entries = (domain.entryIds || []).map((id) => entryById.get(id));
    if (entries.some((entry) => !entry)) fail(errors, 'domain references unknown entry: ' + domain.domainKey);
    if (entries.some((entry) => entry && entry.releaseDomainKey !== domain.domainKey)) fail(errors, 'domain entry releaseDomainKey mismatch: ' + domain.domainKey);
    const sorted = entries.filter(Boolean).slice().sort((a, b) => a.sourceOrder - b.sourceOrder);
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i].sourceOrder !== sorted[i - 1].sourceOrder + 1) {
        fail(errors, 'domain sourceOrder is not continuous: ' + domain.domainKey);
      }
    }
    const units = sorted.map((entry) => sourceUnitsById.get(entry.sourceUnitId)).filter(Boolean);
    const parents = new Set(units.map(parentRelation));
    const topChapters = units.filter((unit) => unit.type === 'chapter' && (!unit.parentSourceUnitId || unit.depth <= 2));
    if ((parents.size > 1 || topChapters.length > 1) && domain.conceptContinuity !== true) {
      fail(errors, 'domain crosses unrelated parent/concept without continuity note: ' + domain.domainKey);
    }
    if ((parents.size > 1 || topChapters.length > 1) && !domain.continuityNote) {
      fail(errors, 'domain crosses concepts but lacks continuityNote: ' + domain.domainKey);
    }
  });
}

function checkStatusAndTargets(ledger, errors) {
  const entries = ledger.entries || [];
  const counts = {};
  entries.forEach((entry) => {
    counts[entry.status] = (counts[entry.status] || 0) + 1;
  });
  Object.keys(counts).forEach((status) => {
    if (!ledger.statusCounts || ledger.statusCounts[status] !== counts[status]) {
      fail(errors, 'statusCounts mismatch for ' + status);
    }
  });
  const total = Object.values(ledger.statusCounts || {}).reduce((sum, value) => sum + value, 0);
  if (total !== EXPECTED.lessonCandidates) fail(errors, 'ledger statusCounts must add up to 699 lesson candidates, got ' + total);
  const next = entries.filter((entry) => entry.status === 'next_candidate').sort((a, b) => a.sourceOrder - b.sourceOrder);
  const published = entries.filter((entry) => entry.status === 'published');
  const lastPublished = Math.max.apply(null, published.map((entry) => entry.sourceOrder));
  const firstUnpublished = entries
    .filter((entry) => entry.sourceOrder > lastPublished)
    .sort((a, b) => a.sourceOrder - b.sourceOrder)[0];
  if (!next.length && (!firstUnpublished || firstUnpublished.status !== 'deferred_asset_required')) {
    fail(errors, 'ledger must identify next_candidate unless the next contiguous source unit is deferred_asset_required');
  }
  for (let i = 1; i < next.length; i += 1) {
    if (next[i].sourceOrder !== next[i - 1].sourceOrder + 1) fail(errors, 'next_candidate entries must be sourceOrder continuous');
  }
  if (next.length && next[0].sourceOrder <= lastPublished) fail(errors, 'next_candidate must follow current published domain');
  const packageTargets = Array.from(new Set(entries.map((entry) => entry.packageTarget)));
  if (packageTargets.length < 2) fail(errors, 'ledger must not point all 699 lessons at one package target');
  const futureTargets = packageTargets.filter((target) => target !== 'packages/python-course');
  if (!futureTargets.length) fail(errors, 'ledger must reserve future package targets');
  const allCurrent = entries.every((entry) => entry.packageTarget === 'packages/python-course');
  if (allCurrent) fail(errors, 'all 699 lessons are assigned to current Python package');
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  const publicSummary = requireFresh(root, 'utils/python-public-course-summary.js', errors);
  const courseManifestModule = requireFresh(root, 'packages/python-course/data/python-course-manifest.js', errors);
  const ledgerModule = requireFresh(root, 'tools/python-full-course-release-ledger.js', errors);
  if (!sourceModule || !publicSummary || !courseManifestModule || !ledgerModule) return report(errors, warnings);
  const sourceManifest = sourceModule.pythonSourceManifest || sourceModule;
  const courseManifest = courseManifestModule.manifest || courseManifestModule;
  if (!ledgerModule.buildPythonFullCourseReleaseLedger) fail(errors, 'ledger tool missing buildPythonFullCourseReleaseLedger export');
  const ledger = ledgerModule.buildPythonFullCourseReleaseLedger ? ledgerModule.buildPythonFullCourseReleaseLedger(root) : {};
  ledger.ALLOWED_LEDGER_STATUSES = ledgerModule.ALLOWED_LEDGER_STATUSES;

  checkCoverage(sourceManifest, ledger, errors);
  const visibility = checkVisibility(sourceManifest, publicSummary, courseManifest, errors);
  checkEntries(sourceManifest, ledger, visibility.publicIds || [], visibility.manifestIds || [], errors);
  checkDomains(sourceManifest, ledger, errors);
  checkStatusAndTargets(ledger, errors);

  if (warnings.length) fail(errors, 'warnings are not allowed: ' + warnings.join('; '));
  return report(errors, warnings);
}

function report(errors, warnings) {
  if (errors.length || warnings.length) {
    console.error('[Python full-course ledger contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    warnings.forEach((warn) => console.error('WARNING:', warn));
    process.exit(1);
  }
  console.log('[Python full-course ledger contract] PASS: 0 errors, 0 warnings');
}

main();
