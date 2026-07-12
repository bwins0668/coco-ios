#!/usr/bin/env node
'use strict';

const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CURRENT_PACKAGE_TARGET = 'packages/python-course';
const TRAIN1_SHARD_TARGET = 'packages/python-course-foundations-b';
const SOFT_THRESHOLD_BYTES = 1 * 1024 * 1024;
const FUTURE_SHARD_PREFIX = 'future-python-content-shard';
const TRAIN1_SHARD_SOURCE_ORDERS = new Set([13, 14, 15]);
const ALLOWED_LEDGER_STATUSES = [
  'published',
  'next_candidate',
  'planned',
  'deferred_asset_required',
  'explicit_exclusion'
];

function parseArgs(argv) {
  const args = { root: ROOT, json: false };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      args.root = path.resolve(argv[i + 1]);
      i += 1;
    } else if (argv[i] === '--json') {
      args.json = true;
    }
  }
  return args;
}

function requireFresh(root, rel) {
  const file = path.join(root, rel);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function normalizeTocPath(value) {
  return Array.isArray(value) ? value.join(' > ') : String(value || '');
}

function parentRelation(unit) {
  if (!unit) return 'missing-source-unit';
  const parts = Array.isArray(unit.tocPath) ? unit.tocPath.slice(0, -1) : [];
  return parts.length ? parts.join(' > ') : 'root';
}

function parentKey(unit) {
  if (!unit) return 'missing-source-unit';
  if (unit.parentSourceUnitId) return unit.parentSourceUnitId;
  const parts = Array.isArray(unit.tocPath) ? unit.tocPath.slice(0, -1) : [];
  return parts.join(' > ') || 'root';
}

function topLevelChapter(unit) {
  return unit && unit.type === 'chapter' && (!unit.parentSourceUnitId || unit.depth <= 2);
}

function stableDomainSlug(index) {
  return String(index).padStart(4, '0');
}

function presetDomainKey(order) {
  if (order === 7) return 'python-gs1';
  if (order === 8) return 'python-gs2';
  if (order >= 9 && order <= 11) return 'python-domain1a';
  if (order === 12) return 'python-domain1b';
  if (order === 13) return 'r8-train1-input-while';
  if (order === 14) return 'r8-train1-functions';
  if (order === 15) return 'r8-train1-class';
  return null;
}

function isVisibleLesson(lesson, visibleIds) {
  return lesson.visibility === 'visible' || visibleIds.includes(lesson.courseLessonId);
}

function nextCandidateOrder(courseLessons, visibleIds) {
  const sorted = courseLessons.slice().sort((a, b) => a.sourceOrder - b.sourceOrder);
  const publishedOrders = sorted
    .filter((lesson) => isVisibleLesson(lesson, visibleIds))
    .map((lesson) => lesson.sourceOrder);
  const lastPublished = publishedOrders.length ? Math.max.apply(null, publishedOrders) : 0;
  const next = sorted.find((lesson) => lesson.sourceOrder > lastPublished && !isVisibleLesson(lesson, visibleIds));
  return next ? next.sourceOrder : null;
}

function likelyNeedsAssetDeferral(unit) {
  const text = normalizeTocPath(unit.tocPath) + ' ' + String(unit.displayTitle || '');
  return /项目|外星人|飞船|数据可视化|下载数据|使用API|Django|Web应用程序|图像|CSV|JSON|matplotlib|pygame|部署|文件和异常/i.test(text);
}

function ledgerStatusFor(lesson, unit, visibleIds, nextOrder) {
  if (isVisibleLesson(lesson, visibleIds)) return 'published';
  if (lesson.status === 'published') return 'published';
  if (likelyNeedsAssetDeferral(unit)) return 'deferred_asset_required';
  if (lesson.sourceOrder === nextOrder) return 'next_candidate';
  return 'planned';
}

function packageTargetForDomain(domainIndex, status) {
  if (status === 'published' || status === 'next_candidate') return CURRENT_PACKAGE_TARGET;
  if (domainIndex <= 12) return 'planned-python-foundations-continuation';
  const shardNumber = Math.floor((domainIndex - 13) / 24) + 1;
  return FUTURE_SHARD_PREFIX + '-' + String(shardNumber).padStart(2, '0');
}

function packageTargetForEntry(entry, domain) {
  if (entry.status === 'published' && TRAIN1_SHARD_SOURCE_ORDERS.has(entry.sourceOrder)) {
    return TRAIN1_SHARD_TARGET;
  }
  return packageTargetForDomain(domain.domainIndex, entry.status);
}

function canJoinGeneralDomain(current, entry, unit) {
  if (!current) return false;
  if (topLevelChapter(unit)) return false;
  if (current.lessonCount >= 5) return false;
  if (entry.sourceOrder !== current.lastSourceOrder + 1) return false;
  return parentKey(unit) === current.parentKey;
}

function assignDomainKeys(entries, unitsById) {
  let generalIndex = 1;
  let current = null;
  entries.forEach((entry) => {
    const unit = unitsById.get(entry.sourceUnitId);
    const preset = presetDomainKey(entry.sourceOrder);
    if (preset) {
      entry.releaseDomainKey = preset;
      current = null;
      return;
    }
    if (!canJoinGeneralDomain(current, entry, unit)) {
      current = {
        releaseDomainKey: 'python-full-domain-' + stableDomainSlug(generalIndex),
        parentKey: parentKey(unit),
        lessonCount: 0,
        lastSourceOrder: entry.sourceOrder
      };
      generalIndex += 1;
    }
    entry.releaseDomainKey = current.releaseDomainKey;
    current.lessonCount += 1;
    current.lastSourceOrder = entry.sourceOrder;
  });
}

function buildDomains(entries, unitsById) {
  const domainMap = new Map();
  entries.forEach((entry) => {
    if (!domainMap.has(entry.releaseDomainKey)) {
      domainMap.set(entry.releaseDomainKey, []);
    }
    domainMap.get(entry.releaseDomainKey).push(entry);
  });

  const domains = Array.from(domainMap.entries()).map(([key, domainEntries]) => {
    const sorted = domainEntries.slice().sort((a, b) => a.sourceOrder - b.sourceOrder);
    const units = sorted.map((entry) => unitsById.get(entry.sourceUnitId));
    const parents = Array.from(new Set(units.map(parentRelation)));
    const statuses = Array.from(new Set(sorted.map((entry) => entry.status)));
    let status = 'planned';
    if (statuses.length === 1) {
      status = statuses[0];
    } else if (statuses.includes('next_candidate')) {
      status = 'next_candidate';
    } else if (statuses.includes('published')) {
      status = 'published';
    } else if (statuses.every((item) => item === 'deferred_asset_required')) {
      status = 'deferred_asset_required';
    }
    return {
      domainKey: key,
      sourceOrderStart: sorted[0].sourceOrder,
      sourceOrderEnd: sorted[sorted.length - 1].sourceOrder,
      lessonCount: sorted.length,
      parent: parents.length === 1 ? parents[0] : parents.join(' / '),
      conceptTheme: conceptThemeFor(key, sorted, units),
      conceptContinuity: key === 'python-domain1a',
      continuityNote: key === 'python-domain1a' ? 'Chapters 3-5 form the accepted Domain1A bridge from list containers to conditional branching.' : '',
      releaseWave: releaseWaveFor(key, status),
      status,
      entryIds: sorted.map((entry) => entry.courseLessonId)
    };
  }).sort((a, b) => a.sourceOrderStart - b.sourceOrderStart);

  domains.forEach((domain, index) => {
    domain.domainIndex = index + 1;
    domain.packageTarget = packageTargetForDomain(domain.domainIndex, domain.status);
  });
  return domains;
}

function conceptThemeFor(key, entries, units) {
  if (key === 'python-gs1') return 'Visible script output';
  if (key === 'python-gs2') return 'Values, names, and variables';
  if (key === 'python-domain1a') return 'Core containers and branching foundations';
  if (key === 'python-domain1b') return 'Next contiguous source-mapped foundation domain';
  if (key === 'r8-train1-input-while') return 'Safe stdin input() + while loop';
  if (key === 'r8-train1-functions') return 'def function with parameter and return value';
  if (key === 'r8-train1-class') return 'class with __init__, self attributes, and method';
  if (!units[0]) return 'Missing source unit mapping';
  const parent = parentRelation(units[0]);
  if (entries.length === 1) return units[0].displayTitle || entries[0].courseLessonId;
  return parent + ' / ' + entries[0].tocPath.split(' > ').slice(-1)[0] + ' ... ' + entries[entries.length - 1].tocPath.split(' > ').slice(-1)[0];
}

function releaseWaveFor(key, status) {
  if (status === 'published') return 'released';
  if (status === 'next_candidate') return 'R8.PYTHON-FULL-P0-D1B';
  if (key === 'r8-train1-input-while' || key === 'r8-train1-functions' || key === 'r8-train1-class') return 'R8.PYTHON-SHARD-TRAIN1';
  if (status === 'deferred_asset_required') return 'future-sharding-or-asset-round';
  return 'future-controlled-release';
}

function buildPythonFullCourseReleaseLedger(root) {
  const sourceModule = requireFresh(root || ROOT, 'packages/python-course/data/python-source-manifest.js');
  const sourceManifest = sourceModule.pythonSourceManifest || sourceModule;
  const sourceUnits = sourceManifest.sourceUnits || [];
  const courseLessons = sourceManifest.courseLessons || [];
  const unitsById = new Map(sourceUnits.map((unit) => [unit.sourceUnitId, unit]));
  const visibleIds = ((sourceManifest.releaseVisibility || {}).visibleCourseLessonIds || []).slice();
  const nextOrder = nextCandidateOrder(courseLessons, visibleIds);

  const entries = courseLessons.slice()
    .sort((a, b) => a.sourceOrder - b.sourceOrder)
    .map((lesson) => {
      const unit = unitsById.get(lesson.sourceUnitId) || {};
      const status = ledgerStatusFor(lesson, unit, visibleIds, nextOrder);
      const isVisible = isVisibleLesson(lesson, visibleIds);
      return {
        sourceUnitId: lesson.sourceUnitId,
        courseLessonId: lesson.courseLessonId,
        sourceOrder: lesson.sourceOrder,
        tocPath: normalizeTocPath(unit.tocPath || lesson.originalTocPath),
        parentRelation: parentRelation(unit),
        type: unit.type || 'unknown',
        releaseDomainKey: '',
        releaseWave: '',
        status,
        packageTarget: packageTargetForDomain(1, status),
        publishedVisibility: isVisible ? 'public' : 'internal'
      };
    });

  assignDomainKeys(entries, unitsById);
  const domains = buildDomains(entries, unitsById);
  const domainByKey = new Map(domains.map((domain) => [domain.domainKey, domain]));
  entries.forEach((entry) => {
    const domain = domainByKey.get(entry.releaseDomainKey);
    entry.releaseWave = domain.releaseWave;
    entry.packageTarget = packageTargetForEntry(entry, domain);
  });

  const statusCounts = ALLOWED_LEDGER_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});
  entries.forEach((entry) => {
    statusCounts[entry.status] = (statusCounts[entry.status] || 0) + 1;
  });

  const explicitExclusions = sourceUnits
    .filter((unit) => unit.inclusion === 'explicit_exclusion')
    .map((unit) => ({
      sourceUnitId: unit.sourceUnitId,
      sourceOrder: unit.sourceOrder,
      tocPath: normalizeTocPath(unit.tocPath),
      type: unit.type,
      exclusionReason: unit.exclusionReason || ''
    }));

  return {
    schemaVersion: 1,
    generatedFrom: 'packages/python-course/data/python-source-manifest.js',
    packageScale: {
      currentPackageTarget: CURRENT_PACKAGE_TARGET,
      train1ShardTarget: TRAIN1_SHARD_TARGET,
      softThresholdBytes: SOFT_THRESHOLD_BYTES,
      hardThresholdSource: 'tools/audit_miniprogram_package_size.js PACKAGE_FAIL=1.8MB and HARD_LIMIT=2MB',
      futureShardPrefix: FUTURE_SHARD_PREFIX
    },
    coverage: {
      sourceUnits: sourceUnits.length,
      lessonCandidates: entries.length,
      parentGroups: sourceUnits.filter((unit) => unit.inclusion === 'parent_group_only').length,
      explicitExclusions: explicitExclusions.length
    },
    statusCounts,
    releaseDomains: domains,
    entries,
    explicitExclusions
  };
}

function main() {
  const args = parseArgs(process.argv);
  const ledger = buildPythonFullCourseReleaseLedger(args.root);
  if (args.json) {
    console.log(JSON.stringify(ledger, null, 2));
    return;
  }
  console.log('[Python full-course release ledger]');
  console.log('lesson candidates:', ledger.entries.length);
  console.log('domains:', ledger.releaseDomains.length);
  console.log('status counts:', JSON.stringify(ledger.statusCounts));
  console.log('package soft threshold bytes:', ledger.packageScale.softThresholdBytes);
}

if (require.main === module) main();

module.exports = {
  ALLOWED_LEDGER_STATUSES,
  CURRENT_PACKAGE_TARGET,
  SOFT_THRESHOLD_BYTES,
  TRAIN1_SHARD_TARGET,
  buildPythonFullCourseReleaseLedger,
  packageTargetForDomain
};
